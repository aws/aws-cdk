import { Reference } from "../reference";
import { makeUniqueId } from './uniqueid';

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
   * What stack this Token is pointing to
   */
  private readonly producingStack?: Stack;

  /**
   * The Tokens that should be returned for each consuming stack (as decided by the producing Stack)
   */
  private readonly replacementTokens: Map<Stack, IResolvable>;

  private readonly originalDisplayName: string;
  private readonly humanReadableDesc: string;

  protected constructor(value: any, private readonly displayName: string, target: IConstruct) {
    // prepend scope path to display name
    super(value, target);
    this.originalDisplayName = displayName;
    this.replacementTokens = new Map<Stack, IResolvable>();
    this.humanReadableDesc = `target = ${target.node.path}`;

    this.producingStack = Stack.of(target);
    Object.defineProperty(this, CFN_REFERENCE_SYMBOL, { value: true });
  }

  public resolve(context: IResolveContext): any {
    // If we have a special token for this consuming stack, resolve that. Otherwise resolve as if
    // we are in the same stack.
    const consumingStack = Stack.of(context.scope);
    const token = this.replacementTokens.get(consumingStack);
    if (!token && this.isCrossStackReference(consumingStack) && !context.preparing) {
      // tslint:disable-next-line:max-line-length
      throw new Error(`Cross-stack reference (${context.scope.node.path} -> ${this.target.node.path}) has not been assigned a value--call prepare() first`);
    }

    if (token) {
      return token.resolve(context);
    } else {
      return super.resolve(context);
    }
  }

  /**
   * Register a stack this references is being consumed from.
   */
  public consumeFromStack(consumingStack: Stack, consumingConstruct: IConstruct) {
    if (this.producingStack && consumingStack.node.root !== this.producingStack.node.root) {
      throw this.newError(
        `Cannot reference across apps. ` +
        `Consuming and producing stacks must be defined within the same CDK app.`);
    }

    // tslint:disable-next-line:max-line-length
    if (!this.replacementTokens.has(consumingStack) && this.isCrossStackReference(consumingStack)) {
      // We're trying to resolve a cross-stack reference
      consumingStack.addDependency(this.producingStack!, `${consumingConstruct.node.path} -> ${this.target.node.path}.${this.originalDisplayName}`);
      this.replacementTokens.set(consumingStack, this.exportValue(consumingStack));
    }
  }

  /**
   * Implementation of toString() that will use the display name
   */
  public toString(): string {
    return Token.asString(this, {
      displayHint: `${this.target.node.id}.${this.displayName}`
    });
  }

  /**
   * Export a Token value for use in another stack
   *
   * Works by mutating the producing stack in-place.
   */
  private exportValue(consumingStack: Stack): IResolvable {
    const producingStack = this.producingStack!;

    if (producingStack.environment !== consumingStack.environment) {
      throw this.newError(`Can only reference cross stacks in the same region and account. ${this.humanReadableDesc}`);
    }

    // Ensure a singleton "Exports" scoping Construct
    // This mostly exists to trigger LogicalID munging, which would be
    // disabled if we parented constructs directly under Stack.
    // Also it nicely prevents likely construct name clashes

    const exportsName = 'Exports';
    let stackExports = producingStack.node.tryFindChild(exportsName) as Construct;
    if (stackExports === undefined) {
      stackExports = new Construct(producingStack, exportsName);
    }

    // Ensure a singleton CfnOutput for this value
    const resolved = producingStack.resolve(this);
    const id = 'Output' + JSON.stringify(resolved);
    const exportName = this.generateExportName(stackExports, id);
    let output = stackExports.node.tryFindChild(id) as CfnOutput;
    if (!output) {
      output = new CfnOutput(stackExports, id, { value: Token.asString(this), exportName });
    }

    // We want to return an actual FnImportValue Token here, but Fn.importValue() returns a 'string',
    // so construct one in-place.
    return new Intrinsic({ 'Fn::ImportValue': exportName });
  }

  private generateExportName(stackExports: Construct, id: string) {
    const stack = Stack.of(stackExports);
    const components = [...stackExports.node.scopes.slice(2).map(c => c.node.id), id];
    const prefix = stack.stackName ? stack.stackName + ':' : '';
    const exportName = prefix + makeUniqueId(components);
    return exportName;
  }

  private isCrossStackReference(consumingStack: Stack) {
    return this.producingStack && this.producingStack !== consumingStack;
  }
}

import { CfnElement } from "../cfn-element";
import { CfnOutput } from "../cfn-output";
import { Construct, IConstruct } from "../construct";
import { IResolvable, IResolveContext } from "../resolvable";
import { Stack } from "../stack";
import { Token } from "../token";
import { Intrinsic } from "./intrinsic";
