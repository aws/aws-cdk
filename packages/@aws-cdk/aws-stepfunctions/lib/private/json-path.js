"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderInExpression = exports.jsonPathFromAny = exports.jsonPathString = exports.recurseObject = exports.findReferencedPaths = exports.renderObject = exports.JsonPathToken = void 0;
const core_1 = require("@aws-cdk/core");
const intrinstics_1 = require("./intrinstics");
const JSON_PATH_TOKEN_SYMBOL = Symbol.for('@aws-cdk/aws-stepfunctions.JsonPathToken');
class JsonPathToken {
    constructor(path) {
        this.path = path;
        this.creationStack = core_1.captureStackTrace();
        this.displayHint = path.replace(/^[^a-zA-Z]+/, '');
        Object.defineProperty(this, JSON_PATH_TOKEN_SYMBOL, { value: true });
    }
    static isJsonPathToken(x) {
        return x[JSON_PATH_TOKEN_SYMBOL] === true;
    }
    resolve(_ctx) {
        return this.path;
    }
    toString() {
        return core_1.Token.asString(this, { displayHint: this.displayHint });
    }
    toJSON() {
        return `<path:${this.path}>`;
    }
}
exports.JsonPathToken = JsonPathToken;
/**
 * Deep render a JSON object to expand JSON path fields, updating the key to end in '.$'
 */
function renderObject(obj) {
    return recurseObject(obj, {
        handleString: renderString,
        handleList: renderStringList,
        handleNumber: renderNumber,
        handleBoolean: renderBoolean,
        handleResolvable: renderResolvable,
    });
}
exports.renderObject = renderObject;
/**
 * Return all JSON paths that are used in the given structure
 */
function findReferencedPaths(obj) {
    const found = new Set();
    recurseObject(obj, {
        handleString(_key, x) {
            for (const p of findPathsInIntrinsicFunctions(jsonPathString(x))) {
                found.add(p);
            }
            return {};
        },
        handleList(_key, x) {
            for (const p of findPathsInIntrinsicFunctions(jsonPathStringList(x))) {
                found.add(p);
            }
            return {};
        },
        handleNumber(_key, x) {
            for (const p of findPathsInIntrinsicFunctions(jsonPathNumber(x))) {
                found.add(p);
            }
            return {};
        },
        handleBoolean(_key, _x) {
            return {};
        },
        handleResolvable(_key, x) {
            for (const p of findPathsInIntrinsicFunctions(jsonPathFromAny(x))) {
                found.add(p);
            }
            return {};
        },
    });
    return found;
}
exports.findReferencedPaths = findReferencedPaths;
/**
 * From an expression, return the list of JSON paths referenced in it
 */
function findPathsInIntrinsicFunctions(expression) {
    if (!expression) {
        return [];
    }
    const ret = new Array();
    try {
        const parsed = new intrinstics_1.IntrinsicParser(expression).parseTopLevelIntrinsic();
        recurse(parsed);
        return ret;
    }
    catch (e) {
        // Not sure that our parsing is 100% correct. We don't want to break anyone, so
        // fall back to legacy behavior if we can't parse this string.
        return [expression];
    }
    function recurse(p) {
        switch (p.type) {
            case 'path':
                ret.push(p.path);
                break;
            case 'fncall':
                for (const arg of p.arguments) {
                    recurse(arg);
                }
        }
    }
}
function recurseObject(obj, handlers, visited = []) {
    // If the argument received is not actually an object (string, number, boolean, undefined, ...) or null
    // just return it as is as there's nothing to be rendered. This should only happen in the original call to
    // recurseObject as any recursive calls to it are checking for typeof value === 'object' && value !== null
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    // Avoiding infinite recursion
    if (visited.includes(obj)) {
        return {};
    }
    // Marking current object as visited for the current recursion path
    visited.push(obj);
    const ret = {};
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            Object.assign(ret, handlers.handleString(key, value));
        }
        else if (typeof value === 'number') {
            Object.assign(ret, handlers.handleNumber(key, value));
        }
        else if (Array.isArray(value)) {
            Object.assign(ret, recurseArray(key, value, handlers, visited));
        }
        else if (typeof value === 'boolean') {
            Object.assign(ret, handlers.handleBoolean(key, value));
        }
        else if (value === null || value === undefined) {
            // Nothing
        }
        else if (typeof value === 'object') {
            if (core_1.Tokenization.isResolvable(value)) {
                Object.assign(ret, handlers.handleResolvable(key, value));
            }
            else {
                ret[key] = recurseObject(value, handlers, visited);
            }
        }
    }
    // Removing from visited after leaving the current recursion path
    // Allowing it to be visited again if it's not causing a recursion (circular reference)
    visited.pop();
    return ret;
}
exports.recurseObject = recurseObject;
/**
 * Render an array that may or may not contain a string list token
 */
