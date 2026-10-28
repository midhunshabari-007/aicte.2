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
  INITIAL_APPLICATIONS, 
  INITIAL_DOCUMENTS, 
  INITIAL_FINDINGS, 
  INITIAL_CHECKLIST_RULES, 
  INITIAL_AUDIT_TRAIL, 
  SEED_INSTITUTION_RECORDS 
} from '../data/seedData';
import { supabase } from '../lib/supabase';

const STORAGE_KEYS = {
  APPLICATIONS: 'aicte_scrutiny_applications',
  DOCUMENTS: 'aicte_scrutiny_documents',
  FINDINGS: 'aicte_scrutiny_findings',
  CHECKLIST: 'aicte_scrutiny_checklist',
  AUDIT: 'aicte_scrutiny_audit',
  INSTITUTIONS: 'aicte_scrutiny_institutions'
};

class ScrutinyDataStore {
  private applications: Application[];
  private documents: Record<string, DocumentItem[]>;
  private findings: Record<string, Finding[]>;
  private checklist: Record<string, ChecklistRule[]>;
  private auditTrail: Record<string, AuditEvent[]>;
  private institutions: Record<string, InstitutionMasterRecord>;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.applications = this.loadFromStorage(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    this.documents = this.loadFromStorage(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
    this.findings = this.loadFromStorage(STORAGE_KEYS.FINDINGS, INITIAL_FINDINGS);
    this.checklist = this.loadFromStorage(STORAGE_KEYS.CHECKLIST, INITIAL_CHECKLIST_RULES);
    this.auditTrail = this.loadFromStorage(STORAGE_KEYS.AUDIT, INITIAL_AUDIT_TRAIL);
    this.institutions = this.loadFromStorage(STORAGE_KEYS.INSTITUTIONS, SEED_INSTITUTION_RECORDS);
    this.syncFromSupabase();
  }

  private async syncFromSupabase() {
    try {
      // 1. Fetch applications
      const { data: appData, error: appError } = await supabase.from('applications').select('*');
      if (!appError && appData && appData.length > 0) {
        const mapped: Application[] = appData.map((row: any) => ({
          id: row.id,
          institutionId: row.institution_id,
          institutionName: row.institution_name,
          region: row.region,
          applicationCategory: row.application_category,
          academicYear: row.academic_year,
          submittedAt: row.submitted_at,
          requestedIntake: row.requested_intake,
          totalFaculty: row.total_faculty,
          totalLandAcres: row.total_land_acres,
          overallStatus: row.overall_status,
          reviewPriority: row.review_priority,
          documentCount: row.document_count,
          noIssueCount: row.no_issue_count,
          manualVerificationCount: row.manual_verification_count,
          potentialIssueCount: row.potential_issue_count,
          officialDecision: row.official_decision,
          officialDecisionNotes: row.official_decision_notes,
          decidedAt: row.decided_at,
          decidedBy: row.decided_by,
          generatedOrderNumber: row.generated_order_number
        }));

        const appMap = new Map(this.applications.map(a => [a.id, a]));
        mapped.forEach(a => appMap.set(a.id, a));
        this.applications = Array.from(appMap.values());
      }

      // 2. Fetch documents
      const { data: docData, error: docError } = await supabase.from('documents').select('*');
      if (!docError && docData && docData.length > 0) {
        docData.forEach((row: any) => {
          const docItem: DocumentItem = {
            id: row.id,
            applicationId: row.application_id,
            name: row.name,
            docType: row.doc_type,
            fileSize: row.file_size,
            uploadedAt: row.uploaded_at,
            pageCount: row.page_count,
            processingStatus: row.processing_status,
            aiStatus: row.ai_status,
            confidenceScore: row.confidence_score,
            extractedFields: row.extracted_fields || [],
            verificationRecord: row.verification_record,
            threeWayComparisons: row.three_way_comparisons || [],
            anomalyIndicators: row.anomaly_indicators || [],
            videoProof: row.document_content?.videoProof,
            documentContent: row.document_content
          };
          if (!this.documents[row.application_id]) {
            this.documents[row.application_id] = [];
          }
          const existingIdx = this.documents[row.application_id].findIndex(d => d.id === docItem.id);
          if (existingIdx >= 0) {
            this.documents[row.application_id][existingIdx] = docItem;
          } else {
            this.documents[row.application_id].push(docItem);
          }
        });
      }

      // 3. Fetch findings
      const { data: findData, error: findError } = await supabase.from('findings').select('*');
      if (!findError && findData && findData.length > 0) {
        findData.forEach((row: any) => {
          const finding: Finding = {
            id: row.id,
            applicationId: row.application_id,
            documentId: row.document_id || undefined,
            documentName: row.document_name || undefined,
            findingType: row.finding_type,
            title: row.title,
            severity: row.severity,
            whatDetected: row.what_detected,
            whyDetected: row.why_detected,
            evidenceText: row.evidence_text,
            sourcesCompared: row.sources_compared || [],
            recommendedAction: row.recommended_action,
            aiConfidence: row.ai_confidence,
            status: row.status,
            officerObservation: row.officer_observation || undefined,
            resolvedAt: row.resolved_at || undefined,
            resolvedBy: row.resolved_by || undefined
          };
          if (!this.findings[row.application_id]) {
            this.findings[row.application_id] = [];
          }
          const existingIdx = this.findings[row.application_id].findIndex(f => f.id === finding.id);
          if (existingIdx >= 0) {
            this.findings[row.application_id][existingIdx] = finding;
          } else {
            this.findings[row.application_id].push(finding);
          }
        });
      }

      // 4. Fetch checklist rules
      const { data: chkData, error: chkError } = await supabase.from('checklist_rules').select('*');
      if (!chkError && chkData && chkData.length > 0) {
        chkData.forEach((row: any) => {
          const rule: ChecklistRule = {
            id: row.id,
            applicationId: row.application_id,
            ruleCode: row.rule_code,
            category: row.category,
            requirementName: row.requirement_name,
            statutoryClause: row.statutory_clause,
            evaluationStatus: row.evaluation_status,
            evidenceSummary: row.evidence_summary,
            mappedDocumentId: row.mapped_document_id || undefined
          };
          if (!this.checklist[row.application_id]) {
            this.checklist[row.application_id] = [];
          }
          const existingIdx = this.checklist[row.application_id].findIndex(c => c.id === rule.id);
          if (existingIdx >= 0) {
            this.checklist[row.application_id][existingIdx] = rule;
          } else {
            this.checklist[row.application_id].push(rule);
          }
        });
      }

      // 5. Fetch audit events
      const { data: auditData, error: auditError } = await supabase
        .from('audit_events')
        .select('*')
        .order('timestamp', { ascending: true });
      if (!auditError && auditData && auditData.length > 0) {
        auditData.forEach((row: any) => {
          const event: AuditEvent = {
            id: row.id,
            applicationId: row.application_id,
            timestamp: row.timestamp,
            eventType: row.event_type,
            actor: row.actor,
            action: row.action,
            result: row.result,
            evidenceRef: row.evidence_ref || undefined
          };
          if (!this.auditTrail[row.application_id]) {
            this.auditTrail[row.application_id] = [];
          }
          const existingIdx = this.auditTrail[row.application_id].findIndex(a => a.id === event.id);
          if (existingIdx >= 0) {
            this.auditTrail[row.application_id][existingIdx] = event;
          } else {
            this.auditTrail[row.application_id].push(event);
          }
        });
      }

      // 6. Fetch institutions
      const { data: instData, error: instError } = await supabase.from('institutions').select('*');
      if (!instError && instData && instData.length > 0) {
        instData.forEach((row: any) => {
          this.institutions[row.permanent_id] = {
            permanentId: row.permanent_id.replace('INST-AICTE-', ''),
            institutionName: row.institution_name,
            region: row.region,
            state: row.state,
            establishmentYear: row.establishment_year,
            previousApprovalStatus: row.previous_approval_status,
            approvedProgrammes: row.approved_programmes || [],
            sanctionedIntake: row.sanctioned_intake,
            landAreaAcres: Number(row.land_area_acres),
            builtUpAreaSqMtr: row.built_up_area_sq_mtr,
            deficiencyHistory: row.deficiency_history || '',
            terPaymentStatus: row.ter_payment_status || '',
            lastScrutinyDate: row.last_scrutiny_date || ''
          };
        });
      }

      this.saveToStorage();
      this.notify();
    } catch {
      // Supabase connection or table error fallback
    }
  }

  private loadFromStorage<T>(key: string, defaultValue: T): T {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return defaultValue;
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(this.applications));
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(this.documents));
      localStorage.setItem(STORAGE_KEYS.FINDINGS, JSON.stringify(this.findings));
      localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(this.checklist));
      localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(this.auditTrail));
      localStorage.setItem(STORAGE_KEYS.INSTITUTIONS, JSON.stringify(this.institutions));
    } catch {
      // ignore in constrained contexts
    }
    this.notify();
  }

  public subscribe(fn: () => void) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  public getApplications(): Application[] {
    return [...this.applications];
  }

  public getApplication(id: string): Application | undefined {
    return this.applications.find(a => a.id === id);
  }

  public getDocuments(applicationId: string): DocumentItem[] {
    return this.documents[applicationId] || [];
  }

  public getDocument(id: string): DocumentItem | undefined {
    for (const docList of Object.values(this.documents)) {
      const match = docList.find(d => d.id === id);
      if (match) return match;
    }
    return undefined;
  }

  public getFindings(applicationId: string): Finding[] {
    return this.findings[applicationId] || [];
  }

  public getChecklist(applicationId: string): ChecklistRule[] {
    return this.checklist[applicationId] || [];
  }

  public getAuditTrail(applicationId: string): AuditEvent[] {
    return this.auditTrail[applicationId] || [];
  }

  public getInstitution(permanentId: string): InstitutionMasterRecord | undefined {
    return Object.values(this.institutions).find(
      i => i.permanentId === permanentId || i.permanentId === permanentId.replace('INST-AICTE-', '')
    );
  }

  public getInstitutionsList(): InstitutionMasterRecord[] {
    return Object.values(this.institutions);
  }

  public addAuditEvent(applicationId: string, event: Omit<AuditEvent, 'id' | 'timestamp' | 'applicationId'>) {
    if (!this.auditTrail[applicationId]) {
      this.auditTrail[applicationId] = [];
    }
    const newEvent: AuditEvent = {
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      applicationId,
      timestamp: new Date().toISOString(),
      ...event
    };
    this.auditTrail[applicationId].push(newEvent);
    this.saveToStorage();

    // Async push to Supabase
    (async () => {
      try {
        await supabase.from('audit_events').insert([{
          id: newEvent.id,
          application_id: newEvent.applicationId,
          timestamp: newEvent.timestamp,
          event_type: newEvent.eventType,
          actor: newEvent.actor,
          action: newEvent.action,
          result: newEvent.result,
          evidence_ref: newEvent.evidenceRef || null
        }]);
      } catch (e) {
        console.warn('Failed to persist audit event to Supabase', e);
      }
    })();

    return newEvent;
  }

  public addOfficerObservation(findingId: string, observation: string, officerName: string = 'Dr. R. K. Sharma') {
    let targetFinding: Finding | undefined;
    let targetAppId: string | undefined;

    for (const [appId, findings] of Object.entries(this.findings)) {
      const match = findings.find(f => f.id === findingId);
      if (match) {
        targetFinding = match;
        targetAppId = appId;
        break;
      }
    }

    if (targetFinding && targetAppId) {
      targetFinding.officerObservation = observation;
      this.addAuditEvent(targetAppId, {
        eventType: 'OFFICER_OBSERVATION_RECORDED',
        actor: `AICTE Authorized Officer (${officerName})`,
        action: `Observation added on finding "${targetFinding.title}"`,
        result: `Observation: "${observation}"`,
        evidenceRef: targetFinding.id
      });
      this.saveToStorage();

      // Async update Supabase
      (async () => {
        try {
          await supabase.from('findings').update({
            officer_observation: observation
          }).eq('id', findingId);
        } catch (e) {
          console.warn('Failed to update finding observation in Supabase', e);
        }
      })();

      return targetFinding;
    }
    return null;
  }

  public resolveFinding(findingId: string, resolutionNotes: string, officerName: string = 'Dr. R. K. Sharma') {
    let targetFinding: Finding | undefined;
    let targetAppId: string | undefined;

    for (const [appId, findings] of Object.entries(this.findings)) {
      const match = findings.find(f => f.id === findingId);
      if (match) {
        targetFinding = match;
        targetAppId = appId;
        break;
      }
    }

    if (targetFinding && targetAppId) {
      targetFinding.status = 'RESOLVED';
      targetFinding.officerObservation = resolutionNotes;
      targetFinding.resolvedAt = new Date().toISOString();
      targetFinding.resolvedBy = officerName;

      let updatedDocId: string | undefined;
      // Update document AI status if resolved
      if (targetFinding.documentId) {
        const docList = this.documents[targetAppId] || [];
        const doc = docList.find(d => d.id === targetFinding?.documentId);
        if (doc && doc.aiStatus === 'POTENTIAL_ISSUE_DETECTED') {
          doc.aiStatus = 'MANUAL_VERIFICATION_REQUIRED'; // Downgraded as officer verified
          updatedDocId = doc.id;
        }
      }

      this.addAuditEvent(targetAppId, {
        eventType: 'FINDING_RESOLVED_BY_OFFICER',
        actor: `AICTE Authorized Officer (${officerName})`,
        action: `Finding resolved: ${targetFinding.title}`,
        result: `Resolution notes: "${resolutionNotes}". AI preliminary finding marked resolved with human audit footprint preserved.`,
        evidenceRef: targetFinding.id
      });

      this.recalculateApplicationStats(targetAppId);
      this.saveToStorage();

      // Async update Supabase
      (async () => {
        try {
          await supabase.from('findings').update({
            status: 'RESOLVED',
            officer_observation: resolutionNotes,
            resolved_at: targetFinding?.resolvedAt,
            resolved_by: officerName
          }).eq('id', findingId);

          if (updatedDocId) {
            await supabase.from('documents').update({
              ai_status: 'MANUAL_VERIFICATION_REQUIRED'
            }).eq('id', updatedDocId);
          }

          const app = this.getApplication(targetAppId!);
          if (app) {
            await supabase.from('applications').update({
              overall_status: app.overallStatus,
              review_priority: app.reviewPriority,
              potential_issue_count: app.potentialIssueCount,
              manual_verification_count: app.manualVerificationCount,
              no_issue_count: app.noIssueCount
            }).eq('id', app.id);
          }
        } catch (e) {
          console.warn('Failed to update finding resolution in Supabase', e);
        }
      })();

      return targetFinding;
    }
    return null;
  }

  public overrideFinding(findingId: string, officerConclusion: string, reason: string, officerName: string = 'Dr. R. K. Sharma') {
    let targetFinding: Finding | undefined;
    let targetAppId: string | undefined;

    for (const [appId, findings] of Object.entries(this.findings)) {
      const match = findings.find(f => f.id === findingId);
      if (match) {
        targetFinding = match;
        targetAppId = appId;
        break;
      }
    }

    if (targetFinding && targetAppId) {
      targetFinding.status = 'OVERRIDDEN';
      targetFinding.officerObservation = `OFFICER OVERRIDE: ${officerConclusion}. Rationale: ${reason}`;
      targetFinding.resolvedAt = new Date().toISOString();
      targetFinding.resolvedBy = officerName;

      this.addAuditEvent(targetAppId, {
        eventType: 'OFFICER_OVERRIDE_RECORDED',
        actor: `AICTE Authorized Officer (${officerName})`,
        action: `Officer disagreed with AI finding: ${targetFinding.title}`,
        result: `Officer Conclusion: "${officerConclusion}". Justification: "${reason}". Original AI finding preserved in audit trail.`,
        evidenceRef: targetFinding.id
      });

      this.recalculateApplicationStats(targetAppId);
      this.saveToStorage();

      // Async update Supabase
      (async () => {
        try {
          await supabase.from('findings').update({
            status: 'OVERRIDDEN',
            officer_observation: targetFinding?.officerObservation,
            resolved_at: targetFinding?.resolvedAt,
            resolved_by: officerName
          }).eq('id', findingId);

          const app = this.getApplication(targetAppId!);
          if (app) {
            await supabase.from('applications').update({
              overall_status: app.overallStatus,
              review_priority: app.reviewPriority,
              potential_issue_count: app.potentialIssueCount,
              manual_verification_count: app.manualVerificationCount,
              no_issue_count: app.noIssueCount
            }).eq('id', app.id);
          }
        } catch (e) {
          console.warn('Failed to update finding override in Supabase', e);
        }
      })();

      return targetFinding;
    }
    return null;
  }

  public recordOfficialDecision(
    applicationId: string, 
    decision: OfficialDecisionType, 
    notes: string, 
    officerName: string = 'Dr. R. K. Sharma', 
    designation: string = 'Senior Scrutiny Officer, Bureau of Approvals'
  ) {
    const app = this.applications.find(a => a.id === applicationId);
    if (!app) return null;

    const orderNumber = `F.No. Western/${app.institutionId.replace('INST-AICTE-', '')}/2026/SCRUTINY-ORDER`;
    app.officialDecision = decision;
    app.officialDecisionNotes = notes;
    app.decidedAt = new Date().toISOString();
    app.decidedBy = `${officerName} (${designation})`;
    app.generatedOrderNumber = orderNumber;
    app.overallStatus = 'PRELIMINARY_CHECK_COMPLETED';

    this.addAuditEvent(applicationId, {
      eventType: 'FINAL_OFFICIAL_DECISION_RECORDED',
      actor: `AICTE Authorized Officer (${officerName})`,
      action: `Final Regulatory Order Issued: ${decision}`,
      result: `Official Decision: ${decision}. Order No: ${orderNumber}. Remarks: "${notes}". Regulatory authority exercised by human officer.`,
      evidenceRef: orderNumber
    });

    this.saveToStorage();

    // Async update Supabase
    (async () => {
      try {
        await supabase.from('applications').update({
          official_decision: app.officialDecision,
          official_decision_notes: app.officialDecisionNotes,
          decided_at: app.decidedAt,
          decided_by: app.decidedBy,
          generated_order_number: app.generatedOrderNumber,
          overall_status: app.overallStatus
        }).eq('id', applicationId);
      } catch (e) {
        console.warn('Failed to update official decision in Supabase', e);
      }
    })();

    return app;
  }

  private recalculateApplicationStats(applicationId: string) {
    const app = this.applications.find(a => a.id === applicationId);
    const docs = this.documents[applicationId] || [];
    const findings = this.findings[applicationId] || [];

    if (app) {
      const activeHighFindings = findings.filter(f => f.status === 'ACTIVE' && f.severity === 'HIGH').length;
      const activeMedFindings = findings.filter(f => f.status === 'ACTIVE' && f.severity === 'MEDIUM').length;

      app.potentialIssueCount = docs.filter(d => d.aiStatus === 'POTENTIAL_ISSUE_DETECTED').length;
      app.manualVerificationCount = docs.filter(d => d.aiStatus === 'MANUAL_VERIFICATION_REQUIRED').length;
      app.noIssueCount = docs.filter(d => d.aiStatus === 'NO_ISSUE_DETECTED').length;

      if (activeHighFindings > 0) {
        app.reviewPriority = 'HIGH';
        app.overallStatus = 'REVIEW_REQUIRED';
      } else if (activeMedFindings > 0) {
        app.reviewPriority = 'MEDIUM';
        app.overallStatus = 'MANUAL_VERIFICATION_REQUIRED';
      } else {
        app.reviewPriority = 'LOW';
        app.overallStatus = 'PRELIMINARY_CHECK_COMPLETED';
      }
    }
  }

  public intakeApplication(payload: {
    institutionId: string;
    institutionName: string;
    applicationCategory: string;
    academicYear: string;
    requestedIntake: number;
    totalFaculty: number;
    totalLandAcres: number;
    includeVideoProof?: boolean;
    videoName?: string;
    videoUrl?: string;
    documentFiles?: { name: string; size: string }[];
  }): Application {
    const appId = `AICTE-EOA-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    // Check for duplicate documents in submitted files
    const submittedFiles = payload.documentFiles || [];
    const seenFileNames = new Set<string>();
    const duplicateFiles: string[] = [];
    submittedFiles.forEach(f => {
      const lower = f.name.toLowerCase().trim();
      if (seenFileNames.has(lower)) {
        duplicateFiles.push(f.name);
      } else {
        seenFileNames.add(lower);
      }
    });

    // Create the master application
    const newApp: Application = {
      id: appId,
      institutionId: payload.institutionId,
      institutionName: payload.institutionName,
      region: 'Western Regional Office (WRO)',
      applicationCategory: payload.applicationCategory || 'Extension of Approval (EoA)',
      academicYear: payload.academicYear || '2026-2027',
      submittedAt: now,
      requestedIntake: payload.requestedIntake,
      totalFaculty: payload.totalFaculty,
      totalLandAcres: payload.totalLandAcres,
      overallStatus: 'REVIEW_REQUIRED',
      reviewPriority: payload.requestedIntake > 60 || duplicateFiles.length > 0 ? 'HIGH' : 'MEDIUM',
      documentCount: 12,
      noIssueCount: duplicateFiles.length > 0 ? 7 : 8,
      manualVerificationCount: duplicateFiles.length > 0 ? 4 : 3,
      potentialIssueCount: payload.requestedIntake > 60 ? 1 : 0,
      officialDecision: 'PENDING'
    };

    // Clone base documents adapted to this application ID
    const baseDocs = INITIAL_DOCUMENTS['AICTE-EOA-2026-8812'];
    const clonedDocs: DocumentItem[] = baseDocs.map((doc, idx) => {
      const docId = `DOC-${appId.split('-').pop()}-${String(idx + 1).padStart(2, '0')}`;
      const cloned = JSON.parse(JSON.stringify(doc)) as DocumentItem;
      cloned.id = docId;
      cloned.applicationId = appId;
      cloned.uploadedAt = now;
      if (cloned.threeWayComparisons) {
        cloned.threeWayComparisons.forEach(c => {
          if (c.attributeName.includes('Intake')) {
            c.applicationValue = `${payload.requestedIntake} Seats`;
          }
        });
      }
      if (cloned.name.includes('Infrastructure') && payload.includeVideoProof !== false) {
        cloned.videoProof = {
          videoUrl: payload.videoUrl,
          fileName: payload.videoName || 'Apex_AI_Robotics_Lab_Walkthrough_Geotagged.mp4',
          duration: '01:45',
          fps: 30,
          gpsCoordinates: '18.5196° N, 73.7828° E (Pune Campus, Survey 44/2A)',
          recordedDate: now,
          detectedEquipment: [
            'High-Performance Computing Terminals (60 units)',
            'ABB IRB-120 Industrial Robotics Workcell',
            'Optical Fiber Rack',
            'Emergency Fire Gas Suppression Sensor'
          ],
          workstationsCount: 60,
          aiVerificationStatus: 'VERIFIED_GEO_TAGGED',
          frameHighlights: [
            { timestamp: '00:15', label: 'Entrance & Geotag Watermark', confidence: 99, detectedObject: 'GPS Watermark (18.5196° N, 73.7828° E)' },
            { timestamp: '00:42', label: 'Workstation Terminal Bay', confidence: 97, detectedObject: '60 i7 Dual-Monitor CAD/AI Systems' },
            { timestamp: '01:10', label: 'Robotic Manipulator Arm', confidence: 98, detectedObject: 'ABB IRB-120 6-Axis Robotic Arm' },
            { timestamp: '01:35', label: 'Safety Sensor & Power Backup', confidence: 96, detectedObject: 'Dual 20kVA Online UPS + FM200 Fire Sensor' }
          ]
        };
      }
      return cloned;
    });

    // Clone findings
    const baseFindings = INITIAL_FINDINGS['AICTE-EOA-2026-8812'];
    const clonedFindings: Finding[] = baseFindings.map((f, idx) => {
      const findingId = `FINDING-${appId.split('-').pop()}-${String(idx + 1).padStart(2, '0')}`;
      const cloned = JSON.parse(JSON.stringify(f)) as Finding;
      cloned.id = findingId;
      cloned.applicationId = appId;
      cloned.documentId = clonedDocs[idx % clonedDocs.length]?.id;
      if (cloned.findingType === 'THREE_WAY_INTAKE_MISMATCH') {
        cloned.evidenceText = `Application Form: Requested Intake = ${payload.requestedIntake} Seats\nProgramme Document (Page 3, Table 4.1): Approved Intake = 60 Seats\nPrevious AICTE Record (EoA 2025): Approved Intake = 60 Seats`;
        if (cloned.sourcesCompared && cloned.sourcesCompared[0]) {
          cloned.sourcesCompared[0].value = `${payload.requestedIntake} Seats`;
        }
      }
      return cloned;
    });

    // If duplicate files detected, attach a duplicate finding
    if (duplicateFiles.length > 0) {
      clonedFindings.push({
        id: `FINDING-${appId.split('-').pop()}-DUP`,
        applicationId: appId,
        documentId: clonedDocs[0]?.id,
        documentName: duplicateFiles[0],
        findingType: 'DUPLICATE_DOCUMENT_DETECTED',
        title: 'POTENTIAL DUPLICATE FILE SUBMISSION DETECTED',
        severity: 'MEDIUM',
        whatDetected: `Multiple documents with identical file name were uploaded: ${duplicateFiles.join(', ')}`,
        whyDetected: 'Regulatory filing integrity check: Duplicate attachments may indicate accidental multiple uploads or conflicting versions.',
        evidenceText: `Duplicate file entries detected: ${duplicateFiles.join(', ')}`,
        sourcesCompared: [
          {
            source: 'Uploaded Attachment Index',
            value: `${duplicateFiles.length} duplicate file(s) found`,
            reference: 'Portal Document Intake Stream'
          }
        ],
        recommendedAction: 'Officer should review the duplicate documents to confirm which version is the authorized regulatory submission.',
        aiConfidence: 99,
        status: 'ACTIVE'
      });
    }

    // Clone checklist
    const baseChecklist = INITIAL_CHECKLIST_RULES['AICTE-EOA-2026-8812'];
    const clonedChecklist: ChecklistRule[] = baseChecklist.map((c, idx) => {
      const chkId = `CHK-${appId.split('-').pop()}-${String(idx + 1).padStart(2, '0')}`;
      const cloned = JSON.parse(JSON.stringify(c)) as ChecklistRule;
      cloned.id = chkId;
      cloned.applicationId = appId;
      cloned.mappedDocumentId = clonedDocs[idx % clonedDocs.length]?.id;
      return cloned;
    });

    // Generate comprehensive audit trail for intake
    const auditEvents: AuditEvent[] = [
      {
        id: `AUD-${Date.now()}-1`,
        applicationId: appId,
        timestamp: now,
        eventType: 'APPLICATION_RECEIVED',
        actor: 'Simulated AICTE Portal Intake Gateway',
        action: 'Application Intake Received via API',
        result: `Application ${appId} submitted for ${payload.institutionName} (Requested Intake: ${payload.requestedIntake} seats)`,
        evidenceRef: 'POST /api/applications/intake'
      },
      {
        id: `AUD-${Date.now()}-2`,
        applicationId: appId,
        timestamp: new Date(Date.now() + 1000).toISOString(),
        eventType: 'DOCUMENTS_REGISTERED',
        actor: 'AI Scrutiny Ingestion Pipeline',
        action: '12 Supporting Documents Validated & Stored',
        result: duplicateFiles.length > 0 
          ? `SHA-256 signatures generated. WARNING: Duplicate document detected (${duplicateFiles.join(', ')})`
          : 'SHA-256 signatures generated, PDF MIME type confirmed, text streams extracted',
        evidenceRef: '12 Ingested PDFs'
      },
      {
        id: `AUD-${Date.now()}-3`,
        applicationId: appId,
        timestamp: new Date(Date.now() + 2500).toISOString(),
        eventType: 'DOCUMENT_CLASSIFICATION_AND_OCR',
        actor: 'Document Intelligence Engine',
        action: 'Deterministic & Regulatory Classification',
        result: '12 documents classified into Affidavits, NOCs, Land Deeds, and Programme Schedules',
        evidenceRef: 'Extracted Metadata Store'
      },
      {
        id: `AUD-${Date.now()}-4`,
        applicationId: appId,
        timestamp: new Date(Date.now() + 4000).toISOString(),
        eventType: 'THREE_WAY_COMPARISON_EXECUTED',
        actor: 'Cross-Source Comparison Engine',
        action: 'Three-Way Cross Check (Application vs Document vs Master Record)',
        result: payload.requestedIntake > 60 
          ? `FLAGGED: Application requested intake (${payload.requestedIntake}) exceeds Document (60) and Master Record (60)` 
          : 'Intake cross-check reconciled with master baseline',
        evidenceRef: 'Intake Schedule Comparison'
      },
      {
        id: `AUD-${Date.now()}-5`,
        applicationId: appId,
        timestamp: new Date(Date.now() + 5500).toISOString(),
        eventType: 'SIMULATED_AUTHORITY_VERIFICATION',
        actor: 'Simulated External Authority Gateways',
        action: 'External Registry Probes',
        result: 'Fire NOC: MATCH; Land: MATCH; NBA: UNABLE TO VERIFY (Gateway Timeout); Municipal: PENDING (Stamp ambiguity)',
        evidenceRef: 'External Prober Batch'
      },
      {
        id: `AUD-${Date.now()}-6`,
        applicationId: appId,
        timestamp: new Date(Date.now() + 7000).toISOString(),
        eventType: 'CHECKLIST_EVALUATION_COMPLETED',
        actor: 'APH 2026-27 Regulatory Rule Engine',
        action: 'Checklist Rules Applied',
        result: 'Regulatory dossier compiled. Overall Status: REVIEW REQUIRED, Priority: HIGH',
        evidenceRef: 'Checklist Evaluator'
      }
    ];

    this.applications.unshift(newApp);
    this.documents[appId] = clonedDocs;
    this.findings[appId] = clonedFindings;
    this.checklist[appId] = clonedChecklist;
    this.auditTrail[appId] = auditEvents;
    this.saveToStorage();

    // Asynchronously push all 5 entities to Supabase
    (async () => {
      try {
        // 1. Insert application
        await supabase.from('applications').insert([{
          id: newApp.id,
          institution_id: newApp.institutionId,
          institution_name: newApp.institutionName,
          region: newApp.region,
          application_category: newApp.applicationCategory,
          academic_year: newApp.academicYear,
          submitted_at: newApp.submittedAt,
          requested_intake: newApp.requestedIntake,
          total_faculty: newApp.totalFaculty,
          total_land_acres: newApp.totalLandAcres,
          overall_status: newApp.overallStatus,
          review_priority: newApp.reviewPriority,
          document_count: newApp.documentCount,
          no_issue_count: newApp.noIssueCount,
          manual_verification_count: newApp.manualVerificationCount,
          potential_issue_count: newApp.potentialIssueCount,
          official_decision: newApp.officialDecision
        }]);

        // 2. Insert documents
        const docRows = clonedDocs.map(d => ({
          id: d.id,
          application_id: d.applicationId,
          name: d.name,
          doc_type: d.docType,
          file_size: d.fileSize,
          uploaded_at: d.uploadedAt,
          page_count: d.pageCount,
          processing_status: d.processingStatus,
          ai_status: d.aiStatus,
          confidence_score: d.confidenceScore,
          extracted_fields: d.extractedFields,
          verification_record: d.verificationRecord || null,
          three_way_comparisons: d.threeWayComparisons || [],
          anomaly_indicators: d.anomalyIndicators || [],
          document_content: {
            ...d.documentContent,
            videoProof: d.videoProof || null
          }
        }));
        await supabase.from('documents').insert(docRows);

        // 3. Insert findings
        const findingRows = clonedFindings.map(f => ({
          id: f.id,
          application_id: f.applicationId,
          document_id: f.documentId || null,
          document_name: f.documentName || null,
          finding_type: f.findingType,
          title: f.title,
          severity: f.severity,
          what_detected: f.whatDetected,
          why_detected: f.whyDetected,
          evidence_text: f.evidenceText,
          sources_compared: f.sourcesCompared || [],
          recommended_action: f.recommendedAction,
          ai_confidence: f.aiConfidence,
          status: f.status,
          officer_observation: f.officerObservation || null,
          resolved_at: f.resolvedAt || null,
          resolved_by: f.resolvedBy || null
        }));
        await supabase.from('findings').insert(findingRows);

        // 4. Insert checklist rules
        const chkRows = clonedChecklist.map(c => ({
          id: c.id,
          application_id: c.applicationId || appId,
          rule_code: c.ruleCode,
          category: c.category,
          requirement_name: c.requirementName,
          statutory_clause: c.statutoryClause,
          evaluation_status: c.evaluationStatus,
          evidence_summary: c.evidenceSummary,
          mapped_document_id: c.mappedDocumentId || null
        }));
        await supabase.from('checklist_rules').insert(chkRows);

        // 5. Insert audit events
        const auditRows = auditEvents.map(a => ({
          id: a.id,
          application_id: a.applicationId,
          timestamp: a.timestamp,
          event_type: a.eventType,
          actor: a.actor,
          action: a.action,
          result: a.result,
          evidence_ref: a.evidenceRef || null
        }));
        await supabase.from('audit_events').insert(auditRows);
      } catch (e) {
        console.warn('Failed to insert full scrutiny dossier into Supabase', e);
      }
    })();

    return newApp;
  }

  public resetToDemo() {
    this.applications = JSON.parse(JSON.stringify(INITIAL_APPLICATIONS));
    this.documents = JSON.parse(JSON.stringify(INITIAL_DOCUMENTS));
    this.findings = JSON.parse(JSON.stringify(INITIAL_FINDINGS));
    this.checklist = JSON.parse(JSON.stringify(INITIAL_CHECKLIST_RULES));
    this.auditTrail = JSON.parse(JSON.stringify(INITIAL_AUDIT_TRAIL));
    this.institutions = JSON.parse(JSON.stringify(SEED_INSTITUTION_RECORDS));
    this.saveToStorage();
  }
}

export const scrutinyStore = new ScrutinyDataStore();
