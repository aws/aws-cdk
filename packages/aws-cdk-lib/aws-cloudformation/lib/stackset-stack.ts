import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import type { Construct, IConstruct, IDependable } from 'constructs';
import { Dependable, DependencyGroup } from 'constructs';
import { CfnStackSet } from './cloudformation.generated';
import type { IBucket } from '../../aws-s3';
import { Bucket } from '../../aws-s3';
import { BucketDeployment, Source } from '../../aws-s3-deployment';
import {
  CfnResource,
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
import { lit } from '../../core/lib/private/literal-string';
import * as cxapi from '../../cx-api';

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

    const stackSetStack = this.boundStack as StackSetStack;
    const parentStack = stackSetStack._getContainingStack();
    const existingConstructs = new Set(parentStack.node.findAll());

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
        stackSetStack._addAssetDeploymentDependencies(bucketDeployment);
      } else {
        assetDeployment.bucketDeployment.addSource(source);
      }
    }

    // The templates of nested stacks in this stack are added while the app is
    // prepared, after the dependencies between constructs were applied, so apply
    // those of the constructs this asset created.
    addResourceDependencies(parentStack.node.findAll().filter(c => !existingConstructs.has(c)));

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
 * but rather only synthesized as a template and uploaded as an asset to S3
 * by the stack that contains it.
 *
 * A StackSetStack must be defined inside the stack of the StackSets that use
 * it, and is always environment agnostic.
 */
@noBoxStackTraces
export class StackSetStack extends Stack {
  public readonly templateFile: string;
  private readonly _templateUrl: IBox<string | undefined> = Box.fromValue<string | undefined>(undefined);
  private readonly _containingStack: Stack;
  private readonly _stackSets = new Array<Construct>();

  /**
   * Creates a new StackSetStack.
   * @param scope The scope in which to define this StackSet.
   * @param id The ID of the StackSet.
   * @param props The properties of the StackSet.
   */
  constructor(scope: Construct, id: string, props: StackSetStackProps = {}) {
    const containingStack = findContainingStack(scope);

    super(scope, id, {
      // The template is deployed to the target accounts and regions of the StackSets
      env: { account: Aws.ACCOUNT_ID, region: Aws.REGION },
      synthesizer: new StackSetStackSynthesizer(props.assetBuckets, props.assetBucketPrefix),
    });

    // The metadata of this stack goes into the artifact of the containing stack,
    // where the logical IDs of this template would describe the wrong template.
    this.node.setContext(cxapi.DISABLE_LOGICAL_ID_METADATA, true);
    this.node.setContext(cxapi.DISABLE_CREATION_STACK_TRACES, true);

    this._containingStack = containingStack;

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
   * Fetch the stack that publishes the template and file assets of this stack.
   *
   * @internal
   */
  public _getContainingStack(): Stack {
    return this._containingStack;
  }

  /**
   * Bind a StackSet that uses the template of this stack.
   *
   * @returns the resources that must be deployed before the StackSet
   * @internal
   */
  public _bindStackSet(stackSet: Construct): IDependable[] {
    const stackSetStack = Stack.of(stackSet);
    if (stackSetStack !== this._containingStack) {
      throw new ValidationError(lit`StackSetNotInStackOfStackSetStack`,
        `a StackSet must be in the stack that contains its StackSetStack, got StackSet in stack ${JSON.stringify(stackSetStack.node.path)} ` +
        `and StackSetStack ${JSON.stringify(this.node.path)} in stack ${JSON.stringify(this._containingStack.node.path)}; ` +
        'define the StackSetStack inside the stack of the StackSet',
        stackSet);
    }

    this._stackSets.push(stackSet);
    return [(this.synthesizer as StackSetStackSynthesizer)._assetDeployments];
  }

  /**
   * Make every StackSet that uses this template depend on all resources of `deployment`.
   *
   * Needed for deployments created while the app is prepared, after the
   * dependencies between constructs were applied.
   *
   * @internal
   */
  public _addAssetDeploymentDependencies(deployment: IDependable) {
    const stackSetResources = this._stackSets
      .flatMap(stackSet => stackSet.node.findAll())
      .filter(CfnStackSet.isCfnStackSet);
    for (const target of cfnResourcesOf(deployment)) {
      for (const stackSetResource of stackSetResources) {
        stackSetResource.addResourceDependency(target);
      }
    }
  }

  /**
   * Not deployed by itself: its metadata goes into the artifact of the containing stack.
   *
   * @internal
   */
  public get _isTopLevelStack(): boolean {
    return false;
  }

  /**
   * Synthesize the StackSet stack template, overrides the `super` class method.
   *
   * Defines an asset at the containing stack which represents the template of this
   * StackSet stack.
   *
   * @internal
   */
  public _synthesizeTemplate(session: ISynthesisSession): void {
    this.validateNoStackDependencies();

    const cfn = JSON.stringify(this._toCloudFormation(), undefined, 2);
    const templateHash = crypto.createHash('sha256').update(cfn).digest('hex');

    this._templateUrl.set(this._containingStack.synthesizer.addFileAsset({
      packaging: FileAssetPackaging.FILE,
      sourceHash: templateHash,
      fileName: this.templateFile,
    }).httpUrl);

    fs.writeFileSync(path.join(session.assembly.outdir, this.templateFile), cfn);
  }

  /**
   * References across the boundary of this stack and explicit stack dependencies
   * both show as stack dependencies.
   */
  private validateNoStackDependencies() {
    const dependents = this.node.root.node.findAll()
      .filter((c): c is Stack => Stack.isStack(c) && c.dependencies.includes(this));
    const other = [...this.dependencies, ...dependents][0];
    if (other) {
      throw new ValidationError(lit`StackSetStackCrossStackReference`,
        `StackSetStack ${JSON.stringify(this.node.path)} and stack ${JSON.stringify(other.node.path)} depend on each other, through a reference or a stack dependency; ` +
        'a StackSetStack is deployed to the target accounts and regions of its StackSets, so it cannot reference resources of other stacks ' +
        'and other stacks cannot reference its resources, pass the value as a parameter of the StackSet instead',
        this);
    }
  }
}

/**
 * Finds the stack that contains a StackSetStack: the closest enclosing stack
 * that is deployed by itself, which skips nested stacks, product stacks and
 * other StackSetStacks.
 */
function findContainingStack(scope: Construct): Stack {
  for (let current: IConstruct | undefined = scope; current && !Stage.isStage(current); current = current.node.scope) {
    if (Stack.isStack(current) && current._isTopLevelStack) {
      return current;
    }
  }
  throw new ValidationError(lit`StackSetStackMustBeDefinedWithinStack`,
    'a StackSetStack must be defined within a stack, define the StackSetStack inside the stack of the StackSets that use it', scope);
}

/**
 * The CloudFormation resources that a dependency on `dependable` stands for.
 */
function cfnResourcesOf(dependable: IDependable): CfnResource[] {
  return Dependable.of(dependable).dependencyRoots
    .flatMap(root => root.node.findAll())
    .filter(CfnResource.isCfnResource);
}

/**
 * Apply the dependencies that were added to `constructs` as dependencies
 * between the CloudFormation resources of the same stack.
 */
function addResourceDependencies(constructs: IConstruct[]) {
  for (const construct of constructs) {
    const sources = construct.node.findAll().filter(CfnResource.isCfnResource);
    for (const target of construct.node.dependencies.flatMap(cfnResourcesOf)) {
      for (const source of sources.filter(s => s !== target && Stack.of(s) === Stack.of(target))) {
        source.addResourceDependency(target);
      }
    }
  }
}
