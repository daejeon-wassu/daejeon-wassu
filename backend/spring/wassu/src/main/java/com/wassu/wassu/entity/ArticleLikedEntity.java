package com.wassu.wassu.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter
@NoArgsConstructor
public class ArticleLikedEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="user_entity_id", nullable = false)
    private UserEntity user;

    @Column(nullable = false)
    private String articleId; // 엘라스틱 article 문서 id (UUID)

    public ArticleLikedEntity(UserEntity user, String articleId) {
        this.user = user;
        user.getArticleLikes().add(this);
        this.articleId = articleId;
    }
}
