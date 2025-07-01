import type { UIComponentType } from '@pivotui/worker';
import type { BanditState } from '../types.js';

/**
 * Thompson Sampling implementation for multi-armed bandit optimization
 * Used to learn optimal UI component selection over time
 */
export class ThompsonSampling {
  private states = new Map<UIComponentType, BanditState>();

  constructor() {
    /* Initialize all component types with prior */
    const componentTypes: UIComponentType[] = [
      'text', 'table', 'chart', 'map', 'list', 'form', 'card', 'timeline',
      'tree', 'gallery', 'grid', 'tabs', 'accordion', 'dialog', 'graph',
      'calendar', 'kanban', 'dashboard', 'carousel', 'stepper', 'rating',
      'badge', 'progress', 'skeleton', 'notification'
    ];

    componentTypes.forEach(component => {
      this.states.set(component, {
        component,
        successes: 1, // Optimistic prior
        failures: 1,
        lastUpdated: Date.now()
      });
    });
  }

  /**
   * Select component using Thompson Sampling
   * @param suggestedComponent - Primary suggestion from classifier
   * @returns Selected component type
   */
  selectComponent(suggestedComponent: UIComponentType): UIComponentType {
    /* Get all candidates (suggested + similar types) */
    const candidates = this.getCandidates(suggestedComponent);
    
    let bestComponent = suggestedComponent;
    let bestSample = 0;

    /* Sample from beta distribution for each candidate */
    candidates.forEach(component => {
      const state = this.states.get(component);
      if (!state) return;

      const sample = this.sampleBeta(state.successes, state.failures);
      if (sample > bestSample) {
        bestSample = sample;
        bestComponent = component;
      }
    });

    return bestComponent;
  }

  /**
   * Update bandit state with user feedback
   * @param component - Component that was shown
   * @param success - Whether user interaction was positive
   */
  updateBandit(component: UIComponentType, success: boolean): void {
    const state = this.states.get(component);
    if (!state) return;

    if (success) {
      state.successes++;
    } else {
      state.failures++;
    }
    state.lastUpdated = Date.now();

    this.states.set(component, state);
  }

  /**
   * Get current bandit states for analytics
   */
  getStates(): BanditState[] {
    return Array.from(this.states.values());
  }

  /**
   * Get candidate components for selection
   * Includes the suggested component plus related alternatives
   */
  private getCandidates(suggested: UIComponentType): UIComponentType[] {
    const candidates = new Set<UIComponentType>([suggested]);

    /* Add related component types based on similarity */
    const similarities: Record<UIComponentType, UIComponentType[]> = {
      'text': ['card'],
      'table': ['list', 'grid'],
      'chart': ['graph', 'dashboard'],
      'list': ['table', 'tree'],
      'card': ['text', 'accordion'],
      'form': ['dialog'],
      'timeline': ['stepper'],
      'gallery': ['grid', 'carousel'],
      'tabs': ['accordion'],
      'map': ['dashboard'],
      'tree': ['list'],
      'grid': ['table', 'gallery'],
      'accordion': ['tabs', 'card'],
      'dialog': ['form'],
      'graph': ['chart'],
      'calendar': ['timeline'],
      'kanban': ['dashboard'],
      'dashboard': ['chart', 'grid'],
      'carousel': ['gallery'],
      'stepper': ['timeline'],
      'rating': ['badge'],
      'badge': ['rating'],
      'progress': ['stepper'],
      'skeleton': ['text'],
      'notification': ['dialog']
    };

    const related = similarities[suggested] || [];
    related.forEach(component => candidates.add(component));

    return Array.from(candidates);
  }

  /**
   * Sample from Beta distribution using Box-Muller transform approximation
   * @param alpha - Success count (alpha parameter)
   * @param beta - Failure count (beta parameter)
   * @returns Sample from Beta(alpha, beta)
   */
  private sampleBeta(alpha: number, beta: number): number {
    /* Use simple gamma sampling approximation for beta distribution */
    const x = this.sampleGamma(alpha);
    const y = this.sampleGamma(beta);
    return x / (x + y);
  }

  /**
   * Sample from Gamma distribution using Marsaglia-Tsang method (simplified)
   * @param shape - Shape parameter
   * @returns Sample from Gamma distribution
   */
  private sampleGamma(shape: number): number {
    if (shape < 1) {
      /* For shape < 1, use acceptance-rejection */
      return this.sampleGamma(shape + 1) * Math.pow(Math.random(), 1 / shape);
    }

    /* Simplified approximation for demo purposes */
    /* In production, use proper gamma sampling algorithm */
    let sum = 0;
    for (let i = 0; i < Math.floor(shape); i++) {
      sum += -Math.log(Math.random());
    }
    
    const fractional = shape - Math.floor(shape);
    if (fractional > 0) {
      sum += -Math.log(Math.random()) * fractional;
    }

    return sum;
  }
}