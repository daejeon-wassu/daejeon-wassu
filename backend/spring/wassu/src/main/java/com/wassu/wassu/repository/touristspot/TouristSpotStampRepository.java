package com.wassu.wassu.repository.touristspot;

import com.wassu.wassu.entity.touristspot.TouristSpotEntity;
import com.wassu.wassu.entity.touristspot.TouristSpotStampEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TouristSpotStampRepository extends JpaRepository<TouristSpotStampEntity, Long> {
    Optional<TouristSpotStampEntity> findByUserIdAndElasticSpotId(Long userId, String touristSpotId);
    List<TouristSpotStampEntity> findByUserId(Long userId);
}
