package com.mywebsite.dto;

import java.util.Optional;

public record ApiResponse<T>(
    boolean success,
    String message,
    Optional<T> data,
    Optional<String> error
) {
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, Optional.of(data), Optional.empty());
    }

    public static <T> ApiResponse<T> error(String message, String error) {
        return new ApiResponse<>(false, message, Optional.empty(), Optional.of(error));
    }
}
