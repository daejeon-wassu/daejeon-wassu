package com.wassu.wassu.service.elastic;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.DeleteByQueryRequest;
import co.elastic.clients.elasticsearch.core.DeleteByQueryResponse;
import co.elastic.clients.elasticsearch.core.UpdateRequest;
import co.elastic.clients.elasticsearch.core.UpdateResponse;
import co.elastic.clients.json.JsonData;
import com.wassu.wassu.exception.CustomErrorCode;
import com.wassu.wassu.exception.CustomException;
import jakarta.json.Json;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.sql.Delete;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
@AllArgsConstructor
public class ElasticsearchService {

    private final ElasticsearchClient elasticsearchClient;

    public void deleteArticlesByUserId(Long userId) {
        try {
            DeleteByQueryRequest deleteByQueryRequest = DeleteByQueryRequest.of(d -> d
                    .index("article")
                    .query(q -> q
                            .term(t -> t
                                    .field("user")
                                    .value(v ->v
                                            .longValue(userId))))
            );
            DeleteByQueryResponse response = elasticsearchClient.deleteByQuery(deleteByQueryRequest);
            log.info("Delete Article By Orphan Removal");
        } catch (Exception e) {
            log.error("Error while orphan removal by user id");
            throw new CustomException(CustomErrorCode.FAILED_TO_DELETE_ARTICLE);
        }
    }

    public void updateFavoriteCount(String elasticSpotId, int newCount) {
        try {

            Map<String, Object> updateFields = new HashMap<>();
            updateFields.put("favorite_count", newCount);

        } catch (Exception e) {
            log.error("Error while updating favorite count for elastic spot id");
            throw new CustomException(CustomErrorCode.EXCEPTION_IN_LISTENER);
        }
    }

}
