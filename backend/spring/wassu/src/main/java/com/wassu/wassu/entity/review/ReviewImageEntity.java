package com.wassu.wassu.entity.review;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Getter @Setter
@NoArgsConstructor
public class ReviewImageEntity {

    @Id @GeneratedValue(strategy = IDENTITY)
    private Long id;

    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "review_entity_id")
    private ReviewEntity review;

    public ReviewImageEntity(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void addReview(ReviewEntity review) {
        this.review = review;
        review.getImages().add(this);
    }

}
