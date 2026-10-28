import { 
  Application, 
  DocumentItem, 
  Finding, 
  ChecklistRule, 
  InstitutionMasterRecord, 
  AuditEvent 
} from '../types/scrutiny';

export const SEED_INSTITUTION_RECORDS: Record<string, InstitutionMasterRecord> = {
  'INST-AICTE-1-49201948': {
    permanentId: '1-49201948',
    institutionName: 'Apex Institute of Technology & Engineering',
    region: 'Western Regional Office (WRO), Mumbai',
    state: 'Maharashtra',
    establishmentYear: 2010,
    previousApprovalStatus: 'Approved (EoA 2025-26, F.No. Western/1-49201948/2025/EOA)',
    approvedProgrammes: ['B.Tech Computer Science and Engineering', 'B.Tech Information Technology'],
    sanctionedIntake: 60,
    landAreaAcres: 5.2,
    builtUpAreaSqMtr: 12450,
    deficiencyHistory: 'Nil deficiencies recorded in AY 2025-26',
    terPaymentStatus: 'TER Fee Paid Rs. 2,00,000 (Transaction Ref: AICTE-TER-2026-99382)',
    lastScrutinyDate: '2025-04-18',
  },
  'INST-AICTE-1-38291044': {
    permanentId: '1-38291044',
    institutionName: 'Vidyapeeth College of Engineering & Research',
    region: 'Central Regional Office (CRO), Bhopal',
    state: 'Madhya Pradesh',
    establishmentYear: 2008,
    previousApprovalStatus: 'Approved (EoA 2025-26, F.No. Central/1-38291044/2025/EOA)',
    approvedProgrammes: ['B.Tech Mechanical Engineering', 'B.Tech Civil Engineering'],
    sanctionedIntake: 120,
    landAreaAcres: 7.5,
    builtUpAreaSqMtr: 15800,
    deficiencyHistory: 'Nil',
    terPaymentStatus: 'TER Fee Paid Rs. 2,00,000 (Transaction Ref: AICTE-TER-2026-44102)',
    lastScrutinyDate: '2025-04-20',
  },
  'INST-AICTE-1-72910399': {
    permanentId: '1-72910399',
    institutionName: 'Dronacharya Polytechnic & Technical Campus',
    region: 'Northern Regional Office (NRO), Kanpur',
    state: 'Uttar Pradesh',
    establishmentYear: 2014,
    previousApprovalStatus: 'Approved (EoA 2025-26, F.No. Northern/1-72910399/2025/EOA)',
    approvedProgrammes: ['Diploma Electrical Engineering', 'Diploma Electronics Engineering'],
    sanctionedIntake: 60,
    landAreaAcres: 4.8,
    builtUpAreaSqMtr: 9800,
    deficiencyHistory: 'Clarification sought in 2024 regarding CAD lab workstation count (complied)',
    terPaymentStatus: 'TER Fee Paid Rs. 1,50,000 (Transaction Ref: AICTE-TER-2026-11840)',
    lastScrutinyDate: '2025-05-02',
  }
};

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'AICTE-EOA-2026-8812',
    institutionId: 'INST-AICTE-1-49201948',
    institutionName: 'Apex Institute of Technology & Engineering',
    region: 'Western Regional Office (WRO)',
    applicationCategory: 'Extension of Approval (EoA)',
    academicYear: '2026-2027',
    submittedAt: '2026-10-24T10:14:00Z',
    requestedIntake: 120,
    totalFaculty: 48,
    totalLandAcres: 5.2,
    overallStatus: 'REVIEW_REQUIRED',
    reviewPriority: 'HIGH',
    documentCount: 12,
    noIssueCount: 8,
    manualVerificationCount: 3,
    potentialIssueCount: 1,
    officialDecision: 'PENDING',
  },
  {
    id: 'AICTE-EOA-2026-9041',
    institutionId: 'INST-AICTE-1-38291044',
    institutionName: 'Vidyapeeth College of Engineering & Research',
    region: 'Central Regional Office (CRO)',
    applicationCategory: 'Extension of Approval (EoA)',
    academicYear: '2026-2027',
    submittedAt: '2026-10-25T11:45:00Z',
    requestedIntake: 120,
    totalFaculty: 52,
    totalLandAcres: 7.5,
    overallStatus: 'PRELIMINARY_CHECK_COMPLETED',
    reviewPriority: 'LOW',
    documentCount: 12,
    noIssueCount: 12,
    manualVerificationCount: 0,
    potentialIssueCount: 0,
    officialDecision: 'APPROVED',
    officialDecisionNotes: 'All 12 documents preliminary checked without discrepancies. Cadre ratio and infrastructure validated against APH 2026-27 norms.',
    decidedAt: '2026-10-26T16:20:00Z',
    decidedBy: 'Dr. R. K. Sharma (Senior Scrutiny Officer)',
    generatedOrderNumber: 'F.No. Western/1-38291044/2026/EOA-VERIFIED'
  },
  {
    id: 'AICTE-NEW-2026-1024',
    institutionId: 'INST-AICTE-1-72910399',
    institutionName: 'Dronacharya Polytechnic & Technical Campus',
    region: 'Northern Regional Office (NRO)',
    applicationCategory: 'Extension of Approval (EoA)',
    academicYear: '2026-2027',
    submittedAt: '2026-10-26T09:30:00Z',
    requestedIntake: 60,
    totalFaculty: 24,
    totalLandAcres: 4.8,
    overallStatus: 'MANUAL_VERIFICATION_REQUIRED',
    reviewPriority: 'MEDIUM',
    documentCount: 10,
    noIssueCount: 8,
    manualVerificationCount: 2,
    potentialIssueCount: 0,
    officialDecision: 'PENDING',
  }
];

