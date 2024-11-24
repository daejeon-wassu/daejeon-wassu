package com.wassu.wassu.dto.marble;

import lombok.Getter;

@Getter
public class CreateRouteDTO {

    private String preference;
    private double start_lat;
    private double start_lon;
    private double end_lat;
    private double end_lon;

}
