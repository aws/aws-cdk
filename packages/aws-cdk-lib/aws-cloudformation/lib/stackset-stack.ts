import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import type { Construct, IDependable } from 'constructs';
import { DependencyGroup, Node } from 'constructs';
import type { IBucket } from '../../aws-s3';
import { Bucket, CfnBucket } from '../../aws-s3';
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
  UnscopedValidationError,
  ValidationError,
  attachCustomSynthesis,
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

/**
 * The S3 buckets that the file assets of a `StackSetStack` are copied to, one for each
 * region the StackSet deploys to.
 *
 * The template of a `StackSetStack` is deployed to every target region, and finds the asset
 * bucket of its region by name, as `${bucketNamePrefix}-<region>`.
 */
export class StackSetAssetBuckets {
  /**
   * Uses the given bucket for each region the StackSet deploys to.
   *
   * Each bucket must be named `${bucketNamePrefix}-<region>`, where `<region>` is its key in
   * `buckets`. A bucket name or prefix that is only known at deploy time, such as the name of a
   * bucket defined without an explicit `bucketName`, can't be checked at synthesis, and the stack
   * that contains the StackSet gets a warning. Give each bucket an explicit `bucketName` so the
   * name is checked.
   *
   * Every region that a StackSet with file assets deploys to needs a bucket. This is checked
   * when the app is synthesized.
   *
   * @param bucketNamePrefix the common prefix of the bucket names, the template adds `-<region>` to it
   * @param buckets the bucket for each region, keyed by the region name, such as `us-east-1`.
   * The full bucket interface is required because the assets are copied with a
   * `BucketDeployment`, which needs it. [disable-awslint:prefer-ref-interface]
   */
  public static fromBuckets(bucketNamePrefix: string, buckets: { [region: string]: IBucket }): StackSetAssetBuckets {
    if (bucketNamePrefix === '') {
      throw new UnscopedValidationError(lit`StackSetAssetBucketPrefixRequired`, 'the bucket name prefix must not be empty, the asset buckets are named "<bucketNamePrefix>-<region>"');
    }

    const assetBuckets = new StackSetAssetBuckets(bucketNamePrefix, { ...buckets });
    const regions = assetBuckets._regions;
    if (regions.length === 0) {
      throw new UnscopedValidationError(lit`StackSetAssetBucketsRequired`, 'at least one asset bucket must be provided, add a bucket for each region the StackSet targets');
    }

    for (const region of regions) {
      if (Token.isUnresolved(region)) {
        throw new UnscopedValidationError(lit`StackSetAssetBucketRegionUnresolved`, 'asset bucket regions must be region names known at synthesis, such as \'us-east-1\', not tokens');
      }

      const bucketName = assetBuckets.bucketNameAtSynthesis(region);
      const expectedName = assetBuckets._expectedBucketName(region);
      if (assetBuckets._isNameCheckable(region) && bucketName !== expectedName) {
        throw new UnscopedValidationError(lit`StackSetAssetBucketNameMismatch`,
          `the asset bucket for region ${JSON.stringify(region)} must be named ${JSON.stringify(expectedName)}, got ${JSON.stringify(bucketName)}, rename the bucket or change the bucket name prefix`);
      }
    }

    return assetBuckets;
  }

  private constructor(private readonly bucketNamePrefix: string, private readonly buckets: { [region: string]: IBucket }) { }

  /**
   * The name of the bucket for a region, if it's known at synthesis
   *
   * The `bucketName` attribute of a bucket defined in the app is always a token, so its
   * name is read from the `bucketName` given to its CloudFormation resource.
   */
  private bucketNameAtSynthesis(region: string): string | undefined {
    const bucket = this.buckets[region];
    const resource = bucket.node.defaultChild;
    const name = CfnBucket.isCfnBucket(resource) && resource.bucketName !== undefined ? resource.bucketName : bucket.bucketName;
    return Token.isUnresolved(name) ? undefined : name;
  }

  /**
   * The regions that have a bucket, sorted so that the result doesn't depend on the order of the buckets
   *
   * @internal
   */
  public get _regions(): string[] {
    return Object.keys(this.buckets).sort();
  }

