# 认证系统实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个用户认证系统，支持邮箱注册、密码登录、Token 认证和记住登录功能

**架构:** 前后端分离架构 - React 前端负责 UI 和状态管理，Spring Boot 后端负责业务逻辑和数据持久化，使用 PostgreSQL 存储用户数据，JWT 进行无状态认证

**Tech Stack:** React, Vite, Tailwind CSS, Redux Toolkit, Spring Boot 3.x, PostgreSQL, Spring Security, JWT, BCrypt

---

## 文件结构

### 前端文件
```
frontend/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── components/
    │   ├── ui/
    │   │   ├── Button.jsx
    │   │   ├── Input.jsx
    │   │   ├── PasswordInput.jsx
    │   │   └── Card.jsx
    │   └── auth/
    │       ├── LoginForm.jsx
    │       └── RegisterForm.jsx
    ├── pages/
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   └── Home.jsx
    ├── store/
    │   ├── store.js
    │   └── slices/
    │       └── authSlice.js
    ├── services/
    │   └── api.js
    └── utils/
        └── validation.js
```

### 后端文件
```
backend/
├── pom.xml
└── src/
    └── main/
        ├── java/com/mywebsite/
        │   ├── MyWebsiteApplication.java
        │   ├── controller/
        │   │   └── AuthController.java
        │   ├── service/
        │   │   └── AuthService.java
        │   ├── repository/
        │   │   └── UserRepository.java
        │   ├── entity/
        │   │   └── User.java
        │   ├── dto/
        │   │   ├── LoginRequest.java
        │   │   ├── RegisterRequest.java
        │   │   ├── AuthResponse.java
        │   │   └── ApiResponse.java
        │   ├── security/
        │   │   ├── JwtUtil.java
        │   │   ├── JwtAuthenticationFilter.java
        │   │   ├── SecurityConfig.java
        │   │   └── PasswordEncoderConfig.java
        │   ├── config/
        │   │   └── CorsConfig.java
        │   └── exception/
        │       └── GlobalExceptionHandler.java
        └── resources/
            └── application.properties
```

---

## Phase 1: 后端项目初始化

### Task 1: 创建 Spring Boot 项目结构

**Files:**
- Create: `backend/pom.xml`
- Create: `backend/src/main/resources/application.properties`
- Create: `backend/src/main/java/com/mywebsite/MyWebsiteApplication.java`

- [ ] **Step 1: 创建 pom.xml**

