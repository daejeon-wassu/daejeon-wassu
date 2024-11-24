package com.wassu.wassu.repository.marble;

import com.wassu.wassu.entity.marble.NodeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface NodeRepository extends JpaRepository<NodeEntity, Long> {

    @Query("select n from NodeEntity n " +
            "left join fetch n.touristSpot t " +
            "left join fetch t.touristSpotImages ti " +
            "where n.id=:nodeId")
    Optional<NodeEntity> findByIdWithJoin(Long nodeId);

    @Query("select n from NodeEntity n " +
            "left join fetch n.touristSpot t " +
            "where n.id=:nodeId")
    Optional<NodeEntity> findByIdWithSpot(Long nodeId);

}
