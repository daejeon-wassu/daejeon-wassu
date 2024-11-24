package com.wassu.wassu.service.article;

import com.wassu.wassu.dto.article.ArticleDTO;
import com.wassu.wassu.entity.ArticleEntity;
import com.wassu.wassu.entity.UserEntity;
import com.wassu.wassu.exception.CustomException;
import com.wassu.wassu.repository.article.ArticleRepository;
import com.wassu.wassu.repository.UserRepository;
import com.wassu.wassu.exception.CustomErrorCode;

import com.wassu.wassu.util.S3Util;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
@Slf4j
public class ArticleCreateService {

    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;
    private final S3Util s3Util;
    
    // 게시글 작성
    public String createArticle(String userEMail, ArticleDTO articleDTO, List<MultipartFile> imageFiles) {
        Optional<UserEntity> user = userRepository.findByEmail(userEMail);
        if (user.isPresent()) {
            try {
                log.info("Start to create article");
                Long userId = user.get().getId();
                ArticleEntity articleEntity = new ArticleEntity();
                articleEntity.setId(UUID.randomUUID().toString());
                articleEntity.setUser(userId);
                articleEntity.setTitle(articleDTO.getTitle());
                articleEntity.setContent(articleDTO.getContent());
                articleEntity.setPlace(articleDTO.getPlace());
                if (articleDTO.getTags() != null && !articleDTO.getTags().isEmpty()) {
                    List<ArticleEntity.Tag> tagEntities = articleDTO.getTags().stream()
                            .map(ArticleEntity.Tag::new)
                            .toList();
                    articleEntity.setTags(tagEntities);
                }
                if (imageFiles != null && !imageFiles.isEmpty()) {
                    List<ArticleEntity.Image> imageEntities = uploadImage(imageFiles).stream()
                            .map(ArticleEntity.Image::new)
                            .toList();
                    articleEntity.setImages(imageEntities);
                }

                try {
                    log.info("Ready to Save");
                    articleRepository.save(articleEntity);
                } catch (Exception e) {
                    log.error("Failed to Save Article");
                    throw new CustomException(CustomErrorCode.FAILED_TO_SAVE_ARTICLE);
                }
                log.info("End to create article");
                return articleEntity.getId();

            } catch (Exception e) {
                log.error("Failed to create article: ", e);
                throw new CustomException(CustomErrorCode.FAILED_TO_CREATE_ARTICLE);
            }
        } else {
            log.error("User Not Found While Creating Article");
            throw new CustomException(CustomErrorCode.USER_NOT_FOUND);
        }
    }
    
    // 게시글에 달리는 이미지 업로드
    private List<String> uploadImage(List<MultipartFile> imageFiles) {
        try {
            List<String> imageFileList = new ArrayList<>();
            for (MultipartFile imageFile : imageFiles) {
                String fileName = s3Util.uploadFile(imageFile, "article");
                imageFileList.add(fileName);
            }
            return imageFileList;
        } catch (Exception e) {
            log.error("Failed to upload image: ", e);
            throw new CustomException(CustomErrorCode.IMAGE_UPLOADING_FAILED);
        }
    }
}
