export type AutomationAction =
  | 'OPEN_PAGE'
  | 'OPEN_URL'
  | 'CLICK'
  | 'ENTER_TEXT'
  | 'SELECT_OPTION'
  | 'UPLOAD_FILE'
  | 'DOWNLOAD_FILE'
  | 'READ_TEXT'
  | 'READ_TABLE'
  | 'SCROLL'
  | 'WAIT'
  | 'SUBMIT'
  | 'TAKE_SCREENSHOT'
  | 'VERIFY_TEXT'
  | 'ASSERT_EXISTS'
  | 'DELETE_RECORD';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface WorkflowStep {
  id: string;
  stepNumber: number;
  action: AutomationAction;
  target: string;
  selector?: string;
  value?: string;
  description: string;
  timeoutMs?: number;
  status?: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  log?: string;
  executionTimeMs?: number;
  screenshotUrl?: string;
}

export interface ExtractedEntity {
  key: string;
  label: string;
  value: string;
  confidence: number;
}

export interface WorkflowResult {
  instruction: string;
  intent: string;
  intentDescription: string;
  confidence: number;
  languageDetected: 'English' | 'Hindi' | 'Hinglish';
  entities: Record<string, string>;
  entityList: ExtractedEntity[];
  missingFields: string[];
  clarificationQuestion?: string;
  riskLevel: RiskLevel;
  riskReason?: string;
  requiresConfirmation: boolean;
  steps: WorkflowStep[];
  rawJson: string;
  isValid: boolean;
  validationErrors?: string[];
  executionTimeEstimateSec: number;
}

export interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  status: 'Active' | 'Lead' | 'Customer' | 'Prospect';
  createdAt: string;
}

export interface ProductRecord {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  lastUpdated: string;
}

export interface ReportRecord {
  id: string;
  title: string;
  date: string;
  format: string;
  size: string;
  status: 'Ready' | 'Generating' | 'Sent';
}

export interface DatasetItem {
  id: string;
  instruction: string;
  language: 'English' | 'Hindi' | 'Hinglish';
  intent: string;
  entities: Record<string, string>;
  workflowSummary: string;
  missingFields: string[];
  riskLevel: RiskLevel;
  stepsCount: number;
  hasSpellingMistakes?: boolean;
}

export interface EvaluationMetric {
  metric: string;
  score: number;
  targetScore: number;
  testedCount: number;
  status: 'passed' | 'warning' | 'failed';
  description: string;
}

export interface VisionDetection {
  id: string;
  type: 'button' | 'input' | 'dropdown' | 'table' | 'error' | 'header';
  label: string;
  boundingBox: { x: number; y: number; width: number; height: number };
  targetSelector: string;
  suggestedAction: AutomationAction;
  confidence: number;
  ocrText?: string;
  uipathSelector?: string;
  anchorText?: string;
  fuzzyScore?: number;
}
