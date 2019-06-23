import { Intrinsic } from "./private/intrinsic";

const REFERENCE_SYMBOL = Symbol.for('@aws-cdk/core.Reference');

/**
 * An intrinsic Token that represents a reference to a construct.
 *
 * References are recorded.
 */
export abstract class Reference extends Intrinsic {
  /**
   * Check whether this is actually a Reference
   */
  public static isReference(x: any): x is Reference {
    return typeof x === 'object' && x !== null && REFERENCE_SYMBOL in x;
  }

  public readonly target: IConstruct;

  constructor(value: any, target: IConstruct) {
    super(value);
    this.target = target;
    Object.defineProperty(this, REFERENCE_SYMBOL, { value: true });
  }
}

import { IConstruct } from "./construct";
