package com.wassu.wassu.service.course;

import com.wassu.wassu.entity.UserEntity;
import com.wassu.wassu.entity.course.CatchedWassuMonEntity;
import com.wassu.wassu.entity.course.UserCourseProgressEntity;
import com.wassu.wassu.repository.UserRepository;
import com.wassu.wassu.repository.course.CatchedWassuMonRepository;
import com.wassu.wassu.repository.course.UserCourseProgressRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Slf4j
@AllArgsConstructor
public class CourceService {

    private final UserCourseProgressRepository userCourseProgressRepository;
    private final UserRepository userRepository;
    private final CatchedWassuMonRepository catchedWassuMonRepository;

    public Map<String, Object> getUserChallenge(String userEmail){
        Optional<UserEntity> OptionalUser = userRepository.findByEmail(userEmail);
        UserEntity user;
        if(OptionalUser.isPresent()){
            user = OptionalUser.get();
        } else {
            log.error("User Not Found ---- challenge");
            return null;
        }

        List<UserCourseProgressEntity> startList = userCourseProgressRepository.findByUser_IdAndProgress(user.getId(), "start");
        List<UserCourseProgressEntity> completeList = userCourseProgressRepository.findByUser_IdAndProgress(user.getId(), "complete");
        List<CatchedWassuMonEntity> catchedList = catchedWassuMonRepository.findByUserId(user.getId());
        Map<String, Object> result = Map.of(
                "start", startList.size(),
                "complete", completeList.size(),
                "catched", catchedList.size()
        );
        log.info("Get User Course Progress");
        return result;
    }
}
