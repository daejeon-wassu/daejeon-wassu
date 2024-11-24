package com.wassu.wassu.dto.article;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ArticleLikeDTO {

    private String message;
    private int totalLikes;
    private boolean userLiked;

}
