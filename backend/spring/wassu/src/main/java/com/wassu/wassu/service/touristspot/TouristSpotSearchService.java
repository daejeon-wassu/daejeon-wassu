package com.wassu.wassu.service.touristspot;


import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.query_dsl.*;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.json.JsonData;
import com.wassu.wassu.entity.UserEntity;
import com.wassu.wassu.entity.touristspot.TouristSpotStampEntity;
import com.wassu.wassu.exception.CustomErrorCode;
import com.wassu.wassu.exception.CustomException;
import com.wassu.wassu.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Slf4j
@AllArgsConstructor
public class TouristSpotSearchService {

    private final ElasticsearchClient elasticsearchClient;
    private final UserRepository userRepository;

    public Page<Map<String, Object>> searchByText(String searchText, Pageable pageable) throws IOException {
        log.info("Search Tourist Spot by Text");

        List<Query> mustQueries = new ArrayList<>();

        try {
            if (searchText != null && !searchText.trim().isEmpty()) {
                log.info("Search text: {}", searchText);
                Query multiMatchQuery = Query.of(
                        q -> q.multiMatch(MultiMatchQuery.of(
                                m -> m.fields(List.of("spotName^2", "spotAddress"))
                                        .query(searchText)
                                        .type(TextQueryType.BestFields)
                                        .operator(Operator.Or)
//                                        .fuzziness("AUTO")
                                        .minimumShouldMatch("1")
                        ))
                );
                mustQueries.add(multiMatchQuery);
            } else {
                mustQueries.add(Query.of(q -> q.matchAll(m -> m)));
            }

            BoolQuery.Builder boolQueryBuilder = new BoolQuery.Builder()
                    .must(mustQueries);
            Query finalQuery = Query.of(q -> q.bool(boolQueryBuilder.build()));

            log.info("Final Queyr: {}", finalQuery);

            SearchRequest request = new SearchRequest.Builder()
                    .index("elastic_tourist_spot")
                    .query(finalQuery)
                    .from((int) pageable.getOffset())
                    .size(pageable.getPageSize())
                    .build();
            log.info("Request: {}", request);

            SearchResponse<JsonData> response = elasticsearchClient.search(request, JsonData.class);
            log.info("Search response: {}", response);

            List<Map<String, Object>> touristSpots = response.hits().hits().stream()
                    .map(hit -> {
                        try {
                            return (Map<String, Object>) hit.source().to(Map.class);
                        } catch (Exception e) {
                            log.error("Error converting to Mat<String, Object> while searching tourist spot: {}", e.getMessage());
                            return null;
                        }
                    })
                    .filter(map -> map != null)
                    .toList();

            log.info("Tourist Spot Search Result: {}", touristSpots);
            long totalHits = response.hits().total() != null ? response.hits().total().value() : 0L;

            long actualTotal = Math.min(totalHits, touristSpots.size() + pageable.getOffset());

            return new PageImpl<>(touristSpots, pageable, actualTotal);

        } catch(Exception e) {
            log.error("Exception in search tourist spot: {}", e.getMessage());
            throw new CustomException(CustomErrorCode.ERROR_WHILE_SEARCH_TOURIST_SPOT);
        }
    }

    public Page<Map<String, Object>> filteringByCategory(String category, Pageable pageable) throws IOException {
        try{
            log.info("Start Searching Tourist Spot by Category");
            Query query;

            if (category == null || category.trim().isEmpty()) {
                query = Query.of(q -> q.matchAll(m -> m));
            } else {
                query = Query.of(
                        q -> q.nested(
                                n -> n.path("categories")
                                        .query(
                                                nq -> nq.term(
                                                        t -> t.field("categories.category")
                                                                .value(category)
                                                )
                                        )
                        )
                );
            }

            log.info("Query to filtering: {}", query);

            SearchRequest request = new SearchRequest.Builder()
                    .index("elastic_tourist_spot")
                    .query(query)
                    .from((int) pageable.getOffset())
                    .size(pageable.getPageSize())
                    .build();

            log.info("Request to filtering category: {}", request);

            SearchResponse<JsonData> response = elasticsearchClient.search(request, JsonData.class);

            log.info("Filtering response: {}", response);

            List<Map<String, Object>> result = response.hits().hits().stream()
                    .map(hit -> {
                        try{
                            return (Map<String, Object>) hit.source().to(Map.class);
                        } catch (Exception e) {
                            log.error("Error converting to Mat<String, Object> while searching tourist spot: {}", e.getMessage());
                            return null;
                        }
                    })
                    .filter(map -> map != null)
                    .toList();

            long totalHits = response.hits().total() != null ? response.hits().total().value() : 0L;

            long actualTotal = Math.min(totalHits, result.size() + pageable.getOffset());

            return new PageImpl<>(result, pageable, actualTotal);

        } catch (Exception e) {
            log.error("Exception while filteringByCategory: {}", e.getMessage());
            throw new CustomException(CustomErrorCode.FAILED_TO_FILTERING_BY_CATEGORY);
        }
    }
}
