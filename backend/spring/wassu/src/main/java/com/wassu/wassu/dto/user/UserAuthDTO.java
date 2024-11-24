package com.wassu.wassu.dto.user;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserAuthDTO {
    private String email;
    private String password;
}
