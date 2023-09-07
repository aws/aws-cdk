import * as cxapi from '@aws-cdk/cx-api';
import * as cdk_assets from 'cdk-assets';
import { AssetManifest, IManifestEntry } from 'cdk-assets';
import { Mode } from './aws-auth/credentials';
import { ISDK } from './aws-auth/sdk';
import { CredentialsOptions, SdkForEnvironment, SdkProvider } from './aws-auth/sdk-provider';
import { deployStack, DeployStackResult, destroyStack, makeBodyParameterAndUpload, DeploymentMethod } from './deploy-stack';
import { EnvironmentResources, EnvironmentResourcesRegistry } from './environment-resources';
import { HotswapMode } from './hotswap/common';
import { loadCurrentTemplateWithNestedStacks, loadCurrentTemplate, flattenNestedStackNames, TemplateWithNestedStackCount } from './nested-stack-helpers';
import { CloudFormationStack, Template, ResourcesToImport, ResourceIdentifierSummaries } from './util/cloudformation';
import { StackActivityProgress } from './util/cloudformation/stack-activity-monitor';
import { replaceEnvPlaceholders } from './util/placeholders';
import { Tag } from '../cdk-toolkit';
import { debug, warning } from '../logging';
import { buildAssets, publishAssets, BuildAssetsOptions, PublishAssetsOptions, PublishingAws, EVENT_TO_LOGGER } from '../util/asset-publishing';

/**
 * SDK obtained by assuming the lookup role
 * for a given environment
 */
export interface PreparedSdkWithLookupRoleForEnvironment {
  /**
   * The SDK for the given environment
   */
  readonly sdk: ISDK;

  /**
   * The resolved environment for the stack
   * (no more 'unknown-account/unknown-region')
   */
  readonly resolvedEnvironment: cxapi.Environment;

  /**
   * Whether or not the assume role was successful.
   * If the assume role was not successful (false)
   * then that means that the 'sdk' returned contains
   * the default credentials (not the assume role credentials)
   */
  readonly didAssumeRole: boolean;

  /**
   * An object for accessing the bootstrap resources in this environment
   */
  readonly envResources: EnvironmentResources;
}

export interface DeployStackOptions {
  /**
   * Stack to deploy
   */
  readonly stack: cxapi.CloudFormationStackArtifact;

  /**
   * Execution role for the deployment (pass through to CloudFormation)
   *
   * @default - Current role
   */
  readonly roleArn?: string;

  /**
   * Topic ARNs to send a message when deployment finishes (pass through to CloudFormation)
   *
   * @default - No notifications
   */
  readonly notificationArns?: string[];

  /**
   * Override name under which stack will be deployed
   *
   * @default - Use artifact default
   */
  readonly deployName?: string;

  /**
   * Don't show stack deployment events, just wait
   *
   * @default false
   */
  readonly quiet?: boolean;

  /**
   * Name of the toolkit stack, if not the default name
   *
   * @default 'CDKToolkit'
   */
  readonly toolkitStackName?: string;

  /**
   * List of asset IDs which should NOT be built or uploaded
   *
   * @default - Build all assets
   */
  readonly reuseAssets?: string[];

  /**
   * Stack tags (pass through to CloudFormation)
   */
  readonly tags?: Tag[];

  /**
   * Stage the change set but don't execute it
   *
   * @default - true
   * @deprecated Use 'deploymentMethod' instead
   */
  readonly execute?: boolean;

  /**
   * Optional name to use for the CloudFormation change set.
   * If not provided, a name will be generated automatically.
   *
   * @deprecated Use 'deploymentMethod' instead
   */
  readonly changeSetName?: string;

  /**
   * Select the deployment method (direct or using a change set)
   *
   * @default - Change set with default options
   */
  readonly deploymentMethod?: DeploymentMethod;

  /**
   * Force deployment, even if the deployed template is identical to the one we are about to deploy.
   * @default false deployment will be skipped if the template is identical
   */
  readonly force?: boolean;

  /**
   * Extra parameters for CloudFormation
   * @default - no additional parameters will be passed to the template
   */
  readonly parameters?: { [name: string]: string | undefined };

