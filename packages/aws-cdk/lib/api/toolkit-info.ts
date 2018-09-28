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
  constructor(private readonly props: {
    sdk: SDK,
    bucketName: string,
    bucketEndpoint: string,
    environment: cxapi.Environment
  }) { }

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

    debug(`${url}: uploading`);
    await s3.putObject({
      Bucket: bucket,
      Key: key,
      Body: data,
      ContentType: props.contentType
    }).promise();

    debug(`${url}: upload complete`);

    return { filename, key, changed: true };
  }

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
