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
export class BootstraplessSynthesizer extends DefaultStackSynthesizer {
  constructor(props: BootstraplessSynthesizerProps) {
    super({
      deployRoleArn: props.deployRoleArn,
      cloudFormationExecutionRole: props.cloudFormationExecutionRoleArn,
      generateBootstrapVersionRule: false,
    });
  }

  public addFileAsset(_asset: FileAssetSource): FileAssetLocation {
    throw new Error('Cannot add assets to a Stack that uses the BootstraplessSynthesizer');
  }

  public addDockerImageAsset(_asset: DockerImageAssetSource): DockerImageAssetLocation {
    throw new Error('Cannot add assets to a Stack that uses the BootstraplessSynthesizer');
  }

  public synthesize(session: ISynthesisSession): void {
    this.synthesizeStackTemplate(this.boundStack, session);

    // do _not_ treat the template as an asset,
    // because this synthesizer doesn't have a bootstrap bucket to put it in
    this.emitArtifact(session, {
      assumeRoleArn: this.deployRoleArn,
      cloudFormationExecutionRoleArn: this.cloudFormationExecutionRoleArn,
    });
  }
}