  /**
   * Use previous values for unspecified parameters
   *
   * If not set, all parameters must be specified for every deployment.
   *
   * @default true
   */
  readonly usePreviousParameters?: boolean;

  /**
   * Display mode for stack deployment progress.
   *
   * @default - StackActivityProgress.Bar - stack events will be displayed for
   *   the resource currently being deployed.
   */
  readonly progress?: StackActivityProgress;

  /**
   * Whether we are on a CI system
   *
   * @default false
   */
  readonly ci?: boolean;

  /**
   * Rollback failed deployments
   *
   * @default true
   */
  readonly rollback?: boolean;

  /*
   * Whether to perform a 'hotswap' deployment.
   * A 'hotswap' deployment will attempt to short-circuit CloudFormation
   * and update the affected resources like Lambda functions directly.
   *
   * @default - `HotswapMode.FULL_DEPLOYMENT` for regular deployments, `HotswapMode.HOTSWAP_ONLY` for 'watch' deployments
   */
  readonly hotswap?: HotswapMode;

  /**
   * The extra string to append to the User-Agent header when performing AWS SDK calls.
   *
   * @default - nothing extra is appended to the User-Agent header
   */
  readonly extraUserAgent?: string;

  /**
   * List of existing resources to be IMPORTED into the stack, instead of being CREATED
   */
  readonly resourcesToImport?: ResourcesToImport;

  /**
   * If present, use this given template instead of the stored one
   *
   * @default - Use the stored template
   */
  readonly overrideTemplate?: any;

  /**
   * Whether to build/publish assets in parallel
   *
   * @default true To remain backward compatible.
   */
  readonly assetParallelism?: boolean;
}

interface AssetOptions {
  /**
   * Stack with assets to build.
   */
  readonly stack: cxapi.CloudFormationStackArtifact;

  /**
   * Name of the toolkit stack, if not the default name.
   *
   * @default 'CDKToolkit'
   */
  readonly toolkitStackName?: string;

  /**
   * Execution role for the building.
   *
   * @default - Current role
   */
  readonly roleArn?: string;
}

export interface BuildStackAssetsOptions extends AssetOptions {
  /**
   * Options to pass on to `buildAssets()` function
   */
  readonly buildOptions?: BuildAssetsOptions;

  /**
   * Stack name this asset is for
   */
  readonly stackName?: string;
}

interface PublishStackAssetsOptions extends AssetOptions {
  /**
   * Options to pass on to `publishAsests()` function
   */
  readonly publishOptions?: Omit<PublishAssetsOptions, 'buildAssets'>;

  /**
   * Stack name this asset is for
   */
  readonly stackName?: string;
}

export interface DestroyStackOptions {
  stack: cxapi.CloudFormationStackArtifact;
  deployName?: string;
  roleArn?: string;
  quiet?: boolean;
  force?: boolean;
  ci?: boolean;
}

export interface StackExistsOptions {
  stack: cxapi.CloudFormationStackArtifact;
  deployName?: string;
}

export interface DeploymentsProps {
  sdkProvider: SdkProvider;
  readonly toolkitStackName?: string;
  readonly quiet?: boolean;
}

/**
 * SDK obtained by assuming the deploy role
 * for a given environment
 */
export interface PreparedSdkForEnvironment {
  /**
   * The SDK for the given environment
   */
  readonly stackSdk: ISDK;

  /**
   * The resolved environment for the stack
   * (no more 'unknown-account/unknown-region')
   */
  readonly resolvedEnvironment: cxapi.Environment;
  /**
   * The Execution Role that should be passed to CloudFormation.
   *
   * @default - no execution role is used
   */
  readonly cloudFormationRoleArn?: string;

  /**
   * Access class for environmental resources to help the deployment
   */
  readonly envResources: EnvironmentResources;
}

/**
 * Scope for a single set of deployments from a set of Cloud Assembly Artifacts
 *
 * Manages lookup of SDKs, Bootstrap stacks, etc.
 */
export class Deployments {
  private readonly sdkProvider: SdkProvider;
  private readonly sdkCache = new Map<string, SdkForEnvironment>();
  private readonly publisherCache = new Map<AssetManifest, cdk_assets.AssetPublishing>();
  private readonly environmentResources: EnvironmentResourcesRegistry;

