export type DocumentAiStatus = 
  | 'NO_ISSUE_DETECTED'
  | 'MANUAL_VERIFICATION_REQUIRED'
  | 'POTENTIAL_ISSUE_DETECTED'
  | 'UNABLE_TO_VERIFY';

export type ExternalVerificationStatus = 
  | 'MATCH'
  | 'MISMATCH'
  | 'UNABLE_TO_VERIFY'
  | 'PENDING';

export type ApplicationOverallStatus = 
  | 'REVIEW_REQUIRED'
  | 'PRELIMINARY_CHECK_COMPLETED'
  | 'MANUAL_VERIFICATION_REQUIRED'
  | 'PROCESSING'
  | 'PROCESSING_FAILED';

export type ReviewPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export type OfficialDecisionType = 
  | 'PENDING'
  | 'APPROVED'
  | 'APPROVED_WITH_REDUCED_INTAKE'
  | 'DEFICIENCIES_COMMUNICATED'
  | 'REJECTED';

export interface ExtractedField {
  id: string;
  fieldName: string;
  fieldValue: string;
  sourcePage: number;
  confidence: number;
  evidenceSnippet: string;
  status: 'EXTRACTED' | 'UNABLE_TO_VERIFY' | 'INCONSISTENT';
}

export interface VerificationRecord {
  source: string;
  status: ExternalVerificationStatus;
  referenceNumber: string;
  timestamp: string;
  notes: string;
  isSimulated: boolean;
}

export interface ThreeWayComparisonItem {
  attributeName: string;
  applicationValue: string;
  documentValue: string;
  institutionalRecordValue: string;
  matchStatus: 'MATCH' | 'MISMATCH' | 'NOT_APPLICABLE';
  evidenceLocation: string;
  notes?: string;
}

export interface VideoProofMetadata {
  videoUrl?: string;
  fileName: string;
  duration: string;
  fps: number;
  gpsCoordinates: string;
  recordedDate: string;
  detectedEquipment: string[];
  workstationsCount: number;
  aiVerificationStatus: 'VERIFIED_GEO_TAGGED' | 'INSPECTION_PENDING' | 'REJECTED';
  frameHighlights: {
    timestamp: string;
    label: string;
    confidence: number;
    detectedObject: string;
  }[];
}

export interface DocumentItem {
  id: string;
  applicationId: string;
  name: string;
  docType: string;
  fileSize: string;
  uploadedAt: string;
  pageCount: number;
  processingStatus: 'COMPLETED' | 'PROCESSING' | 'FAILED';
  aiStatus: DocumentAiStatus;
  confidenceScore: number;
  extractedFields: ExtractedField[];
  verificationRecord?: VerificationRecord;
  threeWayComparisons?: ThreeWayComparisonItem[];
  anomalyIndicators?: string[];
  videoProof?: VideoProofMetadata;
  documentContent: {
    issuingAuthority: string;
    documentNumber: string;
    issueDate: string;
    expiryDate?: string;
    sections: {
      heading: string;
      body: string;
      highlighted?: boolean;
    }[];
    tableData?: {
      headers: string[];
      rows: string[][];
    };
  };
}

export interface Finding {
  id: string;
  applicationId: string;
  documentId?: string;
  documentName?: string;
  findingType: string;
  title: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  whatDetected: string;
  whyDetected: string;
  evidenceText: string;
  sourcesCompared: {
    source: string;
    value: string;
    reference: string;
  }[];
  recommendedAction: string;
  aiConfidence: number;
  status: 'ACTIVE' | 'RESOLVED' | 'OVERRIDDEN';
  officerObservation?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface ChecklistRule {
  id: string;
  applicationId?: string;
  ruleCode: string;
  category: 'Statutory & Land' | 'Infrastructure' | 'Academic & Intake' | 'Faculty & Cadre' | 'Regulatory Clearances';
  requirementName: string;
  statutoryClause: string;
  evaluationStatus: 'COMPLIANT' | 'POTENTIAL_DEFICIENCY' | 'MANUAL_VERIFICATION_PENDING';
  evidenceSummary: string;
  mappedDocumentId?: string;
}

export interface InstitutionMasterRecord {
  permanentId: string;
  institutionName: string;
  region: string;
  state: string;
  establishmentYear: number;
  previousApprovalStatus: string;
  approvedProgrammes: string[];
  sanctionedIntake: number;
  landAreaAcres: number;
  builtUpAreaSqMtr: number;
  deficiencyHistory: string;
  terPaymentStatus: string;
  lastScrutinyDate: string;
}

export interface AuditEvent {
  id: string;
  applicationId: string;
  timestamp: string;
  eventType: string;
  actor: string;
  action: string;
  result: string;
  evidenceRef?: string;
}

export interface Application {
  id: string;
  institutionId: string;
  institutionName: string;
  region: string;
  applicationCategory: string;
  academicYear: string;
  submittedAt: string;
  requestedIntake: number;
  totalFaculty: number;
  totalLandAcres: number;
  overallStatus: ApplicationOverallStatus;
  reviewPriority: ReviewPriority;
  documentCount: number;
  noIssueCount: number;
  manualVerificationCount: number;
  potentialIssueCount: number;
  officialDecision: OfficialDecisionType;
  officialDecisionNotes?: string;
  decidedAt?: string;
  decidedBy?: string;
  generatedOrderNumber?: string;
}
