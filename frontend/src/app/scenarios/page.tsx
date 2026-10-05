'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Radar, 
  Sun, 
  Moon, 
  MapPin, 
  WifiOff, 
  Play, 
  Filter, 
  RefreshCw,
  Zap,
  Target,
  Sparkles
} from 'lucide-react';
import { Scenario } from '@/types/database';

export default function ScenariosPage() {
  const router = useRouter();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Filters
  const [envFilter, setEnvFilter] = useState<string>('ALL');
  const [timeFilter, setTimeFilter] = useState<string>('ALL');
  const [sensorFilter, setSensorFilter] = useState<string>('ALL');
  const [threatFilter, setThreatFilter] = useState<string>('ALL');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('ALL');

  const fetchScenarios = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/scenarios');
      const data = await res.json();
      if (data.success) {
        setScenarios(data.scenarios);
      }
    } catch (error) {
      console.error('Failed to load scenarios:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScenarios();
  }, []);

  const handleGenerateProceduralScenario = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/scenarios/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          environment: envFilter !== 'ALL' ? envFilter : undefined,
          difficulty: difficultyFilter !== 'ALL' ? difficultyFilter : undefined,
          threatType: threatFilter !== 'ALL' ? threatFilter : undefined
        })
      });
      const data = await res.json();
      if (data.success && data.scenario) {
        router.push(`/training/${data.scenario.id}`);
      }
    } catch (err) {
      console.error('Failed to generate scenario:', err);
    } finally {
      setGenerating(false);
    }
  };

  const filteredScenarios = scenarios.filter(s => {
    if (envFilter !== 'ALL' && s.environment !== envFilter) return false;
    if (timeFilter !== 'ALL' && s.time_condition !== timeFilter) return false;
    if (sensorFilter !== 'ALL' && s.sensor_condition !== sensorFilter) return false;
    if (threatFilter !== 'ALL' && s.threat_type !== threatFilter) return false;
    if (difficultyFilter !== 'ALL' && s.difficulty !== difficultyFilter) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* PAGE HEADER */}
      <div className="border-b border-slate-800 pb-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 mb-1">
            <Radar className="h-4 w-4" />
            <span>TACTICAL THREAT SCENARIO REPOSITORY</span>
          </div>
          <h1 className="text-2xl font-bold font-mono text-slate-100 sm:text-3xl">
            Select Training Scenario
          </h1>
          <p className="mt-1 text-xs text-slate-400 font-mono">
            Choose predefined presets or generate a procedurally randomized threat encounter.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            disabled={generating}
            onClick={handleGenerateProceduralScenario}
            className="inline-flex items-center space-x-2 rounded bg-emerald-600 px-4 py-2.5 font-mono text-xs font-bold text-slate-950 hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-950"
          >
            <Sparkles className={`h-4 w-4 ${generating ? 'animate-spin' : ''}`} />
            <span>{generating ? 'GENERATING...' : 'GENERATE PROCEDURAL SCENARIO'}</span>
          </button>

          <button
            onClick={fetchScenarios}
            className="p-2.5 rounded border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200 transition-colors"
            title="Reload Scenarios"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* FILTER CONTROL BAR */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-300">
            <Filter className="h-4 w-4 text-emerald-400" />
            <span>SCENARIO PARAMETER FILTERS</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            Showing {filteredScenarios.length} of {scenarios.length} Scenarios
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 font-mono text-xs">
          
          {/* Environment Filter */}
          <div>
            <label className="block text-[10px] text-slate-500 uppercase mb-1">Environment</label>
            <select
              value={envFilter}
              onChange={(e) => setEnvFilter(e.target.value)}
              className="w-full rounded bg-slate-950 border border-slate-800 px-2.5 py-1.5 text-slate-200 focus:border-emerald-500 outline-none text-xs"
            >
              <option value="ALL">All Environments</option>
              <option value="Urban">Urban</option>
              <option value="Rural">Rural</option>
              <option value="Open">Open Terrain</option>
            </select>
          </div>

          {/* Time Filter */}
          <div>
            <label className="block text-[10px] text-slate-500 uppercase mb-1">Time Condition</label>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="w-full rounded bg-slate-950 border border-slate-800 px-2.5 py-1.5 text-slate-200 focus:border-emerald-500 outline-none text-xs"
            >
              <option value="ALL">All Visibility</option>
              <option value="Day">Daylight</option>
              <option value="Night">Night Time</option>
            </select>
          </div>

          {/* Sensor Condition Filter */}
          <div>
            <label className="block text-[10px] text-slate-500 uppercase mb-1">Sensor Condition</label>
            <select
              value={sensorFilter}
              onChange={(e) => setSensorFilter(e.target.value)}
              className="w-full rounded bg-slate-950 border border-slate-800 px-2.5 py-1.5 text-slate-200 focus:border-emerald-500 outline-none text-xs"
            >
              <option value="ALL">All Sensor States</option>
              <option value="Normal">Normal</option>
              <option value="Degraded">Degraded (ECM)</option>
              <option value="Intermittent">Intermittent</option>
            </select>
          </div>

          {/* Threat Type Filter */}
          <div>
            <label className="block text-[10px] text-slate-500 uppercase mb-1">Threat Type</label>
            <select
              value={threatFilter}
              onChange={(e) => setThreatFilter(e.target.value)}
              className="w-full rounded bg-slate-950 border border-slate-800 px-2.5 py-1.5 text-slate-200 focus:border-emerald-500 outline-none text-xs"
            >
              <option value="ALL">All Threat Profiles</option>
              <option value="Single Drone">Single Drone</option>
              <option value="Multiple Drones">Multiple Drones</option>
              <option value="Swarm">Swarm</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-[10px] text-slate-500 uppercase mb-1">Difficulty</label>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full rounded bg-slate-950 border border-slate-800 px-2.5 py-1.5 text-slate-200 focus:border-emerald-500 outline-none text-xs"
            >
              <option value="ALL">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

        </div>
      </div>

      {/* SCENARIO CARDS GRID */}
      {loading ? (
        <div className="py-16 text-center text-slate-500 font-mono text-xs">
          Loading scenario presets from repository...
        </div>
      ) : filteredScenarios.length === 0 ? (
        <div className="py-16 text-center text-slate-400 font-mono text-xs rounded-lg border border-slate-800 bg-slate-900/50">
          No scenarios match your active parameter filter. Reset filters or click &quot;GENERATE PROCEDURAL SCENARIO&quot;.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScenarios.map((s) => (
            <div
              key={s.id}
              className="rounded-lg border border-slate-800 bg-slate-900/90 hover:border-emerald-500/40 transition-all flex flex-col justify-between p-6 relative group"
            >
              <div>
                
                {/* Header Badges */}
                <div className="flex items-center justify-between mb-3 font-mono text-[10px]">
                  <div className="flex items-center space-x-1.5">
                    {s.is_procedural && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold uppercase">
                        PROCEDURAL
                      </span>
                    )}
                    <span className="text-slate-500 font-bold uppercase tracking-wider">
                      ID #{s.id.slice(0, 8)}
                    </span>
                  </div>
                  
                  <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                    s.difficulty === 'Easy' 
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                      : s.difficulty === 'Moderate'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                      : 'bg-red-950 text-red-400 border border-red-800'
                  }`}>
                    {s.difficulty}
                  </span>
                </div>

                <h3 className="font-mono text-base font-bold text-slate-100 mb-3 group-hover:text-emerald-400 transition-colors">
                  {s.name}
                </h3>

                {/* Parameter Pills */}
                <div className="flex flex-wrap gap-1.5 mb-4 font-mono text-[11px]">
                  <span className="inline-flex items-center space-x-1 rounded bg-slate-950 px-2 py-1 text-slate-300 border border-slate-800">
                    <MapPin className="h-3 w-3 text-emerald-400" />
                    <span>{s.environment}</span>
                  </span>

                  <span className="inline-flex items-center space-x-1 rounded bg-slate-950 px-2 py-1 text-slate-300 border border-slate-800">
                    {s.time_condition === 'Day' ? <Sun className="h-3 w-3 text-amber-400" /> : <Moon className="h-3 w-3 text-cyan-400" />}
                    <span>{s.time_condition}</span>
                  </span>

                  <span className={`inline-flex items-center space-x-1 rounded px-2 py-1 border ${
                    s.sensor_condition === 'Degraded' 
                      ? 'bg-red-950/40 text-red-300 border-red-800/60' 
                      : 'bg-slate-950 text-slate-300 border-slate-800'
                  }`}>
                    {s.sensor_condition === 'Degraded' && <WifiOff className="h-3 w-3 text-red-400" />}
                    <span>{s.sensor_condition} Sensor</span>
                  </span>

                  <span className="inline-flex items-center space-x-1 rounded bg-slate-950 px-2 py-1 text-emerald-400 font-bold border border-slate-800">
                    <Zap className="h-3 w-3" />
                    <span>{s.threat_type}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {s.description}
                </p>

                <div className="rounded bg-slate-950 p-3 border border-slate-800/80 mb-6">
                  <span className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1 flex items-center space-x-1">
                    <Target className="h-3 w-3 text-emerald-400" />
                    <span>Training Objective</span>
                  </span>
                  <p className="text-[11px] text-slate-300 font-mono leading-normal">
                    {s.training_objective}
                  </p>
                </div>

              </div>

              <Link
                href={`/training/${s.id}`}
                className="w-full inline-flex items-center justify-center space-x-2 rounded bg-emerald-600 px-4 py-2.5 text-xs font-mono font-bold text-slate-950 hover:bg-emerald-500 transition-colors shadow-md"
              >
                <Play className="h-3.5 w-3.5 fill-slate-950" />
                <span>INITIATE SIMULATION</span>
              </Link>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
