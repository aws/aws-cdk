import * as path from 'path';
import type { IDependable } from 'constructs';
import { Construct, DependencyGroup } from 'constructs';
import * as iam from '../../../aws-iam';
import type { CfnBucket, IBucket } from '../../../aws-s3';
import { Bucket, BucketGrants } from '../../../aws-s3';
import type { ISource } from '../../../aws-s3-deployment';
import { BucketDeployment, Source } from '../../../aws-s3-deployment';
import type {
  DockerImageAssetLocation,
  DockerImageAssetSource,
  FileAssetLocation,
  FileAssetSource,
  ISynthesisSession,
} from '../../../core';
import {
  Annotations,
  Aws,
  CfnMapping,
  FileAssetPackaging,
  Resource,
  Stack,
  StackSynthesizer,
  Stage,
  Token,
  UnscopedValidationError,
  ValidationError,
} from '../../../core';
import { AssumptionError } from '../../../core/lib/errors';
import { lit } from '../../../core/lib/private/literal-string';

/**
 * Where the host stack of a StackSet creates the constructs that copy the StackSet's file assets
 */
interface StackSetHost {
  /**
   * The stack that contains the StackSet
   */
  readonly stack: Stack;

  /**
   * The scope of the StackSet, within the host stack
   */
  readonly scope: Construct;

  /**
   * The construct ID of the StackSet, prefixed to the IDs of the constructs created in `scope`
   */
  readonly id: string;

  /**
   * The bucket of each region that holds the file assets, keyed by region name
   *
   * @default - no asset buckets, file assets can't be used
   */
  readonly assetBuckets?: { [region: string]: IBucket };
}

/**
 * Where the file assets are staged in the host stack
 */
interface StagedAssets {
  /**
   * The scope of the constructs that copy the assets
   */
  readonly scope: Construct;

  /**
   * The asset bucket of the host stack
   */
  readonly hostBucket: IBucket;
}

/**
 * An asset bucket, with its name resolved to a literal
 */
interface AssetBucket {
  readonly region: string;
  readonly bucket: IBucket;
  readonly bucketName: string;
}

/**
 * The key prefix of the file assets in the asset buckets
 */
export const ASSET_KEY_PREFIX = 'cdk-stackset-assets/';

const STACK_SET_SYNTHESIZER_SYMBOL = Symbol.for('aws-cdk-lib.aws-cloudformation.StackSetSynthesizer');

/**
 * Deployment environment for the template of a StackSet.
 *
 * File assets are staged by the host stack of the StackSet, and copied to the
 * asset bucket of each region with a `BucketDeployment` in that stack. The
 * template reads them from the bucket of the region it is deployed to.
 */
export class StackSetSynthesizer extends StackSynthesizer {
  /**
   * The synthesizer of a StackSet defined in this app, or `undefined` for anything else
   */
  public static of(x: any): StackSetSynthesizer | undefined {
    if (!Stack.isStack(x)) {
      return undefined;
    }
    const synthesizer: any = x.synthesizer;
    return isStackSetSynthesizer(synthesizer) ? synthesizer : undefined;
  }

  private readonly deploymentsByRegion = new Map<string, BucketDeployment>();
  private readonly deploymentGroup = new DependencyGroup();
  private readonly bucketsByRegion = new Map<string, AssetBucket>();
  private host?: StackSetHost;
  private staged?: StagedAssets;
  private bucketMapping?: CfnMapping;

  constructor() {
    super();
    Object.defineProperty(this, STACK_SET_SYNTHESIZER_SYMBOL, { value: true });
  }

  /**
   * The bucket deployments that copy the file assets to the asset buckets, and the grants to read them.
   *
   * Resolved when dependencies are rendered, so it includes assets added after a
   * StackSet takes a dependency on it.
   */
  public get assetDeployments(): IDependable {
    return this.deploymentGroup;
  }

  /**
   * Sets the host stack that stages the file assets, and the asset buckets the assets are copied to
   */
  public bindHost(host: StackSetHost) {
    this.host = host;
    const buckets = host.assetBuckets ?? {};
    // Sorted, so that the order of the regions doesn't change the template
    for (const region of Object.keys(buckets).sort()) {
      this.addAssetBucket(region, buckets[region]);
    }
  }

