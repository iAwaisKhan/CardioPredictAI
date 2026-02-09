import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import PredictionForm from './components/PredictionForm';
import ResultsSection from './components/ResultsSection';
import InfoSection from './components/InfoSection';
import Chatbot from './components/Chatbot';
import Dashboard from './components/Dashboard';
import { PatientData, PredictionResult } from './types';
import { predictHeartDisease } from './utils/prediction';
import { savePrediction } from './utils/storage';

function AppContent() {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handlePredict = async (data: PatientData) => {
    setIsLoading(true);
    try {
      const result = await predictHeartDisease(data);
      setPrediction(result);
      savePrediction(result, data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Error connecting to prediction service", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPrediction(null);
  };

  return (
    <div className="min-h-screen bg-background font-sans text-slate-900 selection:bg-primary/20">
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-20">
        <Header />

        <main>
          <Routes>
            <Route path="/" element={
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-12">
                  {!prediction ? (
                    <PredictionForm onSubmit={handlePredict} isLoading={isLoading} />
                  ) : (
                    <ResultsSection prediction={prediction} onReset={handleReset} />
                  )}
                </div>
              </div>
            } />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>

        <InfoSection />

        <footer className="mt-20 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} CardioPredict AI • Clinical Accuracy Prediction Model</p>
        </footer>
      </div>

      <Chatbot />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
