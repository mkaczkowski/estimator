# Contributing to Estimator Generator

Thank you for your interest in contributing! This document provides guidelines and information for contributors.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/estimator.git
   cd estimator
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Make sure you're using the correct Node version:
   ```bash
   nvm use
   ```

## Development

### Running Locally

```bash
# Run with a sample file
node src/generate.js examples/sample-project.md

# Test the CLI flags
node src/generate.js --help
node src/generate.js --version
```

### Project Structure

```
estimator/
├── src/
│   ├── generate.js     # CLI entry point
│   └── template.html   # HTML template with embedded parser
├── examples/           # Sample Markdown files
├── .github/workflows/  # CI/CD configuration
└── package.json
```

## Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Test your changes:
   ```bash
   node src/generate.js examples/sample-project.md -s "Test"
   ```

4. Commit your changes:
   ```bash
   git commit -m "Add: description of your changes"
   ```

5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

6. Open a Pull Request

## Commit Message Format

Use clear, descriptive commit messages:

- `Add: new feature description`
- `Fix: bug description`
- `Update: what was updated`
- `Remove: what was removed`
- `Docs: documentation changes`

## Pull Request Guidelines

- Provide a clear description of the changes
- Reference any related issues
- Ensure the CI checks pass
- Keep changes focused and atomic

## Reporting Issues

When reporting issues, please include:

- Node.js version (`node --version`)
- Operating system
- Steps to reproduce
- Expected behavior
- Actual behavior
- Sample Markdown file (if applicable)

## Code Style

- Use 4-space indentation
- Use single quotes for strings
- Add JSDoc comments for functions
- Keep functions small and focused

## Questions?

Feel free to open an issue for any questions or concerns.

Thank you for contributing!
