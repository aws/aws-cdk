import * as cdk from '@aws-cdk/core';

/**
 * Deployment environment for an AWS Service Catalog product stack.
 *
 * Interoperates with the StackSynthesizer of the parent stack.
 */
export class ProductStackSynthesizer extends cdk.StackSynthesizer {
  private stack?: cdk.Stack;

  public bind(stack: cdk.Stack): void {
    if (this.stack !== undefined) {
      throw new Error('A Stack Synthesizer can only be bound once, create a new instance to use with a different Stack');
    }
    this.stack = stack;
  }

  public addFileAsset(_asset: cdk.FileAssetSource): cdk.FileAssetLocation {
    throw new Error('Service Catalog Product Stacks cannot use Assets');
  }

  public addDockerImageAsset(_asset: cdk.DockerImageAssetSource): cdk.DockerImageAssetLocation {
    throw new Error('Service Catalog Product Stacks cannot use Assets');
  }

  public synthesize(session: cdk.ISynthesisSession): void {
    if (!this.stack) {
      throw new Error('You must call bindStack() first');
    }
    // Synthesize the template, but don't emit as a cloud assembly artifact.
    // It will be registered as an S3 asset of its parent instead.
    this.synthesizeTemplate(session);
  }
}
