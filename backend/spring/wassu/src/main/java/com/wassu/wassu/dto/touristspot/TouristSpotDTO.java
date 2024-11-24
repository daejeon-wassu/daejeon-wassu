package com.wassu.wassu.dto.touristspot;

import com.wassu.wassu.dto.review.ReviewDTO;
import lombok.*;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TouristSpotDTO {

    private String spotId;
    private String spotName;
    private String spotAddress;
    private Float rating;
    private Integer userRatingsTotal;
    private int favoritesCount;
    private int reviewCount;
    private int imageCount;
    private boolean isFavorite;
    private boolean isStamped;
    private String phone;
    private String businessHours;
    private String spotDescription;
    private Double latitude;
    private Double longitude;
    private List<TouristSpotTagDto> touristSpotTags;
    private List<TouristSpotImageDto> touristSpotImages;
    private List<ReviewDTO> reviews;
    private String stampImageUrl;

}
