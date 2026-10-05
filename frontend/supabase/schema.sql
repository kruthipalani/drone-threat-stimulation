-- =========================================================
-- THRYVE | Drone Threat Simulation Trainer - Supabase PostgreSQL Schema
-- Problem Statement ID: 26247 (Ministry of Defence / DSSC)
-- =========================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TRAINEES TABLE
CREATE TABLE IF NOT EXISTS trainees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    unit VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SCENARIOS TABLE
CREATE TABLE IF NOT EXISTS scenarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    environment VARCHAR(50) NOT NULL CHECK (environment IN ('Urban', 'Rural')),
    time_condition VARCHAR(50) NOT NULL CHECK (time_condition IN ('Day', 'Night')),
    sensor_condition VARCHAR(50) NOT NULL CHECK (sensor_condition IN ('Normal', 'Degraded')),
    threat_type VARCHAR(50) NOT NULL CHECK (threat_type IN ('Single Drone', 'Multiple Drones', 'Swarm')),
    difficulty VARCHAR(50) NOT NULL CHECK (difficulty IN ('Easy', 'Moderate', 'Advanced')),
    description TEXT NOT NULL,
    training_objective TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TRAINING SESSIONS TABLE
CREATE TABLE IF NOT EXISTS training_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trainee_id UUID REFERENCES trainees(id) ON DELETE CASCADE,
    scenario_id UUID REFERENCES scenarios(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ NOT NULL,
    detection_time NUMERIC(6, 2) NOT NULL, -- Detection time in seconds
    classification_selected VARCHAR(255) NOT NULL,
    classification_correct VARCHAR(255) NOT NULL,
    response_selected VARCHAR(50) NOT NULL CHECK (response_selected IN ('MONITOR', 'TRACK', 'ESCALATE', 'HOLD')),
    response_correct VARCHAR(50) NOT NULL CHECK (response_correct IN ('MONITOR', 'TRACK', 'ESCALATE', 'HOLD')),
    score INT NOT NULL CHECK (score >= 0 AND score <= 100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PERFORMANCE REVIEWS TABLE
CREATE TABLE IF NOT EXISTS performance_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES training_sessions(id) ON DELETE CASCADE,
    strengths TEXT[] NOT NULL,
    weaknesses TEXT[] NOT NULL,
    recommendation TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR OPTIMAL QUERY PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_sessions_trainee ON training_sessions(trainee_id);
CREATE INDEX IF NOT EXISTS idx_sessions_scenario ON training_sessions(scenario_id);
CREATE INDEX IF NOT EXISTS idx_reviews_session ON performance_reviews(session_id);

-- =========================================================
-- SEED DATA FOR PHASE 1 TESTING
-- =========================================================

-- Insert Default Trainee
INSERT INTO trainees (id, name, unit, role)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'Capt. Vikram Singh', '14th Armoured Division', 'Counter-UAV Tactical Officer')
ON CONFLICT (id) DO NOTHING;

-- Insert Required Scenarios
INSERT INTO scenarios (id, name, environment, time_condition, sensor_condition, threat_type, difficulty, description, training_objective)
VALUES
    (
        '11111111-1111-1111-1111-111111111101',
        'Urban Day – Single Recon Quadcopter',
        'Urban',
        'Day',
        'Normal',
        'Single Drone',
        'Easy',
        'High-altitude commercial quadcopter conducting visual reconnaissance over perimeter installation under clear daylight.',
        'Assess visual radar target acquisition and practice prompt threat classification under clean sensor conditions.'
    ),
    (
        '11111111-1111-1111-1111-111111111102',
        'Rural Day – Dual High-Speed FPV Kamikaze',
        'Rural',
        'Day',
        'Normal',
        'Multiple Drones',
        'Moderate',
        'Two low-flying FPV micro-drones approaching field command outpost across undulating rural terrain at 80 km/h.',
        'Identify fast-moving multi-target trajectories and execute defensive tracking protocols before perimeter breach.'
    ),
    (
        '11111111-1111-1111-1111-111111111103',
        'Urban Night – Stealth Surveillance UAV',
        'Urban',
        'Night',
        'Moderate',
        'Single Drone',
        'Moderate',
        'Low-noise thermal payload drone navigating city building shadows during nighttime blackout conditions.',
        'Utilize night radar telemetry and thermal sensor queues to achieve early detection despite urban canopy clutter.'
    ),
    (
        '11111111-1111-1111-1111-111111111104',
        'Rural Night – Electronic Jammed Reconnaissance',
        'Rural',
        'Night',
        'Degraded',
        'Single Drone',
        'Advanced',
        'Heavy electronic counter-measures (ECM) jamming radio frequencies and degrading radar return signals over open fields.',
        'Identify target signature amidst signal noise and issue rapid response under severely degraded sensor feedback.'
    ),
    (
        '11111111-1111-1111-1111-111111111105',
        'Urban Night – Autonomous Micro-Swarm Assault',
        'Urban',
        'Night',
        'Degraded',
        'Swarm',
        'Advanced',
        'Coordinated 8-drone autonomous micro-swarm executing synchronized multi-vector penetration over critical urban asset.',
        'Evaluate swarm attack vectors, maintain tactical composure, and execute immediate escalation protocol.'
    )
ON CONFLICT (id) DO NOTHING;

-- Insert Initial Sample Session & AAR
INSERT INTO training_sessions (id, trainee_id, scenario_id, started_at, completed_at, detection_time, classification_selected, classification_correct, response_selected, response_correct, score)
VALUES
    (
        '22222222-2222-2222-2222-222222222201',
        '00000000-0000-0000-0000-000000000001',
        '11111111-1111-1111-1111-111111111101',
        NOW() - INTERVAL '2 HOURS',
        NOW() - INTERVAL '1 HOUR 58 MINUTES',
        3.40,
        'Commercial Recon Quadcopter',
        'Commercial Recon Quadcopter',
        'TRACK',
        'TRACK',
        95
    ),
    (
        '22222222-2222-2222-2222-222222222202',
        '00000000-0000-0000-0000-000000000001',
        '11111111-1111-1111-1111-111111111104',
        NOW() - INTERVAL '1 HOUR',
        NOW() - INTERVAL '58 MINUTES',
        6.80,
        'Commercial Recon Quadcopter',
        'Loitering Munition UAV',
        'MONITOR',
        'ESCALATE',
        62
    )
ON CONFLICT (id) DO NOTHING;

INSERT INTO performance_reviews (id, session_id, strengths, weaknesses, recommendation)
VALUES
    (
        '33333333-3333-3333-3333-333333333301',
        '22222222-2222-2222-2222-222222222201',
        ARRAY['Rapid target visual acquisition (3.4s)', 'Accurate threat profile classification', 'Appropriate tracking tactical selection'],
        ARRAY['Slight hesitation during target radar lock verification'],
        'Maintain current tracking procedure for single-threat clear daylight scenarios.'
    ),
    (
        '33333333-3333-3333-3333-333333333302',
        '22222222-2222-2222-2222-222222222202',
        ARRAY['Persevered through heavy radar noise jamming'],
        ARRAY['Delayed detection latency (6.8s under ECM)', 'Miscalibrated payload threat level', 'Passive monitor decision during active swarm risk'],
        'Repeat moderate degraded-sensor scenarios to lower detection latency and refine threat classification under ECM noise.'
    )
ON CONFLICT (id) DO NOTHING;
