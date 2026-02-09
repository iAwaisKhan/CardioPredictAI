export interface PatientData {
    age: number;
    sex: number;
    cp: number;
    trestbps: number;
    chol: number;
    fbs: number;
    restecg: number;
    thalach: number;
    exang: number;
    oldpeak: number;
    slope: number;
    ca: number;
    thal: number;
}

export interface PredictionResult {
    diseaseProb: number;
    noDiseaseProb: number;
    hasDisease: boolean;
    riskLevel: string;
}

export interface StoredPrediction extends PredictionResult {
    id: string;
    timestamp: number;
    patientData: PatientData;
}

export interface Tip {
    icon: string;
    title: string;
    text: string;
    priority: 'urgent' | 'high' | 'normal';
}
