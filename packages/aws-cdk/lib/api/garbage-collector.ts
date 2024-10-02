import * as cxapi from '@aws-cdk/cx-api';
import { CloudFormation, S3 } from 'aws-sdk';
import * as chalk from 'chalk';
import { ISDK, Mode, SdkProvider } from './aws-auth';
import { print } from '../logging';
import { DEFAULT_TOOLKIT_STACK_NAME, ToolkitInfo } from './toolkit-info';

// Must use a require() otherwise esbuild complains
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pLimit: typeof import('p-limit') = require('p-limit');

const ISOLATED_TAG = 'aws-cdk:isolated';
const P_LIMIT = 50;

class ActiveAssetCache {
  private readonly stacks: Set<string> = new Set();

  public rememberStack(stackTemplate: string) {
    this.stacks.add(stackTemplate);
  }

  public contains(asset: string): boolean {
    for (const stack of this.stacks) {
      if (stack.includes(asset)) {
        return true;
      }
    }
    return false;
  }
}

class S3Asset {
  private cached_tags: S3.TagSet | undefined = undefined;

  public constructor(private readonly bucket: string, public readonly key: string) {}

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

  public async getTag(s3: S3, tag: string) {
    const tags = await this.allTags(s3);
    return tags.find(t => t.Key === tag)?.Value;
  }

  public async hasTag(s3: S3, tag: string) {
    const tags = await this.allTags(s3);
    return tags.some(t => t.Key === tag);
  }
}

/**
 * Props for the Garbage Collector
 */
interface GarbageCollectorProps {
  /**
   * The action to perform. Specify this if you want to perform a truncated set
   * of actions available.
   *
   * @default 'full'
   */
  readonly action: 'print' | 'tag' | 'delete-tagged' | 'full';

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

  /**
   * The name of the bootstrap stack to look for.
   *
   * @default DEFAULT_TOOLKIT_STACK_NAME
   */
  readonly bootstrapStackName?: string;
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

  public constructor(readonly props: GarbageCollectorProps) {
    this.garbageCollectS3Assets = ['s3', 'all'].includes(props.type);
    this.garbageCollectEcrAssets = ['ecr', 'all'].includes(props.type);

    this.permissionToDelete = ['delete-tagged', 'full'].includes(props.type);
    this.permissionToTag = ['tag', 'full'].includes(props.type);

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
    print(chalk.black(this.garbageCollectS3Assets));
    // SDKs
    const sdk = (await this.props.sdkProvider.forEnvironment(this.props.resolvedEnvironment, Mode.ForWriting)).sdk;
    const cfn = sdk.cloudFormation();
    const s3 = sdk.s3();

    const qualifier = await this.bootstrapQualifier(sdk, this.bootstrapStackName);

    const activeAssets = new ActiveAssetCache();

    const refreshStacks = async () => {
      const stacks = await this.fetchAllStackTemplates(cfn, qualifier);
      for (const stack of stacks) {
        activeAssets.rememberStack(stack);
      }
    };

    // Grab stack templates first
    await refreshStacks();

    // Refresh stacks every 5 minutes
    const timer = setInterval(refreshStacks, 30_000);

    try {
      const bucket = await this.bootstrapBucketName(sdk, this.bootstrapStackName);
      // Process objects in batches of 1000
      // This is the batch limit of s3.DeleteObject and we intend to optimize for the "worst case" scenario
      // where gc is run for the first time on a long-standing bucket where ~100% of objects are isolated.
      for await (const batch of this.readBucketInBatches(s3, bucket)) {
        print(chalk.red(batch.length));
        const currentTime = Date.now();
        const graceDays = this.props.isolationDays;
        const isolated = batch.filter((obj) => {
          return !activeAssets.contains(obj.fileName());
        });

        let deletables: S3Asset[] = [];

        if (this.permissionToDelete) {
          deletables = graceDays > 0
            ? await Promise.all(
              isolated.map(async (obj) => {
                const tagTime = await obj.getTag(s3, ISOLATED_TAG);
                if (tagTime && olderThan(Number(tagTime), currentTime, graceDays)) {
                  return obj;
                }
                return null;
              }),
            ).then(results => results.filter((obj): obj is S3Asset => obj !== null))
            : isolated;
        }

        let taggables: S3Asset[] = [];

        if (this.permissionToTag) {
          taggables = graceDays > 0
            ? await Promise.all(
              isolated.map(async (obj) => {
                const hasTag = await obj.hasTag(s3, ISOLATED_TAG);
                return hasTag ? null : obj;
              }),
            ).then(results => results.filter((obj): obj is S3Asset => obj !== null))
            : [];
        }

        print(chalk.blue(`${deletables.length} deletable assets`));
        print(chalk.white(`${taggables.length} taggable assets`));

        if (deletables.length > 0) {
          await this.parallelDelete(s3, bucket, deletables);
        }

        if (taggables.length > 0) {
          await this.parallelTag(s3, bucket, taggables, currentTime);
        }

        // TODO: maybe undelete
      }
    } finally {
      clearInterval(timer);
    }
  }

