import reflect = require('jsii-reflect');
import { PrimitiveType } from 'jsii-spec';

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

/**
 * Evaluates a bunch of rules against some context.
 */
export class Linter<T> {
  private readonly _rules: { [name: string]: Rule<T> } = { };

  constructor(private readonly init: (assembly: reflect.Assembly) => T | T[] | undefined) {
    return;
  }

  public get rules() {
    return Object.values(this._rules);
  }

  /**
   * Install another rule.
   */
  public add(rule: Rule<T>) {
    if (rule.code in this._rules) {
      throw new Error(`rule "${rule.code}" already exists`);
    }

    this._rules[rule.code] = rule;
  }

  /**
   * Evaluate all rules against the context.
   */
  public eval(assembly: reflect.Assembly, options: LinterOptions | undefined): Array<Diagnostic<T>> {
    options = options || { };

    let ctxs = this.init(assembly);
    if (!ctxs) {
      return []; // skip
    }

    if (!Array.isArray(ctxs)) {
      ctxs = [ ctxs ];
    }

    const results = new Array<Diagnostic<T>>();

    for (const ctx of ctxs) {
      for (const rule of Object.values(this._rules)) {
        const evaluation = new Evaluation(ctx, rule, options);
        rule.eval(evaluation);
        results.push(...evaluation.diagnostics);
      }
    }

    return results;
  }
}

/**
 * Passed in to each rule during evaluation.
 */
export class Evaluation<T> {
  public readonly ctx: T;
  public readonly options: LinterOptions;
  public diagnostics = new Array<Diagnostic<T>>();
  private readonly curr: Rule<T>;

  constructor(ctx: T, rule: Rule<T>, options: LinterOptions) {
    this.ctx = ctx;
    this.options = options;
    this.curr = rule;
  }

  public assert(condition: any, scope: string, extra?: string): condition is true {
    const include = this.shouldEvaluate(this.curr.code, scope);
    const message = this.curr.message + (extra || '');

    let level: DiagnosticLevel;
    if (!include) {
      level = DiagnosticLevel.Skipped;
    } else if (condition) {
      level = DiagnosticLevel.Success;
    } else if (this.curr.warning) {
      level = DiagnosticLevel.Warning;
    } else {
      level = DiagnosticLevel.Error;
    }

    const diag: Diagnostic<T> = {
      level,
      ctx: this.ctx,
      rule: this.curr,
      scope,
      message,
    };

    this.diagnostics.push(diag);

    return condition;
  }

  public assertEquals(actual: any, expected: any, scope: string) {
    return this.assert(actual === expected, scope, ` (expected="${expected}",actual="${actual}")`);
  }

  public assertTypesEqual(ts: reflect.TypeSystem, actual: TypeSpecifier, expected: TypeSpecifier, scope: string) {
    const a = typeReferenceFrom(ts, actual);
    const e = typeReferenceFrom(ts, expected);
    return this.assert(a.toString() === e.toString(), scope, ` (expected="${e}",actual="${a}")`);
  }

  public assertSignature(method: reflect.Method, expectations: MethodSignatureExpectations) {
    const scope = method.parentType.fqn + '.' + method.name;
    if (expectations.returns) {
      this.assertTypesEqual(method.system, method.returns, expectations.returns, scope);
    }

    if (expectations.parameters) {
      const expectedCount = expectations.parameters.length;
      const actualCount = method.parameters.length;
      if (this.assertEquals(actualCount, expectedCount, scope)) {
        for (let i = 0; i < expectations.parameters.length; ++i) {
          const expect = expectations.parameters[i];
          const actual = method.parameters[i];
          const pscope = scope + `.params[${i}]`;
          if (expect.name) {
            const expectedName = expect.name;
            const actualName = actual.name;
            this.assertEquals(actualName, expectedName, pscope);
          }
          if (expect.type) {
            this.assertTypesEqual(method.system, actual.type, expect.type, pscope);
          }
        }
      }
    }
  }

  /**
   * Evaluates whether the rule should be evaluated based on the filters applied.
   */
  private shouldEvaluate(code: string, scope: string) {
    if (!this.options.include || this.options.include.length === 0) {
      return true;
    }

    for (const include of this.options.include) {
      // match include
      if (matchRule(include)) {
        for (const exclude of this.options.exclude || []) {
          // match exclude
          if (matchRule(exclude)) {
            return false;
          }
        }
        return true;
      }
    }

    return false;

    function matchRule(filter: string) {
      if (filter.indexOf(':') === -1) {
        filter += ':*'; // add "*" scope filter if there isn't one
      }

      // filter format is "code:scope" and both support "*" suffix to indicate startsWith
      const [ codeFilter, scopeFilter ] = filter.split(':');
      return matchPattern(code, codeFilter) && matchPattern(scope, scopeFilter);
    }

    function matchPattern(s: string, pattern: string) {
      if (pattern.endsWith('*')) {
        const prefix = pattern.substr(0, pattern.length - 1);
        return s.startsWith(prefix);
      } else {
        return s === pattern;
      }
    }
  }

}

export interface Rule<T> {
  code: string,
  message: string;
  warning?: boolean;
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
export type TypeSpecifier = reflect.TypeReference | reflect.Type | string;

export interface MethodSignatureParameterExpectation {
  name?: string;
  type?: TypeSpecifier;

  /** should this param be optional? */
  optional?: boolean;
}

export interface MethodSignatureExpectations {
  parameters?: MethodSignatureParameterExpectation[];
  returns?: TypeSpecifier;
}

export enum DiagnosticLevel {
  Skipped,
  Success,
  Warning,
  Error,
}

export interface Diagnostic<T> {
  ctx: T;
  level: DiagnosticLevel;
  rule: Rule<T>
  scope: string;
  message: string;
}

/**
 * Convert a type specifier to a TypeReference
 */
function typeReferenceFrom(ts: reflect.TypeSystem, x: TypeSpecifier): reflect.TypeReference {
  if (isTypeReference(x)) { return x; }

  if (typeof x === 'string') {
    if (x.indexOf('.') === -1) {
      return new reflect.TypeReference(ts, { primitive: x as PrimitiveType });
    } else {
      return new reflect.TypeReference(ts, { fqn: x });
    }
  }

  return new reflect.TypeReference(ts, x);
}

function isTypeReference(x: any): x is reflect.TypeReference {
  return x instanceof reflect.TypeReference;
}