'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Award, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  ArrowRight, 
  RotateCcw, 
  ShieldAlert, 
  FileCheck,
  Zap,
  Target,
  Sparkles
} from 'lucide-react';
import { PerformanceReview, TrainingSession } from '@/types/database';

export default function AARPage({
  params
}: {
  params: Promise<{ sessionId: string }>
}) {
  const { sessionId } = use(params);

  const [session, setSession] = useState<TrainingSession | null>(null);
  const [review, setReview] = useState<PerformanceReview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAAR() {
      try {
        const res = await fetch(`/api/aar/${sessionId}`);
        const data = await res.json();
        if (data.success) {
          setSession(data.session);
          setReview(data.review);
        }
      } catch (err) {
        console.error('Failed to fetch AAR:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAAR();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center font-mono text-slate-400">
        Generating Automated After-Action Review (AAR)...
      </div>
    );
  }

  if (!session || !review) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center font-mono text-red-400">
        Error: Could not retrieve AAR records for session ID #{sessionId}.
      </div>
    );
  }

  const scoreColor = session.score >= 85 ? 'text-emerald-400 border-emerald-500/40' : session.score >= 65 ? 'text-amber-400 border-amber-500/40' : 'text-red-400 border-red-500/40';

  const detAcc = review.detection_accuracy_percentage || Math.min(100, Math.round(100 - (Number(session.detection_time) * 5)));
  const classAcc = review.classification_accuracy_percentage || (session.classification_selected === session.classification_correct ? 100 : 40);
  const respAcc = review.response_accuracy_percentage || (session.response_selected === session.response_correct ? 100 : 30);
  const overallAcc = session.score;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* HEADER BAR */}
      <div className="border-b border-slate-800 pb-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 mb-1">
            <FileCheck className="h-4 w-4" />
            <span>POST-DRILL PERFORMANCE AUDIT</span>
          </div>
          <h1 className="text-2xl font-bold font-mono text-slate-100 sm:text-3xl">
            AFTER-ACTION REVIEW (AAR)
          </h1>
          <p className="mt-1 text-xs text-slate-400 font-mono">
            Session Ref: <span className="text-slate-200">#{session.id.slice(0, 8)}</span> • Scenario: <span className="text-slate-200">{session.scenario?.name || 'Tactical Drill'}</span> • Completed: <span className="text-slate-200">{new Date(session.completed_at).toLocaleString()}</span>
          </p>
        </div>

        <div className="flex items-center space-x-3 font-mono text-xs">
          <Link
            href="/scenarios"
            className="inline-flex items-center space-x-2 rounded border border-slate-700 bg-slate-900 px-4 py-2.5 font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="h-4 w-4 text-emerald-400" />
            <span>REPEAT DRILL</span>
          </Link>
          
          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-2 rounded bg-emerald-600 px-4 py-2.5 font-semibold text-slate-950 hover:bg-emerald-500 transition-colors"
          >
            <span>RETURN TO DASHBOARD</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        
        {/* Overall Score Dial */}
        <div className={`rounded-lg border bg-slate-900/90 p-5 flex flex-col justify-between ${scoreColor}`}>
          <span className="font-mono text-xs font-bold text-slate-400">OVERALL DRILL SCORE</span>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold font-mono">{session.score}</span>
            <span className="text-slate-500 text-xs font-mono">/ 100</span>
          </div>
          <span className="mt-2 text-[10px] font-mono uppercase tracking-wider font-bold">
            {session.score >= 85 ? 'OPTIMAL PERFORMANCE' : session.score >= 65 ? 'ACCEPTABLE RESPONSE' : 'TACTICAL DEFICIT'}
          </span>
        </div>

        {/* Detection Time */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-5 font-mono">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>DETECTION TIME</span>
            <Clock className="h-4 w-4 text-cyan-400" />
          </div>
          <p className="mt-3 text-3xl font-extrabold text-cyan-400">
            {Number(session.detection_time).toFixed(2)}s
          </p>
          <p className="mt-2 text-[10px] text-slate-500">
            Benchmark Target: &lt; 4.0s
          </p>
        </div>

        {/* Classification Match */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-5 font-mono">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>THREAT CLASSIFICATION</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-3 text-base font-bold text-slate-100 truncate">
            {session.classification_selected}
          </p>
          <p className="mt-2 text-[11px]">
            {session.classification_selected === session.classification_correct ? (
              <span className="text-emerald-400 font-bold">✓ Match Correct</span>
            ) : (
              <span className="text-amber-400 font-bold">✗ Expected: {session.classification_correct}</span>
            )}
          </p>
        </div>

        {/* Decision Accuracy */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-5 font-mono">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>TACTICAL DECISION</span>
            <ShieldAlert className="h-4 w-4 text-amber-400" />
          </div>
          <p className="mt-3 text-xl font-bold text-slate-100">
            {session.response_selected}
          </p>
          <p className="mt-2 text-[11px]">
            {session.response_selected === session.response_correct ? (
              <span className="text-emerald-400 font-bold">✓ ROE Compliant</span>
            ) : (
              <span className="text-red-400 font-bold">✗ Expected: {session.response_correct}</span>
            )}
          </p>
        </div>

        {/* Scenario Difficulty */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-5 font-mono">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>DIFFICULTY LEVEL</span>
            <Target className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-3 text-xl font-bold text-slate-100 uppercase">
            {session.scenario?.difficulty || 'MODERATE'}
          </p>
          <p className="mt-2 text-[10px] text-slate-500">
            {session.scenario?.environment} • {session.scenario?.sensor_condition} Sensor
          </p>
        </div>

      </div>

      {/* VISUAL PERFORMANCE PROGRESS BARS */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-6 mb-8 font-mono">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          <span>SKILL BREAKDOWN COMPLIANCE BARS</span>
        </h3>

        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Detection Latency Score</span>
              <span className="font-bold text-cyan-400">{detAcc}%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-950 rounded overflow-hidden">
              <div className="h-full bg-cyan-400 transition-all" style={{ width: `${detAcc}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Classification Profile Accuracy</span>
              <span className="font-bold text-emerald-400">{classAcc}%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-950 rounded overflow-hidden">
              <div className="h-full bg-emerald-400 transition-all" style={{ width: `${classAcc}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>ROE Response Compliance</span>
              <span className="font-bold text-amber-400">{respAcc}%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-950 rounded overflow-hidden">
              <div className="h-full bg-amber-400 transition-all" style={{ width: `${respAcc}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Overall Drill Score</span>
              <span className="font-bold text-emerald-400">{overallAcc} / 100</span>
            </div>
            <div className="h-2.5 w-full bg-slate-950 rounded overflow-hidden">
              <div className="h-full bg-emerald-500 transition-all" style={{ width: `${overallAcc}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* WHAT WENT WELL & AREAS TO IMPROVE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* WHAT WENT WELL */}
        <div className="rounded-lg border border-emerald-900/50 bg-emerald-950/20 p-6">
          <div className="flex items-center space-x-2 text-emerald-400 font-mono font-bold text-base mb-4 border-b border-emerald-900/60 pb-3">
            <CheckCircle2 className="h-5 w-5" />
            <span>WHAT WENT WELL</span>
          </div>

          <ul className="space-y-3 font-mono text-xs text-slate-200">
            {review.strengths.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2.5">
                <span className="h-4 w-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] mt-0.5 shrink-0 font-bold">✓</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* AREAS TO IMPROVE */}
        <div className="rounded-lg border border-amber-900/50 bg-amber-950/20 p-6">
          <div className="flex items-center space-x-2 text-amber-400 font-mono font-bold text-base mb-4 border-b border-amber-900/60 pb-3">
            <AlertTriangle className="h-5 w-5" />
            <span>AREAS TO IMPROVE</span>
          </div>

          <ul className="space-y-3 font-mono text-xs text-slate-200">
            {review.weaknesses.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2.5">
                <span className="h-4 w-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] mt-0.5 shrink-0 font-bold">!</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* RECOMMENDED NEXT TRAINING (RULE-BASED ADAPTIVE PATHWAY) */}
      <div className="rounded-lg border border-emerald-500/40 bg-slate-900/90 p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 font-bold mb-2">
              <TrendingUp className="h-4 w-4" />
              <span>ADAPTIVE TRAINING RECOMMENDATION</span>
            </div>
            <h3 className="font-mono text-lg font-bold text-slate-100 mb-2">
              Recommended Next Scenario Pathway
            </h3>
            <p className="text-sm text-slate-300 font-mono leading-relaxed bg-slate-950 p-4 rounded border border-slate-800">
              &quot;{review.recommendation}&quot;
            </p>
          </div>

          <div className="shrink-0 flex flex-col justify-center">
            <Link
              href="/scenarios"
              className="inline-flex items-center justify-center space-x-2 rounded bg-emerald-600 px-6 py-3.5 font-mono text-xs font-bold text-slate-950 hover:bg-emerald-500 transition-colors shadow-lg"
            >
              <Zap className="h-4 w-4 fill-slate-950" />
              <span>START RECOMMENDED SCENARIO</span>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
