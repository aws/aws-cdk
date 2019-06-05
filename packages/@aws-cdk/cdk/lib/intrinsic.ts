import { IResolveContext, Token } from "./token";

/**
 * Token subclass that represents values intrinsic to the target document language
 */
export class Intrinsic extends Token {
  private readonly value: any;

  constructor(value: any, displayName?: string) {
    if (isFunction(value)) {
      throw new Error(`Argument to Intrinsic must be a plain value object, got ${value}`);
    }

    super(displayName);

    this.value = value;
  }

  public resolve(_context: IResolveContext) {
    return this.value;
  }
}

function isFunction(x: any) {
  return typeof x === 'function';
}