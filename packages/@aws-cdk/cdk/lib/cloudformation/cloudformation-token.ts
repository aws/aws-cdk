import { Construct } from "../core/construct";
import { resolve, Token } from "../core/tokens";

/**
 * Base class for CloudFormation built-ins
 */
export class CloudFormationToken extends Token {
  public concat(left: any | undefined, right: any | undefined): Token {
    const parts = new Array<any>();
    if (left !== undefined) { parts.push(left); }
    parts.push(resolve(this));
    if (right !== undefined) { parts.push(right); }
    return new FnConcat(...parts);
  }
}

export class StackAwareCloudFormationToken extends CloudFormationToken {
  public static isInstance(x: any): x is StackAwareCloudFormationToken {
    return x && x._isStackAwareCloudFormationToken;
  }

  protected readonly _isStackAwareCloudFormationToken: boolean;

  private readonly tokenStack?: Stack;

  constructor(anchor: Construct | undefined, value: any, displayName?: string) {
      if (typeof(value) === 'function') {
          throw new Error('StackAwareCloudFormationToken can only contain eager values');
      }
      super(value, displayName);
      this._isStackAwareCloudFormationToken = true;

      if (anchor !== undefined) {
        this.tokenStack = Stack.find(anchor);
      }
  }

  /**
   * In a consuming context, potentially substitute this Token with a different one
   */
  public substituteToken(consumingStack: Stack): Token {
      if (this.tokenStack && this.tokenStack !== consumingStack) {
          // We're trying to resolve a cross-stack reference
          consumingStack.addStackDependency(this.tokenStack);
          return this.tokenStack.exportValue(this, consumingStack);
      }
      // In case of doubt, return same Token
      return this;
  }
}

/**
 * Return whether the given value represents a CloudFormation intrinsic
 */
export function isIntrinsic(x: any) {
  if (Array.isArray(x) || x === null || typeof x !== 'object') { return false; }

  const keys = Object.keys(x);
  if (keys.length !== 1) { return false; }

  return keys[0] === 'Ref' || keys[0].startsWith('Fn::');
}

import { FnConcat } from "./fn";
import { Stack } from "./stack";