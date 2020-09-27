import * as util from 'util';
import { PrimitiveType } from '@jsii/spec';
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

export abstract class LinterBase {
  public abstract rules: Rule[];
  public abstract eval(assembly: reflect.Assembly, options: LinterOptions | undefined): Diagnostic[];
}

export class AggregateLinter extends LinterBase {
  private linters: LinterBase[];

  constructor(...linters: LinterBase[]) {
    super();
    this.linters = linters;
  }

  public get rules(): Rule[] {
    const ret = new Array<Rule>();
    for (const linter of this.linters) {
      ret.push(...linter.rules);
    }
    return ret;
  }

  public eval(assembly: reflect.Assembly, options: LinterOptions | undefined): Diagnostic[] {
    const diags = new Array<Diagnostic>();
    for (const linter of this.linters) {
      diags.push(...linter.eval(assembly, options));
    }
    return diags;
  }
}

/**
 * Evaluates a bunch of rules against some context.
 */
export class Linter<T> extends LinterBase {
  private readonly _rules: { [name: string]: ConcreteRule<T> } = { };

  constructor(private readonly init: (assembly: reflect.Assembly) => T | readonly T[] | undefined) {
    super();
  }

  public get rules() {
    return Object.values(this._rules);
  }

  /**
   * Install another rule.
   */
  public add(rule: ConcreteRule<T>) {
    if (rule.code in this._rules) {
      throw new Error(`rule "${rule.code}" already exists`);
    }

    this._rules[rule.code] = rule;
  }

  /**
   * Evaluate all rules against the context.
   */
  public eval(assembly: reflect.Assembly, options: LinterOptions | undefined): Diagnostic[] {
    options = options || { };

    let ctxs = this.init(assembly);
    if (!ctxs) {
      return []; // skip
    }

    if (!Array.isArray(ctxs)) {
      ctxs = [ctxs] as readonly T[];
    }

    const diag = new Array<Diagnostic>();

    for (const ctx of ctxs) {
      for (const rule of Object.values(this._rules)) {
        const evaluation = new Evaluation(ctx, rule, diag, options);
        rule.eval(evaluation);
      }
    }

    return diag;
  }
}

/**
 * Passed in to each rule during evaluation.
 */
export class Evaluation<T> {
  public readonly ctx: T;
  public readonly options: LinterOptions;

  private readonly curr: ConcreteRule<T>;
  private readonly diagnostics: Diagnostic[];

  constructor(ctx: T, rule: ConcreteRule<T>, diagnostics: Diagnostic[], options: LinterOptions) {
    this.ctx = ctx;
    this.options = options;
    this.curr = rule;
    this.diagnostics = diagnostics;
  }

  /**
   * Record a failure if `condition` is not truthy.
   *
   * @param condition The condition to assert.
   * @param scope Used to diagnose the location in the source, and is used in the
   * ignore pattern.
   * @param extra Used to replace %s in the default message format string.
   */
  public assert(condition: any, scope: string, extra?: string): condition is true {
    // deduplicate: skip if this specific assertion ("rule:scope") was already examined
    if (this.diagnostics.find(d => d.rule.code === this.curr.code && d.scope === scope)) {
      return condition;
    }

    const include = this.shouldEvaluate(this.curr.code, scope);
    const message = util.format(this.curr.message, extra || '');

    // Don't add a "Success" diagnostic. It will break if we run a compound
    // linter rule which consists of 3 checks with the same scope (such
    // as for example `assertSignature()`). If the first check fails, we would
    // add a "Success" diagnostic and all other diagnostics would be skipped because
    // of the deduplication check above. Changing the scope makes it worse, since
    // the scope is also the ignore pattern and they're all conceptually the same rule.
    //
    // Simplest solution is to not record successes -- why do we even need them?
    if (include && condition) { return condition; }

    let level: DiagnosticLevel;
    if (!include) {
      level = DiagnosticLevel.Skipped;
    } else if (this.curr.warning) {
      level = DiagnosticLevel.Warning;
    } else {
      level = DiagnosticLevel.Error;
    }

    const diag: Diagnostic = {
      level,
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

  public assertTypesAssignable(ts: reflect.TypeSystem, actual: TypeSpecifier, expected: TypeSpecifier, scope: string) {
    const a = typeReferenceFrom(ts, actual);
    const e = typeReferenceFrom(ts, expected);
    return this.assert(a.toString() === e.toString() || (a.fqn && e.fqn && a.type!.extends(e.type!)), scope, ` ("${a}" not assignable to "${e}")`);
  }

  public assertParameterOptional(actual: boolean, expected: boolean, scope: string) {
    return this.assert(actual === expected, scope, ` (${scope} should be ${expected ? 'optional' : 'mandatory'})`);
  }

  public assertSignature(method: reflect.Callable, expectations: MethodSignatureExpectations) {
    const scope = method.parentType.fqn + '.' + method.name;
    if (expectations.returns && reflect.Method.isMethod(method)) {
      this.assertTypesEqual(method.system, method.returns.type, expectations.returns, scope);
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
            if (expect.subtypeAllowed) {
              this.assertTypesAssignable(method.system, actual.type, expect.type, pscope);
            } else {
              this.assertTypesEqual(method.system, actual.type, expect.type, pscope);
            }
          }
          if (expect.optional !== undefined) {
            this.assertParameterOptional(actual.optional, expect.optional, pscope);
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
      const [codeFilter, scopeFilter] = filter.split(':');
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

export interface Rule {
  code: string,
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
export type TypeSpecifier = reflect.TypeReference | reflect.Type | string;

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

export enum DiagnosticLevel {
  Skipped,
  Success,
  Warning,
  Error,
}

export interface Diagnostic {
  level: DiagnosticLevel;
  rule: Rule;
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
