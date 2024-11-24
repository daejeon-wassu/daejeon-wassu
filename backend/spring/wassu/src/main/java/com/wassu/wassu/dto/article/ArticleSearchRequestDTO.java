package com.wassu.wassu.dto.article;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@Getter
@Setter
public class ArticleSearchRequestDTO {
    private String searchText;
    private List<String> tags;

    public ArticleSearchRequestDTO() {
    }

    public ArticleSearchRequestDTO(String searchText, List<String> tags) {
        this.searchText = searchText;
        this.tags = tags;
    }

}
