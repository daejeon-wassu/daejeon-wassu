package com.wassu.wassu.dto.schedule;

import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
public class CreateScheduleDTO {

    private LocalDate startDate;
    private LocalDate endDate;
    private String title;
    private List<CreateDailyPlanDTO> dailyPlans;

}
