import { AssetManifestBuilder, DockerImageAssetLocation, DockerImageAssetSource, FileAssetLocation, FileAssetSource, IBoundStackSynthesizer, IReusableStackSynthesizer, ISynthesisSession, Stack, StackSynthesizer } from '@aws-cdk/core';
import { IStagingStack, StagingStack } from './staging-stack';

/**
 * New stack synthesizer properties
 */
export interface StagingStackSynthesizerProps {
  /**
   * Bring a custom staging stack into the app.
   *
   * @default - default staging stack
   */
  readonly stagingStack?: IStagingStack;
  readonly lookupRoleArn?: string;
}

/**
 * New Stack Synthesizer
 */
export class UnboundStagingStackSynthesizer extends StackSynthesizer implements IReusableStackSynthesizer, IBoundStackSynthesizer {
  constructor(private readonly props: StagingStackSynthesizerProps = {}) {
    super();

    // TODO: no tokens
  }

  /**
   * Returns a version of the synthesizer bound to a stack.
   */
  public reusableBind(stack: Stack): IBoundStackSynthesizer {
    return new BoundStagingStackSynthesizer(stack, this.props);
  }

  /**
   * Implemented for legacy purposes; this will never be called.
   */
  public bind(_stack: Stack) {
    throw new Error('This is a legacy API, call reusableBind instead');
  }

  /**
   * Implemented for legacy purposes; this will never be called.
   */
  public synthesize(_session: ISynthesisSession): void {
    throw new Error('This is a legacy API, call reusableBind instead');
  }

  /**
   * Implemented for legacy purposes; this will never be called.
   */
  public addFileAsset(_asset: FileAssetSource): FileAssetLocation {
    throw new Error('This is a legacy API, call reusableBind instead');
  }

  /**
   * Implemented for legacy purposes; this will never be called.
   */
  public addDockerImageAsset(_asset: DockerImageAssetSource): DockerImageAssetLocation {
    throw new Error('This is a legacy API, call reusableBind instead');
  }
}

class BoundStagingStackSynthesizer extends StackSynthesizer implements IBoundStackSynthesizer {
  private stagingStack: IStagingStack;
  private assetManifest = new AssetManifestBuilder();
  private lookupRoleArn: string;

  constructor(stack: Stack, props: StagingStackSynthesizerProps) {
    super();
    super.bind(stack);

    this.lookupRoleArn = props.lookupRoleArn ?? 'INSERT_DEFAULT';

    // TODO: logic should be get or synthesize staging stack here, not create each time
    this.stagingStack = props.stagingStack ?? new StagingStack(stack, 'StagingStack', {
      env: {
        account: stack.account,
        region: stack.region,
      },
    });
  }

  public synthesize(session: ISynthesisSession): void {
    const templateAssetSource = this.synthesizeTemplate(session, this.lookupRoleArn);
    const templateAsset = this.addFileAsset(templateAssetSource);

    const assetManifestId = this.assetManifest.emitManifest(this.boundStack, session, {
      // TODO: handle verison props here
    });

    // eslint-disable-next-line no-console
    console.log(templateAsset, assetManifestId);

    // TODO: finish implementing
    // this.emitArtifact(session, {
    //   assumeRoleExternalId: this.props.deployRoleExternalId,
    //   assumeRoleArn: this._deployRoleArn,
    //   cloudFormationExecutionRoleArn: this._cloudFormationExecutionRoleArn,
    //   stackTemplateAssetObjectUrl: templateAsset.s3ObjectUrlWithPlaceholders,
    //   requiresBootstrapStackVersion: MIN_BOOTSTRAP_STACK_VERSION,
    //   bootstrapStackVersionSsmParameter: this.bootstrapStackVersionSsmParameter,
    //   additionalDependencies: [assetManifestId],
    //   lookupRole: this.useLookupRoleForStackOperations && this.lookupRoleArn ? {
    //     arn: this.lookupRoleArn,
    //     assumeRoleExternalId: this.props.lookupRoleExternalId,
    //     requiresBootstrapStackVersion: MIN_LOOKUP_ROLE_BOOTSTRAP_STACK_VERSION,
    //     bootstrapStackVersionSsmParameter: this.bootstrapStackVersionSsmParameter,
    //   } : undefined,
    // });
  }

  /**
   * // TODO
   */
  public addFileAsset(asset: FileAssetSource): FileAssetLocation {
    const location = this.assetManifest.defaultAddFileAsset(this.boundStack, asset, {
      bucketName: this.stagingStack.stagingBucket.bucketName,
      // TODO: more props
    });
    return this.cloudFormationLocationFromFileAsset(location);
  }

  /**
   * // TODO
   */
  public addDockerImageAsset(asset: DockerImageAssetSource): DockerImageAssetLocation {
    const repo = this.stagingStack.getCreateRepository(asset);

    const location = this.assetManifest.defaultAddDockerImageAsset(this.boundStack, asset, {
      repositoryName: repo.repositoryName,
      // TODO: more props
    });
    return this.cloudFormationLocationFromDockerImageAsset(location);
  }
}
