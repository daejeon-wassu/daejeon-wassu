package com.wassu.wassu.repository.course;

import com.wassu.wassu.entity.course.UserCourseProgressEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserCourseProgressRepository extends JpaRepository<UserCourseProgressEntity, Long> {
    List<UserCourseProgressEntity> findByUser_Id(Long id);

    List<UserCourseProgressEntity> findByUser_IdAndProgress(Long id, String progress);
}
