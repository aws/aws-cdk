/* eslint-disable prettier/prettier, @stylistic/max-len */
import * as path from "path";
import * as lambda from "../../../aws-lambda";
import { Construct } from "constructs";

export class TestFunction extends lambda.Function {
  public constructor(scope: Construct, id: string, props?: lambda.FunctionOptions) {
    super(scope, id, {
      ...props,
      code: lambda.Code.fromAsset(path.join(__dirname, 'my-handler')),
      handler: "index.handler",
      runtime: lambda.determineLatestNodeRuntime(scope)
    });
    this.node.addMetadata('aws:cdk:is-custom-resource-handler-runtime-family', this.runtime.family);
  }
}