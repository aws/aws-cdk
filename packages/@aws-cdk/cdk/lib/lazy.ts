import { IResolveContext, Token } from "./token";

/**
 * Interface for lazy string producers
 */
export interface IStringValue {
  /**
   * Produce the string value
   */
  produce(context: IResolveContext): string | undefined;
}

/**
 * Interface for lazy list producers
 */
export interface IListValue {
  /**
   * Produce the list value
   */
  produce(context: IResolveContext): string[] | undefined;
}

/**
 * Interface for lazy number producers
 */
export interface INumberValue {
  /**
   * Produce the number value
   */
  produce(context: IResolveContext): number | undefined;
}

/**
 * Interface for lazy untyped value producers
 */
export interface IAnyValue {
  /**
   * Produce the value
   */
  produce(context: IResolveContext): any;
}

/**
 * Options for creating a lazy string token
 */
export interface LazyStringValueOptions {
  /**
   * Use the given name as a display hint
   *
   * @default - No hint
   */
  readonly displayHint?: string;
}

/**
 * Options for creating a lazy list token
 */
export interface LazyListValueOptions {
  /**
   * Use the given name as a display hint
   *
   * @default - No hint
   */
  readonly displayHint?: string;

  /**
   * If the produced list is empty, return 'undefined' instead
   *
   * @default false
   */
  readonly omitEmpty?: boolean;
}

/**
 * Options for creating lazy untyped tokens
 */
export interface LazyAnyValueOptions {
  /**
   * Use the given name as a display hint
   *
   * @default - No hint
   */
  readonly displayHint?: string;

  /**
   * If the produced value is an array and it is empty, return 'undefined' instead
   *
   * @default false
   */
  readonly omitEmptyArray?: boolean;
}

/**
 * Lazily produce a value
 *
 * Can be used to return a string, list or numeric value whose actual value
 * will only be calculated later, during synthesis.
 */
export class Lazy {
  public static stringValue(producer: IStringValue, options: LazyStringValueOptions = {}) {
    return Token.encodeAsString(new LazyString(producer, options.displayHint));
  }

  public static numberValue(producer: INumberValue) {
    return Token.encodeAsNumber(new LazyNumber(producer));
  }

  public static listValue(producer: IListValue, options: LazyListValueOptions = {}) {
    return Token.encodeAsList(new LazyList(producer, options));
  }

  public static anyValue(producer: IAnyValue, options: LazyAnyValueOptions = {}): any {
    return new LazyAny(producer, options);
  }

  private constructor() {
  }
}

class LazyString extends Token {
  constructor(private readonly producer: IStringValue, displayName?: string) {
    super(displayName);
  }

  public resolve(context: IResolveContext) {
    return this.producer.produce(context);
  }
}

class LazyNumber extends Token {
  constructor(private readonly producer: INumberValue, displayName?: string) {
    super(displayName);
  }

  public resolve(context: IResolveContext) {
    return this.producer.produce(context);
  }
}

class LazyList extends Token {
  constructor(private readonly producer: IListValue, private readonly options: LazyListValueOptions = {}) {
    super(options.displayHint);
  }

  public resolve(context: IResolveContext) {
    const ret = this.producer.produce(context);
    if (ret !== undefined && ret.length === 0 && this.options.omitEmpty) {
      return undefined;
    }
    return ret;
  }
}

class LazyAny extends Token {
  constructor(private readonly producer: IAnyValue, private readonly options: LazyAnyValueOptions = {}) {
    super(options.displayHint);
  }

  public resolve(context: IResolveContext) {
    const ret = this.producer.produce(context);
    if (Array.isArray(ret) && ret.length === 0 && this.options.omitEmptyArray) {
      return undefined;
    }
    return ret;
  }
}