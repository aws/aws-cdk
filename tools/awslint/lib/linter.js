"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reflect = require("jsii-reflect");
const util = require("util");
class LinterBase {
}
exports.LinterBase = LinterBase;
class AggregateLinter extends LinterBase {
    constructor(...linters) {
        super();
        this.linters = linters;
    }
    get rules() {
        const ret = new Array();
        for (const linter of this.linters) {
            ret.push(...linter.rules);
        }
        return ret;
    }
    eval(assembly, options) {
        const diags = new Array();
        for (const linter of this.linters) {
            diags.push(...linter.eval(assembly, options));
        }
        return diags;
    }
}
exports.AggregateLinter = AggregateLinter;
/**
 * Evaluates a bunch of rules against some context.
 */
class Linter extends LinterBase {
    constructor(init) {
        super();
        this.init = init;
        this._rules = {};
    }
    get rules() {
        return Object.values(this._rules);
    }
    /**
     * Install another rule.
     */
    add(rule) {
        if (rule.code in this._rules) {
            throw new Error(`rule "${rule.code}" already exists`);
        }
        this._rules[rule.code] = rule;
    }
    /**
     * Evaluate all rules against the context.
     */
    eval(assembly, options) {
        options = options || {};
        let ctxs = this.init(assembly);
        if (!ctxs) {
            return []; // skip
        }
        if (!Array.isArray(ctxs)) {
            ctxs = [ctxs];
        }
        const diag = new Array();
        for (const ctx of ctxs) {
            for (const rule of Object.values(this._rules)) {
                const evaluation = new Evaluation(ctx, rule, diag, options);
                rule.eval(evaluation);
            }
        }
        return diag;
    }
}
exports.Linter = Linter;
/**
 * Passed in to each rule during evaluation.
 */
