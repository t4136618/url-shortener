# Design Document for URL Shortener

## 1. Architecture Overview

This application is built with **NestJS** and follows a modular architecture to separate concerns. The main components include:

- **NestJS Framework**: Manages the application logic, routing, and dependency injection.
- **MongoDB**: Stores URL data (original URL, shortened URL, access statistics).
- **Redis**: Caches frequently accessed URLs to improve retrieval speed and reduce load on MongoDB.
- **Docker**: Ensures consistency across different environments, making it easier to deploy and manage the application.

The application is structured into separate modules, such as URL shortening, analytics, caching, and database management. Each module provides dedicated services to handle specific tasks.

## 2. Core Components

- **URL Shortening Service**: This service generates a unique shortened URL, stores it in MongoDB, and provides the redirection functionality. It handles URL shortening and redirection based on the short URL identifier.

- **Analytics Service**: Tracks access to shortened URLs, including access count and timestamps. It provides endpoints for retrieving these metrics.

- **Caching Service**: Caches URLs in Redis to speed up access and reduce database load. Redis is used for frequently accessed URLs.

- **Backup Service**: Automatically backs up MongoDB data every day to ensure data recovery in case of failure.

- **API Documentation**: Exposes API endpoints for URL shortening and analytics, and provides easy exploration through Swagger at `/api`.

## 3. Design Decisions

- **MongoDB**: Chosen for its flexibility and scalability, making it well-suited for storing URL mappings and large amounts of metadata without a rigid schema.

- **Redis**: Selected for caching due to its speed in storing and retrieving data. This helps reduce repeated database queries for frequently accessed URLs.

- **Docker**: Docker is used to containerize the application, MongoDB, and Redis to ensure environment consistency. This simplifies deployment and makes it easier to manage dependencies across different environments (development, production).

- **Cron Jobs**: Used for periodic tasks like cleanup of expired URLs and regular database backups.

## 4. Key Endpoints

- **POST `/shorten`**: Takes an original URL, generates a short URL, and stores it in MongoDB.

- **GET `/analytics/:id`**: Fetches the access count and timestamps for the specified shortened URL.

- **GET `/:shortId`**: Redirects users to the original URL based on the short ID.

## 5. Storage and Caching Strategy

- MongoDB stores the URL mapping and access details (access count, timestamps).
- Redis caches the shortened URLs to minimize database lookups.
- Expired URLs are cleaned up periodically through a cron job.
- Database backups are performed daily to ensure data integrity.

## 6. Deployment

The application is designed to be deployed using Docker, which handles MongoDB, Redis, and the main application in separate containers. This makes it easier to manage the development and production environments with minimal configuration.

