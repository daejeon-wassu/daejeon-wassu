package com.wassu.wassu.controller;

import com.wassu.wassu.dto.schedule.*;
import com.wassu.wassu.service.schedule.ScheduleInfoService;
import com.wassu.wassu.service.schedule.ScheduleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/wassu/courses")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;
    private final ScheduleInfoService scheduleInfoService;

    @PostMapping
    public ResponseEntity<?> createSchedule(@AuthenticationPrincipal String userEmail,
                                            @RequestBody CreateScheduleDTO dto) {
        scheduleService.createSchedule(userEmail, dto);
        return ResponseEntity.ok("Schedule created");
    }

    @PutMapping("/{coursesId}")
    public ResponseEntity<?> updateSchedule(@AuthenticationPrincipal String userEmail,
                                            @PathVariable Long coursesId,
                                            @RequestBody CreateScheduleDTO dto) {
        scheduleService.updateSchedule(userEmail, coursesId, dto);
        return ResponseEntity.ok("Schedule updated");
    }

    @PutMapping("/{coursesId}/title")
    public ResponseEntity<?> updateScheduleTitle(@AuthenticationPrincipal String userEmail,
                                                 @PathVariable Long coursesId,
                                                 @RequestBody UpdateScheduleTitleDTO dto) {
        scheduleService.updateScheduleTitle(userEmail, coursesId, dto);
        return ResponseEntity.ok("Schedule Title updated");
    }

    @DeleteMapping("/{coursesId}")
    public ResponseEntity<?> deleteSchedule(@AuthenticationPrincipal String userEmail,
                                            @PathVariable Long coursesId) {
        scheduleService.deleteSchedule(userEmail, coursesId);
        return ResponseEntity.ok("Schedule deleted");
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMySchedule(@AuthenticationPrincipal String userEmail) {
        MyScheduleDTO result = scheduleInfoService.findMyScheduleInfo(userEmail);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{coursesId}")
    public ResponseEntity<?> getMyScheduleDetails(@PathVariable Long coursesId) {
        ScheduleDTO result = scheduleInfoService.findMyScheduleDetails(coursesId);
        return ResponseEntity.ok(result);
    }

}
