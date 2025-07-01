import { usePivotUI } from './usePivotUI.js';
import type { AnalyticsEvent } from '../types.js';

/**
 * Hook for analytics functionality
 */
export const useAnalytics = () => {
  const { trackEvent, getAnalytics } = usePivotUI();

  return {
    trackEvent,
    getAnalytics,
    /* Helper methods for common events */
    trackRender: (componentType: string, metadata?: any) => {
      trackEvent({
        type: 'render',
        componentType: componentType as any,
        timestamp: Date.now(),
        data: metadata
      });
    },
    trackInteraction: (componentType: string, action: string) => {
      trackEvent({
        type: 'interaction',
        componentType: componentType as any,
        timestamp: Date.now(),
        data: { action }
      });
    }
  };
};