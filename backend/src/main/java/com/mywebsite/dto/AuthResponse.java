package com.mywebsite.dto;

import com.mywebsite.entity.User;

public record AuthResponse(
    String accessToken,
    String refreshToken,
    UserDto user
) {
    public record UserDto(Long id, String email, String username) {
        public static UserDto fromEntity(User user) {
            return new UserDto(user.getId(), user.getEmail(), user.getUsername());
        }
    }
}
