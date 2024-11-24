package com.wassu.wassu.config;


import com.wassu.wassu.entity.ArticleEntity;
import com.wassu.wassu.entity.ElasticTouristSpotEntity;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.stereotype.Component;

@Component
public class ElasticIndexConfig {

    @Autowired
    private ElasticsearchOperations elasticsearchOperations;

    @PostConstruct
    public void createIndexIfNotExist() {

        if (!elasticsearchOperations.indexOps(ElasticTouristSpotEntity.class).exists()) {
            elasticsearchOperations.indexOps(ElasticTouristSpotEntity.class).create();
            elasticsearchOperations.indexOps(ElasticTouristSpotEntity.class).putMapping();
        }

        if (!elasticsearchOperations.indexOps(ArticleEntity.class).exists()) {
            elasticsearchOperations.indexOps(ArticleEntity.class).create();
            elasticsearchOperations.indexOps(ArticleEntity.class).putMapping();
        }
    }
}
