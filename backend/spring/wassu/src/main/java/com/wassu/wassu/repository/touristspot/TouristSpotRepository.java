package com.wassu.wassu.repository.touristspot;

import com.wassu.wassu.dto.touristspot.TouristSpotDTO;
import com.wassu.wassu.entity.touristspot.TouristSpotEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TouristSpotRepository extends JpaRepository<TouristSpotEntity, Long> {

    @Query("select ts from TouristSpotEntity ts " +
            "left join fetch ts.reviews tr " +
            "where ts.elasticId=:id")
    Optional<TouristSpotEntity> findDetailById(String id);

    Optional<TouristSpotEntity> findByElasticId(String elasticId);

    @Query("select ts " +
            "from TouristSpotEntity ts " +
            "left join ReviewEntity r on ts.id = r.touristSpot.id " +
            "group by ts.id, ts.spotName, ts.spotAddress, ts.favoritesCount " +
            "order by (ts.favoritesCount + count (r.id)) desc")
    List<TouristSpotEntity> findAllWithScores();

    Optional<TouristSpotEntity> findBySpotName(String spotName);

}
