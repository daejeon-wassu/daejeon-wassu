package com.wassu.wassu.entity.course;

import com.wassu.wassu.entity.touristspot.TouristSpotEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "tour_course_details_entity")
public class TourCourseDetailEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private TourCourseEntity course;

    @ManyToOne
    @JoinColumn(name = "bakery_id", nullable = false)
    private TouristSpotEntity touristSpot;
}
