package com.wassu.wassu.eventListener;


import com.wassu.wassu.entity.touristspot.TouristSpotFavorites;
import com.wassu.wassu.service.elastic.ElasticsearchService;
import jakarta.persistence.PostPersist;
import jakarta.persistence.PostRemove;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class TouristSpotFavoriteEntityListener {
    private ElasticsearchService elasticsearchService;

}
