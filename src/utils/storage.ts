import { PredictionResult, PatientData, StoredPrediction } from '../types';

const STORAGE_KEY = 'cardiopredict_history';

export const savePrediction = (result: PredictionResult, patientData: PatientData): StoredPrediction => {
    const history = getPredictionHistory();

    const newPrediction: StoredPrediction = {
        ...result,
        patientData,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
    };

    // Keep only the last 50 predictions
    const updatedHistory = [newPrediction, ...history].slice(0, 50);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    return newPrediction;
};

export const getPredictionHistory = (): StoredPrediction[] => {
    try {
        const item = localStorage.getItem(STORAGE_KEY);
        return item ? JSON.parse(item) : [];
    } catch (error) {
        console.error("Failed to parse prediction history", error);
        return [];
    }
};

export const clearHistory = (): void => {
    localStorage.removeItem(STORAGE_KEY);
};

export const getAverageMetrics = (history: StoredPrediction[]) => {
    if (history.length === 0) return null;

    const total = history.reduce((acc, curr) => ({
        chol: acc.chol + curr.patientData.chol,
        thalach: acc.thalach + curr.patientData.thalach,
        trestbps: acc.trestbps + curr.patientData.trestbps
    }), { chol: 0, thalach: 0, trestbps: 0 });

    return {
        chol: Math.round(total.chol / history.length),
        thalach: Math.round(total.thalach / history.length),
        trestbps: Math.round(total.trestbps / history.length)
    };
};
