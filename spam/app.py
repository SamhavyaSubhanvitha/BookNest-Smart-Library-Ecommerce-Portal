from fastapi import FastAPI
from pydantic import BaseModel
import pickle
import re

# -----------------------------
# Load AI Model
# -----------------------------

with open("spam_model.pkl", "rb") as f:
    model = pickle.load(f)

with open("vectorizer.pkl", "rb") as f:
    vectorizer = pickle.load(f)

# -----------------------------
# Create FastAPI App
# -----------------------------

app = FastAPI(
    title="BookNest Spam Filter API",
    description="AI Spam Detection for Author Messages",
    version="1.0.0"
)

# -----------------------------
# Request Body
# -----------------------------

class MessageRequest(BaseModel):
    message: str

# -----------------------------
# Health Check
# -----------------------------

@app.get("/")
def root():
    return {
        "status": "running",
        "service": "BookNest Spam Filter API"
    }

# -----------------------------
# Spam Prediction
# -----------------------------

@app.post("/predict-spam")
def predict(request: MessageRequest):

    message = request.message.strip().lower()

    # Rule 1 - URL
    if re.search(r'https?://|www\.', message):
        return {
            "success": True,
            "is_spam": True,
            "reason": "URL detected"
        }

    # Rule 2 - Phone Number
    if re.search(r'\b\d{10}\b', message):
        return {
            "success": True,
            "is_spam": True,
            "reason": "Phone number detected"
        }

    # Rule 3 - Spam Keywords
    spam_keywords = [
        "winner",
        "congratulations",
        "claim prize",
        "earn money",
        "click here",
        "free recharge",
        "lottery",
        "free gift",
        "cash prize",
        "win money"
    ]

    if any(keyword in message for keyword in spam_keywords):
        return {
            "success": True,
            "is_spam": True,
            "reason": "Spam keyword detected"
        }

    # Machine Learning Prediction
    vector = vectorizer.transform([message])
    prediction = model.predict(vector)[0]

    return {
        "success": True,
        "message": message,
        "is_spam": bool(prediction == 1),
        "reason": "ML Prediction"
    }