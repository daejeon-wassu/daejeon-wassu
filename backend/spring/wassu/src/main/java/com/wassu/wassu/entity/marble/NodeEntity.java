package com.wassu.wassu.entity.marble;

import com.wassu.wassu.entity.touristspot.TouristSpotEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class NodeEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int nodeOrder; // 관광지 번수 (순서)

    @ManyToOne
    @JoinColumn(name = "marble_entity_id")
    private MarbleEntity marble;

    @ManyToOne
    @JoinColumn(name = "tourist_spot_entity_id")
    private TouristSpotEntity touristSpot;

    public void insertToMarble(MarbleEntity marble) {
        this.marble = marble;
        marble.getNodes().add(this);
    }

}
