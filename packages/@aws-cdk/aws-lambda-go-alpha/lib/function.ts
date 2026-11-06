import * as fs from 'fs';
import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib/core';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import type { Construct } from 'constructs';
import { Bundling } from './bundling';
import type { BundlingOptions } from './types';
import { findUp } from './util';

/**
 * Properties for a GolangFunction
 */
export interface GoFunctionProps extends lambda.FunctionOptions {
  /**
   * The path to the folder or file that contains the main application entry point files for the project.
   *
   * This accepts either a path to a directory or file.
   *
   * If a directory path is provided then it will assume there is a Go entry file (i.e. `main.go`) and
   * will construct the build command using the directory path.
   *
   * For example, if you provide the entry as:
   *
   *     entry: 'my-lambda-app/cmd/api'
   *
   * Then the `go build` command would be:
   *
   *     `go build ./cmd/api`
   *
   * If a path to a file is provided then it will use the filepath in the build command.
   *
   * For example, if you provide the entry as:
   *
   *     entry: 'my-lambda-app/cmd/api/main.go'
   *
   * Then the `go build` command would be:
   *
   *     `go build ./cmd/api/main.go`
   */
  readonly entry: string;

  /**
   * The runtime environment. Only runtimes of the Golang family and provided family are supported.
   *
   * @default lambda.Runtime.PROVIDED_AL2
   */
  readonly runtime?: lambda.Runtime;

  /**
   * Directory containing your go.mod file
   *
   * This will accept either a directory path containing a `go.mod` file
   * or a filepath to your `go.mod` file (i.e. `path/to/go.mod`).
   *
   * This will be used as the source of the volume mounted in the Docker
   * container and will be the directory where it will run `go build` from.
   *
   * @default - the path is found by walking up parent directories searching for
   *  a `go.mod` file from the location of `entry`
   */
  readonly moduleDir?: string;

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
@propertyInjectable
export class GoFunction extends lambda.Function {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-lambda-go-alpha.GoFunction';
  /**
   * The address of the Google Go proxy
   */
  public static readonly GOOGLE_GOPROXY = 'https://proxy.golang.org';

  constructor(scope: Construct, id: string, props: GoFunctionProps) {
    if (props.runtime && (props.runtime.family !== lambda.RuntimeFamily.GO && props.runtime.family != lambda.RuntimeFamily.OTHER)) {
      throw new Error('Only `go` and `provided` runtimes are supported.');
    }

    const entry = path.resolve(props.entry);

    // Find the project root
    let moduleDir: string;
    if (props.moduleDir) {
      const parsedModuleDir = path.parse(props.moduleDir);
      if (parsedModuleDir.base && parsedModuleDir.ext && parsedModuleDir.base === 'go.mod') {
        if (!fs.existsSync(props.moduleDir)) {
          throw new Error(`go.mod file at ${props.moduleDir} doesn't exist`);
        }
      } else if (parsedModuleDir.base && parsedModuleDir.ext && parsedModuleDir.base != 'go.mod') {
        throw new Error('moduleDir is specifying a file that is not go.mod');
      } else if (!fs.existsSync(path.join(props.moduleDir, 'go.mod'))) {
        throw new Error(`go.mod file at ${props.moduleDir} doesn't exist`);
      }
      moduleDir = props.moduleDir;
    } else {
      const modFile = findUp('go.mod', entry);
      if (!modFile) {
        throw new Error ('Cannot find go.mod. Please specify it with `moduleDir`.');
      }
      moduleDir = modFile;
    }

    const runtime = props.runtime ?? lambda.Runtime.PROVIDED_AL2;
    const architecture = props.architecture ?? lambda.Architecture.X86_64;

    // Security warnings for potentially unsafe bundling options
    if (props.bundling?.goBuildFlags?.length) {
      cdk.Annotations.of(scope).addWarningV2(
        '@aws-cdk/aws-lambda-go-alpha:goBuildFlagsSecurityWarning',
        'goBuildFlags can execute arbitrary commands during bundling. Ensure all flags come from trusted sources. See: https://docs.aws.amazon.com/cdk/latest/guide/security.html',
      );
    }

    if (props.bundling?.commandHooks?.beforeBundling || props.bundling?.commandHooks?.afterBundling) {
      cdk.Annotations.of(scope).addWarningV2(
        '@aws-cdk/aws-lambda-go-alpha:commandHooksSecurityWarning',
        'commandHooks can execute arbitrary commands during bundling. Ensure all commands come from trusted sources. See: https://docs.aws.amazon.com/cdk/latest/guide/security.html',
      );
    }

    super(scope, id, {
      ...props,
      runtime,
      code: Bundling.bundle({
        ...props.bundling ?? {},
        entry,
        runtime,
        architecture,
        moduleDir,
      }),
      handler: 'bootstrap', // setting name to bootstrap so that the 'provided' runtime can also be used
    });

    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);
  }
}

