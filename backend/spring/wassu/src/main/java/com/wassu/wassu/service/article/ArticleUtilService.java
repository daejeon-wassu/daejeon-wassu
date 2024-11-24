package com.wassu.wassu.service.article;


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

import java.util.Optional;

@Service
@AllArgsConstructor
@Slf4j
public class ArticleUtilService {

    private final UserRepository userRepository;
    private final ArticleRepository articleRepository;
    private final S3Util s3Util;

    // 게시글 및 유저 매칭 확인
    // 살리기 -------------------------------
    public void checkArticleAndUser(String userEmail, String articleId) {
        Optional<ArticleEntity> optionalArticle = articleRepository.findById(articleId);
        if (optionalArticle.isPresent()) {
            ArticleEntity articleEntity = optionalArticle.get();
            Long userId = articleEntity.getUser();
            Optional<UserEntity> optionalUser = userRepository.findById(userId);
            if (optionalUser.isPresent() && optionalUser.get().getEmail().equals(userEmail)) {
                log.info("User has authorization to control this article");
            } else {
                log.error("User not authorized to control this article");
                throw new CustomException(CustomErrorCode.USER_NOT_AUTHORIZED_CONTROL_ARTICLE);
            }
        } else {
            log.error("Article not found");
            throw new CustomException(CustomErrorCode.ARTICLE_NOT_FOUND);
        }
    }
    
}

