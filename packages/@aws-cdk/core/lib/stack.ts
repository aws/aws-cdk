import * as cxapi from '@aws-cdk/cx-api';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { DockerImageAssetLocation, DockerImageAssetSource, FileAssetLocation , FileAssetPackaging, FileAssetSource } from './assets';
import { Construct, ConstructNode, IConstruct, ISynthesisSession } from './construct';
import { ContextProvider } from './context-provider';
import { Environment } from './environment';
import { DockerImageAssetParameters, FileAssetParameters } from './private/asset-parameters';
import { CLOUDFORMATION_TOKEN_RESOLVER, CloudFormationLang } from './private/cloudformation-lang';
import { LogicalIDs } from './private/logical-id';
import { findTokens , resolve } from './private/resolve';
import { makeUniqueId } from './private/uniqueid';

const STACK_SYMBOL = Symbol.for('@aws-cdk/core.Stack');
const MY_STACK_CACHE = Symbol.for('@aws-cdk/core.Stack.myStack');

const VALID_STACK_NAME_REGEX = /^[A-Za-z][A-Za-z0-9-]*$/;

export interface StackProps {
  /**
   * A description of the stack.
   *
   * @default - No description.
   */
  readonly description?: string;

  /**
   * The AWS environment (account/region) where this stack will be deployed.
   *
   * @default - The `default-account` and `default-region` context parameters will be
   * used. If they are undefined, it will not be possible to deploy the stack.
   */
  readonly env?: Environment;

  /**
   * Name to deploy the stack with
   *
   * @default - Derived from construct path.
   */
  readonly stackName?: string;

  /**
   * Stack tags that will be applied to all the taggable resources and the stack itself.
   *
   * @default {}
   */
  readonly tags?: { [key: string]: string };
}

/**
 * A root construct which represents a single CloudFormation stack.
 */
export class Stack extends Construct implements ITaggable {
  /**
   * Return whether the given object is a Stack.
   *
   * We do attribute detection since we can't reliably use 'instanceof'.
   */
  public static isStack(x: any): x is Stack {
    return x !== null && typeof(x) === 'object' && STACK_SYMBOL in x;
  }

  /**
   * Looks up the first stack scope in which `construct` is defined. Fails if there is no stack up the tree.
   * @param construct The construct to start the search from.
   */
  public static of(construct: IConstruct): Stack {
    // we want this to be as cheap as possible. cache this result by mutating
    // the object. anecdotally, at the time of this writing, @aws-cdk/core unit
    // tests hit this cache 1,112 times, @aws-cdk/aws-cloudformation unit tests
    // hit this 2,435 times).
    const cache = (construct as any)[MY_STACK_CACHE] as Stack | undefined;
    if (cache) {
      return cache;
    } else {
      const value = _lookup(construct);
      Object.defineProperty(construct, MY_STACK_CACHE, {
        enumerable: false,
        writable: false,
        configurable: false,
        value
      });
      return value;
    }

    function _lookup(c: IConstruct): Stack  {
      if (Stack.isStack(c)) {
        return c;
      }

      if (!c.node.scope) {
        throw new Error(`No stack could be identified for the construct at path ${construct.node.path}`);
      }

      return _lookup(c.node.scope);
    }
  }

  /**
   * Tags to be applied to the stack.
   */
  public readonly tags: TagManager;

  /**
   * Options for CloudFormation template (like version, transform, description).
   */
  public readonly templateOptions: ITemplateOptions = {};

  /**
   * The AWS region into which this stack will be deployed (e.g. `us-west-2`).
   *
   * This value is resolved according to the following rules:
   *
   * 1. The value provided to `env.region` when the stack is defined. This can
   *    either be a concerete region (e.g. `us-west-2`) or the `Aws.region`
   *    token.
   * 3. `Aws.region`, which is represents the CloudFormation intrinsic reference
   *    `{ "Ref": "AWS::Region" }` encoded as a string token.
   *
   * Preferably, you should use the return value as an opaque string and not
   * attempt to parse it to implement your logic. If you do, you must first
   * check that it is a concerete value an not an unresolved token. If this
   * value is an unresolved token (`Token.isUnresolved(stack.region)` returns
   * `true`), this implies that the user wishes that this stack will synthesize
   * into a **region-agnostic template**. In this case, your code should either
   * fail (throw an error, emit a synth error using `node.addError`) or
   * implement some other region-agnostic behavior.
   */
  public readonly region: string;

  /**
   * The AWS account into which this stack will be deployed.
   *
   * This value is resolved according to the following rules:
   *
   * 1. The value provided to `env.account` when the stack is defined. This can
   *    either be a concerete account (e.g. `585695031111`) or the
   *    `Aws.accountId` token.
   * 3. `Aws.accountId`, which represents the CloudFormation intrinsic reference
   *    `{ "Ref": "AWS::AccountId" }` encoded as a string token.
   *
   * Preferably, you should use the return value as an opaque string and not
   * attempt to parse it to implement your logic. If you do, you must first
   * check that it is a concerete value an not an unresolved token. If this
   * value is an unresolved token (`Token.isUnresolved(stack.account)` returns
   * `true`), this implies that the user wishes that this stack will synthesize
   * into a **account-agnostic template**. In this case, your code should either
   * fail (throw an error, emit a synth error using `node.addError`) or
   * implement some other region-agnostic behavior.
   */
  public readonly account: string;

