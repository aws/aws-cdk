import { Construct } from "../core/construct";
import { Token } from "../core/tokens";

/**
 * A Token that represents a CloudFormation reference to another resource
 */
export class CfnReference extends Token {
  public static isInstance(x: any): x is CfnReference {
    return x && x._isCfnReference;
  }

  protected readonly _isCfnReference: boolean;

  private readonly tokenStack?: Stack;

  constructor(value: any, displayName?: string, anchor?: Construct) {
      if (typeof(value) === 'function') {
          throw new Error('CfnReference can only contain eager values');
      }
      super(value, displayName);
      this._isCfnReference = true;

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
          consumingStack.addDependency(this.tokenStack);
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

import { Stack } from "./stack";