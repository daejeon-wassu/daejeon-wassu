package com.wassu.wassu.config;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.access.AccessDeniedHandlerImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

import com.wassu.wassu.security.JwtAuthenticationFilter;
import com.wassu.wassu.config.CORSConfig;
import com.wassu.wassu.exception.CustomAccessDeniedHandler;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    // SecurityFilterChain을 빈으로 등록하여 보안 규칙 설정
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CorsConfigurationSource corsConfigurationSource;
    private final CustomAccessDeniedHandler accessDeniedHandler;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            CorsConfigurationSource corsConfigurationSource,
            CustomAccessDeniedHandler accessDeniedHadler) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.corsConfigurationSource = corsConfigurationSource;
        this.accessDeniedHandler = accessDeniedHadler;

    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, CorsConfigurationSource corsConfigurationSource) throws Exception {
        System.out.println("Security Filter Chain ------------------------");
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests
                                .requestMatchers(
                                        "/wassu/auth/login",
                                        "/wassu/auth/signup",
                                        "/wassu/auth/send-verification-code",
                                        "/wassu/auth/verify-code",
                                        "/wassu/posts/filter",
                                        "/wassu/posts/search",
                                        "/wassu/posts/read/**",
                                        "/wassu/tourist/search",
                                        "/wassu/tourist/filter/**",
                                        "/wassu/tourist/details/**",
                                        "/wassu/tourist/recommend",
                                        "/wassu/marble/**",
                                        "/wassu/marble",
                                        "/wassu/posts/read/**",
                                        "/error",
                                        // swagger
                                        "/swagger/**"
                                ).permitAll()
                                .requestMatchers("/admin/**").hasRole("ADMIN")
                                .anyRequest().authenticated()
                )
                .exceptionHandling(
                        exceptionHandling->
                                exceptionHandling.accessDeniedHandler(accessDeniedHandler)
                )
                .formLogin(formlogin ->
                        formlogin.disable())
                .logout(logout ->
                        logout
                                .permitAll()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        ;
        return http.build();
    };
    // PasswordEncoder 빈으로 등록하여 비밀번호 암호화
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}