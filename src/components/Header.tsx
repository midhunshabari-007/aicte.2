import React from 'react';
import { 
  Shield, 
  FileText, 
  RotateCcw, 
  Compass, 
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface HeaderProps {
  currentView: 'officer_console' | 'simulated_portal';
  onViewChange: (view: 'officer_console' | 'simulated_portal') => void;
  onResetDemo: () => void;
  onOpenWalkthrough: () => void;
  onOpenSupabaseModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  onResetDemo,
  onOpenWalkthrough,
  onOpenSupabaseModal
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      {/* Top Ministerial Bar */}
      <div className="bg-slate-950 px-4 py-1 border-b border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">GOVERNMENT OF INDIA</span>
          <span>·</span>
          <span>MINISTRY OF EDUCATION</span>
          <span>·</span>
          <span>ALL INDIA COUNCIL FOR TECHNICAL EDUCATION (AICTE)</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>AI-Assisted Scrutiny Layer · Prototype Integration-Ready</span>
          <span>·</span>
          <span className="text-amber-400 font-mono">APH 2026–27 Ruleset Active</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="px-6 py-3 flex items-center justify-between gap-6">
        {/* Left: Emblem and Portal Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Shield className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                AICTE Scrutiny & Decision Support System
              </h1>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                Decision Support
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Preliminary Automated Scrutiny & Officer Verification Console
            </p>
          </div>
        </div>

        {/* Center: Mode Switcher */}
        <div className="flex items-center p-1 bg-slate-950/80 rounded-lg border border-slate-800">
          <button
            onClick={() => onViewChange('officer_console')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-2 ${
              currentView === 'officer_console'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Officer Scrutiny Console</span>
          </button>
          <button
            onClick={() => onViewChange('simulated_portal')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-2 ${
              currentView === 'simulated_portal'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Demo: Simulated AICTE Portal</span>
          </button>
        </div>

        {/* Right: Officer Profile & Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenSupabaseModal}
            className="px-2.5 py-1.5 text-xs font-medium bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 rounded-lg transition-colors flex items-center gap-1.5"
            title="Supabase PostgreSQL Integration & Schema"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Supabase DB</span>
          </button>

          <button
            onClick={onOpenWalkthrough}
            className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
            title="Step-by-step master demonstration walkthrough"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Demo Guide</span>
          </button>

          <button
            onClick={onResetDemo}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg border border-transparent hover:border-slate-700 transition-colors flex items-center gap-1.5"
            title="Reset data back to seed state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="bg-slate-800/60 border-t border-slate-800 px-6 py-1.5 text-xs flex items-center justify-between text-slate-300">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-amber-300">Mandatory Principle:</span>
          <span>AI performs preliminary cross-document checks. The Authorized AICTE Officer retains sole regulatory decision-making authority.</span>
        </div>
        <div className="hidden md:flex items-center gap-3 text-slate-400 text-[11px]">
          <span>Simulated Authority Gateways</span>
        </div>
      </div>
    </header>
  );
};
