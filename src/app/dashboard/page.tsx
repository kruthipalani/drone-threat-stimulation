'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  User, 
  Award, 
  Target, 
  Clock, 
  CheckCircle2, 
  ShieldAlert, 
  Play, 
  FileText, 
  BarChart3, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { Trainee, TraineeMetrics, TrainingSession } from '@/types/database';

export default function DashboardPage() {
  const [trainee, setTrainee] = useState<Trainee | null>(null);
  const [metrics, setMetrics] = useState<TraineeMetrics | null>(null);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/trainee');
      const data = await res.json();
      if (data.success) {
        setTrainee(data.trainee);
        setMetrics(data.metrics);
        setSessions(data.sessions);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const latestSessionId = sessions.length > 0 ? sessions[0].id : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* HEADER TRAINEE INFO */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 mb-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ACTIVE TRAINING SESSION RECORD</span>
          </div>
          <h1 className="text-2xl font-bold font-mono text-slate-100 sm:text-3xl flex items-center space-x-3">
            <span>Trainee Training Dashboard</span>
          </h1>
          {trainee && (
            <p className="mt-1 text-xs text-slate-400 font-mono">
              Operator: <span className="text-slate-200 font-bold">{trainee.name}</span> • Unit: <span className="text-slate-200 font-bold">{trainee.unit}</span> • Role: <span className="text-slate-200 font-bold">{trainee.role}</span>
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={fetchDashboardData}
            className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {latestSessionId && (
            <Link
              href={`/aar/${latestSessionId}`}
              className="inline-flex items-center space-x-2 rounded border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-mono font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <FileText className="h-4 w-4 text-cyan-400" />
              <span>VIEW LATEST AAR</span>
            </Link>
          )}

          <Link
            href="/history"
            className="inline-flex items-center space-x-2 rounded border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-mono font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <BarChart3 className="h-4 w-4 text-emerald-400" />
            <span>VIEW PERFORMANCE</span>
          </Link>

          <Link
            href="/scenarios"
            className="inline-flex items-center space-x-2 rounded bg-emerald-600 px-5 py-2.5 text-xs font-mono font-bold text-slate-950 hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-950"
          >
            <Play className="h-4 w-4 fill-slate-950" />
            <span>START TRAINING</span>
          </Link>
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        
        {/* Sessions Completed */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-medium text-slate-400">SESSIONS COMPLETED</span>
            <Award className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-3 text-3xl font-extrabold font-mono text-slate-100">
            {metrics ? metrics.totalSessions : 0}
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Target: 10 Drills</span>
            <span className="text-emerald-400 font-semibold">{metrics ? metrics.currentLevel : 'Active'}</span>
          </div>
        </div>

        {/* Average Score */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-medium text-slate-400">AVERAGE SCORE</span>
            <Target className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-3 text-3xl font-extrabold font-mono text-emerald-400">
            {metrics ? metrics.averageScore : 0} <span className="text-xs font-normal text-slate-500">/ 100</span>
          </p>
          <div className="mt-2 text-[11px] text-slate-500 font-mono">
            Overall Tactical Proficiency
          </div>
        </div>

        {/* Avg Detection Time */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-medium text-slate-400">AVG DETECTION TIME</span>
            <Clock className="h-4 w-4 text-cyan-400" />
          </div>
          <p className="mt-3 text-3xl font-extrabold font-mono text-cyan-400">
            {metrics ? metrics.averageDetectionTime : 0} <span className="text-xs font-normal text-slate-500">sec</span>
          </p>
          <div className="mt-2 text-[11px] text-slate-500 font-mono">
            Target Benchmark: &lt; 4.0s
          </div>
        </div>

        {/* Classification Accuracy */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-medium text-slate-400">CLASSIFICATION ACC.</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-3 text-3xl font-extrabold font-mono text-slate-100">
            {metrics ? metrics.classificationAccuracy : 0}<span className="text-xs font-normal text-slate-500">%</span>
          </p>
          <div className="mt-2 text-[11px] text-slate-500 font-mono">
            Threat Profile Identification
          </div>
        </div>

        {/* Decision Accuracy */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-medium text-slate-400">DECISION ACCURACY</span>
            <ShieldAlert className="h-4 w-4 text-amber-400" />
          </div>
          <p className="mt-3 text-3xl font-extrabold font-mono text-slate-100">
            {metrics ? metrics.decisionAccuracy : 0}<span className="text-xs font-normal text-slate-500">%</span>
          </p>
          <div className="mt-2 text-[11px] text-slate-500 font-mono">
            ROE Tactical Compliance
          </div>
        </div>

      </div>

      {/* RECENT PERFORMANCE TABLE */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div>
            <h2 className="font-mono text-base font-bold text-slate-100">Recent Training Sessions</h2>
            <p className="text-xs text-slate-400">Stored session history retrieved from backend database</p>
          </div>
          <Link
            href="/history"
            className="text-xs font-mono text-emerald-400 hover:underline flex items-center space-x-1"
          >
            <span>View Full History</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500 font-mono text-xs">
            Loading session records from database...
          </div>
        ) : sessions.length === 0 ? (
          <div className="py-12 text-center text-slate-400 font-mono text-xs">
            No training sessions recorded yet. Click &quot;START TRAINING&quot; to begin your first scenario drill!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Session Ref</th>
                  <th className="py-3 px-4">Scenario Name</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Detection Time</th>
                  <th className="py-3 px-4">Classification</th>
                  <th className="py-3 px-4">Response Choice</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sessions.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 text-slate-400 font-mono">
                      #{s.id.slice(0, 8)}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-100">
                      {s.scenario?.name || 'Tactical Scenario'}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {new Date(s.completed_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono text-cyan-400 font-semibold">
                      {Number(s.detection_time).toFixed(2)}s
                    </td>
                    <td className="py-3 px-4">
                      <span className={s.classification_selected === s.classification_correct ? 'text-emerald-400' : 'text-amber-400 font-semibold'}>
                        {s.classification_selected}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        s.response_selected === 'ESCALATE' 
                          ? 'bg-red-950 text-red-400 border border-red-800' 
                          : s.response_selected === 'TRACK'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {s.response_selected}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-bold font-mono ${
                        s.score >= 80 ? 'text-emerald-400' : s.score >= 60 ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        {s.score}/100
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/aar/${s.id}`}
                        className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300"
                      >
                        <span>AAR</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
