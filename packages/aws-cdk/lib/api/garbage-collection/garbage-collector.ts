import * as cxapi from '@aws-cdk/cx-api';
import { S3 } from 'aws-sdk';
import * as chalk from 'chalk';
import { debug, print } from '../../logging';
import { ISDK, Mode, SdkProvider } from '../aws-auth';
import { DEFAULT_TOOLKIT_STACK_NAME, ToolkitInfo } from '../toolkit-info';
import { ProgressPrinter } from './progress-printer';
import { ActiveAssetCache, BackgroundStackRefresh, refreshStacks } from './stack-refresh';

// Must use a require() otherwise esbuild complains
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pLimit: typeof import('p-limit') = require('p-limit');

const ISOLATED_TAG = 'aws-cdk:isolated';
const P_LIMIT = 50;
const DAY = 24 * 60 * 60 * 1000; // Number of milliseconds in a day

export class S3Asset {
  private cached_tags: S3.TagSet | undefined = undefined;

  public constructor(private readonly bucket: string, public readonly key: string, public readonly size: number) {}

  public fileName(): string {
    return this.key.split('.')[0];
  }

  public async allTags(s3: S3) {
    if (this.cached_tags) {
      return this.cached_tags;
    }

    const response = await s3.getObjectTagging({ Bucket: this.bucket, Key: this.key }).promise();
    this.cached_tags = response.TagSet;
    return response.TagSet;
  }

  private async getTag(s3: S3, tag: string) {
    const tags = await this.allTags(s3);
    return tags.find(t => t.Key === tag)?.Value;
  }

  private async hasTag(s3: S3, tag: string) {
    const tags = await this.allTags(s3);
    return tags.some(t => t.Key === tag);
  }

  public async noIsolatedTag(s3: S3) {
    return !(await this.hasTag(s3, ISOLATED_TAG));
  }

  public async isolatedTagBefore(s3: S3, date: Date) {
    const tagValue = await this.getTag(s3, ISOLATED_TAG);
    if (!tagValue || tagValue == '') {
      return false;
    }
    return new Date(tagValue) < date;
  }
}

/**
 * Props for the Garbage Collector
 */
interface GarbageCollectorProps {
  /**
   * The action to perform. Specify this if you want to perform a truncated set
   * of actions available.
   */
  readonly action: 'print' | 'tag' | 'delete-tagged' | 'full';

  /**
   * The type of asset to garbage collect.
   */
  readonly type: 's3' | 'ecr' | 'all';

  /**
   * The days an asset must be in isolation before being actually deleted.
   */
  readonly rollbackBufferDays: number;

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

  /**
   * The name of the bootstrap stack to look for.
   *
   * @default DEFAULT_TOOLKIT_STACK_NAME
   */
  readonly bootstrapStackName?: string;

  /**
   * Max wait time for retries in milliseconds (for testing purposes).
   *
   * @default 60000
   */
  readonly maxWaitTime?: number;
}

/**
 * A class to facilitate Garbage Collection of S3 and ECR assets
 */
export class GarbageCollector {
  private garbageCollectS3Assets: boolean;
  private garbageCollectEcrAssets: boolean;
  private permissionToDelete: boolean;
  private permissionToTag: boolean;
  private bootstrapStackName: string;
  private maxWaitTime: number;

  public constructor(readonly props: GarbageCollectorProps) {
    this.garbageCollectS3Assets = ['s3', 'all'].includes(props.type);
    this.garbageCollectEcrAssets = ['ecr', 'all'].includes(props.type);

    debug(`${this.garbageCollectS3Assets} ${this.garbageCollectEcrAssets}`);

    this.permissionToDelete = ['delete-tagged', 'full'].includes(props.action);
    this.permissionToTag = ['tag', 'full'].includes(props.action);
    this.maxWaitTime = props.maxWaitTime ?? 60000;

    this.bootstrapStackName = props.bootstrapStackName ?? DEFAULT_TOOLKIT_STACK_NAME;

    // TODO: ECR garbage collection
    if (this.garbageCollectEcrAssets) {
      throw new Error('ECR garbage collection is not yet supported');
    }
  }

