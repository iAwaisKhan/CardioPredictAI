import React from 'react';

const InfoSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
      <div className="card bg-slate-50 border-none shadow-none">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <span>📊</span> About This Tool
        </h3>
        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
          This AI-powered predictor uses advanced machine learning algorithms trained on the UCI Heart Disease Dataset containing 303 patient samples.
        </p>
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Algorithms Evaluated</div>
          <ul className="grid grid-cols-2 gap-2">
            {['Logistic Regression', 'Random Forest', 'SVM', 'Gradient Boosting', 'Decision Tree', 'K-Neighbors'].map(algo => (
              <li key={algo} className="bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-700 font-medium">
                {algo}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card bg-slate-50 border-none shadow-none">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <span>📖</span> How to Use
        </h3>
        <ul className="space-y-3">
          {[
            'Fill in all 13 health parameters accurately',
            'Ensure values are within clinical ranges',
            'Review the risk assessment and suggestions',
            'Consult a professional for diagnosis'
          ].map((step, idx) => (
            <li key={idx} className="flex gap-3 text-sm text-slate-600">
              <span className="shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xs">{idx + 1}</span>
              {step}
            </li>
          ))}
        </ul>
      </div>

      <div className="col-span-full bg-amber-50 border border-amber-200 p-6 rounded-xl text-amber-900">
        <p className="text-sm font-medium flex gap-2">
          <span className="text-lg">⚠️</span>
          <span><strong>Important Disclaimer:</strong> This tool is for educational and informational purposes only. It should NOT be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider regarding any medical conditions or concerns.</span>
        </p>
      </div>
    </div>
  );
};

export default InfoSection;
