import type { 
  WorkerMessage, 
  WorkerResponse, 
  ClassificationInput,
  ClassificationResult,
  ModelConfig,
  WebGPUConfig,
  UIComponentType 
} from './types.js';

/**
 * Mock LLM classifier for development
 * TODO: Replace with actual WebGPU LLM inference
 */
class MockLLMClassifier {
  private initialized = false;
  private config: ModelConfig & WebGPUConfig = {
    modelName: 'mock-model',
    variant: '100M',
    quantization: '4bit'
  };

  async initialize(config: ModelConfig & WebGPUConfig): Promise<void> {
    this.config = { ...this.config, ...config };
    
    // Mock initialization delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    this.initialized = true;
    console.log(`Mock LLM initialized with config:`, this.config);
  }

  async classify(input: ClassificationInput): Promise<ClassificationResult> {
    if (!this.initialized) {
      throw new Error('Classifier not initialized');
    }

    const startTime = performance.now();
    
    // Mock classification logic based on content analysis
    const componentType = this.analyzeContent(input.content);
    const confidence = Math.random() * 0.4 + 0.6; // 0.6-1.0 range
    
    // Mock processing delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const endTime = performance.now();
    const processingTime = endTime - startTime;

    return {
      componentType,
      confidence,
      alternatives: this.generateAlternatives(componentType),
      data: this.extractData(input.content, componentType),
      metrics: {
        processingTime,
        inferenceTime: processingTime * 0.8 // Mock inference time
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
          rows: [['Data 1', 'Data 2', 'Data 3']]
        };
      case 'chart':
        return {
          type: 'bar',
          data: [{ x: 'A', y: 10 }, { x: 'B', y: 20 }]
        };
      case 'list':
        return {
          items: content.split('\n').filter(line => line.trim())
        };
      default:
        return { content };
    }
  }

  dispose(): void {
    this.initialized = false;
    console.log('Mock LLM classifier disposed');
  }
}

// Global classifier instance
let classifier: MockLLMClassifier | null = null;

/**
 * Handle messages from the main thread
 */
self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { data: message } = event;

  try {
    switch (message.type) {
      case 'init':
        classifier = new MockLLMClassifier();
        await classifier.initialize(message.config);
        self.postMessage({ type: 'ready' } as WorkerResponse);
        break;

      case 'classify':
        if (!classifier) {
          throw new Error('Classifier not initialized');
        }
        const result = await classifier.classify(message.input);
        self.postMessage({ 
          type: 'result', 
          result, 
          id: message.id 
        } as WorkerResponse);
        break;

      case 'dispose':
        classifier?.dispose();
        classifier = null;
        break;

      default:
        throw new Error(`Unknown message type: ${(message as any).type}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    self.postMessage({ 
      type: 'error', 
      error: errorMessage,
      id: 'id' in message ? message.id : undefined
    } as WorkerResponse);
  }
};