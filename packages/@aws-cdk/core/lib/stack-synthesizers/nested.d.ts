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
export declare class NestedStackSynthesizer extends StackSynthesizer {
    private readonly parentDeployment;
    constructor(parentDeployment: IStackSynthesizer);
    get bootstrapQualifier(): string | undefined;
    addFileAsset(asset: FileAssetSource): FileAssetLocation;
    addDockerImageAsset(asset: DockerImageAssetSource): DockerImageAssetLocation;
    synthesize(session: ISynthesisSession): void;
}
