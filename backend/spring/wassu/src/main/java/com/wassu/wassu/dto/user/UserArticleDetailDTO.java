package com.wassu.wassu.dto.user;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.wassu.wassu.entity.ArticleEntity;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@Getter
@Setter
@Builder
@NoArgsConstructor
public class UserArticleDetailDTO {
    private String id;
    private String title;
    private String content;
    private Integer liked;
    private Integer viewCount;
    private List<ArticleEntity.Tag> tags;
    private List<ArticleEntity.Image> images;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
}
