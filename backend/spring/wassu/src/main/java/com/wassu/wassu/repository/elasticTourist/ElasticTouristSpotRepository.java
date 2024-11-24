package com.wassu.wassu.repository.elasticTourist;

import com.wassu.wassu.entity.ElasticTouristSpotEntity;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ElasticTouristSpotRepository extends ElasticsearchRepository<ElasticTouristSpotEntity, String> {
    Optional<ElasticTouristSpotEntity> findByTouristId(Long touristId);
}
