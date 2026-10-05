'use client';

import { use, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Radar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Radio, 
  ShieldAlert, 
  Zap, 
  Sun,
  Moon,
  WifiOff,
  Crosshair,
  Sparkles,
  Layers,
  Activity
} from 'lucide-react';
import { Scenario, SimulationTarget } from '@/types/database';

export default function TrainingSessionPage({
  params
}: {
  params: Promise<{ scenarioId: string }>
}) {
  const { scenarioId } = use(params);
  const router = useRouter();

  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulation State
  const [simStatus, setSimStatus] = useState<'INITIAL' | 'RUNNING' | 'DETECTED' | 'CLASSIFIED' | 'SUBMITTING'>('INITIAL');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [detectionTimeRecorded, setDetectionTimeRecorded] = useState<number | null>(null);
  
  // Multi-target Procedural State
  const [targets, setTargets] = useState<SimulationTarget[]>([]);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);

  // Trainee Choices
  const [selectedClassification, setSelectedClassification] = useState<string>('');
  const [selectedResponse, setSelectedResponse] = useState<string>('');

  const animFrameRef = useRef<number | null>(null);

  const classificationOptions = [
    'Commercial Recon Quadcopter',
    'FPV Strike Micro-Drone',
    'Tactical Recon UAV',
    'Loitering Munition UAV',
    'Autonomous Micro-Swarm Cluster'
  ];

  const responseOptions = [
    { label: 'MONITOR', desc: 'Observe target trajectory without active jamming or kinetic intervention.' },
    { label: 'TRACK', desc: 'Lock optical & RF tracking sensors onto target vector.' },
    { label: 'HOLD', desc: 'Maintain current defense posture and await senior supervisor directive.' },
    { label: 'ESCALATE', desc: 'Initiate immediate counter-measure protocol and alert perimeter command.' }
  ];

  // Fetch scenario details & generate targets
  useEffect(() => {
    async function fetchScenario() {
      try {
        const res = await fetch(`/api/scenarios/${scenarioId}`);
        const data = await res.json();
        if (data.success && data.scenario) {
          const sc: Scenario = data.scenario;
          setScenario(sc);
          
          // Generate Targets based on Scenario Threat & Procedural Config
          const count = sc.procedural_config?.threat_count || (sc.threat_type === 'Swarm' ? 8 : sc.threat_type === 'Multiple Drones' ? 3 : 1);
          const pattern = sc.procedural_config?.movement_pattern || (sc.threat_type === 'Swarm' ? 'Swarm' : 'Straight');

          const generatedTargets: SimulationTarget[] = Array.from({ length: count }).map((_, idx) => {
            const angle = (idx * (360 / count) + Math.random() * 30) * (Math.PI / 180);
            const radius = 65 + Math.random() * 20; // % distance from center
            return {
              id: `target_${idx + 1}`,
              name: `ALPHA-${idx + 1}`,
              x: Math.cos(angle) * radius,
              y: Math.sin(angle) * radius,
              vx: pattern === 'Crossing' ? (Math.random() - 0.5) * 0.15 : -Math.cos(angle) * 0.08,
              vy: pattern === 'Crossing' ? (Math.random() - 0.5) * 0.15 : -Math.sin(angle) * 0.08,
              distance_meters: Math.round(radius * 15),
              bearing_degrees: Math.round((angle * 180) / Math.PI) % 360,
              altitude_meters: 120 + Math.round(Math.random() * 80),
              threat_signature: sc.target_drone_type || 'Unknown Drone Signature',
              isDetected: false
            };
          });

          setTargets(generatedTargets);
          if (generatedTargets.length > 0) {
            setSelectedTargetId(generatedTargets[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load scenario:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchScenario();
  }, [scenarioId]);

  // Timer & Procedural Animation Loop
  useEffect(() => {
    let timerInterval: NodeJS.Timeout;

    if (simStatus === 'RUNNING') {
      const now = Date.now();
      setStartTime(now);

      timerInterval = setInterval(() => {
        const diff = (Date.now() - now) / 1000;
        setElapsedSeconds(diff);
      }, 50);

      // Procedural Movement Animation Loop
      const updateMovement = () => {
        setTargets(prevTargets => 
          prevTargets.map(target => {
            let nx = target.x + target.vx;
            let ny = target.y + target.vy;

            // Bounce slightly if reaching perimeter boundary
            if (Math.abs(nx) > 85) target.vx *= -1;
            if (Math.abs(ny) > 85) target.vy *= -1;

            const currentDistPercent = Math.sqrt(nx * nx + ny * ny);

            return {
              ...target,
              x: nx,
              y: ny,
              distance_meters: Math.max(20, Math.round(currentDistPercent * 15)),
              bearing_degrees: Math.round((Math.atan2(ny, nx) * 180) / Math.PI + 360) % 360
            };
          })
        );
        animFrameRef.current = requestAnimationFrame(updateMovement);
      };

      animFrameRef.current = requestAnimationFrame(updateMovement);
    }

    return () => {
      clearInterval(timerInterval);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [simStatus]);

  const handleStartSimulation = async () => {
    try {
      await fetch('/api/sessions/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioId })
      });
    } catch (e) {
      console.warn('Start session notify:', e);
    }
    setSimStatus('RUNNING');
  };

  const handleDetectTarget = (targetId?: string) => {
    if (simStatus !== 'RUNNING') return;
    const finalDetTime = elapsedSeconds;
    setDetectionTimeRecorded(finalDetTime);

    const targetToLock = targetId || selectedTargetId || (targets.length > 0 ? targets[0].id : null);
    if (targetToLock) {
      setSelectedTargetId(targetToLock);
      setTargets(prev => prev.map(t => t.id === targetToLock ? { ...t, isDetected: true, detected_at_latency: finalDetTime } : t));
    }

    setSimStatus('DETECTED');
  };

  const handleConfirmClassification = () => {
    if (!selectedClassification) return;
    setSimStatus('CLASSIFIED');
  };

  const handleSubmitSession = async () => {
    if (!selectedResponse || detectionTimeRecorded === null) return;
    setSimStatus('SUBMITTING');

    try {
      const res = await fetch('/api/sessions/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId,
          traineeId: '00000000-0000-0000-0000-000000000001',
          startedAt: startTime ? new Date(startTime).toISOString() : new Date().toISOString(),
          detectionTime: detectionTimeRecorded,
          classificationSelected: selectedClassification,
          responseSelected: selectedResponse
        })
      });

      const data = await res.json();
      if (data.success) {
        router.push(`/aar/${data.sessionId}`);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Failed to submit session:', err);
      router.push('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center font-mono text-slate-400">
        Initializing Dynamic Procedural Simulation Environment...
      </div>
    );
  }

  if (!scenario) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center font-mono text-red-400">
        Error: Specified scenario ID not found.
      </div>
    );
  }

  const isNight = scenario.time_condition === 'Night';
  const isDegraded = scenario.sensor_condition === 'Degraded' || scenario.sensor_condition === 'Intermittent';
  const isProcedural = scenario.is_procedural || Boolean(scenario.procedural_config);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      
      {/* SIMULATION TELEMETRY HEADER */}
      <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono mb-1">
            <span className="flex items-center space-x-1 text-emerald-400 font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>SIMULATION SESSION ACTIVE</span>
            </span>
            <span className="text-slate-700">|</span>
            {isProcedural && (
              <span className="inline-flex items-center space-x-1 rounded bg-emerald-950 px-2 py-0.5 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                <Sparkles className="h-3 w-3" />
                <span>PROCEDURAL ENGINE ACTIVE</span>
              </span>
            )}
            <span className="text-slate-700">|</span>
            <span className="text-slate-400 font-bold uppercase">{scenario.difficulty} LEVEL</span>
          </div>
          <h1 className="text-xl font-bold font-mono text-slate-100">
            {scenario.name}
          </h1>
        </div>

        {/* Telemetry HUD Strip */}
        <div className="flex items-center space-x-6 font-mono text-xs bg-slate-900 border border-slate-800 px-4 py-2 rounded">
          <div className="text-center">
            <span className="block text-[10px] text-slate-500 uppercase">Simulated Elapsed</span>
            <span className="text-lg font-bold text-cyan-400 flex items-center space-x-1">
              <Clock className="h-4 w-4 inline" />
              <span>{elapsedSeconds.toFixed(2)}s</span>
            </span>
          </div>

          <div className="h-8 w-[1px] bg-slate-800" />

          <div className="text-center">
            <span className="block text-[10px] text-slate-500 uppercase">Active Targets</span>
            <span className="text-lg font-bold text-amber-400">
              0{targets.length}
            </span>
          </div>

          <div className="h-8 w-[1px] bg-slate-800" />

          <div className="text-center">
            <span className="block text-[10px] text-slate-500 uppercase">Detection Latency</span>
            <span className="text-lg font-bold text-emerald-400">
              {detectionTimeRecorded !== null ? `${detectionTimeRecorded.toFixed(2)}s` : '--.--s'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* RADAR SIMULATION VIEWPORT (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 flex-1 flex flex-col relative overflow-hidden">
            
            {/* Sensor & Terrain Top Bar */}
            <div className="flex items-center justify-between text-xs font-mono mb-3 text-slate-400 border-b border-slate-900 pb-2">
              <div className="flex items-center space-x-3">
                <span className="flex items-center space-x-1">
                  <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                  <span>360° SENSOR SCOPE</span>
                </span>
                <span>Terrain: <strong className="text-slate-200">{scenario.environment}</strong></span>
              </div>

              <div className="flex items-center space-x-2">
                {isNight ? (
                  <span className="flex items-center space-x-1 text-cyan-400 text-[11px]">
                    <Moon className="h-3 w-3" />
                    <span>Night Thermal</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1 text-amber-400 text-[11px]">
                    <Sun className="h-3 w-3" />
                    <span>Daylight Visual</span>
                  </span>
                )}
                {isDegraded && (
                  <span className="flex items-center space-x-1 text-red-400 font-bold text-[10px] bg-red-950 px-1.5 py-0.5 rounded border border-red-900">
                    <WifiOff className="h-3 w-3" />
                    <span>ECM NOISE</span>
                  </span>
                )}
              </div>
            </div>

            {/* RADAR CANVAS DISPLAY CONTAINER */}
            <div className={`relative aspect-square w-full rounded border border-slate-800 flex items-center justify-center overflow-hidden transition-colors ${
              isNight ? 'bg-slate-950' : 'bg-slate-900/70'
            }`}>
              
              {/* Dynamic Environment Visual Backdrops */}
              {scenario.environment === 'Urban' && (
                <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-center">
                  <div className="w-3/4 h-3/4 border border-dashed border-slate-500 rounded grid grid-cols-3 grid-rows-3 gap-2 p-2">
                    <div className="bg-slate-700/40 rounded" />
                    <div className="bg-slate-700/20 rounded col-span-2" />
                    <div className="bg-slate-700/30 rounded row-span-2" />
                    <div className="bg-slate-700/50 rounded col-span-2" />
                  </div>
                </div>
              )}

              {scenario.environment === 'Rural' && (
                <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-center">
                  <div className="w-full h-full rounded-full border border-slate-600/30 border-dashed scale-75 rotate-45" />
                  <div className="w-full h-full rounded-full border border-slate-600/20 border-dashed scale-50 -rotate-12" />
                </div>
              )}

              {/* Radial Distance Rings & Azimuth Crosshairs */}
              <div className="absolute inset-4 rounded-full border border-emerald-500/20 pointer-events-none" />
              <div className="absolute inset-16 rounded-full border border-emerald-500/25 pointer-events-none" />
              <div className="absolute inset-28 rounded-full border border-emerald-500/30 pointer-events-none" />
              <div className="absolute inset-40 rounded-full border border-emerald-500/35 pointer-events-none" />
              <div className="absolute h-full w-[1px] bg-emerald-500/15 pointer-events-none" />
              <div className="absolute w-full h-[1px] bg-emerald-500/15 pointer-events-none" />

              {/* Rotating Sweep Line */}
              {simStatus === 'RUNNING' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-full animate-radar-sweep opacity-60">
                    <div 
                      className="w-1/2 h-1/2 bg-gradient-to-tr from-transparent via-emerald-500/20 to-emerald-400/40 origin-bottom-right"
                      style={{ clipPath: 'polygon(100% 100%, 0 0, 100% 0)' }}
                    />
                  </div>
                </div>
              )}

              {/* ECM Static Noise Overlay */}
              {isDegraded && simStatus === 'RUNNING' && (
                <div className="absolute inset-0 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none animate-pulse-slow" />
              )}

              {/* MULTI-TARGET DYNAMIC MARKERS */}
              {simStatus !== 'INITIAL' && targets.map((target) => {
                const isSelected = selectedTargetId === target.id;
                return (
                  <div
                    key={target.id}
                    onClick={() => {
                      if (simStatus === 'RUNNING') handleDetectTarget(target.id);
                    }}
                    className="absolute cursor-pointer transition-transform duration-75 flex items-center justify-center group z-20"
                    style={{
                      top: `${50 + target.y / 2}%`,
                      left: `${50 + target.x / 2}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center animate-ping absolute ${
                      isSelected ? 'bg-red-500/50' : 'bg-emerald-500/30'
                    }`} />
                    <div className={`h-5 w-5 rounded-full border flex items-center justify-center shadow-lg transition-colors ${
                      isSelected 
                        ? 'border-red-500 bg-red-950 text-red-400 scale-110' 
                        : 'border-emerald-400 bg-emerald-950 text-emerald-400'
                    }`}>
                      <Crosshair className="h-3 w-3" />
                    </div>

                    {/* Target HUD Label */}
                    <div className="absolute left-6 top-0 bg-slate-950/90 border border-slate-800 px-2 py-0.5 rounded text-[9px] font-mono text-slate-300 whitespace-nowrap shadow-lg">
                      <span className="text-red-400 font-bold">{target.name}</span> • {target.distance_meters}m • {target.bearing_degrees}°
                    </div>
                  </div>
                );
              })}

              {/* Start Simulation Initial Overlay */}
              {simStatus === 'INITIAL' && (
                <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-30">
                  <Radar className="h-12 w-12 text-emerald-400 mb-3 animate-pulse" />
                  <h3 className="font-mono text-base font-bold text-slate-100 mb-2">
                    PROCEDURAL SIMULATION READY
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md mb-6 font-mono">
                    Observe moving target signatures on radar scope. Once initiated, click any target or click <strong className="text-emerald-400">&quot;THREAT DETECTED&quot;</strong> to record detection latency.
                  </p>
                  <button
                    onClick={handleStartSimulation}
                    className="inline-flex items-center space-x-2 rounded bg-emerald-600 px-6 py-3 font-mono text-xs font-bold text-slate-950 hover:bg-emerald-500 transition-colors shadow-lg"
                  >
                    <Zap className="h-4 w-4 fill-slate-950" />
                    <span>START TACTICAL SIMULATION</span>
                  </button>
                </div>
              )}
            </div>

            {/* ACTION STEP 1: DETECT THREAT BUTTON */}
            {simStatus === 'RUNNING' && (
              <div className="mt-4">
                <button
                  onClick={() => handleDetectTarget()}
                  className="w-full py-4 rounded bg-red-600 hover:bg-red-500 text-slate-950 font-mono text-base font-extrabold tracking-wider transition-colors shadow-xl shadow-red-950 flex items-center justify-center space-x-3"
                >
                  <AlertTriangle className="h-6 w-6 fill-slate-950" />
                  <span>THREAT DETECTED! (RECORD LATENCY)</span>
                </button>
              </div>
            )}

            {simStatus !== 'INITIAL' && simStatus !== 'RUNNING' && (
              <div className="mt-4 p-3 rounded bg-emerald-950/40 border border-emerald-800 text-xs font-mono text-emerald-400 flex items-center justify-between">
                <span>Target Acquisition Logged:</span>
                <span className="font-bold text-slate-100">{detectionTimeRecorded?.toFixed(2)} seconds</span>
              </div>
            )}

          </div>
        </div>

        {/* TACTICAL ASSESSMENT STEPS (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          
          {/* STEP 2: THREAT CLASSIFICATION */}
          <div className={`rounded-lg border p-5 transition-all ${
            simStatus === 'DETECTED' 
              ? 'border-emerald-500/60 bg-slate-900/90 shadow-xl' 
              : simStatus === 'CLASSIFIED' || simStatus === 'SUBMITTING'
              ? 'border-slate-800 bg-slate-950 opacity-90'
              : 'border-slate-800 bg-slate-950/50 opacity-50'
          }`}>
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <span className="font-mono text-xs font-bold text-emerald-400 flex items-center space-x-2">
                <span className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px]">2</span>
                <span>STEP 2: THREAT CLASSIFICATION</span>
              </span>
              {selectedClassification && (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              )}
            </div>

            <p className="text-xs text-slate-400 font-mono mb-3">
              Select threat signature profile matching locked target telemetry:
            </p>

            <div className="space-y-2 mb-4 font-mono text-xs">
              {classificationOptions.map((option) => (
                <button
                  key={option}
                  disabled={simStatus !== 'DETECTED'}
                  onClick={() => setSelectedClassification(option)}
                  className={`w-full text-left px-3 py-2.5 rounded border transition-colors flex items-center justify-between ${
                    selectedClassification === option
                      ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-bold'
                      : 'border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <span>{option}</span>
                  {selectedClassification === option && (
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  )}
                </button>
              ))}
            </div>

            {simStatus === 'DETECTED' && (
              <button
                disabled={!selectedClassification}
                onClick={handleConfirmClassification}
                className={`w-full py-2.5 rounded font-mono text-xs font-bold transition-colors ${
                  selectedClassification 
                    ? 'bg-emerald-600 text-slate-950 hover:bg-emerald-500' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                CONFIRM CLASSIFICATION &amp; PROCEED
              </button>
            )}
          </div>

          {/* STEP 3: RESPONSE DECISION */}
          <div className={`rounded-lg border p-5 transition-all ${
            simStatus === 'CLASSIFIED' 
              ? 'border-emerald-500/60 bg-slate-900/90 shadow-xl' 
              : 'border-slate-800 bg-slate-950 opacity-60'
          }`}>
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <span className="font-mono text-xs font-bold text-amber-400 flex items-center space-x-2">
                <span className="h-5 w-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px]">3</span>
                <span>STEP 3: TACTICAL RESPONSE DECISION</span>
              </span>
              {selectedResponse && (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              )}
            </div>

            <p className="text-xs text-slate-400 font-mono mb-3">
              Select authorized response label per unit Rules of Engagement (ROE):
            </p>

            <div className="grid grid-cols-2 gap-2 mb-4 font-mono text-xs">
              {responseOptions.map((opt) => (
                <button
                  key={opt.label}
                  disabled={simStatus !== 'CLASSIFIED'}
                  onClick={() => setSelectedResponse(opt.label)}
                  className={`p-3 rounded border text-left flex flex-col justify-between transition-colors ${
                    selectedResponse === opt.label
                      ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300 font-bold'
                      : 'border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <span className="font-extrabold tracking-wider text-sm mb-1">{opt.label}</span>
                  <span className="text-[10px] text-slate-400 font-normal leading-tight">{opt.desc}</span>
                </button>
              ))}
            </div>

            {simStatus === 'CLASSIFIED' && (
              <button
                disabled={!selectedResponse}
                onClick={handleSubmitSession}
                className={`w-full py-3 rounded font-mono text-xs font-bold transition-colors shadow-lg ${
                  selectedResponse 
                    ? 'bg-emerald-600 text-slate-950 hover:bg-emerald-500' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                SUBMIT SESSION &amp; GENERATE AAR
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
