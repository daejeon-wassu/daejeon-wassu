package com.wassu.wassu.entity.marble;

import com.wassu.wassu.entity.UserEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class MarbleRoomEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String inviteCode; // 초대 코드 -> 혼자면 없음
    @Builder.Default
    private boolean single = true; // 혼자 or 같이 여부

    @ManyToOne
    @JoinColumn(name = "marble_entity_id")
    private MarbleEntity marble;

    // 유저 1
    @ManyToOne
    @JoinColumn(name = "creator_id")
    private UserEntity creator;

    @Builder.Default
    private int creatorPosition = 0; // 유저1 말 위치
    @Builder.Default
    private boolean creatorVerified = false; // 유저1 장소인증 여부
    @Builder.Default
    private int creatorReroll = 1;
    @Builder.Default
    private int creatorPass = 1;

    // 유저 2 -> 혼자면 없음
    @ManyToOne
    @JoinColumn(name = "guest_id")
    private UserEntity guest;

    @Builder.Default
    private int guestPosition = 0; // 유저2 말 위치
    @Builder.Default
    private boolean guestVerified = false; // 유저2 장소인증 여부
    @Builder.Default
    private int guestReroll = 1;
    @Builder.Default
    private int guestPass = 1;

    @Builder.Default
    private boolean ready = true;

}
