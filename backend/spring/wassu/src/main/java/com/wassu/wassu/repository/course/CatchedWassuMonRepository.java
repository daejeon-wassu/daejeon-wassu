package com.wassu.wassu.repository.course;

import com.wassu.wassu.entity.course.CatchedWassuMonEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CatchedWassuMonRepository extends JpaRepository<CatchedWassuMonEntity, Long> {
    List<CatchedWassuMonEntity> findByUserId(Long userId);
}
