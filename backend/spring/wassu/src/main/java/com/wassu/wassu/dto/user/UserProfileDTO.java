package com.wassu.wassu.dto.user;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
public class UserProfileDTO {
    private String email;
    private String nickname;
    private Integer birthYear;
    private String gender;
    private String level;
    private Integer exp;
    private String profileImage;
}
