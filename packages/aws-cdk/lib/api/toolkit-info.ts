import * as cxapi from '@aws-cdk/cx-api';
import * as chalk from 'chalk';
import { ISDK } from './aws-auth';
import { BOOTSTRAP_VERSION_OUTPUT, BUCKET_DOMAIN_NAME_OUTPUT, BUCKET_NAME_OUTPUT, BOOTSTRAP_VARIANT_PARAMETER, DEFAULT_BOOTSTRAP_VARIANT } from './bootstrap/bootstrap-props';
import { stabilizeStack, CloudFormationStack } from './util/cloudformation';
import { debug, warning } from '../logging';

export const DEFAULT_TOOLKIT_STACK_NAME = 'CDKToolkit';

/**
 * The bootstrap template version that introduced ssm:GetParameter
 */
const BOOTSTRAP_TEMPLATE_VERSION_INTRODUCING_GETPARAMETER = 5;

/**
 * Information on the Bootstrap stack of the environment we're deploying to.
 *
 * This class serves to:
 *
 * - Inspect the bootstrap stack, and return various properties of it for successful
 *   asset deployment (in case of legacy-synthesized stacks).
 * - Validate the version of the target environment, and nothing else (in case of
 *   default-synthesized stacks).
 *
 * An object of this type might represent a bootstrap stack that could not be found.
 * This is not an issue unless any members are used that require the bootstrap stack
 * to have been found, in which case an error is thrown (default-synthesized stacks
 * should never run into this as they don't need information from the bootstrap
 * stack, all information is already encoded into the Cloud Assembly Manifest).
 *
 * Nevertheless, an instance of this class exists to serve as a cache for SSM
 * parameter lookups (otherwise, the "bootstrap stack version" parameter would
 * need to be read repeatedly).
 *
 * Called "ToolkitInfo" for historical reasons.
 *
 */
export abstract class ToolkitInfo {
  public static determineName(overrideName?: string) {
    return overrideName ?? DEFAULT_TOOLKIT_STACK_NAME;
  }

  public static async lookup(environment: cxapi.Environment, sdk: ISDK, stackName: string | undefined): Promise<ToolkitInfo> {
    const cfn = sdk.cloudFormation();
    const stack = await stabilizeStack(cfn, stackName ?? DEFAULT_TOOLKIT_STACK_NAME);
    if (!stack) {
      debug('The environment %s doesn\'t have the CDK toolkit stack (%s) installed. Use %s to setup your environment for use with the toolkit.',
        environment.name, stackName, chalk.blue(`cdk bootstrap "${environment.name}"`));
      return ToolkitInfo.bootstrapStackNotFoundInfo(sdk);
    }
    if (stack.stackStatus.isCreationFailure) {
      // Treat a "failed to create" bootstrap stack as an absent one.
      debug('The environment %s has a CDK toolkit stack (%s) that failed to create. Use %s to try provisioning it again.',
        environment.name, stackName, chalk.blue(`cdk bootstrap "${environment.name}"`));
      return ToolkitInfo.bootstrapStackNotFoundInfo(sdk);
    }

    return new ExistingToolkitInfo(stack, sdk);
  }

  public static fromStack(stack: CloudFormationStack, sdk: ISDK): ToolkitInfo {
    return new ExistingToolkitInfo(stack, sdk);
  }

  public static bootstraplessDeploymentsOnly(sdk: ISDK): ToolkitInfo {
    return new BootstrapStackNotFoundInfo(sdk, 'Trying to perform an operation that requires a bootstrap stack; you should not see this error, this is a bug in the CDK CLI.');
  }

  public static bootstrapStackNotFoundInfo(sdk: ISDK): ToolkitInfo {
    return new BootstrapStackNotFoundInfo(sdk, 'This deployment requires a bootstrap stack with a known name; pass \'--toolkit-stack-name\' or switch to using the \'DefaultStackSynthesizer\' (see https://docs.aws.amazon.com/cdk/latest/guide/bootstrapping.html)');
  }

