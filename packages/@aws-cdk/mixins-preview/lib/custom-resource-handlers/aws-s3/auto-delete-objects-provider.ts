import * as path from 'path';
import type { Construct } from 'constructs';
import type { CustomResourceProviderOptions } from 'aws-cdk-lib/core';
import { Stack, CustomResourceProviderBase, determineLatestNodeRuntimeName } from 'aws-cdk-lib/core';

export class AutoDeleteObjectsProvider extends CustomResourceProviderBase {
  public static getOrCreate(scope: Construct, uniqueid: string, props?: CustomResourceProviderOptions): string {
    return this.getOrCreateProvider(scope, uniqueid, props).serviceToken;
  }

  public static getOrCreateProvider(scope: Construct, uniqueid: string, props?: CustomResourceProviderOptions): AutoDeleteObjectsProvider {
    const id = `${uniqueid}CustomResourceProvider`;
    const stack = Stack.of(scope);
    const existing = stack.node.tryFindChild(id) as AutoDeleteObjectsProvider;
    return existing ?? new AutoDeleteObjectsProvider(stack, id, props);
  }

  private constructor(scope: Construct, id: string, props?: CustomResourceProviderOptions) {
    super(scope, id, {
      ...props,
      codeDirectory: path.join(__dirname, '..', 'dist', 'aws-s3', 'auto-delete-objects-handler'),
      runtimeName: determineLatestNodeRuntimeName(scope),
    });
    this.node.addMetadata('aws:cdk:is-custom-resource-handler-customResourceProvider', true);
  }
}
