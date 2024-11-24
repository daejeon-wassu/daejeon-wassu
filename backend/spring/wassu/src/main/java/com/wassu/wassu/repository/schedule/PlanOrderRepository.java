package com.wassu.wassu.repository.schedule;

import com.wassu.wassu.entity.schedule.PlanOrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface PlanOrderRepository extends JpaRepository<PlanOrderEntity, Long> {

    @Modifying
    @Query("delete from PlanOrderEntity po where po.dailyPlan.id=:planId")
    void deleteByPlanId(Long planId);

    @Query("select po.spotOrder from PlanOrderEntity po " +
            "where po.dailyPlan.id = :planId and po.spotOrder = (select max(po.spotOrder) " +
                                                                "from PlanOrderEntity po " +
                                                                "where po.dailyPlan.id = :planId)")
    int findMaxOrderValue(Long planId);

    @Modifying
    @Query("delete from PlanOrderEntity po where po.dailyPlan.id=:planId and po.touristSpot.id=:spotId")
    void deleteByPlanIdAndSpotId(Long planId, Long spotId);

    @Query("select COUNT(po) from PlanOrderEntity po " +
            "where po.dailyPlan.schedule.id=:scheduleId")
    int countPlanOrders(Long scheduleId);

}