创建 `backend/pom.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>

    <groupId>com.mywebsite</groupId>
    <artifactId>my-website-backend</artifactId>
    <version>1.0.0</version>
    <name>my-website-backend</name>
    <description>Authentication backend for personal website</description>

    <properties>
        <java.version>17</java.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Spring Boot Security -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>

        <!-- Spring Boot Data JPA -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!-- Spring Boot Validation -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- PostgreSQL Driver -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.12.3</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.12.3</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.12.3</version>
            <scope>runtime</scope>
        </dependency>

        <!-- Lombok (optional, for cleaner code) -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

- [ ] **Step 2: 创建 application.properties**

创建 `backend/src/main/resources/application.properties`:

```properties
# Server Configuration
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/mywebsite
spring.datasource.username=${DB_USERNAME:postgres}
spring.datasource.password=${DB_PASSWORD:postgres}
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# JWT Configuration
jwt.secret=${JWT_SECRET:myDefaultSecretKeyThatIsAtLeast256BitsLongForHS512AlgorithmPleaseChangeInProduction
jwt.access-token-expiration=900000
jwt.refresh-token-expiration=604800000
jwt.refresh-token-expiration-remember=2592000000

# CORS Configuration
cors.allowed-origins=${ALLOWED_ORIGINS:http://localhost:5173,http://localhost:3000}
```

- [ ] **Step 3: 创建主应用类**

创建 `backend/src/main/java/com/mywebsite/MyWebsiteApplication.java`:

```java
package com.mywebsite;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MyWebsiteApplication {

    public static void main(String[] args) {
        SpringApplication.run(MyWebsiteApplication.class, args);
    }
}
```

- [ ] **Step 4: 创建目录结构**

```bash
mkdir -p backend/src/main/java/com/mywebsite/{controller,service,repository,entity,dto,security,config,exception}
```

- [ ] **Step 5: 验证项目结构**

```bash
cd backend
mvn clean compile
```

预期输出: BUILD SUCCESS

- [ ] **Step 6: 提交**

```bash
cd backend
git init
git add .
git commit -m "feat: initialize Spring Boot project structure"
```

---

### Task 2: 创建数据库实体类

**Files:**
- Create: `backend/src/main/java/com/mywebsite/entity/User.java`

- [ ] **Step 1: 创建 User 实体类**

创建 `backend/src/main/java/com/mywebsite/entity/User.java`:

```java
package com.mywebsite.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 255)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(unique = true, length = 50)
    private String username;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Constructors
    public User() {}

    public User(String email, String password, String username) {
        this.email = email;
        this.password = password;
        this.username = username;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
```

- [ ] **Step 2: 提交**

```bash
git add backend/src/main/java/com/mywebsite/entity/User.java
git commit -m "feat: add User entity"
```

---

### Task 3: 创建 DTO 类

**Files:**
- Create: `backend/src/main/java/com/mywebsite/dto/LoginRequest.java`
- Create: `backend/src/main/java/com/mywebsite/dto/RegisterRequest.java`
- Create: `backend/src/main/java/com/mywebsite/dto/AuthResponse.java`
- Create: `backend/src/main/java/com/mywebsite/dto/ApiResponse.java`

- [ ] **Step 1: 创建 LoginRequest**

创建 `backend/src/main/java/com/mywebsite/dto/LoginRequest.java`:

```java
package com.mywebsite.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
    @NotBlank(message = "邮箱不能为空")
    @Email(message = "邮箱格式不正确")
    String email,

    @NotBlank(message = "密码不能为空")
    String password
) {}
```

- [ ] **Step 2: 创建 RegisterRequest**

创建 `backend/src/main/java/com/mywebsite/dto/RegisterRequest.java`:

```java
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
```

- [ ] **Step 3: 创建 AuthResponse**

创建 `backend/src/main/java/com/mywebsite/dto/AuthResponse.java`:

```java
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
```

- [ ] **Step 4: 创建 ApiResponse**

创建 `backend/src/main/java/com/mywebsite/dto/ApiResponse.java`:

```java
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
```

- [ ] **Step 5: 提交**

```bash
git add backend/src/main/java/com/mywebsite/dto/
git commit -m "feat: add DTO classes for authentication"
```

---

### Task 4: 创建 Repository

**Files:**
- Create: `backend/src/main/java/com/mywebsite/repository/UserRepository.java`

- [ ] **Step 1: 创建 UserRepository**

创建 `backend/src/main/java/com/mywebsite/repository/UserRepository.java`:

```java
package com.mywebsite.repository;

import com.mywebsite.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);
}
```

- [ ] **Step 2: 提交**

```bash
git add backend/src/main/java/com/mywebsite/repository/UserRepository.java
git commit -m "feat: add UserRepository"
```

---

### Task 5: 创建 JWT 工具类

**Files:**
- Create: `backend/src/main/java/com/mywebsite/security/JwtUtil.java`

- [ ] **Step 1: 创建 JwtUtil**

创建 `backend/src/main/java/com/mywebsite/security/JwtUtil.java`:

```java
package com.mywebsite.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.access-token-expiration}")
    private long accessTokenExpiration;

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    @Value("${jwt.refresh-token-expiration-remember}")
    private long refreshTokenExpirationRemember;

    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateAccessToken(Long userId, String email) {
        return Jwts.builder()
            .subject(String.valueOf(userId))
            .claim("email", email)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + accessTokenExpiration))
            .signWith(getSigningKey())
            .compact();
    }

    public String generateRefreshToken(Long userId, boolean rememberMe) {
        long expiration = rememberMe ? refreshTokenExpirationRemember : refreshTokenExpiration;
        return Jwts.builder()
            .subject(String.valueOf(userId))
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(getSigningKey())
            .compact();
    }

    public Long getUserIdFromToken(String token) {
        Claims claims = Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
        return Long.parseLong(claims.getSubject());
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
```

- [ ] **Step 2: 提交**

```bash
git add backend/src/main/java/com/mywebsite/security/JwtUtil.java
git commit -m "feat: add JWT utility"
```

---

### Task 6: 创建密码编码配置

**Files:**
- Create: `backend/src/main/java/com/mywebsite/security/PasswordEncoderConfig.java`

- [ ] **Step 1: 创建 PasswordEncoderConfig**

创建 `backend/src/main/java/com/mywebsite/security/PasswordEncoderConfig.java`:

```java
package com.mywebsite.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class PasswordEncoderConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }
}
```

- [ ] **Step 2: 提交**

```bash
git add backend/src/main/java/com/mywebsite/security/PasswordEncoderConfig.java
git commit -m "feat: add password encoder configuration"
```

---

### Task 7: 创建认证过滤器

**Files:**
- Create: `backend/src/main/java/com/mywebsite/security/JwtAuthenticationFilter.java`

- [ ] **Step 1: 创建 JwtAuthenticationFilter**

创建 `backend/src/main/java/com/mywebsite/security/JwtAuthenticationFilter.java`:

```java
package com.mywebsite.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final Long userId;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        userId = jwtUtil.getUserIdFromToken(jwt);

        if (userId != null && jwtUtil.validateToken(jwt)) {
            UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(userId, null, new ArrayList<>());
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }

        filterChain.doFilter(request, response);
    }
}
```

- [ ] **Step 2: 提交**

```bash
git add backend/src/main/java/com/mywebsite/security/JwtAuthenticationFilter.java
git commit -m "feat: add JWT authentication filter"
```

---

### Task 8: 创建安全配置

**Files:**
- Create: `backend/src/main/java/com/mywebsite/security/SecurityConfig.java`

- [ ] **Step 1: 创建 SecurityConfig**

创建 `backend/src/main/java/com/mywebsite/security/SecurityConfig.java`:

```java
package com.mywebsite.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
```

- [ ] **Step 2: 提交**

```bash
git add backend/src/main/java/com/mywebsite/security/SecurityConfig.java
git commit -m "feat: add security configuration"
```

---

### Task 9: 创建 CORS 配置

**Files:**
- Create: `backend/src/main/java/com/mywebsite/config/CorsConfig.java`

- [ ] **Step 1: 创建 CorsConfig**

创建 `backend/src/main/java/com/mywebsite/config/CorsConfig.java`:

```java
package com.mywebsite.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Value("${cors.allowed-origins}")
    private String allowedOrigins;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

