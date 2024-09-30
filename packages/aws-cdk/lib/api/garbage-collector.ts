import * as path from 'path';
import * as cxapi from '@aws-cdk/cx-api';
import { CloudFormation, S3 } from 'aws-sdk';
import * as chalk from 'chalk';
import { ISDK, Mode, SdkProvider } from './aws-auth';
import { print } from '../logging';
import { ToolkitInfo } from './toolkit-info';

const ISOLATED_TAG = 'awscdk.isolated';

class ActiveAssets {
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
  private tags: S3.TagSet | undefined = undefined;

  public constructor(private readonly bucket: string, public readonly key: string) {}

  public getHash(): string {
    return path.parse(this.key).name;
  }

  public async getAllTags(s3: S3) {
    if (this.tags) {
      return this.tags;
    }

    const response = await s3.getObjectTagging({ Bucket: this.bucket, Key: this.key }).promise();
    this.tags = response.TagSet;
    return response.TagSet;
  }

  public async getTag(s3: S3, tag: string) {
    const tags = await this.getAllTags(s3);
    return tags.find(t => t.Key === tag)?.Value;
  }

  public async hasTag(s3: S3, tag: string) {
    const tags = await this.getAllTags(s3);
    return tags.some(t => t.Key === tag);
  }
}

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

  readonly bootstrapStackName?: string;
}

/**
 * A class to facilitate Garbage Collection of S3 and ECR assets
 */
export class GarbageCollector {
  private garbageCollectS3Assets: boolean;
  private garbageCollectEcrAssets: boolean;
  private bootstrapStackName: string;

  public constructor(readonly props: GarbageCollectorProps) {
    this.garbageCollectS3Assets = props.type === 's3' || props.type === 'all';
    this.garbageCollectEcrAssets = props.type === 'ecr' || props.type === 'all';
    this.bootstrapStackName = props.bootstrapStackName ?? 'CdkToolkit';

    // TODO: ECR garbage collection
    if (this.garbageCollectEcrAssets) {
      throw new Error('ECR garbage collection is not yet supported');
    }
  }

  /**
   * Perform garbage collection on the resolved environment(s)
   */
  public async garbageCollect() {
    print(chalk.black(this.garbageCollectS3Assets));
    // SDKs
    const sdk = (await this.props.sdkProvider.forEnvironment(this.props.resolvedEnvironment, Mode.ForWriting)).sdk;
    const cfn = sdk.cloudFormation();
    const s3 = sdk.s3();

    const activeAssets = new ActiveAssets();

    const refreshStacks = async () => {
      const stacks = await this.fetchAllStackTemplates(cfn);
      for (const stack of stacks) {
        activeAssets.rememberStack(stack);
      }
    };

    // Refresh stacks every 5 minutes
    const timer = setInterval(refreshStacks, 30_000);

    try {
      // Grab stack templates first
      await refreshStacks();

      const bucket = await this.getBootstrapBucketName(sdk, this.bootstrapStackName);
      // Process objects in batches of 1000
      for await (const batch of this.readBucketInBatches(s3, bucket)) {
        print(chalk.red(batch.length));
        const currentTime = Date.now();
        const graceDays = this.props.isolationDays;
        const isolated = batch.filter((obj) => {
          return !activeAssets.contains(obj.getHash());
        });

        const deletables: S3Asset[] = graceDays > 0
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

        const taggables = graceDays > 0
          ? await Promise.all(isolated.map(async (obj) => {
            const hasTag = await obj.hasTag(s3, ISOLATED_TAG);
            return !hasTag ? obj : null;
          })).then(results => results.filter(Boolean))
          : [];

        print(chalk.blue(deletables.length));
        print(chalk.white(taggables.length));

        if (!this.props.dryRun) {
          await this.parallelDelete(s3, bucket, deletables);
          // parallelTag(taggables, ISOLATED_TAG)
        }

        // TODO: maybe undelete
      }
    } finally {
      clearInterval(timer);
    }
  }

  private async parallelDelete(s3: S3, bucket: string, deletables: S3Asset[]) {
    const objectsToDelete: S3.ObjectIdentifierList = deletables.map(asset => ({
      Key: asset.key,
    }));

    // eslint-disable-next-line no-console
    console.log('O', objectsToDelete);

    try {
      await s3.deleteObjects({
        Bucket: bucket,
        Delete: {
          Objects: objectsToDelete,
          Quiet: true,
        },
      }).promise();
    } catch (err) {
      print(chalk.red(`Error deleting objects: ${err}`));
    }
  }

  private async getBootstrapBucketName(sdk: ISDK, bootstrapStackName: string): Promise<string> {
    const info = await ToolkitInfo.lookup(this.props.resolvedEnvironment, sdk, bootstrapStackName);
    return info.bucketName;
  }

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

  private async fetchAllStackTemplates(cfn: CloudFormation) {
    const stackNames: string[] = [];
    await paginateSdkCall(async (nextToken) => {
      const response = await cfn.listStacks({ NextToken: nextToken }).promise();
      // Deleted stacks are ignored
      // TODO: need to filter for bootstrap version!!!
      stackNames.push(...(response.StackSummaries ?? []).filter(s => !['DELETE_COMPLETE', 'DELETE_IN_PROGRESS'].includes(s.StackStatus)).map(s => s.StackId ?? s.StackName));
      return response.NextToken;
    });

    print(chalk.blue(`Parsing through ${stackNames.length} stacks`));

    const templates: string[] = [];
    for (const stack of stackNames) {
      let summary;
      summary = await cfn.getTemplateSummary({
        StackName: stack,
      }).promise();
      const template = await cfn.getTemplate({
        StackName: stack,
      }).promise();

      templates.push(template.TemplateBody ?? '' + summary?.Parameters);
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
