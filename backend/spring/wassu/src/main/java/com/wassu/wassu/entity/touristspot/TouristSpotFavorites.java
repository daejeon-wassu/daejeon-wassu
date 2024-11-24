package com.wassu.wassu.entity.touristspot;

import com.wassu.wassu.entity.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter
@NoArgsConstructor
public class TouristSpotFavorites {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "tourist_spot_entity_id")
    private TouristSpotEntity touristSpot;

    @ManyToOne
    @JoinColumn(name = "user_entity_id")
    private UserEntity user;

    public TouristSpotFavorites(TouristSpotEntity touristSpot, UserEntity user) {
        this.touristSpot = touristSpot;
        this.user = user;
        user.getTouristSpotFavorites().add(this);
    }
}
