import * as path from 'path';
import type { Construct, IDependable } from 'constructs';
import { DependencyGroup } from 'constructs';
import type { IBucket } from '../../../aws-s3';
import { Bucket } from '../../../aws-s3';
import { BucketDeployment, Source } from '../../../aws-s3-deployment';
import type {
  DockerImageAssetLocation,
  DockerImageAssetSource,
  FileAssetLocation,
  FileAssetSource,
  ISynthesisSession,
  Stack,
} from '../../../core';
import {
  Annotations,
  Aws,
  FileAssetPackaging,
  Fn,
  Resource,
  StackSynthesizer,
  Token,
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
}

/**
 * Deployment environment for the template of a StackSet.
 *
 * File assets are staged by the host stack of the StackSet, and copied to the
 * asset buckets with a `BucketDeployment` in that stack.
 */
export class StackSetSynthesizer extends StackSynthesizer {
  private readonly bucketDeployments = new Map<IBucket, BucketDeployment>();
  private readonly assetDeploymentGroup = new DependencyGroup();
  private host?: StackSetHost;
  private hostAssetBucket?: IBucket;

  /**
   * @param assetBuckets An array of S3 buckets to use for storing assets.
   * @param assetBucketPrefix The prefix to use for the asset bucket names.
   */
  constructor(private readonly assetBuckets?: IBucket[], private readonly assetBucketPrefix?: string) {
    super();
  }

  /**
   * The bucket deployments that copy the file assets to the asset buckets.
   *
   * Resolved when dependencies are rendered, so it includes assets added after a
   * StackSet takes a dependency on it.
   */
  public get assetDeployments(): IDependable {
    return this.assetDeploymentGroup;
  }

  /**
   * Sets the host stack that stages the file assets
   */
  public bindHost(host: StackSetHost) {
    this.host = host;
  }

  public addFileAsset(asset: FileAssetSource): FileAssetLocation {
    if (!this.assetBuckets) {
      throw new ValidationError(lit`AssetBucketRequired`, 'an asset bucket must be provided to use file assets, set \'assetBuckets\' in the StackSet props', this.boundStack);
    }

    if (!this.assetBucketPrefix) {
      throw new ValidationError(lit`AssetBucketPrefixRequired`, 'an asset bucket prefix must be provided to use file assets, set \'assetBucketPrefix\' in the StackSet props', this.boundStack);
    }

    if (!asset.fileName) {
      throw new ValidationError(lit`AssetFileNameRequired`, 'asset filename is undefined', this.boundStack);
    }

    const hostObjectKey = this.stageAsset(asset);

    // BucketDeployment (extract: false) copies each object to the bucket root under its file name only.
    // A token can't resolve during synth so rebuild the file name the way the asset manifest does.
    const extension = asset.packaging === FileAssetPackaging.ZIP_DIRECTORY ? '.zip' : path.extname(asset.fileName);
    const objectKey = Token.isUnresolved(hostObjectKey) ? `${asset.sourceHash}${extension}` : path.posix.basename(hostObjectKey);

    // Resolve the bucket per target region at deploy time
    const bucketName = Fn.join('-', [this.assetBucketPrefix, Aws.REGION]);
    const s3ObjectUrl = `s3://${bucketName}/${objectKey}`;
    const httpUrl = `https://s3.${bucketName}/${objectKey}`;

    return { bucketName, objectKey, httpUrl, s3ObjectUrl };
  }

  public addDockerImageAsset(_asset: DockerImageAssetSource): DockerImageAssetLocation {
    throw new ValidationError(lit`DockerAssetsNotSupported`, 'docker image assets are not supported in StackSets', this.boundStack);
  }

  public synthesize(session: ISynthesisSession): void {
    // Synthesize the template, but don't emit as a cloud assembly artifact.
    // It will be registered as an S3 asset of the host stack instead.
    this.synthesizeTemplate(session);
  }

  /**
   * Stages the asset in the host stack and copies it to the asset buckets
   *
   * @returns the object key of the asset in the host stack's asset bucket
   */
  private stageAsset(asset: FileAssetSource): string {
    if (!this.host) {
      throw new AssumptionError(lit`StackSetHostNotBound`, 'the host stack of the StackSet must be set before file assets are added');
    }
    const { stack: host, scope, id } = this.host;
    const hostLocation = host.synthesizer.addFileAsset(asset);

    // Create a reference to the host's asset bucket (lazily, once)
    if (!this.hostAssetBucket) {
      this.hostAssetBucket = Bucket.fromBucketName(scope, `${id}.HostAssetBucket`, hostLocation.bucketName);
    }

    // Copy the object the host synthesizer publishes, instead of re-staging a local path
    const source = Source.bucket(this.hostAssetBucket, hostLocation.objectKey);

    this.assetBuckets!.forEach((assetBucket, index) => {
      const bucketDeployment = this.bucketDeployments.get(assetBucket);
      if (bucketDeployment) {
        bucketDeployment.addSource(source);
        return;
      }

      if (!Resource.isOwnedResource(assetBucket)) {
        Annotations.of(host).addWarningV2('@aws-cdk/aws-cloudformation:stackSetAssetsBucketPermissions',
          'Bucket Policy Permissions cannot be added to' +
            ' referenced Bucket. Please make sure your bucket has the correct permissions');
      }

      const newBucketDeployment = new BucketDeployment(scope, `${id}.AssetBucketDeployment${index}`, {
        sources: [source],
        destinationBucket: assetBucket,
        extract: false,
        prune: false,
      });
      this.bucketDeployments.set(assetBucket, newBucketDeployment);
      this.assetDeploymentGroup.add(newBucketDeployment);
    });

    return hostLocation.objectKey;
  }
}
