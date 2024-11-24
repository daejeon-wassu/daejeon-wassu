package com.wassu.wassu.entity.schedule;

import com.wassu.wassu.entity.UserEntity;
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
public class ScheduleEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate startDate;
    private LocalDate endDate;
    private String title;
    private String thumbnail; // 항상 첫번째 관광지의 이미지

    @ManyToOne
    @JoinColumn(name = "user_entity_id")
    private UserEntity user;

    @OneToMany(mappedBy = "schedule", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DailyPlanEntity> dailyPlans = new ArrayList<>();

    public ScheduleEntity(LocalDate staDate, LocalDate endDate, String title, UserEntity user) {
        this.startDate = staDate;
        this.endDate = endDate;
        this.title = title;
        this.user = user;
        user.getSchedules().add(this);
    }
}
