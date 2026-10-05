import Link from 'next/link';
import { 
  Shield, 
  Radar, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  ArrowRight,
  Activity,
  Eye,
  Zap,
  BarChart2
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative border-b border-slate-900 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-16 pb-20 sm:pt-24 sm:pb-28">
        
        {/* Radar scope background decoration */}
        <div className="absolute right-1/2 top-1/2 -translate-y-1/2 translate-x-1/2 md:translate-x-3/4 opacity-10 pointer-events-none">
          <div className="h-[480px] w-[480px] rounded-full border border-emerald-500/50 flex items-center justify-center relative">
            <div className="h-[360px] w-[360px] rounded-full border border-emerald-500/40 flex items-center justify-center">
              <div className="h-[240px] w-[240px] rounded-full border border-emerald-500/30 flex items-center justify-center">
                <div className="h-[120px] w-[120px] rounded-full border border-emerald-500/20" />
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-full w-[1px] bg-emerald-500/20" />
              <div className="w-full h-[1px] bg-emerald-500/20 absolute" />
            </div>
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            
            {/* MoD / DSSC Header Tag */}
            <div className="inline-flex items-center space-x-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs text-emerald-400 font-mono mb-6">
              <Shield className="h-3.5 w-3.5" />
              <span>Ministry of Defence (MoD) • Defence Services Staff College</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl font-mono leading-tight">
              AI-Enabled Drone & Counter-Drone <span className="text-emerald-400">Threat Simulation Trainer</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-300 font-light leading-relaxed">
              &quot;Train in realistic, repeatable scenarios. Measure decisions. Adapt future training.&quot;
            </p>

            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              Standardized software-based training platform built for defence personnel to practice threat acquisition, multi-rotor classification, and rules-of-engagement response under urban, rural, nighttime, and electronic counter-measure conditions.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center space-x-3 rounded-md bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-900/30 hover:bg-emerald-500 transition-all font-mono group"
              >
                <span>ENTER TRAINING DASHBOARD</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/scenarios"
                className="inline-flex items-center justify-center space-x-2 rounded-md border border-slate-700 bg-slate-900 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:border-slate-600 transition-all font-mono"
              >
                <Radar className="h-4 w-4 text-emerald-400" />
                <span>EXPLORE SCENARIOS</span>
              </Link>
            </div>

            {/* Platform Quick Specs */}
            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-slate-800/80 pt-6 text-slate-400 font-mono text-xs">
              <div>
                <span className="block text-slate-500 text-[10px] uppercase">Platform System</span>
                <span className="text-slate-200 font-bold">v2.0 Production</span>
              </div>
              <div>
                <span className="block text-slate-500 text-[10px] uppercase">Target Environment</span>
                <span className="text-slate-200 font-bold">Unit Level COTS</span>
              </div>
              <div>
                <span className="block text-slate-500 text-[10px] uppercase">Assessment Engine</span>
                <span className="text-emerald-400 font-bold">AAR Analytics</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PROBLEM ADDRESSED SECTION */}
      <section className="py-16 bg-slate-950 border-b border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold mb-2">
              Operational Challenges
            </h2>
            <p className="text-2xl font-bold font-mono text-slate-100 sm:text-3xl">
              Why Tactical Drone Threat Simulation is Essential
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6 relative">
              <div className="h-10 w-10 rounded bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mb-4">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="font-mono text-base font-bold text-slate-100 mb-2">
                Costly & Restricted Live Drills
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Live field drills are weather-dependent, expensive to stage, and difficult to repeat frequently at unit level without specialized flight range approvals.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6 relative">
              <div className="h-10 w-10 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
                <Eye className="h-5 w-5" />
              </div>
              <h3 className="font-mono text-base font-bold text-slate-100 mb-2">
                Degraded Sensor Conditions
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Modern drone threats leverage low radar cross-sections (RCS), night blackout cover, and active ECM electronic noise that static classroom lectures cannot replicate.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6 relative">
              <div className="h-10 w-10 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-4">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="font-mono text-base font-bold text-slate-100 mb-2">
                Autonomous Swarm Complexity
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Single-operator training fails when facing multi-vector autonomous swarms. Personnel require structured drills to prevent decision paralysis under time pressure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* THREE MAJOR CAPABILITIES */}
      <section className="py-20 bg-slate-900/40 border-b border-slate-900 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold mb-2">
              Platform Architecture
            </h2>
            <p className="text-3xl font-bold font-mono text-slate-100 sm:text-4xl">
              Core Capabilities
            </p>
            <p className="mt-3 text-sm text-slate-400">
              Built to standardize threat identification, reaction timing, and post-session performance reviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Capability 1 */}
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-8 shadow-xl flex flex-col justify-between hover:border-emerald-500/40 transition-all">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="h-12 w-12 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                    <Radar className="h-6 w-6" />
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-500">CAP-01</span>
                </div>
                <h3 className="font-mono text-lg font-bold text-slate-100 mb-3">
                  Scenario Simulation
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Multi-parameter training scenario engine supporting Urban vs Rural terrain, Day vs Night lighting, Normal vs Degraded sensor feeds, and Single/Swarm drone threats.
                </p>
              </div>
              <ul className="space-y-2 border-t border-slate-900 pt-4 text-xs text-slate-300 font-mono">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Procedural & Predefined Presets</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Noise & Jamming Emulation</span>
                </li>
              </ul>
            </div>

            {/* Capability 2 */}
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-8 shadow-xl flex flex-col justify-between hover:border-emerald-500/40 transition-all">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="h-12 w-12 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                    <Target className="h-6 w-6" />
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-500">CAP-02</span>
                </div>
                <h3 className="font-mono text-lg font-bold text-slate-100 mb-3">
                  Decision-Based Assessment
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Records trainee detection latency down to sub-second precision, evaluates threat profile classification accuracy, and tracks tactical response choices.
                </p>
              </div>
              <ul className="space-y-2 border-t border-slate-900 pt-4 text-xs text-slate-300 font-mono">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Sub-second Latency Measurement</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Safe Abstract Response Labels</span>
                </li>
              </ul>
            </div>

            {/* Capability 3 */}
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-8 shadow-xl flex flex-col justify-between hover:border-emerald-500/40 transition-all">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="h-12 w-12 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-500">CAP-03</span>
                </div>
                <h3 className="font-mono text-lg font-bold text-slate-100 mb-3">
                  Adaptive Training & AAR
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Generates an After-Action Review (AAR) immediately post-session with strengths, weaknesses, and rule-based training progression recommendations.
                </p>
              </div>
              <ul className="space-y-2 border-t border-slate-900 pt-4 text-xs text-slate-300 font-mono">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Instant After-Action Review</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Longitudinal Trainee History</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* TRAINING WORKFLOW */}
      <section className="py-20 bg-slate-950 border-b border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold mb-2">
              Step-by-Step Training Execution
            </h2>
            <p className="text-3xl font-bold font-mono text-slate-100 sm:text-4xl">
              Standard Training Workflow
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 relative">
            
            <div className="rounded border border-slate-800 bg-slate-900/80 p-5 text-center relative">
              <span className="font-mono text-xs font-bold text-emerald-400 block mb-2">01. START</span>
              <h4 className="font-mono text-sm font-bold text-slate-200 mb-1">Select Scenario</h4>
              <p className="text-[11px] text-slate-400">Choose terrain, lighting, sensor state, and threat mode.</p>
            </div>

            <div className="rounded border border-slate-800 bg-slate-900/80 p-5 text-center relative">
              <span className="font-mono text-xs font-bold text-emerald-400 block mb-2">02. DETECT</span>
              <h4 className="font-mono text-sm font-bold text-slate-200 mb-1">Target Detection</h4>
              <p className="text-[11px] text-slate-400">Identify threat signature on sensor scope & log detection time.</p>
            </div>

            <div className="rounded border border-slate-800 bg-slate-900/80 p-5 text-center relative">
              <span className="font-mono text-xs font-bold text-emerald-400 block mb-2">03. CLASSIFY</span>
              <h4 className="font-mono text-sm font-bold text-slate-200 mb-1">Classify Threat</h4>
              <p className="text-[11px] text-slate-400">Select drone signature profile (Recon, FPV, Swarm, Loitering).</p>
            </div>

            <div className="rounded border border-slate-800 bg-slate-900/80 p-5 text-center relative">
              <span className="font-mono text-xs font-bold text-emerald-400 block mb-2">04. RESPOND</span>
              <h4 className="font-mono text-sm font-bold text-slate-200 mb-1">Tactical Decision</h4>
              <p className="text-[11px] text-slate-400">Select protocol action: Monitor, Track, Escalate, or Hold.</p>
            </div>

            <div className="rounded border border-emerald-500/40 bg-emerald-950/20 p-5 text-center relative">
              <span className="font-mono text-xs font-bold text-emerald-400 block mb-2">05. ASSESS</span>
              <h4 className="font-mono text-sm font-bold text-slate-200 mb-1">AAR Review</h4>
              <p className="text-[11px] text-slate-300">Receive automated score, feedback, and adaptive next steps.</p>
            </div>

          </div>

          <div className="mt-12 text-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-2 rounded bg-emerald-600 px-8 py-3 font-mono text-sm font-bold text-slate-950 hover:bg-emerald-500 transition-colors"
            >
              <span>LAUNCH SIMULATION PLATFORM</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
