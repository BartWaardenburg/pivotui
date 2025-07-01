import type { 
  ClassificationInput, 
  ClassificationResult, 
  UIComponentType 
} from './types.js';

/**
 * Mock classifier for testing and development
 * Provides the same interface as the worker but runs synchronously
 */
export class MockClassifier {
  /**
   * Classify content using simple heuristics
   */
  classify(input: ClassificationInput): ClassificationResult {
    const startTime = performance.now();
    
    const componentType = this.analyzeContent(input.content);
    const confidence = Math.random() * 0.4 + 0.6; // 0.6-1.0 range
    
    const endTime = performance.now();
    const processingTime = endTime - startTime;

    return {
      componentType,
      confidence,
      alternatives: this.generateAlternatives(componentType),
      data: this.extractData(input.content, componentType),
      metrics: {
        processingTime,
        inferenceTime: processingTime * 0.8
      }
    };
  }

  private analyzeContent(content: string): UIComponentType {
    const lower = content.toLowerCase();
    
    // Simple heuristics for mock classification
    if (lower.includes('table') || lower.includes('row') || lower.includes('column')) {
      return 'table';
    }
    if (lower.includes('chart') || lower.includes('graph') || lower.includes('plot')) {
      return 'chart';
    }
    if (lower.includes('list') || lower.includes('item') || lower.includes('bullet')) {
      return 'list';
    }
    if (lower.includes('form') || lower.includes('input') || lower.includes('field')) {
      return 'form';
    }
    if (lower.includes('map') || lower.includes('location') || lower.includes('address')) {
      return 'map';
    }
    if (lower.includes('card') || lower.includes('summary') || lower.includes('overview')) {
      return 'card';
    }
    if (lower.includes('timeline') || lower.includes('history') || lower.includes('chronolog')) {
      return 'timeline';
    }
    if (lower.includes('step') || lower.includes('process') || lower.includes('workflow')) {
      return 'stepper';
    }
    if (lower.includes('gallery') || lower.includes('images') || lower.includes('photos')) {
      return 'gallery';
    }
    
    return 'text'; // Default fallback
  }

  private generateAlternatives(primary: UIComponentType): Array<{ componentType: UIComponentType; confidence: number }> {
    const alternatives: UIComponentType[] = ['text', 'card', 'list'];
    
    return alternatives
      .filter(type => type !== primary)
      .slice(0, 2)
      .map(componentType => ({
        componentType,
        confidence: Math.random() * 0.3 + 0.2 // 0.2-0.5 range
      }));
  }

  private extractData(content: string, componentType: UIComponentType): Record<string, any> {
    // Mock data extraction based on component type
    switch (componentType) {
      case 'table':
        return {
          columns: ['Column 1', 'Column 2', 'Column 3'],
          rows: [['Sample Data 1', 'Sample Data 2', 'Sample Data 3']]
        };
      case 'chart':
        return {
          type: 'bar',
          data: [
            { x: 'Category A', y: 10 },
            { x: 'Category B', y: 20 },
            { x: 'Category C', y: 15 }
          ]
        };
      case 'list':
        return {
          items: content.split('\n').filter(line => line.trim()).slice(0, 5)
        };
      case 'card':
        return {
          title: 'Summary',
          content: content.substring(0, 200)
        };
      default:
        return { content };
    }
  }
}