  /**
   * The environment coordinates in which this stack is deployed. In the form
   * `aws://account/region`. Use `stack.account` and `stack.region` to obtain
   * the specific values, no need to parse.
   *
   * You can use this value to determine if two stacks are targeting the same
   * environment.
   *
   * If either `stack.account` or `stack.region` are not concrete values (e.g.
   * `Aws.account` or `Aws.region`) the special strings `unknown-account` and/or
   * `unknown-region` will be used respectively to indicate this stack is
   * region/account-agnostic.
   */
  public readonly environment: string;

  /**
   * If this is a nested stack, this represents its `AWS::CloudFormation::Stack`
   * resource. `undefined` for top-level (non-nested) stacks.
   *
   * @experimental
   */
  public readonly nestedStackResource?: CfnResource;

  /**
   * An attribute (late-bound) that represents the URL of the template file
   * in the deployment bucket.
   *
   * @experimental
   */
  public readonly templateUrl: string;

  /**
   * The name of the CloudFormation template file emitted to the output
   * directory during synthesis.
   *
   * @example MyStack.template.json
   */
  public readonly templateFile: string;

  /**
   * The ID of the cloud assembly artifact for this stack.
   */
  public readonly artifactId: string;

  /**
   * Logical ID generation strategy
   */
  private readonly _logicalIds: LogicalIDs;

  /**
   * Other stacks this stack depends on
   */
  private readonly _stackDependencies: { [uniqueId: string]: StackDependency } = { };

  /**
   * Lists all missing contextual information.
   * This is returned when the stack is synthesized under the 'missing' attribute
   * and allows tooling to obtain the context and re-synthesize.
   */
  private readonly _missingContext = new Array<cxapi.MissingContext>();

  /**
   * Includes all parameters synthesized for assets (lazy).
   */
  private _assetParameters?: Construct;

  private _templateUrl?: string;
  private readonly _stackName: string;

  /**
   * Creates a new stack.
   *
   * @param scope Parent of this stack, usually a Program instance.
   * @param id The construct ID of this stack. If `stackName` is not explicitly
   * defined, this id (and any parent IDs) will be used to determine the
   * physical ID of the stack.
   * @param props Stack properties.
   */
  public constructor(scope?: Construct, id?: string, props: StackProps = {}) {
    // For unit test convenience parents are optional, so bypass the type check when calling the parent.
    super(scope!, id!);

    Object.defineProperty(this, STACK_SYMBOL, { value: true });

    this._logicalIds = new LogicalIDs();

    const { account, region, environment } = this.parseEnvironment(props.env);

    this.account = account;
    this.region = region;
    this.environment = environment;

    if (props.description !== undefined) {
      // Max length 1024 bytes
      // Typically 2 bytes per character, may be more for more exotic characters
      if (props.description.length > 512) {
        throw new Error(`Stack description must be <= 1024 bytes. Received description: '${props.description}'`);
      }
      this.templateOptions.description = props.description;
    }

    this._stackName = props.stackName !== undefined ? props.stackName : this.generateUniqueId();
    this.tags = new TagManager(TagType.KEY_VALUE, 'aws:cdk:stack', props.tags);

    if (!VALID_STACK_NAME_REGEX.test(this.stackName)) {
      throw new Error(`Stack name must match the regular expression: ${VALID_STACK_NAME_REGEX.toString()}, got '${this.stackName}'`);
    }

    // the preferred behavior is to generate a unique id for this stack and use
    // it as the artifact ID in the assembly. this allows multiple stacks to use
    // the same name. however, this behavior is breaking for 1.x so it's only
    // applied under a feature flag which is applied automatically for new
    // projects created using `cdk init`.
    this.artifactId = this.node.tryGetContext(cxapi.ENABLE_STACK_NAME_DUPLICATES_CONTEXT)
      ? this.generateUniqueId()
      : this.stackName;

    this.templateFile = `${this.artifactId}.template.json`;
    this.templateUrl = Lazy.stringValue({ produce: () => this._templateUrl || '<unresolved>' });
  }

  /**
   * Resolve a tokenized value in the context of the current stack.
   */
  public resolve(obj: any): any {
    return resolve(obj, {
      scope: this,
      prefix: [],
      resolver: CLOUDFORMATION_TOKEN_RESOLVER,
      preparing: false
    });
  }

  /**
   * Convert an object, potentially containing tokens, to a JSON string
   */
  public toJsonString(obj: any, space?: number): string {
    return CloudFormationLang.toJSON(obj, space).toString();
  }

  /**
   * Indicate that a context key was expected
   *
   * Contains instructions which will be emitted into the cloud assembly on how
   * the key should be supplied.
   *
   * @param report The set of parameters needed to obtain the context
   */
  public reportMissingContext(report: cxapi.MissingContext) {
    this._missingContext.push(report);
  }