function recurseArray(key, arr, handlers, visited = []) {
    if (isStringArray(arr)) {
        const path = jsonPathStringList(arr);
        if (path !== undefined) {
            return handlers.handleList(key, arr);
        }
        // Fall through to correctly reject encoded strings inside an array.
        // They cannot be represented because there is no key to append a '.$' to.
    }
    return {
        [key]: arr.map(value => {
            if ((typeof value === 'string' && jsonPathString(value) !== undefined)
                || (typeof value === 'number' && jsonPathNumber(value) !== undefined)
                || (isStringArray(value) && jsonPathStringList(value) !== undefined)) {
                throw new Error('Cannot use JsonPath fields in an array, they must be used in objects');
            }
            if (typeof value === 'object' && value !== null) {
                return recurseObject(value, handlers, visited);
            }
            return value;
        }),
    };
}
function isStringArray(x) {
    return Array.isArray(x) && x.every(el => typeof el === 'string');
}
/**
 * Render a parameter string
 *
 * If the string value starts with '$.', render it as a path string, otherwise as a direct string.
 */
function renderString(key, value) {
    const path = jsonPathString(value);
    if (path !== undefined) {
        return { [key + '.$']: path };
    }
    else {
        return { [key]: value };
    }
}
/**
 * Render a resolvable
 *
 * If we can extract a Path from it, render as a path string, otherwise as itself (will
 * be resolved later
 */
function renderResolvable(key, value) {
    const path = jsonPathFromAny(value);
    if (path !== undefined) {
        return { [key + '.$']: path };
    }
    else {
        return { [key]: value };
    }
}
/**
 * Render a parameter string list
 *
 * If the string value starts with '$.', render it as a path string, otherwise as a direct string.
 */
function renderStringList(key, value) {
    const path = jsonPathStringList(value);
    if (path !== undefined) {
        return { [key + '.$']: path };
    }
    else {
        return { [key]: value };
    }
}
/**
 * Render a parameter number
 *
 * If the string value starts with '$.', render it as a path string, otherwise as a direct string.
 */
function renderNumber(key, value) {
    const path = jsonPathNumber(value);
    if (path !== undefined) {
        return { [key + '.$']: path };
    }
    else {
        return { [key]: value };
    }
}
/**
 * Render a parameter boolean
 */
function renderBoolean(key, value) {
    return { [key]: value };
}
/**
 * If the indicated string is an encoded JSON path, return the path
 *
 * Otherwise return undefined.
 */
function jsonPathString(x) {
    const fragments = core_1.Tokenization.reverseString(x);
    const jsonPathTokens = fragments.tokens.filter(JsonPathToken.isJsonPathToken);
    if (jsonPathTokens.length > 0 && fragments.length > 1) {
        throw new Error(`Field references must be the entire string, cannot concatenate them (found '${x}')`);
    }
    if (jsonPathTokens.length > 0) {
        return jsonPathTokens[0].path;
    }
    return undefined;
}
exports.jsonPathString = jsonPathString;
function jsonPathFromAny(x) {
    if (!x) {
        return undefined;
    }
    if (typeof x === 'string') {
        return jsonPathString(x);
    }
    return pathFromToken(core_1.Tokenization.reverse(x));
}
exports.jsonPathFromAny = jsonPathFromAny;
/**
 * If the indicated string list is an encoded JSON path, return the path
 *
 * Otherwise return undefined.
 */
function jsonPathStringList(x) {
    return pathFromToken(core_1.Tokenization.reverseList(x));
}
/**
 * If the indicated number is an encoded JSON path, return the path
 *
 * Otherwise return undefined.
 */
function jsonPathNumber(x) {
    return pathFromToken(core_1.Tokenization.reverseNumber(x));
}
function pathFromToken(token) {
    return token && (JsonPathToken.isJsonPathToken(token) ? token.path : undefined);
}
/**
 * Render the string or number value in a valid JSON Path expression.
 *
 * If the value is a Tokenized JSON path reference -- return the JSON path reference inside it.
 * If the value is a number -- convert it to string.
 * If the value is a string -- single-quote it.
 * Otherwise, throw errors.
 *
 * Call this function whenever you're building compound JSONPath expressions, in
 * order to avoid having tokens-in-tokens-in-tokens which become very hard to parse.
 */
