import {
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
} from 'aws-cdk-lib/core';
import { StringSpecializer, translateCfnTokenToAssetToken } from 'aws-cdk-lib/core/lib/helpers-internal';
import { BootstrapRole, BootstrapRoles, DeploymentIdentities } from './bootstrap-roles';
import { DefaultStagingStack, DefaultStagingStackOptions } from './default-staging-stack';
import { PerEnvironmentStagingFactory as PerEnvironmentStagingFactory } from './per-env-staging-factory';
import { AppScopedGlobal } from './private/app-global';
import { validateNoTokens } from './private/no-tokens';
import { IStagingResources, IStagingResourcesFactory, ObtainStagingResourcesContext } from './staging-stack';

const AGNOSTIC_STACKS = new AppScopedGlobal(() => new Set<Stack>());
const ENV_AWARE_STACKS = new AppScopedGlobal(() => new Set<Stack>());

/**
 * Options that apply to all AppStagingSynthesizer variants
 */
export interface AppStagingSynthesizerOptions {
  /**
   * What roles to use to deploy applications
   *
   * These are the roles that have permissions to interact with CloudFormation
   * on your behalf. By default these are the standard bootstrapped CDK roles,
   * but you can customize them or turn them off and use the CLI credentials
   * to deploy.
   *
   * @default - The standard bootstrapped CDK roles
   */
  readonly deploymentIdentities?: DeploymentIdentities;

  /**
   * Qualifier to disambiguate multiple bootstrapped environments in the same account
   *
   * This qualifier is only used to reference bootstrapped resources. It will not
   * be used in the creation of app-specific staging resources: `appId` is used for that
   * instead.
   *
   * @default - Value of context key '@aws-cdk/core:bootstrapQualifier' if set, otherwise `DEFAULT_QUALIFIER`
   */
  readonly bootstrapQualifier?: string;
}

/**
 * Properties for stackPerEnv static method
 */
export interface DefaultResourcesOptions extends AppStagingSynthesizerOptions, DefaultStagingStackOptions {}

/**
 * Properties for customFactory static method
 */
export interface CustomFactoryOptions extends AppStagingSynthesizerOptions {
  /**
   * The factory that will be used to return staging resources for each stack
   */
  readonly factory: IStagingResourcesFactory;

  /**
   * Reuse the answer from the factory for stacks in the same environment
   *
   * @default true
   */
  readonly oncePerEnv?: boolean;
}

/**
 * Properties for customResources static method
 */
export interface CustomResourcesOptions extends AppStagingSynthesizerOptions {
  /**
   * Use these exact staging resources for every stack that this synthesizer is used for
   */
  readonly resources: IStagingResources;
}

/**
 * Internal properties for AppStagingSynthesizer
 */
interface AppStagingSynthesizerProps extends AppStagingSynthesizerOptions {
  /**
   * A factory method that creates an IStagingStack when given the stack the
   * synthesizer is binding.
   */
  readonly factory: IStagingResourcesFactory;
}

/**
 * App Staging Synthesizer
 */
export class AppStagingSynthesizer extends StackSynthesizer implements IReusableStackSynthesizer {
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

  /**
   * Use the Default Staging Resources, creating a single stack per environment this app is deployed in
   */
  public static defaultResources(options: DefaultResourcesOptions) {
    validateNoTokens(options, 'AppStagingSynthesizer');

    return AppStagingSynthesizer.customFactory({
      factory: DefaultStagingStack.factory(options),
      deploymentIdentities: options.deploymentIdentities,
      bootstrapQualifier: options.bootstrapQualifier,
      oncePerEnv: true,
    });
  }

