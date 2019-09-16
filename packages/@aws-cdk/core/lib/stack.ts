import cxapi = require('@aws-cdk/cx-api');
import { EnvironmentUtils } from '@aws-cdk/cx-api';
import fs = require('fs');
import path = require('path');
import { Construct, ConstructNode, IConstruct, ISynthesisSession } from './construct';
import { ContextProvider } from './context-provider';
import { Environment } from './environment';
import { CLOUDFORMATION_TOKEN_RESOLVER, CloudFormationLang } from './private/cloudformation-lang';
import { LogicalIDs } from './private/logical-id';
import { resolve } from './private/resolve';
import { makeUniqueId } from './private/uniqueid';

const STACK_SYMBOL = Symbol.for('@aws-cdk/core.Stack');
const VALID_STACK_NAME_REGEX = /^[A-Za-z][A-Za-z0-9-]*$/;

export interface StackProps {
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
    return _lookup(construct);

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
  public readonly stackName: string;

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
   * Returns the parent stack if this stack is nested.
   *
   * @experimental
   */
  public readonly parentStack?: Stack;

  /**
   * The name of the CloudFormation template file emitted to the output
   * directory during synthesis.
   *
   * @example MyStack.template.json
   */
  public readonly templateFile: string;

  /**
   * Logical ID generation strategy
   */
  private readonly _logicalIds: LogicalIDs;

  /**
   * Other stacks this stack depends on
   */
  private readonly _stackDependencies = new Set<StackDependency>();

  /**
   * Lists all missing contextual information.
   * This is returned when the stack is synthesized under the 'missing' attribute
   * and allows tooling to obtain the context and re-synthesize.
   */
  private readonly _missingContext = new Array<cxapi.MissingContext>();

  /**
   * Creates a new stack.
   *
   * @param scope Parent of this stack, usually a Program instance.
   * @param name The name of the CloudFormation stack. Defaults to "Stack".
   * @param props Stack properties.
   */
  public constructor(scope?: Construct, name?: string, props: StackProps = {}) {
    // For unit test convenience parents are optional, so bypass the type check when calling the parent.
    super(scope!, name!);

    Object.defineProperty(this, STACK_SYMBOL, { value: true });

    this._logicalIds = new LogicalIDs();

    const { account, region, environment } = this.parseEnvironment(props.env);

    this.account = account;
    this.region = region;
    this.environment = environment;

    this.stackName = props.stackName !== undefined ? props.stackName : this.calculateStackName();
    this.tags = new TagManager(TagType.KEY_VALUE, 'aws:cdk:stack', props.tags);

    if (!VALID_STACK_NAME_REGEX.test(this.stackName)) {
      throw new Error(`Stack name must match the regular expression: ${VALID_STACK_NAME_REGEX.toString()}, got '${name}'`);
    }

    this.templateFile = `${this.stackName}.template.json`;
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
   * Add a dependency between this stack and another stack
   */
  public addDependency(stack: Stack, reason?: string) {
    if (process.env.CDK_DEBUG_DEPS) {
      // tslint:disable-next-line:no-console
      console.error(`[CDK_DEBUG_DEPS] stack "${this.node.path}" depends on "${stack.node.path}" because: ${reason}`);
    }
    if (stack === this) { return; }  // Can ignore a dependency on self

    reason = reason || 'dependency added using stack.addDependency()';
    const dep = stack.stackDependencyReasons(this);
    if (dep !== undefined) {
        // tslint:disable-next-line:max-line-length
        throw new Error(`'${stack.node.path}' depends on '${this.node.path}' (${dep.join(', ')}). Adding this dependency (${reason}) would create a cyclic reference.`);
    }
    this._stackDependencies.add({ stack, reason });
  }

  /**
   * Return the stacks this stack depends on
   */
  public get dependencies(): Stack[] {
    return Array.from(this._stackDependencies.values()).map(d => d.stack);
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
    });

    if (!Array.isArray(value)) {
      throw new Error(`Provider ${cxapi.AVAILABILITY_ZONE_PROVIDER} expects a list`);
    }