  constructor(private readonly props: DeploymentsProps) {
    this.sdkProvider = props.sdkProvider;
    this.environmentResources = new EnvironmentResourcesRegistry(props.toolkitStackName);
  }

  public async readCurrentTemplateWithNestedStacks(
    rootStackArtifact: cxapi.CloudFormationStackArtifact,
    retrieveProcessedTemplate: boolean = false,
  ): Promise<TemplateWithNestedStackCount> {
    const sdk = (await this.prepareSdkWithLookupOrDeployRole(rootStackArtifact)).stackSdk;
    const templateWithNestedStacks = await loadCurrentTemplateWithNestedStacks(rootStackArtifact, sdk, retrieveProcessedTemplate);
    return {
      deployedTemplate: templateWithNestedStacks.deployedTemplate,
      nestedStackCount: flattenNestedStackNames(templateWithNestedStacks.nestedStackNames).length,
    };
  }

  public async readCurrentTemplate(stackArtifact: cxapi.CloudFormationStackArtifact): Promise<Template> {
    debug(`Reading existing template for stack ${stackArtifact.displayName}.`);
    const sdk = (await this.prepareSdkWithLookupOrDeployRole(stackArtifact)).stackSdk;
    return loadCurrentTemplate(stackArtifact, sdk);
  }

  public async resourceIdentifierSummaries(
    stackArtifact: cxapi.CloudFormationStackArtifact,
  ): Promise<ResourceIdentifierSummaries> {
    debug(`Retrieving template summary for stack ${stackArtifact.displayName}.`);
    // Currently, needs to use `deploy-role` since it may need to read templates in the staging
    // bucket which have been encrypted with a KMS key (and lookup-role may not read encrypted things)
    const { stackSdk, resolvedEnvironment, envResources } = await this.prepareSdkFor(stackArtifact, undefined, Mode.ForReading);
    const cfn = stackSdk.cloudFormation();

    // Upload the template, if necessary, before passing it to CFN
    const cfnParam = await makeBodyParameterAndUpload(
      stackArtifact,
      resolvedEnvironment,
      envResources,
      this.sdkProvider,
      stackSdk);

    const response = await cfn.getTemplateSummary(cfnParam).promise();
    if (!response.ResourceIdentifierSummaries) {
      debug('GetTemplateSummary API call did not return "ResourceIdentifierSummaries"');
    }
    return response.ResourceIdentifierSummaries ?? [];
  }

  public async deployStack(options: DeployStackOptions): Promise<DeployStackResult> {
    let deploymentMethod = options.deploymentMethod;
    if (options.changeSetName || options.execute !== undefined) {
      if (deploymentMethod) {
        throw new Error('You cannot supply both \'deploymentMethod\' and \'changeSetName/execute\'. Supply one or the other.');
      }
      deploymentMethod = {
        method: 'change-set',
        changeSetName: options.changeSetName,
        execute: options.execute,
      };
    }

    const {
      stackSdk,
      resolvedEnvironment,
      cloudFormationRoleArn,
      envResources,
    } = await this.prepareSdkFor(options.stack, options.roleArn, Mode.ForWriting);

    // Do a verification of the bootstrap stack version
    await this.validateBootstrapStackVersion(
      options.stack.stackName,
      options.stack.requiresBootstrapStackVersion,
      options.stack.bootstrapStackVersionSsmParameter,
      envResources);

    return deployStack({
      stack: options.stack,
      resolvedEnvironment,
      deployName: options.deployName,
      notificationArns: options.notificationArns,
      quiet: options.quiet,
      sdk: stackSdk,
      sdkProvider: this.sdkProvider,
      roleArn: cloudFormationRoleArn,
      reuseAssets: options.reuseAssets,
      envResources,
      tags: options.tags,
      deploymentMethod,
      force: options.force,
      parameters: options.parameters,
      usePreviousParameters: options.usePreviousParameters,
      progress: options.progress,
      ci: options.ci,
      rollback: options.rollback,
      hotswap: options.hotswap,
      extraUserAgent: options.extraUserAgent,
      resourcesToImport: options.resourcesToImport,
      overrideTemplate: options.overrideTemplate,
      assetParallelism: options.assetParallelism,
    });
  }

