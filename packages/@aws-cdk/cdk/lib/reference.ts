import { Token } from "./token";

const REFERENCE_SYMBOL = Symbol.for('@aws-cdk/cdk.Reference');

/**
 * A Token that represents a reference between two constructs
 *
 * References are recorded.
 */
export class Reference extends Token {
  /**
   * Check whether this is actually a Reference
   */
  public static isReference(x: Token): x is Reference {
    return (x as any)[REFERENCE_SYMBOL] === true;
  }

  public readonly target: Construct;

  constructor(value: any, displayName: string, target: Construct) {
    super(value, displayName);
    this.target = target;
    Object.defineProperty(this, REFERENCE_SYMBOL, { value: true });
  }
}

import { Construct } from "./construct";
