package com.wassu.wassu.controller;

import com.wassu.wassu.dto.touristspot.*;
import com.wassu.wassu.entity.touristspot.TouristSpotStampEntity;
import com.wassu.wassu.exception.CustomErrorCode;
import com.wassu.wassu.exception.CustomException;
import com.wassu.wassu.repository.UserRepository;
import com.wassu.wassu.repository.touristspot.TouristSpotStampRepository;
import com.wassu.wassu.security.JwtUtil;
import com.wassu.wassu.service.touristspot.TouristSpotSearchService;
import com.wassu.wassu.service.touristspot.TouristSpotService;
import com.wassu.wassu.service.touristspot.TouristSpotStampService;
import com.wassu.wassu.service.touristspot.TouristSpotUtilService;
import com.wassu.wassu.util.UserUtil;
import com.wassu.wassu.util.UtilTool;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/wassu/tourist")
@RequiredArgsConstructor
@Slf4j
public class TouristSpotController {

    private final TouristSpotService touristSpotService;
    private final UtilTool utilTool;
    private final TouristSpotSearchService touristSpotSearchService;
    private final TouristSpotUtilService touristSpotUtilService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final UserUtil userUtil;
    private final TouristSpotStampService touristSpotStampService;
    private final TouristSpotStampRepository touristSpotStampRepository;

    // 관광지 상세조회
    @SecurityRequirement(name = "") // 스웨거 헤더 제외
    @GetMapping("/details/{elasticSpotId}")
    public ResponseEntity<?> getTouristSpotDetails(
            @RequestHeader(value = "Authorization", required = false) String accessToken,
            @PathVariable String elasticSpotId
    ) { // 엘라스틱 id
        log.info("controller spot id -> {}", elasticSpotId);
        String userEmail = userUtil.extractUserEmail(accessToken);
        TouristSpotDTO result = touristSpotService.getTouristSpotDetails(userEmail, elasticSpotId);
        return ResponseEntity.ok(result);
    }

    // 찜하기
    @PostMapping("/{spotId}/favorite")
    public ResponseEntity<?> touristSpotFavorite(@AuthenticationPrincipal String userEmail,
                                                 @PathVariable String spotId) { // 엘라스틱 id
        TouristSpotFavoriteDTO result = touristSpotService.touristSpotFavorite(userEmail, spotId);
        return ResponseEntity.ok(result);
    }

    // 찜취소
    @DeleteMapping("/{spotId}/favorite")
    public ResponseEntity<?> touristSpotUnFavorite(@AuthenticationPrincipal String userEmail,
                                                   @PathVariable String spotId) {
        TouristSpotFavoriteDTO result = touristSpotService.touristSpotUnfavorite(userEmail, spotId);
        return ResponseEntity.ok(result);
    }

    // 관광지 검색
    @SecurityRequirement(name = "")
    @GetMapping("/search")
    public ResponseEntity<?> touristSpotSearch(
            @RequestHeader(value = "Authorization", required = false) String accessToken,
            @RequestParam String searchText,
            Pageable pageable
    ) {
        try{
            String userEmail = userUtil.extractUserEmail(accessToken);

            log.info("Tourist Spot Search Requested -----------");
            log.info("Requested User Email In Searching Service : {}", userEmail);
            Page<Map<String, Object>> response = touristSpotSearchService.searchByText(
                    searchText, pageable
            );
            touristSpotUtilService.matchingWithSpotAndIsStamped(response, userEmail);

            System.out.println("Search Completed --------------------");
            log.info("Search Complete");
            return ResponseEntity.ok(response);

        } catch(Exception e) {
            log.error("Exception occurred while searching for tourist spot", e);
            return ResponseEntity.status(500).body(utilTool.createResponse("status","failed"));
        }
    }

