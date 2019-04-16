import { Reference } from "./reference";

const CFN_REFERENCE_SYMBOL = Symbol.for('@aws-cdk/cdk.CfnReference');

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
  public static isCfnReference(x: Token): x is CfnReference {
    return (x as any)[CFN_REFERENCE_SYMBOL] === true;
  }

  /**
   * What stack this Token is pointing to
   */
  private readonly producingStack?: Stack;

  /**
   * The Tokens that should be returned for each consuming stack (as decided by the producing Stack)
   */
  private readonly replacementTokens: Map<Stack, Token>;

  private readonly originalDisplayName: string;

  constructor(value: any, displayName: string, target: Construct) {
    if (typeof(value) === 'function') {
        throw new Error('Reference can only hold CloudFormation intrinsics (not a function)');
    }
    // prepend scope path to display name
    super(value, `${target.node.id}.${displayName}`, target);
    this.originalDisplayName = displayName;
    this.replacementTokens = new Map<Stack, Token>();

    this.producingStack = target.node.stack;
    Object.defineProperty(this, CFN_REFERENCE_SYMBOL, { value: true });
  }

  public resolve(context: ResolveContext): any {
    // If we have a special token for this consuming stack, resolve that. Otherwise resolve as if
    // we are in the same stack.
    const token = this.replacementTokens.get(context.scope.node.stack);
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
    if (this.producingStack && this.producingStack !== consumingStack && !this.replacementTokens.has(consumingStack)) {
      // We're trying to resolve a cross-stack reference
      consumingStack.addDependency(this.producingStack, `${consumingConstruct.node.path} -> ${this.target.node.path}.${this.originalDisplayName}`);
      this.replacementTokens.set(consumingStack, this.exportValue(this, consumingStack));
    }
  }

  /**
   * Export a Token value for use in another stack
   *
   * Works by mutating the producing stack in-place.
   */
  private exportValue(tokenValue: Token, consumingStack: Stack): Token {
    const producingStack = this.producingStack!;

    if (producingStack.env.account !== consumingStack.env.account || producingStack.env.region !== consumingStack.env.region) {
      throw new Error('Can only reference cross stacks in the same region and account.');
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
    const resolved = producingStack.node.resolve(tokenValue);
    const id = 'Output' + JSON.stringify(resolved);
    let output = stackExports.node.tryFindChild(id) as CfnOutput;
    if (!output) {
      output = new CfnOutput(stackExports, id, { value: tokenValue });
    }

    // We want to return an actual FnImportValue Token here, but Fn.importValue() returns a 'string',
    // so construct one in-place.
    return new Token({ 'Fn::ImportValue': output.obtainExportName() });
  }

}

import { CfnOutput } from "./cfn-output";
import { Construct, IConstruct } from "./construct";
import { Stack } from "./stack";
import { ResolveContext, Token } from "./token";
