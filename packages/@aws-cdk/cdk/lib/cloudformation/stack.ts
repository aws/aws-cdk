import cxapi = require('@aws-cdk/cx-api');
import { App } from '../app';
import { Construct, IConstruct, PATH_SEP } from '../core/construct';
import { Token } from '../core/tokens';
import { CfnReference } from '../core/tokens/cfn-tokens';
import { Environment } from '../environment';
import { HashedAddressingScheme, IAddressingScheme, LogicalIDs } from './logical-id';
import { Resource } from './resource';

export interface StackProps {
  /**
   * The AWS environment (account/region) where this stack will be deployed.
   *
   * If not supplied, the `default-account` and `default-region` context parameters will be
   * used. If they are undefined, it will not be possible to deploy the stack.
   */
  env?: Environment;

  /**
   * Strategy for logical ID generation
   *
   * Optional. If not supplied, the HashedNamingScheme will be used.
   */
  namingScheme?: IAddressingScheme;
}

/**
 * A root construct which represents a single CloudFormation stack.
 */
export class Stack extends Construct {
  /**
   * Traverses the tree and looks up for the Stack root.
   * @param node A construct in the tree
   * @returns The Stack object (throws if the node is not part of a Stack-rooted tree)
   */
  public static find(node: Construct): Stack {
    let curr: IConstruct | undefined = node;
    while (curr != null && !Stack.isStack(curr)) {
      curr = curr.node.scope;
    }

    if (curr == null) {
      throw new Error(`Cannot find a Stack parent for '${node.toString()}'`);
    }
    return curr;
  }

  /**
   * Adds a metadata annotation "aws:cdk:physical-name" to the construct if physicalName
   * is non-null. This can be used later by tools and aspects to determine if resources
   * have been created with physical names.
   */
  public static annotatePhysicalName(construct: Construct, physicalName?: string) {
    if (physicalName == null) {
      return;
    }

    construct.node.addMetadata('aws:cdk:physical-name', physicalName);
  }

  /**
   * Return whether the given object is a Stack.
   *
   * We do attribute detection since we can't reliably use 'instanceof'.
   */
  public static isStack(construct: IConstruct): construct is Stack {
    return (construct as any)._isStack;
  }

  private static readonly VALID_STACK_NAME_REGEX = /^[A-Za-z][A-Za-z0-9-]*$/;

  /**
   * Lists all missing contextual information.
   * This is returned when the stack is synthesized under the 'missing' attribute
   * and allows tooling to obtain the context and re-synthesize.
   */
  public readonly missingContext: { [key: string]: cxapi.MissingContext } = { };

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
  public readonly templateOptions: TemplateOptions = {};

  /**
   * The CloudFormation stack name.
   */
  public readonly name: string;

  /*
   * Used to determine if this construct is a stack.
   */
  protected readonly _isStack = true;

  /**
   * Other stacks this stack depends on
   */
  private readonly stackDependencies = new Set<Stack>();

  /**
   * A construct to hold cross-stack exports
   *
   * This mostly exists to trigger LogicalID munging, which would be
   * disabled if we parented constructs directly under Stack.
   */
  private crossStackExports?: Construct;

  /**
   * Creates a new stack.
   *
   * @param scope Parent of this stack, usually a Program instance.
   * @param name The name of the CloudFormation stack. Defaults to "Stack".
   * @param props Stack properties.
   */
  public constructor(scope?: App, name?: string, props?: StackProps) {
    // For unit test convenience parents are optional, so bypass the type check when calling the parent.
    super(scope!, name!);

    if (name && !Stack.VALID_STACK_NAME_REGEX.test(name)) {
      throw new Error(`Stack name must match the regular expression: ${Stack.VALID_STACK_NAME_REGEX.toString()}, got '${name}'`);
    }

    this.env = this.parseEnvironment(props);

    this.logicalIds = new LogicalIDs(props && props.namingScheme ? props.namingScheme : new HashedAddressingScheme());
    this.name = this.node.id;
  }

