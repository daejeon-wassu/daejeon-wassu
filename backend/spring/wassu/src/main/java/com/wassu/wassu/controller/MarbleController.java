package com.wassu.wassu.controller;

import com.wassu.wassu.dto.marble.*;
import com.wassu.wassu.security.JwtUtil;
import com.wassu.wassu.service.marble.CreateRouteService;
import com.wassu.wassu.service.marble.MarbleService;
import com.wassu.wassu.service.marble.SseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/wassu/marble")
@RequiredArgsConstructor
public class MarbleController {

    private final MarbleService marbleService;
    private final SseService sseService;
    private final CreateRouteService routeService;
    private final JwtUtil jwtUtil;

    // 마블 목록 조회
    @GetMapping
    public ResponseEntity<?> getMarbles() {
        List<MarbleDTO> result = marbleService.getMarbles();
        return ResponseEntity.ok(Map.of("data", result));
    }

    // 테마보드 선택 및 방 생성
    @PostMapping("/{marbleId}")
    public ResponseEntity<?> createMarble(@RequestHeader(value="Authorization", required = false) String accessToken,
                                          @PathVariable Long marbleId,
                                          @RequestBody CreateRoomDTO dto) {
        String userEmail = null;
        if (accessToken != null) {
            String token = accessToken.replace("Bearer ", "");
            userEmail = jwtUtil.extractUserEmail(token);
        }
        InviteRoomDTO result = marbleService.createMarble(marbleId, userEmail, dto);
        return ResponseEntity.ok(result);
    }

    // 맞춤보드 생성
    @PostMapping("/route")
    public ResponseEntity<?> createMarbleRoot(@RequestHeader(value="Authorization", required = false) String accessToken,
                                              @RequestParam boolean single, @RequestBody CreateRouteDTO dto) {
        InviteRoomDTO result = routeService.createMarbleRoot(accessToken, dto, single);
        return ResponseEntity.ok(result);
    }

    // SSE 연결
    @GetMapping(value = "/room/{roomId}/sync", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter connect(@RequestHeader(value="Authorization", required = false) String accessToken,
                              @PathVariable Long roomId) {
        String userEmail = null;
        if (accessToken != null) {
            String token = accessToken.replace("Bearer ", "");
            userEmail = jwtUtil.extractUserEmail(token);
        }
        return sseService.createEmitter(userEmail, roomId);
    }

    // 방 입장
    @PostMapping("/room/join")
    public ResponseEntity<?> joinRoom(@RequestHeader(value="Authorization", required = false) String accessToken,
                                        @RequestBody JoinRoomDTO dto) {
        String userEmail = null;
        if (accessToken != null) {
            String token = accessToken.replace("Bearer ", "");
            userEmail = jwtUtil.extractUserEmail(token);
        }
        Long roomId = marbleService.joinRoom(userEmail, dto);
        if (roomId != null) {
            return ResponseEntity.ok(Map.of("roomId", roomId));
        }
        return ResponseEntity.badRequest().body(Map.of("message", "invalid inviteCode"));
    }

    // 초대코드 재생성
    @PostMapping("/room/{roomId}/code")
    public ResponseEntity<?> generateInviteCode(@PathVariable Long roomId) {
        String code = marbleService.reGenerateInviteCode(roomId);
        return ResponseEntity.ok(Map.of("inviteCode", code));
    }

    // 마블 상세조회
    @GetMapping("/room/{roomId}")
    public ResponseEntity<?> getRoomDetails(@RequestHeader(value="Authorization", required = false) String accessToken,
                                            @PathVariable Long roomId) {
        String userEmail = null;
        if (accessToken != null) {
            String token = accessToken.replace("Bearer ", "");
            userEmail = jwtUtil.extractUserEmail(token);
        }
        RoomDTO result = marbleService.getRoomDetails(userEmail, roomId);
        return ResponseEntity.ok(result);
    }

    // 노드 상세정보 조회
    @GetMapping("/node/{nodeId}")
    public ResponseEntity<?> getNodeDetails(@PathVariable Long nodeId) {
        NodeDTO result = marbleService.getNodeDetails(nodeId);
        return ResponseEntity.ok(result);
    }

    // 게임 액션 (주사위 굴리기, 패스권, 리롤권)
    @PostMapping("/play/{roomId}")
    public ResponseEntity<?> rollDice(@RequestHeader(value="Authorization", required = false) String accessToken,
                                      @PathVariable Long roomId, @RequestParam String action) {
        String userEmail = null;
        if (accessToken != null) {
            String token = accessToken.replace("Bearer ", "");
            userEmail = jwtUtil.extractUserEmail(token);
        }
        if ("roll-dice".equals(action)) {
            marbleService.rollDice(userEmail, roomId);
            return ResponseEntity.ok(Map.of("status", "roll-dice success"));
        } else if ("pass".equals(action)) {
            marbleService.usePass(userEmail, roomId);
            return ResponseEntity.ok(Map.of("status", "pass success"));
        } else if ("reroll".equals(action)) {
            marbleService.useReroll(userEmail, roomId);
            return ResponseEntity.ok(Map.of("status", "reroll success"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "invalid action"));
        }
    }

    // 장소 인증
    @PostMapping("/room/{roomId}/mission/{nodeId}/verify")
    public ResponseEntity<?> verifyMission(@RequestHeader(value="Authorization", required = false) String accessToken,
                                           @PathVariable Long roomId,
                                           @PathVariable Long nodeId,
                                           @RequestBody MissionVerifyDTO dto) {
        String userEmail = null;
        if (accessToken != null) {
            String token = accessToken.replace("Bearer ", "");
            userEmail = jwtUtil.extractUserEmail(token);
        }
        boolean result = marbleService.verifyMission(userEmail, roomId, nodeId, dto);
        return ResponseEntity.ok(Map.of("verified", result));
    }

    // 진행중인 마블 조회
    @GetMapping("/my")
    public ResponseEntity<?> getMyMarble(@RequestHeader(value="Authorization", required = false) String accessToken) {
        String userEmail = null;
        if (accessToken != null) {
            String token = accessToken.replace("Bearer ", "");
            userEmail = jwtUtil.extractUserEmail(token);
        }
        MyMarbleDTO result = marbleService.getMyMarble(userEmail);
        if (result != null) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.ok(Map.of("message", "no room"));
    }

    // 완료된 마블 삭제
    @DeleteMapping("/room/{roomId}/complete")
    public ResponseEntity<?> completeMarble(@PathVariable Long roomId) {
        marbleService.completeMarble(roomId);
        return ResponseEntity.ok(Map.of("status", "marble deleted"));
    }

}