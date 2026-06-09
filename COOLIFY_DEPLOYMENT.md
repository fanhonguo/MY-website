# Coolify Deployment Documentation

This document provides instructions for deploying the backend to Coolify.

## Prerequisites

1. Coolify instance deployed and accessible
2. Docker available on the deployment server
3. PostgreSQL database configured

## Backend Deployment

### Configuration

The backend is configured for Coolify deployment with the following environment variables:

#### Required Environment Variables:
- `DB_URL`: Database JDBC URL (e.g., `jdbc:postgresql://db-host:5432/mywebsite`)
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password
- `JWT_SECRET`: JWT secret key (at least 256 bits for HS512 algorithm)

#### Optional Environment Variables:
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins (default: `http://localhost:5173,http://localhost:3000`)

### Docker Build

The Dockerfile is optimized for multi-stage builds:

1. **Builder Stage**: Uses Maven 3.9 with Eclipse Temurin 17
   - Downloads dependencies first for better caching
   - Builds the application with tests skipped

2. **Runtime Stage**: Uses Eclipse Temurin 17 JRE Alpine
   - Includes curl for health checks
   - Minimal footprint for production

### Health Check

The Docker image includes a health check that:
- Checks `/actuator/health` endpoint every 30 seconds
- Timeout: 3 seconds
- Start period: 40 seconds (initial delay)
- Retries: 3 times before marking as unhealthy

### Build Commands

```bash
# Build the Docker image
docker build -t my-website-backend:latest backend/

# Tag for registry (if needed)
docker tag my-website-backend:latest registry.example.com/my-website-backend:latest
```

### Coolify Setup

1. **Environment Variables in Coolify**:
   - Add all required environment variables in the Coolify service configuration
   - Ensure JWT_SECRET is a secure, randomly generated string

2. **Port Configuration**:
   - Expose port 8080
   - Set health check path to `/actuator/health`

3. **Resource Limits**:
   - Set appropriate CPU and memory limits based on your infrastructure

## Application Features

### Actuator Endpoints
- `/actuator/health` - Health check endpoint
- `/actuator/info` - Application information

### Security
- JWT-based authentication
- CORS configuration for allowed origins
- Secure configuration with environment variables

## Monitoring

The application exposes health endpoints that can be monitored:
- Health check returns HTTP 200 when healthy
- Detailed health information available when authenticated

## Troubleshooting

### Common Issues:

1. **Database Connection**:
   - Verify `DB_URL` is correct
   - Ensure database credentials are valid
   - Check database connectivity

2. **JWT Issues**:
   - Ensure `JWT_SECRET` is set and at least 256 bits long
   - Restart the service after changing JWT secret

3. **Health Check Failing**:
   - Check application logs
   - Verify Actuator is properly configured
   - Ensure database connection is healthy

### Logs

Check application logs through Coolify:
```bash
# Docker logs
docker logs <container-id>

# Follow logs
docker logs -f <container-id>
```

## Development

For local development:
- Use the default application.properties values
- Start PostgreSQL locally on port 5432
- Set environment variables as needed

## Security Notes

- Never commit actual secrets to version control
- Use environment variables for sensitive configuration
- Rotate JWT secrets regularly
- Use HTTPS in production