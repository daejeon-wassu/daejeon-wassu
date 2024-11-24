package com.wassu.wassu.repository;

import com.wassu.wassu.entity.BlackListEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlackListRepository extends JpaRepository<BlackListEntity, Long> {
    boolean existsByToken(String token);
}
