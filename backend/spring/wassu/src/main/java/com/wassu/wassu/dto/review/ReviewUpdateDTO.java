package com.wassu.wassu.dto.review;

import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
public class ReviewUpdateDTO {

    private String content;
    private List<Long> deleteImages; // 삭제 이미지 id목록

}