export const INITIAL_DOCUMENTS: Record<string, DocumentItem[]> = {
  'AICTE-EOA-2026-8812': [
    {
      id: 'DOC-8812-01',
      applicationId: 'AICTE-EOA-2026-8812',
      name: 'Programme_Course_Intake_Proposal_2026.pdf',
      docType: 'Programme Document',
      fileSize: '3.4 MB',
      uploadedAt: '2026-10-24T10:14:10Z',
      pageCount: 6,
      processingStatus: 'COMPLETED',
      aiStatus: 'POTENTIAL_ISSUE_DETECTED',
      confidenceScore: 96,
      anomalyIndicators: [
        'Requested intake in Application Form (120) differs by +100% from internal course proposal schedule (60)',
        'No Council sanction order or AICTE approval attached for capacity increase from 60 to 120 seats'
      ],
      threeWayComparisons: [
        {
          attributeName: 'Sanctioned / Requested Intake',
          applicationValue: '120 Seats',
          documentValue: '60 Seats (Table 4.1, Page 3)',
          institutionalRecordValue: '60 Seats (Master EoA 2025-26)',
          matchStatus: 'MISMATCH',
          evidenceLocation: 'Page 3, Section 4.1: Approved Course Capacity',
          notes: 'Application form asserts 120 seats, but submitted programme schedule specifies approved intake of 60. AICTE historical record confirms 60 seats.'
        },
        {
          attributeName: 'Permanent Institution ID',
          applicationValue: '1-49201948',
          documentValue: '1-49201948',
          institutionalRecordValue: '1-49201948',
          matchStatus: 'MATCH',
          evidenceLocation: 'Page 1, Institutional Header'
        },
        {
          attributeName: 'Programme / Course Name',
          applicationValue: 'B.Tech Computer Science & Engineering',
          documentValue: 'B.Tech Computer Science & Engineering',
          institutionalRecordValue: 'B.Tech Computer Science & Engineering',
          matchStatus: 'MATCH',
          evidenceLocation: 'Page 2, Course Listing'
        }
      ],
      extractedFields: [
        {
          id: 'EF-01',
          fieldName: 'Institution Name',
          fieldValue: 'Apex Institute of Technology & Engineering',
          sourcePage: 1,
          confidence: 99,
          evidenceSnippet: 'APEX INSTITUTE OF TECHNOLOGY & ENGINEERING, PUNE (MAHARASHTRA)',
          status: 'EXTRACTED'
        },
        {
          id: 'EF-02',
          fieldName: 'Programme Proposed',
          fieldValue: 'Under-Graduate Engineering (B.Tech)',
          sourcePage: 2,
          confidence: 98,
          evidenceSnippet: 'Level: Under Graduate; Course: Computer Science and Engineering',
          status: 'EXTRACTED'
        },
        {
          id: 'EF-03',
          fieldName: 'Approved Course Intake (Document Schedule)',
          fieldValue: '60 Seats',
          sourcePage: 3,
          confidence: 97,
          evidenceSnippet: 'Table 4.1: S.No 1 | B.Tech CSE | S-101 | Approved Intake: 60 | Shift: Regular 1st Shift',
          status: 'INCONSISTENT'
        },
        {
          id: 'EF-04',
          fieldName: 'Academic Year',
          fieldValue: '2026-2027',
          sourcePage: 1,
          confidence: 99,
          evidenceSnippet: 'Extension of Approval Application Document for Academic Session 2026-2027',
          status: 'EXTRACTED'
        }
      ],
      verificationRecord: {
        source: 'AICTE Bureau of Approvals Master Database (Simulated)',
        status: 'MISMATCH',
        referenceNumber: 'SIM-VERIFY-APH-2026-8812',
        timestamp: '2026-10-24T10:15:30Z',
        notes: 'Sanctioned intake recorded in Council database is 60. Current application claims 120 without prior expansion approval.',
        isSimulated: true
      },
      documentContent: {
        issuingAuthority: 'Apex Institute of Technology & Engineering - Academic Council',
        documentNumber: 'AITE/ACAD/2026/EOA-PROP-01',
        issueDate: '2026-10-12',
        sections: [
          {
            heading: '1. Institutional Overview & Request for Extension of Approval',
            body: 'Apex Institute of Technology & Engineering, established in 2010 under the aegis of Apex Educational Society, Pune, hereby submits its annual proposal for Extension of Approval (EoA) for the Academic Year 2026-27 in accordance with the AICTE Approval Process Handbook (APH 2026-27).'
          },
          {
            heading: '4. Course Schedule & Capacity Intake Table',
            body: 'Table 4.1 — Approved Intake Schedule for Academic Year 2026-27:\n[Course: B.Tech Computer Science & Engineering | Duration: 4 Years | Approved Intake: 60 Seats | Affiliating University: Savitribai Phule Pune University]',
            highlighted: true
          },
          {
            heading: '5. Principal Signature & Seal',
            body: 'Dr. S. K. Deshmukh, Principal & Member Secretary, Academic Council. Verified on 12th October 2026.'
          }
        ],
        tableData: {
          headers: ['Course Code', 'Degree & Programme', 'Shift', 'Approved Intake', 'Affiliating University'],
          rows: [
            ['CSE-UG-01', 'B.Tech in Computer Science & Engineering', '1st Shift (Regular)', '60 Seats', 'SPPU, Pune'],
            ['IT-UG-02', 'B.Tech in Information Technology', '1st Shift (Regular)', '60 Seats', 'SPPU, Pune']
          ]
        }
      }
    },
    {
      id: 'DOC-8812-02',
      applicationId: 'AICTE-EOA-2026-8812',
      name: 'NBA_Accreditation_Certificate.pdf',
      docType: 'Accreditation Certificate',
      fileSize: '2.1 MB',
      uploadedAt: '2026-10-24T10:14:15Z',
      pageCount: 3,
      processingStatus: 'COMPLETED',
      aiStatus: 'MANUAL_VERIFICATION_REQUIRED',
      confidenceScore: 88,
      anomalyIndicators: [
        'National Board of Accreditation (NBA) external verification service unavailable / pending registry sync',
        'Validity dates require human verification against NBA public portal records'
      ],
      threeWayComparisons: [
        {
          attributeName: 'NBA Accreditation Status',
          applicationValue: 'Accredited (Tier-II) Valid up to 30-06-2027',
          documentValue: 'Accredited (Tier-II) Valid 01-07-2024 to 30-06-2027',
          institutionalRecordValue: 'Accreditation Renewal Pending Verification',
          matchStatus: 'MATCH',
          evidenceLocation: 'Page 1, Paragraph 2: Accreditation Validity'
        }
      ],
      extractedFields: [
        {
          id: 'EF-05',
          fieldName: 'Issuing Body',
          fieldValue: 'National Board of Accreditation (NBA), New Delhi',
          sourcePage: 1,
          confidence: 98,
          evidenceSnippet: 'NATIONAL BOARD OF ACCREDITATION, NBCC Place, East Tower, Bhisham Pitamah Marg, Pragati Vihar, New Delhi',
          status: 'EXTRACTED'
        },
        {
          id: 'EF-06',
          fieldName: 'Accredited Programme',
          fieldValue: 'UG Computer Science & Engineering (Tier-II)',
          sourcePage: 1,
          confidence: 96,
          evidenceSnippet: 'Under-Graduate Engineering Programme: Computer Science and Engineering',
          status: 'EXTRACTED'
        },
        {
          id: 'EF-07',
          fieldName: 'Validity Period',
          fieldValue: '01-07-2024 to 30-06-2027',
          sourcePage: 1,
          confidence: 94,
          evidenceSnippet: 'Accreditation Status is valid for the academic years 2024-2025 to 2026-2027 i.e. up to 30-06-2027',
          status: 'EXTRACTED'
        }
      ],
      verificationRecord: {
        source: 'NBA External API Gateway (Simulated Verification)',
        status: 'UNABLE_TO_VERIFY',
        referenceNumber: 'SIM-NBA-VERIFY-9921',
        timestamp: '2026-10-24T10:15:42Z',
        notes: 'External issuing authority query returned status: TIMEOUT / PENDING_REGISTRY_SYNC. Recommended action: Officer to manually inspect certificate seal and verify NBA gazette notifications.',
        isSimulated: true
      },
      documentContent: {
        issuingAuthority: 'National Board of Accreditation, New Delhi',
        documentNumber: 'NBA/ACCRED/2024/MAH-118',
        issueDate: '2024-07-15',
        expiryDate: '2027-06-30',
        sections: [
          {
            heading: 'Subject: Accreditation Status of UG Engineering Programmes',
            body: 'This has reference to your application for accreditation of Under Graduate Engineering programme(s) submitted by Apex Institute of Technology & Engineering, Pune. The competent authority in National Board of Accreditation has accorded accreditation to the following programme(s).'
          },
          {
            heading: 'Accreditation Details Table',
            body: 'Programme: Computer Science & Engineering | Level: UG | Basis of Evaluation: Tier-II (June 2015 Document) | Period of Validity: Academic Years 2024-2025 to 2026-2027, i.e., up to 30-06-2027.',
            highlighted: true
          }
        ]
      }
    },
    {
      id: 'DOC-8812-03',
      applicationId: 'AICTE-EOA-2026-8812',
      name: 'Infrastructure_Lab_Report.pdf',
      docType: 'Infrastructure Report',
      fileSize: '4.8 MB',
      uploadedAt: '2026-10-24T10:14:22Z',
      pageCount: 14,
      processingStatus: 'COMPLETED',
      aiStatus: 'MANUAL_VERIFICATION_REQUIRED',
      confidenceScore: 82,
      anomalyIndicators: [
        'Geotagged photographic coordinates missing in Section 3 (Robotics & AI Advanced Lab)',
        'Built-up area calculations require human surveyor check against AICTE norms'
      ],
      threeWayComparisons: [
        {
          attributeName: 'Total Instructional Area',
          applicationValue: '6,400 sq.m',
          documentValue: '6,380 sq.m (Table 2.3)',
          institutionalRecordValue: '6,200 sq.m (Baseline 2025)',
          matchStatus: 'MATCH',
          evidenceLocation: 'Page 4, Table 2.3: Instructional Area Breakdown',
          notes: 'Within 1% acceptable variance. Geotag evidence missing for new annex.'
        }
      ],
      extractedFields: [
        {
          id: 'EF-08',
          fieldName: 'Total Laboratories Listed',
          fieldValue: '28 Laboratories',
          sourcePage: 2,
          confidence: 96,
          evidenceSnippet: 'Total sanctioned labs in operational state: 28 fully equipped laboratories',
          status: 'EXTRACTED'
        },
        {
          id: 'EF-09',
          fieldName: 'AI & Robotics Lab Setup',
          fieldValue: 'Incomplete Geotag Photo Attachment',
          sourcePage: 8,
          confidence: 78,
          evidenceSnippet: 'Section 3.4: Newly established Advanced AI & Robotics Laboratory (Photographs pending latitude/longitude stamp overlay)',
          status: 'UNABLE_TO_VERIFY'
        }
      ],
      verificationRecord: {
        source: 'AICTE Physical Infrastructure Prober (Simulated)',
        status: 'UNABLE_TO_VERIFY',
        referenceNumber: 'SIM-INFRA-CHECK-4819',
        timestamp: '2026-10-24T10:16:01Z',
        notes: 'Automated EXIF parser failed to locate GPS metadata tags in Appendix B images. Officer manual inspection recommended.',
        isSimulated: true
      },
      videoProof: {
        fileName: 'Apex_AI_Robotics_Lab_Walkthrough_Geotagged.mp4',
        duration: '01:45',
        fps: 30,
        gpsCoordinates: '18.5196° N, 73.7828° E (Pune Campus, Survey 44/2A)',
        recordedDate: '2026-10-18T14:30:00Z',
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
      },
      documentContent: {
        issuingAuthority: 'Apex Institute Infrastructure Committee & Chartered Engineer',
        documentNumber: 'CE/PUNE/2026/INFRA-088',
        issueDate: '2026-09-28',
        sections: [
          {
            heading: '1. Architectural & Instructional Area Verification',
            body: 'The undersigned Chartered Engineer inspected the premises of Apex Institute of Technology & Engineering on 24th September 2026 to verify instructional, administrative, and amenities area compliance with AICTE norms.'
          },
          {
            heading: '3. Advanced Laboratories & Specialized Compute Centers',
            body: 'Instructional computer labs equipped with 450 i7 workstations. Note: Geotagged photographic proof for newly constructed Lab 204 (AI & Robotics) was supplied without EXIF geotag coordinates in print proof.',
            highlighted: true
          }
        ]
      }
    },
    {
      id: 'DOC-8812-04',
      applicationId: 'AICTE-EOA-2026-8812',
      name: 'Municipal_Occupancy_Permission.pdf',
      docType: 'Building Document',
      fileSize: '1.9 MB',
      uploadedAt: '2026-10-24T10:14:28Z',
      pageCount: 2,
      processingStatus: 'COMPLETED',
      aiStatus: 'MANUAL_VERIFICATION_REQUIRED',
      confidenceScore: 84,
      anomalyIndicators: [
        'Municipal stamp ink dispersion at renewal expiry date field',
        'Officer should verify whether renewal validity extends through AY 2026-27'
      ],
      threeWayComparisons: [
        {
          attributeName: 'Municipal Approval Reference',
          applicationValue: 'PMC/BP/2019/3392',
          documentValue: 'PMC/BP/2019/3392',
          institutionalRecordValue: 'PMC/BP/2019/3392',
          matchStatus: 'MATCH',
          evidenceLocation: 'Page 1, Reference No. Heading'
        }
      ],
      extractedFields: [
        {
          id: 'EF-10',
          fieldName: 'Issuing Municipal Body',
          fieldValue: 'Pune Municipal Corporation (Building Permissions Dept)',
          sourcePage: 1,
          confidence: 97,
          evidenceSnippet: 'OFFICE OF THE CITY ENGINEER, BUILDING PERMISSION DEPARTMENT, PUNE MUNICIPAL CORPORATION',
          status: 'EXTRACTED'
        },
        {
          id: 'EF-11',
          fieldName: 'Occupancy Certificate Validity Stamp',
          fieldValue: 'Unclear Stamp Date (Appears 31-12-2026 or 31-12-2028)',
          sourcePage: 2,
          confidence: 72,
          evidenceSnippet: 'Renewed and endorsed on behalf of City Engineer. Renewal validity stamp ink blurred at digits: 31-12-202[X]',
          status: 'UNABLE_TO_VERIFY'
        }
      ],
      verificationRecord: {
        source: 'Municipal Urban Local Body Registry (Simulated)',
        status: 'PENDING',
        referenceNumber: 'SIM-PMC-OCC-7712',
        timestamp: '2026-10-24T10:16:15Z',
        notes: 'Digital registry match confirmed PMC/BP/2019/3392, but physical renewal endorsement stamp date contains visual ambiguity.',
        isSimulated: true
      },
      documentContent: {
        issuingAuthority: 'Pune Municipal Corporation, Building Permissions Dept',
        documentNumber: 'PMC/BP/OCC/2019/3392-R1',
        issueDate: '2019-11-14',
        expiryDate: '2026-12-31',
        sections: [
          {
            heading: 'Sub: Grant of Full Occupancy Certificate for Educational Campus',
            body: 'With reference to proposal submitted by Apex Educational Society for Construction of College of Engineering on Survey No. 44/2A, Bavdhan, Pune, Full Occupancy Certificate is hereby granted for Wing A, B, and Central Academic Block.'
          },
          {
            heading: 'Renewal Endorsement & Periodic Inspection',
            body: 'Inspected and certified for structural safety and occupancy. Periodic validity stamp impressed on Page 2: Validity renewed up to 31st December [unclear year stamp].',
            highlighted: true
          }
        ]
      }
    },
    {
      id: 'DOC-8812-05',
      applicationId: 'AICTE-EOA-2026-8812',
      name: 'Fire_Safety_NOC_State_Directorate.pdf',
      docType: 'NOC',
      fileSize: '1.8 MB',
      uploadedAt: '2026-10-24T10:14:32Z',
      pageCount: 4,
      processingStatus: 'COMPLETED',
      aiStatus: 'NO_ISSUE_DETECTED',
      confidenceScore: 98,
      threeWayComparisons: [
        {
          attributeName: 'Fire NOC Validity Expiry',
          applicationValue: 'Valid through 14-11-2027',
          documentValue: '14-11-2027',
          institutionalRecordValue: 'Previous NOC valid till 2024, Renewal verified',
          matchStatus: 'MATCH',
          evidenceLocation: 'Page 2, Paragraph 4: Validity Clause'
        }
      ],
      extractedFields: [
        {
          id: 'EF-12',
          fieldName: 'Issuing Authority',
          fieldValue: 'Directorate of Maharashtra Fire Services',
          sourcePage: 1,
          confidence: 99,
          evidenceSnippet: 'GOVERNMENT OF MAHARASHTRA, DIRECTORATE OF MAHARASHTRA FIRE SERVICES, MUMBAI',
          status: 'EXTRACTED'
        },
        {
          id: 'EF-13',
          fieldName: 'Certificate Number',
          fieldValue: 'MFS/NOC/PUNE/2024/77481',
          sourcePage: 1,
          confidence: 98,
          evidenceSnippet: 'NOC Ref: MFS/NOC/PUNE/2024/77481 dated 15-11-2024',
          status: 'EXTRACTED'
        },
        {
          id: 'EF-14',
          fieldName: 'Expiry Date',
          fieldValue: '14-11-2027',
          sourcePage: 2,
          confidence: 97,
          evidenceSnippet: 'This Final Fire Safety Certificate is valid for a period of three (3) years from date of issue, i.e., up to 14-11-2027',
          status: 'EXTRACTED'
        }
      ],
      verificationRecord: {
        source: 'State Fire Services e-Verification Portal (Simulated)',
        status: 'MATCH',
        referenceNumber: 'SIM-MFS-VERIFIED-77481',
        timestamp: '2026-10-24T10:16:30Z',
        notes: 'Simulated verification confirms certificate is registered, active, and fully valid for AY 2026-27.',
        isSimulated: true
      },
      documentContent: {
        issuingAuthority: 'Directorate of Maharashtra Fire Services',
        documentNumber: 'MFS/NOC/PUNE/2024/77481',
        issueDate: '2024-11-15',
        expiryDate: '2027-11-14',
        sections: [
          {
            heading: 'Subject: Grant of Renewal of Fire Safety Certificate',
            body: 'Certified that the educational building occupied by Apex Institute of Technology & Engineering on Survey No. 44/2A, Bavdhan, Pune comprised of Ground + 4 Upper Floors has complied with fire prevention and fire safety requirements.'
          },
          {
            heading: 'Validity Clause',
            body: 'The certificate is issued on condition that fire protection installations shall be maintained in working condition at all times. Valid up to 14-11-2027.'
          }
        ]
      }
    },
    {
      id: 'DOC-8812-06',
      applicationId: 'AICTE-EOA-2026-8812',
      name: 'Land_Title_Deed_Revenue_Extract.pdf',
      docType: 'Land Document',
      fileSize: '3.1 MB',
      uploadedAt: '2026-10-24T10:14:38Z',
      pageCount: 5,
      processingStatus: 'COMPLETED',
      aiStatus: 'NO_ISSUE_DETECTED',
      confidenceScore: 97,
      threeWayComparisons: [
        {
          attributeName: 'Total Land Area',
          applicationValue: '5.20 Acres (Contiguous)',
          documentValue: '5.20 Acres (2.10 Hectares)',
          institutionalRecordValue: '5.20 Acres (Verified 2010)',
          matchStatus: 'MATCH',
          evidenceLocation: 'Page 2, Schedule of Property, 7/12 Extract'
        }
      ],
      extractedFields: [
        {
          id: 'EF-15',
          fieldName: 'Land Title Holder',
          fieldValue: 'Apex Educational Society, Pune',
          sourcePage: 1,
          confidence: 99,
          evidenceSnippet: 'Registered in the absolute ownership of Apex Educational Society, Pune',
          status: 'EXTRACTED'
        },
        {
          id: 'EF-16',
          fieldName: 'Survey Number & Location',
          fieldValue: 'Survey No. 44/2A, Bavdhan, Taluka Haveli, District Pune',
          sourcePage: 2,
          confidence: 98,
          evidenceSnippet: 'Survey No. 44, Hissa No. 2A, Village Bavdhan, Dist. Pune',
          status: 'EXTRACTED'
        },
        {
          id: 'EF-17',
          fieldName: 'Land Use Permission',
          fieldValue: 'Non-Agricultural (Educational Use Order by Collector)',
          sourcePage: 3,
          confidence: 97,
          evidenceSnippet: 'Collector Order No. NA/EDU/HAV/2009/1084 granting permission for institutional educational setup',
          status: 'EXTRACTED'
        }
      ],
      verificationRecord: {
        source: 'State Land Revenue Mahabhulekh Portal (Simulated)',
        status: 'MATCH',
        referenceNumber: 'SIM-REV-MH-55910',
        timestamp: '2026-10-24T10:16:45Z',
        notes: 'Simulated verification confirms unencumbered freehold educational land title.',
        isSimulated: true
      },
      documentContent: {
        issuingAuthority: 'Office of the Sub-Registrar Haveli, Pune & Revenue Dept',
        documentNumber: 'REG-HV-2009-8819',
        issueDate: '2009-08-22',
        sections: [
          {
            heading: 'Sale Deed & 7/12 Revenue Extract',
            body: 'This indenture of absolute conveyance confirms the transfer of 5.20 Acres of contiguous land situated at Survey No. 44/2A, Bavdhan, Haveli, Pune to Apex Educational Society exclusively for higher and technical educational purposes.'
          }
        ]
      }
    },
    {
      id: 'DOC-8812-07',
      applicationId: 'AICTE-EOA-2026-8812',
      name: 'Building_Plan_Completion_Cert.pdf',
      docType: 'Building Document',
      fileSize: '2.5 MB',
      uploadedAt: '2026-10-24T10:14:44Z',
      pageCount: 3,
      processingStatus: 'COMPLETED',
      aiStatus: 'NO_ISSUE_DETECTED',
      confidenceScore: 98,
      threeWayComparisons: [
        {
          attributeName: 'Total Built-up Area',
          applicationValue: '12,450 sq.m',
          documentValue: '12,450 sq.m (Sanctioned Plan)',
          institutionalRecordValue: '12,450 sq.m (Approved 2018)',
          matchStatus: 'MATCH',
          evidenceLocation: 'Page 1, Architect Completion Certificate'
        }
      ],
      extractedFields: [
        {
          id: 'EF-18',
          fieldName: 'Registered Architect',
          fieldValue: 'Ar. Rajesh V. Kulkarni (COA Reg: CA/98/22194)',
          sourcePage: 1,
          confidence: 98,
          evidenceSnippet: 'Council of Architecture Reg. CA/98/22194',
          status: 'EXTRACTED'
        },
        {
          id: 'EF-19',
          fieldName: 'Total Built-up Area Certified',
          fieldValue: '12,450.00 Square Metres',
          sourcePage: 1,
          confidence: 99,
          evidenceSnippet: 'Gross constructed built-up area: 12,450.00 sq.m strictly conforming to NBC 2016 norms',
          status: 'EXTRACTED'
        }
      ],
      verificationRecord: {
        source: 'PWD & Municipal Inspection Register (Simulated)',
        status: 'MATCH',
        referenceNumber: 'SIM-BLDG-COMP-2018-994',
        timestamp: '2026-10-24T10:17:00Z',
        notes: 'Simulated verification confirms completion certificate authenticity.',
        isSimulated: true
      },
      documentContent: {
        issuingAuthority: 'Council of Architecture Registered Architect & PWD',
        documentNumber: 'ARCH/CERT/2018/092',
        issueDate: '2018-06-10',
        sections: [
          {
            heading: 'Architects Completion & Safety Certificate',
            body: 'Certified that the institutional campus building of Apex Institute of Technology & Engineering has been constructed in strict conformity with sanctioned drawing plans PMC/BP/2014/1102. Total built-up area: 12,450 sq.m.'
          }
        ]
      }
    },
    {
      id: 'DOC-8812-08',
      applicationId: 'AICTE-EOA-2026-8812',
      name: 'Faculty_Cadre_Ratio_Declaration.pdf',
      docType: 'Faculty Declaration',
      fileSize: '1.6 MB',
      uploadedAt: '2026-10-24T10:14:50Z',
      pageCount: 8,
      processingStatus: 'COMPLETED',
      aiStatus: 'NO_ISSUE_DETECTED',
      confidenceScore: 96,
      threeWayComparisons: [
        {
          attributeName: 'Faculty Student Ratio',
          applicationValue: '1:15 (Compliant with AICTE APH Norms)',
          documentValue: '1:14.8 (48 Regular Faculty Members)',
          institutionalRecordValue: '1:15 Norm Applicable',
          matchStatus: 'MATCH',
          evidenceLocation: 'Page 3, Faculty Summary Table'
        }
      ],
      extractedFields: [
        {
          id: 'EF-20',
          fieldName: 'Total Regular Faculty',
          fieldValue: '48 Full-Time Faculty Members',
          sourcePage: 2,
          confidence: 98,
          evidenceSnippet: 'Total full-time regular faculty on rolls: 48 (Professors: 5, Associate Prof: 11, Assistant Prof: 32)',
          status: 'EXTRACTED'
        },
        {
          id: 'EF-21',
          fieldName: 'Cadre Ratio (Prof : Assoc : Asst)',
          fieldValue: '1 : 2.2 : 6.4 (Conforming to 1:2:6 AICTE norm)',
          sourcePage: 3,
          confidence: 95,
          evidenceSnippet: 'Cadre distribution satisfies AICTE Approval Process Handbook norm of 1:2:6',
          status: 'EXTRACTED'
        }
      ],
      verificationRecord: {
        source: 'State University Faculty Approval Database (Simulated)',
        status: 'MATCH',
        referenceNumber: 'SIM-FAC-SPPU-2026-339',
        timestamp: '2026-10-24T10:17:15Z',
        notes: 'Simulated verification confirms 48 approved teachers on university rolls.',
        isSimulated: true
      },
      documentContent: {
        issuingAuthority: 'Apex Institute of Technology & Engineering Governing Council',
        documentNumber: 'AITE/EST/2026/FAC-048',
        issueDate: '2026-10-05',
        sections: [
          {
            heading: 'Cadre Ratio & Faculty Pay Scale Compliance Affidavit',
            body: 'Declaration of faculty appointments, qualifications as per AICTE 7th Pay Commission regulations, and university selection committee approvals for 48 teaching faculty members across engineering departments.'
          }
        ]
      }
    },
    {
      id: 'DOC-8812-09',
      applicationId: 'AICTE-EOA-2026-8812',
      name: 'Affidavit_AICTE_Standard_Format_2026.pdf',
      docType: 'Affidavit',
      fileSize: '1.2 MB',
      uploadedAt: '2026-10-24T10:14:55Z',
      pageCount: 4,
      processingStatus: 'COMPLETED',
      aiStatus: 'NO_ISSUE_DETECTED',
      confidenceScore: 99,
      threeWayComparisons: [
        {
          attributeName: 'Applicant Stamp Paper & Notary Seal',
          applicationValue: 'Duly Executed on Stamp Paper Rs. 100',
          documentValue: 'Executed on Non-Judicial Stamp Paper MH-99104',
          institutionalRecordValue: 'Standard Mandatory Affidavit Format',
          matchStatus: 'MATCH',
          evidenceLocation: 'Page 1, Notary Stamp'
        }
      ],
      extractedFields: [
        {
          id: 'EF-22',
          fieldName: 'Deponent Name & Designation',
          fieldValue: 'Shri Anand M. Joshi, President, Apex Educational Society',
          sourcePage: 1,
          confidence: 99,
          evidenceSnippet: 'I, Anand M. Joshi, Son of Manohar Joshi, aged 58 years, President of Apex Educational Society, do hereby solemnly affirm and state on oath',
          status: 'EXTRACTED'
        },
        {
          id: 'EF-23',
          fieldName: 'Notary Registration',
          fieldValue: 'Adv. R. S. Pathak, Notary Govt. of Maharashtra (Reg: 4410/2012)',
          sourcePage: 4,
          confidence: 98,
          evidenceSnippet: 'Solemnly affirmed before me on 10th October 2026 at Pune by the deponent',
          status: 'EXTRACTED'
        }
      ],
      verificationRecord: {
        source: 'e-Notary & Stamp Registry (Simulated)',
        status: 'MATCH',
        referenceNumber: 'SIM-NOTARY-PUN-99201',
        timestamp: '2026-10-24T10:17:30Z',
        notes: 'Simulated verification confirms valid notary stamp and e-stamp certificate serial.',
        isSimulated: true
      },
      documentContent: {
        issuingAuthority: 'Notary Public, Government of Maharashtra',
        documentNumber: 'NOTARY/MH/2026/AFF-4410',
        issueDate: '2026-10-10',
        sections: [
          {
            heading: 'Affidavit under APH 2026-27 (AICTE Format-1)',
            body: 'Solemn affirmation of compliance with all clauses of AICTE Regulations, unhindered access to students, grievance redressal committee, sexual harassment committee, anti-ragging squad, and non-charging of capitation fee.'
          }
        ]
      }
    },
    {
      id: 'DOC-8812-10',
      applicationId: 'AICTE-EOA-2026-8812',
      name: 'Previous_Year_AICTE_EOA_Order_2025.pdf',
      docType: 'Previous Approval',
      fileSize: '1.5 MB',
      uploadedAt: '2026-10-24T10:15:02Z',
      pageCount: 4,
      processingStatus: 'COMPLETED',
      aiStatus: 'NO_ISSUE_DETECTED',
      confidenceScore: 99,
      threeWayComparisons: [
        {
          attributeName: 'Previous Sanctioned Intake',
          applicationValue: '60 Seats in AY 2025-26',
          documentValue: '60 Seats in AY 2025-26',
          institutionalRecordValue: '60 Seats in AY 2025-26 (AICTE Master Portal Record)',
          matchStatus: 'MATCH',
          evidenceLocation: 'Page 2, Approved Programme Table'
        }
      ],
      extractedFields: [
        {
          id: 'EF-24',
          fieldName: 'AICTE Approval Order Letter',
          fieldValue: 'F.No. Western/1-49201948/2025/EOA dated 18-04-2025',
          sourcePage: 1,
          confidence: 99,
          evidenceSnippet: 'Letter No. Western/1-49201948/2025/EOA issued by Member Secretary, AICTE New Delhi',
          status: 'EXTRACTED'
        },
        {
          id: 'EF-25',
          fieldName: 'Approved Intake AY 2025-26',
          fieldValue: '60 Seats (B.Tech Computer Science & Engineering)',
          sourcePage: 2,
          confidence: 99,
          evidenceSnippet: 'Course: Computer Science & Engineering | Approved Intake for 2025-26: 60',
          status: 'EXTRACTED'
        }
      ],
      verificationRecord: {
        source: 'AICTE National Approval Orders Archive (Simulated)',
        status: 'MATCH',
        referenceNumber: 'SIM-AICTE-EOA-2025-49201',
        timestamp: '2026-10-24T10:17:45Z',
        notes: 'Simulated verification confirms historical EoA letter authenticity and sanctioned intake of 60.',
        isSimulated: true
      },
      documentContent: {
        issuingAuthority: 'All India Council for Technical Education, New Delhi',
        documentNumber: 'F.No. Western/1-49201948/2025/EOA',
        issueDate: '2025-04-18',
        sections: [
          {
            heading: 'All India Council for Technical Education - Extension of Approval Order 2025-26',
            body: 'In terms of provisions under AICTE Act 1987, approval of Council is hereby conveyed to Apex Institute of Technology & Engineering for conduct of courses with Sanctioned Intake of 60 seats in B.Tech Computer Science & Engineering.'
          }
        ]
      }
    },
    {
      id: 'DOC-8812-11',
      applicationId: 'AICTE-EOA-2026-8812',
      name: 'Anti_Ragging_Undertaking_Compliance.pdf',
      docType: 'Undertaking',
      fileSize: '1.1 MB',
      uploadedAt: '2026-10-24T10:15:08Z',
      pageCount: 3,
      processingStatus: 'COMPLETED',
      aiStatus: 'NO_ISSUE_DETECTED',
      confidenceScore: 98,
      threeWayComparisons: [
        {
          attributeName: 'Anti-Ragging Committee Squad',
          applicationValue: 'Constituted & Functional',
          documentValue: 'Constituted & Notified with Police & NGO Reps',
          institutionalRecordValue: 'Mandatory Compliance Recorded',
          matchStatus: 'MATCH',
          evidenceLocation: 'Page 1, Committee Constitution Gazette'
        }
      ],
      extractedFields: [
        {
          id: 'EF-26',
          fieldName: 'Committee Chairman',
          fieldValue: 'Dr. S. K. Deshmukh, Principal',
          sourcePage: 1,
          confidence: 99,
          evidenceSnippet: 'Chairman: Dr. S. K. Deshmukh (Principal), Contact: 9822019481',
          status: 'EXTRACTED'
        },
        {
          id: 'EF-27',
          fieldName: 'Toll-Free Helpline Notification',
          fieldValue: 'National Anti-Ragging Helpline 1800-180-5522 Notified',
          sourcePage: 2,
          confidence: 98,
          evidenceSnippet: 'Prominently displayed at hostel, library, campus entrance',
          status: 'EXTRACTED'
        }
      ],
      verificationRecord: {
        source: 'Aman Satya Movement Anti-Ragging National Portal (Simulated)',
        status: 'MATCH',
        referenceNumber: 'SIM-AR-COMPL-2026-8812',
        timestamp: '2026-10-24T10:18:00Z',
        notes: 'Simulated verification confirms anti-ragging web affidavit compliance.',
        isSimulated: true
      },
      documentContent: {
        issuingAuthority: 'Apex Institute Anti-Ragging Committee',
        documentNumber: 'AITE/ARC/2026/NOTIF-02',
        issueDate: '2026-09-15',
        sections: [
          {
            heading: 'Notification of Anti-Ragging Committee & Squad',
            body: 'As per AICTE (Prevention and Prohibition of Ragging in Technical Institutions) Regulations 2009, committee is notified with representatives of civil administration, police, media, youth organizations, faculty, and parents.'
          }
        ]
      }
    },
    {
      id: 'DOC-8812-12',
      applicationId: 'AICTE-EOA-2026-8812',
      name: 'Trust_Society_Registration_Deed.pdf',
      docType: 'Society Deed',
      fileSize: '3.6 MB',
      uploadedAt: '2026-10-24T10:15:15Z',
      pageCount: 8,
      processingStatus: 'COMPLETED',
      aiStatus: 'NO_ISSUE_DETECTED',
      confidenceScore: 99,
      threeWayComparisons: [
        {
          attributeName: 'Trust / Society Registration Number',
          applicationValue: 'MAH/4910/2004/Pune',
          documentValue: 'MAH/4910/2004/Pune',
          institutionalRecordValue: 'MAH/4910/2004/Pune',
          matchStatus: 'MATCH',
          evidenceLocation: 'Page 1, Charity Commissioner Certificate'
        }
      ],
      extractedFields: [
        {
          id: 'EF-28',
          fieldName: 'Sponsoring Trust Legal Name',
          fieldValue: 'Apex Educational Society, Pune',
          sourcePage: 1,
          confidence: 99,
          evidenceSnippet: 'Apex Educational Society registered under Societies Registration Act 1860',
          status: 'EXTRACTED'
        },
        {
          id: 'EF-29',
          fieldName: 'Charity Commissioner Registration',
          fieldValue: 'F-18492/Pune dated 14-06-2004',
          sourcePage: 2,
          confidence: 99,
          evidenceSnippet: 'Bombay Public Trusts Act 1950 Registration No. F-18492/Pune',
          status: 'EXTRACTED'
        }
      ],
      verificationRecord: {
        source: 'Charity Commissioner e-Registrar (Simulated)',
        status: 'MATCH',
        referenceNumber: 'SIM-TRUST-MH-18492',
        timestamp: '2026-10-24T10:18:15Z',
        notes: 'Simulated verification confirms trust registration is active and legitimate.',
        isSimulated: true
      },
      documentContent: {
        issuingAuthority: 'Office of Assistant Charity Commissioner, Pune Division',
        documentNumber: 'ACC/PUNE/CERT/F-18492',
        issueDate: '2004-06-14',
        sections: [
          {
            heading: 'Certificate of Registration of Public Trust',
            body: 'Certified that Apex Educational Society has this day been duly registered under Bombay Public Trusts Act 1950 (Bom. XXIX of 1950) at Public Trusts Registration Office, Pune.'
          }
        ]
      }
    }
  ]
};

