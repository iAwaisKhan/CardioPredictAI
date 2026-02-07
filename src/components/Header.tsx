import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-10">
      <h1 className="text-4xl font-bold text-slate-900 mb-2">🛡️ CardioPredict AI</h1>
      <p className="text-slate-500 max-w-2xl mx-auto">
        Clinical-grade heart disease risk assessment powered by machine learning and health telemetry
      </p>
    </header>
  );
};

export default Header;
