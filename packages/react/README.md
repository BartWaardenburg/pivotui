# @pivotui/react

React component registry and intelligent patch engine for seamless UI adaptation.

## Overview

The main React library providing hooks, components, and the patch engine for dynamic UI rendering without remounts.

## Features

- 🎣 React hooks for PivotUI integration
- 🔄 Hot-swap patch engine  
- 📚 Comprehensive component registry
- 🎯 TypeScript-first API
- 📊 Built-in analytics hooks
- 🎨 Customizable component variants

## Core Components

- `PivotUIProvider` - Context provider for configuration
- `usePivotUI` - Main hook for adaptive rendering
- `useAnalytics` - Hook for tracking user interactions
- Component registry with 25+ UI types

## Usage

```typescript
import { PivotUIProvider, usePivotUI } from '@pivotui/react';

function App() {
  return (
    <PivotUIProvider config={{ model: 'tinyllama-100m' }}>
      <YourApp />
    </PivotUIProvider>
  );
}
```