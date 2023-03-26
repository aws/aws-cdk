"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.undefinedIfAllValuesAreEmpty = exports.findLastCommonElement = exports.pathToTopLevelStack = exports.PostResolveToken = exports.filterUndefined = exports.ignoreEmpty = exports.capitalizePropertyNames = void 0;
const intrinsic_1 = require("./private/intrinsic");
const stack_1 = require("./stack");
/**
 * Given an object, converts all keys to PascalCase given they are currently in camel case.
 * @param obj The object.
 */
function capitalizePropertyNames(construct, obj) {
    const stack = stack_1.Stack.of(construct);
    obj = stack.resolve(obj);
    if (typeof (obj) !== 'object') {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(x => capitalizePropertyNames(construct, x));
    }
    const newObj = {};
    for (const key of Object.keys(obj)) {
        const value = obj[key];
        const first = key.charAt(0).toUpperCase();
        const newKey = first + key.slice(1);
        newObj[newKey] = capitalizePropertyNames(construct, value);
    }
    return newObj;
}
exports.capitalizePropertyNames = capitalizePropertyNames;
/**
 * Turns empty arrays/objects to undefined (after evaluating tokens).
 */
function ignoreEmpty(obj) {
    return new PostResolveToken(obj, o => {
        // undefined/null
        if (o == null) {
            return o;
        }
        if (Array.isArray(o) && o.length === 0) {
            return undefined;
        }
        if (typeof (o) === 'object' && Object.keys(o).length === 0) {
            return undefined;
        }
        return o;
    });
}
exports.ignoreEmpty = ignoreEmpty;
/**
 * Returns a copy of `obj` without `undefined` (or `null`) values in maps or arrays.
 */
function filterUndefined(obj) {
    if (Array.isArray(obj)) {
        return obj.filter(x => x != null).map(x => filterUndefined(x));
    }
    if (typeof (obj) === 'object') {
        const ret = {};
        for (const [key, value] of Object.entries(obj)) {
            if (value == null) {
                continue;
            }
            ret[key] = filterUndefined(value);
        }
        return ret;
    }
    return obj;
}
exports.filterUndefined = filterUndefined;
/**
 * A Token that applies a function AFTER resolve resolution
 */
class PostResolveToken extends intrinsic_1.Intrinsic {
    constructor(value, processor) {
        super(value, { stackTrace: false });
        this.processor = processor;
    }
    resolve(context) {
        context.registerPostProcessor(this);
        return super.resolve(context);
    }
    postProcess(o, _context) {
        return this.processor(o);
    }
}
exports.PostResolveToken = PostResolveToken;
/**
 * @returns the list of stacks that lead from the top-level stack (non-nested) all the way to a nested stack.
 */
function pathToTopLevelStack(s) {
    if (s.nestedStackParent) {
        return [...pathToTopLevelStack(s.nestedStackParent), s];
    }
    else {
        return [s];
    }
}
exports.pathToTopLevelStack = pathToTopLevelStack;
/**
 * Given two arrays, returns the last common element or `undefined` if there
 * isn't (arrays are foriegn).
 */
