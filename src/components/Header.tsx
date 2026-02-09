import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Home } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className="mb-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">🛡️ CardioPredict AI</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Clinical-grade heart disease risk assessment powered by machine learning and health telemetry
        </p>
      </div>

      <nav className="flex justify-center gap-4">
        <Link
          to="/"
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${location.pathname === '/'
              ? 'bg-primary text-black font-medium shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
        >
          <Home className="w-4 h-4" />
          Predict
        </Link>
        <Link
          to="/dashboard"
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${location.pathname === '/dashboard'
              ? 'bg-primary text-black font-medium shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
        >
          <Activity className="w-4 h-4" />
          Dashboard
        </Link>
      </nav>
    </header>
  );
};

export default Header;
