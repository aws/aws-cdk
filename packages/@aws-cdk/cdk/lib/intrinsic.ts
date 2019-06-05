import { IResolveContext, Token } from "./token";

export interface IntrinsicProps {
  /**
   * A hint for the Token's purpose when stringifying it
   */
  readonly displayHint?: string;
}

/**
 * Token subclass that represents values intrinsic to the target document language
 */
export class Intrinsic extends Token {
  private readonly value: any;

  constructor(value: any, props: IntrinsicProps = {}) {
    if (isFunction(value)) {
      throw new Error(`Argument to Intrinsic must be a plain value object, got ${value}`);
    }

    super(props);

    this.value = value;
  }

  public resolve(_context: IResolveContext) {
    return this.value;
  }
}

function isFunction(x: any) {
  return typeof x === 'function';
}