function findLastCommonElement(path1, path2) {
    let i = 0;
    while (i < path1.length && i < path2.length) {
        if (path1[i] !== path2[i]) {
            break;
        }
        i++;
    }
    return path1[i - 1];
}
exports.findLastCommonElement = findLastCommonElement;
function undefinedIfAllValuesAreEmpty(object) {
    return Object.values(object).some(v => v !== undefined) ? object : undefined;
}
exports.undefinedIfAllValuesAreEmpty = undefinedIfAllValuesAreEmpty;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsbURBQWdEO0FBRWhELG1DQUFnQztBQUVoQzs7O0dBR0c7QUFDSCxTQUFnQix1QkFBdUIsQ0FBQyxTQUFxQixFQUFFLEdBQVE7SUFDckUsTUFBTSxLQUFLLEdBQUcsYUFBSyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNsQyxHQUFHLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUV6QixJQUFJLE9BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxRQUFRLEVBQUU7UUFDNUIsT0FBTyxHQUFHLENBQUM7S0FDWjtJQUVELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUN0QixPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUM1RDtJQUVELE1BQU0sTUFBTSxHQUFRLEVBQUcsQ0FBQztJQUN4QixLQUFLLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDbEMsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXZCLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDMUMsTUFBTSxNQUFNLEdBQUcsS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLHVCQUF1QixDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUM1RDtJQUVELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUF0QkQsMERBc0JDO0FBRUQ7O0dBRUc7QUFD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ekIsTUFBTTtTQUNQO1FBRUQsQ0FBQyxFQUFFLENBQUM7S0FDTDtJQUVELE9BQU8sS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN0QixDQUFDO0FBWEQsc0RBV0M7QUFFRCxTQUFnQiw0QkFBNEIsQ0FBQyxNQUFjO0lBQ3pELE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0FBQy9FLENBQUM7QUFGRCxvRUFFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEludHJpbnNpYyB9IGZyb20gJy4vcHJpdmF0ZS9pbnRyaW5zaWMnO1xuaW1wb3J0IHsgSVBvc3RQcm9jZXNzb3IsIElSZXNvbHZlQ29udGV4dCB9IGZyb20gJy4vcmVzb2x2YWJsZSc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJy4vc3RhY2snO1xuXG4vKipcbiAqIEdpdmVuIGFuIG9iamVjdCwgY29udmVydHMgYWxsIGtleXMgdG8gUGFzY2FsQ2FzZSBnaXZlbiB0aGV5IGFyZSBjdXJyZW50bHkgaW4gY2FtZWwgY2FzZS5cbiAqIEBwYXJhbSBvYmogVGhlIG9iamVjdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhcGl0YWxpemVQcm9wZXJ0eU5hbWVzKGNvbnN0cnVjdDogSUNvbnN0cnVjdCwgb2JqOiBhbnkpOiBhbnkge1xuICBjb25zdCBzdGFjayA9IFN0YWNrLm9mKGNvbnN0cnVjdCk7XG4gIG9iaiA9IHN0YWNrLnJlc29sdmUob2JqKTtcblxuICBpZiAodHlwZW9mKG9iaikgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcbiAgICByZXR1cm4gb2JqLm1hcCh4ID0+IGNhcGl0YWxpemVQcm9wZXJ0eU5hbWVzKGNvbnN0cnVjdCwgeCkpO1xuICB9XG5cbiAgY29uc3QgbmV3T2JqOiBhbnkgPSB7IH07XG4gIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKG9iaikpIHtcbiAgICBjb25zdCB2YWx1ZSA9IG9ialtrZXldO1xuXG4gICAgY29uc3QgZmlyc3QgPSBrZXkuY2hhckF0KDApLnRvVXBwZXJDYXNlKCk7XG4gICAgY29uc3QgbmV3S2V5ID0gZmlyc3QgKyBrZXkuc2xpY2UoMSk7XG4gICAgbmV3T2JqW25ld0tleV0gPSBjYXBpdGFsaXplUHJvcGVydHlOYW1lcyhjb25zdHJ1Y3QsIHZhbHVlKTtcbiAgfVxuXG4gIHJldHVybiBuZXdPYmo7XG59XG5cbi8qKlxuICogVHVybnMgZW1wdHkgYXJyYXlzL29iamVjdHMgdG8gdW5kZWZpbmVkIChhZnRlciBldmFsdWF0aW5nIHRva2VucykuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpZ25vcmVFbXB0eShvYmo6IGFueSk6IGFueSB7XG4gIHJldHVybiBuZXcgUG9zdFJlc29sdmVUb2tlbihvYmosIG8gPT4ge1xuICAgIC8vIHVuZGVmaW5lZC9udWxsXG4gICAgaWYgKG8gPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG87XG4gICAgfVxuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkobykgJiYgby5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZihvKSA9PT0gJ29iamVjdCcgJiYgT2JqZWN0LmtleXMobykubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiBvO1xuICB9KTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgY29weSBvZiBgb2JqYCB3aXRob3V0IGB1bmRlZmluZWRgIChvciBgbnVsbGApIHZhbHVlcyBpbiBtYXBzIG9yIGFycmF5cy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlclVuZGVmaW5lZChvYmo6IGFueSk6IGFueSB7XG4gIGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcbiAgICByZXR1cm4gb2JqLmZpbHRlcih4ID0+IHggIT0gbnVsbCkubWFwKHggPT4gZmlsdGVyVW5kZWZpbmVkKHgpKTtcbiAgfVxuXG4gIGlmICh0eXBlb2Yob2JqKSA9PT0gJ29iamVjdCcpIHtcbiAgICBjb25zdCByZXQ6IGFueSA9IHsgfTtcbiAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhvYmopKSB7XG4gICAgICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHJldFtrZXldID0gZmlsdGVyVW5kZWZpbmVkKHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogQSBUb2tlbiB0aGF0IGFwcGxpZXMgYSBmdW5jdGlvbiBBRlRFUiByZXNvbHZlIHJlc29sdXRpb25cbiAqL1xuZXhwb3J0IGNsYXNzIFBvc3RSZXNvbHZlVG9rZW4gZXh0ZW5kcyBJbnRyaW5zaWMgaW1wbGVtZW50cyBJUG9zdFByb2Nlc3NvciB7XG4gIGNvbnN0cnVjdG9yKHZhbHVlOiBhbnksIHByaXZhdGUgcmVhZG9ubHkgcHJvY2Vzc29yOiAoeDogYW55KSA9PiBhbnkpIHtcbiAgICBzdXBlcih2YWx1ZSwgeyBzdGFja1RyYWNlOiBmYWxzZSB9KTtcbiAgfVxuXG4gIHB1YmxpYyByZXNvbHZlKGNvbnRleHQ6IElSZXNvbHZlQ29udGV4dCkge1xuICAgIGNvbnRleHQucmVnaXN0ZXJQb3N0UHJvY2Vzc29yKHRoaXMpO1xuICAgIHJldHVybiBzdXBlci5yZXNvbHZlKGNvbnRleHQpO1xuICB9XG5cbiAgcHVibGljIHBvc3RQcm9jZXNzKG86IGFueSwgX2NvbnRleHQ6IElSZXNvbHZlQ29udGV4dCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMucHJvY2Vzc29yKG8pO1xuICB9XG59XG5cbi8qKlxuICogQHJldHVybnMgdGhlIGxpc3Qgb2Ygc3RhY2tzIHRoYXQgbGVhZCBmcm9tIHRoZSB0b3AtbGV2ZWwgc3RhY2sgKG5vbi1uZXN0ZWQpIGFsbCB0aGUgd2F5IHRvIGEgbmVzdGVkIHN0YWNrLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGF0aFRvVG9wTGV2ZWxTdGFjayhzOiBTdGFjayk6IFN0YWNrW10ge1xuICBpZiAocy5uZXN0ZWRTdGFja1BhcmVudCkge1xuICAgIHJldHVybiBbLi4ucGF0aFRvVG9wTGV2ZWxTdGFjayhzLm5lc3RlZFN0YWNrUGFyZW50KSwgc107XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFtzXTtcbiAgfVxufVxuXG4vKipcbiAqIEdpdmVuIHR3byBhcnJheXMsIHJldHVybnMgdGhlIGxhc3QgY29tbW9uIGVsZW1lbnQgb3IgYHVuZGVmaW5lZGAgaWYgdGhlcmVcbiAqIGlzbid0IChhcnJheXMgYXJlIGZvcmllZ24pLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZExhc3RDb21tb25FbGVtZW50PFQ+KHBhdGgxOiBUW10sIHBhdGgyOiBUW10pOiBUIHwgdW5kZWZpbmVkIHtcbiAgbGV0IGkgPSAwO1xuICB3aGlsZSAoaSA8IHBhdGgxLmxlbmd0aCAmJiBpIDwgcGF0aDIubGVuZ3RoKSB7XG4gICAgaWYgKHBhdGgxW2ldICE9PSBwYXRoMltpXSkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaSsrO1xuICB9XG5cbiAgcmV0dXJuIHBhdGgxW2kgLSAxXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVuZGVmaW5lZElmQWxsVmFsdWVzQXJlRW1wdHkob2JqZWN0OiBvYmplY3QpOiBvYmplY3QgfCB1bmRlZmluZWQge1xuICByZXR1cm4gT2JqZWN0LnZhbHVlcyhvYmplY3QpLnNvbWUodiA9PiB2ICE9PSB1bmRlZmluZWQpID8gb2JqZWN0IDogdW5kZWZpbmVkO1xufVxuIl19