package com.wassu.wassu.repository.article;

import com.wassu.wassu.entity.ArticleEntity;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface ArticleSearchRepository extends ElasticsearchRepository<ArticleEntity, String> {
    SearchHits<ArticleEntity> findByTitle(String title);
}
