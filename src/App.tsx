import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { OfficerDashboard } from './components/OfficerDashboard';
import { ApplicationDetailView } from './components/ApplicationDetailView';
import { SimulatedPortalView } from './components/SimulatedPortalView';
import { WalkthroughModal } from './components/WalkthroughModal';
import { SupabaseConnectionModal } from './components/SupabaseConnectionModal';
import { scrutinyStore } from './services/scrutinyService';
import { 
  Application, 
  DocumentItem, 
  Finding, 
  ChecklistRule, 
  AuditEvent, 
  InstitutionMasterRecord, 
  OfficialDecisionType 
} from './types/scrutiny';

export function App() {
  const [, setTick] = useState(0);
  const [currentView, setCurrentView] = useState<'officer_console' | 'simulated_portal'>('officer_console');
  const [selectedAppId, setSelectedAppId] = useState<string | null>('AICTE-EOA-2026-8812');
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);

  // Subscribe to reactive store updates
  useEffect(() => {
    const unsubscribe = scrutinyStore.subscribe(() => {
      setTick(t => t + 1);
    });
    return unsubscribe;
  }, []);

  const applications = scrutinyStore.getApplications();
  const selectedApp = selectedAppId ? scrutinyStore.getApplication(selectedAppId) : null;
  const documents = selectedAppId ? scrutinyStore.getDocuments(selectedAppId) : [];
  const findings = selectedAppId ? scrutinyStore.getFindings(selectedAppId) : [];
  const checklist = selectedAppId ? scrutinyStore.getChecklist(selectedAppId) : [];
  const auditTrail = selectedAppId ? scrutinyStore.getAuditTrail(selectedAppId) : [];
  const institution = selectedApp ? scrutinyStore.getInstitution(selectedApp.institutionId) : undefined;
  const institutionsList = scrutinyStore.getInstitutionsList();

  const handleResetDemo = () => {
    scrutinyStore.resetToDemo();
    setSelectedAppId('AICTE-EOA-2026-8812');
    setCurrentView('officer_console');
  };

  const handleSubmitIntake = async (payload: {
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
  }) => {
    const createdApp = scrutinyStore.intakeApplication(payload);
    return createdApp;
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900 font-sans">
      {/* Top Ministerial & Navigation Header */}
      <Header
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          if (view === 'officer_console' && !selectedAppId) {
            setSelectedAppId('AICTE-EOA-2026-8812');
          }
        }}
        onResetDemo={handleResetDemo}
        onOpenWalkthrough={() => setShowWalkthrough(true)}
        onOpenSupabaseModal={() => setShowSupabaseModal(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {currentView === 'simulated_portal' ? (
          <SimulatedPortalView
            institutions={institutionsList}
            onSubmitIntake={handleSubmitIntake}
            onNavigateToOfficerConsole={(appId) => {
              if (appId) setSelectedAppId(appId);
              setCurrentView('officer_console');
            }}
          />
        ) : (
          <>
            {selectedApp ? (
              <ApplicationDetailView
                application={selectedApp}
                documents={documents}
                findings={findings}
                checklist={checklist}
                auditTrail={auditTrail}
                institution={institution}
                onBack={() => setSelectedAppId(null)}
                onAddObservation={(findingId, obs) => {
                  scrutinyStore.addOfficerObservation(findingId, obs);
                }}
                onResolveFinding={(findingId, notes) => {
                  scrutinyStore.resolveFinding(findingId, notes);
                }}
                onOverrideFinding={(findingId, conc, reason) => {
                  scrutinyStore.overrideFinding(findingId, conc, reason);
                }}
                onRecordDecision={(dec, notes, offName, desig) => {
                  scrutinyStore.recordOfficialDecision(selectedApp.id, dec, notes, offName, desig);
                }}
              />
            ) : (
              <OfficerDashboard
                applications={applications}
                onSelectApplication={(id) => setSelectedAppId(id)}
                onOpenIntakeModal={() => setCurrentView('simulated_portal')}
              />
            )}
          </>
        )}
      </main>

      {/* Footer with statutory notices and architecture footnote */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-6 px-6 text-xs mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="text-slate-200 font-semibold">
              All India Council for Technical Education (AICTE) · Bureau of Approvals
            </div>
            <div className="text-slate-400 text-[11px]">
              Nelson Mandela Marg, Vasant Kunj, New Delhi-110070 · Approval Process Handbook (APH 2026–27)
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400 font-mono">
            <span>AI: Decision-Support Only</span>
            <span>·</span>
            <span>Authorized Officer: Verification & Final Decision</span>
            <span>·</span>
            <span className="text-amber-400">Prototype Integration-Ready Architecture</span>
          </div>
        </div>
      </footer>

      {/* Step-by-Step Walkthrough Guide Modal */}
      {showWalkthrough && (
        <WalkthroughModal
          onClose={() => setShowWalkthrough(false)}
          onNavigateToPortal={() => {
            setCurrentView('simulated_portal');
            setShowWalkthrough(false);
          }}
          onNavigateToOfficerConsole={(appId) => {
            if (appId) setSelectedAppId(appId);
            setCurrentView('officer_console');
            setShowWalkthrough(false);
          }}
        />
      )}

      {/* Supabase PostgreSQL Integration Guide Modal */}
      {showSupabaseModal && (
        <SupabaseConnectionModal
          onClose={() => setShowSupabaseModal(false)}
        />
      )}
    </div>
  );
}
export default App;
