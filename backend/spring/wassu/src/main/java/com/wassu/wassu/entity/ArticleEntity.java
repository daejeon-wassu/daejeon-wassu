package com.wassu.wassu.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.data.elasticsearch.annotations.*;

@Data
@Document(indexName = "article")
@AllArgsConstructor
@NoArgsConstructor
@Setting(settingPath = "/nori_settings.json")
@JsonIgnoreProperties(ignoreUnknown = true)
public class ArticleEntity {
    @Id
    private String id;

    @Field(type=FieldType.Long)
    private Long user;

    @Field(type= FieldType.Text, analyzer = "nori_analyzer")
    private String title;

    @Field(type= FieldType.Text, analyzer = "nori_analyzer")
    private String content;

    @Field(type = FieldType.Text)
    private String place = null;

    @Field(type = FieldType.Nested)
    private List<Tag> tags = new ArrayList<>();

    @Field(type = FieldType.Nested)
    private List<Image> images = new ArrayList<>();

    @Field(type = FieldType.Integer)
    private Integer viewCount = 0;

    @Field(type = FieldType.Integer)
    private Integer liked = 0;

    @Field(type = FieldType.Date, format = DateFormat.date_hour_minute_second)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Field(type = FieldType.Date, format = DateFormat.date_hour_minute_second)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Tag {
        @Field(type = FieldType.Keyword)
        private String tag;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Image {
        @Field(type=FieldType.Text)
        private String url;
    }

}


