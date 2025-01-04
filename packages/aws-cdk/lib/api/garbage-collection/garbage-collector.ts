import * as cxapi from '@aws-cdk/cx-api';
import { ImageIdentifier } from '@aws-sdk/client-ecr';
import { Tag } from '@aws-sdk/client-s3';
import * as chalk from 'chalk';
import * as promptly from 'promptly';
import { debug, print } from '../../logging';
import { IECRClient, IS3Client, SDK, SdkProvider } from '../aws-auth';
import { DEFAULT_TOOLKIT_STACK_NAME, ToolkitInfo } from '../toolkit-info';
import { ProgressPrinter } from './progress-printer';
import { ActiveAssetCache, BackgroundStackRefresh, refreshStacks } from './stack-refresh';
import { ToolkitError } from '../../toolkit/error';
import { Mode } from '../plugin/mode';

// Must use a require() otherwise esbuild complains
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pLimit: typeof import('p-limit') = require('p-limit');

export const S3_ISOLATED_TAG = 'aws-cdk:isolated';
export const ECR_ISOLATED_TAG = 'aws-cdk.isolated'; // ':' is not valid in ECR tags
const P_LIMIT = 50;
const DAY = 24 * 60 * 60 * 1000; // Number of milliseconds in a day

export type GcAsset = ImageAsset | ObjectAsset;

/**
 * An image asset that lives in the bootstrapped ECR Repository
 */
export class ImageAsset {
  public constructor(
    public readonly digest: string,
    public readonly size: number,
    public readonly tags: string[],
    public readonly manifest: string,
  ) {}

  private getTag(tag: string) {
    return this.tags.find(t => t.includes(tag));
  }

  private hasTag(tag: string) {
    return this.tags.some(t => t.includes(tag));
  }

  public hasIsolatedTag() {
    return this.hasTag(ECR_ISOLATED_TAG);
  }

  public getIsolatedTag() {
    return this.getTag(ECR_ISOLATED_TAG);
  }

  public isolatedTagBefore(date: Date) {
    const dateIsolated = this.dateIsolated();
    if (!dateIsolated || dateIsolated == '') {
      return false;
    }
    return new Date(dateIsolated) < date;
  }

  public buildImageTag(inc: number) {
    // isolatedTag will look like "X-aws-cdk.isolated-YYYYY"
    return `${inc}-${ECR_ISOLATED_TAG}-${String(Date.now())}`;
  }

  public dateIsolated() {
    // isolatedTag will look like "X-aws-cdk.isolated-YYYYY"
    return this.getIsolatedTag()?.split('-')[3];
  }
}

/**
 * An object asset that lives in the bootstrapped S3 Bucket
 */
export class ObjectAsset {
  private cached_tags: Tag[] | undefined = undefined;

  public constructor(private readonly bucket: string, public readonly key: string, public readonly size: number) {}

  public fileName(): string {
    return this.key.split('.')[0];
  }

  public async allTags(s3: IS3Client) {
    if (this.cached_tags) {
      return this.cached_tags;
    }

    const response = await s3.getObjectTagging({ Bucket: this.bucket, Key: this.key });
    this.cached_tags = response.TagSet;
    return this.cached_tags;
  }

  private getTag(tag: string) {
    if (!this.cached_tags) {
      throw new ToolkitError('Cannot call getTag before allTags');
    }
    return this.cached_tags.find((t: any) => t.Key === tag)?.Value;
  }

  private hasTag(tag: string) {
    if (!this.cached_tags) {
      throw new ToolkitError('Cannot call hasTag before allTags');
    }
    return this.cached_tags.some((t: any) => t.Key === tag);
  }

  public hasIsolatedTag() {
    return this.hasTag(S3_ISOLATED_TAG);
  }

  public isolatedTagBefore(date: Date) {
    const tagValue = this.getTag(S3_ISOLATED_TAG);
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
  }

