import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import type { Construct, IDependable } from 'constructs';
import { DependencyGroup } from 'constructs';
import type { IBucket } from '../../aws-s3';
import { Bucket } from '../../aws-s3';
import { BucketDeployment, Source } from '../../aws-s3-deployment';
import {
  Stack,
  StackSynthesizer,
  Names,
  FileAssetPackaging,
  Resource,
  Annotations,
  Fn,
  Aws,
  Token,
  ValidationError,
} from '../../core';
import type {
  FileAssetSource,
  FileAssetLocation,
  DockerImageAssetLocation,
  DockerImageAssetSource,
  ISynthesisSession,
} from '../../core';
import type { IBox } from '../../core/lib/helpers-internal';
import { Box } from '../../core/lib/helpers-internal';
import { noBoxStackTraces } from '../../core/lib/no-box-stack-traces';
import { lit } from '../../core/lib/private/literal-string';

interface AssetBucketDeploymentProperties {
  assetBucket: IBucket;
  bucketDeployment?: BucketDeployment;
}

/**
 * Deployment environment for an AWS StackSet stack.
 *
 * Interoperates with the StackSynthesizer of the parent stack.
 */
class StackSetStackSynthesizer extends StackSynthesizer {
  /**
   * An array of Buckets can be passed to store assets, enabling StackSetStack Asset support
   *
   * One Bucket is required per target region. The name must be `${assetBucketPrefix}-<region>`, where
   * `<region>` is the region targeted by the StackSet.
   *
   * @default - No Buckets provided and Assets will not be supported.
   */
  readonly assetBuckets?: IBucket[];
  /**
   * The common prefix for the asset bucket names used by this StackSetStack.
   *
   * Required if `assetBuckets` is provided.
   *
   * @default - No Buckets provided and Assets will not be supported.
   */
  readonly assetBucketPrefix?: string;
  private bucketDeployments: { [key: string]: AssetBucketDeploymentProperties };
  private parentAssetBucket?: IBucket;
  private readonly assetDeployments = new DependencyGroup();

  /**
   * Creates a new StackSetStackSynthesizer.
   *
   * @param assetBuckets An array of S3 buckets to use for storing assets.
   * @param assetBucketPrefix The prefix to use for the asset bucket names.
   */
  constructor(assetBuckets?: IBucket[], assetBucketPrefix?: string) {
    super();
    this.assetBuckets = assetBuckets;
    this.assetBucketPrefix = assetBucketPrefix;
    this.bucketDeployments = {};
    for (const assetBucket of assetBuckets ?? []) {
      this.bucketDeployments[assetBucket.bucketName] = { assetBucket };
    }
  }

  /**
   * The bucket deployments that copy this stack's file assets to the asset buckets.
   *
   * Resolved when dependencies are rendered, so it includes assets added after a
   * StackSet takes a dependency on it.
   *
   * @internal
   */
  public get _assetDeployments(): IDependable {
    return this.assetDeployments;
  }

  public addFileAsset(asset: FileAssetSource): FileAssetLocation {
    if (!this.assetBuckets) {
      throw new ValidationError(lit`AssetBucketRequired`, 'an asset bucket must be provided to use file assets, set \'assetBuckets\' in the StackSetStack props', this.boundStack);
    }

    if (!this.assetBucketPrefix) {
      throw new ValidationError(lit`AssetBucketPrefixRequired`, 'an asset bucket prefix must be provided to use file assets, set \'assetBucketPrefix\' in the StackSetStack props', this.boundStack);
    }

    if (!asset.fileName) {
      throw new ValidationError(lit`AssetFileNameRequired`, 'asset filename is undefined', this.boundStack);
    }

    const parentStack = (this.boundStack as StackSetStack)._getParentStack();

    // Delegate to the parent stack's synthesizer to handle asset staging
    const parentLocation = parentStack.synthesizer.addFileAsset(asset);

    // Create a reference to the parent's asset bucket (lazily, once)
    if (!this.parentAssetBucket) {
      this.parentAssetBucket = Bucket.fromBucketName(
        this.boundStack,
        'ParentAssetBucket',
        parentLocation.bucketName,
      );
    }

    // Copy the object the parent synthesizer publishes, instead of re-staging a local path
    const source = Source.bucket(this.parentAssetBucket, parentLocation.objectKey);

    for (const assetBucket of this.assetBuckets) {
      const index = this.assetBuckets.indexOf(assetBucket);
      const assetDeployment = this.bucketDeployments[assetBucket.bucketName];

      if (!assetDeployment.bucketDeployment) {
        if (!Resource.isOwnedResource(assetDeployment.assetBucket)) {
          Annotations.of(parentStack).addWarningV2('@aws-cdk/aws-cloudformation:stackSetAssetsBucketPermissions',
            'Bucket Policy Permissions cannot be added to' +
              ' referenced Bucket. Please make sure your bucket has the correct permissions');
        }

        const bucketDeploymentConstructName = `${Names.uniqueId(this.boundStack)}-AssetBucketDeployment-${index}`;

        const bucketDeployment = new BucketDeployment(
          parentStack,
          bucketDeploymentConstructName,
          {
            sources: [source],
            destinationBucket: assetDeployment.assetBucket,
            extract: false,
            prune: false,
          },
        );

        assetDeployment.bucketDeployment = bucketDeployment;
        this.assetDeployments.add(bucketDeployment);
      } else {
        assetDeployment.bucketDeployment.addSource(source);
      }
    }

    // Resolve the bucket per target region at deploy time
    const bucketName = Fn.join('-', [this.assetBucketPrefix, Aws.REGION]);
    // BucketDeployment (extract: false) copies each object to the bucket root under its file name only.
    // A token can't resolve during synth so rebuild the file name the way the asset manifest does.
    const extension = asset.packaging === FileAssetPackaging.ZIP_DIRECTORY ? '.zip' : path.extname(asset.fileName);
    const objectKey = Token.isUnresolved(parentLocation.objectKey) ? `${asset.sourceHash}${extension}` : path.posix.basename(parentLocation.objectKey);
    const s3ObjectUrl = `s3://${bucketName}/${objectKey}`;
    const httpUrl = `https://s3.${bucketName}/${objectKey}`;

    return { bucketName, objectKey, httpUrl, s3ObjectUrl };
  }

