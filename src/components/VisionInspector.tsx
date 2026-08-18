import React, { useState, useRef } from 'react';
import {
  Eye,
  Upload,
  Sparkles,
  MousePointer,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  RefreshCw,
  Maximize2,
  FileCode,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  Crosshair,
  ShieldAlert,
  Search,
  SlidersHorizontal,
  FileText,
  Package,
  Users,
  Lock,
  Download,
  Terminal,
  Globe,
  CornerDownRight,
  Activity,
  Play,
  Settings,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { VisionDetection, AutomationAction } from '../types/rpa';

interface VisionInspectorProps {
  onGenerateWorkflowFromVision: (elements: VisionDetection[]) => void;
}

type SamplePreset = 'crm' | 'products' | 'error_modal' | 'login' | 'reports';

interface PresetConfig {
  id: SamplePreset;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  badge: string;
  url: string;
  pageSummary: string;
  detectedError: string | null;
  elements: VisionDetection[];
}

const PRESETS: Record<SamplePreset, PresetConfig> = {
  crm: {
    id: 'crm',
    title: 'CRM Customer Portal',
    subtitle: 'Add Customer action, filter search, 6-column data grid',
    icon: Users,
    badge: 'Standard CRM',
    url: 'https://erp.willovate.internal/customers',
    pageSummary: 'CRM Customer Directory Portal with search filters, toolbar actions, and paginated customer records.',
    detectedError: null,
    elements: [
      {
        id: 'crm-search',
        type: 'input',
        label: 'Customer Search Input',
        ocrText: 'Search by customer name, phone, or email...',
        boundingBox: { x: 18, y: 16, width: 36, height: 6 },
        targetSelector: '[data-testid="input-customer-search"]',
        uipathSelector: "<html app='chrome.exe' /><webctrl tag='INPUT' type='text' placeholder='*Search*' />",
        anchorText: 'Search',
        fuzzyScore: 0.96,
        suggestedAction: 'ENTER_TEXT',
        confidence: 0.98,
      },
      {
        id: 'crm-export',
        type: 'button',
        label: 'Export CSV Action Button',
        ocrText: 'Export CSV',
        boundingBox: { x: 74, y: 16, width: 11, height: 6 },
        targetSelector: '[data-testid="btn-export-customers"]',
        uipathSelector: "<html app='chrome.exe' /><webctrl tag='BUTTON' aaname='Export CSV' />",
        anchorText: 'Export',
        fuzzyScore: 0.95,
        suggestedAction: 'DOWNLOAD_FILE',
        confidence: 0.96,
      },
      {
        id: 'crm-add',
        type: 'button',
        label: '+ Add Customer CTA Button',
        ocrText: '+ Add Customer',
        boundingBox: { x: 86, y: 16, width: 14, height: 6 },
        targetSelector: '[data-testid="btn-add-customer"]',
        uipathSelector: "<html app='chrome.exe' /><webctrl tag='BUTTON' aaname='*Add Customer*' />",
        anchorText: 'Customer Management',
        fuzzyScore: 0.99,
        suggestedAction: 'CLICK',
        confidence: 0.99,
      },
      {
        id: 'crm-table',
        type: 'table',
        label: 'Customers Records Data Grid',
        ocrText: 'Rahul Sharma | Priya Patel | Amit Verma | Sneha Kulkarni',
        boundingBox: { x: 4, y: 26, width: 92, height: 65 },
        targetSelector: '[data-testid="customers-table"]',
        uipathSelector: "<html app='chrome.exe' /><webctrl tag='TABLE' role='grid' />",
        anchorText: 'Customer Name',
        fuzzyScore: 0.99,
        suggestedAction: 'READ_TABLE',
        confidence: 0.99,
      },
      {
        id: 'crm-nav',
        type: 'header',
        label: 'Top Navigation Menu',
        ocrText: 'Customers CRM | Products | Reports',
        boundingBox: { x: 4, y: 4, width: 92, height: 8 },
        targetSelector: '[data-testid="nav-customers"]',
        uipathSelector: "<html app='chrome.exe' /><webctrl tag='NAV' role='navigation' />",
        anchorText: 'Customers CRM',
        fuzzyScore: 0.97,
        suggestedAction: 'OPEN_PAGE',
        confidence: 0.97,
      },
    ],
  },
  products: {
    id: 'products',
    title: 'Product & Pricing Catalog',
    subtitle: 'Search input, inline price modifier, ERP items',
    icon: Package,
    badge: 'ERP Catalog',
    url: 'https://erp.willovate.internal/products',
    pageSummary: 'Product Inventory & Pricing Catalog with SKU tags, stock badges, and price update triggers.',
    detectedError: null,
    elements: [
      {
        id: 'prod-search',
        type: 'input',
        label: 'Catalog Search Input',
        ocrText: 'Search catalog products...',
        boundingBox: { x: 4, y: 16, width: 45, height: 6 },
        targetSelector: '[data-testid="input-product-search"]',
        uipathSelector: "<html app='chrome.exe' /><webctrl id='input-product-search' tag='INPUT' />",
        anchorText: 'Search catalog',
        fuzzyScore: 0.97,
        suggestedAction: 'ENTER_TEXT',
        confidence: 0.97,
      },
      {
        id: 'prod-edit-1',
        type: 'button',
        label: 'Edit Price Button (Cloud ERP Pro)',
        ocrText: 'Edit Price',
        boundingBox: { x: 34, y: 48, width: 12, height: 5 },
        targetSelector: '[data-testid="btn-edit-price-erp"]',
        uipathSelector: "<html app='chrome.exe' /><webctrl parentid='prod-1' tag='BUTTON' aaname='Edit Price' />",
        anchorText: 'Cloud ERP Pro',
        fuzzyScore: 0.95,
        suggestedAction: 'CLICK',
        confidence: 0.96,
      },
      {
        id: 'prod-price-1',
        type: 'input',
        label: 'Product Price Value Field',
        ocrText: '₹1,299',
        boundingBox: { x: 38, y: 32, width: 8, height: 6 },
        targetSelector: '[data-testid="input-product-price"]',
        uipathSelector: "<html app='chrome.exe' /><webctrl tag='INPUT' type='number' name='price' />",
        anchorText: 'Price',
        fuzzyScore: 0.94,
        suggestedAction: 'ENTER_TEXT',
        confidence: 0.95,
      },
      {
        id: 'prod-save',
        type: 'button',
        label: 'Save Price Update',
        ocrText: 'Save Update',
        boundingBox: { x: 26, y: 48, width: 7, height: 5 },
        targetSelector: '[data-testid="btn-save-price"]',
        uipathSelector: "<html app='chrome.exe' /><webctrl tag='BUTTON' aaname='Save Update' />",
        anchorText: 'Save',
        fuzzyScore: 0.99,
        suggestedAction: 'CLICK',
        confidence: 0.99,
      },
    ],
  },
  error_modal: {
    id: 'error_modal',
    title: 'High-Risk Danger Modal',
    subtitle: 'Destructive deletion confirm, alert banner',
    icon: ShieldAlert,
    badge: 'Critical Alert',
    url: 'https://erp.willovate.internal/customers?action=delete',
    pageSummary: 'High-Risk Confirmation Alert Dialog for irreversible record deletion.',
    detectedError: 'Permanent Deletion Warning: Customer records and related audit logs will be permanently expunged.',
    elements: [
      {
        id: 'err-banner',
        type: 'error',
        label: 'Danger Warning Banner Header',
        ocrText: '⚠️ Permanent Deletion Warning',
        boundingBox: { x: 28, y: 22, width: 44, height: 10 },
        targetSelector: '#modal-risk-warning',
        uipathSelector: "<html app='chrome.exe' /><webctrl tag='DIV' role='alertdialog' />",
        anchorText: 'Permanent Deletion',
        fuzzyScore: 0.99,
        suggestedAction: 'VERIFY_TEXT',
        confidence: 0.99,
      },
      {
        id: 'err-confirm',
        type: 'button',
        label: 'Confirm Permanent Deletion CTA',
        ocrText: 'Yes, Delete Permanently',
        boundingBox: { x: 52, y: 68, width: 18, height: 7 },
        targetSelector: '[data-testid="btn-modal-confirm-delete"]',
        uipathSelector: "<html app='chrome.exe' /><webctrl tag='BUTTON' aaname='*Confirm Delete*' />",
        anchorText: 'Delete Permanently',
        fuzzyScore: 0.98,
        suggestedAction: 'CLICK',
        confidence: 0.99,
      },
      {
        id: 'err-cancel',
        type: 'button',
        label: 'Cancel Action Button',
        ocrText: 'Cancel',
        boundingBox: { x: 32, y: 68, width: 12, height: 7 },
        targetSelector: '[data-testid="btn-modal-cancel"]',
        uipathSelector: "<html app='chrome.exe' /><webctrl tag='BUTTON' aaname='Cancel' />",
        anchorText: 'Cancel',
        fuzzyScore: 0.97,
        suggestedAction: 'CLICK',
        confidence: 0.97,
      },
    ],
  },
  login: {
    id: 'login',
    title: 'Enterprise SSO Gateway',
    subtitle: 'Email, password credentials, submit button',
    icon: Lock,
    badge: 'Auth Screen',
    url: 'https://auth.willovate.internal/sso/login',
    pageSummary: 'Enterprise SSO Authentication Gateway with Email and Password Input Controls.',
    detectedError: null,
    elements: [
      {
        id: 'login-email',
        type: 'input',
        label: 'Work Email / Username Input',
        ocrText: 'employee@willovate.com',
        boundingBox: { x: 30, y: 34, width: 40, height: 7 },
        targetSelector: '[data-testid="input-login-email"]',
        uipathSelector: "<html app='chrome.exe' /><webctrl tag='INPUT' type='email' />",
        anchorText: 'Email address',
        fuzzyScore: 0.98,
        suggestedAction: 'ENTER_TEXT',
        confidence: 0.99,
      },
      {
        id: 'login-password',
        type: 'input',
        label: 'Password Input Field',
        ocrText: '••••••••••••',
        boundingBox: { x: 30, y: 46, width: 40, height: 7 },
        targetSelector: '[data-testid="input-login-password"]',
        uipathSelector: "<html app='chrome.exe' /><webctrl tag='INPUT' type='password' />",
        anchorText: 'Password',
        fuzzyScore: 0.99,
        suggestedAction: 'ENTER_TEXT',
        confidence: 0.99,
      },
      {
        id: 'login-submit',
        type: 'button',
        label: 'Sign In Submit Button',
        ocrText: 'Sign In to Studio',
        boundingBox: { x: 30, y: 58, width: 40, height: 7 },
        targetSelector: '[data-testid="btn-login-submit"]',
        uipathSelector: "<html app='chrome.exe' /><webctrl tag='BUTTON' type='submit' />",
        anchorText: 'Sign In',
        fuzzyScore: 0.99,
        suggestedAction: 'SUBMIT',
        confidence: 0.99,
      },
    ],
  },
  reports: {
    id: 'reports',
    title: 'Reports Dispatch Center',
    subtitle: 'Excel export, email report modal trigger',
    icon: FileText,
    badge: 'Reporting',
    url: 'https://erp.willovate.internal/reports',
    pageSummary: 'Report Generation & File Export Dispatch Center with download triggers.',
    detectedError: null,
    elements: [
      {
        id: 'rep-download',
        type: 'button',
        label: 'Download Excel (.xlsx) Action',
        ocrText: 'Download Excel (.xlsx)',
        boundingBox: { x: 62, y: 32, width: 16, height: 6 },
        targetSelector: '[data-testid="btn-download-excel"]',
        uipathSelector: "<html app='chrome.exe' /><webctrl aaname='*Download Excel*' tag='BUTTON' />",
        anchorText: 'Daily Sales Report',
        fuzzyScore: 0.97,
        suggestedAction: 'DOWNLOAD_FILE',
        confidence: 0.97,
      },
      {
        id: 'rep-email',
        type: 'button',
        label: 'Open Email Dispatch Modal',
        ocrText: 'Email Report',
        boundingBox: { x: 80, y: 32, width: 14, height: 6 },
        targetSelector: '[data-testid="btn-open-email-dispatch"]',
        uipathSelector: "<html app='chrome.exe' /><webctrl aaname='*Email Report*' tag='BUTTON' />",
        anchorText: 'Daily Sales Report',
        fuzzyScore: 0.98,
        suggestedAction: 'CLICK',
        confidence: 0.98,
      },
      {
        id: 'rep-table',
        type: 'table',
        label: 'Generated Reports Table Ledger',
        ocrText: 'Daily Sales Report | Monthly Growth Summary | Inventory Audit',
        boundingBox: { x: 4, y: 22, width: 92, height: 70 },
        targetSelector: '[data-testid="reports-table"]',
        uipathSelector: "<html app='chrome.exe' /><webctrl id='reports-table' tag='TABLE' />",
        anchorText: 'Report Title',
        fuzzyScore: 0.99,
        suggestedAction: 'READ_TABLE',
        confidence: 0.99,
      },
    ],
  },
};

export const VisionInspector: React.FC<VisionInspectorProps> = ({ onGenerateWorkflowFromVision }) => {
  const [selectedSample, setSelectedSample] = useState<SamplePreset>('crm');
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [customImageName, setCustomImageName] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedElements, setDetectedElements] = useState<VisionDetection[]>(PRESETS.crm.elements);
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(PRESETS.crm.elements[0].id);
  const [filterType, setFilterType] = useState<string>('all');
  const [pageSummary, setPageSummary] = useState<string>(PRESETS.crm.pageSummary);
  const [detectedError, setDetectedError] = useState<string | null>(null);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState<boolean>(true);
  const [showOcrLabels, setShowOcrLabels] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'inspector' | 'xml' | 'json'>('inspector');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [simulatedClickTarget, setSimulatedClickTarget] = useState<{ label: string; action: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Switch Preset
  const handleSelectPreset = (preset: SamplePreset) => {
    setSelectedSample(preset);
    setCustomImage(null);
    setCustomImageName(null);
    const config = PRESETS[preset];
    setDetectedElements(config.elements);
    setSelectedElementId(config.elements[0]?.id || null);
    setPageSummary(config.pageSummary);
    setDetectedError(config.detectedError);
  };

  // Custom Screenshot Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async event => {
      const base64Data = event.target?.result as string;
      setCustomImage(base64Data);
      setCustomImageName(file.name);
      setIsAnalyzing(true);

      try {
        const res = await fetch('/api/rpa/vision-inspect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64Data,
            prompt: 'Inspect this uploaded user interface screenshot for UiPath RPA automation targets.',
          }),
        });
        const data = await res.json();
        if (data.elements && data.elements.length > 0) {
          setDetectedElements(data.elements);
          setSelectedElementId(data.elements[0].id);
          if (data.pageStructure) setPageSummary(data.pageStructure);
          setDetectedError(data.detectedError || null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTriggerSimulate = (el: VisionDetection) => {
    setSelectedElementId(el.id);
    setSimulatedClickTarget({
      label: el.label,
      action: el.suggestedAction,
    });
    setTimeout(() => setSimulatedClickTarget(null), 1500);
  };

  const filteredElements = detectedElements.filter(el => {
    if (filterType === 'all') return true;
    return el.type === filterType;
  });

  const selectedElement = detectedElements.find(el => el.id === selectedElementId) || detectedElements[0];

  const currentConfig = PRESETS[selectedSample];

  // Element Styling Helpers
  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'button':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'input':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'table':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'error':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  // Helper for rendering realistic interactive DOM element with attached bounding box
  const renderInteractiveTargetWrapper = (
    elementId: string,
    children: React.ReactNode,
    extraClasses: string = ''
  ) => {
    const el = detectedElements.find(item => item.id === elementId);
    const isSelected = selectedElementId === elementId;
    const isHovered = hoveredElementId === elementId;

    if (!el || !showBoundingBoxes) {
      return <div className={`relative ${extraClasses}`}>{children}</div>;
    }

    return (
      <div
        onClick={e => {
          e.stopPropagation();
          handleTriggerSimulate(el);
        }}
        onMouseEnter={() => setHoveredElementId(el.id)}
        onMouseLeave={() => setHoveredElementId(null)}
        className={`relative transition-all duration-150 rounded-md cursor-pointer group ${extraClasses} ${
          isSelected
            ? 'ring-2 ring-indigo-600 bg-indigo-50/40 shadow-sm'
            : isHovered
            ? 'ring-2 ring-indigo-400 bg-indigo-50/20'
            : 'ring-1 ring-dashed ring-slate-300 hover:ring-indigo-300'
        }`}
      >
        {/* Floating Indicator Label Tag */}
        {(showOcrLabels || isHovered || isSelected) && (
          <div className="absolute -top-3 left-2 z-20 flex items-center gap-1 shadow-xs pointer-events-none">
            <span
              className={`text-[8px] font-mono font-bold px-1.5 py-0.2 rounded border uppercase tracking-wider ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-700'
                  : 'bg-slate-800 text-slate-100 border-slate-700'
              }`}
            >
              {el.type}
            </span>
            <span className="text-[8px] font-mono text-slate-700 bg-white/95 px-1 py-0.2 rounded border border-slate-200 shadow-xs">
              {(el.confidence * 100).toFixed(0)}% Match
            </span>
          </div>
        )}
        {children}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header & Overview Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shadow-xs">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Computer Vision & UI Screenshot Understanding</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                UiPath-compatible visual locator extraction with OCR recognition, anchored bounding boxes, and XML selector generation.
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 rounded-lg shadow-xs transition-all active:scale-95"
            title="Upload custom PNG/JPG screenshot"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-600" />
            <span>Upload Screenshot</span>
          </button>

          <button
            onClick={() => handleSelectPreset(selectedSample)}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Analyzing...' : 'Rescan Screen'}</span>
          </button>
        </div>
      </div>

      {/* Preset Scenario Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {(Object.keys(PRESETS) as SamplePreset[]).map(key => {
          const item = PRESETS[key];
          const Icon = item.icon;
          const isSelected = selectedSample === key && !customImage;
          return (
            <button
              key={key}
              onClick={() => handleSelectPreset(key)}
              className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-50/70 border-indigo-500 ring-2 ring-indigo-400/50 shadow-xs'
                  : 'bg-white hover:bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded border bg-white border-slate-200 text-slate-600">
                  {item.badge}
                </span>
              </div>
              <div className="mt-2.5">
                <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{item.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Split Grid: Left Interactive Browser Window | Right Locator Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Visual Browser Window */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            {/* macOS / Chrome Window Header Bar */}
            <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between gap-3 select-none">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="h-4 w-[1px] bg-slate-300 mx-1" />
                <div className="bg-white border border-slate-200 rounded px-2.5 py-0.5 text-[11px] text-slate-600 font-mono flex items-center gap-1.5 shadow-2xs max-w-xs truncate">
                  <Globe className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{customImage ? 'Uploaded Screenshot Canvas' : currentConfig.url}</span>
                </div>
              </div>

              {/* Visual Toggles */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                  className={`px-2 py-1 rounded text-[10px] font-semibold border transition-all ${
                    showBoundingBoxes
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : 'bg-white text-slate-500 border-slate-200'
                  }`}
                >
                  Locators: {showBoundingBoxes ? 'VISIBLE' : 'HIDDEN'}
                </button>
                <button
                  onClick={() => setShowOcrLabels(!showOcrLabels)}
                  className={`px-2 py-1 rounded text-[10px] font-semibold border transition-all ${
                    showOcrLabels
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : 'bg-white text-slate-500 border-slate-200'
                  }`}
                >
                  OCR Tags: {showOcrLabels ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            {/* Browser Viewport Screen */}
            <div className="p-5 bg-slate-50/50 min-h-[380px] relative flex flex-col justify-between">
              {/* If Custom Image Uploaded */}
              {customImage ? (
                <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-white">
                  <img src={customImage} alt="User Uploaded View" className="w-full object-contain max-h-[460px]" />
                  {showBoundingBoxes && (
                    <div className="absolute inset-0 pointer-events-auto">
                      {detectedElements.map(el => {
                        const isSelected = selectedElementId === el.id;
                        const isHovered = hoveredElementId === el.id;
                        return (
                          <div
                            key={el.id}
                            onClick={() => handleTriggerSimulate(el)}
                            onMouseEnter={() => setHoveredElementId(el.id)}
                            onMouseLeave={() => setHoveredElementId(null)}
                            style={{
                              left: `${el.boundingBox.x}%`,
                              top: `${el.boundingBox.y}%`,
                              width: `${el.boundingBox.width}%`,
                              height: `${el.boundingBox.height}%`,
                            }}
                            className={`absolute rounded border-2 cursor-pointer transition-all ${
                              isSelected
                                ? 'border-indigo-600 bg-indigo-500/20 shadow-md ring-2 ring-indigo-400'
                                : isHovered
                                ? 'border-indigo-400 bg-indigo-500/10'
                                : 'border-indigo-500/70 bg-indigo-500/5'
                            }`}
                          >
                            <span className="text-[8px] font-mono font-bold bg-slate-900 text-white px-1 rounded absolute -top-3 left-0 shadow-xs">
                              {el.type.toUpperCase()}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                /* High-Fidelity Pristine Rendered UI Screens */
                <div className="space-y-4">
                  {/* PRESET 1: CRM PORTAL */}
                  {selectedSample === 'crm' && (
                    <div className="space-y-4 bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                      {/* Top Navigation Target */}
                      {renderInteractiveTargetWrapper(
                        'crm-nav',
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 p-1">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                              W
                            </div>
                            <span className="text-xs font-bold text-slate-900">CRM Customer Portal</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                            <span className="text-indigo-600 font-bold border-b-2 border-indigo-600 pb-0.5">Customers CRM</span>
                            <span className="hover:text-slate-700 cursor-pointer">Products</span>
                            <span className="hover:text-slate-700 cursor-pointer">Reports</span>
                          </div>
                        </div>
                      )}

                      {/* Search & Action Bar */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                        {/* Search Input Target */}
                        {renderInteractiveTargetWrapper(
                          'crm-search',
                          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-400 w-full sm:w-72">
                            <Search className="w-3.5 h-3.5 text-slate-400" />
                            <span>Search by customer name, phone, or email...</span>
                          </div>
                        )}

                        {/* Export and Add Button Targets */}
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          {renderInteractiveTargetWrapper(
                            'crm-export',
                            <button className="px-3 py-1.5 text-xs bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg shadow-2xs hover:bg-slate-50">
                              Export CSV
                            </button>
                          )}
                          {renderInteractiveTargetWrapper(
                            'crm-add',
                            <button className="px-3 py-1.5 text-xs bg-indigo-600 text-white font-bold rounded-lg shadow-xs hover:bg-indigo-700">
                              + Add Customer
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Customers Data Table Grid */}
                      {renderInteractiveTargetWrapper(
                        'crm-table',
                        <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                          <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                              <tr>
                                <th className="px-3 py-2">Customer Name</th>
                                <th className="px-3 py-2">Phone Number</th>
                                <th className="px-3 py-2">Email Address</th>
                                <th className="px-3 py-2">Company</th>
                                <th className="px-3 py-2">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {[
                                { name: 'Rahul Sharma', phone: '9876543210', email: 'rahul.sharma@example.com', company: 'Enterprise Client', status: 'Customer' },
                                { name: 'Priya Patel', phone: '9876543211', email: 'priya.patel@example.com', company: 'Enterprise Client', status: 'Customer' },
                                { name: 'Amit Verma', phone: '9876543212', email: 'amit.verma@example.com', company: 'Enterprise Client', status: 'Customer' },
                                { name: 'Sneha Kulkarni', phone: '9876543213', email: 'sneha.kulkarni@example.com', company: 'Enterprise Client', status: 'Customer' },
                              ].map(row => (
                                <tr key={row.name} className="hover:bg-slate-50/50">
                                  <td className="px-3 py-2 font-semibold text-slate-900">{row.name}</td>
                                  <td className="px-3 py-2 text-slate-600 font-mono text-[11px]">{row.phone}</td>
                                  <td className="px-3 py-2 text-slate-600">{row.email}</td>
                                  <td className="px-3 py-2 text-slate-500">{row.company}</td>
                                  <td className="px-3 py-2">
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                      {row.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {/* PRESET 2: PRODUCTS CATALOG */}
                  {selectedSample === 'products' && (
                    <div className="space-y-4 bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-900">ERP Product & Pricing Catalog</span>
                        <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">Catalog Live</span>
                      </div>

                      {renderInteractiveTargetWrapper(
                        'prod-search',
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-400 w-64">
                          <Search className="w-3.5 h-3.5 text-slate-400" />
                          <span>Search catalog products...</span>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="p-3 border border-slate-200 rounded-lg bg-slate-50/50 space-y-2">
                          <span className="text-[9px] font-mono font-bold bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                            ERP-CORE-01
                          </span>
                          <h4 className="text-xs font-bold text-slate-900">Cloud ERP Pro License</h4>
                          <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                            {renderInteractiveTargetWrapper(
                              'prod-price-1',
                              <span className="text-xs font-bold text-slate-900 px-2 py-1 bg-white border border-slate-200 rounded">
                                ₹1,299
                              </span>
                            )}
                            {renderInteractiveTargetWrapper(
                              'prod-edit-1',
                              <button className="px-2.5 py-1 text-[11px] bg-indigo-600 text-white font-bold rounded shadow-xs hover:bg-indigo-700">
                                Edit Price
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="p-3 border border-slate-200 rounded-lg bg-slate-50/50 space-y-2">
                          <span className="text-[9px] font-mono font-bold bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                            RPA-BOT-RUNNER
                          </span>
                          <h4 className="text-xs font-bold text-slate-900">Willovate RPA Runner</h4>
                          <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                            <span className="text-xs font-bold text-slate-900 px-2 py-1 bg-white border border-slate-200 rounded">
                              ₹499
                            </span>
                            {renderInteractiveTargetWrapper(
                              'prod-save',
                              <button className="px-2.5 py-1 text-[11px] bg-emerald-600 text-white font-bold rounded shadow-xs hover:bg-emerald-700">
                                Save Update
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PRESET 3: ERROR / HIGH RISK MODAL */}
                  {selectedSample === 'error_modal' && (
                    <div className="min-h-[280px] flex items-center justify-center p-4">
                      <div className="bg-white border border-rose-300 rounded-xl p-5 shadow-xl max-w-sm w-full space-y-4 text-center">
                        <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center font-bold">
                          ⚠️
                        </div>
                        {renderInteractiveTargetWrapper(
                          'err-banner',
                          <div className="p-1">
                            <h4 className="text-xs font-bold text-rose-900">Permanent Deletion Warning</h4>
                            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                              Are you sure you want to permanently delete this customer record and all audit logs? This action is irreversible.
                            </p>
                          </div>
                        )}
                        <div className="flex items-center justify-center gap-3 pt-2">
                          {renderInteractiveTargetWrapper(
                            'err-cancel',
                            <button className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 text-xs font-semibold hover:bg-slate-200">
                              Cancel
                            </button>
                          )}
                          {renderInteractiveTargetWrapper(
                            'err-confirm',
                            <button className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold shadow-xs hover:bg-rose-700">
                              Yes, Delete Permanently
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PRESET 4: LOGIN / SSO GATEWAY */}
                  {selectedSample === 'login' && (
                    <div className="min-h-[280px] flex items-center justify-center p-4">
                      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-md max-w-xs w-full space-y-3">
                        <div className="text-center space-y-1">
                          <div className="w-7 h-7 rounded-lg bg-slate-900 text-white mx-auto flex items-center justify-center text-xs font-bold">
                            W
                          </div>
                          <h4 className="text-xs font-bold text-slate-900">Sign In to Willovate Studio</h4>
                        </div>
                        <div className="space-y-2.5 pt-1">
                          {renderInteractiveTargetWrapper(
                            'login-email',
                            <div className="p-1 space-y-0.5">
                              <label className="block text-[10px] font-semibold text-slate-500">Work Email</label>
                              <div className="border border-slate-200 bg-slate-50 rounded-lg px-2.5 py-1.5 text-xs text-slate-700">
                                employee@willovate.com
                              </div>
                            </div>
                          )}
                          {renderInteractiveTargetWrapper(
                            'login-password',
                            <div className="p-1 space-y-0.5">
                              <label className="block text-[10px] font-semibold text-slate-500">Password</label>
                              <div className="border border-slate-200 bg-slate-50 rounded-lg px-2.5 py-1.5 text-xs text-slate-400 font-mono">
                                ••••••••••••
                              </div>
                            </div>
                          )}
                          {renderInteractiveTargetWrapper(
                            'login-submit',
                            <button className="w-full py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-xs hover:bg-indigo-700 mt-2">
                              Sign In to Studio
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PRESET 5: REPORTS DISPATCH */}
                  {selectedSample === 'reports' && (
                    <div className="space-y-4 bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-900">Reports Dispatch & Ledger Center</span>
                        <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">Ready</span>
                      </div>

                      {renderInteractiveTargetWrapper(
                        'rep-table',
                        <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 text-xs bg-white">
                          {[
                            { title: 'Daily Sales & Transactions Report', format: 'Excel (.xlsx)', size: '1.4 MB' },
                            { title: 'Monthly Customer Growth Summary', format: 'PDF (.pdf)', size: '3.2 MB' },
                          ].map(rep => (
                            <div key={rep.title} className="p-3 flex items-center justify-between">
                              <div>
                                <div className="font-bold text-slate-900">{rep.title}</div>
                                <div className="text-slate-400 text-[10px]">{rep.format} • {rep.size}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                {renderInteractiveTargetWrapper(
                                  'rep-download',
                                  <button className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-[11px]">
                                    Download Excel
                                  </button>
                                )}
                                {renderInteractiveTargetWrapper(
                                  'rep-email',
                                  <button className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold text-[11px] shadow-xs">
                                    Email Report
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Bot Click Simulation Feedback */}
              {simulatedClickTarget && (
                <div className="absolute top-4 right-4 z-40 bg-slate-900 text-white px-3 py-1.5 rounded-lg shadow-xl text-xs font-mono flex items-center gap-2 animate-bounce">
                  <MousePointer className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Targeted [{simulatedClickTarget.action}]: {simulatedClickTarget.label}</span>
                </div>
              )}
            </div>
          </div>

          {/* Semantic Structure Note */}
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700 flex items-start gap-2 shadow-xs">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">Semantic Layout Analysis: </strong>
              <span>{pageSummary}</span>
            </div>
          </div>

          {detectedError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-rose-900">Safety & Danger Warning: </strong>
                <span>{detectedError}</span>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Deep-Dive UiPath Inspector Panel */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-4 shadow-xs">
          <div className="space-y-3.5">
            {/* Tab Navigation Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-900">UiPath Locator Intelligence</h3>
              </div>

              {/* Mode Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px] font-semibold">
                <button
                  onClick={() => setActiveTab('inspector')}
                  className={`px-2 py-0.5 rounded ${activeTab === 'inspector' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                >
                  Locators ({detectedElements.length})
                </button>
                <button
                  onClick={() => setActiveTab('xml')}
                  className={`px-2 py-0.5 rounded ${activeTab === 'xml' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                >
                  UiPath XML
                </button>
                <button
                  onClick={() => setActiveTab('json')}
                  className={`px-2 py-0.5 rounded ${activeTab === 'json' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                >
                  JSON Spec
                </button>
              </div>
            </div>

            {/* TAB 1: Detected Element Cards List & Detail Inspector */}
            {activeTab === 'inspector' && (
              <div className="space-y-3">
                {/* Filter Chips */}
                <div className="flex items-center gap-1 flex-wrap">
                  {['all', 'button', 'input', 'table', 'error'].map(t => (
                    <button
                      key={t}
                      onClick={() => setFilterType(t)}
                      className={`px-2 py-0.5 rounded text-[10px] capitalize border transition-all ${
                        filterType === t
                          ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* List of Elements */}
                <div className="divide-y divide-slate-100 max-h-[190px] overflow-y-auto space-y-1 pr-1">
                  {filteredElements.map(el => {
                    const isSelected = selectedElementId === el.id;
                    return (
                      <div
                        key={el.id}
                        onClick={() => {
                          setSelectedElementId(el.id);
                          handleTriggerSimulate(el);
                        }}
                        onMouseEnter={() => setHoveredElementId(el.id)}
                        onMouseLeave={() => setHoveredElementId(null)}
                        className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50/80 border-indigo-400 shadow-xs ring-1 ring-indigo-200'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase font-mono ${getBadgeColor(el.type)}`}>
                              {el.type}
                            </span>
                            <span className="text-xs font-bold text-slate-900 truncate">{el.label}</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            {el.suggestedAction}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                          <span className="truncate max-w-[200px] text-slate-600">{el.targetSelector}</span>
                          <span className="text-slate-400 text-[10px]">Conf: {(el.confidence * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Active Selected Element Detail Inspector Card */}
                {selectedElement && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2 shadow-inner">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Active Target Details</span>
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.2 rounded border font-mono ${getBadgeColor(selectedElement.type)}`}>
                        Score: {(selectedElement.confidence * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div className="space-y-1.5 text-[11px]">
                      <div>
                        <span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider block">OCR Text Recognized:</span>
                        <span className="font-semibold text-slate-800 bg-white px-2 py-1 rounded border border-slate-200 block truncate">
                          "{selectedElement.ocrText || selectedElement.label}"
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider">UiPath XML Selector:</span>
                          <button
                            onClick={() => handleCopy(selectedElement.uipathSelector || selectedElement.targetSelector, selectedElement.id)}
                            className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                          >
                            {copiedId === selectedElement.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedId === selectedElement.id ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        <code className="text-[10px] font-mono text-indigo-900 bg-white p-1.5 rounded border border-slate-200 block overflow-x-auto whitespace-pre">
                          {selectedElement.uipathSelector || `<html app='chrome.exe' /><webctrl selector='${selectedElement.targetSelector}' />`}
                        </code>
                      </div>

                      {selectedElement.anchorText && (
                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                          <span>Visual Anchor: <strong className="text-slate-700">"{selectedElement.anchorText}"</strong></span>
                          <span>Fuzzy Score: <strong className="text-emerald-700 font-bold">{((selectedElement.fuzzyScore || 0.98) * 100).toFixed(0)}%</strong></span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: UiPath XML Selectors View */}
            {activeTab === 'xml' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">UiPath Studio Activity Bindings</span>
                  <button
                    onClick={() => handleCopy(JSON.stringify(detectedElements.map(e => e.uipathSelector), null, 2), 'xml-all')}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    {copiedId === 'xml-all' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy All Selectors</span>
                  </button>
                </div>
                <div className="bg-slate-900 text-slate-100 rounded-xl p-3 font-mono text-[11px] max-h-[300px] overflow-y-auto space-y-2">
                  {detectedElements.map((el, i) => (
                    <div key={el.id} className="border-b border-slate-800 pb-2 last:border-0">
                      <span className="text-indigo-400 font-bold">// Target {i + 1}: {el.label} ({el.suggestedAction})</span>
                      <pre className="text-emerald-300 mt-1 whitespace-pre-wrap">{el.uipathSelector || `<html app='chrome.exe' /><webctrl selector='${el.targetSelector}' />`}</pre>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Raw JSON Spec */}
            {activeTab === 'json' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Vision Inference Spec (JSON)</span>
                  <button
                    onClick={() => handleCopy(JSON.stringify(detectedElements, null, 2), 'json-all')}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    {copiedId === 'json-all' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy JSON</span>
                  </button>
                </div>
                <pre className="bg-slate-900 text-slate-100 rounded-xl p-3 font-mono text-[10px] max-h-[300px] overflow-y-auto whitespace-pre-wrap">
                  {JSON.stringify(detectedElements, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Action Footer: Compile into UiPath Studio Workflow */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => onGenerateWorkflowFromVision(detectedElements)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-98"
            >
              <FileCode className="w-4 h-4 text-indigo-400" />
              <span>Compile Vision Targets into UiPath Studio Workflow</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
