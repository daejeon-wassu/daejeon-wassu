package com.wassu.wassu.service.article;

import com.wassu.wassu.dto.article.ArticleLikeDTO;
import com.wassu.wassu.entity.ArticleEntity;
import com.wassu.wassu.entity.ArticleLikedEntity;
import com.wassu.wassu.entity.UserEntity;
import com.wassu.wassu.exception.CustomErrorCode;
import com.wassu.wassu.exception.CustomException;
import com.wassu.wassu.repository.UserRepository;
import com.wassu.wassu.repository.article.ArticleLikedRepository;
import com.wassu.wassu.repository.article.ArticleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ArticleLikeService {

    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;
    private final ArticleLikedRepository articleLikedRepository;

    public ArticleLikeDTO likeArticle(String email, String articleId) {
        ArticleEntity article = articleRepository.findById(articleId).orElseThrow(() -> new CustomException(CustomErrorCode.ARTICLE_NOT_FOUND));
        UserEntity user = userRepository.findByEmail(email).orElseThrow(() -> new CustomException(CustomErrorCode.USER_NOT_FOUND));
        // 게시글 중복 좋아요 불가
        if (articleLikedRepository.existsByArticleIdAndUserId(articleId, user.getId())) {
            throw new CustomException(CustomErrorCode.ALREADY_LIKED_ARTICLE);
        }
        // 좋아요 생성
        ArticleLikedEntity likes = new ArticleLikedEntity(user, articleId);
        articleLikedRepository.save(likes);
        Integer totalLikes = article.getLiked();
        // 게시글 좋아요 수 +1
        article.setLiked(totalLikes + 1);
        articleRepository.save(article);
        return new ArticleLikeDTO("Post successfully liked", totalLikes + 1, true);
    }

    public ArticleLikeDTO unlikeArticle(String email, String articleId) {
        ArticleEntity article = articleRepository.findById(articleId).orElseThrow(() -> new CustomException(CustomErrorCode.ARTICLE_NOT_FOUND));
        // 좋아요한 적 없는 게시글 취소 불가
        ArticleLikedEntity likes = articleLikedRepository.findByArticleIdAndUserEmail(articleId, email).orElseThrow(() -> new CustomException(CustomErrorCode.LIKE_NOT_FOUND));
        // 좋아요 삭제
        articleLikedRepository.delete(likes);
        Integer totalLikes = article.getLiked();
        // 게시글 좋아요 수 -1
        article.setLiked(totalLikes - 1);
        articleRepository.save(article);
        return new ArticleLikeDTO("Post successfully unliked", totalLikes - 1, false);
    }

}
