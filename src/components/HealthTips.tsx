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
      <h3 className="text-xs uppercase tracking-widest font-mono text-muted mb-6 flex items-center gap-2">
        <span>💡</span> Personalized Recommendations
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tips.map((tip, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-sm border transition-all duration-200 hover:scale-[1.02] ${
              tip.priority === 'urgent'
                ? 'border-primary/30 bg-primary/10'
                : tip.priority === 'high'
                ? 'border-yellow-500/30 bg-yellow-500/10'
                : 'border-emerald-500/30 bg-emerald-500/10'
            }`}
          >
            <div className="text-2xl mb-3">{tip.icon}</div>
            <h4 className={`font-mono text-[10px] uppercase tracking-widest mb-2 ${
              tip.priority === 'urgent' ? 'text-primary' :
              tip.priority === 'high' ? 'text-yellow-400' : 'text-emerald-400'
            }`}>{tip.title}</h4>
            <p className="text-xs text-muted leading-relaxed font-mono">{tip.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthTips;

