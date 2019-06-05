import { Intrinsic } from "./intrinsic";
import { IToken } from "./token";

const REFERENCE_SYMBOL = Symbol.for('@aws-cdk/cdk.Reference');

/**
 * An intrinsic Token that represents a reference to a construct.
 *
 * References are recorded.
 */
export abstract class Reference extends Intrinsic {
  /**
   * Check whether this is actually a Reference
   */
  public static isReference(x: IToken): x is Reference {
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