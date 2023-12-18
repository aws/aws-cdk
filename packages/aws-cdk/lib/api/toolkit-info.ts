import * as cxapi from '@aws-cdk/cx-api';
import * as chalk from 'chalk';
import { ISDK } from './aws-auth';
import { BOOTSTRAP_VERSION_OUTPUT, BUCKET_DOMAIN_NAME_OUTPUT, BUCKET_NAME_OUTPUT, BOOTSTRAP_VARIANT_PARAMETER, DEFAULT_BOOTSTRAP_VARIANT } from './bootstrap/bootstrap-props';
import { stabilizeStack, CloudFormationStack } from './util/cloudformation';
import { debug } from '../logging';

export const DEFAULT_TOOLKIT_STACK_NAME = 'CDKToolkit';

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
    stackName = ToolkitInfo.determineName(stackName);
    try {
      const stack = await stabilizeStack(cfn, stackName);
      if (!stack) {
        debug('The environment %s doesn\'t have the CDK toolkit stack (%s) installed. Use %s to setup your environment for use with the toolkit.',
          environment.name, stackName, chalk.blue(`cdk bootstrap "${environment.name}"`));
        return ToolkitInfo.bootstrapStackNotFoundInfo(stackName);
      }
      if (stack.stackStatus.isCreationFailure) {
        // Treat a "failed to create" bootstrap stack as an absent one.
        debug('The environment %s has a CDK toolkit stack (%s) that failed to create. Use %s to try provisioning it again.',
          environment.name, stackName, chalk.blue(`cdk bootstrap "${environment.name}"`));
        return ToolkitInfo.bootstrapStackNotFoundInfo(stackName);
      }

      return new ExistingToolkitInfo(stack);
    } catch (e: any) {
      return ToolkitInfo.bootstrapStackLookupError(stackName, e);
    }
  }

  public static fromStack(stack: CloudFormationStack): ToolkitInfo {
    return new ExistingToolkitInfo(stack);
  }

  public static bootstrapStackNotFoundInfo(stackName: string): ToolkitInfo {
    return new BootstrapStackNotFoundInfo(stackName, 'This deployment requires a bootstrap stack with a known name; pass \'--toolkit-stack-name\' or switch to using the \'DefaultStackSynthesizer\' (see https://docs.aws.amazon.com/cdk/latest/guide/bootstrapping.html)');
  }

  public static bootstrapStackLookupError(stackName: string, e: Error): ToolkitInfo {
    return new BootstrapStackNotFoundInfo(stackName, `This deployment requires a bootstrap stack with a known name, but during its lookup the following error occurred: ${e}; pass \'--toolkit-stack-name\' or switch to using the \'DefaultStackSynthesizer\' (see https://docs.aws.amazon.com/cdk/latest/guide/bootstrapping.html)`);
  }

  public abstract readonly found: boolean;
  public abstract readonly bucketUrl: string;
  public abstract readonly bucketName: string;
  public abstract readonly version: number;
  public abstract readonly variant: string;
  public abstract readonly bootstrapStack: CloudFormationStack;
  public abstract readonly stackName: string;

  constructor() {
  }
}

/**
 * Returned when a bootstrap stack is found
 */
class ExistingToolkitInfo extends ToolkitInfo {
  public readonly found = true;

  constructor(public readonly bootstrapStack: CloudFormationStack) {
    super();
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

  public get stackName(): string {
    return this.bootstrapStack.stackName;
  }

  /**
   * Prepare an ECR repository for uploading to using Docker
   *
   */
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

  constructor(public readonly stackName: string, private readonly errorMessage: string) {
    super();
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
