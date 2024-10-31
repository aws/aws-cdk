import {
  CloudFormationClient,
  DeleteStackCommand,
  DescribeStacksCommand,
  UpdateTerminationProtectionCommand,
  type Stack,
} from '@aws-sdk/client-cloudformation';
import { DeleteRepositoryCommand, ECRClient } from '@aws-sdk/client-ecr';
import { ECSClient } from '@aws-sdk/client-ecs';
import { IAMClient } from '@aws-sdk/client-iam';
import { LambdaClient } from '@aws-sdk/client-lambda';
import {
  S3Client,
  DeleteObjectsCommand,
  ListObjectVersionsCommand,
  type ObjectIdentifier,
  DeleteBucketCommand,
} from '@aws-sdk/client-s3';
import { SNSClient } from '@aws-sdk/client-sns';
import { SSOClient } from '@aws-sdk/client-sso';
import { STSClient, GetCallerIdentityCommand } from '@aws-sdk/client-sts';
import { fromIni } from '@aws-sdk/credential-providers';
import type { AwsCredentialIdentityProvider } from '@smithy/types';
import { ConfiguredRetryStrategy } from '@smithy/util-retry';
interface ClientConfig {
  readonly credentials?: AwsCredentialIdentityProvider;
  readonly region: string;
  readonly retryStrategy: ConfiguredRetryStrategy;
}

export class AwsClients {
  public static async default(output: NodeJS.WritableStream) {
    const region = process.env.AWS_REGION ?? process.env.AWS_DEFAULT_REGION ?? 'us-east-1';
    return AwsClients.forRegion(region, output);
  }

  public static async forRegion(region: string, output: NodeJS.WritableStream) {
    return new AwsClients(region, output);
  }

  private readonly config: ClientConfig;

  public readonly cloudFormation: CloudFormationClient;
  public readonly s3: S3Client;
  public readonly ecr: ECRClient;
  public readonly ecs: ECSClient;
  public readonly sso: SSOClient;
  public readonly sns: SNSClient;
  public readonly iam: IAMClient;
  public readonly lambda: LambdaClient;
  public readonly sts: STSClient;

  constructor(public readonly region: string, private readonly output: NodeJS.WritableStream) {
    this.config = {
      credentials: chainableCredentials(this.region),
      region: this.region,
      retryStrategy: new ConfiguredRetryStrategy(9, (attempt: number) => attempt ** 500),
    };
    this.cloudFormation = new CloudFormationClient(this.config);
    this.s3 = new S3Client(this.config);
    this.ecr = new ECRClient(this.config);
    this.ecs = new ECSClient(this.config);
    this.sso = new SSOClient(this.config);
    this.sns = new SNSClient(this.config);
    this.iam = new IAMClient(this.config);
    this.lambda = new LambdaClient(this.config);
    this.sts = new STSClient(this.config);
  }

  public async account(): Promise<string> {
    // Reduce # of retries, we use this as a circuit breaker for detecting no-config
    const stsClient = new STSClient({
      credentials: this.config.credentials,
      region: this.config.region,
      maxAttempts: 2,
    });

    return (await stsClient.send(new GetCallerIdentityCommand({}))).Account!;
  }

  public async deleteStacks(...stackNames: string[]) {
    if (stackNames.length === 0) {
      return;
    }

    // We purposely do all stacks serially, because they've been ordered
    // to do the bootstrap stack last.
    for (const stackName of stackNames) {
      await this.cloudFormation.send(
        new UpdateTerminationProtectionCommand({
          EnableTerminationProtection: false,
          StackName: stackName,
        }),
      );
      await this.cloudFormation.send(
        new DeleteStackCommand({
          StackName: stackName,
        }),
      );

      await retry(this.output, `Deleting ${stackName}`, retry.forSeconds(600), async () => {
        const status = await this.stackStatus(stackName);
        if (status !== undefined && status.endsWith('_FAILED')) {
          throw retry.abort(new Error(`'${stackName}' is in state '${status}'`));
        }
        if (status !== undefined) {
          throw new Error(`Delete of '${stackName}' not complete yet, status: '${status}'`);
        }
      });
    }
  }

  public async stackStatus(stackName: string): Promise<string | undefined> {
    try {
      return (
        await this.cloudFormation.send(
          new DescribeStacksCommand({
            StackName: stackName,
          }),
        )
      ).Stacks?.[0].StackStatus;
    } catch (e: any) {
      if (isStackMissingError(e)) {
        return undefined;
      }
      throw e;
    }
  }

  public async emptyBucket(bucketName: string, options?: { bypassGovernance?: boolean }) {
    const objects = await this.s3.send(
      new ListObjectVersionsCommand({
        Bucket: bucketName,
      }),
    );

    const deletes = [...(objects.Versions || []), ...(objects.DeleteMarkers || [])].reduce((acc, obj) => {
      if (typeof obj.VersionId !== 'undefined' && typeof obj.Key !== 'undefined') {
        acc.push({ Key: obj.Key, VersionId: obj.VersionId });
      } else if (typeof obj.Key !== 'undefined') {
        acc.push({ Key: obj.Key });
      }
      return acc;
    }, [] as ObjectIdentifier[]);

    if (deletes.length === 0) {
      return Promise.resolve();
    }

    return this.s3.send(
      new DeleteObjectsCommand({
        Bucket: bucketName,
        Delete: {
          Objects: deletes,
          Quiet: false,
        },
        BypassGovernanceRetention: options?.bypassGovernance ? true : undefined,
      }),
    );
  }

  public async deleteImageRepository(repositoryName: string) {
    await this.ecr.send(
      new DeleteRepositoryCommand({
        repositoryName: repositoryName,
        force: true,
      }),
    );
  }

  public async deleteBucket(bucketName: string) {
    try {
      await this.emptyBucket(bucketName);

      await this.s3.send(
        new DeleteBucketCommand({
          Bucket: bucketName,
        }),
      );
    } catch (e: any) {
      if (isBucketMissingError(e)) {
        return;
      }
      throw e;
    }
  }
}

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
export async function retry<A>(
  output: NodeJS.WritableStream,
  operation: string,
  deadline: Date,
  block: () => Promise<A>,
): Promise<A> {
  let i = 0;
  output.write(`💈 ${operation}\n`);
  while (true) {
    try {
      i++;
      const ret = await block();
      output.write(`💈 ${operation}: succeeded after ${i} attempts\n`);
      return ret;
    } catch (e: any) {
      if (e.abort || Date.now() > deadline.getTime()) {
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

export function outputFromStack(key: string, stack: Stack): string | undefined {
  return (stack.Outputs ?? []).find((o) => o.OutputKey === key)?.OutputValue;
}

export async function sleep(ms: number) {
  return new Promise((ok) => setTimeout(ok, ms));
}

function chainableCredentials(region: string): AwsCredentialIdentityProvider | undefined {
  if (process.env.CODEBUILD_BUILD_ARN && process.env.AWS_PROFILE) {
    // in codebuild we must assume the role that the cdk uses
    // otherwise credentials will just be picked up by the normal sdk
    // heuristics and expire after an hour.
    return fromIni({
      clientConfig: { region },
    });
  }

  return undefined;
}
