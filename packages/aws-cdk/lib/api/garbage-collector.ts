import * as cxapi from '@aws-cdk/cx-api';
import { ISDK, Mode, SdkProvider } from './aws-auth';
import { ToolkitInfo } from './toolkit-info';
import { CloudFormation, S3 } from 'aws-sdk';
import path = require('path');

/**
 * Props for the Garbage Collector
 */
interface GarbageCollectorProps {
  /**
   * If this property is set, then instead of garbage collecting, we will
   * print the isolated asset hashes.
   *
   * @default false
   */
  readonly dryRun: boolean;

  /**
   * If this property is set, then we will tag assets as isolated but skip
   * the actual asset deletion process.
   *
   * @default false
   */
  readonly tagOnly: boolean;

  /**
   * The type of asset to garbage collect.
   *
   * @default 'all'
   */
  readonly type: 's3' | 'ecr' | 'all';

  /**
   * The days an asset must be in isolation before being actually deleted.
   *
   * @default 0
   */
  readonly isolationDays: number;

  /**
   * The environment to deploy this stack in
   *
   * The environment on the stack artifact may be unresolved, this one
   * must be resolved.
   */
  readonly resolvedEnvironment: cxapi.Environment;

  /**
    * SDK provider (seeded with default credentials)
    *
    * Will be used to make SDK calls to CloudFormation, S3, and ECR.
    */
  readonly sdkProvider: SdkProvider;
}

/**
 * A class to facilitate Garbage Collection of S3 and ECR assets
 */
export class GarbageCollector {
  private readonly inUseHashes: Set<string> = new Set();
  private readonly objectHashes: Set<string> = new Set();

  private garbageCollectS3Assets: boolean;
  private garbageCollectEcrAssets: boolean;
  private resolvedEnvironment: cxapi.Environment;
  private sdkProvider: SdkProvider;

  public constructor(props: GarbageCollectorProps) {
    this.garbageCollectS3Assets = props.type === 's3' || props.type === 'all';
    this.garbageCollectEcrAssets = props.type === 'ecr' || props.type === 'all';
    this.resolvedEnvironment = props.resolvedEnvironment;
    this.sdkProvider = props.sdkProvider;

    // TODO: ECR garbage collection
    if (this.garbageCollectEcrAssets) {
      throw new Error('ECR garbage collection is not yet supported');
    }
  }

  /**
   * Perform garbage collection on the resolved environment(s)
   */
  public async garbageCollect() {
    // set up the sdks used in garbage collection
    const sdk = (await this.sdkProvider.forEnvironment(this.resolvedEnvironment, Mode.ForWriting)).sdk;
    const { cfn, s3 } = this.setUpSDKs(sdk);

    if (this.garbageCollectS3Assets) {
      const bucket = await this.getBootstrapBucket(sdk);
      console.log(bucket);
      await this.collectObjects(s3, bucket);
      console.log(this.objectHashes);
    }

    await this.collectHashes(cfn);
    console.log(this.inUseHashes);

    console.log(setDifference(this.objectHashes, this.inUseHashes));

    // TODO: match asset hashes with object keys
    // TODO: tag isolated assets 
  }

  private setUpSDKs(sdk: ISDK) {
    const cfn = sdk.cloudFormation();
    const s3 = sdk.s3();
    return {
      cfn,
      s3,
    };
  }

  private async collectHashes(cfn: CloudFormation) {
    const stackNames: string[] = [];
    await paginateSdkCall(async (nextToken) => {
      const response = await cfn.listStacks({ NextToken: nextToken }).promise();
      stackNames.push(...(response.StackSummaries ?? []).map(s => s.StackId ?? s.StackName));
      return response.NextToken;
    });

    console.log(`Parsing through ${stackNames.length} stacks`);

    for (const stack of stackNames) {
      const template = await cfn.getTemplate({
        StackName: stack,
      }).promise();

      const templateHashes = template.TemplateBody?.match(/[a-f0-9]{64}/g);
      templateHashes?.forEach(this.inUseHashes.add, this.inUseHashes);
    }

    console.log(`Found ${this.inUseHashes.size} unique hashes`);
  }

  private async getBootstrapBucket(sdk: ISDK) {
    const info = await ToolkitInfo.lookup(this.resolvedEnvironment, sdk, undefined);
    return info.bucketName;
  }

  private async collectObjects(s3: S3, bucket: string) {
    await paginateSdkCall(async (nextToken) => {
      const response = await s3.listObjectsV2({
        Bucket: bucket,
        ContinuationToken: nextToken,
      }).promise();
      response.Contents?.forEach((obj) => {
        this.objectHashes.add(path.parse(obj.Key ?? '').name);
      });
      return response.NextContinuationToken;
    });
  }
}

async function paginateSdkCall(cb: (nextToken?: string) => Promise<string | undefined>) {
  let finished = false;
  let nextToken: string | undefined;
  while (!finished) {
    nextToken = await cb(nextToken);
    if (nextToken === undefined) {
      finished = true;
    }
  }
}

function setDifference<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  let difference = new Set(setA);
  for (let elem of setB) {
    difference.delete(elem);
  }
  return difference;
}
