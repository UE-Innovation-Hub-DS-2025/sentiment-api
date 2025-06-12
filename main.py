import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Union, Optional, Dict
import joblib
import warnings
import logging
import subprocess
import sys

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Check and run download_models.py if it exists
download_script = os.path.join(os.path.dirname(__file__), 'download_models.py')
if os.path.exists(download_script):
    logger.info("Running download_models.py to ensure models are available...")
    try:
        subprocess.run([sys.executable, download_script], check=True)
        logger.info("Successfully ran download_models.py")
    except subprocess.CalledProcessError as e:
        logger.error(f"Error running download_models.py: {str(e)}")
        raise RuntimeError("Failed to download required models")

# Define the path to the models directory
MODELS_DIR = os.path.join(os.path.dirname(__file__), 'models')

print(os.listdir(MODELS_DIR))

# Load models and vectorizer with error handling
model_files = {
    "logistic_regression": "logistic_regression_sentiment_model.pkl",
    "naive_bayes": "naive_bayes_sentiment_model.pkl",
    "svm": "svm_sentiment_model.pkl",
    "random_forest": "random_forest_sentiment_model.pkl",
}

models = {}
vectorizer = None
label_encoder = None

def safe_load_model(filepath):
    try:
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")  # Ignore all warnings during model loading
            return joblib.load(filepath)
    except Exception as e:
        logger.error(f"Error loading model from {filepath}: {str(e)}")
        return None

# Load vectorizer first
vectorizer_path = os.path.join(MODELS_DIR, 'tfidf_vectorizer.pkl')
print(vectorizer_path)
vectorizer = safe_load_model(vectorizer_path)

# Load label encoder
label_encoder_path = os.path.join(MODELS_DIR, 'label_encoder.pkl')
label_encoder = safe_load_model(label_encoder_path)

# Load models
for name, filename in model_files.items():
    model_path = os.path.join(MODELS_DIR, filename)
    model = safe_load_model(model_path)
    if model is not None:
        models[name] = model
        logger.info(f"Successfully loaded model: {name}")
    else:
        logger.warning(f"Failed to load model: {name}")

# Use label encoder for mapping if available, otherwise use hardcoded mapping
if label_encoder is not None:
    label_map = {i: label for i, label in enumerate(label_encoder.classes_)}
else:
    label_map = {0: "negative", 1: "positive"}

# FastAPI app
app = FastAPI(title="Sentiment Analysis API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class PredictRequest(BaseModel):
    model: str
    text: Union[str, List[str]]
    labels: Union[str, List[str], None] = None

class PredictResponse(BaseModel):
    text: Union[str, List[str]]
    prediction: Union[str, List[str]]
    model: str
    confidence: Optional[float] = None
    confidence_text: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    models_loaded: Dict[str, bool]
    vectorizer_loaded: bool

@app.get("/", response_model=HealthResponse)
@app.get("/health", response_model=HealthResponse)
def health_check():
    """
    Health check endpoint that returns the status of the API and loaded models
    """
    return HealthResponse(
        status="healthy",
        models_loaded={name: name in models for name in model_files.keys()},
        vectorizer_loaded=vectorizer is not None
    )

@app.post("/predict", response_model=PredictResponse)
def predict_sentiment(request: PredictRequest):
    model_name = request.model.lower()
    if model_name not in models:
        raise HTTPException(status_code=400, detail=f"Invalid model name. Allowed values: {list(models.keys())}")

    # Ensure text is a list for batch processing
    texts = request.text if isinstance(request.text, list) else [request.text]

    try:
        # Vectorize input
        X = vectorizer.transform(texts)
        # Predict
        preds = models[model_name].predict(X)
        # Map numeric predictions to text labels
        pred_labels = []
        for p in preds:
            pred_int = int(p)  # Convert numpy int to Python int
            if pred_int in label_map:
                pred_labels.append(label_map[pred_int])
            else:
                pred_labels.append("unknown")

        # Get confidence scores using predict_proba
        confidence = None
        confidence_text = None
        try:
            probas = models[model_name].predict_proba(X)
            # For each prediction, get the highest probability
            confidences = [round(max(p) * 100, 2) for p in probas]
            if isinstance(request.text, str):
                confidence = confidences[0]
            else:
                confidence = confidences
            confidence_text = f"{confidence}%" if isinstance(confidence, float) else [f"{c}%" for c in confidence]
        except AttributeError:
            # If the model does not support predict_proba, confidence remains None
            pass

        # Return single value if input was a string
        if isinstance(request.text, str):
            return PredictResponse(text=request.text, prediction=pred_labels[0], model=model_name, confidence=confidence, confidence_text=confidence_text)
        else:
            return PredictResponse(text=request.text, prediction=pred_labels, model=model_name, confidence=confidence, confidence_text=confidence_text)
    except Exception as e:
        logger.error(f"Error during prediction: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error during prediction: {str(e)}")

# To run: uvicorn main:app --reload
# Test with curl or Postman:
# curl -X POST "http://127.0.0.1:8000/predict" -H "Content-Type: application/json" -d '{"model": "logistic_regression", "text": "I love this!"}' 