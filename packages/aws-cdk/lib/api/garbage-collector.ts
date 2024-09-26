import * as cxapi from '@aws-cdk/cx-api';
import { ISDK, Mode, SdkProvider } from './aws-auth';
import { ToolkitInfo } from './toolkit-info';
import { print } from '../logging';
import { CloudFormation, S3 } from 'aws-sdk';
import * as chalk from 'chalk';
import * as path from 'path';

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
  private readonly activeHashes = new Set<string>();
  private readonly objects = new Map<string, S3Object>();
  private bootstrapBucketName: string | undefined =  undefined;

  private garbageCollectS3Assets: boolean;
  private garbageCollectEcrAssets: boolean;

  public constructor(readonly props: GarbageCollectorProps) {
    this.garbageCollectS3Assets = props.type === 's3' || props.type === 'all';
    this.garbageCollectEcrAssets = props.type === 'ecr' || props.type === 'all';

    // TODO: ECR garbage collection
    if (this.garbageCollectEcrAssets) {
      throw new Error('ECR garbage collection is not yet supported');
    }
  }

  /**
   * Perform garbage collection on the resolved environment(s)
   */
  public async garbageCollect() {
    print(chalk.green(`Garbage collecting for ${this.props.resolvedEnvironment.account} in ${this.props.resolvedEnvironment.region}`));
  
    // set up the sdks used in garbage collection
    const sdk = (await this.props.sdkProvider.forEnvironment(this.props.resolvedEnvironment, Mode.ForWriting)).sdk;
    const { cfn, s3 } = this.setUpSDKs(sdk);

    if (this.garbageCollectS3Assets) {
      print(chalk.green('Getting bootstrap bucket'));
      const bucket = await this.getBootstrapBucket(sdk);
      print(chalk.green(`Bootstrap Bucket ${bucket}`));
      await this.collectObjects(s3, bucket);
      print(chalk.blue(`Object hashes: ${this.objects.size}`));
    }

    await this.collectHashes(cfn);
    print(chalk.green(`Hashes in use: ${this.activeHashes.size}`));

    for (const hash of this.activeHashes) {
      const obj = this.objects.get(hash);
      if (obj) {
        obj.isolated = false;
      }
    }
    const isolatedObjects = Array.from(this.objects.values())
      .filter(obj => obj.isolated === true);

    print(chalk.red(`Isolated hashes: ${isolatedObjects.length}`));

    if (!this.props.dryRun) {
      if (this.garbageCollectS3Assets) {
        print(chalk.green('Tagging Isolated Objects'));
        this.tagObjects(s3, await this.getBootstrapBucket(sdk));
      }
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

  private async collectHashes(cfn: CloudFormation) {
    const stackNames: string[] = [];
    await paginateSdkCall(async (nextToken) => {
      const response = await cfn.listStacks({ NextToken: nextToken }).promise();
      stackNames.push(...(response.StackSummaries ?? []).map(s => s.StackId ?? s.StackName));
      return response.NextToken;
    });

    print(chalk.blue(`Parsing through ${stackNames.length} stacks`));

    for (const stack of stackNames) {
      const template = await cfn.getTemplate({
        StackName: stack,
      }).promise();

      const templateHashes = template.TemplateBody?.match(/[a-f0-9]{64}/g);
      templateHashes?.forEach(this.activeHashes.add, this.activeHashes);
    }

    print(chalk.blue(`Found ${this.activeHashes.size} unique hashes`));
  }

  private async getBootstrapBucket(sdk: ISDK): Promise<string> {
    if (!this.bootstrapBucketName) { 
      const info = await ToolkitInfo.lookup(this.props.resolvedEnvironment, sdk, undefined);
      this.bootstrapBucketName = info.bucketName;
    }
    return this.bootstrapBucketName;
  }

  private async collectObjects(s3: S3, bucket: string) {
    await paginateSdkCall(async (nextToken) => {
      const response = await s3.listObjectsV2({
        Bucket: bucket,
        ContinuationToken: nextToken,
      }).promise();
      response.Contents?.forEach((obj) => {
        let key = obj.Key;
        if (key) {
          let hash = path.parse(key).name;
          this.objects.set(hash, {
            key,
            hash,
            isolated: true, // Default is isolated
          });
        }
      });
      return response.NextContinuationToken;
    });
  }

  private async tagObjects(s3: S3, bucket: string) {
    let newlyTagged = 0;
    let alreadyTagged = 0;
    let newlyUntagged = 0;
    let alreadyUntagged = 0;
    for (const [_, obj] of this.objects) {
      if (obj.isolated) {
        const result = await this.tagIsolatedObject(s3, bucket, obj);
        if (result) {
          newlyTagged++;
        } else {
          alreadyTagged++;
        }
      } else {
        const result = await this.untagActiveObject(s3, bucket, obj);
        if (result) {
          newlyUntagged++;
        } else {
          alreadyUntagged++;
        }
      }
    }

    print(chalk.white(`Newly Tagged: ${newlyTagged}\nAlready Tagged: ${alreadyTagged}\nNewly Untagged: ${newlyUntagged}\nAlready Untagged: ${alreadyUntagged}`));
  }

  /**
   * Returns true if object gets tagged (was previously untagged but is now isolated)
   */
  private async tagIsolatedObject(s3: S3, bucket: string, object: S3Object) {
    const response = await s3.getObjectTagging({
      Bucket: bucket,
      Key: object.key,
    }).promise();
    const isolatedTag = await this.getIsolatedTag(response.TagSet);
  
    // tag new objects with the current date
    if (!isolatedTag) {
      await s3.putObjectTagging({
        Bucket: bucket,
        Key: object.key,
        Tagging: {
          TagSet: [{
            Key: ISOLATED_TAG,
            Value: Date.now().toString(),
          }],
        },
      }).promise();

      return true;
    }
    return false;
  }

  /**
   * Returns true if object gets untagged (was previously tagged but is now active)
   */
  private async untagActiveObject(s3: S3, bucket: string, object: S3Object) {
    const response = await s3.getObjectTagging({
      Bucket: bucket,
      Key: object.key,
    }).promise();
    const isolatedTag = await this.getIsolatedTag(response.TagSet);

    // remove isolated tag and put any other tags back
    if (isolatedTag) {
      const newTags = response.TagSet?.filter(tag => tag.Key !== ISOLATED_TAG);
      // TODO: double check what happens when newTags = []
      await s3.putObjectTagging({
        Bucket: bucket,
        Key: object.key,
        Tagging: {
          TagSet: newTags,
        },
      }).promise();

      return true;
    }
    return false;
  }

  private async getIsolatedTag(tags: S3.TagSet): Promise<string | undefined> {
    for (const tag of tags) {
      if (tag.Key === ISOLATED_TAG) {
        return tag.Value;
      }
    }
    return;
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

interface S3Object {
  readonly key: string;
  readonly hash: string;
  isolated: boolean;
}
