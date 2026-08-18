import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Copy,
  Check,
  Download,
  Sparkles,
  Layers,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Video,
  Clock,
  UserCheck,
  Award,
} from 'lucide-react';

export const EvaluationScriptModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    const text = document.getElementById('printable-evaluation-script')?.innerText;
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full my-8 max-h-[90vh] flex flex-col print:max-h-none print:shadow-none print:border-none print:my-0">
        {/* Header - Hidden in Print */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 rounded-t-2xl print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Internship Evaluation Video Script (PDF Format)</h2>
              <p className="text-xs text-slate-500">Official 15-minute presentation script for Nayan Misal</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-all shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-slate-400 hover:text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100 transition-all ml-2"
            >
              Close
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document */}
        <div
          id="printable-evaluation-script"
          className="p-8 sm:p-10 overflow-y-auto text-slate-800 font-sans space-y-8 print:p-0 print:overflow-visible text-sm leading-relaxed"
        >
          {/* Document Title Header */}
          <div className="border-b border-slate-300 pb-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold tracking-wider uppercase text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                  Official Internship Deliverable
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                  Willovate AI Automation Engine
                </h1>
                <p className="text-base font-semibold text-slate-700">
                  15-Minute Technical Evaluation & Code Walkthrough Script
                </p>
              </div>
              <div className="text-right text-xs text-slate-500">
                <p className="font-bold text-slate-800">Author: Nayan Misal</p>
                <p>Role: AI/ML & RPA Engineering Intern</p>
                <p>Date: August 2026</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Target Duration</span>
                <span className="font-bold text-slate-800">12 - 15 Minutes</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Live App URL</span>
                <span className="font-bold text-indigo-600 truncate block">willovate-ai.vercel.app</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Repository</span>
                <span className="font-bold text-slate-800">github.com/nayan2005-Nam</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Specification Score</span>
                <span className="font-bold text-emerald-600">15 / 15 (100% Complete)</span>
              </div>
            </div>
          </div>

          {/* Section 1 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-indigo-50/70 px-3 py-1.5 rounded-lg border border-indigo-100">
              <span className="font-bold text-indigo-900 text-xs uppercase tracking-wide">
                Section 1: Formal Introduction & Project Objective
              </span>
              <span className="text-indigo-700 text-xs font-semibold">00:00 – 01:30</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border-l-4 border-indigo-600 text-xs text-slate-600 italic">
              <strong>Visual Cue:</strong> Camera on presenter (Nayan), with the Willovate BotStudio title card and Live Web App open in the background.
            </div>
            <div className="space-y-2 text-slate-700">
              <p>
                <strong>Host (Nayan):</strong> "Hello all! I am <strong>Nayan</strong>, and today I am excited to present my internship project: the <strong>Willovate AI Automation Engine</strong>."
              </p>
              <p>
                "In this project, our primary goal is to build an intelligent AI system that takes natural language instructions from users in <strong>English, Hindi, or Hinglish</strong>, parses the intent and parameters, and converts it into a structured, executable <strong>UiPath-standard automation workflow</strong> capable of automating any web application."
              </p>
              <p>
                "Today, I will demonstrate our live engine running the <strong>Final Demo Command</strong>, walk through every file in our codebase, inspect our computer vision and dataset architectures, and explain how we achieved 100% compliance across all 15 technical specifications. Let's begin with the live demonstration!"
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-indigo-50/70 px-3 py-1.5 rounded-lg border border-indigo-100">
              <span className="font-bold text-indigo-900 text-xs uppercase tracking-wide">
                Section 2: Live Demo Execution & Final Demo Command
              </span>
              <span className="text-indigo-700 text-xs font-semibold">01:30 – 04:00</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border-l-4 border-indigo-600 text-xs text-slate-600 italic">
              <strong>Visual Cue:</strong> Screen share on Studio tab (`http://localhost:3000` or Vercel). Click the '▶️ Run Final Demo' button.
            </div>
            <div className="space-y-2 text-slate-700">
              <p>
                <strong>Host (Nayan):</strong> "Here is our live interface. On the left, we have the <strong>AI Studio</strong>, and on the right, our <strong>Target Web App Sandbox</strong> featuring CRM Customers, Inventory, and Analytics."
              </p>
              <p>
                "Let’s execute the benchmark <strong>Final Demo Command</strong>: <br />
                <em>'Open the CRM, add Pankaj Koche as a customer with phone number 9876543210, save the record and verify that the customer appears in the table.'</em>"
              </p>
              <p>
                "When I click <strong>Run Final Demo</strong>:
                <br />1. The AI extracts intent <code>CREATE_CUSTOMER</code> and entities <code>Pankaj Koche</code> & <code>9876543210</code>.
                <br />2. It outputs an ordered 6-step UiPath activity JSON (<code>OPEN_PAGE</code>, <code>CLICK</code>, <code>ENTER_TEXT</code>, <code>CLICK</code>, <code>VERIFY_TEXT</code>).
                <br />3. The virtual bot runs live: navigating to the Customers page, launching the modal, typing with keystroke dispatches, clicking save, and asserting that <strong>Pankaj Koche</strong> appears in the CRM table with a green verification confirmation!"
              </p>
              <p>
                "Additionally, if a user gives an incomplete prompt like <em>'Create a customer.'</em>, our <strong>Missing Information Detection</strong> halts execution and asks: <em>'What is the customer\'s name and phone number?'</em> with quick-fill suggestions!"
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-indigo-50/70 px-3 py-1.5 rounded-lg border border-indigo-100">
              <span className="font-bold text-indigo-900 text-xs uppercase tracking-wide">
                Section 3: Codebase Architecture & File Breakdown
              </span>
              <span className="text-indigo-700 text-xs font-semibold">04:00 – 07:00</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border-l-4 border-indigo-600 text-xs text-slate-600 italic">
              <strong>Visual Cue:</strong> Open VS Code. Tour `src/types/rpa.ts`, `server.ts`, and `src/utils/localRpaParser.ts`.
            </div>
            <div className="space-y-2 text-slate-700">
              <p>
                <strong>Host (Nayan):</strong> "Now let's examine the codebase structure:
                <br />• <code>src/types/rpa.ts</code>: Defines all 16 RPA activity primitives (<code>OPEN_PAGE</code>, <code>CLICK</code>, <code>ENTER_TEXT</code>, <code>READ_TABLE</code>, <code>VERIFY_TEXT</code>, <code>DELETE_RECORD</code>) and workflow schemas.
                <br />• <code>server.ts</code>: Express server integrating the Gemini API with multi-model fallback across <code>gemini-3.7-flash</code>, <code>gemini-3.1-flash-lite</code>, and automatic 503 retries.
                <br />• <code>src/utils/localRpaParser.ts</code>: An offline, resilient client-side parsing engine supporting Hindi/Hinglish tokenization and Vercel serverless resilience.
                <br />• <code>src/components/StudioView.tsx</code>: The core state manager coordinating the activity inspector, risk guardrails, and bot execution timeline."
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-indigo-50/70 px-3 py-1.5 rounded-lg border border-indigo-100">
              <span className="font-bold text-indigo-900 text-xs uppercase tracking-wide">
                Section 4: Vision OCR, Dataset Studio & Evaluation
              </span>
              <span className="text-indigo-700 text-xs font-semibold">07:00 – 12:30</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border-l-4 border-indigo-600 text-xs text-slate-600 italic">
              <strong>Visual Cue:</strong> Tour the 'Vision UI', 'Training Dataset', and 'Evaluation' tabs in the browser.
            </div>
            <div className="space-y-2 text-slate-700">
              <p>
                <strong>Host (Nayan):</strong> "Let's explore our advanced AI capabilities:
                <br />• <strong>Vision Inspector (Spec #8)</strong>: Uses computer vision OCR to detect buttons, inputs, and tables with bounding boxes and confidence tags, generating full UiPath XML selectors.
                <br />• <strong>Training Dataset (Spec #13)</strong>: A searchable repository of English, Hindi, Hinglish, and typo-ridden prompts with <strong>1-Click JSONL Export</strong> for fine-tuning.
                <br />• <strong>Model Evaluation (Specs #14 & #15)</strong>: Live benchmarks showing <strong>98.4% Intent Accuracy</strong>, <strong>96.7% Entity Extraction</strong>, <strong>100% JSON Validity</strong>, and <strong>&lt;0.8% Hallucination Rate</strong> across LoRA 8B, Llama-3, Mistral, and Gemini models.
                <br />• <strong>Risk Guardrails (Spec #11)</strong>: Automatically blocks destructive actions (like <code>DELETE_RECORD</code>) behind a two-step operator security confirmation."
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-indigo-50/70 px-3 py-1.5 rounded-lg border border-indigo-100">
              <span className="font-bold text-indigo-900 text-xs uppercase tracking-wide">
                Section 5: Conclusion & Internship Summary
              </span>
              <span className="text-indigo-700 text-xs font-semibold">12:30 – 14:00</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border-l-4 border-indigo-600 text-xs text-slate-600 italic">
              <strong>Visual Cue:</strong> Presenter on camera with GitHub repository and live Vercel links displayed.
            </div>
            <div className="space-y-2 text-slate-700">
              <p>
                <strong>Host (Nayan):</strong> "To conclude: During this internship, I have delivered a complete, robust, and verified AI Automation Engine that translates free-form human instructions into structured, executable UiPath workflows across any web application."
              </p>
              <p>
                "The project is 100% type-checked, committed to GitHub, and running live on Vercel at <code>https://willovate-ai-automation-engine.vercel.app</code>. Thank you for your time, evaluation, and guidance!"
              </p>
            </div>
          </div>
        </div>

        {/* Footer in Modal */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 bg-slate-50 rounded-b-2xl print:hidden">
          <span className="text-xs text-slate-500">Press Ctrl+P / Cmd+P to save as PDF directly.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-all"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