  /**
   * The bucket for a region
   *
   * @internal
   */
  public _bucketFor(region: string): IBucket {
    return this.buckets[region];
  }

  /**
   * The name the bucket for a region must have
   *
   * When the prefix is a token, it's named by its parameter, so the result can be used in messages.
   *
   * @internal
   */
  public _expectedBucketName(region: string): string {
    const prefix = Token.isUnresolved(this.bucketNamePrefix) ? '<bucketNamePrefix>' : this.bucketNamePrefix;
    return `${prefix}-${region}`;
  }

  /**
   * Whether the name of the bucket for a region and the prefix are both known at synthesis, so they can be compared
   *
   * @internal
   */
  public _isNameCheckable(region: string): boolean {
    return !Token.isUnresolved(this.bucketNamePrefix) && this.bucketNameAtSynthesis(region) !== undefined;
  }

  /**
   * The name of the bucket for the region the template is deployed to, resolved at deploy time
   *
   * @internal
   */
  public _deployTimeBucketName(): string {
    return Fn.join('-', [this.bucketNamePrefix, Aws.REGION]);
  }
}

/**
 * A file asset of a StackSet stack
 */
interface StackSetFileAsset {
  readonly source: FileAssetSource;
  readonly objectKey: IBox<string>;
}

/**
 * Deployment environment for an AWS StackSet stack.
 *
 * File assets are staged by the host stack of the StackSet construct,
 * and copied to the asset buckets with a `BucketDeployment` in that stack.
 */
class StackSetStackSynthesizer extends StackSynthesizer {
  private readonly assets = new Array<StackSetFileAsset>();
  private readonly bucketDeployments = new Map<string, BucketDeployment>();
  private readonly assetDeployments = new DependencyGroup();
  private host?: Stack;
  private hostAssetBucket?: IBucket;

