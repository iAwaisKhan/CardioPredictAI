import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        const data = getPredictionHistory();
        setHistory(data);
        setAverages(getAverageMetrics(data));
    }, []);

    const handleClearHistory = () => {
        setShowConfirm(true);
    };

    const confirmClear = () => {
        clearHistory();
        setHistory([]);
        setAverages(null);
        setShowConfirm(false);
    };

    if (history.length === 0) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
            >
                <div className="bg-surface rounded-sm p-12 max-w-lg mx-auto border border-divider">
                    <Activity className="w-16 h-16 text-muted-dark mx-auto mb-4" />
                    <h2 className="text-2xl font-serif text-text mb-2 tracking-tight">No Data Available</h2>
                    <p className="text-muted font-mono text-sm">
                        Make some predictions to see your health trends and statistics here.
                    </p>
                </div>
            </motion.div>
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

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <>
        {/* Custom Confirm Modal — replaces browser confirm() */}
        <AnimatePresence>
            {showConfirm && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="bg-surface border border-divider rounded-sm p-8 max-w-sm w-full mx-4 shadow-2xl"
                    >
                        <div className="text-2xl mb-4">🗑️</div>
                        <h3 className="font-mono text-xs uppercase tracking-widest text-text mb-2">Clear History</h3>
                        <p className="text-muted font-mono text-xs leading-relaxed mb-6">
                            This will permanently delete all your prediction records. This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={confirmClear}
                                className="flex-1 btn bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-white"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 btn bg-card border border-divider text-muted hover:text-text hover:bg-surface"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-8"
        >
            <div className="flex justify-between items-center">
                <h1 className="text-4xl md:text-5xl font-serif text-text tracking-tight">Health Dashboard</h1>
                <button
                    onClick={handleClearHistory}
                    className="text-xs text-primary hover:text-primary-light font-mono px-4 py-2 border border-primary/20 rounded-sm hover:bg-primary/10 transition-colors uppercase tracking-widest"
                >
                    Clear History
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Risk Trend Chart */}
                <motion.div variants={itemVariants} className="bg-surface p-6 rounded-sm shadow-sm border border-divider">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <h3 className="font-mono uppercase tracking-widest text-xs text-muted">Risk Assessment Trend</h3>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={lineChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="var(--muted)" fontSize={12} tickLine={false} fontFamily="var(--mono)" />
                                <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} domain={[0, 100]} fontFamily="var(--mono)" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '2px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)' }}
                                    itemStyle={{ color: 'var(--text)', fontFamily: 'var(--mono)', fontSize: '12px' }}
                                    labelStyle={{ color: 'var(--muted)', fontFamily: 'var(--mono)', fontSize: '10px', textTransform: 'uppercase' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="risk"
                                    stroke="var(--red)"
                                    strokeWidth={3}
                                    dot={{ fill: 'var(--red)', strokeWidth: 0, r: 4 }}
                                    activeDot={{ r: 6, fill: '#fff' }}
                                    name="Risk Probability (%)"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Metrics Comparison */}
                <motion.div variants={itemVariants} className="bg-surface p-6 rounded-sm shadow-sm border border-divider">
                    <div className="flex items-center gap-2 mb-6">
                        <Heart className="w-5 h-5 text-emerald-500" />
                        <h3 className="font-mono uppercase tracking-widest text-xs text-muted">Average vs Baseline</h3>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--muted)', fontSize: 10, fontFamily: 'var(--mono)' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 250]} tick={false} axisLine={false} />
                                <Radar
                                    name="Your Average"
                                    dataKey="A"
                                    stroke="#32b8c6"
                                    strokeWidth={2}
                                    fill="#32b8c6"
                                    fillOpacity={0.3}
                                />
                                <Radar
                                    name="Healthy Baseline"
                                    dataKey="B"
                                    stroke="#22c55e"
                                    strokeWidth={2}
                                    fill="#22c55e"
                                    fillOpacity={0.15}
                                />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--muted)' }} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '2px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)' }}
                                    itemStyle={{ color: 'var(--text)', fontFamily: 'var(--mono)', fontSize: '12px' }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Recent Activity */}
            <motion.div variants={itemVariants} className="bg-surface rounded-sm shadow-sm border border-divider overflow-hidden">
                <div className="p-6 border-b border-divider">
                    <h3 className="font-mono uppercase tracking-widest text-xs text-muted">Recent Predictions</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm font-mono">
                        <thead className="bg-card text-muted text-[10px] uppercase tracking-widest">
                            <tr>
                                <th className="px-6 py-4 font-normal">Date</th>
                                <th className="px-6 py-4 font-normal">Prediction</th>
                                <th className="px-6 py-4 font-normal">Probability</th>
                                <th className="px-6 py-4 font-normal">Risk Level</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-divider">
                            {history.map((item) => (
                                <motion.tr variants={itemVariants} key={item.id} className="hover:bg-card transition-colors">
                                    <td className="px-6 py-4 text-text text-xs">
                                        {new Date(item.timestamp).toLocaleDateString()} <span className="text-muted ml-2">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-sm text-[10px] uppercase tracking-widest font-normal border ${item.hasDisease ? 'bg-primary/10 text-primary border-primary/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                            }`}>
                                            {item.hasDisease ? 'Positive' : 'Negative'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-text text-xs">
                                        {item.diseaseProb.toFixed(1)}%
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs uppercase tracking-widest ${item.riskLevel === 'Low' ? 'text-emerald-500' :
                                            item.riskLevel === 'Moderate' ? 'text-yellow-500' :
                                                'text-primary'
                                            }`}>
                                            {item.riskLevel}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </motion.div>
        </>
    );
};

export default Dashboard;