- [ ] **Step 2: 更新 SecurityConfig 以启用 CORS**

更新 `backend/src/main/java/com/mywebsite/security/SecurityConfig.java`，在 securityFilterChain 方法中添加:

```java
.cors(cors -> cors.configurationSource(corsConfigurationSource()))
```

完整的 securityFilterChain 方法:

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http,
                                              CorsConfigurationSource corsConfigurationSource)
        throws Exception {
    http
        .cors(cors -> cors.configurationSource(corsConfigurationSource))
        .csrf(csrf -> csrf.disable())
        .sessionManagement(session ->
            session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        )
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**").permitAll()
            .anyRequest().authenticated()
        )
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
}
```

同时添加导入:
```java
import org.springframework.web.cors.CorsConfigurationSource;
```

- [ ] **Step 3: 提交**

```bash
git add backend/src/main/java/com/mywebsite/config/CorsConfig.java backend/src/main/java/com/mywebsite/security/SecurityConfig.java
git commit -m "feat: add CORS configuration"
```

---

### Task 10: 创建异常处理器

**Files:**
- Create: `backend/src/main/java/com/mywebsite/exception/GlobalExceptionHandler.java`

- [ ] **Step 1: 创建 GlobalExceptionHandler**

创建 `backend/src/main/java/com/mywebsite/exception/GlobalExceptionHandler.java`:

```java
package com.mywebsite.exception;

import com.mywebsite.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadCredentials(BadCredentialsException ex) {
        return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .body(ApiResponse.error("邮箱或密码错误", "INVALID_CREDENTIALS"));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ApiResponse.error(ex.getMessage(), "VALIDATION_ERROR"));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
            .map(error -> error.getDefaultMessage())
            .collect(Collectors.joining(", "));
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ApiResponse.error(message, "VALIDATION_ERROR"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneric(Exception ex) {
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiResponse.error("服务器错误", "INTERNAL_ERROR"));
    }
}
```

- [ ] **Step 2: 提交**

```bash
git add backend/src/main/java/com/mywebsite/exception/GlobalExceptionHandler.java
git commit -m "feat: add global exception handler"
```

---

### Task 11: 创建认证服务

**Files:**
- Create: `backend/src/main/java/com/mywebsite/service/AuthService.java`

- [ ] **Step 1: 创建 AuthService**

创建 `backend/src/main/java/com/mywebsite/service/AuthService.java`:

```java
package com.mywebsite.service;

