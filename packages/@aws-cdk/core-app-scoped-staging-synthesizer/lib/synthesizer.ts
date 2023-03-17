import {
  App,
  Arn,
  AssetManifestBuilder,
  DockerImageAssetLocation,
  DockerImageAssetSource,
  Environment,
  FileAssetLocation,
  FileAssetSource,
  IBoundStackSynthesizer,
  IReusableStackSynthesizer,
  ISynthesisSession,
  Stack,
  StackSynthesizer,
  Stage,
  Token,
} from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { IDefaultStagingStack as IStagingStack, DefaultStagingStack } from './default-staging-stack';

export class BootstrapRole {
  // public abstract arn(stack: Stack) {
  //   // stack.formatArn
  // }
  public static default() {
    return new BootstrapRole('default');
  }

  public static fromRoleArn(arn: string) {
    return new BootstrapRole(arn);
  }

  public static fromRoleName(name: string) {
    // wont work
    const arn = Arn.format({
      resource: 'role',
      service: 'iam',
      resourceName: name,
    });
    return new BootstrapRole(arn);
  }

  private constructor(public readonly roleArn: string) {}

  public get roleName() {
    return this.roleArn.split('/')[1];
  }
}

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
  readonly lookupRole?: BootstrapRole;

  readonly appId: string;
}

/**
 * New Stack Synthesizer
 */
export class AppScopedStagingSynthesizer extends StackSynthesizer implements IReusableStackSynthesizer {
  constructor(private readonly props: StagingStackSynthesizerProps) {
    super();

    for (const key in props) {
      if (props.hasOwnProperty(key)) {
        validateNoToken(key as keyof StagingStackSynthesizerProps);
      }
    }

    function validateNoToken<A extends keyof StagingStackSynthesizerProps>(key: A) {
      const prop = props[key];
      if (typeof prop === 'string' && Token.isUnresolved(prop)) {
        throw new Error(`AppScopedStagingSynthesizer property '${key}' cannot contain tokens; only the following placeholder strings are allowed: ` + [
          '${Qualifier}',
          cxapi.EnvironmentPlaceholders.CURRENT_REGION,
          cxapi.EnvironmentPlaceholders.CURRENT_ACCOUNT,
          cxapi.EnvironmentPlaceholders.CURRENT_PARTITION,
        ].join(', '));
      }
    }
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
  private readonly lookupRoleArn: string;
  private readonly appId: string;

  constructor(private readonly stack: Stack, props: StagingStackSynthesizerProps) {
    super();
    super.bind(stack);

    this.lookupRoleArn = props.lookupRole ? props.lookupRole.roleArn : BoundStagingStackSynthesizer.DEFAULT_LOOKUP_ROLE_ARN;
    this.appId = props.appId;

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
    const stackName = `StagingStack${this.appId}`;
    const stackId = 'StagingStack';
    // TODO: this needs to be an IStagingStack
    const stagingStack = app.node.tryFindChild(stackId) as DefaultStagingStack ?? new DefaultStagingStack(app, stackId, {
      env,
      stackName,
      appId: this.appId,
    });
    this.stack.addDependency(stagingStack, 'reason');

    return stagingStack;
  }

  public synthesize(session: ISynthesisSession): void {
    const templateAssetSource = this.synthesizeTemplate(session, this.lookupRoleArn);
    const templateAsset = this.addFileAsset(templateAssetSource);

    const assetManifestId = this.assetManifest.emitManifest(this.boundStack, session);

    this.emitArtifact(session, {
      additionalDependencies: [assetManifestId],
      stackTemplateAssetObjectUrl: templateAsset.s3ObjectUrlWithPlaceholders,
    });
  }

  /**
   * Add a file asset to the manifest.
   */
  public addFileAsset(asset: FileAssetSource): FileAssetLocation {
    const { bucketName, assumeRoleArn } = this.stagingStack.addFile(asset);
    const location = this.assetManifest.defaultAddFileAsset(this.boundStack, asset, {
      bucketName,
      role: { assumeRoleArn },
    });
    return this.cloudFormationLocationFromFileAsset(location);
  }

  /**
   * Add a docker image asset to the manifest.
   */
  public addDockerImageAsset(asset: DockerImageAssetSource): DockerImageAssetLocation {
    const { repoName, assumeRoleArn } = this.stagingStack.addDockerImage(asset);

    const location = this.assetManifest.defaultAddDockerImageAsset(this.boundStack, asset, {
      repositoryName: repoName,
      role: { assumeRoleArn },
      // TODO: more props
    });
    return this.cloudFormationLocationFromDockerImageAsset(location);
  }
}
