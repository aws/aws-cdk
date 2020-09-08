import { DockerImageAssetLocation, DockerImageAssetSource, FileAssetLocation, FileAssetSource } from '../assets';
import { ISynthesisSession } from '../construct-compat';
import { Stack } from '../stack';
import { assertBound } from './_shared';
import { IStackSynthesizer } from './types';

/**
 * Deployment environment for a nested stack
 *
 * Interoperates with the StackSynthesizer of the parent stack.
 */
export class NestedStackSynthesizer implements IStackSynthesizer {
  private stack?: Stack;

  constructor(private readonly parentDeployment: IStackSynthesizer) {
  }

  public bind(stack: Stack): void {
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
    this.stack._synthesizeTemplate(session);
  }
}
