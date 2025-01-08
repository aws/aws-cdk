import * as cxapi from '@aws-cdk/cx-api';
import { SDK } from './aws-auth';
import { warning } from '../logging';
import { CredentialsOptions, SdkForEnvironment, SdkProvider } from './aws-auth/sdk-provider';
import { EnvironmentResources, EnvironmentResourcesRegistry } from './environment-resources';
import { Mode } from './plugin/mode';
import { replaceEnvPlaceholders, StringWithoutPlaceholders } from './util/placeholders';

/**
 * Access particular AWS resources, based on information from the CX manifest
 *
 * It is not possible to grab direct access to AWS credentials; 9 times out of 10
 * we have to allow for role assumption, and role assumption can only work if
 * there is a CX Manifest that contains a role ARN.
 *
 * This class exists so new code isn't tempted to go and get SDK credentials directly.
 */
export class EnvironmentAccess {
  private readonly sdkCache = new Map<string, SdkForEnvironment>();
  private readonly environmentResources: EnvironmentResourcesRegistry;

  constructor(private readonly sdkProvider: SdkProvider, toolkitStackName: string) {
    this.environmentResources = new EnvironmentResourcesRegistry(toolkitStackName);
  }

  /**
   * Resolves the environment for a stack.
   */
  public async resolveStackEnvironment(stack: cxapi.CloudFormationStackArtifact): Promise<cxapi.Environment> {
    return this.sdkProvider.resolveEnvironment(stack.environment);
  }

  /**
   * Get an SDK to access the given stack's environment for stack operations
   *
   * Will ask plugins for readonly credentials if available, use the default
   * AWS credentials if not.
   *
   * Will assume the deploy role if configured on the stack. Check the default `deploy-role`
   * policies to see what you can do with this role.
   */
  public async accessStackForReadOnlyStackOperations(stack: cxapi.CloudFormationStackArtifact): Promise<TargetEnvironment> {
    return this.accessStackForStackOperations(stack, Mode.ForReading);
  }

  /**
   * Get an SDK to access the given stack's environment for stack operations
   *
   * Will ask plugins for mutating credentials if available, use the default AWS
   * credentials if not.  The `mode` parameter is only used for querying
   * plugins.
   *
   * Will assume the deploy role if configured on the stack. Check the default `deploy-role`
   * policies to see what you can do with this role.
   */
  public async accessStackForMutableStackOperations(stack: cxapi.CloudFormationStackArtifact): Promise<TargetEnvironment> {
    return this.accessStackForStackOperations(stack, Mode.ForWriting);
  }

  /**
   * Get an SDK to access the given stack's environment for environmental lookups
   *
   * Will use a plugin if available, use the default AWS credentials if not.
   * The `mode` parameter is only used for querying plugins.
   *
   * Will assume the lookup role if configured on the stack. Check the default `lookup-role`
   * policies to see what you can do with this role. It can generally read everything
   * in the account that does not require KMS access.
   *
   * ---
   *
   * For backwards compatibility reasons, there are some scenarios that are handled here:
   *
   *  1. The lookup role may not exist (it was added in bootstrap stack version 7). If so:
   *     a. Return the default credentials if the default credentials are for the stack account
   *        (you will notice this as `isFallbackCredentials=true`).
   *     b. Throw an error if the default credentials are not for the stack account.
   *
   *  2. The lookup role may not have the correct permissions (for example, ReadOnlyAccess was added in
   *     bootstrap stack version 8); the stack will have a minimum version number on it.
   *     a. If it does not we throw an error which should be handled in the calling
   *        function (and fallback to use a different role, etc)
   *
   * Upon success, caller will have an SDK for the right account, which may or may not have
   * the right permissions.
   */
  public async accessStackForLookup(stack: cxapi.CloudFormationStackArtifact): Promise<TargetEnvironment> {
    if (!stack.environment) {
      throw new Error(`The stack ${stack.displayName} does not have an environment`);
    }

    const lookupEnv = await this.prepareSdk({
      environment: stack.environment,
      mode: Mode.ForReading,
      assumeRoleArn: stack.lookupRole?.arn,
      assumeRoleExternalId: stack.lookupRole?.assumeRoleExternalId,
      assumeRoleAdditionalOptions: stack.lookupRole?.assumeRoleAdditionalOptions,
    });

    // if we succeed in assuming the lookup role, make sure we have the correct bootstrap stack version
    if (lookupEnv.didAssumeRole && stack.lookupRole?.bootstrapStackVersionSsmParameter && stack.lookupRole.requiresBootstrapStackVersion) {
      const version = await lookupEnv.resources.versionFromSsmParameter(stack.lookupRole.bootstrapStackVersionSsmParameter);
      if (version < stack.lookupRole.requiresBootstrapStackVersion) {
        throw new Error(`Bootstrap stack version '${stack.lookupRole.requiresBootstrapStackVersion}' is required, found version '${version}'. To get rid of this error, please upgrade to bootstrap version >= ${stack.lookupRole.requiresBootstrapStackVersion}`);
      }
    }
    if (lookupEnv.isFallbackCredentials) {
      const arn = await lookupEnv.replacePlaceholders(stack.lookupRole?.arn);
      warning(`Lookup role ${arn} was not assumed. Proceeding with default credentials.`);
    }
    return lookupEnv;
  }

