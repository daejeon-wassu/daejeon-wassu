package com.wassu.wassu.dto.touristspot;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TouristSpotFavoriteDTO {

    private String message;
    private int totalFavorites;
    private boolean userLiked;

}
