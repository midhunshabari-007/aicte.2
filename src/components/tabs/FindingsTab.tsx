import React, { useState } from 'react';
import { Finding } from '../../types/scrutiny';
import { 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  ExternalLink, 
  Check, 
  Clock, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface FindingsTabProps {
  findings: Finding[];
  onOpenDocumentById: (docId: string) => void;
  onResolveFinding: (findingId: string, notes: string) => void;
  onOverrideFinding: (findingId: string, conclusion: string, reason: string) => void;
}

export const FindingsTab: React.FC<FindingsTabProps> = ({
  findings,
  onOpenDocumentById,
  onResolveFinding,
  onOverrideFinding
}) => {
  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [overrideConclusion, setOverrideConclusion] = useState('');
  const [overrideReason, setOverrideReason] = useState('');
  const [mode, setMode] = useState<'NONE' | 'RESOLVE' | 'OVERRIDE'>('NONE');

  const handleResolve = (finding: Finding) => {
    onResolveFinding(finding.id, actionNotes || 'Verified and reconciled by authorized officer.');
    setMode('NONE');
    setActionNotes('');
  };

  const handleOverride = (finding: Finding) => {
    onOverrideFinding(finding.id, overrideConclusion, overrideReason);
    setMode('NONE');
    setOverrideConclusion('');
    setOverrideReason('');
  };

  return (
    <div className="space-y-4">
      {/* Informational Guidance Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <div className="font-bold text-amber-900">Evidence-Linked Preliminary AI Findings</div>
          <p className="text-amber-800 mt-0.5 leading-relaxed">
            Every flagged finding below explains <strong>WHAT</strong> was detected, <strong>WHY</strong> it was flagged, 
            the exact <strong>EVIDENCE</strong> across multiple sources, and recommended officer actions. Automated checks serve purely as decision-support for human review.
          </p>
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-4">
        {findings.map((f) => {
          const isHigh = f.severity === 'HIGH';
          const isResolved = f.status === 'RESOLVED';
          const isOverridden = f.status === 'OVERRIDDEN';

          return (
            <div 
              key={f.id}
              className={`border-2 rounded-xl p-5 shadow-xs transition-all ${
                isResolved
                  ? 'border-emerald-300 bg-emerald-50/20'
                  : isOverridden
                  ? 'border-blue-300 bg-blue-50/20'
                  : isHigh
                  ? 'border-rose-300 bg-rose-50/20'
                  : 'border-amber-300 bg-amber-50/20'
              }`}
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className={`p-1.5 rounded-lg ${
                    isHigh ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {isHigh ? <AlertCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">{f.id}</span>
                      <span className="text-slate-300">·</span>
                      <h4 className="text-sm font-bold text-slate-900">{f.title}</h4>
                    </div>
                    {f.documentName && (
                      <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                        <span>Source Document: <strong className="text-slate-700">{f.documentName}</strong></span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono ${
                    f.severity === 'HIGH' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {f.severity} Severity
                  </span>

                  {isResolved ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono bg-emerald-100 text-emerald-800 border border-emerald-300">
                      ✓ Resolved by Officer
                    </span>
                  ) : isOverridden ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono bg-blue-100 text-blue-800 border border-blue-300">
                      Officer Overridden
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono bg-amber-100 text-amber-800 border border-amber-300">
                      Active Finding
                    </span>
                  )}
                </div>
              </div>

              {/* Section 21 Anatomy Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs">
                
                {/* WHAT & WHY */}
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      1. WHAT was detected?
                    </div>
                    <p className="text-slate-800 leading-relaxed font-medium">
                      {f.whatDetected}
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      2. WHY was it flagged?
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      {f.whyDetected}
                    </p>
                  </div>
                </div>

                {/* EVIDENCE & SOURCES COMPARED */}
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      3. SOURCES COMPARED & EVIDENCE
                    </div>
                    <div className="space-y-2 mt-2">
                      {f.sourcesCompared.map((sc, scIdx) => (
                        <div key={scIdx} className="flex items-start justify-between p-2 rounded bg-slate-50 border border-slate-100 font-mono text-[11px]">
                          <div>
                            <div className="font-semibold text-slate-800">{sc.source}</div>
                            <div className="text-[10px] text-slate-500">{sc.reference}</div>
                          </div>
                          <span className="font-bold text-slate-900 bg-white px-2 py-1 rounded border border-slate-200">
                            {sc.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      4. RECOMMENDED ACTION FOR OFFICER
                    </div>
                    <p className="text-slate-700 leading-relaxed font-medium text-amber-900">
                      {f.recommendedAction}
                    </p>
                  </div>
                </div>

              </div>

              {/* Resolution / Override Details if already acted on */}
              {(isResolved || isOverridden) && f.officerObservation && (
                <div className="mt-4 p-3 rounded-lg bg-white border border-slate-300 text-xs text-slate-800">
                  <div className="font-bold text-[11px] uppercase tracking-wide text-slate-700">
                    Recorded Officer Action & Observation:
                  </div>
                  <p className="mt-1 font-mono text-[11px] text-slate-900">{f.officerObservation}</p>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Recorded by {f.resolvedBy || 'AICTE Officer'} on {new Date(f.resolvedAt || '').toLocaleString()}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {f.documentId && (
                    <button
                      onClick={() => onOpenDocumentById(f.documentId!)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                    >
                      <span>Examine in Split Viewer</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {!isResolved && !isOverridden && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedFindingId(f.id);
                        setMode(mode === 'RESOLVE' ? 'NONE' : 'RESOLVE');
                      }}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
                    >
                      Resolve Finding
                    </button>
                    <button
                      onClick={() => {
                        setSelectedFindingId(f.id);
                        setMode(mode === 'OVERRIDE' ? 'NONE' : 'OVERRIDE');
                      }}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-amber-400 text-amber-900 hover:bg-amber-100 transition-colors"
                    >
                      Officer Override
                    </button>
                  </div>
                )}
              </div>

              {/* Inline Action Drawers */}
              {selectedFindingId === f.id && mode === 'RESOLVE' && (
                <div className="mt-4 p-4 rounded-xl bg-white border border-emerald-300 space-y-3">
                  <div className="font-bold text-xs text-emerald-950">Record Finding Resolution</div>
                  <textarea
                    rows={2}
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    placeholder="Enter resolution details (e.g., 'Inspected institutional records; confirmed intake discrepancy is resolved by restricting approved capacity to 60 seats')..."
                    className="w-full p-2.5 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setMode('NONE')}
                      className="px-3 py-1 text-xs text-slate-600 hover:text-slate-900"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleResolve(f)}
                      className="px-3 py-1 text-xs font-semibold rounded bg-emerald-600 text-white hover:bg-emerald-500"
                    >
                      Confirm Resolution
                    </button>
                  </div>
                </div>
              )}

              {selectedFindingId === f.id && mode === 'OVERRIDE' && (
                <div className="mt-4 p-4 rounded-xl bg-white border border-amber-300 space-y-3">
                  <div className="font-bold text-xs text-amber-950">Record Officer Disagreement / Override</div>
                  <input
                    type="text"
                    value={overrideConclusion}
                    onChange={(e) => setOverrideConclusion(e.target.value)}
                    placeholder="Officer Conclusion (e.g., 'Discrepancy not confirmed; valid exemption applies')"
                    className="w-full p-2 text-xs rounded border border-slate-300"
                  />
                  <textarea
                    rows={2}
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    placeholder="Documentary rationale for overriding automated preliminary check..."
                    className="w-full p-2 text-xs rounded border border-slate-300"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setMode('NONE')}
                      className="px-3 py-1 text-xs text-slate-600 hover:text-slate-900"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleOverride(f)}
                      disabled={!overrideConclusion.trim() || !overrideReason.trim()}
                      className="px-3 py-1 text-xs font-semibold rounded bg-amber-700 text-white hover:bg-amber-800 disabled:opacity-50"
                    >
                      Confirm Override
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
