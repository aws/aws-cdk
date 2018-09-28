import cxapi = require('@aws-cdk/cx-api');
import { App } from '../app';
import { Construct, PATH_SEP } from '../core/construct';
import { resolve, Token } from '../core/tokens';
import { Environment } from '../environment';
import { CloudFormationToken } from './cloudformation-token';
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
    let curr: Construct | undefined = node;
    while (curr != null && !isStack(curr)) {
      curr = curr.parent;
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

    construct.addMetadata('aws:cdk:physical-name', physicalName);
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
   * Used to determine if this construct is a stack.
   */
  public readonly isStack = true;

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

  /**
   * Creates a new stack.
   *
   * @param parent Parent of this stack, usually a Program instance.
   * @param name The name of the CloudFormation stack. Defaults to "Stack".
   * @param props Stack properties.
   */
  public constructor(parent?: App, name?: string, props?: StackProps) {
    // For unit test convenience parents are optional, so bypass the type check when calling the parent.
    super(parent!, name!);
    this.env = this.parseEnvironment(props);

    this.logicalIds = new LogicalIDs(props && props.namingScheme ? props.namingScheme : new HashedAddressingScheme());
    this.name = name || 'Stack';
  }

  /**
   * Looks up a resource by path.
   *
   * @returns The Resource or undefined if not found
   */
  public findResource(path: string): Resource | undefined {
    const r = this.findChild(path);
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
    this.lock();

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
      const ret = resolve(template) || { };

      this.logicalIds.assertAllRenamesApplied();

      return ret;
    } finally {
      // allow mutations after synthesis is finished.
      this.unlock();
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
    if (this.children.length > 0) {
      throw new Error("All renames must be set up before adding elements to the stack");
    }

    this.logicalIds.renameLogical(oldId, newId);
  }

  /**
   * Validate stack name
   *
   * CloudFormation stack names can include dashes in addition to the regular identifier
   * character classes, and we don't allow one of the magic markers.
   */
  protected _validateId(name: string) {
    if (!Stack.VALID_STACK_NAME_REGEX.test(name)) {
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
      env.account = this.getContext(cxapi.DEFAULT_ACCOUNT_CONTEXT_KEY);
    }

    // if region is not specified, attempt to read from context.
    if (!env.region) {
      env.region = this.getContext(cxapi.DEFAULT_REGION_CONTEXT_KEY);
    }

    return env;
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
  public static _asStackElement(construct: Construct): StackElement | undefined {
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
  constructor(parent: Construct, name: string) {
    super(parent, name);
    const s = Stack.find(this);
    if (!s) {
      throw new Error('The tree root must be derived from "Stack"');
    }
    this.stack = s;

    this.addMetadata(LOGICAL_ID_MD, new Token(() => this.logicalId), this.constructor);

    this.logicalId = this.stack.logicalIds.getLogicalId(this);
  }

  /**
   * @returns the stack trace of the point where this Resource was created from, sourced
   *      from the +metadata+ entry typed +aws:cdk:logicalId+, and with the bottom-most
   *      node +internal+ entries filtered.
   */
  public get creationStackTrace(): string[] {
    return filterStackTrace(this.metadata.find(md => md.type === LOGICAL_ID_MD)!.trace);

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
    return this.ancestors(this.stack).map(c => c.id).join(PATH_SEP);
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
 * Return whether the given object is a Stack.
 *
 * We do attribute detection since we can't reliably use 'instanceof'.
 */
function isStack(construct: Construct): construct is Stack {
  return (construct as any).isStack;
}

/**
 * Collect all StackElements from a construct
 *
 * @param node Root node to collect all StackElements from
 * @param into Array to append StackElements to
 * @returns The same array as is being collected into
 */
function stackElements(node: Construct, into: StackElement[] = []): StackElement[] {
  const element = StackElement._asStackElement(node);
  if (element) {
    into.push(element);
  }

  for (const child of node.children) {
    stackElements(child, into);
  }

  return into;
}

/**
 * A generic, untyped reference to a Stack Element
 */
export class Ref extends CloudFormationToken {
  constructor(element: StackElement) {
    super({ Ref: element.logicalId }, `${element.logicalId}.Ref`);
  }
}