  /**
   * Rename a generated logical identities
   *
   * To modify the naming scheme strategy, extend the `Stack` class and
   * override the `createNamingScheme` method.
   */
  public renameLogicalId(oldId: string, newId: string) {
    this._logicalIds.addRename(oldId, newId);
  }

  /**
   * Allocates a stack-unique CloudFormation-compatible logical identity for a
   * specific resource.
   *
   * This method is called when a `CfnElement` is created and used to render the
   * initial logical identity of resources. Logical ID renames are applied at
   * this stage.
   *
   * This method uses the protected method `allocateLogicalId` to render the
   * logical ID for an element. To modify the naming scheme, extend the `Stack`
   * class and override this method.
   *
   * @param element The CloudFormation element for which a logical identity is
   * needed.
   */
  public getLogicalId(element: CfnElement): string {
    const logicalId = this.allocateLogicalId(element);
    return this._logicalIds.applyRename(logicalId);
  }

  /**
   * Add a dependency between this stack and another stack.
   *
   * This can be used to define dependencies between any two stacks within an
   * app, and also supports nested stacks.
   */
  public addDependency(target: Stack, reason?: string) {
    addDependency(this, target, reason);
  }

  /**
   * Return the stacks this stack depends on
   */
  public get dependencies(): Stack[] {
    return Object.values(this._stackDependencies).map(x => x.stack);
  }

  /**
   * The concrete CloudFormation physical stack name.
   *
   * This is either the name defined explicitly in the `stackName` prop or
   * allocated based on the stack's location in the construct tree. Stacks that
   * are directly defined under the app use their construct `id` as their stack
   * name. Stacks that are defined deeper within the tree will use a hashed naming
   * scheme based on the construct path to ensure uniqueness.
   *
   * If you wish to obtain the deploy-time AWS::StackName intrinsic,
   * you can use `Aws.stackName` directly.
   */
  public get stackName(): string {
    return this._stackName;
  }

  /**
   * The partition in which this stack is defined
   */
  public get partition(): string {
    // Always return a non-scoped partition intrinsic. These will usually
    // be used to construct an ARN, but there are no cross-partition
    // calls anyway.
    return Aws.PARTITION;
  }

  /**
   * The Amazon domain suffix for the region in which this stack is defined
   */
  public get urlSuffix(): string {
    // Since URL Suffix always follows partition, it is unscoped like partition is.
    return Aws.URL_SUFFIX;
  }

  /**
   * The ID of the stack
   *
   * @example After resolving, looks like arn:aws:cloudformation:us-west-2:123456789012:stack/teststack/51af3dc0-da77-11e4-872e-1234567db123
   */
  public get stackId(): string {
    return new ScopedAws(this).stackId;
  }

  /**
   * Returns the list of notification Amazon Resource Names (ARNs) for the current stack.
   */
  public get notificationArns(): string[] {
    return new ScopedAws(this).notificationArns;
  }

  /**
   * Indicates if this is a nested stack, in which case `parentStack` will include a reference to it's parent.
   */
  public get nested(): boolean {
    return this.nestedStackResource !== undefined;
  }

  /**
   * Creates an ARN from components.
   *
   * If `partition`, `region` or `account` are not specified, the stack's
   * partition, region and account will be used.
   *
   * If any component is the empty string, an empty string will be inserted
   * into the generated ARN at the location that component corresponds to.
   *
   * The ARN will be formatted as follows:
   *
   *   arn:{partition}:{service}:{region}:{account}:{resource}{sep}}{resource-name}
   *
   * The required ARN pieces that are omitted will be taken from the stack that
   * the 'scope' is attached to. If all ARN pieces are supplied, the supplied scope
   * can be 'undefined'.
   */
  public formatArn(components: ArnComponents): string {
    return Arn.format(components, this);
  }

  /**
   * Given an ARN, parses it and returns components.
   *
   * If the ARN is a concrete string, it will be parsed and validated. The
   * separator (`sep`) will be set to '/' if the 6th component includes a '/',
   * in which case, `resource` will be set to the value before the '/' and
   * `resourceName` will be the rest. In case there is no '/', `resource` will
   * be set to the 6th components and `resourceName` will be set to the rest
   * of the string.
   *
   * If the ARN includes tokens (or is a token), the ARN cannot be validated,
   * since we don't have the actual value yet at the time of this function
   * call. You will have to know the separator and the type of ARN. The
   * resulting `ArnComponents` object will contain tokens for the
   * subexpressions of the ARN, not string literals. In this case this
   * function cannot properly parse the complete final resourceName (path) out
   * of ARNs that use '/' to both separate the 'resource' from the
   * 'resourceName' AND to subdivide the resourceName further. For example, in
   * S3 ARNs:
   *
   *    arn:aws:s3:::my_corporate_bucket/path/to/exampleobject.png
   *
   * After parsing the resourceName will not contain
   * 'path/to/exampleobject.png' but simply 'path'. This is a limitation
   * because there is no slicing functionality in CloudFormation templates.
   *
   * @param arn The ARN string to parse
   * @param sepIfToken The separator used to separate resource from resourceName
   * @param hasName Whether there is a name component in the ARN at all. For
   * example, SNS Topics ARNs have the 'resource' component contain the topic
   * name, and no 'resourceName' component.
   *
   * @returns an ArnComponents object which allows access to the various
   * components of the ARN.
   *
   * @returns an ArnComponents object which allows access to the various
   *      components of the ARN.
   */
  public parseArn(arn: string, sepIfToken: string = '/', hasName: boolean = true): ArnComponents {
    return Arn.parse(arn, sepIfToken, hasName);
  }

