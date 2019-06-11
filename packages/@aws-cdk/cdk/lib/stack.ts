import cxapi = require('@aws-cdk/cx-api');
import fs = require('fs');
import path = require('path');
import { App } from './app';
import { CfnParameter } from './cfn-parameter';
import { CLOUDFORMATION_TOKEN_RESOLVER, CloudFormationLang } from './cloudformation-lang';
import { Construct, ConstructNode, IConstruct, ISynthesisSession } from './construct';
import { Environment } from './environment';
import { HashedAddressingScheme, IAddressingScheme, LogicalIDs } from './logical-id';
import { resolve } from './private/resolve';
import { makeUniqueId } from './uniqueid';

const STACK_SYMBOL = Symbol.for('@aws-cdk/cdk.Stack');
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
   * Strategy for logical ID generation
   *
   * @default - The HashedNamingScheme will be used.
   */
  readonly namingScheme?: IAddressingScheme;

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
    return STACK_SYMBOL in x;
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
   * The environment in which this stack is deployed.
   */
  public readonly env: Environment;

  /**
   * Logical ID generation strategy
   */
  public readonly logicalIds: LogicalIDs;

  /**
   * Options for CloudFormation template (like version, transform, description).
   */
  public readonly templateOptions: ITemplateOptions = {};

  /**
   * The CloudFormation stack name.
   *
   * This is the stack name either configuration via the `stackName` property
   * or automatically derived from the construct path.
   */
  public readonly name: string;

  /**
   * Other stacks this stack depends on
   */
  private readonly stackDependencies = new Set<StackDependency>();

  /**
   * Values set for parameters in cloud assembly.
   */
  private readonly parameterValues: { [logicalId: string]: string } = { };

  /**
   * Environment as configured via props
   *
   * (Both on Stack and inherited from App)
   */
  private readonly configuredEnv: Environment;

  /**
   * Lists all missing contextual information.
   * This is returned when the stack is synthesized under the 'missing' attribute
   * and allows tooling to obtain the context and re-synthesize.
   */
  private readonly missingContext = new Array<cxapi.MissingContext>();

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

    this.configuredEnv = props.env || {};
    this.env = this.parseEnvironment(props.env);

    this.logicalIds = new LogicalIDs(props.namingScheme ? props.namingScheme : new HashedAddressingScheme());
    this.name = props.stackName !== undefined ? props.stackName : this.calculateStackName();
    this.tags = new TagManager(TagType.KeyValue, 'aws:cdk:stack', props.tags);

    if (!VALID_STACK_NAME_REGEX.test(this.name)) {
      throw new Error(`Stack name must match the regular expression: ${VALID_STACK_NAME_REGEX.toString()}, got '${name}'`);
    }
  }

  /**
   * Returns the environment specification for this stack (aws://account/region).
   */
  public get environment() {
    const account = this.env.account || 'unknown-account';
    const region = this.env.region || 'unknown-region';
    return cxapi.EnvironmentUtils.format(account, region);
  }

  /**
   * Looks up a resource by path.
   *
   * @returns The Resource or undefined if not found
   */
  public findResource(constructPath: string): CfnResource | undefined {
    const r = this.node.findChild(constructPath);
    if (!r) { return undefined; }

    // found an element, check if it's a resource (duck-type)
    if (!('resourceType' in r)) {
      throw new Error(`Found a stack element for ${constructPath} but it is not a resource: ${r.toString()}`);
    }

    return r as CfnResource;
  }

  /**
   * Resolve a tokenized value in the context of the current stack.
   */
  public resolve(obj: any): any {
    return resolve(obj, {
      scope: this,
      prefix: [],
      resolver: CLOUDFORMATION_TOKEN_RESOLVER,
    });
  }

  /**
   * Convert an object, potentially containing tokens, to a JSON string
   */
  public toJsonString(obj: any, space?: number): string {
    return CloudFormationLang.toJSON(obj, space).toString();
  }

  /**
   * @param why more information about why region is required.
   * @returns The region in which this stack is deployed. Throws if region is not defined.
   */
  public requireRegion(why?: string) {
    if (!this.env.region) {
      throw new Error(`${why ? why + '. ' : ''}Stack requires region information. It can be either supplied via the "env" property, ` +
          `via the "${cxapi.DEFAULT_REGION_CONTEXT_KEY}" context parameters or using "aws configure"`);
    }

    return this.env.region;
  }

  /**
   * Returns the AWS account ID of this Stack,
   * or throws an exception if the account ID is not set in the environment.
   *
   * @param why more information about why is the account ID required
   * @returns the AWS account ID of this Stack
   */
  public requireAccountId(why?: string): string {
    if (!this.env.account) {
      throw new Error(`${why ? why + '. ' : ''}Stack requires account information. ` +
        'It can be supplied either via the "env" property when creating the Stack, or by using "aws configure"');
    }

    return this.env.account;
  }

  public parentApp(): App | undefined {
    const parent = this.node.scope;
    return parent instanceof App
      ? parent
      : undefined;
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
    this.missingContext.push(report);
  }

  /**
   * Rename a generated logical identities
   */
  public renameLogical(oldId: string, newId: string) {
    if (this.node.children.length > 0) {
      throw new Error("All renames must be set up before adding elements to the stack");
    }

    this.logicalIds.renameLogical(oldId, newId);
  }

  /**
   * Add a dependency between this stack and another stack
   */
  public addDependency(stack: Stack, reason?: string) {
    if (stack === this) { return; }  // Can ignore a dependency on self

    reason = reason || 'dependency added using stack.addDependency()';
    const dep = stack.stackDependencyReasons(this);
    if (dep !== undefined) {
        // tslint:disable-next-line:max-line-length
        throw new Error(`'${stack.node.path}' depends on '${this.node.path}' (${dep.join(', ')}). Adding this dependency (${reason}) would create a cyclic reference.`);
    }
    this.stackDependencies.add({ stack, reason });
  }

  /**
   * Return the stacks this stack depends on
   */
  public get dependencies(): Stack[] {
    return Array.from(this.stackDependencies.values()).map(d => d.stack);
  }

  /**
   * The account in which this stack is defined
   *
   * Either returns the literal account for this stack if it was specified
   * literally upon Stack construction, or a symbolic value that will evaluate
   * to the correct account at deployment time.
   */
  public get accountId(): string {
    if (this.configuredEnv.account) {
      return this.configuredEnv.account;
    }
    // Does not need to be scoped, the only situation in which
    // Export/Fn::ImportValue would work if { Ref: "AWS::AccountId" } is the
    // same for provider and consumer anyway.
    return Aws.accountId;
  }

  /**
   * The region in which this stack is defined
   *
   * Either returns the literal region for this stack if it was specified
   * literally upon Stack construction, or a symbolic value that will evaluate
   * to the correct region at deployment time.
   */
  public get region(): string {
    if (this.configuredEnv.region) {
      return this.configuredEnv.region;
    }
    // Does not need to be scoped, the only situation in which
    // Export/Fn::ImportValue would work if { Ref: "AWS::AccountId" } is the
    // same for provider and consumer anyway.
    return Aws.region;
  }

  /**
   * The partition in which this stack is defined
   */
  public get partition(): string {
    // Always return a non-scoped partition intrinsic. These will usually
    // be used to construct an ARN, but there are no cross-partition
    // calls anyway.
    return Aws.partition;
  }

  /**
   * The Amazon domain suffix for the region in which this stack is defined
   */
  public get urlSuffix(): string {
    return new ScopedAws(this).urlSuffix;
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
   * The name of the stack currently being deployed
   *
   * Only available at deployment time; this will always return an unresolved value.
   */
  public get stackName(): string {
    return new ScopedAws(this).stackName;
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
    return arnFromComponents(components, this);
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
    return parseArn(arn, sepIfToken, hasName);
  }

  /**
   * Sets the value of a CloudFormation parameter.
   * @param parameter The parameter to set the value for
   * @param value The value, can use `${}` notation to reference other assembly block attributes.
   */
  public setParameterValue(parameter: CfnParameter, value: string) {
    this.parameterValues[parameter.logicalId] = value;
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
    // References
    for (const ref of this.node.references) {
      if (CfnReference.isCfnReference(ref.reference)) {
        ref.reference.consumeFromStack(this, ref.source);
      }
    }

    // Resource dependencies
    for (const dependency of this.node.dependencies) {
      const theirStack = Stack.of(dependency.target);
      if (theirStack !== undefined && theirStack !== this) {
        this.addDependency(theirStack);
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
    const template = `${this.name}.template.json`;

    // write the CloudFormation template as a JSON file
    const outPath = path.join(builder.outdir, template);
    fs.writeFileSync(outPath, JSON.stringify(this._toCloudFormation(), undefined, 2));

    const deps = this.dependencies.map(s => s.name);
    const meta = this.collectMetadata();

    const properties: cxapi.AwsCloudFormationStackProperties = {
      templateFile: template,
      parameters: Object.keys(this.parameterValues).length > 0 ? this.resolve(this.parameterValues) : undefined
    };

    // add an artifact that represents this stack
    builder.addArtifact(this.name, {
      type: cxapi.ArtifactType.AwsCloudFormationStack,
      environment: this.environment,
      properties,
      dependencies: deps.length > 0 ? deps : undefined,
      metadata: Object.keys(meta).length > 0 ? meta : undefined,
    });

    for (const ctx of this.missingContext) {
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
    // before we begin synthesis, we shall lock this stack, so children cannot be added
    this.node.lock();

    try {
      const template: any = {
        Description: this.templateOptions.description,
        Transform: this.templateOptions.transform,
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

      this.logicalIds.assertAllRenamesApplied();

      return ret;
    } finally {
      // allow mutations after synthesis is finished.
      this.node.unlock();
    }
  }

  /**
   * Applied defaults to environment attributes.
   */
  private parseEnvironment(env: Environment = {}) {
    return {
      account: env.account ? env.account : this.node.tryGetContext(cxapi.DEFAULT_ACCOUNT_CONTEXT_KEY),
      region: env.region ? env.region : this.node.tryGetContext(cxapi.DEFAULT_REGION_CONTEXT_KEY)
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
    for (const dep of this.stackDependencies) {
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

    const app = this.parentApp();

    if (app && app.node.metadata.length > 0) {
      output[ConstructNode.PATH_SEP] = app.node.metadata;
    }

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
   */
  transform?: string;

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
import { ArnComponents, arnFromComponents, parseArn } from './arn';
import { CfnElement } from './cfn-element';
import { CfnResource, TagType } from './cfn-resource';
import { CfnReference } from './private/cfn-reference';
import { Aws, ScopedAws } from './pseudo';
import { ITaggable, TagManager } from './tag-manager';

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