  /**
   * Perform garbage collection on the resolved environment.
   */
  public async garbageCollect() {
    // SDKs
    const sdk = (await this.props.sdkProvider.forEnvironment(this.props.resolvedEnvironment, Mode.ForWriting)).sdk;
    const cfn = sdk.cloudFormation();

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

    try {
      if (this.garbageCollectS3Assets) {
        await this.garbageCollectS3(sdk, activeAssets, backgroundStackRefresh);
      }

      if (this.garbageCollectEcrAssets) {
        await this.garbageCollectEcr(sdk, activeAssets, backgroundStackRefresh);
      }
    } catch (err: any) {
      throw new ToolkitError(err);
    } finally {
      backgroundStackRefresh.stop();
    }
  }

  /**
   * Perform garbage collection on ECR assets
   */
  public async garbageCollectEcr(sdk: SDK, activeAssets: ActiveAssetCache, backgroundStackRefresh: BackgroundStackRefresh) {
    const ecr = sdk.ecr();
    const repo = await this.bootstrapRepositoryName(sdk, this.bootstrapStackName);
    const numImages = await this.numImagesInRepo(ecr, repo);
    const printer = new ProgressPrinter(numImages, 1000);

    debug(`Found bootstrap repo ${repo} with ${numImages} images`);

    try {
      // const batches = 1;
      const batchSize = 1000;
      const currentTime = Date.now();
      const graceDays = this.props.rollbackBufferDays;

      debug(`Parsing through ${numImages} images in batches`);

      for await (const batch of this.readRepoInBatches(ecr, repo, batchSize, currentTime)) {
        await backgroundStackRefresh.noOlderThan(600_000); // 10 mins
        printer.start();

        const { included: isolated, excluded: notIsolated } = partition(batch, asset => !asset.tags.some(t => activeAssets.contains(t)));

        debug(`${isolated.length} isolated images`);
        debug(`${notIsolated.length} not isolated images`);
        debug(`${batch.length} images total`);

        let deletables: ImageAsset[] = isolated;
        let taggables: ImageAsset[] = [];
        let untaggables: ImageAsset[] = [];

        if (graceDays > 0) {
          debug('Filtering out images that are not old enough to delete');

          // We delete images that are not referenced in ActiveAssets and have the Isolated Tag with a date
          // earlier than the current time - grace period.
          deletables = isolated.filter(img => img.isolatedTagBefore(new Date(currentTime - (graceDays * DAY))));

          // We tag images that are not referenced in ActiveAssets and do not have the Isolated Tag.
          taggables = isolated.filter(img => !img.hasIsolatedTag());

          // We untag images that are referenced in ActiveAssets and currently have the Isolated Tag.
          untaggables = notIsolated.filter(img => img.hasIsolatedTag());
        }

        debug(`${deletables.length} deletable assets`);
        debug(`${taggables.length} taggable assets`);
        debug(`${untaggables.length} assets to untag`);

        if (this.permissionToDelete && deletables.length > 0) {
          await this.confirmationPrompt(printer, deletables, 'image');
          await this.parallelDeleteEcr(ecr, repo, deletables, printer);
        }

        if (this.permissionToTag && taggables.length > 0) {
          await this.parallelTagEcr(ecr, repo, taggables, printer);
        }

        if (this.permissionToTag && untaggables.length > 0) {
          await this.parallelUntagEcr(ecr, repo, untaggables);
        }

        printer.reportScannedAsset(batch.length);
      }
    } catch (err: any) {
      throw new ToolkitError(err);
    } finally {
      printer.stop();
    }
  }

