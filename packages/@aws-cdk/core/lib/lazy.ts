import { IResolvable, IResolveContext } from "./resolvable";
import { captureStackTrace } from './stack-trace';
import { Token } from "./token";

/**
 * Interface for lazy string producers
 */
export interface IStringProducer {
  /**
   * Produce the string value
   */
  produce(context: IResolveContext): string | undefined;
}

/**
 * Interface for lazy list producers
 */
export interface IListProducer {
  /**
   * Produce the list value
   */
  produce(context: IResolveContext): string[] | undefined;
}

/**
 * Interface for lazy number producers
 */
export interface INumberProducer {
  /**
   * Produce the number value
   */
  produce(context: IResolveContext): number | undefined;
}

/**
 * Interface for lazy untyped value producers
 */
export interface IAnyProducer {
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
  public static stringValue(producer: IStringProducer, options: LazyStringValueOptions = {}) {
    return Token.asString(new LazyString(producer), options);
  }

  public static numberValue(producer: INumberProducer) {
    return Token.asNumber(new LazyNumber(producer));
  }

  public static listValue(producer: IListProducer, options: LazyListValueOptions = {}) {
    return Token.asList(new LazyList(producer, options), options);
  }

  public static anyValue(producer: IAnyProducer, options: LazyAnyValueOptions = {}): IResolvable {
    return new LazyAny(producer, options);
  }

  private constructor() {
  }
}

abstract class LazyBase implements IResolvable {
  public readonly creationStack: string[];

  constructor() {
    this.creationStack = captureStackTrace();
  }

  public abstract resolve(context: IResolveContext): any;
  public toString() {
    return Token.asString(this);
  }

  /**
   * Turn this Token into JSON
   *
   * Called automatically when JSON.stringify() is called on a Token.
   */
  public toJSON(): any {
    return '<unresolved-lazy>';
  }

}

class LazyString extends LazyBase {
  constructor(private readonly producer: IStringProducer) {
    super();
  }

  public resolve(context: IResolveContext) {
    return this.producer.produce(context);
  }
}

class LazyNumber extends LazyBase {
  constructor(private readonly producer: INumberProducer) {
    super();
  }

  public resolve(context: IResolveContext) {
    return this.producer.produce(context);
  }
}

class LazyList extends LazyBase {
  constructor(private readonly producer: IListProducer, private readonly options: LazyListValueOptions = {}) {
    super();
  }

  public resolve(context: IResolveContext) {
    const ret = this.producer.produce(context);
    if (ret !== undefined && ret.length === 0 && this.options.omitEmpty) {
      return undefined;
    }
    return ret;
  }
}

class LazyAny extends LazyBase {
  constructor(private readonly producer: IAnyProducer, private readonly options: LazyAnyValueOptions = {}) {
    super();
  }

  public resolve(context: IResolveContext) {
    const ret = this.producer.produce(context);
    if (Array.isArray(ret) && ret.length === 0 && this.options.omitEmptyArray) {
      return undefined;
    }
    return ret;
  }
}