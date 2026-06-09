package com.mywebsite.config;

import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.sql.SQLException;

@Configuration
public class DatabaseConfig {

    @Bean
    public DataSource dataSource() {
        String databaseUrl = System.getenv("DATABASE_URL");

        if (databaseUrl != null && !databaseUrl.isEmpty()) {
            // Parse postgres://user:pass@host:port/db format
            return parsePostgresUrl(databaseUrl);
        } else {
            // Fallback to default configuration
            return DataSourceBuilder.create()
                    .url("jdbc:postgresql://localhost:5432/mywebsite")
                    .username("postgres")
                    .password("postgres")
                    .build();
        }
    }

    private DataSource parsePostgresUrl(String url) {
        // Remove "postgres://" prefix
        String cleanUrl = url.replace("postgres://", "");

        // Parse: username:password@host:port/database
        String[] parts = cleanUrl.split("@");
        String[] userPass = parts[0].split(":");

        String username = userPass[0];
        String password = userPass[1];

        String[] hostPortDb = parts[1].split("/");
        String[] hostPort = hostPortDb[0].split(":");

        String host = hostPort[0];
        String port = hostPort.length > 1 ? hostPort[1] : "5432";
        String database = hostPortDb[1];

        // Build JDBC URL
        String jdbcUrl = String.format("jdbc:postgresql://%s:%s/%s", host, port, database);

        return DataSourceBuilder.create()
                .url(jdbcUrl)
                .username(username)
                .password(password)
                .build();
    }
}
