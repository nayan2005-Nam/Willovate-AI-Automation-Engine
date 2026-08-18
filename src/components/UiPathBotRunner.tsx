import React from 'react';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Bot,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Wrench,
  ShieldCheck,
  MousePointer2,
} from 'lucide-react';
import { WorkflowStep, WorkflowResult } from '../types/rpa';

interface UiPathBotRunnerProps {
  workflow: WorkflowResult | null;
  currentStepIndex: number;
  isRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStepNext: () => void;
  onReset: () => void;
  speed: number;
  setSpeed: (speed: number) => void;
  onTriggerSelfHealing: () => void;
  cursorPosition: { x: number; y: number; visible: boolean; label?: string };
  executionLogs: { time: string; message: string; type: 'info' | 'success' | 'warn' | 'error' }[];
}

export const UiPathBotRunner: React.FC<UiPathBotRunnerProps> = ({
  workflow,
  currentStepIndex,
  isRunning,
  isPaused,
  onStart,
  onPause,
  onResume,
  onStepNext,
  onReset,
  speed,
  setSpeed,
  onTriggerSelfHealing,
  cursorPosition,
  executionLogs,
}) => {
  const steps = workflow?.steps || [];
  const totalSteps = steps.length;
  const progressPercent = totalSteps > 0 ? Math.min(100, Math.round(((currentStepIndex + 1) / totalSteps) * 100)) : 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-3 shadow-xs text-slate-800">
      {/* Header & Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center relative shadow-xs">
            <Bot className="w-4 h-4" />
            {isRunning && !isPaused && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                UiPath Bot Execution Engine
              </h4>
              <span
                className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${
                  isRunning && !isPaused
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 animate-pulse'
                    : isPaused
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : currentStepIndex >= totalSteps && totalSteps > 0
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {isRunning && !isPaused
                  ? '⚡ Bot Active'
                  : isPaused
                  ? '⏸️ Paused'
                  : currentStepIndex >= totalSteps && totalSteps > 0
                  ? '✅ Completed'
                  : 'Idle (Ready)'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {workflow
                ? `${totalSteps} Activities • ${workflow.riskLevel} Risk • Est. ${workflow.executionTimeEstimateSec.toFixed(1)}s`
                : 'No workflow loaded. Enter instruction or choose a preset.'}
            </p>
          </div>
        </div>

        {/* Self-Healing Trigger Button */}
        <button
          id="btn-trigger-self-healing"
          onClick={onTriggerSelfHealing}
          className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-md transition-all shadow-xs"
          title="Simulate a broken locator and test AI Self-Healing engine"
        >
          <Wrench className="w-3 h-3 text-amber-600" />
          <span className="hidden sm:inline">Test Self-Healing</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
          <span>Activity Progress: Step {Math.max(0, currentStepIndex + 1)} of {totalSteps}</span>
          <span className="font-semibold text-slate-700">{progressPercent}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
          <div
            className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Playback Controls & Speed */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          {!isRunning || isPaused ? (
            <button
              id="btn-bot-play"
              onClick={isPaused ? onResume : onStart}
              disabled={!workflow || totalSteps === 0}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-black text-white rounded-md shadow-xs transition-all active:scale-95 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isPaused ? 'Resume' : 'Run Bot'}</span>
            </button>
          ) : (
            <button
              id="btn-bot-pause"
              onClick={onPause}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-md shadow-xs transition-all active:scale-95"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </button>
          )}

          <button
            id="btn-bot-step"
            onClick={onStepNext}
            disabled={!workflow || totalSteps === 0 || (isRunning && !isPaused)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-md transition-all shadow-xs disabled:opacity-40"
            title="Execute single activity (Step-by-step debug mode)"
          >
            <SkipForward className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Step Next</span>
          </button>

          <button
            id="btn-bot-reset"
            onClick={onReset}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-md transition-all shadow-xs"
            title="Reset execution and clear state"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset</span>
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200/70 text-[11px]">
          <span className="text-slate-400 font-semibold uppercase text-[9px] mr-1">Speed:</span>
          {[
            { label: '0.5x', val: 0.5 },
            { label: '1x', val: 1 },
            { label: '2x', val: 2 },
            { label: 'Max', val: 4 },
          ].map(s => (
            <button
              key={s.label}
              onClick={() => setSpeed(s.val)}
              className={`px-1.5 py-0.5 rounded font-medium ${
                speed === s.val ? 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Live Activity Stream Terminal */}
      <div className="bg-slate-900 rounded-lg border border-slate-800 p-2.5 max-h-24 overflow-y-auto font-mono text-[10px] space-y-1 shadow-inner">
        {executionLogs.length === 0 ? (
          <div className="text-slate-400 italic">No execution logs yet. Click "Run Bot" or "Run Final Demo" to start.</div>
        ) : (
          executionLogs.map((log, i) => (
            <div
              key={i}
              className={`flex items-start gap-1.5 ${
                log.type === 'success'
                  ? 'text-emerald-400'
                  : log.type === 'warn'
                  ? 'text-amber-400'
                  : log.type === 'error'
                  ? 'text-rose-400'
                  : 'text-slate-300'
              }`}
            >
              <span className="text-slate-500">{log.time}</span>
              <span>{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