    return value;
  }

  public addFileAsset(asset: cxapi.FileAssetMetadataEntry) {
    this.node.addMetadata(cxapi.ASSET_METADATA, asset);
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
    // References (originating from this stack)
    for (const ref of this.node.references) {
      // skip if this is not a CfnReference
      if (!CfnReference.isCfnReference(ref.reference)) { continue; }

      const producingStack = Stack.of(ref.reference.target);
      const consumingStack = Stack.of(ref.source);

      // skip if this reference is consumed by a different stack (node.reference
      // will return all references that originate within the stack's scope,
      // which can include references that originated from child stacks.
      if (consumingStack !== this) { continue; }

      // skip if this is an internal reference.
      if (producingStack === this) { continue; }

      if (consumingStack.node.root !== producingStack.node.root) {
        throw new Error(
          `Cannot reference across apps. ` +
          `Consuming and producing stacks must be defined within the same CDK app.`);
      }

      // tell producing stack to process the cross reference and then tell the consuming
      // stack to process the cross reference. the producing stack gets the priority
      producingStack.prepareCrossReference(ref.source, ref.reference);
    }

    // Resource dependencies
    for (const dependency of this.node.dependencies) {
      const theirStack = Stack.of(dependency.target);
      if (theirStack !== undefined && theirStack !== this && Stack.of(dependency.source) === this) {
        this.addDependency(theirStack, `"${dependency.source.node.path}" depends on "${dependency.target.node.path}"`);
      } else {
        for (const target of findResources([dependency.target])) {
          for (const source of findResources([dependency.source])) {
            source.addDependsOn(target);
          }
        }
      }
    }

    if (this.tags.hasTags()) {
      this.node.addMetadata(cxapi.STACK_TAGS_METADATA_KEY, this.tags.renderTags());
    }
  }

  protected synthesize(session: ISynthesisSession): void {
    const builder = session.assembly;

    // write the CloudFormation template as a JSON file
    const outPath = path.join(builder.outdir, this.templateFile);
    fs.writeFileSync(outPath, JSON.stringify(this._toCloudFormation(), undefined, 2));

    // if this is a nested stack, do not emit it as a cloud assembly artifact (it will be registered as an s3 asset instead)
    if (this.parentStack) {
      return;
    }

    const deps = this.dependencies.map(s => s.stackName);
    const meta = this.collectMetadata();

    const properties: cxapi.AwsCloudFormationStackProperties = {
      templateFile: this.templateFile
    };

    // add an artifact that represents this stack
    builder.addArtifact(this.stackName, {
      type: cxapi.ArtifactType.AWS_CLOUDFORMATION_STACK,
      environment: this.environment,
      properties,
      dependencies: deps.length > 0 ? deps : undefined,
      metadata: Object.keys(meta).length > 0 ? meta : undefined,
    });

    for (const ctx of this._missingContext) {
      builder.addMissing(ctx);
    }
  }

  /**
   * Returns the CloudFormation template for this stack by traversing
   * the tree and invoking _toCloudFormation() on all Entity objects.
   *
   * @internal
   */
  protected _toCloudFormation() {
    if (this.templateOptions.transform) {
      // tslint:disable-next-line: max-line-length
      this.node.addWarning('This stack is using the deprecated `templateOptions.transform` property. Consider switching to `templateOptions.transforms`.');
      if (!this.templateOptions.transforms) {
        this.templateOptions.transforms = [];
      }
      if (this.templateOptions.transforms.indexOf(this.templateOptions.transform) === -1) {
        this.templateOptions.transforms.unshift(this.templateOptions.transform);
      }
    }
    const template: any = {
      Description: this.templateOptions.description,
      Transform: extractSingleValue(this.templateOptions.transforms),
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
  protected createCrossReference(source: IConstruct, reference: Reference): IResolvable {
    const producingStack = Stack.of(reference.target);
    const consumingStack = Stack.of(source);

    // Ensure a singleton "Exports" scoping Construct
    // This mostly exists to trigger LogicalID munging, which would be
    // disabled if we parented constructs directly under Stack.
    // Also it nicely prevents likely construct name clashes
    const exportsScope = producingStack.getCreateExportsScope();

    // Ensure a singleton CfnOutput for this value
    const resolved = producingStack.resolve(reference);
    const id = 'Output' + JSON.stringify(resolved);
    const exportName = producingStack.generateExportName(exportsScope, id);
    const output = exportsScope.node.tryFindChild(id) as CfnOutput;
    if (!output) {
      new CfnOutput(exportsScope, id, { value: Token.asString(reference), exportName });
    }

    // add a dependency on the producing stack - it has to be deployed before this stack can consume the exported value
    // if the producing stack is a nested stack (i.e. has a parent), the dependency is taken on the parent.
    const producerDependency = producingStack.parentStack ? producingStack.parentStack : producingStack;
    const consumerDependency = consumingStack.parentStack ? consumingStack.parentStack : consumingStack;
    consumerDependency.addDependency(producerDependency, `${source.node.path} -> ${reference.target.node.path}.${reference.displayName}`);

    // We want to return an actual FnImportValue Token here, but Fn.importValue() returns a 'string',
    // so construct one in-place.
    return new Intrinsic({ 'Fn::ImportValue': exportName });
  }

  /**
   * Automatically called during "prepare" for each reference produced by this
   * stack, giving it an opportunity to morph the reference to support various
   * cross-stack references.
   *
   * This callback is called _before_ `onCrossReferenceConsumed` in order to
   * allow the producer of the reference to determine the behavior.
   *
   * @param source
   * @param reference
   * @param consumingStack
   *
   * @experimental
   */
  private prepareCrossReference(source: IConstruct, reference: CfnReference) {
    const consumingStack = Stack.of(source);
    const producingStack = this;

    let creatingStack;

    if (consumingStack.parentStack) {
      creatingStack = consumingStack;
    }

    if (producingStack.parentStack) {
      creatingStack = producingStack;
    }

    if (!creatingStack && consumingStack.environment === producingStack.environment) {
      creatingStack = producingStack;
    }

    if (!creatingStack) {
      throw new Error(`Stack "${consumingStack.node.path}" cannot consume a cross reference from stack "${producingStack.node.path}". ` +
      `Cross stack references are only supported for stacks deployed to the same environment or between nested stacks and their parent stack`);
    }

    const consumedValue = creatingStack.createCrossReference(source, reference);

    // if the reference has already been assigned a value for the consuming stack, carry on.
    if (!reference.hasValueForStack(consumingStack)) {
      reference.assignValueForStack(consumingStack, consumedValue);
    }
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
      environment: EnvironmentUtils.format(envAccount, envRegion)
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
    for (const dep of this._stackDependencies) {
      const ret = dep.stack.stackDependencyReasons(other);
      if (ret !== undefined) {
        return [dep.reason].concat(ret);
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

      if (node.node.metadata.length > 0) {
        // Make the path absolute
        output[ConstructNode.PATH_SEP + node.node.path] = node.node.metadata.map(md => stack.resolve(md) as cxapi.MetadataEntry);
      }

      for (const child of node.node.children) {
        visit(child);
      }
    }
  }

  /**
   * Calculcate the stack name based on the construct path
   */
  private calculateStackName() {
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

// export enum AutomaticCrossReferences {
//   /**
//    * Cross references are completely disabled from/to this stack.
//    */
//   DISABLE,

//   /**
//    * This stack will not be allowed to reference a resource from another stack that is not a nested stack.
//    */
//   DISABLE_IMPORT,

//   /**
//    * Other non-nested stacks will not be allowed to reference resources from within this stack.
//    */
//   DISABLE_EXPORT,

//   /**
//    * Automatic synthesis of cross references is enabled.
//    *
//    * When a resource is referenced across stacks within the same environment, a
//    * CloudFormation exported Output is synthesized in the producing stack and an
//    * Fn::ImportValue is used in the consuming stack.
//    */
//   EXPORT_IMPORT,

//   /**
//    * Treat this as a nested stack when processing references.
//    *
//    * When a resource in a nested stack is referenced by a parent stack.
//    */
//   NESTED,
// }

// These imports have to be at the end to prevent circular imports
import { Arn, ArnComponents } from './arn';
import { CfnElement } from './cfn-element';
import { Fn } from './cfn-fn';
import { CfnOutput } from './cfn-output';
import { Aws, ScopedAws } from './cfn-pseudo';
import { CfnReference } from './cfn-reference';
import { CfnResource, TagType } from './cfn-resource';
import { Intrinsic } from './private/intrinsic';
import { Reference } from './reference';
import { IResolvable } from './resolvable';
import { ITaggable, TagManager } from './tag-manager';
import { Token } from './token';

/**
 * Find all resources in a set of constructs
 */
function findResources(roots: Iterable<IConstruct>): CfnResource[] {
  const ret = new Array<CfnResource>();
  for (const root of roots) {
    ret.push(...root.node.findAll().filter(CfnResource.isCfnResource));
  }
  return ret;
}

interface StackDependency {
  stack: Stack;
  reason: string;
}

function extractSingleValue<T>(array: T[] | undefined): T[] | T | undefined {
  if (array && array.length === 1) {
    return array[0];
  }
  return array;
}
