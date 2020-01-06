import * as cdk from '@aws-cdk/core';
import { dropUndefined } from './util';

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

    if (cdk.Token.isUnresolved(stackValue) || stackValue === this.originalValue) {
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

/**
 * A token that will not return an empty "options" object as the last element in an array
 *
 * Necessary to prevent options objects that only contain "region" and "account" keys
 * that evaluate to "undefined" from showing up in the rendered JSON.
 */
export class DropEmptyGraphOptions implements cdk.IResolvable, cdk.IPostProcessor {
  public readonly creationStack: string[];

  constructor(private readonly value: any) {
    this.creationStack = cdk.captureStackTrace();
  }

  public resolve(context: cdk.IResolveContext) {
    context.registerPostProcessor(this);
    return context.resolve(this.value);
  }

  public postProcess(o: any, _context: cdk.IResolveContext): any {
    if (!Array.isArray(o)) { return o; }

    const lastEl = o[o.length - 1];

    if (typeof lastEl === 'object' && lastEl !== null && Object.keys(dropUndefined(lastEl)).length === 0) {
      return o.slice(0, o.length - 1);
    }

    return o;
  }
}