export const INITIAL_FINDINGS: Record<string, Finding[]> = {
  'AICTE-EOA-2026-8812': [
    {
      id: 'FINDING-8812-01',
      applicationId: 'AICTE-EOA-2026-8812',
      documentId: 'DOC-8812-01',
      documentName: 'Programme_Course_Intake_Proposal_2026.pdf',
      findingType: 'THREE_WAY_INTAKE_MISMATCH',
      title: 'POTENTIAL INTAKE MISMATCH DETECTED',
      severity: 'HIGH',
      whatDetected: 'Current application form requests an approved intake of 120 seats, which conflicts with both the submitted programme course document (60 seats) and existing AICTE master records (60 seats).',
      whyDetected: 'The automated three-way cross-verification detected a +100% capacity inflation in the application form without any Council capacity expansion sanction or supporting university affiliation order.',
      evidenceText: 'Application Form: Requested Intake = 120 Seats\nProgramme Document (Page 3, Table 4.1): Approved Intake = 60 Seats\nPrevious AICTE Record (EoA 2025): Approved Intake = 60 Seats',
      sourcesCompared: [
        {
          source: 'Application Form Data',
          value: '120 Seats',
          reference: 'Form Intake Schedule — Section 2, Item B'
        },
        {
          source: 'Submitted Programme Document',
          value: '60 Seats',
          reference: 'Page 3, Table 4.1: Approved Course Capacity'
        },
        {
          source: 'Existing AICTE Master Approval Records',
          value: '60 Seats',
          reference: 'EoA 2025-26 (F.No. Western/1-49201948/2025/EOA)'
        }
      ],
      recommendedAction: 'Manual verification required. Officer should verify whether institution requested intake increase with requisite TER fees and infrastructure expansion inspection, or restrict approved intake to sanctioned capacity of 60 seats.',
      aiConfidence: 96,
      status: 'ACTIVE'
    },
    {
      id: 'FINDING-8812-02',
      applicationId: 'AICTE-EOA-2026-8812',
      documentId: 'DOC-8812-02',
      documentName: 'NBA_Accreditation_Certificate.pdf',
      findingType: 'EXTERNAL_REGISTRY_UNAVAILABLE',
      title: 'EXTERNAL AUTHORITY VERIFICATION UNRESOLVED',
      severity: 'MEDIUM',
      whatDetected: 'National Board of Accreditation (NBA) external verification service simulated query could not be completed automatically (service timed out / pending registry sync).',
      whyDetected: 'Automated verification relies on live issuing authority gateways. When the simulated authority gateway does not return a conclusive match, the system routes the certificate to manual human inspection.',
      evidenceText: 'NBA Certificate submitted: NBA/ACCRED/2024/MAH-118\nSimulated Gateway Query: SIM-NBA-VERIFY-9921\nStatus: UNABLE TO VERIFY (External Gateway Timeout)',
      sourcesCompared: [
        {
          source: 'Submitted Certificate',
          value: 'Tier-II Accredited up to 30-06-2027',
          reference: 'Page 1, Paragraph 2'
        },
        {
          source: 'External Authority Registry',
          value: 'Unable to verify (Gateway Timeout)',
          reference: 'Simulated NBA Web Service'
        }
      ],
      recommendedAction: 'Officer to manually inspect certificate seal, signature of Member Secretary NBA, and cross-reference against the published NBA gazette directory.',
      aiConfidence: 88,
      status: 'ACTIVE'
    },
    {
      id: 'FINDING-8812-03',
      applicationId: 'AICTE-EOA-2026-8812',
      documentId: 'DOC-8812-03',
      documentName: 'Infrastructure_Lab_Report.pdf',
      findingType: 'GEO_TAG_EVIDENCE_INCOMPLETE',
      title: 'GEO-TAGGED INFRASTRUCTURE EVIDENCE MISSING',
      severity: 'MEDIUM',
      whatDetected: 'Photographic evidence for newly established AI & Robotics Laboratory lacks EXIF latitude and longitude coordinates metadata.',
      whyDetected: 'AICTE Approval Process Handbook (APH 2026-27 Clause 4.2) requires geotagged photographic proof with time-stamp for newly added computing labs.',
      evidenceText: 'Report Page 8, Section 3.4: Photographs presented without digital GPS coordinates metadata overlay.',
      sourcesCompared: [
        {
          source: 'Regulatory Rule Norm',
          value: 'Geotagged photographs with latitude/longitude required',
          reference: 'AICTE APH 2026-27 Clause 4.2'
        },
        {
          source: 'Submitted Report Evidence',
          value: 'Standard print photos without EXIF coordinate tags',
          reference: 'Report Page 8, Section 3.4'
        }
      ],
      recommendedAction: 'Manual verification required. Officer to review physical inspection history or require institution to submit geotagged photographic upload.',
      aiConfidence: 82,
      status: 'ACTIVE'
    },
    {
      id: 'FINDING-8812-04',
      applicationId: 'AICTE-EOA-2026-8812',
      documentId: 'DOC-8812-04',
      documentName: 'Municipal_Occupancy_Permission.pdf',
      findingType: 'STAMP_LEGIBILITY_AMBIGUITY',
      title: 'MUNICIPAL RENEWAL STAMP DATE AMBIGUITY',
      severity: 'MEDIUM',
      whatDetected: 'Renewal endorsement stamp on Page 2 exhibits ink blurring on final year digit of expiry date.',
      whyDetected: 'OCR confidence score dropped below threshold (72%) for expiry date field. Automated system does not guess ambiguous dates.',
      evidenceText: 'Occupancy Certificate Page 2: Stamp reads "Validity renewed up to 31-12-202[X]" where last digit cannot be resolved with certainty.',
      sourcesCompared: [
        {
          source: 'Application Form Assertion',
          value: 'Valid through 31-12-2028',
          reference: 'Form Infrastructure Section'
        },
        {
          source: 'Submitted Document Stamp',
          value: 'Digit blur: 31-12-202[?]',
          reference: 'Page 2 Renewal Seal'
        }
      ],
      recommendedAction: 'Officer to manually inspect scanned original copy to confirm whether renewal extends through the upcoming academic year.',
      aiConfidence: 74,
      status: 'ACTIVE'
    }
  ]
};

