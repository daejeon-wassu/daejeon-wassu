package com.wassu.wassu.service.article;

import com.wassu.wassu.entity.ArticleEntity;
import com.wassu.wassu.exception.CustomErrorCode;
import com.wassu.wassu.exception.CustomException;
import com.wassu.wassu.repository.article.ArticleRepository;
import com.wassu.wassu.util.S3Util;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
@Slf4j
public class ArticleDeleteService {
    private ArticleRepository articleRepository;
    private S3Util s3util;

    public void deleteArticle(String articleId){
        try {
            Optional<ArticleEntity> optionalArticle =  articleRepository.findById(articleId);
            if (optionalArticle.isEmpty()){
                log.error("Article Not Found");
                throw new CustomException(CustomErrorCode.ARTICLE_NOT_FOUND);
            }
            ArticleEntity article = optionalArticle.get();
            List<ArticleEntity.Image> articleImageList = article.getImages();
            if (articleImageList != null && !articleImageList.isEmpty()){
                articleImageList.forEach(imageURL -> s3util.deleteFile(imageURL.getUrl()));
            }
            articleRepository.deleteById(articleId);
            log.info("Article Deleted Successfully");
        } catch (Exception e) {
            log.error("Failed to Delete Article");
            throw new CustomException(CustomErrorCode.FAILED_TO_DELETE_ARTICLE);
        }
    }

}
