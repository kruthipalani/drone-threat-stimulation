import Link from 'next/link';
import { Shield, FileText } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 py-8 text-slate-400 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center space-x-3">
            <Shield className="h-5 w-5 text-emerald-500" />
            <div>
              <p className="font-mono text-xs font-bold text-slate-200">
                THRYVE | Drone Threat Simulation Trainer
              </p>
              <p className="text-[11px] text-slate-500">
                Ministry of Defence (MoD) – Defence Services Staff College | Problem Statement ID: 26247
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs text-slate-500 font-mono">
            <span>SIH 2026 Phase 1 MVP</span>
            <span className="text-slate-800">|</span>
            <span className="text-emerald-500/80 font-semibold">Classification: RESTRICTED DEMO</span>
          </div>

        </div>

        <div className="mt-6 border-t border-slate-900 pt-4 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-600">
          <p>© 2026 THRYVE Defence Tech Team. Built for SIH 2026 Evaluation.</p>
          <div className="mt-2 sm:mt-0 flex space-x-4">
            <span>App Router v15</span>
            <span>Next.js + Supabase</span>
            <span>Tailwind v4</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
