import * as fs from 'fs';
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { Bundling } from './bundling';
import { BundlingOptions } from './types';
import { findUp } from './util';

/**
 * Properties for a GolangFunction
 */
export interface GolangFunctionProps extends lambda.FunctionOptions {
  /**
   * The path to the folder that contains the main application entry point files for the project.
   *
   * For example:
   *
   * entry: 'my-lambda-app/cmd/api'
   */
  readonly entry: string;

  /**
   * The runtime environment. Only runtimes of the Golang family and provided are supported.
   *
   * @default lambda.Runtime.PROVIDED_AL2
   */
  readonly runtime?: lambda.Runtime;

  /**
   * Path to go.mod file
   *
   * This will be used as the source of the volume mounted in the Docker
   * container.
   *
   * @default - the path is found by walking up parent directories searching for
   *  a `go.mod` file
   */
  readonly modFilePath?: string;

  /**
   * Bundling options
   *
   * @default - use default bundling options
   */
  readonly bundling?: BundlingOptions;
}

/**
 * A Golang Lambda function
 */
export class GolangFunction extends lambda.Function {
  constructor(scope: cdk.Construct, id: string, props: GolangFunctionProps) {
    if (props.runtime && (props.runtime.family !== lambda.RuntimeFamily.GO && props.runtime.family != lambda.RuntimeFamily.OTHER)) {
      throw new Error('Only `go` and `provided` runtimes are supported.');
    }

    const entry = path.resolve(props.entry);

    // Find the project root
    let modFilePath: string;
    if (props.modFilePath) {
      if (!fs.existsSync(props.modFilePath)) {
        throw new Error(`go.mod file at ${props.modFilePath} doesn't exist`);
      }
      modFilePath = props.modFilePath;
    } else {
      const modFile = findUp('go.mod', entry);
      if (!modFile) {
        throw new Error ('Cannot find go.mod. Please specify it with `modFilePath`.');
      }
      modFilePath = modFile;
    }

    const runtime = props.runtime ?? lambda.Runtime.PROVIDED_AL2;

    super(scope, id, {
      ...props,
      runtime,
      code: Bundling.bundle({
        ...props.bundling ?? {},
        entry,
        runtime,
        modFilePath,
      }),
      handler: 'bootstrap', // setting name to bootstrap so that the 'provided' runtime can also be used
    });
  }
}

