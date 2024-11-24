package com.wassu.wassu.entity.review;

import com.wassu.wassu.entity.UserEntity;
import com.wassu.wassu.entity.touristspot.TouristSpotEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Getter @Setter
@NoArgsConstructor
public class ReviewEntity {

    @Id @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String content;

    private int likeCount = 0;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_entity_id")
    private UserEntity user; // 작성자

    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReviewImageEntity> images = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "tourist_spot_entity_id")
    private TouristSpotEntity touristSpot;

    public ReviewEntity(String content) {
        this.content = content;
    }

    public void addUserAndSpot(UserEntity user, TouristSpotEntity touristSpot) {
        this.user = user;
        this.touristSpot = touristSpot;
        user.getReviews().add(this);
        touristSpot.getReviews().add(this);
    }

}