function renderInExpression(x) {
    const path = jsonPathFromAny(x);
    if (path)
        return path;
    if (typeof x === 'number')
        return x.toString(10);
    if (typeof x === 'string')
        return singleQuotestring(x);
    throw new Error('Unxexpected value.');
}
exports.renderInExpression = renderInExpression;
function singleQuotestring(x) {
    const ret = new Array();
    ret.push("'");
    for (const c of x) {
        if (c === "'") {
            ret.push("\\'");
        }
        else if (c === '\\') {
            ret.push('\\\\');
        }
        else if (c === '\n') {
            ret.push('\\n');
        }
        else {
            ret.push(c);
        }
    }
    ret.push("'");
    return ret.join('');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1wYXRoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsianNvbi1wYXRoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHdDQUFxRztBQUNyRywrQ0FBcUU7QUFFckUsTUFBTSxzQkFBc0IsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLDBDQUEwQyxDQUFDLENBQUM7QUFFdEYsTUFBYSxhQUFhO0lBUXhCLFlBQTRCLElBQVk7UUFBWixTQUFJLEdBQUosSUFBSSxDQUFRO1FBQ3RDLElBQUksQ0FBQyxhQUFhLEdBQUcsd0JBQWlCLEVBQUUsQ0FBQztRQUN6QyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ25ELE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLHNCQUFzQixFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7S0FDdEU7SUFYTSxNQUFNLENBQUMsZUFBZSxDQUFDLENBQWM7UUFDMUMsT0FBUSxDQUFTLENBQUMsc0JBQXNCLENBQUMsS0FBSyxJQUFJLENBQUM7S0FDcEQ7SUFXTSxPQUFPLENBQUMsSUFBcUI7UUFDbEMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0tBQ2xCO0lBRU0sUUFBUTtRQUNiLE9BQU8sWUFBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7S0FDaEU7SUFFTSxNQUFNO1FBQ1gsT0FBTyxTQUFTLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQztLQUM5QjtDQUNGO0FBekJELHNDQXlCQztBQUVEOztHQUVHO0FBQ0gsU0FBZ0IsWUFBWSxDQUFDLEdBQXVCO0lBQ2xELE9BQU8sYUFBYSxDQUFDLEdBQUcsRUFBRTtRQUN4QixZQUFZLEVBQUUsWUFBWTtRQUMxQixVQUFVLEVBQUUsZ0JBQWdCO1FBQzVCLFlBQVksRUFBRSxZQUFZ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SSxPQUFPLENBQUMsS0FBSyxRQUFRO1FBQUUsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2pELElBQUksT0FBTyxDQUFDLEtBQUssUUFBUTtRQUFFLE9BQU8saUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdkQsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ3hDLENBQUM7QUFORCxnREFNQztBQUVELFNBQVMsaUJBQWlCLENBQUMsQ0FBUztJQUNsQyxNQUFNLEdBQUcsR0FBRyxJQUFJLEtBQUssRUFBVSxDQUFDO0lBQ2hDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDZCxLQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNqQixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUU7WUFDYixHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ2pCO2FBQU0sSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFO1lBQ3JCLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDbEI7YUFBTSxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDckIsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNqQjthQUFNO1lBQ0wsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNiO0tBQ0Y7SUFDRCxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2QsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3RCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjYXB0dXJlU3RhY2tUcmFjZSwgSVJlc29sdmFibGUsIElSZXNvbHZlQ29udGV4dCwgVG9rZW4sIFRva2VuaXphdGlvbiB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgSW50cmluc2ljUGFyc2VyLCBJbnRyaW5zaWNFeHByZXNzaW9uIH0gZnJvbSAnLi9pbnRyaW5zdGljcyc7XG5cbmNvbnN0IEpTT05fUEFUSF9UT0tFTl9TWU1CT0wgPSBTeW1ib2wuZm9yKCdAYXdzLWNkay9hd3Mtc3RlcGZ1bmN0aW9ucy5Kc29uUGF0aFRva2VuJyk7XG5cbmV4cG9ydCBjbGFzcyBKc29uUGF0aFRva2VuIGltcGxlbWVudHMgSVJlc29sdmFibGUge1xuICBwdWJsaWMgc3RhdGljIGlzSnNvblBhdGhUb2tlbih4OiBJUmVzb2x2YWJsZSk6IHggaXMgSnNvblBhdGhUb2tlbiB7XG4gICAgcmV0dXJuICh4IGFzIGFueSlbSlNPTl9QQVRIX1RPS0VOX1NZTUJPTF0gPT09IHRydWU7XG4gIH1cblxuICBwdWJsaWMgcmVhZG9ubHkgY3JlYXRpb25TdGFjazogc3RyaW5nW107XG4gIHB1YmxpYyBkaXNwbGF5SGludDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBwYXRoOiBzdHJpbmcpIHtcbiAgICB0aGlzLmNyZWF0aW9uU3RhY2sgPSBjYXB0dXJlU3RhY2tUcmFjZSgpO1xuICAgIHRoaXMuZGlzcGxheUhpbnQgPSBwYXRoLnJlcGxhY2UoL15bXmEtekEtWl0rLywgJycpO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBKU09OX1BBVEhfVE9LRU5fU1lNQk9MLCB7IHZhbHVlOiB0cnVlIH0pO1xuICB9XG5cbiAgcHVibGljIHJlc29sdmUoX2N0eDogSVJlc29sdmVDb250ZXh0KTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5wYXRoO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBUb2tlbi5hc1N0cmluZyh0aGlzLCB7IGRpc3BsYXlIaW50OiB0aGlzLmRpc3BsYXlIaW50IH0pO1xuICB9XG5cbiAgcHVibGljIHRvSlNPTigpIHtcbiAgICByZXR1cm4gYDxwYXRoOiR7dGhpcy5wYXRofT5gO1xuICB9XG59XG5cbi8qKlxuICogRGVlcCByZW5kZXIgYSBKU09OIG9iamVjdCB0byBleHBhbmQgSlNPTiBwYXRoIGZpZWxkcywgdXBkYXRpbmcgdGhlIGtleSB0byBlbmQgaW4gJy4kJ1xuICovXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyT2JqZWN0KG9iajogb2JqZWN0IHwgdW5kZWZpbmVkKTogb2JqZWN0IHwgdW5kZWZpbmVkIHtcbiAgcmV0dXJuIHJlY3Vyc2VPYmplY3Qob2JqLCB7XG4gICAgaGFuZGxlU3RyaW5nOiByZW5kZXJTdHJpbmcsXG4gICAgaGFuZGxlTGlzdDogcmVuZGVyU3RyaW5nTGlzdCxcbiAgICBoYW5kbGVOdW1iZXI6IHJlbmRlck51bWJlcixcbiAgICBoYW5kbGVCb29sZWFuOiByZW5kZXJCb29sZWFuLFxuICAgIGhhbmRsZVJlc29sdmFibGU6IHJlbmRlclJlc29sdmFibGUsXG4gIH0pO1xufVxuXG4vKipcbiAqIFJldHVybiBhbGwgSlNPTiBwYXRocyB0aGF0IGFyZSB1c2VkIGluIHRoZSBnaXZlbiBzdHJ1Y3R1cmVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRSZWZlcmVuY2VkUGF0aHMob2JqOiBvYmplY3QgfCB1bmRlZmluZWQpOiBTZXQ8c3RyaW5nPiB7XG4gIGNvbnN0IGZvdW5kID0gbmV3IFNldDxzdHJpbmc+KCk7XG5cbiAgcmVjdXJzZU9iamVjdChvYmosIHtcbiAgICBoYW5kbGVTdHJpbmcoX2tleTogc3RyaW5nLCB4OiBzdHJpbmcpIHtcbiAgICAgIGZvciAoY29uc3QgcCBvZiBmaW5kUGF0aHNJbkludHJpbnNpY0Z1bmN0aW9ucyhqc29uUGF0aFN0cmluZyh4KSkpIHtcbiAgICAgICAgZm91bmQuYWRkKHApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHt9O1xuICAgIH0sXG5cbiAgICBoYW5kbGVMaXN0KF9rZXk6IHN0cmluZywgeDogc3RyaW5nW10pIHtcbiAgICAgIGZvciAoY29uc3QgcCBvZiBmaW5kUGF0aHNJbkludHJpbnNpY0Z1bmN0aW9ucyhqc29uUGF0aFN0cmluZ0xpc3QoeCkpKSB7XG4gICAgICAgIGZvdW5kLmFkZChwKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7fTtcbiAgICB9LFxuXG4gICAgaGFuZGxlTnVtYmVyKF9rZXk6IHN0cmluZywgeDogbnVtYmVyKSB7XG4gICAgICBmb3IgKGNvbnN0IHAgb2YgZmluZFBhdGhzSW5JbnRyaW5zaWNGdW5jdGlvbnMoanNvblBhdGhOdW1iZXIoeCkpKSB7XG4gICAgICAgIGZvdW5kLmFkZChwKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7fTtcbiAgICB9LFxuXG4gICAgaGFuZGxlQm9vbGVhbihfa2V5OiBzdHJpbmcsIF94OiBib29sZWFuKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfSxcblxuICAgIGhhbmRsZVJlc29sdmFibGUoX2tleTogc3RyaW5nLCB4OiBJUmVzb2x2YWJsZSkge1xuICAgICAgZm9yIChjb25zdCBwIG9mIGZpbmRQYXRoc0luSW50cmluc2ljRnVuY3Rpb25zKGpzb25QYXRoRnJvbUFueSh4KSkpIHtcbiAgICAgICAgZm91bmQuYWRkKHApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHt9O1xuICAgIH0sXG4gIH0pO1xuXG4gIHJldHVybiBmb3VuZDtcbn1cblxuLyoqXG4gKiBGcm9tIGFuIGV4cHJlc3Npb24sIHJldHVybiB0aGUgbGlzdCBvZiBKU09OIHBhdGhzIHJlZmVyZW5jZWQgaW4gaXRcbiAqL1xuZnVuY3Rpb24gZmluZFBhdGhzSW5JbnRyaW5zaWNGdW5jdGlvbnMoZXhwcmVzc2lvbj86IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgaWYgKCFleHByZXNzaW9uKSB7IHJldHVybiBbXTsgfVxuXG4gIGNvbnN0IHJldCA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBwYXJzZWQgPSBuZXcgSW50cmluc2ljUGFyc2VyKGV4cHJlc3Npb24pLnBhcnNlVG9wTGV2ZWxJbnRyaW5zaWMoKTtcbiAgICByZWN1cnNlKHBhcnNlZCk7XG4gICAgcmV0dXJuIHJldDtcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIE5vdCBzdXJlIHRoYXQgb3VyIHBhcnNpbmcgaXMgMTAwJSBjb3JyZWN0LiBXZSBkb24ndCB3YW50IHRvIGJyZWFrIGFueW9uZSwgc29cbiAgICAvLyBmYWxsIGJhY2sgdG8gbGVnYWN5IGJlaGF2aW9yIGlmIHdlIGNhbid0IHBhcnNlIHRoaXMgc3RyaW5nLlxuICAgIHJldHVybiBbZXhwcmVzc2lvbl07XG4gIH1cblxuICBmdW5jdGlvbiByZWN1cnNlKHA6IEludHJpbnNpY0V4cHJlc3Npb24pIHtcbiAgICBzd2l0Y2ggKHAudHlwZSkge1xuICAgICAgY2FzZSAncGF0aCc6XG4gICAgICAgIHJldC5wdXNoKHAucGF0aCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdmbmNhbGwnOlxuICAgICAgICBmb3IgKGNvbnN0IGFyZyBvZiBwLmFyZ3VtZW50cykge1xuICAgICAgICAgIHJlY3Vyc2UoYXJnKTtcbiAgICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5pbnRlcmZhY2UgRmllbGRIYW5kbGVycyB7XG4gIGhhbmRsZVN0cmluZyhrZXk6IHN0cmluZywgeDogc3RyaW5nKToge1trZXk6IHN0cmluZ106IHN0cmluZ307XG4gIGhhbmRsZUxpc3Qoa2V5OiBzdHJpbmcsIHg6IHN0cmluZ1tdKToge1trZXk6IHN0cmluZ106IHN0cmluZ1tdIHwgc3RyaW5nIH07XG4gIGhhbmRsZU51bWJlcihrZXk6IHN0cmluZywgeDogbnVtYmVyKToge1trZXk6IHN0cmluZ106IG51bWJlciB8IHN0cmluZ307XG4gIGhhbmRsZUJvb2xlYW4oa2V5OiBzdHJpbmcsIHg6IGJvb2xlYW4pOiB7W2tleTogc3RyaW5nXTogYm9vbGVhbn07XG4gIGhhbmRsZVJlc29sdmFibGUoa2V5OiBzdHJpbmcsIHg6IElSZXNvbHZhYmxlKToge1trZXk6IHN0cmluZ106IGFueX07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWN1cnNlT2JqZWN0KG9iajogb2JqZWN0IHwgdW5kZWZpbmVkLCBoYW5kbGVyczogRmllbGRIYW5kbGVycywgdmlzaXRlZDogb2JqZWN0W10gPSBbXSk6IG9iamVjdCB8IHVuZGVmaW5lZCB7XG4gIC8vIElmIHRoZSBhcmd1bWVudCByZWNlaXZlZCBpcyBub3QgYWN0dWFsbHkgYW4gb2JqZWN0IChzdHJpbmcsIG51bWJlciwgYm9vbGVhbiwgdW5kZWZpbmVkLCAuLi4pIG9yIG51bGxcbiAgLy8ganVzdCByZXR1cm4gaXQgYXMgaXMgYXMgdGhlcmUncyBub3RoaW5nIHRvIGJlIHJlbmRlcmVkLiBUaGlzIHNob3VsZCBvbmx5IGhhcHBlbiBpbiB0aGUgb3JpZ2luYWwgY2FsbCB0b1xuICAvLyByZWN1cnNlT2JqZWN0IGFzIGFueSByZWN1cnNpdmUgY2FsbHMgdG8gaXQgYXJlIGNoZWNraW5nIGZvciB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICE9PSBudWxsXG4gIGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JyB8fCBvYmogPT09IG51bGwpIHtcbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgLy8gQXZvaWRpbmcgaW5maW5pdGUgcmVjdXJzaW9uXG4gIGlmICh2aXNpdGVkLmluY2x1ZGVzKG9iaikpIHsgcmV0dXJuIHt9OyB9XG5cbiAgLy8gTWFya2luZyBjdXJyZW50IG9iamVjdCBhcyB2aXNpdGVkIGZvciB0aGUgY3VycmVudCByZWN1cnNpb24gcGF0aFxuICB2aXNpdGVkLnB1c2gob2JqKTtcblxuICBjb25zdCByZXQ6IGFueSA9IHt9O1xuICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhvYmopKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIE9iamVjdC5hc3NpZ24ocmV0LCBoYW5kbGVycy5oYW5kbGVTdHJpbmcoa2V5LCB2YWx1ZSkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgT2JqZWN0LmFzc2lnbihyZXQsIGhhbmRsZXJzLmhhbmRsZU51bWJlcihrZXksIHZhbHVlKSk7XG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgT2JqZWN0LmFzc2lnbihyZXQsIHJlY3Vyc2VBcnJheShrZXksIHZhbHVlLCBoYW5kbGVycywgdmlzaXRlZCkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbicpIHtcbiAgICAgIE9iamVjdC5hc3NpZ24ocmV0LCBoYW5kbGVycy5oYW5kbGVCb29sZWFuKGtleSwgdmFsdWUpKTtcbiAgICB9IGVsc2UgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIE5vdGhpbmdcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGlmIChUb2tlbml6YXRpb24uaXNSZXNvbHZhYmxlKHZhbHVlKSkge1xuICAgICAgICBPYmplY3QuYXNzaWduKHJldCwgaGFuZGxlcnMuaGFuZGxlUmVzb2x2YWJsZShrZXksIHZhbHVlKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXRba2V5XSA9IHJlY3Vyc2VPYmplY3QodmFsdWUsIGhhbmRsZXJzLCB2aXNpdGVkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBSZW1vdmluZyBmcm9tIHZpc2l0ZWQgYWZ0ZXIgbGVhdmluZyB0aGUgY3VycmVudCByZWN1cnNpb24gcGF0aFxuICAvLyBBbGxvd2luZyBpdCB0byBiZSB2aXNpdGVkIGFnYWluIGlmIGl0J3Mgbm90IGNhdXNpbmcgYSByZWN1cnNpb24gKGNpcmN1bGFyIHJlZmVyZW5jZSlcbiAgdmlzaXRlZC5wb3AoKTtcblxuICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIFJlbmRlciBhbiBhcnJheSB0aGF0IG1heSBvciBtYXkgbm90IGNvbnRhaW4gYSBzdHJpbmcgbGlzdCB0b2tlblxuICovXG5mdW5jdGlvbiByZWN1cnNlQXJyYXkoa2V5OiBzdHJpbmcsIGFycjogYW55W10sIGhhbmRsZXJzOiBGaWVsZEhhbmRsZXJzLCB2aXNpdGVkOiBvYmplY3RbXSA9IFtdKToge1trZXk6IHN0cmluZ106IGFueVtdIHwgc3RyaW5nfSB7XG4gIGlmIChpc1N0cmluZ0FycmF5KGFycikpIHtcbiAgICBjb25zdCBwYXRoID0ganNvblBhdGhTdHJpbmdMaXN0KGFycik7XG4gICAgaWYgKHBhdGggIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZXJzLmhhbmRsZUxpc3Qoa2V5LCBhcnIpO1xuICAgIH1cblxuICAgIC8vIEZhbGwgdGhyb3VnaCB0byBjb3JyZWN0bHkgcmVqZWN0IGVuY29kZWQgc3RyaW5ncyBpbnNpZGUgYW4gYXJyYXkuXG4gICAgLy8gVGhleSBjYW5ub3QgYmUgcmVwcmVzZW50ZWQgYmVjYXVzZSB0aGVyZSBpcyBubyBrZXkgdG8gYXBwZW5kIGEgJy4kJyB0by5cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgW2tleV06IGFyci5tYXAodmFsdWUgPT4ge1xuICAgICAgaWYgKCh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmIGpzb25QYXRoU3RyaW5nKHZhbHVlKSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICB8fCAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBqc29uUGF0aE51bWJlcih2YWx1ZSkgIT09IHVuZGVmaW5lZClcbiAgICAgICAgfHwgKGlzU3RyaW5nQXJyYXkodmFsdWUpICYmIGpzb25QYXRoU3RyaW5nTGlzdCh2YWx1ZSkgIT09IHVuZGVmaW5lZCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgdXNlIEpzb25QYXRoIGZpZWxkcyBpbiBhbiBhcnJheSwgdGhleSBtdXN0IGJlIHVzZWQgaW4gb2JqZWN0cycpO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgIT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHJlY3Vyc2VPYmplY3QodmFsdWUsIGhhbmRsZXJzLCB2aXNpdGVkKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9KSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gaXNTdHJpbmdBcnJheSh4OiBhbnkpOiB4IGlzIHN0cmluZ1tdIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoeCkgJiYgeC5ldmVyeShlbCA9PiB0eXBlb2YgZWwgPT09ICdzdHJpbmcnKTtcbn1cblxuLyoqXG4gKiBSZW5kZXIgYSBwYXJhbWV0ZXIgc3RyaW5nXG4gKlxuICogSWYgdGhlIHN0cmluZyB2YWx1ZSBzdGFydHMgd2l0aCAnJC4nLCByZW5kZXIgaXQgYXMgYSBwYXRoIHN0cmluZywgb3RoZXJ3aXNlIGFzIGEgZGlyZWN0IHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gcmVuZGVyU3RyaW5nKGtleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKToge1trZXk6IHN0cmluZ106IHN0cmluZ30ge1xuICBjb25zdCBwYXRoID0ganNvblBhdGhTdHJpbmcodmFsdWUpO1xuICBpZiAocGF0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHsgW2tleSArICcuJCddOiBwYXRoIH07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHsgW2tleV06IHZhbHVlIH07XG4gIH1cbn1cblxuLyoqXG4gKiBSZW5kZXIgYSByZXNvbHZhYmxlXG4gKlxuICogSWYgd2UgY2FuIGV4dHJhY3QgYSBQYXRoIGZyb20gaXQsIHJlbmRlciBhcyBhIHBhdGggc3RyaW5nLCBvdGhlcndpc2UgYXMgaXRzZWxmICh3aWxsXG4gKiBiZSByZXNvbHZlZCBsYXRlclxuICovXG5mdW5jdGlvbiByZW5kZXJSZXNvbHZhYmxlKGtleTogc3RyaW5nLCB2YWx1ZTogSVJlc29sdmFibGUpOiB7W2tleTogc3RyaW5nXTogYW55fSB7XG4gIGNvbnN0IHBhdGggPSBqc29uUGF0aEZyb21BbnkodmFsdWUpO1xuICBpZiAocGF0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHsgW2tleSArICcuJCddOiBwYXRoIH07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHsgW2tleV06IHZhbHVlIH07XG4gIH1cbn1cblxuLyoqXG4gKiBSZW5kZXIgYSBwYXJhbWV0ZXIgc3RyaW5nIGxpc3RcbiAqXG4gKiBJZiB0aGUgc3RyaW5nIHZhbHVlIHN0YXJ0cyB3aXRoICckLicsIHJlbmRlciBpdCBhcyBhIHBhdGggc3RyaW5nLCBvdGhlcndpc2UgYXMgYSBkaXJlY3Qgc3RyaW5nLlxuICovXG5mdW5jdGlvbiByZW5kZXJTdHJpbmdMaXN0KGtleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nW10pOiB7W2tleTogc3RyaW5nXTogc3RyaW5nW10gfCBzdHJpbmd9IHtcbiAgY29uc3QgcGF0aCA9IGpzb25QYXRoU3RyaW5nTGlzdCh2YWx1ZSk7XG4gIGlmIChwYXRoICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4geyBba2V5ICsgJy4kJ106IHBhdGggfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4geyBba2V5XTogdmFsdWUgfTtcbiAgfVxufVxuXG4vKipcbiAqIFJlbmRlciBhIHBhcmFtZXRlciBudW1iZXJcbiAqXG4gKiBJZiB0aGUgc3RyaW5nIHZhbHVlIHN0YXJ0cyB3aXRoICckLicsIHJlbmRlciBpdCBhcyBhIHBhdGggc3RyaW5nLCBvdGhlcndpc2UgYXMgYSBkaXJlY3Qgc3RyaW5nLlxuICovXG5mdW5jdGlvbiByZW5kZXJOdW1iZXIoa2V5OiBzdHJpbmcsIHZhbHVlOiBudW1iZXIpOiB7W2tleTogc3RyaW5nXTogbnVtYmVyIHwgc3RyaW5nfSB7XG4gIGNvbnN0IHBhdGggPSBqc29uUGF0aE51bWJlcih2YWx1ZSk7XG4gIGlmIChwYXRoICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4geyBba2V5ICsgJy4kJ106IHBhdGggfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4geyBba2V5XTogdmFsdWUgfTtcbiAgfVxufVxuXG4vKipcbiAqIFJlbmRlciBhIHBhcmFtZXRlciBib29sZWFuXG4gKi9cbmZ1bmN0aW9uIHJlbmRlckJvb2xlYW4oa2V5OiBzdHJpbmcsIHZhbHVlOiBib29sZWFuKToge1trZXk6IHN0cmluZ106IGJvb2xlYW59IHtcbiAgcmV0dXJuIHsgW2tleV06IHZhbHVlIH07XG59XG5cbi8qKlxuICogSWYgdGhlIGluZGljYXRlZCBzdHJpbmcgaXMgYW4gZW5jb2RlZCBKU09OIHBhdGgsIHJldHVybiB0aGUgcGF0aFxuICpcbiAqIE90aGVyd2lzZSByZXR1cm4gdW5kZWZpbmVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24ganNvblBhdGhTdHJpbmcoeDogc3RyaW5nKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgY29uc3QgZnJhZ21lbnRzID0gVG9rZW5pemF0aW9uLnJldmVyc2VTdHJpbmcoeCk7XG4gIGNvbnN0IGpzb25QYXRoVG9rZW5zID0gZnJhZ21lbnRzLnRva2Vucy5maWx0ZXIoSnNvblBhdGhUb2tlbi5pc0pzb25QYXRoVG9rZW4pO1xuXG4gIGlmIChqc29uUGF0aFRva2Vucy5sZW5ndGggPiAwICYmIGZyYWdtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBGaWVsZCByZWZlcmVuY2VzIG11c3QgYmUgdGhlIGVudGlyZSBzdHJpbmcsIGNhbm5vdCBjb25jYXRlbmF0ZSB0aGVtIChmb3VuZCAnJHt4fScpYCk7XG4gIH1cbiAgaWYgKGpzb25QYXRoVG9rZW5zLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4ganNvblBhdGhUb2tlbnNbMF0ucGF0aDtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24ganNvblBhdGhGcm9tQW55KHg6IGFueSkge1xuICBpZiAoIXgpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuICBpZiAodHlwZW9mIHggPT09ICdzdHJpbmcnKSB7IHJldHVybiBqc29uUGF0aFN0cmluZyh4KTsgfVxuICByZXR1cm4gcGF0aEZyb21Ub2tlbihUb2tlbml6YXRpb24ucmV2ZXJzZSh4KSk7XG59XG5cbi8qKlxuICogSWYgdGhlIGluZGljYXRlZCBzdHJpbmcgbGlzdCBpcyBhbiBlbmNvZGVkIEpTT04gcGF0aCwgcmV0dXJuIHRoZSBwYXRoXG4gKlxuICogT3RoZXJ3aXNlIHJldHVybiB1bmRlZmluZWQuXG4gKi9cbmZ1bmN0aW9uIGpzb25QYXRoU3RyaW5nTGlzdCh4OiBzdHJpbmdbXSk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gIHJldHVybiBwYXRoRnJvbVRva2VuKFRva2VuaXphdGlvbi5yZXZlcnNlTGlzdCh4KSk7XG59XG5cbi8qKlxuICogSWYgdGhlIGluZGljYXRlZCBudW1iZXIgaXMgYW4gZW5jb2RlZCBKU09OIHBhdGgsIHJldHVybiB0aGUgcGF0aFxuICpcbiAqIE90aGVyd2lzZSByZXR1cm4gdW5kZWZpbmVkLlxuICovXG5mdW5jdGlvbiBqc29uUGF0aE51bWJlcih4OiBudW1iZXIpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICByZXR1cm4gcGF0aEZyb21Ub2tlbihUb2tlbml6YXRpb24ucmV2ZXJzZU51bWJlcih4KSk7XG59XG5cbmZ1bmN0aW9uIHBhdGhGcm9tVG9rZW4odG9rZW46IElSZXNvbHZhYmxlIHwgdW5kZWZpbmVkKSB7XG4gIHJldHVybiB0b2tlbiAmJiAoSnNvblBhdGhUb2tlbi5pc0pzb25QYXRoVG9rZW4odG9rZW4pID8gdG9rZW4ucGF0aCA6IHVuZGVmaW5lZCk7XG59XG5cbi8qKlxuICogUmVuZGVyIHRoZSBzdHJpbmcgb3IgbnVtYmVyIHZhbHVlIGluIGEgdmFsaWQgSlNPTiBQYXRoIGV4cHJlc3Npb24uXG4gKlxuICogSWYgdGhlIHZhbHVlIGlzIGEgVG9rZW5pemVkIEpTT04gcGF0aCByZWZlcmVuY2UgLS0gcmV0dXJuIHRoZSBKU09OIHBhdGggcmVmZXJlbmNlIGluc2lkZSBpdC5cbiAqIElmIHRoZSB2YWx1ZSBpcyBhIG51bWJlciAtLSBjb252ZXJ0IGl0IHRvIHN0cmluZy5cbiAqIElmIHRoZSB2YWx1ZSBpcyBhIHN0cmluZyAtLSBzaW5nbGUtcXVvdGUgaXQuXG4gKiBPdGhlcndpc2UsIHRocm93IGVycm9ycy5cbiAqXG4gKiBDYWxsIHRoaXMgZnVuY3Rpb24gd2hlbmV2ZXIgeW91J3JlIGJ1aWxkaW5nIGNvbXBvdW5kIEpTT05QYXRoIGV4cHJlc3Npb25zLCBpblxuICogb3JkZXIgdG8gYXZvaWQgaGF2aW5nIHRva2Vucy1pbi10b2tlbnMtaW4tdG9rZW5zIHdoaWNoIGJlY29tZSB2ZXJ5IGhhcmQgdG8gcGFyc2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJJbkV4cHJlc3Npb24oeDogYW55KSB7XG4gIGNvbnN0IHBhdGggPSBqc29uUGF0aEZyb21BbnkoeCk7XG4gIGlmIChwYXRoKSByZXR1cm4gcGF0aDtcbiAgaWYgKHR5cGVvZiB4ID09PSAnbnVtYmVyJykgcmV0dXJuIHgudG9TdHJpbmcoMTApO1xuICBpZiAodHlwZW9mIHggPT09ICdzdHJpbmcnKSByZXR1cm4gc2luZ2xlUXVvdGVzdHJpbmcoeCk7XG4gIHRocm93IG5ldyBFcnJvcignVW54ZXhwZWN0ZWQgdmFsdWUuJyk7XG59XG5cbmZ1bmN0aW9uIHNpbmdsZVF1b3Rlc3RyaW5nKHg6IHN0cmluZykge1xuICBjb25zdCByZXQgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuICByZXQucHVzaChcIidcIik7XG4gIGZvciAoY29uc3QgYyBvZiB4KSB7XG4gICAgaWYgKGMgPT09IFwiJ1wiKSB7XG4gICAgICByZXQucHVzaChcIlxcXFwnXCIpO1xuICAgIH0gZWxzZSBpZiAoYyA9PT0gJ1xcXFwnKSB7XG4gICAgICByZXQucHVzaCgnXFxcXFxcXFwnKTtcbiAgICB9IGVsc2UgaWYgKGMgPT09ICdcXG4nKSB7XG4gICAgICByZXQucHVzaCgnXFxcXG4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0LnB1c2goYyk7XG4gICAgfVxuICB9XG4gIHJldC5wdXNoKFwiJ1wiKTtcbiAgcmV0dXJuIHJldC5qb2luKCcnKTtcbn1cbiJdfQ==