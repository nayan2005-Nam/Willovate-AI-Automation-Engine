import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StudioView } from './components/StudioView';
import { VisionInspector } from './components/VisionInspector';
import { DatasetStudio } from './components/DatasetStudio';
import { ModelEvaluation } from './components/ModelEvaluation';
import { ArchitectureSpec } from './components/ArchitectureSpec';
import { LoginPage } from './components/LoginPage';
import { INITIAL_CUSTOMERS, INITIAL_PRODUCTS, INITIAL_REPORTS } from './data/initialData';
import { CustomerRecord, ProductRecord, ReportRecord, DatasetItem, VisionDetection } from './types/rpa';

interface UserProfile {
  name: string;
  email: string;
  role: string;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('willovate_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState<'studio' | 'vision' | 'dataset' | 'evaluation' | 'architecture'>('studio');
  const [customers, setCustomers] = useState<CustomerRecord[]>(INITIAL_CUSTOMERS);
  const [products, setProducts] = useState<ProductRecord[]>(INITIAL_PRODUCTS);
  const [reports, setReports] = useState<ReportRecord[]>(INITIAL_REPORTS);
  const [studioInstruction, setStudioInstruction] = useState(
    'Open the CRM, add Pankaj Koche as a customer with phone number 9876543210, save the record and verify that the customer appears in the table.'
  );
  const [isRunningBot, setIsRunningBot] = useState(false);
  const [autoRunTrigger, setAutoRunTrigger] = useState(1);

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('willovate_auth_user', JSON.stringify(user));
    } catch (e) {
      console.warn('LocalStorage unavailable', e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('willovate_auth_user');
    } catch (e) {
      console.warn('LocalStorage unavailable', e);
    }
  };

  // Quick Run Final Demo
  const handleQuickRunFinalDemo = () => {
    setActiveTab('studio');
    const demoPrompt =
      'Open the CRM, add Pankaj Koche as a customer with phone number 9876543210, save the record and verify that the customer appears in the table.';
    setStudioInstruction(demoPrompt);
    setAutoRunTrigger(prev => prev + 1);
  };

  // When clicking a dataset item to test in studio
  const handleLoadDatasetItemToStudio = (item: DatasetItem) => {
    setStudioInstruction(item.instruction);
    setActiveTab('studio');
  };

  // When compiling vision targets to workflow
  const handleGenerateWorkflowFromVision = (elements: VisionDetection[]) => {
    const visionInstruction = `Interact with ${elements.map(e => e.label).join(', ')}`;
    setStudioInstruction(visionInstruction);
    setActiveTab('studio');
  };

  // Render Login Page if not authenticated
  if (!currentUser) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onSkip={() => handleLoginSuccess({ name: 'Guest Developer', email: 'guest@willovate.com', role: 'Automation Engineer' })}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Top Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQuickRunFinalDemo={handleQuickRunFinalDemo}
        isRunningBot={isRunningBot}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-10">
        {activeTab === 'studio' && (
          <StudioView
            customers={customers}
            setCustomers={setCustomers}
            products={products}
            setProducts={setProducts}
            reports={reports}
            setReports={setReports}
            activeTab={activeTab}
            initialInstruction={studioInstruction}
            autoRunTrigger={autoRunTrigger}
            isRunningBot={isRunningBot}
            setIsRunningBot={setIsRunningBot}
          />
        )}

        {activeTab === 'vision' && (
          <VisionInspector onGenerateWorkflowFromVision={handleGenerateWorkflowFromVision} />
        )}

        {activeTab === 'dataset' && (
          <DatasetStudio onLoadDatasetItemToStudio={handleLoadDatasetItemToStudio} />
        )}

        {activeTab === 'evaluation' && <ModelEvaluation />}

        {activeTab === 'architecture' && <ArchitectureSpec />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-3.5 px-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="font-medium text-slate-700">Willovate BotStudio • UiPath Automation Standard</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span>English / Hindi / Hinglish Multi-Agent Engine</span>
          <span className="font-semibold text-slate-700">v2.4.1-stable</span>
        </div>
      </footer>
    </div>
  );
}
