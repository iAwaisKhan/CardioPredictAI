import React from 'react';
import { Tip } from '../types';

interface HealthTipsProps {
  riskPercentage: number;
}

const HealthTips: React.FC<HealthTipsProps> = ({ riskPercentage }) => {
  const getTips = (risk: number): Tip[] => {
    if (risk >= 75) {
      return [
        { icon: '🚨', title: 'Cardiologist Consultation', text: 'Schedule an immediate appointment to discuss these results.', priority: 'urgent' },
        { icon: '💊', title: 'Medication Review', text: 'Discuss preventive medications like statins or beta-blockers.', priority: 'urgent' },
        { icon: '🚭', title: 'Total Lifestyle Audit', text: 'Eliminate smoking and alcohol immediately, and reduce sodium.', priority: 'high' },
      ];
    } else if (risk >= 50) {
      return [
        { icon: '👨‍⚕️', title: 'Medical Evaluation', text: 'Schedule a checkup within 2 weeks to review metrics.', priority: 'high' },
        { icon: '📊', title: 'Daily Monitoring', text: 'Start tracking blood pressure and heart rate daily.', priority: 'high' },
        { icon: '🥗', title: 'DASH/Mediterranean Diet', text: 'Prioritize whole foods and lean proteins.', priority: 'normal' },
      ];
    } else {
      return [
        { icon: '🎉', title: 'Maintain Momentum', text: 'Your heart health looks great. Keep up your current habits!', priority: 'normal' },
        { icon: '🏃', title: 'Physical Activity', text: 'Maintain 150 mins of moderate aerobic exercise weekly.', priority: 'normal' },
        { icon: '😴', title: 'Quality Sleep', text: 'Ensure 7-9 hours of rest for cardiovascular recovery.', priority: 'normal' },
      ];
    }
  };

  const tips = getTips(riskPercentage);

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span>💡</span> Personalized Recommendations
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tips.map((tip, idx) => (
          <div 
            key={idx} 
            className={`p-4 rounded-xl border-2 transition-all hover:shadow-md ${
              tip.priority === 'urgent' ? 'border-red-100 bg-red-50 text-red-900' : 
              tip.priority === 'high' ? 'border-orange-100 bg-orange-50 text-orange-900' : 
              'border-emerald-100 bg-emerald-50 text-emerald-900'
            }`}
          >
            <div className="text-3xl mb-2">{tip.icon}</div>
            <h4 className="font-bold mb-1">{tip.title}</h4>
            <p className="text-sm opacity-80">{tip.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthTips;
