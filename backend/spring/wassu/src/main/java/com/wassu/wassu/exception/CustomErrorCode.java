package com.wassu.wassu.exception;

import co.elastic.clients.elasticsearch.nodes.Http;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;


@Slf4j
@Getter
public enum CustomErrorCode {
    USER_NOT_FOUND(HttpStatus.BAD_REQUEST, "User Not Found"),
    USER_NOT_FOUND_WHILE_CREATING_ARTICLE(HttpStatus.BAD_REQUEST, "User Not Found While Creating Article"),
    ALREADY_LIKED_REVIEW(HttpStatus.BAD_REQUEST, "Already Liked Review"),
    ALREADY_LIKED_ARTICLE(HttpStatus.BAD_REQUEST, "Already Liked Article"),
    ALREADY_LIKED_TOURISTSPOT(HttpStatus.BAD_REQUEST, "Already Liked TouristSpot"),
    MISSION_NOT_VERIFIED(HttpStatus.BAD_REQUEST, "Mission Not Verified"),
    PASS_NOT_REMAINING(HttpStatus.BAD_REQUEST, "Pass Not Remaining"),
    REROLL_NOT_REMAINING(HttpStatus.BAD_REQUEST, "Reroll Not Remaining"),
    GAME_IS_NOT_READY(HttpStatus.BAD_REQUEST, "Game Is Not Ready"),

    USER_NOT_AUTHORIZED_CONTROL_ARTICLE(HttpStatus.FORBIDDEN, "User Not Authorized To Control Article"),
    USER_NOT_AUTHORIZED_CONTROL_REVIEW(HttpStatus.FORBIDDEN, "User Not Authorized To Control Review"),
    PERMISSION_DENIED(HttpStatus.FORBIDDEN, "Permission Denied"),

    ARTICLE_NOT_FOUND(HttpStatus.NOT_FOUND, "Article Not Found"),
    REVIEW_NOT_FOUND(HttpStatus.NOT_FOUND, "Review Not Found"),
    REVIEW_IMAGE_NOT_FOUND(HttpStatus.NOT_FOUND, "Review Image Not Found"),
    LIKE_NOT_FOUND(HttpStatus.NOT_FOUND, "Like Not Found"),
    TOURIST_NOT_FOUND(HttpStatus.NOT_FOUND, "TouristSpot Not Found"),
    SCHEDULE_NOT_FOUND(HttpStatus.NOT_FOUND, "Schedule Not Found"),
    PLAN_NOT_FOUND(HttpStatus.NOT_FOUND, "Plan Not Found"),
    MARBLE_NOT_FOUND(HttpStatus.NOT_FOUND, "Marble Not Found"),
    ROOM_NOT_FOUND(HttpStatus.NOT_FOUND, "Room Not Found"),
    NODE_NOT_FOUND(HttpStatus.NOT_FOUND, "Node Not Found"),

    FAILED_TO_UPDATE_ARTICLE(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Update Article"),
    FAILED_TO_CREATE_ARTICLE(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Create Article"),
    FAILED_TO_DELETE_ARTICLE(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Delete Article"),
    IMAGE_UPLOADING_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "Image Uploading Failed"),
    FAILED_TO_CREATE_TAG(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Create Tag"),
    FAILED_TO_UPDATE_TAG(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Update Tag"),
    FAILED_TO_UPDATE_IMAGE(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Update Image"),
    FAILED_TO_DELETE_TAG(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Delete Tag"),
    FAILED_TO_DELETE_IMAGE(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Delete Image"),
    FAILED_TO_SEND_EMAIL(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Send Email"),
    FAILED_TO_UPLOAD_S3(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Upload S3"),
    IMAGEFILE_IS_NULL(HttpStatus.INTERNAL_SERVER_ERROR, "Image File Is Null"),
    FAILED_TO_SEARCH(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Search"),
    FAILED_TO_SEARCH_BY_TAG(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Search By Tag"),
    ERROR_WHILE_SEARCH_ARTICLE(HttpStatus.INTERNAL_SERVER_ERROR, "Error While Search Article"),
    ERROR_WHILE_READ_ARTICLE(HttpStatus.INTERNAL_SERVER_ERROR, "Error While Read Article"),
    FAILED_TO_UPDATE_PROFILE(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Update Profile"),
    FAILED_TO_UPDATE_PROFILE_IMAGE(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Update Profile Image"),
    FAILED_TO_SAVE_ARTICLE(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Save Article"),
    FAILED_TO_MATCHING_PROFILE_AND_ARTICLE(HttpStatus.INTERNAL_SERVER_ERROR, "Falied To Matching Profile and Article"),
    ERROR_WHILE_SEARCH_TOURIST_SPOT(HttpStatus.INTERNAL_SERVER_ERROR, "Error While Search TouristSpot"),
    FAILED_TO_FILTERING_BY_CATEGORY(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Filter By Category"),
    FAILED_TO_MATCHING_WITH_TOURIST_SPOT_AND_ISMATCHED(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Match With TouristSpot and Ismatched"),
    USER_OR_SPOT_NOT_FOUND(HttpStatus.INTERNAL_SERVER_ERROR, "User Or Spot Not Found"),
    FAILED_TO_SAVING_STAMP(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to saving stamp"),
    EXCEPTION_IN_LISTENER(HttpStatus.INTERNAL_SERVER_ERROR, "Exception in listener"),
    SSE_CONNECTION_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "SSE Connection Error"),
    FAST_API_CONNECTION_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Fast API Connection Error"),;

    private final HttpStatus status;
    private final String message;


    CustomErrorCode(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }
}


