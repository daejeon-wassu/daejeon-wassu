package com.wassu.wassu.eventListener;


import com.wassu.wassu.entity.UserEntity;
import com.wassu.wassu.service.elastic.ElasticsearchService;
import jakarta.persistence.PreRemove;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class UserEntityListener {
    private final ElasticsearchService elasticsearchService;

    @PreRemove
    public void preRemove(UserEntity userEntity) {
        elasticsearchService.deleteArticlesByUserId(userEntity.getId());
    }
}
