"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.annotateMatcher = exports.matcherFrom = exports.encodedJson = exports.Capture = exports.notMatching = exports.anything = exports.stringLike = exports.match = exports.failMatcher = exports.arrayWith = exports.exactValue = exports.deepObjectLike = exports.objectLike = void 0;
const have_resource_1 = require("./have-resource");
/**
 * A matcher for an object that contains at least the given fields with the given matchers (or literals)
 *
 * Only does lenient matching one level deep, at the next level all objects must declare the
 * exact expected keys again.
 */
function objectLike(pattern) {
    return _objectContaining(pattern, false);
}
exports.objectLike = objectLike;
/**
 * A matcher for an object that contains at least the given fields with the given matchers (or literals)
 *
 * Switches to "deep" lenient matching. Nested objects also only need to contain declared keys.
 */
function deepObjectLike(pattern) {
    return _objectContaining(pattern, true);
}
exports.deepObjectLike = deepObjectLike;
function _objectContaining(pattern, deep) {
    const anno = { [deep ? '$deepObjectLike' : '$objectLike']: pattern };
    return annotateMatcher(anno, (value, inspection) => {
        if (typeof value !== 'object' || !value) {
            return failMatcher(inspection, `Expect an object but got '${typeof value}'`);
        }
        const errors = new Array();
        for (const [patternKey, patternValue] of Object.entries(pattern)) {
            if (patternValue === have_resource_1.ABSENT) {
                if (value[patternKey] !== undefined) {
                    errors.push(`Field ${patternKey} present, but shouldn't be`);
                }
                continue;
            }
            if (!(patternKey in value)) {
                errors.push(`Field ${patternKey} missing`);
                continue;
            }
            // If we are doing DEEP objectLike, translate object literals in the pattern into
            // more `deepObjectLike` matchers, even if they occur in lists.
            const matchValue = deep ? deepMatcherFromObjectLiteral(patternValue) : patternValue;
            const innerInspection = { ...inspection, failureReason: '' };
            const valueMatches = match(value[patternKey], matchValue, innerInspection);
            if (!valueMatches) {
                errors.push(`Field ${patternKey} mismatch: ${innerInspection.failureReason}`);
            }
        }
        /**
         * Transform nested object literals into more deep object matchers, if applicable
         *
         * Object literals in lists are also transformed.
         */
        function deepMatcherFromObjectLiteral(nestedPattern) {
            if (isObject(nestedPattern)) {
                return deepObjectLike(nestedPattern);
            }
            if (Array.isArray(nestedPattern)) {
                return nestedPattern.map(deepMatcherFromObjectLiteral);
            }
            return nestedPattern;
        }
        if (errors.length > 0) {
            return failMatcher(inspection, errors.join(', '));
        }
        return true;
    });
}
/**
 * Match exactly the given value
 *
 * This is the default, you only need this to escape from the deep lenient matching
 * of `deepObjectLike`.
 */
function exactValue(expected) {
    const anno = { $exactValue: expected };
    return annotateMatcher(anno, (value, inspection) => {
        return matchLiteral(value, expected, inspection);
    });
}
exports.exactValue = exactValue;
/**
 * A matcher for a list that contains all of the given elements in any order
 */
function arrayWith(...elements) {
    if (elements.length === 0) {
        return anything();
    }
    const anno = { $arrayContaining: elements.length === 1 ? elements[0] : elements };
    return annotateMatcher(anno, (value, inspection) => {
        if (!Array.isArray(value)) {
            return failMatcher(inspection, `Expect an array but got '${typeof value}'`);
        }
        for (const element of elements) {
            const failure = longestFailure(value, element);
            if (failure) {
                return failMatcher(inspection, `Array did not contain expected element, closest match at index ${failure[0]}: ${failure[1]}`);
            }
        }
        return true;
        /**
         * Return 'null' if the matcher matches anywhere in the array, otherwise the longest error and its index
         */
        function longestFailure(array, matcher) {
            let fail = null;
            for (let i = 0; i < array.length; i++) {
                const innerInspection = { ...inspection, failureReason: '' };
                if (match(array[i], matcher, innerInspection)) {
                    return null;
                }
                if (fail === null || innerInspection.failureReason.length > fail[1].length) {
                    fail = [i, innerInspection.failureReason];
                }
            }
            return fail;
        }
    });
}
exports.arrayWith = arrayWith;
/**
 * Whether a value is an object
 */
function isObject(x) {
    // Because `typeof null === 'object'`.
    return x && typeof x === 'object';
}
/**
 * Helper function to make matcher failure reporting a little easier
 *
 * Our protocol is weird (change a string on a passed-in object and return 'false'),
 * but I don't want to change that right now.
 */
function failMatcher(inspection, error) {
    inspection.failureReason = error;
    return false;
}
exports.failMatcher = failMatcher;
/**
 * Match a given literal value against a matcher
 *
 * If the matcher is a callable, use that to evaluate the value. Otherwise, the values
 * must be literally the same.
 */
function match(value, matcher, inspection) {
    if (isCallable(matcher)) {
        // Custom matcher (this mostly looks very weird because our `InspectionFailure` signature is weird)
        const innerInspection = { ...inspection, failureReason: '' };
        const result = matcher(value, innerInspection);
        if (typeof result !== 'boolean') {
            return failMatcher(inspection, `Predicate returned non-boolean return value: ${result}`);
        }
        if (!result && !innerInspection.failureReason) {
            // Custom matcher neglected to return an error
            return failMatcher(inspection, 'Predicate returned false');
        }
        // Propagate inner error in case of failure
        if (!result) {
            inspection.failureReason = innerInspection.failureReason;
        }
        return result;
    }
    return matchLiteral(value, matcher, inspection);
}
exports.match = match;
/**
 * Match a literal value at the top level.
 *
 * When recursing into arrays or objects, the nested values can be either matchers
 * or literals.
 */
