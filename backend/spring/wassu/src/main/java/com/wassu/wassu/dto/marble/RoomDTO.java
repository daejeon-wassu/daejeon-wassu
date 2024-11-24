package com.wassu.wassu.dto.marble;

import com.wassu.wassu.dto.user.UserProfileDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
@Builder
public class RoomDTO {

    private Long roomId;
    private Long marbleId;
    private String marbleName;
    private boolean single;
    private List<NodeDTO> nodes;
    private UserProfileDTO you;
    private UserProfileDTO opponent;

}