    // 관광지 필터링
    @SecurityRequirement(name = "")
    @GetMapping("/filter")
    public ResponseEntity<?> touristSpotCategory(
            @RequestHeader(value = "Authorization", required = false) String accessToken,
            @RequestParam(name = "category", required = false) String category,
            Pageable pageable
    ) throws IOException {
        try {
            log.info("Filtering by Category ---------------");
            String userEmail = userUtil.extractUserEmail(accessToken);
            Page<Map<String, Object>> response = touristSpotSearchService.filteringByCategory(category, pageable);
            touristSpotUtilService.matchingWithSpotAndIsStamped(response, userEmail);
            System.out.println("Filtering by Category");
            log.info("Filtering by Category");
            return ResponseEntity.ok(response);
        } catch(Exception e) {
            log.error("Exception occurred while searching for tourist spot", e);
            return ResponseEntity.status(500).body(utilTool.createResponse("status","failed"));
        }
    }

    @PostMapping("/stamp")
    public ResponseEntity<?> touristSpotStamp(
             @RequestHeader(value = "Authorization") String accessToken,
             @RequestBody TouristSpotStampDTO touristSpotStampDTO
             ) {
        try {
            System.out.println("Start to Stamp");
            String userEmail = userUtil.extractUserEmail(accessToken);
            if (userEmail == null){
                log.error("User not found -- stamp");
                return ResponseEntity.status(500).body(utilTool.createResponse("status","user or spot not found"));
            }
            Long userId = userRepository.findByEmail(userEmail).get().getId();
            log.info("Input User Id: {}", userId);
            String elasticTouristSpotId = touristSpotStampDTO.getElasticSpotId();
            System.out.println("elasticTouristSpotId: " + elasticTouristSpotId + " ---------------------");
            Double currentLatitude = touristSpotStampDTO.getCurrentLatitude();
            Double currentLongitude = touristSpotStampDTO.getCurrentLongitude();
            String category = touristSpotStampDTO.getCategory();
            if (touristSpotStampRepository.findByUserIdAndElasticSpotId(userId, elasticTouristSpotId).isPresent()){
                log.warn("Already stamped");
                return ResponseEntity.status(404).body(utilTool.createResponse("status","already stamped"));
            }
            System.out.println(touristSpotStampDTO.getElasticSpotId());
            Boolean isStamped = touristSpotStampService.touristSpotStamp(
                    elasticTouristSpotId,
                    currentLatitude,
                    currentLongitude,
                    userEmail,
                    category
            );
            if (isStamped) {
                log.info("Stamped elasticTouristSpotId: {}", elasticTouristSpotId);
                return ResponseEntity.ok(utilTool.createResponse("status","success"));
            } else {
                log.warn("Stamp failed");
                return ResponseEntity.status(404).body(utilTool.createResponse("status","out of range"));
            }
        } catch (CustomException ce){
            System.out.println("----------------------");
            log.error("CustomException: ",ce);
            return ResponseEntity.status(404).body(utilTool.createResponse("status","user or spot not found"));
        } catch (Exception e) {
            log.error("Exception occurred while stamping tourist spot", e);
            return ResponseEntity.status(500).body(utilTool.createResponse("status", e.getMessage()));
        }
    }

    @GetMapping("/stamp/detail")
    public ResponseEntity<?> touristSpotStampDetail(
            @RequestHeader(value = "Authorization") String accessToken,
            @RequestParam(name = "category", required = false) String category
    ) {
        String userEmail = userUtil.extractUserEmail(accessToken);
        if (userEmail == null){
            log.error("User not found -- stamp");
            return ResponseEntity.status(500).body(utilTool.createResponse("status","user not found"));
        }
        try {
            List<TouristSpotStampResponseDTO> response = touristSpotStampService.findStampList(userEmail, category);
            if (response != null) {
                log.info("Read stamp detail successfully");
                return ResponseEntity.ok(response);
            }
            return ResponseEntity.ok(new ArrayList<>());
        } catch (Exception e) {
            log.error("Exception occurred while read stamp list: {}", e.getMessage());
            return ResponseEntity.status(500).body(utilTool.createResponse("status","failed"));
        }

    }

    // 추천 관광지
    @GetMapping("/recommend")
    public ResponseEntity<?> touristSpotRecommend() {
        List<TouristSpotRecommendDTO> result = touristSpotService.recommendTouristSpot();
        return ResponseEntity.ok(Map.of("data", result));
    }
}