  /**
   * Returnst the list of AZs that are availability in the AWS environment
   * (account/region) associated with this stack.
   *
   * If the stack is environment-agnostic (either account and/or region are
   * tokens), this property will return an array with 2 tokens that will resolve
   * at deploy-time to the first two availability zones returned from CloudFormation's
   * `Fn::GetAZs` intrinsic function.
   *
   * If they are not available in the context, returns a set of dummy values and
   * reports them as missing, and let the CLI resolve them by calling EC2
   * `DescribeAvailabilityZones` on the target environment.
   */
  public get availabilityZones(): string[] {
    // if account/region are tokens, we can't obtain AZs through the context
    // provider, so we fallback to use Fn::GetAZs. the current lowest common
    // denominator is 2 AZs across all AWS regions.
    const agnostic = Token.isUnresolved(this.account) || Token.isUnresolved(this.region);
    if (agnostic) {
      return this.node.tryGetContext(cxapi.AVAILABILITY_ZONE_FALLBACK_CONTEXT_KEY) || [
        Fn.select(0, Fn.getAzs()),
        Fn.select(1, Fn.getAzs())
      ];
    }

    const value = ContextProvider.getValue(this, {
      provider: cxapi.AVAILABILITY_ZONE_PROVIDER,
      dummyValue: ['dummy1a', 'dummy1b', 'dummy1c'],
    }).value;

    if (!Array.isArray(value)) {
      throw new Error(`Provider ${cxapi.AVAILABILITY_ZONE_PROVIDER} expects a list`);
    }

    return value;
  }

  public addFileAsset(asset: FileAssetSource): FileAssetLocation {

    // assets are always added at the top-level stack
    if (this.nestedStackParent) {
      return this.nestedStackParent.addFileAsset(asset);
    }

    let params = this.assetParameters.node.tryFindChild(asset.sourceHash) as FileAssetParameters;
    if (!params) {
      params = new FileAssetParameters(this.assetParameters, asset.sourceHash);

      const metadata: cxapi.FileAssetMetadataEntry = {
        path: asset.fileName,
        id: asset.sourceHash,
        packaging: asset.packaging,
        sourceHash: asset.sourceHash,

        s3BucketParameter: params.bucketNameParameter.logicalId,
        s3KeyParameter: params.objectKeyParameter.logicalId,
        artifactHashParameter: params.artifactHashParameter.logicalId,
      };

      this.node.addMetadata(cxapi.ASSET_METADATA, metadata);
    }

    const bucketName = params.bucketNameParameter.valueAsString;

    // key is prefix|postfix
    const encodedKey = params.objectKeyParameter.valueAsString;

    const s3Prefix = Fn.select(0, Fn.split(cxapi.ASSET_PREFIX_SEPARATOR, encodedKey));
    const s3Filename = Fn.select(1, Fn.split(cxapi.ASSET_PREFIX_SEPARATOR, encodedKey));
    const objectKey = `${s3Prefix}${s3Filename}`;

    const s3Url = `https://s3.${this.region}.${this.urlSuffix}/${bucketName}/${objectKey}`;

    return { bucketName, objectKey, s3Url };
  }

  public addDockerImageAsset(asset: DockerImageAssetSource): DockerImageAssetLocation {
    if (this.nestedStackParent) {
      return this.nestedStackParent.addDockerImageAsset(asset);
    }

    let params = this.assetParameters.node.tryFindChild(asset.sourceHash) as DockerImageAssetParameters;
    if (!params) {
      params = new DockerImageAssetParameters(this.assetParameters, asset.sourceHash);

      const metadata: cxapi.ContainerImageAssetMetadataEntry = {
        id: asset.sourceHash,
        packaging: 'container-image',
        path: asset.directoryName,
        sourceHash: asset.sourceHash,
        imageNameParameter: params.imageNameParameter.logicalId,
        repositoryName: asset.repositoryName,
        buildArgs: asset.dockerBuildArgs,
        target: asset.dockerBuildTarget
      };

      this.node.addMetadata(cxapi.ASSET_METADATA, metadata);
    }

    // Parse repository name and tag from the parameter (<REPO_NAME>@sha256:<TAG>)
    // Example: cdk/cdkexampleimageb2d7f504@sha256:72c4f956379a43b5623d529ddd969f6826dde944d6221f445ff3e7add9875500
    const components = Fn.split('@sha256:', params.imageNameParameter.valueAsString);
    const repositoryName = Fn.select(0, components).toString();
    const imageSha = Fn.select(1, components).toString();
    const imageUri = `${this.account}.dkr.ecr.${this.region}.${this.urlSuffix}/${repositoryName}@sha256:${imageSha}`;

    return {
      imageUri, repositoryName
    };
  }

