"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchResult = exports.Matcher = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
/**
 * Represents a matcher that can perform special data matching
 * capabilities between a given pattern and a target.
 */
class Matcher {
    /**
     * Check whether the provided object is a subtype of the `IMatcher`.
     */
    static isMatcher(x) {
        return x && x instanceof Matcher;
    }
}
_a = JSII_RTTI_SYMBOL_1;
Matcher[_a] = { fqn: "@aws-cdk/assertions.Matcher", version: "0.0.0" };
exports.Matcher = Matcher;
/**
 * The result of `Match.test()`.
 */
class MatchResult {
    constructor(target) {
        this.failuresHere = new Map();
        this.captures = new Map();
        this.finalized = false;
        this.innerMatchFailures = new Map();
        this._hasFailed = false;
        this._failCount = 0;
        this._cost = 0;
        this.target = target;
    }
    /**
     * DEPRECATED
     * @deprecated use recordFailure()
     */
    push(matcher, path, message) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/assertions.MatchResult#push", "use recordFailure()");
            jsiiDeprecationWarnings._aws_cdk_assertions_Matcher(matcher);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.push);
            }
            throw error;
        }
        return this.recordFailure({ matcher, path, message });
    }
    /**
     * Record a new failure into this result at a specific path.
     */
    recordFailure(failure) {
        try {
            jsiiDeprecationWarnings._aws_cdk_assertions_MatchFailure(failure);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.recordFailure);
            }
            throw error;
        }
        const failKey = failure.path.join('.');
        let list = this.failuresHere.get(failKey);
        if (!list) {
            list = [];
            this.failuresHere.set(failKey, list);
        }
        this._failCount += 1;
        this._cost += failure.cost ?? 1;
        list.push(failure);
        this._hasFailed = true;
        return this;
    }
    /** Whether the match is a success */
    get isSuccess() {
        return !this._hasFailed;
    }
    /** Does the result contain any failures. If not, the result is a success */
    hasFailed() {
        return this._hasFailed;
    }
    /** The number of failures */
    get failCount() {
        return this._failCount;
    }
    /** The cost of the failures so far */
    get failCost() {
        return this._cost;
    }
    /**
     * Compose the results of a previous match as a subtree.
     * @param id the id of the parent tree.
     */
    compose(id, inner) {
        try {
            jsiiDeprecationWarnings._aws_cdk_assertions_MatchResult(inner);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.compose);
            }
            throw error;
        }
        // Record inner failure
        if (inner.hasFailed()) {
            this._hasFailed = true;
            this._failCount += inner.failCount;
            this._cost += inner._cost;
            this.innerMatchFailures.set(id, inner);
        }
        // Copy captures so we all finalize them together
        inner.captures.forEach((vals, capture) => {
            vals.forEach(value => this.recordCapture({ capture, value }));
        });
        return this;
    }
    /**
     * Prepare the result to be analyzed.
     * This API *must* be called prior to analyzing these results.
     */
    finished() {
        if (this.finalized) {
            return this;
        }
        if (this.failCount === 0) {
            this.captures.forEach((vals, cap) => cap._captured.push(...vals));
        }
        this.finalized = true;
        return this;
    }
    /**
     * Render the failed match in a presentable way
     *
     * Prefer using `renderMismatch` over this method. It is left for backwards
     * compatibility for test suites that expect it, but `renderMismatch()` will
     * produce better output.
     */
    toHumanStrings() {
        const failures = new Array();
        debugger;
        recurse(this, []);
        return failures.map(r => {
            const loc = r.path.length === 0 ? '' : ` at /${r.path.join('/')}`;
            return '' + r.message + loc + ` (using ${r.matcher.name} matcher)`;
        });
        function recurse(x, prefix) {
            for (const fail of Array.from(x.failuresHere.values()).flat()) {
                failures.push({
                    matcher: fail.matcher,
                    message: fail.message,
                    path: [...prefix, ...fail.path],
                });
            }
            for (const [key, inner] of x.innerMatchFailures.entries()) {
                recurse(inner, [...prefix, key]);
            }
        }
    }
    /**
     * Do a deep render of the match result, showing the structure mismatches in context
     */
    renderMismatch() {
        if (!this.hasFailed()) {
            return '<match>';
        }
        const parts = new Array();
        const indents = new Array();
        emitFailures(this, '');
        recurse(this);
        return moveMarkersToFront(parts.join('').trimEnd());
        // Implementation starts here.
        // Yes this is a lot of code in one place. That's a bit unfortunate, but this is
        // the simplest way to access private state of the MatchResult, that we definitely
        // do NOT want to make part of the public API.
        function emit(x) {
            if (x === undefined) {
                debugger;
            }
            parts.push(x.replace(/\n/g, `\n${indents.join('')}`));
        }
        function emitFailures(r, path, scrapSet) {
            for (const fail of r.failuresHere.get(path) ?? []) {
                emit(`!! ${fail.message}\n`);
            }
            scrapSet?.delete(path);
        }
        function recurse(r) {
            // Failures that have been reported against this MatchResult that we didn't print yet
            const remainingFailures = new Set(Array.from(r.failuresHere.keys()).filter(x => x !== ''));
            //////////////////////////////////////////////////////////////////////
            if (Array.isArray(r.target)) {
                indents.push('  ');
                emit('[\n');
                for (const [first, i] of enumFirst(range(r.target.length))) {
                    if (!first) {
                        emit(',\n');
                    }
                    emitFailures(r, `${i}`, remainingFailures);
                    const innerMatcher = r.innerMatchFailures.get(`${i}`);
                    if (innerMatcher) {
                        // Report the top-level failures on the line before the content
                        emitFailures(innerMatcher, '');
                        recurseComparingValues(innerMatcher, r.target[i]);
                    }
                    else {
                        emit(renderAbridged(r.target[i]));
                    }
                }
                emitRemaining();
                indents.pop();
                emit('\n]');
                return;
            }
            //////////////////////////////////////////////////////////////////////
            if (r.target && typeof r.target === 'object') {
                indents.push('  ');
                emit('{\n');
                const keys = Array.from(new Set([
                    ...Object.keys(r.target),
                    ...Array.from(remainingFailures),
                ])).sort();
                for (const [first, key] of enumFirst(keys)) {
                    if (!first) {
                        emit(',\n');
                    }
                    emitFailures(r, key, remainingFailures);
                    const innerMatcher = r.innerMatchFailures.get(key);
                    if (innerMatcher) {
                        // Report the top-level failures on the line before the content
                        emitFailures(innerMatcher, '');
                        emit(`${jsonify(key)}: `);
                        recurseComparingValues(innerMatcher, r.target[key]);
                    }
                    else {
                        emit(`${jsonify(key)}: `);
                        emit(renderAbridged(r.target[key]));
                    }
                }
                emitRemaining();
                indents.pop();
                emit('\n}');
                return;
            }
            //////////////////////////////////////////////////////////////////////
            emitRemaining();
            emit(jsonify(r.target));
            function emitRemaining() {
                if (remainingFailures.size > 0) {
                    emit('\n');
                }
                for (const key of remainingFailures) {
                    emitFailures(r, key);
                }
            }
        }
        /**
         * Recurse to the inner matcher, but with a twist:
         *
         * If the match result target value is not the same as the given value,
         * then the matcher is matching a transformation of the given value.
         *
         * In that case, render both.
         *
         * FIXME: All of this rendering should have been at the discretion of
         * the matcher, it shouldn't all live here.
         */
        function recurseComparingValues(inner, actualValue) {
            if (inner.target === actualValue) {
                return recurse(inner);
            }
            emit(renderAbridged(actualValue));
            emit(' <*> ');
            recurse(inner);
        }
        /**
         * Render an abridged version of a value
         */
        function renderAbridged(x) {
            if (Array.isArray(x)) {
                switch (x.length) {
                    case 0: return '[]';
                    case 1: return `[ ${renderAbridged(x[0])} ]`;
                    case 2:
                        // Render if all values are scalars
                        if (x.every(e => ['number', 'boolean', 'string'].includes(typeof e))) {
                            return `[ ${x.map(renderAbridged).join(', ')} ]`;
                        }
                        return '[ ... ]';
                    default: return '[ ... ]';
                }
            }
            if (x && typeof x === 'object') {
                const keys = Object.keys(x);
                switch (keys.length) {
                    case 0: return '{}';
                    case 1: return `{ ${JSON.stringify(keys[0])}: ${renderAbridged(x[keys[0]])} }`;
                    default: return '{ ... }';
                }
            }
            return jsonify(x);
        }
        function jsonify(x) {
            return JSON.stringify(x) ?? 'undefined';
        }
        /**
         * Move markers to the front of each line
         */
        function moveMarkersToFront(x) {
            const re = /^(\s+)!!/gm;
            return x.replace(re, (_, spaces) => `!!${spaces.substring(0, spaces.length - 2)}`);
        }
    }
    /**
     * Record a capture against in this match result.
     */
    recordCapture(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_assertions_MatchCapture(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.recordCapture);
            }
            throw error;
        }
        let values = this.captures.get(options.capture);
        if (values === undefined) {
            values = [];
        }
        values.push(options.value);
        this.captures.set(options.capture, values);
    }
}
_b = JSII_RTTI_SYMBOL_1;
MatchResult[_b] = { fqn: "@aws-cdk/assertions.MatchResult", version: "0.0.0" };
exports.MatchResult = MatchResult;
function* range(n) {
    for (let i = 0; i < n; i++) {
        yield i;
    }
}
function* enumFirst(xs) {
    let first = true;
    for (const x of xs) {
        yield [first, x];
        first = false;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0Y2hlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1hdGNoZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUE7OztHQUdHO0FBQ0gsTUFBc0IsT0FBTztJQUMzQjs7T0FFRztJQUNJLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBTTtRQUM1QixPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksT0FBTyxDQUFDO0tBQ2xDOzs7O0FBTm1CLDBCQUFPO0FBbUU3Qjs7R0FFRztBQUNILE1BQWEsV0FBVztJQWF0QixZQUFZLE1BQVc7UUFSTixpQkFBWSxHQUFHLElBQUksR0FBRyxFQUEwQixDQUFDO1FBQ2pELGFBQVEsR0FBd0IsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNuRCxjQUFTLEdBQVksS0FBSyxDQUFDO1FBQ2xCLHVCQUFrQixHQUFHLElBQUksR0FBRyxFQUF1QixDQUFDO1FBQzdELGVBQVUsR0FBRyxLQUFLLENBQUM7UUFDbkIsZUFBVSxHQUFHLENBQUMsQ0FBQztRQUNmLFVBQUssR0FBRyxDQUFDLENBQUM7UUFHaEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7S0FDdEI7SUFFRDs7O09BR0c7SUFDSSxJQUFJLENBQUMsT0FBZ0IsRUFBRSxJQUFjLEVBQUUsT0FBZTs7Ozs7Ozs7Ozs7UUFDM0QsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO0tBQ3ZEO0lBRUQ7O09BRUc7SUFDSSxhQUFhLENBQUMsT0FBcUI7Ozs7Ozs7Ozs7UUFDeEMsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdkMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDMUMsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNULElBQUksR0FBRyxFQUFFLENBQUM7WUFDVixJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDdEM7UUFFRCxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQztRQUNyQixJQUFJLENBQUMsS0FBSyxJQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDdkIsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUVELHFDQUFxQztJQUNyQyxJQUFXLFNBQVM7UUFDbEIsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7S0FDekI7SUFFRCw0RUFBNEU7SUFDckUsU0FBUztRQUNkLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztLQUN4QjtJQUVELDZCQUE2QjtJQUM3QixJQUFXLFNBQVM7UUFDbEIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0tBQ3hCO0lBRUQsc0NBQXNDO0lBQ3RDLElBQVcsUUFBUTtRQUNqQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7S0FDbkI7SUFFRDs7O09BR0c7SUFDSSxPQUFPLENBQUMsRUFBVSxFQUFFLEtBQWtCOzs7Ozs7Ozs7O1FBQzNDLHVCQUF1QjtRQUN2QixJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUUsRUFBRTtZQUNyQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUN2QixJQUFJLENBQUMsVUFBVSxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDbkMsSUFBSSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDO1lBQzFCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ3hDO1FBRUQsaURBQWlEO1FBQ2pELEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFO1lBQ3ZDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNoRSxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFFRDs7O09BR0c7SUFDSSxRQUFRO1FBQ2IsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2xCLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssQ0FBQyxFQUFFO1lBQ3hCLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQ25FO1FBQ0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDdEIsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUVEOzs7Ozs7T0FNRztJQUNJLGNBQWM7UUFDbkIsTUFBTSxRQUFRLEdBQUcsSUFBSSxLQUFLLEVBQWdCLENBQUM7UUFDM0MsUUFBUSxDQUFDO1FBQ1QsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVsQixPQUFPLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDdEIsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUNsRSxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsT0FBTyxHQUFHLEdBQUcsR0FBRyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxXQUFXLENBQUM7UUFDckUsQ0FBQyxDQUFDLENBQUM7UUFFSCxTQUFTLE9BQU8sQ0FBQyxDQUFjLEVBQUUsTUFBZ0I7WUFDL0MsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtnQkFDN0QsUUFBUSxDQUFDLElBQUksQ0FBQztvQkFDWixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87b0JBQ3JCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztvQkFDckIsSUFBSSxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO2lCQUNoQyxDQUFDLENBQUM7YUFDSjtZQUNELEtBQUssTUFBTSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFLEVBQUU7Z0JBQ3pELE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQ2xDO1FBQ0gsQ0FBQztLQUNGO0lBRUQ7O09BRUc7SUFDSSxjQUFjO1FBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUU7WUFDckIsT0FBTyxTQUFTLENBQUM7U0FDbEI7UUFFRCxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssRUFBVSxDQUFDO1FBQ2xDLE1BQU0sT0FBTyxHQUFHLElBQUksS0FBSyxFQUFVLENBQUM7UUFDcEMsWUFBWSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN2QixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDZCxPQUFPLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUVwRCw4QkFBOEI7UUFDOUIsZ0ZBQWdGO1FBQ2hGLGtGQUFrRjtRQUNsRiw4Q0FBOEM7UUFFOUMsU0FBUyxJQUFJLENBQUMsQ0FBUztZQUNyQixJQUFJLENBQUMsS0FBSyxTQUFTLEVBQUU7Z0JBQ25CLFFBQVEsQ0FBQzthQUNWO1lBQ0QsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxLQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUVELFNBQVMsWUFBWSxDQUFDLENBQWMsRUFBRSxJQUFZLEVBQUUsUUFBc0I7WUFDeEUsS0FBSyxNQUFNLElBQUksSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUU7Z0JBQ2pELElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDO2FBQzlCO1lBQ0QsUUFBUSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QixDQUFDO1FBRUQsU0FBUyxPQUFPLENBQUMsQ0FBYztZQUM3QixxRkFBcUY7WUFDckYsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztZQUUzRixzRUFBc0U7WUFDdEUsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDM0IsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDbkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNaLEtBQUssTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRTtvQkFDMUQsSUFBSSxDQUFDLEtBQUssRUFBRTt3QkFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7cUJBQUU7b0JBRTVCLFlBQVksQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO29CQUMzQyxNQUFNLFlBQVksR0FBRyxDQUFDLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDdEQsSUFBSSxZQUFZLEVBQUU7d0JBQ2hCLCtEQUErRDt3QkFDL0QsWUFBWSxDQUFDLFlBQVksRUFBRSxFQUFFLENBQUMsQ0FBQzt3QkFDL0Isc0JBQXNCLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDbkQ7eUJBQU07d0JBQ0wsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDbkM7aUJBQ0Y7Z0JBRUQsYUFBYSxFQUFFLENBQUM7Z0JBQ2hCLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDZCxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBRVosT0FBTzthQUNSO1lBRUQsc0VBQXNFO1lBQ3RFLElBQUksQ0FBQyxDQUFDLE1BQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxNQUFNLEtBQUssUUFBUSxFQUFFO2dCQUM1QyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNuQixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ1osTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQztvQkFDOUIsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7b0JBQ3hCLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztpQkFDakMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBRVgsS0FBSyxNQUFNLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFDMUMsSUFBSSxDQUFDLEtBQUssRUFBRTt3QkFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7cUJBQUU7b0JBRTVCLFlBQVksQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLGlCQUFpQixDQUFDLENBQUM7b0JBQ3hDLE1BQU0sWUFBWSxHQUFHLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ25ELElBQUksWUFBWSxFQUFFO3dCQUNoQiwrREFBK0Q7d0JBQy9ELFlBQVksQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUM7d0JBQy9CLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQzFCLHNCQUFzQixDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7cUJBQ3JEO3lCQUFNO3dCQUNMLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQzFCLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ3JDO2lCQUNGO2dCQUVELGFBQWEsRUFBRSxDQUFDO2dCQUNoQixPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ2QsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUVaLE9BQU87YUFDUjtZQUVELHNFQUFzRTtZQUN0RSxhQUFhLEVBQUUsQ0FBQztZQUNoQixJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBRXhCLFNBQVMsYUFBYTtnQkFDcEIsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFO29CQUM5QixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ1o7Z0JBQ0QsS0FBSyxNQUFNLEdBQUcsSUFBSSxpQkFBaUIsRUFBRTtvQkFDbkMsWUFBWSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztpQkFDdEI7WUFDSCxDQUFDO1FBQ0gsQ0FBQztRQUVEOzs7Ozs7Ozs7O1dBVUc7UUFDSCxTQUFTLHNCQUFzQixDQUFDLEtBQWtCLEVBQUUsV0FBZ0I7WUFDbEUsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLFdBQVcsRUFBRTtnQkFDaEMsT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDdkI7WUFDRCxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDbEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2QsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pCLENBQUM7UUFFRDs7V0FFRztRQUNILFNBQVMsY0FBYyxDQUFDLENBQU07WUFDNUIsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUNwQixRQUFRLENBQUMsQ0FBQyxNQUFNLEVBQUU7b0JBQ2hCLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUM7b0JBQ3BCLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxLQUFLLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO29CQUM3QyxLQUFLLENBQUM7d0JBQ0osbUNBQW1DO3dCQUNuQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTs0QkFDcEUsT0FBTyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7eUJBQ2xEO3dCQUNELE9BQU8sU0FBUyxDQUFDO29CQUNuQixPQUFPLENBQUMsQ0FBQyxPQUFPLFNBQVMsQ0FBQztpQkFDM0I7YUFDRjtZQUNELElBQUksQ0FBQyxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVEsRUFBRTtnQkFDOUIsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDNUIsUUFBUSxJQUFJLENBQUMsTUFBTSxFQUFFO29CQUNuQixLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDO29CQUNwQixLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO29CQUMvRSxPQUFPLENBQUMsQ0FBQyxPQUFPLFNBQVMsQ0FBQztpQkFDM0I7YUFDRjtZQUNELE9BQU8sT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLENBQUM7UUFFRCxTQUFTLE9BQU8sQ0FBQyxDQUFNO1lBQ3JCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxXQUFXLENBQUM7UUFDMUMsQ0FBQztRQUVEOztXQUVHO1FBQ0gsU0FBUyxrQkFBa0IsQ0FBQyxDQUFTO1lBQ25DLE1BQU0sRUFBRSxHQUFHLFlBQVksQ0FBQztZQUN4QixPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLE1BQWMsRUFBRSxFQUFFLENBQUMsS0FBSyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBRSxFQUFFLENBQUMsQ0FBQztRQUM5RixDQUFDO0tBQ0Y7SUFFRDs7T0FFRztJQUNJLGFBQWEsQ0FBQyxPQUFxQjs7Ozs7Ozs7OztRQUN4QyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDaEQsSUFBSSxNQUFNLEtBQUssU0FBUyxFQUFFO1lBQ3hCLE1BQU0sR0FBRyxFQUFFLENBQUM7U0FDYjtRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDNUM7Ozs7QUFyVFUsa0NBQVc7QUF3VHhCLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFTO0lBQ3ZCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDMUIsTUFBTSxDQUFDLENBQUM7S0FDVDtBQUNILENBQUM7QUFFRCxRQUFRLENBQUMsQ0FBQyxTQUFTLENBQUksRUFBZTtJQUNwQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7SUFDakIsS0FBSyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDbEIsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNqQixLQUFLLEdBQUcsS0FBSyxDQUFDO0tBQ2Y7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2FwdHVyZSB9IGZyb20gJy4vY2FwdHVyZSc7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIG1hdGNoZXIgdGhhdCBjYW4gcGVyZm9ybSBzcGVjaWFsIGRhdGEgbWF0Y2hpbmdcbiAqIGNhcGFiaWxpdGllcyBiZXR3ZWVuIGEgZ2l2ZW4gcGF0dGVybiBhbmQgYSB0YXJnZXQuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBNYXRjaGVyIHtcbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgdGhlIHByb3ZpZGVkIG9iamVjdCBpcyBhIHN1YnR5cGUgb2YgdGhlIGBJTWF0Y2hlcmAuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGlzTWF0Y2hlcih4OiBhbnkpOiB4IGlzIE1hdGNoZXIge1xuICAgIHJldHVybiB4ICYmIHggaW5zdGFuY2VvZiBNYXRjaGVyO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgbmFtZSBmb3IgdGhlIG1hdGNoZXIuIFRoaXMgaXMgY29sbGVjdGVkIGFzIHBhcnQgb2YgdGhlIHJlc3VsdCBhbmQgbWF5IGJlIHByZXNlbnRlZCB0byB0aGUgdXNlci5cbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBuYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRlc3Qgd2hldGhlciBhIHRhcmdldCBtYXRjaGVzIHRoZSBwcm92aWRlZCBwYXR0ZXJuLlxuICAgKiBFdmVyeSBNYXRjaGVyIG11c3QgaW1wbGVtZW50IHRoaXMgbWV0aG9kLlxuICAgKiBUaGlzIG1ldGhvZCB3aWxsIGJlIGludm9rZWQgYnkgdGhlIGFzc2VydGlvbnMgZnJhbWV3b3JrLiBEbyBub3QgY2FsbCB0aGlzIG1ldGhvZCBkaXJlY3RseS5cbiAgICogQHBhcmFtIGFjdHVhbCB0aGUgdGFyZ2V0IHRvIG1hdGNoXG4gICAqIEByZXR1cm4gdGhlIGxpc3Qgb2YgbWF0Y2ggZmFpbHVyZXMuIEFuIGVtcHR5IGFycmF5IGRlbm90ZXMgYSBzdWNjZXNzZnVsIG1hdGNoLlxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHRlc3QoYWN0dWFsOiBhbnkpOiBNYXRjaFJlc3VsdDtcbn1cblxuLyoqXG4gKiBNYXRjaCBmYWlsdXJlIGRldGFpbHNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRjaEZhaWx1cmUge1xuICAvKipcbiAgICogVGhlIG1hdGNoZXIgdGhhdCBoYWQgdGhlIGZhaWx1cmVcbiAgICovXG4gIHJlYWRvbmx5IG1hdGNoZXI6IE1hdGNoZXI7XG5cbiAgLyoqXG4gICAqIFRoZSByZWxhdGl2ZSBwYXRoIGluIHRoZSB0YXJnZXQgd2hlcmUgdGhlIGZhaWx1cmUgb2NjdXJyZWQuXG4gICAqIElmIHRoZSBmYWlsdXJlIG9jY3VycmVkIGF0IHJvb3Qgb2YgdGhlIG1hdGNoIHRyZWUsIHNldCB0aGUgcGF0aCB0byBhbiBlbXB0eSBsaXN0LlxuICAgKiBJZiBpdCBvY2N1cnMgaW4gdGhlIDV0aCBpbmRleCBvZiBhbiBhcnJheSBuZXN0ZWQgd2l0aGluIHRoZSAnZm9vJyBrZXkgb2YgYW4gb2JqZWN0LFxuICAgKiBzZXQgdGhlIHBhdGggYXMgYFsnL2ZvbycsICdbNV0nXWAuXG4gICAqL1xuICByZWFkb25seSBwYXRoOiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogRmFpbHVyZSBtZXNzYWdlXG4gICAqL1xuICByZWFkb25seSBtZXNzYWdlOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBjb3N0IG9mIHRoaXMgcGFydGljdWxhciBtaXNtYXRjaFxuICAgKlxuICAgKiBAZGVmYXVsdCAxXG4gICAqL1xuICByZWFkb25seSBjb3N0PzogbnVtYmVyO1xufVxuXG4vKipcbiAqIEluZm9ybWF0aW9uIGFib3V0IGEgdmFsdWUgY2FwdHVyZWQgZHVyaW5nIG1hdGNoXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0Y2hDYXB0dXJlIHtcbiAgLyoqXG4gICAqIFRoZSBpbnN0YW5jZSBvZiBDYXB0dXJlIGNsYXNzIHRvIHdoaWNoIHRoaXMgY2FwdHVyZSBpcyBhc3NvY2lhdGVkIHdpdGguXG4gICAqL1xuICByZWFkb25seSBjYXB0dXJlOiBDYXB0dXJlO1xuICAvKipcbiAgICogVGhlIHZhbHVlIHRoYXQgd2FzIGNhcHR1cmVkXG4gICAqL1xuICByZWFkb25seSB2YWx1ZTogYW55O1xufVxuXG4vKipcbiAqIFRoZSByZXN1bHQgb2YgYE1hdGNoLnRlc3QoKWAuXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRjaFJlc3VsdCB7XG4gIC8qKlxuICAgKiBUaGUgdGFyZ2V0IGZvciB3aGljaCB0aGlzIHJlc3VsdCB3YXMgZ2VuZXJhdGVkLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHRhcmdldDogYW55O1xuICBwcml2YXRlIHJlYWRvbmx5IGZhaWx1cmVzSGVyZSA9IG5ldyBNYXA8c3RyaW5nLCBNYXRjaEZhaWx1cmVbXT4oKTtcbiAgcHJpdmF0ZSByZWFkb25seSBjYXB0dXJlczogTWFwPENhcHR1cmUsIGFueVtdPiA9IG5ldyBNYXAoKTtcbiAgcHJpdmF0ZSBmaW5hbGl6ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSByZWFkb25seSBpbm5lck1hdGNoRmFpbHVyZXMgPSBuZXcgTWFwPHN0cmluZywgTWF0Y2hSZXN1bHQ+KCk7XG4gIHByaXZhdGUgX2hhc0ZhaWxlZCA9IGZhbHNlO1xuICBwcml2YXRlIF9mYWlsQ291bnQgPSAwO1xuICBwcml2YXRlIF9jb3N0ID0gMDtcblxuICBjb25zdHJ1Y3Rvcih0YXJnZXQ6IGFueSkge1xuICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xuICB9XG5cbiAgLyoqXG4gICAqIERFUFJFQ0FURURcbiAgICogQGRlcHJlY2F0ZWQgdXNlIHJlY29yZEZhaWx1cmUoKVxuICAgKi9cbiAgcHVibGljIHB1c2gobWF0Y2hlcjogTWF0Y2hlciwgcGF0aDogc3RyaW5nW10sIG1lc3NhZ2U6IHN0cmluZyk6IHRoaXMge1xuICAgIHJldHVybiB0aGlzLnJlY29yZEZhaWx1cmUoeyBtYXRjaGVyLCBwYXRoLCBtZXNzYWdlIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlY29yZCBhIG5ldyBmYWlsdXJlIGludG8gdGhpcyByZXN1bHQgYXQgYSBzcGVjaWZpYyBwYXRoLlxuICAgKi9cbiAgcHVibGljIHJlY29yZEZhaWx1cmUoZmFpbHVyZTogTWF0Y2hGYWlsdXJlKTogdGhpcyB7XG4gICAgY29uc3QgZmFpbEtleSA9IGZhaWx1cmUucGF0aC5qb2luKCcuJyk7XG4gICAgbGV0IGxpc3QgPSB0aGlzLmZhaWx1cmVzSGVyZS5nZXQoZmFpbEtleSk7XG4gICAgaWYgKCFsaXN0KSB7XG4gICAgICBsaXN0ID0gW107XG4gICAgICB0aGlzLmZhaWx1cmVzSGVyZS5zZXQoZmFpbEtleSwgbGlzdCk7XG4gICAgfVxuXG4gICAgdGhpcy5fZmFpbENvdW50ICs9IDE7XG4gICAgdGhpcy5fY29zdCArPSBmYWlsdXJlLmNvc3QgPz8gMTtcbiAgICBsaXN0LnB1c2goZmFpbHVyZSk7XG4gICAgdGhpcy5faGFzRmFpbGVkID0gdHJ1ZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBtYXRjaCBpcyBhIHN1Y2Nlc3MgKi9cbiAgcHVibGljIGdldCBpc1N1Y2Nlc3MoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLl9oYXNGYWlsZWQ7XG4gIH1cblxuICAvKiogRG9lcyB0aGUgcmVzdWx0IGNvbnRhaW4gYW55IGZhaWx1cmVzLiBJZiBub3QsIHRoZSByZXN1bHQgaXMgYSBzdWNjZXNzICovXG4gIHB1YmxpYyBoYXNGYWlsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2hhc0ZhaWxlZDtcbiAgfVxuXG4gIC8qKiBUaGUgbnVtYmVyIG9mIGZhaWx1cmVzICovXG4gIHB1YmxpYyBnZXQgZmFpbENvdW50KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2ZhaWxDb3VudDtcbiAgfVxuXG4gIC8qKiBUaGUgY29zdCBvZiB0aGUgZmFpbHVyZXMgc28gZmFyICovXG4gIHB1YmxpYyBnZXQgZmFpbENvc3QoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fY29zdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21wb3NlIHRoZSByZXN1bHRzIG9mIGEgcHJldmlvdXMgbWF0Y2ggYXMgYSBzdWJ0cmVlLlxuICAgKiBAcGFyYW0gaWQgdGhlIGlkIG9mIHRoZSBwYXJlbnQgdHJlZS5cbiAgICovXG4gIHB1YmxpYyBjb21wb3NlKGlkOiBzdHJpbmcsIGlubmVyOiBNYXRjaFJlc3VsdCk6IHRoaXMge1xuICAgIC8vIFJlY29yZCBpbm5lciBmYWlsdXJlXG4gICAgaWYgKGlubmVyLmhhc0ZhaWxlZCgpKSB7XG4gICAgICB0aGlzLl9oYXNGYWlsZWQgPSB0cnVlO1xuICAgICAgdGhpcy5fZmFpbENvdW50ICs9IGlubmVyLmZhaWxDb3VudDtcbiAgICAgIHRoaXMuX2Nvc3QgKz0gaW5uZXIuX2Nvc3Q7XG4gICAgICB0aGlzLmlubmVyTWF0Y2hGYWlsdXJlcy5zZXQoaWQsIGlubmVyKTtcbiAgICB9XG5cbiAgICAvLyBDb3B5IGNhcHR1cmVzIHNvIHdlIGFsbCBmaW5hbGl6ZSB0aGVtIHRvZ2V0aGVyXG4gICAgaW5uZXIuY2FwdHVyZXMuZm9yRWFjaCgodmFscywgY2FwdHVyZSkgPT4ge1xuICAgICAgdmFscy5mb3JFYWNoKHZhbHVlID0+IHRoaXMucmVjb3JkQ2FwdHVyZSh7IGNhcHR1cmUsIHZhbHVlIH0pKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBQcmVwYXJlIHRoZSByZXN1bHQgdG8gYmUgYW5hbHl6ZWQuXG4gICAqIFRoaXMgQVBJICptdXN0KiBiZSBjYWxsZWQgcHJpb3IgdG8gYW5hbHl6aW5nIHRoZXNlIHJlc3VsdHMuXG4gICAqL1xuICBwdWJsaWMgZmluaXNoZWQoKTogdGhpcyB7XG4gICAgaWYgKHRoaXMuZmluYWxpemVkKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBpZiAodGhpcy5mYWlsQ291bnQgPT09IDApIHtcbiAgICAgIHRoaXMuY2FwdHVyZXMuZm9yRWFjaCgodmFscywgY2FwKSA9PiBjYXAuX2NhcHR1cmVkLnB1c2goLi4udmFscykpO1xuICAgIH1cbiAgICB0aGlzLmZpbmFsaXplZCA9IHRydWU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIHRoZSBmYWlsZWQgbWF0Y2ggaW4gYSBwcmVzZW50YWJsZSB3YXlcbiAgICpcbiAgICogUHJlZmVyIHVzaW5nIGByZW5kZXJNaXNtYXRjaGAgb3ZlciB0aGlzIG1ldGhvZC4gSXQgaXMgbGVmdCBmb3IgYmFja3dhcmRzXG4gICAqIGNvbXBhdGliaWxpdHkgZm9yIHRlc3Qgc3VpdGVzIHRoYXQgZXhwZWN0IGl0LCBidXQgYHJlbmRlck1pc21hdGNoKClgIHdpbGxcbiAgICogcHJvZHVjZSBiZXR0ZXIgb3V0cHV0LlxuICAgKi9cbiAgcHVibGljIHRvSHVtYW5TdHJpbmdzKCk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCBmYWlsdXJlcyA9IG5ldyBBcnJheTxNYXRjaEZhaWx1cmU+KCk7XG4gICAgZGVidWdnZXI7XG4gICAgcmVjdXJzZSh0aGlzLCBbXSk7XG5cbiAgICByZXR1cm4gZmFpbHVyZXMubWFwKHIgPT4ge1xuICAgICAgY29uc3QgbG9jID0gci5wYXRoLmxlbmd0aCA9PT0gMCA/ICcnIDogYCBhdCAvJHtyLnBhdGguam9pbignLycpfWA7XG4gICAgICByZXR1cm4gJycgKyByLm1lc3NhZ2UgKyBsb2MgKyBgICh1c2luZyAke3IubWF0Y2hlci5uYW1lfSBtYXRjaGVyKWA7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiByZWN1cnNlKHg6IE1hdGNoUmVzdWx0LCBwcmVmaXg6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgICBmb3IgKGNvbnN0IGZhaWwgb2YgQXJyYXkuZnJvbSh4LmZhaWx1cmVzSGVyZS52YWx1ZXMoKSkuZmxhdCgpKSB7XG4gICAgICAgIGZhaWx1cmVzLnB1c2goe1xuICAgICAgICAgIG1hdGNoZXI6IGZhaWwubWF0Y2hlcixcbiAgICAgICAgICBtZXNzYWdlOiBmYWlsLm1lc3NhZ2UsXG4gICAgICAgICAgcGF0aDogWy4uLnByZWZpeCwgLi4uZmFpbC5wYXRoXSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBmb3IgKGNvbnN0IFtrZXksIGlubmVyXSBvZiB4LmlubmVyTWF0Y2hGYWlsdXJlcy5lbnRyaWVzKCkpIHtcbiAgICAgICAgcmVjdXJzZShpbm5lciwgWy4uLnByZWZpeCwga2V5XSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERvIGEgZGVlcCByZW5kZXIgb2YgdGhlIG1hdGNoIHJlc3VsdCwgc2hvd2luZyB0aGUgc3RydWN0dXJlIG1pc21hdGNoZXMgaW4gY29udGV4dFxuICAgKi9cbiAgcHVibGljIHJlbmRlck1pc21hdGNoKCk6IHN0cmluZyB7XG4gICAgaWYgKCF0aGlzLmhhc0ZhaWxlZCgpKSB7XG4gICAgICByZXR1cm4gJzxtYXRjaD4nO1xuICAgIH1cblxuICAgIGNvbnN0IHBhcnRzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcbiAgICBjb25zdCBpbmRlbnRzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcbiAgICBlbWl0RmFpbHVyZXModGhpcywgJycpO1xuICAgIHJlY3Vyc2UodGhpcyk7XG4gICAgcmV0dXJuIG1vdmVNYXJrZXJzVG9Gcm9udChwYXJ0cy5qb2luKCcnKS50cmltRW5kKCkpO1xuXG4gICAgLy8gSW1wbGVtZW50YXRpb24gc3RhcnRzIGhlcmUuXG4gICAgLy8gWWVzIHRoaXMgaXMgYSBsb3Qgb2YgY29kZSBpbiBvbmUgcGxhY2UuIFRoYXQncyBhIGJpdCB1bmZvcnR1bmF0ZSwgYnV0IHRoaXMgaXNcbiAgICAvLyB0aGUgc2ltcGxlc3Qgd2F5IHRvIGFjY2VzcyBwcml2YXRlIHN0YXRlIG9mIHRoZSBNYXRjaFJlc3VsdCwgdGhhdCB3ZSBkZWZpbml0ZWx5XG4gICAgLy8gZG8gTk9UIHdhbnQgdG8gbWFrZSBwYXJ0IG9mIHRoZSBwdWJsaWMgQVBJLlxuXG4gICAgZnVuY3Rpb24gZW1pdCh4OiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgIGlmICh4ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZGVidWdnZXI7XG4gICAgICB9XG4gICAgICBwYXJ0cy5wdXNoKHgucmVwbGFjZSgvXFxuL2csIGBcXG4ke2luZGVudHMuam9pbignJyl9YCkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVtaXRGYWlsdXJlcyhyOiBNYXRjaFJlc3VsdCwgcGF0aDogc3RyaW5nLCBzY3JhcFNldD86IFNldDxzdHJpbmc+KTogdm9pZCB7XG4gICAgICBmb3IgKGNvbnN0IGZhaWwgb2Ygci5mYWlsdXJlc0hlcmUuZ2V0KHBhdGgpID8/IFtdKSB7XG4gICAgICAgIGVtaXQoYCEhICR7ZmFpbC5tZXNzYWdlfVxcbmApO1xuICAgICAgfVxuICAgICAgc2NyYXBTZXQ/LmRlbGV0ZShwYXRoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZWN1cnNlKHI6IE1hdGNoUmVzdWx0KTogdm9pZCB7XG4gICAgICAvLyBGYWlsdXJlcyB0aGF0IGhhdmUgYmVlbiByZXBvcnRlZCBhZ2FpbnN0IHRoaXMgTWF0Y2hSZXN1bHQgdGhhdCB3ZSBkaWRuJ3QgcHJpbnQgeWV0XG4gICAgICBjb25zdCByZW1haW5pbmdGYWlsdXJlcyA9IG5ldyBTZXQoQXJyYXkuZnJvbShyLmZhaWx1cmVzSGVyZS5rZXlzKCkpLmZpbHRlcih4ID0+IHggIT09ICcnKSk7XG5cbiAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHIudGFyZ2V0KSkge1xuICAgICAgICBpbmRlbnRzLnB1c2goJyAgJyk7XG4gICAgICAgIGVtaXQoJ1tcXG4nKTtcbiAgICAgICAgZm9yIChjb25zdCBbZmlyc3QsIGldIG9mIGVudW1GaXJzdChyYW5nZShyLnRhcmdldC5sZW5ndGgpKSkge1xuICAgICAgICAgIGlmICghZmlyc3QpIHsgZW1pdCgnLFxcbicpOyB9XG5cbiAgICAgICAgICBlbWl0RmFpbHVyZXMociwgYCR7aX1gLCByZW1haW5pbmdGYWlsdXJlcyk7XG4gICAgICAgICAgY29uc3QgaW5uZXJNYXRjaGVyID0gci5pbm5lck1hdGNoRmFpbHVyZXMuZ2V0KGAke2l9YCk7XG4gICAgICAgICAgaWYgKGlubmVyTWF0Y2hlcikge1xuICAgICAgICAgICAgLy8gUmVwb3J0IHRoZSB0b3AtbGV2ZWwgZmFpbHVyZXMgb24gdGhlIGxpbmUgYmVmb3JlIHRoZSBjb250ZW50XG4gICAgICAgICAgICBlbWl0RmFpbHVyZXMoaW5uZXJNYXRjaGVyLCAnJyk7XG4gICAgICAgICAgICByZWN1cnNlQ29tcGFyaW5nVmFsdWVzKGlubmVyTWF0Y2hlciwgci50YXJnZXRbaV0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbWl0KHJlbmRlckFicmlkZ2VkKHIudGFyZ2V0W2ldKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZW1pdFJlbWFpbmluZygpO1xuICAgICAgICBpbmRlbnRzLnBvcCgpO1xuICAgICAgICBlbWl0KCdcXG5dJyk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICBpZiAoci50YXJnZXQgJiYgdHlwZW9mIHIudGFyZ2V0ID09PSAnb2JqZWN0Jykge1xuICAgICAgICBpbmRlbnRzLnB1c2goJyAgJyk7XG4gICAgICAgIGVtaXQoJ3tcXG4nKTtcbiAgICAgICAgY29uc3Qga2V5cyA9IEFycmF5LmZyb20obmV3IFNldChbXG4gICAgICAgICAgLi4uT2JqZWN0LmtleXMoci50YXJnZXQpLFxuICAgICAgICAgIC4uLkFycmF5LmZyb20ocmVtYWluaW5nRmFpbHVyZXMpLFxuICAgICAgICBdKSkuc29ydCgpO1xuXG4gICAgICAgIGZvciAoY29uc3QgW2ZpcnN0LCBrZXldIG9mIGVudW1GaXJzdChrZXlzKSkge1xuICAgICAgICAgIGlmICghZmlyc3QpIHsgZW1pdCgnLFxcbicpOyB9XG5cbiAgICAgICAgICBlbWl0RmFpbHVyZXMociwga2V5LCByZW1haW5pbmdGYWlsdXJlcyk7XG4gICAgICAgICAgY29uc3QgaW5uZXJNYXRjaGVyID0gci5pbm5lck1hdGNoRmFpbHVyZXMuZ2V0KGtleSk7XG4gICAgICAgICAgaWYgKGlubmVyTWF0Y2hlcikge1xuICAgICAgICAgICAgLy8gUmVwb3J0IHRoZSB0b3AtbGV2ZWwgZmFpbHVyZXMgb24gdGhlIGxpbmUgYmVmb3JlIHRoZSBjb250ZW50XG4gICAgICAgICAgICBlbWl0RmFpbHVyZXMoaW5uZXJNYXRjaGVyLCAnJyk7XG4gICAgICAgICAgICBlbWl0KGAke2pzb25pZnkoa2V5KX06IGApO1xuICAgICAgICAgICAgcmVjdXJzZUNvbXBhcmluZ1ZhbHVlcyhpbm5lck1hdGNoZXIsIHIudGFyZ2V0W2tleV0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbWl0KGAke2pzb25pZnkoa2V5KX06IGApO1xuICAgICAgICAgICAgZW1pdChyZW5kZXJBYnJpZGdlZChyLnRhcmdldFtrZXldKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZW1pdFJlbWFpbmluZygpO1xuICAgICAgICBpbmRlbnRzLnBvcCgpO1xuICAgICAgICBlbWl0KCdcXG59Jyk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICBlbWl0UmVtYWluaW5nKCk7XG4gICAgICBlbWl0KGpzb25pZnkoci50YXJnZXQpKTtcblxuICAgICAgZnVuY3Rpb24gZW1pdFJlbWFpbmluZygpOiB2b2lkIHtcbiAgICAgICAgaWYgKHJlbWFpbmluZ0ZhaWx1cmVzLnNpemUgPiAwKSB7XG4gICAgICAgICAgZW1pdCgnXFxuJyk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgcmVtYWluaW5nRmFpbHVyZXMpIHtcbiAgICAgICAgICBlbWl0RmFpbHVyZXMociwga2V5KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlY3Vyc2UgdG8gdGhlIGlubmVyIG1hdGNoZXIsIGJ1dCB3aXRoIGEgdHdpc3Q6XG4gICAgICpcbiAgICAgKiBJZiB0aGUgbWF0Y2ggcmVzdWx0IHRhcmdldCB2YWx1ZSBpcyBub3QgdGhlIHNhbWUgYXMgdGhlIGdpdmVuIHZhbHVlLFxuICAgICAqIHRoZW4gdGhlIG1hdGNoZXIgaXMgbWF0Y2hpbmcgYSB0cmFuc2Zvcm1hdGlvbiBvZiB0aGUgZ2l2ZW4gdmFsdWUuXG4gICAgICpcbiAgICAgKiBJbiB0aGF0IGNhc2UsIHJlbmRlciBib3RoLlxuICAgICAqXG4gICAgICogRklYTUU6IEFsbCBvZiB0aGlzIHJlbmRlcmluZyBzaG91bGQgaGF2ZSBiZWVuIGF0IHRoZSBkaXNjcmV0aW9uIG9mXG4gICAgICogdGhlIG1hdGNoZXIsIGl0IHNob3VsZG4ndCBhbGwgbGl2ZSBoZXJlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJlY3Vyc2VDb21wYXJpbmdWYWx1ZXMoaW5uZXI6IE1hdGNoUmVzdWx0LCBhY3R1YWxWYWx1ZTogYW55KTogdm9pZCB7XG4gICAgICBpZiAoaW5uZXIudGFyZ2V0ID09PSBhY3R1YWxWYWx1ZSkge1xuICAgICAgICByZXR1cm4gcmVjdXJzZShpbm5lcik7XG4gICAgICB9XG4gICAgICBlbWl0KHJlbmRlckFicmlkZ2VkKGFjdHVhbFZhbHVlKSk7XG4gICAgICBlbWl0KCcgPCo+ICcpO1xuICAgICAgcmVjdXJzZShpbm5lcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVuZGVyIGFuIGFicmlkZ2VkIHZlcnNpb24gb2YgYSB2YWx1ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJlbmRlckFicmlkZ2VkKHg6IGFueSk6IHN0cmluZyB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheSh4KSkge1xuICAgICAgICBzd2l0Y2ggKHgubGVuZ3RoKSB7XG4gICAgICAgICAgY2FzZSAwOiByZXR1cm4gJ1tdJztcbiAgICAgICAgICBjYXNlIDE6IHJldHVybiBgWyAke3JlbmRlckFicmlkZ2VkKHhbMF0pfSBdYDtcbiAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAvLyBSZW5kZXIgaWYgYWxsIHZhbHVlcyBhcmUgc2NhbGFyc1xuICAgICAgICAgICAgaWYgKHguZXZlcnkoZSA9PiBbJ251bWJlcicsICdib29sZWFuJywgJ3N0cmluZyddLmluY2x1ZGVzKHR5cGVvZiBlKSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGBbICR7eC5tYXAocmVuZGVyQWJyaWRnZWQpLmpvaW4oJywgJyl9IF1gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuICdbIC4uLiBdJztcbiAgICAgICAgICBkZWZhdWx0OiByZXR1cm4gJ1sgLi4uIF0nO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoeCAmJiB0eXBlb2YgeCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHgpO1xuICAgICAgICBzd2l0Y2ggKGtleXMubGVuZ3RoKSB7XG4gICAgICAgICAgY2FzZSAwOiByZXR1cm4gJ3t9JztcbiAgICAgICAgICBjYXNlIDE6IHJldHVybiBgeyAke0pTT04uc3RyaW5naWZ5KGtleXNbMF0pfTogJHtyZW5kZXJBYnJpZGdlZCh4W2tleXNbMF1dKX0gfWA7XG4gICAgICAgICAgZGVmYXVsdDogcmV0dXJuICd7IC4uLiB9JztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGpzb25pZnkoeCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24ganNvbmlmeSh4OiBhbnkpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHgpID8/ICd1bmRlZmluZWQnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE1vdmUgbWFya2VycyB0byB0aGUgZnJvbnQgb2YgZWFjaCBsaW5lXG4gICAgICovXG4gICAgZnVuY3Rpb24gbW92ZU1hcmtlcnNUb0Zyb250KHg6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICBjb25zdCByZSA9IC9eKFxccyspISEvZ207XG4gICAgICByZXR1cm4geC5yZXBsYWNlKHJlLCAoXywgc3BhY2VzOiBzdHJpbmcpID0+IGAhISR7c3BhY2VzLnN1YnN0cmluZygwLCBzcGFjZXMubGVuZ3RoIC0gMikgfWApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZWNvcmQgYSBjYXB0dXJlIGFnYWluc3QgaW4gdGhpcyBtYXRjaCByZXN1bHQuXG4gICAqL1xuICBwdWJsaWMgcmVjb3JkQ2FwdHVyZShvcHRpb25zOiBNYXRjaENhcHR1cmUpOiB2b2lkIHtcbiAgICBsZXQgdmFsdWVzID0gdGhpcy5jYXB0dXJlcy5nZXQob3B0aW9ucy5jYXB0dXJlKTtcbiAgICBpZiAodmFsdWVzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbHVlcyA9IFtdO1xuICAgIH1cbiAgICB2YWx1ZXMucHVzaChvcHRpb25zLnZhbHVlKTtcbiAgICB0aGlzLmNhcHR1cmVzLnNldChvcHRpb25zLmNhcHR1cmUsIHZhbHVlcyk7XG4gIH1cbn1cblxuZnVuY3Rpb24qIHJhbmdlKG46IG51bWJlcik6IEl0ZXJhYmxlPG51bWJlcj4ge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkrKykge1xuICAgIHlpZWxkIGk7XG4gIH1cbn1cblxuZnVuY3Rpb24qIGVudW1GaXJzdDxBPih4czogSXRlcmFibGU8QT4pOiBJdGVyYWJsZTxbYm9vbGVhbiwgQV0+IHtcbiAgbGV0IGZpcnN0ID0gdHJ1ZTtcbiAgZm9yIChjb25zdCB4IG9mIHhzKSB7XG4gICAgeWllbGQgW2ZpcnN0LCB4XTtcbiAgICBmaXJzdCA9IGZhbHNlO1xuICB9XG59Il19