  /**
   * Read a version from an SSM parameter, cached
   */
  public static async versionFromSsmParameter(sdk: ISDK, parameterName: string, ssmCache?: Map<string, number>): Promise<number> {
    const existing = ssmCache?.get(parameterName);
    if (existing !== undefined) { return existing; }

    const ssm = sdk.ssm();

    try {
      const result = await ssm.getParameter({ Name: parameterName }).promise();

      const asNumber = parseInt(`${result.Parameter?.Value}`, 10);
      if (isNaN(asNumber)) {
        throw new Error(`SSM parameter ${parameterName} not a number: ${result.Parameter?.Value}`);
      }

      ssmCache?.set(parameterName, asNumber);
      return asNumber;
    } catch (e: any) {
      if (e.code === 'ParameterNotFound') {
        throw new Error(`SSM parameter ${parameterName} not found. Has the environment been bootstrapped? Please run \'cdk bootstrap\' (see https://docs.aws.amazon.com/cdk/latest/guide/bootstrapping.html)`);
      }
      throw e;
    }
  }

  protected readonly ssmCache = new Map<string, number>();
  public abstract readonly found: boolean;
  public abstract readonly bucketUrl: string;
  public abstract readonly bucketName: string;
  public abstract readonly version: number;
  public abstract readonly variant: string;
  public abstract readonly bootstrapStack: CloudFormationStack;

  constructor(protected readonly sdk: ISDK) {
  }
  public abstract validateVersion(expectedVersion: number, ssmParameterName: string | undefined): Promise<void>;
  public abstract prepareEcrRepository(repositoryName: string): Promise<EcrRepositoryInfo>;
}

/**
 * Returned when a bootstrap stack is found
 */
class ExistingToolkitInfo extends ToolkitInfo {
  public readonly found = true;

  constructor(public readonly bootstrapStack: CloudFormationStack, sdk: ISDK) {
    super(sdk);
  }

  public get bucketUrl() {
    return `https://${this.requireOutput(BUCKET_DOMAIN_NAME_OUTPUT)}`;
  }

  public get bucketName() {
    return this.requireOutput(BUCKET_NAME_OUTPUT);
  }

  public get version() {
    return parseInt(this.bootstrapStack.outputs[BOOTSTRAP_VERSION_OUTPUT] ?? '0', 10);
  }

  public get variant() {
    return this.bootstrapStack.parameters[BOOTSTRAP_VARIANT_PARAMETER] ?? DEFAULT_BOOTSTRAP_VARIANT;
  }

  public get parameters(): Record<string, string> {
    return this.bootstrapStack.parameters ?? {};
  }

  public get terminationProtection(): boolean {
    return this.bootstrapStack.terminationProtection ?? false;
  }

  /**
   * Validate that the bootstrap stack version matches or exceeds the expected version
   *
   * Use the SSM parameter name to read the version number if given, otherwise use the version
   * discovered on the bootstrap stack.
   *
   * Pass in the SSM parameter name so we can cache the lookups an don't need to do the same
   * lookup again and again for every artifact.
   */
  public async validateVersion(expectedVersion: number, ssmParameterName: string | undefined) {
    let version = this.version; // Default to the current version, but will be overwritten by a lookup if required.

    if (ssmParameterName !== undefined) {
      try {
        version = await ToolkitInfo.versionFromSsmParameter(this.sdk, ssmParameterName, this.ssmCache);
      } catch (e: any) {
        if (e.code !== 'AccessDeniedException') { throw e; }

        // This is a fallback! The bootstrap template that goes along with this change introduces
        // a new 'ssm:GetParameter' permission, but when run using the previous bootstrap template we
        // won't have the permissions yet to read the version, so we won't be able to show the
        // message telling the user they need to update! When we see an AccessDeniedException, fall
        // back to the version we read from Stack Outputs; but ONLY if the version we discovered via
        // outputs is legitimately an old version. If it's newer than that, something else must be broken,
        // so let it fail as it would if we didn't have this fallback.
        if (this.version >= BOOTSTRAP_TEMPLATE_VERSION_INTRODUCING_GETPARAMETER) {
          throw e;
        }

        warning(`Could not read SSM parameter ${ssmParameterName}: ${e.message}`);
        // Fall through on purpose
      }
    }

    if (expectedVersion > version) {
      throw new Error(`This CDK deployment requires bootstrap stack version '${expectedVersion}', found '${version}'. Please run 'cdk bootstrap'.`);
    }
  }

