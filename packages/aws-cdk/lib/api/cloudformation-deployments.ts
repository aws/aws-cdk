import * as cxapi from '@aws-cdk/cx-api';
import { AssetManifest } from 'cdk-assets';
import { Tag } from '../cdk-toolkit';
import { debug, warning } from '../logging';
import { publishAssets } from '../util/asset-publishing';
import { Mode, SdkProvider, ISDK } from './aws-auth';
import { deployStack, DeployStackResult, destroyStack } from './deploy-stack';
import { ToolkitInfo } from './toolkit-info';
import { CloudFormationStack, Template } from './util/cloudformation';
import { StackActivityProgress } from './util/cloudformation/stack-activity-monitor';

/**
 * Replace the {ACCOUNT} and {REGION} placeholders in all strings found in a complex object.
 */
export async function replaceEnvPlaceholders<A extends { }>(object: A, env: cxapi.Environment, sdkProvider: SdkProvider): Promise<A> {
  return cxapi.EnvironmentPlaceholders.replaceAsync(object, {
    accountId: () => Promise.resolve(env.account),
    region: () => Promise.resolve(env.region),
    partition: async () => {
      // There's no good way to get the partition!
      // We should have had it already, except we don't.
      //
      // Best we can do is ask the "base credentials" for this environment for their partition. Cross-partition
      // AssumeRole'ing will never work anyway, so this answer won't be wrong (it will just be slow!)
      return (await sdkProvider.baseCredentialsPartition(env, Mode.ForReading)) ?? 'aws';
    },
  });
}

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
export async function prepareSdkWithLookupRoleFor(
  sdkProvider: SdkProvider,
  stack: cxapi.CloudFormationStackArtifact,
): Promise<PreparedSdkWithLookupRoleForEnvironment> {
  const resolvedEnvironment = await sdkProvider.resolveEnvironment(stack.environment);

  // Substitute any placeholders with information about the current environment
  const arns = await replaceEnvPlaceholders({
    lookupRoleArn: stack.lookupRole?.arn,
  }, resolvedEnvironment, sdkProvider);

  // try to assume the lookup role
  const warningMessage = `Could not assume ${arns.lookupRoleArn}, proceeding anyway.`;
  const upgradeMessage = `(To get rid of this warning, please upgrade to bootstrap version >= ${stack.lookupRole?.requiresBootstrapStackVersion})`;
  try {
    const stackSdk = await sdkProvider.forEnvironment(resolvedEnvironment, Mode.ForReading, {
      assumeRoleArn: arns.lookupRoleArn,
      assumeRoleExternalId: stack.lookupRole?.assumeRoleExternalId,
    });

    // if we succeed in assuming the lookup role, make sure we have the correct bootstrap stack version
    if (stackSdk.didAssumeRole && stack.lookupRole?.bootstrapStackVersionSsmParameter && stack.lookupRole.requiresBootstrapStackVersion) {
      const version = await ToolkitInfo.versionFromSsmParameter(stackSdk.sdk, stack.lookupRole.bootstrapStackVersionSsmParameter);
      if (version < stack.lookupRole.requiresBootstrapStackVersion) {
        throw new Error(`Bootstrap stack version '${stack.lookupRole.requiresBootstrapStackVersion}' is required, found version '${version}'.`);
      }
    } else if (!stackSdk.didAssumeRole) {
      warning(upgradeMessage);
    }
    return { ...stackSdk, resolvedEnvironment };
  } catch (e) {
    debug(e);
    warning(warningMessage);
    warning(upgradeMessage);
    throw (e);
  }
}

export interface DeployStackOptions {
  /**
   * Stack to deploy
   */
  stack: cxapi.CloudFormationStackArtifact;

  /**
   * Execution role for the deployment (pass through to CloudFormation)
   *
   * @default - Current role
   */
  roleArn?: string;

  /**
   * Topic ARNs to send a message when deployment finishes (pass through to CloudFormation)
   *
   * @default - No notifications
   */
  notificationArns?: string[];

  /**
   * Override name under which stack will be deployed
   *
   * @default - Use artifact default
   */
  deployName?: string;

  /**
   * Don't show stack deployment events, just wait
   *
   * @default false
   */
  quiet?: boolean;

  /**
   * Name of the toolkit stack, if not the default name
   *
   * @default 'CDKToolkit'
   */
  toolkitStackName?: string;

  /**
   * List of asset IDs which should NOT be built or uploaded
   *
   * @default - Build all assets
   */
  reuseAssets?: string[];

  /**
   * Stack tags (pass through to CloudFormation)
   */
  tags?: Tag[];

  /**
   * Stage the change set but don't execute it
   *
   * @default - false
   */
  execute?: boolean;

  /**
   * Optional name to use for the CloudFormation change set.
   * If not provided, a name will be generated automatically.
   */
  changeSetName?: string;

  /**
   * Force deployment, even if the deployed template is identical to the one we are about to deploy.
   * @default false deployment will be skipped if the template is identical
   */
  force?: boolean;

  /**
   * Extra parameters for CloudFormation
   * @default - no additional parameters will be passed to the template
   */
  parameters?: { [name: string]: string | undefined };

  /**
   * Use previous values for unspecified parameters
   *
   * If not set, all parameters must be specified for every deployment.
   *
   * @default true
   */
  usePreviousParameters?: boolean;

  /**
   * Display mode for stack deployment progress.
   *
   * @default - StackActivityProgress.Bar - stack events will be displayed for
   *   the resource currently being deployed.
   */
  progress?: StackActivityProgress;

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
   * @default - false for regular deployments, true for 'watch' deployments
   */
  readonly hotswap?: boolean;