  public addFileAsset(asset: FileAssetSource): FileAssetLocation {
    if (!this.host?.assetBuckets) {
      throw new ValidationError(lit`AssetBucketRequired`, 'an asset bucket must be provided to use file assets, set \'assetBuckets\' in the StackSet props', this.boundStack);
    }

    if (!asset.fileName) {
      throw new UnscopedValidationError(lit`AssetFileNameRequired`, 'asset filename is required');
    }

    const hostObjectKey = this.stageAsset(asset);

    // BucketDeployment (extract: false) copies each object under the key prefix, with its file name only.
    // A token can't resolve during synth so rebuild the file name the way the asset manifest does.
    const extension = asset.packaging === FileAssetPackaging.ZIP_DIRECTORY ? '.zip' : path.extname(asset.fileName);
    const fileName = Token.isUnresolved(hostObjectKey) ? `${asset.sourceHash}${extension}` : path.posix.basename(hostObjectKey);
    const objectKey = `${ASSET_KEY_PREFIX}${fileName}`;

    // Each stack instance reads the asset from the bucket of its own region
    const bucketName = this.mapping().findInMap(Aws.REGION, 'BucketName');
    const s3ObjectUrl = `s3://${bucketName}/${objectKey}`;
    const httpUrl = `https://s3.${this.boundStack.region}.${this.boundStack.urlSuffix}/${bucketName}/${objectKey}`;

    return { bucketName, objectKey, httpUrl, s3Url: httpUrl, s3ObjectUrl };
  }

  /**
   * Grants read access to the file assets in the asset buckets that are defined in the app
   */
  public grantReadAssets(grantee: iam.IGrantable): iam.Grant {
    let result: iam.Grant | undefined;
    for (const assetBucket of this.bucketsByRegion.values()) {
      const grant = this.grantReadBucket(grantee, assetBucket);
      if (grant) {
        result = result ? result.combine(grant) : grant;
      }
    }
    return result ?? iam.Grant.drop(grantee, 'read the file assets of a StackSet without asset buckets defined in the app');
  }

  public addDockerImageAsset(_asset: DockerImageAssetSource): DockerImageAssetLocation {
    throw new UnscopedValidationError(lit`DockerAssetsNotSupported`, 'docker image assets are not supported in StackSets');
  }

  public synthesize(session: ISynthesisSession): void {
    // Synthesize the template, but don't emit as a cloud assembly artifact.
    // It will be registered as an S3 asset of the host stack instead.
    this.synthesizeTemplate(session);
  }

  /**
   * Adds the asset bucket of a region
   */
  private addAssetBucket(region: string, bucket: IBucket) {
    if (!this.host) {
      throw new AssumptionError(lit`StackSetHostNotBound`, 'the host stack of the StackSet must be set before asset buckets are added');
    }
    this.checkBucketRegion(region, bucket);
    this.bucketsByRegion.set(region, { region, bucket, bucketName: this.bucketNameOf(region, bucket, this.host.stack) });
  }

  /**
   * Grants read access to the file assets in a bucket defined in the app
   *
   * @returns the grant, or `undefined` for a referenced bucket
   */
  private grantReadBucket(grantee: iam.IGrantable, { region, bucket }: AssetBucket): iam.Grant | undefined {
    // The policy of a referenced bucket is managed outside of the app
    if (!Resource.isOwnedResource(bucket)) {
      Annotations.of(this.boundStack).addWarningV2('@aws-cdk/aws-cloudformation:stackSetAssetBucketNotGranted',
        `the asset bucket for region ${JSON.stringify(region)} is referenced, so CDK can't change its policy, allow the target accounts to read 'cdk-stackset-assets/*' in its bucket policy`);
      return undefined;
    }
    // Also grants kms:Decrypt on the key of a bucket encrypted with a key defined in the app
    const grant = BucketGrants.fromBucket(bucket).actionsOnObjectKeys(grantee, `${ASSET_KEY_PREFIX}*`, 's3:GetObject', 'kms:Decrypt');

    // The stack instances read the assets, so the StackSet is deployed after the permissions.
    // Dependencies can't cross Stages, so a bucket in another Stage must be deployed first.
    if (this.isInHostStage(bucket)) {
      this.deploymentGroup.add(grant);
    }
    return grant;
  }

  /**
   * Whether a bucket is in the Stage of the host stack, which dependencies can't leave
   */
  private isInHostStage(bucket: IBucket): boolean {
    return Stage.of(bucket) === Stage.of(this.host?.stack ?? this.boundStack);
  }

