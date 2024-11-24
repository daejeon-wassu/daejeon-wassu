package com.wassu.wassu.dto.article;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArticleDTO {
    private String title;
    private String content;
    private List<String> tags;
    private String place;
}
