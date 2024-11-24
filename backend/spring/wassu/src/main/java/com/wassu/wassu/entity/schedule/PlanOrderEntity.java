package com.wassu.wassu.entity.schedule;

import com.wassu.wassu.entity.touristspot.TouristSpotEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter
@NoArgsConstructor
public class PlanOrderEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int spotOrder; // 해당 관광지가 해당 일정의 몇번째 순서인지

    @ManyToOne
    @JoinColumn(name = "daily_plan_entity_id")
    private DailyPlanEntity dailyPlan;

    @ManyToOne
    @JoinColumn(name = "tourist_spot_entity_id")
    private TouristSpotEntity touristSpot;

    public PlanOrderEntity(int order, DailyPlanEntity dailyPlan, TouristSpotEntity touristSpot) {
        this.spotOrder = order;
        this.dailyPlan = dailyPlan;
        dailyPlan.getPlanOrders().add(this);
        this.touristSpot = touristSpot;
    }
}
