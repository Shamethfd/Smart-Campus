package com.smartcampus.service;

import com.smartcampus.dto.UserResponseDto;
import com.smartcampus.model.User;
import com.smartcampus.repository.UserRepository;
import com.smartcampus.security.JwtTokenProvider;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

/**
 * Auth Service - utility methods.
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository,
                       JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public UserResponseDto mapToDto(User user) {
        return new UserResponseDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getProfilePicture(),
                user.getAuthProvider(),
                user.getRole(),
                user.isActive(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
