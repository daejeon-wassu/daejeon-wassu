package com.wassu.wassu.service.marble;

import com.wassu.wassu.dto.marble.*;
import com.wassu.wassu.entity.UserEntity;
import com.wassu.wassu.entity.marble.MarbleEntity;
import com.wassu.wassu.entity.marble.NodeEntity;
import com.wassu.wassu.entity.touristspot.TouristSpotEntity;
import com.wassu.wassu.exception.CustomErrorCode;
import com.wassu.wassu.exception.CustomException;
import com.wassu.wassu.repository.UserRepository;
import com.wassu.wassu.repository.marble.MarbleRepository;
import com.wassu.wassu.repository.marble.NodeRepository;
import com.wassu.wassu.repository.touristspot.TouristSpotRepository;
import com.wassu.wassu.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class CreateRouteService {

    @Value("${server.domain}")
    private String serverDomain;
    private final RestTemplate restTemplate;
    private final UserRepository userRepository;
    private final TouristSpotRepository spotRepository;
    private final MarbleRepository marbleRepository;
    private final NodeRepository nodeRepository;
    private final MarbleService marbleService;
    private final JwtUtil jwtUtil;

    public InviteRoomDTO createMarbleRoot(String token, CreateRouteDTO dto, boolean single) {
        String email = null;
        String accessToken = null;
        if (token != null) {
            accessToken = token.replace("Bearer ", "");
            email = jwtUtil.extractUserEmail(accessToken);
        }
        UserEntity creator = userRepository.findByEmail(email).orElseThrow(() -> new CustomException(CustomErrorCode.USER_NOT_FOUND));
        List<RouteSpotDTO> optimalRoute = getOptimalRoute(accessToken, dto);
        MarbleEntity marble = new MarbleEntity();
        marble.setMarbleName("custom marble");
        MarbleEntity savedMarble = marbleRepository.save(marble);
        int order = 1;
        if (optimalRoute != null) {
            for (RouteSpotDTO route : optimalRoute) {
                Long spotId = route.getSpot_id();
                TouristSpotEntity spot = spotRepository.findById(spotId).orElseThrow(() -> new CustomException(CustomErrorCode.TOURIST_NOT_FOUND));
                NodeEntity node = new NodeEntity();
                node.setNodeOrder(order);
                node.setTouristSpot(spot);
                node.insertToMarble(savedMarble);
                nodeRepository.save(node);
                order++;
            }
        } else {
            throw new CustomException(CustomErrorCode.FAST_API_CONNECTION_ERROR);
        }
        return marbleService.processCreateRoom(single, savedMarble, creator);
    }

    private List<RouteSpotDTO> getOptimalRoute(String token, CreateRouteDTO dto) {
        String url = "https://" + serverDomain + "/fast_api/api/optimal-route";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        HttpEntity<CreateRouteDTO> request = new HttpEntity<>(dto, headers);
        ResponseEntity<OptimalRouteDTO> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                request,
                OptimalRouteDTO.class
        );
        OptimalRouteDTO optimalRoute = response.getBody();
        if (optimalRoute != null) {
            return optimalRoute.getOptimal_route();
        }
        return null;
    }

}
