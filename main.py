import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Union, Optional, Dict
import joblib
import warnings
import logging
from sklearn.exceptions import InconsistentVersionWarning
import sklearn
import pickle
import numpy as np

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Log scikit-learn version
logger.info(f"Current scikit-learn version: {sklearn.__version__}")

# Define the path to the models directory
MODELS_DIR = os.path.join(os.path.dirname(__file__), 'models')

print(os.listdir(MODELS_DIR))

# Load models and vectorizer with error handling
model_files = {
    "logistic_regression": "logistic_regression_sentiment_model.joblib",
    "naive_bayes": "naive_bayes_sentiment_model.joblib",
    "svm": "svm_sentiment_model.joblib",
    "random_forest": "random_forest_sentiment_model.joblib",
}

models = {}
vectorizer = None

def safe_load_model(filepath):
    try:
        logger.info(f"Attempting to load model from: {filepath}")
        logger.info(f"File exists: {os.path.exists(filepath)}")
        if os.path.exists(filepath):
            logger.info(f"File size: {os.path.getsize(filepath)} bytes")
            logger.info(f"File permissions: {oct(os.stat(filepath).st_mode)[-3:]}")
            
            # Try loading with different methods
            try:
                # First try with joblib
                with warnings.catch_warnings():
                    warnings.simplefilter("ignore", InconsistentVersionWarning)
                    model = joblib.load(filepath)
                    logger.info(f"Successfully loaded model using joblib from {filepath}")
                    return model
            except Exception as joblib_error:
                logger.warning(f"Joblib loading failed: {str(joblib_error)}")
                try:
                    # Try with pickle as fallback
                    with open(filepath, 'rb') as f:
                        model = pickle.load(f)
                        logger.info(f"Successfully loaded model using pickle from {filepath}")
                        return model
                except Exception as pickle_error:
                    logger.error(f"Pickle loading failed: {str(pickle_error)}")
                    raise
    except Exception as e:
        logger.error(f"Error loading model from {filepath}: {str(e)}")
        logger.error(f"Error type: {type(e).__name__}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        return None

# Load vectorizer first
vectorizer_path = os.path.join(MODELS_DIR, 'tfidf_vectorizer.joblib')
print(vectorizer_path)
vectorizer = safe_load_model(vectorizer_path)

if vectorizer is None:
    raise RuntimeError("Failed to load TF-IDF vectorizer. Please ensure the model file exists and is compatible.")

# Load models
for name, filename in model_files.items():
    model_path = os.path.join(MODELS_DIR, filename)
    model = safe_load_model(model_path)
    if model is not None:
        models[name] = model
        logger.info(f"Successfully loaded model: {name}")
    else:
        logger.warning(f"Failed to load model: {name}")

if not models:
    raise RuntimeError("No models could be loaded. Please check model files and compatibility.")

print('models', models)

# Hardcoded label mapping (adjust as needed)
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
        # Map to labels
        pred_labels = [label_map.get(int(p), str(p)) for p in preds]

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