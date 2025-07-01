# PivotUI Schema Definitions

JSON Schema definitions for the PivotUI ontology and component types.

## Overview

This directory contains JSON Schema files that define:

- UI component ontology (25+ types)
- Component configuration schemas
- Training data format specifications
- API input/output schemas

## Schema Files

- `ui-ontology.json` - Master ontology defining all UI component types
- `component-config.json` - Configuration options for each component type
- `training-data.json` - Format for annotated training samples
- `api-schemas/` - Request/response schemas for all APIs

## UI Component Types

The ontology includes these categories:

**Display Components:**
- Text, RichText, Markdown
- Table, DataGrid, Timeline
- Chart, Graph, Visualization

**Interactive Components:**  
- Form, Survey, Quiz
- Map, Gallery, Carousel
- Tree, Accordion, Tabs

**Layout Components:**
- Card, Panel, Modal
- List, Grid, Masonry

## Validation

All schemas are validated using AJV and tested against sample data.