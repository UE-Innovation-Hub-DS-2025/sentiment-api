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

## Frontend Development

The frontend is built with Next.js, TypeScript, and Tailwind CSS, providing a modern and responsive user interface for the sentiment analysis application.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn package manager

### Frontend Setup

1. Navigate to the frontend directory:

```sh
cd frontend
```

2. Install dependencies:

```sh
npm install
# or
yarn install
```

### Development

To start the development server:

```sh
npm run dev
# or
yarn dev
```

The frontend will be available at `http://localhost:3000`.

### Building for Production

To create a production build:

```sh
npm run build
# or
yarn build
```

To start the production server:

```sh
npm run start
# or
yarn start
```

### Frontend Features

- Modern UI with Tailwind CSS and Radix UI components
- Real-time sentiment analysis
- Support for multiple sentiment analysis models
- Responsive design for all device sizes
- Dark mode support
- Interactive visualizations

### Frontend Technologies

- Next.js 13.5.1
- TypeScript
- Tailwind CSS
- Radix UI Components
- React Hook Form
- Framer Motion for animations
- Recharts for data visualization

### Development Notes

- The frontend communicates with the backend API at `http://localhost:3000`
- Environment variables can be configured in `.env.local` file
- Use `npm run lint` to check for code quality issues
- The application uses TypeScript for type safety
