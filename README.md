# Estimator Generator

[![npm version](https://img.shields.io/npm/v/estimator-generator.svg)](https://www.npmjs.com/package/estimator-generator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/estimator-generator.svg)](https://nodejs.org)
[![CI](https://github.com/mkaczkowski/estimator/actions/workflows/ci.yml/badge.svg)](https://github.com/mkaczkowski/estimator/actions/workflows/ci.yml)

A Node.js CLI tool that transforms structured Markdown files into interactive HTML estimators for project planning.

## Installation

```bash
# Install globally
npm install -g estimator-generator

# Or use npx directly
npx estimator-generator <input-file> [options]
```

## Usage

```bash
estimator <input-file> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `-o, --output <path>` | Custom output file path |
| `-s, --subtitle <text>` | Subtitle for the estimator (default: current date) |
| `-h, --help` | Show help message |
| `-v, --version` | Show version number |

### Examples

```bash
# Basic usage
estimator project.md

# With subtitle
estimator project.md -s "Q1 2025"

# Custom output path
estimator project.md -o ./output/estimate.html

# Combined options
estimator project.md --subtitle "Sprint 1" --output custom.html
```

Output: Creates an HTML file (default: `<input-filename>-estimator.html`) in the same directory as the input file.

## Markdown Format

The source Markdown file must follow a specific structure for the parser to work correctly.

### 1. Document Title
The first H1 header is used as the estimator title.
```markdown
# Project Name Plan
```

### 2. Phases
Phases are defined by H2 headers starting with "Phase".
```markdown
## Phase 1: Initialization
```

### 3. Tasks
Tasks are defined by H3 headers starting with "Task".
```markdown
### Task 1.1: Setup Repository
```

### 4. Story Points
Story points must be bolded and in parentheses. Ranges are supported (averaged).
```markdown
**Story Points: (3)**
**Story Points: (1-3)**
```

### 5. Task Details
The following bold headers are recognized within a task block:

- `**Description:**` - Task description (supports Markdown)
- `**Deliverables:**` - List of deliverables (supports Markdown)
- `**Acceptance Criteria:**` - Checklist or list (supports Markdown)
- `**Dependencies:**` - Text or comma-separated list. References to other tasks (e.g., "Task 1.2") are automatically linked
- `**Risk:**` - "Low", "Medium", or "High" (optionally followed by text)

### Example Task Block

```markdown
### Task 1.1: Setup Environment

**Story Points: (2)**

**Description:**
Initialize the project repository and configure build tools.

**Deliverables:**
- Repo created
- CI pipeline configured

**Acceptance Criteria:**
- [ ] Build passes
- [ ] Tests run

**Dependencies:** None

**Risk:** Low
---
```

Note: The `---` separator is optional but recommended for readability in the raw Markdown.

## Examples

See the `examples/` directory for sample Markdown files.

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## Code of Conduct

This project follows a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## License

[MIT](LICENSE)