  /**
   * Perform garbage collection on S3 assets
   */
  public async garbageCollectS3(sdk: SDK, activeAssets: ActiveAssetCache, backgroundStackRefresh: BackgroundStackRefresh) {
    const s3 = sdk.s3();
    const bucket = await this.bootstrapBucketName(sdk, this.bootstrapStackName);
    const numObjects = await this.numObjectsInBucket(s3, bucket);
    const printer = new ProgressPrinter(numObjects, 1000);

    debug(`Found bootstrap bucket ${bucket} with ${numObjects} objects`);

    try {
      const batchSize = 1000;
      const currentTime = Date.now();
      const graceDays = this.props.rollbackBufferDays;

      debug(`Parsing through ${numObjects} objects in batches`);

      // Process objects in batches of 1000
      // This is the batch limit of s3.DeleteObject and we intend to optimize for the "worst case" scenario
      // where gc is run for the first time on a long-standing bucket where ~100% of objects are isolated.
      for await (const batch of this.readBucketInBatches(s3, bucket, batchSize, currentTime)) {
        await backgroundStackRefresh.noOlderThan(600_000); // 10 mins
        printer.start();

        const { included: isolated, excluded: notIsolated } = partition(batch, asset => !activeAssets.contains(asset.fileName()));

        debug(`${isolated.length} isolated assets`);
        debug(`${notIsolated.length} not isolated assets`);
        debug(`${batch.length} objects total`);

        let deletables: ObjectAsset[] = isolated;
        let taggables: ObjectAsset[] = [];
        let untaggables: ObjectAsset[] = [];

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
          await this.confirmationPrompt(printer, deletables, 'object');
          await this.parallelDeleteS3(s3, bucket, deletables, printer);
        }

        if (this.permissionToTag && taggables.length > 0) {
          await this.parallelTagS3(s3, bucket, taggables, currentTime, printer);
        }

        if (this.permissionToTag && untaggables.length > 0) {
          await this.parallelUntagS3(s3, bucket, untaggables);
        }

        printer.reportScannedAsset(batch.length);
      }
    } catch (err: any) {
      throw new ToolkitError(err);
    } finally {
      printer.stop();
    }
  }

  private async parallelReadAllTags(s3: IS3Client, objects: ObjectAsset[]) {
    const limit = pLimit(P_LIMIT);

    for (const obj of objects) {
      await limit(() => obj.allTags(s3));
    }
  }

  /**
   * Untag assets that were previously tagged, but now currently referenced.
   * Since this is treated as an implementation detail, we do not print the results in the printer.
   */
  private async parallelUntagEcr(ecr: IECRClient, repo: string, untaggables: ImageAsset[]) {
    const limit = pLimit(P_LIMIT);

    for (const img of untaggables) {
      const tag = img.getIsolatedTag();
      await limit(() =>
        ecr.batchDeleteImage({
          repositoryName: repo,
          imageIds: [{
            imageTag: tag,
          }],
        }),
      );
    }

    debug(`Untagged ${untaggables.length} assets`);
  }

  /**
   * Untag assets that were previously tagged, but now currently referenced.
   * Since this is treated as an implementation detail, we do not print the results in the printer.
   */
  private async parallelUntagS3(s3: IS3Client, bucket: string, untaggables: ObjectAsset[]) {
    const limit = pLimit(P_LIMIT);

    for (const obj of untaggables) {
      const tags = await obj.allTags(s3) ?? [];
      const updatedTags = tags.filter((tag: Tag) => tag.Key !== S3_ISOLATED_TAG);
      await limit(() =>
        s3.deleteObjectTagging({
          Bucket: bucket,
          Key: obj.key,

        }),
      );
      await limit(() =>
        s3.putObjectTagging({
          Bucket: bucket,
          Key: obj.key,
          Tagging: {
            TagSet: updatedTags,
          },
        }),
      );
    }

    debug(`Untagged ${untaggables.length} assets`);
  }

  /**
   * Tag images in parallel using p-limit
   */
  private async parallelTagEcr(ecr: IECRClient, repo: string, taggables: ImageAsset[], printer: ProgressPrinter) {
    const limit = pLimit(P_LIMIT);

    for (let i = 0; i < taggables.length; i++) {
      const img = taggables[i];
      const tagEcr = async () => {
        try {
          await ecr.putImage({
            repositoryName: repo,
            imageDigest: img.digest,
            imageManifest: img.manifest,
            imageTag: img.buildImageTag(i),
          });
        } catch (error) {
          // This is a false negative -- an isolated asset is untagged
          // likely due to an imageTag collision. We can safely ignore,
          // and the isolated asset will be tagged next time.
          debug(`Warning: unable to tag image ${JSON.stringify(img.tags)} with ${img.buildImageTag(i)} due to the following error: ${error}`);
        }
      };
      await limit(() => tagEcr());
    }

    printer.reportTaggedAsset(taggables);
    debug(`Tagged ${taggables.length} assets`);
  }

  /**
   * Tag objects in parallel using p-limit. The putObjectTagging API does not
   * support batch tagging so we must handle the parallelism client-side.
   */
  private async parallelTagS3(s3: IS3Client, bucket: string, taggables: ObjectAsset[], date: number, printer: ProgressPrinter) {
    const limit = pLimit(P_LIMIT);

    for (const obj of taggables) {
      await limit(() =>
        s3.putObjectTagging({
          Bucket: bucket,
          Key: obj.key,
          Tagging: {
            TagSet: [
              {
                Key: S3_ISOLATED_TAG,
                Value: String(date),
              },
            ],
          },
        }),
      );
    }

    printer.reportTaggedAsset(taggables);
    debug(`Tagged ${taggables.length} assets`);
  }

  /**
   * Delete images in parallel. The deleteImage API supports batches of 100.
   */
  private async parallelDeleteEcr(ecr: IECRClient, repo: string, deletables: ImageAsset[], printer: ProgressPrinter) {
    const batchSize = 100;
    const imagesToDelete = deletables.map(img => ({
      imageDigest: img.digest,
    }));

    try {
      const batches = [];
      for (let i = 0; i < imagesToDelete.length; i += batchSize) {
        batches.push(imagesToDelete.slice(i, i + batchSize));
      }
      // Delete images in batches
      for (const batch of batches) {
        await ecr.batchDeleteImage({
          imageIds: batch,
          repositoryName: repo,
        });

        const deletedCount = batch.length;
        debug(`Deleted ${deletedCount} assets`);
        printer.reportDeletedAsset(deletables.slice(0, deletedCount));
      }
    } catch (err) {
      print(chalk.red(`Error deleting images: ${err}`));
    }
  }

  /**
   * Delete objects in parallel. The deleteObjects API supports batches of 1000.
   */
  private async parallelDeleteS3(s3: IS3Client, bucket: string, deletables: ObjectAsset[], printer: ProgressPrinter) {
    const batchSize = 1000;
    const objectsToDelete = deletables.map(asset => ({
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
        });

        const deletedCount = batch.length;
        debug(`Deleted ${deletedCount} assets`);
        printer.reportDeletedAsset(deletables.slice(0, deletedCount));
      }
    } catch (err) {
      print(chalk.red(`Error deleting objects: ${err}`));
    }
  }

  private async bootstrapBucketName(sdk: SDK, bootstrapStackName: string): Promise<string> {
    const info = await ToolkitInfo.lookup(this.props.resolvedEnvironment, sdk, bootstrapStackName);
    return info.bucketName;
  }

  private async bootstrapRepositoryName(sdk: SDK, bootstrapStackName: string): Promise<string> {
    const info = await ToolkitInfo.lookup(this.props.resolvedEnvironment, sdk, bootstrapStackName);
    return info.repositoryName;
  }

  private async bootstrapQualifier(sdk: SDK, bootstrapStackName: string): Promise<string | undefined> {
    const info = await ToolkitInfo.lookup(this.props.resolvedEnvironment, sdk, bootstrapStackName);
    return info.bootstrapStack.parameters.Qualifier;
  }

  private async numObjectsInBucket(s3: IS3Client, bucket: string): Promise<number> {
    let totalCount = 0;
    let continuationToken: string | undefined;

    do {
      const response = await s3.listObjectsV2({
        Bucket: bucket,
        ContinuationToken: continuationToken,
      });

      totalCount += response.KeyCount ?? 0;
      continuationToken = response.NextContinuationToken;
    } while (continuationToken);

    return totalCount;
  }

  private async numImagesInRepo(ecr: IECRClient, repo: string): Promise<number> {
    let totalCount = 0;
    let nextToken: string | undefined;

    do {
      const response = await ecr.listImages({
        repositoryName: repo,
        nextToken: nextToken,
      });

      totalCount += response.imageIds?.length ?? 0;
      nextToken = response.nextToken;
    } while (nextToken);

    return totalCount;
  }

  private async *readRepoInBatches(ecr: IECRClient, repo: string, batchSize: number = 1000, currentTime: number): AsyncGenerator<ImageAsset[]> {
    let continuationToken: string | undefined;

    do {
      const batch: ImageAsset[] = [];

      while (batch.length < batchSize) {
        const response = await ecr.listImages({
          repositoryName: repo,
          nextToken: continuationToken,
        });

        // No images in the repository
        if (!response.imageIds || response.imageIds.length === 0) {
          break;
        }

        // map unique image digest to (possibly multiple) tags
        const images = imageMap(response.imageIds ?? []);

        const imageIds = Object.keys(images).map(key => ({
          imageDigest: key,
        }));

        const describeImageInfo = await ecr.describeImages({
          repositoryName: repo,
          imageIds: imageIds,
        });

        const getImageInfo = await ecr.batchGetImage({
          repositoryName: repo,
          imageIds: imageIds,
        });

        const combinedImageInfo = describeImageInfo.imageDetails?.map(imageDetail => {
          const matchingImage = getImageInfo.images?.find(
            img => img.imageId?.imageDigest === imageDetail.imageDigest,
          );

          return {
            ...imageDetail,
            manifest: matchingImage?.imageManifest,
          };
        });

        for (const image of combinedImageInfo ?? []) {
          const lastModified = image.imagePushedAt ?? new Date(currentTime);
          // Store the image if it was pushed earlier than today - createdBufferDays
          if (image.imageDigest && lastModified < new Date(currentTime - (this.props.createdBufferDays * DAY))) {
            batch.push(new ImageAsset(image.imageDigest, image.imageSizeInBytes ?? 0, image.imageTags ?? [], image.manifest ?? ''));
          }
        }

        continuationToken = response.nextToken;

        if (!continuationToken) break; // No more images to fetch
      }

      if (batch.length > 0) {
        yield batch;
      }
    } while (continuationToken);
  }

  /**
   * Generator function that reads objects from the S3 Bucket in batches.
   */
  private async *readBucketInBatches(s3: IS3Client, bucket: string, batchSize: number = 1000, currentTime: number): AsyncGenerator<ObjectAsset[]> {
    let continuationToken: string | undefined;

    do {
      const batch: ObjectAsset[] = [];

      while (batch.length < batchSize) {
        const response = await s3.listObjectsV2({
          Bucket: bucket,
          ContinuationToken: continuationToken,
        });

        response.Contents?.forEach((obj: any) => {
          const key = obj.Key ?? '';
          const size = obj.Size ?? 0;
          const lastModified = obj.LastModified ?? new Date(currentTime);
          // Store the object if it has a Key and
          // if it has not been modified since today - createdBufferDays
          if (key && lastModified < new Date(currentTime - (this.props.createdBufferDays * DAY))) {
            batch.push(new ObjectAsset(bucket, key, size));
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

  private async confirmationPrompt(printer: ProgressPrinter, deletables: GcAsset[], type: string) {
    const pluralize = (name: string, count: number): string => {
      return count === 1 ? name : `${name}s`;
    };

    if (this.confirm) {
      const message = [
        `Found ${deletables.length} ${pluralize(type, deletables.length)} to delete based off of the following criteria:`,
        `- ${type}s have been isolated for > ${this.props.rollbackBufferDays} days`,
        `- ${type}s were created > ${this.props.createdBufferDays} days ago`,
        '',
        'Delete this batch (yes/no/delete-all)?',
      ].join('\n');
      printer.pause();
      const response = await promptly.prompt(message,
        { trim: true },
      );

      // Anything other than yes/y/delete-all is treated as no
      if (!response || !['yes', 'y', 'delete-all'].includes(response.toLowerCase())) {
        throw new ToolkitError('Deletion aborted by user');
      } else if (response.toLowerCase() == 'delete-all') {
        this.confirm = false;
      }
    }
    printer.resume();
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

function imageMap(imageIds: ImageIdentifier[]) {
  const images: Record<string, string[]> = {};
  for (const image of imageIds ?? []) {
    if (!image.imageDigest || !image.imageTag) { continue; }
    if (!images[image.imageDigest]) {
      images[image.imageDigest] = [];
    }
    images[image.imageDigest].push(image.imageTag);
  }
  return images;
}
