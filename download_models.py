import os
import requests
from tqdm import tqdm
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def download_file(url, filename):
    """
    Download a file from a URL with a progress bar
    """
    response = requests.get(url, stream=True)
    total_size = int(response.headers.get('content-length', 0))
    
    with open(filename, 'wb') as f, tqdm(
        desc=filename,
        total=total_size,
        unit='iB',
        unit_scale=True,
        unit_divisor=1024,
    ) as pbar:
        for data in response.iter_content(chunk_size=1024):
            size = f.write(data)
            pbar.update(size)

def main():
    # Create models directory if it doesn't exist
    os.makedirs('models', exist_ok=True)
    
    # List of model files to download
    model_files = {
        # 'random_forest_sentiment_model.pkl': 'https://minio-qlbxyevy.cloud-station.app/sentiment/sentiment/random_forest_sentiment_model.pkl',
        'logistic_regression_sentiment_model.pkl': 'https://minio-qlbxyevy.cloud-station.app/sentiment/sentiment/logistic_regression_sentiment_model.pkl',
        'naive_bayes_sentiment_model.pkl': 'https://minio-qlbxyevy.cloud-station.app/sentiment/sentiment/naive_bayes_sentiment_model.pkl',
        'svm_sentiment_model.pkl': 'https://minio-qlbxyevy.cloud-station.app/sentiment/sentiment/svm_sentiment_model.pkl',
        'tfidf_vectorizer.pkl': 'https://minio-qlbxyevy.cloud-station.app/sentiment/sentiment/tfidf_vectorizer.pkl',
        'label_encoder.pkl': 'https://minio-qlbxyevy.cloud-station.app/sentiment/sentiment/label_encoder.pkl'
    }
    
    for filename, url in model_files.items():
        filepath = os.path.join('models', filename)
        if not os.path.exists(filepath):
            logger.info(f"Downloading {filename}...")
            download_file(url, filepath)
        else:
            logger.info(f"{filename} already exists, skipping...")

if __name__ == "__main__":
    main() 