import com.mywebsite.dto.*;
import com.mywebsite.entity.User;
import com.mywebsite.repository.UserRepository;
import com.mywebsite.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("该邮箱已被注册");
        }

        // Check if username already exists
        if (userRepository.existsByUsername(request.username())) {
            throw new IllegalArgumentException("该用户名已被使用");
        }

        // Create new user
        User user = new User();
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setUsername(request.username());

        user = userRepository.save(user);

        // Generate tokens
        String accessToken = jwtUtil.generateAccessToken(user.getId(), user.getEmail());
        String refreshToken = jwtUtil.generateRefreshToken(user.getId(), false);

        return new AuthResponse(accessToken, refreshToken, AuthResponse.UserDto.fromEntity(user));
    }

    public AuthResponse login(LoginRequest request, boolean rememberMe) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        // Get user from database
        User user = userRepository.findByEmail(request.email())
            .orElseThrow(() -> new IllegalArgumentException("用户不存在"));

        // Generate tokens
        String accessToken = jwtUtil.generateAccessToken(user.getId(), user.getEmail());
        String refreshToken = jwtUtil.generateRefreshToken(user.getId(), rememberMe);

        return new AuthResponse(accessToken, refreshToken, AuthResponse.UserDto.fromEntity(user));
    }
}
```

- [ ] **Step 2: 提交**

```bash
git add backend/src/main/java/com/mywebsite/service/AuthService.java
git commit -m "feat: add authentication service"
```

---

### Task 12: 创建认证控制器

**Files:**
- Create: `backend/src/main/java/com/mywebsite/controller/AuthController.java`

- [ ] **Step 1: 创建 AuthController**

创建 `backend/src/main/java/com/mywebsite/controller/AuthController.java`:

```java
package com.mywebsite.controller;

import com.mywebsite.dto.*;
import com.mywebsite.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success("注册成功", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request,
            @RequestParam(defaultValue = "false") boolean rememberMe) {
        AuthResponse response = authService.login(request, rememberMe);
        return ResponseEntity.ok(ApiResponse.success("登录成功", response));
    }
}
```

- [ ] **Step 2: 提交**

```bash
git add backend/src/main/java/com/mywebsite/controller/AuthController.java
git commit -m "feat: add authentication controller"
```

---

## Phase 2: 后端测试与验证

### Task 13: 启动后端服务

**Files:**
- None (execution only)

- [ ] **Step 1: 确保 PostgreSQL 运行中**

```bash
# 检查 PostgreSQL 是否运行
pg_isready || echo "请确保 PostgreSQL 正在运行"

# 创建数据库（如果不存在）
psql -U postgres -c "CREATE DATABASE mywebsite;" 2>/dev/null || echo "数据库可能已存在"
```

- [ ] **Step 2: 配置环境变量（可选）**

创建 `backend/.env` 文件用于本地开发:

```bash
cat > backend/.env << 'EOF'
DB_USERNAME=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_random_secret_key_at_least_256_bits_long_for_hs512_algorithm_please_change_in_production
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
EOF
```

- [ ] **Step 3: 启动应用**

```bash
cd backend
mvn spring-boot:run
```

预期输出: 应用启动成功，监听 8080 端口

- [ ] **Step 4: 验证 API**

使用 curl 或 Postman 测试注册接口:

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#",
    "username": "testuser"
  }'
```

预期响应:
```json
{
  "success": true,
  "message": "注册成功",
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "user": {
      "id": 1,
      "email": "test@example.com",
      "username": "testuser"
    }
  }
}
```

---

## Phase 3: 前端项目初始化

### Task 14: 创建 React 项目

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/vite.config.js`
- Create: `frontend/tailwind.config.js`
- Create: `frontend/postcss.config.js`
- Create: `frontend/index.html`
- Create: `frontend/src/main.jsx`
- Create: `frontend/src/App.jsx`
- Create: `frontend/src/index.css`

- [ ] **Step 1: 创建 package.json**

创建 `frontend/package.json`:

```json
{
  "name": "my-website-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-redux": "^9.1.0",
    "react-router-dom": "^6.21.0",
    "redux": "^5.0.1",
    "redux-toolkit": "^2.2.1",
    "@reduxjs/toolkit": "^2.2.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "vite": "^5.0.11"
  }
}
```

- [ ] **Step 2: 创建 vite.config.js**

创建 `frontend/vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
```

- [ ] **Step 3: 创建 tailwind.config.js**

创建 `frontend/tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        dark: {
          900: '#0a0e1a',
          800: '#14192b',
          700: '#1e2538',
          600: '#2a3149',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 4: 创建 postcss.config.js**

创建 `frontend/postcss.config.js`:

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 5: 创建 index.html**

创建 `frontend/index.html`:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Website</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  </head>
  <body class="bg-dark-900 text-gray-100">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 6: 创建 main.jsx**

创建 `frontend/src/main.jsx`:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import store from './store/store.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
```

- [ ] **Step 7: 创建 App.jsx**

创建 `frontend/src/App.jsx`:

```jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  )
}

