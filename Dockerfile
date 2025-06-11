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

# Copy all model files at once
COPY models/ /app/models/

# Set permissions and verify
RUN chmod 644 /app/models/*.joblib && \
    ls -la /app/models/ && \
    python3 -c "import os; print('Files in models directory:', os.listdir('/app/models'))"

# Copy application code
COPY . .

# Set final permissions
RUN chmod -R 755 /app

# Expose port
EXPOSE 3000

# Run the application with uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3000", "--workers", "2"] 