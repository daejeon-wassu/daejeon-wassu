package com.wassu.wassu.config;

import com.wassu.wassu.entity.BlackListEntity;
import com.wassu.wassu.repository.BlackListRepository;
import com.wassu.wassu.repository.UserRepository;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(
        basePackageClasses = {
                UserRepository.class,
                BlackListRepository.class
        }
)
public class PostgresConfig {
}
