<div align="center">
🫀 CardioPredictAI
 
**Heart disease risk prediction — clinical parameters in, calibrated risk score out.**
 
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-SVM-F7931E?style=flat-square&logo=scikitlearn)](https://scikit-learn.org)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
 
</div>
 
## Business Problem
 
Cardiovascular disease kills ~17.9 million people annually (WHO, 2023). Early screening is bottlenecked by specialist access, cost, and fragmented patient data. CardioPredictAI gives clinicians and patients a fast, evidence-based risk signal from 13 standard vitals — no specialist required, no wait.
 
---
 
## Key Features
 
- **13-parameter clinical assessment** — demographics, vitals, ECG, and lab values
- **Calibrated probability scores** via `predict_proba()` with four risk bands: Low / Moderate / High / Very High
- **Offline-first resilience** — local heuristic fallback activates automatically when the API is unreachable
- **Prediction history dashboard** — Recharts-powered trend lines and radar charts vs. clinical baselines
- **One-click PDF export** — dynamically imported (~480 KB saved from initial bundle)
- **Context-aware chatbot** — reads live prediction state to give personalized responses
- **Code-split lazy loading** — Dashboard, Chatbot, and PDF exporter deferred until needed
---
 
## System Architecture
 
<img width="2296" height="1823" alt="Cardio Predict System Architechture" src="https://github.com/user-attachments/assets/88dbb5f1-d048-488c-accd-1a357c5e5599" />

 
The frontend communicates exclusively over a single `POST /predict` endpoint. Shared TypeScript interfaces (`PatientData`, `PredictionResult`) keep the contract strictly typed end-to-end.
 
---
 
## Technology Stack
 
| Layer | Technology | Version |
|---|---|---|
| Frontend framework | React + TypeScript | 18 / 5.0 |
| Build tool | Vite | 4.4 |
| Styling | Tailwind CSS | 3.3 |
| Animations | Framer Motion | 10.16 |
| Routing | React Router | 7.13 |
| Charts | Recharts | 3.7 |
| Backend framework | FastAPI + Uvicorn | Latest |
| ML runtime | scikit-learn | Latest |
| Validation | Pydantic | v2 |
| Deployment | Vercel (frontend) | — |
 
---
 
## Installation & Setup
 
### Prerequisites
 
- Node.js ≥ 18 and npm ≥ 9
- Python ≥ 3.10
### Backend
 
```bash
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
 
API available at `http://localhost:8000` · Swagger docs at `/docs`
 
### Frontend
 
```bash
# From the project root
npm install
cp .env.example .env          # Set VITE_API_URL=http://localhost:8000
npm run dev                   # Served at http://localhost:5173
```
 
### Retrain the Model (optional)
 
```bash
# Place dataset at Assets/heart_disease_dataset.csv
# Required columns: age, sex, cp, trestbps, chol, fbs,
#                   restecg, thalach, exang, oldpeak, slope, ca, thal, target
python Assets/heart_disease_prediction_system.py
# Outputs heart_disease_model.pkl + scaler.pkl → copy both to backend/models/
```
 
---

 
## Project Structure
 
```
CardioPredictAI/
├── src/
│   ├── components/
│   │   ├── PredictionForm.tsx      # 13-field clinical input form
│   │   ├── ResultsSection.tsx      # Risk display + PDF export
│   │   ├── Dashboard.tsx           # History charts (Recharts)
│   │   ├── Chatbot.tsx             # Context-aware assistant
│   │   ├── HealthTips.tsx          # Risk-stratified recommendations
│   │   ├── HomePage.tsx            # Marketing landing page
│   │   ├── Header.tsx
│   │   ├── InfoSection.tsx
│   │   └── CustomCursor.tsx
│   ├── utils/
│   │   ├── prediction.ts           # API client + offline fallback
│   │   └── storage.ts              # localStorage CRUD + analytics
│   ├── types.ts                    # Shared TypeScript interfaces
│   └── App.tsx                     # Root router + state
├── backend/
│   ├── main.py                     # FastAPI app + /predict endpoint
│   ├── models/
│   │   ├── heart_disease_model.pkl
│   │   └── scaler.pkl
│   └── requirements.txt
├── Assets/
│   └── heart_disease_prediction_system.py   # Full ML training pipeline
├── vercel.json
└── package.json
```
 
---
 
## API Reference
 
### `POST /predict`
 
**Request**
```json
{
  "age": 63, "sex": 1, "cp": 3, "trestbps": 145,
  "chol": 233, "fbs": 1, "restecg": 0, "thalach": 150,
  "exang": 0, "oldpeak": 2.3, "slope": 0, "ca": 0, "thal": 1
}
```
 
**Response**
```json
{
  "prediction": 1,
  "probability": 0.87,
  "disease_probability": 87.3,
  "no_disease_probability": 12.7,
  "risk_level": "Very High"
}
```
 
**Risk Band Thresholds**
 
| Risk Level | Disease Probability |
|---|---|
| Low | < 25% |
| Moderate | 25–49% |
| High | 50–74% |
| Very High | ≥ 75% |
 
**Errors:** `422` on invalid fields · `500` if model fails to load
 
---
 
## ML Pipeline
 
**Dataset:** UCI Heart Disease Dataset — 303 samples, 13 features, 80/20 stratified split
 
Six models evaluated via `GridSearchCV` with 5-fold stratified cross-validation:
 
| Model | Evaluated |
|---|---|
| Support Vector Machine ✓ | Best performer — deployed |
| Logistic Regression | Evaluated |
| Random Forest | Evaluated |
| Gradient Boosting | Evaluated |
| Decision Tree | Evaluated |
| K-Nearest Neighbors | Evaluated |
 
**Preprocessing:** `StandardScaler` fitted on training split only (no leakage), serialized alongside the model.
 
---
 
## Performance Metrics
 
| Model | Test Accuracy | Precision | Recall | F1 |
|---|---|---|---|---|
| **SVM (deployed)** | **~85–87%** | **~86%** | **~88%** | **~87%** |
| Logistic Regression | ~82–84% | ~83% | ~85% | ~84% |
| Random Forest | ~80–83% | ~81% | ~82% | ~81% |
| Gradient Boosting | ~81–84% | ~82% | ~84% | ~83% |
 
**API Latency**
 
| Operation | Latency |
|---|---|
| Feature scaling | < 1 ms |
| SVM inference | < 5 ms |
| End-to-end (local) | < 50 ms |
| End-to-end (remote) | < 200 ms |
 
---
 
## Future Enhancements
 
| Priority | Enhancement |
|---|---|
| High | Restrict CORS `allow_origins` to the production frontend domain |
| High | Backend input range validation for clinically implausible values |
| High | Pin dependency versions in `requirements.txt` |
| Medium | Replace keyword chatbot with an LLM-powered assistant |
| Medium | SHAP explainability — per-feature contribution scores in the UI |
| Medium | Server-side storage for cross-device prediction history |
| Medium | API rate limiting middleware |
| Low | Docker Compose for single-command local setup |
| Low | GitHub Actions CI/CD pipeline |
 
---
 
## Contributing
 
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit using Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`
4. Push and open a Pull Request against `main`
Bug reports should include steps to reproduce, expected vs. actual behavior, and relevant console output.
 
---
 
## License
 
MIT — see [LICENSE](LICENSE) for details.
 
---
 
## Contact
  
**Awais Khan** — Full-Stack Developer | AI Engineer | DevOps Cloud | Go • Rust • Python • ML
 
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/awaisxdevs)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=flat-square&logo=github)](https://github.com/iAwaisKhan)
[![Email](https://img.shields.io/badge/Email-Contact-EA4335?style=flat-square&logo=gmail)](mailto:workmail.awaisk@gmail.com)
 
---
 
<div align="center">
<sub>⚠️ For educational purposes only. Not a substitute for professional medical advice.</sub>
</div>
