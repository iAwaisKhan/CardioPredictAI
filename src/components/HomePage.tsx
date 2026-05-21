import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../homepage.css';

const HomePage: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  const ekgPathRef = useRef<SVGPathElement>(null);
  const ekgGlowRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    // Nav scroll
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);

    // Hover effects for cursor are now handled globally.

    // Intersection Observer for scroll reveal
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // EKG Animation
    const ekgPath = ekgPathRef.current;
    const ekgGlow = ekgGlowRef.current;
    let ekgAnimationFrameId: number;

    if (ekgPath && ekgGlow) {
      const len = ekgPath.getTotalLength ? ekgPath.getTotalLength() : 800;
      ekgPath.style.strokeDasharray = `${len}`;
      ekgPath.style.strokeDashoffset = `${len}`;
      ekgGlow.style.strokeDasharray = `${len}`;
      ekgGlow.style.strokeDashoffset = `${len}`;

      let start: number | null = null;
      const duration = 2000;
      const pause = 600;

      const draw = (ts: number) => {
        if (!start) start = ts;
        const elapsed = ts - start;
        const progress = Math.min(elapsed / duration, 1);
        const offset = len * (1 - progress);
        
        if (ekgPath && ekgGlow) {
          ekgPath.style.strokeDashoffset = `${offset}`;
          ekgGlow.style.strokeDashoffset = `${offset}`;
        }
        
        if (progress < 1) {
          ekgAnimationFrameId = requestAnimationFrame(draw);
        } else {
          setTimeout(() => {
            if (ekgPath && ekgGlow) {
              ekgPath.style.strokeDashoffset = `${len}`;
              ekgGlow.style.strokeDashoffset = `${len}`;
            }
            start = null;
            ekgAnimationFrameId = requestAnimationFrame(draw);
          }, pause);
        }
      };
      ekgAnimationFrameId = requestAnimationFrame(draw);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (ekgAnimationFrameId) cancelAnimationFrame(ekgAnimationFrameId);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="homepage-wrapper">
      {/* Custom cursor now injected globally by CustomCursor component */}

      {/* NAV */}
      <nav id="nav" className={scrolled ? 'scrolled' : ''}>
        <a href="#" className="nav-logo">
          <div className="nav-logo-dot"></div>
          CardioPredictAI
        </a>
        <ul className="nav-links">
          <li><a href="#how">How it Works</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#stack">Tech Stack</a></li>
        </ul>
        <Link to="/app" className="nav-cta">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1L11 6L6 11M1 6H11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Launch App
        </Link>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg-text">Cardio</div>

        {/* EKG background */}
        <svg className="ekg-bg" viewBox="0 0 1400 160" preserveAspectRatio="none" fill="none">
          <path d="M0 80 L100 80 L140 80 L160 20 L180 140 L200 80 L220 80 L240 80 L260 80 L280 80 L320 80 L340 80 L360 20 L380 140 L400 80 L420 80 L440 80 L460 80 L500 80 L520 80 L540 20 L560 140 L580 80 L600 80 L640 80 L660 80 L680 20 L700 140 L720 80 L740 80 L760 80 L800 80 L820 80 L840 20 L860 140 L880 80 L900 80 L940 80 L960 80 L980 20 L1000 140 L1020 80 L1040 80 L1080 80 L1100 80 L1120 20 L1140 140 L1160 80 L1180 80 L1220 80 L1240 80 L1260 20 L1280 140 L1300 80 L1400 80"
          stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

        <div className="hero-inner">
          {/* Left */}
          <div>
            <div className="tag reveal">
              <div className="tag-dot"></div>
              ML-powered clinical assessment
            </div>
            <h1 className="hero-title reveal reveal-d1">
              Predict<br/>heart risk<br/><em>precisely.</em>
            </h1>
            <p className="hero-desc reveal reveal-d2">
              A clinical-grade heart disease prediction system trained on the UCI dataset — 13 biomarkers, real-time inference, and a FastAPI backend serving a GridSearchCV-optimised ML model.
            </p>
            <div className="hero-actions reveal reveal-d3">
              <Link to="/app" className="btn-primary">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L13 7L7 13M1 7H13" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Launch App
              </Link>
              <a href="https://github.com/iAwaisKhan/CardioPredictAI" className="btn-ghost" target="_blank" rel="noreferrer">
                View on GitHub
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7H11M8 4L11 7L8 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            </div>
          </div>

          {/* Right: Live panel */}
          <div className="hero-panel reveal reveal-d2">
            <div className="panel-card">
              <div className="panel-header">
                <span className="panel-title">Live Assessment</span>
                <span className="panel-status">
                  <span className="status-dot"></span>
                  Model Active
                </span>
              </div>

              {/* EKG Animation */}
              <div className="ekg-container">
                <svg className="ekg-svg" viewBox="0 0 400 72" preserveAspectRatio="none" fill="none">
                  <defs>
                    <linearGradient id="ekgGrad" x1="0" x2="1" y1="0" y2="0">
                      <stop offset="0%" stopColor="#e63232" stopOpacity="0"/>
                      <stop offset="50%" stopColor="#e63232" stopOpacity="1"/>
                      <stop offset="100%" stopColor="#e63232" stopOpacity="0"/>
                    </linearGradient>
                    <clipPath id="ekgClip">
                      <rect x="0" y="0" width="400" height="72"/>
                    </clipPath>
                  </defs>
                  <g clipPath="url(#ekgClip)">
                    <path ref={ekgPathRef} id="ekgPath"
                      d="M0 36 L40 36 L55 36 L65 10 L75 58 L85 36 L100 36 L140 36 L155 36 L165 10 L175 58 L185 36 L200 36 L240 36 L255 36 L265 10 L275 58 L285 36 L300 36 L340 36 L355 36 L365 10 L375 58 L385 36 L400 36"
                      stroke="url(#ekgGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path ref={ekgGlowRef} id="ekgPathGlow"
                      d="M0 36 L40 36 L55 36 L65 10 L75 58 L85 36 L100 36 L140 36 L155 36 L165 10 L175 58 L185 36 L200 36 L240 36 L255 36 L265 10 L275 58 L285 36 L300 36 L340 36 L355 36 L365 10 L375 58 L385 36 L400 36"
                      stroke="rgba(230,50,50,0.15)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                </svg>
              </div>

              {/* Data grid */}
              <div className="data-grid">
                <div className="data-item">
                  <div className="data-label">Age</div>
                  <div className="data-value">63 <span>yrs</span></div>
                </div>
                <div className="data-item">
                  <div className="data-label">Cholesterol</div>
                  <div className="data-value highlight">233 <span>mg/dl</span></div>
                </div>
                <div className="data-item">
                  <div className="data-label">Max Heart Rate</div>
                  <div className="data-value">150 <span>bpm</span></div>
                </div>
                <div className="data-item">
                  <div className="data-label">Risk Level</div>
                  <div className="data-value highlight">23%</div>
                </div>
              </div>

              {/* Risk bar */}
              <div className="risk-bar-wrap">
                <div className="risk-bar-header">
                  <span>Disease probability</span>
                  <span>Low Risk</span>
                </div>
                <div className="risk-bar-track">
                  <div className="risk-bar-fill"></div>
                </div>
              </div>

              <p className="panel-note">
                Prediction: <strong style={{ color: 'var(--text)' }}>No Heart Disease Detected</strong> &nbsp;·&nbsp; Confidence: 77% &nbsp;·&nbsp; Model: SVM (GridSearchCV)
              </p>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="hero-stats">
          <div className="stat-item reveal">
            <div className="stat-number">303</div>
            <div className="stat-label">Training samples</div>
          </div>
          <div className="stat-item reveal reveal-d1">
            <div className="stat-number">13</div>
            <div className="stat-label">Clinical biomarkers</div>
          </div>
          <div className="stat-item reveal reveal-d2">
            <div className="stat-number">6</div>
            <div className="stat-label">Algorithms evaluated</div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section" id="how">
        <div className="section-tag reveal">How it works</div>
        <h2 className="section-title reveal reveal-d1">From biomarkers<br/>to <em>clarity.</em></h2>

        <div className="how-grid">
          <div className="how-steps">
            <div className="step reveal">
              <div className="step-num">01</div>
              <div>
                <div className="step-title">Enter 13 clinical parameters</div>
                <div className="step-desc">Input patient vitals including age, sex, chest pain type, cholesterol, resting ECG, exercise angina, ST depression, and more — all mapped to UCI Heart Disease Dataset features.</div>
              </div>
            </div>
            <div className="step reveal reveal-d1">
              <div className="step-num">02</div>
              <div>
                <div className="step-title">Feature normalization</div>
                <div className="step-desc">The FastAPI backend applies a pre-fitted StandardScaler to normalize the feature vector — ensuring the model receives data in the exact distribution it was trained on.</div>
              </div>
            </div>
            <div className="step reveal reveal-d2">
              <div className="step-num">03</div>
              <div>
                <div className="step-title">ML inference via predict_proba()</div>
                <div className="step-desc">The best-performing model (selected via 5-fold GridSearchCV across Logistic Regression, Random Forest, and SVM) returns class probabilities — not just a binary output.</div>
              </div>
            </div>
            <div className="step reveal reveal-d3">
              <div className="step-num">04</div>
              <div>
                <div className="step-title">Risk stratification + recommendations</div>
                <div className="step-desc">Probabilities are mapped to risk tiers (Low / Moderate / High / Very High), displayed with an animated confidence bar and personalised health tips calibrated to severity.</div>
              </div>
            </div>
          </div>

          <div className="feature-visual reveal reveal-d1">
            <div className="feature-visual-header">
              <div className="dot-red"></div>
              <div className="dot-yellow"></div>
              <div className="dot-green"></div>
              <span className="fv-title">Patient Parameters</span>
            </div>
            <div className="feature-visual-body">
              <div className="params-list">
                <div className="param-row"><span className="param-name">age</span><span className="param-val">63</span></div>
                <div className="param-row"><span className="param-name">sex</span><span className="param-val">Male</span></div>
                <div className="param-row"><span className="param-name">cp — chest pain</span><span className="param-val">Typical Angina</span></div>
                <div className="param-row"><span className="param-name">trestbps — resting BP</span><span className="param-val red">145 mmHg</span></div>
                <div className="param-row"><span className="param-name">chol — cholesterol</span><span className="param-val red">233 mg/dl</span></div>
                <div className="param-row"><span className="param-name">fbs — fasting blood sugar</span><span className="param-val">≤ 120</span></div>
                <div className="param-row"><span className="param-name">restecg</span><span className="param-val">Normal</span></div>
                <div className="param-row"><span className="param-name">thalach — max HR</span><span className="param-val">150 bpm</span></div>
                <div className="param-row"><span className="param-name">exang — exercise angina</span><span className="param-val">No</span></div>
                <div className="param-row"><span className="param-name">oldpeak — ST depression</span><span className="param-val red">2.3</span></div>
                <div className="param-row"><span className="param-name">slope</span><span className="param-val">Flat</span></div>
                <div className="param-row"><span className="param-name">ca — major vessels</span><span className="param-val">0</span></div>
                <div className="param-row"><span className="param-name">thal — thalassemia</span><span className="param-val">Reversible Defect</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section" id="features">
        <div className="section-tag reveal">Capabilities</div>
        <h2 className="section-title reveal reveal-d1">Built for<br/><em>real use.</em></h2>

        <div className="features-grid">
          <div className="feature-card reveal">
            <div className="feature-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1L10.5 6H15L11 9.5L12.5 15L8 12L3.5 15L5 9.5L1 6H5.5L8 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
            </div>
            <div className="feature-name">ML Model Pipeline</div>
            <div className="feature-desc">GridSearchCV across 3 algorithms with 5-fold cross-validation. The best model by test accuracy is serialised and served — no hard-coding.</div>
          </div>
          <div className="feature-card reveal reveal-d1">
            <div className="feature-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M5 8H11M8 5V11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
            </div>
            <div className="feature-name">FastAPI Backend</div>
            <div className="feature-desc">REST endpoint with Pydantic validation, automatic OpenAPI docs, and structured `PredictionResponse` — returns probabilities for both classes.</div>
          </div>
          <div className="feature-card reveal reveal-d2">
            <div className="feature-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 12L6 7L9 10L12 6L14 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className="feature-name">Health Dashboard</div>
            <div className="feature-desc">Track risk trends over time. Recharts LineChart + RadarChart compare your average metrics to healthy baselines — all persisted locally.</div>
          </div>
          <div className="feature-card reveal">
            <div className="feature-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2"/><path d="M8 5V8L10 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
            </div>
            <div className="feature-name">Offline Fallback</div>
            <div className="feature-desc">When the backend is unreachable, a heuristic model handles inference client-side — no broken states, no blank screens.</div>
          </div>
          <div className="feature-card reveal reveal-d1">
            <div className="feature-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8C3 5.24 5.24 3 8 3C10.76 3 13 5.24 13 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M1 11L3 8L5 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M11 11L13 8L15 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className="feature-name">Risk Stratification</div>
            <div className="feature-desc">Four-tier output (Low → Very High) with probability thresholds at 25%, 50%, and 75% — plus severity-matched health recommendations.</div>
          </div>
          <div className="feature-card reveal reveal-d2">
            <div className="feature-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 14V6L8 2L14 6V14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><rect x="6" y="10" width="4" height="4" stroke="currentColor" strokeWidth="1.2"/></svg>
            </div>
            <div className="feature-name">Deployed on Vercel</div>
            <div className="feature-desc">SPA routing via `vercel.json` rewrite rules, Vite-optimised build, TypeScript strict mode. Frontend ships in seconds.</div>
          </div>
        </div>
      </section>

      {/* STACK */}
      <section className="stack-section" id="stack">
        <div className="section-tag reveal">Tech Stack</div>
        <h2 className="section-title reveal reveal-d1">Engineered<br/>to <em>last.</em></h2>

        <div className="stack-grid">
          <div className="stack-group reveal">
            <div className="stack-group-header">Frontend</div>
            <div className="stack-items">
              <div className="stack-item"><span className="stack-item-name">React 18</span><span className="stack-item-badge">UI Library</span></div>
              <div className="stack-item"><span className="stack-item-name">TypeScript</span><span className="stack-item-badge">Type Safety</span></div>
              <div className="stack-item"><span className="stack-item-name">Vite</span><span className="stack-item-badge">Build Tool</span></div>
              <div className="stack-item"><span className="stack-item-name">Tailwind CSS</span><span className="stack-item-badge">Styling</span></div>
              <div className="stack-item"><span className="stack-item-name">Framer Motion</span><span className="stack-item-badge">Animations</span></div>
              <div className="stack-item"><span className="stack-item-name">Recharts</span><span className="stack-item-badge">Visualisation</span></div>
              <div className="stack-item"><span className="stack-item-name">React Router v7</span><span className="stack-item-badge">Routing</span></div>
            </div>
          </div>
          <div className="stack-group reveal reveal-d1">
            <div className="stack-group-header">Backend & ML</div>
            <div className="stack-items">
              <div className="stack-item"><span className="stack-item-name">FastAPI</span><span className="stack-item-badge">REST API</span></div>
              <div className="stack-item"><span className="stack-item-name">Pydantic</span><span className="stack-item-badge">Validation</span></div>
              <div className="stack-item"><span className="stack-item-name">scikit-learn</span><span className="stack-item-badge">ML Framework</span></div>
              <div className="stack-item"><span className="stack-item-name">StandardScaler</span><span className="stack-item-badge">Preprocessing</span></div>
              <div className="stack-item"><span className="stack-item-name">SVM / RF / LR</span><span className="stack-item-badge">Algorithms</span></div>
              <div className="stack-item"><span className="stack-item-name">GridSearchCV</span><span className="stack-item-badge">Hyperparameter Tuning</span></div>
              <div className="stack-item"><span className="stack-item-name">UCI Heart Dataset</span><span className="stack-item-badge">Training Data</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA removed as requested */}

      {/* FOOTER */}
      <footer>
        <div className="footer-left">
          Built by <strong>Awais Khan</strong> · CardioPredictAI © {new Date().getFullYear()}
        </div>
        <div className="footer-links">
          <a href="https://github.com/iAwaisKhan" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/khanawais" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://awaisdevs.vercel.app" target="_blank" rel="noreferrer">Portfolio</a>
        </div>
        <div className="footer-disclaimer">
          For educational purposes only. Not a substitute for professional medical advice.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