  /**
   * If this is a nested stack, returns it's parent stack.
   */
  public get nestedStackParent() {
    return this.nestedStackResource && Stack.of(this.nestedStackResource);
  }

  /**
   * Returns the parent of a nested stack.
   *
   * @deprecated use `nestedStackParent`
   */
  public get parentStack() {
    return this.nestedStackParent;
  }

  /**
   * Add a Transform to this stack. A Transform is a macro that AWS
   * CloudFormation uses to process your template.
   *
   * Duplicate values are removed when stack is synthesized.
   *
   * @example addTransform('AWS::Serverless-2016-10-31')
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/transform-section-structure.html
   *
   * @param transform The transform to add
   */
  public addTransform(transform: string) {
    if (!this.templateOptions.transforms) {
      this.templateOptions.transforms = [];
    }
    this.templateOptions.transforms.push(transform);
  }

  /**
   * Called implicitly by the `addDependency` helper function in order to
   * realize a dependency between two top-level stacks at the assembly level.
   *
   * Use `stack.addDependency` to define the dependency between any two stacks,
   * and take into account nested stack relationships.
   *
   * @internal
   */
  public _addAssemblyDependency(target: Stack, reason?: string) {
    // defensive: we should never get here for nested stacks
    if (this.nested || target.nested) {
      throw new Error(`Cannot add assembly-level dependencies for nested stacks`);
    }

    reason = reason || 'dependency added using stack.addDependency()';
    const cycle = target.stackDependencyReasons(this);
    if (cycle !== undefined) {
        // tslint:disable-next-line:max-line-length
        throw new Error(`'${target.node.path}' depends on '${this.node.path}' (${cycle.join(', ')}). Adding this dependency (${reason}) would create a cyclic reference.`);
    }

    let dep = this._stackDependencies[target.node.uniqueId];
    if (!dep) {
      dep = this._stackDependencies[target.node.uniqueId] = {
        stack: target,
        reasons: []
      };
    }

    dep.reasons.push(reason);

    if (process.env.CDK_DEBUG_DEPS) {
      // tslint:disable-next-line:no-console
      console.error(`[CDK_DEBUG_DEPS] stack "${this.node.path}" depends on "${target.node.path}" because: ${reason}`);
    }
  }

  /**
   * Returns the naming scheme used to allocate logical IDs. By default, uses
   * the `HashedAddressingScheme` but this method can be overridden to customize
   * this behavior.
   *
   * In order to make sure logical IDs are unique and stable, we hash the resource
   * construct tree path (i.e. toplevel/secondlevel/.../myresource) and add it as
   * a suffix to the path components joined without a separator (CloudFormation
   * IDs only allow alphanumeric characters).
   *
   * The result will be:
   *
   *   <path.join('')><md5(path.join('/')>
   *     "human"      "hash"
   *
   * If the "human" part of the ID exceeds 240 characters, we simply trim it so
   * the total ID doesn't exceed CloudFormation's 255 character limit.
   *
   * We only take 8 characters from the md5 hash (0.000005 chance of collision).
   *
   * Special cases:
   *
   * - If the path only contains a single component (i.e. it's a top-level
   *   resource), we won't add the hash to it. The hash is not needed for
   *   disamiguation and also, it allows for a more straightforward migration an
   *   existing CloudFormation template to a CDK stack without logical ID changes
   *   (or renames).
   * - For aesthetic reasons, if the last components of the path are the same
   *   (i.e. `L1/L2/Pipeline/Pipeline`), they will be de-duplicated to make the
   *   resulting human portion of the ID more pleasing: `L1L2Pipeline<HASH>`
   *   instead of `L1L2PipelinePipeline<HASH>`
   * - If a component is named "Default" it will be omitted from the path. This
   *   allows refactoring higher level abstractions around constructs without affecting
   *   the IDs of already deployed resources.
   * - If a component is named "Resource" it will be omitted from the user-visible
   *   path, but included in the hash. This reduces visual noise in the human readable
   *   part of the identifier.
   *
   * @param cfnElement The element for which the logical ID is allocated.
   */
  protected allocateLogicalId(cfnElement: CfnElement): string {
    const scopes = cfnElement.node.scopes;
    const stackIndex = scopes.indexOf(cfnElement.stack);
    const pathComponents = scopes.slice(stackIndex + 1).map(x => x.node.id);
    return makeUniqueId(pathComponents);
  }

  /**
   * Validate stack name
   *
   * CloudFormation stack names can include dashes in addition to the regular identifier
   * character classes, and we don't allow one of the magic markers.
   *
   * @internal
   */
  protected _validateId(name: string) {
    if (name && !VALID_STACK_NAME_REGEX.test(name)) {
      throw new Error(`Stack name must match the regular expression: ${VALID_STACK_NAME_REGEX.toString()}, got '${name}'`);
    }
  }

