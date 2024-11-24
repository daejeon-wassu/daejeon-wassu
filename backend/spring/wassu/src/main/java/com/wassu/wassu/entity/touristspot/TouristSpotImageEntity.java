package com.wassu.wassu.entity.touristspot;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class TouristSpotImageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String touristSpotImageUrl;

    @ManyToOne
    @JoinColumn(name = "tourist_spot_entity_id")
    private TouristSpotEntity touristSpot;

}

