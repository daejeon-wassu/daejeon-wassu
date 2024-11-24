package com.wassu.wassu.security;

import com.wassu.wassu.repository.BlackListRepository;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.security.Security;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.security.Key;

@Component
public class JwtUtil {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

    private final Key key;

    private final Long accessTokenExpiration;
    private final Long refreshTokenExpiration;
    private final String algorithm;
    private final BlackListRepository blackListRepository;

    public JwtUtil(
            @Value("${JWT_SECRET}") String secretKey,
            @Value("${JWT_ACCESS_EXPIRATION}") Long accessTokenExpiration,
            @Value("${JWT_REFRESH_EXPIRATION}") Long refreshTokenExpiration,
            @Value("${JWT_ALGORITHM}") String algorithm, BlackListRepository blackListRepository) {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.accessTokenExpiration = accessTokenExpiration;
        this.refreshTokenExpiration = refreshTokenExpiration;
        this.algorithm = algorithm;
        this.blackListRepository = blackListRepository;
    }

    public String generateToken(String email, String tokenType) {
        long now = System.currentTimeMillis();
        long expiration = accessTokenExpiration;
        if (tokenType.equals("refresh")) {
            expiration = refreshTokenExpiration;
        }
        logger.info("TokenType: {}", tokenType);
        logger.info("Expiration: {}", expiration);
        logger.info("Current time: {}", now);
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + expiration))
                .signWith(key, getSignatureAlgorithm())
                .compact();
    }

    public String extractUserEmail(String token) {
        logger.info("Extracting user email from JWT: {}", parseClaims(token).getSubject());
        return parseClaims(token).getSubject();
    }

    public Boolean validateToken(String token) {
        if (blackListRepository.existsByToken(token)) {
            logger.info("Blacklisted token: {}", token);
            return false;
        }
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            if (blackListRepository.existsByToken(token)) {
                logger.info("Blacklisted token: {}", token);
                return false;
            }
            return true;
        } catch (SecurityException | MalformedJwtException e) {
            logger.info("Invalid JWT: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            System.out.println("Expired JWT --------------------------");
            logger.info("Expired JWT: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.info("Unsupported JWT: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.info("JWT claims string is empty.");
        }
        return false;
    }

    public Boolean isTokenExpired(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
        } catch (ExpiredJwtException e) {
            logger.error ("Expired JWT: {}", e.getMessage());
            return true;
        }
        return false;
    }


    //-------------------------------------------------------------------------------

    private SignatureAlgorithm getSignatureAlgorithm() {
        try {
            return SignatureAlgorithm.valueOf(this.algorithm);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid JWT algorithm");
        }
    }

    private Claims parseClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            logger.error("Expired JWT token");
            return e.getClaims();
        }
    }
}