  /**
   * Tag objects in parallel using p-limit. The putObjectTagging API does not
   * support batch tagging so we must handle the parallelism client-side.
   */
  private async parallelTag(s3: S3, bucket: string, taggables: S3Asset[], date: number) {
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

    print(chalk.green(`Tagged ${taggables.length} assets`));
  }

  /**
   * Delete objects in parallel. The deleteObjects API supports batches of 1000.
   */
  private async parallelDelete(s3: S3, bucket: string, deletables: S3Asset[]) {
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

      print(chalk.green(`Deleted ${deletables.length} assets`));
    } catch (err) {
      print(chalk.red(`Error deleting objects: ${err}`));
    }
  }

  private async bootstrapBucketName(sdk: ISDK, bootstrapStackName: string): Promise<string> {
    const info = await ToolkitInfo.lookup(this.props.resolvedEnvironment, sdk, bootstrapStackName);
    return info.bucketName;
  }

  private async bootstrapQualifier(sdk: ISDK, bootstrapStackName: string): Promise<string> {
    const info = await ToolkitInfo.lookup(this.props.resolvedEnvironment, sdk, bootstrapStackName);
    return info.bootstrapStack.parameters.Qualifier;
  }

  /**
   * Generator function that reads objects from the S3 Bucket in batches.
   */
  private async *readBucketInBatches(s3: S3, bucket: string, batchSize: number = 1000): AsyncGenerator<S3Asset[]> {
    let continuationToken: string | undefined;

    do {
      const batch: S3Asset[] = [];

      while (batch.length < batchSize) {
        const response = await s3.listObjectsV2({
          Bucket: bucket,
          ContinuationToken: continuationToken,
          MaxKeys: batchSize - batch.length,
        }).promise();

        response.Contents?.forEach((obj) => {
          if (obj.Key) {
            batch.push(new S3Asset(bucket, obj.Key));
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

  /**
   * Fetches all relevant stack templates from CloudFormation. It ignores the following stacks:
   * - stacks in DELETE_COMPLETE or DELET_IN_PROGRES stage
   * - stacks that are using a different bootstrap qualifier
   *
   * It fails on the following stacks because we cannot get the template and therefore have an imcomplete
   * understanding of what assets are being used.
   * - stacks in REVIEW_IN_PROGRESS stage
   */
  private async fetchAllStackTemplates(cfn: CloudFormation, qualifier: string) {
    const stackNames: string[] = [];
    await paginateSdkCall(async (nextToken) => {
      const response = await cfn.listStacks({ NextToken: nextToken }).promise();

      // We cannot operate on REVIEW_IN_PROGRESS stacks because we do not know what the template looks like in this case
      const reviewInProgressStacks = response.StackSummaries?.filter(s => s.StackStatus === 'REVIEW_IN_PROGRESS') ?? [];
      if (reviewInProgressStacks.length > 0) {
        throw new Error(`Stacks in REVIEW_IN_PROGRESS state are not allowed: ${reviewInProgressStacks.map(s => s.StackName).join(', ')}`);
      }

      // Deleted stacks are ignored
      stackNames.push(
        ...(response.StackSummaries ?? [])
          .filter(s => s.StackStatus !== 'DELETE_COMPLETE' && s.StackStatus !== 'DELETE_IN_PROGRESS')
          .map(s => s.StackId ?? s.StackName),
      );

      return response.NextToken;
    });

    print(chalk.blue(`Parsing through ${stackNames.length} stacks`));

    const templates: string[] = [];
    for (const stack of stackNames) {
      let summary;
      summary = await cfn.getTemplateSummary({
        StackName: stack,
      }).promise();

      // Filter out stacks that we KNOW are using a different bootstrap qualifier
      // This is necessary because a stack under a different bootstrap could coincidentally reference the same hash
      // and cause a false negative (cause an asset to be preserved when its isolated)
      const bootstrapVersion = summary?.Parameters?.find((p) => p.ParameterKey === 'BootstrapVersion');
      const splitBootstrapVersion = bootstrapVersion?.DefaultValue?.split('/');
      if (splitBootstrapVersion && splitBootstrapVersion.length == 4 && splitBootstrapVersion[2] != qualifier) {
        // This stack is definitely bootstrapped to a different qualifier so we can safely ignore it
        continue;
      } else {
        const template = await cfn.getTemplate({
          StackName: stack,
        }).promise();

        templates.push(template.TemplateBody ?? '' + summary?.Parameters);
      }
    }

    print(chalk.red('Done parsing through stacks'));

    return templates;
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

function olderThan(originalTime: number, currentTime: number, graceDays: number) {
  const diff = currentTime - originalTime;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return days >= graceDays;
}
