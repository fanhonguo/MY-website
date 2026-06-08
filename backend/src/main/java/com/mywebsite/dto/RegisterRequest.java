package com.mywebsite.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.regex.Pattern;

public record RegisterRequest(
    @NotBlank(message = "邮箱不能为空")
    @Email(message = "邮箱格式不正确")
    String email,

    @NotBlank(message = "密码不能为空")
    @Size(min = 8, message = "密码至少需要8个字符")
    String password,

    @NotBlank(message = "用户名不能为空")
    @Size(min = 2, max = 50, message = "用户名长度必须在2-50个字符之间")
    String username
) {
    // 密码强度验证：必须包含大写字母、小写字母、数字和特殊字符
    private static final Pattern PASSWORD_PATTERN =
        Pattern.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$");

    public RegisterRequest {
        if (!PASSWORD_PATTERN.matcher(password).matches()) {
            throw new IllegalArgumentException(
                "密码必须包含至少一个大写字母、一个小写字母、一个数字和一个特殊字符"
            );
        }
    }
}
