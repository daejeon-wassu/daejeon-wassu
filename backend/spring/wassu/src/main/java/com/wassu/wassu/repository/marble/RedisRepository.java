package com.wassu.wassu.repository.marble;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Repository;

import java.time.Duration;

@Repository
@RequiredArgsConstructor
public class RedisRepository {

    private final String PREFIX = "room:";

    private final StringRedisTemplate redisTemplate;

    public void createCertification(String inviteCode, Long roomId) {
        ValueOperations<String, String> value = redisTemplate.opsForValue();
        value.set(PREFIX + inviteCode, String.valueOf(roomId), Duration.ofSeconds(5 * 60));
    }

    public Long getRoomId(String inviteCode) {
        ValueOperations<String, String> value = redisTemplate.opsForValue();
        String roomId = value.get(PREFIX + inviteCode);
        assert roomId != null;
        return Long.valueOf(roomId);
    }

    public void deleteCertification(String inviteCode) {
        redisTemplate.delete(PREFIX + inviteCode);
    }

    public boolean existsByInviteCode(String inviteCode) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(PREFIX + inviteCode));
    }
}
