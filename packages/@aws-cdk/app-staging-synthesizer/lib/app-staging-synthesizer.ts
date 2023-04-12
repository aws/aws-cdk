import {
  App,
  AssetManifestBuilder,
  BOOTSTRAP_QUALIFIER_CONTEXT,
  DockerImageAssetLocation,
  DockerImageAssetSource,
  FileAssetLocation,
  FileAssetSource,
  IBoundStackSynthesizer as IBoundAppStagingSynthesizer,
  IReusableStackSynthesizer,
  ISynthesisSession,
  Stack,
  StackSynthesizer,
  Token,
} from 'aws-cdk-lib';
import { StringSpecializer, translateCfnTokenToAssetToken } from 'aws-cdk-lib/core/lib/helpers-internal';
import * as cxapi from 'aws-cdk-lib/cx-api';
import { BootstrapRole, BootstrapRoles, StagingRoles } from './bootstrap-roles';
import { IStagingStack, DefaultStagingStack } from './default-staging-stack';
import * as s3 from 'aws-cdk-lib/aws-s3';

/**
 * @internal
 */
export const EPHEMERAL_PREFIX = 'eph-';

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

  /**
   * Qualifier to disambiguate multiple environments in the same account
   *
   * @default - Value of context key '@aws-cdk/core:bootstrapQualifier' if set, otherwise `DEFAULT_QUALIFIER`
   */
  readonly qualifier?: string;

  readonly bucketPrefix?: string;

  /**
   * Retain all assets in the s3 bucket, even the ones that have been
   * marked ephemeral.
   *
   * @default false
   */
  readonly retainEphemeralFileAssets?: boolean;

  /**
   * Specify a custom lifecycle rule for ephemeral file assets. If you
   * specify this property, you must set `prefix: 'eph-'` as part of the rule.
   * This is the only way to identify ephemeral assets.
   *
   * @default - ephemeral assets will be deleted after 10 days
   */
  readonly ephemeralFileAssetLifecycleRule?: s3.LifecycleRule;
}

/**
 * Staging Stack Factory interface.
 *
 * The function included in this class will be called by the synthesizer
 * to create or reference an IStagingStack that has the necessary
 * staging resources for the Stack.
 */
export interface IStagingStackFactory {
  /**
   * Factory method to be called when binding stack to synthesizer.
   * This method produces (either by creating or referencing an existing
   * stack) the StagingStack that holds staging resources
   * necessary for the bound stack.
   *
   * @param boundStack - stack to bind the synthesizer to
   */
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
  // oncePerEnv: boolean;
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

  /**
   * Qualifier to disambiguate multiple environments in the same account
   *
   * @default - Value of context key '@aws-cdk/core:bootstrapQualifier' if set, otherwise `DEFAULT_QUALIFIER`
   */
  readonly qualifier?: string;

  readonly bucketPrefix?: string;
}

/**
 * App Staging Synthesizer
 */
