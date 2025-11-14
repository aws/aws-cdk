import * as path from 'path';
import { Construct } from 'constructs';
import { EdgeFunction } from './edge-function';
import * as lambda from '../../../aws-lambda';
import { Architecture } from '../../../aws-lambda';
import { NodejsFunctionProps } from '../../../aws-lambda-nodejs';
import { Bundling } from '../../../aws-lambda-nodejs/lib/bundling';
import { getRuntime, findEntry, findLockFile } from '../../../aws-lambda-nodejs/lib/function-helpers';
import { ValidationError } from '../../../core';

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

