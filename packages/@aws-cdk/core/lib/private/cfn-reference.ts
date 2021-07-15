/* eslint-disable import/order */
import { Reference } from '../reference';

const CFN_REFERENCE_SYMBOL = Symbol.for('@aws-cdk/core.CfnReference');

/**
 * An enum that allows controlling how will the created reference
 * be rendered in the resulting CloudFormation template.
 */
export enum ReferenceRendering {
  /**
   * Used for rendering a reference inside Fn::Sub expressions,
   * which mean these must resolve to "${Sth}" instead of { Ref: "Sth" }.
   */
  FN_SUB,

  /**
   * Used for rendering Fn::GetAtt with its arguments in string form
   * (as opposed to the more common arguments in array form, which we render by default).
   */
  GET_ATT_STRING,
}

/**
 * A Token that represents a CloudFormation reference to another resource
 *
 * If these references are used in a different stack from where they are
 * defined, appropriate CloudFormation `Export`s and `Fn::ImportValue`s will be
 * synthesized automatically instead of the regular CloudFormation references.
 *
 * Additionally, the dependency between the stacks will be recorded, and the toolkit
 * will make sure to deploy producing stack before the consuming stack.
 *
 * This magic happens in the prepare() phase, where consuming stacks will call
 * `consumeFromStack` on these Tokens and if they happen to be exported by a different
 * Stack, we'll register the dependency.
 */
export class CfnReference extends Reference {
  /**
   * Check whether this is actually a Reference
   */
  public static isCfnReference(x: IResolvable): x is CfnReference {
    return CFN_REFERENCE_SYMBOL in x;
  }

  /**
   * Return the CfnReference for the indicated target
   *
   * Will make sure that multiple invocations for the same target and intrinsic
   * return the same CfnReference. Because CfnReferences accumulate state in
   * the prepare() phase (for the purpose of cross-stack references), it's
   * important that the state isn't lost if it's lazily created, like so:
   *
   *     Lazy.string({ produce: () => new CfnReference(...) })
   *
   */
  public static for(target: CfnElement, attribute: string, refRender?: ReferenceRendering) {
    return CfnReference.singletonReference(target, attribute, refRender, () => {
      const cfnIntrinsic = refRender === ReferenceRendering.FN_SUB
        ? ('${' + target.logicalId + (attribute === 'Ref' ? '' : `.${attribute}`) + '}')
        : (attribute === 'Ref'
          ? { Ref: target.logicalId }
          : {
            'Fn::GetAtt': refRender === ReferenceRendering.GET_ATT_STRING
              ? `${target.logicalId}.${attribute}`
              : [target.logicalId, attribute],
          }
        );
      return new CfnReference(cfnIntrinsic, attribute, target);
    });
  }

  /**
   * Return a CfnReference that references a pseudo referencd
   */
  public static forPseudo(pseudoName: string, scope: Construct) {
    return CfnReference.singletonReference(scope, `Pseudo:${pseudoName}`, undefined, () => {
      const cfnIntrinsic = { Ref: pseudoName };
      return new CfnReference(cfnIntrinsic, pseudoName, scope);
    });
  }

  /**
   * Static table where we keep singleton CfnReference instances
   */
  private static referenceTable = new Map<Construct, Map<string, CfnReference>>();

  /**
   * Get or create the table.
   * Passing fnSub = true allows cloudformation-include to correctly handle Fn::Sub.
   */
  private static singletonReference(target: Construct, attribKey: string, refRender: ReferenceRendering | undefined, fresh: () => CfnReference) {
    let attribs = CfnReference.referenceTable.get(target);
    if (!attribs) {
      attribs = new Map();
      CfnReference.referenceTable.set(target, attribs);
    }
    let cacheKey = attribKey;
    switch (refRender) {
      case ReferenceRendering.FN_SUB:
        cacheKey += 'Fn::Sub';
        break;
      case ReferenceRendering.GET_ATT_STRING:
        cacheKey += 'Fn::GetAtt::String';
        break;
    }
    let ref = attribs.get(cacheKey);
    if (!ref) {
      ref = fresh();
      attribs.set(cacheKey, ref);
    }
    return ref;
  }

  /**
   * The Tokens that should be returned for each consuming stack (as decided by the producing Stack)
   */
  private readonly replacementTokens: Map<Stack, IResolvable>;
  private readonly targetStack: Stack;

  protected constructor(value: any, displayName: string, target: IConstruct) {
    // prepend scope path to display name
    super(value, target, displayName);

    this.replacementTokens = new Map<Stack, IResolvable>();
    this.targetStack = Stack.of(target);

    Object.defineProperty(this, CFN_REFERENCE_SYMBOL, { value: true });
  }

  public resolve(context: IResolveContext): any {
    // If we have a special token for this consuming stack, resolve that. Otherwise resolve as if
    // we are in the same stack.
    const consumingStack = Stack.of(context.scope);
    const token = this.replacementTokens.get(consumingStack);

    // if (!token && this.isCrossStackReference(consumingStack) && !context.preparing) {
    // eslint-disable-next-line max-len
    //   throw new Error(`Cross-stack reference (${context.scope.node.path} -> ${this.target.node.path}) has not been assigned a value--call prepare() first`);
    // }

    if (token) {
      return token.resolve(context);
    } else {
      return super.resolve(context);
    }
  }

  public hasValueForStack(stack: Stack) {
    if (stack === this.targetStack) {
      return true;
    }

    return this.replacementTokens.has(stack);
  }

  public assignValueForStack(stack: Stack, value: IResolvable) {
    if (stack === this.targetStack) {
      throw new Error('cannot assign a value for the same stack');
    }

    if (this.hasValueForStack(stack)) {
      throw new Error('Cannot assign a reference value twice to the same stack. Use hasValueForStack to check first');
    }

    this.replacementTokens.set(stack, value);
  }
  /**
   * Implementation of toString() that will use the display name
   */
  public toString(): string {
    return Token.asString(this, {
      displayHint: `${this.target.node.id}.${this.displayName}`,
    });
  }
}

import { Construct, IConstruct } from 'constructs';
import { CfnElement } from '../cfn-element';
import { IResolvable, IResolveContext } from '../resolvable';
import { Stack } from '../stack';
import { Token } from '../token';
