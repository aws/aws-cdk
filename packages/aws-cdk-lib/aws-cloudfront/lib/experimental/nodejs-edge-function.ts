import { Construct } from 'constructs';
import { EdgeFunction } from './edge-function';
import * as lambda from '../../../aws-lambda';
import { NodejsFunctionProps } from '../../../aws-lambda-nodejs';
import { prepareBundling } from '../../../aws-lambda-nodejs/lib/bundling-preparation';
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

    const bundlingConfig = prepareBundling(scope, id, props, 'NodejsEdgeFunction');

    super(scope, id, {
      ...props,
      runtime: bundlingConfig.runtime,
      code: bundlingConfig.code,
      handler: bundlingConfig.handler,
    });
  }
}

