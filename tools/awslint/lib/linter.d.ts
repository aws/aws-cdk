import * as reflect from 'jsii-reflect';
export interface LinterOptions {
    /**
     * List of rules to include.
     * @default all rules
     */
    include?: string[];
    /**
     * List of rules to exclude (takes precedence on "include")
     * @default none
     */
    exclude?: string[];
}
export declare abstract class LinterBase {
    abstract rules: Rule[];
    abstract eval(assembly: reflect.Assembly, options: LinterOptions | undefined): Diagnostic[];
}
export declare class AggregateLinter extends LinterBase {
    private linters;
    constructor(...linters: LinterBase[]);
    get rules(): Rule[];
    eval(assembly: reflect.Assembly, options: LinterOptions | undefined): Diagnostic[];
}
/**
 * Evaluates a bunch of rules against some context.
 */
export declare class Linter<T> extends LinterBase {
    private readonly init;
    private readonly _rules;
    constructor(init: (assembly: reflect.Assembly) => T | T[] | undefined);
    get rules(): ConcreteRule<T>[];
    /**
     * Install another rule.
     */
    add(rule: ConcreteRule<T>): void;
    /**
     * Evaluate all rules against the context.
     */
    eval(assembly: reflect.Assembly, options: LinterOptions | undefined): Diagnostic[];
}
/**
 * Passed in to each rule during evaluation.
 */
export declare class Evaluation<T> {
    readonly ctx: T;
    readonly options: LinterOptions;
    private readonly curr;
    private readonly diagnostics;
    constructor(ctx: T, rule: ConcreteRule<T>, diagnostics: Diagnostic[], options: LinterOptions);
    /**
     * Record a failure if `condition` is not truthy.
     *
     * @param condition The condition to assert.
     * @param scope Used to diagnose the location in the source, and is used in the
     * ignore pattern.
     * @param extra Used to replace %s in the default message format string.
     */
    assert(condition: any, scope: string, extra?: string): condition is true;
    assertEquals(actual: any, expected: any, scope: string): boolean;
    assertTypesEqual(ts: reflect.TypeSystem, actual: TypeSpecifier, expected: TypeSpecifier, scope: string): boolean;
    assertTypesAssignable(ts: reflect.TypeSystem, actual: TypeSpecifier, expected: TypeSpecifier, scope: string): boolean;
    assertParameterOptional(actual: boolean, expected: boolean, scope: string): boolean;
    assertSignature(method: reflect.Callable, expectations: MethodSignatureExpectations): void;
    /**
     * Evaluates whether the rule should be evaluated based on the filters applied.
     */
    private shouldEvaluate;
}
export interface Rule {
    code: string;
    message: string;
    warning?: boolean;
}
export interface ConcreteRule<T> extends Rule {
    eval(linter: Evaluation<T>): void;
}
/**
 * A type constraint
 *
 * Be super flexible about how types can be represented. Ultimately, we will
 * compare what you give to a TypeReference, because that's what's in the JSII
 * Reflect model. However, if you already have a real Type, or just a string to
 * a user-defined type, that's fine too. We'll Do The Right Thing.
 */
export declare type TypeSpecifier = reflect.TypeReference | reflect.Type | string;
export interface MethodSignatureParameterExpectation {
    name?: string;
    type?: TypeSpecifier;
    subtypeAllowed?: boolean;
    /** should this param be optional? */
    optional?: boolean;
}
export interface MethodSignatureExpectations {
    parameters?: MethodSignatureParameterExpectation[];
    returns?: TypeSpecifier;
}
export declare enum DiagnosticLevel {
    Skipped = 0,
    Success = 1,
    Warning = 2,
    Error = 3
}
export interface Diagnostic {
    level: DiagnosticLevel;
    rule: Rule;
    scope: string;
    message: string;
}
