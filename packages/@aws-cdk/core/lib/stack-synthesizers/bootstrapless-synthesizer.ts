import { DockerImageAssetLocation, DockerImageAssetSource, FileAssetLocation, FileAssetSource } from '../assets';
import { ISynthesisSession } from '../construct-compat';
import { addStackArtifactToAssembly, assertBound } from './_shared';
import { DefaultStackSynthesizer } from './default-synthesizer';

/**
 * Construction properties of {@link BootstraplessSynthesizer}.
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
 * A special synthesizer that behaves similarly to DefaultStackSynthesizer,
 * but doesn't require bootstrapping the environment it operates in.
 * Because of that, stacks using it cannot have assets inside of them.
 * Used by the CodePipeline construct for the support stacks needed for
 * cross-region replication S3 buckets.
 */
export class BootstraplessSynthesizer extends DefaultStackSynthesizer {
  constructor(props: BootstraplessSynthesizerProps) {
    super({
      deployRoleArn: props.deployRoleArn,
      cloudFormationExecutionRole: props.cloudFormationExecutionRoleArn,
    });
  }

  public addFileAsset(_asset: FileAssetSource): FileAssetLocation {
    throw new Error('Cannot add assets to a Stack that uses the BootstraplessSynthesizer');
  }

  public addDockerImageAsset(_asset: DockerImageAssetSource): DockerImageAssetLocation {
    throw new Error('Cannot add assets to a Stack that uses the BootstraplessSynthesizer');
  }

  public synthesizeStackArtifacts(session: ISynthesisSession): void {
    assertBound(this.stack);

    // do _not_ treat the template as an asset,
    // because this synthesizer doesn't have a bootstrap bucket to put it in
    addStackArtifactToAssembly(session, this.stack, {
      assumeRoleArn: this.deployRoleArn,
      cloudFormationExecutionRoleArn: this.cloudFormationExecutionRoleArn,
      requiresBootstrapStackVersion: 1,
    }, []);
  }
}
