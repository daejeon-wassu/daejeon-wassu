package com.wassu.wassu.service.touristspot;

import com.wassu.wassu.dto.review.ReviewDTO;
import com.wassu.wassu.dto.review.ReviewImageDTO;
import com.wassu.wassu.dto.touristspot.*;
import com.wassu.wassu.dto.user.UserProfileDTO;
import com.wassu.wassu.entity.touristspot.TouristSpotEntity;
import com.wassu.wassu.entity.touristspot.TouristSpotFavorites;
import com.wassu.wassu.entity.UserEntity;
import com.wassu.wassu.entity.review.ReviewEntity;
import com.wassu.wassu.entity.touristspot.TouristSpotImageEntity;
import com.wassu.wassu.exception.CustomErrorCode;
import com.wassu.wassu.exception.CustomException;
import com.wassu.wassu.repository.UserRepository;
import com.wassu.wassu.repository.review.ReviewLikesRepository;
import com.wassu.wassu.repository.touristspot.TouristSpotFavoritesRepository;
import com.wassu.wassu.repository.touristspot.TouristSpotImageRepository;
import com.wassu.wassu.repository.touristspot.TouristSpotRepository;
import com.wassu.wassu.repository.touristspot.TouristSpotTagRepository;
import com.wassu.wassu.service.ReviewService;
import com.wassu.wassu.service.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class TouristSpotService {

    private final TouristSpotRepository touristSpotRepository;
    private final TouristSpotFavoritesRepository favoritesRepository;
    private final TouristSpotImageRepository imageRepository;
    private final TouristSpotTagRepository tagRepository;
    private final UserRepository userRepository;
    private final ReviewService reviewService;
    private final TouristSpotFavoritesRepository touristSpotFavoritesRepository;
    private final TouristSpotUtilService touristSpotUtilService;

    public TouristSpotDTO getTouristSpotDetails(String email, String spotId) {
        TouristSpotEntity spot = touristSpotRepository.findDetailById(spotId).orElseThrow(() -> new CustomException(CustomErrorCode.TOURIST_NOT_FOUND));

        List<TouristSpotImageDto> imageDto = Optional.ofNullable(imageRepository.findByTouristId(spotId))
                .orElse(Collections.emptyList()) // findByTouristId가 null이면 빈 리스트 반환
                .stream()
                .map(images -> new TouristSpotImageDto(images.getId(), images.getTouristSpotImageUrl()))
                .toList();

        List<TouristSpotTagDto> tagDto = tagRepository.findByTouristId(spotId).stream().map(tags -> new TouristSpotTagDto(tags.getId(), tags.getTag())).toList();
        List<ReviewEntity> reviews = spot.getReviews();

        boolean isFavorite = false;
        boolean isStamped = false;

        if (email != null) {
            UserEntity user = userRepository.findByEmail(email).orElseThrow(() -> new CustomException(CustomErrorCode.USER_NOT_FOUND));
            isFavorite = touristSpotFavoritesRepository.existsByTouristSpotIdAndUserId(spot.getId(), user.getId());
            isStamped = touristSpotUtilService.isStamped(spot.getId(), email);
        }
        List<ReviewDTO> reviewDto = reviewService.getReviewDTOS(email, reviews);
        return createTouristSpotDTO(spot, reviews, imageDto, isFavorite, isStamped, tagDto, reviewDto);
    }

    public TouristSpotFavoriteDTO touristSpotFavorite(String email, String spotId) {
        TouristSpotEntity spot = touristSpotRepository.findByElasticId(spotId).orElseThrow(() -> new CustomException(CustomErrorCode.TOURIST_NOT_FOUND));
        UserEntity user = userRepository.findByEmail(email).orElseThrow(() -> new CustomException(CustomErrorCode.USER_NOT_FOUND));
        // 장소 찜하기 중복 불가
        if (favoritesRepository.existsByTouristSpotIdAndUserId(spot.getId(), user.getId())) {
            throw new CustomException(CustomErrorCode.ALREADY_LIKED_TOURISTSPOT);
        }
        // 찜 추가
        TouristSpotFavorites favorites = new TouristSpotFavorites(spot, user);
        favoritesRepository.save(favorites);
        // 찜 수 +1
        int totalFavorites = spot.getFavoritesCount();
        spot.setFavoritesCount(totalFavorites + 1);

        return new TouristSpotFavoriteDTO("Spot successfully liked", totalFavorites + 1, true);
    }

    public TouristSpotFavoriteDTO touristSpotUnfavorite(String email, String spotId) {
        TouristSpotEntity spot = touristSpotRepository.findByElasticId(spotId).orElseThrow(() -> new CustomException(CustomErrorCode.TOURIST_NOT_FOUND));
        TouristSpotFavorites favorites = touristSpotFavoritesRepository.findByTouristSpotIdAndUserEmail(spot.getId(), email).orElseThrow(() -> new CustomException(CustomErrorCode.LIKE_NOT_FOUND));
        // 찜 삭제
        favoritesRepository.delete(favorites);
        // 찜 수 -1
        int totalFavorites = spot.getFavoritesCount();
        spot.setFavoritesCount(totalFavorites - 1);

        return new TouristSpotFavoriteDTO("Spot successfully unliked", totalFavorites - 1, false);
    }

    public List<TouristSpotRecommendDTO> recommendTouristSpot() {
        List<TouristSpotEntity> scores = touristSpotRepository.findAllWithScores();
        int top20PercentCount = (int) Math.ceil(scores.size() * 0.2);
        List<TouristSpotEntity> top20PercentSpots = scores.subList(0, top20PercentCount);
        Collections.shuffle(top20PercentSpots);
        List<TouristSpotEntity> list = top20PercentSpots.stream().limit(10).toList();
        List<TouristSpotRecommendDTO> recommendDTOS = new ArrayList<>();
        for (TouristSpotEntity spot : list) {
            String thumbnail = null;
            List<TouristSpotImageEntity> images = spot.getTouristSpotImages();
            if (images != null && !images.isEmpty()) {
                thumbnail = images.get(0).getTouristSpotImageUrl();
            }
            TouristSpotRecommendDTO dto = TouristSpotRecommendDTO.builder()
                    .spotId(spot.getElasticId())
                    .spotName(spot.getSpotName())
                    .thumbnail(thumbnail)
                    .spotDescription(spot.getSpotDescription())
                    .spotAddress(spot.getSpotAddress())
                    .likeCount(spot.getFavoritesCount())
                    .reviewCount(spot.getReviews().size()).build();
            recommendDTOS.add(dto);
        }
        return recommendDTOS;
    }

    public TouristSpotDTO createTouristSpotDTO(TouristSpotEntity spot, List<ReviewEntity> reviews, List<TouristSpotImageDto> imageDto, boolean isFavorite, boolean isStamped, List<TouristSpotTagDto> tagDto, List<ReviewDTO> reviewDto) {
        return TouristSpotDTO.builder()
                .spotId(spot.getElasticId())
                .spotName(spot.getSpotName())
                .spotAddress(spot.getSpotAddress())
                .favoritesCount(spot.getFavoritesCount())
                .reviewCount(reviews.size())
                .imageCount(imageDto.size())
                .phone(spot.getPhone())
                .businessHours(spot.getBusinessHours())
                .isFavorite(isFavorite)
                .isStamped(isStamped)
                .spotDescription(spot.getSpotDescription())
                .latitude(spot.getLatitude())
                .longitude(spot.getLongitude())
                .touristSpotTags(tagDto)
                .touristSpotImages(imageDto)
                .reviews(reviewDto)
                .build();
    }
}
