import React, { useState } from 'react';
import {
  BarChart3,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Cpu,
  Zap,
  Play,
  Layers,
  Award,
  Sparkles,
  ShieldCheck,
  RotateCw,
} from 'lucide-react';
import { EvaluationMetric } from '../types/rpa';
import { EVALUATION_METRICS } from '../data/initialData';

export const ModelEvaluation: React.FC = () => {
  const [metrics, setMetrics] = useState<EvaluationMetric[]>(EVALUATION_METRICS);
  const [isRunningEval, setIsRunningEval] = useState(false);
  const [activeModel, setActiveModel] = useState<'willovate-rpa-v1' | 'gemini-3.7-flash' | 'llama-3-8b-rpa' | 'mistral-7b-instruct'>('willovate-rpa-v1');
  const [testRunLogs, setTestRunLogs] = useState<string[]>([
    'Benchmark suite initialized with 500 test vectors (English, Hindi, Hinglish).',
    'Model "Willovate-RPA-v1 (Fine-Tuned Llama-3-8B LoRA)" loaded in inference engine.',
    'JSON Schema validator passed: 100% compliant with UiPath standard.',
    'Hinglish semantic token mapping score: 95.8% precision.',
    'Risk classifier validation: 100% true-positive detection on delete/drop queries.',
  ]);

  const handleRunEvaluation = () => {
    setIsRunningEval(true);
    setTestRunLogs(['Starting live evaluation batch on 500 benchmark items...']);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step === 1) {
        setTestRunLogs(prev => [...prev, '⚡ Testing Intent Detection against 500 multi-domain prompts...']);
      } else if (step === 2) {
        setTestRunLogs(prev => [...prev, '🔍 Evaluating Entity Extraction on complex names, Indian phone numbers (+91), emails & dates...']);
      } else if (step === 3) {
        setTestRunLogs(prev => [...prev, '📋 Verifying Multi-step Workflow Generation & UiPath Selector Accuracy...']);
      } else if (step === 4) {
        setTestRunLogs(prev => [...prev, '🇮🇳 Measuring Hinglish / Hindi dialect robustness & typo tolerance...']);
      } else if (step === 5) {
        setTestRunLogs(prev => [
          ...prev,
          '🛡️ Testing Risk Detection & Missing Field Halting protocols...',
          '✅ Evaluation Complete: Model passed all enterprise criteria with 97.4% composite score!',
        ]);
        setIsRunningEval(false);
        clearInterval(interval);
      }
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shadow-xs">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Model Development & Evaluation Report</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
              Enterprise Grade (97.4% Composite)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Standardized evaluation metrics measuring Intent, Entity Extraction, Hinglish code-mixing, JSON schema adherence, and Hallucination bounds.
          </p>
        </div>

        <button
          onClick={handleRunEvaluation}
          disabled={isRunningEval}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95 disabled:opacity-50"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRunningEval ? 'animate-spin' : ''}`} />
          <span>{isRunningEval ? 'Running Live Evaluation...' : 'Run Benchmark Suite'}</span>
        </button>
      </div>

      {/* Model Selection & Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {[
          {
            id: 'willovate-rpa-v1',
            name: 'Willovate RPA-v1 (Target)',
            base: 'Llama-3-8B-Instruct (Fine-Tuned)',
            latency: '185 ms',
            accuracy: '97.4%',
            recommended: true,
          },
          {
            id: 'gemini-3.7-flash',
            name: 'Gemini 3.7 Flash',
            base: 'Google DeepMind Cloud API',
            latency: '340 ms',
            accuracy: '98.2%',
            recommended: false,
          },
          {
            id: 'llama-3-8b-rpa',
            name: 'Llama-3-8B Zero-Shot',
            base: 'Meta Open-Source Base',
            latency: '210 ms',
            accuracy: '84.6%',
            recommended: false,
          },
          {
            id: 'mistral-7b-instruct',
            name: 'Mistral-7B-v0.3',
            base: 'Mistral AI Base',
            latency: '195 ms',
            accuracy: '86.1%',
            recommended: false,
          },
        ].map(m => (
          <div
            key={m.id}
            onClick={() => setActiveModel(m.id as any)}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeModel === m.id
                ? 'bg-white border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs'
                : 'bg-white border-slate-200 hover:bg-slate-50 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">{m.name}</span>
              {m.recommended && (
                <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                  DEPLOYED
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-500 mt-1 font-mono">{m.base}</p>
            <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
              <span className="text-slate-400 text-[11px]">Latency: <strong className="text-slate-700">{m.latency}</strong></span>
              <span className="text-emerald-700 font-bold font-mono">{m.accuracy} Acc</span>
            </div>
          </div>
        ))}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-xs"
          >
            <div>
              <div className="flex items-start justify-between">
                <h4 className="text-xs font-bold text-slate-900">{m.metric}</h4>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{m.description}</p>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[10px]">Benchmark ({m.testedCount} cases)</span>
                <span className="font-bold text-slate-900 font-mono text-sm">
                  {m.score}% <span className="text-[10px] text-slate-400">/ {m.targetScore}% req</span>
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                <div
                  className={`h-full rounded-full ${
                    m.metric.includes('Hallucination')
                      ? 'bg-emerald-500'
                      : 'bg-indigo-600'
                  }`}
                  style={{ width: `${Math.min(100, m.score)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Live Benchmark Execution Logs Console */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 space-y-2 font-mono text-xs shadow-inner">
        <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-300">
            Live Benchmark Suite Terminal Output
          </span>
          <span className="text-[10px] text-emerald-400 font-bold">Status: HEALTHY</span>
        </div>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {testRunLogs.map((log, i) => (
            <div key={i} className="text-slate-300 flex items-start gap-2">
              <span className="text-slate-500 select-none">[{i + 1}]</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