export const INITIAL_CHECKLIST_RULES: Record<string, ChecklistRule[]> = {
  'AICTE-EOA-2026-8812': [
    {
      id: 'CHK-01',
      ruleCode: 'APH-NORM-2.14',
      category: 'Academic & Intake',
      requirementName: 'Approved Intake vs Council Sanction & Institutional History',
      statutoryClause: 'AICTE Approval Process Handbook (APH) 2026-27, Clause 2.14.3',
      evaluationStatus: 'POTENTIAL_DEFICIENCY',
      evidenceSummary: 'Three-way mismatch detected: Application claims 120 seats, while submitted programme proposal and Council master records sanction 60 seats.',
      mappedDocumentId: 'DOC-8812-01'
    },
    {
      id: 'CHK-02',
      ruleCode: 'APH-NORM-1.08',
      category: 'Statutory & Land',
      requirementName: 'Land Area Ownership & Non-Agricultural Use Certification',
      statutoryClause: 'AICTE Approval Process Handbook 2026-27, Appendix 4 (Land Norms)',
      evaluationStatus: 'COMPLIANT',
      evidenceSummary: '5.20 Acres contiguous freehold land in absolute ownership of Apex Educational Society at Survey No. 44/2A Bavdhan Pune. Collector NA order verified.',
      mappedDocumentId: 'DOC-8812-06'
    },
    {
      id: 'CHK-03',
      ruleCode: 'APH-NORM-1.12',
      category: 'Infrastructure',
      requirementName: 'Sanctioned Built-Up Instructional Area',
      statutoryClause: 'AICTE Approval Process Handbook 2026-27, Appendix 4.1',
      evaluationStatus: 'COMPLIANT',
      evidenceSummary: 'Built-up area of 12,450 sq.m certified by Council of Architecture registered architect. Exceeds minimum required 8,500 sq.m for 240 cumulative capacity.',
      mappedDocumentId: 'DOC-8812-07'
    },
    {
      id: 'CHK-04',
      ruleCode: 'APH-NORM-3.04',
      category: 'Regulatory Clearances',
      requirementName: 'Fire and Life Safety NOC Compliance',
      statutoryClause: 'AICTE Approval Process Handbook 2026-27, Clause 3.4.1',
      evaluationStatus: 'COMPLIANT',
      evidenceSummary: 'Fire Safety Certificate MFS/NOC/PUNE/2024/77481 issued by Directorate of Maharashtra Fire Services, valid until 14-11-2027.',
      mappedDocumentId: 'DOC-8812-05'
    },
    {
      id: 'CHK-05',
      ruleCode: 'APH-NORM-4.02',
      category: 'Infrastructure',
      requirementName: 'Laboratory Equipment & Geotagged Physical Evidence',
      statutoryClause: 'AICTE Approval Process Handbook 2026-27, Clause 4.2.2',
      evaluationStatus: 'MANUAL_VERIFICATION_PENDING',
      evidenceSummary: '28 laboratories reported operational. Geotag EXIF coordinates missing for newly constructed AI & Robotics lab. Manual review required.',
      mappedDocumentId: 'DOC-8812-03'
    },
    {
      id: 'CHK-06',
      ruleCode: 'APH-NORM-2.07',
      category: 'Faculty & Cadre',
      requirementName: 'Faculty-to-Student Ratio & Cadre Distribution',
      statutoryClause: 'AICTE Approval Process Handbook 2026-27, Appendix 7 (Faculty Cadre 1:2:6)',
      evaluationStatus: 'COMPLIANT',
      evidenceSummary: '48 regular full-time faculty members declared. Cadre ratio 1:2.2:6.4 satisfies statutory 1:2:6 requirement. University approvals on file.',
      mappedDocumentId: 'DOC-8812-08'
    },
    {
      id: 'CHK-07',
      ruleCode: 'APH-NORM-5.01',
      category: 'Regulatory Clearances',
      requirementName: 'National Board of Accreditation (NBA) Verification',
      statutoryClause: 'AICTE Approval Process Handbook 2026-27, Chapter 2 (Accredited Programmes)',
      evaluationStatus: 'MANUAL_VERIFICATION_PENDING',
      evidenceSummary: 'Certificate submitted for Tier-II accreditation up to 30-06-2027. Automated external verification gateway returned timeout. Manual verification pending.',
      mappedDocumentId: 'DOC-8812-02'
    },
    {
      id: 'CHK-08',
      ruleCode: 'APH-NORM-5.05',
      category: 'Regulatory Clearances',
      requirementName: 'Anti-Ragging Committee & Mandatory Undertakings',
      statutoryClause: 'AICTE Anti-Ragging Regulations 2009',
      evaluationStatus: 'COMPLIANT',
      evidenceSummary: 'Anti-ragging committee and squad constituted with police, civil, and parental representatives. Toll-free helpline notified.',
      mappedDocumentId: 'DOC-8812-11'
    }
  ]
};

