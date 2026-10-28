import React, { useState } from 'react';
import { 
  DocumentItem, 
  Finding, 
  InstitutionMasterRecord 
} from '../types/scrutiny';
import { 
  DocumentStatusBadge, 
  ExternalVerificationBadge 
} from './StatusBadges';
import { VideoProofViewer } from './VideoProofViewer';
import { 
  X, 
  FileText, 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  RotateCcw,
  ShieldAlert,
  HelpCircle,
  Clock,
  Printer,
  Maximize2,
  Video
} from 'lucide-react';

interface DocumentViewerModalProps {
  document: DocumentItem;
  findings: Finding[];
  institutionRecord?: InstitutionMasterRecord;
  onClose: () => void;
  onAddObservation: (findingId: string, observation: string) => void;
  onResolveFinding: (findingId: string, notes: string) => void;
  onOverrideFinding: (findingId: string, conclusion: string, reason: string) => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document,
  findings,
  institutionRecord,
  onClose,
  onAddObservation,
  onResolveFinding,
  onOverrideFinding
}) => {
  const [currentPage, setCurrentPage] = useState(
    document.threeWayComparisons && document.threeWayComparisons.length > 0 ? 3 : 1
  );
  const [activeTab, setActiveTab] = useState<'ai_analysis' | 'three_way' | 'extracted_fields' | 'officer_action'>('ai_analysis');
  const [previewMode, setPreviewMode] = useState<'document' | 'video'>(
    document.videoProof ? 'video' : 'document'
  );
  const [officerNote, setOfficerNote] = useState('');
  const [overrideConclusion, setOverrideConclusion] = useState('');
  const [overrideReason, setOverrideReason] = useState('');
  const [showOverrideForm, setShowOverrideForm] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Mapped finding for this document if any
  const documentFinding = findings.find(f => f.documentId === document.id || f.documentName === document.name);

  const handleResolve = (customNote?: string) => {
    if (!documentFinding) return;
    const note = customNote || officerNote.trim() || 'Verified by officer against supporting documentation. Action resolved.';
    onResolveFinding(documentFinding.id, note);
    setActionSuccess('Finding resolved successfully. Audit trail preserved.');
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const handleOverride = () => {
    if (!documentFinding || !overrideConclusion.trim() || !overrideReason.trim()) return;
    onOverrideFinding(documentFinding.id, overrideConclusion, overrideReason);
    setShowOverrideForm(false);
    setActionSuccess('Officer override recorded. Original AI finding preserved in audit history.');
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const handleAddNote = () => {
    if (!documentFinding || !officerNote.trim()) return;
    onAddObservation(documentFinding.id, officerNote);
    setActionSuccess('Officer observation recorded.');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 lg:p-6 overflow-hidden">
      <div className="bg-white border border-slate-300 w-full max-w-7xl h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in duration-200">
        
        {/* Top Split Viewer Titlebar */}
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-amber-300">{document.id}</span>
                <span className="text-slate-500">·</span>
                <h3 className="text-sm font-bold text-white truncate max-w-md">{document.name}</h3>
                {document.videoProof && (
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold flex items-center gap-1">
                    <Video className="w-3 h-3" />
                    <span>Video Proof Attached</span>
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                <span>Classification: <strong className="text-slate-200">{document.docType}</strong></span>
                <span>·</span>
                <span>Size: <span className="font-mono">{document.fileSize}</span></span>
                <span>·</span>
                <span>Total Pages: <span className="font-mono">{document.pageCount}</span></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <DocumentStatusBadge status={document.aiStatus} />
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action feedback alert */}
        {actionSuccess && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2 text-xs font-medium text-emerald-800 flex items-center gap-2 animate-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Side-by-Side Main Split Viewport */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-slate-100">
          
          {/* =========================================
              LEFT COLUMN: Original Document / Video Preview (Cols 1-7)
              ========================================= */}
          <div className="lg:col-span-7 border-r border-slate-300 flex flex-col bg-slate-200/70 overflow-hidden">
            
            {/* View Mode Switcher if Video Proof Attached */}
            <div className="px-4 py-2 border-b border-slate-300 bg-white flex items-center justify-between text-xs text-slate-600 shrink-0">
              <div className="flex items-center gap-2">
                {document.videoProof ? (
                  <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs">
                    <button
                      onClick={() => setPreviewMode('video')}
                      className={`px-2.5 py-1 rounded font-semibold transition-colors flex items-center gap-1.5 ${
                        previewMode === 'video'
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Video Proof Walkthrough (MP4)</span>
                    </button>
                    <button
                      onClick={() => setPreviewMode('document')}
                      className={`px-2.5 py-1 rounded font-semibold transition-colors flex items-center gap-1.5 ${
                        previewMode === 'document'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>PDF Document Text</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="font-semibold text-slate-700">Document Stream Preview</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-mono border border-slate-200">
                      Selectable Digital PDF
                    </span>
                  </>
                )}
              </div>

              {/* Page Selector (only when viewing document) */}
              {previewMode === 'document' && (
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className="p-1 rounded hover:bg-slate-100 disabled:opacity-40 transition-opacity"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-xs font-semibold">
                    Page {currentPage} of {document.pageCount}
                  </span>
                  <button
                    disabled={currentPage >= document.pageCount}
                    onClick={() => setCurrentPage(p => Math.min(document.pageCount, p + 1))}
                    className="p-1 rounded hover:bg-slate-100 disabled:opacity-40 transition-opacity"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Viewport Content */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6 flex justify-center">
              {previewMode === 'video' && document.videoProof ? (
                <div className="w-full max-w-3xl">
                  <VideoProofViewer
                    videoProof={document.videoProof}
                    documentName={document.name}
                    isResolved={documentFinding?.status === 'RESOLVED'}
                    onVerifyAndResolve={(notes) => handleResolve(notes)}
                  />
                </div>
              ) : (
                <div className="w-full max-w-2xl bg-white rounded-lg shadow-md border border-slate-300/80 p-8 min-h-[680px] flex flex-col justify-between text-slate-800 font-sans text-xs">
                  
                  {/* Official Letterhead */}
                  <div className="border-b-2 border-slate-900 pb-4 mb-4 text-center">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Regulatory Document Submission
                    </div>
                    <h4 className="text-base font-bold text-slate-950 uppercase mt-1">
                      {document.documentContent.issuingAuthority}
                    </h4>
                    <div className="text-[11px] text-slate-600 flex items-center justify-center gap-3 mt-1 font-mono">
                      <span>Doc Ref: {document.documentContent.documentNumber}</span>
                      <span>·</span>
                      <span>Dated: {document.documentContent.issueDate}</span>
                      {document.documentContent.expiryDate && (
                        <>
                          <span>·</span>
                          <span>Valid Thru: {document.documentContent.expiryDate}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Document Body Sections */}
                  <div className="space-y-4 flex-1">
                    {document.documentContent.sections.map((sec, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3 rounded-lg transition-all ${
                          sec.highlighted 
                            ? 'bg-amber-50 border-2 border-amber-400 text-slate-900 ring-4 ring-amber-400/10' 
                            : 'bg-transparent'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-bold text-slate-900 text-xs">{sec.heading}</div>
                          {sec.highlighted && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950 uppercase">
                              Discrepancy / Evidence Section
                            </span>
                          )}
                        </div>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-line text-xs font-serif">
                          {sec.body}
                        </p>
                      </div>
                    ))}

                    {/* Table Data if available (e.g. Course Schedule) */}
                    {document.documentContent.tableData && (
                      <div className="mt-4 border border-slate-300 rounded overflow-hidden">
                        <div className="bg-slate-100 px-3 py-1.5 font-bold text-[11px] border-b border-slate-300 text-slate-800">
                          Sanctioned Course Schedule Matrix
                        </div>
                        <table className="w-full text-left text-[11px]">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                              {document.documentContent.tableData.headers.map((h, i) => (
                                <th key={i} className="p-2">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {document.documentContent.tableData.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="border-b border-slate-200 hover:bg-amber-50/50">
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className={`p-2 font-mono ${cIdx === 3 ? 'font-bold text-rose-700 bg-rose-50/60' : ''}`}>
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Footer Stamp & Signatory Seal */}
                  <div className="mt-8 pt-4 border-t border-slate-300 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="border border-slate-300 rounded p-2 text-center bg-slate-50">
                      <div className="text-[10px] font-bold uppercase text-slate-600">Digitally Verified Seal</div>
                      <div className="text-[10px] font-mono text-slate-500 mt-0.5">Govt. Notary / Registrar</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900">Authorized Signatory</div>
                      <div className="text-[10px] text-slate-500">Apex Institute / Competent Authority</div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>

          {/* =========================================
              RIGHT COLUMN: AI Analysis & Officer Review (Cols 8-12)
              ========================================= */}
          <div className="lg:col-span-5 flex flex-col bg-white overflow-hidden">
            
            {/* Panel Tabs */}
            <div className="flex items-center border-b border-slate-200 bg-slate-50 px-2 shrink-0">
              <button
                onClick={() => setActiveTab('ai_analysis')}
                className={`px-3 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                  activeTab === 'ai_analysis'
                    ? 'border-amber-600 text-amber-900 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                AI Scrutiny Findings
              </button>
              <button
                onClick={() => setActiveTab('three_way')}
                className={`px-3 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                  activeTab === 'three_way'
                    ? 'border-amber-600 text-amber-900 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Three-Way Comparison
              </button>
              <button
                onClick={() => setActiveTab('extracted_fields')}
                className={`px-3 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                  activeTab === 'extracted_fields'
                    ? 'border-amber-600 text-amber-900 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Extracted Fields ({document.extractedFields.length})
              </button>
              <button
                onClick={() => setActiveTab('officer_action')}
                className={`px-3 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                  activeTab === 'officer_action'
                    ? 'border-amber-600 text-amber-900 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Officer Action
              </button>
            </div>

            {/* Panel Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              
              {/* Tab 1: AI Scrutiny Findings */}
              {activeTab === 'ai_analysis' && (
                <div className="space-y-4">
                  {/* AI Status Card */}
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Preliminary Scrutiny Status
                      </span>
                      <DocumentStatusBadge status={document.aiStatus} />
                    </div>

                    <div className="flex items-center justify-between text-xs mt-3 pt-2 border-t border-slate-200">
                      <span className="text-slate-600">Automated Extraction Confidence:</span>
                      <span className="font-mono font-bold text-slate-900">{document.confidenceScore}%</span>
                    </div>

                    {document.videoProof && (
                      <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950">
                        <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Video Proof Walkthrough Verified</span>
                        </div>
                        <div className="text-[11px] text-emerald-800 mt-0.5">
                          Continuous 105s geotagged recording at GPS coordinates {document.videoProof.gpsCoordinates} with 60 workstations detected.
                        </div>
                      </div>
                    )}

                    <p className="text-[11px] text-slate-500 italic mt-2 bg-amber-50/50 p-2 rounded border border-amber-200/50">
                      <strong>Regulatory Notice:</strong> AI confidence reflects preliminary text extraction and comparison certainty. It does not constitute a regulatory decision. Final determination is reserved for the AICTE authorized officer.
                    </p>
                  </div>

                  {/* Important Flagged Finding (if any) */}
                  {documentFinding ? (
                    <div className="border-2 border-rose-200 bg-rose-50/30 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{documentFinding.title}</span>
                      </div>

                      <div>
                        <div className="font-semibold text-slate-800 text-[11px] uppercase tracking-wide">WHAT was detected?</div>
                        <p className="text-slate-700 mt-0.5 leading-relaxed">{documentFinding.whatDetected}</p>
                      </div>

                      <div>
                        <div className="font-semibold text-slate-800 text-[11px] uppercase tracking-wide">WHY was it flagged?</div>
                        <p className="text-slate-700 mt-0.5 leading-relaxed">{documentFinding.whyDetected}</p>
                      </div>

                      <div className="p-3 bg-white rounded-lg border border-rose-200 font-mono text-[11px]">
                        <div className="font-bold text-slate-800 uppercase mb-1">Evidence Discrepancy:</div>
                        <pre className="text-rose-900 whitespace-pre-wrap">{documentFinding.evidenceText}</pre>
                      </div>

                      <div>
                        <div className="font-semibold text-slate-800 text-[11px] uppercase tracking-wide">Recommended Officer Action:</div>
                        <p className="text-slate-700 mt-0.5 leading-relaxed">{documentFinding.recommendedAction}</p>
                      </div>

                      {documentFinding.status === 'RESOLVED' && (
                        <div className="bg-emerald-50 border border-emerald-300 p-2.5 rounded-lg text-emerald-900">
                          <div className="font-bold">✓ Finding Resolved by Officer</div>
                          <div className="text-[11px] mt-0.5">{documentFinding.officerObservation}</div>
                          <div className="text-[10px] text-emerald-700 mt-1 font-mono">
                            Resolved by {documentFinding.resolvedBy} on {new Date(documentFinding.resolvedAt || '').toLocaleString()}
                          </div>
                        </div>
                      )}

                      {documentFinding.status === 'OVERRIDDEN' && (
                        <div className="bg-blue-50 border border-blue-300 p-2.5 rounded-lg text-blue-900">
                          <div className="font-bold">Officer Disagreement / Override Recorded</div>
                          <div className="text-[11px] mt-0.5">{documentFinding.officerObservation}</div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="border border-emerald-200 bg-emerald-50/30 rounded-xl p-4 text-emerald-900 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>No Discrepancies or Irregularities Detected</span>
                      </div>
                      <p className="text-slate-600 text-xs">
                        All preliminary automated checks for date validity, institution identifiers, non-judicial stamp compliance, and Council clauses completed without anomalies.
                      </p>
                    </div>
                  )}

                  {/* Simulated External Authority Verification */}
                  {document.verificationRecord && (
                    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-slate-800">External Authority Verification</span>
                        <ExternalVerificationBadge status={document.verificationRecord.status} />
                      </div>
                      <div className="text-[11px] text-slate-500 space-y-1">
                        <div>Source: <strong className="text-slate-700">{document.verificationRecord.source}</strong></div>
                        <div className="font-mono">Ref No: {document.verificationRecord.referenceNumber}</div>
                        <div className="text-slate-600 mt-1">{document.verificationRecord.notes}</div>
                      </div>
                      <div className="mt-2 text-[10px] text-amber-700 font-medium">
                        * DEMO / SIMULATED VERIFICATION — Demonstrates integration-ready authority verification pattern.
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Three-Way Comparison */}
              {activeTab === 'three_way' && (
                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-xs text-slate-600">
                    <strong>Three-Way Regulatory Comparison:</strong> Information is automatically reconciled across (1) Application Portal Form Data, (2) Uploaded Supporting Document, and (3) AICTE Master Database Records.
                  </div>

                  {document.threeWayComparisons && document.threeWayComparisons.length > 0 ? (
                    document.threeWayComparisons.map((item, idx) => (
                      <div 
                        key={idx} 
                        className={`border rounded-xl p-4 space-y-3 ${
                          item.matchStatus === 'MISMATCH' 
                            ? 'border-rose-300 bg-rose-50/20' 
                            : 'border-slate-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-slate-900 text-xs">{item.attributeName}</h5>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                            item.matchStatus === 'MISMATCH'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}>
                            {item.matchStatus}
                          </span>
                        </div>

                        {/* Comparison 3-Grid */}
                        <div className="grid grid-cols-3 gap-2 text-[11px]">
                          <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                            <div className="text-[10px] font-bold uppercase text-slate-500">Source 1: Form Data</div>
                            <div className="font-mono font-bold text-slate-900 mt-1">{item.applicationValue}</div>
                          </div>

                          <div className={`p-2.5 rounded border ${
                            item.matchStatus === 'MISMATCH'
                              ? 'bg-rose-50 border-rose-200 text-rose-950 font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-900'
                          }`}>
                            <div className="text-[10px] font-bold uppercase text-slate-500">Source 2: Document</div>
                            <div className="font-mono mt-1">{item.documentValue}</div>
                          </div>

                          <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                            <div className="text-[10px] font-bold uppercase text-slate-500">Source 3: AICTE Master</div>
                            <div className="font-mono font-bold text-slate-900 mt-1">{item.institutionalRecordValue}</div>
                          </div>
                        </div>

                        <div className="text-[11px] text-slate-500 flex items-center justify-between">
                          <span>Evidence Location: <strong className="text-slate-700">{item.evidenceLocation}</strong></span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-slate-500 border border-slate-200 rounded-xl">
                      No multi-source cross-checks mapped for this document type.
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Extracted Fields Table */}
              {activeTab === 'extracted_fields' && (
                <div className="space-y-3">
                  <div className="text-[11px] text-slate-500">
                    Values extracted via deterministic parsing & OCR. "Unable to verify" status is safely assigned when confidence drops below threshold.
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
                        <tr>
                          <th className="p-2.5">Field Name</th>
                          <th className="p-2.5">Extracted Value</th>
                          <th className="p-2.5">Page</th>
                          <th className="p-2.5">Confidence</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {document.extractedFields.map((field) => (
                          <tr key={field.id} className="hover:bg-slate-50/60">
                            <td className="p-2.5 font-medium text-slate-800">{field.fieldName}</td>
                            <td className="p-2.5 font-mono text-slate-900 font-semibold">{field.fieldValue}</td>
                            <td className="p-2.5 font-mono text-slate-500">P.{field.sourcePage}</td>
                            <td className="p-2.5 font-mono">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                                field.confidence >= 90
                                  ? 'bg-emerald-50 text-emerald-800'
                                  : 'bg-amber-50 text-amber-800'
                              }`}>
                                {field.confidence}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 4: Officer Action & Override */}
              {activeTab === 'officer_action' && (
                <div className="space-y-4">
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                    <h5 className="font-bold text-slate-900 text-xs mb-1">Record Human Officer Observation</h5>
                    <p className="text-[11px] text-slate-500 mb-3">
                      Add official scrutiny observations or resolve AI preliminary findings with human judgement.
                    </p>

                    <textarea
                      rows={3}
                      value={officerNote}
                      onChange={(e) => setOfficerNote(e.target.value)}
                      placeholder="Enter officer scrutiny observation (e.g., 'Inspected geotagged video walkthrough; confirmed 60 computer workstations operational')..."
                      className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
                    />

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={handleAddNote}
                        disabled={!officerNote.trim()}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50 transition-colors"
                      >
                        Add Observation
                      </button>

                      {documentFinding && documentFinding.status === 'ACTIVE' && (
                        <button
                          onClick={() => handleResolve()}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
                        >
                          Mark Finding Resolved
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Officer Disagreement / Override Section */}
                  {documentFinding && (
                    <div className="border border-amber-200 bg-amber-50/30 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-bold text-amber-950 text-xs">Officer Override Protocol</h5>
                          <p className="text-[11px] text-amber-800">
                            Disagree with automated AI preliminary check. Preserves original AI finding in audit trail.
                          </p>
                        </div>
                        <button
                          onClick={() => setShowOverrideForm(!showOverrideForm)}
                          className="px-2.5 py-1 text-xs font-medium border border-amber-400 rounded-lg text-amber-900 hover:bg-amber-100"
                        >
                          {showOverrideForm ? 'Cancel' : 'Officer Disagree / Override'}
                        </button>
                      </div>

                      {showOverrideForm && (
                        <div className="mt-3 space-y-3 pt-3 border-t border-amber-200">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Officer Conclusion:
                            </label>
                            <input
                              type="text"
                              value={overrideConclusion}
                              onChange={(e) => setOverrideConclusion(e.target.value)}
                              placeholder="e.g., Intake mismatch not confirmed; expansion approved under Special Council Order"
                              className="w-full p-2 text-xs rounded border border-slate-300 bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Justification / Regulatory Basis:
                            </label>
                            <textarea
                              rows={2}
                              value={overrideReason}
                              onChange={(e) => setOverrideReason(e.target.value)}
                              placeholder="State specific documentary justification for disagreeing with automated preliminary finding..."
                              className="w-full p-2 text-xs rounded border border-slate-300 bg-white"
                            />
                          </div>

                          <button
                            onClick={handleOverride}
                            disabled={!overrideConclusion.trim() || !overrideReason.trim()}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-700 text-white hover:bg-amber-800 disabled:opacity-50"
                          >
                            Record Official Override
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Bottom Actions Footer */}
            <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs shrink-0">
              <span className="text-[11px] text-slate-500 font-mono">
                Dossier Item: {document.name}
              </span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 font-semibold text-xs rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                Done Reviewing Document
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
