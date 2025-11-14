import * as fs from 'fs';
import * as path from 'path';
import { Construct } from 'constructs';
import { EdgeFunction } from './edge-function';
import * as lambda from '../../../aws-lambda';
import { Architecture } from '../../../aws-lambda';
import { NodejsFunctionProps } from '../../../aws-lambda-nodejs';
import { Bundling } from '../../../aws-lambda-nodejs/lib/bundling';
import { callsites, findUpMultiple } from '../../../aws-lambda-nodejs/lib/util';
import { LockFile } from '../../../aws-lambda-nodejs/lib/package-manager';
import { FeatureFlags, ValidationError } from '../../../core';
import { LAMBDA_NODEJS_USE_LATEST_RUNTIME } from '../../../cx-api';
/**
 * Properties for a NodejsEdgeFunction
 */
export interface NodejsEdgeFunctionProps extends NodejsFunctionProps {
  /**
   * The stack ID of Lambda@Edge function.
   *
   * @default - `edge-lambda-stack-${region}`
   */
  readonly stackId?: string;
}

/**
 * A Node.js Lambda@Edge function bundled using esbuild
 *
 * @resource AWS::Lambda::Function
 */
export class NodejsEdgeFunction extends EdgeFunction {
  constructor(scope: Construct, id: string, props: NodejsEdgeFunctionProps = {}) {
    if (props.runtime && props.runtime.family !== lambda.RuntimeFamily.NODEJS) {
      throw new ValidationError('Only `NODEJS` runtimes are supported.', scope);
    }

    const runtime = getRuntime(scope, props);

    if (props.code !== undefined) {
      if (props.handler === undefined) {
        throw new ValidationError(
          'Cannot determine handler when `code` property is specified. Use `handler` property to specify a handler.\n'
          + 'The handler should be the name of the exported function to be invoked and the file containing that function.\n'
          + 'For example, handler should be specified in the form `myFile.myFunction`', scope,
        );
      }

      super(scope, id, {
        ...props,
        runtime,
        code: props.code,
        handler: props.handler,
      });
    } else {
      // Entry and defaults
      const entry = path.resolve(findEntry(scope, id, props.entry));
      const architecture = props.architecture ?? Architecture.X86_64;
      const depsLockFilePath = findLockFile(scope, props.depsLockFilePath);
      const projectRoot = props.projectRoot ?? path.dirname(depsLockFilePath);
      const handler = props.handler ?? 'handler';

      super(scope, id, {
        ...props,
        runtime,
        code: Bundling.bundle(scope, {
          ...props.bundling ?? {},
          entry,
          runtime,
          architecture,
          depsLockFilePath,
          projectRoot,
        }),
        handler: handler.indexOf('.') !== -1 ? `${handler}` : `index.${handler}`,
      });
    }
  }
}

/**
 * Check if the feature flag is enabled and default to NODEJS_LATEST if so.
 * Otherwise default to NODEJS_16_X.
 */
function getRuntime(scope: Construct, props: NodejsEdgeFunctionProps): lambda.Runtime {
  const defaultRuntime = FeatureFlags.of(scope).isEnabled(LAMBDA_NODEJS_USE_LATEST_RUNTIME)
    ? lambda.Runtime.NODEJS_LATEST
    : lambda.Runtime.NODEJS_16_X;
  return props.runtime ?? defaultRuntime;
}

/**
 * Checks given lock file or searches for a lock file
 */
function findLockFile(scope: Construct, depsLockFilePath?: string): string {
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
    LockFile.NPM,
    LockFile.BUN,
    LockFile.BUN_LOCK,
  ]);

  if (lockFiles.length === 0) {
    throw new ValidationError('Cannot find a package lock file (`pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`, `bun.lockb` or `bun.lock`). Please specify it with `depsLockFilePath`.', scope);
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
 */
function findEntry(scope: Construct, id: string, entry?: string): string {
  if (entry) {
    if (!/\.(jsx?|tsx?|mjsx?|mtsx?)$/.test(entry)) {
      throw new ValidationError('Only JavaScript or TypeScript entry files are supported.', scope);
    }
    if (!fs.existsSync(entry)) {
      throw new ValidationError(`Cannot find entry file at ${entry}`, scope);
    }
    return entry;
  }

  const definingFile = findDefiningFile();
  const extname = path.extname(definingFile);
  const basename = definingFile.replace(new RegExp(`${extname}$`), '');

  for (const ext of ['.ts', '.js', '.mjs', '.mts']) {
    const file = `${basename}.${id}${ext}`;
    if (fs.existsSync(file)) {
      return file;
    }
  }

  throw new ValidationError(`Cannot find entry file at ${basename}.${id}.ts, ${basename}.${id}.js, ${basename}.${id}.mjs, or ${basename}.${id}.mts`, scope);
}

/**
 * Finds the name of the file where the `NodejsEdgeFunction` is defined
 */
function findDefiningFile(): string {
  let definingIndex;
  const sites = callsites();
  for (const [index, site] of sites.entries()) {
    if (site.getFunctionName() === 'NodejsEdgeFunction') {
      definingIndex = index + 1;
      break;
    }
  }

  if (!definingIndex || !sites[definingIndex]) {
    throw new Error('Cannot find defining file.');
  }

  return sites[definingIndex].getFileName();
}
