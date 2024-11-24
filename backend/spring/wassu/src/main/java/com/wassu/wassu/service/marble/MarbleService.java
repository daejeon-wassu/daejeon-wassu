package com.wassu.wassu.service.marble;

import com.wassu.wassu.dto.marble.*;
import com.wassu.wassu.dto.touristspot.TouristSpotDTO;
import com.wassu.wassu.entity.UserEntity;
import com.wassu.wassu.entity.marble.MarbleEntity;
import com.wassu.wassu.entity.marble.MarbleRoomEntity;
import com.wassu.wassu.entity.marble.NodeEntity;
import com.wassu.wassu.entity.touristspot.TouristSpotEntity;
import com.wassu.wassu.entity.touristspot.TouristSpotImageEntity;
import com.wassu.wassu.exception.CustomErrorCode;
import com.wassu.wassu.exception.CustomException;
import com.wassu.wassu.repository.UserRepository;
import com.wassu.wassu.repository.marble.MarbleRepository;
import com.wassu.wassu.repository.marble.MarbleRoomRepository;
import com.wassu.wassu.repository.marble.NodeRepository;
import com.wassu.wassu.repository.marble.RedisRepository;
import com.wassu.wassu.service.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class MarbleService {

    private final UserRepository userRepository;
    private final MarbleRepository marbleRepository;
    private final MarbleRoomRepository roomRepository;
    private final RedisRepository redisRepository;
    private final NodeRepository nodeRepository;

    private final UserService userService;
    private final SseService sseService;

    private static final double EARTH_RADIUS = 6371000;

    public List<MarbleDTO> getMarbles() {
        return marbleRepository.findAll().stream()
                .map(marble -> new MarbleDTO(marble.getId(), marble.getMarbleName())).toList();
    }

    public InviteRoomDTO createMarble(Long marbleId, String email, CreateRoomDTO dto) {
        UserEntity creator = userRepository.findByEmail(email).orElseThrow(() -> new CustomException(CustomErrorCode.USER_NOT_FOUND));
        MarbleEntity marble = marbleRepository.findById(marbleId).orElseThrow(() -> new CustomException(CustomErrorCode.MARBLE_NOT_FOUND));
        return processCreateRoom(dto.isSingle(), marble, creator);
    }

    public InviteRoomDTO processCreateRoom(boolean single, MarbleEntity marble, UserEntity creator) {
        MarbleRoomEntity room = MarbleRoomEntity.builder()
                .marble(marble)
                .creator(creator)
                .build();
        String code = null;
        if (!single) { // 같이도슈면 초대코드 생성
            code = generateInviteCode();
            room.setSingle(false);
            room.setReady(false);
            room.setInviteCode(code);
        }
        MarbleRoomEntity savedRoom = roomRepository.save(room);
        if (code != null) {
            redisRepository.createCertification(code, savedRoom.getId());
        }
        return new InviteRoomDTO(savedRoom.getId(), savedRoom.getInviteCode());
    }

    public Long joinRoom(String email, JoinRoomDTO dto) {
        if (redisRepository.existsByInviteCode(dto.getInviteCode())) {
            Long roomId = redisRepository.getRoomId(dto.getInviteCode());
            MarbleRoomEntity room = roomRepository.findById(roomId).orElseThrow(() -> new CustomException(CustomErrorCode.ROOM_NOT_FOUND));
            UserEntity user = userRepository.findByEmail(email).orElseThrow(() -> new CustomException(CustomErrorCode.USER_NOT_FOUND));
            room.setGuest(user);
            room.setReady(true);
            return roomId;
        }
        return null;
    }

    public String reGenerateInviteCode(Long roomId) {
        String code = generateInviteCode();
        log.info("generated invite code {}", code);
        redisRepository.createCertification(code, roomId);
        return code;
    }

    public NodeDTO getNodeDetails(Long nodeId) {
        NodeEntity node = nodeRepository.findByIdWithJoin(nodeId).orElseThrow(() -> new CustomException(CustomErrorCode.NODE_NOT_FOUND));
        TouristSpotEntity spot = node.getTouristSpot();
        TouristSpotImageEntity thumbnail = spot.getTouristSpotImages().get(0);
        String thumbnailUrl = thumbnail.getTouristSpotImageUrl();
        return new NodeDTO(nodeId, spot.getId(), spot.getSpotName(), thumbnailUrl, node.getNodeOrder());
    }

    public RoomDTO getRoomDetails(String email, Long roomId) {
        UserEntity user = userRepository.findByEmail(email).orElseThrow(() -> new CustomException(CustomErrorCode.USER_NOT_FOUND));
        if (roomRepository.isSingleRoom(roomId)) {
            MarbleRoomEntity room = roomRepository.findSingleRoomDetails(roomId).orElseThrow(() -> new CustomException(CustomErrorCode.ROOM_NOT_FOUND));
            return createRoomDTO(user, roomId, room, isCreator(user, room));
        } else {
            MarbleRoomEntity room = roomRepository.findMultiRoomDetails(roomId).orElseThrow(() -> new CustomException(CustomErrorCode.ROOM_NOT_FOUND));
            boolean isCreator = isCreator(user, room);
            RoomDTO roomDTO = createRoomDTO(user, roomId, room, isCreator);
            if (isCreator) {
                if (room.getGuest() != null) {
                    roomDTO.setOpponent(userService.convertToDTO(room.getGuest()));
                }
            } else {
                roomDTO.setOpponent(userService.convertToDTO(room.getCreator()));
            }
            return roomDTO;
        }
    }

    public void rollDice(String email, Long roomId) {
        MarbleRoomEntity room = roomRepository.findById(roomId).orElseThrow(() -> new CustomException(CustomErrorCode.ROOM_NOT_FOUND));
        UserEntity user = userRepository.findByEmail(email).orElseThrow(() -> new CustomException(CustomErrorCode.USER_NOT_FOUND));

        // 유저 두명이 다 있지 않으면 게임진행 불가
        if (!isGameReady(room)) {
            throw new CustomException(CustomErrorCode.GAME_IS_NOT_READY);
        }

        int dice1 = (int) (Math.random() * 6) + 1;
        int dice2 = (int) (Math.random() * 6);

        if (isCreator(user, room)) {
            if (!room.isCreatorVerified()) { // 장소인증 안했으면 주사위굴리기 불가
                throw new CustomException(CustomErrorCode.MISSION_NOT_VERIFIED);
            }
            room.setCreatorPosition(room.getCreatorPosition() + dice1 + dice2);
            room.setCreatorVerified(false);
        } else {
            if (!room.isGuestVerified()) { // 장소인증 안했으면 주사위굴리기 불가
                throw new CustomException(CustomErrorCode.MISSION_NOT_VERIFIED);
            }
            room.setGuestPosition(room.getGuestPosition() + dice1 + dice2);
            room.setGuestVerified(false);
        }
        // 두 유저 모두에게 sse 전송
        sseService.sendEmitter(room.getCreator(), room, dice1, dice2);
        if (!room.isSingle()) {
            sseService.sendEmitter(room.getGuest(), room, dice1, dice2);
        }
    }

    public void usePass(String email, Long roomId) {
        MarbleRoomEntity room = roomRepository.findById(roomId).orElseThrow(() -> new CustomException(CustomErrorCode.ROOM_NOT_FOUND));
        UserEntity user = userRepository.findByEmail(email).orElseThrow(() -> new CustomException(CustomErrorCode.USER_NOT_FOUND));

        // 유저 두명이 다 있지 않으면 게임진행 불가
        if (!isGameReady(room)) {
            throw new CustomException(CustomErrorCode.GAME_IS_NOT_READY);
        }

        // 해당 사용자 장소인증 처리 + 패스권 차감
        if (isCreator(user, room)) {
            if (room.getCreatorPass() < 1) { // 패스권 0이면 불가
                throw new CustomException(CustomErrorCode.PASS_NOT_REMAINING);
            }
            room.setCreatorVerified(true);
            room.setCreatorPass(room.getCreatorPass() - 1);
        } else {
            if (room.getGuestPass() < 1) { // 패스권 0이면 불가
                throw new CustomException(CustomErrorCode.PASS_NOT_REMAINING);
            }
            room.setGuestVerified(true);
            room.setGuestPass(room.getGuestPass() - 1);
        }
        // 두 유저 모두에게 sse 전송
        sseService.sendEmitter(room.getCreator(), room);
        if (!room.isSingle()) {
            sseService.sendEmitter(room.getGuest(), room);
        }
    }

    public void useReroll(String email, Long roomId) {
        MarbleRoomEntity room = roomRepository.findById(roomId).orElseThrow(() -> new CustomException(CustomErrorCode.ROOM_NOT_FOUND));
        UserEntity user = userRepository.findByEmail(email).orElseThrow(() -> new CustomException(CustomErrorCode.USER_NOT_FOUND));

        // 유저 두명이 다 있지 않으면 게임진행 불가
        if (!isGameReady(room)) {
            throw new CustomException(CustomErrorCode.GAME_IS_NOT_READY);
        }

        int dice1 = (int) (Math.random() * 6) + 1;
        int dice2 = (int) (Math.random() * 6);

        // 해당 사용자 주사위 다시 굴리기 + 리롤권 차감
        if (isCreator(user, room)) {
            if (room.getCreatorReroll() < 1) { // 리롤권 0이면 불가
                throw new CustomException(CustomErrorCode.REROLL_NOT_REMAINING);
            }
            if (!room.isCreatorVerified()) { // 장소인증 안했으면 주사위굴리기 불가
                throw new CustomException(CustomErrorCode.MISSION_NOT_VERIFIED);
            }
            room.setCreatorPosition(room.getCreatorPosition() + dice1 + dice2);
            room.setCreatorReroll(room.getCreatorReroll() - 1);
            room.setCreatorVerified(false);
        } else {
            if (room.getGuestReroll() < 1) { // 리롤권 0이면 불가
                throw new CustomException(CustomErrorCode.REROLL_NOT_REMAINING);
            }
            if (!room.isGuestVerified()) { // 장소인증 안했으면 주사위굴리기 불가
                throw new CustomException(CustomErrorCode.MISSION_NOT_VERIFIED);
            }
            room.setGuestPosition(room.getGuestPosition() + dice1 + dice2);
            room.setGuestReroll(room.getGuestReroll() - 1);
            room.setGuestVerified(false);
        }
        // 두 유저 모두에게 sse 전송
        sseService.sendEmitter(room.getCreator(), room);
        if (!room.isSingle()) {
            sseService.sendEmitter(room.getGuest(), room);
        }
    }

    public boolean verifyMission(String email, Long roomId, Long nodeId, MissionVerifyDTO dto) {
        UserEntity user = userRepository.findByEmail(email).orElseThrow(() -> new CustomException(CustomErrorCode.USER_NOT_FOUND));
        MarbleRoomEntity room = roomRepository.findById(roomId).orElseThrow(() -> new CustomException(CustomErrorCode.ROOM_NOT_FOUND));
        NodeEntity node = nodeRepository.findByIdWithSpot(nodeId).orElseThrow(() -> new CustomException(CustomErrorCode.NODE_NOT_FOUND));
        TouristSpotEntity spot = node.getTouristSpot();
        Double longitude = spot.getLongitude();
        Double latitude = spot.getLatitude();
        boolean missionVerified = isMissionVerified(latitude, longitude, dto.getLatitude(), dto.getLongitude());
        if (missionVerified) {
            if (isCreator(user, room)) {
                room.setCreatorVerified(true);
            } else {
                room.setGuestVerified(true);
            }
        }
        // 두 유저 모두에게 sse 전송
        sseService.sendEmitter(room.getCreator(), room);
        if (!room.isSingle()) {
            sseService.sendEmitter(room.getGuest(), room);
        }
        return missionVerified;
    }

    public MyMarbleDTO getMyMarble(String email) {
        MarbleRoomEntity myRoom = roomRepository.findMyRoom(email);
        if (myRoom != null) {
            log.info("myRoom id = {}", myRoom.getId());
            return new MyMarbleDTO(myRoom.getId(), myRoom.isSingle());
        }
        return null;
    }

    public void completeMarble(Long roomId) {
        MarbleRoomEntity room = roomRepository.findById(roomId).orElseThrow(() -> new CustomException(CustomErrorCode.ROOM_NOT_FOUND));
        roomRepository.delete(room);
    }

    private RoomDTO createRoomDTO(UserEntity user, Long roomId, MarbleRoomEntity room, boolean isCreator) {
        MarbleEntity marble = room.getMarble();
        List<NodeEntity> nodes = marble.getNodes();
        List<NodeDTO> nodeDTOs = new ArrayList<>();
        for (NodeEntity node : nodes) {
            TouristSpotEntity spot = node.getTouristSpot();
            TouristSpotImageEntity thumbnail = spot.getTouristSpotImages().get(0);
            NodeDTO nodeDTO = new NodeDTO(node.getId(), spot.getId(), spot.getSpotName(), thumbnail.getTouristSpotImageUrl(), node.getNodeOrder());
            nodeDTOs.add(nodeDTO);
        }
        if (isCreator) {
            return RoomDTO.builder()
                    .roomId(roomId)
                    .marbleId(marble.getId())
                    .marbleName(marble.getMarbleName())
                    .single(room.isSingle())
                    .nodes(nodeDTOs)
                    .you(userService.convertToDTO(room.getCreator())).build();
        } else {
            return RoomDTO.builder()
                    .roomId(roomId)
                    .marbleId(marble.getId())
                    .marbleName(marble.getMarbleName())
                    .single(room.isSingle())
                    .nodes(nodeDTOs)
                    .you(userService.convertToDTO(room.getGuest())).build();
        }
    }

    private boolean isCreator(UserEntity user, MarbleRoomEntity room) {
        UserEntity guest = room.getGuest();
        UserEntity creator = room.getCreator();
        if (guest == null || user.getEmail().equals(creator.getEmail())) {
            return true;
        } else if (user.getEmail().equals(guest.getEmail())) {
            return false;
        } else {
            throw new CustomException(CustomErrorCode.USER_NOT_FOUND);
        }
    }

    private String generateInviteCode() {
        return new SecureRandom()
                .ints(6, 0, 62)
                .mapToObj("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"::charAt)
                .collect(StringBuilder::new, StringBuilder::append, StringBuilder::append)
                .toString();
    }

    private boolean isMissionVerified(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double distance = EARTH_RADIUS * c;

        return distance <= 500;
    }

    private boolean isGameReady(MarbleRoomEntity room) {
        if (room.isSingle()) {
            return true;
        }
        UserEntity creator = room.getCreator();
        UserEntity guest = room.getGuest();
        return creator != null && guest != null;
    }

}
