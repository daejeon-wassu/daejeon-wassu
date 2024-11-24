package com.wassu.wassu.entity;

import com.wassu.wassu.entity.touristspot.TouristSpotEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VisitedSpotEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

//    @Column(nullable = false)
//    private String spotId;

    @ManyToOne
    @JoinColumn(name="spot_entity_id", nullable = false)
    private TouristSpotEntity touristSpot;

    @ManyToOne
    @JoinColumn(name="user_entity_id", nullable = false)
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name="cleared_marble_entity_id", nullable = true)
    private ClearedMarbleEntity clearedMarble;

    @Column(length = 200)
    private String review;

    @Column(nullable = false)
    private LocalDateTime visitedAt;
}
