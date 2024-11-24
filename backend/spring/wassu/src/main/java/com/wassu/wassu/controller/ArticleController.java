package com.wassu.wassu.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wassu.wassu.dto.article.ArticleDTO;
import com.wassu.wassu.dto.article.ArticleLikeDTO;
import com.wassu.wassu.dto.article.ArticleResponseDTO;
import com.wassu.wassu.dto.article.ArticleSearchRequestDTO;
import com.wassu.wassu.entity.UserEntity;
import com.wassu.wassu.exception.CustomErrorCode;
import com.wassu.wassu.exception.CustomException;
import com.wassu.wassu.repository.article.ArticleRepository;
import com.wassu.wassu.repository.UserRepository;
import com.wassu.wassu.security.JwtUtil;
import com.wassu.wassu.service.article.*;
import com.wassu.wassu.util.UserUtil;
import com.wassu.wassu.util.UtilTool;
import com.wassu.wassu.entity.ArticleEntity;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/wassu/posts")
@AllArgsConstructor
@Slf4j
public class ArticleController {

    private final UtilTool utilTool;
    private final ArticleUpdateService articleUpdateService;
    private final ArticleCreateService articleCreateService;
    private final ArticleDeleteService articleDeleteService;
    private final ArticleUtilService articleUtilService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final ArticleRepository articleRepository;
    private final ArticleSearchServiceImpl articleSearchServiceImpl;
    private final ArticleCategoryFilterService articleCategoryFilterService;
    private final ArticleReadService articleReadService;
    private final ArticleLikeService articleLikeService;
    private final ArticleProfileService articleProfileService;
    private final UserUtil userUtil;

    @GetMapping(value = "/test")
    public ResponseEntity<?> putTest() {
        return ResponseEntity.ok(utilTool.createResponse("status", "test success"));
    }

