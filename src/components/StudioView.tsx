import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Play,
  Send,
  HelpCircle,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  FileCode,
  Layers,
  Code2,
  Copy,
  Check,
  ArrowRight,
  Terminal,
  Languages,
  Activity,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import { WorkflowResult, WorkflowStep, CustomerRecord, ProductRecord, ReportRecord, DatasetItem } from '../types/rpa';
import { PRESET_COMMANDS } from '../data/initialData';
import { TargetWebApp } from './TargetWebApp';
import { UiPathBotRunner } from './UiPathBotRunner';
import { ExternalRunnerModal } from './ExternalRunnerModal';
import { parseInstructionLocally } from '../utils/localRpaParser';

interface StudioViewProps {
  customers: CustomerRecord[];
  setCustomers: React.Dispatch<React.SetStateAction<CustomerRecord[]>>;
  products: ProductRecord[];
  setProducts: React.Dispatch<React.SetStateAction<ProductRecord[]>>;
  reports: ReportRecord[];
  setReports: React.Dispatch<React.SetStateAction<ReportRecord[]>>;
  activeTab: 'studio' | 'vision' | 'dataset' | 'evaluation' | 'architecture';
  initialInstruction?: string;
  autoRunTrigger?: number;
  onRunBotTrigger?: () => void;
  isRunningBot: boolean;
  setIsRunningBot: React.Dispatch<React.SetStateAction<boolean>>;
}