  /**
   * Perform garbage collection on the resolved environment.
   */
  public async garbageCollect() {
    // SDKs
    const sdk = (await this.props.sdkProvider.forEnvironment(this.props.resolvedEnvironment, Mode.ForWriting)).sdk;
    const cfn = sdk.cloudFormation();
    const s3 = sdk.s3();

    const qualifier = await this.bootstrapQualifier(sdk, this.bootstrapStackName);
    const activeAssets = new ActiveAssetCache();

    // Grab stack templates first
    const startTime = Date.now();
    await refreshStacks(cfn, activeAssets, this.maxWaitTime, qualifier);
    // Start the background refresh
    const backgroundStackRefresh = new BackgroundStackRefresh({
      cfn,
      activeAssets,
      qualifier,
      maxWaitTime: this.maxWaitTime,
    });
    const timeout = setTimeout(backgroundStackRefresh.start, Math.max(startTime + 300_000 - Date.now(), 0));

    const bucket = await this.bootstrapBucketName(sdk, this.bootstrapStackName);
    const numObjects = await this.numObjectsInBucket(s3, bucket);
    const printer = new ProgressPrinter(numObjects, 1000);

    debug(`Found bootstrap bucket ${bucket}`);

    try {
      const batches = 1;
      const batchSize = 1000;
      const currentTime = Date.now();
      const graceDays = this.props.rollbackBufferDays;

      debug(`Parsing through ${numObjects} objects in batches`);

      // Process objects in batches of 1000
      // This is the batch limit of s3.DeleteObject and we intend to optimize for the "worst case" scenario
      // where gc is run for the first time on a long-standing bucket where ~100% of objects are isolated.
      for await (const batch of this.readBucketInBatches(s3, bucket, batchSize, currentTime)) {
        print(chalk.green(`Processing batch ${batches} of ${Math.floor(numObjects / batchSize) + 1}`));
        printer.start();

        const isolated = batch.filter((obj) => {
          return !activeAssets.contains(obj.fileName());
        });

        debug(`${isolated.length} isolated assets`);

        let deletables: S3Asset[] = isolated;
        let taggables: S3Asset[] = [];

        if (graceDays > 0) {
          debug('Filtering out assets that are not old enough to delete');
          await this.parallelReadAllTags(s3, isolated);
          // eslint-disable-next-line @cdklabs/promiseall-no-unbounded-parallelism
          deletables = await Promise.all(isolated.map(async (obj) => {
            const shouldDelete = await obj.isolatedTagBefore(s3, new Date(currentTime - (graceDays * DAY)));
            return shouldDelete ? obj : null;
          })).then(results => results.filter((obj): obj is S3Asset => obj !== null));

          // eslint-disable-next-line @cdklabs/promiseall-no-unbounded-parallelism
          taggables = await Promise.all(isolated.map(async (obj) => {
            const shouldTag = await obj.noIsolatedTag(s3);
            return shouldTag ? obj : null;
          })).then(results => results.filter((obj): obj is S3Asset => obj !== null));
        }

        debug(`${deletables.length} deletable assets`);
        debug(`${taggables.length} taggable assets`);

        if (this.permissionToDelete && deletables.length > 0) {
          await this.parallelDelete(s3, bucket, deletables, printer);
        }

        if (this.permissionToTag && taggables.length > 0) {
          await this.parallelTag(s3, bucket, taggables, currentTime, printer);
        }

        printer.reportScannedObjects(batch.length);

        // TODO: untag
      }
    } catch (err: any) {
      throw new Error(err);
    } finally {
      backgroundStackRefresh.stop();
      printer.stop();
      clearTimeout(timeout);
    }
  }

  private async parallelReadAllTags(s3: S3, objects: S3Asset[]) {
    const limit = pLimit(P_LIMIT);

    for (const obj of objects) {
      await limit(() => obj.allTags(s3));
    }
  }

  /**
   * Tag objects in parallel using p-limit. The putObjectTagging API does not
   * support batch tagging so we must handle the parallelism client-side.
   */
  private async parallelTag(s3: S3, bucket: string, taggables: S3Asset[], date: number, printer: ProgressPrinter) {
    const limit = pLimit(P_LIMIT);

    for (const obj of taggables) {
      await limit(() =>
        s3.putObjectTagging({
          Bucket: bucket,
          Key: obj.key,
          Tagging: {
            TagSet: [
              {
                Key: ISOLATED_TAG,
                Value: String(date),
              },
            ],
          },
        }).promise(),
      );
    }

    printer.reportTaggedObjects(taggables);
    debug(`Tagged ${taggables.length} assets`);
  }

  /**
   * Delete objects in parallel. The deleteObjects API supports batches of 1000.
   */
  private async parallelDelete(s3: S3, bucket: string, deletables: S3Asset[], printer: ProgressPrinter) {
    const objectsToDelete: S3.ObjectIdentifierList = deletables.map(asset => ({
      Key: asset.key,
    }));

    try {
      await s3.deleteObjects({
        Bucket: bucket,
        Delete: {
          Objects: objectsToDelete,
          Quiet: true,
        },
      }).promise();

      debug(`Deleted ${deletables.length} assets`);
      printer.reportDeletedObjects(deletables);
    } catch (err) {
      print(chalk.red(`Error deleting objects: ${err}`));
    }
  }

  private async bootstrapBucketName(sdk: ISDK, bootstrapStackName: string): Promise<string> {
    const info = await ToolkitInfo.lookup(this.props.resolvedEnvironment, sdk, bootstrapStackName);
    return info.bucketName;
  }

  private async bootstrapQualifier(sdk: ISDK, bootstrapStackName: string): Promise<string | undefined> {
    const info = await ToolkitInfo.lookup(this.props.resolvedEnvironment, sdk, bootstrapStackName);
    return info.bootstrapStack.parameters.Qualifier;
  }

  private async numObjectsInBucket(s3: S3, bucket: string): Promise<number> {
    const response = await s3.listObjectsV2({ Bucket: bucket }).promise();
    return response.KeyCount ?? 0;
  }

  /**
   * Generator function that reads objects from the S3 Bucket in batches.
   */
  private async *readBucketInBatches(s3: S3, bucket: string, batchSize: number = 1000, currentTime: number): AsyncGenerator<S3Asset[]> {
    let continuationToken: string | undefined;

    do {
      const batch: S3Asset[] = [];

      while (batch.length < batchSize) {
        const response = await s3.listObjectsV2({
          Bucket: bucket,
          ContinuationToken: continuationToken,
        }).promise();

        response.Contents?.forEach((obj) => {
          const key = obj.Key ?? '';
          const size = obj.Size ?? 0;
          const lastModified = obj.LastModified?.getTime() ?? Date.now();
          // Store the object if it has a Key and if it has not been modified since the start of garbage collection
          if (key && lastModified < currentTime) {
            batch.push(new S3Asset(bucket, key, size));
          }
        });

        continuationToken = response.NextContinuationToken;

        if (!continuationToken) break; // No more objects to fetch
      }

      if (batch.length > 0) {
        yield batch;
      }
    } while (continuationToken);
  }
}