  public async destroyStack(options: DestroyStackOptions): Promise<void> {
    const { stackSdk, cloudFormationRoleArn: roleArn } = await this.prepareSdkFor(options.stack, options.roleArn, Mode.ForWriting);

    return destroyStack({
      sdk: stackSdk,
      roleArn,
      stack: options.stack,
      deployName: options.deployName,
      quiet: options.quiet,
      ci: options.ci,
    });
  }

  public async stackExists(options: StackExistsOptions): Promise<boolean> {
    const { stackSdk } = await this.prepareSdkFor(options.stack, undefined, Mode.ForReading);
    const stack = await CloudFormationStack.lookup(stackSdk.cloudFormation(), options.deployName ?? options.stack.stackName);
    return stack.exists;
  }

  private async prepareSdkWithLookupOrDeployRole(stackArtifact: cxapi.CloudFormationStackArtifact): Promise<PreparedSdkForEnvironment> {
    // try to assume the lookup role
    try {
      const result = await this.prepareSdkWithLookupRoleFor(stackArtifact);
      if (result.didAssumeRole) {
        return {
          resolvedEnvironment: result.resolvedEnvironment,
          stackSdk: result.sdk,
          envResources: result.envResources,
        };
      }
    } catch { }
    // fall back to the deploy role
    return this.prepareSdkFor(stackArtifact, undefined, Mode.ForReading);
  }

  /**
   * Get the environment necessary for touching the given stack
   *
   * Returns the following:
   *
   * - The resolved environment for the stack (no more 'unknown-account/unknown-region')
   * - SDK loaded with the right credentials for calling `CreateChangeSet`.
   * - The Execution Role that should be passed to CloudFormation.
   */
  private async prepareSdkFor(
    stack: cxapi.CloudFormationStackArtifact,
    roleArn: string | undefined,
    mode: Mode,
  ): Promise<PreparedSdkForEnvironment> {
    if (!stack.environment) {
      throw new Error(`The stack ${stack.displayName} does not have an environment`);
    }

    const resolvedEnvironment = await this.sdkProvider.resolveEnvironment(stack.environment);

    // Substitute any placeholders with information about the current environment
    const arns = await replaceEnvPlaceholders({
      assumeRoleArn: stack.assumeRoleArn,

      // Use the override if given, otherwise use the field from the stack
      cloudFormationRoleArn: roleArn ?? stack.cloudFormationExecutionRoleArn,
    }, resolvedEnvironment, this.sdkProvider);

    const stackSdk = await this.cachedSdkForEnvironment(resolvedEnvironment, mode, {
      assumeRoleArn: arns.assumeRoleArn,
      assumeRoleExternalId: stack.assumeRoleExternalId,
    });

    return {
      stackSdk: stackSdk.sdk,
      resolvedEnvironment,
      cloudFormationRoleArn: arns.cloudFormationRoleArn,
      envResources: this.environmentResources.for(resolvedEnvironment, stackSdk.sdk),
    };
  }

