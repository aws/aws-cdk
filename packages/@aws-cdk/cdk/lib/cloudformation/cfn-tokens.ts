import { Reference, ResolveContext, Token } from "../core/tokens";

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
   * Check whether this is actually a CfnReference
   */
  public static isCfnReference(x: Token): x is CfnReference {
    return (x as any).consumeFromStack !== undefined;
  }

  public readonly target?: IConstruct;

  /**
   * What stack this Token is pointing to
   */
  private readonly producingStack?: Stack;

  /**
   * The Tokens that should be returned for each consuming stack (as decided by the producing Stack)
   */
  private readonly replacementTokens: Map<Stack, Token>;

  constructor(value: any, displayName?: string, scope?: Construct) {
    if (typeof(value) === 'function') {
        throw new Error('CfnReference can only hold CloudFormation intrinsics (not a function)');
    }
    // prepend scope path to display name
    if (displayName && scope) {
      displayName = `${scope.node.path}.${displayName}`;
    }
    super(value, displayName);
    this.replacementTokens = new Map<Stack, Token>();

    if (scope !== undefined) {
      this.producingStack = scope.node.stack;
    }

    this.target = scope;
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
  public consumeFromStack(consumingStack: Stack) {
    if (this.producingStack && this.producingStack !== consumingStack && !this.replacementTokens.has(consumingStack)) {
      // We're trying to resolve a cross-stack reference
      consumingStack.addDependency(this.producingStack);
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

    // Ensure a singleton Output for this value
    const resolved = producingStack.node.resolve(tokenValue);
    const id = 'Output' + JSON.stringify(resolved);
    let output = stackExports.node.tryFindChild(id) as Output;
    if (!output) {
      output = new Output(stackExports, id, { value: tokenValue });
    }

    // We want to return an actual FnImportValue Token here, but Fn.importValue() returns a 'string',
    // so construct one in-place.
    return new Token({ 'Fn::ImportValue': output.obtainExportName() });
  }

}

import { Construct, IConstruct } from "../core/construct";
import { Output } from "./output";
import { Stack } from "./stack";
