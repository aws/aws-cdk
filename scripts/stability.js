#!/usr/bin/env node
/**
 * Analyzes package.json files and outputs stability information.
 * 
 * Output format: module,stability,cfn-only-flag
 * Example: aws-s3,stable,
 */
const path = require('path');
const fs = require('fs');

const dirs = process.argv.slice(2);
if (dirs.length === 0) {
  console.error(`Usage: ${path.basename(process.argv[1])} module1/package.json module2/package.json module3/package.json ...`);
  console.error('\nAnalyzes AWS CDK package stability and outputs CSV format.');
  process.exit(1);
}

for (const packageJsonPath of dirs) {
  // Validate file exists
  if (!fs.existsSync(packageJsonPath)) {
    console.error(`Error: File not found: ${packageJsonPath}`);
    process.exit(1);
  }

  try {
    const moduledir = path.dirname(packageJsonPath);
    const content = fs.readFileSync(packageJsonPath, 'utf-8');
    const metadata = JSON.parse(content);

    if (!metadata.name) {
      console.error(`Error: Missing 'name' field in ${packageJsonPath}`);
      process.exit(1);
    }

    const components = [
      metadata.name.replace(/^@aws-cdk\//g, ''), // module
      metadata.stability || 'unknown',           // stability
      cfnOnly(moduledir) ? 'cfn-only' : ''       // cfn-only
    ];

    console.log(components.join(','));
  } catch (error) {
    console.error(`Error processing ${packageJsonPath}: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Determines if a module contains only CloudFormation-generated code.
 * 
 * @param {string} dir - The module directory path
 * @returns {boolean} True if the module only contains CFN generated files
 */
function cfnOnly(dir) {
  const libdir = path.join(dir, 'lib');
  
  if (!fs.existsSync(libdir)) {
    return true; // No lib directory means CFN-only
  }
  
  const libsrc = fs.readdirSync(libdir).filter(file => {
    // Exclude generated files, compiled JS, and index
    return !file.endsWith('.generated.ts') && 
           !file.endsWith('.js') && 
           file !== 'index.ts';
  });
  
  return libsrc.length === 0;
}