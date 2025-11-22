import { Construct } from 'constructs';
import { Bundling } from './bundling';
import { getRuntime, resolveBundlingConfig } from './function-helpers';
import { BundlingOptions } from './types';
import { isSdkV2Runtime } from './util';
import * as lambda from '../../aws-lambda';
import { Annotations, ValidationError } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';

/**
 * Properties for a NodejsFunction
 */
export interface NodejsFunctionProps extends lambda.FunctionOptions {
  /**
   * Path to the entry file (JavaScript or TypeScript).
   *
   * @default - Derived from the name of the defining file and the construct's id.
   * If the `NodejsFunction` is defined in `stack.ts` with `my-handler` as id
   * (`new NodejsFunction(this, 'my-handler')`), the construct will look at `stack.my-handler.ts`
   * and `stack.my-handler.js`.
   */
  readonly entry?: string;

  /**
   * The name of the exported handler in the entry file.
   *
   * * If the `code` property is supplied, then you must include the `handler` property. The handler should be the name of the file
   * that contains the exported handler and the function that should be called when the AWS Lambda is invoked. For example, if
   * you had a file called `myLambda.js` and the function to be invoked was `myHandler`, then you should input `handler` property as `myLambda.myHandler`.
   *
   * * If the `code` property is not supplied and the handler input does not contain a `.`, then the handler is prefixed with `index.` (index period). Otherwise,
   * the handler property is not modified.
   *
   * @default handler
   */
  readonly handler?: string;

  /**
   * The runtime environment. Only runtimes of the Node.js family are
   * supported.
   *
   * @default `Runtime.NODEJS_LATEST` if the `@aws-cdk/aws-lambda-nodejs:useLatestRuntimeVersion` feature flag is enabled, otherwise `Runtime.NODEJS_16_X`
   */
  readonly runtime?: lambda.Runtime;

  /**
   * The `AWS_NODEJS_CONNECTION_REUSE_ENABLED` environment variable does not exist in the AWS SDK for JavaScript v3.
   *
   * This prop will be deprecated when the Lambda Node16 runtime is deprecated on June 12, 2024.
   * See https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html#runtime-support-policy
   *
   * Info for Node 16 runtimes / SDK v2 users:
   *
   * Whether to automatically reuse TCP connections when working with the AWS
   * SDK for JavaScript v2.
   *
   * This sets the `AWS_NODEJS_CONNECTION_REUSE_ENABLED` environment variable
   * to `1`.
   *
   * @see https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/node-reusing-connections.html
   *
   * @default - false (obsolete) for runtimes >= Node 18, true for runtimes <= Node 16.
   */
  readonly awsSdkConnectionReuse?: boolean;

  /**
   * The path to the dependencies lock file (`yarn.lock`, `pnpm-lock.yaml`, `bun.lockb`, `bun.lock` or `package-lock.json`).
   *
   * This will be used as the source for the volume mounted in the Docker
   * container.
   *
   * Modules specified in `nodeModules` will be installed using the right
   * installer (`yarn`, `pnpm`, `bun` or `npm`) along with this lock file.
   *
   * @default - the path is found by walking up parent directories searching for
   *   a `yarn.lock`, `pnpm-lock.yaml`, `bun.lockb`, `bun.lock` or `package-lock.json` file
   */
  readonly depsLockFilePath?: string;

  /**
   * Bundling options
   *
   * @default - use default bundling options: no minify, no sourcemap, all
   *   modules are bundled.
   */
  readonly bundling?: BundlingOptions;

  /**
   * The path to the directory containing project config files (`package.json` or `tsconfig.json`)
   *
   * @default - the directory containing the `depsLockFilePath`
   */
  readonly projectRoot?: string;

  /**
   * The code that will be deployed to the Lambda Handler. If included, then properties related to
   * bundling of the code are ignored.
   *
   * * If the `code` field is specified, then you must include the `handler` property.
   *
   * @default - the code is bundled by esbuild
   */
  readonly code?: lambda.Code;
}

/**
 * A Node.js Lambda function bundled using esbuild
 */
export class NodejsFunction extends lambda.Function {
  constructor(scope: Construct, id: string, props: NodejsFunctionProps = {}) {
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
      const config = resolveBundlingConfig(scope, id, props);

      super(scope, id, {
        ...props,
        runtime,
        code: Bundling.bundle(scope, {
          ...props.bundling ?? {},
          entry: config.entry,
          runtime,
          architecture: config.architecture,
          depsLockFilePath: config.depsLockFilePath,
          projectRoot: config.projectRoot,
        }),
        handler: config.handler.indexOf('.') !== -1 ? `${config.handler}` : `index.${config.handler}`,
      });
    }
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    // Enable connection reuse for aws-sdk v2, do not set for sdk v3
    if (isSdkV2Runtime(runtime)) {
      if (props.awsSdkConnectionReuse ?? true) {
        this.addEnvironment('AWS_NODEJS_CONNECTION_REUSE_ENABLED', '1', { removeInEdge: true });
      }
    } else {
      if (props.awsSdkConnectionReuse) {
        Annotations.of(scope).addWarningV2('aws-cdk-lib/aws-lambda-nodejs:unusedSdkEvironmentVariable', 'The AWS_NODEJS_CONNECTION_REUSE_ENABLED environment variable does not exist in SDK v3. You have explicitly set `awsSdkConnectionReuse`; please make sure this is intentional.');
        this.addEnvironment('AWS_NODEJS_CONNECTION_REUSE_ENABLED', '1', { removeInEdge: true });
      }
    }
  }
}
