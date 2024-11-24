package com.wassu.wassu.dto.user;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
public class UserSignupDTO {
    private String email;
    private String password;
    private String nickname;
    private String gender;
    private Integer birthYear;
    private String level;
    private Integer exp;
}
