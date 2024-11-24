package com.wassu.wassu.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClearedMarbleEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="user_entity_id", nullable = false)
    private UserEntity user;

    @Column(nullable = false)
    private LocalDateTime clearedAt;

    @Column(nullable = false)
    private Integer score;

    @OneToMany(mappedBy = "clearedMarble", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VisitedSpotEntity> vistedSpots;
}
