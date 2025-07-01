# PivotUI Training Data

Annotated datasets and training samples for PivotUI model training.

## Overview

This directory contains:

- Synthetic AI response datasets (≥2k samples)
- Human-annotated UI type labels
- Few-shot example prompts
- Benchmark test cases

## Dataset Structure

- `synthetic-responses/` - Generated AI responses across various domains
- `annotations/` - Human-labeled optimal UI types for each response
- `few-shot-examples/` - Curated examples for prompt engineering
- `benchmarks/` - Test cases for model evaluation

## Data Collection

Data is collected from:

1. **Synthetic Generation**: Using GPT-4 to create diverse AI responses
2. **Human Annotation**: Expert labelers assign optimal UI types
3. **User Studies**: Real user interactions with different UI forms
4. **A/B Testing**: Performance data from production deployments

## Format

All data follows the JSON schema defined in `../schema/training-data.json`:

```json
{
  "id": "sample-001",
  "content": "AI response text...",
  "context": {...},
  "optimal_ui_type": "table",
  "alternatives": ["text", "list"],
  "confidence": 0.95
}
```

## Usage

```bash
# Validate datasets
pnpm validate-data

# Generate synthetic samples  
pnpm generate-samples --count 1000

# Export for training
pnpm export-training-data
```