export default App
```

- [ ] **Step 8: 创建 index.css**

创建 `frontend/src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-dark-900 text-gray-100 antialiased;
    font-family: 'Inter', system-ui, sans-serif;
  }
}

@layer utilities {
  .glass {
    @apply bg-dark-800/50 backdrop-blur-xl border border-white/10;
  }

  .glow {
    @apply shadow-[0_0_20px_rgba(14,165,233,0.3)];
  }
}
```

- [ ] **Step 9: 创建目录结构**

```bash
mkdir -p frontend/src/{components/{ui,auth},pages,store/slices,services,utils}
```

- [ ] **Step 10: 安装依赖**

```bash
cd frontend
npm install
```

预期输出: 依赖安装成功

- [ ] **Step 11: 验证前端启动**

```bash
cd frontend
npm run dev
```

预期输出: 开发服务器在 http://localhost:5173 启动

- [ ] **Step 12: 提交**

```bash
cd frontend
git init
git add .
git commit -m "feat: initialize React project with Vite and Tailwind CSS"
```

---

### Task 15: 创建基础 UI 组件

**Files:**
- Create: `frontend/src/components/ui/Button.jsx`
- Create: `frontend/src/components/ui/Input.jsx`
- Create: `frontend/src/components/ui/PasswordInput.jsx`
- Create: `frontend/src/components/ui/Card.jsx`

- [ ] **Step 1: 创建 Button 组件**

创建 `frontend/src/components/ui/Button.jsx`:

```jsx
import { cn } from '@/utils/cn'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white shadow-lg shadow-primary-500/25',
    secondary: 'bg-dark-700 hover:bg-dark-600 text-gray-100 border border-white/10',
    outline: 'bg-transparent hover:bg-dark-800 text-primary-400 border border-primary-500/50',
    ghost: 'bg-transparent hover:bg-dark-800 text-gray-300',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        loading && 'cursor-wait',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : null}
      {children}
    </button>
  )
}

export default Button
```

- [ ] **Step 2: 创建 Input 组件**

创建 `frontend/src/components/ui/Input.jsx`:

```jsx
import { cn } from '@/utils/cn'