    // 포스팅 작성
    @PostMapping(value="/", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createArticle(
        @RequestHeader(value="Authorization") String accessToken,
        @RequestParam("articleDTO") String articleDTOJson,
        @RequestPart(value = "file", required = false) List<MultipartFile> files
    ) throws JsonProcessingException {
        log.info("Requested DTO: {}", articleDTOJson);
        log.info("Requested Files: {}", files);
        String token = accessToken.replace("Bearer ", "");
        String userEmail = jwtUtil.extractUserEmail(token);
        ObjectMapper objectMapper = new ObjectMapper();
        ArticleDTO articleDTO = objectMapper.readValue(articleDTOJson, ArticleDTO.class);

        String articleId = articleCreateService.createArticle(userEmail, articleDTO, files);
        log.info("""
                Article ID : {}
                """, articleId);
        return ResponseEntity.ok(utilTool.createResponse("articleId", articleId));
    }
    
    // 포스팅 수정
    @PutMapping(value = "/{articleId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateArticle(
            @RequestHeader(value = "Authorization") String accessToken,
            @PathVariable String articleId,
            @RequestParam("articleDTO") String articleDTOJson,
            @RequestPart(value="file", required = false) List<MultipartFile> files
    ) throws JsonProcessingException {
        String token = accessToken.replace("Bearer ", "");
        log.info("Requested Article update");
        String userEmail = jwtUtil.extractUserEmail(token);
        Optional<ArticleEntity> optionalArticle = articleRepository.findById(articleId);
        if (optionalArticle.isPresent()){
            ArticleEntity articleEntity = optionalArticle.get();
            Optional<UserEntity> optionalUser = userRepository.findById(articleEntity.getUser());
            if (optionalUser.isPresent() && !optionalUser.get().getEmail().equals(userEmail)){
                log.error("User Not Authorized to update article");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(utilTool.createResponse("status","User Not Authorized to update article"));
            }
            ObjectMapper objectMapper = new ObjectMapper();
            System.out.println("--------------------");
            ArticleDTO articleDTO = objectMapper.readValue(articleDTOJson, ArticleDTO.class);

            articleUpdateService.updateArticle(articleEntity, articleDTO, files);
        } else {
            log.error("Article with id {} not found", articleId);
            return ResponseEntity.status(404).body(utilTool.createResponse("status","Article Not Found"));
        }
        return ResponseEntity.ok(utilTool.createResponse("status","success"));
    }

    // 포스팅 삭제
    @DeleteMapping(value="/{articleId}")
    public ResponseEntity<?> deleteArticle(
            @RequestHeader(value = "Authorization") String accessToken,
            @PathVariable String articleId
    ) {
        log.info("Requested delete article");
        String token = accessToken.replace("Bearer ", "");
        String userEmail = jwtUtil.extractUserEmail(token);
        articleUtilService.checkArticleAndUser(userEmail, articleId);
        articleDeleteService.deleteArticle(articleId);
        return ResponseEntity.ok(utilTool.createResponse("status","success"));
    }

    // 포스팅 검색
    @SecurityRequirement(name = "")
    @PostMapping(value="/search")
    public ResponseEntity<?> searchArticleTest(
            @RequestHeader(value = "Authorization", required = false) String accessToken,
            @RequestBody ArticleSearchRequestDTO requestDTO,
            Pageable pageable
    ){
        try {
            log.info("Requested search test -----------------------------");
            Page<Map<String, Object>> response = articleSearchServiceImpl.searchByText(
                    requestDTO.getSearchText(), requestDTO.getTags(), pageable
            );
            String userEmail = userUtil.extractUserEmail(accessToken);
            articleProfileService.matchingProfileWithArticleList(response, userEmail);

            System.out.println("Search Test Completed --------------------------");
            log.info("Search Completed");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("IOException while search article: ", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 포스팅 카테고리 별 필터링
    @SecurityRequirement(name = "")
    @GetMapping("/filter")
    public ResponseEntity<?> filterArticle(
            @RequestHeader(value="Authorization", required = false) String accessToken,
            @RequestParam(required = false) String category, Pageable pageable){
        try {
            System.out.println("Test -------------------------------");
            log.info("Request URI: {}", category);
            Page<Map<String, Object>> articles = articleCategoryFilterService.searchByTag(category, pageable);
            String userEmail = null;
            if (accessToken != null) {
                String token = accessToken.replace("Bearer ", "");
                userEmail = jwtUtil.extractUserEmail(token);
            }
            articleProfileService.matchingProfileWithArticleList(articles, userEmail);
            return ResponseEntity.ok(articles);

        } catch (Exception e) {
            log.error("Error while filtering article: ", e);
            return ResponseEntity.status(500).body(utilTool.createResponse("status","error"));
        }
    }

    // 게시글 조회
    @SecurityRequirement(name = "")
    @GetMapping("/read/{articleId}")
    public ResponseEntity<?> readArticle(
                                         @RequestHeader(value="Authorization", required = false) String accessToken,
                                         @PathVariable String articleId
    ){
        Boolean isMatch = false;
        String userEmail = null;
        if (accessToken != null) {
            String token = accessToken.replace("Bearer ", "");
            userEmail = jwtUtil.extractUserEmail(token);
            isMatch = articleReadService.isMatchWithArticleOwner(userEmail, articleId);
        }
        try {
            ArticleResponseDTO article = articleReadService.searchById(userEmail, articleId, isMatch);
            log.info("Article class: {}", article.getClass());
            if (article != null) {
                log.info("Article Read Completed");
                return ResponseEntity.ok(utilTool.createResponse("status",article));
            } else {
                return ResponseEntity.status(404).body(utilTool.createResponse("status","Article Not Found"));
            }
        } catch(Exception e){
            log.error("Error while reading article: ", e);
            throw new CustomException(CustomErrorCode.ERROR_WHILE_READ_ARTICLE);
        }
    }

    // 인기 게시글 조회
    @SecurityRequirement(name = "")
    @GetMapping("/read/recommend")
    public ResponseEntity<?> readArticleRecommend(@RequestHeader(value="Authorization", required = false) String accessToken) {
        String userEmail = null;
        if (accessToken != null) {
            String token = accessToken.replace("Bearer ", "");
            userEmail = jwtUtil.extractUserEmail(token);
        }
        List<ArticleResponseDTO> result = articleReadService.getRecommendArticle(userEmail);
        return ResponseEntity.ok(Map.of("data", result));
    }

    // 게시글 좋아요
    @PostMapping("/{articleId}/likes")
    public ResponseEntity<?> likeArticle(@AuthenticationPrincipal String userEmail,
                                         @PathVariable String articleId,
                                         @RequestParam(name = "action") String action){
        ArticleLikeDTO result;
        if ("like".equals(action)){
            result = articleLikeService.likeArticle(userEmail, articleId);
        } else {
            result = articleLikeService.unlikeArticle(userEmail, articleId);
        }
        return ResponseEntity.ok(result);
    }

}
