package com.wassu.wassu.repository.schedule;

import com.wassu.wassu.entity.schedule.DailyPlanEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface DailyPlanRepository extends JpaRepository<DailyPlanEntity, Long> {

    @Query("select dp from DailyPlanEntity dp " +
            "join fetch dp.planOrders po " +
            "join fetch po.touristSpot ts " +
            "where dp.schedule.id=:scheduleId")
    List<DailyPlanEntity> findByScheduleId(Long scheduleId);

    @Query("select dp from DailyPlanEntity dp where dp.id=:planId")
    Optional<DailyPlanEntity> findByIdWithJoin(Long planId);

}
