package com.wassu.wassu.entity.touristspot;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TouristSpotCourseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="preset", nullable = false)
    private TouristSpotPresetEntity preset;

    @Column(nullable = false)
    private String spotName;

    @Column(nullable = false)
    private Integer sequence;
}
