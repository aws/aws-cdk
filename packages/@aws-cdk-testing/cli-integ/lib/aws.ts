import { CloudFormationClient, DeleteStackCommand, DescribeStacksCommand, UpdateTerminationProtectionCommand } from '@aws-sdk/client-cloudformation';
import { ECRClient } from '@aws-sdk/client-ecr';
import { ECSClient } from '@aws-sdk/client-ecs';
import { IAMClient } from '@aws-sdk/client-iam';
import { LambdaClient } from '@aws-sdk/client-lambda';
import { S3Client } from '@aws-sdk/client-s3';
import { SNSClient } from '@aws-sdk/client-sns';
import { STSClient, GetCallerIdentityCommand } from '@aws-sdk/client-sts';
import * as AWS from 'aws-sdk';

// eslint-disable-next-line @typescript-eslint/no-require-imports
require('aws-sdk/lib/maintenance_mode_message').suppress = true;

export class AwsClients {
  public static async default(output: NodeJS.WritableStream) {
    const region = process.env.AWS_REGION ?? process.env.AWS_DEFAULT_REGION ?? 'us-east-1';
    return AwsClients.forRegion(region, output);
  }

  public static async forRegion(region: string, output: NodeJS.WritableStream) {
    return new AwsClients(region, output);
  }

  // TODO Can this be type safe instead on any with sdk v3
  private readonly config: any;

  // TODO Reduce these commands to particular operations since it decreases bundle size
  public readonly cloudFormation: CloudFormationClient;
  public readonly s3: S3Client;
  public readonly ecr: ECRClient;
  public readonly ecs: ECSClient;
  public readonly sns: SNSClient;
  public readonly iam: IAMClient;
  public readonly lambda: LambdaClient;
  public readonly sts: STSClient;

  constructor(public readonly region: string, private readonly output: NodeJS.WritableStream) {
    this.config = {
      // TODO
      credentials: chainableCredentials(this.region),
      region: this.region,
      maxAttempts: 9, // maxAttempts = 1 + maxRetries
    };

    this.cloudFormation = new CloudFormationClient(this.config);
    this.s3 = new S3Client(this.config);
    this.ecr = new ECRClient(this.config);
    this.ecs = new ECSClient(this.config);
    this.sns = new SNSClient(this.config);
    this.iam = new IAMClient(this.config);
    this.lambda = new LambdaClient(this.config);
    this.sts = new STSClient(this.config);
  }

  public async account(): Promise<string> {
    // Reduce # of retries, we use this as a circuit breaker for detecting no-config
    const client = new STSClient({
      ...this.config,
      maxAttempts: 2,
    });
    const command = new GetCallerIdentityCommand({});

    // TODO return (await new AWS.STS({ ...this.config, maxRetries: 1 }).getCallerIdentity().promise()).Account!;
    return (await client.send(command)).Account!;
  }

  public async deleteStacks(...stackNames: string[]) {
    if (stackNames.length === 0) { return; }

    // We purposely do all stacks serially, because they've been ordered
    // to do the bootstrap stack last.
    for (const stackName of stackNames) {
      await this.cloudFormation.send(new UpdateTerminationProtectionCommand({
        EnableTerminationProtection: false,
        StackName: stackName,
      }));
      await this.cloudFormation.send(new DeleteStackCommand({
        StackName: stackName,
      }));

      // TODO confirm at end that all is good
      await retry(this.output, `Deleting ${stackName}`, retry.forSeconds(600), async () => {
        const status = await this.stackStatus(stackName);
        if (status !== undefined && status.endsWith('_FAILED')) {
          throw retry.abort(new Error(`'${stackName}' is in state '${status}'`));
        }
        if (status !== undefined) {
          throw new Error(`Delete of '${stackName}' not complete yet`);
        }
      });
    }
  }

