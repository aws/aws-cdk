import { Construct, IConstruct, PATH_SEP } from "../core/construct";
import { Token } from '../core/tokens';

const LOGICAL_ID_MD = 'aws:cdk:logicalId';

/**
 * An element of a CloudFormation stack.
 */
export abstract class CfnElement extends Construct {
  /**
   * Returns `true` if a construct is a stack element (i.e. part of the
   * synthesized cloudformation template).
   *
   * Uses duck-typing instead of `instanceof` to allow stack elements from different
   * versions of this library to be included in the same stack.
   *
   * @returns The construct as a stack element or undefined if it is not a stack element.
   */
  public static isCfnElement(construct: IConstruct): construct is CfnElement {
    return ('logicalId' in construct && 'toCloudFormation' in construct);
  }

  /**
   * The logical ID for this CloudFormation stack element. The logical ID of the element
   * is calculated from the path of the resource node in the construct tree.
   *
   * To override this value, use `overrideLogicalId(newLogicalId)`.
   *
   * @returns the logical ID as a stringified token. This value will only get
   * resolved during synthesis.
   */
  public readonly logicalId: string;

  private _logicalId: string;

  /**
   * Creates an entity and binds it to a tree.
   * Note that the root of the tree must be a Stack object (not just any Root).
   *
   * @param parent The parent construct
   * @param props Construct properties
   */
  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.node.addMetadata(LOGICAL_ID_MD, new (require("../core/tokens/token").Token)(() => this.logicalId), this.constructor);

    this._logicalId = this.node.stack.logicalIds.getLogicalId(this);
    this.logicalId = new Token(() => this._logicalId).toString();
  }

  /**
   * Overrides the auto-generated logical ID with a specific ID.
   * @param newLogicalId The new logical ID to use for this stack element.
   */
  public overrideLogicalId(newLogicalId: string) {
    this._logicalId = newLogicalId;
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
    return this.node.ancestors(this.node.stack).map(c => c.node.id).join(PATH_SEP);
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
   * Automatically detect references in this CfnElement
   */
  protected prepare() {
    try {
      // Note: it might be that the properties of the CFN object aren't valid.
      // This will usually be preventatively caught in a construct's validate()
      // and turned into a nicely descriptive error, but we're running prepare()
      // before validate(). Swallow errors that occur because the CFN layer
      // doesn't validate completely.
      //
      // This does make the assumption that the error will not be rectified,
      // but the error will be thrown later on anyway. If the error doesn't
      // get thrown down the line, we may miss references.
      this.node.recordReference(...findTokens(this, () => this.toCloudFormation()));
    } catch (e) {
      if (e.type !== 'CfnSynthesisError') { throw e; }
    }
  }
}

import { CfnReference } from "./cfn-tokens";

/**
 * A generic, untyped reference to a Stack Element
 */
export class Ref extends CfnReference {
  constructor(element: CfnElement) {
    super({ Ref: element.logicalId }, 'Ref', element);
  }
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
export abstract class Referenceable extends CfnElement {
  /**
   * Returns a token to a CloudFormation { Ref } that references this entity based on it's logical ID.
   */
  public get ref(): string {
    return new Ref(this).toString();
  }
}

import { findTokens } from "../core/tokens/resolve";
