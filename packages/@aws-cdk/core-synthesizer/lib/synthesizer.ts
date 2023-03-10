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
import { IStagingStack, DefaultStagingStack } from './staging-stack';

export class BootstrapRole {
  public static default() {
    return new BootstrapRole('default');
  }

  public static fromRoleArn(arn: string) {
    return new BootstrapRole(arn);
  }

  public static fromRoleName(name: string) {
    const arn = Arn.format({
      resource: 'role',
      service: 'iam',
      resourceName: name,
    });
    return new BootstrapRole(arn);
  }

  private constructor(public readonly roleArn: string) {}
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
  readonly lookupRoleArn?: BootstrapRole;
}

/**
 * New Stack Synthesizer
 */
export class AppScopedStagingSynthesizer extends StackSynthesizer implements IReusableStackSynthesizer {
  constructor(private readonly props: StagingStackSynthesizerProps = {}) {
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
    return app.node.tryFindChild(stackName) as IStagingStack ?? new DefaultStagingStack(app, stackName, {
      env,
      stackName,
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
      // TODO: uhh is this right?
      additionalDependencies: [assetManifestId/*, this.stagingStack.node.id*/],
      stackTemplateAssetObjectUrl: templateAsset.s3ObjectUrlWithPlaceholders,
    });
  }

  /**
   * // TODO
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
   * // TODO
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
