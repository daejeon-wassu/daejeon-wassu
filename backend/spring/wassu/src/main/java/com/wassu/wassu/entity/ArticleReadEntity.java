package com.wassu.wassu.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArticleReadEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="user_entity_id", nullable = false)
    private UserEntity user;

//    @ManyToOne
//    @JoinColumn(name="article_entity_id", nullable = false)
    @Column(nullable = false)
    private String article;
}
