'use client';

import { useEffect, useState } from 'react';
import { 
  Users, 
  BarChart3, 
  Target, 
  Clock, 
  AlertTriangle, 
  PieChart, 
  ShieldCheck, 
  RefreshCw,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { AdminAnalytics } from '@/types/database';

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/analytics');
      const data = await res.json();
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (err) {
      console.error('Failed to load admin analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* HEADER */}
      <div className="border-b border-slate-800 pb-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 mb-1">
            <ShieldCheck className="h-4 w-4" />
            <span>INSTRUCTOR & COMMAND OVERVIEW</span>
          </div>
          <h1 className="text-2xl font-bold font-mono text-slate-100 sm:text-3xl">
            Admin / Instructor Dashboard
          </h1>
          <p className="mt-1 text-xs text-slate-400 font-mono">
            Unit-wide training telemetry, skill breakdown matrix, and primary gap assessment.
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          className="inline-flex items-center space-x-2 rounded border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {loading || !analytics ? (
        <div className="py-20 text-center font-mono text-xs text-slate-500">
          Calculating unit training analytics from database...
        </div>
      ) : (
        <>
          {/* TOP METRICS ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 font-mono">
            
            <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>TOTAL TRAINEES</span>
                <Users className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="mt-3 text-3xl font-extrabold text-slate-100">
                {analytics.totalTrainees}
              </p>
              <span className="mt-2 text-[10px] text-slate-500 block">Active Unit Roster</span>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>TOTAL SESSIONS</span>
                <Activity className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="mt-3 text-3xl font-extrabold text-slate-100">
                {analytics.totalSessions}
              </p>
              <span className="mt-2 text-[10px] text-slate-500 block">Logged Drills</span>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>UNIT AVG SCORE</span>
                <Target className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="mt-3 text-3xl font-extrabold text-emerald-400">
                {analytics.averageScore} <span className="text-xs text-slate-500 font-normal">/ 100</span>
              </p>
              <span className="mt-2 text-[10px] text-slate-500 block">Fleet Readiness Score</span>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>CLASS ACCURACY</span>
                <BarChart3 className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="mt-3 text-3xl font-extrabold text-slate-100">
                {analytics.averageClassificationAccuracy}%
              </p>
              <span className="mt-2 text-[10px] text-slate-500 block">Threat Profile Success</span>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>AVG DET. LATENCY</span>
                <Clock className="h-4 w-4 text-cyan-400" />
              </div>
              <p className="mt-3 text-3xl font-extrabold text-cyan-400">
                {analytics.averageDetectionTime}s
              </p>
              <span className="mt-2 text-[10px] text-slate-500 block">Unit Target Lock Speed</span>
            </div>

          </div>

          {/* UNIT SKILL MATRIX */}
          <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-6 mb-8 font-mono">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-emerald-400" />
              <span>UNIT SKILL PERFORMANCE MATRIX</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded bg-slate-950 p-4 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block mb-1">Target Detection Speed</span>
                <p className="text-2xl font-bold text-cyan-400">{analytics.skillMatrix.detectionAccuracy}%</p>
                <div className="mt-2 h-2 w-full bg-slate-900 rounded overflow-hidden">
                  <div className="h-full bg-cyan-400" style={{ width: `${analytics.skillMatrix.detectionAccuracy}%` }} />
                </div>
              </div>

              <div className="rounded bg-slate-950 p-4 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block mb-1">Classification Accuracy</span>
                <p className="text-2xl font-bold text-emerald-400">{analytics.skillMatrix.classificationAccuracy}%</p>
                <div className="mt-2 h-2 w-full bg-slate-900 rounded overflow-hidden">
                  <div className="h-full bg-emerald-400" style={{ width: `${analytics.skillMatrix.classificationAccuracy}%` }} />
                </div>
              </div>

              <div className="rounded bg-slate-950 p-4 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block mb-1">ROE Response Compliance</span>
                <p className="text-2xl font-bold text-amber-400">{analytics.skillMatrix.responseAccuracy}%</p>
                <div className="mt-2 h-2 w-full bg-slate-900 rounded overflow-hidden">
                  <div className="h-full bg-amber-400" style={{ width: `${analytics.skillMatrix.responseAccuracy}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* SCENARIO USAGE & COMMON PERFORMANCE GAPS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 font-mono">
            
            {/* Scenario Usage Distribution (5 Cols) */}
            <div className="lg:col-span-5 rounded-lg border border-slate-800 bg-slate-900/90 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 mb-4 border-b border-slate-800 pb-3">
                  <PieChart className="h-4 w-4" />
                  <span>SCENARIO USAGE DISTRIBUTION</span>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Urban Scenarios</span>
                      <span className="font-bold text-slate-100">{analytics.scenarioUsage.urban} drills</span>
                    </div>
                    <div className="h-2 w-full bg-slate-950 rounded overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500" 
                        style={{ width: `${Math.min(100, (analytics.scenarioUsage.urban / (analytics.totalSessions || 1)) * 100)}%` }} 
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Rural Scenarios</span>
                      <span className="font-bold text-slate-100">{analytics.scenarioUsage.rural} drills</span>
                    </div>
                    <div className="h-2 w-full bg-slate-950 rounded overflow-hidden">
                      <div 
                        className="h-full bg-cyan-500" 
                        style={{ width: `${Math.min(100, (analytics.scenarioUsage.rural / (analytics.totalSessions || 1)) * 100)}%` }} 
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Night Visibility</span>
                      <span className="font-bold text-slate-100">{analytics.scenarioUsage.night} drills</span>
                    </div>
                    <div className="h-2 w-full bg-slate-950 rounded overflow-hidden">
                      <div 
                        className="h-full bg-purple-500" 
                        style={{ width: `${Math.min(100, (analytics.scenarioUsage.night / (analytics.totalSessions || 1)) * 100)}%` }} 
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Degraded Sensor (ECM Noise)</span>
                      <span className="font-bold text-slate-100">{analytics.scenarioUsage.degradedSensor} drills</span>
                    </div>
                    <div className="h-2 w-full bg-slate-950 rounded overflow-hidden">
                      <div 
                        className="h-full bg-red-500" 
                        style={{ width: `${Math.min(100, (analytics.scenarioUsage.degradedSensor / (analytics.totalSessions || 1)) * 100)}%` }} 
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Swarm Threat Drills</span>
                      <span className="font-bold text-slate-100">{analytics.scenarioUsage.swarm} drills</span>
                    </div>
                    <div className="h-2 w-full bg-slate-950 rounded overflow-hidden">
                      <div 
                        className="h-full bg-amber-500" 
                        style={{ width: `${Math.min(100, (analytics.scenarioUsage.swarm / (analytics.totalSessions || 1)) * 100)}%` }} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-800 pt-3 text-[10px] text-slate-500">
                Calculated dynamically from stored database sessions.
              </div>
            </div>

            {/* Common Performance Gaps (7 Cols) */}
            <div className="lg:col-span-7 rounded-lg border border-slate-800 bg-slate-900/90 p-6">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 mb-4 border-b border-slate-800 pb-3">
                <AlertTriangle className="h-4 w-4" />
                <span>IDENTIFIED UNIT PERFORMANCE GAPS</span>
              </div>

              <div className="space-y-4">
                {analytics.commonPerformanceGaps.map((gap, idx) => (
                  <div key={idx} className="rounded border border-slate-800 bg-slate-950 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-slate-100 text-xs flex items-center space-x-2">
                        <span className="h-2 w-2 rounded-full bg-amber-400" />
                        <span>{gap.gap}</span>
                      </h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        gap.severity === 'High' 
                          ? 'bg-red-950 text-red-400 border border-red-800' 
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {gap.severity} Severity ({gap.affectedPercentage}% Operators)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {gap.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </>
      )}

    </div>
  );
}
