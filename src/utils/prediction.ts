import { PatientData, PredictionResult } from '../types';

const API_URL = 'http://localhost:8000';

export async function predictHeartDisease(data: PatientData): Promise<PredictionResult> {
    try {
        const response = await fetch(`${API_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const result = await response.json();

        return {
            diseaseProb: Math.round(result.disease_probability),
            noDiseaseProb: Math.round(result.no_disease_probability),
            hasDisease: result.prediction === 1,
            riskLevel: result.risk_level
        };
    } catch (error) {
        console.error("Prediction failed, falling back to local heuristic (demo mode):", error);
        alert("Backend API not reachable. Using offline demo mode.");
        return localHeuristicPredict(data);
    }
}

// Fallback logic kept for demo purposes if backend is offline
function localHeuristicPredict(data: PatientData): PredictionResult {
    // Determine risk based on simple counters
    let riskFactors = 0;

    if (data.age > 50) riskFactors++;
    if (data.sex === 1) riskFactors++;
    if (data.cp > 0) riskFactors += 2;
    if (data.trestbps > 140) riskFactors++;
    if (data.chol > 240) riskFactors++;
    if (data.fbs === 1) riskFactors++;
    if (data.thalach < 150) riskFactors++;
    if (data.exang === 1) riskFactors++;
    if (data.oldpeak > 1.0) riskFactors++;

    const probability = Math.min(0.95, riskFactors / 12);
    const diseaseProb = Math.round(probability * 100);

    let riskLevel = "Low";
    if (diseaseProb >= 75) riskLevel = "Very High";
    else if (diseaseProb >= 50) riskLevel = "High";
    else if (diseaseProb >= 25) riskLevel = "Moderate";

    return {
        diseaseProb,
        noDiseaseProb: Math.round((1 - probability) * 100),
        hasDisease: probability > 0.5,
        riskLevel
    };
}