  /**
   * Prepare an ECR repository for uploading to using Docker
   *
   */
  public async prepareEcrRepository(repositoryName: string): Promise<EcrRepositoryInfo> {
    if (!this.sdk) {
      throw new Error('ToolkitInfo needs to have been initialized with an sdk to call prepareEcrRepository');
    }
    const ecr = this.sdk.ecr();

    // check if repo already exists
    try {
      debug(`${repositoryName}: checking if ECR repository already exists`);
      const describeResponse = await ecr.describeRepositories({ repositoryNames: [repositoryName] }).promise();
      const existingRepositoryUri = describeResponse.repositories![0]?.repositoryUri;
      if (existingRepositoryUri) {
        return { repositoryUri: existingRepositoryUri };
      }
    } catch (e: any) {
      if (e.code !== 'RepositoryNotFoundException') { throw e; }
    }

    // create the repo (tag it so it will be easier to garbage collect in the future)
    debug(`${repositoryName}: creating ECR repository`);
    const assetTag = { Key: 'awscdk:asset', Value: 'true' };
    const response = await ecr.createRepository({ repositoryName, tags: [assetTag] }).promise();
    const repositoryUri = response.repository?.repositoryUri;
    if (!repositoryUri) {
      throw new Error(`CreateRepository did not return a repository URI for ${repositoryUri}`);
    }

    // configure image scanning on push (helps in identifying software vulnerabilities, no additional charge)
    debug(`${repositoryName}: enable image scanning`);
    await ecr.putImageScanningConfiguration({ repositoryName, imageScanningConfiguration: { scanOnPush: true } }).promise();

    return { repositoryUri };
  }

  private requireOutput(output: string): string {
    if (!(output in this.bootstrapStack.outputs)) {
      throw new Error(`The CDK toolkit stack (${this.bootstrapStack.stackName}) does not have an output named ${output}. Use 'cdk bootstrap' to correct this.`);
    }
    return this.bootstrapStack.outputs[output];
  }
}

/**
 * Returned when a bootstrap stack could not be found
 *
 * This is not an error in principle, UNTIL one of the members is called that requires
 * the bootstrap stack to have been found, in which case the lookup error is still thrown
 * belatedly.
 *
 * The errors below serve as a last stop-gap message--normally calling code should have
 * checked `toolkit.found` and produced an appropriate error message.
 */
class BootstrapStackNotFoundInfo extends ToolkitInfo {
  public readonly found = false;

  constructor(sdk: ISDK, private readonly errorMessage: string) {
    super(sdk);
  }

  public get bootstrapStack(): CloudFormationStack {
    throw new Error(this.errorMessage);
  }

  public get bucketUrl(): string {
    throw new Error(this.errorMessage);
  }

  public get bucketName(): string {
    throw new Error(this.errorMessage);
  }

  public get version(): number {
    throw new Error(this.errorMessage);
  }

  public get variant(): string {
    throw new Error(this.errorMessage);
  }

  public async validateVersion(expectedVersion: number, ssmParameterName: string | undefined): Promise<void> {
    if (ssmParameterName === undefined) {
      throw new Error(this.errorMessage);
    }

    let version: number;
    try {
      version = await ToolkitInfo.versionFromSsmParameter(this.sdk, ssmParameterName, this.ssmCache);
    } catch (e: any) {
      if (e.code !== 'AccessDeniedException') { throw e; }

      // This is a fallback! The bootstrap template that goes along with this change introduces
      // a new 'ssm:GetParameter' permission, but when run using a previous bootstrap template we
      // won't have the permissions yet to read the version, so we won't be able to show the
      // message telling the user they need to update! When we see an AccessDeniedException, fall
      // back to the version we read from Stack Outputs.
      warning(`Could not read SSM parameter ${ssmParameterName}: ${e.message}`);
      throw new Error(`This CDK deployment requires bootstrap stack version '${expectedVersion}', found an older version. Please run 'cdk bootstrap'.`);
    }

    if (expectedVersion > version) {
      throw new Error(`This CDK deployment requires bootstrap stack version '${expectedVersion}', found '${version}'. Please run 'cdk bootstrap'.`);
    }
  }

  public prepareEcrRepository(): Promise<EcrRepositoryInfo> {
    throw new Error(this.errorMessage);
  }
}

export interface EcrRepositoryInfo {
  repositoryUri: string;
}

export interface EcrCredentials {
  username: string;
  password: string;
  endpoint: string;
}
