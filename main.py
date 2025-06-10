import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Union, Optional
import joblib

# Define the path to the models directory
MODELS_DIR = os.path.join(os.path.dirname(__file__), 'models')

# Load models and vectorizer
model_files = {
    "logistic_regression": "logistic_regression_sentiment_model.joblib",
    "naive_bayes": "naive_bayes_sentiment_model.joblib",
    "svm": "svm_sentiment_model.joblib",
    "random_forest": "random_forest_sentiment_model.joblib",
}

models = {}
for name, filename in model_files.items():
    models[name] = joblib.load(os.path.join(MODELS_DIR, filename))

vectorizer = joblib.load(os.path.join(MODELS_DIR, 'tfidf_vectorizer.joblib'))

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

@app.post("/predict", response_model=PredictResponse)
def predict_sentiment(request: PredictRequest):
    model_name = request.model.lower()
    if model_name not in models:
        raise HTTPException(status_code=400, detail=f"Invalid model name. Allowed values: {list(models.keys())}")

    # Ensure text is a list for batch processing
    texts = request.text if isinstance(request.text, list) else [request.text]

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

# To run: uvicorn main:app --reload
# Test with curl or Postman:
# curl -X POST "http://127.0.0.1:8000/predict" -H "Content-Type: application/json" -d '{"model": "logistic_regression", "text": "I love this!"}' 