const Input = ({
  label,
  error,
  className = '',
  containerClassName = '',
  ...props
}) => {
  return (
    <div className={cn('flex flex-col gap-2', containerClassName)}>
      {label && (
        <label className="text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <input
        className={cn(
          'px-4 py-3 rounded-lg bg-dark-800 border border-white/10 text-gray-100 placeholder-gray-500',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500',
          'hover:border-white/20',
          error && 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500',
          disabled: 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      />
      {error && (
        <span className="text-sm text-red-400">{error}</span>
      )}
    </div>
  )
}

export default Input
```

- [ ] **Step 3: 创建 PasswordInput 组件**

创建 `frontend/src/components/ui/PasswordInput.jsx`:

```jsx
import { useState } from 'react'
import { cn } from '@/utils/cn'

const PasswordInput = ({
  label,
  error,
  showStrength = false,
  strength = 0,
  className = '',
  containerClassName = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false)

  const togglePassword = () => {
    setShowPassword(!showPassword)
  }

  const strengthColors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-lime-500',
    'bg-green-500',
  ]

  const strengthLabels = ['弱', '弱', '中', '强', '强']

  return (
    <div className={cn('flex flex-col gap-2', containerClassName)}>
      {label && (
        <label className="text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          className={cn(
            'w-full px-4 py-3 pr-12 rounded-lg bg-dark-800 border border-white/10 text-gray-100 placeholder-gray-500',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500',
            'hover:border-white/20',
            error && 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500',
            className
          )}
          {...props}
        />
        <button
          type="button"
          onClick={togglePassword}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
        >
          {showPassword ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>
      {showStrength && strength !== null && (
        <div className="flex items-center gap-2 mt-1">
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={cn(
                  'h-1 w-full rounded-full transition-colors duration-200',
                  i < strength ? strengthColors[strength - 1] : 'bg-dark-700'
                )}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400">{strengthLabels[strength - 1] || ''}</span>
        </div>
      )}
      {error && (
        <span className="text-sm text-red-400">{error}</span>
      )}
    </div>
  )
}

export default PasswordInput
```

- [ ] **Step 4: 创建 Card 组件**

创建 `frontend/src/components/ui/Card.jsx`:

```jsx
import { cn } from '@/utils/cn'

const Card = ({
  children,
  className = '',
  padding = 'lg',
  ...props
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  }

  return (
    <div
      className={cn(
        'glass rounded-2xl',
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
```

- [ ] **Step 5: 创建 cn 工具函数**

创建 `frontend/src/utils/cn.js`:

```js
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 6: 安装额外依赖**

```bash
cd frontend
npm install clsx tailwind-merge
```

- [ ] **Step 7: 提交**

```bash
git add frontend/src/
git commit -m "feat: add base UI components (Button, Input, PasswordInput, Card)"
```

---

### Task 16: 创建 Redux Store

**Files:**
- Create: `frontend/src/store/store.js`
- Create: `frontend/src/store/slices/authSlice.js`

- [ ] **Step 1: 创建 store 配置**

创建 `frontend/src/store/store.js`:

```js
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})
```

- [ ] **Step 2: 创建 authSlice**

创建 `frontend/src/store/slices/authSlice.js`:

```js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    loginSuccess: (state, action) => {
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
      state.isAuthenticated = true
      state.loading = false
      state.error = null
    },
    logout: (state) => {
      state.user = null
      state.accessToken = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
    },
  },
})

export const { setLoading, setError, loginSuccess, logout, updateUser } = authSlice.actions
export default authSlice.reducer
```

- [ ] **Step 3: 提交**

```bash
git add frontend/src/store/
git commit -m "feat: add Redux store and auth slice"
```

---

### Task 17: 创建 API 服务

**Files:**
- Create: `frontend/src/services/api.js`

- [ ] **Step 1: 创建 API 服务**

创建 `frontend/src/services/api.js`:

```js
const API_BASE_URL = '/api'

export const api = {
  async register(email, password, username) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, username }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || '注册失败')
    }

    return data.data
  },

  async login(email, password, rememberMe = false) {
    const response = await fetch(`${API_BASE_URL}/auth/login?rememberMe=${rememberMe}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || '登录失败')
    }

    return data.data
  },
}
```

- [ ] **Step 2: 提交**

```bash
git add frontend/src/services/
git commit -m "feat: add API service"
```

---

### Task 18: 创建表单验证工具

**Files:**
- Create: `frontend/src/utils/validation.js`

- [ ] **Step 1: 创建验证工具**

创建 `frontend/src/utils/validation.js`:

```js
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password) => {
  const errors = []

  if (password.length < 8) {
    errors.push('密码至少需要8个字符')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('密码必须包含小写字母')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('密码必须包含大写字母')
  }

  if (!/\d/.test(password)) {
    errors.push('密码必须包含数字')
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('密码必须包含特殊字符 (!@#$%^&*)')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const getPasswordStrength = (password) => {
  let strength = 0

  if (password.length >= 8) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[!@#$%^&*]/.test(password)) strength++

  return strength
}

export const validateUsername = (username) => {
  if (username.length < 2) {
    return '用户名至少需要2个字符'
  }
  if (username.length > 50) {
    return '用户名最多50个字符'
  }
  return null
}
```

- [ ] **Step 2: 提交**

```bash
git add frontend/src/utils/validation.js
git commit -m "feat: add form validation utilities"
```

---

### Task 19: 创建登录页面

**Files:**
- Create: `frontend/src/pages/Login.jsx`
- Create: `frontend/src/components/auth/LoginForm.jsx`

- [ ] **Step 1: 创建 LoginForm 组件**

创建 `frontend/src/components/auth/LoginForm.jsx`:

```jsx
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { loginSuccess, setLoading, setError } from '@/store/slices/authSlice'
import { api } from '@/services/api'
import { validateEmail } from '@/utils/validation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import PasswordInput from '@/components/ui/PasswordInput'
import Card from '@/components/ui/Card'

const LoginForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = '请输入邮箱'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = '邮箱格式不正确'
    }

    if (!formData.password) {
      newErrors.password = '请输入密码'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    dispatch(setLoading(true))

    try {
      const response = await api.login(
        formData.email,
        formData.password,
        formData.rememberMe
      )

      dispatch(loginSuccess({
        user: response.user,
        accessToken: response.accessToken,
      }))

      navigate('/home')
    } catch (error) {
      dispatch(setError(error.message))
      setErrors({ submit: error.message })
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <Card padding="xl" className="w-full max-w-md animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">欢迎回来</h1>
        <p className="text-gray-400">登录你的账号</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="邮箱"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your@email.com"
          error={errors.email}
          autoComplete="email"
        />

        <PasswordInput
          label="密码"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          error={errors.password}
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 rounded border-white/20 bg-dark-800 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-400">记住我</span>
          </label>
          <a href="#" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
            忘记密码？
          </a>
        </div>

        {errors.submit && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
            {errors.submit}
          </div>
        )}

        <Button
          type="submit"
          className="w-full glow"
          loading={formData.loading}
        >
          登 录
        </Button>
      </form>

      <p className="mt-8 text-center text-gray-400">
        还没有账号？{' '}
        <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
          立即注册
        </Link>
      </p>
    </Card>
  )
}

export default LoginForm
```

- [ ] **Step 2: 创建 Login 页面**

创建 `frontend/src/pages/Login.jsx`:

```jsx
import LoginForm from '@/components/auth/LoginForm'

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900" />

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10">
        <LoginForm />
      </div>
    </div>
  )
}

export default Login
```

- [ ] **Step 3: 提交**

```bash
git add frontend/src/pages/Login.jsx frontend/src/components/auth/LoginForm.jsx
git commit -m "feat: add login page and form"
```

---

### Task 20: 创建注册页面

**Files:**
- Create: `frontend/src/pages/Register.jsx`
- Create: `frontend/src/components/auth/RegisterForm.jsx`

- [ ] **Step 1: 创建 RegisterForm 组件**

创建 `frontend/src/components/auth/RegisterForm.jsx`:

```jsx
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { loginSuccess, setLoading, setError } from '@/store/slices/authSlice'
import { api } from '@/services/api'
import { validateEmail, validatePassword, getPasswordStrength, validateUsername } from '@/utils/validation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import PasswordInput from '@/components/ui/PasswordInput'
import Card from '@/components/ui/Card'

const RegisterForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = '请输入邮箱'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = '邮箱格式不正确'
    }

    // Username validation
    const usernameError = validateUsername(formData.username)
    if (usernameError) {
      newErrors.username = usernameError
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = '请输入密码'
    } else {
      const passwordValidation = validatePassword(formData.password)
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0]
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '请确认密码'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    dispatch(setLoading(true))

    try {
      const response = await api.register(
        formData.email,
        formData.password,
        formData.username
      )

      dispatch(loginSuccess({
        user: response.user,
        accessToken: response.accessToken,
      }))

      navigate('/home')
    } catch (error) {
      dispatch(setError(error.message))
      setErrors({ submit: error.message })
    } finally {
      dispatch(setLoading(false))
    }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  return (
    <Card padding="xl" className="w-full max-w-md animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">创建账号</h1>
        <p className="text-gray-400">开始你的旅程</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="邮箱"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your@email.com"
          error={errors.email}
          autoComplete="email"
        />

        <Input
          label="用户名"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="john_doe"
          error={errors.username}
          autoComplete="username"
        />

        <PasswordInput
          label="密码"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          error={errors.password}
          showStrength={formData.password.length > 0}
          strength={passwordStrength}
          autoComplete="new-password"
        />

        <PasswordInput
          label="确认密码"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••"
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        {errors.submit && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
            {errors.submit}
          </div>
        )}

        <Button
          type="submit"
          className="w-full glow"
          loading={formData.loading}
        >
          注 册
        </Button>
      </form>

      <p className="mt-8 text-center text-gray-400">
        已有账号？{' '}
        <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
          立即登录
        </Link>
      </p>
    </Card>
  )
}

