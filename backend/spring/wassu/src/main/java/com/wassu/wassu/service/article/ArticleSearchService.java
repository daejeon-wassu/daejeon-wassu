package com.wassu.wassu.service.article;


import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.json.JsonData;
import com.wassu.wassu.entity.ArticleEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface ArticleSearchService {
    Page<Map<String, Object>> searchByText(String searchText, List<String> tags, Pageable pageable) throws IOException;
}
