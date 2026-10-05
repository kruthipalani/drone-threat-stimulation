'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  History, 
  TrendingUp, 
  Clock, 
  Target, 
  ArrowRight, 
  RefreshCw,
  BarChart2,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { TrainingSession, TraineeMetrics } from '@/types/database';

export default function PerformanceHistoryPage() {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [metrics, setMetrics] = useState<TraineeMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/trainee');
      const data = await res.json();
      if (data.success) {
        setSessions(data.sessions);
        setMetrics(data.metrics);
      }
    } catch (err) {
      console.error('Failed to load performance history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Chronological order for chart plotting (oldest to newest)
  const chronologicalSessions = [...sessions].reverse();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* PAGE HEADER */}
      <div className="border-b border-slate-800 pb-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 mb-1">
            <History className="h-4 w-4" />
            <span>LONGITUDINAL OPERATOR PERFORMANCE LOG</span>
          </div>
          <h1 className="text-2xl font-bold font-mono text-slate-100 sm:text-3xl">
            Trainee Performance History
          </h1>
          <p className="mt-1 text-xs text-slate-400 font-mono">
            SIMULATE → DETECT → CLASSIFY → RESPOND → ADAPT: Longitudinal score tracking across repeated drills.
          </p>
        </div>

        <button
          onClick={fetchHistory}
          className="inline-flex items-center space-x-2 rounded border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* METRICS SUMMARY STRIP */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 font-mono">
          <div className="rounded border border-slate-800 bg-slate-900/90 p-4">
            <span className="text-[10px] text-slate-500 uppercase">Total Drills</span>
            <p className="text-2xl font-bold text-slate-100 mt-1">{metrics.totalSessions}</p>
          </div>
          <div className="rounded border border-slate-800 bg-slate-900/90 p-4">
            <span className="text-[10px] text-slate-500 uppercase">Average Score</span>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{metrics.averageScore} / 100</p>
          </div>
          <div className="rounded border border-slate-800 bg-slate-900/90 p-4">
            <span className="text-[10px] text-slate-500 uppercase">Avg Detection Latency</span>
            <p className="text-2xl font-bold text-cyan-400 mt-1">{metrics.averageDetectionTime}s</p>
          </div>
          <div className="rounded border border-slate-800 bg-slate-900/90 p-4">
            <span className="text-[10px] text-slate-500 uppercase">Class &amp; Decision Acc.</span>
            <p className="text-2xl font-bold text-slate-100 mt-1">{metrics.classificationAccuracy}% / {metrics.decisionAccuracy}%</p>
          </div>
        </div>
      )}

      {/* DYNAMIC PROGRESSION CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 font-mono">
        
        {/* Score Progression Bar Plot */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
              <TrendingUp className="h-4 w-4" />
              <span>DRILL SCORE PROGRESSION</span>
            </div>
            <span className="text-[10px] text-slate-500">Target: &gt; 80 pts</span>
          </div>

          <div className="h-56 w-full flex items-end justify-between gap-3 pt-8 pb-2 px-4 border-b border-slate-800 bg-slate-950/70 rounded relative">
            {/* Horizontal Grid Markers */}
            <div className="absolute left-2 right-2 top-4 border-b border-slate-800/60 text-[9px] text-slate-600">100 pts</div>
            <div className="absolute left-2 right-2 top-1/2 border-b border-slate-800/60 text-[9px] text-slate-600">50 pts</div>

            {chronologicalSessions.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-xs text-slate-600">
                No session entries recorded yet
              </div>
            ) : (
              chronologicalSessions.map((s, idx) => {
                const scoreVal = s.score;
                return (
                  <div key={s.id} className="flex-1 flex flex-col items-center group relative z-10">
                    <div className="absolute -top-7 bg-slate-900 text-emerald-400 text-[10px] px-2 py-0.5 rounded border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-md">
                      Drill #{idx + 1}: {scoreVal} pts
                    </div>
                    
                    <div 
                      className="w-full rounded-t bg-gradient-to-t from-emerald-800 via-emerald-600 to-emerald-400 hover:brightness-125 transition-all relative"
                      style={{ height: `${Math.max(12, scoreVal)}%` }}
                    >
                      <span className="absolute -top-4 inset-x-0 text-center text-[9px] font-bold text-slate-300">
                        {scoreVal}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-400 mt-2 font-bold">D{idx + 1}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Detection Latency Trend Plot */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400">
              <Clock className="h-4 w-4" />
              <span>DETECTION LATENCY TREND (LOWER IS BETTER)</span>
            </div>
            <span className="text-[10px] text-slate-500">Benchmark: &lt; 4.0s</span>
          </div>

          <div className="h-56 w-full flex items-end justify-between gap-3 pt-8 pb-2 px-4 border-b border-slate-800 bg-slate-950/70 rounded relative">
            <div className="absolute left-2 right-2 top-4 border-b border-slate-800/60 text-[9px] text-slate-600">8.0s</div>
            <div className="absolute left-2 right-2 top-1/2 border-b border-slate-800/60 text-[9px] text-slate-600">4.0s</div>

            {chronologicalSessions.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-xs text-slate-600">
                No session entries recorded yet
              </div>
            ) : (
              chronologicalSessions.map((s, idx) => {
                const detVal = Number(s.detection_time);
                const heightPercent = Math.max(15, Math.min(100, (detVal / 8) * 100));
                return (
                  <div key={s.id} className="flex-1 flex flex-col items-center group relative z-10">
                    <div className="absolute -top-7 bg-slate-900 text-cyan-400 text-[10px] px-2 py-0.5 rounded border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-md">
                      Drill #{idx + 1}: {detVal.toFixed(2)}s
                    </div>

                    <div 
                      className={`w-full rounded-t transition-all relative ${
                        detVal <= 4.0 
                          ? 'bg-gradient-to-t from-cyan-800 to-cyan-400' 
                          : 'bg-gradient-to-t from-amber-800 to-amber-400'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    >
                      <span className="absolute -top-4 inset-x-0 text-center text-[9px] font-bold text-slate-300">
                        {detVal.toFixed(1)}s
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-400 mt-2 font-bold">D{idx + 1}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* FULL SESSION LOG TABLE */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div>
            <h2 className="font-mono text-base font-bold text-slate-100">
              Complete Training Drill Logs
            </h2>
            <p className="text-xs text-slate-400 font-mono">Retrieved from database records</p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {sessions.length} sessions logged
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500 font-mono text-xs">
            Querying session history from database...
          </div>
        ) : sessions.length === 0 ? (
          <div className="py-12 text-center text-slate-400 font-mono text-xs">
            No training sessions logged yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Session Ref</th>
                  <th className="py-3 px-4">Date / Time</th>
                  <th className="py-3 px-4">Scenario Name</th>
                  <th className="py-3 px-4">Detection Latency</th>
                  <th className="py-3 px-4">Classification</th>
                  <th className="py-3 px-4">Response Choice</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4 text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sessions.map((s) => {
                  const classMatch = s.classification_selected === s.classification_correct;
                  const respMatch = s.response_selected === s.response_correct;
                  return (
                    <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 text-slate-400">
                        #{s.id.slice(0, 8)}
                      </td>
                      <td className="py-3 px-4 text-[11px] text-slate-400">
                        {new Date(s.completed_at).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-100">
                        {s.scenario?.name || 'Tactical Drill'}
                      </td>
                      <td className="py-3 px-4 text-cyan-400 font-bold">
                        {Number(s.detection_time).toFixed(2)}s
                      </td>
                      <td className="py-3 px-4">
                        {classMatch ? (
                          <span className="text-emerald-400 font-bold">✓ Match</span>
                        ) : (
                          <span className="text-amber-400 font-bold">✗ Misclassified</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {respMatch ? (
                          <span className="text-emerald-400 font-bold">✓ ROE Compliant</span>
                        ) : (
                          <span className="text-red-400 font-bold">✗ Sub-optimal</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-bold ${
                          s.score >= 80 ? 'text-emerald-400' : s.score >= 60 ? 'text-amber-400' : 'text-red-400'
                        }`}>
                          {s.score} / 100
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/aar/${s.id}`}
                          className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300"
                        >
                          <span>AAR Report</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
