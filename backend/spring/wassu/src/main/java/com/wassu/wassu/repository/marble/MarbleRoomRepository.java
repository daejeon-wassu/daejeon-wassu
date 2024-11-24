package com.wassu.wassu.repository.marble;

import com.wassu.wassu.entity.marble.MarbleRoomEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface MarbleRoomRepository extends JpaRepository<MarbleRoomEntity, Long> {

    @Query("select mr from MarbleRoomEntity mr " +
            "left join fetch mr.marble m " +
            "left join fetch m.nodes n " +
            "left join fetch n.touristSpot ts " +
            "left join fetch mr.creator c " +
            "where mr.id=:roomId order by n.nodeOrder asc")
    Optional<MarbleRoomEntity> findSingleRoomDetails(Long roomId);

    @Query("select mr from MarbleRoomEntity mr " +
            "left join fetch mr.marble m " +
            "left join fetch m.nodes n " +
            "left join fetch n.touristSpot ts " +
            "left join fetch mr.creator c " +
            "left join fetch mr.guest g " +
            "where mr.id=:roomId order by n.nodeOrder asc")
    Optional<MarbleRoomEntity> findMultiRoomDetails(Long roomId);

    @Query("select mr.single from MarbleRoomEntity mr where mr.id=:roomId")
    boolean isSingleRoom(Long roomId);

    @Query("select mr from MarbleRoomEntity mr " +
            "left join fetch mr.guest " +
            "left join fetch mr.creator " +
            "where mr.guest.email = :email or mr.creator.email = :email")
    MarbleRoomEntity findMyRoom(String email);

}
