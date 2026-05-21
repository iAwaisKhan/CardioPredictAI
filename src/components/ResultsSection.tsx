import React, { useEffect, useRef, useState } from 'react';
import { motion, animate, useMotionValue, useTransform } from 'framer-motion';
import { PredictionResult, PatientData } from '../types';
import HealthTips from './HealthTips';

interface ResultsSectionProps {
  prediction: PredictionResult;
  patientData: PatientData;
  onReset: () => void;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ prediction, patientData, onReset }) => {
  const isHighRisk = prediction.hasDisease;
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const [displayCount, setDisplayCount] = useState(0);
  const reportRef = useRef<HTMLDivElement>(null);

  // Animate counter on mount
  useEffect(() => {
    const target = isHighRisk ? prediction.diseaseProb : prediction.noDiseaseProb;
    const animation = animate(count, target, { duration: 1.5, ease: 'easeOut' });
    return animation.stop;
  }, [prediction, isHighRisk, count]);

  // Subscribe to MotionValue — fix for Framer Motion v10 where MotionValues
  // cannot be rendered directly as children
  useEffect(() => {
    const unsubscribe = rounded.on('change', (v) => setDisplayCount(Math.round(v)));
    return unsubscribe;
  }, [rounded]);

  // Dynamically import html2pdf so it's NOT in the initial bundle (~500KB saved)
  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    const html2pdf = (await import('html2pdf.js')).default;
    const opt = {
      margin: 1,
      filename: `CardioPredict_Report_${new Date().getTime()}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in' as const, format: 'letter', orientation: 'portrait' as const }
    };
    html2pdf().from(reportRef.current).set(opt).save();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div ref={reportRef} className="bg-background rounded-sm p-1">
        <div className={`card text-center p-8 border-t-8 ${isHighRisk ? 'border-t-primary' : 'border-t-emerald-500'}`}>
          <div className="text-5xl mb-4">{isHighRisk ? '⚠️' : '✅'}</div>
          <h2 className={`font-serif text-3xl font-bold mb-2 ${isHighRisk ? 'text-primary' : 'text-emerald-500'}`}>
            {isHighRisk ? 'HIGH RISK DETECTED' : 'LOW RISK DETECTED'}
          </h2>
          <div className="text-muted font-medium mb-8 font-mono flex justify-center items-center gap-1">
            Confidence: <span>{displayCount}</span>%
          </div>

          <div className="space-y-4 max-w-md mx-auto mb-8">
             <div className="flex justify-between text-[11px] uppercase tracking-widest font-mono text-muted mb-1">
               <span>Risk Level</span>
               <span>{prediction.diseaseProb}%</span>
             </div>
             <div className="w-full bg-background border border-divider rounded-sm h-4 overflow-hidden relative">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${prediction.diseaseProb}%` }}
                 transition={{ duration: 1.5, ease: "easeOut" }}
                 className={`h-full ${isHighRisk ? 'bg-primary' : 'bg-emerald-500'}`}
               />
             </div>
          </div>

          <p className="text-text bg-background p-4 rounded-sm border border-divider font-mono text-sm mb-6">
            {isHighRisk 
              ? 'Based on the provided health parameters, the model indicates a high risk of heart disease. Immediate consultation with a healthcare professional is strongly recommended.'
              : 'Based on the provided health parameters, the model indicates a low risk of heart disease. Continue maintaining a healthy lifestyle and regular checkups.'}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left font-mono text-xs border-t border-divider pt-6">
            <div><span className="text-muted block mb-1">Age</span> {patientData.age}</div>
            <div><span className="text-muted block mb-1">Sex</span> {patientData.sex === 1 ? 'Male' : 'Female'}</div>
            <div><span className="text-muted block mb-1">BP</span> {patientData.trestbps} mmHg</div>
            <div><span className="text-muted block mb-1">Cholesterol</span> {patientData.chol} mg/dl</div>
          </div>
        </div>
      </div>

      <HealthTips riskPercentage={prediction.diseaseProb} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button onClick={handleExportPDF} className="btn w-full bg-surface border border-divider text-primary hover:text-white hover:bg-primary/20 font-mono flex items-center justify-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Export Clinical Report
        </button>
        <button onClick={onReset} className="btn w-full bg-card border border-divider text-muted hover:text-text hover:bg-surface font-mono">
          Reset and New Assessment
        </button>
      </div>
    </motion.div>
  );
};

export default ResultsSection;
