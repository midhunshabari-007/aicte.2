import React, { useState } from 'react';
import { 
  Application, 
  DocumentItem, 
  Finding, 
  ChecklistRule, 
  AuditEvent, 
  InstitutionMasterRecord, 
  OfficialDecisionType 
} from '../types/scrutiny';
import { 
  ApplicationStatusBadge, 
  PriorityChip 
} from './StatusBadges';
import { DocumentsTab } from './tabs/DocumentsTab';
import { FindingsTab } from './tabs/FindingsTab';
import { ChecklistTab } from './tabs/ChecklistTab';
import { AuditTrailTab } from './tabs/AuditTrailTab';
import { InstitutionRecordsTab } from './tabs/InstitutionRecordsTab';
import { ManualVerificationQueue } from './ManualVerificationQueue';
import { DocumentViewerModal } from './DocumentViewerModal';
import { FinalReviewModal } from './FinalReviewModal';
import { 
  ArrowLeft, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  ShieldCheck, 
  FileText, 
  Layers, 
  History, 
  BookOpen, 
  Stamp,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface ApplicationDetailViewProps {
  application: Application;
  documents: DocumentItem[];
  findings: Finding[];
  checklist: ChecklistRule[];
  auditTrail: AuditEvent[];
  institution?: InstitutionMasterRecord;
  onBack: () => void;
  onAddObservation: (findingId: string, observation: string) => void;
  onResolveFinding: (findingId: string, notes: string) => void;
  onOverrideFinding: (findingId: string, conclusion: string, reason: string) => void;
  onRecordDecision: (
    decision: OfficialDecisionType, 
    notes: string, 
    officerName: string, 
    designation: string
  ) => void;
}

export const ApplicationDetailView: React.FC<ApplicationDetailViewProps> = ({
  application,
  documents,
  findings,
  checklist,
  auditTrail,
  institution,
  onBack,
  onAddObservation,
  onResolveFinding,
  onOverrideFinding,
  onRecordDecision
}) => {
  const [activeTab, setActiveTab] = useState<'documents' | 'findings' | 'checklist' | 'audit' | 'institution' | 'queue'>('documents');
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [showFinalReview, setShowFinalReview] = useState(false);

  const activeFindings = findings.filter(f => f.status === 'ACTIVE');
  const itemsNeedingAttention = documents.filter(
    d => d.aiStatus === 'POTENTIAL_ISSUE_DETECTED' || d.aiStatus === 'MANUAL_VERIFICATION_REQUIRED'
  );

  return (
    <div className="space-y-6">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Applications Queue</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFinalReview(true)}
            className="px-4 py-1.5 text-xs font-bold rounded-lg bg-slate-900 text-amber-400 hover:bg-slate-800 transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Stamp className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {application.officialDecision === 'PENDING' ? 'Record Regulatory Decision' : 'View Official Decision Order'}
            </span>
          </button>
        </div>
      </div>

      {/* Dossier Institutional Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {application.id}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-medium">Category: {application.applicationCategory}</span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-mono">Academic Session {application.academicYear}</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 mt-1">
              {application.institutionName}
            </h2>

            <div className="text-xs text-slate-500 flex items-center gap-3 mt-1">
              <span className="font-mono text-slate-700 font-semibold">{application.institutionId}</span>
              <span>·</span>
              <span>{application.region}</span>
              <span>·</span>
              <span>Submitted: {new Date(application.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400">Preliminary Status</div>
              <div className="mt-0.5">
                <ApplicationStatusBadge status={application.overallStatus} />
              </div>
            </div>

            <div className="text-right pl-3 border-l border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-400">Review Priority</div>
              <div className="mt-0.5">
                <PriorityChip priority={application.reviewPriority} />
              </div>
            </div>
          </div>
        </div>

        {/* 12-Document Status Progress Strip */}
        <div className="mt-4 pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-700">12 Documents Intake Status:</span>
            <div className="flex items-center gap-2 font-mono">
              <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold text-[11px]">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>{application.noIssueCount} No issue detected</span>
              </span>
              <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold text-[11px]">
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                <span>{application.manualVerificationCount} Manual verification</span>
              </span>
              <span className="inline-flex items-center gap-1 text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-semibold text-[11px]">
                <AlertCircle className="w-3 h-3 text-rose-600" />
                <span>{application.potentialIssueCount} Potential issue</span>
              </span>
            </div>
          </div>

          {application.officialDecision !== 'PENDING' && (
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-lg border border-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Official Decision: {application.officialDecision}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('documents')}
          className={`px-4 py-3 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'documents'
              ? 'border-amber-600 text-amber-900 bg-white rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Documents ({documents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('findings')}
          className={`px-4 py-3 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'findings'
              ? 'border-amber-600 text-amber-900 bg-white rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>AI Findings ({activeFindings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('queue')}
          className={`px-4 py-3 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'queue'
              ? 'border-amber-600 text-amber-900 bg-white rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Manual Verification Queue ({itemsNeedingAttention.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('checklist')}
          className={`px-4 py-3 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'checklist'
              ? 'border-amber-600 text-amber-900 bg-white rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Regulatory Checklist ({checklist.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-3 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'audit'
              ? 'border-amber-600 text-amber-900 bg-white rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Audit Trail ({auditTrail.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('institution')}
          className={`px-4 py-3 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'institution'
              ? 'border-amber-600 text-amber-900 bg-white rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Institutional Master Records</span>
        </button>
      </div>

      {/* Active Tab View */}
      <div>
        {activeTab === 'documents' && (
          <DocumentsTab 
            documents={documents} 
            onOpenDocument={(doc) => setSelectedDocument(doc)} 
          />
        )}

        {activeTab === 'findings' && (
          <FindingsTab 
            findings={findings}
            onOpenDocumentById={(docId) => {
              const doc = documents.find(d => d.id === docId);
              if (doc) setSelectedDocument(doc);
            }}
            onResolveFinding={onResolveFinding}
            onOverrideFinding={onOverrideFinding}
          />
        )}

        {activeTab === 'queue' && (
          <ManualVerificationQueue
            documents={documents}
            findings={findings}
            onOpenDocument={(doc) => setSelectedDocument(doc)}
          />
        )}

        {activeTab === 'checklist' && (
          <ChecklistTab
            checklist={checklist}
            onOpenDocumentById={(docId) => {
              const doc = documents.find(d => d.id === docId);
              if (doc) setSelectedDocument(doc);
            }}
          />
        )}

        {activeTab === 'audit' && (
          <AuditTrailTab auditEvents={auditTrail} />
        )}

        {activeTab === 'institution' && (
          <InstitutionRecordsTab institution={institution} />
        )}
      </div>

      {/* Document Split Viewer Modal */}
      {selectedDocument && (
        <DocumentViewerModal
          document={selectedDocument}
          findings={findings}
          institutionRecord={institution}
          onClose={() => setSelectedDocument(null)}
          onAddObservation={onAddObservation}
          onResolveFinding={onResolveFinding}
          onOverrideFinding={onOverrideFinding}
        />
      )}

      {/* Final Review & Official Decision Modal */}
      {showFinalReview && (
        <FinalReviewModal
          application={application}
          documents={documents}
          findings={findings}
          checklist={checklist}
          onClose={() => setShowFinalReview(false)}
          onRecordDecision={onRecordDecision}
        />
      )}
    </div>
  );
};
