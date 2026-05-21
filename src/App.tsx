import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import ResultsSection from './components/ResultsSection';
import InfoSection from './components/InfoSection';
import { PatientData, PredictionResult } from './types';
import { predictHeartDisease } from './utils/prediction';
import { savePrediction } from './utils/storage';
import CustomCursor from './components/CustomCursor';

// Lazy loaded components for code splitting optimization
const HomePage = lazy(() => import('./components/HomePage'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const PredictionForm = lazy(() => import('./components/PredictionForm'));
const Chatbot = lazy(() => import('./components/Chatbot'));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background text-primary">
    <div className="animate-pulse font-mono tracking-widest uppercase text-xs">Loading...</div>
  </div>
);

// Lightweight built-in Toast — no extra library needed
function Toast({ message, type, onClose }: { message: string; type: 'error' | 'warning' | 'success'; onClose: () => void }) {
  const colors = {
    error:   'bg-primary/10 border-primary/40 text-primary',
    warning: 'bg-yellow-500/10 border-yellow-500/40 text-yellow-400',
    success: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-5 py-3 rounded-sm border font-mono text-xs uppercase tracking-widest shadow-xl backdrop-blur-sm ${colors[type]}`}
    >
      <span className="text-sm">{type === 'error' ? '⚠️' : type === 'warning' ? '📡' : '✅'}</span>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 transition-opacity">✕</button>
    </motion.div>
  );
}

function AppLayout() {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'warning' | 'success' } | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const location = useLocation();

  const showToast = (message: string, type: 'error' | 'warning' | 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handlePredict = async (data: PatientData) => {
    setIsLoading(true);
    try {
      const result = await predictHeartDisease(data);
      // Check if fallback offline mode was used
      if ((result as PredictionResult & { isOffline?: boolean }).isOffline) {
        setIsOffline(true);
        showToast('Demo mode — backend offline. Results are estimated.', 'warning');
      } else {
        setIsOffline(false);
      }
      setPrediction(result);
      setPatientData(data);
      savePrediction(result, data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error connecting to prediction service', error);
      showToast('Prediction failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPrediction(null);
    setPatientData(null);
  };

  return (
    <div className="min-h-screen bg-background font-mono text-text selection:bg-primary/20">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* Offline Demo Banner */}
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-2 text-center font-mono text-[10px] uppercase tracking-widest text-yellow-400"
          >
            📡 Demo Mode — Backend offline. Results use local estimation.
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto px-4 py-12 md:py-20">
        <Header />

        <main>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
                >
                  <div className="lg:col-span-12">
                    {!prediction || !patientData ? (
                      <PredictionForm onSubmit={handlePredict} isLoading={isLoading} />
                    ) : (
                      <ResultsSection prediction={prediction} patientData={patientData} onReset={handleReset} />
                    )}
                  </div>
                </motion.div>
              } />
              <Route path="/dashboard" element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Dashboard />
                </motion.div>
              } />
            </Routes>
          </AnimatePresence>
        </main>

        <InfoSection />

        <footer className="mt-20 pt-8 border-t border-divider text-center text-muted text-xs uppercase tracking-widest">
          <p>© {new Date().getFullYear()} CardioPredict AI • Clinical Accuracy Prediction Model</p>
        </footer>
      </div>

      <Chatbot prediction={prediction} patientData={patientData} />
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname.split('/')[1] || '/'}>
          <Route path="/" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <HomePage />
            </motion.div>
          } />
          <Route path="/app/*" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <AppLayout />
            </motion.div>
          } />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

function App() {
  return (
    <Router>
      <CustomCursor />
      <AppContent />
    </Router>
  );
}

export default App;
