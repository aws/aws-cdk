import { App, AssetManifestBuilder, DockerImageAssetLocation, DockerImageAssetSource, Environment, FileAssetLocation, FileAssetSource, IBoundStackSynthesizer, IReusableStackSynthesizer, ISynthesisSession, Stack, StackSynthesizer, Stage } from '@aws-cdk/core';
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

  /**
   * Custom lookup role arn
   *
   * @default - default role
   */
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
  /**
   * Default lookup role ARN for missing values.
   */
  public static readonly DEFAULT_LOOKUP_ROLE_ARN = 'arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-${Qualifier}-lookup-role-${AWS::AccountId}-${AWS::Region}';

  private stagingStack: IStagingStack;
  private assetManifest = new AssetManifestBuilder();
  private lookupRoleArn: string;

  constructor(stack: Stack, props: StagingStackSynthesizerProps = {}) {
    super();
    super.bind(stack);

    this.lookupRoleArn = props.lookupRoleArn ?? BoundStagingStackSynthesizer.DEFAULT_LOOKUP_ROLE_ARN;

    const app = App.of(stack);
    if (!app) {
      throw new Error(`stack ${stack.stackName} must be part of an App`);
    }
    this.stagingStack = props.stagingStack ?? this.getCreateStagingStack(app, {
      account: stack.account,
      region: stack.region,
    });
  }

  private getCreateStagingStack(app: Stage, env: Environment): IStagingStack {
    // TODO: env could be tokens
    const stackName = `StagingStack${app.stageName}`;
    return app.node.tryFindChild(stackName) as IStagingStack ?? new StagingStack(app, stackName, {
      env,
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

    this.emitArtifact(session, {
      additionalDependencies: [assetManifestId],
    });
  }

  /**
   * // TODO
   */
  public addFileAsset(asset: FileAssetSource): FileAssetLocation {
    const location = this.assetManifest.defaultAddFileAsset(this.boundStack, asset, {
      bucketName: this.stagingStack.stagingBucketName,
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
