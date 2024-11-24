package com.wassu.wassu.service.article;


import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.FieldValue;
import co.elastic.clients.elasticsearch._types.query_dsl.*;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.json.JsonData;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wassu.wassu.exception.CustomErrorCode;
import com.wassu.wassu.exception.CustomException;
import com.wassu.wassu.repository.article.ArticleRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


@Service
@Slf4j
public class ArticleSearchServiceImpl implements ArticleSearchService {

    private final ElasticsearchClient elasticsearchClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    public ArticleSearchServiceImpl(ElasticsearchClient elasticsearchClient) {
        this.elasticsearchClient = elasticsearchClient;
    }

    @Override
    public Page<Map<String, Object>> searchByText(
            String searchText, List<String> tags, Pageable pageable
    ){
        try {
            log.info("Start to search article with searchText: {}, tags: {}", searchText, tags);

            List<Query> mustQueries = new ArrayList<>();
//            List<Query> filterQueries = new ArrayList<>();
            
            // 제목과 내용에 대해 검색 조건 추가
            if (searchText != null && !searchText.trim().isEmpty()) {
                log.info("SearchText Exists");
                Query multiMatchQuery = Query.of(
                        q -> q.multiMatch(MultiMatchQuery.of(
                                m -> m.fields(List.of("title", "content"))
                                        .query(searchText)
                                        .type(TextQueryType.BestFields)
                        ))
                );
                log.info("MultiMatchQuery: {}", multiMatchQuery);
                mustQueries.add(multiMatchQuery);
            } else {
                mustQueries.add(Query.of(q -> q.matchAll(m -> m)));
            }

            BoolQuery.Builder boolQueryBuilder = new BoolQuery.Builder()
                    .must(mustQueries);

            Query finalQuery = Query.of(q -> q.bool(boolQueryBuilder.build()));
            log.info("finalQuery: {}", finalQuery);

            SearchRequest request = new SearchRequest.Builder()
                    .index("article")
                    .query(finalQuery)
                    .from((int) pageable.getOffset())
                    .size(pageable.getPageSize())
                    .build();
            log.info("Request: {}", request);
            log.info("Request Index: {}", request.index());

            log.info("Elasticsearch Query Request: {}", request);

            SearchResponse<JsonData> response = elasticsearchClient.search(request, JsonData.class);

            log.info("Elasticsearch Query Response: {}", response);

            List<Map<String, Object>> articles = response.hits().hits().stream()
                    .map(hit -> {
                        try {
                            return (Map<String, Object>) hit.source().to(Map.class);
                        } catch (Exception e) {
                            log.error("Error converting to Map<String, Object> while searching", e);
                            return null;
                        }
                    })
                            .filter(map -> map != null)
                                    .toList();
            log.info("Articles --------- : {}", articles);

            long totalHits = response.hits().total() != null ? response.hits().total().value() : 0L;
//
            return new PageImpl<>(articles, pageable, totalHits);

        } catch (Exception e) {
            log.error("Error while search: {}", e.getMessage());
            throw new CustomException(CustomErrorCode.FAILED_TO_SEARCH);
        }
    }
}
