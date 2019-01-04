import { Construct } from "../construct";
import { ResolveContext, Token } from "./token";

/**
 * A Token that represents a CloudFormation reference to another resource
 */
export class CfnReference extends Token {
  /**
   * The reference type for instances of this class
   */
  public static ReferenceType = 'cfn-reference';

  public readonly referenceType?: string;
  private readonly tokenStack?: Stack;
  private readonly replacementTokens: Map<Stack, Token>;

  constructor(value: any, displayName?: string, anchor?: Construct) {
    if (typeof(value) === 'function') {
        throw new Error('CfnReference can only contain eager values');
    }
    super(value, displayName);
    this.referenceType = CfnReference.ReferenceType;
    this.replacementTokens = new Map<Stack, Token>();

    if (anchor !== undefined) {
      this.tokenStack = Stack.find(anchor);
    }
  }

  public resolve(context: ResolveContext): any {
    // If we have a special token for this stack, resolve that instead, otherwise resolve the original
    const token = this.replacementTokens.get(Stack.find(context.construct));
    if (token) {
      return token.resolve(context);
    } else {
      return super.resolve(context);
    }
  }

  /**
   * In a consuming context, potentially substitute this Token with a different one
   */
  public consumeFromStack(consumingStack: Stack) {
    if (this.tokenStack && this.tokenStack !== consumingStack && !this.replacementTokens.has(consumingStack)) {
        // We're trying to resolve a cross-stack reference
        consumingStack.addDependency(this.tokenStack);
        this.replacementTokens.set(consumingStack, this.tokenStack.exportValue(this, consumingStack));
    }
  }
}

import { Stack } from "../../cloudformation/stack";