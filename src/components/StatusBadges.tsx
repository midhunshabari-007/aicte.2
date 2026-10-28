import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  HelpCircle,
  Clock,
  Check,
  X
} from 'lucide-react';
import { 
  DocumentAiStatus, 
  ApplicationOverallStatus, 
  ReviewPriority,
  ExternalVerificationStatus 
} from '../types/scrutiny';

export const DocumentStatusBadge: React.FC<{ status: DocumentAiStatus; size?: 'sm' | 'md' }> = ({ 
  status, 
  size = 'md' 
}) => {
  const isSm = size === 'sm';
  const padding = isSm ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  switch (status) {
    case 'NO_ISSUE_DETECTED':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/80 ${padding}`}>
          <CheckCircle2 className={`${isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-emerald-600 shrink-0`} />
          <span className="font-semibold">No issue detected</span>
        </span>
      );
    case 'MANUAL_VERIFICATION_REQUIRED':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-amber-50 text-amber-800 border border-amber-200/80 ${padding}`}>
          <AlertTriangle className={`${isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-amber-600 shrink-0`} />
          <span className="font-semibold">Manual verification required</span>
        </span>
      );
    case 'POTENTIAL_ISSUE_DETECTED':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-rose-50 text-rose-800 border border-rose-200/80 ${padding}`}>
          <AlertCircle className={`${isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-rose-600 shrink-0`} />
          <span className="font-semibold">Potential issue detected</span>
        </span>
      );
    case 'UNABLE_TO_VERIFY':
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-slate-100 text-slate-700 border border-slate-300 ${padding}`}>
          <HelpCircle className={`${isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-slate-500 shrink-0`} />
          <span className="font-semibold">Unable to verify</span>
        </span>
      );
  }
};

export const ApplicationStatusBadge: React.FC<{ status: ApplicationOverallStatus }> = ({ status }) => {
  switch (status) {
    case 'REVIEW_REQUIRED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-amber-50 text-amber-900 border border-amber-300">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>Review Required</span>
        </span>
      );
    case 'MANUAL_VERIFICATION_REQUIRED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-orange-50 text-orange-900 border border-orange-300">
          <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
          <span>Manual Verification Required</span>
        </span>
      );
    case 'PRELIMINARY_CHECK_COMPLETED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-900 border border-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Preliminary Check Completed</span>
        </span>
      );
    case 'PROCESSING':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-50 text-blue-900 border border-blue-300">
          <Clock className="w-3.5 h-3.5 text-blue-600 animate-spin" />
          <span>Processing</span>
        </span>
      );
    case 'PROCESSING_FAILED':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-rose-50 text-rose-900 border border-rose-300">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>Processing Failed</span>
        </span>
      );
  }
};

export const PriorityChip: React.FC<{ priority: ReviewPriority }> = ({ priority }) => {
  switch (priority) {
    case 'HIGH':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase bg-rose-100 text-rose-800 border border-rose-200">
          High Priority
        </span>
      );
    case 'MEDIUM':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase bg-amber-100 text-amber-800 border border-amber-200">
          Medium Priority
        </span>
      );
    case 'LOW':
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase bg-slate-100 text-slate-700 border border-slate-200">
          Low Priority
        </span>
      );
  }
};

export const ExternalVerificationBadge: React.FC<{ status: ExternalVerificationStatus }> = ({ status }) => {
  switch (status) {
    case 'MATCH':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
          <Check className="w-3.5 h-3.5" />
          <span>Match</span>
        </span>
      );
    case 'MISMATCH':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700">
          <X className="w-3.5 h-3.5" />
          <span>Mismatch</span>
        </span>
      );
    case 'PENDING':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700">
          <Clock className="w-3.5 h-3.5" />
          <span>Pending</span>
        </span>
      );
    case 'UNABLE_TO_VERIFY':
    default:
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Unable to verify</span>
        </span>
      );
  }
};
