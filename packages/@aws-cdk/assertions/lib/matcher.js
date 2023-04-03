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
exports.Matcher = Matcher;
_a = JSII_RTTI_SYMBOL_1;
Matcher[_a] = { fqn: "@aws-cdk/assertions.Matcher", version: "0.0.0" };
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
exports.MatchResult = MatchResult;
_b = JSII_RTTI_SYMBOL_1;
MatchResult[_b] = { fqn: "@aws-cdk/assertions.MatchResult", version: "0.0.0" };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0Y2hlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1hdGNoZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUE7OztHQUdHO0FBQ0gsTUFBc0IsT0FBTztJQUMzQjs7T0FFRztJQUNJLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBTTtRQUM1QixPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksT0FBTyxDQUFDO0tBQ2xDOztBQU5ILDBCQXFCQzs7O0FBOENEOztHQUVHO0FBQ0gsTUFBYSxXQUFXO0lBYXRCLFlBQVksTUFBVztRQVJOLGlCQUFZLEdBQUcsSUFBSSxHQUFHLEVBQTBCLENBQUM7UUFDakQsYUFBUSxHQUF3QixJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ25ELGNBQVMsR0FBWSxLQUFLLENBQUM7UUFDbEIsdUJBQWtCLEdBQUcsSUFBSSxHQUFHLEVBQXVCLENBQUM7UUFDN0QsZUFBVSxHQUFHLEtBQUssQ0FBQztRQUNuQixlQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ2YsVUFBSyxHQUFHLENBQUMsQ0FBQztRQUdoQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztLQUN0QjtJQUVEOzs7T0FHRztJQUNJLElBQUksQ0FBQyxPQUFnQixFQUFFLElBQWMsRUFBRSxPQUFlOzs7Ozs7Ozs7OztRQUMzRCxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7S0FDdkQ7SUFFRDs7T0FFRztJQUNJLGFBQWEsQ0FBQyxPQUFxQjs7Ozs7Ozs7OztRQUN4QyxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2QyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMxQyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1QsSUFBSSxHQUFHLEVBQUUs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QUMsS0FBSyxDQUFDLENBQUM7UUFDM0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztLQUM1Qzs7QUFyVEgsa0NBc1RDOzs7QUFFRCxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBUztJQUN2QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzFCLE1BQU0sQ0FBQyxDQUFDO0tBQ1Q7QUFDSCxDQUFDO0FBRUQsUUFBUSxDQUFDLENBQUMsU0FBUyxDQUFJLEVBQWU7SUFDcEMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBQ2pCLEtBQUssTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFO1FBQ2xCLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDakIsS0FBSyxHQUFHLEtBQUssQ0FBQztLQUNmO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENhcHR1cmUgfSBmcm9tICcuL2NhcHR1cmUnO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBtYXRjaGVyIHRoYXQgY2FuIHBlcmZvcm0gc3BlY2lhbCBkYXRhIG1hdGNoaW5nXG4gKiBjYXBhYmlsaXRpZXMgYmV0d2VlbiBhIGdpdmVuIHBhdHRlcm4gYW5kIGEgdGFyZ2V0LlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTWF0Y2hlciB7XG4gIC8qKlxuICAgKiBDaGVjayB3aGV0aGVyIHRoZSBwcm92aWRlZCBvYmplY3QgaXMgYSBzdWJ0eXBlIG9mIHRoZSBgSU1hdGNoZXJgLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBpc01hdGNoZXIoeDogYW55KTogeCBpcyBNYXRjaGVyIHtcbiAgICByZXR1cm4geCAmJiB4IGluc3RhbmNlb2YgTWF0Y2hlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIG5hbWUgZm9yIHRoZSBtYXRjaGVyLiBUaGlzIGlzIGNvbGxlY3RlZCBhcyBwYXJ0IG9mIHRoZSByZXN1bHQgYW5kIG1heSBiZSBwcmVzZW50ZWQgdG8gdGhlIHVzZXIuXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUZXN0IHdoZXRoZXIgYSB0YXJnZXQgbWF0Y2hlcyB0aGUgcHJvdmlkZWQgcGF0dGVybi5cbiAgICogRXZlcnkgTWF0Y2hlciBtdXN0IGltcGxlbWVudCB0aGlzIG1ldGhvZC5cbiAgICogVGhpcyBtZXRob2Qgd2lsbCBiZSBpbnZva2VkIGJ5IHRoZSBhc3NlcnRpb25zIGZyYW1ld29yay4gRG8gbm90IGNhbGwgdGhpcyBtZXRob2QgZGlyZWN0bHkuXG4gICAqIEBwYXJhbSBhY3R1YWwgdGhlIHRhcmdldCB0byBtYXRjaFxuICAgKiBAcmV0dXJuIHRoZSBsaXN0IG9mIG1hdGNoIGZhaWx1cmVzLiBBbiBlbXB0eSBhcnJheSBkZW5vdGVzIGEgc3VjY2Vzc2Z1bCBtYXRjaC5cbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCB0ZXN0KGFjdHVhbDogYW55KTogTWF0Y2hSZXN1bHQ7XG59XG5cbi8qKlxuICogTWF0Y2ggZmFpbHVyZSBkZXRhaWxzXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0Y2hGYWlsdXJlIHtcbiAgLyoqXG4gICAqIFRoZSBtYXRjaGVyIHRoYXQgaGFkIHRoZSBmYWlsdXJlXG4gICAqL1xuICByZWFkb25seSBtYXRjaGVyOiBNYXRjaGVyO1xuXG4gIC8qKlxuICAgKiBUaGUgcmVsYXRpdmUgcGF0aCBpbiB0aGUgdGFyZ2V0IHdoZXJlIHRoZSBmYWlsdXJlIG9jY3VycmVkLlxuICAgKiBJZiB0aGUgZmFpbHVyZSBvY2N1cnJlZCBhdCByb290IG9mIHRoZSBtYXRjaCB0cmVlLCBzZXQgdGhlIHBhdGggdG8gYW4gZW1wdHkgbGlzdC5cbiAgICogSWYgaXQgb2NjdXJzIGluIHRoZSA1dGggaW5kZXggb2YgYW4gYXJyYXkgbmVzdGVkIHdpdGhpbiB0aGUgJ2Zvbycga2V5IG9mIGFuIG9iamVjdCxcbiAgICogc2V0IHRoZSBwYXRoIGFzIGBbJy9mb28nLCAnWzVdJ11gLlxuICAgKi9cbiAgcmVhZG9ubHkgcGF0aDogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIEZhaWx1cmUgbWVzc2FnZVxuICAgKi9cbiAgcmVhZG9ubHkgbWVzc2FnZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgY29zdCBvZiB0aGlzIHBhcnRpY3VsYXIgbWlzbWF0Y2hcbiAgICpcbiAgICogQGRlZmF1bHQgMVxuICAgKi9cbiAgcmVhZG9ubHkgY29zdD86IG51bWJlcjtcbn1cblxuLyoqXG4gKiBJbmZvcm1hdGlvbiBhYm91dCBhIHZhbHVlIGNhcHR1cmVkIGR1cmluZyBtYXRjaFxuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdGNoQ2FwdHVyZSB7XG4gIC8qKlxuICAgKiBUaGUgaW5zdGFuY2Ugb2YgQ2FwdHVyZSBjbGFzcyB0byB3aGljaCB0aGlzIGNhcHR1cmUgaXMgYXNzb2NpYXRlZCB3aXRoLlxuICAgKi9cbiAgcmVhZG9ubHkgY2FwdHVyZTogQ2FwdHVyZTtcbiAgLyoqXG4gICAqIFRoZSB2YWx1ZSB0aGF0IHdhcyBjYXB0dXJlZFxuICAgKi9cbiAgcmVhZG9ubHkgdmFsdWU6IGFueTtcbn1cblxuLyoqXG4gKiBUaGUgcmVzdWx0IG9mIGBNYXRjaC50ZXN0KClgLlxuICovXG5leHBvcnQgY2xhc3MgTWF0Y2hSZXN1bHQge1xuICAvKipcbiAgICogVGhlIHRhcmdldCBmb3Igd2hpY2ggdGhpcyByZXN1bHQgd2FzIGdlbmVyYXRlZC5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB0YXJnZXQ6IGFueTtcbiAgcHJpdmF0ZSByZWFkb25seSBmYWlsdXJlc0hlcmUgPSBuZXcgTWFwPHN0cmluZywgTWF0Y2hGYWlsdXJlW10+KCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgY2FwdHVyZXM6IE1hcDxDYXB0dXJlLCBhbnlbXT4gPSBuZXcgTWFwKCk7XG4gIHByaXZhdGUgZmluYWxpemVkOiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgcmVhZG9ubHkgaW5uZXJNYXRjaEZhaWx1cmVzID0gbmV3IE1hcDxzdHJpbmcsIE1hdGNoUmVzdWx0PigpO1xuICBwcml2YXRlIF9oYXNGYWlsZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfZmFpbENvdW50ID0gMDtcbiAgcHJpdmF0ZSBfY29zdCA9IDA7XG5cbiAgY29uc3RydWN0b3IodGFyZ2V0OiBhbnkpIHtcbiAgICB0aGlzLnRhcmdldCA9IHRhcmdldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBERVBSRUNBVEVEXG4gICAqIEBkZXByZWNhdGVkIHVzZSByZWNvcmRGYWlsdXJlKClcbiAgICovXG4gIHB1YmxpYyBwdXNoKG1hdGNoZXI6IE1hdGNoZXIsIHBhdGg6IHN0cmluZ1tdLCBtZXNzYWdlOiBzdHJpbmcpOiB0aGlzIHtcbiAgICByZXR1cm4gdGhpcy5yZWNvcmRGYWlsdXJlKHsgbWF0Y2hlciwgcGF0aCwgbWVzc2FnZSB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWNvcmQgYSBuZXcgZmFpbHVyZSBpbnRvIHRoaXMgcmVzdWx0IGF0IGEgc3BlY2lmaWMgcGF0aC5cbiAgICovXG4gIHB1YmxpYyByZWNvcmRGYWlsdXJlKGZhaWx1cmU6IE1hdGNoRmFpbHVyZSk6IHRoaXMge1xuICAgIGNvbnN0IGZhaWxLZXkgPSBmYWlsdXJlLnBhdGguam9pbignLicpO1xuICAgIGxldCBsaXN0ID0gdGhpcy5mYWlsdXJlc0hlcmUuZ2V0KGZhaWxLZXkpO1xuICAgIGlmICghbGlzdCkge1xuICAgICAgbGlzdCA9IFtdO1xuICAgICAgdGhpcy5mYWlsdXJlc0hlcmUuc2V0KGZhaWxLZXksIGxpc3QpO1xuICAgIH1cblxuICAgIHRoaXMuX2ZhaWxDb3VudCArPSAxO1xuICAgIHRoaXMuX2Nvc3QgKz0gZmFpbHVyZS5jb3N0ID8/IDE7XG4gICAgbGlzdC5wdXNoKGZhaWx1cmUpO1xuICAgIHRoaXMuX2hhc0ZhaWxlZCA9IHRydWU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgbWF0Y2ggaXMgYSBzdWNjZXNzICovXG4gIHB1YmxpYyBnZXQgaXNTdWNjZXNzKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy5faGFzRmFpbGVkO1xuICB9XG5cbiAgLyoqIERvZXMgdGhlIHJlc3VsdCBjb250YWluIGFueSBmYWlsdXJlcy4gSWYgbm90LCB0aGUgcmVzdWx0IGlzIGEgc3VjY2VzcyAqL1xuICBwdWJsaWMgaGFzRmFpbGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9oYXNGYWlsZWQ7XG4gIH1cblxuICAvKiogVGhlIG51bWJlciBvZiBmYWlsdXJlcyAqL1xuICBwdWJsaWMgZ2V0IGZhaWxDb3VudCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9mYWlsQ291bnQ7XG4gIH1cblxuICAvKiogVGhlIGNvc3Qgb2YgdGhlIGZhaWx1cmVzIHNvIGZhciAqL1xuICBwdWJsaWMgZ2V0IGZhaWxDb3N0KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2Nvc3Q7XG4gIH1cblxuICAvKipcbiAgICogQ29tcG9zZSB0aGUgcmVzdWx0cyBvZiBhIHByZXZpb3VzIG1hdGNoIGFzIGEgc3VidHJlZS5cbiAgICogQHBhcmFtIGlkIHRoZSBpZCBvZiB0aGUgcGFyZW50IHRyZWUuXG4gICAqL1xuICBwdWJsaWMgY29tcG9zZShpZDogc3RyaW5nLCBpbm5lcjogTWF0Y2hSZXN1bHQpOiB0aGlzIHtcbiAgICAvLyBSZWNvcmQgaW5uZXIgZmFpbHVyZVxuICAgIGlmIChpbm5lci5oYXNGYWlsZWQoKSkge1xuICAgICAgdGhpcy5faGFzRmFpbGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2ZhaWxDb3VudCArPSBpbm5lci5mYWlsQ291bnQ7XG4gICAgICB0aGlzLl9jb3N0ICs9IGlubmVyLl9jb3N0O1xuICAgICAgdGhpcy5pbm5lck1hdGNoRmFpbHVyZXMuc2V0KGlkLCBpbm5lcik7XG4gICAgfVxuXG4gICAgLy8gQ29weSBjYXB0dXJlcyBzbyB3ZSBhbGwgZmluYWxpemUgdGhlbSB0b2dldGhlclxuICAgIGlubmVyLmNhcHR1cmVzLmZvckVhY2goKHZhbHMsIGNhcHR1cmUpID0+IHtcbiAgICAgIHZhbHMuZm9yRWFjaCh2YWx1ZSA9PiB0aGlzLnJlY29yZENhcHR1cmUoeyBjYXB0dXJlLCB2YWx1ZSB9KSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogUHJlcGFyZSB0aGUgcmVzdWx0IHRvIGJlIGFuYWx5emVkLlxuICAgKiBUaGlzIEFQSSAqbXVzdCogYmUgY2FsbGVkIHByaW9yIHRvIGFuYWx5emluZyB0aGVzZSByZXN1bHRzLlxuICAgKi9cbiAgcHVibGljIGZpbmlzaGVkKCk6IHRoaXMge1xuICAgIGlmICh0aGlzLmZpbmFsaXplZCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZmFpbENvdW50ID09PSAwKSB7XG4gICAgICB0aGlzLmNhcHR1cmVzLmZvckVhY2goKHZhbHMsIGNhcCkgPT4gY2FwLl9jYXB0dXJlZC5wdXNoKC4uLnZhbHMpKTtcbiAgICB9XG4gICAgdGhpcy5maW5hbGl6ZWQgPSB0cnVlO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgZmFpbGVkIG1hdGNoIGluIGEgcHJlc2VudGFibGUgd2F5XG4gICAqXG4gICAqIFByZWZlciB1c2luZyBgcmVuZGVyTWlzbWF0Y2hgIG92ZXIgdGhpcyBtZXRob2QuIEl0IGlzIGxlZnQgZm9yIGJhY2t3YXJkc1xuICAgKiBjb21wYXRpYmlsaXR5IGZvciB0ZXN0IHN1aXRlcyB0aGF0IGV4cGVjdCBpdCwgYnV0IGByZW5kZXJNaXNtYXRjaCgpYCB3aWxsXG4gICAqIHByb2R1Y2UgYmV0dGVyIG91dHB1dC5cbiAgICovXG4gIHB1YmxpYyB0b0h1bWFuU3RyaW5ncygpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgZmFpbHVyZXMgPSBuZXcgQXJyYXk8TWF0Y2hGYWlsdXJlPigpO1xuICAgIGRlYnVnZ2VyO1xuICAgIHJlY3Vyc2UodGhpcywgW10pO1xuXG4gICAgcmV0dXJuIGZhaWx1cmVzLm1hcChyID0+IHtcbiAgICAgIGNvbnN0IGxvYyA9IHIucGF0aC5sZW5ndGggPT09IDAgPyAnJyA6IGAgYXQgLyR7ci5wYXRoLmpvaW4oJy8nKX1gO1xuICAgICAgcmV0dXJuICcnICsgci5tZXNzYWdlICsgbG9jICsgYCAodXNpbmcgJHtyLm1hdGNoZXIubmFtZX0gbWF0Y2hlcilgO1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gcmVjdXJzZSh4OiBNYXRjaFJlc3VsdCwgcHJlZml4OiBzdHJpbmdbXSk6IHZvaWQge1xuICAgICAgZm9yIChjb25zdCBmYWlsIG9mIEFycmF5LmZyb20oeC5mYWlsdXJlc0hlcmUudmFsdWVzKCkpLmZsYXQoKSkge1xuICAgICAgICBmYWlsdXJlcy5wdXNoKHtcbiAgICAgICAgICBtYXRjaGVyOiBmYWlsLm1hdGNoZXIsXG4gICAgICAgICAgbWVzc2FnZTogZmFpbC5tZXNzYWdlLFxuICAgICAgICAgIHBhdGg6IFsuLi5wcmVmaXgsIC4uLmZhaWwucGF0aF0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgZm9yIChjb25zdCBba2V5LCBpbm5lcl0gb2YgeC5pbm5lck1hdGNoRmFpbHVyZXMuZW50cmllcygpKSB7XG4gICAgICAgIHJlY3Vyc2UoaW5uZXIsIFsuLi5wcmVmaXgsIGtleV0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEbyBhIGRlZXAgcmVuZGVyIG9mIHRoZSBtYXRjaCByZXN1bHQsIHNob3dpbmcgdGhlIHN0cnVjdHVyZSBtaXNtYXRjaGVzIGluIGNvbnRleHRcbiAgICovXG4gIHB1YmxpYyByZW5kZXJNaXNtYXRjaCgpOiBzdHJpbmcge1xuICAgIGlmICghdGhpcy5oYXNGYWlsZWQoKSkge1xuICAgICAgcmV0dXJuICc8bWF0Y2g+JztcbiAgICB9XG5cbiAgICBjb25zdCBwYXJ0cyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG4gICAgY29uc3QgaW5kZW50cyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG4gICAgZW1pdEZhaWx1cmVzKHRoaXMsICcnKTtcbiAgICByZWN1cnNlKHRoaXMpO1xuICAgIHJldHVybiBtb3ZlTWFya2Vyc1RvRnJvbnQocGFydHMuam9pbignJykudHJpbUVuZCgpKTtcblxuICAgIC8vIEltcGxlbWVudGF0aW9uIHN0YXJ0cyBoZXJlLlxuICAgIC8vIFllcyB0aGlzIGlzIGEgbG90IG9mIGNvZGUgaW4gb25lIHBsYWNlLiBUaGF0J3MgYSBiaXQgdW5mb3J0dW5hdGUsIGJ1dCB0aGlzIGlzXG4gICAgLy8gdGhlIHNpbXBsZXN0IHdheSB0byBhY2Nlc3MgcHJpdmF0ZSBzdGF0ZSBvZiB0aGUgTWF0Y2hSZXN1bHQsIHRoYXQgd2UgZGVmaW5pdGVseVxuICAgIC8vIGRvIE5PVCB3YW50IHRvIG1ha2UgcGFydCBvZiB0aGUgcHVibGljIEFQSS5cblxuICAgIGZ1bmN0aW9uIGVtaXQoeDogc3RyaW5nKTogdm9pZCB7XG4gICAgICBpZiAoeCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGRlYnVnZ2VyO1xuICAgICAgfVxuICAgICAgcGFydHMucHVzaCh4LnJlcGxhY2UoL1xcbi9nLCBgXFxuJHtpbmRlbnRzLmpvaW4oJycpfWApKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlbWl0RmFpbHVyZXMocjogTWF0Y2hSZXN1bHQsIHBhdGg6IHN0cmluZywgc2NyYXBTZXQ/OiBTZXQ8c3RyaW5nPik6IHZvaWQge1xuICAgICAgZm9yIChjb25zdCBmYWlsIG9mIHIuZmFpbHVyZXNIZXJlLmdldChwYXRoKSA/PyBbXSkge1xuICAgICAgICBlbWl0KGAhISAke2ZhaWwubWVzc2FnZX1cXG5gKTtcbiAgICAgIH1cbiAgICAgIHNjcmFwU2V0Py5kZWxldGUocGF0aCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVjdXJzZShyOiBNYXRjaFJlc3VsdCk6IHZvaWQge1xuICAgICAgLy8gRmFpbHVyZXMgdGhhdCBoYXZlIGJlZW4gcmVwb3J0ZWQgYWdhaW5zdCB0aGlzIE1hdGNoUmVzdWx0IHRoYXQgd2UgZGlkbid0IHByaW50IHlldFxuICAgICAgY29uc3QgcmVtYWluaW5nRmFpbHVyZXMgPSBuZXcgU2V0KEFycmF5LmZyb20oci5mYWlsdXJlc0hlcmUua2V5cygpKS5maWx0ZXIoeCA9PiB4ICE9PSAnJykpO1xuXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShyLnRhcmdldCkpIHtcbiAgICAgICAgaW5kZW50cy5wdXNoKCcgICcpO1xuICAgICAgICBlbWl0KCdbXFxuJyk7XG4gICAgICAgIGZvciAoY29uc3QgW2ZpcnN0LCBpXSBvZiBlbnVtRmlyc3QocmFuZ2Uoci50YXJnZXQubGVuZ3RoKSkpIHtcbiAgICAgICAgICBpZiAoIWZpcnN0KSB7IGVtaXQoJyxcXG4nKTsgfVxuXG4gICAgICAgICAgZW1pdEZhaWx1cmVzKHIsIGAke2l9YCwgcmVtYWluaW5nRmFpbHVyZXMpO1xuICAgICAgICAgIGNvbnN0IGlubmVyTWF0Y2hlciA9IHIuaW5uZXJNYXRjaEZhaWx1cmVzLmdldChgJHtpfWApO1xuICAgICAgICAgIGlmIChpbm5lck1hdGNoZXIpIHtcbiAgICAgICAgICAgIC8vIFJlcG9ydCB0aGUgdG9wLWxldmVsIGZhaWx1cmVzIG9uIHRoZSBsaW5lIGJlZm9yZSB0aGUgY29udGVudFxuICAgICAgICAgICAgZW1pdEZhaWx1cmVzKGlubmVyTWF0Y2hlciwgJycpO1xuICAgICAgICAgICAgcmVjdXJzZUNvbXBhcmluZ1ZhbHVlcyhpbm5lck1hdGNoZXIsIHIudGFyZ2V0W2ldKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZW1pdChyZW5kZXJBYnJpZGdlZChyLnRhcmdldFtpXSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGVtaXRSZW1haW5pbmcoKTtcbiAgICAgICAgaW5kZW50cy5wb3AoKTtcbiAgICAgICAgZW1pdCgnXFxuXScpO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgaWYgKHIudGFyZ2V0ICYmIHR5cGVvZiByLnRhcmdldCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgaW5kZW50cy5wdXNoKCcgICcpO1xuICAgICAgICBlbWl0KCd7XFxuJyk7XG4gICAgICAgIGNvbnN0IGtleXMgPSBBcnJheS5mcm9tKG5ldyBTZXQoW1xuICAgICAgICAgIC4uLk9iamVjdC5rZXlzKHIudGFyZ2V0KSxcbiAgICAgICAgICAuLi5BcnJheS5mcm9tKHJlbWFpbmluZ0ZhaWx1cmVzKSxcbiAgICAgICAgXSkpLnNvcnQoKTtcblxuICAgICAgICBmb3IgKGNvbnN0IFtmaXJzdCwga2V5XSBvZiBlbnVtRmlyc3Qoa2V5cykpIHtcbiAgICAgICAgICBpZiAoIWZpcnN0KSB7IGVtaXQoJyxcXG4nKTsgfVxuXG4gICAgICAgICAgZW1pdEZhaWx1cmVzKHIsIGtleSwgcmVtYWluaW5nRmFpbHVyZXMpO1xuICAgICAgICAgIGNvbnN0IGlubmVyTWF0Y2hlciA9IHIuaW5uZXJNYXRjaEZhaWx1cmVzLmdldChrZXkpO1xuICAgICAgICAgIGlmIChpbm5lck1hdGNoZXIpIHtcbiAgICAgICAgICAgIC8vIFJlcG9ydCB0aGUgdG9wLWxldmVsIGZhaWx1cmVzIG9uIHRoZSBsaW5lIGJlZm9yZSB0aGUgY29udGVudFxuICAgICAgICAgICAgZW1pdEZhaWx1cmVzKGlubmVyTWF0Y2hlciwgJycpO1xuICAgICAgICAgICAgZW1pdChgJHtqc29uaWZ5KGtleSl9OiBgKTtcbiAgICAgICAgICAgIHJlY3Vyc2VDb21wYXJpbmdWYWx1ZXMoaW5uZXJNYXRjaGVyLCByLnRhcmdldFtrZXldKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZW1pdChgJHtqc29uaWZ5KGtleSl9OiBgKTtcbiAgICAgICAgICAgIGVtaXQocmVuZGVyQWJyaWRnZWQoci50YXJnZXRba2V5XSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGVtaXRSZW1haW5pbmcoKTtcbiAgICAgICAgaW5kZW50cy5wb3AoKTtcbiAgICAgICAgZW1pdCgnXFxufScpO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgZW1pdFJlbWFpbmluZygpO1xuICAgICAgZW1pdChqc29uaWZ5KHIudGFyZ2V0KSk7XG5cbiAgICAgIGZ1bmN0aW9uIGVtaXRSZW1haW5pbmcoKTogdm9pZCB7XG4gICAgICAgIGlmIChyZW1haW5pbmdGYWlsdXJlcy5zaXplID4gMCkge1xuICAgICAgICAgIGVtaXQoJ1xcbicpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3Qga2V5IG9mIHJlbWFpbmluZ0ZhaWx1cmVzKSB7XG4gICAgICAgICAgZW1pdEZhaWx1cmVzKHIsIGtleSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWN1cnNlIHRvIHRoZSBpbm5lciBtYXRjaGVyLCBidXQgd2l0aCBhIHR3aXN0OlxuICAgICAqXG4gICAgICogSWYgdGhlIG1hdGNoIHJlc3VsdCB0YXJnZXQgdmFsdWUgaXMgbm90IHRoZSBzYW1lIGFzIHRoZSBnaXZlbiB2YWx1ZSxcbiAgICAgKiB0aGVuIHRoZSBtYXRjaGVyIGlzIG1hdGNoaW5nIGEgdHJhbnNmb3JtYXRpb24gb2YgdGhlIGdpdmVuIHZhbHVlLlxuICAgICAqXG4gICAgICogSW4gdGhhdCBjYXNlLCByZW5kZXIgYm90aC5cbiAgICAgKlxuICAgICAqIEZJWE1FOiBBbGwgb2YgdGhpcyByZW5kZXJpbmcgc2hvdWxkIGhhdmUgYmVlbiBhdCB0aGUgZGlzY3JldGlvbiBvZlxuICAgICAqIHRoZSBtYXRjaGVyLCBpdCBzaG91bGRuJ3QgYWxsIGxpdmUgaGVyZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiByZWN1cnNlQ29tcGFyaW5nVmFsdWVzKGlubmVyOiBNYXRjaFJlc3VsdCwgYWN0dWFsVmFsdWU6IGFueSk6IHZvaWQge1xuICAgICAgaWYgKGlubmVyLnRhcmdldCA9PT0gYWN0dWFsVmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHJlY3Vyc2UoaW5uZXIpO1xuICAgICAgfVxuICAgICAgZW1pdChyZW5kZXJBYnJpZGdlZChhY3R1YWxWYWx1ZSkpO1xuICAgICAgZW1pdCgnIDwqPiAnKTtcbiAgICAgIHJlY3Vyc2UoaW5uZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbmRlciBhbiBhYnJpZGdlZCB2ZXJzaW9uIG9mIGEgdmFsdWVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiByZW5kZXJBYnJpZGdlZCh4OiBhbnkpOiBzdHJpbmcge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoeCkpIHtcbiAgICAgICAgc3dpdGNoICh4Lmxlbmd0aCkge1xuICAgICAgICAgIGNhc2UgMDogcmV0dXJuICdbXSc7XG4gICAgICAgICAgY2FzZSAxOiByZXR1cm4gYFsgJHtyZW5kZXJBYnJpZGdlZCh4WzBdKX0gXWA7XG4gICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgLy8gUmVuZGVyIGlmIGFsbCB2YWx1ZXMgYXJlIHNjYWxhcnNcbiAgICAgICAgICAgIGlmICh4LmV2ZXJ5KGUgPT4gWydudW1iZXInLCAnYm9vbGVhbicsICdzdHJpbmcnXS5pbmNsdWRlcyh0eXBlb2YgZSkpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBgWyAke3gubWFwKHJlbmRlckFicmlkZ2VkKS5qb2luKCcsICcpfSBdYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAnWyAuLi4gXSc7XG4gICAgICAgICAgZGVmYXVsdDogcmV0dXJuICdbIC4uLiBdJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHggJiYgdHlwZW9mIHggPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyh4KTtcbiAgICAgICAgc3dpdGNoIChrZXlzLmxlbmd0aCkge1xuICAgICAgICAgIGNhc2UgMDogcmV0dXJuICd7fSc7XG4gICAgICAgICAgY2FzZSAxOiByZXR1cm4gYHsgJHtKU09OLnN0cmluZ2lmeShrZXlzWzBdKX06ICR7cmVuZGVyQWJyaWRnZWQoeFtrZXlzWzBdXSl9IH1gO1xuICAgICAgICAgIGRlZmF1bHQ6IHJldHVybiAneyAuLi4gfSc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBqc29uaWZ5KHgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGpzb25pZnkoeDogYW55KTogc3RyaW5nIHtcbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh4KSA/PyAndW5kZWZpbmVkJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNb3ZlIG1hcmtlcnMgdG8gdGhlIGZyb250IG9mIGVhY2ggbGluZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG1vdmVNYXJrZXJzVG9Gcm9udCh4OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgY29uc3QgcmUgPSAvXihcXHMrKSEhL2dtO1xuICAgICAgcmV0dXJuIHgucmVwbGFjZShyZSwgKF8sIHNwYWNlczogc3RyaW5nKSA9PiBgISEke3NwYWNlcy5zdWJzdHJpbmcoMCwgc3BhY2VzLmxlbmd0aCAtIDIpIH1gKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVjb3JkIGEgY2FwdHVyZSBhZ2FpbnN0IGluIHRoaXMgbWF0Y2ggcmVzdWx0LlxuICAgKi9cbiAgcHVibGljIHJlY29yZENhcHR1cmUob3B0aW9uczogTWF0Y2hDYXB0dXJlKTogdm9pZCB7XG4gICAgbGV0IHZhbHVlcyA9IHRoaXMuY2FwdHVyZXMuZ2V0KG9wdGlvbnMuY2FwdHVyZSk7XG4gICAgaWYgKHZhbHVlcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWx1ZXMgPSBbXTtcbiAgICB9XG4gICAgdmFsdWVzLnB1c2gob3B0aW9ucy52YWx1ZSk7XG4gICAgdGhpcy5jYXB0dXJlcy5zZXQob3B0aW9ucy5jYXB0dXJlLCB2YWx1ZXMpO1xuICB9XG59XG5cbmZ1bmN0aW9uKiByYW5nZShuOiBudW1iZXIpOiBJdGVyYWJsZTxudW1iZXI+IHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyBpKyspIHtcbiAgICB5aWVsZCBpO1xuICB9XG59XG5cbmZ1bmN0aW9uKiBlbnVtRmlyc3Q8QT4oeHM6IEl0ZXJhYmxlPEE+KTogSXRlcmFibGU8W2Jvb2xlYW4sIEFdPiB7XG4gIGxldCBmaXJzdCA9IHRydWU7XG4gIGZvciAoY29uc3QgeCBvZiB4cykge1xuICAgIHlpZWxkIFtmaXJzdCwgeF07XG4gICAgZmlyc3QgPSBmYWxzZTtcbiAgfVxufSJdfQ==