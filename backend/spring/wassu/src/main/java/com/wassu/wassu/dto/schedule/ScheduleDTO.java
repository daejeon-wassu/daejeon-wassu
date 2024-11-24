package com.wassu.wassu.dto.schedule;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
@AllArgsConstructor
public class ScheduleDTO {

    private Long scheduleId;
    private String title;
    private String startDate;
    private String endDate;
    private List<DailyPlanDTO> dailyPlans;

}
