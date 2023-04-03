import { IResolvable, IResolveContext } from './resolvable';
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
export declare class Lazy {
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
    static stringValue(producer: IStringProducer, options?: LazyStringValueOptions): string;
    /**
     * Defer the one-time calculation of a string value to synthesis time
     *
     * Use this if you want to render a string to a template whose actual value depends on
     * some state mutation that may happen after the construct has been created.
     *
     * If you are simply looking to force a value to a `string` type and don't need
     * the calculation to be deferred, use `Token.asString()` instead.
     *
     * The inner function will only be invoked once, and the resolved value
     * cannot depend on the Stack the Token is used in.
     */
    static string(producer: IStableStringProducer, options?: LazyStringValueOptions): string;
    /**
     * Defer the calculation of a string value to synthesis time
     *
     * Use of this function is not recommended; unless you know you need it for sure, you
     * probably don't. Use `Lazy.string()` instead.
     *
     * The inner function may be invoked multiple times during synthesis. You
     * should only use this method if the returned value depends on variables
     * that may change during the Aspect application phase of synthesis, or if
     * the value depends on the Stack the value is being used in. Both of these
     * cases are rare, and only ever occur for AWS Construct Library authors.
     */
    static uncachedString(producer: IStringProducer, options?: LazyStringValueOptions): string;
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
    static numberValue(producer: INumberProducer): number;
    /**
     * Defer the one-time calculation of a number value to synthesis time
     *
     * Use this if you want to render a number to a template whose actual value depends on
     * some state mutation that may happen after the construct has been created.
     *
     * If you are simply looking to force a value to a `number` type and don't need
     * the calculation to be deferred, use `Token.asNumber()` instead.
     *
     * The inner function will only be invoked once, and the resolved value
     * cannot depend on the Stack the Token is used in.
     */
    static number(producer: IStableNumberProducer): number;
    /**
     * Defer the calculation of a number value to synthesis time
     *
     * Use of this function is not recommended; unless you know you need it for sure, you
     * probably don't. Use `Lazy.number()` instead.
     *
     * The inner function may be invoked multiple times during synthesis. You
     * should only use this method if the returned value depends on variables
     * that may change during the Aspect application phase of synthesis, or if
     * the value depends on the Stack the value is being used in. Both of these
     * cases are rare, and only ever occur for AWS Construct Library authors.
     */
    static uncachedNumber(producer: INumberProducer): number;
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
    static listValue(producer: IListProducer, options?: LazyListValueOptions): string[];
    /**
     * Defer the calculation of a list value to synthesis time
     *
     * Use of this function is not recommended; unless you know you need it for sure, you
     * probably don't. Use `Lazy.list()` instead.
     *
     * The inner function may be invoked multiple times during synthesis. You
     * should only use this method if the returned value depends on variables
     * that may change during the Aspect application phase of synthesis, or if
     * the value depends on the Stack the value is being used in. Both of these
     * cases are rare, and only ever occur for AWS Construct Library authors.
     */
    static uncachedList(producer: IListProducer, options?: LazyListValueOptions): string[];
    /**
     * Defer the one-time calculation of a list value to synthesis time
     *
     * Use this if you want to render a list to a template whose actual value depends on
     * some state mutation that may happen after the construct has been created.
     *
     * If you are simply looking to force a value to a `string[]` type and don't need
     * the calculation to be deferred, use `Token.asList()` instead.
     *
     * The inner function will only be invoked once, and the resolved value
     * cannot depend on the Stack the Token is used in.
     */
    static list(producer: IStableListProducer, options?: LazyListValueOptions): string[];
    /**
     * Defer the one-time calculation of an arbitrarily typed value to synthesis time
     *
     * Use this if you want to render an object to a template whose actual value depends on
     * some state mutation that may happen after the construct has been created.
     *
     * @deprecated Use `Lazy.any()` or `Lazy.uncachedAny()` instead.
     */
    static anyValue(producer: IAnyProducer, options?: LazyAnyValueOptions): IResolvable;
    /**
     * Defer the one-time calculation of an arbitrarily typed value to synthesis time
     *
     * Use this if you want to render an object to a template whose actual value depends on
     * some state mutation that may happen after the construct has been created.
     *
     * The inner function will only be invoked one time and cannot depend on
     * resolution context.
     */
    static any(producer: IStableAnyProducer, options?: LazyAnyValueOptions): IResolvable;
    /**
     * Defer the calculation of an untyped value to synthesis time
     *
     * Use of this function is not recommended; unless you know you need it for sure, you
     * probably don't. Use `Lazy.any()` instead.
     *
     * The inner function may be invoked multiple times during synthesis. You
     * should only use this method if the returned value depends on variables
     * that may change during the Aspect application phase of synthesis, or if
     * the value depends on the Stack the value is being used in. Both of these
     * cases are rare, and only ever occur for AWS Construct Library authors.
     */
    static uncachedAny(producer: IAnyProducer, options?: LazyAnyValueOptions): IResolvable;
    private constructor();
}
