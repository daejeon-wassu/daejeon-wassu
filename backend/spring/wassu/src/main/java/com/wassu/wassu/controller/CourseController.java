package com.wassu.wassu.controller;

import com.wassu.wassu.service.course.CourceService;
import com.wassu.wassu.util.UserUtil;
import com.wassu.wassu.util.UtilTool;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/wassu/course")
@AllArgsConstructor
@Slf4j
public class CourseController {

    private final UserUtil userUtil;
    private final UtilTool utilTool;
    private final CourceService courceService;

    // 사용자 코스 진행 상황
    @GetMapping
    public ResponseEntity<?> getUserCourseProgress(
            @RequestHeader(value = "Authorization") String accessToken
    ) {
        String userEmail = userUtil.extractUserEmail(accessToken);
        if (userEmail == null) {
            log.error("User Not Found ------ get user course progress");
            return ResponseEntity.status(404).body(utilTool.createResponse("status", "user not found"));
        }
        Map<String, Object> userCourseProgress = courceService.getUserChallenge(userEmail);
        return ResponseEntity.ok(userCourseProgress);
    }
}
