package com.wassu.wassu.dto.schedule;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class MyScheduleDTO {

    private ScheduleProfileDTO onGoingSchedules;
    private List<ScheduleProfileDTO> upcomingSchedules;
    private List<ScheduleProfileDTO> pastSchedules;

}