  /**
   * Creates a new StackSetStackSynthesizer.
   *
   * @param assetBuckets The S3 buckets to copy the file assets to, one for each region.
   */
  constructor(private readonly assetBuckets?: StackSetAssetBuckets) {
    super();
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

  /**
   * Whether this stack has file assets, including assets added after a StackSet uses it
   *
   * @internal
   */
  public get _hasFileAssets(): boolean {
    return this.assets.length > 0;
  }

  /**
   * Stages the file assets in the host stack (the stack hosting StackSet construct)
   *
   * @internal
   */
  public _bindHost(host: Stack) {
    this.host = host;
    for (const asset of this.assets) {
      this.stageAsset(host, asset);
    }
  }

  public addFileAsset(asset: FileAssetSource): FileAssetLocation {
    if (!this.assetBuckets) {
      throw new ValidationError(lit`AssetBucketRequired`, 'an asset bucket must be provided to use file assets, set \'assetBuckets: StackSetAssetBuckets.fromBuckets(...)\' in the StackSetStack props', this.boundStack);
    }

    if (!asset.fileName) {
      throw new ValidationError(lit`AssetFileNameRequired`, 'asset filename is undefined', this.boundStack);
    }

    // BucketDeployment (extract: false) copies each object to the bucket root under its file name only.
    // That file name is known once the host stack stages the asset, until then use the one the asset manifest uses.
    const extension = asset.packaging === FileAssetPackaging.ZIP_DIRECTORY ? '.zip' : path.extname(asset.fileName);
    const fileAsset = { source: asset, objectKey: Box.fromValue(`${asset.sourceHash}${extension}`) };
    this.assets.push(fileAsset);
    if (this.host) {
      this.stageAsset(this.host, fileAsset);
    }

    // Resolve the bucket per target region at deploy time
    const bucketName = this.assetBuckets._deployTimeBucketName();
    const objectKey = Token.asString(fileAsset.objectKey);
    const s3ObjectUrl = `s3://${bucketName}/${objectKey}`;
    const httpUrl = `https://s3.${bucketName}/${objectKey}`;

    return { bucketName, objectKey, httpUrl, s3ObjectUrl };
  }

  public addDockerImageAsset(_asset: DockerImageAssetSource): DockerImageAssetLocation {
    throw new ValidationError(lit`DockerAssetsNotSupported`, 'docker image assets are not supported in StackSet stacks', this.boundStack);
  }

  public synthesize(session: ISynthesisSession): void {
    // Synthesize the template, but don't emit as a cloud assembly artifact.
    // It will be registered as an S3 asset of the host stack instead.
    this.synthesizeTemplate(session);
  }

  /**
   * Stages the asset in the host stack and copies it to the asset buckets
   */
  private stageAsset(host: Stack, asset: StackSetFileAsset) {
    const hostLocation = host.synthesizer.addFileAsset(asset.source);
    if (!Token.isUnresolved(hostLocation.objectKey)) {
      asset.objectKey.set(path.posix.basename(hostLocation.objectKey));
    }

    // Create a reference to the host's asset bucket (lazily, once)
    if (!this.hostAssetBucket) {
      this.hostAssetBucket = Bucket.fromBucketName(host, `${Names.uniqueId(this.boundStack)}-HostAssetBucket`, hostLocation.bucketName);
    }

    // Copy the object the host synthesizer publishes, instead of re-staging a local path
    const source = Source.bucket(this.hostAssetBucket, hostLocation.objectKey);

    // In region order, so the first deployment, which defines the shared handler, doesn't depend on the order of the buckets
    for (const region of this.assetBuckets!._regions) {
      const bucketDeployment = this.bucketDeployments.get(region);
      if (bucketDeployment) {
        bucketDeployment.addSource(source);
        continue;
      }

      const assetBucket = this.assetBuckets!._bucketFor(region);

      if (!Resource.isOwnedResource(assetBucket)) {
        Annotations.of(host).addWarningV2('@aws-cdk/aws-cloudformation:stackSetAssetsBucketPermissions',
          'Bucket Policy Permissions cannot be added to' +
            ' referenced Bucket. Please make sure your bucket has the correct permissions');
      }

      if (!this.assetBuckets!._isNameCheckable(region)) {
        Annotations.of(host).addWarningV2('@aws-cdk/aws-cloudformation:stackSetAssetBucketNameUnchecked',
          `the name of the asset bucket for region ${JSON.stringify(region)} is not known at synthesis, so it can't be checked, ` +
            `make sure the bucket is named ${JSON.stringify(this.assetBuckets!._expectedBucketName(region))} or give it an explicit 'bucketName'`);
      }

      const newBucketDeployment = new BucketDeployment(host, `${Names.uniqueId(this.boundStack)}-AssetBucketDeployment-${region}`, {
        sources: [source],
        destinationBucket: assetBucket,
        extract: false,
        prune: false,
      });
      this.bucketDeployments.set(region, newBucketDeployment);
      this.assetDeployments.add(newBucketDeployment);
    }
  }
}

/**
 * StackSet stack props.
 */
export interface StackSetStackProps {
  /**
   * The S3 buckets to copy the file assets of this stack to, one for each region the StackSet deploys to
   *
   * Required to use file assets, such as the code of a Lambda function.
   *
   * @default - file assets are not supported
   */
  readonly assetBuckets?: StackSetAssetBuckets;
}

/**
 * A StackSet stack, which is similar to a normal CloudFormation stack with
 * some differences.
 *
 * This stack will not be treated as an independent deployment
 * artifact (won't be listed in "cdk list" or deployable through "cdk deploy"),
 * but rather only synthesized as a template. The hosting stack of the StackSet construct
 * uploads the template and its file assets.
 *
 * A StackSet stack must be defined at the top level of an App or Stage, and is
 * always environment agnostic.
 */
@noBoxStackTraces
export class StackSetStack extends Stack {
  public readonly templateFile: string;
  private readonly _templateUrl: IBox<string | undefined> = Box.fromValue<string | undefined>(undefined);
  private readonly stackSetSynthesizer: StackSetStackSynthesizer;
  private readonly assetBuckets?: StackSetAssetBuckets;
  private host?: Stack;