  /**
   * Use these exact staging resources for every stack that this synthesizer is used for
   */
  public static customResources(options: CustomResourcesOptions) {
    return AppStagingSynthesizer.customFactory({
      deploymentIdentities: options.deploymentIdentities,
      bootstrapQualifier: options.bootstrapQualifier,
      oncePerEnv: false,
      factory: {
        obtainStagingResources() {
          return options.resources;
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
  public static customFactory(options: CustomFactoryOptions) {
    const oncePerEnv = options.oncePerEnv ?? true;
    const factory = oncePerEnv ? new PerEnvironmentStagingFactory(options.factory) : options.factory;

    return new AppStagingSynthesizer({
      factory,
      bootstrapQualifier: options.bootstrapQualifier,
      deploymentIdentities: options.deploymentIdentities,
    });
  }

  private readonly roles: Required<BootstrapRoles>;

  private constructor(private readonly props: AppStagingSynthesizerProps) {
    super();

    const defaultIdentities = DeploymentIdentities.defaultBootstrapRoles();
    const identities = props.deploymentIdentities ?? DeploymentIdentities.defaultBootstrapRoles();

    this.roles = {
      deploymentRole: identities.deploymentRole ?? defaultIdentities.deploymentRole!,
      cloudFormationExecutionRole: identities.cloudFormationExecutionRole ?? defaultIdentities.cloudFormationExecutionRole!,
      lookupRole: identities.lookupRole ?? identities.lookupRole!,
    };
  }

  /**
   * Returns a version of the synthesizer bound to a stack.
   */
  public reusableBind(stack: Stack): IBoundAppStagingSynthesizer {
    this.checkEnvironmentGnosticism(stack);
    const qualifier = this.props.bootstrapQualifier ??
      stack.node.tryGetContext(BOOTSTRAP_QUALIFIER_CONTEXT) ??
      AppStagingSynthesizer.DEFAULT_QUALIFIER;
    const spec = new StringSpecializer(stack, qualifier);

    const deployRole = this.roles.deploymentRole._specialize(spec);

    const context: ObtainStagingResourcesContext = {
      environmentString: [
        Token.isUnresolved(stack.account) ? 'ACCOUNT' : stack.account,
        Token.isUnresolved(stack.region) ? 'REGION' : stack.region,
      ].join('-'),
      deployRoleArn: deployRole._arnForCloudFormation(),
      qualifier,
    };

    return new BoundAppStagingSynthesizer(stack, {
      stagingResources: this.props.factory.obtainStagingResources(stack, context),
      deployRole,
      cloudFormationExecutionRole: this.roles.cloudFormationExecutionRole._specialize(spec),
      lookupRole: this.roles.lookupRole._specialize(spec),
      qualifier,
    });
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

  /**
   * Check that we're only being used for exclusively gnostic or agnostic stacks.
   *
   * We can think about whether to loosen this requirement later.
   */
  private checkEnvironmentGnosticism(stack: Stack) {
    const isAgnostic = Token.isUnresolved(stack.account) || Token.isUnresolved(stack.region);
    const agnosticStacks = AGNOSTIC_STACKS.for(stack);
    const envAwareStacks = ENV_AWARE_STACKS.for(stack);

    (isAgnostic ? agnosticStacks : envAwareStacks).add(stack);
    if (agnosticStacks.size > 0 && envAwareStacks.size > 0) {

      const describeStacks = (xs: Set<Stack>) => Array.from(xs).map(s => s.node.path).join(', ');

      throw new Error([
        'It is not safe to use AppStagingSynthesizer for both environment-agnostic and environment-aware stacks at the same time.',
        'Please either specify environments for all stacks or no stacks in the CDK App.',
        `At least these stacks with environment: ${describeStacks(envAwareStacks)}.`,
        `At least these stacks without environment: ${describeStacks(agnosticStacks)}.`,
      ].join(' '));
    }
  }
}

/**
 * Internal properties for BoundAppStagingSynthesizer
 */
interface BoundAppStagingSynthesizerProps {
  /**
   * The bootstrap qualifier
   */
  readonly qualifier: string;

  /**
   * The resources we end up using for this synthesizer
   */
  readonly stagingResources: IStagingResources;

  /**
   * The deploy role
   */
  readonly deployRole: BootstrapRole;

  /**
   * CloudFormation Execution Role
   */
  readonly cloudFormationExecutionRole: BootstrapRole;

  /**
   * Lookup Role
   */
  readonly lookupRole: BootstrapRole;
}

class BoundAppStagingSynthesizer extends StackSynthesizer implements IBoundAppStagingSynthesizer {
  private readonly stagingStack: IStagingResources;
  private readonly assetManifest = new AssetManifestBuilder();
  private readonly qualifier: string;
  private readonly dependencyStacks: Set<Stack> = new Set();

  constructor(stack: Stack, private readonly props: BoundAppStagingSynthesizerProps) {
    super();
    super.bind(stack);

    this.qualifier = props.qualifier;
    this.stagingStack = props.stagingResources;
  }
  /**
   * The qualifier used to bootstrap this stack
   */
  public get bootstrapQualifier(): string | undefined {
    // Not sure why we need this.
    return this.qualifier;
  }

  public synthesize(session: ISynthesisSession): void {
    const templateAssetSource = this.synthesizeTemplate(session, this.props.lookupRole?._arnForCloudAssembly());
    const templateAsset = this.addFileAsset(templateAssetSource);

    const dependencies = Array.from(this.dependencyStacks).flatMap((d) => d.artifactId);
    const assetManifestId = this.assetManifest.emitManifest(this.boundStack, session, {}, dependencies);

    const lookupRoleArn = this.props.lookupRole?._arnForCloudAssembly();

    this.emitArtifact(session, {
      assumeRoleArn: this.props.deployRole?._arnForCloudAssembly(),
      additionalDependencies: [assetManifestId],
      stackTemplateAssetObjectUrl: templateAsset.s3ObjectUrlWithPlaceholders,
      cloudFormationExecutionRoleArn: this.props.cloudFormationExecutionRole?._arnForCloudAssembly(),
      lookupRole: lookupRoleArn ? { arn: lookupRoleArn } : undefined,
    });
  }

  /**
   * Add a file asset to the manifest.
   */
  public addFileAsset(asset: FileAssetSource): FileAssetLocation {
    const { bucketName, assumeRoleArn, prefix, dependencyStack } = this.stagingStack.addFile(asset);
    const location = this.assetManifest.defaultAddFileAsset(this.boundStack, asset, {
      bucketName: translateCfnTokenToAssetToken(bucketName),
      bucketPrefix: prefix,
      role: assumeRoleArn ? { assumeRoleArn: translateCfnTokenToAssetToken(assumeRoleArn) } : undefined,
    });

    if (dependencyStack) {
      this.boundStack.addDependency(dependencyStack, 'stack depends on the staging stack for staging resources');
      this.dependencyStacks.add(dependencyStack);
    }

    return this.cloudFormationLocationFromFileAsset(location);
  }

  /**
   * Add a docker image asset to the manifest.
   */
  public addDockerImageAsset(asset: DockerImageAssetSource): DockerImageAssetLocation {
    const { repoName, assumeRoleArn, dependencyStack } = this.stagingStack.addDockerImage(asset);
    const location = this.assetManifest.defaultAddDockerImageAsset(this.boundStack, asset, {
      repositoryName: translateCfnTokenToAssetToken(repoName),
      role: assumeRoleArn ? { assumeRoleArn: translateCfnTokenToAssetToken(assumeRoleArn) } : undefined,
    });

    if (dependencyStack) {
      this.boundStack.addDependency(dependencyStack, 'stack depends on the staging stack for staging resources');
      this.dependencyStacks.add(dependencyStack);
    }

    return this.cloudFormationLocationFromDockerImageAsset(location);
  }
}