  /**
   * The extra string to append to the User-Agent header when performing AWS SDK calls.
   *
   * @default - nothing extra is appended to the User-Agent header
   */
  readonly extraUserAgent?: string;
}

export interface DestroyStackOptions {
  stack: cxapi.CloudFormationStackArtifact;
  deployName?: string;
  roleArn?: string;
  quiet?: boolean;
  force?: boolean;
}

export interface StackExistsOptions {
  stack: cxapi.CloudFormationStackArtifact;
  deployName?: string;
}

export interface ProvisionerProps {
  sdkProvider: SdkProvider;
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
}

/**
 * Helper class for CloudFormation deployments
 *
 * Looks us the right SDK and Bootstrap stack to deploy a given
 * stack artifact.
 */
export class CloudFormationDeployments {
  private readonly sdkProvider: SdkProvider;

  constructor(props: ProvisionerProps) {
    this.sdkProvider = props.sdkProvider;
  }

  public async readCurrentTemplate(stackArtifact: cxapi.CloudFormationStackArtifact): Promise<Template> {
    debug(`Reading existing template for stack ${stackArtifact.displayName}.`);
    let stackSdk: ISDK | undefined = undefined;
    // try to assume the lookup role and fallback to the deploy role
    try {
      const result = await prepareSdkWithLookupRoleFor(this.sdkProvider, stackArtifact);
      if (result.didAssumeRole) {
        stackSdk = result.sdk;
      }
    } catch { }

    if (!stackSdk) {
      stackSdk = (await this.prepareSdkFor(stackArtifact, undefined, Mode.ForReading)).stackSdk;
    }

    const cfn = stackSdk.cloudFormation();

    const stack = await CloudFormationStack.lookup(cfn, stackArtifact.stackName);
    return stack.template();
  }

  public async deployStack(options: DeployStackOptions): Promise<DeployStackResult> {
    const { stackSdk, resolvedEnvironment, cloudFormationRoleArn } = await this.prepareSdkFor(options.stack, options.roleArn);

    const toolkitInfo = await ToolkitInfo.lookup(resolvedEnvironment, stackSdk, options.toolkitStackName);

    // Publish any assets before doing the actual deploy
    await this.publishStackAssets(options.stack, toolkitInfo);

    // Do a verification of the bootstrap stack version
    await this.validateBootstrapStackVersion(
      options.stack.stackName,
      options.stack.requiresBootstrapStackVersion,
      options.stack.bootstrapStackVersionSsmParameter,
      toolkitInfo);

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
      toolkitInfo,
      tags: options.tags,
      execute: options.execute,
      changeSetName: options.changeSetName,
      force: options.force,
      parameters: options.parameters,
      usePreviousParameters: options.usePreviousParameters,
      progress: options.progress,
      ci: options.ci,
      rollback: options.rollback,
      hotswap: options.hotswap,
      extraUserAgent: options.extraUserAgent,
    });
  }

  public async destroyStack(options: DestroyStackOptions): Promise<void> {
    const { stackSdk, cloudFormationRoleArn: roleArn } = await this.prepareSdkFor(options.stack, options.roleArn);

    return destroyStack({
      sdk: stackSdk,
      roleArn,
      stack: options.stack,
      deployName: options.deployName,
      quiet: options.quiet,
    });
  }

  public async stackExists(options: StackExistsOptions): Promise<boolean> {
    const { stackSdk } = await this.prepareSdkFor(options.stack, undefined, Mode.ForReading);
    const stack = await CloudFormationStack.lookup(stackSdk.cloudFormation(), options.deployName ?? options.stack.stackName);
    return stack.exists;
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
    roleArn?: string,
    mode = Mode.ForWriting,
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

    const stackSdk = await this.sdkProvider.forEnvironment(resolvedEnvironment, mode, {
      assumeRoleArn: arns.assumeRoleArn,
      assumeRoleExternalId: stack.assumeRoleExternalId,
    });

    return {
      stackSdk: stackSdk.sdk,
      resolvedEnvironment,
      cloudFormationRoleArn: arns.cloudFormationRoleArn,
    };
  }

  /**
   * Publish all asset manifests that are referenced by the given stack
   */
  private async publishStackAssets(stack: cxapi.CloudFormationStackArtifact, toolkitInfo: ToolkitInfo) {
    const stackEnv = await this.sdkProvider.resolveEnvironment(stack.environment);
    const assetArtifacts = stack.dependencies.filter(isAssetManifestArtifact);

    for (const assetArtifact of assetArtifacts) {
      await this.validateBootstrapStackVersion(
        stack.stackName,
        assetArtifact.requiresBootstrapStackVersion,
        assetArtifact.bootstrapStackVersionSsmParameter,
        toolkitInfo);

      const manifest = AssetManifest.fromFile(assetArtifact.file);
      await publishAssets(manifest, this.sdkProvider, stackEnv);
    }
  }

  /**
   * Validate that the bootstrap stack has the right version for this stack
   */
  private async validateBootstrapStackVersion(
    stackName: string,
    requiresBootstrapStackVersion: number | undefined,
    bootstrapStackVersionSsmParameter: string | undefined,
    toolkitInfo: ToolkitInfo) {

    if (requiresBootstrapStackVersion === undefined) { return; }

    try {
      await toolkitInfo.validateVersion(requiresBootstrapStackVersion, bootstrapStackVersionSsmParameter);
    } catch (e) {
      throw new Error(`${stackName}: ${e.message}`);
    }
  }
}

function isAssetManifestArtifact(art: cxapi.CloudArtifact): art is cxapi.AssetManifestArtifact {
  return art instanceof cxapi.AssetManifestArtifact;
}
