import * as cxapi from '@aws-cdk/cx-api';
import { ISDK, Mode, SdkProvider } from './aws-auth';
import { ToolkitInfo } from './toolkit-info';
import { S3 } from 'aws-sdk';

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

export class GarbageCollector {
  private garbageCollectS3Assets: boolean;
  private garbageCollectEcrAssets: boolean;
  private resolvedEnvironment: cxapi.Environment;
  private sdkProvider: SdkProvider;

  public constructor(props: GarbageCollectorProps) {
    this.garbageCollectS3Assets = props.type === 's3' || props.type === 'all';
    this.garbageCollectEcrAssets = props.type === 'ecr' || props.type === 'all';
    this.resolvedEnvironment = props.resolvedEnvironment;
    this.sdkProvider = props.sdkProvider;

    if (this.garbageCollectEcrAssets) {
      throw new Error('ECR garbage collection is not yet supported');
    }
  }

  public async garbageCollect() {
    // set up the sdks used in garbage collection
    const sdk = (await this.sdkProvider.forEnvironment(this.resolvedEnvironment, Mode.ForWriting)).sdk;
    const { cfn: _cfn, s3 } = this.setUpSDKs(sdk);

    if (this.garbageCollectS3Assets) {
      const bucket = await this.getBootstrapBucket(sdk);
      console.log(bucket);
      const objects = await this.collectObjects(s3, bucket);
      console.log(objects);
    }
  }

  private setUpSDKs(sdk: ISDK) {
    const cfn = sdk.cloudFormation();
    const s3 = sdk.s3();
    return {
      cfn,
      s3,
    };
  }

  private async getBootstrapBucket(sdk: ISDK) {
    const info = await ToolkitInfo.lookup(this.resolvedEnvironment, sdk, undefined);
    return info.bucketName;
  }

  private async collectObjects(s3: S3, bucket: string) {
    const objects: string[] = [];
    await paginateSdkCall(async (nextToken) => {
      const response = await s3.listObjectsV2({
        Bucket: bucket,
        ContinuationToken: nextToken,
      }).promise();
      response.Contents?.forEach((obj) => {
        objects.push(obj.Key ?? '');
      });
      return response.NextContinuationToken;
    });

    return objects;
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
