# ==========================================
# Build Stage - Maven Build
# ==========================================
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /build

# Copy pom.xml first for better Docker layer caching
COPY pom.xml .

# Download dependencies (cached if pom.xml unchanged)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build application
RUN mvn clean package -DskipTests -B

# ==========================================
# Runtime Stage - JRE
# ==========================================
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Install curl for health check
RUN apk add --no-cache curl

# Copy JAR from builder stage
COPY --from=builder /build/target/*.jar app.jar

# Expose application port
EXPOSE 8080

# Health check - increased start-period to allow for slow database connections
HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]