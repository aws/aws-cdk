/* eslint-disable no-console */
import * as path from 'path';
import * as cxapi from '@aws-cdk/cx-api';
import { ECR } from 'aws-sdk';
import { ISDK, SdkProvider } from './aws-auth';
import { Mode } from './aws-auth/credentials';
import { ToolkitInfo } from './toolkit-info';

const ISOLATED_TAG = 'awscdk.isolated';
interface GarbageCollectorProps {
  /**
   * If this property is set, then instead of garbage collecting, we will
   * print the isolated asset hashes.
   */
  dryRun: boolean;

  type: 'ecr' | 's3' | 'all';

  /**
   * The environment to deploy this stack in
   *
   * The environment on the stack artifact may be unresolved, this one
   * must be resolved.
   */
  resolvedEnvironment: cxapi.Environment;

  /**
    * SDK provider (seeded with default credentials)
    *
    * Will exclusively be used to assume publishing credentials (which must
    * start out from current credentials regardless of whether we've assumed an
    * action role to touch the stack or not).
    *
    * Used for the following purposes:
    *
    * - Publish legacy assets.
    * - Upload large CloudFormation templates to the staging bucket.
    */
  sdkProvider: SdkProvider;
}

export class GarbageCollector {
  private hashes: Set<string> = new Set();
  public constructor(private readonly props: GarbageCollectorProps) {
  }

  public async garbageCollect() {
    const totalStart = Date.now();
    const sdk = (await this.props.sdkProvider.forEnvironment(this.props.resolvedEnvironment, Mode.ForWriting)).sdk;
    console.log('Collecting Hashes');
    let start = Date.now();
    await this.collectHashes(sdk);
    console.log('Finished collecting hashes: ', formatTime(start), ' seconds');

    if (this.props.type === 's3' || this.props.type === 'all') {
      console.log('Getting bootstrap bucket');
      start = Date.now();
      const bucket = await this.getBootstrapBucket(sdk);
      console.log('Got bootstrap bucket:', formatTime(start), 'seconds');

      console.log('Collecting isolated objects');
      start = Date.now();
      const isolatedObjects = await this.collectIsolatedObjects(sdk, bucket);
      console.log('Collected isolated buckets:', formatTime(start), 'seconds');

      if (!this.props.dryRun) {
        console.log('Tagging isolated objects');
        start = Date.now();
        await this.tagIsolatedObjects(sdk, bucket, isolatedObjects);
        console.log('Tagged isolated buckets:', formatTime(start), 'seconds');
      } else {
        console.log('dry run was set, so skipping object tagging');
      }
    }

    if (this.props.type === 'ecr' || this.props.type === 'all') {
      console.log('Getting bootstrap repositories');
      start = Date.now();
      const repos = await this.getBootstrapRepositories(sdk);
      console.log('Got bootstrapped repositories:', formatTime(start), 'seconds');

      for (const repo of repos) {
        console.log(`Collecting isolated images in ${repo}`);
        start = Date.now();
        const isolatedImages = await this.collectIsolatedImages(sdk, repo);
        console.log(`Collected isolated images in ${repo}:`, formatTime(start), 'seconds');

        if (!this.props.dryRun) {
          console.log(`Tagging isolated images in ${repo}`);
          start = Date.now();
          await this.tagIsolatedImages(sdk, repo, isolatedImages);
          console.log(`Tagged isolated images in ${repo}:`, formatTime(start), 'seconds');
        } else {
          console.log('dry run was set, so skipping image tagging');
        }
      }
    }

    console.log('Total Garbage Collection time:', formatTime(totalStart), 'seconds');
  }

  private async collectHashes(sdk: ISDK) {
    const cfn = sdk.cloudFormation();
    const stackNames: string[] = [];
    await paginateSdkCall(async (nextToken) => {
      const response = await cfn.listStacks({ NextToken: nextToken }).promise();
      stackNames.push(...(response.StackSummaries ?? []).map(s => s.StackId ?? s.StackName));
      return response.NextToken;
    });

    console.log('num stacks:', stackNames.length);

    // TODO: gracefully fail this
    for (const stack of stackNames) {
      const template = await cfn.getTemplate({
        StackName: stack,
      }).promise();

      const templateHashes = template.TemplateBody?.match(/[a-f0-9]{64}/g);
      templateHashes?.forEach(this.hashes.add, this.hashes);
    }

    console.log('num hashes:', this.hashes.size);
  }

  private async collectIsolatedObjects(sdk: ISDK, bucket: string) {
    const s3 = sdk.s3();
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

    console.log(isolatedObjects);
    console.log('num isolated', isolatedObjects.length);

    return isolatedObjects;
  }

  private async collectIsolatedImages(sdk: ISDK, repo: string) {
    const ecr = sdk.ecr();
    const isolatedImages: string[] = [];
    await paginateSdkCall(async (nextToken) => {
      const response = await ecr.listImages({
        repositoryName: repo,
        nextToken: nextToken,
      }).promise();
      // map unique image digest to (possibly multiple) tags
      const images = imageMap(response.imageIds ?? []);
      // make sure all tags of an image are isolated
      for (const tags of Object.values(images)) {
        let del = true;
        for (const tag of tags) {
          if (this.hashes.has(tag)) {
            del = false;
          }
        }
        if (del) {
          isolatedImages.push(tags[0]);
        }
      }
      return response.nextToken;
    });

    console.log(isolatedImages);
    console.log('num isolated', isolatedImages.length);

    return isolatedImages;
  }

  private async getBootstrapBucket(sdk: ISDK) {
    // maybe use tags like for ecr
    const info = await ToolkitInfo.lookup(this.props.resolvedEnvironment, sdk, undefined);
    return info.bucketName;
  }

  private async getBootstrapRepositories(sdk: ISDK) {
    const ecr = sdk.ecr();
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

  private async tagIsolatedObjects(sdk: ISDK, bucket: string, objects: string[]) {
    const s3 = sdk.s3();
    for (const obj of objects) {
      // check if the object has been tagged in a previous gc run
      const response = await s3.getObjectTagging({
        Bucket: bucket,
        Key: obj,
      }).promise();
      let alreadyTagged = false;
      for (const tag of response.TagSet) {
        if (tag.Key === ISOLATED_TAG) {
          alreadyTagged = true;
        }
      }
      // tag new objects with the current date
      if (!alreadyTagged) {
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
        console.log('already tagged', response.TagSet[0].Value);
      }
    }
  }

  private async tagIsolatedImages(sdk: ISDK, repo: string, images: string[]) {
    const ecr = sdk.ecr();
    const imageIds: ECR.ImageIdentifierList = [];
    images.forEach((i) => imageIds.push({ imageTag: i }));
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
      let oldTag = '';
      for (const tag of tags) {
        if (tag.startsWith(ISOLATED_TAG)) {
          alreadyTagged = true;
          oldTag = tag;
        }
      }
      if (!alreadyTagged) {
        filteredImages.push(digest);
      } else {
        console.log('image already tagged', oldTag);
      }
    }

    // tag images with current date
    for (const imageDigest of filteredImages) {
      await ecr.putImage({
        repositoryName: repo,
        imageManifest: imagesMapToManifest[imageDigest],
        imageTag: `${ISOLATED_TAG}-${Date.now().toString()}`,
      }).promise();
    }
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

// function addToObject<T>(key: string, val: T, obj: Record<string, T[]>) {
//   if (!obj[key]) {
//     obj[key] = [];
//   }
//   obj[key].push(val);
// }