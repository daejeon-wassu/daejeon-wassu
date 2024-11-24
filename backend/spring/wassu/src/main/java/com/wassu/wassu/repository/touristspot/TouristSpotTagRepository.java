package com.wassu.wassu.repository.touristspot;

import com.wassu.wassu.entity.touristspot.TouristSpotTagEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TouristSpotTagRepository extends JpaRepository<TouristSpotTagEntity, Long> {

    @Query("select tst from TouristSpotTagEntity tst " +
            "join fetch tst.touristSpot ts " +
            "where ts.elasticId=:touristId")
    List<TouristSpotTagEntity> findByTouristId(String touristId);

}
