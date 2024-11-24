package com.wassu.wassu.dto.touristspot;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;


@Getter
@Builder
public class TouristSpotSearchDTO {
    private String searchText;
}
