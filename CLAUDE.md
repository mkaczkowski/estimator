# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Estimator Generator - A Node.js CLI tool that transforms structured Markdown files into interactive HTML estimators for project planning. The tool parses a specific Markdown format and generates a single self-contained HTML file with an embedded UI for adjusting story points and exporting estimates.

## Build and Run Commands

```bash
# Run the generator
node src/generate.js <path-to-markdown-file> [subtitle]

# Alternative using npm
npm start <path-to-markdown-file> [subtitle]

# Example
node src/generate.js execution-details-task-breakdown.md "Q1 2025"
```

Output: Creates `<input-filename>-estimator.html` in the same directory as the input file.

## Architecture

### Core Components

**src/generate.js** - CLI entry point that:
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
Markdown File → generate.js → Base64 encode → Inject into template.html → Output HTML
                                                    ↓
                                    Browser loads → Decode → Parse → Render UI
```

### Markdown Parser Patterns

The template.html parser expects these exact regex patterns:
- Phase: `/^## Phase (\d+): (.+)/`
- Task: `/^### Task (\d+(?:\.\d+)?): (.+)/`
- Story Points: `/\*\*Story Points:\s*\((\d+(?:-\d+)?)\)\*\*/`
- Sections: `**Description:**`, `**Deliverables:**`, `**Acceptance Criteria:**`, `**Dependencies:**`, `**Risk:**`

### Template Placeholders

- `{{TITLE}}` - Document title from H1 header
- `{{SUBTITLE}}` - CLI argument or current date
- `{{MARKDOWN_BASE64}}` - Encoded Markdown content

## Dependencies

- Runtime: Node.js (uses only built-in `fs` and `path` modules)
- Client-side (CDN): Tailwind CSS, marked.js, Font Awesome

## No Tests Currently

The project has no test suite configured.
