package com.wassu.wassu.entity.marble;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
public class MarbleEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String marbleName;

    @OneToMany(mappedBy = "marble", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<NodeEntity> nodes = new ArrayList<>();

}
