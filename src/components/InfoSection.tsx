const InfoSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">

      {/* About This Tool */}
      <div className="bg-surface border border-divider rounded-sm p-8">
        <h3 className="text-xs uppercase tracking-widest font-mono text-muted mb-6 flex items-center gap-2">
          <span>📊</span> About This Tool
        </h3>
        <p className="text-sm text-muted mb-4 leading-relaxed font-mono">
          This AI-powered predictor uses advanced machine learning algorithms trained on the UCI Heart Disease Dataset containing 303 patient samples.
        </p>
        <div className="space-y-2">
          <div className="text-[10px] font-mono text-muted uppercase tracking-widest mb-2">Algorithms Evaluated</div>
          <ul className="grid grid-cols-2 gap-2">
            {['Logistic Regression', 'Random Forest', 'SVM', 'Gradient Boosting', 'Decision Tree', 'K-Neighbors'].map(algo => (
              <li key={algo} className="bg-card px-3 py-2 rounded-sm border border-divider text-xs text-text font-mono">
                {algo}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* How to Use */}
      <div className="bg-surface border border-divider rounded-sm p-8">
        <h3 className="text-xs uppercase tracking-widest font-mono text-muted mb-6 flex items-center gap-2">
          <span>📖</span> How to Use
        </h3>
        <ul className="space-y-3">
          {[
            'Fill in all 13 health parameters accurately',
            'Ensure values are within clinical ranges',
            'Review the risk assessment and suggestions',
            'Consult a professional for diagnosis'
          ].map((step, idx) => (
            <li key={idx} className="flex gap-3 text-sm text-muted font-mono">
              <span className="shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-sm flex items-center justify-center font-bold text-xs">
                {idx + 1}
              </span>
              {step}
            </li>
          ))}
        </ul>
      </div>

      {/* Disclaimer */}
      <div className="col-span-full bg-primary/5 border border-primary/20 p-6 rounded-sm">
        <p className="text-xs font-mono flex gap-3 leading-relaxed text-text">
          <span className="text-lg shrink-0">⚠️</span>
          <span>
            <strong className="text-primary uppercase tracking-widest">Important Disclaimer: </strong>
            This tool is for educational and informational purposes only. It should NOT be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider regarding any medical conditions or concerns.
          </span>
        </p>
      </div>

    </div>
  );
};

export default InfoSection;

