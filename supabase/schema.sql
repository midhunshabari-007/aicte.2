-- ========================================================
-- AICTE AI-ASSISTED SCRUTINY PLATFORM - SUPABASE SCHEMA (IDEMPOTENT)
-- Execute this script in your Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New Query -> Paste & Run (Ctrl+Enter)
-- ========================================================

-- 1. INSTITUTIONS TABLE
CREATE TABLE IF NOT EXISTS institutions (
  permanent_id TEXT PRIMARY KEY,
  institution_name TEXT NOT NULL,
  region TEXT NOT NULL,
  state TEXT NOT NULL,
  establishment_year INT NOT NULL,
  previous_approval_status TEXT NOT NULL,
  approved_programmes JSONB DEFAULT '[]'::jsonb,
  sanctioned_intake INT NOT NULL,
  land_area_acres NUMERIC(5,2) NOT NULL,
  built_up_area_sq_mtr INT NOT NULL,
  deficiency_history TEXT,
  ter_payment_status TEXT,
  last_scrutiny_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  institution_id TEXT NOT NULL,
  institution_name TEXT NOT NULL,
  region TEXT NOT NULL,
  application_category TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  requested_intake INT NOT NULL,
  total_faculty INT NOT NULL,
  total_land_acres NUMERIC(5,2) NOT NULL,
  overall_status TEXT NOT NULL DEFAULT 'REVIEW_REQUIRED',
  review_priority TEXT NOT NULL DEFAULT 'HIGH',
  document_count INT NOT NULL DEFAULT 12,
  no_issue_count INT NOT NULL DEFAULT 8,
  manual_verification_count INT NOT NULL DEFAULT 3,
  potential_issue_count INT NOT NULL DEFAULT 1,
  official_decision TEXT NOT NULL DEFAULT 'PENDING',
  official_decision_notes TEXT,
  decided_at TIMESTAMPTZ,
  decided_by TEXT,
  generated_order_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  application_id TEXT NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  doc_type TEXT NOT NULL,
  file_size TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  page_count INT NOT NULL DEFAULT 1,
  processing_status TEXT NOT NULL DEFAULT 'COMPLETED',
  ai_status TEXT NOT NULL DEFAULT 'NO_ISSUE_DETECTED',
  confidence_score INT NOT NULL DEFAULT 95,
  extracted_fields JSONB DEFAULT '[]'::jsonb,
  verification_record JSONB,
  three_way_comparisons JSONB DEFAULT '[]'::jsonb,
  anomaly_indicators JSONB DEFAULT '[]'::jsonb,
  document_content JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. FINDINGS TABLE
CREATE TABLE IF NOT EXISTS findings (
  id TEXT PRIMARY KEY,
  application_id TEXT NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  document_id TEXT REFERENCES documents(id) ON DELETE SET NULL,
  document_name TEXT,
  finding_type TEXT NOT NULL,
  title TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'MEDIUM',
  what_detected TEXT NOT NULL,
  why_detected TEXT NOT NULL,
  evidence_text TEXT NOT NULL,
  sources_compared JSONB DEFAULT '[]'::jsonb,
  recommended_action TEXT NOT NULL,
  ai_confidence INT NOT NULL DEFAULT 90,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  officer_observation TEXT,
  resolved_at TIMESTAMPTZ,
  resolved_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CHECKLIST RULES TABLE
CREATE TABLE IF NOT EXISTS checklist_rules (
  id TEXT PRIMARY KEY,
  application_id TEXT NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  rule_code TEXT NOT NULL,
  category TEXT NOT NULL,
  requirement_name TEXT NOT NULL,
  statutory_clause TEXT NOT NULL,
  evaluation_status TEXT NOT NULL DEFAULT 'COMPLIANT',
  evidence_summary TEXT NOT NULL,
  mapped_document_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. AUDIT EVENTS TABLE
CREATE TABLE IF NOT EXISTS audit_events (
  id TEXT PRIMARY KEY,
  application_id TEXT NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  event_type TEXT NOT NULL,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  result TEXT NOT NULL,
  evidence_ref TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES (SAFE DROP & RECREATE)
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read/write institutions" ON institutions;
CREATE POLICY "Allow public read/write institutions" ON institutions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read/write applications" ON applications;
CREATE POLICY "Allow public read/write applications" ON applications FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read/write documents" ON documents;
CREATE POLICY "Allow public read/write documents" ON documents FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read/write findings" ON findings;
CREATE POLICY "Allow public read/write findings" ON findings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read/write checklist_rules" ON checklist_rules;
CREATE POLICY "Allow public read/write checklist_rules" ON checklist_rules FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read/write audit_events" ON audit_events;
CREATE POLICY "Allow public read/write audit_events" ON audit_events FOR ALL USING (true) WITH CHECK (true);

-- SEED INSTITUTIONS
INSERT INTO institutions (permanent_id, institution_name, region, state, establishment_year, previous_approval_status, approved_programmes, sanctioned_intake, land_area_acres, built_up_area_sq_mtr, deficiency_history, ter_payment_status, last_scrutiny_date)
VALUES 
('1-49201948', 'Apex Institute of Technology & Engineering', 'Western Regional Office (WRO), Mumbai', 'Maharashtra', 2010, 'Approved (EoA 2025-26, F.No. Western/1-49201948/2025/EOA)', '["B.Tech Computer Science and Engineering", "B.Tech Information Technology"]'::jsonb, 60, 5.20, 12450, 'Nil deficiencies recorded in AY 2025-26', 'TER Fee Paid Rs. 2,00,000 (Transaction Ref: AICTE-TER-2026-99382)', '2025-04-18'),
('1-38291044', 'Vidyapeeth College of Engineering & Research', 'Central Regional Office (CRO), Bhopal', 'Madhya Pradesh', 2008, 'Approved (EoA 2025-26, F.No. Central/1-38291044/2025/EOA)', '["B.Tech Mechanical Engineering", "B.Tech Civil Engineering"]'::jsonb, 120, 7.50, 15800, 'Nil', 'TER Fee Paid Rs. 2,00,000 (Transaction Ref: AICTE-TER-2026-44102)', '2025-04-20'),
('1-72910399', 'Dronacharya Polytechnic & Technical Campus', 'Northern Regional Office (NRO), Kanpur', 'Uttar Pradesh', 2014, 'Approved (EoA 2025-26, F.No. Northern/1-72910399/2025/EOA)', '["Diploma Electrical Engineering", "Diploma Electronics Engineering"]'::jsonb, 60, 4.80, 9800, 'Clarification sought in 2024 regarding CAD lab workstation count (complied)', 'TER Fee Paid Rs. 1,50,000 (Transaction Ref: AICTE-TER-2026-11840)', '2025-05-02')
ON CONFLICT (permanent_id) DO NOTHING;

-- SEED MASTER APPLICATION
INSERT INTO applications (id, institution_id, institution_name, region, application_category, academic_year, submitted_at, requested_intake, total_faculty, total_land_acres, overall_status, review_priority, document_count, no_issue_count, manual_verification_count, potential_issue_count, official_decision)
VALUES 
('AICTE-EOA-2026-8812', 'INST-AICTE-1-49201948', 'Apex Institute of Technology & Engineering', 'Western Regional Office (WRO)', 'Extension of Approval (EoA)', '2026-2027', '2026-10-24T10:14:00Z', 120, 48, 5.20, 'REVIEW_REQUIRED', 'HIGH', 12, 8, 3, 1, 'PENDING'),
('AICTE-EOA-2026-9041', 'INST-AICTE-1-38291044', 'Vidyapeeth College of Engineering & Research', 'Central Regional Office (CRO)', 'Extension of Approval (EoA)', '2026-2027', '2026-10-25T11:45:00Z', 120, 52, 7.50, 'PRELIMINARY_CHECK_COMPLETED', 'LOW', 12, 12, 0, 0, 'APPROVED')
ON CONFLICT (id) DO NOTHING;

-- SEED FINDINGS FOR AICTE-EOA-2026-8812
INSERT INTO findings (id, application_id, document_id, document_name, finding_type, title, severity, what_detected, why_detected, evidence_text, recommended_action, ai_confidence, status)
VALUES
('FINDING-8812-01', 'AICTE-EOA-2026-8812', 'DOC-8812-01', 'Programme_Course_Intake_Proposal_2026.pdf', 'THREE_WAY_INTAKE_MISMATCH', 'POTENTIAL INTAKE MISMATCH DETECTED', 'HIGH', 'Current application form requests an approved intake of 120 seats, which conflicts with both the submitted programme course document (60 seats) and existing AICTE master records (60 seats).', 'The automated three-way cross-verification detected a +100% capacity inflation in the application form without any Council capacity expansion sanction or supporting university affiliation order.', 'Application Form: Requested Intake = 120 Seats\nProgramme Document (Page 3, Table 4.1): Approved Intake = 60 Seats\nPrevious AICTE Record (EoA 2025): Approved Intake = 60 Seats', 'Manual verification required. Officer should verify whether institution requested intake increase with requisite TER fees and infrastructure expansion inspection, or restrict approved intake to sanctioned capacity of 60 seats.', 96, 'ACTIVE'),
('FINDING-8812-02', 'AICTE-EOA-2026-8812', 'DOC-8812-02', 'NBA_Accreditation_Certificate.pdf', 'EXTERNAL_REGISTRY_UNAVAILABLE', 'EXTERNAL AUTHORITY VERIFICATION UNRESOLVED', 'MEDIUM', 'National Board of Accreditation (NBA) external verification service simulated query could not be completed automatically (service timed out / pending registry sync).', 'Automated verification relies on live issuing authority gateways. When the simulated authority gateway does not return a conclusive match, the system routes the certificate to manual human inspection.', 'NBA Certificate submitted: NBA/ACCRED/2024/MAH-118\nSimulated Gateway Query: SIM-NBA-VERIFY-9921\nStatus: UNABLE TO VERIFY (External Gateway Timeout)', 'Officer should manually verify the certificate against the public NBA online portal registry prior to sanctioning NBA-contingent intake benefits.', 88, 'ACTIVE'),
('FINDING-8812-03', 'AICTE-EOA-2026-8812', 'DOC-8812-03', 'AI_Robotics_Lab_Equipment_Affidavit.pdf', 'GEOTAG_METADATA_ABSENT', 'GEOTAGGED PHYSICAL EVIDENCE REQUIRED', 'MEDIUM', 'Submitted laboratory asset affidavit reports a new 60-workstation Robotics Lab, but attached photographic exhibits lack verifiable GPS geotag EXIF metadata.', 'AICTE Approval Process Handbook (APH) 2026-27 Clause 4.2 requires geotagged time-stamped visual proof for newly claimed physical laboratories.', 'Equipment list submitted: 60 HPC Terminals + ABB Robotic Arm\nAttached Images: 4 JPG exhibits\nEXIF Metadata Analysis: No GPS latitude/longitude tags embedded in image file headers', 'Officer to review attached 360-degree geotagged video walkthrough proof or schedule digital scrutiny video conference for remote lab inspection.', 91, 'ACTIVE'),
('FINDING-8812-04', 'AICTE-EOA-2026-8812', 'DOC-8812-04', 'Building_Occupancy_Certificate_PMC.pdf', 'STAMP_LEGIBILITY_AMBIGUITY', 'MUNICIPAL RENEWAL STAMP DATE AMBIGUITY', 'MEDIUM', 'Renewal endorsement stamp on Page 2 exhibits ink blurring on final year digit of expiry date.', 'OCR confidence score dropped below threshold (72%) for expiry date field. Automated system does not guess ambiguous dates.', 'Occupancy Certificate Page 2: Stamp reads "Validity renewed up to 31-12-202[X]" where last digit cannot be resolved with certainty.', 'Officer to manually inspect scanned original copy to confirm whether renewal extends through the upcoming academic year.', 74, 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

-- SEED CHECKLIST RULES FOR AICTE-EOA-2026-8812
INSERT INTO checklist_rules (id, application_id, rule_code, category, requirement_name, statutory_clause, evaluation_status, evidence_summary, mapped_document_id)
VALUES
('CHK-01', 'AICTE-EOA-2026-8812', 'APH-NORM-2.14', 'Academic & Intake', 'Approved Intake vs Council Sanction & Institutional History', 'AICTE Approval Process Handbook (APH) 2026-27, Clause 2.14.3', 'POTENTIAL_DEFICIENCY', 'Three-way mismatch detected: Application claims 120 seats, while submitted programme proposal and Council master records sanction 60 seats.', 'DOC-8812-01'),
('CHK-02', 'AICTE-EOA-2026-8812', 'APH-NORM-1.08', 'Statutory & Land', 'Land Area Ownership & Non-Agricultural Use Certification', 'AICTE Approval Process Handbook 2026-27, Appendix 4 (Land Norms)', 'COMPLIANT', '5.20 Acres contiguous freehold land in absolute ownership of Apex Educational Society at Survey No. 44/2A Bavdhan Pune. Collector NA order verified.', 'DOC-8812-06'),
('CHK-03', 'AICTE-EOA-2026-8812', 'APH-NORM-1.12', 'Infrastructure', 'Sanctioned Built-Up Instructional Area', 'AICTE Approval Process Handbook 2026-27, Appendix 4.1', 'COMPLIANT', 'Built-up area of 12,450 sq.m certified by Council of Architecture registered architect. Exceeds minimum required 8,500 sq.m for 240 cumulative capacity.', 'DOC-8812-07'),
('CHK-04', 'AICTE-EOA-2026-8812', 'APH-NORM-3.04', 'Regulatory Clearances', 'Fire and Life Safety NOC Compliance', 'AICTE Approval Process Handbook 2026-27, Clause 3.4.1', 'COMPLIANT', 'Fire Safety Certificate MFS/NOC/PUNE/2024/77481 issued by Directorate of Maharashtra Fire Services, valid until 14-11-2027.', 'DOC-8812-05'),
('CHK-05', 'AICTE-EOA-2026-8812', 'APH-NORM-4.02', 'Infrastructure', 'Laboratory Equipment & Geotagged Physical Evidence', 'AICTE Approval Process Handbook 2026-27, Clause 4.2.2', 'MANUAL_VERIFICATION_PENDING', '28 laboratories reported operational. Geotag EXIF coordinates missing for newly constructed AI & Robotics lab. Manual review required.', 'DOC-8812-03'),
('CHK-06', 'AICTE-EOA-2026-8812', 'APH-NORM-2.07', 'Faculty & Cadre', 'Faculty-to-Student Ratio & Cadre Distribution', 'AICTE Approval Process Handbook 2026-27, Appendix 7 (Faculty Cadre 1:2:6)', 'COMPLIANT', '48 regular full-time faculty members declared. Cadre ratio 1:2.2:6.4 satisfies statutory 1:2:6 requirement. University approvals on file.', 'DOC-8812-08'),
('CHK-07', 'AICTE-EOA-2026-8812', 'APH-NORM-5.01', 'Regulatory Clearances', 'Mandatory Disclosures & Anti-Ragging Undertaking', 'AICTE Approval Process Handbook 2026-27, Clause 5.1.2', 'COMPLIANT', 'Public disclosures uploaded on institution website. Anti-ragging committee duly constituted with student, parent, police, and media representatives.', 'DOC-8812-11'),
('CHK-08', 'AICTE-EOA-2026-8812', 'APH-NORM-1.04', 'Statutory & Land', 'Public Trust / Society Registration & Bye-Laws', 'AICTE Approval Process Handbook 2026-27, Clause 1.4.1', 'COMPLIANT', 'Society registered under Societies Registration Act 1860 (Reg No. MAH/1842/2004/PUNE) with unbroken legal standing.', 'DOC-8812-12')
ON CONFLICT (id) DO NOTHING;

-- SEED AUDIT TRAIL FOR AICTE-EOA-2026-8812
INSERT INTO audit_events (id, application_id, timestamp, event_type, actor, action, result, evidence_ref)
VALUES
('AUD-8812-01', 'AICTE-EOA-2026-8812', '2026-10-24T10:14:00Z', 'APPLICATION_RECEIVED', 'Simulated AICTE Portal Intake Gateway', 'Application Intake Received via API', 'Application AICTE-EOA-2026-8812 submitted for Apex Institute of Technology & Engineering (Requested Intake: 120 seats)', 'POST /api/applications/intake'),
('AUD-8812-02', 'AICTE-EOA-2026-8812', '2026-10-24T10:15:20Z', 'DOCUMENTS_REGISTERED', 'AI Scrutiny Ingestion Pipeline', '12 Supporting Documents Validated & Stored', 'SHA-256 signatures generated, PDF MIME type confirmed, text streams extracted', '12 Ingested PDFs'),
('AUD-8812-03', 'AICTE-EOA-2026-8812', '2026-10-24T10:15:45Z', 'DOCUMENT_CLASSIFICATION_AND_OCR', 'Document Intelligence Engine', 'Deterministic & Regulatory Classification', '12 documents classified into Affidavits, NOCs, Land Deeds, and Programme Schedules', 'Extracted Metadata Store'),
('AUD-8812-04', 'AICTE-EOA-2026-8812', '2026-10-24T10:16:10Z', 'THREE_WAY_COMPARISON_EXECUTED', 'Cross-Source Comparison Engine', 'Three-Way Cross Check (Application vs Document vs Master Record)', 'FLAGGED: Application requested intake (120) exceeds Document (60) and Master Record (60)', 'Intake Schedule Comparison'),
('AUD-8812-05', 'AICTE-EOA-2026-8812', '2026-10-24T10:16:40Z', 'SIMULATED_AUTHORITY_VERIFICATION', 'Simulated External Authority Gateways', 'External Registry Probes', 'Fire NOC: MATCH; Land: MATCH; NBA: UNABLE TO VERIFY (Gateway Timeout); Municipal: PENDING (Stamp ambiguity)', 'External Prober Batch'),
('AUD-8812-06', 'AICTE-EOA-2026-8812', '2026-10-24T10:17:15Z', 'CHECKLIST_EVALUATION_COMPLETED', 'APH 2026-27 Regulatory Rule Engine', 'Checklist Rules Applied', 'Regulatory dossier compiled. Overall Status: REVIEW REQUIRED, Priority: HIGH', 'Checklist Evaluator'),
('AUD-8812-07', 'AICTE-EOA-2026-8812', '2026-10-24T10:17:30Z', 'DOSSIER_ROUTED_TO_OFFICER', 'AI Scrutiny Routing Broker', 'Dossier Assigned to Senior Scrutiny Officer', 'Assigned to Western Regional Office queue for human regulatory evaluation', 'Officer Inbox (Dr. R. K. Sharma)')
ON CONFLICT (id) DO NOTHING;