export default RegisterForm
```

- [ ] **Step 2: 创建 Register 页面**

创建 `frontend/src/pages/Register.jsx`:

```jsx
import RegisterForm from '@/components/auth/RegisterForm'

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900" />

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10">
        <RegisterForm />
      </div>
    </div>
  )
}

export default Register
```

- [ ] **Step 3: 提交**

```bash
git add frontend/src/pages/Register.jsx frontend/src/components/auth/RegisterForm.jsx
git commit -m "feat: add register page and form"
```

---

### Task 21: 创建登录后首页

**Files:**
- Create: `frontend/src/pages/Home.jsx`

- [ ] **Step 1: 创建 Home 页面**

创建 `frontend/src/pages/Home.jsx`:

```jsx
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '@/store/slices/authSlice'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

const Home = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 p-8">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-12">
        <nav className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">My Website</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-300">
              欢迎, {user?.username || user?.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
            >
              登出
            </Button>
          </div>
        </nav>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto">
        <Card padding="xl" className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            欢迎来到你的个人空间
          </h2>
          <p className="text-gray-400 mb-6">
            这是登录后的首页。后续功能将在这里添加。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card padding="lg" className="hover:border-primary-500/50 transition-colors cursor-pointer">
              <div className="text-primary-400 mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">个人资料</h3>
              <p className="text-sm text-gray-400">管理你的个人信息</p>
            </Card>

            <Card padding="lg" className="hover:border-primary-500/50 transition-colors cursor-pointer">
              <div className="text-primary-400 mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">作品集</h3>
              <p className="text-sm text-gray-400">展示你的项目作品</p>
            </Card>

            <Card padding="lg" className="hover:border-primary-500/50 transition-colors cursor-pointer">
              <div className="text-primary-400 mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">博客</h3>
              <p className="text-sm text-gray-400">分享你的想法和见解</p>
            </Card>
          </div>
        </Card>

        {/* User info card */}
        <Card padding="lg">
          <h3 className="text-lg font-semibold text-white mb-4">账号信息</h3>
          <div className="space-y-3">
            <div className="flex">
              <span className="text-gray-400 w-24">ID:</span>
              <span className="text-gray-200">{user?.id}</span>
            </div>
            <div className="flex">
              <span className="text-gray-400 w-24">邮箱:</span>
              <span className="text-gray-200">{user?.email}</span>
            </div>
            <div className="flex">
              <span className="text-gray-400 w-24">用户名:</span>
              <span className="text-gray-200">{user?.username}</span>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}

