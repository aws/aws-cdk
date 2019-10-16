import { Reference } from "../reference";

const CFN_REFERENCE_SYMBOL = Symbol.for('@aws-cdk/core.CfnReference');

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
   *     Lazy.stringValue({ produce: () => new CfnReference(...) })
   */
  public static for(target: CfnElement, attribute: string) {
    return CfnReference.singletonReference(target, attribute, () => {
      const cfnIntrinsic = attribute === 'Ref' ? { Ref: target.logicalId } : { 'Fn::GetAtt': [ target.logicalId, attribute ]};
      return new CfnReference(cfnIntrinsic, attribute, target);
    });
  }

  /**
   * Return a CfnReference that references a pseudo referencd
   */
  public static forPseudo(pseudoName: string, scope: Construct) {
    return CfnReference.singletonReference(scope, `Pseudo:${pseudoName}`, () => {
      const cfnIntrinsic = { Ref: pseudoName };
      return new CfnReference(cfnIntrinsic, pseudoName, scope);
    });
  }

  /**
   * Static table where we keep singleton CfnReference instances
   */
  private static referenceTable = new Map<Construct, Map<string, CfnReference>>();

  /**
   * Get or create the table
   */
  private static singletonReference(target: Construct, attribKey: string, fresh: () => CfnReference) {
    let attribs = CfnReference.referenceTable.get(target);
    if (!attribs) {
      attribs = new Map();
      CfnReference.referenceTable.set(target, attribs);
    }
    let ref = attribs.get(attribKey);
    if (!ref) {
      ref = fresh();
      attribs.set(attribKey, ref);
    }
    return ref;
  }

  /**
   * The Tokens that should be returned for each consuming stack (as decided by the producing Stack)
   */
  private readonly replacementTokens: Map<Stack, IResolvable>;

  protected constructor(value: any, displayName: string, target: IConstruct) {
    // prepend scope path to display name
    super(value, target, displayName);

    this.replacementTokens = new Map<Stack, IResolvable>();

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
    return this.replacementTokens.has(stack);
  }

  public assignValueForStack(stack: Stack, value: IResolvable) {
    if (this.hasValueForStack(stack)) {
      throw new Error(`Cannot assign a reference value twice to the same stack. Use hasValueForStack to check first`);
    }

    this.replacementTokens.set(stack, value);
  }
  /**
   * Implementation of toString() that will use the display name
   */
  public toString(): string {
    return Token.asString(this, {
      displayHint: `${this.target.node.id}.${this.displayName}`
    });
  }
}

import { CfnElement } from "../cfn-element";
import { Construct, IConstruct } from "../construct";
import { IResolvable, IResolveContext } from "../resolvable";
import { Stack } from "../stack";
import { Token } from "../token";
