import React, { useState } from 'react';
import {
  Database,
  Search,
  Plus,
  Download,
  Filter,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Globe,
  Tag,
  Code2,
} from 'lucide-react';
import { DatasetItem, RiskLevel } from '../types/rpa';
import { INITIAL_DATASET } from '../data/initialData';

interface DatasetStudioProps {
  onLoadDatasetItemToStudio: (item: DatasetItem) => void;
}

export const DatasetStudio: React.FC<DatasetStudioProps> = ({ onLoadDatasetItemToStudio }) => {
  const [dataset, setDataset] = useState<DatasetItem[]>(INITIAL_DATASET);
  const [searchFilter, setSearchFilter] = useState('');
  const [langFilter, setLangFilter] = useState<'ALL' | 'English' | 'Hindi' | 'Hinglish'>('ALL');
  const [riskFilter, setRiskFilter] = useState<'ALL' | RiskLevel>('ALL');
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredData = dataset.filter(item => {
    const matchesSearch =
      item.instruction.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.intent.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesLang = langFilter === 'ALL' || item.language === langFilter;
    const matchesRisk = riskFilter === 'ALL' || item.riskLevel === riskFilter;
    return matchesSearch && matchesLang && matchesRisk;
  });

  const handleGenerateSyntheticData = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/rpa/dataset-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: 'Mixed Hinglish, Hindi, Typos and High Risk', count: 3 }),
      });
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        setDataset(prev => [...data.items, ...prev]);
      }
    } catch (e) {
      console.error('Synthetic generation failed:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportJSONL = () => {
    const jsonlContent = dataset.map(item => JSON.stringify(item)).join('\n');
    const blob = new Blob([jsonlContent], { type: 'application/x-jsonlines' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'willovate_rpa_training_dataset.jsonl';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shadow-xs">
              <Database className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">RPA Model Training Dataset Studio</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
              {dataset.length} Curated Samples
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Supervised fine-tuning corpus covering English, Hindi, Hinglish, spelling mistakes, incomplete instructions, and risk tags.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleGenerateSyntheticData}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95 disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Synthesizing with Gemini...' : 'Generate Synthetic Pairs'}</span>
          </button>

          <button
            onClick={handleExportJSONL}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-xs transition-all"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export JSONL (Fine-Tuning)</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search instructions or intents..."
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-500 px-1 font-bold uppercase">Lang:</span>
            {(['ALL', 'English', 'Hindi', 'Hinglish'] as const).map(l => (
              <button
                key={l}
                onClick={() => setLangFilter(l)}
                className={`px-2.5 py-0.5 text-xs rounded-md font-medium transition-all ${
                  langFilter === l ? 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-500 px-1 font-bold uppercase">Risk:</span>
            {(['ALL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const).map(r => (
              <button
                key={r}
                onClick={() => setRiskFilter(r)}
                className={`px-2.5 py-0.5 text-xs rounded-md font-medium transition-all ${
                  riskFilter === r ? 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dataset Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3">Instruction</th>
                <th className="px-4 py-3">Language</th>
                <th className="px-4 py-3">Intent</th>
                <th className="px-4 py-3">Extracted Entities</th>
                <th className="px-4 py-3">Missing Info</th>
                <th className="px-4 py-3">Risk Level</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3 max-w-sm">
                    <div className="font-semibold text-slate-900">{item.instruction}</div>
                    {item.hasSpellingMistakes && (
                      <span className="text-[10px] text-amber-700 font-mono font-medium">⚠️ Typo / Slang Variation</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        item.language === 'Hinglish'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : item.language === 'Hindi'
                          ? 'bg-orange-50 text-orange-700 border-orange-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {item.language}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-indigo-700 font-bold">{item.intent}</td>
                  <td className="px-4 py-3 font-mono text-slate-700">
                    {Object.keys(item.entities).length > 0 ? (
                      <div className="space-y-0.5">
                        {Object.entries(item.entities).map(([k, v]) => (
                          <div key={k} className="text-[11px]">
                            <span className="text-slate-400">{k}:</span> <span className="text-slate-800 font-medium">{v}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">None</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {item.missingFields.length > 0 ? (
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-rose-50 text-rose-700 border border-rose-200 font-mono font-medium">
                        {item.missingFields.join(', ')}
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Complete</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        item.riskLevel === 'CRITICAL'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : item.riskLevel === 'HIGH'
                          ? 'bg-orange-50 text-orange-700 border-orange-200'
                          : item.riskLevel === 'MEDIUM'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {item.riskLevel}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onLoadDatasetItemToStudio(item)}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-md transition-all shadow-xs"
                    >
                      Test in Bot
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
