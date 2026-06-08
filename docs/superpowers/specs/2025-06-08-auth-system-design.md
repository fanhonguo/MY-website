# 个人网页 - 认证系统设计文档

**日期**: 2025-06-08
**项目**: my-website
**范围**: 用户注册与登录系统

---

## 1. 项目概述

### 1.1 目标
构建一个现代、简洁、科技感的个人网页，首先实现用户认证功能（注册、登录），为后续功能扩展打好基础。

### 1.2 风格定位
- **关键词**: 现代、简洁、高级、科技感
- **UI 风格**: 深色模式为主，科技蓝 accent，微妙的渐变和毛玻璃效果
- **Logo/品牌名称**: 后续确定

---

## 2. 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端框架 | React + Vite | 现代化前端框架 |
| UI 样式 | Tailwind CSS | 原子化 CSS，高度可定制 |
| 状态管理 | Redux Toolkit | 轻量级状态管理 |
| 后端框架 | Spring Boot 3.x | 企业级 Java 框架 |
| 数据库 | PostgreSQL | 关系型数据库 |
| ORM | Spring Data JPA | 数据访问层 |
| 安全 | Spring Security + JWT | 认证与授权 |
| 密码加密 | BCrypt | 单向加密，强度 10 |

---

## 3. 项目结构

### 3.1 前端结构
```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/                 # 基础 UI 组件
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   └── Card.jsx
│   │   └── auth/               # 认证组件
│   │       ├── LoginForm.jsx
│   │       └── RegisterForm.jsx
│   ├── pages/                  # 页面组件
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Home.jsx
│   ├── store/                   # Redux store
│   │   ├── slices/
│   │   │   └── authSlice.js
│   │   └── store.js
│   ├── services/                # API 调用
│   │   └── api.js
│   ├── utils/                   # 工具函数
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
└── tailwind.config.js
```

### 3.2 后端结构
```
backend/
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
        │   │   └── AuthResponse.java
        │   ├── security/
        │   │   ├── JwtUtil.java
        │   │   ├── JwtAuthenticationFilter.java
        │   │   └── SecurityConfig.java
        │   ├── config/
        │   │   └── CorsConfig.java
        │   └── exception/
        │       └── GlobalExceptionHandler.java
        └── resources/
            └── application.properties
```

### 3.3 根目录结构
```
my-website/
├── frontend/          # React 前端项目
├── backend/           # Spring Boot 后端项目
├── docs/              # 项目文档
│   └── superpowers/
│       └── specs/
└── README.md
```

---

## 4. 数据库设计

### 4.1 User 表

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| id | BIGSERIAL | 用户 ID | PRIMARY KEY |
| email | VARCHAR(255) | 邮箱 | UNIQUE, NOT NULL |
| password | VARCHAR(255) | 密码（BCrypt 加密） | NOT NULL |
| username | VARCHAR(50) | 用户名 | UNIQUE |
| created_at | TIMESTAMP | 创建时间 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | 更新时间 | DEFAULT CURRENT_TIMESTAMP |

### 4.2 创建表 SQL
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

---

## 5. API 设计

### 5.1 端点列表

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | /api/auth/register | 用户注册 | 否 |
| POST | /api/auth/login | 用户登录 | 否 |
| POST | /api/auth/refresh | 刷新 Token | 是 |
| POST | /api/auth/logout | 用户登出 | 是 |
| GET | /api/auth/me | 获取当前用户信息 | 是 |

### 5.2 请求/响应格式

**注册请求：**
```json
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Pass123!@#",
  "username": "john_doe"
}
```

**注册响应（成功）：**
```json
HTTP/1.1 201 Created
Content-Type: application/json

{
  "success": true,
  "message": "注册成功",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "john_doe"
    }
  }
}
```

**登录请求：**
```json
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Pass123!@#"
}
```

**登录响应（成功）：**
```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "john_doe"
    }
  }
}
```

**错误响应：**
```json
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "success": false,
  "message": "邮箱或密码错误",
  "error": "INVALID_CREDENTIALS"
}
```

---

## 6. 认证流程

### 6.1 JWT Token 策略

| Token 类型 | 有效期 | 存储位置 | 用途 |
|------------|--------|----------|------|
| Access Token | 15 分钟 | Redux Store（内存） | API 请求认证 |
| Refresh Token | 7 天 / 30 天* | HttpOnly Cookie | 刷新 Access Token |

