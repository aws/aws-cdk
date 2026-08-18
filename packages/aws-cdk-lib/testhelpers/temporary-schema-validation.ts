/**
 * Helpers for loading temporary CFN schemas into the validation plugin during tests.
 *
 * During simultaneous releases, pre-GA CloudFormation properties live in
 * tools/@aws-cdk/spec2cdk/temporary-schemas/. This module discovers those schemas
 * and provides a cached validation plugin instance that recognizes them.
 *
 * Used by jest-global-app-testhook.ts — not intended for production runtime.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as cdk from '../core';

/**
 * Resolve the spec2cdk temporary-schemas directory if it exists and contains schemas.
 * In the public repo this directory only has a .keep file (returns undefined).
 * In aws-cdk-private it contains pre-GA CFN schemas (returns the path).
 */
function findTemporarySchemasDirectory(): string | undefined {
  const candidate = path.resolve(__dirname, '../../..', 'tools/@aws-cdk/spec2cdk/temporary-schemas');
  if (!fs.existsSync(candidate)) {
    return undefined;
  }
  return hasSchemaFiles(candidate) ? candidate : undefined;
}

/**
 * Recursively check if a directory contains any .json files.
 * Skips symlinks for safety.
 */
function hasSchemaFiles(dir: string): boolean {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) continue;
    if (entry.isFile() && entry.name.endsWith('.json')) return true;
    if (entry.isDirectory() && hasSchemaFiles(path.join(dir, entry.name))) return true;
  }
  return false;
}

// Computed once at module load — cached for the lifetime of the test process.
const TEMPORARY_SCHEMAS_DIR = findTemporarySchemasDirectory();

// Cache the plugin instance so we don't re-parse schemas for every App.
let cachedPlugin: cdk.CloudFormationValidatePlugin | undefined;

/**
 * Whether temporary schemas are present in this repo checkout.
 * True in aws-cdk-private with pre-GA schemas, false in the public repo.
 */
export function hasTemporarySchemas(): boolean {
  return TEMPORARY_SCHEMAS_DIR !== undefined;
}

/**
 * Get a cached CloudFormationValidatePlugin instance configured with the
 * temporary schema overlays. Parses schemas once, reuses across all Apps.
 *
 * @throws if called when hasTemporarySchemas() is false
 */
export function getTemporarySchemaPlugin(): cdk.CloudFormationValidatePlugin {
  if (!TEMPORARY_SCHEMAS_DIR) {
    // This is a programming error in the test infrastructure — should never reach here
    // eslint-disable-next-line @cdklabs/no-throw-default-error
    throw new Error('No temporary schemas directory found — cannot create overlay plugin');
  }
  if (!cachedPlugin) {
    cachedPlugin = new cdk.CloudFormationValidatePlugin({
      additionalSchemasDirectory: TEMPORARY_SCHEMAS_DIR,
    });
  }
  return cachedPlugin;
}

/**
 * Check if the App already has a CloudFormationValidatePlugin registered.
 * Used to avoid double-registration which triggers DuplicateCloudFormationValidatePlugin errors.
 */
export function appHasValidationPlugin(app: cdk.App): boolean {
  return app._validationPlugins.some(
    (p) => p instanceof cdk.CloudFormationValidatePlugin,
  );
}
