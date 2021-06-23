import { DockerImageAssetLocation, DockerImageAssetSource, FileAssetLocation, FileAssetSource } from '../assets';
import { ISynthesisSession } from '../construct-compat';
import { Stack } from '../stack';
import { assertBound } from './_shared';
import { StackSynthesizer } from './stack-synthesizer';
import { IStackSynthesizer } from './types';

/**
 * Deployment environment for a nested stack
 *
 * Interoperates with the StackSynthesizer of the parent stack.
 */
export class NestedStackSynthesizer extends StackSynthesizer {
  private stack?: Stack;

  constructor(private readonly parentDeployment: IStackSynthesizer) {
    super();
  }

  public bind(stack: Stack): void {
    if (this.stack !== undefined) {
      throw new Error('A StackSynthesizer can only be used for one Stack: create a new instance to use with a different Stack');
    }
    this.stack = stack;
  }

  public addFileAsset(asset: FileAssetSource): FileAssetLocation {
    // Forward to parent deployment. By the magic of cross-stack references any parameter
    // returned and used will magically be forwarded to the nested stack.
    return this.parentDeployment.addFileAsset(asset);
  }

  public addDockerImageAsset(asset: DockerImageAssetSource): DockerImageAssetLocation {
    // Forward to parent deployment. By the magic of cross-stack references any parameter
    // returned and used will magically be forwarded to the nested stack.
    return this.parentDeployment.addDockerImageAsset(asset);
  }

  public synthesize(session: ISynthesisSession): void {
    assertBound(this.stack);
    // Synthesize the template, but don't emit as a cloud assembly artifact.
    // It will be registered as an S3 asset of its parent instead.
    this.synthesizeStackTemplate(this.stack, session);
  }
}
