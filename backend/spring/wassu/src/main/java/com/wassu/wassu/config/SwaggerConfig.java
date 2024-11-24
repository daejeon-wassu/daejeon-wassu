package com.wassu.wassu.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Value("${server.domain}")
    private String serverDomain;

    @Bean
    public OpenAPI customOpenAPI() {
        Server server = new Server();
        server.setUrl("https://" + serverDomain);
        server.setDescription("Production server");

        // 보안 스키마 설정
        SecurityScheme securityScheme = new SecurityScheme()
                .name("Bearer Authentication")
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT");

        // 보안 요구사항 설정
        SecurityRequirement securityRequirement = new SecurityRequirement()
                .addList("Bearer Authentication");

        return new OpenAPI()
                .addServersItem(server) // 서버 설정 추가
                .addSecurityItem(securityRequirement) // 보안 요구사항 추가
                .components(new io.swagger.v3.oas.models.Components().addSecuritySchemes("Bearer Authentication", securityScheme)); // 보안 스키마 추가
    }
}
