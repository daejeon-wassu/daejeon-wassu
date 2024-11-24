package com.wassu.wassu.dto.marble;

import lombok.*;

@Getter @Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SseDTO {

    private boolean ready;

    private int yourPosition;
    private boolean yourVerified;
    private int yourReroll;
    private int yourPass;

    private int opponentPosition;
    private boolean opponentVerified;
    private int opponentReroll;
    private int opponentPass;

    private int dice1;
    private int dice2;

}
