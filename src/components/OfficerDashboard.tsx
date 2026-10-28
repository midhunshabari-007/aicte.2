import React, { useState } from 'react';
import { 
  Application, 
  ApplicationOverallStatus, 
  ReviewPriority 
} from '../types/scrutiny';
import { 
  ApplicationStatusBadge, 
  PriorityChip 
} from './StatusBadges';
import { 
  FileText, 
  Search, 
  Filter, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Calendar, 
  ChevronRight,
  ArrowRight,
  Layers,
  Sparkles,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

interface OfficerDashboardProps {
  applications: Application[];
  onSelectApplication: (id: string) => void;
  onOpenIntakeModal: () => void;
}

export const OfficerDashboard: React.FC<OfficerDashboardProps> = ({
  applications,
  onSelectApplication,
  onOpenIntakeModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'HIGH_PRIORITY' | 'ISSUES' | 'COMPLETED'>('ALL');

  // Compute live dashboard metrics
  const totalApps = applications.length;
  const pendingReview = applications.filter(a => a.officialDecision === 'PENDING').length;
  const processing = applications.filter(a => a.overallStatus === 'PROCESSING').length;
  const prelimCompleted = applications.filter(a => a.overallStatus === 'PRELIMINARY_CHECK_COMPLETED').length;
  const manualVerificationNeeded = applications.filter(a => a.manualVerificationCount > 0 && a.officialDecision === 'PENDING').length;
  const potentialIssuesDetected = applications.filter(a => a.potentialIssueCount > 0).length;
  const highPriority = applications.filter(a => a.reviewPriority === 'HIGH').length;

  // Filter applications
  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.institutionId.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'HIGH_PRIORITY') return app.reviewPriority === 'HIGH';
    if (statusFilter === 'ISSUES') return app.potentialIssueCount > 0 || app.manualVerificationCount > 0;
    if (statusFilter === 'COMPLETED') return app.officialDecision !== 'PENDING';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Welcome & Context Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 font-mono">
                Western Regional Office · Bureau of Approvals
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500">Academic Year 2026–2027</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              AICTE Authorized Officer Scrutiny Console
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Preliminary automated scrutiny results, cross-document discrepancies, and evidence dossiers for official regulatory verification.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenIntakeModal}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap"
            >
              <span>Simulate New Application Intake</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Primary 8-Metric Regulatory KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Total Submissions</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">{totalApps}</div>
          <div className="text-[11px] text-slate-400 mt-1">Ingested via Portal</div>
        </div>

        <div className="bg-white border border-amber-200 bg-amber-50/20 rounded-lg p-3.5 shadow-xs">
          <div className="text-[11px] font-medium text-amber-800 uppercase tracking-wide">Pending Review</div>
          <div className="text-2xl font-bold text-amber-900 font-mono tabular-nums mt-1">{pendingReview}</div>
          <div className="text-[11px] text-amber-700 mt-1">Awaiting Decision</div>
        </div>

        <div className="bg-white border border-rose-200 bg-rose-50/20 rounded-lg p-3.5 shadow-xs">
          <div className="text-[11px] font-medium text-rose-800 uppercase tracking-wide">High Priority</div>
          <div className="text-2xl font-bold text-rose-900 font-mono tabular-nums mt-1">{highPriority}</div>
          <div className="text-[11px] text-rose-700 mt-1">Flagged for closer scrutiny</div>
        </div>

        <div className="bg-white border border-rose-200 rounded-lg p-3.5 shadow-xs">
          <div className="text-[11px] font-medium text-rose-700 uppercase tracking-wide">Potential Issues</div>
          <div className="text-2xl font-bold text-rose-800 font-mono tabular-nums mt-1">{potentialIssuesDetected}</div>
          <div className="text-[11px] text-rose-600 mt-1">Discrepancy detected</div>
        </div>

        <div className="bg-white border border-amber-200 rounded-lg p-3.5 shadow-xs">
          <div className="text-[11px] font-medium text-amber-700 uppercase tracking-wide">Manual Verify</div>
          <div className="text-2xl font-bold text-amber-800 font-mono tabular-nums mt-1">{manualVerificationNeeded}</div>
          <div className="text-[11px] text-amber-600 mt-1">Human inspection req.</div>
        </div>

        <div className="bg-white border border-emerald-200 rounded-lg p-3.5 shadow-xs">
          <div className="text-[11px] font-medium text-emerald-700 uppercase tracking-wide">Prelim. Complete</div>
          <div className="text-2xl font-bold text-emerald-800 font-mono tabular-nums mt-1">{prelimCompleted}</div>
          <div className="text-[11px] text-emerald-600 mt-1">Passed automated checks</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Decided / Orders</div>
          <div className="text-2xl font-bold text-slate-700 font-mono tabular-nums mt-1">
            {totalApps - pendingReview}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Official Orders Recorded</div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Application ID, Institution Name, or Permanent ID..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              statusFilter === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({applications.length})
          </button>
          <button
            onClick={() => setStatusFilter('HIGH_PRIORITY')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              statusFilter === 'HIGH_PRIORITY'
                ? 'bg-white text-rose-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            High Priority ({highPriority})
          </button>
          <button
            onClick={() => setStatusFilter('ISSUES')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              statusFilter === 'ISSUES'
                ? 'bg-white text-amber-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Requires Verification
          </button>
          <button
            onClick={() => setStatusFilter('COMPLETED')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              statusFilter === 'COMPLETED'
                ? 'bg-white text-emerald-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Decided
          </button>
        </div>
      </div>

      {/* Main Scrutiny Applications Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Applications Ingestion & Scrutiny Queue
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono tabular-nums">
            Showing {filteredApps.length} of {applications.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Application Details</th>
                <th className="py-3 px-4">Institution & Region</th>
                <th className="py-3 px-4">Category & Intake</th>
                <th className="py-3 px-4">Documents Breakdown</th>
                <th className="py-3 px-4">Preliminary Status</th>
                <th className="py-3 px-4">Review Priority</th>
                <th className="py-3 px-4">Official Decision</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80">
              {filteredApps.map((app) => (
                <tr 
                  key={app.id} 
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => onSelectApplication(app.id)}
                >
                  {/* Application ID & Submission */}
                  <td className="py-3.5 px-4 font-mono">
                    <div className="font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                      {app.id}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{new Date(app.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </td>

                  {/* Institution Name & Region */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 leading-snug">
                      {app.institutionName}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono text-slate-600">{app.institutionId}</span>
                      <span>·</span>
                      <span>{app.region}</span>
                    </div>
                  </td>

                  {/* Category & Requested Intake */}
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800">{app.applicationCategory}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                      Req. Intake: <span className="font-semibold text-slate-900">{app.requestedIntake}</span> seats
                    </div>
                  </td>

                  {/* Document Status Breakdown */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span className="inline-flex items-center gap-1 font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{app.noIssueCount}</span>
                      </span>

                      {app.manualVerificationCount > 0 && (
                        <span className="inline-flex items-center gap-1 font-mono px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          <span>{app.manualVerificationCount}</span>
                        </span>
                      )}

                      {app.potentialIssueCount > 0 && (
                        <span className="inline-flex items-center gap-1 font-mono px-1.5 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
                          <AlertCircle className="w-3 h-3 text-rose-600" />
                          <span>{app.potentialIssueCount}</span>
                        </span>
                      )}

                      <span className="text-slate-400 font-mono">/ {app.documentCount}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {app.potentialIssueCount > 0 ? 'Discrepancy detected' : app.manualVerificationCount > 0 ? 'Verification required' : 'All clear'}
                    </div>
                  </td>

                  {/* Preliminary Status */}
                  <td className="py-3.5 px-4">
                    <ApplicationStatusBadge status={app.overallStatus} />
                  </td>

                  {/* Review Priority */}
                  <td className="py-3.5 px-4">
                    <PriorityChip priority={app.reviewPriority} />
                  </td>

                  {/* Official Decision Status */}
                  <td className="py-3.5 px-4">
                    {app.officialDecision === 'PENDING' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Pending Officer Review</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Decision Issued</span>
                      </span>
                    )}
                  </td>

                  {/* Action CTA */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectApplication(app.id);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-800 transition-colors border border-slate-200 hover:border-amber-500"
                    >
                      <span>Examine Dossier</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
