import * as crypto from 'node:crypto';
import * as cxapi from '@aws-cdk/cx-api';
import { S3 } from 'aws-sdk';
import * as chalk from 'chalk';
import * as promptly from 'promptly';
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
    return this.cached_tags;
  }

  private getTag(tag: string) {
    if (!this.cached_tags) {
      throw new Error('Cannot call getTag before allTags');
    }
    return this.cached_tags.find(t => t.Key === tag)?.Value;
  }

  private hasTag(tag: string) {
    if (!this.cached_tags) {
      throw new Error('Cannot call hasTag before allTags');
    }
    return this.cached_tags.some(t => t.Key === tag);
  }

  public hasIsolatedTag() {
    return this.hasTag(ISOLATED_TAG);
  }

  public isolatedTagBefore(date: Date) {
    const tagValue = this.getTag(ISOLATED_TAG);
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
   * Refuse deletion of any assets younger than this number of days.
   */
  readonly createdBufferDays: number;

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
   * Confirm with the user before actual deletion happens
   *
   * @default true
   */
  readonly confirm?: boolean;
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
  private confirm: boolean;

  public constructor(readonly props: GarbageCollectorProps) {
    this.garbageCollectS3Assets = ['s3', 'all'].includes(props.type);
    this.garbageCollectEcrAssets = ['ecr', 'all'].includes(props.type);

    debug(`${this.garbageCollectS3Assets} ${this.garbageCollectEcrAssets}`);

    this.permissionToDelete = ['delete-tagged', 'full'].includes(props.action);
    this.permissionToTag = ['tag', 'full'].includes(props.action);
    this.confirm = props.confirm ?? true;

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

    // Some S3 APIs in SDKv2 have a bug that always requires them to use a MD5 checksum.
    // These APIs are not going to be supported in a FIPS environment.
    // We fail with a nice error message.
    // Once we switch this code to SDKv3, this can be made work again by adding
    // `ChecksumAlgorithm: 'SHA256'` to the affected APIs.
    // Currently known to affect only DeleteObjects (note the plural)
    if (crypto.getFips() === 1) {
      throw new Error('Garbage Collection is currently not supported in FIPS environments');
    }
    const s3 = sdk.s3({
      needsMd5Checksums: true,
    });

    const qualifier = await this.bootstrapQualifier(sdk, this.bootstrapStackName);
    const activeAssets = new ActiveAssetCache();

    // Grab stack templates first
    await refreshStacks(cfn, activeAssets, qualifier);
    // Start the background refresh
    const backgroundStackRefresh = new BackgroundStackRefresh({
      cfn,
      activeAssets,
      qualifier,
    });
    backgroundStackRefresh.start();

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
        await backgroundStackRefresh.noOlderThan(600_000); // 10 mins
        print(chalk.green(`Processing batch ${batches} of ${Math.floor(numObjects / batchSize) + 1}`));
        printer.start();

        const { included: isolated, excluded: notIsolated } = partition(batch, asset => !activeAssets.contains(asset.fileName()));

        debug(`${isolated.length} isolated assets`);
        debug(`${notIsolated.length} not isolated assets`);
        debug(`${batch.length} objects total`);

        let deletables: S3Asset[] = isolated;
        let taggables: S3Asset[] = [];
        let untaggables: S3Asset[] = [];

        if (graceDays > 0) {
          debug('Filtering out assets that are not old enough to delete');
          await this.parallelReadAllTags(s3, batch);

          // We delete objects that are not referenced in ActiveAssets and have the Isolated Tag with a date
          // earlier than the current time - grace period.
          deletables = isolated.filter(obj => obj.isolatedTagBefore(new Date(currentTime - (graceDays * DAY))));

          // We tag objects that are not referenced in ActiveAssets and do not have the Isolated Tag.
          taggables = isolated.filter(obj => !obj.hasIsolatedTag());

          // We untag objects that are referenced in ActiveAssets and currently have the Isolated Tag.
          untaggables = notIsolated.filter(obj => obj.hasIsolatedTag());
        }

        debug(`${deletables.length} deletable assets`);
        debug(`${taggables.length} taggable assets`);
        debug(`${untaggables.length} assets to untag`);

        if (this.permissionToDelete && deletables.length > 0) {
          if (this.confirm) {
            const message = [
              `Found ${deletables.length} objects to delete based off of the following criteria:`,
              `- objects have been isolated for > ${this.props.rollbackBufferDays} days`,
              `- objects were created > ${this.props.createdBufferDays} days ago`,
              '',
              'Delete this batch (yes/no/delete-all)?',
            ].join('\n');
            printer.pause();
            const response = await promptly.prompt(message,
              { trim: true },
            );

            // Anything other than yes/y/delete-all is treated as no
            if (!response || !['yes', 'y', 'delete-all'].includes(response.toLowerCase())) {
              throw new Error('Deletion aborted by user');
            } else if (response.toLowerCase() == 'delete-all') {
              this.confirm = false;
            }
          }
          printer.resume();
          await this.parallelDelete(s3, bucket, deletables, printer);
        }

        if (this.permissionToTag && taggables.length > 0) {
          await this.parallelTag(s3, bucket, taggables, currentTime, printer);
        }

        if (this.permissionToTag && untaggables.length > 0) {
          await this.parallelUntag(s3, bucket, untaggables);
        }

        printer.reportScannedObjects(batch.length);
      }
    } catch (err: any) {
      throw new Error(err);
    } finally {
      backgroundStackRefresh.stop();
      printer.stop();
    }
  }

  private async parallelReadAllTags(s3: S3, objects: S3Asset[]) {
    const limit = pLimit(P_LIMIT);

    for (const obj of objects) {
      await limit(() => obj.allTags(s3));
    }
  }

  /**
   * Untag assets that were previously tagged, but now currently referenced.
   * Since this is treated as an implementation detail, we do not print the results in the printer.
   */
  private async parallelUntag(s3: S3, bucket: string, untaggables: S3Asset[]) {
    const limit = pLimit(P_LIMIT);

    for (const obj of untaggables) {
      const tags = await obj.allTags(s3);
      const updatedTags = tags.filter(tag => tag.Key !== ISOLATED_TAG);
      await limit(() =>
        s3.deleteObjectTagging({
          Bucket: bucket,
          Key: obj.key,

        }).promise(),
      );
      await limit(() =>
        s3.putObjectTagging({
          Bucket: bucket,
          Key: obj.key,
          Tagging: {
            TagSet: updatedTags,
          },
        }).promise(),
      );
    }

    debug(`Untagged ${untaggables.length} assets`);
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
    const batchSize = 1000;
    const objectsToDelete: S3.ObjectIdentifierList = deletables.map(asset => ({
      Key: asset.key,
    }));

    try {
      const batches = [];
      for (let i = 0; i < objectsToDelete.length; i += batchSize) {
        batches.push(objectsToDelete.slice(i, i + batchSize));
      }
      // Delete objects in batches
      for (const batch of batches) {
        await s3.deleteObjects({
          Bucket: bucket,
          Delete: {
            Objects: batch,
            Quiet: true,
          },
        }).promise();

        const deletedCount = batch.length;
        debug(`Deleted ${deletedCount} assets`);
        printer.reportDeletedObjects(deletables.slice(0, deletedCount));
      }
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
    let totalCount = 0;
    let continuationToken: string | undefined;

    do {
      const response = await s3.listObjectsV2({
        Bucket: bucket,
        ContinuationToken: continuationToken,
      }).promise();

      totalCount += response.KeyCount ?? 0;
      continuationToken = response.NextContinuationToken;
    } while (continuationToken);

    return totalCount;
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
          const lastModified = obj.LastModified ?? new Date(currentTime);
          // Store the object if it has a Key and
          // if it has not been modified since today - createdBufferDays
          if (key && lastModified < new Date(currentTime - (this.props.createdBufferDays * DAY))) {
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

function partition<A>(xs: Iterable<A>, pred: (x: A) => boolean): { included: A[]; excluded: A[] } {
  const result = {
    included: [] as A[],
    excluded: [] as A[],
  };

  for (const x of xs) {
    if (pred(x)) {
      result.included.push(x);
    } else {
      result.excluded.push(x);
    }
  }

  return result;
}