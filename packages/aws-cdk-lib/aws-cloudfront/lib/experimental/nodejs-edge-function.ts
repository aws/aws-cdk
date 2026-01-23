import { Construct } from 'constructs';
import { EdgeFunction } from './edge-function';
import { NodejsFunctionProps } from '../../../aws-lambda-nodejs';
import { Bundling } from '../../../aws-lambda-nodejs/lib/bundling';
import { getRuntime, resolveBundlingConfig, validateNodejsRuntime } from '../../../aws-lambda-nodejs/lib/function-helpers';
import { ValidationError } from '../../../core';
import { addConstructMetadata } from '../../../core/lib/metadata-resource';

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
    validateNodejsRuntime(scope, props.runtime);

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
  }
}
