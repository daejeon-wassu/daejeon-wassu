package com.wassu.wassu.dto.touristspot;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@Builder
public class TouristSpotRecommendDTO {

    private String spotId;
    private String spotName;
    private String thumbnail;
    private String spotDescription;
    private String spotAddress;
    private int reviewCount;
    private int likeCount;

}
