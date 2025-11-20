# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Estimator Generator - A Node.js CLI tool that transforms structured JSON files into interactive HTML estimators for project planning. The tool validates JSON input against a schema and generates a single self-contained HTML file with an embedded UI for adjusting story points and exporting estimates.

## Build and Run Commands

```bash
# Run the generator (Node.js v22+ with native TypeScript support)
node src/generate.ts <input-file> [options]

# Alternative using npm
npm start <input-file> [options]

# Examples
node src/generate.ts project.json
node src/generate.ts project.json -s "Q1 2025"
node src/generate.ts project.json -o ./output/estimate.html
node src/generate.ts project.json --subtitle "Sprint 1" --output custom.html

# Show help
node src/generate.ts --help

# Show version
node src/generate.ts --version
```

Output: Creates `<input-filename>-estimator.html` in the same directory as the input file (or custom path with `-o`).

## Architecture

### Core Components

**src/generate.ts** - CLI entry point (TypeScript, runs natively on Node.js v22+) that:
1. Reads input JSON file
2. Validates against JSON schema using ajv
3. Extracts title from the JSON data
4. Injects JSON directly into HTML template as JavaScript object

**src/template.html** - Self-contained HTML application that:
1. Uses embedded JSON data directly (no decoding needed)
2. Transforms data into structured phases/tasks for UI state
3. Renders interactive UI with Tailwind CSS + Font Awesome
4. Provides story point adjustment, task editing, and CSV export

**src/types.ts** - TypeScript type definitions for:
- EstimatorData, Phase, Task interfaces
- StoryPoints, RiskLevel, TaskDependency types

**src/schema.json** - JSON Schema for input validation

### Data Flow

```
JSON File → generate.ts → Validate → Inject as JS object → Output HTML
                                              ↓
                              Browser loads → Transform → Render UI
```

### JSON Schema Structure

```json
{
  "title": "Project Name",
  "description": "Optional overview",
  "phases": [
    {
      "id": 1,
      "title": "Phase Name",
      "objective": "Optional objective",
      "tasks": [
        {
          "id": "1.1",
          "title": "Task Name",
          "storyPoints": 3,
          "description": "Task description",
          "deliverables": ["Item 1", "Item 2"],
          "acceptanceCriteria": ["Criterion 1"],
          "dependencies": [{"taskId": "1.1"}],
          "risk": {"level": "low", "description": "..."}
        }
      ]
    }
  ]
}
```

### Template Placeholders

- `{{TITLE}}` - Project title from JSON
- `{{SUBTITLE}}` - CLI argument or current date
- `{{DATA_JSON}}` - JSON data as JavaScript object literal

## Dependencies

- Runtime: Node.js v22+ (uses native TypeScript support, built-in `fs`, `path`, `url`, `module`)
- Validation: ajv (JSON Schema validation)
- Client-side (CDN): Tailwind CSS, marked.js, Font Awesome
- Dev: @types/node (for TypeScript IDE support)

## TypeScript Configuration

The project uses Node.js v22's native TypeScript support (type stripping) - no transpilation required:
- ES modules with `import` syntax
- `tsconfig.json` configured with `erasableSyntaxOnly: true` for compatibility
- Run `.ts` files directly with `node`

## No Tests Currently

The project has no test suite configured.
