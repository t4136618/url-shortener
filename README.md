# NestJS URL Shortener Application

This project is a URL shortener application built with NestJS. It supports analytics, caching with Redis, MongoDB as the database, and provides a Dockerized environment for easy deployment and management.

---

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
    - [Local Development](#local-development)
    - [Using Docker](#using-docker)
- [Environment Variables](#environment-variables)
- [Application Dependencies](#application-dependencies)
- [API Documentation](#api-documentation)

---

## Features
- URL shortening and redirection.
- Analytics for tracking access counts and timestamps.
- Automatic cleanup of expired URLs.
- Daily database backups.
- Configurable Redis-based caching.

---

## Prerequisites
Ensure the following are installed on your machine:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

---

## Setup Instructions

### Local Development

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/t4136618/url-shortener.git
   cd url-shortener
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start MongoDB and Redis**:
   - Ensure you have MongoDB and Redis running locally or use Docker:

   ```bash
    docker-compose up mongo redis
   ```
   
4. **Run the Application**:
   ```bash
    npm run start:dev
   ```
   
5. **Access the Application**:
   - Open your browser and navigate to http://localhost:3000.

### Using Docker

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/t4136618/url-shortener.git
   cd url-shortener
   ```

2. **Run Docker Compose**:
   ```bash
   docker-compose up -d
   ```

3. **Verify Services**:
    - Use the following command to check service status:
   ```bash
    docker ps
   ```
   
4. **Access the Application**:
   - Open your browser and navigate to http://localhost:3000.
   
### Database and Caching Setup

Ensure that you have MongoDB and Redis set up either locally or via Docker. The application uses these services to store data and manage caching.

## Application Dependencies

The application relies on the following services:

- **MongoDB**: Used for storing URL data. Configuration is in `docker-compose.yml` under the `mongo` service.
- **Redis**: Used for caching operations. Configuration is in `docker-compose.yml` under the `redis` service.

## Environment Variables

The following environment variables can be configured in `.env`:

| Variable           | Description                                  | Default Value  |
|--------------------|----------------------------------------------|----------------|
| `DATABASE_HOST`    | MongoDB host address                        | `mongo`        |
| `DATABASE_PORT`    | MongoDB port                                | `27017`        |
| `DATABASE_USERNAME`| MongoDB root username                       | `root`         |
| `DATABASE_PASSWORD`| MongoDB root password                       | `rootpassword` |
| `DATABASE_SCHEMA`  | MongoDB default database                    | `nest`         |
| `REDIS_HOST`       | Redis host address                          | `redis`        |
| `REDIS_PORT`       | Redis port                                  | `6379`         |
| `REDIS_TTL`        | Default time-to-live for Redis cache entries| `3600`         |
| `PORT`             | Application server port                     | `3000`         |

## API Documentation

After starting the application, Swagger documentation is available at:
[http://localhost:3000/api](http://localhost:3000/api)
Use this endpoint to explore and test the API.
