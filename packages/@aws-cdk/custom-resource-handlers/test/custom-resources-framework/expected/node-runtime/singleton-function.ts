/* eslint-disable prettier/prettier,max-len */
import * as path from "path";
import { Construct } from "constructs";
import * as lambda from "../../../aws-lambda";

export class TestSingletonFunction extends lambda.SingletonFunction {
  public constructor(scope: Construct, id: string, props: TestSingletonFunctionProps) {
    super(scope, id, {
      ...props,
      "code": lambda.Code.fromAsset(path.join(__dirname, 'my-handler')),
      "handler": "index.handler",
      "runtime": lambda.determineLatestNodeRuntime(scope)
    });
    this.addMetadata('aws:cdk:is-custom-resource-handler-singleton', true);
    this.addMetadata('aws:cdk:is-custom-resource-handler-runtime-family', this.runtime.family);
    if (props?.logGroup) { this.logGroup.node.addMetadata('aws:cdk:is-custom-resource-handler-logGroup', true) };
    if (props?.logRetention) { ((this as any).lambdaFunction as lambda.Function)._logRetention?.node.addMetadata('aws:cdk:is-custom-resource-handler-logRetention', true) };
  }
}

/**
 * Initialization properties for TestSingletonFunction
 */
export interface TestSingletonFunctionProps extends lambda.FunctionOptions {
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
}