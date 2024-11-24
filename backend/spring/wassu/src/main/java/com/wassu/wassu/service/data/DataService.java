package com.wassu.wassu.service.data;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.UpdateRequest;
import co.elastic.clients.elasticsearch.core.search.Hit;
import com.wassu.wassu.config.AmazonS3Config;
import com.wassu.wassu.entity.ElasticTouristSpotEntity;
import com.wassu.wassu.exception.CustomErrorCode;
import com.wassu.wassu.exception.CustomException;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import co.elastic.clients.elasticsearch._types.query_dsl.*;

import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@AllArgsConstructor
public class DataService {

    private ElasticsearchClient elasticsearchClient;

    private final AmazonS3Config amazonS3Config;

    public void uploadCSV(MultipartFile file) throws IOException {
        try (
                BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
                CSVParser csvParser = CSVFormat.DEFAULT.builder()
                        .setHeader()
                        .setSkipHeaderRecord(true)
                        .build()
                        .parse(reader)
                ){
            List<ElasticTouristSpotEntity> spots = new ArrayList<>();

            for (CSVRecord record : csvParser) {
                ElasticTouristSpotEntity spot = new ElasticTouristSpotEntity();

                String latitudeStr = record.get("latitude").trim();
                String longitudeStr = record.get("longitude").trim();

                spot.setId(record.get("id").trim());
                spot.setSpotName(record.get("spot_name"));
                spot.setSpotAddress(record.get("spot_address"));
                spot.setSpotDescription(record.get("spot_description"));

                spot.setLatitude(latitudeStr.isEmpty() ? null : Double.parseDouble(latitudeStr));
                spot.setLongitude(longitudeStr.isEmpty() ? null : Double.parseDouble(longitudeStr));
                spot.setPhoneNumber(record.get("phone"));
                spot.setBusinessHour(record.get("business_hours"));
                spot.setLiked(0);
                spot.setStamp(0);

                String categoryValue = record.get("tag").trim();
                List<ElasticTouristSpotEntity.Category> categories = new ArrayList<>();
                for (String category: categoryValue.split("; ")) {
                    categories.add(new ElasticTouristSpotEntity.Category(category.trim()));
                }
                spot.setCategories(categories);

                List<ElasticTouristSpotEntity.Image> images = new ArrayList<>();
//                String imagsValue = record.get("images").trim();
//                if (imagsValue != null && !imagsValue.isEmpty()) {
//                for (String image: imagsValue.split("; ")) {
//                    images.add(new ElasticTouristSpotEntity.Image());
//                }
//                }
                for (int i = 1 ; i <= Integer.parseInt(record.get("image_count")); i++) {
                    images.add(
                            new ElasticTouristSpotEntity.Image(
                                    "https://" + amazonS3Config.getBucket() + ".s3." +
                                            amazonS3Config.getRegion() + ".amazonaws.com/tourist_spot_image/" +
                                            record.get("spot_name") + "_(" + i + ")" + ".jpg"
                            )
                    );
                }
                spot.setImages(images);


                spot.setImages(images);
                spots.add(spot);
            }

            for (ElasticTouristSpotEntity spot : spots) {
                elasticsearchClient.index(i -> i
                        .index("elastic_tourist_spot")
                        .id(spot.getId())
                        .document(spot)
                );
            }

        } catch(Exception e) {
            log.error("Tourist spot upload failed");
            throw e;
        }
    }

    // 이미지 없는 애들 이미지 업데이트
    public void updateElasticImage(int size) throws IOException {
        try {
            Query nestedQuery = Query.of(nq -> nq.nested(NestedQuery.of(n -> n
                    .path("images")
                    .query(Query.of(q -> q
                            .exists(e -> e
                                    .field("images.image")
                            )
                    )
                    )
            )
            )
            );

            BoolQuery boolQuery = BoolQuery.of(b -> b
                    .mustNot(nestedQuery)
            );

            Query searchQuery = Query.of(q -> q.bool(boolQuery));

            SearchRequest searchRequest = SearchRequest.of(s -> s
                    .index("elastic_tourist_spot")
                    .query(searchQuery)
                    .size(size));

            SearchResponse<ElasticTouristSpotEntity> searchResponse = elasticsearchClient.search(
                    searchRequest,
                    ElasticTouristSpotEntity.class
            );

            List<Hit<ElasticTouristSpotEntity>> hits = searchResponse.hits().hits();

            if (hits.isEmpty()){
                log.info("No documents found with empty images.");
                return;
            }

            for (Hit<ElasticTouristSpotEntity> hit : hits) {
                ElasticTouristSpotEntity entity = hit.source();
                if (entity == null) {
                    continue;
                }

                String spotName = entity.getSpotName();
                List<ElasticTouristSpotEntity.Image> newImages = new ArrayList<>();
                newImages.add(new ElasticTouristSpotEntity.Image(
                        "https://" + amazonS3Config.getBucket() + ".s3." + amazonS3Config.getRegion() +
                                ".amazonaws.com/tourist_spot_image/" + spotName + "_(1).jpg"
                ));
                newImages.add(new ElasticTouristSpotEntity.Image(
                        "https://" + amazonS3Config.getBucket() + ".s3." + amazonS3Config.getRegion() +
                                ".amazonaws.com/tourist_spot_image/" + spotName + "_(2).jpg"
                ));
                entity.setImages(newImages);

                UpdateRequest<ElasticTouristSpotEntity, ElasticTouristSpotEntity> updateRequest = UpdateRequest.of(u -> u
                        .index("elastic_tourist_spot")
                        .id(entity.getId())
                        .doc(entity));

                elasticsearchClient.update(updateRequest, ElasticTouristSpotEntity.class);
                log.info("Updated document with ID : {}", entity.getId());
            }
            System.out.println("Elastic Image data updated successfully -----------------------------------");

        }catch (Exception e) {
            log.error("Elastic tourist spot image data upload failed");
            throw new CustomException(CustomErrorCode.IMAGE_UPLOADING_FAILED);
        }
    }
}
