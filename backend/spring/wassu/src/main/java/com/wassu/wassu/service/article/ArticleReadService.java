package com.wassu.wassu.service.article;


import co.elastic.clients.elasticsearch._types.SortOptions;
import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.json.JsonData;
import com.wassu.wassu.dto.article.ArticleResponseDTO;
import com.wassu.wassu.entity.ArticleEntity;
import com.wassu.wassu.entity.UserEntity;
import com.wassu.wassu.exception.CustomErrorCode;
import com.wassu.wassu.exception.CustomException;
import com.wassu.wassu.repository.UserRepository;
import com.wassu.wassu.repository.article.ArticleLikedRepository;
import com.wassu.wassu.repository.article.ArticleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.client.elc.NativeQueryBuilder;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class ArticleReadService {

    private final ArticleRepository articleRepository;
    private final ArticleLikedRepository articleLikedRepository;
    private final UserRepository userRepository;
    private final ElasticsearchOperations elasticsearchOperations;;
    private final Random random = new Random();

    public ArticleResponseDTO searchById(String email, String articleId, Boolean isMatched) {
        boolean isUserLiked = false;
        if (email != null) {
            UserEntity requestUser = userRepository.findByEmail(email).orElseThrow(() -> new CustomException(CustomErrorCode.USER_NOT_FOUND));
            isUserLiked = articleLikedRepository.existsByArticleIdAndUserId(articleId, requestUser.getId());
        }
        try {
            Optional<ArticleEntity> optionalArticle = articleRepository.findById(articleId);;
            if (optionalArticle.isPresent()) {
                log.info("Start to Search Article");
                ArticleEntity article = optionalArticle.get();
                Long userId = ((Number) article.getUser()).longValue();
                UserEntity user = userRepository.findById(userId).orElse(null);
                return createArticelResposneDTO(isMatched, article, userId, user, isUserLiked);
            } else {
                log.error("Article not found");
                return null;
            }
        } catch(Exception e) {
            log.error("Error occurred while searching article by id: {}", articleId, e);
            throw new CustomException(CustomErrorCode.ERROR_WHILE_READ_ARTICLE);
        }
    }

    public List<ArticleResponseDTO> getRecommendArticle(String email) {
        // 최근 일주일간의 게시글 조회 쿼리 작성
        NativeQuery recentArticlesQuery = getRecentArticlesQuery();

        // 쿼리를 실행하여 최근 일주일간 조회수 순으로 정렬된 게시글 목록을 가져옴
        SearchHits<ArticleEntity> searchHits = elasticsearchOperations.search(recentArticlesQuery, ArticleEntity.class);
        List<ArticleEntity> recentArticles = searchHits.stream().map(SearchHit::getContent).toList();

        // 상위 20% 게시글 필터링
        int top20PercentIndex = (int) Math.ceil(recentArticles.size() * 0.2);
        List<ArticleEntity> top20PercentArticles = recentArticles.stream()
                .limit(top20PercentIndex).toList();

        // 결과가 2개 이하면 바로 반환
        if (top20PercentArticles.size() <= 2) {
            return createRecommendResponse(email, top20PercentArticles);
        }

        // 상위 20% 게시글 중 랜덤하게 2개 선택
        List<ArticleEntity> articles = random.ints(0, top20PercentArticles.size())
                .distinct()
                .limit(2)
                .mapToObj(top20PercentArticles::get).toList();
        return createRecommendResponse(email, articles);
    }

    public Boolean isMatchWithArticleOwner(String tokenEmail, String articleId) {
        Optional<UserEntity> optionalTokenUser = userRepository.findByEmail(tokenEmail);
        if (optionalTokenUser.isPresent()) {
            Long tokenUserId = optionalTokenUser.get().getId();
            Optional<ArticleEntity> optionalArticle = articleRepository.findById(articleId);
            if (optionalArticle.isPresent()) {
                ArticleEntity article = optionalArticle.get();
                Long articleOwnerId = ((Number) article.getUser()).longValue();
                if (articleOwnerId.equals(tokenUserId)) {
                    log.info("Article owner matched");
                    return true;
                }
                else {
                    log.info("Article owner did not match");
                    return false;
                }
            } else {
                log.error("Article not found");
                return false;
            }

        } else {
            log.error("Token not found");
            return false;
        }
    }

    private static NativeQuery getRecentArticlesQuery() {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
        String formattedDate = oneWeekAgo.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);

        return new NativeQueryBuilder()
                .withQuery(q -> q
                        .bool(b -> b
                                .must(m -> m
                                        .range(r -> r
                                                .field("createdAt")
                                                .gte(JsonData.fromJson(formattedDate))
                                        )
                                )
                        )
                )
                .withSort(Sort.by(Sort.Order.desc("viewCount")))
                .build();
    }

    private List<ArticleResponseDTO> createRecommendResponse(String email, List<ArticleEntity> top20PercentArticles) {
        List<ArticleResponseDTO> recommendArticles = new ArrayList<>();
        for (ArticleEntity article : top20PercentArticles) {
            Boolean isMatch = false;
            boolean isLiked = false;
            if (email != null) {
                UserEntity my = userRepository.findByEmail(email).orElseThrow(() -> new CustomException(CustomErrorCode.USER_NOT_FOUND));
                isMatch = isMatchWithArticleOwner(email, article.getId());
                isLiked = articleLikedRepository.existsByArticleIdAndUserId(article.getId(), my.getId());
            }
            Long userId = article.getUser();
            UserEntity user = userRepository.findById(userId).orElseThrow(() -> new CustomException(CustomErrorCode.USER_NOT_FOUND));
            ArticleResponseDTO dto = createArticelResposneDTO(isMatch, article, userId, user, isLiked);
            recommendArticles.add(dto);
        }
        return recommendArticles;
    }

    private static ArticleResponseDTO createArticelResposneDTO(Boolean isMatched, ArticleEntity article, Long userId, UserEntity user, boolean isUserLiked) {
        return ArticleResponseDTO.builder()
                .id(article.getId())
                .userId(userId)
                .nickName(Objects.requireNonNull(user).getNickname())
                .profileImage(Objects.requireNonNull(user).getProfileImage())
                .title(article.getTitle())
                .content(article.getContent())
                .tags(article.getTags())
                .place(article.getPlace())
                .images(article.getImages())
                .viewCount(article.getViewCount())
                .liked(article.getLiked())
                .isUserLiked(isUserLiked)
                .isMatched(isMatched)
                .createdAt(article.getCreatedAt())
                .updatedAt(article.getUpdatedAt())
                .build();
    }
}
