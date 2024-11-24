package com.wassu.wassu.repository.review;

import com.wassu.wassu.entity.review.ReviewLikes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReviewLikesRepository extends JpaRepository<ReviewLikes, Long> {

    boolean existsByReviewIdAndUserEmail(Long reviewId, String userEmail);

    Optional<ReviewLikes> findByReviewIdAndUserEmail(Long reviewId, String userEmail);

}
