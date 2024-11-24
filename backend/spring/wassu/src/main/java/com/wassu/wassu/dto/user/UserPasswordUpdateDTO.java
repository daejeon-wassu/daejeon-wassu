package com.wassu.wassu.dto.user;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserPasswordUpdateDTO {
    private String currentPassword;
    private String newPassword;
}
