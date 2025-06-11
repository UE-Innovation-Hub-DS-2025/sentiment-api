# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Create models directory with proper permissions
RUN mkdir -p /app/models && chmod 755 /app/models

# Copy models
COPY models/tfidf_vectorizer.joblib /app/models/
COPY models/naive_bayes_sentiment_model.joblib /app/models/
COPY models/random_forest_sentiment_model.joblib /app/models/
COPY models/svm_sentiment_model.joblib /app/models/
COPY models/logistic_regression_sentiment_model.joblib /app/models/

# Set permissions for model files
RUN chmod 644 /app/models/*.joblib

# Verify models are copied and have correct permissions
RUN ls -la /app/models/ && \
    test -f /app/models/tfidf_vectorizer.joblib && \
    test -f /app/models/naive_bayes_sentiment_model.joblib && \
    test -f /app/models/random_forest_sentiment_model.joblib && \
    test -f /app/models/svm_sentiment_model.joblib && \
    test -f /app/models/logistic_regression_sentiment_model.joblib

# Copy application code
COPY . .

# Set final permissions
RUN chmod -R 755 /app

# Expose port
EXPOSE 3000

# Run the application with uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3000", "--workers", "2"] 