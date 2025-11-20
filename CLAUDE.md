# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Estimator Generator - A Node.js CLI tool that transforms structured Markdown files into interactive HTML estimators for project planning. The tool parses a specific Markdown format and generates a single self-contained HTML file with an embedded UI for adjusting story points and exporting estimates.

## Build and Run Commands

```bash
# Run the generator (Node.js v22+ with native TypeScript support)
node src/generate.ts <input-file> [options]

# Alternative using npm
npm start <input-file> [options]

# Examples
node src/generate.ts project.md
node src/generate.ts project.md -s "Q1 2025"
node src/generate.ts project.md -o ./output/estimate.html
node src/generate.ts project.md --subtitle "Sprint 1" --output custom.html

# Show help
node src/generate.ts --help

# Show version
node src/generate.ts --version
```

Output: Creates `<input-filename>-estimator.html` in the same directory as the input file (or custom path with `-o`).

## Architecture

### Core Components

**src/generate.ts** - CLI entry point (TypeScript, runs natively on Node.js v22+) that:
1. Reads input Markdown file
2. Extracts title from first H1 header
3. Base64 encodes the Markdown content
4. Injects content into HTML template with placeholder replacements

**src/template.html** - Self-contained HTML application that:
1. Decodes embedded Base64 Markdown at runtime
2. Parses Markdown into structured phases/tasks using regex patterns
3. Renders interactive UI with Tailwind CSS + Font Awesome
4. Provides story point adjustment, task editing, and CSV export

### Data Flow

```
Markdown File → generate.ts → Base64 encode → Inject into template.html → Output HTML
                                                    ↓
                                    Browser loads → Decode → Parse → Render UI
```

### Markdown Parser Patterns

The template.html parser expects these exact regex patterns:
- Phase: `/^## Phase (\d+): (.+)/`
- Task: `/^### Task (\d+(?:\.\d+)?): (.+)/`
- Story Points: `/\*\*Story Points:\*\*\s*(\d+(?:-\d+)?)/`
- Sections: `**Description:**`, `**Deliverables:**`, `**Acceptance Criteria:**`, `**Dependencies:**`, `**Risk:**`

### Template Placeholders

- `{{TITLE}}` - Document title from H1 header
- `{{SUBTITLE}}` - CLI argument or current date
- `{{MARKDOWN_BASE64}}` - Encoded Markdown content

## Dependencies

- Runtime: Node.js v22+ (uses native TypeScript support, built-in `fs`, `path`, `url`, `module`)
- Client-side (CDN): Tailwind CSS, marked.js, Font Awesome
- Dev: @types/node (for TypeScript IDE support)

## TypeScript Configuration

The project uses Node.js v22's native TypeScript support (type stripping) - no transpilation required:
- ES modules with `import` syntax
- `tsconfig.json` configured with `erasableSyntaxOnly: true` for compatibility
- Run `.ts` files directly with `node`

## No Tests Currently

The project has no test suite configured.
