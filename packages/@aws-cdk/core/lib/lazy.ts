import { CDK_DEBUG, debugModeEnabled } from './debug';
import { IResolvable, IResolveContext } from './resolvable';
import { captureStackTrace } from './stack-trace';
import { Token } from './token';

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
 * Interface for (stable) lazy string producers
 */
export interface IStableStringProducer {
  /**
   * Produce the string value
   */
  produce(): string | undefined;
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
 * Interface for (stable) lazy list producers
 */
export interface IStableListProducer {
  /**
   * Produce the list value
   */
  produce(): string[] | undefined;
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
 * Interface for (stable) lazy number producers
 */
export interface IStableNumberProducer {
  /**
   * Produce the number value
   */
  produce(): number | undefined;
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
 * Interface for (stable) lazy untyped value producers
 */
export interface IStableAnyProducer {
  /**
   * Produce the value
   */
  produce(): any;
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
  /**
   * Defer the calculation of a string value to synthesis time
   *
   * Use this if you want to render a string to a template whose actual value depends on
   * some state mutation that may happen after the construct has been created.
   *
   * If you are simply looking to force a value to a `string` type and don't need
   * the calculation to be deferred, use `Token.asString()` instead.
   *
   * @deprecated Use `Lazy.string()` or `Lazy.uncachedString()` instead.
   */
  public static stringValue(producer: IStringProducer, options: LazyStringValueOptions = {}) {
    return Token.asString(new LazyString(producer, false), options);
  }

  /**
   * Defer the one-time calculation of a string value to synthesis time
   *
   * Use this if you want to render a string to a template whose actual value depends on
   * some state mutation that may happen after the construct has been created.
   *
   * If you are simply looking to force a value to a `string` type and don't need
   * the calculation to be deferred, use `Token.asString()` instead.
   *
   * The inner function will only be invoked one time and cannot depend on
   * resolution context.
   */
  public static string(producer: IStableStringProducer, options: LazyStringValueOptions = {}) {
    return Token.asString(new LazyString(producer, true), options);
  }

  /**
   * Defer the calculation of a string value to synthesis time
   *
   * Use if this function is not recommended; unless you know you need it for sure, you
   * probably don't. Use `Lazy.string()` instead.
   *
   * The inner function may be invoked multiple times during synthesis. You should
   * only use this function if the calculated value may change during the 'prepare'
   * phase of synthesis.
   */
  public static uncachedString(producer: IStringProducer, options: LazyStringValueOptions = {}) {
    return Token.asString(new LazyString(producer, false), options);
  }

  /**
   * Defer the one-time calculation of a number value to synthesis time
   *
   * Use this if you want to render a number to a template whose actual value depends on
   * some state mutation that may happen after the construct has been created.
   *
   * If you are simply looking to force a value to a `number` type and don't need
   * the calculation to be deferred, use `Token.asNumber()` instead.
   *
   * @deprecated Use `Lazy.number()` or `Lazy.uncachedNumber()` instead.
   */
  public static numberValue(producer: INumberProducer) {
    return Token.asNumber(new LazyNumber(producer, false));
  }

  /**
   * Defer the one-time calculation of a number value to synthesis time
   *
   * Use this if you want to render a number to a template whose actual value depends on
   * some state mutation that may happen after the construct has been created.
   *
   * If you are simply looking to force a value to a `number` type and don't need
   * the calculation to be deferred, use `Token.asNumber()` instead.
   *
   * The inner function will only be invoked one time and cannot depend on
   * resolution context.
   */
  public static number(producer: IStableNumberProducer) {
    return Token.asNumber(new LazyNumber(producer, true));
  }

  /**
   * Defer the calculation of a number value to synthesis time
   *
   * Use if this function is not recommended; unless you know you need it for sure, you
   * probably don't. Use `Lazy.number()` instead.
   *
   * The inner function may be invoked multiple times during synthesis. You should
   * only use this function if the calculated value may change during the 'prepare'
   * phase of synthesis.
   */
  public static uncachedNumber(producer: INumberProducer) {
    return Token.asNumber(new LazyNumber(producer, false));
  }

  /**
   * Defer the one-time calculation of a list value to synthesis time
   *
   * Use this if you want to render a list to a template whose actual value depends on
   * some state mutation that may happen after the construct has been created.
   *
   * If you are simply looking to force a value to a `string[]` type and don't need
   * the calculation to be deferred, use `Token.asList()` instead.
   *
   * @deprecated Use `Lazy.list()` or `Lazy.uncachedList()` instead.
   */
  public static listValue(producer: IListProducer, options: LazyListValueOptions = {}) {
    return Token.asList(new LazyList(producer, false, options), options);
  }

