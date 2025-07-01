import type { 
  WorkerMessage, 
  WorkerResponse, 
  ClassificationInput,
  ClassificationResult,
  ModelConfig,
  WebGPUConfig 
} from './types.js';

/**
 * Worker wrapper class for type-safe communication
 */
export class PivotUIWorker {
  private worker: Worker;
  private ready = false;
  private pendingRequests = new Map<string, {
    resolve: (result: ClassificationResult) => void;
    reject: (error: Error) => void;
  }>();

  constructor(workerScript: string) {
    this.worker = new Worker(workerScript, { type: 'module' });
    this.worker.onmessage = this.handleMessage.bind(this);
    this.worker.onerror = this.handleError.bind(this);
  }

  /**
   * Initialize the worker with model configuration
   */
  async initialize(config: ModelConfig & WebGPUConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Worker initialization timeout'));
      }, 30000); // 30 second timeout

      const originalHandler = this.worker.onmessage;
      this.worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
        const { data } = event;
        if (data.type === 'ready') {
          clearTimeout(timeout);
          this.ready = true;
          this.worker.onmessage = originalHandler;
          resolve();
        } else if (data.type === 'error') {
          clearTimeout(timeout);
          this.worker.onmessage = originalHandler;
          reject(new Error(data.error));
        }
      };

      this.worker.postMessage({ type: 'init', config } as WorkerMessage);
    });
  }

  /**
   * Classify content to determine optimal UI component
   */
  async classify(input: ClassificationInput): Promise<ClassificationResult> {
    if (!this.ready) {
      throw new Error('Worker not ready. Call initialize() first.');
    }

    return new Promise((resolve, reject) => {
      const id = Math.random().toString(36).substring(2);
      
      this.pendingRequests.set(id, { resolve, reject });
      
      // Set timeout for individual requests
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error('Classification request timeout'));
        }
      }, 10000); // 10 second timeout
      
      this.worker.postMessage({ 
        type: 'classify', 
        input, 
        id 
      } as WorkerMessage);
    });
  }

  /**
   * Check if worker is ready for classification
   */
  isReady(): boolean {
    return this.ready;
  }

  /**
   * Dispose of the worker and clean up resources
   */
  dispose(): void {
    // Reject all pending requests
    for (const [id, { reject }] of this.pendingRequests) {
      reject(new Error('Worker disposed'));
    }
    this.pendingRequests.clear();
    
    this.worker.postMessage({ type: 'dispose' } as WorkerMessage);
    this.worker.terminate();
    this.ready = false;
  }

  private handleMessage(event: MessageEvent<WorkerResponse>): void {
    const { data } = event;

    switch (data.type) {
      case 'result':
        const request = this.pendingRequests.get(data.id);
        if (request) {
          this.pendingRequests.delete(data.id);
          request.resolve(data.result);
        }
        break;

      case 'error':
        if (data.id) {
          const request = this.pendingRequests.get(data.id);
          if (request) {
            this.pendingRequests.delete(data.id);
            request.reject(new Error(data.error));
          }
        }
        break;
    }
  }

  private handleError(error: ErrorEvent): void {
    console.error('Worker error:', error);
    // Reject all pending requests
    for (const [id, { reject }] of this.pendingRequests) {
      reject(new Error(`Worker error: ${error.message}`));
    }
    this.pendingRequests.clear();
  }
}

/**
 * Create a new PivotUI worker instance
 */
export function createWorker(workerScript?: string): PivotUIWorker {
  // Default worker script path - in production this should be bundled
  const defaultWorkerScript = new URL('./worker.js', import.meta.url).href;
  return new PivotUIWorker(workerScript || defaultWorkerScript);
}