  /**
   * Prepare stack
   *
   * Find all CloudFormation references and tell them we're consuming them.
   *
   * Find all dependencies as well and add the appropriate DependsOn fields.
   */
  protected prepare() {
    const tokens = this.findTokens();

    // References (originating from this stack)
    for (const reference of tokens) {

      // skip if this is not a CfnReference
      if (!CfnReference.isCfnReference(reference)) {
        continue;
      }

      const targetStack = Stack.of(reference.target);

      // skip if this is not a cross-stack reference
      if (targetStack === this) {
        continue;
      }

      // determine which stack should create the cross reference
      const factory = this.determineCrossReferenceFactory(targetStack);

      // if one side is a nested stack (has "parentStack"), we let it create the reference
      // since it has more knowledge about the world.
      const consumedValue = factory.prepareCrossReference(this, reference);

      // if the reference has already been assigned a value for the consuming stack, carry on.
      if (!reference.hasValueForStack(this)) {
        reference.assignValueForStack(this, consumedValue);
      }
    }

    // Resource dependencies
    for (const dependency of this.node.dependencies) {
      for (const target of findCfnResources([ dependency.target ])) {
        for (const source of findCfnResources([ dependency.source ])) {
          source.addDependsOn(target);
        }
      }
    }

    if (this.tags.hasTags()) {
      this.node.addMetadata(cxapi.STACK_TAGS_METADATA_KEY, this.tags.renderTags());
    }

    if (this.nestedStackParent) {
      // add the nested stack template as an asset
      const cfn = JSON.stringify(this._toCloudFormation());
      const templateHash = crypto.createHash('sha256').update(cfn).digest('hex');
      const parent = this.nestedStackParent;
      const templateLocation = parent.addFileAsset({
        packaging: FileAssetPackaging.FILE,
        sourceHash: templateHash,
        fileName: this.templateFile
      });

      // if bucketName/objectKey are cfn parameters from a stack other than the parent stack, they will
      // be resolved as cross-stack references like any other (see "multi" tests).
      this._templateUrl = `https://s3.${parent.region}.${parent.urlSuffix}/${templateLocation.bucketName}/${templateLocation.objectKey}`;
    }
  }

  protected synthesize(session: ISynthesisSession): void {
    const builder = session.assembly;

    // write the CloudFormation template as a JSON file
    const outPath = path.join(builder.outdir, this.templateFile);
    const text = JSON.stringify(this._toCloudFormation(), undefined, 2);
    fs.writeFileSync(outPath, text);

    for (const ctx of this._missingContext) {
      builder.addMissing(ctx);
    }

    // if this is a nested stack, do not emit it as a cloud assembly artifact (it will be registered as an s3 asset instead)
    if (this.nested) {
      return;
    }

    const deps = this.dependencies.map(s => s.artifactId);
    const meta = this.collectMetadata();

    // backwards compatibility since originally artifact ID was always equal to
    // stack name the stackName attribute is optional and if it is not specified
    // the CLI will use the artifact ID as the stack name. we *could have*
    // always put the stack name here but wanted to minimize the risk around
    // changes to the assembly manifest. so this means that as long as stack
    // name and artifact ID are the same, the cloud assembly manifest will not
    // change.
    const stackNameProperty = this.stackName === this.artifactId
      ? { }
      : { stackName: this.stackName };

    const properties: cxapi.AwsCloudFormationStackProperties = {
      templateFile: this.templateFile,
      ...stackNameProperty
    };

    // add an artifact that represents this stack
    builder.addArtifact(this.artifactId, {
      type: cxapi.ArtifactType.AWS_CLOUDFORMATION_STACK,
      environment: this.environment,
      properties,
      dependencies: deps.length > 0 ? deps : undefined,
      metadata: Object.keys(meta).length > 0 ? meta : undefined,
    });
  }

  /**
   * Returns the CloudFormation template for this stack by traversing
   * the tree and invoking _toCloudFormation() on all Entity objects.
   *
   * @internal
   */
  protected _toCloudFormation() {
    let transform: string | string[] | undefined;

    if (this.templateOptions.transform) {
      // tslint:disable-next-line: max-line-length
      this.node.addWarning('This stack is using the deprecated `templateOptions.transform` property. Consider switching to `addTransform()`.');
      this.addTransform(this.templateOptions.transform);
    }

    if (this.templateOptions.transforms) {
      if (this.templateOptions.transforms.length === 1) { // Extract single value
        transform = this.templateOptions.transforms[0];
      } else { // Remove duplicate values
        transform = Array.from(new Set(this.templateOptions.transforms));
      }
    }

    const template: any = {
      Description: this.templateOptions.description,
      Transform: transform,
      AWSTemplateFormatVersion: this.templateOptions.templateFormatVersion,
      Metadata: this.templateOptions.metadata
    };

    const elements = cfnElements(this);
    const fragments = elements.map(e => this.resolve(e._toCloudFormation()));

    // merge in all CloudFormation fragments collected from the tree
    for (const fragment of fragments) {
      merge(template, fragment);
    }

    // resolve all tokens and remove all empties
    const ret = this.resolve(template) || {};

    this._logicalIds.assertAllRenamesApplied();

    return ret;
  }

