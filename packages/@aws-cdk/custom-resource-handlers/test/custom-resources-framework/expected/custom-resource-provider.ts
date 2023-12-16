/* eslint-disable prettier/prettier,max-len */
import * as path from "path";
import { Construct } from "constructs";
import { Stack, CustomResourceProviderBase, CustomResourceProviderOptions } from "../../../core";

export class TestProvider extends CustomResourceProviderBase {
  /**
   * Returns a stack-level singleton ARN (service token) for the custom resource provider.
   */
  public static getOrCreate(scope: Construct, uniqueid: string, props?: CustomResourceProviderOptions): string {
    return this.getOrCreateProvider(scope, uniqueid, props).serviceToken;
  }

  /**
   * Returns a stack-level singleton for the custom resource provider.
   */
  public static getOrCreateProvider(scope: Construct, uniqueid: string, props?: CustomResourceProviderOptions): TestProvider {
    const id = `${uniqueid}CustomResourceProvider`;
    const stack = Stack.of(scope);
    const existing = stack.node.tryFindChild(id) as TestProvider;
    return existing ?? new TestProvider(stack, id, props);
  }

  public constructor(scope: Construct, id: string, props?: CustomResourceProviderOptions) {
    super(scope, id, {
      ...props,
      "codeDirectory": path.join(__dirname, 'my-handler'),
      "runtimeName": "nodejs18.x"
    });
  }
}