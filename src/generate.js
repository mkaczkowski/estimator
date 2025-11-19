#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const packageJson = require('../package.json');

// CLI argument parsing
const args = process.argv.slice(2);

// Handle flags
if (args.includes('--version') || args.includes('-v')) {
    console.log(packageJson.version);
    process.exit(0);
}

if (args.includes('--help') || args.includes('-h') || args.length === 0) {
    console.log(`
${packageJson.name} v${packageJson.version}

Generate interactive HTML estimators from structured Markdown files.

Usage:
  estimator <input-file> [options]

Arguments:
  <input-file>          Path to the source Markdown file (required)

Options:
  -o, --output <path>   Custom output file path
  -s, --subtitle <text> Subtitle for the estimator (default: current date)
  -h, --help            Show this help message
  -v, --version         Show version number

Examples:
  estimator project.md
  estimator project.md -s "Q1 2025"
  estimator project.md -o ./output/estimate.html
  estimator project.md --subtitle "Sprint 1" --output custom.html

Markdown Format:
  See README.md for the required Markdown structure.
  Example files available in the examples/ directory.
`);
    process.exit(0);
}

// Parse arguments
let inputPath = null;
let outputPath = null;
let subtitle = new Date().toLocaleDateString();

for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '-o' || arg === '--output') {
        outputPath = args[++i];
        if (!outputPath) {
            console.error('Error: --output requires a file path');
            process.exit(1);
        }
    } else if (arg === '-s' || arg === '--subtitle') {
        subtitle = args[++i];
        if (!subtitle) {
            console.error('Error: --subtitle requires a value');
            process.exit(1);
        }
    } else if (!arg.startsWith('-')) {
        inputPath = arg;
    } else {
        console.error(`Error: Unknown option '${arg}'`);
        console.error('Run "estimator --help" for usage information');
        process.exit(1);
    }
}

// Validate input
if (!inputPath) {
    console.error('Error: Input file is required');
    console.error('Run "estimator --help" for usage information');
    process.exit(1);
}

// Resolve to absolute path
inputPath = path.resolve(inputPath);

if (!fs.existsSync(inputPath)) {
    console.error(`Error: File not found: ${inputPath}`);
    process.exit(1);
}

// Validate file extension
const ext = path.extname(inputPath).toLowerCase();
if (ext !== '.md' && ext !== '.markdown') {
    console.error(`Error: Input file must be a Markdown file (.md or .markdown)`);
    console.error(`Got: ${ext || 'no extension'}`);
    process.exit(1);
}

try {
    // Read Markdown content
    const mdContent = fs.readFileSync(inputPath, 'utf8');

    // Validate content
    if (!mdContent.trim()) {
        console.error('Error: Input file is empty');
        process.exit(1);
    }

    // Extract Title
    const titleMatch = mdContent.match(/^# (.+)/m);
    const title = titleMatch ? titleMatch[1].trim() : path.basename(inputPath, ext);

    // Validate structure (basic checks)
    const hasPhase = /^## Phase \d+:/m.test(mdContent);
    const hasTask = /^### Task \d+/m.test(mdContent);

    if (!hasPhase && !hasTask) {
        console.warn('Warning: No phases or tasks found in the Markdown file.');
        console.warn('Expected format: "## Phase N: Name" and "### Task N.N: Name"');
    }

    // Encode Markdown
    const base64Content = Buffer.from(mdContent).toString('base64');

    // Read Template
    const templatePath = path.join(__dirname, 'template.html');

    if (!fs.existsSync(templatePath)) {
        console.error('Error: Template file not found. Package may be corrupted.');
        process.exit(1);
    }

    let template = fs.readFileSync(templatePath, 'utf8');

    // Perform Replacements
    template = template.replace('{{TITLE}}', title);
    template = template.replace('{{SUBTITLE}}', subtitle);
    template = template.replace('{{MARKDOWN_BASE64}}', base64Content);

    // Determine Output Path
    if (!outputPath) {
        const outputDir = path.dirname(inputPath);
        const outputFilename = path.basename(inputPath, ext) + '-estimator.html';
        outputPath = path.join(outputDir, outputFilename);
    } else {
        outputPath = path.resolve(outputPath);

        // Ensure output directory exists
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
    }

    // Write Output
    fs.writeFileSync(outputPath, template);

    console.log(`✓ Generated estimator: ${outputPath}`);

} catch (error) {
    if (error.code === 'EACCES') {
        console.error(`Error: Permission denied accessing file`);
    } else if (error.code === 'ENOENT') {
        console.error(`Error: File or directory not found`);
    } else {
        console.error('Error generating estimator:', error.message);
    }
    process.exit(1);
}
