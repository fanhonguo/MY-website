package com.mywebsite.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Bean
    public DataSource dataSource() {
        String databaseUrl = System.getenv("DATABASE_URL");

        log.info("Initializing DataSource...");
        log.info("DATABASE_URL environment variable: {}",
                 databaseUrl != null ? "Set (length=" + databaseUrl.length() + ")" : "NOT SET");

        if (databaseUrl != null && !databaseUrl.isEmpty()) {
            // Parse postgres://user:pass@host:port/db format
            try {
                DataSource dataSource = parsePostgresUrl(databaseUrl);
                log.info("DataSource configured successfully from DATABASE_URL");
                return dataSource;
            } catch (Exception e) {
                log.error("Failed to parse DATABASE_URL, using fallback configuration", e);
                return createFallbackDataSource();
            }
        } else {
            log.warn("DATABASE_URL not set, using fallback configuration");
            return createFallbackDataSource();
        }
    }

    private DataSource createFallbackDataSource() {
        return DataSourceBuilder.create()
                .url("jdbc:postgresql://localhost:5432/mywebsite")
                .username("postgres")
                .password("postgres")
                .build();
    }

    private DataSource parsePostgresUrl(String url) {
        // Remove "postgres://" prefix
        String cleanUrl = url.replace("postgres://", "");

        // Parse: username:password@host:port/database
        String[] parts = cleanUrl.split("@");
        if (parts.length != 2) {
            throw new IllegalArgumentException("Invalid DATABASE_URL format: missing '@'");
        }

        String[] userPass = parts[0].split(":");
        if (userPass.length != 2) {
            throw new IllegalArgumentException("Invalid DATABASE_URL format: missing password");
        }

        String username = userPass[0];
        String password = userPass[1];

        String[] hostPortDb = parts[1].split("/");
        if (hostPortDb.length != 2) {
            throw new IllegalArgumentException("Invalid DATABASE_URL format: missing database name");
        }

        String[] hostPort = hostPortDb[0].split(":");

        String host = hostPort[0];
        String port = hostPort.length > 1 ? hostPort[1] : "5432";
        String database = hostPortDb[1];

        // Build JDBC URL
        String jdbcUrl = String.format("jdbc:postgresql://%s:%s/%s", host, port, database);

        log.info("Parsed database config - Host: {}, Port: {}, Database: {}", host, port, database);

        return DataSourceBuilder.create()
                .url(jdbcUrl)
                .username(username)
                .password(password)
                .build();
    }
}
