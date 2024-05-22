/* eslint-disable prettier/prettier,max-len */
import * as path from "path";
import { Construct } from "constructs";
import * as lambda from "../../../aws-lambda";

export class EvalNodejsSingletonFunction extends lambda.SingletonFunction {
  public constructor(scope: Construct, id: string, props: EvalNodejsSingletonFunctionProps) {
    super(scope, id, {
      ...props,
      "code": lambda.Code.fromAsset(path.join(__dirname, 'my-handler')),
      "handler": "index.handler",
      "runtime": props.runtime ?? lambda.Runtime.NODEJS_18_X
    });
  }
}

/**
 * Initialization properties for EvalNodejsSingletonFunction
 */
export interface EvalNodejsSingletonFunctionProps extends lambda.FunctionOptions {
  /**
   * A unique identifier to identify this Lambda.
   *
   * The identifier should be unique across all custom resource providers.
   * We recommend generating a UUID per provider.
   */
  readonly uuid: string;

  /**
   * A descriptive name for the purpose of this Lambda.
   *
   * If the Lambda does not have a physical name, this string will be
   * reflected in its generated name. The combination of lambdaPurpose
   * and uuid must be unique.
   *
   * @default SingletonLambda
   */
  readonly lambdaPurpose?: string;

  /**
   * The runtime that this Lambda will use.
   *
   * @default lambda.Runtime.NODEJS_18_X
   */
  readonly runtime?: lambda.Runtime;
}