export default Home
```

- [ ] **Step 2: 提交**

```bash
git add frontend/src/pages/Home.jsx
git commit -m "feat: add home page"
```

---

## Phase 4: 整合测试

### Task 22: 端到端测试

**Files:**
- None (execution only)

- [ ] **Step 1: 启动后端**

```bash
cd backend
mvn spring-boot:run
```

预期输出: 后端在 http://localhost:8080 运行

- [ ] **Step 2: 启动前端**

```bash
cd frontend
npm run dev
```

预期输出: 前端在 http://localhost:5173 运行

- [ ] **Step 3: 测试注册流程**

1. 访问 http://localhost:5173/register
2. 填写表单：
   - 邮箱: test@example.com
   - 用户名: testuser
   - 密码: Test123!@#
   - 确认密码: Test123!@#
3. 观察密码强度指示
4. 点击注册
5. 验证跳转到首页

- [ ] **Step 4: 测试登录流程**

1. 点击登出
2. 访问 http://localhost:5173/login
3. 填写表单：
   - 邮箱: test@example.com
   - 密码: Test123!@#
4. 勾选记住我
5. 点击登录
6. 验证跳转到首页并显示用户信息

- [ ] **Step 5: 测试错误处理**

1. 尝试使用错误密码登录
2. 验证显示错误消息
3. 尝试注册已存在的邮箱
4. 验证显示错误消息

- [ ] **Step 6: 最终提交**

```bash
cd frontend
git add .
git commit -m "feat: complete authentication system"

cd ../backend
git add .
git commit -m "feat: complete authentication system"
```

---

## 验收标准

### 功能验收
- [ ] 用户可以注册新账号
- [ ] 用户可以登录
- [ ] 密码验证规则生效（前端和后端）
- [ ] 登录后可以访问受保护的路由
- [ ] 可以登出并清除认证状态
- [ ] 密码强度指示器正常工作

### UI/UX 验收
- [ ] 登录/注册页面在移动端正常显示
- [ ] 表单验证提示清晰
- [ ] 加载状态有视觉反馈（Loading 动画）
- [ ] 错误信息友好且明确
- [ ] 页面有科技感的视觉效果（渐变、毛玻璃等）

### 安全验收
- [ ] 密码以加密形式存储在数据库中
- [ ] JWT Token 正常工作
- [ ] CORS 配置正确

---

**计划版本**: 1.0
**最后更新**: 2025-06-08
