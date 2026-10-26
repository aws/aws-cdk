import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import type { Construct, IConstruct, IDependable } from 'constructs';
import { DependencyGroup } from 'constructs';
import type { IBucket } from '../../aws-s3';
import { Bucket } from '../../aws-s3';
import { BucketDeployment, Source } from '../../aws-s3-deployment';
import {
  Stack,
  Stage,
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
import {
  addTemplateConsumer,
  isConsumerHostedStack,
  markConsumerHostedStack,
  topLevelStackOf,
} from '../../core/lib/private/consumer-hosted-stack';
import { lit } from '../../core/lib/private/literal-string';

/**
 * A file asset of a StackSetStack, which every host stack publishes and copies to the asset buckets.
 */
interface NestedFileAsset {
  readonly source: FileAssetSource;
  /** The object key used when no host stack determines it */
  readonly defaultObjectKey: string;
  /** The object key the template references */
  readonly objectKey: IBox<string>;
  /** The object key the host stacks copy the asset to, once one host has it */
  hostObjectKey?: string;
}

/**
 * The copies of a StackSetStack's file assets that one host stack makes.
 */
interface HostAssetCopies {
  readonly host: Stack;
  /** The bucket deployments of this host, one per asset bucket */
  readonly bucketDeployments: BucketDeployment[];
  readonly deployments: DependencyGroup;
  sourceBucket?: IBucket;
}

/**
 * Deployment environment for an AWS StackSet stack.
 *
 * Every stack that hosts the template of the StackSet stack publishes the file
 * assets with its own synthesizer and copies them to the asset buckets.
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
  private readonly assets = new Array<NestedFileAsset>();
  private readonly hosts = new Map<Stack, HostAssetCopies>();

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
  }

  /**
   * Make `host` publish and copy every file asset of this stack, including assets added later.
   *
   * @returns the bucket deployments in `host` that copy the file assets. Resolved
   * when dependencies are rendered, so it includes assets added later.
   * @internal
   */
  public _addHost(host: Stack): IDependable {
    let copies = this.hosts.get(host);
    if (!copies) {
      copies = { host, bucketDeployments: [], deployments: new DependencyGroup() };
      this.hosts.set(host, copies);
      for (const asset of this.assets) {
        this.copyToHost(copies, asset);
      }
    }
    return copies.deployments;
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

    const extension = asset.packaging === FileAssetPackaging.ZIP_DIRECTORY ? '.zip' : path.extname(asset.fileName);
    const defaultObjectKey = `${asset.sourceHash}${extension}`;
    const nestedAsset: NestedFileAsset = { source: asset, defaultObjectKey, objectKey: Box.fromValue(defaultObjectKey) };
    this.assets.push(nestedAsset);

    for (const copies of this.hosts.values()) {
      this.copyToHost(copies, nestedAsset);
    }

    // Resolve the bucket per target region at deploy time
    const bucketName = Fn.join('-', [this.assetBucketPrefix, Aws.REGION]);
    const objectKey = Token.asString(nestedAsset.objectKey);
    const s3ObjectUrl = `s3://${bucketName}/${objectKey}`;
    const httpUrl = `https://s3.${bucketName}/${objectKey}`;

    return { bucketName, objectKey, httpUrl, s3ObjectUrl };
  }

  public addDockerImageAsset(_asset: DockerImageAssetSource): DockerImageAssetLocation {
    throw new ValidationError(lit`DockerAssetsNotSupported`, 'docker image assets are not supported in StackSet stacks', this.boundStack);
  }

  public synthesize(session: ISynthesisSession): void {
    // Synthesize the template, but don't emit as a cloud assembly artifact.
    // It will be registered as an S3 asset of each host stack instead.
    this.synthesizeTemplate(session);
  }

  /**
   * Publish `asset` with the synthesizer of the host and copy it to every asset bucket.
   */
  private copyToHost(copies: HostAssetCopies, asset: NestedFileAsset) {
    const assetBuckets = this.assetBuckets!;
    const location = copies.host.synthesizer.addFileAsset(asset.source);

    // BucketDeployment (extract: false) copies each object to the bucket root under its file name only.
    // A token can't resolve during synth so rebuild the file name the way the asset manifest does.
    const objectKey = Token.isUnresolved(location.objectKey) ? asset.defaultObjectKey : path.posix.basename(location.objectKey);
    if (asset.hostObjectKey === undefined) {
      asset.hostObjectKey = objectKey;
      asset.objectKey.set(objectKey);
    } else if (asset.hostObjectKey !== objectKey) {
      throw new ValidationError(lit`StackSetAssetObjectKeyMismatch`,
        `stack ${JSON.stringify(copies.host.node.path)} would copy asset ${JSON.stringify(asset.source.sourceHash)} to the asset buckets as ${JSON.stringify(objectKey)}, ` +
        `but another stack that uses this StackSetStack copies it as ${JSON.stringify(asset.hostObjectKey)}; ` +
        'give the synthesizers of these stacks the same \'bucketPrefix\', or a \'bucketPrefix\' that ends with \'/\'',
        this.boundStack);
    }

    // Copy the object the host synthesizer publishes, instead of re-staging a local path
    if (!copies.sourceBucket) {
      copies.sourceBucket = Bucket.fromBucketName(copies.host, `${Names.uniqueId(this.boundStack)}-AssetSourceBucket`, location.bucketName);
    }
    const source = Source.bucket(copies.sourceBucket, location.objectKey);

    assetBuckets.forEach((assetBucket, index) => {
      const bucketDeployment = copies.bucketDeployments[index];
      if (bucketDeployment) {
        bucketDeployment.addSource(source);
        return;
      }

      if (!Resource.isOwnedResource(assetBucket)) {
        Annotations.of(copies.host).addWarningV2('@aws-cdk/aws-cloudformation:stackSetAssetsBucketPermissions',
          'Bucket Policy Permissions cannot be added to' +
            ' referenced Bucket. Please make sure your bucket has the correct permissions');
      }

      const deployment = new BucketDeployment(copies.host, `${Names.uniqueId(this.boundStack)}-AssetBucketDeployment-${index}`, {
        sources: [source],
        destinationBucket: assetBucket,
        extract: false,
        prune: false,
      });
      copies.bucketDeployments[index] = deployment;
      copies.deployments.add(deployment);
    });
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
 * The template URL and dependencies a StackSet gets from a StackSetStack.
 */
interface StackSetStackBinding {
  /**
   * The URL of the template in the asset location of the stack of the StackSet
   */
  readonly templateUrl: string;

  /**
   * Resources in the stack of the StackSet that must be deployed before the StackSet
   */
  readonly dependencies: IDependable[];
}

/**
 * The template asset of a StackSetStack in one host stack.
 */
interface HostTemplate {
  readonly host: Stack;
  readonly templateUrl: IBox<string | undefined>;
  readonly templateUrlToken: string;
  readonly dependencies: IDependable[];
}

/**
 * A StackSet stack, which is similar to a normal CloudFormation stack with
 * some differences.
 *
 * This stack will not be treated as an independent deployment
 * artifact (won't be listed in "cdk list" or deployable through "cdk deploy"),
 * but rather only synthesized as a template and uploaded as an asset to S3
 * by every stack that has a StackSet using it.
 */
@noBoxStackTraces
export class StackSetStack extends Stack {
  public readonly templateFile: string;
  private readonly hostTemplates = new Map<Stack, HostTemplate>();
  private template?: string;

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

    markConsumerHostedStack(this);

    // this is the file name of the synthesized template file within the cloud assembly
    this.templateFile = `${Names.uniqueId(this)}.stackset.template.json`;
  }

  /**
   * Make the stack of `consumer` host this stack's template and file assets.
   *
   * @returns the template URL in that stack and the resources in it that must
   * be deployed before `consumer`
   * @internal
   */
  public _bindConsumer(consumer: IConstruct): StackSetStackBinding {
    const host = Stack.of(consumer);

    if (Stage.of(host) !== Stage.of(this)) {
      throw new ValidationError(lit`StackSetStackInDifferentStage`,
        `a StackSet must be in the same Stage as the StackSetStack of its template, got StackSetStack ${JSON.stringify(this.node.path)}; ` +
        'define the StackSetStack in the Stage of the StackSet',
        consumer);
    }
    if (isConsumerHostedStack(topLevelStackOf(host))) {
      throw new ValidationError(lit`StackSetInStackSetStack`,
        `a StackSet cannot be defined inside a StackSetStack, got StackSetStack ${JSON.stringify(topLevelStackOf(host).node.path)}; ` +
        'define the StackSet in a regular stack',
        consumer);
    }

    addTemplateConsumer(this, consumer);

    let hostTemplate = this.hostTemplates.get(host);
    if (!hostTemplate) {
      const templateUrl = Box.fromValue<string | undefined>(undefined);
      const deployments = (this.synthesizer as StackSetStackSynthesizer)._addHost(host);
      hostTemplate = { host, templateUrl, templateUrlToken: Token.asString(templateUrl), dependencies: [deployments] };
      this.hostTemplates.set(host, hostTemplate);
    }

    return { templateUrl: hostTemplate.templateUrlToken, dependencies: hostTemplate.dependencies };
  }

  /**
   * Render the template once and register it as a file asset of every host stack.
   *
   * @internal
   */
  public _prepareTemplateAsset(): void {
    if (this.template !== undefined) {
      return;
    }

    this.template = JSON.stringify(this._toCloudFormation(), undefined, 2);
    const templateHash = crypto.createHash('sha256').update(this.template).digest('hex');

    for (const { host, templateUrl } of this.hostTemplates.values()) {
      templateUrl.set(host.synthesizer.addFileAsset({
        packaging: FileAssetPackaging.FILE,
        sourceHash: templateHash,
        fileName: this.templateFile,
      }).httpUrl);
    }
  }

  /**
   * Write the template that was rendered when its asset was registered.
   *
   * @internal
   */
  public _synthesizeTemplate(session: ISynthesisSession): void {
    this._prepareTemplateAsset();
    fs.writeFileSync(path.join(session.assembly.outdir, this.templateFile), this.template!);
  }
}
