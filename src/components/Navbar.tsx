import React from 'react';
import { Bot, Sparkles, Cpu, Eye, Database, BarChart3, BookOpen, ShieldCheck, Play } from 'lucide-react';

interface NavbarProps {
  activeTab: 'studio' | 'vision' | 'dataset' | 'evaluation' | 'architecture';
  setActiveTab: (tab: 'studio' | 'vision' | 'dataset' | 'evaluation' | 'architecture') => void;
  onQuickRunFinalDemo: () => void;
  isRunningBot: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onQuickRunFinalDemo,
  isRunningBot,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 text-slate-800 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-slate-900">
                Willovate <span className="text-indigo-600">BotStudio</span>
              </span>
              <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                Enterprise AI
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block font-normal">
              Natural Language Web Automation & UiPath Workflow Compiler
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/70 text-xs font-medium">
          <button
            id="tab-studio"
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'studio'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-semibold'
                : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Studio & Bot</span>
          </button>

          <button
            id="tab-vision"
            onClick={() => setActiveTab('vision')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'vision'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-semibold'
                : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-indigo-600" />
            <span>Vision UI</span>
          </button>

          <button
            id="tab-dataset"
            onClick={() => setActiveTab('dataset')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'dataset'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-semibold'
                : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-indigo-600" />
            <span>Training Dataset</span>
          </button>

          <button
            id="tab-evaluation"
            onClick={() => setActiveTab('evaluation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'evaluation'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-semibold'
                : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Evaluation</span>
          </button>

          <button
            id="tab-architecture"
            onClick={() => setActiveTab('architecture')}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'architecture'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-semibold'
                : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>15-Point Spec</span>
          </button>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <button
            id="btn-final-demo-header"
            onClick={onQuickRunFinalDemo}
            disabled={isRunningBot}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all active:scale-95 disabled:opacity-50"
            title="Execute the official demo command for Pankaj Koche"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Run Final Demo</span>
            <span className="sm:hidden">Demo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
