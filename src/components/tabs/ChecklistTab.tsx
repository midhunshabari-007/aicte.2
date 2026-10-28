import React from 'react';
import { ChecklistRule } from '../../types/scrutiny';
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  FileCheck, 
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface ChecklistTabProps {
  checklist: ChecklistRule[];
  onOpenDocumentById: (docId: string) => void;
}

export const ChecklistTab: React.FC<ChecklistTabProps> = ({
  checklist,
  onOpenDocumentById
}) => {
  return (
    <div className="space-y-4">
      {/* Statutory Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-600" />
            <h4 className="font-bold text-slate-900 text-sm">
              AICTE Approval Process Handbook (APH 2026–2027) Compliance Checklist
            </h4>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Applicable statutory rules for category: <strong>Extension of Approval (EoA)</strong>. Configurable ruleset dynamically evaluated against extracted document metadata.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{checklist.filter(c => c.evaluationStatus === 'COMPLIANT').length} Compliant</span>
          </span>
          <span className="flex items-center gap-1 text-rose-800 font-semibold bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>{checklist.filter(c => c.evaluationStatus === 'POTENTIAL_DEFICIENCY').length} Potential Deficiency</span>
          </span>
          <span className="flex items-center gap-1 text-amber-800 font-semibold bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>{checklist.filter(c => c.evaluationStatus === 'MANUAL_VERIFICATION_PENDING').length} Verification Pending</span>
          </span>
        </div>
      </div>

      {/* Rules Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4">Rule Code & Category</th>
              <th className="py-3 px-4">Requirement & Statutory Clause</th>
              <th className="py-3 px-4">Automated Evaluation Status</th>
              <th className="py-3 px-4">Evidence Summary</th>
              <th className="py-3 px-4 text-right">Mapped Document</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80">
            {checklist.map((rule) => {
              const isCompliant = rule.evaluationStatus === 'COMPLIANT';
              const isDeficiency = rule.evaluationStatus === 'POTENTIAL_DEFICIENCY';

              return (
                <tr key={rule.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono">
                    <div className="font-bold text-slate-900">{rule.ruleCode}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{rule.category}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 leading-snug">{rule.requirementName}</div>
                    <div className="text-[11px] text-amber-800 font-serif mt-0.5">{rule.statutoryClause}</div>
                  </td>

                  <td className="py-3 px-4">
                    {isCompliant ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Compliant</span>
                      </span>
                    ) : isDeficiency ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                        <span>Potential Deficiency</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        <span>Manual Verification Pending</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-slate-700 text-[11px] max-w-sm">
                    {rule.evidenceSummary}
                  </td>

                  <td className="py-3 px-4 text-right">
                    {rule.mappedDocumentId && (
                      <button
                        onClick={() => onOpenDocumentById(rule.mappedDocumentId!)}
                        className="inline-flex items-center gap-1 text-slate-700 hover:text-amber-700 font-mono text-[11px] underline"
                      >
                        <span>{rule.mappedDocumentId}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
