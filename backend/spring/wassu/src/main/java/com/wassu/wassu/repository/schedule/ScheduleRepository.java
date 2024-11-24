package com.wassu.wassu.repository.schedule;

import com.wassu.wassu.entity.schedule.ScheduleEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ScheduleRepository extends JpaRepository<ScheduleEntity, Long> {

    @Query("select se from ScheduleEntity se join fetch se.dailyPlans dp where se.id = :id")
    Optional<ScheduleEntity> findByIdWithJoin(Long id);

    @Query("select se from ScheduleEntity se where se.user.email = :email")
    List<ScheduleEntity> findByUserEmail(String email);

}
