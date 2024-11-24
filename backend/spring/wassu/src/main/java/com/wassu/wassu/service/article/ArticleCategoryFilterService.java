package com.wassu.wassu.service.article;


import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.SortOptions;
import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.query_dsl.*;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.json.JsonData;
import com.wassu.wassu.exception.CustomErrorCode;
import com.wassu.wassu.exception.CustomException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
@AllArgsConstructor
public class ArticleCategoryFilterService {
    private final ElasticsearchClient elasticsearchClient;
    private final ArticleProfileService articleProfileService;

    public Page<Map<String, Object>> searchByTag(String tag, Pageable pageable) {
        try {
            log.info("Start to search article with tag");

            Query query = (tag == null || tag.trim().isEmpty())
                    ? Query.of(q -> q.matchAll(ma -> ma))
                    : Query.of(q -> q
                        .nested(n -> n
                                .path("tags")
                                .query(nq -> nq
                                        .term(t -> t
                                                .field("tags.tag")
                                                .value(tag)
                                        )
                                )
                        )
                    );
            SortOptions sortOptions = SortOptions.of(so -> so
                    .field(f -> f
                            .field("updatedAt")
                            .order(SortOrder.Desc)
                    )
            );

            log.info("Query for filtering: {}", query);

            SearchRequest request = new SearchRequest.Builder()
                    .index("article")
                    .query(query)
                    .sort(sortOptions)
                    .from((int) pageable.getOffset())
                    .size(pageable.getPageSize())
                    .build();

            log.info("Request to search article with tag {}", request);

            SearchResponse<JsonData> response = elasticsearchClient.search(request, JsonData.class);

            log.info("Response Result: {}", response);

            List<Map<String, Object>> articles = response.hits().hits().stream()
                    .map(hit -> {
                        try {
                            return (Map<String, Object>) hit.source().to(Map.class);
                        } catch (Exception e) {
                            log.error("Error converting to Map<String, Object> whild searching", e);
                            return null;
                        }
                    })
                    .filter(map -> map != null)
                    .toList();

            long totalHits = response.hits().total() != null ? response.hits().total().value() : 0L;

            return new PageImpl<>(articles, pageable, totalHits);

        } catch (Exception e) {
            log.error("Error while searching by tag", e);
            throw new CustomException(CustomErrorCode.FAILED_TO_SEARCH_BY_TAG);
        }
    }
}
