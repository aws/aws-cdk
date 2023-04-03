import { DefaultStackSynthesizer } from './default-synthesizer';
import { ISynthesisSession } from './types';
import { DockerImageAssetLocation, DockerImageAssetSource, FileAssetLocation, FileAssetSource } from '../assets';
/**
 * Construction properties of `BootstraplessSynthesizer`.
 */
export interface BootstraplessSynthesizerProps {
    /**
     * The deploy Role ARN to use.
     *
     * @default - No deploy role (use CLI credentials)
     *
     */
    readonly deployRoleArn?: string;
    /**
     * The CFN execution Role ARN to use.
     *
     * @default - No CloudFormation role (use CLI credentials)
     */
    readonly cloudFormationExecutionRoleArn?: string;
}
/**
 * Synthesizer that reuses bootstrap roles from a different region
 *
 * A special synthesizer that behaves similarly to `DefaultStackSynthesizer`,
 * but doesn't require bootstrapping the environment it operates in. Instead,
 * it will re-use the Roles that were created for a different region (which
 * is possible because IAM is a global service).
 *
 * However, it will not assume asset buckets or repositories have been created,
 * and therefore does not support assets.
 *
 * The name is poorly chosen -- it does still require bootstrapping, it just
 * does not support assets.
 *
 * Used by the CodePipeline construct for the support stacks needed for
 * cross-region replication S3 buckets. App builders do not need to use this
 * synthesizer directly.
 */
export declare class BootstraplessSynthesizer extends DefaultStackSynthesizer {
    constructor(props: BootstraplessSynthesizerProps);
    addFileAsset(_asset: FileAssetSource): FileAssetLocation;
    addDockerImageAsset(_asset: DockerImageAssetSource): DockerImageAssetLocation;
    synthesize(session: ISynthesisSession): void;
}
