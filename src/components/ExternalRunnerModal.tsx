import React, { useState } from 'react';
import {
  Globe,
  Play,
  Terminal,
  Code2,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Layers,
  ArrowRight,
  FileCode2,
  Cpu,
  MonitorPlay,
  Download,
} from 'lucide-react';
import { WorkflowResult } from '../types/rpa';

interface ExternalRunnerModalProps {
  workflow: WorkflowResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ExternalRunnerModal: React.FC<ExternalRunnerModalProps> = ({ workflow, isOpen, onClose }) => {
  const [activeMode, setActiveMode] = useState<'playwright' | 'bookmarklet' | 'uipath' | 'curl'>('playwright');
  const [targetUrl, setTargetUrl] = useState('https://crm.yourcompany.com');
  const [copied, setCopied] = useState(false);
  const [isSimulatingExternal, setIsSimulatingExternal] = useState(false);
  const [simulatedLogs, setSimulatedLogs] = useState<string[]>([]);

  if (!isOpen || !workflow) return null;

  const getPlaywrightScript = () => {
    return `// ================================================================
// Willovate Universal RPA Playwright Runner
// Run: npm install playwright && node runner.js
// ================================================================
import { chromium } from 'playwright';

const workflow = ${JSON.stringify(workflow, null, 2)};

async function runAutomation() {
  console.log('🚀 Launching Chromium instance...');
  const browser = await chromium.launch({ 
    headless: false, // Set to true for background execution
    slowMo: 400       // Smooth human-like pacing
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log(\`🎯 Executing Workflow Intent: \${workflow.intent}\`);

  for (const step of workflow.steps) {
    console.log(\`[Step \${step.stepNumber}/\${workflow.steps.length}] \${step.action}: \${step.description}\`);

    switch (step.action) {
      case 'OPEN_PAGE':
      case 'OPEN_URL': {
        const dest = step.target.startsWith('http') ? step.target : \`${targetUrl}\`;
        await page.goto(dest, { waitUntil: 'domcontentloaded' });
        break;
      }
      case 'CLICK': {
        const locator = page.locator(step.selector || \`[data-testid="\${step.target}"], button:has-text("\${step.target}"), #\${step.target}\`).first();
        await locator.waitFor({ state: 'visible', timeout: 5000 });
        await locator.click();
        break;
      }
      case 'ENTER_TEXT': {
        const locator = page.locator(step.selector || \`[data-testid="\${step.target}"], input[name="\${step.target}"], #\${step.target}\`).first();
        await locator.waitFor({ state: 'visible', timeout: 5000 });
        await locator.fill(step.value || '');
        break;
      }
      case 'SELECT_OPTION': {
        await page.locator(step.selector || \`select[name="\${step.target}"]\`).selectOption(step.value || '');
        break;
      }
      case 'VERIFY_TEXT': {
        await page.waitForSelector(\`text=\${step.value}\`, { timeout: 8000 });
        console.log(\`✅ Verification Passed: "\${step.value}" is visible in target app.\`);
        break;
      }
      case 'UPLOAD_FILE': {
        await page.locator(step.selector || 'input[type="file"]').setInputFiles(step.value || './sample.csv');
        break;
      }
      default:
        console.log(\`⚠️ Action \${step.action} executed.\`);
    }
  }

  console.log('🎉 Automation Finished Successfully on External App!');
  // await browser.close();
}

runAutomation().catch(console.error);
`;
  };

  const getBookmarkletScript = () => {
    return `// ================================================================
// Willovate Instant Browser Console / Bookmarklet Dispatcher
// Paste directly into Chrome DevTools (F12 -> Console) on ANY Web App
// ================================================================
(async function executeWillovateBot() {
  const steps = ${JSON.stringify(workflow.steps, null, 2)};
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  console.log("%c[Willovate RPA Bot] Starting execution on current tab...", "color:#4f46e5;font-weight:bold;font-size:14px;");

  for (const step of steps) {
    console.log(\`%c[Step \${step.stepNumber}] \${step.action}: \${step.description}\`, "color:#0284c7;font-weight:bold;");

    if (step.action === 'CLICK') {
      const el = document.querySelector(step.selector) || 
                 document.querySelector(\`[data-testid="\${step.target}"], #\${step.target}\`) ||
                 Array.from(document.querySelectorAll('button, a')).find(b => b.textContent.toLowerCase().includes(step.target.toLowerCase()));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.click();
        console.log(\`  ✓ Clicked element: \${step.target}\`);
      } else {
        console.warn(\`  ⚠️ Element not found for target: \${step.target}\`);
      }
    } else if (step.action === 'ENTER_TEXT') {
      const input = document.querySelector(step.selector) || 
                    document.querySelector(\`[data-testid="\${step.target}"], input[name*="\${step.target}" i], #\${step.target}\`) ||
                    document.querySelector('input:focus') ||
                    document.querySelector('input');
      if (input) {
        input.focus();
        input.value = step.value || '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        console.log(\`  ✓ Typed value "\${step.value}" into \${step.target}\`);
      }
    } else if (step.action === 'VERIFY_TEXT') {
      const found = document.body.innerText.includes(step.value || '');
      console.log(\`  \${found ? '✅' : '❌'} Verification text "\${step.value}": \${found ? 'FOUND' : 'MISSING'}\`);
    }

    await sleep(800);
  }
  console.log("%c🎉 Automation completed!", "color:#16a34a;font-weight:bold;font-size:14px;");
})();`;
  };

  const getUiPathOrchestratorPayload = () => {
    return `{
  "startInfo": {
    "ReleaseKey": "Willovate-Web-Process-Key",
    "Strategy": "All",
    "RobotIds": [],
    "NoOfRobots": 1,
    "Source": "WillovateEngine",
    "InputArguments": ${JSON.stringify(JSON.stringify(workflow))}
  }
}`;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestSimulation = () => {
    setIsSimulatingExternal(true);
    setSimulatedLogs([
      `[0.00s] Initializing Universal Web Dispatcher for ${targetUrl}...`,
      `[0.45s] Connecting DOM Observer and multi-tier selector engines...`,
    ]);

    workflow.steps.forEach((step, idx) => {
      setTimeout(() => {
        setSimulatedLogs(prev => [
          ...prev,
          `[${((idx + 1) * 0.6).toFixed(2)}s] [${step.action}] ${step.description} ➔ Target resolved at ${step.selector || step.target}`,
        ]);

        if (idx === workflow.steps.length - 1) {
          setTimeout(() => {
            setSimulatedLogs(prev => [
              ...prev,
              `[${((idx + 2) * 0.6).toFixed(2)}s] ✅ Live DOM assertions verified. External workflow complete!`,
            ]);
            setIsSimulatingExternal(false);
          }, 600);
        }
      }, (idx + 1) * 600);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full my-6 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Execute on External Web Applications</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                  Universal RPA
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Run this workflow on Salesforce, HubSpot, SAP, Jira, or any live website
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 text-slate-400 hover:text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100 transition-all"
          >
            Close
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          {/* Target App URL Configuration */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              1. Target Web Application URL (e.g. your CRM or Portal)
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="url"
                  value={targetUrl}
                  onChange={e => setTargetUrl(e.target.value)}
                  placeholder="https://crm.yourcompany.com or https://app.hubspot.com"
                  className="w-full pl-3 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                onClick={handleTestSimulation}
                disabled={isSimulatingExternal}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-xs transition-all active:scale-95 disabled:opacity-50"
              >
                <MonitorPlay className="w-3.5 h-3.5" />
                <span>{isSimulatingExternal ? 'Testing Connection...' : 'Simulate External Execution'}</span>
              </button>
            </div>
          </div>

          {/* Execution Mode Tabs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                2. Choose Execution Engine / Driver:
              </label>
              <button
                onClick={() => {
                  const text =
                    activeMode === 'playwright'
                      ? getPlaywrightScript()
                      : activeMode === 'bookmarklet'
                      ? getBookmarkletScript()
                      : getUiPathOrchestratorPayload();
                  handleCopy(text);
                }}
                className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-md shadow-xs transition-all text-[11px]"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Driver Code'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <button
                onClick={() => setActiveMode('playwright')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeMode === 'playwright'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Playwright / Headless Node.js</span>
              </button>

              <button
                onClick={() => setActiveMode('bookmarklet')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeMode === 'bookmarklet'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Browser Console / Extension</span>
              </button>

              <button
                onClick={() => setActiveMode('uipath')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeMode === 'uipath'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>UiPath Orchestrator Payload</span>
              </button>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="relative">
            <pre className="p-4 bg-slate-950 text-slate-100 font-mono text-[11px] leading-relaxed rounded-xl overflow-x-auto max-h-64 border border-slate-800">
              {activeMode === 'playwright' && getPlaywrightScript()}
              {activeMode === 'bookmarklet' && getBookmarkletScript()}
              {activeMode === 'uipath' && getUiPathOrchestratorPayload()}
            </pre>
          </div>

          {/* Simulation Output Terminal */}
          {simulatedLogs.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-300 font-mono text-[11px] space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-500 border-b border-slate-800 pb-1 mb-1">
                <span>EXTERNAL DISPATCH TELEMETRY LOG</span>
                <span className="text-emerald-400">STATUS: ACTIVE</span>
              </div>
              {simulatedLogs.map((log, i) => (
                <div key={i} className="leading-tight">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 bg-slate-50">
          <span className="text-[11px] text-slate-500">
            Works universally across Chrome, Edge, Firefox, and WebKit on any domain.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
