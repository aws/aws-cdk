#!/usr/bin/env ts-node
/**
 * Validates that shared dependencies have aligned versions across the monorepo.
 * 
 * This script loads all built .jsii packages into a single TypeSystem (the same way
 * cdk-generate-synthetic-examples does) to detect version conflicts. When packages
 * are built with different versions of shared dependencies like @aws-cdk/cloud-assembly-schema,
 * jsii-reflect will throw an error when trying to load them together.
 * 
 * This check runs in the post-build step of aws-cdk-lib to catch conflicts after
 * all packages have been built by lerna.
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import * as reflect from 'jsii-reflect';

// JSII features that assemblies in this repo are allowed to use
const JSII_SUPPORTED_FEATURES = ['intersection-types', 'class-covariant-overrides'];

async function main() {
  const repoRoot = path.join(__dirname, '..');
  const packagesDir = path.join(repoRoot, 'packages');
  
  if (!fs.existsSync(packagesDir)) {
    console.log('Skipping jsii type system conflict check (packages directory not found)');
    return;
  }
  
  console.log('Checking for jsii type system conflicts...');
  
  // Find all package directories with .jsii files
  const jsiiFiles = execSync(
    `find ${packagesDir} -name ".jsii" -not -path "*/node_modules/*"`,
    { encoding: 'utf8' }
  ).trim().split('\n').filter(f => f);
  
  if (jsiiFiles.length === 0) {
    console.log('No .jsii files found, skipping check');
    return;
  }
  
  const ts = new reflect.TypeSystem();
  
  // Load all packages into a single TypeSystem. If any package was built with a
  // different version of a shared dependency, jsii-reflect will throw:
  // "Conflicting versions of X in type system: previously loaded A, trying to load B"
  for (const jsiiFile of jsiiFiles) {
    const dir = path.dirname(jsiiFile);
    await ts.load(dir, {
      validate: false, // Don't validate to save 66% of execution time (20s vs 1min).
      supportedFeatures: JSII_SUPPORTED_FEATURES,
    });
  }
  
  console.log('No jsii type system conflicts detected');
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