  /**
    * Try to use the bootstrap lookupRole. There are two scenarios that are handled here
    *  1. The lookup role may not exist (it was added in bootstrap stack version 7)
    *  2. The lookup role may not have the correct permissions (ReadOnlyAccess was added in
    *      bootstrap stack version 8)
    *
    * In the case of 1 (lookup role doesn't exist) `forEnvironment` will either:
    *   1. Return the default credentials if the default credentials are for the stack account
    *   2. Throw an error if the default credentials are not for the stack account.
    *
    * If we successfully assume the lookup role we then proceed to 2 and check whether the bootstrap
    * stack version is valid. If it is not we throw an error which should be handled in the calling
    * function (and fallback to use a different role, etc)
    *
    * If we do not successfully assume the lookup role, but do get back the default credentials
    * then return those and note that we are returning the default credentials. The calling
    * function can then decide to use them or fallback to another role.
    */
  public async prepareSdkWithLookupRoleFor(
    stack: cxapi.CloudFormationStackArtifact,
  ): Promise<PreparedSdkWithLookupRoleForEnvironment> {
    const resolvedEnvironment = await this.sdkProvider.resolveEnvironment(stack.environment);

    // Substitute any placeholders with information about the current environment
    const arns = await replaceEnvPlaceholders({
      lookupRoleArn: stack.lookupRole?.arn,
    }, resolvedEnvironment, this.sdkProvider);

    // try to assume the lookup role
    const warningMessage = `Could not assume ${arns.lookupRoleArn}, proceeding anyway.`;
    const upgradeMessage = `(To get rid of this warning, please upgrade to bootstrap version >= ${stack.lookupRole?.requiresBootstrapStackVersion})`;
    try {
      const stackSdk = await this.cachedSdkForEnvironment(resolvedEnvironment, Mode.ForReading, {
        assumeRoleArn: arns.lookupRoleArn,
        assumeRoleExternalId: stack.lookupRole?.assumeRoleExternalId,
      });

      const envResources = this.environmentResources.for(resolvedEnvironment, stackSdk.sdk);

      // if we succeed in assuming the lookup role, make sure we have the correct bootstrap stack version
      if (stackSdk.didAssumeRole && stack.lookupRole?.bootstrapStackVersionSsmParameter && stack.lookupRole.requiresBootstrapStackVersion) {
        const version = await envResources.versionFromSsmParameter(stack.lookupRole.bootstrapStackVersionSsmParameter);
        if (version < stack.lookupRole.requiresBootstrapStackVersion) {
          throw new Error(`Bootstrap stack version '${stack.lookupRole.requiresBootstrapStackVersion}' is required, found version '${version}'.`);
        }
        // we may not have assumed the lookup role because one was not provided
        // if that is the case then don't print the upgrade warning
      } else if (!stackSdk.didAssumeRole && stack.lookupRole?.requiresBootstrapStackVersion) {
        warning(upgradeMessage);
      }
      return { ...stackSdk, resolvedEnvironment, envResources };
    } catch (e: any) {
      debug(e);
      // only print out the warnings if the lookupRole exists AND there is a required
      // bootstrap version, otherwise the warnings will print `undefined`
      if (stack.lookupRole && stack.lookupRole.requiresBootstrapStackVersion) {
        warning(warningMessage);
        warning(upgradeMessage);
      }
      throw (e);
    }
  }

  private async prepareAndValidateAssets(asset: cxapi.AssetManifestArtifact, options: AssetOptions) {
    const { envResources } = await this.prepareSdkFor(options.stack, options.roleArn, Mode.ForWriting);

    await this.validateBootstrapStackVersion(
      options.stack.stackName,
      asset.requiresBootstrapStackVersion,
      asset.bootstrapStackVersionSsmParameter,
      envResources);

    const manifest = AssetManifest.fromFile(asset.file);

    return { manifest, stackEnv: envResources.environment };
  }

  /**
   * Build all assets in a manifest
   *
   * @deprecated Use `buildSingleAsset` instead
   */
  public async buildAssets(asset: cxapi.AssetManifestArtifact, options: BuildStackAssetsOptions) {
    const { manifest, stackEnv } = await this.prepareAndValidateAssets(asset, options);
    await buildAssets(manifest, this.sdkProvider, stackEnv, options.buildOptions);
  }

  /**
   * Publish all assets in a manifest
   *
   * @deprecated Use `publishSingleAsset` instead
   */
  public async publishAssets(asset: cxapi.AssetManifestArtifact, options: PublishStackAssetsOptions) {
    const { manifest, stackEnv } = await this.prepareAndValidateAssets(asset, options);
    await publishAssets(manifest, this.sdkProvider, stackEnv, options.publishOptions);
  }

