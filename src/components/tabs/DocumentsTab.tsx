import React, { useState } from 'react';
import { DocumentItem } from '../../types/scrutiny';
import { DocumentStatusBadge } from '../StatusBadges';
import { 
  FileText, 
  Search, 
  Filter, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle,
  HelpCircle,
  Eye,
  Layers
} from 'lucide-react';

interface DocumentsTabProps {
  documents: DocumentItem[];
  onOpenDocument: (document: DocumentItem) => void;
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({
  documents,
  onOpenDocument
}) => {
  const [filter, setFilter] = useState<'ALL' | 'ISSUES' | 'VERIFICATION' | 'NO_ISSUE'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.docType.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (filter === 'ISSUES') return doc.aiStatus === 'POTENTIAL_ISSUE_DETECTED';
    if (filter === 'VERIFICATION') return doc.aiStatus === 'MANUAL_VERIFICATION_REQUIRED' || doc.aiStatus === 'UNABLE_TO_VERIFY';
    if (filter === 'NO_ISSUE') return doc.aiStatus === 'NO_ISSUE_DETECTED';
    return true;
  });

  const issueCount = documents.filter(d => d.aiStatus === 'POTENTIAL_ISSUE_DETECTED').length;
  const verifyCount = documents.filter(d => d.aiStatus === 'MANUAL_VERIFICATION_REQUIRED').length;
  const noIssueCount = documents.filter(d => d.aiStatus === 'NO_ISSUE_DETECTED').length;

  return (
    <div className="space-y-4">
      {/* Filtering and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search document name or category..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              filter === 'ALL' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({documents.length})
          </button>
          <button
            onClick={() => setFilter('ISSUES')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              filter === 'ISSUES' ? 'bg-white text-rose-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Potential Issues ({issueCount})
          </button>
          <button
            onClick={() => setFilter('VERIFICATION')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              filter === 'VERIFICATION' ? 'bg-white text-amber-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Manual Verification ({verifyCount})
          </button>
          <button
            onClick={() => setFilter('NO_ISSUE')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              filter === 'NO_ISSUE' ? 'bg-white text-emerald-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            No Issues ({noIssueCount})
          </button>
        </div>
      </div>

      {/* Documents Grid / Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Document Title & Ref</th>
                <th className="py-3 px-4">Regulatory Category</th>
                <th className="py-3 px-4">Size & Pages</th>
                <th className="py-3 px-4">Preliminary AI Status</th>
                <th className="py-3 px-4">Extraction Confidence</th>
                <th className="py-3 px-4">Key Extracted Snippet</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80">
              {filteredDocs.map((doc) => {
                const sampleSnippet = doc.extractedFields[0]?.evidenceSnippet || 'Text successfully ingested and verified against norms.';
                const isIssue = doc.aiStatus === 'POTENTIAL_ISSUE_DETECTED';
                const isVerify = doc.aiStatus === 'MANUAL_VERIFICATION_REQUIRED';

                return (
                  <tr 
                    key={doc.id}
                    onClick={() => onOpenDocument(doc)}
                    className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                      isIssue ? 'bg-rose-50/20' : isVerify ? 'bg-amber-50/10' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className={`w-4 h-4 shrink-0 ${
                          isIssue ? 'text-rose-600' : isVerify ? 'text-amber-600' : 'text-slate-500'
                        }`} />
                        <div>
                          <div className="font-semibold text-slate-900 hover:text-amber-800 transition-colors flex items-center gap-1.5">
                            <span>{doc.name}</span>
                            {doc.videoProof && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-amber-800 bg-amber-100/80 px-1.5 py-0.2 rounded border border-amber-300">
                                🎥 Video Proof
                              </span>
                            )}
                          </div>
                          <div className="font-mono text-[10px] text-slate-400 mt-0.5">
                            {doc.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-700">
                      <span className="font-medium">{doc.docType}</span>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                      <div>{doc.fileSize}</div>
                      <div className="text-[10px] text-slate-400">{doc.pageCount} Pages</div>
                    </td>

                    <td className="py-3 px-4">
                      <DocumentStatusBadge status={doc.aiStatus} size="sm" />
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        doc.confidenceScore >= 95 
                          ? 'bg-emerald-50 text-emerald-800' 
                          : doc.confidenceScore >= 85 
                          ? 'bg-blue-50 text-blue-800' 
                          : 'bg-amber-50 text-amber-800'
                      }`}>
                        {doc.confidenceScore}%
                      </span>
                    </td>

                    <td className="py-3 px-4 text-[11px] text-slate-600 max-w-xs truncate">
                      {sampleSnippet}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenDocument(doc);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 transition-colors border border-slate-200"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
