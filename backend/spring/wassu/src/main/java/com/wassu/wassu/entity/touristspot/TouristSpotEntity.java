package com.wassu.wassu.entity.touristspot;

import com.wassu.wassu.entity.VisitedSpotEntity;
import com.wassu.wassu.entity.course.TourCourseDetailEntity;
import com.wassu.wassu.entity.course.WassuMonEntity;
import com.wassu.wassu.entity.review.ReviewEntity;
import com.wassu.wassu.entity.schedule.DailyPlanEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class TouristSpotEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String elasticId; // 검색용 엘라스틱 문서랑 매치될 id

    @Column(nullable = false, length = 50)
    private String spotName;

    @Column(nullable = false)
    private String spotAddress;

    @Column(columnDefinition = "TEXT")
    private String spotDescription;

    private int favoritesCount;

    @Column(columnDefinition = "TEXT")
    private String businessHours;

    private String phone;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @OneToMany(mappedBy = "touristSpot", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VisitedSpotEntity> visitedSpots = new ArrayList<>();

    @OneToMany(mappedBy = "touristSpot", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TouristSpotTagEntity> touristSpotTags = new ArrayList<>();

    @OneToMany(mappedBy = "touristSpot", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TouristSpotImageEntity> touristSpotImages = new ArrayList<>();

    @OneToMany(mappedBy = "touristSpot", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReviewEntity> reviews = new ArrayList<>();

    @OneToMany(mappedBy = "touristSpot", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TouristSpotStampEntity> touristSpotStamps = new ArrayList<>();

    @OneToMany(mappedBy = "touristSpot", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TourCourseDetailEntity> tourCourseDetails = new ArrayList<>();

    @OneToOne(mappedBy = "touristSpot", cascade = CascadeType.ALL, orphanRemoval = true)
    private WassuMonEntity wassuMon;

    public int getStampCount() {
        return touristSpotStamps.size();
    }

}
