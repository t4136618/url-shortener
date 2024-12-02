# URL Shortener API

Welcome to the **URL Shortener API**! This is a service that allows users to shorten long URLs and retrieve the original URLs via the shortened versions. It uses **NestJS** for the backend, **MongoDB** for data storage, and **Redis** for caching.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setup Instructions](#setup-instructions)
3. [Environment Configuration](#environment-configuration)
4. [Running the Application](#running-the-application)
5. [API Documentation (Swagger)](#api-documentation-swagger)
6. [Testing the Application](#testing-the-application)
7. [Contributing](#contributing)
8. [License](#license)

## Prerequisites

Before running the application, make sure you have the following installed:

- **Docker**: [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose**: [Install Docker Compose](https://docs.docker.com/compose/install/)
- **Node.js** (Optional, if you're building manually without Docker): [Download Node.js](https://nodejs.org/)

## Setup Instructions

Clone this repository:

```bash
git clone https://github.com/yourusername/url-shortener.git
cd url-shortener
