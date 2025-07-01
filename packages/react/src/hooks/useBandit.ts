import { usePivotUI } from './usePivotUI.js';

/**
 * Hook for bandit optimization functionality
 */
export const useBandit = () => {
  const { updateBandit, getBanditStates } = usePivotUI();

  return {
    updateBandit,
    getBanditStates,
    /* Helper method for providing feedback */
    provideFeedback: (componentType: string, positive: boolean) => {
      updateBandit(componentType as any, positive);
    }
  };
};