*记住登录勾选时为 30 天

### 6.2 流程说明

1. **用户登录**：服务器验证成功后生成 Access Token 和 Refresh Token
2. **前端存储**：
   - Access Token → Redux Store
   - Refresh Token → HttpOnly Cookie（安全，防止 XSS）
3. **API 请求**：请求头携带 `Authorization: Bearer {accessToken}`
4. **Token 过期**：自动调用刷新接口获取新的 Access Token
5. **登出**：清除前端 Token 和服务器端 Refresh Token

---

## 7. 安全配置

### 7.1 密码规则

**前端验证：**
- 最少 8 个字符
- 必须包含大写字母 (A-Z)
- 必须包含小写字母
- 必须包含数字 (0-9)
- 必须包含特殊字符 (!@#$%^&*)

**后端验证：**
- BCrypt 加密，强度 10
- 自动加盐，相同密码生成不同哈希

### 7.2 安全措施

| 措施 | 配置 |
|------|------|
| CORS | 允许前端域名 |
| JWT Secret | 环境变量，至少 256 位 |
| 请求限流 | 认证接口 5 次/分钟/IP |
| 密码存储 | BCrypt 单向加密 |
| 敏感信息 | Refresh Token 使用 HttpOnly Cookie |

### 7.3 环境变量

```env
# 数据库配置
DB_URL=jdbc:postgresql://localhost:5432/mywebsite
DB_USERNAME=postgres
DB_PASSWORD=your_password

# JWT 配置
JWT_SECRET=your_random_secret_key_min_256_bits
JWT_ACCESS_EXPIRATION=900000      # 15分钟（毫秒）
JWT_REFRESH_EXPIRATION=604800000  # 7天（毫秒）

# 服务器配置
SERVER_PORT=8080
ALLOWED_ORIGINS=http://localhost:5173
```

---

## 8. UI 设计

### 8.1 设计原则

- **移动端优先**：从小屏幕开始设计，向上扩展
- **无障碍支持**：符合 WCAG 2.1 AA 标准
- **深色模式**：默认深色主题，科技蓝作为强调色
- **动画平滑**：所有过渡动画 150-300ms

### 8.2 登录页面布局

```
┌─────────────────────────────────────────────┐
│                                             │
│           [Logo / 品牌名称]                 │
│                                             │
│              欢迎回来                        │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  邮箱                              │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  密码                    [👁️ 显示]  │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ☐ 记住我        忘记密码？                 │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │           登 录                       │   │
│  └─────────────────────────────────────┘   │
│                                             │
│           还没有账号？ 立即注册               │
│                                             │
└─────────────────────────────────────────────┘
```

### 8.3 注册页面布局

```
┌─────────────────────────────────────────────┐
│                                             │
│           [Logo / 品牌名称]                 │
│                                             │
│              创建账号                        │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  邮箱                              │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  用户名                            │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  密码                    [👁️ 显示]  │   │
│  └─────────────────────────────────────┘   │
│          [强度指示条：●●○○○]                │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  确认密码                [👁️ 显示]  │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │           注 册                       │   │
│  └─────────────────────────────────────┘   │
│                                             │
│           已有账号？ 立即登录                 │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 9. 后续扩展

当前版本仅实现基础的注册/登录功能。以下功能将在后续版本中考虑：

- [ ] 邮箱验证（注册时发送验证邮件）
- [ ] 第三方登录（Google、GitHub）
- [ ] 找回密码功能
- [ ] 个人资料页面
- [ ] 作品集展示功能
- [ ] 博客功能

---

## 10. 验收标准

### 10.1 功能验收

- [ ] 用户可以注册新账号
- [ ] 用户可以登录
- [ ] 密码验证规则生效（前端和后端）
- [ ] 登录后可以访问受保护的路由
- [ ] Token 过期后自动刷新
- [ ] 可以登出并清除认证状态

### 10.2 安全验收

- [ ] 密码以加密形式存储在数据库中
- [ ] JWT Secret 从环境变量读取
- [ ] 敏感信息不暴露在前端代码中
- [ ] Refresh Token 安全存储（HttpOnly Cookie）

### 10.3 UI/UX 验收

- [ ] 登录/注册页面在移动端正常显示
- [ ] 表单验证提示清晰
- [ ] 加载状态有视觉反馈
- [ ] 错误信息友好且明确

---

**文档版本**: 1.0
**最后更新**: 2025-06-08