  /**
   * Get an SDK to access the given stack's environment for reading stack attributes
   *
   * Will use a plugin if available, use the default AWS credentials if not.
   * The `mode` parameter is only used for querying plugins.
   *
   * Will try to assume the lookup role if given, will use the regular stack operations
   * access (deploy-role) otherwise. When calling this, you should assume that you will get
   * the least privileged role, so don't try to use it for anything the `deploy-role`
   * wouldn't be able to do. Also you cannot rely on being able to read encrypted anything.
   */
  public async accessStackForLookupBestEffort(stack: cxapi.CloudFormationStackArtifact): Promise<TargetEnvironment> {
    if (!stack.environment) {
      throw new Error(`The stack ${stack.displayName} does not have an environment`);
    }

    try {
      return await this.accessStackForLookup(stack);
    } catch (e: any) {
      warning(`${e.message}`);
    }
    return this.accessStackForStackOperations(stack, Mode.ForReading);
  }

  /**
   * Get an SDK to access the given stack's environment for stack operations
   *
   * Will use a plugin if available, use the default AWS credentials if not.
   * The `mode` parameter is only used for querying plugins.
   *
   * Will assume the deploy role if configured on the stack. Check the default `deploy-role`
   * policies to see what you can do with this role.
   */
  private async accessStackForStackOperations(stack: cxapi.CloudFormationStackArtifact, mode: Mode): Promise<TargetEnvironment> {
    if (!stack.environment) {
      throw new Error(`The stack ${stack.displayName} does not have an environment`);
    }

    return this.prepareSdk({
      environment: stack.environment,
      mode,
      assumeRoleArn: stack.assumeRoleArn,
      assumeRoleExternalId: stack.assumeRoleExternalId,
      assumeRoleAdditionalOptions: stack.assumeRoleAdditionalOptions,
    });
  }

  /**
   * Prepare an SDK for use in the given environment and optionally with a role assumed.
   */
  private async prepareSdk(
    options: PrepareSdkRoleOptions,
  ): Promise<TargetEnvironment> {
    const resolvedEnvironment = await this.sdkProvider.resolveEnvironment(options.environment);

    // Substitute any placeholders with information about the current environment
    const { assumeRoleArn } = await replaceEnvPlaceholders({
      assumeRoleArn: options.assumeRoleArn,
    }, resolvedEnvironment, this.sdkProvider);

    const stackSdk = await this.cachedSdkForEnvironment(resolvedEnvironment, options.mode, {
      assumeRoleArn,
      assumeRoleExternalId: options.assumeRoleExternalId,
      assumeRoleAdditionalOptions: options.assumeRoleAdditionalOptions,
    });

    return {
      sdk: stackSdk.sdk,
      resolvedEnvironment,
      resources: this.environmentResources.for(resolvedEnvironment, stackSdk.sdk),
      // If we asked for a role, did not successfully assume it, and yet got here without an exception: that
      // means we must have fallback credentials.
      isFallbackCredentials: !stackSdk.didAssumeRole && !!assumeRoleArn,
      didAssumeRole: stackSdk.didAssumeRole,
      replacePlaceholders: async <A extends string | undefined>(str: A) => {
        const ret = await replaceEnvPlaceholders({ str }, resolvedEnvironment, this.sdkProvider);
        return ret.str;
      },
    };
  }

  private async cachedSdkForEnvironment(
    environment: cxapi.Environment,
    mode: Mode,
    options?: CredentialsOptions,
  ) {
    const cacheKeyElements = [
      environment.account,
      environment.region,
      `${mode}`,
      options?.assumeRoleArn ?? '',
      options?.assumeRoleExternalId ?? '',
    ];

    if (options?.assumeRoleAdditionalOptions) {
      cacheKeyElements.push(JSON.stringify(options.assumeRoleAdditionalOptions));
    }

    const cacheKey = cacheKeyElements.join(':');
    const existing = this.sdkCache.get(cacheKey);
    if (existing) {
      return existing;
    }
    const ret = await this.sdkProvider.forEnvironment(environment, mode, options);
    this.sdkCache.set(cacheKey, ret);
    return ret;
  }
}

/**
 * SDK obtained by assuming the deploy role
 * for a given environment
 */
export interface TargetEnvironment {
  /**
   * The SDK for the given environment
   */
  readonly sdk: SDK;

  /**
   * The resolved environment for the stack
   * (no more 'unknown-account/unknown-region')
   */
  readonly resolvedEnvironment: cxapi.Environment;

  /**
   * Access class for environmental resources to help the deployment
   */
  readonly resources: EnvironmentResources;

  /**
   * Whether or not we assumed a role in the process of getting these credentials
   */
  readonly didAssumeRole: boolean;

  /**
   * Whether or not these are fallback credentials
   *
   * Fallback credentials means that assuming the intended role failed, but the
   * base credentials happen to be for the right account so we just picked those
   * and hope the future SDK calls succeed.
   *
   * This is a backwards compatibility mechanism from around the time we introduced
   * deployment roles.
   */
  readonly isFallbackCredentials: boolean;

  /**
   * Replace environment placeholders according to the current environment
   */
  replacePlaceholders(x: string | undefined): Promise<StringWithoutPlaceholders | undefined>;
}

interface PrepareSdkRoleOptions {
  readonly environment: cxapi.Environment;
  readonly mode: Mode;
  readonly assumeRoleArn?: string;
  readonly assumeRoleExternalId?: string;
  readonly assumeRoleAdditionalOptions?: { [key: string]: any };
}
