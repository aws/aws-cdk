/* eslint-disable prettier/prettier,max-len */
import * as path from "path";
import { Construct } from "constructs";
import * as lambda from "../../../aws-lambda";

export class TestFunction extends lambda.Function {
  public constructor(scope: Construct, id: string, props?: lambda.FunctionOptions) {
    super(scope, id, {
      ...props,
      "code": lambda.Code.fromAsset(path.join(__dirname, 'my-handler')),
      "handler": "index.handler",
      "runtime": lambda.Runtime.NODEJS_18_X
    });
  }
}