  /**
   * Exports a resolvable value for use in another stack.
   *
   * @returns a token that can be used to reference the value from the producing stack.
   */
  protected prepareCrossReference(sourceStack: Stack, reference: Reference): IResolvable {
    const targetStack = Stack.of(reference.target);

    // Ensure a singleton "Exports" scoping Construct
    // This mostly exists to trigger LogicalID munging, which would be
    // disabled if we parented constructs directly under Stack.
    // Also it nicely prevents likely construct name clashes
    const exportsScope = targetStack.getCreateExportsScope();

    // Ensure a singleton CfnOutput for this value
    const resolved = targetStack.resolve(reference);
    const id = 'Output' + JSON.stringify(resolved);
    const exportName = targetStack.generateExportName(exportsScope, id);
    const output = exportsScope.node.tryFindChild(id) as CfnOutput;
    if (!output) {
      new CfnOutput(exportsScope, id, { value: Token.asString(reference), exportName });
    }

    // add a dependency on the producing stack - it has to be deployed before this stack can consume the exported value
    // if the producing stack is a nested stack (i.e. has a parent), the dependency is taken on the parent.
    const producerDependency = targetStack.nestedStackParent ? targetStack.nestedStackParent : targetStack;
    const consumerDependency = sourceStack.nestedStackParent ? sourceStack.nestedStackParent : sourceStack;
    consumerDependency.addDependency(producerDependency, `${sourceStack.node.path} -> ${reference.target.node.path}.${reference.displayName}`);

    // We want to return an actual FnImportValue Token here, but Fn.importValue() returns a 'string',
    // so construct one in-place.
    return new Intrinsic({ 'Fn::ImportValue': exportName });
  }

  private getCreateExportsScope() {
    const exportsName = 'Exports';
    let stackExports = this.node.tryFindChild(exportsName) as Construct;
    if (stackExports === undefined) {
      stackExports = new Construct(this, exportsName);
    }

    return stackExports;
  }

  /**
   * Determine the various stack environment attributes.
   *
   */
  private parseEnvironment(env: Environment = {}) {
    // if an environment property is explicitly specified when the stack is
    // created, it will be used. if not, use tokens for account and region but
    // they do not need to be scoped, the only situation in which
    // export/fn::importvalue would work if { Ref: "AWS::AccountId" } is the
    // same for provider and consumer anyway.
    const account = env.account || Aws.ACCOUNT_ID;
    const region  = env.region  || Aws.REGION;

    // this is the "aws://" env specification that will be written to the cloud assembly
    // manifest. it will use "unknown-account" and "unknown-region" to indicate
    // environment-agnosticness.
    const envAccount = !Token.isUnresolved(account) ? account : cxapi.UNKNOWN_ACCOUNT;
    const envRegion  = !Token.isUnresolved(region)  ? region  : cxapi.UNKNOWN_REGION;

    return {
      account, region,
      environment: cxapi.EnvironmentUtils.format(envAccount, envRegion)
    };
  }

  /**
   * Check whether this stack has a (transitive) dependency on another stack
   *
   * Returns the list of reasons on the dependency path, or undefined
   * if there is no dependency.
   */
  private stackDependencyReasons(other: Stack): string[] | undefined {
    if (this === other) { return []; }
    for (const dep of Object.values(this._stackDependencies)) {
      const ret = dep.stack.stackDependencyReasons(other);
      if (ret !== undefined) {
        return [ ...dep.reasons, ...ret ];
      }
    }
    return undefined;
  }

  private collectMetadata() {
    const output: { [id: string]: cxapi.MetadataEntry[] } = { };
    const stack = this;

    visit(this);

    return output;

    function visit(node: IConstruct) {
      // break off if we reached a node that is not a child of this stack
      const parent = findParentStack(node);
      if (parent !== stack) {
        return;
      }

      if (node.node.metadata.length > 0) {
        // Make the path absolute
        output[ConstructNode.PATH_SEP + node.node.path] = node.node.metadata.map(md => stack.resolve(md) as cxapi.MetadataEntry);
      }

      for (const child of node.node.children) {
        visit(child);
      }
    }

    function findParentStack(node: IConstruct): Stack | undefined {
      if (node instanceof Stack && node.nestedStackParent === undefined) {
        return node;
      }

      if (!node.node.scope) {
        return undefined;
      }

      return findParentStack(node.node.scope);
    }
  }

  /**
   * Calculcate the stack name based on the construct path
   */
  private generateUniqueId() {
    // In tests, it's possible for this stack to be the root object, in which case
    // we need to use it as part of the root path.
    const rootPath = this.node.scope !== undefined ? this.node.scopes.slice(1) : [this];
    const ids = rootPath.map(c => c.node.id);

    // Special case, if rootPath is length 1 then just use ID (backwards compatibility)
    // otherwise use a unique stack name (including hash). This logic is already
    // in makeUniqueId, *however* makeUniqueId will also strip dashes from the name,
    // which *are* allowed and also used, so we short-circuit it.
    if (ids.length === 1) {
      // Could be empty in a unit test, so just pretend it's named "Stack" then
      return ids[0] || 'Stack';
    }

    return makeUniqueId(ids);
  }

