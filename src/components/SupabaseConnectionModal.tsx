import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Copy, 
  Check, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Key, 
  Globe,
  Terminal,
  ShieldAlert,
  Sparkles,
  Save,
  RotateCcw
} from 'lucide-react';
import { getSupabaseConfig, saveSupabaseConfig, clearSupabaseConfig } from '../lib/supabase';

interface SupabaseConnectionModalProps {
  onClose: () => void;
}

export const SupabaseConnectionModal: React.FC<SupabaseConnectionModalProps> = ({ onClose }) => {
  const currentConfig = getSupabaseConfig();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'connect' | 'steps' | 'sql'>('connect');
  
  // Interactive credentials form
  const [urlInput, setUrlInput] = useState(currentConfig.url || '');
  const [keyInput, setKeyInput] = useState(currentConfig.key || '');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleSaveAndTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim() || !keyInput.trim()) {
      setSaveStatus('Please enter both Project URL / Ref ID and Publisher Key');
      return;
    }

    setIsTesting(true);
    setSaveStatus(null);

    let cleanUrl = urlInput.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}.supabase.co`;
    }

    try {
      saveSupabaseConfig(cleanUrl, keyInput.trim());
      setSaveStatus('Credentials saved successfully! Reloading connection...');
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (err: any) {
      setSaveStatus(`Error saving: ${err.message}`);
      setIsTesting(false);
    }
  };

  const handleDisconnect = () => {
    clearSupabaseConfig();
    setUrlInput('');
    setKeyInput('');
    setSaveStatus('Disconnected. Switched back to in-memory local demo mode.');
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  const copySql = () => {
    const sqlContent = `-- AICTE AI-ASSISTED SCRUTINY PLATFORM - SUPABASE SCHEMA
-- Run this in Supabase Dashboard -> SQL Editor -> New Query

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
`;

    navigator.clipboard.writeText(sqlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-300 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Supabase PostgreSQL Integration</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  currentConfig.isConfigured 
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-700' 
                    : 'bg-amber-950 text-amber-400 border-amber-700'
                }`}>
                  {currentConfig.isConfigured ? 'CONNECTED' : 'LOCAL DEMO MODE'}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Connect your live PostgreSQL database using Project URL & Publisher Key
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center border-b border-slate-200 px-6 bg-slate-50 shrink-0 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('connect')}
            className={`py-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'connect'
                ? 'border-emerald-600 text-emerald-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Direct Connect
          </button>
          <button
            onClick={() => setActiveTab('steps')}
            className={`py-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'steps'
                ? 'border-emerald-600 text-emerald-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Step-by-Step Instructions
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`py-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'sql'
                ? 'border-emerald-600 text-emerald-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            SQL Migration Script (Copy & Run)
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          
          {/* TAB 1: Direct Connect Form */}
          {activeTab === 'connect' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-950">
                <div className="font-bold text-xs">Direct Connect Form:</div>
                <p className="text-[11px] mt-0.5 text-emerald-800 leading-relaxed">
                  Neenga `.env` file open panna kooda thevailla! Inga unga <strong>Project URL (or Ref ID)</strong> and <strong>Publisher Key</strong> paste panninaale app live database-ku connect aagidum.
                </p>
              </div>

              <form onSubmit={handleSaveAndTest} className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    1. Supabase Project URL or Reference ID:
                  </label>
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://xyzabcdefghijklm.supabase.co  OR  xyzabcdefghijklm"
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-300 font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Tip: Unga Supabase browser URL-la <code>/project/<strong>abcdefghijklm</strong>/</code> nu irukkura code-a mattum kooda paste pannalam!
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    2. Publisher Key (Publishable / Anon API Key):
                  </label>
                  <input
                    type="text"
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    placeholder="sbp_... or eyJhbGciOi..."
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-300 font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Supabase Dashboard-la "Project Settings -&gt; API -&gt; Project API keys -&gt; Publishable key" copy pannunga. (Secret key vendam).
                  </span>
                </div>

                {saveStatus && (
                  <div className={`p-2.5 rounded-lg text-xs font-semibold ${
                    saveStatus.includes('successfully') 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {saveStatus}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  {currentConfig.isConfigured ? (
                    <button
                      type="button"
                      onClick={handleDisconnect}
                      className="px-3 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      Disconnect Database
                    </button>
                  ) : <div />}

                  <button
                    type="submit"
                    disabled={isTesting}
                    className="px-5 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isTesting ? 'Connecting...' : 'Save & Connect Live DB'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Step-by-Step Instructions */}
          {activeTab === 'steps' && (
            <div className="space-y-4">
              
              {/* Step 1 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono font-bold flex items-center justify-center text-xs">
                    1
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Project Reference ID Kandupidikka:
                  </h4>
                </div>
                <div className="pl-8 text-slate-700 space-y-1">
                  <p>Neenga Supabase Dashboard-la irukumbothu, browser top address bar-a paarunga:</p>
                  <pre className="p-2.5 rounded bg-slate-900 text-emerald-300 font-mono text-[11px] overflow-x-auto">
https://supabase.com/dashboard/project/<strong>abcdefghijklmnopqrst</strong>/settings/api
                  </pre>
                  <p className="text-[11px] text-slate-600">
                    Athula `/project/` ku apram irukkura antha <strong>20 letters code</strong> thaan unga Project Ref ID! Athai "Direct Connect" tab-la paste pannale pothum.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono font-bold flex items-center justify-center text-xs">
                    2
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Tables Create Panna SQL Script Run Pannunga
                  </h4>
                </div>
                <div className="pl-8 text-slate-700 space-y-1">
                  <p>Database-la tables create panna:</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-800">
                    <li>Left sidebar-la irukira <strong>SQL Editor</strong> icon-a click pannunga.</li>
                    <li><strong>"New Query"</strong> click pannunga.</li>
                    <li>Mela irukira <strong>"SQL Migration Script"</strong> tab-la irundhu code-a copy panni paste pannunga.</li>
                    <li>Green color <strong>Run (Ctrl+Enter)</strong> button click pannunga.</li>
                    <li><em>"Success. No rows returned"</em> nu varum. All 6 tables (`applications`, `documents`, etc.) create aagidum!</li>
                  </ul>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono font-bold flex items-center justify-center text-xs">
                    3
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Publisher Key (Publishable API Key)
                  </h4>
                </div>
                <div className="pl-8 text-slate-700 space-y-1">
                  <p>Supabase-la:</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-800">
                    <li><strong>Project Settings (Gear icon) -&gt; API</strong> ponga.</li>
                    <li>Anga <strong>Publisher key</strong> (or Publishable key) copy pannunga.</li>
                    <li>"Direct Connect" tab-la paste panni <strong>Save & Connect</strong> click pannunga.</li>
                  </ul>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: SQL Script */}
          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-slate-600 text-xs">
                  Copy this SQL and paste it into Supabase <strong>SQL Editor</strong>:
                </p>
                <button
                  onClick={copySql}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Entire SQL Schema'}</span>
                </button>
              </div>

              <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] overflow-x-auto max-h-96 border border-slate-800">
                <pre>{`-- 1. INSTITUTIONS TABLE
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

-- RLS POLICIES (DROP & RECREATE SAFELY)
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
CREATE POLICY "Allow public read/write audit_events" ON audit_events FOR ALL USING (true) WITH CHECK (true);`}</pre>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            Saved schema is also available at <code>/supabase/schema.sql</code> in workspace.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800"
          >
            Got it, Close
          </button>
        </div>

      </div>
    </div>
  );
};
