package com.wassu.wassu.entity.course;

import com.wassu.wassu.entity.touristspot.TouristSpotEntity;


import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class WassuMonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private Float height;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private Float weight;

    @Column(nullable = false)
    private String description;

    private String image;

    private String model;

    @OneToOne
    @JoinColumn(name = "spot_id")
    private TouristSpotEntity touristSpot;

    @OneToMany(mappedBy = "wassuMon", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CatchedWassuMonEntity> catchedWassuMons = new ArrayList<>();

}
