/* eslint-disable no-console */
import * as path from 'path';
import * as cxapi from '@aws-cdk/cx-api';
import { AWSError, CloudFormation, ECR, S3 } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import { ISDK, SdkProvider } from './aws-auth';
import { Mode } from './aws-auth/credentials';
import { ToolkitInfo } from './toolkit-info';
import { debug, print, warning } from '../logging';

const ISOLATED_TAG = 'awscdk.isolated';

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
   * The type of asset to garbage collect.
   *
   * @default 'all'
   */
  readonly type: 's3' | 'ecr' | 'all';

  /**
   * The days an asset must be in isolation before being actually deleted.
   *
   * @default 30
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

interface AssetInfo {
  size: number;
  amount: number;
}

export class GarbageCollector {
  private readonly hashes: Set<string> = new Set();
  private taggedObjects: AssetInfo = {
    size: 0,
    amount: 0,
  };
  private deletedObjects: AssetInfo = {
    size: 0,
    amount: 0,
  };
  private alreadyTaggedObjects: AssetInfo = {
    size: 0,
    amount: 0,
  };
  private taggedImages: AssetInfo = {
    size: 0,
    amount: 0,
  };
  private deletedImages: AssetInfo = {
    size: 0,
    amount: 0,
  };
  private alreadyTaggedImages: AssetInfo = {
    size: 0,
    amount: 0,
  };

  private garbageCollectingS3: boolean;
  private garbageCollectingECR: boolean;

  public constructor(private readonly props: GarbageCollectorProps) {
    this.garbageCollectingS3 = this.props.type === 's3' || this.props.type === 'all';
    this.garbageCollectingECR = this.props.type === 'ecr' || this.props.type === 'all';
  }

  public async garbageCollect() {
    const totalStart = Date.now();

    // set up the sdks used in garbage collection
    const sdk = (await this.props.sdkProvider.forEnvironment(this.props.resolvedEnvironment, Mode.ForWriting)).sdk;
    const { cfn, s3, ecr } = this.setUpSDKs(sdk);

    print('Collecting Hashes');
    let start = Date.now();
    await this.collectHashes(cfn);
    print('Finished collecting hashes: ', formatTime(start), ' seconds');

    if (this.garbageCollectingS3) {
      print('Getting bootstrap bucket');
      start = Date.now();
      const bucketName = (await ToolkitInfo.lookup(this.props.resolvedEnvironment, sdk, undefined)).bucketName;
      print('Got bootstrap bucket:', formatTime(start), 'seconds');

      print('Collecting isolated objects');
      start = Date.now();
      const isolatedObjects = await this.collectIsolatedObjects(s3, bucketName);
      print('Collected isolated buckets:', formatTime(start), 'seconds');

      if (this.props.dryRun) {
        print('dry run was set, so skipping object tagging and deletion');
      } else {
        print('Tagging isolated objects');
        start = Date.now();
        await this.tagIsolatedObjects(s3, bucketName, isolatedObjects);
        print('Tagged isolated buckets:', formatTime(start), 'seconds');
      }
    }

    if (this.garbageCollectingECR) {
      print('Getting bootstrap repositories');
      start = Date.now();
      const repos = await this.getBootstrapRepositories(ecr);
      print('Got bootstrapped repositories:', formatTime(start), 'seconds');

      for (const repo of repos) {
        print(`Collecting isolated images in ${repo}`);
        start = Date.now();
        const isolatedImages = await this.collectIsolatedImages(ecr, repo);
        print(`Collected isolated images in ${repo}:`, formatTime(start), 'seconds');

        if (!this.props.dryRun) {
          print(`Tagging isolated images in ${repo}`);
          start = Date.now();
          await this.tagIsolatedImages(ecr, repo, isolatedImages);
          print(`Tagged isolated images in ${repo}:`, formatTime(start), 'seconds');
        } else {
          print('dry run was set, so skipping image tagging');
        }
      }
    }

    print('Total Garbage Collection time:', formatTime(totalStart), 'seconds');
    this.writeResults();
  }

  private setUpSDKs(sdk: ISDK) {
    const cfn = sdk.cloudFormation();
    const s3 = sdk.s3();
    const ecr = sdk.ecr();
    return {
      cfn,
      s3,
      ecr,
    };
  }

  private writeResults() {
    if (!this.props.dryRun && this.garbageCollectingS3) {
      print(`${this.taggedObjects.amount} s3 assets were tagged in this run of cdk gc, for a total of ${toMb(this.taggedObjects.size)} MB`);
      print(`${this.alreadyTaggedObjects.amount} s3 assets were already tagged in previous runs, for a total of ${toMb(this.alreadyTaggedObjects.size)} MB`);
      print(`${this.deletedObjects.amount} s3 assets were deleted in this run of cdk gc, for a total of ${toMb(this.deletedObjects.size)} MB`);
    }

    if (!this.props.dryRun && this.garbageCollectingECR) {
      print(`${this.taggedImages.amount} ecr assets were tagged in this run of cdk gc, for a total of ${toMb(this.taggedImages.size)} MB`);
      print(`${this.alreadyTaggedImages.amount} ecr assets were already tagged in previous runs, for a total of ${toMb(this.alreadyTaggedImages.size)} MB`);
      print(`${this.deletedImages.amount} ecr assets were deleted in this run of cdk gc, for a total of ${toMb(this.deletedImages.size)} MB`);
    }
  }

  private async collectHashes(cfn: CloudFormation) {
    const stackNames: string[] = [];
    await paginateSdkCall(async (nextToken) => {
      // Would it make sense to only filter for active stacks?
      // I think it would make sense to ignore all stacks that have been deleted for more than 1 day, but otherwise don't touch
      const response = await cfn.listStacks({ NextToken: nextToken }).promise();
      stackNames.push(...(response.StackSummaries ?? []).map(s => s.StackId ?? s.StackName));
      return response.NextToken;
    });

    print(`Parsing through ${stackNames.length} stacks`);

    for (const stackArn of stackNames) {
      // This crashes on 'Processed template of Stack cdktest-0ibttybjfx2h-bootstrap-stack is not ready. Specify Original to get user-submitted template.'
      let template: PromiseResult<CloudFormation.GetTemplateOutput, AWSError>;
      try {
        template = await cfn.getTemplate({
          StackName: stackArn,
          TemplateStage: 'Original',
        }).promise();
      } catch (error) {
        warning('Encountered an error while getting a cfn template -- skipping gc for', stackArn);
        warning(error as string);
        continue;
      }

      const templateHashes = template.TemplateBody?.match(/[a-f0-9]{64}/g); // I think this could have false positives?
      templateHashes?.forEach((h) => this.hashes.add(h));
    }

    print(`Found ${this.hashes.size} unique hashes`);
  }

  private async collectIsolatedObjects(s3: S3, bucket: string) {
    const isolatedObjects: string[] = [];
    await paginateSdkCall(async (nextToken) => {
      const response = await s3.listObjectsV2({
        Bucket: bucket,
        ContinuationToken: nextToken,
      }).promise();
      response.Contents?.forEach((obj) => {
        const hash = getHash(obj.Key ?? '');
        if (!this.hashes.has(hash)) {
          isolatedObjects.push(obj.Key ?? '');
        }
      });
      return response.NextContinuationToken;
    });

    print('num isolated', isolatedObjects.length);
    isolatedObjects.forEach((s) => debug(s));

    return isolatedObjects;
  }

  private async getObjectSize(s3: S3, bucket: string, key: string) {
    const objectAttrs = await s3.getObjectAttributes({
      Bucket: bucket,
      Key: key,
      ObjectAttributes: ['ObjectSize'],
    }).promise();
    return objectAttrs.ObjectSize ?? 0;
  }

  private async tagIsolatedObjects(s3: S3, bucket: string, objects: string[]) {
    for (const obj of objects) {
      // check if the object has been tagged in a previous gc run
      const response = await s3.getObjectTagging({
        Bucket: bucket,
        Key: obj,
      }).promise();
      let alreadyTagged = false;
      let tagDate = '';
      for (const tag of response.TagSet) {
        if (tag.Key === ISOLATED_TAG) {
          alreadyTagged = true;
          tagDate = tag.Value;
        }
      }
      // tag new objects with the current date
      if (!alreadyTagged) {
        const size = await this.getObjectSize(s3, bucket, obj);
        this.taggedObjects.amount += 1;
        this.taggedObjects.size += size;

        await s3.putObjectTagging({
          Bucket: bucket,
          Key: obj,
          Tagging: {
            TagSet: [{
              Key: ISOLATED_TAG,
              Value: Date.now().toString(),
            }],
          },
        }).promise();
      } else {
        print('already tagged', response.TagSet[0].Value);

        const size = await this.getObjectSize(s3, bucket, obj);
        this.alreadyTaggedObjects.amount += 1;
        this.alreadyTaggedObjects.size += size;

        if (this.canBeSafelyDeleted(Number(tagDate))) {
          const toBeDeletedSize = await this.getObjectSize(s3, bucket, obj);
          this.deletedObjects.amount += 1;
          this.deletedObjects.size += toBeDeletedSize;

          print('Deleting', obj);
          await this.deleteObject(s3, bucket, obj);
        }
      }
    }
  }

  private async deleteObject(s3: S3, bucket: string, key: string) {
    await s3.deleteObject({
      Bucket: bucket,
      Key: key,
    }).promise();
  }

  /* ECR methods */

  private async getBootstrapRepositories(ecr: ECR) {
    let repos: ECR.RepositoryList = [];
    await paginateSdkCall(async (nextToken) => {
      const response = await ecr.describeRepositories({ nextToken: nextToken }).promise();
      repos = response.repositories ?? [];
      return response.nextToken;
    });
    const bootstrappedRepos: string[] = [];
    for (const repo of repos ?? []) {
      if (!repo.repositoryArn || !repo.repositoryName) { continue; }
      const tags = await ecr.listTagsForResource({
        resourceArn: repo.repositoryArn,
      }).promise();
      for (const tag of tags.tags ?? []) {
        if (tag.Key === 'awscdk:asset' && tag.Value === 'true') {
          bootstrappedRepos.push(repo.repositoryName);
        }
      }
    }
    return bootstrappedRepos;
  }

  private async collectIsolatedImages(ecr: ECR, repo: string) {
    const isolatedImages: string[] = [];
    await paginateSdkCall(async (nextToken) => {
      const response = await ecr.listImages({
        repositoryName: repo,
        nextToken: nextToken,
      }).promise();
      // map unique image digest to (possibly multiple) tags
      const images = imageMap(response.imageIds ?? []);
      // make sure all tags of an image are isolated
      for (const [digest, tags] of Object.entries(images)) {
        let del = true;
        for (const tag of tags) {
          if (this.hashes.has(tag)) {
            del = false;
          }
        }
        if (del) {
          isolatedImages.push(digest);
        }
      }
      return response.nextToken;
    });

    isolatedImages.forEach((s) => debug(s));
    print('num isolated', isolatedImages.length);

    return isolatedImages;
  }

  private async tagIsolatedImages(ecr: ECR, repo: string, images: string[]) {
    const imageIds: ECR.ImageIdentifierList = [];
    images.forEach((i) => imageIds.push({ imageDigest: i }));
    const response = await ecr.batchGetImage({
      repositoryName: repo,
      imageIds,
    }).promise();

    const imagesMapToTags: Record<string, string[]> = {};
    const imagesMapToManifest: Record<string, string> = {};
    for (const image of response.images ?? []) {
      const imageDigest = image.imageId?.imageDigest;
      const imageTag = image.imageId?.imageTag;
      if (!imageDigest || !imageTag) { continue; }
      if (!imagesMapToTags[imageDigest]) {
        imagesMapToTags[imageDigest] = [];
      }
      imagesMapToTags[imageDigest].push(imageTag);
      imagesMapToManifest[imageDigest] = image.imageManifest ?? '';
    }

    // check if image is already tagged from a previous gc run
    const filteredImages = [];
    for (const [digest, tags] of Object.entries(imagesMapToTags)) {
      let alreadyTagged = false;
      let tagDate = '';
      for (const tag of tags) {
        if (tag.startsWith(ISOLATED_TAG)) {
          alreadyTagged = true;
          tagDate = tag.slice(16);
        }
      }
      if (!alreadyTagged) {
        filteredImages.push(digest);
      } else {
        print('image already tagged', tagDate);
        if (this.canBeSafelyDeleted(Number(tagDate))) {
          const size = await this.getImageSize(ecr, repo, digest);
          this.deletedImages.amount += 1;
          this.deletedImages.size += size;
          print('Deleting', digest);
          await this.deleteImage(ecr, repo, digest);
        } else {
          const size = await this.getImageSize(ecr, repo, digest);
          this.alreadyTaggedImages.amount += 1;
          this.alreadyTaggedImages.size += size;
        }
      }
    }

    // tag images with current date
    for (const imageDigest of filteredImages) {
      const size = await this.getImageSize(ecr, repo, imageDigest);
      this.taggedImages.amount += 1;
      this.taggedImages.size += size;
      await ecr.putImage({
        repositoryName: repo,
        imageManifest: imagesMapToManifest[imageDigest],
        imageTag: `${ISOLATED_TAG}-${Date.now().toString()}`,
      }).promise();
    }
  }

  private async getImageSize(ecr: ECR, repo: string, digest: string) {
    const response = await ecr.describeImages({
      repositoryName: repo,
      imageIds: [{
        imageDigest: digest,
      }],
    }).promise();
    return response.imageDetails![0].imageSizeInBytes ?? 0;
  }

  private async deleteImage(ecr: ECR, repo: string, digest: string) {
    await ecr.batchDeleteImage({
      repositoryName: repo,
      imageIds: [{
        imageDigest: digest,
      }],
    }).promise();
  }

  private canBeSafelyDeleted(time: number): boolean {
    // divide 1000 for seconds, another 60 for minutes, another 60 for hours, 24 for days
    const daysElapsed = (Date.now() - time) / (1000 * 60 * 60 * 24);
    return daysElapsed > this.props.isolationDays;
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

function getHash(file: string) {
  return path.basename(file, path.extname(file));
}

function formatTime(start: number): number {
  return (Date.now() - start) / 1000;
}

function toMb(bytes: number): number {
  return bytes / 1000000;
}

function imageMap(imageIds: ECR.ImageIdentifierList) {
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