class Evaluation {
    constructor(ctx, rule, diagnostics, options) {
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
    assert(condition, scope, extra) {
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
        if (include && condition) {
            return condition;
        }
        let level;
        if (!include) {
            level = DiagnosticLevel.Skipped;
        }
        else if (this.curr.warning) {
            level = DiagnosticLevel.Warning;
        }
        else {
            level = DiagnosticLevel.Error;
        }
        const diag = {
            level,
            rule: this.curr,
            scope,
            message,
        };
        this.diagnostics.push(diag);
        return condition;
    }
    assertEquals(actual, expected, scope) {
        return this.assert(actual === expected, scope, ` (expected="${expected}",actual="${actual}")`);
    }
    assertTypesEqual(ts, actual, expected, scope) {
        const a = typeReferenceFrom(ts, actual);
        const e = typeReferenceFrom(ts, expected);
        return this.assert(a.toString() === e.toString(), scope, ` (expected="${e}",actual="${a}")`);
    }
    assertTypesAssignable(ts, actual, expected, scope) {
        const a = typeReferenceFrom(ts, actual);
        const e = typeReferenceFrom(ts, expected);
        return this.assert(a.toString() === e.toString() || (a.fqn && e.fqn && a.type.extends(e.type)), scope, ` ("${a}" not assignable to "${e}")`);
    }
    assertParameterOptional(actual, expected, scope) {
        return this.assert(actual === expected, scope, ` (${scope} should be ${expected ? 'optional' : 'mandatory'})`);
    }
    assertSignature(method, expectations) {
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
                        }
                        else {
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
    shouldEvaluate(code, scope) {
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
        function matchRule(filter) {
            if (filter.indexOf(':') === -1) {
                filter += ':*'; // add "*" scope filter if there isn't one
            }
            // filter format is "code:scope" and both support "*" suffix to indicate startsWith
            const [codeFilter, scopeFilter] = filter.split(':');
            return matchPattern(code, codeFilter) && matchPattern(scope, scopeFilter);
        }
        function matchPattern(s, pattern) {
            if (pattern.endsWith('*')) {
                const prefix = pattern.substr(0, pattern.length - 1);
                return s.startsWith(prefix);
            }
            else {
                return s === pattern;
            }
        }
    }
}
exports.Evaluation = Evaluation;
var DiagnosticLevel;
(function (DiagnosticLevel) {
    DiagnosticLevel[DiagnosticLevel["Skipped"] = 0] = "Skipped";
    DiagnosticLevel[DiagnosticLevel["Success"] = 1] = "Success";
    DiagnosticLevel[DiagnosticLevel["Warning"] = 2] = "Warning";
    DiagnosticLevel[DiagnosticLevel["Error"] = 3] = "Error";
})(DiagnosticLevel = exports.DiagnosticLevel || (exports.DiagnosticLevel = {}));
/**
 * Convert a type specifier to a TypeReference
 */
function typeReferenceFrom(ts, x) {
    if (isTypeReference(x)) {
        return x;
    }
    if (typeof x === 'string') {
        if (x.indexOf('.') === -1) {
            return new reflect.TypeReference(ts, { primitive: x });
        }
        else {
            return new reflect.TypeReference(ts, { fqn: x });
        }
    }
    return new reflect.TypeReference(ts, x);
}
function isTypeReference(x) {
    return x instanceof reflect.TypeReference;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGludGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGludGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsd0NBQXdDO0FBRXhDLDZCQUE2QjtBQWdCN0IsTUFBc0IsVUFBVTtDQUcvQjtBQUhELGdDQUdDO0FBRUQsTUFBYSxlQUFnQixTQUFRLFVBQVU7SUFHN0MsWUFBWSxHQUFHLE9BQXFCO1FBQ2xDLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDekIsQ0FBQztJQUVELElBQVcsS0FBSztRQUNkLE1BQU0sR0FBRyxHQUFHLElBQUksS0FBSyxFQUFRLENBQUM7UUFDOUIsS0FBSyxNQUFNLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2pDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDM0I7UUFDRCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFFTSxJQUFJLENBQUMsUUFBMEIsRUFBRSxPQUFrQztRQUN4RSxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssRUFBYyxDQUFDO1FBQ3RDLEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNqQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztTQUMvQztRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztDQUNGO0FBdkJELDBDQXVCQztBQUVEOztHQUVHO0FBQ0gsTUFBYSxNQUFVLFNBQVEsVUFBVTtJQUd2QyxZQUE2QixJQUF5RDtRQUNwRixLQUFLLEVBQUUsQ0FBQztRQURtQixTQUFJLEdBQUosSUFBSSxDQUFxRDtRQUZyRSxXQUFNLEdBQXdDLEVBQUcsQ0FBQztJQUluRSxDQUFDO0lBRUQsSUFBVyxLQUFLO1FBQ2QsT0FBTyxNQUFNLENBQUMsTUFBTSxD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QWEsQ0FBQztBQUM1QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcmVmbGVjdCBmcm9tICdqc2lpLXJlZmxlY3QnO1xuaW1wb3J0IHsgUHJpbWl0aXZlVHlwZSB9IGZyb20gJ0Bqc2lpL3NwZWMnO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICd1dGlsJztcblxuZXhwb3J0IGludGVyZmFjZSBMaW50ZXJPcHRpb25zIHtcbiAgLyoqXG4gICAqIExpc3Qgb2YgcnVsZXMgdG8gaW5jbHVkZS5cbiAgICogQGRlZmF1bHQgYWxsIHJ1bGVzXG4gICAqL1xuICBpbmNsdWRlPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIExpc3Qgb2YgcnVsZXMgdG8gZXhjbHVkZSAodGFrZXMgcHJlY2VkZW5jZSBvbiBcImluY2x1ZGVcIilcbiAgICogQGRlZmF1bHQgbm9uZVxuICAgKi9cbiAgZXhjbHVkZT86IHN0cmluZ1tdO1xufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTGludGVyQmFzZSB7XG4gIHB1YmxpYyBhYnN0cmFjdCBydWxlczogUnVsZVtdO1xuICBwdWJsaWMgYWJzdHJhY3QgZXZhbChhc3NlbWJseTogcmVmbGVjdC5Bc3NlbWJseSwgb3B0aW9uczogTGludGVyT3B0aW9ucyB8IHVuZGVmaW5lZCk6IERpYWdub3N0aWNbXTtcbn1cblxuZXhwb3J0IGNsYXNzIEFnZ3JlZ2F0ZUxpbnRlciBleHRlbmRzIExpbnRlckJhc2Uge1xuICBwcml2YXRlIGxpbnRlcnM6IExpbnRlckJhc2VbXTtcblxuICBjb25zdHJ1Y3RvciguLi5saW50ZXJzOiBMaW50ZXJCYXNlW10pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMubGludGVycyA9IGxpbnRlcnM7XG4gIH1cblxuICBwdWJsaWMgZ2V0IHJ1bGVzKCk6IFJ1bGVbXSB7XG4gICAgY29uc3QgcmV0ID0gbmV3IEFycmF5PFJ1bGU+KCk7XG4gICAgZm9yIChjb25zdCBsaW50ZXIgb2YgdGhpcy5saW50ZXJzKSB7XG4gICAgICByZXQucHVzaCguLi5saW50ZXIucnVsZXMpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgcHVibGljIGV2YWwoYXNzZW1ibHk6IHJlZmxlY3QuQXNzZW1ibHksIG9wdGlvbnM6IExpbnRlck9wdGlvbnMgfCB1bmRlZmluZWQpOiBEaWFnbm9zdGljW10ge1xuICAgIGNvbnN0IGRpYWdzID0gbmV3IEFycmF5PERpYWdub3N0aWM+KCk7XG4gICAgZm9yIChjb25zdCBsaW50ZXIgb2YgdGhpcy5saW50ZXJzKSB7XG4gICAgICBkaWFncy5wdXNoKC4uLmxpbnRlci5ldmFsKGFzc2VtYmx5LCBvcHRpb25zKSk7XG4gICAgfVxuICAgIHJldHVybiBkaWFncztcbiAgfVxufVxuXG4vKipcbiAqIEV2YWx1YXRlcyBhIGJ1bmNoIG9mIHJ1bGVzIGFnYWluc3Qgc29tZSBjb250ZXh0LlxuICovXG5leHBvcnQgY2xhc3MgTGludGVyPFQ+IGV4dGVuZHMgTGludGVyQmFzZSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgX3J1bGVzOiB7IFtuYW1lOiBzdHJpbmddOiBDb25jcmV0ZVJ1bGU8VD4gfSA9IHsgfTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGluaXQ6IChhc3NlbWJseTogcmVmbGVjdC5Bc3NlbWJseSkgPT4gVCB8IFRbXSB8IHVuZGVmaW5lZCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0IHJ1bGVzKCkge1xuICAgIHJldHVybiBPYmplY3QudmFsdWVzKHRoaXMuX3J1bGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnN0YWxsIGFub3RoZXIgcnVsZS5cbiAgICovXG4gIHB1YmxpYyBhZGQocnVsZTogQ29uY3JldGVSdWxlPFQ+KSB7XG4gICAgaWYgKHJ1bGUuY29kZSBpbiB0aGlzLl9ydWxlcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBydWxlIFwiJHtydWxlLmNvZGV9XCIgYWxyZWFkeSBleGlzdHNgKTtcbiAgICB9XG5cbiAgICB0aGlzLl9ydWxlc1tydWxlLmNvZGVdID0gcnVsZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFdmFsdWF0ZSBhbGwgcnVsZXMgYWdhaW5zdCB0aGUgY29udGV4dC5cbiAgICovXG4gIHB1YmxpYyBldmFsKGFzc2VtYmx5OiByZWZsZWN0LkFzc2VtYmx5LCBvcHRpb25zOiBMaW50ZXJPcHRpb25zIHwgdW5kZWZpbmVkKTogRGlhZ25vc3RpY1tdIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7IH07XG5cbiAgICBsZXQgY3R4cyA9IHRoaXMuaW5pdChhc3NlbWJseSk7XG4gICAgaWYgKCFjdHhzKSB7XG4gICAgICByZXR1cm4gW107IC8vIHNraXBcbiAgICB9XG5cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoY3R4cykpIHtcbiAgICAgIGN0eHMgPSBbIGN0eHMgXTtcbiAgICB9XG5cbiAgICBjb25zdCBkaWFnID0gbmV3IEFycmF5PERpYWdub3N0aWM+KCk7XG5cbiAgICBmb3IgKGNvbnN0IGN0eCBvZiBjdHhzKSB7XG4gICAgICBmb3IgKGNvbnN0IHJ1bGUgb2YgT2JqZWN0LnZhbHVlcyh0aGlzLl9ydWxlcykpIHtcbiAgICAgICAgY29uc3QgZXZhbHVhdGlvbiA9IG5ldyBFdmFsdWF0aW9uKGN0eCwgcnVsZSwgZGlhZywgb3B0aW9ucyk7XG4gICAgICAgIHJ1bGUuZXZhbChldmFsdWF0aW9uKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGlhZztcbiAgfVxufVxuXG4vKipcbiAqIFBhc3NlZCBpbiB0byBlYWNoIHJ1bGUgZHVyaW5nIGV2YWx1YXRpb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBFdmFsdWF0aW9uPFQ+IHtcbiAgcHVibGljIHJlYWRvbmx5IGN0eDogVDtcbiAgcHVibGljIHJlYWRvbmx5IG9wdGlvbnM6IExpbnRlck9wdGlvbnM7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBjdXJyOiBDb25jcmV0ZVJ1bGU8VD47XG4gIHByaXZhdGUgcmVhZG9ubHkgZGlhZ25vc3RpY3M6IERpYWdub3N0aWNbXTtcblxuICBjb25zdHJ1Y3RvcihjdHg6IFQsIHJ1bGU6IENvbmNyZXRlUnVsZTxUPiwgZGlhZ25vc3RpY3M6IERpYWdub3N0aWNbXSwgb3B0aW9uczogTGludGVyT3B0aW9ucykge1xuICAgIHRoaXMuY3R4ID0gY3R4O1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy5jdXJyID0gcnVsZTtcbiAgICB0aGlzLmRpYWdub3N0aWNzID0gZGlhZ25vc3RpY3M7XG4gIH1cblxuICAvKipcbiAgICogUmVjb3JkIGEgZmFpbHVyZSBpZiBgY29uZGl0aW9uYCBpcyBub3QgdHJ1dGh5LlxuICAgKlxuICAgKiBAcGFyYW0gY29uZGl0aW9uIFRoZSBjb25kaXRpb24gdG8gYXNzZXJ0LlxuICAgKiBAcGFyYW0gc2NvcGUgVXNlZCB0byBkaWFnbm9zZSB0aGUgbG9jYXRpb24gaW4gdGhlIHNvdXJjZSwgYW5kIGlzIHVzZWQgaW4gdGhlXG4gICAqIGlnbm9yZSBwYXR0ZXJuLlxuICAgKiBAcGFyYW0gZXh0cmEgVXNlZCB0byByZXBsYWNlICVzIGluIHRoZSBkZWZhdWx0IG1lc3NhZ2UgZm9ybWF0IHN0cmluZy5cbiAgICovXG4gIHB1YmxpYyBhc3NlcnQoY29uZGl0aW9uOiBhbnksIHNjb3BlOiBzdHJpbmcsIGV4dHJhPzogc3RyaW5nKTogY29uZGl0aW9uIGlzIHRydWUge1xuICAgIC8vIGRlZHVwbGljYXRlOiBza2lwIGlmIHRoaXMgc3BlY2lmaWMgYXNzZXJ0aW9uIChcInJ1bGU6c2NvcGVcIikgd2FzIGFscmVhZHkgZXhhbWluZWRcbiAgICBpZiAodGhpcy5kaWFnbm9zdGljcy5maW5kKGQgPT4gZC5ydWxlLmNvZGUgPT09IHRoaXMuY3Vyci5jb2RlICYmIGQuc2NvcGUgPT09IHNjb3BlKSkge1xuICAgICAgcmV0dXJuIGNvbmRpdGlvbjtcbiAgICB9XG5cbiAgICBjb25zdCBpbmNsdWRlID0gdGhpcy5zaG91bGRFdmFsdWF0ZSh0aGlzLmN1cnIuY29kZSwgc2NvcGUpO1xuICAgIGNvbnN0IG1lc3NhZ2UgPSB1dGlsLmZvcm1hdCh0aGlzLmN1cnIubWVzc2FnZSwgZXh0cmEgfHwgJycpO1xuXG4gICAgLy8gRG9uJ3QgYWRkIGEgXCJTdWNjZXNzXCIgZGlhZ25vc3RpYy4gSXQgd2lsbCBicmVhayBpZiB3ZSBydW4gYSBjb21wb3VuZFxuICAgIC8vIGxpbnRlciBydWxlIHdoaWNoIGNvbnNpc3RzIG9mIDMgY2hlY2tzIHdpdGggdGhlIHNhbWUgc2NvcGUgKHN1Y2hcbiAgICAvLyBhcyBmb3IgZXhhbXBsZSBgYXNzZXJ0U2lnbmF0dXJlKClgKS4gSWYgdGhlIGZpcnN0IGNoZWNrIGZhaWxzLCB3ZSB3b3VsZFxuICAgIC8vIGFkZCBhIFwiU3VjY2Vzc1wiIGRpYWdub3N0aWMgYW5kIGFsbCBvdGhlciBkaWFnbm9zdGljcyB3b3VsZCBiZSBza2lwcGVkIGJlY2F1c2VcbiAgICAvLyBvZiB0aGUgZGVkdXBsaWNhdGlvbiBjaGVjayBhYm92ZS4gQ2hhbmdpbmcgdGhlIHNjb3BlIG1ha2VzIGl0IHdvcnNlLCBzaW5jZVxuICAgIC8vIHRoZSBzY29wZSBpcyBhbHNvIHRoZSBpZ25vcmUgcGF0dGVybiBhbmQgdGhleSdyZSBhbGwgY29uY2VwdHVhbGx5IHRoZSBzYW1lIHJ1bGUuXG4gICAgLy9cbiAgICAvLyBTaW1wbGVzdCBzb2x1dGlvbiBpcyB0byBub3QgcmVjb3JkIHN1Y2Nlc3NlcyAtLSB3aHkgZG8gd2UgZXZlbiBuZWVkIHRoZW0/XG4gICAgaWYgKGluY2x1ZGUgJiYgY29uZGl0aW9uKSB7IHJldHVybiBjb25kaXRpb247IH1cblxuICAgIGxldCBsZXZlbDogRGlhZ25vc3RpY0xldmVsO1xuICAgIGlmICghaW5jbHVkZSkge1xuICAgICAgbGV2ZWwgPSBEaWFnbm9zdGljTGV2ZWwuU2tpcHBlZDtcbiAgICB9IGVsc2UgaWYgKHRoaXMuY3Vyci53YXJuaW5nKSB7XG4gICAgICBsZXZlbCA9IERpYWdub3N0aWNMZXZlbC5XYXJuaW5nO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXZlbCA9IERpYWdub3N0aWNMZXZlbC5FcnJvcjtcbiAgICB9XG5cbiAgICBjb25zdCBkaWFnOiBEaWFnbm9zdGljID0ge1xuICAgICAgbGV2ZWwsXG4gICAgICBydWxlOiB0aGlzLmN1cnIsXG4gICAgICBzY29wZSxcbiAgICAgIG1lc3NhZ2UsXG4gICAgfTtcblxuICAgIHRoaXMuZGlhZ25vc3RpY3MucHVzaChkaWFnKTtcblxuICAgIHJldHVybiBjb25kaXRpb247XG4gIH1cblxuICBwdWJsaWMgYXNzZXJ0RXF1YWxzKGFjdHVhbDogYW55LCBleHBlY3RlZDogYW55LCBzY29wZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuYXNzZXJ0KGFjdHVhbCA9PT0gZXhwZWN0ZWQsIHNjb3BlLCBgIChleHBlY3RlZD1cIiR7ZXhwZWN0ZWR9XCIsYWN0dWFsPVwiJHthY3R1YWx9XCIpYCk7XG4gIH1cblxuICBwdWJsaWMgYXNzZXJ0VHlwZXNFcXVhbCh0czogcmVmbGVjdC5UeXBlU3lzdGVtLCBhY3R1YWw6IFR5cGVTcGVjaWZpZXIsIGV4cGVjdGVkOiBUeXBlU3BlY2lmaWVyLCBzY29wZTogc3RyaW5nKSB7XG4gICAgY29uc3QgYSA9IHR5cGVSZWZlcmVuY2VGcm9tKHRzLCBhY3R1YWwpO1xuICAgIGNvbnN0IGUgPSB0eXBlUmVmZXJlbmNlRnJvbSh0cywgZXhwZWN0ZWQpO1xuICAgIHJldHVybiB0aGlzLmFzc2VydChhLnRvU3RyaW5nKCkgPT09IGUudG9TdHJpbmcoKSwgc2NvcGUsIGAgKGV4cGVjdGVkPVwiJHtlfVwiLGFjdHVhbD1cIiR7YX1cIilgKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlcnRUeXBlc0Fzc2lnbmFibGUodHM6IHJlZmxlY3QuVHlwZVN5c3RlbSwgYWN0dWFsOiBUeXBlU3BlY2lmaWVyLCBleHBlY3RlZDogVHlwZVNwZWNpZmllciwgc2NvcGU6IHN0cmluZykge1xuICAgIGNvbnN0IGEgPSB0eXBlUmVmZXJlbmNlRnJvbSh0cywgYWN0dWFsKTtcbiAgICBjb25zdCBlID0gdHlwZVJlZmVyZW5jZUZyb20odHMsIGV4cGVjdGVkKTtcbiAgICByZXR1cm4gdGhpcy5hc3NlcnQoYS50b1N0cmluZygpID09PSBlLnRvU3RyaW5nKCkgfHwgKGEuZnFuICYmIGUuZnFuICYmIGEudHlwZSEuZXh0ZW5kcyhlLnR5cGUhKSksIHNjb3BlLCBgIChcIiR7YX1cIiBub3QgYXNzaWduYWJsZSB0byBcIiR7ZX1cIilgKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlcnRQYXJhbWV0ZXJPcHRpb25hbChhY3R1YWw6IGJvb2xlYW4sIGV4cGVjdGVkOiBib29sZWFuLCBzY29wZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuYXNzZXJ0KGFjdHVhbCA9PT0gZXhwZWN0ZWQsIHNjb3BlLCBgICgke3Njb3BlfSBzaG91bGQgYmUgJHtleHBlY3RlZCA/ICdvcHRpb25hbCcgOiAnbWFuZGF0b3J5J30pYCk7XG4gIH1cblxuICBwdWJsaWMgYXNzZXJ0U2lnbmF0dXJlKG1ldGhvZDogcmVmbGVjdC5DYWxsYWJsZSwgZXhwZWN0YXRpb25zOiBNZXRob2RTaWduYXR1cmVFeHBlY3RhdGlvbnMpIHtcbiAgICBjb25zdCBzY29wZSA9IG1ldGhvZC5wYXJlbnRUeXBlLmZxbiArICcuJyArIG1ldGhvZC5uYW1lO1xuICAgIGlmIChleHBlY3RhdGlvbnMucmV0dXJucyAmJiByZWZsZWN0Lk1ldGhvZC5pc01ldGhvZChtZXRob2QpKSB7XG4gICAgICB0aGlzLmFzc2VydFR5cGVzRXF1YWwobWV0aG9kLnN5c3RlbSwgbWV0aG9kLnJldHVybnMudHlwZSwgZXhwZWN0YXRpb25zLnJldHVybnMsIHNjb3BlKTtcbiAgICB9XG5cbiAgICBpZiAoZXhwZWN0YXRpb25zLnBhcmFtZXRlcnMpIHtcbiAgICAgIGNvbnN0IGV4cGVjdGVkQ291bnQgPSBleHBlY3RhdGlvbnMucGFyYW1ldGVycy5sZW5ndGg7XG4gICAgICBjb25zdCBhY3R1YWxDb3VudCA9IG1ldGhvZC5wYXJhbWV0ZXJzLmxlbmd0aDtcbiAgICAgIGlmICh0aGlzLmFzc2VydEVxdWFscyhhY3R1YWxDb3VudCwgZXhwZWN0ZWRDb3VudCwgc2NvcGUpKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXhwZWN0YXRpb25zLnBhcmFtZXRlcnMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICBjb25zdCBleHBlY3QgPSBleHBlY3RhdGlvbnMucGFyYW1ldGVyc1tpXTtcbiAgICAgICAgICBjb25zdCBhY3R1YWwgPSBtZXRob2QucGFyYW1ldGVyc1tpXTtcbiAgICAgICAgICBjb25zdCBwc2NvcGUgPSBzY29wZSArIGAucGFyYW1zWyR7aX1dYDtcbiAgICAgICAgICBpZiAoZXhwZWN0Lm5hbWUpIHtcbiAgICAgICAgICAgIGNvbnN0IGV4cGVjdGVkTmFtZSA9IGV4cGVjdC5uYW1lO1xuICAgICAgICAgICAgY29uc3QgYWN0dWFsTmFtZSA9IGFjdHVhbC5uYW1lO1xuICAgICAgICAgICAgdGhpcy5hc3NlcnRFcXVhbHMoYWN0dWFsTmFtZSwgZXhwZWN0ZWROYW1lLCBwc2NvcGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZXhwZWN0LnR5cGUpIHtcbiAgICAgICAgICAgIGlmIChleHBlY3Quc3VidHlwZUFsbG93ZWQpIHtcbiAgICAgICAgICAgICAgdGhpcy5hc3NlcnRUeXBlc0Fzc2lnbmFibGUobWV0aG9kLnN5c3RlbSwgYWN0dWFsLnR5cGUsIGV4cGVjdC50eXBlLCBwc2NvcGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5hc3NlcnRUeXBlc0VxdWFsKG1ldGhvZC5zeXN0ZW0sIGFjdHVhbC50eXBlLCBleHBlY3QudHlwZSwgcHNjb3BlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGV4cGVjdC5vcHRpb25hbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmFzc2VydFBhcmFtZXRlck9wdGlvbmFsKGFjdHVhbC5vcHRpb25hbCwgZXhwZWN0Lm9wdGlvbmFsLCBwc2NvcGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFdmFsdWF0ZXMgd2hldGhlciB0aGUgcnVsZSBzaG91bGQgYmUgZXZhbHVhdGVkIGJhc2VkIG9uIHRoZSBmaWx0ZXJzIGFwcGxpZWQuXG4gICAqL1xuICBwcml2YXRlIHNob3VsZEV2YWx1YXRlKGNvZGU6IHN0cmluZywgc2NvcGU6IHN0cmluZykge1xuICAgIGlmICghdGhpcy5vcHRpb25zLmluY2x1ZGUgfHwgdGhpcy5vcHRpb25zLmluY2x1ZGUubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGluY2x1ZGUgb2YgdGhpcy5vcHRpb25zLmluY2x1ZGUpIHtcbiAgICAgIC8vIG1hdGNoIGluY2x1ZGVcbiAgICAgIGlmIChtYXRjaFJ1bGUoaW5jbHVkZSkpIHtcbiAgICAgICAgZm9yIChjb25zdCBleGNsdWRlIG9mIHRoaXMub3B0aW9ucy5leGNsdWRlIHx8IFtdKSB7XG4gICAgICAgICAgLy8gbWF0Y2ggZXhjbHVkZVxuICAgICAgICAgIGlmIChtYXRjaFJ1bGUoZXhjbHVkZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgZnVuY3Rpb24gbWF0Y2hSdWxlKGZpbHRlcjogc3RyaW5nKSB7XG4gICAgICBpZiAoZmlsdGVyLmluZGV4T2YoJzonKSA9PT0gLTEpIHtcbiAgICAgICAgZmlsdGVyICs9ICc6Kic7IC8vIGFkZCBcIipcIiBzY29wZSBmaWx0ZXIgaWYgdGhlcmUgaXNuJ3Qgb25lXG4gICAgICB9XG5cbiAgICAgIC8vIGZpbHRlciBmb3JtYXQgaXMgXCJjb2RlOnNjb3BlXCIgYW5kIGJvdGggc3VwcG9ydCBcIipcIiBzdWZmaXggdG8gaW5kaWNhdGUgc3RhcnRzV2l0aFxuICAgICAgY29uc3QgWyBjb2RlRmlsdGVyLCBzY29wZUZpbHRlciBdID0gZmlsdGVyLnNwbGl0KCc6Jyk7XG4gICAgICByZXR1cm4gbWF0Y2hQYXR0ZXJuKGNvZGUsIGNvZGVGaWx0ZXIpICYmIG1hdGNoUGF0dGVybihzY29wZSwgc2NvcGVGaWx0ZXIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1hdGNoUGF0dGVybihzOiBzdHJpbmcsIHBhdHRlcm46IHN0cmluZykge1xuICAgICAgaWYgKHBhdHRlcm4uZW5kc1dpdGgoJyonKSkge1xuICAgICAgICBjb25zdCBwcmVmaXggPSBwYXR0ZXJuLnN1YnN0cigwLCBwYXR0ZXJuLmxlbmd0aCAtIDEpO1xuICAgICAgICByZXR1cm4gcy5zdGFydHNXaXRoKHByZWZpeCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcyA9PT0gcGF0dGVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJ1bGUge1xuICBjb2RlOiBzdHJpbmcsXG4gIG1lc3NhZ2U6IHN0cmluZztcbiAgd2FybmluZz86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29uY3JldGVSdWxlPFQ+IGV4dGVuZHMgUnVsZSB7XG4gIGV2YWwobGludGVyOiBFdmFsdWF0aW9uPFQ+KTogdm9pZDtcbn1cblxuLyoqXG4gKiBBIHR5cGUgY29uc3RyYWludFxuICpcbiAqIEJlIHN1cGVyIGZsZXhpYmxlIGFib3V0IGhvdyB0eXBlcyBjYW4gYmUgcmVwcmVzZW50ZWQuIFVsdGltYXRlbHksIHdlIHdpbGxcbiAqIGNvbXBhcmUgd2hhdCB5b3UgZ2l2ZSB0byBhIFR5cGVSZWZlcmVuY2UsIGJlY2F1c2UgdGhhdCdzIHdoYXQncyBpbiB0aGUgSlNJSVxuICogUmVmbGVjdCBtb2RlbC4gSG93ZXZlciwgaWYgeW91IGFscmVhZHkgaGF2ZSBhIHJlYWwgVHlwZSwgb3IganVzdCBhIHN0cmluZyB0b1xuICogYSB1c2VyLWRlZmluZWQgdHlwZSwgdGhhdCdzIGZpbmUgdG9vLiBXZSdsbCBEbyBUaGUgUmlnaHQgVGhpbmcuXG4gKi9cbmV4cG9ydCB0eXBlIFR5cGVTcGVjaWZpZXIgPSByZWZsZWN0LlR5cGVSZWZlcmVuY2UgfCByZWZsZWN0LlR5cGUgfCBzdHJpbmc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWV0aG9kU2lnbmF0dXJlUGFyYW1ldGVyRXhwZWN0YXRpb24ge1xuICBuYW1lPzogc3RyaW5nO1xuICB0eXBlPzogVHlwZVNwZWNpZmllcjtcbiAgc3VidHlwZUFsbG93ZWQ/OiBib29sZWFuO1xuXG4gIC8qKiBzaG91bGQgdGhpcyBwYXJhbSBiZSBvcHRpb25hbD8gKi9cbiAgb3B0aW9uYWw/OiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1ldGhvZFNpZ25hdHVyZUV4cGVjdGF0aW9ucyB7XG4gIHBhcmFtZXRlcnM/OiBNZXRob2RTaWduYXR1cmVQYXJhbWV0ZXJFeHBlY3RhdGlvbltdO1xuICByZXR1cm5zPzogVHlwZVNwZWNpZmllcjtcbn1cblxuZXhwb3J0IGVudW0gRGlhZ25vc3RpY0xldmVsIHtcbiAgU2tpcHBlZCxcbiAgU3VjY2VzcyxcbiAgV2FybmluZyxcbiAgRXJyb3IsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRGlhZ25vc3RpYyB7XG4gIGxldmVsOiBEaWFnbm9zdGljTGV2ZWw7XG4gIHJ1bGU6IFJ1bGU7XG4gIHNjb3BlOiBzdHJpbmc7XG4gIG1lc3NhZ2U6IHN0cmluZztcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGEgdHlwZSBzcGVjaWZpZXIgdG8gYSBUeXBlUmVmZXJlbmNlXG4gKi9cbmZ1bmN0aW9uIHR5cGVSZWZlcmVuY2VGcm9tKHRzOiByZWZsZWN0LlR5cGVTeXN0ZW0sIHg6IFR5cGVTcGVjaWZpZXIpOiByZWZsZWN0LlR5cGVSZWZlcmVuY2Uge1xuICBpZiAoaXNUeXBlUmVmZXJlbmNlKHgpKSB7IHJldHVybiB4OyB9XG5cbiAgaWYgKHR5cGVvZiB4ID09PSAnc3RyaW5nJykge1xuICAgIGlmICh4LmluZGV4T2YoJy4nKSA9PT0gLTEpIHtcbiAgICAgIHJldHVybiBuZXcgcmVmbGVjdC5UeXBlUmVmZXJlbmNlKHRzLCB7IHByaW1pdGl2ZTogeCBhcyBQcmltaXRpdmVUeXBlIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbmV3IHJlZmxlY3QuVHlwZVJlZmVyZW5jZSh0cywgeyBmcW46IHggfSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ldyByZWZsZWN0LlR5cGVSZWZlcmVuY2UodHMsIHgpO1xufVxuXG5mdW5jdGlvbiBpc1R5cGVSZWZlcmVuY2UoeDogYW55KTogeCBpcyByZWZsZWN0LlR5cGVSZWZlcmVuY2Uge1xuICByZXR1cm4geCBpbnN0YW5jZW9mIHJlZmxlY3QuVHlwZVJlZmVyZW5jZTtcbn1cbiJdfQ==