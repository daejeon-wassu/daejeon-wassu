package com.wassu.wassu.entity.review;

import com.wassu.wassu.entity.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter
@NoArgsConstructor
public class ReviewLikes {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "review_entity_id")
    private ReviewEntity review;
    @ManyToOne
    @JoinColumn(name = "user_entity_id")
    private UserEntity user;

    public ReviewLikes(ReviewEntity review, UserEntity user) {
        this.review = review;
        this.user = user;
    }
}
