# PivotUI Documentation

Comprehensive documentation for the PivotUI project.

## Structure

- `api/` - API reference documentation
- `adr/` - Architecture Decision Records  
- `guides/` - How-to guides and tutorials
- `design/` - Design decisions and UI ontology
- `performance/` - Benchmarks and optimization guides

## Architecture Decision Records (ADRs)

ADRs document important architectural decisions:

- ADR-001: Choice of WebGPU over WebAssembly
- ADR-002: Thompson Sampling for bandit optimization
- ADR-003: Component hot-swapping strategy
- ADR-004: UI ontology design principles
- ADR-005: Training data collection methodology

## Building the Docs

This documentation is built with Docusaurus:

```bash
pnpm install
pnpm docs:dev    # Development server
pnpm docs:build  # Production build
```