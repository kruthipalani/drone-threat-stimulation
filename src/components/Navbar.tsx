'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Radar, BarChart3, LayoutDashboard, History } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Scenarios', href: '/scenarios', icon: Radar },
    { name: 'Performance History', href: '/history', icon: History },
    { name: 'Instructor Admin', href: '/admin', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        {/* Brand & Identity */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)] group-hover:bg-emerald-500/20 transition-all">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-lg font-bold tracking-wider text-slate-100 uppercase">
                  THRYVE
                </span>
                <span className="hidden sm:inline-block rounded bg-emerald-950 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-400 border border-emerald-800">
                  SIM-TRAINER
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 tracking-tight hidden md:block">
                Drone Threat Simulation Trainer | MoD - DSSC
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-2 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Side Status & Trainee Badge */}
        <div className="flex items-center space-x-3 font-mono">
          {/* Truthful Telemetry Status Badge */}
          <div className="hidden lg:flex items-center space-x-2 rounded-full bg-slate-900 px-3 py-1 text-[11px] text-slate-300 border border-slate-800">
            <span className={`h-2 w-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-slate-400">TELEMETRY:</span>
            <span className={isSupabaseConfigured ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              {isSupabaseConfigured ? 'LIVE POSTGRESQL' : 'DEMO MODE'}
            </span>
          </div>

          {/* Active Trainee Profile Badge */}
          <div className="flex items-center space-x-2 rounded-md bg-slate-900/90 border border-slate-800 px-3 py-1.5 text-xs text-slate-300">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-emerald-400 font-mono text-[10px] font-bold">
              VS
            </div>
            <div className="text-left hidden sm:block">
              <p className="font-semibold text-slate-200 leading-none text-[12px]">Capt. V. Singh</p>
              <p className="text-[10px] text-slate-500 leading-tight">14th Armoured Div (Demo)</p>
            </div>
          </div>
        </div>

      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex md:hidden border-t border-slate-800 bg-slate-950 px-2 py-2 overflow-x-auto justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center space-y-1 px-3 py-1 text-[11px] font-medium rounded ${
                isActive ? 'text-emerald-400 font-bold bg-slate-900' : 'text-slate-400'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