  /**
   * A bucket defined in the app must be in the region it is the asset bucket of
   *
   * A referenced bucket reports the region of the stack that references it, so it can't be checked.
   */
  private checkBucketRegion(region: string, bucket: IBucket) {
    const bucketRegion = bucket.env.region;
    if (Resource.isOwnedResource(bucket) && !Token.isUnresolved(bucketRegion) && bucketRegion !== region) {
      throw new ValidationError(lit`StackSetAssetBucketRegionMismatch`,
        `the asset bucket for region ${JSON.stringify(region)} is in region ${JSON.stringify(bucketRegion)}, use the region of each bucket as its key`, this.boundStack);
    }
  }

  /**
   * The name of a bucket, which the mapping in the template needs as a literal
   */
  private bucketNameOf(region: string, bucket: IBucket, host: Stack): string {
    // A bucket referenced by name, or of another environment, resolves to its physical name
    const resolved = host.resolve(bucket.bucketName);
    if (typeof resolved === 'string') {
      return resolved;
    }

    // A bucket of the same environment resolves to a reference, so read the name it is created with
    if (Resource.isOwnedResource(bucket)) {
      const cfnBucket = bucket.node.defaultChild as CfnBucket;
      const name = Stack.of(cfnBucket).resolve(cfnBucket.bucketName);
      if (typeof name === 'string') {
        return name;
      }
    }

    throw new ValidationError(lit`BucketNameRequiredForAssets`,
      `the name of the asset bucket for region ${JSON.stringify(region)} must be known at synth time, set 'bucketName' on the bucket`, this.boundStack);
  }

  /**
   * The mapping from region to asset bucket name in the template, created with the first file asset
   */
  private mapping(): CfnMapping {
    if (!this.bucketMapping) {
      const buckets = [...this.bucketsByRegion.values()];
      this.bucketMapping = new CfnMapping(this.boundStack, 'StackSetAssetBuckets', {
        mapping: Object.fromEntries(buckets.map(b => [b.region, { BucketName: b.bucketName }])),
      });
    }
    return this.bucketMapping;
  }

  /**
   * Stages the asset in the host stack and copies it to the asset bucket of each region
   *
   * @returns the object key of the asset in the host stack's asset bucket
   */
  private stageAsset(asset: FileAssetSource): string {
    if (!this.host) {
      throw new AssumptionError(lit`StackSetHostNotBound`, 'the host stack of the StackSet must be set before file assets are added');
    }
    const { stack: host, scope, id } = this.host;
    const hostLocation = host.synthesizer.addFileAsset(asset);

    // The constructs that copy the assets belong to the host stack, so they can't be children of the StackSet
    if (!this.staged) {
      const assetsScope = new Construct(scope, `${id}.Assets`);
      this.staged = {
        scope: assetsScope,
        hostBucket: Bucket.fromBucketName(assetsScope, 'HostAssetBucket', hostLocation.bucketName),
      };
    }

    // Copy the object the host synthesizer publishes, instead of re-staging a local path
    const source = Source.bucket(this.staged.hostBucket, hostLocation.objectKey);
    for (const assetBucket of this.bucketsByRegion.values()) {
      this.copyAsset(source, assetBucket);
    }

    return hostLocation.objectKey;
  }

  /**
   * Copies a staged asset to an asset bucket, with one bucket deployment per region
   */
  private copyAsset(source: ISource, { region, bucket }: AssetBucket) {
    if (!this.host || !this.staged) {
      throw new AssumptionError(lit`StackSetAssetsNotStaged`, 'the file assets of the StackSet must be staged before they are copied');
    }
    const existing = this.deploymentsByRegion.get(region);
    if (existing) {
      existing.addSource(source);
      return;
    }

    const deployment = new BucketDeployment(this.staged.scope, region, {
      sources: [source],
      destinationBucket: bucket,
      destinationKeyPrefix: ASSET_KEY_PREFIX,
      extract: false,
      prune: false,
    });
    this.deploymentsByRegion.set(region, deployment);
    this.deploymentGroup.add(deployment);

    // A bucket of another environment is referenced by its name, which adds no dependency on its stack
    const host = this.host.stack;
    const bucketStack = Stack.of(bucket);
    if (Resource.isOwnedResource(bucket) && bucketStack !== host && this.isInHostStage(bucket)) {
      host.addStackDependency(bucketStack, `the asset bucket for region ${region} of ${this.boundStack.node.path}`);
    }
  }
}

function isStackSetSynthesizer(x: unknown): x is StackSetSynthesizer {
  return x !== null && typeof x === 'object' && STACK_SET_SYNTHESIZER_SYMBOL in x;
}
