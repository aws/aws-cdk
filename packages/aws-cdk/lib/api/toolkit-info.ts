import * as cxapi from '@aws-cdk/cx-api';
import * as colors from 'colors/safe';
import { debug } from '../logging';
import { ISDK } from './aws-auth';
import { BOOTSTRAP_VERSION_OUTPUT, BUCKET_DOMAIN_NAME_OUTPUT, BUCKET_NAME_OUTPUT } from './bootstrap';
import { stabilizeStack, CloudFormationStack } from './util/cloudformation';

export const DEFAULT_TOOLKIT_STACK_NAME = 'CDKToolkit';

/**
 * Information on the Bootstrap stack
 *
 * Called "ToolkitInfo" for historical reasons.
 *
 * @experimental
 */
export class ToolkitInfo {
  public static determineName(overrideName?: string) {
    return overrideName ?? DEFAULT_TOOLKIT_STACK_NAME;
  }

  /** @experimental */
  public static async lookup(environment: cxapi.Environment, sdk: ISDK, stackName: string | undefined): Promise<ToolkitInfo | undefined> {
    const cfn = sdk.cloudFormation();
    const stack = await stabilizeStack(cfn, stackName ?? DEFAULT_TOOLKIT_STACK_NAME);
    if (!stack) {
      debug('The environment %s doesn\'t have the CDK toolkit stack (%s) installed. Use %s to setup your environment for use with the toolkit.',
        environment.name, stackName, colors.blue(`cdk bootstrap "${environment.name}"`));
      return undefined;
    }
    if (stack.stackStatus.isCreationFailure) {
      // Treat a "failed to create" bootstrap stack as an absent one.
      debug('The environment %s has a CDK toolkit stack (%s) that failed to create. Use %s to try provisioning it again.',
        environment.name, stackName, colors.blue(`cdk bootstrap "${environment.name}"`));
      return undefined;
    }

    return new ToolkitInfo(stack, sdk);
  }

  constructor(public readonly stack: CloudFormationStack, private readonly sdk?: ISDK) {
  }

  public get bucketUrl() {
    return `https://${this.requireOutput(BUCKET_DOMAIN_NAME_OUTPUT)}`;
  }

  public get bucketName() {
    return this.requireOutput(BUCKET_NAME_OUTPUT);
  }

  public get version() {
    return parseInt(this.stack.outputs[BOOTSTRAP_VERSION_OUTPUT] ?? '0', 10);
  }

  public get parameters(): Record<string, string> {
    return this.stack.parameters ?? {};
  }

  /**
   * Prepare an ECR repository for uploading to using Docker
   *
   * @experimental
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
    } catch (e) {
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
    if (!(output in this.stack.outputs)) {
      throw new Error(`The CDK toolkit stack (${this.stack.stackName}) does not have an output named ${output}. Use 'cdk bootstrap' to correct this.`);
    }
    return this.stack.outputs[output];
  }
}

/** @experimental */
export interface EcrRepositoryInfo {
  repositoryUri: string;
}

/** @experimental */
export interface EcrCredentials {
  username: string;
  password: string;
  endpoint: string;
}
