import { DockerImageAssetLocation, DockerImageAssetSource, FileAssetLocation, FileAssetSource } from '../assets';
import { ISynthesisSession } from '../construct-compat';
import { Stack } from '../stack';
import { IStackSynthesizer } from './types';

/**
 * Deployment environment for a nested stack
 *
 * Interoperates with the StackSynthesizer of the parent stack.
 */
export class NestedStackSynthesizer implements IStackSynthesizer {
  constructor(private readonly parentDeployment: IStackSynthesizer) {
  }

  public bind(_stack: Stack): void {
    // Nothing to do
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

  public synthesizeStackArtifacts(_session: ISynthesisSession): void {
    // Do not emit Nested Stack as a cloud assembly artifact.
    // It will be registered as an S3 asset of its parent instead.
  }
}
