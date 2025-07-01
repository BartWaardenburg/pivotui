import { useContext } from 'react';
import { PivotUIContext } from '../PivotUIProvider.js';
import type { UsePivotUIReturn } from '../types.js';

/**
 * Hook to access PivotUI functionality
 * @returns PivotUI context methods and state
 */
export const usePivotUI = (): UsePivotUIReturn => {
  const context = useContext(PivotUIContext);
  
  if (!context) {
    throw new Error('usePivotUI must be used within a PivotUIProvider');
  }

  return {
    adaptiveRender: context.adaptiveRender,
    classify: context.classify,
    isReady: context.isReady,
    trackEvent: context.trackEvent,
    getAnalytics: context.getAnalytics,
    updateBandit: context.updateBandit,
    getBanditStates: context.getBanditStates
  };
};