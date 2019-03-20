import { Token } from "./token";

/**
 * A Token that represents a reference between two constructs
 *
 * References are recorded.
 */
export class Reference extends Token {
  /**
   * Check whether this is actually a Reference
   */
  public static isReferenceToken(x: Token): x is Reference {
    return (x as any).isReference === true;
  }

  public readonly isReference: boolean = true;

  public readonly target: Construct;

  constructor(value: any, displayName: string, target: Construct) {
    super(value, displayName);
    this.target = target;
  }
}

import { Construct } from "./construct";