  /**
   * Creates a new StackSetStack.
   * @param scope The scope in which to define this StackSet.
   * @param id The ID of the StackSet.
   * @param props The properties of the StackSet.
   */
  constructor(scope: Construct, id: string, props: StackSetStackProps = {}) {
    if (Node.of(scope).scopes.some(s => Stack.isStack(s))) {
      throw new ValidationError(lit`StackSetStackMustBeTopLevel`, 'a StackSetStack must be defined at the top level of an App or Stage, not inside a Stack', scope);
    }

    const synthesizer = new StackSetStackSynthesizer(props.assetBuckets);
    super(scope, id, {
      // The template is deployed to the accounts and regions targeted by the StackSet
      env: { account: Aws.ACCOUNT_ID, region: Aws.REGION },
      synthesizer,
    });
    this.stackSetSynthesizer = synthesizer;
    this.assetBuckets = props.assetBuckets;

    // this is the file name of the synthesized template file within the cloud assembly
    this.templateFile = `${Names.uniqueId(this)}.stackset.template.json`;
  }

  /**
   * Resources in a `StackSetStack` can't reference resources in other stacks,
   * and other stacks can't reference its resources, because its template is
   * deployed to other accounts and regions.
   *
   * Users need to pass values as StackSet `parameters` or `parameterOverrides` instead.
   *
   * @internal
   */
  public _supportsCrossStackReferences(): boolean {
    return false;
  }

  /**
   * Binds this stack to a StackSet
   *
   * @param scope the StackSet that uses this stack's template
   * @internal
   */
  public _bind(scope: Construct): {
    readonly templateUrl: string;
    readonly dependencies: IDependable[];
    readonly assetBuckets?: StackSetAssetBuckets;
    readonly hasFileAssets: () => boolean;
  } {
    const host = Stack.of(scope);

    if (Stage.of(host) !== Stage.of(this)) {
      throw new ValidationError(lit`StackSetStackInDifferentStage`,
        `a StackSetStack must be in the same Stage as the StackSets that use it, "${this.node.path}" is used by "${scope.node.path}" in another Stage`, scope);
    }

    if (this.host && this.host !== host) {
      throw new ValidationError(lit`StackSetStackUsedInMultipleStacks`,
        `StackSetStack "${this.node.path}" is already used by a StackSet in stack "${this.host.node.path}", ` +
        `create another StackSetStack for the StackSets in stack "${host.node.path}"`, scope);
    }

    if (!this.host) {
      this.host = host;
      this.stackSetSynthesizer._bindHost(host);
      // Runs before the host stack is synthesized, wherever this stack is in the tree
      attachCustomSynthesis(scope, { onSynthesize: (session) => this.addTemplateAsset(host, session) });
    }

    return {
      templateUrl: Token.asString(this._templateUrl),
      dependencies: [this.stackSetSynthesizer._assetDeployments],
      assetBuckets: this.assetBuckets,
      hasFileAssets: () => this.stackSetSynthesizer._hasFileAssets,
    };
  }

  /**
   * Writes the template file - the template is uploaded as an asset of the host stack
   *
   * @internal
   */
  public _synthesizeTemplate(session: ISynthesisSession): void {
    this.writeTemplate(session);
  }

  /**
   * Defines an asset in the host stack
   */
  private addTemplateAsset(host: Stack, session: ISynthesisSession) {
    this._templateUrl.set(host.synthesizer.addFileAsset({
      packaging: FileAssetPackaging.FILE,
      sourceHash: this.writeTemplate(session),
      fileName: this.templateFile,
      displayName: `${this.node.path} Template`,
    }).httpUrl);
  }

  /**
   * Writes the template file and returns its hash
   */
  private writeTemplate(session: ISynthesisSession): string {
    const cfn = JSON.stringify(this._toCloudFormation(), undefined, 2);
    fs.writeFileSync(path.join(session.assembly.outdir, this.templateFile), cfn);
    return crypto.createHash('sha256').update(cfn).digest('hex');
  }
}
