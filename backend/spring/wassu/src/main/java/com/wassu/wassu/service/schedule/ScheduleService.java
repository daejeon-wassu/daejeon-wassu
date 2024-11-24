package com.wassu.wassu.service.schedule;

import com.wassu.wassu.dto.schedule.*;
import com.wassu.wassu.entity.UserEntity;
import com.wassu.wassu.entity.schedule.DailyPlanEntity;
import com.wassu.wassu.entity.schedule.PlanOrderEntity;
import com.wassu.wassu.entity.schedule.ScheduleEntity;
import com.wassu.wassu.entity.touristspot.TouristSpotEntity;
import com.wassu.wassu.entity.touristspot.TouristSpotImageEntity;
import com.wassu.wassu.exception.CustomErrorCode;
import com.wassu.wassu.exception.CustomException;
import com.wassu.wassu.repository.UserRepository;
import com.wassu.wassu.repository.schedule.DailyPlanRepository;
import com.wassu.wassu.repository.schedule.PlanOrderRepository;
import com.wassu.wassu.repository.schedule.ScheduleRepository;
import com.wassu.wassu.repository.touristspot.TouristSpotRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final DailyPlanRepository planRepository;
    private final UserRepository userRepository;
    private final TouristSpotRepository spotRepository;
    private final PlanOrderRepository planOrderRepository;

    public void createSchedule(String email, CreateScheduleDTO dto) {
        UserEntity user = userRepository.findByEmail(email).orElseThrow(() -> new CustomException(CustomErrorCode.USER_NOT_FOUND));
        // 새 일정 생성
        ScheduleEntity schedule = new ScheduleEntity(dto.getStartDate(), dto.getEndDate(), dto.getTitle(), user);
        ScheduleEntity savedSchedule = scheduleRepository.save(schedule);
        // 일일 계획 생성 후 일정에 추가
        List<CreateDailyPlanDTO> dailyPlans = dto.getDailyPlans();
        for (CreateDailyPlanDTO dailyPlan : dailyPlans) {
            // 일일 계획 생성
            DailyPlanEntity plan = new DailyPlanEntity(dailyPlan.getDate(), savedSchedule);
            DailyPlanEntity savedPlan = planRepository.save(plan);
            // 해당일 관광지 목록 추출 및 순서 지정
            List<String> spotIds = dailyPlan.getSpotIds();
            generatePlanOrders(spotIds, savedPlan, 0);
        }
        // 썸네일 생성
        createThumbnail(savedSchedule, dailyPlans);
    }

    public void updateSchedule(String email, Long coursesId, CreateScheduleDTO dto) {
        // 본인 아니면 수정 불가
        validateIsCreatorByCourseId(email, coursesId);
        scheduleRepository.deleteById(coursesId);
        createSchedule(email, dto);
    }

    public void updateScheduleTitle(String email, Long coursesId, UpdateScheduleTitleDTO dto) {
        // 본인 아니면 수정 불가
        ScheduleEntity schedule = validateIsCreatorByCourseId(email, coursesId);
        schedule.setTitle(dto.getTitle());
    }

    public void deleteSchedule(String email, Long courseId) {
        // 본인 외엔 삭제 불가
        validateIsCreatorByCourseId(email, courseId);
        scheduleRepository.deleteById(courseId);
    }

    private ScheduleEntity validateIsCreatorByCourseId(String email, Long coursesId) {
        UserEntity user = userRepository.findByEmail(email).orElseThrow(() -> new CustomException(CustomErrorCode.USER_NOT_FOUND));
        ScheduleEntity schedule = scheduleRepository.findById(coursesId).orElseThrow(() -> new CustomException(CustomErrorCode.SCHEDULE_NOT_FOUND));
        if (!schedule.getUser().equals(user)) {
            throw new CustomException(CustomErrorCode.PERMISSION_DENIED);
        }
        return schedule;
    }

    private void generatePlanOrders(List<String> spotIds, DailyPlanEntity savedPlan, int startOrder) {
        List<TouristSpotEntity> spotList = new ArrayList<>();
        if (spotIds != null && !spotIds.isEmpty()) {
            for (String spotId : spotIds) {
                TouristSpotEntity spot = spotRepository.findByElasticId(spotId).orElseThrow(() -> new CustomException(CustomErrorCode.TOURIST_NOT_FOUND));
                spotList.add(spot);
            }
            // 일일 계획에 관광지 추가
            int order = startOrder; // 관광지 순서
            for (TouristSpotEntity touristSpot : spotList) {
                PlanOrderEntity planOrder = new PlanOrderEntity(order, savedPlan, touristSpot);
                planOrderRepository.save(planOrder);
                order++;
            }
        }
    }

    private void createThumbnail(ScheduleEntity schedule, List<CreateDailyPlanDTO> plans) {
        String firstId = null;
        String thumbnail = null;
        if (plans != null && !plans.isEmpty()) {
            List<String> spotIds = plans.get(0).getSpotIds();
            if (spotIds != null && !spotIds.isEmpty()) {
                firstId = spotIds.get(0);
            }
        }
        if (firstId != null) {
            TouristSpotEntity firstSpot = spotRepository.findByElasticId(firstId).orElseThrow(() -> new CustomException(CustomErrorCode.TOURIST_NOT_FOUND));
            List<TouristSpotImageEntity> images = firstSpot.getTouristSpotImages();
            if (images != null && !images.isEmpty()) {
                thumbnail = images.get(0).getTouristSpotImageUrl();
            }
        }
        schedule.setThumbnail(thumbnail);
    }

}