  public async stackStatus(stackName: string): Promise<string | undefined> {
    try {
      return (await this.cloudFormation.send(new DescribeStacksCommand({
        StackName: stackName,
      }))).Stacks?.[0].StackStatus;
    } catch (e: any) { // TODO confirm these errors make sense in sdk v3
      if (isStackMissingError(e)) { return undefined; }
      throw e;
    }
  }

  public async emptyBucket(bucketName: string) {
    const objects = await this.s3('listObjectVersions', { Bucket: bucketName });
    const deletes = [...objects.Versions || [], ...objects.DeleteMarkers || []]
      .reduce((acc, obj) => {
        if (typeof obj.VersionId !== 'undefined' && typeof obj.Key !== 'undefined') {
          acc.push({ Key: obj.Key, VersionId: obj.VersionId });
        } else if (typeof obj.Key !== 'undefined') {
          acc.push({ Key: obj.Key });
        }
        return acc;
      }, [] as AWS.S3.ObjectIdentifierList);
    if (deletes.length === 0) {
      return Promise.resolve();
    }
    return this.s3('deleteObjects', {
      Bucket: bucketName,
      Delete: {
        Objects: deletes,
        Quiet: false,
      },
    });
  }

  public async deleteImageRepository(repositoryName: string) {
    await this.ecr('deleteRepository', { repositoryName, force: true });
  }

  public async deleteBucket(bucketName: string) {
    try {
      await this.emptyBucket(bucketName);
      await this.s3('deleteBucket', {
        Bucket: bucketName,
      });
    } catch (e: any) {
      if (isBucketMissingError(e)) { return; }
      throw e;
    }
  }
}

/**
 * Perform an AWS call from nothing
 *
 * Create the correct client, do the call and resole the promise().
 */
async function awsCall<
  Svc extends AWS.Service,
  Calls extends ServiceCalls<Svc>,
  Call extends keyof Calls,
// eslint-disable-next-line @typescript-eslint/no-shadow
>(ctor: new (config: any) => Svc, config: any, call: Call, request: First<Calls[Call]>): Promise<Second<Calls[Call]>> {
  const cfn = new ctor(config);
  const response = ((cfn as any)[call] as any)(request);
  try {
    return response.promise();
  } catch (e: any) {
    const newErr = new Error(`${String(call)}(${JSON.stringify(request)}): ${e.message}`);
    (newErr as any).code = e.code;
    throw newErr;
  }
}

/**
 * Factory function to invoke 'awsCall' for specific services.
 *
 * Not strictly necessary but calling this replaces a whole bunch of annoying generics you otherwise have to type:
 *
 * ```ts
 * export function cloudFormation<
 *   C extends keyof ServiceCalls<AWS.CloudFormation>,
 * >(call: C, request: First<ServiceCalls<AWS.CloudFormation>[C]>): Promise<Second<ServiceCalls<AWS.CloudFormation>[C]>> {
 *   return awsCall(AWS.CloudFormation, call, request);
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-shadow
function makeAwsCaller<A extends AWS.Service>(ctor: new (config: any) => A, config: any): AwsCaller<A> {
  return <B extends keyof ServiceCalls<A>>(call: B, request: First<ServiceCalls<A>[B]>): Promise<Second<ServiceCalls<A>[B]>> => {
    return awsCall(ctor, config, call, request);
  };
}

type ServiceCalls<T> = NoNayNever<SimplifiedService<T>>;
// Map ever member in the type to the important AWS call overload, or to 'never'
type SimplifiedService<T> = {[k in keyof T]: AwsCallIO<T[k]>};
// Remove all 'never' types from an object type
type NoNayNever<T> = Pick<T, {[k in keyof T]: T[k] extends never ? never : k }[keyof T]>;

// Because of the overloads an AWS handler type looks like this:
//
//   {
//      (params: INPUTSTRUCT, callback?: ((err: AWSError, data: {}) => void) | undefined): Request<OUTPUT, ...>;
//      (callback?: ((err: AWS.AWSError, data: {}) => void) | undefined): AWS.Request<...>;
//   }
//
// Get the first overload and extract the input and output struct types
type AwsCallIO<T> =
  T extends {
    (args: infer INPUT, callback?: ((err: AWS.AWSError, data: any) => void) | undefined): AWS.Request<infer OUTPUT, AWS.AWSError>;
    (callback?: ((err: AWS.AWSError, data: {}) => void) | undefined): AWS.Request<any, any>;
  } ? [INPUT, OUTPUT] : never;

type First<T> = T extends [any, any] ? T[0] : never;
type Second<T> = T extends [any, any] ? T[1] : never;

// TODO do these align with new errors in sdk v3?
export function isStackMissingError(e: Error) {
  return e.message.indexOf('does not exist') > -1;
}

export function isBucketMissingError(e: Error) {
  return e.message.indexOf('does not exist') > -1;
}

/**
 * Retry an async operation until a deadline is hit.
 *
 * Use `retry.forSeconds()` to construct a deadline relative to right now.
 *
 * Exceptions will cause the operation to retry. Use `retry.abort` to annotate an exception
 * to stop the retry and end in a failure.
 */
