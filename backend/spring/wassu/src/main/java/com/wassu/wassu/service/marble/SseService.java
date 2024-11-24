package com.wassu.wassu.service.marble;

import com.wassu.wassu.dto.marble.SseDTO;
import com.wassu.wassu.entity.UserEntity;
import com.wassu.wassu.entity.marble.MarbleRoomEntity;
import com.wassu.wassu.exception.CustomErrorCode;
import com.wassu.wassu.exception.CustomException;
import com.wassu.wassu.repository.UserRepository;
import com.wassu.wassu.repository.marble.MarbleRoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.*;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class SseService {

    private final MarbleRoomRepository roomRepository;
    private final UserRepository userRepository;
    private final Map<Long, Map<String, SseEmitter>> emitters = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(10);

    public SseEmitter createEmitter(String email, Long roomId) {
        UserEntity user = userRepository.findByEmail(email).orElseThrow(() -> new CustomException(CustomErrorCode.USER_NOT_FOUND));
        MarbleRoomEntity room = roomRepository.findById(roomId).orElseThrow(() -> new CustomException(CustomErrorCode.ROOM_NOT_FOUND));
        SseEmitter emitter = new SseEmitter(300_000L);
        SecurityContext context = SecurityContextHolder.getContext();

        // roomId에 해당하는 사용자 맵 가져오기, 없으면 새로 생성
        emitters.computeIfAbsent(roomId, k -> new ConcurrentHashMap<>())
                .put(email, emitter);

        // 연결 종료 시 맵에서 emitter 제거
        emitter.onCompletion(() -> removeEmitter(roomId, email));
        emitter.onTimeout(() -> removeEmitter(roomId, email));
        emitter.onError(e -> removeEmitter(roomId, email));

        // 비동기로 초기 데이터 전송
        CompletableFuture.runAsync(() -> {
            sendEmitter(user, room);
            sendUserInfo(room);
        });
        // 스케줄러를 사용하여 주기적으로 핑 전송
        schedulePing(email, roomId, context, emitter);
        return emitter;
    }

    public SseEmitter getEmitter(Long roomId, String email) {
        if (emitters.get(roomId) != null) {
            return emitters.get(roomId).get(email);
        }
        return null;
    }

    public void sendEmitter(UserEntity user, MarbleRoomEntity room, int dice1, int dice2) {
        SseEmitter emitter = getEmitter(room.getId(), user.getEmail());
        if (emitter != null) {
            SseDTO sseDTO;
            if (user.equals(room.getCreator())) {
                sseDTO = SseDTO.builder()
                        .ready(room.isReady())
                        .yourPosition(room.getCreatorPosition())
                        .yourVerified(room.isCreatorVerified())
                        .yourReroll(room.getCreatorReroll())
                        .yourPass(room.getCreatorPass())
                        .opponentPosition(room.getGuestPosition())
                        .opponentVerified(room.isGuestVerified())
                        .opponentReroll(room.getGuestReroll())
                        .opponentPass(room.getGuestPass())
                        .dice1(dice1)
                        .dice2(dice2)
                        .build();
            } else {
                sseDTO = SseDTO.builder()
                        .ready(room.isReady())
                        .yourPosition(room.getGuestPosition())
                        .yourVerified(room.isGuestVerified())
                        .yourReroll(room.getGuestReroll())
                        .yourPass(room.getGuestPass())
                        .opponentPosition(room.getCreatorPosition())
                        .opponentVerified(room.isCreatorVerified())
                        .opponentReroll(room.getCreatorReroll())
                        .opponentPass(room.getCreatorPass())
                        .dice1(dice1)
                        .dice2(dice2)
                        .build();
            }
            messageProcess(user, room, emitter, sseDTO);
        }
    }

    public void sendEmitter(UserEntity user, MarbleRoomEntity room) {
        SseEmitter emitter = getEmitter(room.getId(), user.getEmail());
        if (emitter != null) {
            SseDTO sseDTO;
            if (user.equals(room.getCreator())) {
                sseDTO = SseDTO.builder()
                        .ready(room.isReady())
                        .yourPosition(room.getCreatorPosition())
                        .yourVerified(room.isCreatorVerified())
                        .yourReroll(room.getCreatorReroll())
                        .yourPass(room.getCreatorPass())
                        .opponentPosition(room.getGuestPosition())
                        .opponentVerified(room.isGuestVerified())
                        .opponentReroll(room.getGuestReroll())
                        .opponentPass(room.getGuestPass())
                        .build();
            } else {
                sseDTO = SseDTO.builder()
                        .ready(room.isReady())
                        .yourPosition(room.getGuestPosition())
                        .yourVerified(room.isGuestVerified())
                        .yourReroll(room.getGuestReroll())
                        .yourPass(room.getGuestPass())
                        .opponentPosition(room.getCreatorPosition())
                        .opponentVerified(room.isCreatorVerified())
                        .opponentReroll(room.getCreatorReroll())
                        .opponentPass(room.getCreatorPass())
                        .build();
            }
            messageProcess(user, room, emitter, sseDTO);
        }
    }

    private void messageProcess(UserEntity user, MarbleRoomEntity room, SseEmitter emitter, SseDTO sseDTO) {
        try {
            emitter.send(SseEmitter.event().name("message").data(sseDTO));
        } catch (IOException e) {
            if (e.getMessage() != null && e.getMessage().contains("Broken pipe")) {
                log.info("Client intentionally closed the connection. roomId: {}, email: {}", room.getId(), user.getEmail());
                removeEmitter(room.getId(), user.getEmail());
            } else {
                log.error("Unexpected IOException occurred: {}", e.getMessage());
                throw new CustomException(CustomErrorCode.SSE_CONNECTION_ERROR);
            }
        }
    }

    private void sendUserInfo(MarbleRoomEntity room) {
        Map<String, String> creatorUserInfo = new HashMap<>();
        Map<String, String> guestUserInfo = new HashMap<>();
        UserEntity creator = room.getCreator();
        UserEntity guest = room.getGuest();
        SseEmitter creatorEmitter = getEmitter(room.getId(), creator.getEmail());
        if (guest != null && creatorEmitter != null) {
            SseEmitter guestEmitter = getEmitter(room.getId(), guest.getEmail());
            userInfoProcess(room, creatorUserInfo, creator, guest, creatorEmitter);
            if (guestEmitter != null) {
                userInfoProcess(room, guestUserInfo, guest, creator, guestEmitter);
            }
        } else {
            creatorUserInfo.put("you", creator.getProfileImage());
            try {
                if (creatorEmitter != null) {
                    creatorEmitter.send(SseEmitter.event().name("userInfo").data(creatorUserInfo));
                }
            } catch (IOException e) {
                if (e.getMessage() != null && e.getMessage().contains("Broken pipe")) {
                    log.info("Client intentionally closed the connection. roomId: {}, email: {}", room.getId(), creator.getEmail());
                    removeEmitter(room.getId(), creator.getEmail());
                } else {
                    log.error("Unexpected IOException occurred: {}", e.getMessage());
                    throw new CustomException(CustomErrorCode.SSE_CONNECTION_ERROR);
                }
            }
        }
    }

    private void userInfoProcess(MarbleRoomEntity room, Map<String, String> creatorUserInfo, UserEntity creator, UserEntity guest, SseEmitter creatorEmitter) {
        try {
            creatorUserInfo.put("you", creator.getProfileImage());
            creatorUserInfo.put("opponent", guest.getProfileImage());
            creatorEmitter.send(SseEmitter.event().name("userInfo").data(creatorUserInfo));
        } catch (IOException e) {
            if (e.getMessage() != null && e.getMessage().contains("Broken pipe")) {
                log.info("Client intentionally closed the connection. roomId: {}, email: {}", room.getId(), creator.getEmail());
                removeEmitter(room.getId(), creator.getEmail());
            } else {
                log.error("Unexpected IOException occurred: {}", e.getMessage());
                throw new CustomException(CustomErrorCode.SSE_CONNECTION_ERROR);
            }
        }
    }

    private void removeEmitter(Long roomId, String email) {
        Map<String, SseEmitter> userEmitters = emitters.get(roomId);
        if (userEmitters != null) {
            userEmitters.remove(email);

            // roomId에 해당하는 사용자 목록이 비었으면 roomId도 제거
            if (userEmitters.isEmpty()) {
                emitters.remove(roomId);
            }
        }
    }

    private void schedulePing(String email, Long roomId, SecurityContext context, SseEmitter emitter) {
        scheduler.scheduleAtFixedRate(() -> {
            try {
                SecurityContextHolder.setContext(context);
                emitter.send(SseEmitter.event().name("message").data("keep-alive"));
                log.info("emitter sent ping: {} {}", roomId, email);
            } catch (IOException e) {
                removeEmitter(roomId, email);
                throw new RuntimeException(e); // 스케줄러 종료를 위해 예외 발생
            }
        }, 0, 30, TimeUnit.SECONDS);
    }

}