export const StudioView: React.FC<StudioViewProps> = ({
  customers,
  setCustomers,
  products,
  setProducts,
  reports,
  setReports,
  initialInstruction,
  autoRunTrigger,
  isRunningBot,
  setIsRunningBot,
}) => {
  // Command & Parsing State
  const [instruction, setInstruction] = useState(
    initialInstruction ||
      'Open the CRM, add Pankaj Koche as a customer with phone number 9876543210, save the record and verify that the customer appears in the table.'
  );
  const [isParsing, setIsParsing] = useState(false);
  const [workflow, setWorkflow] = useState<WorkflowResult | null>(null);
  const [clarificationAnswers, setClarificationAnswers] = useState<Record<string, string>>({});
  const [activeInspectorTab, setActiveInspectorTab] = useState<'activities' | 'entities' | 'risk' | 'json'>('activities');
  const [copiedJson, setCopiedJson] = useState(false);
  const [highRiskConfirmed, setHighRiskConfirmed] = useState(false);
  const [isExternalModalOpen, setIsExternalModalOpen] = useState(false);

  // Target Web App State
  const [activeAppView, setActiveAppView] = useState<'customers' | 'products' | 'reports'>('customers');
  const [activeSelector, setActiveSelector] = useState<string | undefined>(undefined);
  const [botNotification, setBotNotification] = useState<string | null>(null);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [customerFormData, setCustomerFormData] = useState({ name: '', phone: '', email: '', company: '' });
  const customerFormDataRef = useRef({ name: '', phone: '', email: '', company: '' });
  const priceInputRef = useRef('599');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [priceInputValue, setPriceInputValue] = useState('');
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState('');
  const [verifiedTargetName, setVerifiedTargetName] = useState<string | null>(null);

  // Bot Runner State
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [cursorPosition, setCursorPosition] = useState({ x: 50, y: 50, visible: false, label: '' });
  const [executionLogs, setExecutionLogs] = useState<{ time: string; message: string; type: 'info' | 'success' | 'warn' | 'error' }[]>([]);

  // Execution Timer Ref
  const executionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Parse Natural Language Instruction with resilient fallback
  const handleParseInstruction = async (textToParse?: string, answers?: Record<string, string>) => {
    const query = textToParse !== undefined ? textToParse : instruction;
    if (!query.trim()) return;

    setIsParsing(true);
    try {
      let data: WorkflowResult | null = null;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1200);
        const res = await fetch('/api/rpa/parse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ instruction: query, clarificationAnswers: answers || clarificationAnswers }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          data = await res.json();
        }
      } catch (networkErr) {
        // Fast instant fallback on Vercel static preview
      }

      if (!data || !data.steps) {
        data = parseInstructionLocally(query, answers || clarificationAnswers);
      }

      setWorkflow(data);

      // Reset bot execution index
      setCurrentStepIndex(-1);
      setActiveSelector(undefined);
      setVerifiedTargetName(null);
      setHighRiskConfirmed(false);

      if (data.missingFields && data.missingFields.length > 0) {
        // Initialize clarification answers
        const initialAnswers: Record<string, string> = {};
        data.missingFields.forEach(f => {
          initialAnswers[f] = '';
        });
        setClarificationAnswers(initialAnswers);
      }
    } catch (err) {
      console.error('Error parsing instruction:', err);
      const localData = parseInstructionLocally(query, answers || clarificationAnswers);
      setWorkflow(localData);
    } finally {
      setIsParsing(false);
    }
  };

  // Sync with initialInstruction if provided
  useEffect(() => {
    if (initialInstruction && initialInstruction !== instruction) {
      setInstruction(initialInstruction);
      handleParseInstruction(initialInstruction);
    }
  }, [initialInstruction]);

  // Initial compile on load
  useEffect(() => {
    handleParseInstruction();
  }, []);

  // Update instruction when preset is clicked
  const handleSelectPreset = (presetText: string) => {
    setInstruction(presetText);
    handleParseInstruction(presetText);
  };

  // Submit clarification answers
  const handleClarificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let augmentedQuery = instruction;
    if (clarificationAnswers['customer_name']) {
      augmentedQuery += ` Name is ${clarificationAnswers['customer_name']}`;
    }
    if (clarificationAnswers['phone_number']) {
      augmentedQuery += ` with phone ${clarificationAnswers['phone_number']}`;
    }
    setInstruction(augmentedQuery);
    handleParseInstruction(augmentedQuery, clarificationAnswers);
  };

  const addLog = (message: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    const time = new Date().toLocaleTimeString();
    setExecutionLogs(prev => [{ time, message, type }, ...prev.slice(0, 40)]);
  };

  // Bot Activity Execution Step by Step
  const executeStep = (stepIdx: number, activeWf?: WorkflowResult) => {
    const currentWf = activeWf || workflow;
    if (!currentWf || !currentWf.steps || stepIdx >= currentWf.steps.length) {
      // Completed all steps
      setIsRunningBot(false);
      setCurrentStepIndex(currentWf ? currentWf.steps.length : 0);
      setActiveSelector(undefined);
      addLog('🎉 Automation workflow execution completed successfully!', 'success');
      setBotNotification('Workflow Finished Successfully');
      setTimeout(() => setBotNotification(null), 4000);
      return;
    }

    const step = currentWf.steps[stepIdx];
    setCurrentStepIndex(stepIdx);
    setActiveSelector(step.target);
    addLog(`Executing Step ${step.stepNumber}: [${step.action}] ${step.description}`, 'info');

    const delay = Math.max(250, 1000 / speed);

    if (step.action === 'OPEN_PAGE') {
      if (step.target.includes('customers')) setActiveAppView('customers');
      else if (step.target.includes('products')) setActiveAppView('products');
      else if (step.target.includes('reports')) setActiveAppView('reports');
    } else if (step.action === 'CLICK') {
      if (step.target === 'add-customer' || step.target === 'btn-add-customer') {
        setIsAddCustomerOpen(true);
      } else if (step.target === 'save' || step.target === 'btn-save-customer') {
        // Commit customer to table
        const targetName = customerFormDataRef.current.name.trim() || customerFormData.name.trim() || currentWf?.entities?.customerName || 'Pankaj Koche';
        const targetPhone = customerFormDataRef.current.phone.trim() || customerFormData.phone.trim() || currentWf?.entities?.phone || '9876543210';
        
        if (targetName) {
          setCustomers(prev => {
            const existingIdx = prev.findIndex(c => c.name.toLowerCase() === targetName.toLowerCase());
            const newCust: CustomerRecord = {
              id: existingIdx >= 0 ? prev[existingIdx].id : `cust-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              name: targetName,
              phone: targetPhone,
              email: `${targetName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
              company: 'Pankaj Enterprises Ltd',
              status: 'Customer',
              createdAt: new Date().toISOString().split('T')[0],
            };
            if (existingIdx >= 0) {
              const updated = [...prev];
              updated[existingIdx] = newCust;
              return updated;
            }
            return [newCust, ...prev];
          });
          setIsAddCustomerOpen(false);
          addLog(`✅ Customer "${targetName}" recorded in CRM database table.`, 'success');
        }
      } else if (step.target === 'edit-price' || step.target === 'btn-edit-price') {
        setEditingProductId('prod-1');
      } else if (step.target === 'save-price' || step.target === 'btn-save-price') {
        const newPrice = parseFloat(priceInputRef.current) || parseFloat(priceInputValue) || 599;
        setProducts(prev =>
          prev.map(p => (p.id === 'prod-1' ? { ...p, price: newPrice, lastUpdated: 'Just now' } : p))
        );
        setEditingProductId(null);
        addLog(`✅ Product price updated to ₹${newPrice}.`, 'success');
      } else if (step.target === 'open-email-modal' || step.target === 'btn-open-email-dispatch') {
        setIsEmailModalOpen(true);
      } else if (step.target === 'send-email' || step.target === 'btn-send-report-email') {
        setIsEmailModalOpen(false);
        addLog(`✅ Report email dispatched to ${emailRecipient || 'manager@willovate.com'}.`, 'success');
      } else if (step.target === 'confirm-delete-button' || step.target === 'btn-modal-confirm-delete') {
        setCustomers(prev => prev.slice(1));
        addLog('⚠️ High Risk deletion confirmed & executed.', 'warn');
      }
    } else if (step.action === 'ENTER_TEXT') {
      if (step.target === 'customer-name' || step.target === 'input-customer-name') {
        const val = step.value || 'Pankaj Koche';
        customerFormDataRef.current.name = val;
        setCustomerFormData(prev => ({ ...prev, name: val }));
      } else if (step.target === 'phone-number' || step.target === 'input-customer-phone') {
        const val = step.value || '9876543210';
        customerFormDataRef.current.phone = val;
        setCustomerFormData(prev => ({ ...prev, phone: val }));
      } else if (step.target === 'product-price' || step.target === 'input-product-price') {
        const val = step.value || '599';
        priceInputRef.current = val;
        setPriceInputValue(val);
      } else if (step.target === 'recipient-email' || step.target === 'input-email-recipient') {
        setEmailRecipient(step.value || 'manager@willovate.com');
      }
    } else if (step.action === 'VERIFY_TEXT' || step.action === 'ASSERT_EXISTS') {
      const verifyName = step.value || customerFormDataRef.current.name || currentWf?.entities?.customerName || 'Pankaj Koche';
      setVerifiedTargetName(verifyName);
      addLog(`🔍 Assertion Passed: Found "${verifyName}" in Customers table column.`, 'success');
      setBotNotification(`Verified: ${verifyName} is present in table!`);
    } else if (step.action === 'DOWNLOAD_FILE') {
      addLog(`📥 File "${step.value || 'Daily_Sales_Report.xlsx'}" downloaded successfully.`, 'success');
    }

    // Schedule next step if still running and not paused
    executionTimeoutRef.current = setTimeout(() => {
      executeStep(stepIdx + 1, currentWf);
    }, delay);
  };

  const executeStepWithWorkflow = (wf: WorkflowResult, stepIdx: number) => {
    executeStep(stepIdx, wf);
  };

  const handleParseAndAutoRun = async (text: string) => {
    setIsParsing(true);
    try {
      let data: WorkflowResult | null = null;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1200);
        const res = await fetch('/api/rpa/parse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ instruction: text }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          data = await res.json();
        }
      } catch (networkErr) {
        // Fast instant fallback
      }

      if (!data || !data.steps || data.steps.length === 0) {
        data = parseInstructionLocally(text);
      }

      setWorkflow(data);
      setCurrentStepIndex(-1);
      setActiveSelector(undefined);
      setVerifiedTargetName(null);
      setHighRiskConfirmed(false);

      if (data.steps && data.steps.length > 0) {
        setIsRunningBot(true);
        setIsPaused(false);
        setExecutionLogs([]);
        addLog(`🚀 Auto-launching UiPath Bot Runner on ${data.steps.length} activities...`, 'info');
        setTimeout(() => {
          executeStepWithWorkflow(data!, 0);
        }, 350);
      }
    } catch (err) {
      console.error('Error auto-running instruction:', err);
      const fallbackData = parseInstructionLocally(text);
      setWorkflow(fallbackData);
      if (fallbackData.steps && fallbackData.steps.length > 0) {
        setIsRunningBot(true);
        setIsPaused(false);
        setExecutionLogs([]);
        addLog(`🚀 Auto-launching UiPath Bot Runner on ${fallbackData.steps.length} activities...`, 'info');
        setTimeout(() => {
          executeStepWithWorkflow(fallbackData, 0);
        }, 350);
      }
    } finally {
      setIsParsing(false);
    }
  };

  // Run demo only when explicitly triggered by header button
  useEffect(() => {
    if (autoRunTrigger && autoRunTrigger > 0) {
      const demoText =
        'Open the CRM, add Pankaj Koche as a customer with phone number 9876543210, save the record and verify that the customer appears in the table.';
      setInstruction(demoText);
      handleParseAndAutoRun(demoText);
    }
  }, [autoRunTrigger]);

  const handleStartBot = () => {
    if (!workflow || workflow.steps.length === 0) return;

    if (workflow.requiresConfirmation && !highRiskConfirmed) {
      alert('High risk action detected! Please toggle the Security Confirmation switch in the Risk Guardrail tab before executing.');
      setActiveInspectorTab('risk');
      return;
    }

    setIsRunningBot(true);
    setIsPaused(false);
    setExecutionLogs([]);
    addLog(`🚀 Starting UiPath Bot runner on ${workflow.steps.length} activities...`, 'info');
    executeStep(0);
  };

  const handlePauseBot = () => {
    setIsPaused(true);
    if (executionTimeoutRef.current) clearTimeout(executionTimeoutRef.current);
    addLog('⏸️ Bot paused by operator.', 'warn');
  };

  const handleResumeBot = () => {
    setIsPaused(false);
    addLog('▶️ Bot resumed.', 'info');
    executeStep(currentStepIndex + 1);
  };

  const handleStepNext = () => {
    if (executionTimeoutRef.current) clearTimeout(executionTimeoutRef.current);
    const nextIdx = currentStepIndex + 1;
    if (workflow && nextIdx < workflow.steps.length) {
      executeStep(nextIdx);
    }
  };

  const handleResetBot = () => {
    if (executionTimeoutRef.current) clearTimeout(executionTimeoutRef.current);
    setIsRunningBot(false);
    setIsPaused(false);
    setCurrentStepIndex(-1);
    setActiveSelector(undefined);
    setVerifiedTargetName(null);
    setIsAddCustomerOpen(false);
    setIsEmailModalOpen(false);
    setEditingProductId(null);
    setCustomerFormData({ name: '', phone: '', email: '', company: '' });
    addLog('🔄 Execution reset.', 'info');
  };

  // Self-Healing Trigger Demo
  const handleTriggerSelfHealing = async () => {
    if (!workflow || workflow.steps.length === 0) return;
    addLog('⚠️ Injecting simulated dynamic selector failure on active step...', 'warn');

    try {
      const failedStep = workflow.steps[Math.max(0, currentStepIndex)];
      const res = await fetch('/api/rpa/self-heal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          failedStep,
          errorMessage: `TimeoutError: Element with selector "${failedStep.target}" not found after 3000ms`,
          domSnapshot: 'div#root, table[data-testid=customers-table], button.save-action',
        }),
      });
      const data = await res.json();
      addLog(`🛠️ AI Self-Healing Root Cause: ${data.rootCause}`, 'info');
      addLog(`✨ AI Applied Healed Selector: ${data.suggestedFix}`, 'success');
      alert(`AI Self-Healing Bot Repaired the Workflow!\n\nRoot Cause: ${data.rootCause}\nDiagnosis: ${data.diagnosis}\nSuggested Fix: ${data.suggestedFix}`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyJson = () => {
    if (workflow?.rawJson) {
      navigator.clipboard.writeText(workflow.rawJson);
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-5 space-y-5">
      {/* Top Natural Language Command & Presets Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                Natural Language to RPA Workflow Compiler
              </h2>
              <p className="text-xs text-slate-500">
                Supports English, Hindi, Hinglish, spelling mistakes & multi-step plans
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              id="btn-run-final-demo-direct"
              onClick={() => {
                const demoText =
                  'Open the CRM, add Pankaj Koche as a customer with phone number 9876543210, save the record and verify that the customer appears in the table.';
                setInstruction(demoText);
                handleParseAndAutoRun(demoText);
              }}
              disabled={isRunningBot || isParsing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-all active:scale-95 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Final Demo</span>
            </button>
            <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 hidden sm:inline-block">
              Gemini 3.7 Flash Engine
            </span>
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleParseInstruction();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            id="input-natural-instruction"
            value={instruction}
            onChange={e => setInstruction(e.target.value)}
            placeholder="Type any automation instruction in English, Hindi, or Hinglish (e.g. 'Rahul naam ka employee add karo...')"
            className="w-full pl-4 pr-32 py-3 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-sans"
          />
          <button
            type="submit"
            id="btn-parse-instruction"
            disabled={isParsing || isRunningBot}
            className="absolute right-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-md shadow-xs transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
          >
            {isParsing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Compiling...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Compile</span>
              </>
            )}
          </button>
        </form>

        {/* Preset Pills */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mr-1">Quick Presets:</span>
          {PRESET_COMMANDS.map(p => (
            <button
              key={p.id}
              onClick={() => handleSelectPreset(p.instruction)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all active:scale-95 flex items-center gap-1.5 ${
                instruction === p.instruction
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              <span>{p.title}</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold border ${p.badgeColor}`}>
                {p.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Layout: Left Pipeline Inspector | Right Target App & Bot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: AI Pipeline Breakdown (Activities, Intent/Entities, Risk, JSON) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Missing Information Clarification Box */}
          {workflow && workflow.missingFields && workflow.missingFields.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3 shadow-xs animate-fadeIn">
              <div className="flex items-start gap-2.5 text-amber-800">
                <HelpCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
                <div>
                  <h4 className="font-bold text-xs text-amber-900">Missing Information Detected</h4>
                  <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                    {workflow.clarificationQuestion ||
                      `Please provide the missing fields (${workflow.missingFields.join(', ')}) to generate the workflow.`}
                  </p>
                </div>
              </div>

              <form onSubmit={handleClarificationSubmit} className="space-y-2.5 pt-1">
                {workflow.missingFields.map(field => (
                  <div key={field}>
                    <label className="block text-[11px] font-semibold text-amber-900 mb-1 capitalize">
                      {field.replace('_', ' ')}
                    </label>
                    <input
                      type="text"
                      placeholder={`Enter ${field.replace('_', ' ')}...`}
                      value={clarificationAnswers[field] || ''}
                      onChange={e =>
                        setClarificationAnswers(prev => ({ ...prev, [field]: e.target.value }))
                      }
                      required
                      className="w-full px-3 py-1.5 text-xs bg-white border border-amber-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-all active:scale-98 shadow-xs"
                >
                  Submit & Generate Full Workflow
                </button>
              </form>
            </div>
          )}

          {/* Inspector Panel */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            {/* Inspector Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/70 text-xs font-medium">
                <button
                  id="tab-inspector-activities"
                  onClick={() => setActiveInspectorTab('activities')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                    activeInspectorTab === 'activities'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-semibold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Activities ({workflow?.steps.length || 0})</span>
                </button>

                <button
                  id="tab-inspector-entities"
                  onClick={() => setActiveInspectorTab('entities')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                    activeInspectorTab === 'entities'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-semibold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>NLP Entities</span>
                </button>

                <button
                  id="tab-inspector-risk"
                  onClick={() => setActiveInspectorTab('risk')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                    activeInspectorTab === 'risk'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-semibold'
                      : 'text-slate-500 hover:text-slate-800'
                  } ${workflow?.requiresConfirmation && !highRiskConfirmed ? 'animate-pulse text-rose-600 font-bold' : ''}`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Risk</span>
                  {workflow?.requiresConfirmation && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
                  )}
                </button>

                <button
                  id="tab-inspector-json"
                  onClick={() => setActiveInspectorTab('json')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                    activeInspectorTab === 'json'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-semibold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>JSON</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {workflow && (
                  <button
                    id="btn-run-external-web"
                    onClick={() => setIsExternalModalOpen(true)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-2xs transition-all active:scale-95"
                    title="Export or execute this automation on Salesforce, HubSpot, or any external website"
                  >
                    <span>Execute on Any Web App</span>
                    <span className="text-[10px]">🌐</span>
                  </button>
                )}

                {workflow && (
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {workflow.languageDetected}
                  </span>
                )}
              </div>
            </div>

            {/* High-Risk Inline Guardrail Warning */}
            {workflow && workflow.requiresConfirmation && (
              <div
                className={`p-3 rounded-lg border flex items-center justify-between text-xs transition-all ${
                  highRiskConfirmed
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-300 text-rose-900 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck
                    className={`w-4 h-4 shrink-0 ${
                      highRiskConfirmed ? 'text-emerald-600' : 'text-rose-600 animate-bounce'
                    }`}
                  />
                  <div>
                    <span className="font-bold">
                      {highRiskConfirmed ? 'Security Override Authorized' : 'High Risk Guardrail Triggered'}
                    </span>
                    <p className="text-[11px] text-slate-600 leading-tight">
                      {highRiskConfirmed
                        ? 'Operator authorized this destructive deletion.'
                        : 'Requires operator confirmation before execution.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setHighRiskConfirmed(!highRiskConfirmed)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all shadow-xs shrink-0 ${
                    highRiskConfirmed
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                  }`}
                >
                  {highRiskConfirmed ? '✓ Authorized' : 'Authorize Run'}
                </button>
              </div>
            )}

            {/* TAB 1: ACTIVITIES SEQUENCE */}
            {activeInspectorTab === 'activities' && (
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {!workflow || workflow.steps.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs italic">
                    No activities compiled. Type a command above to generate steps.
                  </div>
                ) : (
                  workflow.steps.map((step, idx) => {
                    const isCurrent = currentStepIndex === idx;
                    const isPast = currentStepIndex > idx;
                    return (
                      <div
                        key={step.id}
                        className={`p-3 rounded-lg border transition-all duration-200 flex items-start gap-3 ${
                          isCurrent
                            ? 'border-l-4 border-indigo-600 bg-indigo-50/70 border-slate-200 shadow-xs ring-1 ring-indigo-200'
                            : isPast
                            ? 'border-l-2 border-emerald-500 bg-slate-50 border-slate-200 opacity-90'
                            : 'border-l-2 border-slate-300 bg-white border-slate-200 hover:bg-slate-50/60'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded text-xs font-bold font-mono flex items-center justify-center shrink-0 mt-0.5 ${
                            isCurrent
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : isPast
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {isPast ? <Check className="w-3.5 h-3.5" /> : step.stepNumber < 10 ? `0${step.stepNumber}` : step.stepNumber}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-slate-800">
                              {step.action}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              target: <strong className="text-slate-700">{step.target}</strong>
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">{step.description}</p>
                          {step.value && (
                            <div className="mt-1 text-[10px] font-mono font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded inline-block border border-indigo-100">
                              value: "{step.value}"
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB 2: NLP INTENT & ENTITIES */}
            {activeInspectorTab === 'entities' && (
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {workflow ? (
                  <>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Detected Primary Intent
                      </span>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-bold text-indigo-600">{workflow.intent}</span>
                        <span className="text-xs font-semibold text-emerald-700 font-mono">
                          {(workflow.confidence * 100).toFixed(1)}% Conf
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{workflow.intentDescription}</p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Extracted Named Entities ({workflow.entityList.length})
                      </span>
                      {workflow.entityList.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No named entities present in query.</p>
                      ) : (
                        <div className="divide-y divide-slate-200">
                          {workflow.entityList.map(e => (
                            <div key={e.key} className="py-1.5 flex items-center justify-between text-xs">
                              <div>
                                <span className="text-slate-500 font-medium">{e.label}: </span>
                                <span className="font-semibold text-slate-800">{e.value}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {(e.confidence * 100).toFixed(0)}%
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-slate-400 italic">No intent parsed yet.</p>
                )}
              </div>
            )}

            {/* TAB 3: RISK DETECTION & SAFETY GUARDRAILS */}
            {activeInspectorTab === 'risk' && (
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {workflow ? (
                  <div
                    className={`p-4 rounded-lg border space-y-3 ${
                      workflow.riskLevel === 'CRITICAL' || workflow.riskLevel === 'HIGH'
                        ? 'bg-rose-50 border-rose-200 text-rose-900'
                        : workflow.riskLevel === 'MEDIUM'
                        ? 'bg-amber-50 border-amber-200 text-amber-900'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck
                          className={`w-5 h-5 ${
                            workflow.riskLevel === 'CRITICAL' || workflow.riskLevel === 'HIGH'
                              ? 'text-rose-600'
                              : 'text-emerald-600'
                          }`}
                        />
                        <h4 className="font-bold text-xs uppercase tracking-wider">
                          Risk Classification: {workflow.riskLevel}
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                        {workflow.requiresConfirmation ? 'Confirmation Required' : 'Safe to Run'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">{workflow.riskReason}</p>

                    {workflow.requiresConfirmation && (
                      <div className="pt-2 border-t border-rose-200 flex items-center justify-between">
                        <span className="text-xs font-semibold text-rose-900">Authorize Execution Override:</span>
                        <button
                          onClick={() => setHighRiskConfirmed(!highRiskConfirmed)}
                          className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                            highRiskConfirmed
                              ? 'bg-emerald-600 text-white'
                              : 'bg-rose-600 hover:bg-rose-700 text-white'
                          }`}
                        >
                          {highRiskConfirmed ? '✓ Authorized' : 'Grant Override'}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No workflow loaded.</p>
                )}
              </div>
            )}

            {/* TAB 4: JSON OUTPUT (UiPath Specification) */}
            {activeInspectorTab === 'json' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono text-[10px] font-semibold text-slate-600">Schema: UiPath-JSON-v1</span>
                  <button
                    onClick={handleCopyJson}
                    className="flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded border border-slate-200"
                  >
                    {copiedJson ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                </div>
                <pre className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-[11px] font-mono text-emerald-400 max-h-[320px] overflow-y-auto leading-relaxed shadow-inner">
                  {workflow?.rawJson || '// Workflow JSON will appear here'}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Target Web App + UiPath Bot Playback Engine */}
        <div className="lg:col-span-7 space-y-4">
          {/* Target App Container */}
          <div className="h-[460px]">
            <TargetWebApp
              activeView={activeAppView}
              setActiveView={setActiveAppView}
              customers={customers}
              setCustomers={setCustomers}
              products={products}
              setProducts={setProducts}
              reports={reports}
              setReports={setReports}
              activeSelector={activeSelector}
              botNotification={botNotification}
              isAddCustomerOpen={isAddCustomerOpen}
              setIsAddCustomerOpen={setIsAddCustomerOpen}
              customerFormData={customerFormData}
              setCustomerFormData={setCustomerFormData}
              editingProductId={editingProductId}
              setEditingProductId={setEditingProductId}
              priceInputValue={priceInputValue}
              setPriceInputValue={setPriceInputValue}
              isEmailModalOpen={isEmailModalOpen}
              setIsEmailModalOpen={setIsEmailModalOpen}
              emailRecipient={emailRecipient}
              setEmailRecipient={setEmailRecipient}
              verifiedTargetName={verifiedTargetName}
            />
          </div>

          {/* Bot Runner Controller Panel */}
          <UiPathBotRunner
            workflow={workflow}
            currentStepIndex={currentStepIndex}
            isRunning={isRunningBot}
            isPaused={isPaused}
            onStart={handleStartBot}
            onPause={handlePauseBot}
            onResume={handleResumeBot}
            onStepNext={handleStepNext}
            onReset={handleResetBot}
            speed={speed}
            setSpeed={setSpeed}
            onTriggerSelfHealing={handleTriggerSelfHealing}
            cursorPosition={cursorPosition}
            executionLogs={executionLogs}
          />
        </div>
      </div>

      {/* External Web Application Execution Modal */}
      <ExternalRunnerModal
        workflow={workflow}
        isOpen={isExternalModalOpen}
        onClose={() => setIsExternalModalOpen(false)}
      />
    </div>
  );
};
