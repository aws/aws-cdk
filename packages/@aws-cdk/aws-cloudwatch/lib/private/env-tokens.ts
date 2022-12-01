import * as cdk from '@aws-cdk/core';

/**
 * Make a Token that renders to given region if used in a different stack, otherwise undefined
 */
export function regionIfDifferentFromStack(region: string): string {
  return cdk.Token.asString(new StackDependentToken(region, stack => stack.region));
}

/**
 * Make a Token that renders to given account if used in a different stack, otherwise undefined
 */
export function accountIfDifferentFromStack(account: string): string {
  return cdk.Token.asString(new StackDependentToken(account, stack => stack.account));
}

/**
 * A lazy token that requires an instance of Stack to evaluate
 */
class StackDependentToken implements cdk.IResolvable {
  public readonly creationStack: string[];
  constructor(private readonly originalValue: string, private readonly fn: (stack: cdk.Stack) => string) {
    this.creationStack = cdk.captureStackTrace();
  }

  public resolve(context: cdk.IResolveContext) {
    const stackValue = this.fn(cdk.Stack.of(context.scope));

    // Don't render if the values are definitely the same. If the stack
    // is unresolved we don't know, better output the value.
    if (!cdk.Token.isUnresolved(stackValue) && stackValue === this.originalValue) {
      return undefined;
    }

    return this.originalValue;
  }

  public toString() {
    return cdk.Token.asString(this);
  }

  public toJSON() {
    return this.originalValue;
  }
}
