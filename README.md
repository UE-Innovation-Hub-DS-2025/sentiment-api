# Sentiment Analysis FastAPI Application

## Overview

This application provides a REST API for sentiment analysis using multiple pre-trained models. It is containerized with Docker for easy deployment.

## Docker Setup

### Prerequisites

- Docker installed on your system
- Docker Compose (optional, for easier management)

### Building the Docker Image

1. Clone this repository
2. Navigate to the project directory
3. Build the Docker image:

```sh
docker build -t sentiment-api .
```

### Running with Docker

#### Basic Run

```sh
docker run -d -p 3000:3000 --name sentiment-api \
  -v $(pwd)/models:/app/models \
  sentiment-api
```

#### Using Docker Compose (Recommended)

1. Create a `docker-compose.yml` file in the project root:

```yaml
version: "3.8"
services:
  sentiment-api:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./models:/app/models
    restart: unless-stopped
```

2. Start the service:

```sh
docker-compose up -d
```

### Managing the Container

- View logs:

```sh
docker logs sentiment-api
```

- Stop the container:

```sh
docker stop sentiment-api
```

- Remove the container:

```sh
docker rm sentiment-api
```

## Requirements

- Docker

## Example cURL Request

```sh
curl -X POST "http://localhost:3000/predict" \
  -H "Content-Type: application/json" \
  -d '{"model": "logistic_regression", "text": "I love this product!"}'
```

## Notes

- Make sure the `models` directory is present and contains all required `.joblib` files.
- For production, consider using a process manager (e.g., supervisord) and a reverse proxy (e.g., Nginx) for SSL and load balancing.
