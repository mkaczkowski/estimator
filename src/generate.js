const fs = require('fs');
const path = require('path');

if (process.argv.length < 3) {
    console.error('Usage: node scripts/estimator/generate.js <path-to-markdown-file> [subtitle]');
    process.exit(1);
}

const inputPath = process.argv[2];
const subtitle = process.argv[3] || new Date().toLocaleDateString();

if (!fs.existsSync(inputPath)) {
    console.error(`Error: File not found at ${inputPath}`);
    process.exit(1);
}

try {
    // Read Markdown content
    const mdContent = fs.readFileSync(inputPath, 'utf8');
    
    // Extract Title
    const titleMatch = mdContent.match(/^# (.+)/);
    const title = titleMatch ? titleMatch[1].trim() : path.basename(inputPath, '.md');

    // Encode Markdown
    const base64Content = Buffer.from(mdContent).toString('base64');

    // Read Template
    const templatePath = path.join(__dirname, 'template.html');
    let template = fs.readFileSync(templatePath, 'utf8');

    // Perform Replacements
    template = template.replace('{{TITLE}}', title);
    template = template.replace('{{SUBTITLE}}', subtitle);
    template = template.replace('{{MARKDOWN_BASE64}}', base64Content);

    // Determine Output Path
    const outputDir = path.dirname(inputPath);
    const outputFilename = path.basename(inputPath, '.md') + '-estimator.html';
    const outputPath = path.join(outputDir, outputFilename);

    // Write Output
    fs.writeFileSync(outputPath, template);
    
    console.log(`Successfully generated estimator at: ${outputPath}`);

} catch (error) {
    console.error('Error generating estimator:', error);
    process.exit(1);
}
