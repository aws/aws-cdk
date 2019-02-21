import cxapi = require('@aws-cdk/cx-api');
import aws = require('aws-sdk');
import colors = require('colors/safe');
import { md5hash } from '../archive';
import { debug } from '../logging';
import { Mode } from './aws-auth/credentials';
import { BUCKET_DOMAIN_NAME_OUTPUT, BUCKET_NAME_OUTPUT  } from './bootstrap-environment';
import { waitForStack } from './util/cloudformation';
import { SDK } from './util/sdk';

export interface UploadProps {
  s3KeyPrefix?: string,
  s3KeySuffix?: string,
  contentType?: string,
}

export interface Uploaded {
  filename: string;
  key: string;
  changed: boolean;
}

export class ToolkitInfo {
  public readonly sdk: SDK;

  /**
   * A cache of previous uploads done in this session
   */
  private readonly previousUploads: {[key: string]: Uploaded} = {};

  constructor(private readonly props: {
    sdk: SDK,
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
   * Uploads a data blob to S3 under the specified key prefix.
   * Uses md5 hash to render the full key and skips upload if an object
   * already exists by this key.
   */
  public async uploadIfChanged(data: any, props: UploadProps): Promise<Uploaded> {
    const s3 = await this.props.sdk.s3(this.props.environment, Mode.ForWriting);

    const s3KeyPrefix = props.s3KeyPrefix || '';
    const s3KeySuffix = props.s3KeySuffix || '';

    const bucket = this.props.bucketName;

    const hash = md5hash(data);
    const filename = `${hash}${s3KeySuffix}`;
    const key = `${s3KeyPrefix}${filename}`;
    const url = `s3://${bucket}/${key}`;

    debug(`${url}: checking if already exists`);
    if (await objectExists(s3, bucket, key)) {
      debug(`${url}: found (skipping upload)`);
      return { filename, key, changed: false };
    }

    const uploaded = { filename, key, changed: true };

    // Upload if it's new or server-side copy if it was already uploaded previously
    const previous = this.previousUploads[hash];
    if (previous) {
      debug(`${url}: copying`);
      await s3.copyObject({
        Bucket: bucket,
        Key: key,
        CopySource: `${bucket}/${previous.key}`
      }).promise();
      debug(`${url}: copy complete`);
    } else {
      debug(`${url}: uploading`);
      await s3.putObject({
        Bucket: bucket,
        Key: key,
        Body: data,
        ContentType: props.contentType
      }).promise();
      debug(`${url}: upload complete`);
      this.previousUploads[hash] = uploaded;
    }

    return uploaded;
  }

  /**
   * Prepare an ECR repository for uploading to using Docker
   */
  public async prepareEcrRepository(assetId: string): Promise<EcrRepositoryInfo> {
    const ecr = await this.props.sdk.ecr(this.props.environment, Mode.ForWriting);

    // Repository name based on asset id
    const repositoryName = 'cdk/' + assetId.replace(/[:/]/g, '-').toLowerCase();

    let repository;
    try {
      debug(`${repositoryName}: checking for repository.`);
      const describeResponse = await ecr.describeRepositories({ repositoryNames: [repositoryName] }).promise();
      repository = describeResponse.repositories![0];
    } catch (e) {
      if (e.code !== 'RepositoryNotFoundException') { throw e; }
    }

    if (repository) {
      return {
        repositoryUri: repository.repositoryUri!,
        repositoryName
      };
    }

    debug(`${repositoryName}: creating`);
    const response = await ecr.createRepository({ repositoryName }).promise();
    repository = response.repository!;

    // Better put a lifecycle policy on this so as to not cost too much money
    await ecr.putLifecyclePolicy({
      repositoryName,
      lifecyclePolicyText: JSON.stringify(DEFAULT_REPO_LIFECYCLE)
    }).promise();

    return {
      repositoryUri: repository.repositoryUri!,
      repositoryName
    };
  }

  /**
   * Get ECR credentials
   */
  public async getEcrCredentials(): Promise<EcrCredentials> {
    const ecr = await this.props.sdk.ecr(this.props.environment, Mode.ForReading);

    debug(`Fetching ECR authorization token`);
    const authData =  (await ecr.getAuthorizationToken({ }).promise()).authorizationData || [];
    if (authData.length === 0) {
      throw new Error('No authorization data received from ECR');
    }
    const token = Buffer.from(authData[0].authorizationToken!, 'base64').toString('ascii');
    const [username, password] = token.split(':');

    return {
      username,
      password,
      endpoint: authData[0].proxyEndpoint!,
    };
  }

  /**
   * Check if image already exists in ECR repository
   */
  public async checkEcrImage(repositoryName: string, imageTag: string): Promise<boolean> {
    const ecr = await this.props.sdk.ecr(this.props.environment, Mode.ForReading);

    try {
      debug(`${repositoryName}: checking for image ${imageTag}`);
      await ecr.describeImages({ repositoryName, imageIds: [{ imageTag }] }).promise();

      // If we got here, the image already exists. Nothing else needs to be done.
      return true;
    } catch (e) {
      if (e.code !== 'ImageNotFoundException') { throw e; }
    }

    return false;
  }
}

export interface EcrRepositoryInfo {
  repositoryUri: string;
  repositoryName: string;
}

export interface EcrCredentials {
  username: string;
  password: string;
  endpoint: string;
}

async function objectExists(s3: aws.S3, bucket: string, key: string) {
  try {
    await s3.headObject({ Bucket: bucket, Key: key }).promise();
    return true;
  } catch (e) {
    if (e.code === 'NotFound') {
      return false;
    }

    throw e;
  }
}

export async function loadToolkitInfo(environment: cxapi.Environment, sdk: SDK, stackName: string): Promise<ToolkitInfo | undefined> {
  const cfn = await sdk.cloudFormation(environment, Mode.ForReading);
  const stack = await waitForStack(cfn, stackName);
  if (!stack) {
    debug('The environment %s doesn\'t have the CDK toolkit stack (%s) installed. Use %s to setup your environment for use with the toolkit.',
        environment.name, stackName, colors.blue(`cdk bootstrap "${environment.name}"`));
    return undefined;
  }
  return new ToolkitInfo({
    sdk, environment,
    bucketName: getOutputValue(stack, BUCKET_NAME_OUTPUT),
    bucketEndpoint: getOutputValue(stack, BUCKET_DOMAIN_NAME_OUTPUT)
  });
}

function getOutputValue(stack: aws.CloudFormation.Stack, output: string): string {
  let result: string | undefined;
  if (stack.Outputs) {
    const found = stack.Outputs.find(o => o.OutputKey === output);
    result = found && found.OutputValue;
  }
  if (result === undefined) {
    throw new Error(`The CDK toolkit stack (${stack.StackName}) does not have an output named ${output}. Use 'cdk bootstrap' to correct this.`);
  }
  return result;
}

const DEFAULT_REPO_LIFECYCLE = {
  rules: [
    {
      rulePriority: 100,
      description: 'Retain only 5 images',
      selection: {
        tagStatus: 'any',
        countType: 'imageCountMoreThan',
        countNumber: 5,
      },
      action: { type: 'expire' }
    }
  ]
};
