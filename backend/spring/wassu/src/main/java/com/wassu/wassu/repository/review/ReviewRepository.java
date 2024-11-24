package com.wassu.wassu.repository.review;

import com.wassu.wassu.entity.review.ReviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {

    @Query("select re from ReviewEntity re " +
            "left join fetch re.user u " +
            "left join fetch re.images i " +
            "where re.id = :id")
    Optional<ReviewEntity> findByIdWithJoin(Long id);

    @Query("select count(r) from ReviewEntity r where r.touristSpot.id = :touristSpotId")
    Integer countByTouristSpotId(@Param("touristSpotId") Long touristSpotId);
}
