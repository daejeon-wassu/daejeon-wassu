package com.wassu.wassu.service.user;


import com.wassu.wassu.dto.article.ArticleResponseDTO;
import com.wassu.wassu.dto.user.UserArticleDetailDTO;
import com.wassu.wassu.entity.ArticleEntity;
import com.wassu.wassu.repository.article.ArticleRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@AllArgsConstructor
public class UserArticleService {

    private final ArticleRepository articleRepository;

    // 유저가 쓴 게시글 조회
    public List<UserArticleDetailDTO> getUserArticles(Long userId) {
        List<UserArticleDetailDTO> articles = new ArrayList<>();
        List<ArticleEntity> articleList = articleRepository.findByUser(userId);
        for (ArticleEntity article : articleList) {
            UserArticleDetailDTO articleResponseDTO = UserArticleDetailDTO.builder()
                    .id(article.getId())
                    .title(article.getTitle())
                    .content(article.getContent())
                    .liked(article.getLiked())
                    .viewCount(article.getViewCount())
                    .tags(article.getTags())
                    .images(article.getImages())
                    .createdAt(article.getCreatedAt())
                    .updatedAt(article.getUpdatedAt())
                    .build();
            articles.add(articleResponseDTO);
        }
        log.info("complete to get articles");
        return articles;
    }
}