function matchLiteral(value, pattern, inspection) {
    if (pattern == null) {
        return true;
    }
    const errors = new Array();
    if (Array.isArray(value) !== Array.isArray(pattern)) {
        return failMatcher(inspection, 'Array type mismatch');
    }
    if (Array.isArray(value)) {
        if (pattern.length !== value.length) {
            return failMatcher(inspection, 'Array length mismatch');
        }
        // Recurse comparison for individual objects
        for (let i = 0; i < pattern.length; i++) {
            if (!match(value[i], pattern[i], { ...inspection })) {
                errors.push(`Array element ${i} mismatch`);
            }
        }
        if (errors.length > 0) {
            return failMatcher(inspection, errors.join(', '));
        }
        return true;
    }
    if ((typeof value === 'object') !== (typeof pattern === 'object')) {
        return failMatcher(inspection, 'Object type mismatch');
    }
    if (typeof pattern === 'object') {
        // Check that all fields in the pattern have the right value
        const innerInspection = { ...inspection, failureReason: '' };
        const matcher = objectLike(pattern)(value, innerInspection);
        if (!matcher) {
            inspection.failureReason = innerInspection.failureReason;
            return false;
        }
        // Check no fields uncovered
        const realFields = new Set(Object.keys(value));
        for (const key of Object.keys(pattern)) {
            realFields.delete(key);
        }
        if (realFields.size > 0) {
            return failMatcher(inspection, `Unexpected keys present in object: ${Array.from(realFields).join(', ')}`);
        }
        return true;
    }
    if (value !== pattern) {
        return failMatcher(inspection, 'Different values');
    }
    return true;
}
/**
 * Whether a value is a callable
 */
function isCallable(x) {
    return x && {}.toString.call(x) === '[object Function]';
}
/**
 * Do a glob-like pattern match (which only supports *s). Supports multiline strings.
 */
function stringLike(pattern) {
    // Replace * with .* in the string, escape the rest and brace with ^...$
    const regex = new RegExp(`^${pattern.split('*').map(escapeRegex).join('.*')}$`, 'm');
    return annotateMatcher({ $stringContaining: pattern }, (value, failure) => {
        if (typeof value !== 'string') {
            failure.failureReason = `Expected a string, but got '${typeof value}'`;
            return false;
        }
        if (!regex.test(value)) {
            failure.failureReason = 'String did not match pattern';
            return false;
        }
        return true;
    });
}
exports.stringLike = stringLike;
/**
 * Matches any value
 */
function anything() {
    return annotateMatcher({ $anything: true }, () => true);
}
exports.anything = anything;
/**
 * Negate an inner matcher
 */
function notMatching(matcher) {
    return annotateMatcher({ $notMatching: matcher }, (value, failure) => {
        const result = matcherFrom(matcher)(value, failure);
        if (result) {
            failure.failureReason = 'Should not have matched, but did';
            return false;
        }
        return true;
    });
}
exports.notMatching = notMatching;
/**
 * Captures a value onto an object if it matches a given inner matcher
 *
 * @example
 *
 * const someValue = Capture.aString();
 * expect(stack).toHaveResource({
 *    // ...
 *    Value: someValue.capture(stringMatching('*a*')),
 * });
 * console.log(someValue.capturedValue);
 */
class Capture {
    constructor(typeValidator) {
        this.typeValidator = typeValidator;
        this._didCapture = false;
        this._wasInvoked = false;
    }
    /**
     * A Capture object that captures any type
     */
    static anyType() {
        return new Capture();
    }
    /**
     * A Capture object that captures a string type
     */
    static aString() {
        return new Capture((x) => {
            if (typeof x !== 'string') {
                throw new Error(`Expected to capture a string, got '${x}'`);
            }
            return true;
        });
    }
    /**
     * A Capture object that captures a custom type
     */
    // eslint-disable-next-line @typescript-eslint/no-shadow
    static a(validator) {
        return new Capture(validator);
    }
    /**
     * Capture the value if the inner matcher successfully matches it
     *
     * If no matcher is given, `anything()` is assumed.
     *
     * And exception will be thrown if the inner matcher returns `true` and
     * the value turns out to be of a different type than the `Capture` object
     * is expecting.
     */
    capture(matcher) {
        if (matcher === undefined) {
            matcher = anything();
        }
        return annotateMatcher({ $capture: matcher }, (value, failure) => {
            this._wasInvoked = true;
            const result = matcherFrom(matcher)(value, failure);
            if (result) {
                if (this.typeValidator && !this.typeValidator(value)) {
                    throw new Error(`Value not of the expected type: ${value}`);
                }
                this._didCapture = true;
                this._value = value;
            }
            return result;
        });
    }
    /**
     * Whether a value was successfully captured
     */
    get didCapture() {
        return this._didCapture;
    }
    /**
     * Return the value that was captured
     *
     * Throws an exception if now value was captured
     */
    get capturedValue() {
        // When this module is ported to jsii, the type parameter will obviously
        // have to be dropped and this will have to turn into an `any`.
        if (!this.didCapture) {
            throw new Error(`Did not capture a value: ${this._wasInvoked ? 'inner matcher failed' : 'never invoked'}`);
        }
        return this._value;
    }
}
exports.Capture = Capture;
/**
 * Match on the innards of a JSON string, instead of the complete string
 */
function encodedJson(matcher) {
    return annotateMatcher({ $encodedJson: matcher }, (value, failure) => {
        if (typeof value !== 'string') {
            failure.failureReason = `Expected a string, but got '${typeof value}'`;
            return false;
        }
        let decoded;
        try {
            decoded = JSON.parse(value);
        }
        catch (e) {
            failure.failureReason = `String is not JSON: ${e}`;
            return false;
        }
        return matcherFrom(matcher)(decoded, failure);
    });
}
exports.encodedJson = encodedJson;
function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
/**
 * Make a matcher out of the given argument if it's not a matcher already
 *
 * If it's not a matcher, it will be treated as a literal.
 */
function matcherFrom(matcher) {
    return isCallable(matcher) ? matcher : exactValue(matcher);
}
exports.matcherFrom = matcherFrom;
/**
 * Annotate a matcher with toJSON
 *
 * We will JSON.stringify() values if we have a match failure, but for matchers this
 * would show (in traditional JS fashion) something like '[function Function]', or more
 * accurately nothing at all since functions cannot be JSONified.
 *
 * We override to JSON() in order to produce a readable version of the matcher.
 */
