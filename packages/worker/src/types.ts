/**
 * Available UI component types for classification
 */
export type UIComponentType = 
  | 'text'
  | 'table' 
  | 'chart'
  | 'map'
  | 'list'
  | 'form'
  | 'card'
  | 'timeline'
  | 'tree'
  | 'gallery'
  | 'grid'
  | 'tabs'
  | 'accordion'
  | 'dialog'
  | 'graph'
  | 'calendar'
  | 'kanban'
  | 'dashboard'
  | 'carousel'
  | 'stepper'
  | 'rating'
  | 'badge'
  | 'progress'
  | 'skeleton'
  | 'notification';

/**
 * Input data for UI classification
 */
export interface ClassificationInput {
  /** The AI response content to classify */
  content: string;
  /** Additional context about the response */
  context?: {
    /** Type of AI model used */
    modelType?: string;
    /** User query that generated this response */
    userQuery?: string;
    /** Previous conversation context */
    conversationHistory?: string[];
  };
  /** User preferences for UI selection */
  preferences?: {
    /** Preferred component types */
    preferredTypes?: UIComponentType[];
    /** Accessibility requirements */
    accessibility?: boolean;
    /** Mobile-first design preference */
    mobileFirst?: boolean;
  };
}

/**
 * Result of UI classification
 */
export interface ClassificationResult {
  /** Recommended UI component type */
  componentType: UIComponentType;
  /** Confidence score (0-1) */
  confidence: number;
  /** Alternative suggestions */
  alternatives?: Array<{
    componentType: UIComponentType;
    confidence: number;
  }>;
  /** Extracted structured data for the component */
  data?: Record<string, any>;
  /** Performance metrics */
  metrics?: {
    /** Processing time in milliseconds */
    processingTime: number;
    /** Model inference time */
    inferenceTime: number;
  };
}

/**
 * WebGPU device configuration
 */
export interface WebGPUConfig {
  /** Preferred adapter type */
  powerPreference?: 'low-power' | 'high-performance';
  /** Required features */
  requiredFeatures?: string[];
  /** Required limits */
  requiredLimits?: Record<string, number>;
}

/**
 * LLM model configuration
 */
export interface ModelConfig {
  /** Model name/identifier */
  modelName: string;
  /** Model size variant */
  variant?: '100M' | '1B' | '7B';
  /** Quantization settings */
  quantization?: '4bit' | '8bit' | 'fp16';
  /** Max sequence length */
  maxLength?: number;
}

/**
 * Worker message types for communication
 */
export type WorkerMessage = 
  | { type: 'init'; config: ModelConfig & WebGPUConfig }
  | { type: 'classify'; input: ClassificationInput; id: string }
  | { type: 'dispose' };

export type WorkerResponse =
  | { type: 'ready' }
  | { type: 'result'; result: ClassificationResult; id: string }
  | { type: 'error'; error: string; id?: string };