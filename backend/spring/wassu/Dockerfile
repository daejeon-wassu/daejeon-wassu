# 1. Amazon Corretto 17 이미지를 사용
FROM amazoncorretto:17 as builder

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 프로젝트의 gradle과 소스 파일 복사
COPY build.gradle settings.gradle gradlew ./
COPY gradle gradle
COPY src src

# 4. 필요한 권한을 부여하고 Gradle을 사용하여 프로젝트 빌드
RUN chmod +x gradlew
RUN ./gradlew build --no-daemon

# 5. 빌드 결과물을 최종 이미지에 복사
FROM amazoncorretto:17
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar

# 6. 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"]
