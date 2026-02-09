import React, { useEffect, useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { Activity, Heart, TrendingUp } from 'lucide-react';
import { getPredictionHistory, getAverageMetrics, clearHistory } from '../utils/storage';
import { StoredPrediction } from '../types';

const Dashboard: React.FC = () => {
    const [history, setHistory] = useState<StoredPrediction[]>([]);
    const [averages, setAverages] = useState<any>(null);

    useEffect(() => {
        const data = getPredictionHistory();
        setHistory(data);
        setAverages(getAverageMetrics(data));
    }, []);

    const handleClearHistory = () => {
        if (confirm('Are you sure you want to clear your prediction history?')) {
            clearHistory();
            setHistory([]);
            setAverages(null);
        }
    };

    if (history.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="bg-slate-50 rounded-2xl p-12 max-w-lg mx-auto border border-slate-200">
                    <Activity className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">No Data Available</h2>
                    <p className="text-slate-500">
                        Make some predictions to see your health trends and statistics here.
                    </p>
                </div>
            </div>
        );
    }

    // Prepare data for Line Chart (History)
    const lineChartData = history.slice().reverse().map((item, index) => ({
        name: `Prediction ${index + 1}`,
        risk: item.diseaseProb,
        date: new Date(item.timestamp).toLocaleDateString()
    }));

    // Prepare data for Radar Chart
    // Comparing average user metrics to "Healthy" baselines (approximate)
    const radarData = averages ? [
        { subject: 'Cholesterol', A: averages.chol, B: 200, fullMark: 300 }, // Healthy < 200
        { subject: 'Max Heart Rate', A: averages.thalach, B: 150, fullMark: 220 }, // Avg ~150 (varies by age)
        { subject: 'Resting BP', A: averages.trestbps, B: 120, fullMark: 180 }, // Healthy < 120
    ] : [];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-800">Health Dashboard</h1>
                <button
                    onClick={handleClearHistory}
                    className="text-sm text-red-500 hover:text-red-700 font-medium px-4 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                    Clear History
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Risk Trend Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-slate-700">Risk Assessment Trend</h3>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={lineChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="risk"
                                    stroke="#ef4444"
                                    strokeWidth={3}
                                    dot={{ fill: '#ef4444', strokeWidth: 0, r: 4 }}
                                    activeDot={{ r: 6 }}
                                    name="Risk Probability (%)"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Metrics Comparison */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-6">
                        <Heart className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-slate-700">Average Metrics vs Healthy Baseline</h3>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 250]} tick={false} axisLine={false} />
                                <Radar
                                    name="Your Average"
                                    dataKey="A"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    fill="#3b82f6"
                                    fillOpacity={0.5}
                                />
                                <Radar
                                    name="Healthy Baseline"
                                    dataKey="B"
                                    stroke="#22c55e"
                                    strokeWidth={2}
                                    fill="#22c55e"
                                    fillOpacity={0.3}
                                />
                                <Legend iconType="circle" />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-700">Recent Predictions</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Prediction</th>
                                <th className="px-6 py-4 font-medium">Probability</th>
                                <th className="px-6 py-4 font-medium">Risk Level</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {history.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-slate-600">
                                        {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.hasDisease ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                            {item.hasDisease ? 'Positive' : 'Negative'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {item.diseaseProb.toFixed(1)}%
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`font-medium ${item.riskLevel === 'Low' ? 'text-green-600' :
                                            item.riskLevel === 'Moderate' ? 'text-yellow-600' :
                                                'text-red-600'
                                            }`}>
                                            {item.riskLevel}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
