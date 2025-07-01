import React, { createContext, useEffect, useState, useCallback, useMemo } from 'react';
import { createWorker, MockClassifier } from '@pivotui/worker';
import type { 
  ClassificationInput,
  ClassificationResult,
  UIComponentType 
} from '@pivotui/worker';
import type { 
  PivotUIConfig,
  PivotUIContextValue,
  PivotUIProviderProps,
  AdaptiveRenderOptions,
  AnalyticsEvent,
  BanditState,
  ComponentProps
} from './types.js';
import { componentRegistry } from './components/registry.js';
import { ThompsonSampling } from './utils/thompson-sampling.js';

/* Default configuration */
const defaultConfig: PivotUIConfig = {
  fallbackComponent: 'text',
  enableAnalytics: true,
  developmentMode: false,
  debounceDelay: 300
};

/* Create React context */
export const PivotUIContext = createContext<PivotUIContextValue | null>(null);

/**
 * PivotUI Provider component that manages worker lifecycle and classification
 */
export const PivotUIProvider: React.FC<PivotUIProviderProps> = ({ 
  config: userConfig, 
  children 
}) => {
  const config = useMemo(() => ({ ...defaultConfig, ...userConfig }), [userConfig]);
  
  const [isReady, setIsReady] = useState(false);
  const [worker, setWorker] = useState<ReturnType<typeof createWorker> | null>(null);
  const [mockClassifier, setMockClassifier] = useState<MockClassifier | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsEvent[]>([]);
  const [banditSampling] = useState(() => new ThompsonSampling());

  /* Initialize worker or mock classifier */
  useEffect(() => {
    const initializeClassifier = async () => {
      try {
        if (config.developmentMode) {
          /* Use mock classifier for development */
          const mock = new MockClassifier();
          setMockClassifier(mock);
          setIsReady(true);
        } else {
          /* Initialize WebGPU worker */
          const workerInstance = createWorker(config.workerScript);
          await workerInstance.initialize({
            modelName: 'pivotui-model',
            variant: '100M',
            quantization: '4bit'
          });
          setWorker(workerInstance);
          setIsReady(true);
        }
      } catch (error) {
        console.error('Failed to initialize PivotUI classifier:', error);
        /* Fallback to mock classifier */
        const mock = new MockClassifier();
        setMockClassifier(mock);
        setIsReady(true);
      }
    };

    initializeClassifier();

    /* Cleanup on unmount */
    return () => {
      worker?.dispose();
    };
  }, [config]);

  /* Classification function */
  const classify = useCallback(async (input: ClassificationInput): Promise<ClassificationResult> => {
    if (!isReady) {
      throw new Error('PivotUI not ready');
    }

    const startTime = performance.now();

    let result: ClassificationResult;
    
    if (mockClassifier) {
      result = mockClassifier.classify(input);
    } else if (worker) {
      result = await worker.classify(input);
    } else {
      throw new Error('No classifier available');
    }

    /* Track analytics */
    if (config.enableAnalytics) {
      const endTime = performance.now();
      trackEvent({
        type: 'performance',
        componentType: result.componentType,
        timestamp: Date.now(),
        data: {
          processingTime: endTime - startTime,
          confidence: result.confidence
        }
      });
    }

    return result;
  }, [isReady, mockClassifier, worker, config.enableAnalytics]);

  /* Analytics tracking */
  const trackEvent = useCallback((event: AnalyticsEvent) => {
    if (config.enableAnalytics) {
      setAnalytics(prev => [...prev, event]);
    }
  }, [config.enableAnalytics]);

  /* Bandit feedback */
  const updateBandit = useCallback((componentType: UIComponentType, success: boolean) => {
    banditSampling.updateBandit(componentType, success);
  }, [banditSampling]);

  /* Adaptive render function */
  const adaptiveRender = useCallback((
    content: string, 
    options: AdaptiveRenderOptions = {}
  ): JSX.Element => {
    const {
      fallback = config.fallbackComponent,
      forceComponent,
      enableAnalytics = config.enableAnalytics,
      context,
      preferences
    } = options;

    const [renderState, setRenderState] = useState<{
      componentType: UIComponentType;
      props: ComponentProps;
    }>({
      componentType: fallback!,
      props: {
        data: { content },
        content,
        className: 'pivotui-component'
      }
    });

    /* Perform classification */
    useEffect(() => {
      if (forceComponent) {
        setRenderState({
          componentType: forceComponent,
          props: {
            data: { content },
            content,
            className: 'pivotui-component'
          }
        });
        return;
      }

      if (!isReady) return;

      const performClassification = async () => {
        try {
          const result = await classify({
            content,
            context,
            preferences
          });

          /* Use Thompson Sampling to potentially override classification */
          const sampledComponent = banditSampling.selectComponent(result.componentType);

          setRenderState({
            componentType: sampledComponent,
            props: {
              data: result.data || { content },
              content,
              metadata: result,
              className: 'pivotui-component'
            }
          });

          /* Track render event */
          if (enableAnalytics) {
            trackEvent({
              type: 'render',
              componentType: sampledComponent,
              timestamp: Date.now(),
              data: {
                originalClassification: result.componentType,
                confidence: result.confidence
              }
            });
          }
        } catch (error) {
          console.error('Classification failed:', error);
          setRenderState({
            componentType: fallback!,
            props: {
              data: { content },
              content,
              className: 'pivotui-component pivotui-fallback'
            }
          });

          if (enableAnalytics) {
            trackEvent({
              type: 'error',
              componentType: fallback!,
              timestamp: Date.now(),
              data: { error: error instanceof Error ? error.message : 'Unknown error' }
            });
          }
        }
      };

      performClassification();
    }, [content, isReady, forceComponent, context, preferences, enableAnalytics, fallback]);

    /* Render component */
    const Component = componentRegistry[renderState.componentType];
    if (!Component) {
      console.warn(`No component registered for type: ${renderState.componentType}`);
      const FallbackComponent = componentRegistry[fallback!];
      return <FallbackComponent {...renderState.props} />;
    }

    return <Component {...renderState.props} />;
  }, [config, isReady, classify, banditSampling, trackEvent]);

  /* Context value */
  const contextValue: PivotUIContextValue = useMemo(() => ({
    config,
    isReady,
    adaptiveRender,
    classify,
    trackEvent,
    getAnalytics: () => analytics,
    updateBandit,
    getBanditStates: () => banditSampling.getStates()
  }), [config, isReady, adaptiveRender, classify, trackEvent, analytics, updateBandit, banditSampling]);

  return (
    <PivotUIContext.Provider value={contextValue}>
      {children}
    </PivotUIContext.Provider>
  );
};