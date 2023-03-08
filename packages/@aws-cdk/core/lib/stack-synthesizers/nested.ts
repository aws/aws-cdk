import { StackSynthesizer } from './stack-synthesizer';
import { IStackSynthesizer, ISynthesisSession } from './types';
import { DockerImageAssetLocation, DockerImageAssetSource, FileAssetLocation, FileAssetSource } from '../assets';

/**
 * Synthesizer for a nested stack
 *
 * Forwards all calls to the parent stack's synthesizer.
 *
 * This synthesizer is automatically used for `NestedStack` constructs.
 * App builder do not need to use this class directly.
 */
export class NestedStackSynthesizer extends StackSynthesizer {
  constructor(private readonly parentDeployment: IStackSynthesizer) {
    super();
  }

  public get bootstrapQualifier(): string | undefined {
    return this.parentDeployment.bootstrapQualifier;
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
    // Synthesize the template, but don't emit as a cloud assembly artifact.
    // It will be registered as an S3 asset of its parent instead.
    this.synthesizeTemplate(session);
  }
}
