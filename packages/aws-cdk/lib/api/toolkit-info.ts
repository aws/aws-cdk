import * as cxapi from '@aws-cdk/cx-api';
import * as aws from 'aws-sdk';
import * as colors from 'colors/safe';
import { debug } from '../logging';
import { SdkProvider } from './aws-auth';
import { Mode } from './aws-auth/credentials';
import { BUCKET_DOMAIN_NAME_OUTPUT, BUCKET_NAME_OUTPUT  } from './bootstrap-environment';
import { waitForStack } from './util/cloudformation';

/** @experimental */
export class ToolkitInfo {
  public readonly sdk: SdkProvider;

  constructor(private readonly props: {
    readonly sdk: SdkProvider,
    bucketName: string,
    bucketEndpoint: string,
    environment: cxapi.Environment
  }) {
    this.sdk = props.sdk;
  }

  public get bucketUrl() {
    return `https://${this.props.bucketEndpoint}`;
  }

  public get bucketName() {
    return this.props.bucketName;
  }

  /**
   * Prepare an ECR repository for uploading to using Docker
   *
   * @experimental
   */
  public async prepareEcrRepository(repositoryName: string): Promise<EcrRepositoryInfo> {
    const ecr = await this.ecr();

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
    const response = await ecr.createRepository({ repositoryName, tags: [ assetTag ] }).promise();
    const repositoryUri = response.repository?.repositoryUri;
    if (!repositoryUri) {
      throw new Error(`CreateRepository did not return a repository URI for ${repositoryUri}`);
    }

    // configure image scanning on push (helps in identifying software vulnerabilities, no additional charge)
    debug(`${repositoryName}: enable image scanning`);
    await ecr.putImageScanningConfiguration({ repositoryName, imageScanningConfiguration: { scanOnPush: true } }).promise();

    return { repositoryUri };
  }

  private async ecr() {
    return (await this.props.sdk.forEnvironment(this.props.environment.account, this.props.environment.region, Mode.ForWriting)).ecr();
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

/** @experimental */
export async function loadToolkitInfo(environment: cxapi.Environment, sdk: SdkProvider, stackName: string): Promise<ToolkitInfo | undefined> {
  const cfn = (await sdk.forEnvironment(environment.account, environment.region, Mode.ForReading)).cloudFormation();
  const stack = await waitForStack(cfn, stackName);
  if (!stack) {
    debug('The environment %s doesn\'t have the CDK toolkit stack (%s) installed. Use %s to setup your environment for use with the toolkit.',
        environment.name, stackName, colors.blue(`cdk bootstrap "${environment.name}"`));
    return undefined;
  }

  const outputs = stackOutputs(stack);

  return new ToolkitInfo({
    sdk, environment,
    bucketName: requireOutput(BUCKET_NAME_OUTPUT),
    bucketEndpoint: requireOutput(BUCKET_DOMAIN_NAME_OUTPUT),
  });

  function requireOutput(output: string): string {
    if (!(output in outputs)) {
      throw new Error(`The CDK toolkit stack (${stack!.StackName}) does not have an output named ${output}. Use 'cdk bootstrap' to correct this.`);
    }
    return outputs[output];
  }
}

/**
 * Return the stack outputs as a map
 */
function stackOutputs(stack: aws.CloudFormation.Stack): Record<string, string> {
  const ret: Record<string, string> = {};

  for (const output of stack.Outputs || []) {
    if (output.OutputKey) {
      ret[output.OutputKey] = output.OutputValue ?? '';
    }
  }

  return ret;
}
