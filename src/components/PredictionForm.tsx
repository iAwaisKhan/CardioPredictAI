import React, { useState } from 'react';
import { PatientData } from '../types';

interface PredictionFormProps {
  onSubmit: (data: PatientData) => void;
  isLoading: boolean;
}

const PredictionForm: React.FC<PredictionFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<PatientData>({
    age: 50,
    sex: 1,
    cp: 0,
    trestbps: 120,
    chol: 200,
    fbs: 0,
    restecg: 0,
    thalach: 150,
    exang: 0,
    oldpeak: 0,
    slope: 1,
    ca: 0,
    thal: 2,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : parseInt(value)
    }));
  };

  const handleRadioChange = (name: keyof PatientData, value: number) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-6">Patient Health Parameters</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Patient Info */}
        <section>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
            <span>👤</span> Patient Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="form-label" htmlFor="age">Age</label>
              <input type="number" id="age" name="age" className="form-control" min="29" max="80" value={formData.age} onChange={handleChange} required />
            </div>
            <div>
              <label className="form-label">Sex</label>
              <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
                <button type="button" onClick={() => handleRadioChange('sex', 1)} className={`flex-1 py-2 rounded-md transition-all ${formData.sex === 1 ? 'bg-white shadow text-primary font-bold' : 'text-slate-500'}`}>Male</button>
                <button type="button" onClick={() => handleRadioChange('sex', 0)} className={`flex-1 py-2 rounded-md transition-all ${formData.sex === 0 ? 'bg-white shadow text-primary font-bold' : 'text-slate-500'}`}>Female</button>
              </div>
            </div>
            <div>
              <label className="form-label" htmlFor="cp">Chest Pain Type</label>
              <select id="cp" name="cp" className="form-control" value={formData.cp} onChange={handleChange} required>
                <option value="0">Typical Angina</option>
                <option value="1">Atypical Angina</option>
                <option value="2">Non-Anginal Pain</option>
                <option value="3">Asymptomatic</option>
              </select>
            </div>
          </div>
        </section>

        {/* Clinical Measurements */}
        <section>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
            <span>🩺</span> Clinical Measurements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label" htmlFor="trestbps">Resting Blood Pressure</label>
              <input type="number" id="trestbps" name="trestbps" className="form-control" min="90" max="200" value={formData.trestbps} onChange={handleChange} required />
            </div>
            <div>
              <label className="form-label" htmlFor="chol">Serum Cholesterol</label>
              <input type="number" id="chol" name="chol" className="form-control" min="100" max="600" value={formData.chol} onChange={handleChange} required />
            </div>
          </div>
        </section>

        {/* More fields... I'll truncate for brevity in the component but include all in the final file */}
        {/* I'll add the rest of the fields now */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
              <label className="form-label">Fasting Blood Sugar</label>
              <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
                <button type="button" onClick={() => handleRadioChange('fbs', 1)} className={`flex-1 py-2 rounded-md transition-all ${formData.fbs === 1 ? 'bg-white shadow text-primary font-bold' : 'text-slate-500'}`}>{'>'} 120</button>
                <button type="button" onClick={() => handleRadioChange('fbs', 0)} className={`flex-1 py-2 rounded-md transition-all ${formData.fbs === 0 ? 'bg-white shadow text-primary font-bold' : 'text-slate-500'}`}>≤ 120</button>
              </div>
            </div>
            <div>
              <label className="form-label" htmlFor="restecg">Resting ECG</label>
              <select id="restecg" name="restecg" className="form-control" value={formData.restecg} onChange={handleChange} required>
                <option value="0">Normal</option>
                <option value="1">ST-T Abnormality</option>
                <option value="2">LV Hypertrophy</option>
              </select>
            </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label className="form-label" htmlFor="thalach">Max Heart Rate</label>
                <input type="number" id="thalach" name="thalach" className="form-control" value={formData.thalach} onChange={handleChange} required />
            </div>
            <div>
                <label className="form-label">Exercise Angina</label>
                <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
                  <button type="button" onClick={() => handleRadioChange('exang', 1)} className={`flex-1 py-2 rounded-md transition-all ${formData.exang === 1 ? 'bg-white shadow text-primary font-bold' : 'text-slate-500'}`}>Yes</button>
                  <button type="button" onClick={() => handleRadioChange('exang', 0)} className={`flex-1 py-2 rounded-md transition-all ${formData.exang === 0 ? 'bg-white shadow text-primary font-bold' : 'text-slate-500'}`}>No</button>
                </div>
            </div>
            <div>
                <label className="form-label" htmlFor="oldpeak">ST Depression</label>
                <input type="number" id="oldpeak" name="oldpeak" step="0.1" className="form-control" value={formData.oldpeak} onChange={handleChange} required />
            </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div>
                <label className="form-label" htmlFor="slope">ST Slope</label>
                <select id="slope" name="slope" className="form-control" value={formData.slope} onChange={handleChange} required>
                  <option value="0">Upsloping</option>
                  <option value="1">Flat</option>
                  <option value="2">Downsloping</option>
                </select>
            </div>
            <div>
                <label className="form-label" htmlFor="ca">Major Vessels (0-3)</label>
                <input type="number" id="ca" name="ca" min="0" max="3" className="form-control" value={formData.ca} onChange={handleChange} required />
            </div>
            <div>
                <label className="form-label" htmlFor="thal">Thalassemia</label>
                <select id="thal" name="thal" className="form-control" value={formData.thal} onChange={handleChange} required>
                  <option value="0">Normal</option>
                  <option value="1">Fixed Defect</option>
                  <option value="2">Reversible Defect</option>
                </select>
            </div>
        </section>

        <button type="submit" disabled={isLoading} className="btn btn-primary w-full text-lg">
          {isLoading ? 'Analyzing Parameters...' : 'Predict Heart Risk'}
        </button>
      </form>
    </div>
  );
};

export default PredictionForm;
