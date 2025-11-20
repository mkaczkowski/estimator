#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import AjvModule from 'ajv';
const Ajv = AjvModule.default || AjvModule;
import type { EstimatorData } from './types.ts';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use createRequire for JSON imports (avoids experimental warning)
const nodeRequire = createRequire(import.meta.url);

interface PackageJson {
    name: string;
    version: string;
}

interface NodeError extends Error {
    code?: string;
}

const packageJson: PackageJson = nodeRequire('../package.json');
const schema = nodeRequire('./schema.json');

// Initialize AJV validator
const ajv = new Ajv({ allErrors: true });
const validateSchema = ajv.compile(schema);

// CLI argument parsing
const args: string[] = process.argv.slice(2);

// Handle flags
if (args.includes('--version') || args.includes('-v')) {
    console.log(packageJson.version);
    process.exit(0);
}

if (args.includes('--help') || args.includes('-h') || args.length === 0) {
    console.log(`
${packageJson.name} v${packageJson.version}

Generate interactive HTML estimators from structured JSON files.

Usage:
  estimator <input-file> [options]

Arguments:
  <input-file>          Path to the source JSON file (required)

Options:
  -o, --output <path>   Custom output file path
  -s, --subtitle <text> Subtitle for the estimator (default: current date)
  -h, --help            Show this help message
  -v, --version         Show version number

Examples:
  estimator project.json
  estimator project.json -s "Q1 2025"
  estimator project.json -o ./output/estimate.html
  estimator project.json --subtitle "Sprint 1" --output custom.html

JSON Format:
  See README.md for the required JSON schema.
  Example files available in the examples/ directory.
`);
    process.exit(0);
}

// Parse arguments
let inputPath: string | null = null;
let outputPath: string | null = null;
let subtitle: string = new Date().toLocaleDateString();

for (let i = 0; i < args.length; i++) {
    const arg: string = args[i];

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
const ext: string = path.extname(inputPath).toLowerCase();
if (ext !== '.json') {
    console.error(`Error: Input file must be a JSON file (.json)`);
    console.error(`Got: ${ext || 'no extension'}`);
    process.exit(1);
}

try {
    // Read JSON content
    const jsonContent: string = fs.readFileSync(inputPath, 'utf8');

    // Validate content
    if (!jsonContent.trim()) {
        console.error('Error: Input file is empty');
        process.exit(1);
    }

    // Parse JSON
    let data: EstimatorData;
    try {
        data = JSON.parse(jsonContent);
    } catch (parseError) {
        const err = parseError as Error;
        console.error('Error: Invalid JSON syntax');
        console.error(err.message);
        process.exit(1);
    }

    // Validate against schema
    const valid = validateSchema(data);
    if (!valid) {
        console.error('Error: JSON validation failed');
        if (validateSchema.errors) {
            validateSchema.errors.forEach(error => {
                const path = error.instancePath || '/';
                console.error(`  - ${path}: ${error.message}`);
            });
        }
        process.exit(1);
    }

    // Extract title from validated data
    const title: string = data.title;

    // Read Template
    const templatePath: string = path.join(__dirname, 'template.html');

    if (!fs.existsSync(templatePath)) {
        console.error('Error: Template file not found. Package may be corrupted.');
        process.exit(1);
    }

    let template: string = fs.readFileSync(templatePath, 'utf8');

    // Perform Replacements
    template = template.replace('{{TITLE}}', title);
    template = template.replace('{{SUBTITLE}}', subtitle);
    template = template.replace('{{DATA_JSON}}', JSON.stringify(data));

    // Determine Output Path
    if (!outputPath) {
        const outputDir: string = path.dirname(inputPath);
        const outputFilename: string = path.basename(inputPath, ext) + '-estimator.html';
        outputPath = path.join(outputDir, outputFilename);
    } else {
        outputPath = path.resolve(outputPath);

        // Ensure output directory exists
        const outputDir: string = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
    }

    // Write Output
    fs.writeFileSync(outputPath, template);

    console.log(`✓ Generated estimator: ${outputPath}`);

} catch (error) {
    const nodeError = error as NodeError;
    if (nodeError.code === 'EACCES') {
        console.error(`Error: Permission denied accessing file`);
    } else if (nodeError.code === 'ENOENT') {
        console.error(`Error: File or directory not found`);
    } else {
        console.error('Error generating estimator:', nodeError.message);
    }
    process.exit(1);
}
