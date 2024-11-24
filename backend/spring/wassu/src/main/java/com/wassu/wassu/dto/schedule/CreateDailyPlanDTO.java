package com.wassu.wassu.dto.schedule;

import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
public class CreateDailyPlanDTO {

    private LocalDate date;
    private List<String> spotIds;

}
