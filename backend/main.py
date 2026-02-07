from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import pandas as pd
import numpy as np
import os
import sys

# Initialize FastAPI app
app = FastAPI(title="CardioPredict AI API", description="API for Heart Disease Risk Prediction")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Models
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "heart_disease_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "models", "scaler.pkl")

try:
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
    with open(SCALER_PATH, "rb") as f:
        scaler = pickle.load(f)
    print("Models loaded successfully.")
except Exception as e:
    print(f"Error loading models: {e}")
    model = None
    scaler = None

# Define User Input Schema
class PatientData(BaseModel):
    age: float
    sex: int
    cp: int
    trestbps: float
    chol: float
    fbs: int
    restecg: int
    thalach: float
    exang: int
    oldpeak: float
    slope: int
    ca: int
    thal: int

class PredictionResponse(BaseModel):
    prediction: int
    probability: float
    disease_probability: float
    no_disease_probability: float
    risk_level: str

@app.get("/")
def read_root():
    return {"status": "online", "message": "CardioPredict AI API is running"}

@app.post("/predict", response_model=PredictionResponse)
def predict(data: PatientData):
    if model is None or scaler is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    # Order of features must match training data
    features = [
        data.age,
        data.sex,
        data.cp,
        data.trestbps,
        data.chol,
        data.fbs,
        data.restecg,
        data.thalach,
        data.exang,
        data.oldpeak,
        data.slope,
        data.ca,
        data.thal
    ]
    
    # Create DataFrame (some scalers require DataFrame with column names, but StandardScaler usually works with array if fitted on array or dataframe)
    # To be safe, we convert to numpy array and reshape
    features_array = np.array(features).reshape(1, -1)
    
    try:
        # Scale features
        # Note: If the scaler was fitted with a DataFrame and specific column names, it might warn or error if we pass array. 
        # But usually StandardScaler is robust. 
        scaled_features = scaler.transform(features_array)
        
        # Predict
        prediction = int(model.predict(scaled_features)[0])
        
        # Get probability
        # Check if model supports predict_proba
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(scaled_features)[0]
            no_disease_prob = float(probs[0])
            disease_prob = float(probs[1])
            probability = disease_prob # Probability of class 1 (disease)
        else:
            # Fallback for models without probability (like SVM without probability=True)
            # But our training script used SVC(probability=True)
            probability = float(prediction)
            disease_prob = 1.0 if prediction == 1 else 0.0
            no_disease_prob = 1.0 - disease_prob

        # Determine Risk Level
        if disease_prob < 0.25:
            risk_level = "Low"
        elif disease_prob < 0.50:
            risk_level = "Moderate"
        elif disease_prob < 0.75:
            risk_level = "High"
        else:
            risk_level = "Very High"

        return {
            "prediction": prediction,
            "probability": probability,
            "disease_probability": disease_prob * 100, # Return as percentage for consistency with frontend
            "no_disease_probability": no_disease_prob * 100,
            "risk_level": risk_level
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

# For running directly with python
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
