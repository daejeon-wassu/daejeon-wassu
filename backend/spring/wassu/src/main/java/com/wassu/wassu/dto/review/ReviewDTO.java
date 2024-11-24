package com.wassu.wassu.dto.review;

import com.wassu.wassu.dto.user.UserProfileDTO;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter
@Builder
public class ReviewDTO {

    private Long reviewId;
    private String content;
    private int likeCount;
    private UserProfileDTO profile;
    private List<ReviewImageDTO> reviewImages;
    private boolean isLiked;
    private String createdAt;

}
