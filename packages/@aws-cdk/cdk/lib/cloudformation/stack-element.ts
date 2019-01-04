import { Construct, IConstruct, PATH_SEP } from "../core/construct";
import { CfnReference } from "../core/tokens/cfn-tokens";
import { RESOLVE_OPTIONS } from "../core/tokens/options";

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

    this.node.addMetadata(LOGICAL_ID_MD, new (require("../core/tokens/token").Token)(() => this.logicalId), this.constructor);

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

  /**
   * Automatically detect references in this StackElement
   */
  protected prepare() {
    const options = RESOLVE_OPTIONS.push({ preProcess: (token, _) => { this.node.recordReference(token); return token; } });
    try {
      // Execute for side effect of calling 'preProcess'
      this.node.resolve(this.toCloudFormation());
    } finally {
      options.pop();
    }
  }
}

/**
 * A generic, untyped reference to a Stack Element
 */
export class Ref extends CfnReference {
  constructor(element: StackElement) {
    super({ Ref: element.logicalId }, `${element.logicalId}.Ref`, element);
  }
}

import { Stack } from "./stack";

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