  public addDockerImageAsset(_asset: DockerImageAssetSource): DockerImageAssetLocation {
    throw new ValidationError(lit`DockerAssetsNotSupported`, 'docker image assets are not supported in StackSet stacks', this.boundStack);
  }

  public synthesize(session: ISynthesisSession): void {
    // Synthesize the template, but don't emit as a cloud assembly artifact.
    // It will be registered as an S3 asset of its parent instead.
    this.synthesizeTemplate(session);
  }
}

/**
 * StackSet stack props.
 */
export interface StackSetStackProps {
  /**
   * An array of Buckets can be passed to store assets, enabling StackSetStack Asset support
   *
   * One Bucket is required per target region. The name must be `${assetBucketPrefix}-<region>`, where
   * `<region>` is the region targeted by the StackSet.
   *
   * The full bucket interface is required because the assets are copied with a
   * `BucketDeployment`, which needs it. [disable-awslint:prefer-ref-interface]
   *
   * @default - No Buckets provided and Assets will not be supported.
   */
  readonly assetBuckets?: IBucket[];
  /**
   * The common prefix for the asset bucket names used by this StackSetStack.
   *
   * Required if `assetBuckets` is provided.
   *
   * @default - No Buckets provided and Assets will not be supported.
   */
  readonly assetBucketPrefix?: string;
}

/**
 * A StackSet stack, which is similar to a normal CloudFormation stack with
 * some differences.
 *
 * This stack will not be treated as an independent deployment
 * artifact (won't be listed in "cdk list" or deployable through "cdk deploy"),
 * but rather only synthesized as a template and uploaded as an asset to S3.
 */
@noBoxStackTraces
export class StackSetStack extends Stack {
  public readonly templateFile: string;
  private readonly _templateUrl: IBox<string | undefined> = Box.fromValue<string | undefined>(undefined);
  private _parentStack: Stack;

  /**
   * Creates a new StackSetStack.
   * @param scope The scope in which to define this StackSet.
   * @param id The ID of the StackSet.
   * @param props The properties of the StackSet.
   */
  constructor(scope: Construct, id: string, props: StackSetStackProps = {}) {
    super(scope, id, {
      synthesizer: new StackSetStackSynthesizer(props.assetBuckets, props.assetBucketPrefix),
    });

    this._parentStack = findParentStack(scope);

    // this is the file name of the synthesized template file within the cloud assembly
    this.templateFile = `${Names.uniqueId(this)}.stackset.template.json`;
  }

  /**
   * Fetch the template URL.
   *
   * @internal
   */
  public _getTemplateUrl(): string {
    return Token.asString(this._templateUrl);
  }

  /**
   * Fetch the Parent Stack.
   *
   * @internal
   */
  public _getParentStack(): Stack {
    return this._parentStack;
  }

  /**
   * Fetch the bucket deployments that copy this stack's file assets.
   *
   * @internal
   */
  public _getAssetDeployments(): IDependable {
    return (this.synthesizer as StackSetStackSynthesizer)._assetDeployments;
  }

  /**
   * Synthesize the product stack template, overrides the `super` class method.
   *
   * Defines an asset at the parent stack which represents the template of this
   * product stack.
   *
   * @internal
   */
  public _synthesizeTemplate(session: ISynthesisSession): void {
    const cfn = JSON.stringify(this._toCloudFormation(), undefined, 2);
    const templateHash = crypto.createHash('sha256').update(cfn).digest('hex');

    this._templateUrl.set(this._parentStack.synthesizer.addFileAsset({
      packaging: FileAssetPackaging.FILE,
      sourceHash: templateHash,
      fileName: this.templateFile,
    }).httpUrl);

    fs.writeFileSync(path.join(session.assembly.outdir, this.templateFile), cfn);
  }
}

/**
 * Validates the scope for a stackset stack, which must be defined within the scope of another `Stack`.
 */
function findParentStack(scope: Construct): Stack {
  try {
    const parentStack = Stack.of(scope);
    return parentStack as Stack;
  } catch {
    throw new ValidationError(lit`StackSetStackMustBeDefinedWithinStack`, 'a StackSetStack must be defined within the scope of another non-stackset stack', scope);
  }
}
