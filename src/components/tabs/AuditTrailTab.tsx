import React from 'react';
import { AuditEvent } from '../../types/scrutiny';
import { 
  History, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  UserCheck, 
  FileText, 
  Layers,
  ArrowRight
} from 'lucide-react';

interface AuditTrailTabProps {
  auditEvents: AuditEvent[];
}

export const AuditTrailTab: React.FC<AuditTrailTabProps> = ({ auditEvents }) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-700" />
            <h4 className="font-bold text-slate-900 text-sm">
              Immutable Regulatory Scrutiny Audit Trail
            </h4>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Full chronological chain-of-custody recording ingestion, automated OCR extraction, three-way checks, human officer observations, overrides, and official decisions.
          </p>
        </div>
        <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
          {auditEvents.length} Recorded Events
        </span>
      </div>

      {/* Audit Timeline */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="relative border-l-2 border-slate-200 ml-4 space-y-6 py-2">
          {auditEvents.map((ev, idx) => {
            const isOfficer = ev.actor.includes('Officer');
            const isDiscrepancy = ev.eventType.includes('MISMATCH') || ev.eventType.includes('FLAGGED');
            const isFinal = ev.eventType.includes('FINAL') || ev.eventType.includes('DECISION');

            return (
              <div key={ev.id || idx} className="relative pl-6 group">
                {/* Node icon */}
                <div className={`absolute -left-[17px] top-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-mono transition-transform group-hover:scale-110 ${
                  isFinal
                    ? 'bg-emerald-600 border-white text-white shadow-sm'
                    : isOfficer
                    ? 'bg-amber-500 border-white text-slate-950 shadow-sm'
                    : isDiscrepancy
                    ? 'bg-rose-500 border-white text-white shadow-sm'
                    : 'bg-white border-slate-300 text-slate-600'
                }`}>
                  {isFinal ? (
                    <ShieldCheck className="w-4 h-4" />
                  ) : isOfficer ? (
                    <UserCheck className="w-4 h-4" />
                  ) : isDiscrepancy ? (
                    <AlertCircle className="w-4 h-4" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                </div>

                {/* Event Card */}
                <div className="bg-slate-50 hover:bg-slate-100/70 transition-colors border border-slate-200 rounded-xl p-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">
                        {ev.action}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                        {ev.eventType}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{new Date(ev.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                      <span className="text-slate-300">·</span>
                      <span>{new Date(ev.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-700 mt-2 font-serif leading-relaxed">
                    {ev.result}
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                    <div>
                      Actor / Source: <strong className="text-slate-800">{ev.actor}</strong>
                    </div>
                    {ev.evidenceRef && (
                      <div className="font-mono text-[10px] text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                        Ref: {ev.evidenceRef}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
