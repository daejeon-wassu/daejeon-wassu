package com.wassu.wassu.dto.schedule;

import com.wassu.wassu.dto.touristspot.TouristSpotDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
@AllArgsConstructor
public class DailyPlanDTO {

    private Long planId;
    private int day;
    private String date;
    List<TouristSpotDTO> touristSpots;

}