export const INITIAL_AUDIT_TRAIL: Record<string, AuditEvent[]> = {
  'AICTE-EOA-2026-8812': [
    {
      id: 'AUD-01',
      applicationId: 'AICTE-EOA-2026-8812',
      timestamp: '2026-10-24T10:14:00Z',
      eventType: 'APPLICATION_RECEIVED',
      actor: 'Simulated AICTE Portal Intake Gateway',
      action: 'Application Registered & Ingested',
      result: 'Application AICTE-EOA-2026-8812 created for Apex Institute of Technology & Engineering (Permanent ID: 1-49201948)',
      evidenceRef: 'POST /api/applications/intake'
    },
    {
      id: 'AUD-02',
      applicationId: 'AICTE-EOA-2026-8812',
      timestamp: '2026-10-24T10:15:15Z',
      eventType: 'DOCUMENTS_REGISTERED',
      actor: 'AI Scrutiny Ingestion Worker',
      action: '12 Supporting Documents Registered',
      result: '12 PDF documents ingested, cryptographic SHA-256 hashes generated, file integrity validated',
      evidenceRef: 'DOC-8812-01 through DOC-8812-12'
    },
    {
      id: 'AUD-03',
      applicationId: 'AICTE-EOA-2026-8812',
      timestamp: '2026-10-24T10:15:25Z',
      eventType: 'DOCUMENT_CLASSIFICATION_AND_OCR',
      actor: 'Document Intelligence Engine (PyMuPDF / Text Parser)',
      action: 'Classification & Structured Field Extraction',
      result: '12 documents classified into 8 regulatory categories; 29 structured metadata fields extracted',
      evidenceRef: 'ExtractedFields Table'
    },
    {
      id: 'AUD-04',
      applicationId: 'AICTE-EOA-2026-8812',
      timestamp: '2026-10-24T10:15:35Z',
      eventType: 'THREE_WAY_COMPARISON_EXECUTED',
      actor: 'Cross-Source Comparison Engine',
      action: 'Application vs Documents vs AICTE Master Records Compared',
      result: 'FLAGGED: Requested intake in Application (120) differs from Document (60) and Council Master Record (60)',
      evidenceRef: 'FINDING-8812-01'
    },
    {
      id: 'AUD-05',
      applicationId: 'AICTE-EOA-2026-8812',
      timestamp: '2026-10-24T10:15:45Z',
      eventType: 'SIMULATED_AUTHORITY_VERIFICATION',
      actor: 'External Authority Gateway Prober (Simulated)',
      action: 'Cross-check against Fire, Revenue, Municipal, and NBA registries',
      result: 'Fire NOC: MATCH; Land: MATCH; Built-Up: MATCH; NBA: UNABLE TO VERIFY (Gateway Timeout); Municipal: PENDING (Stamp ambiguity)',
      evidenceRef: 'SIM-VERIFY-SUMMARY-8812'
    },
    {
      id: 'AUD-06',
      applicationId: 'AICTE-EOA-2026-8812',
      timestamp: '2026-10-24T10:16:00Z',
      eventType: 'CHECKLIST_EVALUATION_COMPLETED',
      actor: 'Regulatory Rules Engine (APH 2026-27)',
      action: '8 Statutory Rules Evaluated',
      result: '5 Rules Compliant, 1 Potential Deficiency, 2 Manual Verification Pending. Overall Status: REVIEW REQUIRED',
      evidenceRef: 'APH-NORM-2.14, APH-NORM-4.02'
    },
    {
      id: 'AUD-07',
      applicationId: 'AICTE-EOA-2026-8812',
      timestamp: '2026-10-24T10:16:10Z',
      eventType: 'DOSSIER_DISPATCHED_TO_OFFICER_QUEUE',
      actor: 'Scrutiny Dispatcher',
      action: 'Assigned Review Priority: HIGH',
      result: 'Application made available on Officer Scrutiny Console for manual human verification and final regulatory decision-making',
      evidenceRef: 'Officer Queue: Western Region'
    }
  ]
};
