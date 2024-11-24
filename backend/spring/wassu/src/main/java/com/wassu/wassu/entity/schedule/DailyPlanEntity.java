package com.wassu.wassu.entity.schedule;

import com.wassu.wassu.entity.touristspot.TouristSpotEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
@NoArgsConstructor
public class DailyPlanEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "schedule_entity_id")
    private ScheduleEntity schedule;

    @OneToMany(mappedBy = "dailyPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PlanOrderEntity> planOrders = new ArrayList<>();

    public DailyPlanEntity(LocalDate date, ScheduleEntity schedule) {
        this.date = date;
        this.schedule = schedule;
        schedule.getDailyPlans().add(this);
    }
}
