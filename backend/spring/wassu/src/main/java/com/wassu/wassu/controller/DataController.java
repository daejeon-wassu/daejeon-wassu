package com.wassu.wassu.controller;

import com.wassu.wassu.entity.touristspot.TouristSpotEntity;
import com.wassu.wassu.entity.touristspot.TouristSpotImageEntity;
import com.wassu.wassu.exception.CustomErrorCode;
import com.wassu.wassu.exception.CustomException;
import com.wassu.wassu.repository.touristspot.TouristSpotImageRepository;
import com.wassu.wassu.repository.touristspot.TouristSpotRepository;
import com.wassu.wassu.service.data.DataService;
import com.wassu.wassu.util.UtilTool;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/wassu/data-uploading-elastic")
@Slf4j
public class DataController {

    private final UtilTool utilTool;
    private final TouristSpotRepository touristSpotRepository;
    private final TouristSpotImageRepository touristSpotImageRepository;
    private DataService dataService;

    @PostMapping("/csv")
    public ResponseEntity<?> uploadCSV(
            @RequestParam("file") MultipartFile file
    ) {
        try {
            dataService.uploadCSV(file);
            return ResponseEntity.ok(utilTool.createResponse("status", "success"));
        } catch(Exception e) {
            log.error("Error while uploading csv file: ", e);
            throw new CustomException(CustomErrorCode.ERROR_WHILE_READ_ARTICLE);
        }
    }

    @PutMapping("/update_image")
    public ResponseEntity<?> updateImage() {
        try {
            dataService.updateElasticImage(1000);
            return ResponseEntity.ok(utilTool.createResponse("status", "success"));
        } catch (Exception e) {
            log.error("Error while updating image file: ", e);
            return ResponseEntity.status(500).body(utilTool.createResponse("status", "update failed"));
        }
    }

    @GetMapping("/empty_data")
    public ResponseEntity<?> emptyData() {
        try {
            List<String> emptySpotElastic = new ArrayList<>();
            List<TouristSpotEntity> spotList = touristSpotRepository.findAll();
            for (TouristSpotEntity spot: spotList) {
                Long spotId = spot.getId();
                List<TouristSpotImageEntity> spotImage = touristSpotImageRepository.findByTouristSpotId(spotId);
                if (spotImage.isEmpty()) {
                    emptySpotElastic.add(spot.getElasticId());
                }
            }
            return ResponseEntity.ok(emptySpotElastic);
        } catch (Exception e) {
            log.error("Error while empty data: ", e);
            return ResponseEntity.status(500).body(utilTool.createResponse("status", "empty failed"));
        }
    }

}