  /**
   * Build a single asset from an asset manifest
   */
  // eslint-disable-next-line max-len
  public async buildSingleAsset(assetArtifact: cxapi.AssetManifestArtifact, assetManifest: AssetManifest, asset: IManifestEntry, options: BuildStackAssetsOptions) {
    const { resolvedEnvironment, envResources } = await this.prepareSdkFor(options.stack, options.roleArn, Mode.ForWriting);

    await this.validateBootstrapStackVersion(
      options.stack.stackName,
      assetArtifact.requiresBootstrapStackVersion,
      assetArtifact.bootstrapStackVersionSsmParameter,
      envResources);

    const publisher = this.cachedPublisher(assetManifest, resolvedEnvironment, options.stackName);
    await publisher.buildEntry(asset);
    if (publisher.hasFailures) {
      throw new Error(`Failed to build asset ${asset.id}`);
    }
  }

  /**
   * Publish a single asset from an asset manifest
   */
  // eslint-disable-next-line max-len
  public async publishSingleAsset(assetManifest: AssetManifest, asset: IManifestEntry, options: PublishStackAssetsOptions) {
    const { resolvedEnvironment: stackEnv } = await this.prepareSdkFor(options.stack, options.roleArn, Mode.ForWriting);

    // No need to validate anymore, we already did that during build
    const publisher = this.cachedPublisher(assetManifest, stackEnv, options.stackName);
    await publisher.publishEntry(asset);
    if (publisher.hasFailures) {
      throw new Error(`Failed to publish asset ${asset.id}`);
    }
  }

  /**
   * Return whether a single asset has been published already
   */
  public async isSingleAssetPublished(assetManifest: AssetManifest, asset: IManifestEntry, options: PublishStackAssetsOptions) {
    const { resolvedEnvironment: stackEnv } = await this.prepareSdkFor(options.stack, options.roleArn, Mode.ForWriting);
    const publisher = this.cachedPublisher(assetManifest, stackEnv, options.stackName);
    return publisher.isEntryPublished(asset);
  }

  /**
   * Validate that the bootstrap stack has the right version for this stack
   *
   * Call into envResources.validateVersion, but prepend the stack name in case of failure.
   */
  private async validateBootstrapStackVersion(
    stackName: string,
    requiresBootstrapStackVersion: number | undefined,
    bootstrapStackVersionSsmParameter: string | undefined,
    envResources: EnvironmentResources) {

    try {
      await envResources.validateVersion(requiresBootstrapStackVersion, bootstrapStackVersionSsmParameter);
    } catch (e: any) {
      throw new Error(`${stackName}: ${e.message}`);
    }
  }

  private async cachedSdkForEnvironment(
    environment: cxapi.Environment,
    mode: Mode,
    options?: CredentialsOptions,
  ) {
    const cacheKey = [
      environment.account,
      environment.region,
      `${mode}`,
      options?.assumeRoleArn ?? '',
      options?.assumeRoleExternalId ?? '',
    ].join(':');
    const existing = this.sdkCache.get(cacheKey);
    if (existing) {
      return existing;
    }
    const ret = await this.sdkProvider.forEnvironment(environment, mode, options);
    this.sdkCache.set(cacheKey, ret);
    return ret;
  }

  private cachedPublisher(assetManifest: cdk_assets.AssetManifest, env: cxapi.Environment, stackName?: string) {
    const existing = this.publisherCache.get(assetManifest);
    if (existing) {
      return existing;
    }
    const prefix = stackName ? `${stackName}: ` : '';
    const publisher = new cdk_assets.AssetPublishing(assetManifest, {
      aws: new PublishingAws(this.sdkProvider, env),
      progressListener: new ParallelSafeAssetProgress(prefix, this.props.quiet ?? false),
    });
    this.publisherCache.set(assetManifest, publisher);
    return publisher;
  }
}

/**
 * Asset progress that doesn't do anything with percentages (currently)
 */
class ParallelSafeAssetProgress implements cdk_assets.IPublishProgressListener {
  constructor(private readonly prefix: string, private readonly quiet: boolean) {
  }

  public onPublishEvent(type: cdk_assets.EventType, event: cdk_assets.IPublishProgress): void {
    const handler = this.quiet && type !== 'fail' ? debug : EVENT_TO_LOGGER[type];
    handler(`${this.prefix} ${type}: ${event.message}`);
  }
}

/**
 * @deprecated Use 'Deployments' instead
 */
export class CloudFormationDeployments extends Deployments {
}
