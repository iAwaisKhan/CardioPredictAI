import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Home, ArrowLeft } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className="mb-10 relative flex flex-col md:block items-center">
      <Link 
        to="/" 
        className="flex items-center gap-2 text-muted hover:text-primary transition-colors font-mono text-[10px] uppercase tracking-widest border border-divider hover:border-primary/30 bg-card px-3 py-1.5 rounded-sm md:absolute md:left-0 md:top-2 mb-6 md:mb-0"
      >
        <ArrowLeft size={12} /> Homepage
      </Link>
      <div className="text-center mb-10">
        <h1 className="font-serif text-5xl md:text-6xl text-text mb-4 tracking-tight">
          CardioPredict<em className="text-primary italic">AI</em>
        </h1>
        <p className="text-muted text-sm max-w-2xl mx-auto leading-relaxed font-mono">
          Clinical-grade heart disease risk assessment powered by machine learning and health telemetry
        </p>
      </div>

      <nav className="flex justify-center gap-4">
        <Link
          to="/app"
          className={`flex items-center gap-2 px-5 py-2.5 rounded-sm transition-all duration-200 border text-xs uppercase tracking-widest font-mono ${location.pathname === '/app' || location.pathname === '/app/'
              ? 'bg-primary/10 text-primary border-primary'
              : 'bg-card text-muted border-divider hover:text-text hover:bg-surface'
            }`}
        >
          <Home className="w-4 h-4" />
          Predict
        </Link>
        <Link
          to="/app/dashboard"
          className={`flex items-center gap-2 px-5 py-2.5 rounded-sm transition-all duration-200 border text-xs uppercase tracking-widest font-mono ${location.pathname === '/app/dashboard'
              ? 'bg-primary/10 text-primary border-primary'
              : 'bg-card text-muted border-divider hover:text-text hover:bg-surface'
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
