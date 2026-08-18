import React, { useState } from 'react';
import { Bot, Lock, Mail, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, User, KeyRound, Cpu, Layers } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: { name: string; email: string; role: string }) => void;
  onSkip?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onSkip }) => {
  const [email, setEmail] = useState('nayanmisal3@gmail.com');
  const [password, setPassword] = useState('willovate2026');
  const [name, setName] = useState('Nayan Misal');
  const [role, setRole] = useState('RPA Lead Architect');
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'quick_demo'>('signin');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: name || 'Nayan Misal',
        email: email || 'nayanmisal3@gmail.com',
        role: role || 'RPA Lead Architect',
      });
    }, 600);
  };

  const handleQuickDemoLogin = (demoName: string, demoEmail: string, demoRole: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: demoName,
        email: demoEmail,
        role: demoRole,
      });
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Subtle Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-md w-full relative z-10">
        {/* Brand Card Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-xl shadow-indigo-500/25 mb-4 text-white">
            <Bot className="w-8 h-8" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Willovate <span className="text-indigo-400">BotStudio</span>
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wide">
              Enterprise
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            UiPath-Standard AI Automation Engine & Workflow Compiler
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {/* Quick Demo Selector Chips */}
          <div className="mb-6">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Quick Authenticate As:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Nayan Misal', 'nayanmisal3@gmail.com', 'RPA Lead Architect')}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/80 hover:bg-indigo-950/60 border border-slate-700 hover:border-indigo-500/50 text-left transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  NM
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-slate-200 group-hover:text-indigo-300">Nayan Misal</div>
                  <div className="text-[10px] text-slate-500 truncate">Lead Architect</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Evaluator / Admin', 'evaluator@willovate.com', 'System Evaluator')}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/80 hover:bg-indigo-950/60 border border-slate-700 hover:border-indigo-500/50 text-left transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  EV
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-300">Evaluator</div>
                  <div className="text-[10px] text-slate-500 truncate">Full Admin Access</div>
                </div>
              </button>
            </div>
          </div>

          <div className="relative flex py-2 items-center mb-6">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-3 text-[11px] text-slate-500 uppercase font-semibold">Or Sign In with Credentials</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Nayan Misal"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 text-sm placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="nayanmisal3@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 text-sm placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Access Token / Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 text-sm placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Launch Automation Studio</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security Banner */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>UiPath Orchestrator Authenticated</span>
            </div>
            {onSkip && (
              <button
                type="button"
                onClick={onSkip}
                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                Skip Login →
              </button>
            )}
          </div>
        </div>

        {/* Feature Pill Indicators */}
        <div className="mt-6 grid grid-cols-3 gap-2 text-center text-[11px] text-slate-400">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl py-2 px-2">
            <div className="font-semibold text-slate-200">15-Point</div>
            <div className="text-[10px] text-slate-500">Full Spec</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl py-2 px-2">
            <div className="font-semibold text-slate-200">Multilingual</div>
            <div className="text-[10px] text-slate-500">EN / HI / Hinglish</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl py-2 px-2">
            <div className="font-semibold text-slate-200">Vision OCR</div>
            <div className="text-[10px] text-slate-500">DOM Locators</div>
          </div>
        </div>
      </div>
    </div>
  );
};
