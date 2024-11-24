package com.wassu.wassu.repository.touristspot;

import com.wassu.wassu.entity.touristspot.TouristSpotImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TouristSpotImageRepository extends JpaRepository<TouristSpotImageEntity, Long> {

    @Query("select tsi from TouristSpotImageEntity tsi " +
            "join fetch tsi.touristSpot ts " +
            "where ts.elasticId=:touristId")
    List<TouristSpotImageEntity> findByTouristId(String touristId);

    @Query("select tsi from TouristSpotImageEntity tsi " +
            "join fetch tsi.touristSpot ts " +
            "where ts.id = :touristId")
    List<TouristSpotImageEntity> findByTouristSpotId(Long touristId);

}
