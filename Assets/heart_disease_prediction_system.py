import pandas as pd
import numpy as np
import pickle
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
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
        """Train multiple ML models with Hyperparameter Tuning"""
        print("\n" + "="*70)
        print("TRAINING MACHINE LEARNING MODELS WITH CROSS-VALIDATION")
        print("="*70)

        # Initialize models and their parameter grids for GridSearchCV
        model_params = {
            'Logistic Regression': {
                'model': LogisticRegression(random_state=42, max_iter=2000),
                'params': {
                    'C': [0.01, 0.1, 1, 10, 100],
                    'penalty': ['l2'],
                    'solver': ['liblinear', 'lbfgs']
                }
            },
            'Random Forest': {
                'model': RandomForestClassifier(random_state=42),
                'params': {
                    'n_estimators': [50, 100, 200],
                    'max_depth': [None, 5, 10, 15],
                    'min_samples_split': [2, 5, 10]
                }
            },
            'Support Vector Machine': {
                'model': SVC(probability=True, random_state=42),
                'params': {
                    'C': [0.1, 1, 10],
                    'kernel': ['rbf', 'linear']
                }
            }
        }

        results = {}

        for model_name, config in model_params.items():
            print(f"\nOptimizing {model_name}...")
            
            # Use GridSearchCV for hyperparameter tuning
            clf = GridSearchCV(config['model'], config['params'], cv=5, scoring='accuracy', n_jobs=-1)
            clf.fit(X_train, y_train)
            
            best_model = clf.best_estimator_

            # Predictions
            y_pred_test = best_model.predict(X_test)

            # Metrics
            test_accuracy = accuracy_score(y_test, y_pred_test)
            precision = precision_score(y_test, y_pred_test)
            recall = recall_score(y_test, y_pred_test)
            f1 = f1_score(y_test, y_pred_test)

            results[model_name] = {
                'accuracy': test_accuracy,
                'precision': precision,
                'recall': recall,
                'f1_score': f1,
                'best_params': clf.best_params_
            }

            self.models[model_name] = best_model
            print(f"  Best Params: {clf.best_params_}")
            print(f"  Test Accuracy: {test_accuracy:.4f}")

        # Choose best model overall
        self.best_model_name = max(results, key=lambda x: results[x]['accuracy'])
        self.best_model = self.models[self.best_model_name]

        print("\n" + "="*70)
        print(f"BEST PERFORMING MODEL: {self.best_model_name}")
        print(f"Final Accuracy: {results[self.best_model_name]['accuracy']:.4f}")
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

    def export_to_javascript(self):
        """Export best model parameters to a JavaScript readable format"""
        if self.best_model_name != 'Logistic Regression':
            print(f"\nNote: Simplified coefficients only available for Logistic Regression.")
            print(f"Current best model is {self.best_model_name}.")
            # Fallback to Logistic Regression for JS export if it exists
            if 'Logistic Regression' in self.models:
                model = self.models['Logistic Regression']
            else:
                return
        else:
            model = self.best_model

        coef = model.coef_[0]
        intercept = model.intercept_[0]
        
        # Get scaling parameters
        means = self.scaler.mean_
        stds = np.sqrt(self.scaler.var_)
        
        js_code = f"""
// Improved Model Weights (Optimized via GridSearchCV in Python)
const modelParams = {{
    weights: {{
        {",\n        ".join([f"{name}: {val:.6f}" for name, val in zip(self.feature_names, coef)])}
    }},
    intercept: {intercept:.6f},
    scaling: {{
        {",\n        ".join([f"{name}: {{ mean: {m:.4f}, std: {s:.4f} }}" for name, m, s in zip(self.feature_names, means, stds)])}
    }}
}};
"""
        print("\n" + "="*70)
        print("COPY THIS TO script.js")
        print("="*70)
        print(js_code)
        print("="*70)

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
    df = system.load_data('Assets/heart_disease_dataset.csv')
    X_train, X_test, y_train, y_test = system.preprocess_data(df)
    results = system.train_models(X_train, y_train, X_test, y_test)
    system.save_model()
    
    # Export for JavaScript
    system.export_to_javascript()

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
