package com.wassu.wassu.dto.article;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.wassu.wassu.entity.ArticleEntity;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ArticleResponseDTO {
    private String id;
    private Long userId;
    private String nickName;
    private String profileImage;
    private String title;
    private String content;
    private String place;
    private List<ArticleEntity.Tag> tags;
    private List<ArticleEntity.Image> images;
    private Integer viewCount;
    private Integer liked;
    private boolean isUserLiked;
    private boolean isMatched;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
}
