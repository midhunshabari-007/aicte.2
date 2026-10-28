import React from 'react';
import { InstitutionMasterRecord } from '../../types/scrutiny';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  CreditCard, 
  MapPin, 
  Calendar,
  AlertTriangle,
  Info
} from 'lucide-react';

interface InstitutionRecordsTabProps {
  institution?: InstitutionMasterRecord;
}

export const InstitutionRecordsTab: React.FC<InstitutionRecordsTabProps> = ({ institution }) => {
  if (!institution) {
    return (
      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
        No historical institutional master record found for this Permanent ID.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Demo Data Disclaimer */}
      <div className="bg-slate-100 border border-slate-300 rounded-xl p-3 text-xs text-slate-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-500 shrink-0" />
          <span>
            <strong>DEMO / SEEDED INSTITUTIONAL RECORDS:</strong> Simulated historical records extracted from Council archives. Clearly marked as mock data for regulatory evaluation.
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-300">
          Source: AICTE Master DB
        </span>
      </div>

      {/* Main Record Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="text-[11px] font-mono text-amber-700 font-bold uppercase tracking-wider">
              Permanent AICTE Institution ID: {institution.permanentId}
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">{institution.institutionName}</h3>
            <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{institution.region} ({institution.state})</span>
              <span>·</span>
              <span>Established: <strong className="text-slate-700 font-mono">{institution.establishmentYear}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-lg text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{institution.previousApprovalStatus}</span>
          </div>
        </div>

        {/* 3-Column Specifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Historical Sanctioned Intake
            </div>
            <div className="text-2xl font-bold text-slate-900 font-mono">
              {institution.sanctionedIntake} Seats
            </div>
            <p className="text-[11px] text-slate-500">
              Sanctioned capacity approved under previous year EoA order. Any increase requires prior Council sanction.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Campus Land & Built-Up Area
            </div>
            <div className="text-2xl font-bold text-slate-900 font-mono">
              {institution.landAreaAcres} Acres
            </div>
            <div className="text-[11px] text-slate-600 font-mono">
              Built-up: {institution.builtUpAreaSqMtr.toLocaleString()} sq. metres
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              TER Fee Payment Verification
            </div>
            <div className="text-sm font-bold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>TER Fee Paid & Verified</span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              {institution.terPaymentStatus}
            </p>
          </div>

        </div>

        {/* Approved Programmes Schedule */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-50 px-4 py-2.5 font-bold text-xs border-b border-slate-200 text-slate-800">
            Previously Sanctioned Programmes & Degrees
          </div>
          <div className="p-4 space-y-2">
            {institution.approvedProgrammes.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-0 font-medium text-slate-800">
                <span>{p}</span>
                <span className="font-mono text-slate-500">Sanctioned: 60 seats · Regular Shift</span>
              </div>
            ))}
          </div>
        </div>

        {/* Deficiency History */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div className="font-bold text-slate-800 uppercase text-[11px] tracking-wide mb-1">
            Historical Deficiency Log:
          </div>
          <p className="text-slate-600 font-serif">
            {institution.deficiencyHistory}. Last physical scrutiny committee inspection conducted on {institution.lastScrutinyDate}.
          </p>
        </div>

      </div>
    </div>
  );
};
