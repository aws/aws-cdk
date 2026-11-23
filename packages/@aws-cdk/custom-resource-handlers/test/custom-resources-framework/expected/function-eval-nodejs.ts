/* eslint-disable prettier/prettier, @stylistic/max-len */
import * as path from "path";
import { Construct } from "constructs";
import * as lambda from "../../../aws-lambda";

export class EvalNodejsFunction extends lambda.Function {
  public constructor(scope: Construct, id: string, props: EvalNodejsFunctionProps) {
    super(scope, id, {
      ...props,
      code: lambda.Code.fromAsset(path.join(__dirname, 'my-handler')),
      handler: "index.handler",
      runtime: (props.runtime ? props.runtime : lambda.determineLatestNodeRuntime(scope))
    });
    this.node.addMetadata('aws:cdk:is-custom-resource-handler-runtime-family', this.runtime.family);
  }
}

/**
 * Initialization properties for EvalNodejsFunction
 */
export interface EvalNodejsFunctionProps extends lambda.FunctionOptions {
  /**
   * The runtime that this Lambda will use.
   *
   * @default - the latest Lambda node runtime available in your region.
   */
  readonly runtime?: lambda.Runtime;
}