  /**
   * Defer the calculation of a list value to synthesis time
   *
   * Use if this function is not recommended; unless you know you need it for sure, you
   * probably don't. Use `Lazy.list()` instead.
   *
   * The inner function may be invoked multiple times during synthesis. You should
   * only use this function if the calculated value may change during the 'prepare'
   * phase of synthesis.
   */
  public static uncachedList(producer: IListProducer, options: LazyListValueOptions = {}) {
    return Token.asList(new LazyList(producer, false, options), options);
  }

  /**
   * Defer the one-time calculation of a list value to synthesis time
   *
   * Use this if you want to render a list to a template whose actual value depends on
   * some state mutation that may happen after the construct has been created.
   *
   * If you are simply looking to force a value to a `string[]` type and don't need
   * the calculation to be deferred, use `Token.asList()` instead.
   *
   * The inner function will only be invoked one time and cannot depend on
   * resolution context.
   */
  public static list(producer: IStableListProducer, options: LazyListValueOptions = {}) {
    return Token.asList(new LazyList(producer, true, options), options);
  }

  /**
   * Defer the one-time calculation of an arbitrarily typed value to synthesis time
   *
   * Use this if you want to render an object to a template whose actual value depends on
   * some state mutation that may happen after the construct has been created.
   *
   * @deprecated Use `Lazy.any()` or `Lazy.uncachedAny()` instead.
   */
  public static anyValue(producer: IAnyProducer, options: LazyAnyValueOptions = {}): IResolvable {
    return new LazyAny(producer, false, options);
  }

  /**
   * Defer the one-time calculation of an arbitrarily typed value to synthesis time
   *
   * Use this if you want to render an object to a template whose actual value depends on
   * some state mutation that may happen after the construct has been created.
   *
   * The inner function will only be invoked one time and cannot depend on
   * resolution context.
   */
  public static any(producer: IStableAnyProducer, options: LazyAnyValueOptions = {}): IResolvable {
    return new LazyAny(producer, true, options);
  }

  /**
   * Defer the calculation of an untyped value to synthesis time
   *
   * Use if this function is not recommended; unless you know you need it for sure, you
   * probably don't. Use `Lazy.any()` instead.
   *
   * The inner function may be invoked multiple times during synthesis. You should
   * only use this function if the calculated value may change during the 'prepare'
   * phase of synthesis.
   */
  public static uncachedAny(producer: IAnyProducer, options: LazyAnyValueOptions = {}): IResolvable {
    return new LazyAny(producer, false, options);
  }

  private constructor() {
  }
}

abstract class LazyBase<A> implements IResolvable {
  public readonly creationStack: string[];
  protected _cached?: A;

  constructor() {
    // Stack trace capture is conditionned to `debugModeEnabled()`, because
    // lazies can be created in a fairly thrashy way, and the stack traces are
    // large and slow to obtain; but are mostly useful only when debugging a
    // resolution issue.
    this.creationStack = debugModeEnabled()
      ? captureStackTrace(this.constructor)
      : [`Execute again with ${CDK_DEBUG}=true to capture stack traces`];
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

class LazyString extends LazyBase<string> {

  constructor(private readonly producer: IStringProducer, private readonly cache: boolean) {
    super();
  }

  public resolve(context: IResolveContext) {
    if (this.cache) {
      return this._cached ?? (this._cached = this.producer.produce(context));
    } else {
      return this.producer.produce(context);
    }
  }
}

class LazyNumber extends LazyBase<number> {
  constructor(private readonly producer: INumberProducer, private readonly cache: boolean) {
    super();
  }

  public resolve(context: IResolveContext) {
    if (this.cache) {
      return this._cached ?? (this._cached = this.producer.produce(context));
    } else {
      return this.producer.produce(context);
    }
  }
}

class LazyList extends LazyBase<Array<string>> {
  constructor(private readonly producer: IListProducer, private readonly cache: boolean, private readonly options: LazyListValueOptions = {}) {
    super();
  }

  public resolve(context: IResolveContext) {
    if (!this.cache || this._cached === undefined) {
      this._cached = this.producer.produce(context);
    }

    if (this._cached !== undefined && this._cached.length === 0 && this.options.omitEmpty) {
      return undefined;
    }
    return this._cached;
  }
}

class LazyAny extends LazyBase<any> {
  constructor(private readonly producer: IAnyProducer, private readonly cache: boolean, private readonly options: LazyAnyValueOptions = {}) {
    super();
  }

  public resolve(context: IResolveContext) {
    if (!this.cache || this._cached === undefined) {
      this._cached = this.producer.produce(context);
    }

    if (Array.isArray(this._cached) && this._cached.length === 0 && this.options.omitEmptyArray) {
      return undefined;
    }
    return this._cached;
  }
}