function annotateMatcher(how, matcher) {
    matcher.toJSON = () => how;
    return matcher;
}
exports.annotateMatcher = annotateMatcher;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGF2ZS1yZXNvdXJjZS1tYXRjaGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImhhdmUtcmVzb3VyY2UtbWF0Y2hlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbURBQTZFO0FBRTdFOzs7OztHQUtHO0FBQ0gsU0FBZ0IsVUFBVSxDQUFtQixPQUFVO0lBQ3JELE9BQU8saUJBQWlCLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzNDLENBQUM7QUFGRCxnQ0FFQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFnQixjQUFjLENBQW1CLE9BQVU7SUFDekQsT0FBTyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDMUMsQ0FBQztBQUZELHdDQUVDO0FBRUQsU0FBUyxpQkFBaUIsQ0FBbUIsT0FBVSxFQUFFLElBQWE7SUFDcEUsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDO0lBRXJFLE9BQU8sZUFBZSxDQUFDLElBQUksRUFBRSxDQUFDLEtBQVUsRUFBRSxVQUE2QixFQUFXLEVBQUU7UUFDbEYsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDdkMsT0FBTyxXQUFXLENBQUMsVUFBVSxFQUFFLDZCQUE2QixPQUFPLEtBQUssR0FBRyxDQUFDLENBQUM7U0FDOUU7UUFFRCxNQUFNLE1BQU0sR0FBRyxJQUFJLEtBQUssRUFBVSxDQUFDO1FBRW5DLEtBQUssTUFBTSxDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ2hFLElBQUksWUFBWSxLQUFLLHNCQUFNLEVBQUU7Z0JBQzNCLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLFNBQVMsRUFBRTtvQkFBRSxNQUFNLENB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Q2Q7UUFFRCxPQUFPLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDaEQsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBakJELGtDQWlCQztBQUVELFNBQVMsV0FBVyxDQUFDLENBQVM7SUFDNUIsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLHFCQUFxQixFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsb0NBQW9DO0FBQ3ZGLENBQUM7QUFFRDs7OztHQUlHO0FBQ0gsU0FBZ0IsV0FBVyxDQUFDLE9BQVk7SUFDdEMsT0FBTyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdELENBQUM7QUFGRCxrQ0FFQztBQUVEOzs7Ozs7OztHQVFHO0FBQ0gsU0FBZ0IsZUFBZSxDQUFtQixHQUFNLEVBQUUsT0FBd0I7SUFDL0UsT0FBZSxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUM7SUFDcEMsT0FBTyxPQUFPLENBQUM7QUFDakIsQ0FBQztBQUhELDBDQUdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQUJTRU5ULCBJbnNwZWN0aW9uRmFpbHVyZSwgUHJvcGVydHlNYXRjaGVyIH0gZnJvbSAnLi9oYXZlLXJlc291cmNlJztcblxuLyoqXG4gKiBBIG1hdGNoZXIgZm9yIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIGF0IGxlYXN0IHRoZSBnaXZlbiBmaWVsZHMgd2l0aCB0aGUgZ2l2ZW4gbWF0Y2hlcnMgKG9yIGxpdGVyYWxzKVxuICpcbiAqIE9ubHkgZG9lcyBsZW5pZW50IG1hdGNoaW5nIG9uZSBsZXZlbCBkZWVwLCBhdCB0aGUgbmV4dCBsZXZlbCBhbGwgb2JqZWN0cyBtdXN0IGRlY2xhcmUgdGhlXG4gKiBleGFjdCBleHBlY3RlZCBrZXlzIGFnYWluLlxuICovXG5leHBvcnQgZnVuY3Rpb24gb2JqZWN0TGlrZTxBIGV4dGVuZHMgb2JqZWN0PihwYXR0ZXJuOiBBKTogUHJvcGVydHlNYXRjaGVyIHtcbiAgcmV0dXJuIF9vYmplY3RDb250YWluaW5nKHBhdHRlcm4sIGZhbHNlKTtcbn1cblxuLyoqXG4gKiBBIG1hdGNoZXIgZm9yIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIGF0IGxlYXN0IHRoZSBnaXZlbiBmaWVsZHMgd2l0aCB0aGUgZ2l2ZW4gbWF0Y2hlcnMgKG9yIGxpdGVyYWxzKVxuICpcbiAqIFN3aXRjaGVzIHRvIFwiZGVlcFwiIGxlbmllbnQgbWF0Y2hpbmcuIE5lc3RlZCBvYmplY3RzIGFsc28gb25seSBuZWVkIHRvIGNvbnRhaW4gZGVjbGFyZWQga2V5cy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBPYmplY3RMaWtlPEEgZXh0ZW5kcyBvYmplY3Q+KHBhdHRlcm46IEEpOiBQcm9wZXJ0eU1hdGNoZXIge1xuICByZXR1cm4gX29iamVjdENvbnRhaW5pbmcocGF0dGVybiwgdHJ1ZSk7XG59XG5cbmZ1bmN0aW9uIF9vYmplY3RDb250YWluaW5nPEEgZXh0ZW5kcyBvYmplY3Q+KHBhdHRlcm46IEEsIGRlZXA6IGJvb2xlYW4pOiBQcm9wZXJ0eU1hdGNoZXIge1xuICBjb25zdCBhbm5vID0geyBbZGVlcCA/ICckZGVlcE9iamVjdExpa2UnIDogJyRvYmplY3RMaWtlJ106IHBhdHRlcm4gfTtcblxuICByZXR1cm4gYW5ub3RhdGVNYXRjaGVyKGFubm8sICh2YWx1ZTogYW55LCBpbnNwZWN0aW9uOiBJbnNwZWN0aW9uRmFpbHVyZSk6IGJvb2xlYW4gPT4ge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnIHx8ICF2YWx1ZSkge1xuICAgICAgcmV0dXJuIGZhaWxNYXRjaGVyKGluc3BlY3Rpb24sIGBFeHBlY3QgYW4gb2JqZWN0IGJ1dCBnb3QgJyR7dHlwZW9mIHZhbHVlfSdgKTtcbiAgICB9XG5cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuXG4gICAgZm9yIChjb25zdCBbcGF0dGVybktleSwgcGF0dGVyblZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhwYXR0ZXJuKSkge1xuICAgICAgaWYgKHBhdHRlcm5WYWx1ZSA9PT0gQUJTRU5UKSB7XG4gICAgICAgIGlmICh2YWx1ZVtwYXR0ZXJuS2V5XSAhPT0gdW5kZWZpbmVkKSB7IGVycm9ycy5wdXNoKGBGaWVsZCAke3BhdHRlcm5LZXl9IHByZXNlbnQsIGJ1dCBzaG91bGRuJ3QgYmVgKTsgfVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCEocGF0dGVybktleSBpbiB2YWx1ZSkpIHtcbiAgICAgICAgZXJyb3JzLnB1c2goYEZpZWxkICR7cGF0dGVybktleX0gbWlzc2luZ2ApO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgd2UgYXJlIGRvaW5nIERFRVAgb2JqZWN0TGlrZSwgdHJhbnNsYXRlIG9iamVjdCBsaXRlcmFscyBpbiB0aGUgcGF0dGVybiBpbnRvXG4gICAgICAvLyBtb3JlIGBkZWVwT2JqZWN0TGlrZWAgbWF0Y2hlcnMsIGV2ZW4gaWYgdGhleSBvY2N1ciBpbiBsaXN0cy5cbiAgICAgIGNvbnN0IG1hdGNoVmFsdWUgPSBkZWVwID8gZGVlcE1hdGNoZXJGcm9tT2JqZWN0TGl0ZXJhbChwYXR0ZXJuVmFsdWUpIDogcGF0dGVyblZhbHVlO1xuXG4gICAgICBjb25zdCBpbm5lckluc3BlY3Rpb24gPSB7IC4uLmluc3BlY3Rpb24sIGZhaWx1cmVSZWFzb246ICcnIH07XG4gICAgICBjb25zdCB2YWx1ZU1hdGNoZXMgPSBtYXRjaCh2YWx1ZVtwYXR0ZXJuS2V5XSwgbWF0Y2hWYWx1ZSwgaW5uZXJJbnNwZWN0aW9uKTtcbiAgICAgIGlmICghdmFsdWVNYXRjaGVzKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKGBGaWVsZCAke3BhdHRlcm5LZXl9IG1pc21hdGNoOiAke2lubmVySW5zcGVjdGlvbi5mYWlsdXJlUmVhc29ufWApO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRyYW5zZm9ybSBuZXN0ZWQgb2JqZWN0IGxpdGVyYWxzIGludG8gbW9yZSBkZWVwIG9iamVjdCBtYXRjaGVycywgaWYgYXBwbGljYWJsZVxuICAgICAqXG4gICAgICogT2JqZWN0IGxpdGVyYWxzIGluIGxpc3RzIGFyZSBhbHNvIHRyYW5zZm9ybWVkLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRlZXBNYXRjaGVyRnJvbU9iamVjdExpdGVyYWwobmVzdGVkUGF0dGVybjogYW55KTogYW55IHtcbiAgICAgIGlmIChpc09iamVjdChuZXN0ZWRQYXR0ZXJuKSkge1xuICAgICAgICByZXR1cm4gZGVlcE9iamVjdExpa2UobmVzdGVkUGF0dGVybik7XG4gICAgICB9XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShuZXN0ZWRQYXR0ZXJuKSkge1xuICAgICAgICByZXR1cm4gbmVzdGVkUGF0dGVybi5tYXAoZGVlcE1hdGNoZXJGcm9tT2JqZWN0TGl0ZXJhbCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbmVzdGVkUGF0dGVybjtcbiAgICB9XG5cbiAgICBpZiAoZXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiBmYWlsTWF0Y2hlcihpbnNwZWN0aW9uLCBlcnJvcnMuam9pbignLCAnKSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9KTtcbn1cblxuLyoqXG4gKiBNYXRjaCBleGFjdGx5IHRoZSBnaXZlbiB2YWx1ZVxuICpcbiAqIFRoaXMgaXMgdGhlIGRlZmF1bHQsIHlvdSBvbmx5IG5lZWQgdGhpcyB0byBlc2NhcGUgZnJvbSB0aGUgZGVlcCBsZW5pZW50IG1hdGNoaW5nXG4gKiBvZiBgZGVlcE9iamVjdExpa2VgLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZXhhY3RWYWx1ZShleHBlY3RlZDogYW55KTogUHJvcGVydHlNYXRjaGVyIHtcbiAgY29uc3QgYW5ubyA9IHsgJGV4YWN0VmFsdWU6IGV4cGVjdGVkIH07XG4gIHJldHVybiBhbm5vdGF0ZU1hdGNoZXIoYW5ubywgKHZhbHVlOiBhbnksIGluc3BlY3Rpb246IEluc3BlY3Rpb25GYWlsdXJlKTogYm9vbGVhbiA9PiB7XG4gICAgcmV0dXJuIG1hdGNoTGl0ZXJhbCh2YWx1ZSwgZXhwZWN0ZWQsIGluc3BlY3Rpb24pO1xuICB9KTtcbn1cblxuLyoqXG4gKiBBIG1hdGNoZXIgZm9yIGEgbGlzdCB0aGF0IGNvbnRhaW5zIGFsbCBvZiB0aGUgZ2l2ZW4gZWxlbWVudHMgaW4gYW55IG9yZGVyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhcnJheVdpdGgoLi4uZWxlbWVudHM6IGFueVtdKTogUHJvcGVydHlNYXRjaGVyIHtcbiAgaWYgKGVsZW1lbnRzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gYW55dGhpbmcoKTsgfVxuXG4gIGNvbnN0IGFubm8gPSB7ICRhcnJheUNvbnRhaW5pbmc6IGVsZW1lbnRzLmxlbmd0aCA9PT0gMSA/IGVsZW1lbnRzWzBdIDogZWxlbWVudHMgfTtcbiAgcmV0dXJuIGFubm90YXRlTWF0Y2hlcihhbm5vLCAodmFsdWU6IGFueSwgaW5zcGVjdGlvbjogSW5zcGVjdGlvbkZhaWx1cmUpOiBib29sZWFuID0+IHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICByZXR1cm4gZmFpbE1hdGNoZXIoaW5zcGVjdGlvbiwgYEV4cGVjdCBhbiBhcnJheSBidXQgZ290ICcke3R5cGVvZiB2YWx1ZX0nYCk7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBlbGVtZW50IG9mIGVsZW1lbnRzKSB7XG4gICAgICBjb25zdCBmYWlsdXJlID0gbG9uZ2VzdEZhaWx1cmUodmFsdWUsIGVsZW1lbnQpO1xuICAgICAgaWYgKGZhaWx1cmUpIHtcbiAgICAgICAgcmV0dXJuIGZhaWxNYXRjaGVyKGluc3BlY3Rpb24sIGBBcnJheSBkaWQgbm90IGNvbnRhaW4gZXhwZWN0ZWQgZWxlbWVudCwgY2xvc2VzdCBtYXRjaCBhdCBpbmRleCAke2ZhaWx1cmVbMF19OiAke2ZhaWx1cmVbMV19YCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gJ251bGwnIGlmIHRoZSBtYXRjaGVyIG1hdGNoZXMgYW55d2hlcmUgaW4gdGhlIGFycmF5LCBvdGhlcndpc2UgdGhlIGxvbmdlc3QgZXJyb3IgYW5kIGl0cyBpbmRleFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxvbmdlc3RGYWlsdXJlKGFycmF5OiBhbnlbXSwgbWF0Y2hlcjogYW55KTogW251bWJlciwgc3RyaW5nXSB8IG51bGwge1xuICAgICAgbGV0IGZhaWw6IFtudW1iZXIsIHN0cmluZ10gfCBudWxsID0gbnVsbDtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgaW5uZXJJbnNwZWN0aW9uID0geyAuLi5pbnNwZWN0aW9uLCBmYWlsdXJlUmVhc29uOiAnJyB9O1xuICAgICAgICBpZiAobWF0Y2goYXJyYXlbaV0sIG1hdGNoZXIsIGlubmVySW5zcGVjdGlvbikpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmYWlsID09PSBudWxsIHx8IGlubmVySW5zcGVjdGlvbi5mYWlsdXJlUmVhc29uLmxlbmd0aCA+IGZhaWxbMV0ubGVuZ3RoKSB7XG4gICAgICAgICAgZmFpbCA9IFtpLCBpbm5lckluc3BlY3Rpb24uZmFpbHVyZVJlYXNvbl07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWlsO1xuICAgIH1cbiAgfSk7XG59XG5cbi8qKlxuICogV2hldGhlciBhIHZhbHVlIGlzIGFuIG9iamVjdFxuICovXG5mdW5jdGlvbiBpc09iamVjdCh4OiBhbnkpOiB4IGlzIG9iamVjdCB7XG4gIC8vIEJlY2F1c2UgYHR5cGVvZiBudWxsID09PSAnb2JqZWN0J2AuXG4gIHJldHVybiB4ICYmIHR5cGVvZiB4ID09PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBIZWxwZXIgZnVuY3Rpb24gdG8gbWFrZSBtYXRjaGVyIGZhaWx1cmUgcmVwb3J0aW5nIGEgbGl0dGxlIGVhc2llclxuICpcbiAqIE91ciBwcm90b2NvbCBpcyB3ZWlyZCAoY2hhbmdlIGEgc3RyaW5nIG9uIGEgcGFzc2VkLWluIG9iamVjdCBhbmQgcmV0dXJuICdmYWxzZScpLFxuICogYnV0IEkgZG9uJ3Qgd2FudCB0byBjaGFuZ2UgdGhhdCByaWdodCBub3cuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmYWlsTWF0Y2hlcihpbnNwZWN0aW9uOiBJbnNwZWN0aW9uRmFpbHVyZSwgZXJyb3I6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBpbnNwZWN0aW9uLmZhaWx1cmVSZWFzb24gPSBlcnJvcjtcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIE1hdGNoIGEgZ2l2ZW4gbGl0ZXJhbCB2YWx1ZSBhZ2FpbnN0IGEgbWF0Y2hlclxuICpcbiAqIElmIHRoZSBtYXRjaGVyIGlzIGEgY2FsbGFibGUsIHVzZSB0aGF0IHRvIGV2YWx1YXRlIHRoZSB2YWx1ZS4gT3RoZXJ3aXNlLCB0aGUgdmFsdWVzXG4gKiBtdXN0IGJlIGxpdGVyYWxseSB0aGUgc2FtZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1hdGNoKHZhbHVlOiBhbnksIG1hdGNoZXI6IGFueSwgaW5zcGVjdGlvbjogSW5zcGVjdGlvbkZhaWx1cmUpIHtcbiAgaWYgKGlzQ2FsbGFibGUobWF0Y2hlcikpIHtcbiAgICAvLyBDdXN0b20gbWF0Y2hlciAodGhpcyBtb3N0bHkgbG9va3MgdmVyeSB3ZWlyZCBiZWNhdXNlIG91ciBgSW5zcGVjdGlvbkZhaWx1cmVgIHNpZ25hdHVyZSBpcyB3ZWlyZClcbiAgICBjb25zdCBpbm5lckluc3BlY3Rpb246IEluc3BlY3Rpb25GYWlsdXJlID0geyAuLi5pbnNwZWN0aW9uLCBmYWlsdXJlUmVhc29uOiAnJyB9O1xuICAgIGNvbnN0IHJlc3VsdCA9IG1hdGNoZXIodmFsdWUsIGlubmVySW5zcGVjdGlvbik7XG4gICAgaWYgKHR5cGVvZiByZXN1bHQgIT09ICdib29sZWFuJykge1xuICAgICAgcmV0dXJuIGZhaWxNYXRjaGVyKGluc3BlY3Rpb24sIGBQcmVkaWNhdGUgcmV0dXJuZWQgbm9uLWJvb2xlYW4gcmV0dXJuIHZhbHVlOiAke3Jlc3VsdH1gKTtcbiAgICB9XG4gICAgaWYgKCFyZXN1bHQgJiYgIWlubmVySW5zcGVjdGlvbi5mYWlsdXJlUmVhc29uKSB7XG4gICAgICAvLyBDdXN0b20gbWF0Y2hlciBuZWdsZWN0ZWQgdG8gcmV0dXJuIGFuIGVycm9yXG4gICAgICByZXR1cm4gZmFpbE1hdGNoZXIoaW5zcGVjdGlvbiwgJ1ByZWRpY2F0ZSByZXR1cm5lZCBmYWxzZScpO1xuICAgIH1cbiAgICAvLyBQcm9wYWdhdGUgaW5uZXIgZXJyb3IgaW4gY2FzZSBvZiBmYWlsdXJlXG4gICAgaWYgKCFyZXN1bHQpIHsgaW5zcGVjdGlvbi5mYWlsdXJlUmVhc29uID0gaW5uZXJJbnNwZWN0aW9uLmZhaWx1cmVSZWFzb247IH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcmV0dXJuIG1hdGNoTGl0ZXJhbCh2YWx1ZSwgbWF0Y2hlciwgaW5zcGVjdGlvbik7XG59XG5cbi8qKlxuICogTWF0Y2ggYSBsaXRlcmFsIHZhbHVlIGF0IHRoZSB0b3AgbGV2ZWwuXG4gKlxuICogV2hlbiByZWN1cnNpbmcgaW50byBhcnJheXMgb3Igb2JqZWN0cywgdGhlIG5lc3RlZCB2YWx1ZXMgY2FuIGJlIGVpdGhlciBtYXRjaGVyc1xuICogb3IgbGl0ZXJhbHMuXG4gKi9cbmZ1bmN0aW9uIG1hdGNoTGl0ZXJhbCh2YWx1ZTogYW55LCBwYXR0ZXJuOiBhbnksIGluc3BlY3Rpb246IEluc3BlY3Rpb25GYWlsdXJlKSB7XG4gIGlmIChwYXR0ZXJuID09IG51bGwpIHsgcmV0dXJuIHRydWU7IH1cblxuICBjb25zdCBlcnJvcnMgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuXG4gIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSAhPT0gQXJyYXkuaXNBcnJheShwYXR0ZXJuKSkge1xuICAgIHJldHVybiBmYWlsTWF0Y2hlcihpbnNwZWN0aW9uLCAnQXJyYXkgdHlwZSBtaXNtYXRjaCcpO1xuICB9XG4gIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgIGlmIChwYXR0ZXJuLmxlbmd0aCAhPT0gdmFsdWUubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gZmFpbE1hdGNoZXIoaW5zcGVjdGlvbiwgJ0FycmF5IGxlbmd0aCBtaXNtYXRjaCcpO1xuICAgIH1cblxuICAgIC8vIFJlY3Vyc2UgY29tcGFyaXNvbiBmb3IgaW5kaXZpZHVhbCBvYmplY3RzXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXR0ZXJuLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoIW1hdGNoKHZhbHVlW2ldLCBwYXR0ZXJuW2ldLCB7IC4uLmluc3BlY3Rpb24gfSkpIHtcbiAgICAgICAgZXJyb3JzLnB1c2goYEFycmF5IGVsZW1lbnQgJHtpfSBtaXNtYXRjaGApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChlcnJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIGZhaWxNYXRjaGVyKGluc3BlY3Rpb24sIGVycm9ycy5qb2luKCcsICcpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKCh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSAhPT0gKHR5cGVvZiBwYXR0ZXJuID09PSAnb2JqZWN0JykpIHtcbiAgICByZXR1cm4gZmFpbE1hdGNoZXIoaW5zcGVjdGlvbiwgJ09iamVjdCB0eXBlIG1pc21hdGNoJyk7XG4gIH1cbiAgaWYgKHR5cGVvZiBwYXR0ZXJuID09PSAnb2JqZWN0Jykge1xuICAgIC8vIENoZWNrIHRoYXQgYWxsIGZpZWxkcyBpbiB0aGUgcGF0dGVybiBoYXZlIHRoZSByaWdodCB2YWx1ZVxuICAgIGNvbnN0IGlubmVySW5zcGVjdGlvbiA9IHsgLi4uaW5zcGVjdGlvbiwgZmFpbHVyZVJlYXNvbjogJycgfTtcbiAgICBjb25zdCBtYXRjaGVyID0gb2JqZWN0TGlrZShwYXR0ZXJuKSh2YWx1ZSwgaW5uZXJJbnNwZWN0aW9uKTtcbiAgICBpZiAoIW1hdGNoZXIpIHtcbiAgICAgIGluc3BlY3Rpb24uZmFpbHVyZVJlYXNvbiA9IGlubmVySW5zcGVjdGlvbi5mYWlsdXJlUmVhc29uO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIENoZWNrIG5vIGZpZWxkcyB1bmNvdmVyZWRcbiAgICBjb25zdCByZWFsRmllbGRzID0gbmV3IFNldChPYmplY3Qua2V5cyh2YWx1ZSkpO1xuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHBhdHRlcm4pKSB7IHJlYWxGaWVsZHMuZGVsZXRlKGtleSk7IH1cbiAgICBpZiAocmVhbEZpZWxkcy5zaXplID4gMCkge1xuICAgICAgcmV0dXJuIGZhaWxNYXRjaGVyKGluc3BlY3Rpb24sIGBVbmV4cGVjdGVkIGtleXMgcHJlc2VudCBpbiBvYmplY3Q6ICR7QXJyYXkuZnJvbShyZWFsRmllbGRzKS5qb2luKCcsICcpfWApO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmICh2YWx1ZSAhPT0gcGF0dGVybikge1xuICAgIHJldHVybiBmYWlsTWF0Y2hlcihpbnNwZWN0aW9uLCAnRGlmZmVyZW50IHZhbHVlcycpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogV2hldGhlciBhIHZhbHVlIGlzIGEgY2FsbGFibGVcbiAqL1xuZnVuY3Rpb24gaXNDYWxsYWJsZSh4OiBhbnkpOiB4IGlzICgoLi4uYXJnczogYW55W10pID0+IGFueSkge1xuICByZXR1cm4geCAmJiB7fS50b1N0cmluZy5jYWxsKHgpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufVxuXG4vKipcbiAqIERvIGEgZ2xvYi1saWtlIHBhdHRlcm4gbWF0Y2ggKHdoaWNoIG9ubHkgc3VwcG9ydHMgKnMpLiBTdXBwb3J0cyBtdWx0aWxpbmUgc3RyaW5ncy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0cmluZ0xpa2UocGF0dGVybjogc3RyaW5nKTogUHJvcGVydHlNYXRjaGVyIHtcbiAgLy8gUmVwbGFjZSAqIHdpdGggLiogaW4gdGhlIHN0cmluZywgZXNjYXBlIHRoZSByZXN0IGFuZCBicmFjZSB3aXRoIF4uLi4kXG4gIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChgXiR7cGF0dGVybi5zcGxpdCgnKicpLm1hcChlc2NhcGVSZWdleCkuam9pbignLionKX0kYCwgJ20nKTtcblxuICByZXR1cm4gYW5ub3RhdGVNYXRjaGVyKHsgJHN0cmluZ0NvbnRhaW5pbmc6IHBhdHRlcm4gfSwgKHZhbHVlOiBhbnksIGZhaWx1cmU6IEluc3BlY3Rpb25GYWlsdXJlKSA9PiB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIGZhaWx1cmUuZmFpbHVyZVJlYXNvbiA9IGBFeHBlY3RlZCBhIHN0cmluZywgYnV0IGdvdCAnJHt0eXBlb2YgdmFsdWV9J2A7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKCFyZWdleC50ZXN0KHZhbHVlKSkge1xuICAgICAgZmFpbHVyZS5mYWlsdXJlUmVhc29uID0gJ1N0cmluZyBkaWQgbm90IG1hdGNoIHBhdHRlcm4nO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9KTtcbn1cblxuLyoqXG4gKiBNYXRjaGVzIGFueSB2YWx1ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gYW55dGhpbmcoKTogUHJvcGVydHlNYXRjaGVyIHtcbiAgcmV0dXJuIGFubm90YXRlTWF0Y2hlcih7ICRhbnl0aGluZzogdHJ1ZSB9LCAoKSA9PiB0cnVlKTtcbn1cblxuLyoqXG4gKiBOZWdhdGUgYW4gaW5uZXIgbWF0Y2hlclxuICovXG5leHBvcnQgZnVuY3Rpb24gbm90TWF0Y2hpbmcobWF0Y2hlcjogYW55KTogUHJvcGVydHlNYXRjaGVyIHtcbiAgcmV0dXJuIGFubm90YXRlTWF0Y2hlcih7ICRub3RNYXRjaGluZzogbWF0Y2hlciB9LCAodmFsdWU6IGFueSwgZmFpbHVyZTogSW5zcGVjdGlvbkZhaWx1cmUpID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSBtYXRjaGVyRnJvbShtYXRjaGVyKSh2YWx1ZSwgZmFpbHVyZSk7XG4gICAgaWYgKHJlc3VsdCkge1xuICAgICAgZmFpbHVyZS5mYWlsdXJlUmVhc29uID0gJ1Nob3VsZCBub3QgaGF2ZSBtYXRjaGVkLCBidXQgZGlkJztcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH0pO1xufVxuXG5leHBvcnQgdHlwZSBUeXBlVmFsaWRhdG9yPFQ+ID0gKHg6IGFueSkgPT4geCBpcyBUO1xuXG4vKipcbiAqIENhcHR1cmVzIGEgdmFsdWUgb250byBhbiBvYmplY3QgaWYgaXQgbWF0Y2hlcyBhIGdpdmVuIGlubmVyIG1hdGNoZXJcbiAqXG4gKiBAZXhhbXBsZVxuICpcbiAqIGNvbnN0IHNvbWVWYWx1ZSA9IENhcHR1cmUuYVN0cmluZygpO1xuICogZXhwZWN0KHN0YWNrKS50b0hhdmVSZXNvdXJjZSh7XG4gKiAgICAvLyAuLi5cbiAqICAgIFZhbHVlOiBzb21lVmFsdWUuY2FwdHVyZShzdHJpbmdNYXRjaGluZygnKmEqJykpLFxuICogfSk7XG4gKiBjb25zb2xlLmxvZyhzb21lVmFsdWUuY2FwdHVyZWRWYWx1ZSk7XG4gKi9cbmV4cG9ydCBjbGFzcyBDYXB0dXJlPFQ9YW55PiB7XG4gIC8qKlxuICAgKiBBIENhcHR1cmUgb2JqZWN0IHRoYXQgY2FwdHVyZXMgYW55IHR5cGVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYW55VHlwZSgpOiBDYXB0dXJlPGFueT4ge1xuICAgIHJldHVybiBuZXcgQ2FwdHVyZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgQ2FwdHVyZSBvYmplY3QgdGhhdCBjYXB0dXJlcyBhIHN0cmluZyB0eXBlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFTdHJpbmcoKTogQ2FwdHVyZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gbmV3IENhcHR1cmUoKHg6IGFueSk6IHggaXMgc3RyaW5nID0+IHtcbiAgICAgIGlmICh0eXBlb2YgeCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCB0byBjYXB0dXJlIGEgc3RyaW5nLCBnb3QgJyR7eH0nYCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIENhcHR1cmUgb2JqZWN0IHRoYXQgY2FwdHVyZXMgYSBjdXN0b20gdHlwZVxuICAgKi9cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1zaGFkb3dcbiAgcHVibGljIHN0YXRpYyBhPFQ+KHZhbGlkYXRvcjogVHlwZVZhbGlkYXRvcjxUPik6IENhcHR1cmU8VD4ge1xuICAgIHJldHVybiBuZXcgQ2FwdHVyZSh2YWxpZGF0b3IpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdmFsdWU/OiBUO1xuICBwcml2YXRlIF9kaWRDYXB0dXJlID0gZmFsc2U7XG4gIHByaXZhdGUgX3dhc0ludm9rZWQgPSBmYWxzZTtcblxuICBwcm90ZWN0ZWQgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSB0eXBlVmFsaWRhdG9yPzogVHlwZVZhbGlkYXRvcjxUPikge1xuICB9XG5cbiAgLyoqXG4gICAqIENhcHR1cmUgdGhlIHZhbHVlIGlmIHRoZSBpbm5lciBtYXRjaGVyIHN1Y2Nlc3NmdWxseSBtYXRjaGVzIGl0XG4gICAqXG4gICAqIElmIG5vIG1hdGNoZXIgaXMgZ2l2ZW4sIGBhbnl0aGluZygpYCBpcyBhc3N1bWVkLlxuICAgKlxuICAgKiBBbmQgZXhjZXB0aW9uIHdpbGwgYmUgdGhyb3duIGlmIHRoZSBpbm5lciBtYXRjaGVyIHJldHVybnMgYHRydWVgIGFuZFxuICAgKiB0aGUgdmFsdWUgdHVybnMgb3V0IHRvIGJlIG9mIGEgZGlmZmVyZW50IHR5cGUgdGhhbiB0aGUgYENhcHR1cmVgIG9iamVjdFxuICAgKiBpcyBleHBlY3RpbmcuXG4gICAqL1xuICBwdWJsaWMgY2FwdHVyZShtYXRjaGVyPzogYW55KTogUHJvcGVydHlNYXRjaGVyIHtcbiAgICBpZiAobWF0Y2hlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBtYXRjaGVyID0gYW55dGhpbmcoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYW5ub3RhdGVNYXRjaGVyKHsgJGNhcHR1cmU6IG1hdGNoZXIgfSwgKHZhbHVlOiBhbnksIGZhaWx1cmU6IEluc3BlY3Rpb25GYWlsdXJlKSA9PiB7XG4gICAgICB0aGlzLl93YXNJbnZva2VkID0gdHJ1ZTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IG1hdGNoZXJGcm9tKG1hdGNoZXIpKHZhbHVlLCBmYWlsdXJlKTtcbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHRoaXMudHlwZVZhbGlkYXRvciAmJiAhdGhpcy50eXBlVmFsaWRhdG9yKHZhbHVlKSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVmFsdWUgbm90IG9mIHRoZSBleHBlY3RlZCB0eXBlOiAke3ZhbHVlfWApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2RpZENhcHR1cmUgPSB0cnVlO1xuICAgICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIGEgdmFsdWUgd2FzIHN1Y2Nlc3NmdWxseSBjYXB0dXJlZFxuICAgKi9cbiAgcHVibGljIGdldCBkaWRDYXB0dXJlKCkge1xuICAgIHJldHVybiB0aGlzLl9kaWRDYXB0dXJlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgdmFsdWUgdGhhdCB3YXMgY2FwdHVyZWRcbiAgICpcbiAgICogVGhyb3dzIGFuIGV4Y2VwdGlvbiBpZiBub3cgdmFsdWUgd2FzIGNhcHR1cmVkXG4gICAqL1xuICBwdWJsaWMgZ2V0IGNhcHR1cmVkVmFsdWUoKTogVCB7XG4gICAgLy8gV2hlbiB0aGlzIG1vZHVsZSBpcyBwb3J0ZWQgdG8ganNpaSwgdGhlIHR5cGUgcGFyYW1ldGVyIHdpbGwgb2J2aW91c2x5XG4gICAgLy8gaGF2ZSB0byBiZSBkcm9wcGVkIGFuZCB0aGlzIHdpbGwgaGF2ZSB0byB0dXJuIGludG8gYW4gYGFueWAuXG4gICAgaWYgKCF0aGlzLmRpZENhcHR1cmUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRGlkIG5vdCBjYXB0dXJlIGEgdmFsdWU6ICR7dGhpcy5fd2FzSW52b2tlZCA/ICdpbm5lciBtYXRjaGVyIGZhaWxlZCcgOiAnbmV2ZXIgaW52b2tlZCd9YCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl92YWx1ZSE7XG4gIH1cbn1cblxuLyoqXG4gKiBNYXRjaCBvbiB0aGUgaW5uYXJkcyBvZiBhIEpTT04gc3RyaW5nLCBpbnN0ZWFkIG9mIHRoZSBjb21wbGV0ZSBzdHJpbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVuY29kZWRKc29uKG1hdGNoZXI6IGFueSk6IFByb3BlcnR5TWF0Y2hlciB7XG4gIHJldHVybiBhbm5vdGF0ZU1hdGNoZXIoeyAkZW5jb2RlZEpzb246IG1hdGNoZXIgfSwgKHZhbHVlOiBhbnksIGZhaWx1cmU6IEluc3BlY3Rpb25GYWlsdXJlKSA9PiB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIGZhaWx1cmUuZmFpbHVyZVJlYXNvbiA9IGBFeHBlY3RlZCBhIHN0cmluZywgYnV0IGdvdCAnJHt0eXBlb2YgdmFsdWV9J2A7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgbGV0IGRlY29kZWQ7XG4gICAgdHJ5IHtcbiAgICAgIGRlY29kZWQgPSBKU09OLnBhcnNlKHZhbHVlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBmYWlsdXJlLmZhaWx1cmVSZWFzb24gPSBgU3RyaW5nIGlzIG5vdCBKU09OOiAke2V9YDtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWF0Y2hlckZyb20obWF0Y2hlcikoZGVjb2RlZCwgZmFpbHVyZSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBlc2NhcGVSZWdleChzOiBzdHJpbmcpIHtcbiAgcmV0dXJuIHMucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csICdcXFxcJCYnKTsgLy8gJCYgbWVhbnMgdGhlIHdob2xlIG1hdGNoZWQgc3RyaW5nXG59XG5cbi8qKlxuICogTWFrZSBhIG1hdGNoZXIgb3V0IG9mIHRoZSBnaXZlbiBhcmd1bWVudCBpZiBpdCdzIG5vdCBhIG1hdGNoZXIgYWxyZWFkeVxuICpcbiAqIElmIGl0J3Mgbm90IGEgbWF0Y2hlciwgaXQgd2lsbCBiZSB0cmVhdGVkIGFzIGEgbGl0ZXJhbC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1hdGNoZXJGcm9tKG1hdGNoZXI6IGFueSk6IFByb3BlcnR5TWF0Y2hlciB7XG4gIHJldHVybiBpc0NhbGxhYmxlKG1hdGNoZXIpID8gbWF0Y2hlciA6IGV4YWN0VmFsdWUobWF0Y2hlcik7XG59XG5cbi8qKlxuICogQW5ub3RhdGUgYSBtYXRjaGVyIHdpdGggdG9KU09OXG4gKlxuICogV2Ugd2lsbCBKU09OLnN0cmluZ2lmeSgpIHZhbHVlcyBpZiB3ZSBoYXZlIGEgbWF0Y2ggZmFpbHVyZSwgYnV0IGZvciBtYXRjaGVycyB0aGlzXG4gKiB3b3VsZCBzaG93IChpbiB0cmFkaXRpb25hbCBKUyBmYXNoaW9uKSBzb21ldGhpbmcgbGlrZSAnW2Z1bmN0aW9uIEZ1bmN0aW9uXScsIG9yIG1vcmVcbiAqIGFjY3VyYXRlbHkgbm90aGluZyBhdCBhbGwgc2luY2UgZnVuY3Rpb25zIGNhbm5vdCBiZSBKU09OaWZpZWQuXG4gKlxuICogV2Ugb3ZlcnJpZGUgdG8gSlNPTigpIGluIG9yZGVyIHRvIHByb2R1Y2UgYSByZWFkYWJsZSB2ZXJzaW9uIG9mIHRoZSBtYXRjaGVyLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYW5ub3RhdGVNYXRjaGVyPEEgZXh0ZW5kcyBvYmplY3Q+KGhvdzogQSwgbWF0Y2hlcjogUHJvcGVydHlNYXRjaGVyKTogUHJvcGVydHlNYXRjaGVyIHtcbiAgKG1hdGNoZXIgYXMgYW55KS50b0pTT04gPSAoKSA9PiBob3c7XG4gIHJldHVybiBtYXRjaGVyO1xufVxuIl19