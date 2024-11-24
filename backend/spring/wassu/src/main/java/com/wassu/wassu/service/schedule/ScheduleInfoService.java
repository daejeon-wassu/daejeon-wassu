package com.wassu.wassu.service.schedule;

import com.wassu.wassu.dto.schedule.DailyPlanDTO;
import com.wassu.wassu.dto.schedule.MyScheduleDTO;
import com.wassu.wassu.dto.schedule.ScheduleDTO;
import com.wassu.wassu.dto.schedule.ScheduleProfileDTO;
import com.wassu.wassu.dto.touristspot.TouristSpotDTO;
import com.wassu.wassu.entity.schedule.DailyPlanEntity;
import com.wassu.wassu.entity.schedule.PlanOrderEntity;
import com.wassu.wassu.entity.schedule.ScheduleEntity;
import com.wassu.wassu.entity.touristspot.TouristSpotEntity;
import com.wassu.wassu.exception.CustomErrorCode;
import com.wassu.wassu.exception.CustomException;
import com.wassu.wassu.repository.schedule.DailyPlanRepository;
import com.wassu.wassu.repository.schedule.PlanOrderRepository;
import com.wassu.wassu.repository.schedule.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ScheduleInfoService {

    private final ScheduleRepository scheduleRepository;
    private final PlanOrderRepository planOrderRepository;
    private final DailyPlanRepository dailyPlanRepository;

    public MyScheduleDTO findMyScheduleInfo(String email) {
        List<ScheduleEntity> schedules = scheduleRepository.findByUserEmail(email);
        MyScheduleDTO mySchedules = new MyScheduleDTO();
        List<ScheduleProfileDTO> upcomingSchedules = new ArrayList<>();
        List<ScheduleProfileDTO> pastSchedules = new ArrayList<>();

        for (ScheduleEntity schedule : schedules) {
            LocalDate startDate = schedule.getStartDate();
            LocalDate endDate = schedule.getEndDate();

            // 여행일정 상태 구분 (진행중/다가오는/지난)
            LocalDate today = LocalDate.now();

            if (endDate.isBefore(today)) { // 지난 여행
                ScheduleProfileDTO scheduleProfile = getScheduleProfileDTO(schedule, startDate, endDate);
                pastSchedules.add(scheduleProfile);
            } else if (startDate.isAfter(today)) { // 다가오는 여행
                ScheduleProfileDTO scheduleProfile = getScheduleProfileDTO(schedule, startDate, endDate);
                upcomingSchedules.add(scheduleProfile);
            } else { // 진행중인 여행
                ScheduleProfileDTO scheduleProfile = getScheduleProfileDTO(schedule, startDate, endDate);
                mySchedules.setOnGoingSchedules(scheduleProfile);
            }
            mySchedules.setUpcomingSchedules(upcomingSchedules);
            mySchedules.setPastSchedules(pastSchedules);
        }
        return mySchedules;
    }

    public ScheduleDTO findMyScheduleDetails(Long coursesId) {
        ScheduleEntity schedule = scheduleRepository.findById(coursesId).orElseThrow(() -> new CustomException(CustomErrorCode.SCHEDULE_NOT_FOUND));
        List<DailyPlanEntity> dailyPlans = dailyPlanRepository.findByScheduleId(coursesId);

        List<DailyPlanDTO> dailyPlanDTOS = new ArrayList<>();
        int day = 1;
        for (DailyPlanEntity dailyPlan : dailyPlans) {
            // 스케줄의 각 일정 dto 변환
            List<PlanOrderEntity> planOrders = dailyPlan.getPlanOrders();
            List<TouristSpotDTO> touristSpotDTOS = new ArrayList<>();
            for (PlanOrderEntity planOrder : planOrders) {
                // 일정의 각 관광지 dto 변환
                TouristSpotEntity spot = planOrder.getTouristSpot();
                TouristSpotDTO spotDTO = TouristSpotDTO.builder()
                        .spotId(spot.getElasticId())
                        .spotName(spot.getSpotName())
                        .spotAddress(spot.getSpotAddress()).build();
                touristSpotDTOS.add(spotDTO);
            }
            DailyPlanDTO dailyPlanDTO = new DailyPlanDTO(dailyPlan.getId(), day, dailyPlan.getDate().toString(), touristSpotDTOS);
            dailyPlanDTOS.add(dailyPlanDTO);
            day++;
        }
        return new ScheduleDTO(schedule.getId(), schedule.getTitle(), schedule.getStartDate().toString(), schedule.getEndDate().toString(), dailyPlanDTOS);
    }

    private ScheduleProfileDTO getScheduleProfileDTO(ScheduleEntity schedule, LocalDate startDate, LocalDate endDate) {
        return ScheduleProfileDTO.builder()
                .scheduleId(schedule.getId())
                .title(schedule.getTitle())
                .startDate(startDate.toString())
                .endDate(endDate.toString())
                .thumbnail(schedule.getThumbnail())
                .spotCount(planOrderRepository.countPlanOrders(schedule.getId())).build();
    }

}
