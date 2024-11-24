package com.wassu.wassu.repository.article;

import com.wassu.wassu.entity.ArticleEntity;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArticleRepository extends ElasticsearchRepository<ArticleEntity, String> {
    Optional<ArticleEntity> findById(String id);
    List<ArticleEntity> findByUser(Long userId);
}
