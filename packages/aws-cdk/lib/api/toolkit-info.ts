import * as cxapi from '@aws-cdk/cx-api';
import * as colors from 'colors/safe';
import { debug } from '../logging';
import { ISDK } from './aws-auth';
import { BOOTSTRAP_VERSION_OUTPUT } from './bootstrap';
import { stabilizeStack, CloudFormationStack } from './util/cloudformation';

export const DEFAULT_TOOLKIT_STACK_NAME = 'CDKToolkit';

export class ToolkitStackInfo {
  public static determineName(overrideName?: string) {
    return overrideName ?? DEFAULT_TOOLKIT_STACK_NAME;
  }

  public static async lookup(environment: cxapi.Environment, sdk: ISDK, stackName: string | undefined): Promise<ToolkitStackInfo | undefined> {
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

    return new ToolkitStackInfo(stack);
  }

  constructor(public readonly stack: CloudFormationStack) {
  }

  public get version() {
    return parseInt(this.stack.outputs[BOOTSTRAP_VERSION_OUTPUT] ?? '0', 10);
  }

  public get parameters(): Record<string, string> {
    return this.stack.parameters ?? {};
  }

}

interface ToolkitResorcesInfoProps {
  bucketName: string;
  bucketDomainName: string;
  version: number;
}

/**
 * Information on the Bootstrap stack
 *
 * Called "ToolkitInfo" for historical reasons.
 *
 * @experimental
 */
export class ToolkitResourcesInfo {
  /** @experimental */
  public static async lookup(environment: cxapi.Environment, sdk: ISDK, qualifier?: string): Promise<ToolkitResourcesInfo | undefined> {
    const ssm = sdk.ssm();
    const qualifierValue = qualifier ?? 'hnb659fds';
    const bucketName = (await ssm.getParameter({ Name: `/cdk-bootstrap/${qualifierValue}/bucket-name` }).promise()).Parameter?.Value;
    const bucketDomainName = (await ssm.getParameter({ Name: `/cdk-bootstrap/${qualifierValue}/bucket-domain-name` }).promise()).Parameter?.Value;
    const version = parseInt((await ssm.getParameter({ Name: `/cdk-bootstrap/${qualifierValue}/version` }).promise()).Parameter?.Value ?? '0', 10);


    if (bucketName === undefined || bucketDomainName === undefined || version == 0) {
      debug('The environment %s doesn\'t have the CDK toolkit stack installed. Use %s to setup your environment for use with the toolkit.',
        environment.name, colors.blue(`cdk bootstrap "${environment.name}"`));
      return undefined;
    }

    return new ToolkitResourcesInfo(sdk, { bucketName, bucketDomainName, version });
  }

  public readonly bucketName: string;
  public readonly bucketUrl: string;
  public readonly version: number;

  constructor(private readonly sdk: ISDK, { bucketName, bucketDomainName, version }: ToolkitResorcesInfoProps) {
    this.bucketName = bucketName;
    this.bucketUrl = `https://${bucketDomainName}`;
    this.version = version;
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
