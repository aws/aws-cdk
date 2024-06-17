/* eslint-disable prettier/prettier,max-len */
import * as path from "path";
import { Construct } from "constructs";
import { Stack, CustomResourceProviderBase, CustomResourceProviderOptions, determineLatestNodeRuntimeName } from "../../../core";

export class TestProvider extends CustomResourceProviderBase {
  /**
   * Returns a stack-level singleton ARN (service token) for the custom resource provider.
   */
  public static getOrCreate(scope: Construct, uniqueid: string, props?: CustomResourceProviderOptions): string {
    return this.getOrCreateProvider(scope, uniqueid, props).serviceToken;
  }

  /**
   * Returns the stack-level singleton provider or undefined
   */
  public static getProvider(scope: Construct, uniqueid: string): TestProvider {
    const id = `${uniqueid}CustomResourceProvider`;
    const stack = Stack.of(scope);
    return stack.node.tryFindChild(id) as TestProvider;
  }

  /**
   * Set the log group to be used by the singleton provider
   */
  public static useLogGroup(scope: Construct, uniqueid: string, logGroupName: string): void {
    const stack = Stack.of(scope);
    const key = `${uniqueid}CustomResourceLogGroup`;
    stack.node.addMetadata(key, logGroupName);
    const existing = this.getProvider(scope, uniqueid);
    if (existing) existing.configureLambdaLogGroup(logGroupName);
  }

  /**
   * Returns a stack-level singleton for the custom resource provider.
   */
  public static getOrCreateProvider(scope: Construct, uniqueid: string, props?: CustomResourceProviderOptions): TestProvider {
    const id = `${uniqueid}CustomResourceProvider`;
    const stack = Stack.of(scope);
    const provider = this.getProvider(scope, uniqueid) ?? new TestProvider(stack, id, props);
    const key = `${uniqueid}CustomResourceLogGroup`;
    const logGroupMetadata = stack.node.metadata.find(m => m.type === key);
    if (logGroupMetadata?.data) provider.configureLambdaLogGroup(logGroupMetadata.data);
    return provider;
  }

  public constructor(scope: Construct, id: string, props?: CustomResourceProviderOptions) {
    super(scope, id, {
      ...props,
      "codeDirectory": path.join(__dirname, 'my-handler'),
      "runtimeName": determineLatestNodeRuntimeName(scope)
    });
  }
}