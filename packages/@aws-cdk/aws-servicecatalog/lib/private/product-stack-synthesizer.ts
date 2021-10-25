import * as cdk from '@aws-cdk/core';

/**
 * Deployment environment for an AWS Service Catalog product stack.
 *
 * Interoperates with the StackSynthesizer of the parent stack.
 */
export class ProductStackSynthesizer extends cdk.StackSynthesizer {
  private stack?: cdk.Stack;

  constructor() {
    super();
  }

  public bind(stack: cdk.Stack): void {
    if (this.stack !== undefined) {
      throw new Error('A ProductStackSynthesizer can only be used for one Stack: create a new instance to use with a different Stack');
    }
    this.stack = stack;
  }

  public addFileAsset(_asset: cdk.FileAssetSource): cdk.FileAssetLocation {
    throw new Error('Cannot add file assets to a stack that uses the ProductStackSynthesizer');
  }

  public addDockerImageAsset(_asset: cdk.DockerImageAssetSource): cdk.DockerImageAssetLocation {
    throw new Error('Cannot add docker image assets to a stack that uses the ProductStackSynthesizer');
  }

  public synthesize(session: cdk.ISynthesisSession): void {
    if (this.stack === null && this.stack === undefined) {
      throw new Error('You must call bindStack() first');
    }
    // Synthesize the template, but don't emit as a cloud assembly artifact.
    // It will be registered as an S3 asset of its parent instead.
    this.synthesizeStackTemplate(this.stack!, session);
  }
}
