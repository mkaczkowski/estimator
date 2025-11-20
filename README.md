# Estimator Generator

[![npm version](https://img.shields.io/npm/v/estimator-generator.svg)](https://www.npmjs.com/package/estimator-generator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/estimator-generator.svg)](https://nodejs.org)
[![CI](https://github.com/mkaczkowski/estimator/actions/workflows/ci.yml/badge.svg)](https://github.com/mkaczkowski/estimator/actions/workflows/ci.yml)

A Node.js CLI tool that transforms structured JSON files into interactive HTML estimators for project planning.

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
estimator project.json

# With subtitle
estimator project.json -s "Q1 2025"

# Custom output path
estimator project.json -o ./output/estimate.html

# Combined options
estimator project.json --subtitle "Sprint 1" --output custom.html
```

Output: Creates an HTML file (default: `<input-filename>-estimator.html`) in the same directory as the input file.

## JSON Format

The source JSON file must follow the schema defined in `src/schema.json`. The tool validates input against this schema before generating the HTML.

### Basic Structure

```json
{
  "title": "Project Name",
  "description": "Optional project description",
  "phases": [
    {
      "id": 1,
      "title": "Phase Name",
      "objective": "Optional phase objective",
      "tasks": [...]
    }
  ]
}
```

### Task Structure

```json
{
  "id": "1.1",
  "title": "Task Name",
  "storyPoints": 3,
  "description": "Task description (supports Markdown)",
  "deliverables": [
    "Deliverable 1",
    "Deliverable 2"
  ],
  "acceptanceCriteria": [
    "Criterion 1",
    "Criterion 2"
  ],
  "dependencies": [
    { "taskId": "1.1" },
    { "taskId": "1.2", "description": "Optional context" }
  ],
  "risk": {
    "level": "low",
    "description": "Optional risk description"
  }
}
```

### Fields Reference

#### Root Object (required)
- `title` (string, required) - Project title displayed in the header
- `description` (string) - Optional project description
- `phases` (array, required) - Array of project phases

#### Phase Object (required)
- `id` (integer, required) - Phase number (1, 2, 3...)
- `title` (string, required) - Phase name
- `objective` (string) - Optional phase objective
- `tasks` (array, required) - Array of tasks

#### Task Object (required)
- `id` (string, required) - Task ID in format "X.Y" (e.g., "1.1", "2.3")
- `title` (string, required) - Task name
- `storyPoints` (number or object, required) - Single number or `{"min": X, "max": Y}` for ranges (averaged)
- `description` (string) - Task description (supports Markdown)
- `deliverables` (array of strings) - List of deliverables
- `acceptanceCriteria` (array of strings) - List of acceptance criteria
- `dependencies` (array) - Task dependencies as strings or objects with `taskId`
- `risk` (object) - Risk with `level` ("low", "medium", "high") and optional `description`

### Complete Example

```json
{
  "title": "Sample Project Estimation",
  "description": "A sample project demonstrating the JSON estimator format",
  "phases": [
    {
      "id": 1,
      "title": "Setup & Configuration",
      "objective": "Initialize project structure",
      "tasks": [
        {
          "id": "1.1",
          "title": "Project Initialization",
          "storyPoints": 2,
          "description": "Set up the initial project structure with configuration files.",
          "deliverables": [
            "Package.json with dependencies",
            "TypeScript configuration",
            "Git repository"
          ],
          "acceptanceCriteria": [
            "All config files created",
            "Dependencies install without errors",
            "Dev server starts successfully"
          ],
          "dependencies": [],
          "risk": {
            "level": "low"
          }
        },
        {
          "id": "1.2",
          "title": "CI/CD Setup",
          "storyPoints": { "min": 2, "max": 4 },
          "description": "Configure continuous integration pipeline.",
          "deliverables": [
            "GitHub Actions workflow",
            "Automated tests"
          ],
          "acceptanceCriteria": [
            "CI runs on every push",
            "Tests execute automatically"
          ],
          "dependencies": [
            { "taskId": "1.1" }
          ],
          "risk": {
            "level": "medium",
            "description": "Integration with external services"
          }
        }
      ]
    }
  ]
}
```

## JSON Schema

The full JSON schema is available in `src/schema.json`. You can use it for:
- IDE autocomplete and validation
- Programmatic validation
- Documentation reference

## Examples

See the `examples/` directory for sample JSON files.

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## Code of Conduct

This project follows a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## License

[MIT](LICENSE)
