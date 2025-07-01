import type { ReactNode } from 'react';
import type { 
  UIComponentType, 
  ClassificationInput,
  ClassificationResult 
} from '@pivotui/worker';

/**
 * Configuration for PivotUI provider
 */
export interface PivotUIConfig {
  /** Worker script URL for WebGPU inference */
  workerScript?: string;
  /** Fallback component type when classification fails */
  fallbackComponent?: UIComponentType;
  /** Enable analytics tracking */
  enableAnalytics?: boolean;
  /** Enable development mode with mock classifier */
  developmentMode?: boolean;
  /** Debounce delay for classification requests (ms) */
  debounceDelay?: number;
}

/**
 * Options for adaptive rendering
 */
export interface AdaptiveRenderOptions {
  /** Fallback component type */
  fallback?: UIComponentType;
  /** Force specific component type */
  forceComponent?: UIComponentType;
  /** Enable analytics for this render */
  enableAnalytics?: boolean;
  /** Additional classification context */
  context?: ClassificationInput['context'];
  /** User preferences for this render */
  preferences?: ClassificationInput['preferences'];
}

/**
 * Props for individual UI components
 */
export interface ComponentProps {
  /** Extracted data from classification */
  data: Record<string, any>;
  /** Raw content being rendered */
  content: string;
  /** Classification result metadata */
  metadata?: ClassificationResult;
  /** Additional CSS classes */
  className?: string;
  /** Component style overrides */
  style?: React.CSSProperties;
}

/**
 * Analytics event data
 */
export interface AnalyticsEvent {
  /** Event type */
  type: 'render' | 'interaction' | 'error' | 'performance';
  /** Component type that triggered the event */
  componentType: UIComponentType;
  /** Event timestamp */
  timestamp: number;
  /** Additional event data */
  data?: Record<string, any>;
}

/**
 * Thompson Sampling bandit state
 */
export interface BanditState {
  /** Component type */
  component: UIComponentType;
  /** Success count (alpha parameter) */
  successes: number;
  /** Failure count (beta parameter) */
  failures: number;
  /** Last updated timestamp */
  lastUpdated: number;
}

/**
 * PivotUI context value
 */
export interface PivotUIContextValue {
  /** Current configuration */
  config: PivotUIConfig;
  /** Worker instance ready state */
  isReady: boolean;
  /** Classify content and render appropriate component */
  adaptiveRender: (content: string, options?: AdaptiveRenderOptions) => JSX.Element;
  /** Manual classification without rendering */
  classify: (input: ClassificationInput) => Promise<ClassificationResult>;
  /** Track analytics event */
  trackEvent: (event: AnalyticsEvent) => void;
  /** Get current analytics data */
  getAnalytics: () => AnalyticsEvent[];
  /** Update bandit state with feedback */
  updateBandit: (componentType: UIComponentType, success: boolean) => void;
  /** Get current bandit states */
  getBanditStates: () => BanditState[];
}

/**
 * Props for PivotUI provider
 */
export interface PivotUIProviderProps {
  /** Provider configuration */
  config?: PivotUIConfig;
  /** Child components */
  children: ReactNode;
}

/**
 * Hook return type for usePivotUI
 */
export interface UsePivotUIReturn {
  /** Adaptive render function */
  adaptiveRender: PivotUIContextValue['adaptiveRender'];
  /** Classification function */
  classify: PivotUIContextValue['classify'];
  /** Worker ready state */
  isReady: boolean;
  /** Track analytics event */
  trackEvent: PivotUIContextValue['trackEvent'];
  /** Get analytics data */
  getAnalytics: PivotUIContextValue['getAnalytics'];
  /** Update bandit with feedback */
  updateBandit: PivotUIContextValue['updateBandit'];
  /** Get bandit states */
  getBanditStates: PivotUIContextValue['getBanditStates'];
}

/**
 * Component registry type
 */
export type ComponentRegistry = Record<UIComponentType, React.ComponentType<ComponentProps>>;

/**
 * Patch operation for hot-swapping components
 */
export interface PatchOperation {
  /** Operation type */
  type: 'replace' | 'update';
  /** Target component type */
  componentType: UIComponentType;
  /** New component props */
  props: ComponentProps;
  /** Animation transition config */
  transition?: {
    /** Duration in milliseconds */
    duration: number;
    /** Easing function */
    easing: string;
  };
}