# Execution Estimator Generator

This tool generates an interactive HTML estimator from a structured Markdown file.

## Usage

```bash
node src/generate.js <path-to-markdown-file> [subtitle]
```

- `<path-to-markdown-file>`: Path to the source Markdown file (required).
- `[subtitle]`: Optional subtitle to display in the header (defaults to current date).

## Markdown Format

The source Markdown file must follow a specific structure for the parser to work correctly.

### 1. Document Title
The first H1 header is used as the estimator title.
```markdown
# Project Name Execution Plan
```

### 2. Phases
Phases are defined by H2 headers starting with "Phase".
```markdown
## Phase 1: Initialization
```
Regex: `/^## Phase (\d+): (.+)/`

### 3. Tasks
Tasks are defined by H3 headers starting with "Task".
```markdown
### Task 1.1: Setup Repository
```
Regex: `/^### Task (\d+(?:\.\d+)?): (.+)/`

### 4. Story Points
Story points must be bolded and in parentheses. Ranges are supported (averaged).
```markdown
**Story Points: (3)**
**Story Points: (1-3)**
```
Regex: `/\*\*Story Points:\s*\((\d+(?:-\d+)?)\)\*\*/`

### 5. Task Details
The following bold headers are recognized within a task block:

- `**Description:**` - Task description (supports Markdown).
- `**Deliverables:**` - List of deliverables (supports Markdown).
- `**Acceptance Criteria:**` - Checklist or list (supports Markdown).
- `**Dependencies:**` - Text or comma-separated list. References to other tasks (e.g., "Task 1.2") are automatically linked.
- `**Risk:**` - "Low", "Medium", or "High" (optionally followed by text).

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
