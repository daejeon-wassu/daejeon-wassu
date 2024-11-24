package com.wassu.wassu.entity.touristspot;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class TouristSpotTagEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private String tag;

    @ManyToOne
    @JoinColumn(name="tourist_spot_entity_id", nullable=false)
    private TouristSpotEntity touristSpot;

}