  /**
   * Looks up a resource by path.
   *
   * @returns The Resource or undefined if not found
   */
  public findResource(path: string): Resource | undefined {
    const r = this.node.findChild(path);
    if (!r) { return undefined; }

    // found an element, check if it's a resource (duck-type)
    if (!('resourceType' in r)) {
      throw new Error(`Found a stack element for ${path} but it is not a resource: ${r.toString()}`);
    }

    return r as Resource;
  }

  /**
   * Returns the CloudFormation template for this stack by traversing
   * the tree and invoking toCloudFormation() on all Entity objects.
   */
  public toCloudFormation() {
    // before we begin synthesis, we shall lock this stack, so children cannot be added
    this.node.lock();

    try {
      const template: any = {
        Description: this.templateOptions.description,
        Transform: this.templateOptions.transform,
        AWSTemplateFormatVersion: this.templateOptions.templateFormatVersion,
        Metadata: this.templateOptions.metadata
      };

      const elements = stackElements(this);
      const fragments = elements.map(e => e.toCloudFormation());

      // merge in all CloudFormation fragments collected from the tree
      for (const fragment of fragments) {
        merge(template, fragment);
      }

      // resolve all tokens and remove all empties
      const ret = this.node.resolve(template) || {};

      this.logicalIds.assertAllRenamesApplied();

      return ret;
    } finally {
      // allow mutations after synthesis is finished.
      this.node.unlock();
    }
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
   * Contains instructions on how the key should be supplied.
   * @param key Key that uniquely identifies this missing context.
   * @param details The set of parameters needed to obtain the context (specific to context provider).
   */
  public reportMissingContext(key: string, details: cxapi.MissingContext) {
    this.missingContext[key] = details;
  }

  /**
   * Rename a generated logical identities
   */
  public renameLogical(oldId: string, newId: string) {
    // tslint:disable-next-line:no-console
    if (this.node.children.length > 0) {
      throw new Error("All renames must be set up before adding elements to the stack");
    }

    this.logicalIds.renameLogical(oldId, newId);
  }

  /**
   * Add a dependency between this stack and another stack
   */
  public addDependency(stack: Stack) {
    if (stack.dependsOnStack(this)) {
        // tslint:disable-next-line:max-line-length
        throw new Error(`Stack '${this.name}' already depends on stack '${stack.name}'. Adding this dependency would create a cyclic reference.`);
    }
    this.stackDependencies.add(stack);
  }

  /**
   * Return the stacks this stack depends on
   */
  public dependencies(): Stack[] {
    return Array.from(this.stackDependencies.values());
  }

  /**
   * Export a Token value for use in another stack
   */
  public exportValue(tokenValue: Token, consumingStack: Stack): Token {
    if (this.env.account !== consumingStack.env.account || this.env.region !== consumingStack.env.region) {
      throw new Error('Can only reference cross stacks in the same region and account.');
    }

    // Ensure a singleton Output for this value
    const resolved = this.node.resolve(tokenValue);
    const id = 'Output' + JSON.stringify(resolved);
    if (this.crossStackExports === undefined) {
      this.crossStackExports = new Construct(this, 'Exports');
    }
    let output = this.crossStackExports.node.tryFindChild(id) as Output;
    if (!output) {
      output = new Output(this.crossStackExports, id, { value: tokenValue });
    }

    // We want to return an actual FnImportValue Token here, but Fn.importValue() returns a 'string',
    // so construct one in-place.
    return new Token({ 'Fn::ImportValue': output.export });
  }

  /**
   * The account in which this stack is defined
   *
   * Either returns the literal account for this stack, or a symbolic value
   * that will evaluate to the correct account at deployment time.
   */
  public get accountId(): string {
    if (this.env.account) {
      return this.env.account;
    }
    return new Aws(this).accountId;
  }

  /**
   * The region in which this stack is defined
   *
   * Either returns the literal region for this stack, or a symbolic value
   * that will evaluate to the correct region at deployment time.
   */
  public get region(): string {
    if (this.env.region) {
      return this.env.region;
    }
    return new Aws(this).region;
  }

  /**
   * The partition in which this stack is defined
   */
  public get partition(): string {
    return new Aws(this).partition;
  }

  /**
   * The Amazon domain suffix for the region in which this stack is defined
   */
  public get urlSuffix(): string {
    return new Aws(this).urlSuffix;
  }

  /**
   * The ID of the stack
   *
   * @example After resolving, looks like arn:aws:cloudformation:us-west-2:123456789012:stack/teststack/51af3dc0-da77-11e4-872e-1234567db123
   */
  public get stackId(): string {
    return new Aws(this).stackId;
  }

  /**
   * The name of the stack currently being deployed
   *
   * Only available at deployment time.
   */
  public get stackName(): string {
    return new Aws(this).stackName;
  }

  /**
   * Returns the list of notification Amazon Resource Names (ARNs) for the current stack.
   */
  public get notificationArns(): string[] {
    return new Aws(this).notificationArns;
  }

  /**
   * Find cross-stack references embedded in the stack's content and replace them
   *
   * Do not call this as an app author; this is automatically called as part of synthesis.
   */
  public applyCrossEnvironmentReferences() {
    const elements = stackElements(this);
    elements.forEach(e => e.substituteCrossStackReferences());
  }

  /**
   * Validate stack name
   *
   * CloudFormation stack names can include dashes in addition to the regular identifier
   * character classes, and we don't allow one of the magic markers.
   */
  protected _validateId(name: string) {
    if (name && !Stack.VALID_STACK_NAME_REGEX.test(name)) {
      throw new Error(`Stack name must match the regular expression: ${Stack.VALID_STACK_NAME_REGEX.toString()}, got '${name}'`);
    }
  }

  /**
   * Applied defaults to environment attributes.
   */
  private parseEnvironment(props?: StackProps) {
    // start with `env`.
    const env: Environment = (props && props.env) || { };

    // if account is not specified, attempt to read from context.
    if (!env.account) {
      env.account = this.node.getContext(cxapi.DEFAULT_ACCOUNT_CONTEXT_KEY);
    }

    // if region is not specified, attempt to read from context.
    if (!env.region) {
      env.region = this.node.getContext(cxapi.DEFAULT_REGION_CONTEXT_KEY);
    }

    return env;
  }

  /**
   * Check whether this stack has a (transitive) dependency on another stack
   */
  private dependsOnStack(other: Stack) {
    if (this === other) { return true; }
    for (const dep of this.stackDependencies) {
      if (dep.dependsOnStack(other)) { return true; }
    }
    return false;
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

const LOGICAL_ID_MD = 'aws:cdk:logicalId';

/**
 * Represents a construct that can be "depended on" via `addDependency`.
 */
export interface IDependable {
  /**
   * Returns the set of all stack elements (resources, parameters, conditions)
   * that should be added when a resource "depends on" this construct.
   */
  readonly dependencyElements: IDependable[];
}

/**
 * An element of a CloudFormation stack.
 */
export abstract class StackElement extends Construct implements IDependable {
  /**
   * Returns `true` if a construct is a stack element (i.e. part of the
   * synthesized cloudformation template).
   *
   * Uses duck-typing instead of `instanceof` to allow stack elements from different
   * versions of this library to be included in the same stack.
   *
   * @returns The construct as a stack element or undefined if it is not a stack element.
   */
  public static _asStackElement(construct: IConstruct): StackElement | undefined {
    if ('logicalId' in construct && 'toCloudFormation' in construct) {
      return construct as StackElement;
    } else {
      return undefined;
    }
  }

  /**
   * The logical ID for this CloudFormation stack element
   */
  public readonly logicalId: string;

  /**
   * The stack this Construct has been made a part of
   */
  protected stack: Stack;

  /**
   * Creates an entity and binds it to a tree.
   * Note that the root of the tree must be a Stack object (not just any Root).
   *
   * @param parent The parent construct
   * @param props Construct properties
   */
  constructor(scope: Construct, id: string) {
    super(scope, id);
    const s = Stack.find(this);
    if (!s) {
      throw new Error('The tree root must be derived from "Stack"');
    }
    this.stack = s;

    this.node.addMetadata(LOGICAL_ID_MD, new Token(() => this.logicalId), this.constructor);

    this.logicalId = this.stack.logicalIds.getLogicalId(this);
  }

  /**
   * @returns the stack trace of the point where this Resource was created from, sourced
   *      from the +metadata+ entry typed +aws:cdk:logicalId+, and with the bottom-most
   *      node +internal+ entries filtered.
   */
  public get creationStackTrace(): string[] {
    return filterStackTrace(this.node.metadata.find(md => md.type === LOGICAL_ID_MD)!.trace);

    function filterStackTrace(stack: string[]): string[] {
      const result = Array.of(...stack);
      while (result.length > 0 && shouldFilter(result[result.length - 1])) {
        result.pop();
      }
      // It's weird if we filtered everything, so return the whole stack...
      return result.length === 0 ? stack : result;
    }

    function shouldFilter(str: string): boolean {
      return str.match(/[^(]+\(internal\/.*/) !== null;
    }
  }

  /**
   * Return the path with respect to the stack
   */
  public get stackPath(): string {
    return this.node.ancestors(this.stack).map(c => c.node.id).join(PATH_SEP);
  }

  public get dependencyElements(): IDependable[] {
    return [ this ];
  }

  /**
   * Returns the CloudFormation 'snippet' for this entity. The snippet will only be merged
   * at the root level to ensure there are no identity conflicts.
   *
   * For example, a Resource class will return something like:
   * {
   *   Resources: {
   *     [this.logicalId]: {
   *       Type: this.resourceType,
   *       Properties: this.props,
   *       Condition: this.condition
   *     }
   *   }
   * }
   */
  public abstract toCloudFormation(): object;

  public abstract substituteCrossStackReferences(): void;

  protected deepSubCrossStackReferences(sourceStack: Stack, x: any): any {
    Array.isArray(sourceStack);
    return x;
  }
}

/**
 * CloudFormation template options for a stack.
 */
export interface TemplateOptions {
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
 * Base class for referenceable CloudFormation constructs which are not Resources
 *
 * These constructs are things like Conditions and Parameters, can be
 * referenced by taking the `.ref` attribute.
 *
 * Resource constructs do not inherit from Referenceable because they have their
 * own, more specific types returned from the .ref attribute. Also, some
 * resources aren't referenceable at all (such as BucketPolicies or GatewayAttachments).
 */
export abstract class Referenceable extends StackElement {
  /**
   * Returns a token to a CloudFormation { Ref } that references this entity based on it's logical ID.
   */
  public get ref(): string {
    return new Ref(this).toString();
  }
}

/**
 * Collect all StackElements from a construct
 *
 * @param node Root node to collect all StackElements from
 * @param into Array to append StackElements to
 * @returns The same array as is being collected into
 */
function stackElements(node: IConstruct, into: StackElement[] = []): StackElement[] {
  const element = StackElement._asStackElement(node);
  if (element) {
    into.push(element);
  }

  for (const child of node.node.children) {
    stackElements(child, into);
  }

  return into;
}

/**
 * A generic, untyped reference to a Stack Element
 */
export class Ref extends CfnReference {
  constructor(element: StackElement) {
    super({ Ref: element.logicalId }, `${element.logicalId}.Ref`, element);
  }
}

// These imports have to be at the end to prevent circular imports
import { Output } from './output';
import { Aws } from './pseudo';
