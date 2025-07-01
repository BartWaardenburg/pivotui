# @pivotui/worker

WebGPU-optimized LLM worker for client-side UI classification inference.

## Overview

This package contains the WebGPU implementation for running the PivotUI classification model directly in the browser. It handles:

- Model loading and initialization
- WebGPU compute shader execution  
- Inference pipeline for UI type classification
- Worker thread management for non-blocking inference

## Features

- 🚀 WebGPU-accelerated inference
- 🧵 Web Worker isolation
- 📦 4-bit quantized model support
- 🔄 Streaming inference pipeline
- 💾 Efficient memory management

## Usage

```typescript
import { PivotWorker } from '@pivotui/worker';

const worker = new PivotWorker();
await worker.initialize();

const result = await worker.classify(content, context);
```