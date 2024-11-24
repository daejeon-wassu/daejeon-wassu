package com.wassu.wassu.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.annotations.Setting;

import java.util.ArrayList;
import java.util.List;

@Data
@Document(indexName = "elastic_tourist_spot")
@AllArgsConstructor
@NoArgsConstructor
@Setting(settingPath = "/spot_search_settings.json")
@JsonIgnoreProperties(ignoreUnknown = true)
public class ElasticTouristSpotEntity {
    @Id
    private String id;

    @Field(type= FieldType.Text, analyzer = "nori_analyzer", searchAnalyzer = "nori_analyzer")
    private String spotName;

    @Field(type= FieldType.Text, analyzer = "nori_analyzer", searchAnalyzer = "nori_analyzer")
    private String spotAddress;

    @Field(type = FieldType.Integer)
    private Integer liked = 0;

    @Field(type = FieldType.Integer)
    private Integer stamp = 0;

    @Field(type = FieldType.Text)
    private String spotDescription = null;

    @Field(type = FieldType.Text)
    private String phoneNumber = null;

    @Field(type = FieldType.Text)
    private String businessHour = null;

    @Field(type = FieldType.Double)
    private Double latitude = null;

    @Field(type = FieldType.Double)
    private Double longitude = null;

    @Field(type = FieldType.Nested)
    private List<Category> categories = new ArrayList<>();

    @Field(type = FieldType.Nested)
    private List<Image> images = new ArrayList<>();

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Category {
        @Field(type=FieldType.Keyword)
        private String category;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Image {
        @Field(type=FieldType.Text)
        private String image;
    }

}