export class AppStagingSynthesizer extends StackSynthesizer implements IReusableStackSynthesizer {
  /**
   * Use the Default Staging Stack as the Staging Stack for this Synthesizer, and
   * create a new Staging Stack per environment this App is deployed in.
   */
  public static stackPerEnv(props: StackPerEnvProps) {
    for (const key in props) {
      if (props.hasOwnProperty(key)) {
        validateNoToken(key as keyof StackPerEnvProps);
      }
    }

    function validateNoToken<A extends keyof StackPerEnvProps>(key: A) {
      const prop = props[key];
      if (typeof prop === 'string' && Token.isUnresolved(prop)) {
        throw new Error(`AppStagingSynthesizer property '${key}' cannot contain tokens; only the following placeholder strings are allowed: ` + [
          '${Qualifier}',
          cxapi.EnvironmentPlaceholders.CURRENT_REGION,
          cxapi.EnvironmentPlaceholders.CURRENT_ACCOUNT,
          cxapi.EnvironmentPlaceholders.CURRENT_PARTITION,
        ].join(', '));
      }
    }

    return new AppStagingSynthesizer({
      qualifier: props.qualifier,
      bootstrapRoles: props.bootstrapRoles,
      bucketPrefix: props.bucketPrefix,
      stagingStackFactory: {
        stagingStackFactory(boundStack: Stack) {
          const app = App.of(boundStack);
          if (!App.isApp(app)) {
            throw new Error(`Stack ${boundStack.stackName} must be part of an App`);
          }

          const qualifier = props.qualifier ??
            boundStack.node.tryGetContext(BOOTSTRAP_QUALIFIER_CONTEXT) ??
            BoundAppStagingSynthesizer.DEFAULT_QUALIFIER;

          const spec = new StringSpecializer(boundStack, qualifier);
          const deployActionRole = props.bootstrapRoles?.deploymentActionRole
            ?? BootstrapRole.fromRoleArn(BoundAppStagingSynthesizer.DEFAULT_DEPLOY_ROLE_ARN);
          const deployActionRoleArn = !deployActionRole.isCliCredentials() ? deployActionRole.renderRoleArn({ spec, tokenType: 'cfn' }) : undefined;

          let stackId = 'StagingStack';
          // Ensure we do not have a scenario where the App includes BOTH
          // environment-agnostic stacks and set environment stacks.
          const incompatibleEnvErrorMessage = [
            'AppStagingSynthesizer cannot synthesize CDK Apps with BOTH environment-agnostic stacks and set environment stacks.',
            'Please either specify environments for all stacks or no stacks in the CDK App.',
          ].join('\n');
          const addEnvMetadata = (agnostic: boolean) => {
            if (app.node.metadata.filter((m) => m.type === 'cdk-env').length === 0) {
              app.node.addMetadata('cdk-env', agnostic ? 'agnostic': 'non-agnostic');
            }
          };

          if (!Token.isUnresolved(boundStack.account) && !Token.isUnresolved(boundStack.region)) {
            // Stack has specified account and region
            stackId = stackId + boundStack.account + boundStack.region;
            if (app.node.metadata.filter((m) => m.type === 'cdk-env' && m.data === 'agnostic').length >= 1) {
              throw new Error(incompatibleEnvErrorMessage);
            }
            addEnvMetadata(false);
          } else {
            // Stack is environment agnostic
            if (app.node.metadata.filter((m) => m.type === 'cdk-env' && m.data === 'non-agnostic').length >= 1) {
              throw new Error(incompatibleEnvErrorMessage);
            }
            addEnvMetadata(true);
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
            imageAssetPublishingRole: props.stagingRoles?.dockerAssetPublishingRole,
            deployActionRoleArn,
            retainEphemeralFileAssets: props.retainEphemeralFileAssets,
            ephemeralFileAssetLifecycleRule: props.ephemeralFileAssetLifecycleRule,
          });
          boundStack.addDependency(stagingStack.dependencyStack, 'stack depends on the staging stack for staging resources');

          return stagingStack;
        },
      },
    });
  }

  /**
   * Supply your own stagingStackFactory method for creating an IStagingStack when
   * a stack is bound to the synthesizer.
   *
   * By default, `oncePerEnv = true`, which means that a new instance of the IStagingStack
   * will be created in new environments. Set `oncePerEnv = false` to turn off that behavior.
   */
  public static customFactory(props: CustomFactoryProps) {
    return new AppStagingSynthesizer(props);
  }

  /**
   * Supply a specific stack to be used as the Staging Stack for this App.
   */
  public static customDecider(stack: IStagingStack) {
    return new AppStagingSynthesizer({
      stagingStackFactory: {
        stagingStackFactory(_boundStack: Stack) {
          return stack;
        },
      },
    });
  }

  private constructor(private readonly props: AppStagingSynthesizerProps) {
    super();
  }

  /**
   * Returns a version of the synthesizer bound to a stack.
   */
  public reusableBind(stack: Stack): IBoundAppStagingSynthesizer {
    return new BoundAppStagingSynthesizer(stack, this.props);
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

class BoundAppStagingSynthesizer extends StackSynthesizer implements IBoundAppStagingSynthesizer {
  /**
   * Default ARN qualifier
   */
  public static readonly DEFAULT_QUALIFIER = 'hnb659fds';

  /**
   * Default CloudFormation role ARN.
   */
  public static readonly DEFAULT_CLOUDFORMATION_ROLE_ARN = 'arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-${Qualifier}-cfn-exec-role-${AWS::AccountId}-${AWS::Region}';

  /**
   * Default deploy role ARN.
   */
  public static readonly DEFAULT_DEPLOY_ROLE_ARN = 'arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-${Qualifier}-deploy-role-${AWS::AccountId}-${AWS::Region}';

  /**
   * Default lookup role ARN for missing values.
   */
  public static readonly DEFAULT_LOOKUP_ROLE_ARN = 'arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-${Qualifier}-lookup-role-${AWS::AccountId}-${AWS::Region}';

  private stagingStack: IStagingStack;
  private assetManifest = new AssetManifestBuilder();
  private readonly lookupRoleArn?: string;
  private readonly cloudFormationExecutionRoleArn?: string;
  private readonly deploymentActionRoleArn?: string;
  private readonly qualifier: string;
  private readonly bucketPrefix?: string;

  constructor(stack: Stack, props: AppStagingSynthesizerProps) {
    super();
    super.bind(stack);

    this.bucketPrefix = props.bucketPrefix;
    this.qualifier = props.qualifier ?? stack.node.tryGetContext(BOOTSTRAP_QUALIFIER_CONTEXT) ?? BoundAppStagingSynthesizer.DEFAULT_QUALIFIER;
    const spec = new StringSpecializer(stack, this.qualifier);

    const lookupRole = props.bootstrapRoles?.lookupRole ?? BootstrapRole.fromRoleArn(BoundAppStagingSynthesizer.DEFAULT_LOOKUP_ROLE_ARN);
    this.lookupRoleArn = !lookupRole.isCliCredentials() ? lookupRole.renderRoleArn({ spec }) : undefined;

    const cloudFormationExecutionRole = props.bootstrapRoles?.cloudFormationExecutionRole ??
      BootstrapRole.fromRoleArn(BoundAppStagingSynthesizer.DEFAULT_CLOUDFORMATION_ROLE_ARN);
    this.cloudFormationExecutionRoleArn = !cloudFormationExecutionRole.isCliCredentials() ?
      cloudFormationExecutionRole.renderRoleArn({ spec }) : undefined;

    const deploymentActionRole = props.bootstrapRoles?.deploymentActionRole ??
      BootstrapRole.fromRoleArn(BoundAppStagingSynthesizer.DEFAULT_DEPLOY_ROLE_ARN);
    this.deploymentActionRoleArn = !deploymentActionRole.isCliCredentials() ? deploymentActionRole.renderRoleArn({ spec }) : undefined;

    this.stagingStack = props.stagingStackFactory.stagingStackFactory(stack);
  }

  /**
   * The qualifier used to bootstrap this stack
   */
  public get bootstrapQualifier(): string | undefined {
    return this.qualifier;
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
      bucketName: translateCfnTokenToAssetToken(bucketName),
      bucketPrefix: asset.ephemeral ? EPHEMERAL_PREFIX : this.bucketPrefix,
      role: {
        assumeRoleArn,
      },
    });
    return this.cloudFormationLocationFromFileAsset(location);
  }

  /**
   * Add a docker image asset to the manifest.
   */
  public addDockerImageAsset(_asset: DockerImageAssetSource): DockerImageAssetLocation {
    // TODO: implement
    throw new Error('Support for Docker Image Assets in AppStagingSynthesizer is not yet implemented. This construct is being actively worked on.');
    // const { repoName, assumeRoleArn } = this.stagingStack.addDockerImage(asset);

    // const location = this.assetManifest.defaultAddDockerImageAsset(this.boundStack, asset, {
    //   repositoryName: repoName,
    //   role: { assumeRoleArn },
    //   // TODO: more props
    // });
    // return this.cloudFormationLocationFromDockerImageAsset(location);
  }
}
