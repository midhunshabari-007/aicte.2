import React, { useState } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Compass, 
  CheckCircle2, 
  ArrowRight,
  Shield,
  FileText,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

interface WalkthroughModalProps {
  onClose: () => void;
  onNavigateToPortal: () => void;
  onNavigateToOfficerConsole: (appId?: string) => void;
}

export const WalkthroughModal: React.FC<WalkthroughModalProps> = ({
  onClose,
  onNavigateToPortal,
  onNavigateToOfficerConsole
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    {
      title: '01. Purpose & Core Principle',
      tag: 'Architecture Principle',
      desc: 'AICTE officers evaluate hundreds of technical institution applications and complex supporting documents manually. Our AI scrutiny layer performs preliminary repetitive cross-checking and produces evidence-linked findings before the officer reviews the case. Crucially: AI provides decision support; only the Authorized AICTE Officer holds legal regulatory decision authority.',
      actionText: 'View Architecture',
      onAction: () => onNavigateToOfficerConsole('AICTE-EOA-2026-8812')
    },
    {
      title: '02. Simulated AICTE Portal Submission',
      tag: 'Demo Simulator',
      desc: 'The real AICTE portal has proprietary authentication and internal databases. Our demo includes a Simulated AICTE Portal where you can select an institution (Apex Institute of Technology & Engineering), choose Extension of Approval (EoA), enter 120 seats intake, and submit the pre-packaged 12-document dossier.',
      actionText: 'Open Simulated Portal',
      onAction: () => {
        onNavigateToPortal();
        onClose();
      }
    },
    {
      title: '03. Automated Ingestion & Processing Pipeline',
      tag: 'Scrutiny Engine',
      desc: 'Upon submission via POST /api/applications/intake, the scrutiny pipeline validates digital PDFs, extracts text streams, classifies document types, extracts structured metadata fields, probes simulated issuing authorities (Fire, Land, Municipal, NBA), and executes multi-source comparisons.',
      actionText: 'Go to Officer Console',
      onAction: () => {
        onNavigateToOfficerConsole('AICTE-EOA-2026-8812');
        onClose();
      }
    },
    {
      title: '04. The 12-Document Regulatory Breakdown',
      tag: 'Scrutiny Breakdown',
      desc: 'Examine application AICTE-EOA-2026-8812. The automated pipeline categorizes the 12 submitted documents with precision: 8 documents have "🟢 No issue detected", 3 documents have "🟡 Manual verification required" (e.g. NBA gateway timeout, lab geotag absence, stamp ink blurring), and 1 document has "🔴 Potential issue detected".',
      actionText: 'Open Apex Institute Dossier',
      onAction: () => {
        onNavigateToOfficerConsole('AICTE-EOA-2026-8812');
        onClose();
      }
    },
    {
      title: '05. The Core Feature: Three-Way Intake Mismatch',
      tag: 'Three-Way Cross Check',
      desc: 'Open Programme_Course_Intake_Proposal_2026.pdf in the Split Viewer. Notice the Three-Way Comparison matrix: Application Form requests 120 seats, Submitted Programme Document specifies 60 seats, and the AICTE Master Archive confirms 60 seats. The AI flags this discrepancy with explicit page and clause references.',
      actionText: 'Inspect in Split Viewer',
      onAction: () => {
        onNavigateToOfficerConsole('AICTE-EOA-2026-8812');
        onClose();
      }
    },
    {
      title: '06. Human Verification, Override & Official Decision',
      tag: 'Regulatory Decision',
      desc: 'The officer can record an official observation, mark the finding resolved, or record an official override. Finally, open "Record Regulatory Decision" to issue the official Council order (e.g., granting approval restricted to 60 seats, fixing the discrepancy). The complete immutable audit trail records every step.',
      actionText: 'Explore Complete Dossier',
      onAction: () => {
        onNavigateToOfficerConsole('AICTE-EOA-2026-8812');
        onClose();
      }
    }
  ];

  const currentStep = steps[currentStepIndex];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-300 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">
              End-to-End Master Demonstration Guide
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {currentStep.tag}
            </span>
            <span className="font-mono text-slate-400">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
          </div>

          <h4 className="text-base font-bold text-slate-900">
            {currentStep.title}
          </h4>

          <p className="text-xs text-slate-700 leading-relaxed font-serif bg-slate-50 p-4 rounded-xl border border-slate-200">
            {currentStep.desc}
          </p>

          <div className="pt-2 flex items-center justify-between border-t border-slate-200">
            <div className="flex items-center gap-2">
              <button
                disabled={currentStepIndex === 0}
                onClick={() => setCurrentStepIndex(i => i - 1)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                disabled={currentStepIndex === steps.length - 1}
                onClick={() => setCurrentStepIndex(i => i + 1)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={currentStep.onAction}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-slate-900 text-amber-400 hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>{currentStep.actionText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
