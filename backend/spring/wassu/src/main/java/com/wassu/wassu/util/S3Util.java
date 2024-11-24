package com.wassu.wassu.util;

import com.wassu.wassu.exception.CustomErrorCode;
import com.wassu.wassu.exception.CustomException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.ProfileCredentialsProvider;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.regions.Region;

import java.io.IOException;
import java.net.URLConnection;
import java.util.UUID;

@Slf4j
@Component
public class S3Util {

    private final S3Client s3Client;
    private final String bucketName;
    private final String region;
//
    public S3Util(
            @Value("${aws.s3.secretKey}") String secretKey,
            @Value("${aws.s3.region}") String region,
            @Value("${aws.s3.accessKeyId}") String accessKeyId,
            @Value("${aws.s3.bucket}") String bucketName
    ) {
        AwsBasicCredentials awsCreds = AwsBasicCredentials.create(accessKeyId, secretKey);
//        this.region = region;
        this.bucketName = bucketName;
        this.s3Client = S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(awsCreds))
                .build();
        this.region = region;
    }

    // 파일 고유 이름 생성 및 파일 업로드
    public String uploadFile(MultipartFile file, String folderName) {
        String fileName;
        if (file == null || file.isEmpty()) {
            log.info("File is empty");
            fileName = folderName +  "/default.png";
            return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, fileName);
        } else {
            fileName = folderName + "/" + UUID.randomUUID().toString() + '_' + file.getOriginalFilename();
        }
        try {
            String mimeType = URLConnection.guessContentTypeFromName(file.getOriginalFilename());
            if (mimeType == null) {
                mimeType = "application/octet-stream";
            }
            s3Client.putObject(
                    PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(fileName)
                            .contentType(mimeType)
                            .contentDisposition("inline")
                            .build(),
                    RequestBody.fromBytes(file.getBytes())
            );
            log.info("File S3 Uploaded Successfully");
            return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, fileName);
        } catch (Exception e) {
            log.error("File S3 Uploaded Failed: {}", e.getMessage());
            throw new CustomException(CustomErrorCode.FAILED_TO_UPLOAD_S3);
        }
    }
    
    // S3 파일 삭제
    public void deleteFile(String fileURL) {
        try {
            if (fileURL == null) {
                log.info("S3 upload file is null");
                throw new CustomException(CustomErrorCode.FAILED_TO_DELETE_IMAGE);
            }
            String fileName = fileURL.substring(fileURL.lastIndexOf("/") + 1);
            s3Client.deleteObject(
                    DeleteObjectRequest.builder()
                            .bucket(bucketName)
                            .key(fileName)
                            .build()
            );
            log.info("File S3 Deleted Successfully");
        } catch (Exception e) {
            log.error("File S3 Deleted Failed: {}", e.getMessage());
            throw new CustomException(CustomErrorCode.FAILED_TO_DELETE_IMAGE);
        }
    }
}
