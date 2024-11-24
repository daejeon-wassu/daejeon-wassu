package com.wassu.wassu.dto.marble;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class NodeDTO {

    private Long nodeId;
    private Long spotId;
    private String spotName;
    private String thumbnail;
    private int nodeOrder;

}
