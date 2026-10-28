import React from 'react';
import { DocumentItem, Finding } from '../types/scrutiny';
import { DocumentStatusBadge } from './StatusBadges';
import { 
  AlertTriangle, 
  AlertCircle, 
  ExternalLink, 
  FileText, 
  CheckCircle2, 
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

interface ManualVerificationQueueProps {
  documents: DocumentItem[];
  findings: Finding[];
  onOpenDocument: (document: DocumentItem) => void;
}

export const ManualVerificationQueue: React.FC<ManualVerificationQueueProps> = ({
  documents,
  findings,
  onOpenDocument
}) => {
  // Items needing manual verification or potential issues
  const itemsToVerify = documents.filter(
    d => d.aiStatus === 'MANUAL_VERIFICATION_REQUIRED' || 
         d.aiStatus === 'POTENTIAL_ISSUE_DETECTED' || 
         d.aiStatus === 'UNABLE_TO_VERIFY'
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h4 className="font-bold text-slate-900 text-sm">
              AICTE Authorized Officer Manual Verification Queue
            </h4>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Prioritized dossiers where the automated preliminary system detected discrepancies, ambiguous scans, or unresolved external issuing authority responses.
          </p>
        </div>

        <span className="text-xs font-mono font-semibold bg-amber-50 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-lg">
          {itemsToVerify.length} Items Require Human Attention
        </span>
      </div>

      {/* Queue Cards */}
      <div className="space-y-3">
        {itemsToVerify.map((doc, idx) => {
          const finding = findings.find(f => f.documentId === doc.id || f.documentName === doc.name);
          const isIssue = doc.aiStatus === 'POTENTIAL_ISSUE_DETECTED';

          // Specific reason for this item
          let reason = '';
          if (doc.name.includes('Programme')) {
            reason = 'Three-Way Sanctioned Intake Mismatch (Application = 120 vs Document = 60 vs Previous Record = 60)';
          } else if (doc.name.includes('NBA')) {
            reason = 'External issuing authority query returned Gateway Timeout / Pending Registry Sync';
          } else if (doc.name.includes('Infrastructure')) {
            reason = 'Missing geotagged latitude/longitude EXIF coordinate metadata in newly added AI lab proof';
          } else if (doc.name.includes('Municipal')) {
            reason = 'Municipal renewal endorsement stamp date ink dispersion/blurring';
          } else {
            reason = 'Automated check completed with low confidence; human inspection requested';
          }

          return (
            <div 
              key={doc.id}
              onClick={() => onOpenDocument(doc)}
              className={`border-2 rounded-xl p-4 transition-all hover:shadow-md cursor-pointer ${
                isIssue 
                  ? 'border-rose-300 bg-rose-50/20 hover:border-rose-400' 
                  : 'border-amber-300 bg-amber-50/20 hover:border-amber-400'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 ${
                    isIssue ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    0{idx + 1}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="font-bold text-slate-900 text-sm hover:text-amber-800 transition-colors">
                        {doc.name}
                      </h5>
                      <span className="text-slate-300">·</span>
                      <span className="font-mono text-xs text-slate-500">{doc.docType}</span>
                    </div>

                    <div className="text-xs text-slate-800 font-medium mt-1 flex items-center gap-1.5">
                      <span className="text-slate-500">Flagged Reason:</span>
                      <span className={isIssue ? 'text-rose-900 font-semibold' : 'text-amber-950 font-semibold'}>
                        {reason}
                      </span>
                    </div>

                    {finding && (
                      <div className="text-[11px] text-slate-600 mt-1.5 bg-white p-2 rounded border border-slate-200 font-serif">
                        <strong>Evidence:</strong> {finding.evidenceText.replace(/\n/g, ' · ')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <DocumentStatusBadge status={doc.aiStatus} size="sm" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDocument(doc);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                  >
                    <span>Inspect Evidence</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