export async function retry<A>(output: NodeJS.WritableStream, operation: string, deadline: Date, block: () => Promise<A>): Promise<A> {
  let i = 0;
  output.write(`💈 ${operation}\n`);
  while (true) {
    try {
      i++;
      const ret = await block();
      output.write(`💈 ${operation}: succeeded after ${i} attempts\n`);
      return ret;
    } catch (e: any) {
      if (e.abort || Date.now() > deadline.getTime( )) {
        throw new Error(`${operation}: did not succeed after ${i} attempts: ${e}`);
      }
      output.write(`⏳ ${operation} (${e.message})\n`);
      await sleep(5000);
    }
  }
}

/**
 * Make a deadline for the `retry` function relative to the current time.
 */
retry.forSeconds = (seconds: number): Date => {
  return new Date(Date.now() + seconds * 1000);
};

/**
 * Annotate an error to stop the retrying
 */
retry.abort = (e: Error): Error => {
  (e as any).abort = true;
  return e;
};

export function outputFromStack(key: string, stack: AWS.CloudFormation.Stack): string | undefined {
  return (stack.Outputs ?? []).find(o => o.OutputKey === key)?.OutputValue;
}

export async function sleep(ms: number) {
  return new Promise(ok => setTimeout(ok, ms));
}

function chainableCredentials(region: string): AWS.Credentials | undefined {

  const profileName = process.env.AWS_PROFILE;
  if (process.env.CODEBUILD_BUILD_ARN && profileName) {

    // in codebuild we must assume the role that the cdk uses
    // otherwise credentials will just be picked up by the normal sdk
    // heuristics and expire after an hour.

    // can't use '~' since the SDK doesn't seem to expand it...?

    // TODO: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-credential-providers/#fromini
    const configPath = `${process.env.HOME}/.aws/config`;
    const ini = new AWS.IniLoader().loadFrom({
      filename: configPath,
      isConfig: true,
    });

    const profile = ini[profileName];

    if (!profile) {
      throw new Error(`Profile '${profileName}' does not exist in config file (${configPath})`);
    }

    const arn = profile.role_arn;
    const externalId = profile.external_id;

    if (!arn) {
      throw new Error(`role_arn does not exist in profile ${profileName}`);
    }

    if (!externalId) {
      throw new Error(`external_id does not exist in profile ${externalId}`);
    }

    // TODO: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/migrating/notable-changes/

    return new AWS.ChainableTemporaryCredentials({
      params: {
        RoleArn: arn,
        ExternalId: externalId,
        RoleSessionName: 'integ-tests',
      },
      stsConfig: {
        region,
      },
      // TODO: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/migrating/notable-changes/
      masterCredentials: new AWS.ECSCredentials(),
    });
  }

  return undefined;
}
