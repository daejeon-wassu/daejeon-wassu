package com.wassu.wassu.service;

import com.wassu.wassu.dto.review.ReviewCreateDTO;
import com.wassu.wassu.dto.review.ReviewDTO;
import com.wassu.wassu.dto.review.ReviewImageDTO;
import com.wassu.wassu.dto.review.ReviewUpdateDTO;
import com.wassu.wassu.dto.user.UserProfileDTO;
import com.wassu.wassu.entity.review.ReviewEntity;
import com.wassu.wassu.entity.UserEntity;
import com.wassu.wassu.entity.review.ReviewImageEntity;
import com.wassu.wassu.entity.review.ReviewLikes;
import com.wassu.wassu.entity.touristspot.TouristSpotEntity;
import com.wassu.wassu.exception.CustomErrorCode;
import com.wassu.wassu.exception.CustomException;
import com.wassu.wassu.repository.review.ReviewImageRepository;
import com.wassu.wassu.repository.review.ReviewLikesRepository;
import com.wassu.wassu.repository.review.ReviewRepository;
import com.wassu.wassu.repository.UserRepository;
import com.wassu.wassu.repository.touristspot.TouristSpotRepository;
import com.wassu.wassu.service.user.UserService;
import com.wassu.wassu.util.S3Util;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ReviewImageRepository reviewImageRepository;
    private final ReviewLikesRepository reviewLikesRepository;
    private final TouristSpotRepository spotRepository;

    private final UserService userService;
    private final S3Util s3Util;

    public void createReview(String email, String spotId, List<MultipartFile> images, ReviewCreateDTO dto) {
        UserEntity user = userRepository.findByEmail(email).orElseThrow(() -> new CustomException(CustomErrorCode.USER_NOT_FOUND));
        TouristSpotEntity spot = spotRepository.findByElasticId(spotId).orElseThrow(() -> new CustomException(CustomErrorCode.TOURIST_NOT_FOUND));
        ReviewEntity review = new ReviewEntity(dto.getContent());
        review.addUserAndSpot(user, spot);
        ReviewEntity savedReview = reviewRepository.save(review);
        // 이미지 업로드
        uploadReviewImages(images, savedReview);
    }

    public void updateReview(String email, List<MultipartFile> images, ReviewUpdateDTO dto, Long reviewId) {
        ReviewEntity review = reviewRepository.findById(reviewId).orElseThrow(() -> new CustomException(CustomErrorCode.REVIEW_NOT_FOUND));
        // 본인 이외엔 수정 불가
        if (!email.equals(review.getUser().getEmail())) {
            throw new CustomException(CustomErrorCode.USER_NOT_AUTHORIZED_CONTROL_REVIEW);
        }
        // 리뷰 내용 수정
        review.setContent(dto.getContent());
        // 삭제 이미지 목록
        List<Long> deleteImageIds = dto.getDeleteImages();
        if (deleteImageIds != null && !deleteImageIds.isEmpty()) {
            List<ReviewImageEntity> deleteImages = deleteImageIds.stream()
                    .map(id -> reviewImageRepository.findById(id)
                    .orElseThrow(() -> new CustomException(CustomErrorCode.REVIEW_IMAGE_NOT_FOUND))).toList();
            // 이미지 삭제
            for (ReviewImageEntity deleteImage : deleteImages) {
                s3Util.deleteFile(deleteImage.getImageUrl());
                reviewImageRepository.delete(deleteImage);
            }
        }
        // 새 이미지 업로드
        uploadReviewImages(images, review);
    }

    public ReviewDTO findReviewById(String email, Long reviewId) {
        ReviewEntity review = reviewRepository.findByIdWithJoin(reviewId).orElseThrow(() -> new CustomException(CustomErrorCode.REVIEW_NOT_FOUND));
        // 작성자 프로필
        UserEntity user = review.getUser();
        UserProfileDTO profile = userService.convertToDTO(user);
        // 리뷰 이미지 정보
        List<ReviewImageDTO> reviewImages = review.getImages().stream()
                .map(image -> new ReviewImageDTO(image.getId(), image.getImageUrl())).toList();
        // dto 변환
        return ReviewDTO.builder()
                .reviewId(reviewId)
                .content(review.getContent())
                .likeCount(review.getLikeCount())
                .profile(profile)
                .reviewImages(reviewImages)
                .isLiked(reviewLikesRepository.existsByReviewIdAndUserEmail(reviewId, email))
                .createdAt(review.getCreatedAt().toString()).build();
    }

    public void deleteReview(String email, Long reviewId) {
        ReviewEntity review = reviewRepository.findByIdWithJoin(reviewId).orElseThrow(() -> new CustomException(CustomErrorCode.REVIEW_NOT_FOUND));
        // 본인 이외엔 삭제 불가
        if (!email.equals(review.getUser().getEmail())) {
            throw new CustomException(CustomErrorCode.USER_NOT_AUTHORIZED_CONTROL_REVIEW);
        }
        // s3에서도 이미지 삭제
        review.getImages().forEach(image -> s3Util.deleteFile(image.getImageUrl()));
        reviewRepository.delete(review);
    }

    public void likesReview(String email, Long reviewId) {
        ReviewEntity review = reviewRepository.findById(reviewId).orElseThrow(() -> new CustomException(CustomErrorCode.REVIEW_NOT_FOUND));
        UserEntity user = userRepository.findByEmail(email).orElseThrow(() -> new CustomException(CustomErrorCode.USER_NOT_FOUND));
        // 이미 좋아요 했으면 또 못함
        if (reviewLikesRepository.existsByReviewIdAndUserEmail(reviewId, email)) {
            throw new CustomException(CustomErrorCode.ALREADY_LIKED_REVIEW);
        }
        // 좋아요 생성
        ReviewLikes likes = new ReviewLikes(review, user);
        reviewLikesRepository.save(likes);
        // 해당 후기 좋아요 수 +1
        review.setLikeCount(review.getLikeCount()+1);
    }

    public void unlikesReview(String email, Long reviewId) {
        ReviewEntity review = reviewRepository.findById(reviewId).orElseThrow(() -> new CustomException(CustomErrorCode.REVIEW_NOT_FOUND));
        ReviewLikes likes = reviewLikesRepository.findByReviewIdAndUserEmail(reviewId, email).orElseThrow(() -> new CustomException(CustomErrorCode.LIKE_NOT_FOUND));
        // 좋아요 삭제
        reviewLikesRepository.delete(likes);
        // 해당 후기 좋아요 수 -1
        review.setLikeCount(review.getLikeCount()-1);
    }

    // 이미지 목록 업로드
    private void uploadReviewImages(List<MultipartFile> images, ReviewEntity savedReview) {
        if (images != null && !images.isEmpty()) {
            for (MultipartFile image : images) {
                String url = s3Util.uploadFile(image, "review");
                ReviewImageEntity reviewImage = new ReviewImageEntity(url);
                reviewImage.addReview(savedReview);
                reviewImageRepository.save(reviewImage);
            }
        }
    }

    public List<ReviewDTO> getReviewDTOS(String email, List<ReviewEntity> reviews) {
        List<ReviewDTO> reviewDto = new ArrayList<>();
        if (reviews != null && !reviews.isEmpty()) {
            for (ReviewEntity review : reviews) {
                boolean isLiked = false;
                if (email != null) {
                    isLiked = reviewLikesRepository.existsByReviewIdAndUserEmail(review.getId(), email);
                }
                UserEntity user = review.getUser();
                List<ReviewImageDTO> reviewImages = review.getImages().stream()
                        .map(image -> new ReviewImageDTO(image.getId(), image.getImageUrl())).toList();
                UserProfileDTO profile = userService.convertToDTO(user);
                ReviewDTO dto = ReviewDTO.builder()
                        .reviewId(review.getId())
                        .content(review.getContent())
                        .likeCount(review.getLikeCount())
                        .isLiked(isLiked)
                        .profile(profile)
                        .reviewImages(reviewImages)
                        .createdAt(review.getCreatedAt().toString()).build();
                reviewDto.add(dto);
            }
        }
        return reviewDto;
    }

}
