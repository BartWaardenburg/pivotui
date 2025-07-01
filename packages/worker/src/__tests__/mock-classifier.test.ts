import { describe, it, expect } from 'vitest';
import { MockClassifier } from '../mock-classifier.js';

describe('MockClassifier', () => {
  it('should classify table content correctly', () => {
    const classifier = new MockClassifier();
    const result = classifier.classify({
      content: 'Here is a table with columns and rows of data'
    });

    expect(result.componentType).toBe('table');
    expect(result.confidence).toBeGreaterThan(0.5);
    expect(result.metrics).toBeDefined();
  });

  it('should classify list content correctly', () => {
    const classifier = new MockClassifier();
    const result = classifier.classify({
      content: 'Here is a list of items:\n• Item 1\n• Item 2'
    });

    expect(result.componentType).toBe('list');
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it('should fallback to text for unknown content', () => {
    const classifier = new MockClassifier();
    const result = classifier.classify({
      content: 'Some random text that doesn\'t match any pattern'
    });

    expect(result.componentType).toBe('text');
    expect(result.data).toHaveProperty('content');
  });

  it('should provide alternatives', () => {
    const classifier = new MockClassifier();
    const result = classifier.classify({
      content: 'Test content'
    });

    expect(result.alternatives).toBeDefined();
    expect(Array.isArray(result.alternatives)).toBe(true);
  });
});