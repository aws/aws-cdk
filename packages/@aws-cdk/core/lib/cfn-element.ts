import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import { Construct, Node } from 'constructs';

// v2 - keep this import as a separate section to reduce merge conflict when forward merging with the v2 branch.
// eslint-disable-next-line
import { Construct as CoreConstruct } from './construct-compat';
import { Lazy } from './lazy';

const CFN_ELEMENT_SYMBOL = Symbol.for('@aws-cdk/core.CfnElement');

/**
 * An element of a CloudFormation stack.
 */
export abstract class CfnElement extends CoreConstruct {
  /**
   * Returns `true` if a construct is a stack element (i.e. part of the
   * synthesized cloudformation template).
   *
   * Uses duck-typing instead of `instanceof` to allow stack elements from different
   * versions of this library to be included in the same stack.
   *
   * @returns The construct as a stack element or undefined if it is not a stack element.
   */
  public static isCfnElement(x: any): x is CfnElement {
    return CFN_ELEMENT_SYMBOL in x;
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

  /**
   * The stack in which this element is defined. CfnElements must be defined within a stack scope (directly or indirectly).
   */
  public readonly stack: Stack;

  /**
   * An explicit logical ID provided by `overrideLogicalId`.
   */
  private _logicalIdOverride?: string;

  /**
   * Creates an entity and binds it to a tree.
   * Note that the root of the tree must be a Stack object (not just any Root).
   *
   * @param scope The parent construct
   * @param props Construct properties
   */
  constructor(scope: Construct, id: string) {
    super(scope, id);

    Object.defineProperty(this, CFN_ELEMENT_SYMBOL, { value: true });

    this.stack = Stack.of(this);

    this.logicalId = Lazy.uncachedString({ produce: () => this.synthesizeLogicalId() }, {
      displayHint: `${notTooLong(Node.of(this).path)}.LogicalID`,
    });

    if (!this.node.tryGetContext(cxapi.DISABLE_LOGICAL_ID_METADATA)) {
      Node.of(this).addMetadata(cxschema.ArtifactMetadataEntryType.LOGICAL_ID, this.logicalId, this.constructor);
    }
  }

  /**
   * Overrides the auto-generated logical ID with a specific ID.
   * @param newLogicalId The new logical ID to use for this stack element.
   */
  public overrideLogicalId(newLogicalId: string) {
    this._logicalIdOverride = newLogicalId;
  }

  /**
   * @returns the stack trace of the point where this Resource was created from, sourced
   *      from the +metadata+ entry typed +aws:cdk:logicalId+, and with the bottom-most
   *      node +internal+ entries filtered.
   */
  public get creationStack(): string[] {
    const trace = Node.of(this).metadata.find(md => md.type === cxschema.ArtifactMetadataEntryType.LOGICAL_ID)!.trace;
    if (!trace) {
      return [];
    }

    return filterStackTrace(trace);

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
   *
   * @internal
   */
  public abstract _toCloudFormation(): object;

  /**
   * Called during synthesize to render the logical ID of this element. If
   * `overrideLogicalId` was it will be used, otherwise, we will allocate the
   * logical ID through the stack.
   */
  private synthesizeLogicalId() {
    if (this._logicalIdOverride) {
      return this._logicalIdOverride;
    } else {
      return this.stack.getLogicalId(this);
    }
  }
}

/**
 * Base class for referenceable CloudFormation constructs which are not Resources
 *
 * These constructs are things like Conditions and Parameters, can be
 * referenced by taking the `.ref` attribute.
 *
 * Resource constructs do not inherit from CfnRefElement because they have their
 * own, more specific types returned from the .ref attribute. Also, some
 * resources aren't referenceable at all (such as BucketPolicies or GatewayAttachments).
 */
export abstract class CfnRefElement extends CfnElement {
  /**
   * Return a string that will be resolved to a CloudFormation `{ Ref }` for this element.
   *
   * If, by any chance, the intrinsic reference of a resource is not a string, you could
   * coerce it to an IResolvable through `Lazy.any({ produce: resource.ref })`.
   */
  public get ref(): string {
    return Token.asString(CfnReference.for(this, 'Ref'));
  }
}

function notTooLong(x: string) {
  if (x.length < 100) { return x; }
  return x.slice(0, 47) + '...' + x.slice(-47);
}

import { CfnReference } from './private/cfn-reference';
import { Stack } from './stack';
import { Token } from './token';
