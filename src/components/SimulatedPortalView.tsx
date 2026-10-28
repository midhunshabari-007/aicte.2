import React, { useState } from 'react';
import { InstitutionMasterRecord, Application } from '../types/scrutiny';
import { 
  Building2, 
  FileUp, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowRight, 
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Info,
  Layers,
  FileText,
  Video,
  Upload,
  MapPin
} from 'lucide-react';

interface SimulatedPortalViewProps {
  institutions: InstitutionMasterRecord[];
  onSubmitIntake: (payload: {
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
  }) => Promise<Application>;
  onNavigateToOfficerConsole: (applicationId?: string) => void;
}

export const SimulatedPortalView: React.FC<SimulatedPortalViewProps> = ({
  institutions,
  onSubmitIntake,
  onNavigateToOfficerConsole
}) => {
  const [selectedInstId, setSelectedInstId] = useState<string>(institutions[0]?.permanentId || '1-49201948');
  const [category, setCategory] = useState('Extension of Approval (EoA)');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [requestedIntake, setRequestedIntake] = useState<number>(120);
  const [facultyCount, setFacultyCount] = useState<number>(48);
  const [landAcres, setLandAcres] = useState<number>(5.2);
  const [attachVideoProof, setAttachVideoProof] = useState<boolean>(true);
  const [customVideoFileName, setCustomVideoFileName] = useState<string>('Apex_AI_Robotics_Lab_Walkthrough_Geotagged.mp4');
  const [customVideoUrl, setCustomVideoUrl] = useState<string | undefined>(undefined);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0);

  const selectedInst = institutions.find(i => i.permanentId === selectedInstId) || institutions[0];

  const pipelineStages = [
    'POST /api/applications/intake: Ingesting application metadata...',
    'Validating 12 PDF documents & generating SHA-256 integrity hashes...',
    attachVideoProof 
      ? 'Ingesting Geotagged Video Walkthrough (MP4) & extracting EXIF GPS metadata...'
      : 'Extracting digital text streams and document classification...',
    attachVideoProof
      ? 'Running AI Computer Vision frame analysis: 60 computing workstations & robotic arm detected...'
      : 'Extracting structured fields (Intake, Expiry Dates, PWD Certificates, Cadre Ratios)...',
    'Executing Three-Way Cross-Check (Form Data ↔ Submitted Docs ↔ AICTE Master Baseline)...',
    'Simulating External Issuing Authority Probes (State Fire, Revenue, Municipal, NBA)...',
    'Evaluating AICTE Approval Process Handbook (APH 2026-27) Statutory Ruleset...',
    'Dossier Scrutiny Ready: Flagged 1 Potential Issue, 3 Verification Items (Video Proof Verified). Routing to Officer...'
  ];

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCustomVideoFileName(file.name);
      try {
        const blobUrl = URL.createObjectURL(file);
        setCustomVideoUrl(blobUrl);
      } catch {
        // fallback
      }
      setAttachVideoProof(true);
    }
  };

  const handleSimulateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setPipelineStep(0);

    // Animate pipeline stages
    for (let step = 0; step < pipelineStages.length; step++) {
      setPipelineStep(step);
      await new Promise(r => setTimeout(r, 650));
    }

    try {
      const createdApp = await onSubmitIntake({
        institutionId: selectedInst ? `INST-AICTE-${selectedInst.permanentId}` : 'INST-AICTE-1-49201948',
        institutionName: selectedInst?.institutionName || 'Apex Institute of Technology & Engineering',
        applicationCategory: category,
        academicYear,
        requestedIntake: Number(requestedIntake),
        totalFaculty: Number(facultyCount),
        totalLandAcres: Number(landAcres),
        includeVideoProof: attachVideoProof,
        videoName: customVideoFileName,
        videoUrl: customVideoUrl
      });

      setIsProcessing(false);
      onNavigateToOfficerConsole(createdApp.id);
    } catch {
      setIsProcessing(false);
      onNavigateToOfficerConsole();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Scope and Disclaimer Notice */}
      <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-xl p-5 text-slate-800">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-700 shrink-0">
            <ExternalLink className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Demo: Simulated AICTE Submission Portal
              </h3>
              <span className="text-[10px] uppercase font-mono font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                Demo Intake Simulator
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              This simulated portal demonstrates how an institutional application enters the scrutiny platform. 
              In production, our AI scrutiny layer receives submitted applications, documents, and <strong>geotagged video proofs</strong> after submission through the official portal.
            </p>
            <div className="mt-2 text-[11px] font-mono text-slate-600">
              Architecture Status: <strong className="text-slate-800">Prototype integration-ready architecture</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSimulateSubmit} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
        
        {/* Step 1: Institution Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
            1. Select Demo Institution:
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {institutions.map(inst => (
              <label 
                key={inst.permanentId}
                className={`p-3.5 rounded-xl border-2 text-left cursor-pointer transition-all ${
                  selectedInstId === inst.permanentId
                    ? 'border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="institution"
                  checked={selectedInstId === inst.permanentId}
                  onChange={() => setSelectedInstId(inst.permanentId)}
                  className="sr-only"
                />
                <div className="font-bold text-xs text-slate-900 leading-snug">{inst.institutionName}</div>
                <div className="font-mono text-[11px] text-amber-700 mt-1">ID: {inst.permanentId}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{inst.region}</div>
                <div className="text-[10px] font-semibold text-slate-700 mt-2 pt-2 border-t border-slate-200">
                  Prev Sanctioned: <span className="font-mono">{inst.sanctionedIntake} Seats</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Step 2: Application Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
              2. Application Category:
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 text-xs rounded-lg border border-slate-300 bg-slate-50 font-medium"
            >
              <option value="Extension of Approval (EoA)">Extension of Approval (EoA)</option>
              <option value="Increase in Intake / Additional Course">Increase in Intake / Additional Course</option>
              <option value="Introduction of New Programme">Introduction of New Programme</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
              Academic Session:
            </label>
            <input
              type="text"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full p-2.5 text-xs rounded-lg border border-slate-300 bg-slate-50 font-mono"
            />
          </div>
        </div>

        {/* Step 3: Application Data & Discrepancy Generator */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              3. Application Data Entered in Portal Form:
            </label>
            <span className="text-[11px] text-rose-700 font-medium">
              * Set to 120 to trigger the demonstration three-way intake mismatch!
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Requested Intake (Seats):
              </label>
              <input
                type="number"
                value={requestedIntake}
                onChange={(e) => setRequestedIntake(Number(e.target.value))}
                className="w-full p-2 text-xs rounded border border-slate-300 font-mono font-bold bg-white text-slate-900 focus:ring-2 focus:ring-amber-500/20"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Master baseline is <strong>60</strong>. Entering <strong>120</strong> creates the demonstration mismatch.
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Total Regular Faculty on Rolls:
              </label>
              <input
                type="number"
                value={facultyCount}
                onChange={(e) => setFacultyCount(Number(e.target.value))}
                className="w-full p-2 text-xs rounded border border-slate-300 font-mono bg-white text-slate-900"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Required cadre ratio: 1:2:6
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Campus Land Area (Acres):
              </label>
              <input
                type="number"
                step="0.1"
                value={landAcres}
                onChange={(e) => setLandAcres(Number(e.target.value))}
                className="w-full p-2 text-xs rounded border border-slate-300 font-mono bg-white text-slate-900"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Minimum rural/urban: 5.0 acres
              </span>
            </div>
          </div>
        </div>

        {/* Step 4: Supporting Documents + VIDEO PROOF UPLOAD */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              4. Supporting Documents & Video Proof Evidence:
            </label>
            <span className="text-xs font-mono text-slate-500">12 Documents + 1 Video Proof</span>
          </div>

          {/* Video Proof Upload Card */}
          <div className="border-2 border-amber-300 bg-amber-50/30 rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-500 text-slate-950">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">
                      Geotagged Video Walkthrough Proof (MP4)
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                      EXIF GPS + Computer Vision
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Provides continuous physical inspection video of Advanced AI & Robotics Laboratory for Council verification.
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={attachVideoProof}
                  onChange={(e) => setAttachVideoProof(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <span className="text-xs font-bold text-slate-800">Attach to Submission</span>
              </label>
            </div>

            {attachVideoProof && (
              <div className="pt-2 border-t border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-700">
                  <span className="font-semibold text-amber-900">Active File:</span>
                  <span className="bg-white px-2 py-1 rounded border border-slate-300 font-bold truncate max-w-xs">
                    {customVideoFileName}
                  </span>
                  <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-sans">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>GPS Stamp: 18.5196° N, 73.7828° E</span>
                  </span>
                </div>

                <div>
                  <label className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 cursor-pointer flex items-center gap-1.5 shadow-2xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose Other Video (.mp4)</span>
                    <input
                      type="file"
                      accept="video/mp4,video/*"
                      onChange={handleVideoFileChange}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* 12 PDFs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-[11px]">
            {[
              'Programme_Intake_Proposal.pdf',
              'NBA_Accreditation_Cert.pdf',
              'Fire_Safety_NOC.pdf',
              'Land_Title_Deed_7_12.pdf',
              'Building_Completion_Cert.pdf',
              'Municipal_Occupancy_Perm.pdf',
              'Infrastructure_Lab_Report.pdf',
              'Faculty_Cadre_Declaration.pdf',
              'Affidavit_AICTE_Format.pdf',
              'Previous_EoA_Order_2025.pdf',
              'Anti_Ragging_Affidavit.pdf',
              'Trust_Registration_Deed.pdf'
            ].map((name, i) => (
              <div key={i} className="p-2 rounded bg-slate-50 border border-slate-200 flex items-center gap-1.5 truncate">
                <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate text-slate-700">{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Processing Modal / Overlay */}
        {isProcessing && (
          <div className="p-5 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                <span className="font-bold text-xs uppercase tracking-wider text-amber-400">
                  AI Preliminary Scrutiny Pipeline Running
                </span>
              </div>
              <span className="font-mono text-xs text-slate-400">
                Stage {pipelineStep + 1} of {pipelineStages.length}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-amber-500 h-1.5 transition-all duration-300"
                style={{ width: `${((pipelineStep + 1) / pipelineStages.length) * 100}%` }}
              />
            </div>

            {/* Current step text */}
            <div className="font-mono text-xs text-slate-200">
              &gt; {pipelineStages[pipelineStep]}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
          <button
            type="button"
            onClick={() => onNavigateToOfficerConsole()}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Switch to Officer Scrutiny Console
          </button>

          <button
            type="submit"
            disabled={isProcessing}
            className="px-6 py-2.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            <span>
              {attachVideoProof
                ? 'Submit Application with Video Proof to AICTE'
                : 'Submit Application Proof to AICTE'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>
    </div>
  );
};
