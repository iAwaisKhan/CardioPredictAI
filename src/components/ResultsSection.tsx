import React from 'react';
import { motion } from 'framer-motion';
import { PredictionResult } from '../types';
import HealthTips from './HealthTips';

interface ResultsSectionProps {
  prediction: PredictionResult;
  onReset: () => void;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ prediction, onReset }) => {
  const isHighRisk = prediction.hasDisease;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className={`card text-center p-8 border-t-8 ${isHighRisk ? 'border-t-red-500' : 'border-t-emerald-500'}`}>
        <div className="text-5xl mb-4">{isHighRisk ? '⚠️' : '✅'}</div>
        <h2 className={`text-3xl font-bold mb-2 ${isHighRisk ? 'text-red-600' : 'text-emerald-600'}`}>
          {isHighRisk ? 'HIGH RISK DETECTED' : 'LOW RISK DETECTED'}
        </h2>
        <div className="text-slate-500 font-medium mb-8">
          Confidence: {isHighRisk ? prediction.diseaseProb : prediction.noDiseaseProb}%
        </div>

        <div className="space-y-4 max-w-md mx-auto mb-8">
           <div className="flex justify-between text-sm font-semibold text-slate-600 mb-1">
             <span>Risk Level</span>
             <span>{prediction.diseaseProb}%</span>
           </div>
           <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${prediction.diseaseProb}%` }}
               transition={{ duration: 1, ease: "easeOut" }}
               className={`h-full ${isHighRisk ? 'bg-red-500' : 'bg-emerald-500'}`}
             />
           </div>
        </div>

        <p className="text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-200">
          {isHighRisk 
            ? 'Based on the provided health parameters, the model indicates a high risk of heart disease. Immediate consultation with a healthcare professional is strongly recommended.'
            : 'Based on the provided health parameters, the model indicates a low risk of heart disease. Continue maintaining a healthy lifestyle and regular checkups.'}
        </p>
      </div>

      <HealthTips riskPercentage={prediction.diseaseProb} />

      <button onClick={onReset} className="btn w-full bg-slate-200 text-slate-700 hover:bg-slate-300">
        Reset and New Assessment
      </button>
    </motion.div>
  );
};

export default ResultsSection;
