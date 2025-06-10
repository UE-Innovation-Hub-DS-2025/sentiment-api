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

# Create models directory and set permissions
RUN mkdir -p /app/models && chmod 755 /app/models

# Copy models directory first to leverage Docker cache
COPY --chmod=644 models/*.joblib /app/models/

# Copy application code
COPY . .

# Ensure proper permissions for all files
RUN chmod -R 755 /app

# Expose port
EXPOSE 3000

# Run the application with uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3000", "--workers", "2"] 