package com.wassu.wassu.service.touristspot;


import com.wassu.wassu.dto.touristspot.TouristSpotStampDTO;
import com.wassu.wassu.dto.touristspot.TouristSpotStampResponseDTO;
import com.wassu.wassu.entity.UserEntity;
import com.wassu.wassu.entity.touristspot.TouristSpotEntity;
import com.wassu.wassu.entity.touristspot.TouristSpotStampEntity;
import com.wassu.wassu.exception.CustomErrorCode;
import com.wassu.wassu.exception.CustomException;
import com.wassu.wassu.repository.UserRepository;
import com.wassu.wassu.repository.touristspot.TouristSpotRepository;
import com.wassu.wassu.repository.touristspot.TouristSpotStampRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.model.DeletedObject;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class TouristSpotStampService {

    private static final double EARTH_RADIUS = 6378.137;
    private static final Integer SEARCH_RADIUS = 500;

    private final TouristSpotRepository touristSpotRepository;
    private final UserRepository userRepository;
    private final TouristSpotStampRepository touristSpotStampRepository;

    public TouristSpotStampService(TouristSpotRepository touristSpotRepository, UserRepository userRepository, TouristSpotStampRepository touristSpotStampRepository) {
        this.touristSpotRepository = touristSpotRepository;
        this.userRepository = userRepository;
        this.touristSpotStampRepository = touristSpotStampRepository;
    }

    public Boolean touristSpotStamp(
            String elasticSpotId,
            Double currentLatitude,
            Double currentLongitude,
            String userEmail,
            String category
    ) {
        log.info("""
                Input ID: {}
                """, elasticSpotId);
        Optional<UserEntity> optionalUser = userRepository.findByEmail(userEmail);
        Optional<TouristSpotEntity> optionalSpot = touristSpotRepository.findByElasticId(elasticSpotId);
        UserEntity userEntity;
        if (optionalUser.isPresent() && optionalSpot.isPresent()) {
            userEntity = optionalUser.get();
        } else {
            log.error("User or Spot not found -- stamp");
            throw new CustomException(CustomErrorCode.USER_OR_SPOT_NOT_FOUND);
        }
        Double latitude = optionalSpot.get().getLatitude();
        Double longitude = optionalSpot.get().getLongitude();

        double distance = calculateDistance(latitude, longitude, currentLatitude, currentLongitude);
        if (distance <= SEARCH_RADIUS) {
            savingStamp(userEntity, elasticSpotId, category);
            return true;
        } else {
            log.error("Distance exceeded -- stamp");
            return false;
        }
    }
    
    // 좌표 기반 거리 계산
    // 1 => 사용자 좌표, 2 => 데이터 좌표
    private double calculateDistance(double lat1, double lng1, double lat2, double lng2) {
        // 위도 차이
        double dLat = Math.toRadians(lat2 - lat1);
        // 경도 차이
        double dLng = Math.toRadians(lng2 - lng1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLng / 2) * Math.sin(dLng / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        // EARTH_RADIUS = 6378.137 (km)
        return EARTH_RADIUS * c * 1000;
    }

    private void savingStamp(UserEntity userEntity, String elasticSpotId, String category) {
        try {
            log.info("Start to save tourist spot: ");
            Optional<TouristSpotEntity> optionalSpot = touristSpotRepository.findByElasticId(elasticSpotId);
            TouristSpotEntity touristSpotEntity;
            if (optionalSpot.isPresent()) {
                touristSpotEntity = optionalSpot.get();
            } else {
                log.error("Tourist Spot not found -- stamp");
                throw new CustomException(CustomErrorCode.FAILED_TO_SAVING_STAMP);
            }

            TouristSpotStampEntity touristSpotStampEntity = TouristSpotStampEntity.builder()
                    .elasticSpotId(elasticSpotId)
                    .user(userEntity)
                    .category(category)
                    .touristSpot(touristSpotEntity)
                    .build();
            touristSpotStampRepository.save(touristSpotStampEntity);
        } catch (Exception e) {
            log.error("Exception in saving stamp");
            throw new CustomException(CustomErrorCode.FAILED_TO_SAVING_STAMP);
        }
    }

    // 유저가 찍은 스탬프 리스트 반환
    public List<TouristSpotStampResponseDTO> findStampList(
        String userEmail,
        String category_name
    ) {
        Optional<UserEntity> optionalUser = userRepository.findByEmail(userEmail);
        if (optionalUser.isPresent()) {
            Long userId = optionalUser.get().getId();
            List<TouristSpotStampEntity> stampResponse = touristSpotStampRepository.findByUserId(userId);
            if (stampResponse.isEmpty()) {
                log.warn("User has no stamp");
                return null;
            }
            List<TouristSpotStampResponseDTO> stampResponseList  = new ArrayList<>();
            for (TouristSpotStampEntity stampEntity : stampResponse) {
                if (category_name == null || stampEntity.getCategory().equals(category_name)) {
                    TouristSpotStampResponseDTO stamp = TouristSpotStampResponseDTO.builder()
                            .spotName(stampEntity.getTouristSpot().getSpotName())
                            .category(stampEntity.getCategory())
                            .build();
                    stampResponseList.add(stamp);
                }
            }
            log.info("Found stamp response: " + stampResponseList.size());
            return stampResponseList;

        } else {
            log.error("User or Spot not found -- stamp");
            throw new CustomException(CustomErrorCode.USER_OR_SPOT_NOT_FOUND);
        }
    }
}