  private generateExportName(stackExports: Construct, id: string) {
    const stack = Stack.of(stackExports);
    const components = [...stackExports.node.scopes.slice(2).map(c => c.node.id), id];
    const prefix = stack.stackName ? stack.stackName + ':' : '';
    const exportName = prefix + makeUniqueId(components);
    return exportName;
  }

  private get assetParameters() {
    if (!this._assetParameters) {
      this._assetParameters = new Construct(this, 'AssetParameters');
    }
    return this._assetParameters;
  }

  private determineCrossReferenceFactory(target: Stack) {
    // unsupported: stacks from different apps
    if (target.node.root !== this.node.root) {
      throw new Error(
        `Cannot reference across apps. ` +
        `Consuming and producing stacks must be defined within the same CDK app.`);
    }

    // unsupported: stacks are not in the same environment
    if (target.environment !== this.environment) {
      throw new Error(
        `Stack "${this.node.path}" cannot consume a cross reference from stack "${target.node.path}". ` +
        `Cross stack references are only supported for stacks deployed to the same environment or between nested stacks and their parent stack`);
    }

    // if one of the stacks is a nested stack, go ahead and give it the right to make the cross reference
    if (target.nested) { return target; }
    if (this.nested) { return this; }

    // both stacks are top-level (non-nested), the taret (producing stack) gets to make the reference
    return target;
  }

  /**
   * Returns all the tokens used within the scope of the current stack.
   */
  private findTokens() {
    const tokens = new Array<IResolvable>();

    for (const element of cfnElements(this)) {
      try {
        tokens.push(...findTokens(element, () => element._toCloudFormation()));
      }  catch (e) {
        // Note: it might be that the properties of the CFN object aren't valid.
        // This will usually be preventatively caught in a construct's validate()
        // and turned into a nicely descriptive error, but we're running prepare()
        // before validate(). Swallow errors that occur because the CFN layer
        // doesn't validate completely.
        //
        // This does make the assumption that the error will not be rectified,
        // but the error will be thrown later on anyway. If the error doesn't
        // get thrown down the line, we may miss references.
        if (e.type === 'CfnSynthesisError') {
          continue;
        }

        throw e;
      }
    }
    return tokens;
  }
}

function merge(template: any, part: any) {
  for (const section of Object.keys(part)) {
    const src = part[section];

    // create top-level section if it doesn't exist
    let dest = template[section];
    if (!dest) {
      template[section] = dest = src;
    } else {
      // add all entities from source section to destination section
      for (const id of Object.keys(src)) {
        if (id in dest) {
          throw new Error(`section '${section}' already contains '${id}'`);
        }
        dest[id] = src[id];
      }
    }
  }
}

/**
 * CloudFormation template options for a stack.
 */
export interface ITemplateOptions {
  /**
   * Gets or sets the description of this stack.
   * If provided, it will be included in the CloudFormation template's "Description" attribute.
   */
  description?: string;

  /**
   * Gets or sets the AWSTemplateFormatVersion field of the CloudFormation template.
   */
  templateFormatVersion?: string;

  /**
   * Gets or sets the top-level template transform for this stack (e.g. "AWS::Serverless-2016-10-31").
   *
   * @deprecated use `transforms` instead.
   */
  transform?: string;

  /**
   * Gets or sets the top-level template transform(s) for this stack (e.g. `["AWS::Serverless-2016-10-31"]`).
   */
  transforms?: string[];

  /**
   * Metadata associated with the CloudFormation template.
   */
   metadata?: { [key: string]: any };
}

/**
 * Collect all CfnElements from a Stack
 *
 * @param node Root node to collect all CfnElements from
 * @param into Array to append CfnElements to
 * @returns The same array as is being collected into
 */
function cfnElements(node: IConstruct, into: CfnElement[] = []): CfnElement[] {
  if (CfnElement.isCfnElement(node)) {
    into.push(node);
  }

  for (const child of node.node.children) {
    // Don't recurse into a substack
    if (Stack.isStack(child)) { continue; }

    cfnElements(child, into);
  }

  return into;
}

// These imports have to be at the end to prevent circular imports
import { Arn, ArnComponents } from './arn';
import { CfnElement } from './cfn-element';
import { Fn } from './cfn-fn';
import { CfnOutput } from './cfn-output';
import { Aws, ScopedAws } from './cfn-pseudo';
import { CfnResource, TagType } from './cfn-resource';
import { addDependency } from './deps';
import { Lazy } from './lazy';
import { CfnReference } from './private/cfn-reference';
import { Intrinsic } from './private/intrinsic';
import { Reference } from './reference';
import { IResolvable } from './resolvable';
import { ITaggable, TagManager } from './tag-manager';
import { Token } from './token';

/**
 * Find all resources in a set of constructs
 */
function findCfnResources(roots: Iterable<IConstruct>): CfnResource[] {
  const ret = new Array<CfnResource>();
  for (const root of roots) {
    ret.push(...root.node.findAll().filter(CfnResource.isCfnResource));
  }
  return ret;
}

interface StackDependency {
  stack: Stack;
  reasons: string[];
}
