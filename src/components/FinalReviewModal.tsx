import React, { useState } from 'react';
import { 
  Application, 
  DocumentItem, 
  Finding, 
  ChecklistRule, 
  OfficialDecisionType 
} from '../types/scrutiny';
import { 
  X, 
  Shield, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  ShieldCheck, 
  Stamp, 
  Printer, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';

interface FinalReviewModalProps {
  application: Application;
  documents: DocumentItem[];
  findings: Finding[];
  checklist: ChecklistRule[];
  onClose: () => void;
  onRecordDecision: (
    decision: OfficialDecisionType, 
    notes: string, 
    officerName: string, 
    designation: string
  ) => void;
}

export const FinalReviewModal: React.FC<FinalReviewModalProps> = ({
  application,
  documents,
  findings,
  checklist,
  onClose,
  onRecordDecision
}) => {
  const [selectedDecision, setSelectedDecision] = useState<OfficialDecisionType>(
    application.potentialIssueCount > 0 
      ? 'APPROVED_WITH_REDUCED_INTAKE' 
      : 'APPROVED'
  );
  const [decisionNotes, setDecisionNotes] = useState(
    application.potentialIssueCount > 0
      ? 'Approved for Extension of Approval (EoA) 2026-27 with Sanctioned Intake restricted to 60 seats in B.Tech CSE. The requested increase to 120 seats is declined due to absence of statutory capacity expansion order and conflicting supporting proposal documents.'
      : 'All statutory norms under AICTE Approval Process Handbook (APH 2026-27) verified and found compliant. Extension of Approval granted.'
  );
  const [officerName, setOfficerName] = useState('Dr. R. K. Sharma');
  const [officerDesignation, setOfficerDesignation] = useState('Senior Scrutiny Officer, Western Regional Office');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedOrder, setGeneratedOrder] = useState<string | null>(null);

  const activeFindings = findings.filter(f => f.status === 'ACTIVE');
  const resolvedFindings = findings.filter(f => f.status === 'RESOLVED' || f.status === 'OVERRIDDEN');
  const noIssueDocs = documents.filter(d => d.aiStatus === 'NO_ISSUE_DETECTED').length;
  const manualVerifyDocs = documents.filter(d => d.aiStatus === 'MANUAL_VERIFICATION_REQUIRED').length;
  const issueDocs = documents.filter(d => d.aiStatus === 'POTENTIAL_ISSUE_DETECTED').length;

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onRecordDecision(selectedDecision, decisionNotes, officerName, officerDesignation);
      setGeneratedOrder(`F.No. Western/${application.institutionId.replace('INST-AICTE-', '')}/2026/SCRUTINY-ORDER-${Math.floor(1000 + Math.random() * 9000)}`);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 lg:p-6 overflow-hidden">
      <div className="bg-white border border-slate-300 w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in duration-200">
        
        {/* Titlebar */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Stamp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Final Regulatory Review & Official Order Recording
              </h3>
              <p className="text-xs text-slate-400">
                AICTE Authorized Officer Comprehensive Dossier Verification & Executive Decision
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          
          {generatedOrder ? (
            /* Order Generation Success Canvas */
            <div className="p-6 bg-emerald-50 border-2 border-emerald-300 rounded-xl space-y-4 text-emerald-950">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-base font-bold text-emerald-900">
                    Official Regulatory Order Successfully Recorded
                  </h4>
                  <div className="text-xs font-mono font-bold text-emerald-800 mt-0.5">
                    Order Ref: {generatedOrder}
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-emerald-200 space-y-2 font-mono text-xs text-slate-800">
                <div className="font-bold border-b border-slate-200 pb-1 text-slate-900">
                  ALL INDIA COUNCIL FOR TECHNICAL EDUCATION — REGULATORY DISPATCH
                </div>
                <div>Application: <strong>{application.id}</strong></div>
                <div>Institution: <strong>{application.institutionName}</strong> ({application.institutionId})</div>
                <div>Official Regulatory Decision: <strong className="text-emerald-700">{selectedDecision}</strong></div>
                <div>Decision Authority: <strong>{officerName}</strong> ({officerDesignation})</div>
                <div>Date & Timestamp: <strong>{new Date().toLocaleString()}</strong></div>
                <div className="pt-2 border-t border-slate-200 text-slate-700 font-sans">
                  <strong>Regulatory Conditions & Findings Order:</strong>
                  <p className="mt-1 font-serif text-xs">{decisionNotes}</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800"
                >
                  Return to Scrutiny Dashboard
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Mandatory Core Principle Notice */}
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs text-amber-950 flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  <strong>Sole Human Authority Principle:</strong> AI has completed preliminary cross-checks and multi-source discrepancy extraction. You are now exercising official statutory regulatory authority under the AICTE Act 1987.
                </span>
              </div>

              {/* Section 37 Step Summary Grid */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-4">
                <div className="font-bold text-slate-900 text-xs uppercase tracking-wide border-b border-slate-200 pb-2">
                  Complete Pre-Decision Synthesis
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">12 Documents</div>
                    <div className="text-sm font-bold text-slate-800 mt-1 font-mono">
                      {noIssueDocs} 🟢 · {manualVerifyDocs} 🟡 · {issueDocs} 🔴
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">AI Findings</div>
                    <div className="text-sm font-bold text-rose-800 mt-1 font-mono">
                      {activeFindings.length} Active ({resolvedFindings.length} Resolved)
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Checklist Norms</div>
                    <div className="text-sm font-bold text-slate-800 mt-1 font-mono">
                      {checklist.filter(c => c.evaluationStatus === 'COMPLIANT').length} / {checklist.length} Compliant
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Requested Intake</div>
                    <div className="text-sm font-bold text-amber-800 mt-1 font-mono">
                      {application.requestedIntake} (vs 60 Master)
                    </div>
                  </div>
                </div>
              </div>

              {/* Outstanding Findings Warning if any */}
              {activeFindings.length > 0 && (
                <div className="border border-rose-200 bg-rose-50/40 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-rose-900 text-xs">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>Unresolved Discrepancies Noted in Dossier:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 font-mono text-[11px]">
                    {activeFindings.map(f => (
                      <li key={f.id}>
                        <strong>{f.title}:</strong> {f.whatDetected}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Official Decision Form */}
              <div className="border border-slate-300 rounded-xl p-5 bg-white space-y-4">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Stamp className="w-4 h-4 text-amber-600" />
                  <span>Record Official AICTE Regulatory Decision</span>
                </div>

                <div className="space-y-2">
                  <label className="block font-semibold text-slate-700">Select Official Regulatory Outcome:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <label className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      selectedDecision === 'APPROVED_WITH_REDUCED_INTAKE'
                        ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}>
                      <input
                        type="radio"
                        name="decision"
                        checked={selectedDecision === 'APPROVED_WITH_REDUCED_INTAKE'}
                        onChange={() => setSelectedDecision('APPROVED_WITH_REDUCED_INTAKE')}
                        className="sr-only"
                      />
                      <div className="font-bold text-amber-950">Approved with Sanctioned Intake (60 Seats)</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Resolves intake discrepancy by enforcing existing approved capacity of 60 seats.
                      </div>
                    </label>

                    <label className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      selectedDecision === 'APPROVED'
                        ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}>
                      <input
                        type="radio"
                        name="decision"
                        checked={selectedDecision === 'APPROVED'}
                        onChange={() => setSelectedDecision('APPROVED')}
                        className="sr-only"
                      />
                      <div className="font-bold text-emerald-950">Approved for Full Requested Intake (120 Seats)</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Grants requested expansion subject to post-facto Council ratification.
                      </div>
                    </label>

                    <label className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      selectedDecision === 'DEFICIENCIES_COMMUNICATED'
                        ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}>
                      <input
                        type="radio"
                        name="decision"
                        checked={selectedDecision === 'DEFICIENCIES_COMMUNICATED'}
                        onChange={() => setSelectedDecision('DEFICIENCIES_COMMUNICATED')}
                        className="sr-only"
                      />
                      <div className="font-bold text-orange-950">Deficiencies Communicated (Show Cause)</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Issue 7-day show cause notice to institution to reconcile document discrepancies.
                      </div>
                    </label>

                    <label className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      selectedDecision === 'REJECTED'
                        ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-500/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}>
                      <input
                        type="radio"
                        name="decision"
                        checked={selectedDecision === 'REJECTED'}
                        onChange={() => setSelectedDecision('REJECTED')}
                        className="sr-only"
                      />
                      <div className="font-bold text-rose-950">Rejected for Non-Compliance</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Decline approval due to unrectified material discrepancies.
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Regulatory Order Remarks & Conditions:
                  </label>
                  <textarea
                    rows={3}
                    value={decisionNotes}
                    onChange={(e) => setDecisionNotes(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-serif"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Authorized Officer Name:</label>
                    <input
                      type="text"
                      value={officerName}
                      onChange={(e) => setOfficerName(e.target.value)}
                      className="w-full p-2 text-xs rounded border border-slate-300 bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Designation & Region:</label>
                    <input
                      type="text"
                      value={officerDesignation}
                      onChange={(e) => setOfficerDesignation(e.target.value)}
                      className="w-full p-2 text-xs rounded border border-slate-300 bg-slate-50"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className="px-5 py-2.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors shadow-sm flex items-center gap-2"
                >
                  <span>Record Final Official Decision</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
