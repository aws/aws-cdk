import {
  App,
  Arn,
  AssetManifestBuilder,
  DockerImageAssetLocation,
  DockerImageAssetSource,
  FileAssetLocation,
  FileAssetSource,
  IBoundStackSynthesizer,
  IReusableStackSynthesizer,
  ISynthesisSession,
  Stack,
  StackSynthesizer,
  Token,
} from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { IStagingStack as IStagingStack, DefaultStagingStack } from './default-staging-stack';

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

export interface BootstrapRoles {
  readonly cloudFormationExecutionRole?: BootstrapRole;
  readonly deploymentActionRole?: BootstrapRole;
  readonly lookupRole?: BootstrapRole;
}

export interface StagingRoles {
  readonly fileAssetPublishingRole?: BootstrapRole;
  readonly dockerAssetPublishingRole?: BootstrapRole;
}

/**
 * Properties for stackPerEnv static method
 */
export interface StackPerEnvProps {
  /**
   * App identifier that is unique to the app and used in the resource names of the Staging Stack.
   */
  readonly appId: string;

  /**
   * Custom roles to bring into the staging stack.
   *
   * @default - no custom roles
   */
  readonly stagingRoles?: StagingRoles;

  /**
   * Custom bootstrap roles that have permissions to interact with CloudFormation
   * on your behalf.
   *
   * @default - no custom roles
   */
  readonly bootstrapRoles?: BootstrapRoles;
}

/**
 * Staging Stack Factory interface.
 *
 * The function included in this class will be called by the synthesizer
 * to create or reference an IStagingStack that has the necessary
 * staging resources for the Stack.
 */
export interface IStagingStackFactory {
  stagingStackFactory(boundStack: Stack): IStagingStack;
}

/**
 * Properties for customFactory static method
 */
export interface CustomFactoryProps extends AppStagingSynthesizerProps {
  /**
   * Include rules that create a new Staging Stack per environment.
   *
   * @default true
   */
  oncePerEnv: boolean;
}

/**
 * Internal properties for AppStagingSynthesizer
 */
interface AppStagingSynthesizerProps {
  /**
   * A factory method that creates an IStagingStack when given the stack the
   * synthesizer is binding.
   */
  readonly stagingStackFactory: IStagingStackFactory;

  /**
   * Custom bootstrap roles that have permissions to interact with CloudFormation
   * on your behalf.
   *
   * @default - no custom roles
   */
  readonly bootstrapRoles?: BootstrapRoles;
}

/**
 * App Staging Synthesizer
 */
export class AppStagingSynthesizer extends StackSynthesizer implements IReusableStackSynthesizer {
  public static stackPerEnv(props: StackPerEnvProps) {
    for (const key in props) {
      if (props.hasOwnProperty(key)) {
        validateNoToken(key as keyof StackPerEnvProps);
      }
    }

    function validateNoToken<A extends keyof StackPerEnvProps>(key: A) {
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

    return new AppStagingSynthesizer({
      bootstrapRoles: props.bootstrapRoles,
      stagingStackFactory: {
        stagingStackFactory(boundStack: Stack) {
          const app = App.of(boundStack);
          if (!App.isApp(app)) {
            throw new Error(`Stack ${boundStack.stackName} must be part of an App`);
          }

          let stackId = 'StagingStack';
          if (!Token.isUnresolved(boundStack.account) && !Token.isUnresolved(boundStack.region)) {
            stackId = stackId + boundStack.account + boundStack.region;
          }

          const stackName = `StagingStack${props.appId}`;
          const stagingStack = app.node.tryFindChild(stackId) as IStagingStack ?? new DefaultStagingStack(app, stackId, {
            appId: props.appId,
            env: {
              account: boundStack.account,
              region: boundStack.region,
            },
            stackName,
            fileAssetPublishingRole: props.stagingRoles?.fileAssetPublishingRole,
            dockerAssetPublishingRole: props.stagingRoles?.dockerAssetPublishingRole,
          });
          boundStack.addDependency(stagingStack.dependencyStack, 'stack depends on the staging stack for staging resources');

          return stagingStack;
        },
      },
    });
  }

  public static customFactory(props: CustomFactoryProps) {
    return new AppStagingSynthesizer(props);
  }

  private constructor(private readonly props: AppStagingSynthesizerProps) {
    super();
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
  private readonly lookupRoleArn?: string;
  private readonly cloudFormationExecutionRoleArn?: string;
  private readonly deploymentActionRoleArn?: string;

  constructor(stack: Stack, props: AppStagingSynthesizerProps) {
    super();
    super.bind(stack);

    this.lookupRoleArn = props.bootstrapRoles?.lookupRole?.roleArn;
    this.cloudFormationExecutionRoleArn = props.bootstrapRoles?.cloudFormationExecutionRole?.roleArn;
    this.deploymentActionRoleArn = props.bootstrapRoles?.deploymentActionRole?.roleArn;

    this.stagingStack = props.stagingStackFactory.stagingStackFactory(stack);
  }

  public synthesize(session: ISynthesisSession): void {
    const templateAssetSource = this.synthesizeTemplate(session, this.lookupRoleArn);
    const templateAsset = this.addFileAsset(templateAssetSource);

    const assetManifestId = this.assetManifest.emitManifest(this.boundStack, session);

    this.emitArtifact(session, {
      assumeRoleArn: this.deploymentActionRoleArn,
      additionalDependencies: [assetManifestId],
      stackTemplateAssetObjectUrl: templateAsset.s3ObjectUrlWithPlaceholders,
      cloudFormationExecutionRoleArn: this.cloudFormationExecutionRoleArn,
      lookupRole: this.lookupRoleArn ? {
        arn: this.lookupRoleArn,
      }: undefined,
    });
  }

  /**
   * Add a file asset to the manifest.
   */
  public addFileAsset(asset: FileAssetSource): FileAssetLocation {
    const { bucketName, assumeRoleArn } = this.stagingStack.addFile(asset);
    const location = this.assetManifest.defaultAddFileAsset(this.boundStack, asset, {
      bucketName: bucketName,
      // bucketPrefix: bucketPrefix,
      role: {
        assumeRoleArn,
      },
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
