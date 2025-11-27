import * as fs from 'fs';
import * as path from 'path';
import { Construct } from 'constructs';
import { NodejsFunctionProps } from './function';
import { LockFile } from './package-manager';
import { callsites, findUpMultiple } from './util';
import * as lambda from '../../aws-lambda';
import { FeatureFlags, ValidationError } from '../../core';
import { LAMBDA_NODEJS_USE_LATEST_RUNTIME } from '../../cx-api';

/**
 * Check if the feature flag is enabled and default to NODEJS_LATEST if so.
 * Otherwise default to NODEJS_16_X.
 */
export function getRuntime(scope: Construct, props: NodejsFunctionProps): lambda.Runtime {
  const defaultRuntime = FeatureFlags.of(scope).isEnabled(LAMBDA_NODEJS_USE_LATEST_RUNTIME)
    ? lambda.Runtime.NODEJS_LATEST
    : lambda.Runtime.NODEJS_16_X;
  return props.runtime ?? defaultRuntime;
}

/**
 * Checks given lock file or searches for a lock file
 */
export function findLockFile(scope: Construct, depsLockFilePath?: string): string {
  if (depsLockFilePath) {
    if (!fs.existsSync(depsLockFilePath)) {
      throw new ValidationError(`Lock file at ${depsLockFilePath} doesn't exist`, scope);
    }

    if (!fs.statSync(depsLockFilePath).isFile()) {
      throw new ValidationError('`depsLockFilePath` should point to a file', scope);
    }

    return path.resolve(depsLockFilePath);
  }

  const lockFiles = findUpMultiple([
    LockFile.PNPM,
    LockFile.YARN,
    LockFile.BUN_LOCK,
    LockFile.BUN,
    LockFile.NPM,
  ]);

  if (lockFiles.length === 0) {
    throw new ValidationError('Cannot find a package lock file (`pnpm-lock.yaml`, `yarn.lock`, `bun.lockb`, `bun.lock` or `package-lock.json`). Please specify it with `depsLockFilePath`.', scope);
  }
  if (lockFiles.length > 1) {
    throw new ValidationError(`Multiple package lock files found: ${lockFiles.join(', ')}. Please specify the desired one with \`depsLockFilePath\`.`, scope);
  }

  return lockFiles[0];
}

/**
 * Searches for an entry file. Preference order is the following:
 * 1. Given entry file
 * 2. A .ts file named as the defining file with id as suffix (defining-file.id.ts)
 * 3. A .js file name as the defining file with id as suffix (defining-file.id.js)
 * 4. A .mjs file name as the defining file with id as suffix (defining-file.id.mjs)
 * 5. A .mts file name as the defining file with id as suffix (defining-file.id.mts)
 * 6. A .cts file name as the defining file with id as suffix (defining-file.id.cts)
 * 7. A .cjs file name as the defining file with id as suffix (defining-file.id.cjs)
 */
export function findEntry(scope: Construct, id: string, entry?: string): string {
  if (entry) {
    if (!/\.(jsx?|tsx?|cjs|cts|mjs|mts)$/.test(entry)) {
      throw new ValidationError('Only JavaScript or TypeScript entry files are supported.', scope);
    }
    if (!fs.existsSync(entry)) {
      throw new ValidationError(`Cannot find entry file at ${entry}`, scope);
    }
    return entry;
  }

  const definingFile = findDefiningFile(scope);
  const extname = path.extname(definingFile);

  const tsHandlerFile = definingFile.replace(new RegExp(`${extname}$`), `.${id}.ts`);
  if (fs.existsSync(tsHandlerFile)) {
    return tsHandlerFile;
  }

  const jsHandlerFile = definingFile.replace(new RegExp(`${extname}$`), `.${id}.js`);
  if (fs.existsSync(jsHandlerFile)) {
    return jsHandlerFile;
  }

  const mjsHandlerFile = definingFile.replace(new RegExp(`${extname}$`), `.${id}.mjs`);
  if (fs.existsSync(mjsHandlerFile)) {
    return mjsHandlerFile;
  }

  const mtsHandlerFile = definingFile.replace(new RegExp(`${extname}$`), `.${id}.mts`);
  if (fs.existsSync(mtsHandlerFile)) {
    return mtsHandlerFile;
  }

  const ctsHandlerFile = definingFile.replace(new RegExp(`${extname}$`), `.${id}.cts`);
  if (fs.existsSync(ctsHandlerFile)) {
    return ctsHandlerFile;
  }

  const cjsHandlerFile = definingFile.replace(new RegExp(`${extname}$`), `.${id}.cjs`);
  if (fs.existsSync(cjsHandlerFile)) {
    return cjsHandlerFile;
  }

  throw new ValidationError(`Cannot find handler file ${tsHandlerFile}, ${jsHandlerFile}, ${mjsHandlerFile}, ${mtsHandlerFile}, ${ctsHandlerFile} or ${cjsHandlerFile}`, scope);
}

/**
 * Finds the name of the file where the `NodejsFunction` is defined
 */
export function findDefiningFile(scope: Construct): string {
  let definingIndex;
  const sites = callsites();
  for (const [index, site] of sites.entries()) {
    if (site.getFunctionName() === 'NodejsFunction') {
      // The next site is the site where the NodejsFunction was created
      definingIndex = index + 1;
      break;
    }
  }

  if (!definingIndex || !sites[definingIndex]) {
    throw new ValidationError('Cannot find defining file.', scope);
  }

  // Fixes issue #21630.
  // ESM modules return a 'file://' prefix to the filenames, this should be removed for
  // compatibility with the NodeJS filesystem functions.
  return sites[definingIndex].getFileName().replace(/^file:\/\//, '');
}

/**
 * Validates that the runtime is Node.js family
 */
export function validateNodejsRuntime(scope: Construct, runtime?: lambda.Runtime): void {
  if (runtime && runtime.family !== lambda.RuntimeFamily.NODEJS) {
    throw new ValidationError('Only `NODEJS` runtimes are supported.', scope);
  }
}

/**
 * Configuration values resolved for bundling
 */
export interface BundlingConfig {
  readonly entry: string;
  readonly handler: string;
  readonly architecture: lambda.Architecture;
  readonly depsLockFilePath: string;
  readonly projectRoot: string;
}

/**
 * Resolves bundling configuration from props
 */
export function resolveBundlingConfig(scope: Construct, id: string, props: NodejsFunctionProps): BundlingConfig {
  const entry = path.resolve(findEntry(scope, id, props.entry));
  const handler = props.handler ?? 'handler';
  const architecture = props.architecture ?? lambda.Architecture.X86_64;
  const depsLockFilePath = findLockFile(scope, props.depsLockFilePath);
  const projectRoot = props.projectRoot ?? path.dirname(depsLockFilePath);

  return {
    entry,
    handler,
    architecture,
    depsLockFilePath,
    projectRoot,
  };
}
