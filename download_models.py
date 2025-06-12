import os
import gdown

def download_models():
    # Create models directory if it doesn't exist
    os.makedirs('models', exist_ok=True)
    
    # Folder ID from the Google Drive URL
    folder_id = '1R9YQDWCmEqeVaYuWeYwy-NKRYxZSEAAi'
    
    # List of files to download
    files = [
        'label_encoder.pkl',
        'logistic_regression_sentiment_model.pkl',
        'naive_bayes_sentiment_model.pkl',
        'random_forest_sentiment_model.pkl',
        'svm_sentiment_model.pkl',
        'tfidf_vectorizer.pkl'
    ]
    
    # First, check which files need to be downloaded
    files_to_download = []
    for filename in files:
        output_path = os.path.join('models', filename)
        if not os.path.exists(output_path):
            files_to_download.append(filename)
            print(f"{filename} needs to be downloaded")
        else:
            print(f"{filename} already exists, skipping...")
    
    # If there are files to download, download them all at once
    if files_to_download:
        print("\nDownloading missing files...")
        url = f"https://drive.google.com/drive/folders/{folder_id}"
        try:
            # Download the entire folder to a temporary location
            temp_dir = "temp_download"
            gdown.download_folder(url, output=temp_dir, quiet=False)
            
            # Move only the needed files to the models directory
            for filename in files_to_download:
                temp_file = os.path.join(temp_dir, filename)
                output_path = os.path.join('models', filename)
                if os.path.exists(temp_file):
                    os.rename(temp_file, output_path)
                    print(f"Downloaded {filename}")
                else:
                    print(f"Could not find {filename} in the downloaded files")
            
            # Clean up temporary directory
            if os.path.exists(temp_dir):
                for file in os.listdir(temp_dir):
                    os.remove(os.path.join(temp_dir, file))
                os.rmdir(temp_dir)
                
        except Exception as e:
            print(f"Error during download: {str(e)}")
    else:
        print("\nAll files are already downloaded!")

if __name__ == "__main__":
    download_models() 