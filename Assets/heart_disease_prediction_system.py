import pandas as pd
import numpy as np
import pickle
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import (accuracy_score, precision_score, recall_score, 
                             f1_score, confusion_matrix, classification_report)
import warnings
warnings.filterwarnings('ignore')


class HeartDiseasePredictionSystem:
    
    # Complete Heart Disease Prediction System with training and prediction
    

    def __init__(self):
        self.models = {}
        self.scaler = None
        self.best_model = None
        self.best_model_name = None
        self.feature_names = None

    def load_data(self, filepath):
        """Load the heart disease dataset"""
        print("Loading dataset...")
        df = pd.read_csv(filepath)
        print(f"Dataset loaded: {df.shape[0]} samples, {df.shape[1]-1} features")
        return df

    def preprocess_data(self, df):
        """Preprocess the data"""
        print("\nPreprocessing data...")

        # Separate features and target
        X = df.drop('target', axis=1)
        y = df['target']

        self.feature_names = X.columns.tolist()

        # Split the data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )

        # Feature scaling
        self.scaler = StandardScaler()
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)

        print(f"Training set: {X_train.shape[0]} samples")
        print(f"Test set: {X_test.shape[0]} samples")

        return X_train_scaled, X_test_scaled, y_train, y_test

    def train_models(self, X_train, y_train, X_test, y_test):
        """Train multiple ML models"""
        print("\n" + "="*70)
        print("TRAINING MACHINE LEARNING MODELS")
        print("="*70)

        # Initialize models
        model_dict = {
            'Logistic Regression': LogisticRegression(random_state=42, max_iter=1000),
            'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
            'Support Vector Machine': SVC(kernel='rbf', random_state=42, probability=True),
            'K-Nearest Neighbors': KNeighborsClassifier(n_neighbors=5),
            'Decision Tree': DecisionTreeClassifier(random_state=42),
            'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, random_state=42)
        }

        results = {}

        for model_name, model in model_dict.items():
            print(f"\nTraining {model_name}...")

            # Train
            model.fit(X_train, y_train)

            # Predictions
            y_pred_test = model.predict(X_test)

            # Metrics
            test_accuracy = accuracy_score(y_test, y_pred_test)
            precision = precision_score(y_test, y_pred_test)
            recall = recall_score(y_test, y_pred_test)
            f1 = f1_score(y_test, y_pred_test)

            # Cross-validation
            cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='accuracy')

            results[model_name] = {
                'accuracy': test_accuracy,
                'precision': precision,
                'recall': recall,
                'f1_score': f1,
                'cv_mean': cv_scores.mean()
            }

            self.models[model_name] = model

            print(f"  Test Accuracy: {test_accuracy:.4f}")
            print(f"  Precision: {precision:.4f}")
            print(f"  Recall: {recall:.4f}")
            print(f"  F1-Score: {f1:.4f}")

        # Select best model
        best_model_name = max(results, key=lambda x: results[x]['accuracy'])
        self.best_model_name = best_model_name
        self.best_model = self.models[best_model_name]

        print("\n" + "="*70)
        print(f"BEST MODEL: {best_model_name}")
        print(f"Accuracy: {results[best_model_name]['accuracy']:.4f}")
        print("="*70)

        return results

    def save_model(self, model_path='heart_disease_model.pkl', scaler_path='scaler.pkl'):
        """Save the best model and scaler"""
        with open(model_path, 'wb') as f:
            pickle.dump(self.best_model, f)
        with open(scaler_path, 'wb') as f:
            pickle.dump(self.scaler, f)
        print(f"\nModel saved to {model_path}")
        print(f"Scaler saved to {scaler_path}")

    def load_model(self, model_path='heart_disease_model.pkl', scaler_path='scaler.pkl'):
        """Load a saved model"""
        with open(model_path, 'rb') as f:
            self.best_model = pickle.load(f)
        with open(scaler_path, 'rb') as f:
            self.scaler = pickle.load(f)
        print("Model and scaler loaded successfully")

    def predict(self, patient_data):
        """
        Make prediction for a single patient

        Parameters:
        -----------
        patient_data : dict or list
            Patient features as dictionary or list

        Returns:
        --------
        prediction : int (0 or 1)
        probability : float
        """
        if isinstance(patient_data, dict):
            # Convert dict to dataframe
            df = pd.DataFrame([patient_data])
        elif isinstance(patient_data, list):
            df = pd.DataFrame([patient_data], columns=self.feature_names)
        else:
            df = patient_data

        # Scale the data
        scaled_data = self.scaler.transform(df)

        # Predict
        prediction = self.best_model.predict(scaled_data)[0]
        probability = self.best_model.predict_proba(scaled_data)[0]

        return prediction, probability

    def get_prediction_report(self, patient_data):
        """Get detailed prediction report"""
        prediction, probability = self.predict(patient_data)

        print("\n" + "="*70)
        print("HEART DISEASE PREDICTION REPORT")
        print("="*70)
        print(f"\nPrediction: {'HEART DISEASE DETECTED' if prediction == 1 else 'NO HEART DISEASE'}")
        print(f"Confidence: {probability[prediction]*100:.2f}%")
        print(f"\nProbability Breakdown:")
        print(f"  No Disease: {probability[0]*100:.2f}%")
        print(f"  Disease:    {probability[1]*100:.2f}%")
        print("="*70)

        return prediction, probability


def main():
    """Main function to demonstrate the system"""

    # Initialize the system
    system = HeartDiseasePredictionSystem()

    # Load and train (if you have the dataset)
    print("AI HEART DISEASE PREDICTION SYSTEM")
    print("="*70)

    # Example: Load dataset and train
    # df = system.load_data('heart_disease_dataset.csv')
    # X_train, X_test, y_train, y_test = system.preprocess_data(df)
    # results = system.train_models(X_train, y_train, X_test, y_test)
    # system.save_model()

    # Example: Make prediction for a new patient
    # Load the model first
    # system.load_model()

    # Patient data example
    patient_example = {
        'age': 63,
        'sex': 1,  # 1 = male, 0 = female
        'cp': 3,   # chest pain type
        'trestbps': 145,  # resting blood pressure
        'chol': 233,  # cholesterol
        'fbs': 1,  # fasting blood sugar > 120 mg/dl
        'restecg': 0,  # resting ECG
        'thalach': 150,  # max heart rate
        'exang': 0,  # exercise induced angina
        'oldpeak': 2.3,  # ST depression
        'slope': 0,  # slope of peak exercise ST segment
        'ca': 0,  # number of major vessels
        'thal': 1  # thalassemia
    }

    print("\nExample patient data structure:")
    for key, value in patient_example.items():
        print(f"  {key}: {value}")

    # Uncomment to make prediction:
    # prediction, probability = system.get_prediction_report(patient_example)


if __name__ == "__main__":
    main()
