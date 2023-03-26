"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sum = exports.UniqueStringSet = exports.mergePrincipal = exports.AttachedPolicies = exports.generatePolicyName = exports.undefinedIfEmpty = exports.LITERAL_STRING_KEY = void 0;
const core_1 = require("@aws-cdk/core");
const MAX_POLICY_NAME_LEN = 128;
exports.LITERAL_STRING_KEY = 'LiteralString';
function undefinedIfEmpty(f) {
    return core_1.Lazy.list({
        produce: () => {
            const array = f();
            return (array && array.length > 0) ? array : undefined;
        },
    });
}
exports.undefinedIfEmpty = undefinedIfEmpty;
/**
 * Used to generate a unique policy name based on the policy resource construct.
 * The logical ID of the resource is a great candidate as long as it doesn't exceed
 * 128 characters, so we take the last 128 characters (in order to make sure the hash
 * is there).
 */
function generatePolicyName(scope, logicalId) {
    // as logicalId is itself a Token, resolve it first
    const resolvedLogicalId = core_1.Tokenization.resolve(logicalId, {
        scope,
        resolver: new core_1.DefaultTokenResolver(new core_1.StringConcat()),
    });
    return lastNCharacters(resolvedLogicalId, MAX_POLICY_NAME_LEN);
}
exports.generatePolicyName = generatePolicyName;
/**
 * Returns a string composed of the last n characters of str.
 * If str is shorter than n, returns str.
 *
 * @param str the string to return the last n characters of
 * @param n how many characters to return
 */
function lastNCharacters(str, n) {
    const startIndex = Math.max(str.length - n, 0);
    return str.substring(startIndex, str.length);
}
/**
 * Helper class that maintains the set of attached policies for a principal.
 */
class AttachedPolicies {
    constructor() {
        this.policies = new Array();
    }
    /**
     * Adds a policy to the list of attached policies.
     *
     * If this policy is already, attached, returns false.
     * If there is another policy attached with the same name, throws an exception.
     */
    attach(policy) {
        if (this.policies.find(p => p === policy)) {
            return; // already attached
        }
        if (this.policies.find(p => p.policyName === policy.policyName)) {
            throw new Error(`A policy named "${policy.policyName}" is already attached`);
        }
        this.policies.push(policy);
    }
}
exports.AttachedPolicies = AttachedPolicies;
/**
 * Merge two dictionaries that represent IAM principals
 *
 * Does an in-place merge.
 */
function mergePrincipal(target, source) {
    // If one represents a literal string, the other one must be empty
    const sourceKeys = Object.keys(source);
    const targetKeys = Object.keys(target);
    if ((exports.LITERAL_STRING_KEY in source && targetKeys.some(k => k !== exports.LITERAL_STRING_KEY)) ||
        (exports.LITERAL_STRING_KEY in target && sourceKeys.some(k => k !== exports.LITERAL_STRING_KEY))) {
        throw new Error(`Cannot merge principals ${JSON.stringify(target)} and ${JSON.stringify(source)}; if one uses a literal principal string the other one must be empty`);
    }
    for (const key of sourceKeys) {
        target[key] = target[key] ?? [];
        let value = source[key];
        if (!Array.isArray(value)) {
            value = [value];
        }
        target[key].push(...value);
    }
    return target;
}
exports.mergePrincipal = mergePrincipal;
/**
 * Lazy string set token that dedupes entries
 *
 * Needs to operate post-resolve, because the inputs could be
 * `[ '${Token[TOKEN.9]}', '${Token[TOKEN.10]}', '${Token[TOKEN.20]}' ]`, which
 * still all resolve to the same string value.
 *
 * Needs to JSON.stringify() results because strings could resolve to literal
 * strings but could also resolve to `{ Fn::Join: [...] }`.
 */
class UniqueStringSet {
    constructor(fn) {
        this.fn = fn;
        this.creationStack = core_1.captureStackTrace();
    }
    static from(fn) {
        return core_1.Token.asList(new UniqueStringSet(fn));
    }
    resolve(context) {
        context.registerPostProcessor(this);
        return this.fn();
    }
    postProcess(input, _context) {
        if (!Array.isArray(input)) {
            return input;
        }
        if (input.length === 0) {
            return undefined;
        }
        const uniq = {};
        for (const el of input) {
            uniq[JSON.stringify(el)] = el;
        }
        return Object.values(uniq);
    }
    toString() {
        return core_1.Token.asString(this);
    }
}
exports.UniqueStringSet = UniqueStringSet;
function sum(xs) {
    return xs.reduce((a, b) => a + b, 0);
}
exports.sum = sum;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsd0NBQStKO0FBSS9KLE1BQU0sbUJBQW1CLEdBQUcsR0FBRyxDQUFDO0FBRW5CLFFBQUEsa0JBQWtCLEdBQUcsZUFBZSxDQUFDO0FBRWxELFNBQWdCLGdCQUFnQixDQUFDLENBQWlCO0lBQ2hELE9BQU8sV0FBSSxDQUFDLElBQUksQ0FBQztRQUNmLE9BQU8sRUFBRSxHQUFHLEVBQUU7WUFDWixNQUFNLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUNsQixPQUFPLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQ3pELENBQUM7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDO0FBUEQsNENBT0M7QUFFRDs7Ozs7R0FLRztBQUNILFNBQWdCLGtCQUFrQixDQUFDLEtBQWlCLEVBQUUsU0FBaUI7SUFDckUsbURBQW1EO0lBQ25ELE1BQU0saUJBQWlCLEdBQUcsbUJBQVksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFO1FBQ3hELEtBQUs7UUFDTCxRQUFRLEVBQUUsSUFBSSwyQkFBb0IsQ0FBQyxJQUFJLG1CQUFZLEVBQUUsQ0FBQztLQUN2RCxDQUFDLENBQUM7SUFDSCxPQUFPLGVBQWUsQ0FBQyxpQkFBaUIsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0FBQ2pFLENBQUM7QUFQRCxnREFPQztBQUVEOzs7Ozs7R0FNRztBQUNILFNBQVMsZUFBZSxDQUFDLEdBQVcsRUFBRSxDQUFTO0lBQzdDLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDL0MsT0FBTyxHQUFHLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMs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QztTQUFFO1FBQzVDLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFBRSxPQUFPLFNBQVMsQ0FBQztTQUFFO1FBRTdDLE1BQU0sSUFBSSxHQUF3QixFQUFFLENBQUM7UUFDckMsS0FBSyxNQUFNLEVBQUUsSUFBSSxLQUFLLEVBQUU7WUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7U0FDL0I7UUFDRCxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDNUI7SUFFTSxRQUFRO1FBQ2IsT0FBTyxZQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzdCO0NBQ0Y7QUE5QkQsMENBOEJDO0FBRUQsU0FBZ0IsR0FBRyxDQUFDLEVBQVk7SUFDOUIsT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN2QyxDQUFDO0FBRkQsa0JBRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjYXB0dXJlU3RhY2tUcmFjZSwgRGVmYXVsdFRva2VuUmVzb2x2ZXIsIElQb3N0UHJvY2Vzc29yLCBJUmVzb2x2YWJsZSwgSVJlc29sdmVDb250ZXh0LCBMYXp5LCBTdHJpbmdDb25jYXQsIFRva2VuLCBUb2tlbml6YXRpb24gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IElDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IElQb2xpY3kgfSBmcm9tICcuL3BvbGljeSc7XG5cbmNvbnN0IE1BWF9QT0xJQ1lfTkFNRV9MRU4gPSAxMjg7XG5cbmV4cG9ydCBjb25zdCBMSVRFUkFMX1NUUklOR19LRVkgPSAnTGl0ZXJhbFN0cmluZyc7XG5cbmV4cG9ydCBmdW5jdGlvbiB1bmRlZmluZWRJZkVtcHR5KGY6ICgpID0+IHN0cmluZ1tdKTogc3RyaW5nW10ge1xuICByZXR1cm4gTGF6eS5saXN0KHtcbiAgICBwcm9kdWNlOiAoKSA9PiB7XG4gICAgICBjb25zdCBhcnJheSA9IGYoKTtcbiAgICAgIHJldHVybiAoYXJyYXkgJiYgYXJyYXkubGVuZ3RoID4gMCkgPyBhcnJheSA6IHVuZGVmaW5lZDtcbiAgICB9LFxuICB9KTtcbn1cblxuLyoqXG4gKiBVc2VkIHRvIGdlbmVyYXRlIGEgdW5pcXVlIHBvbGljeSBuYW1lIGJhc2VkIG9uIHRoZSBwb2xpY3kgcmVzb3VyY2UgY29uc3RydWN0LlxuICogVGhlIGxvZ2ljYWwgSUQgb2YgdGhlIHJlc291cmNlIGlzIGEgZ3JlYXQgY2FuZGlkYXRlIGFzIGxvbmcgYXMgaXQgZG9lc24ndCBleGNlZWRcbiAqIDEyOCBjaGFyYWN0ZXJzLCBzbyB3ZSB0YWtlIHRoZSBsYXN0IDEyOCBjaGFyYWN0ZXJzIChpbiBvcmRlciB0byBtYWtlIHN1cmUgdGhlIGhhc2hcbiAqIGlzIHRoZXJlKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlUG9saWN5TmFtZShzY29wZTogSUNvbnN0cnVjdCwgbG9naWNhbElkOiBzdHJpbmcpOiBzdHJpbmcge1xuICAvLyBhcyBsb2dpY2FsSWQgaXMgaXRzZWxmIGEgVG9rZW4sIHJlc29sdmUgaXQgZmlyc3RcbiAgY29uc3QgcmVzb2x2ZWRMb2dpY2FsSWQgPSBUb2tlbml6YXRpb24ucmVzb2x2ZShsb2dpY2FsSWQsIHtcbiAgICBzY29wZSxcbiAgICByZXNvbHZlcjogbmV3IERlZmF1bHRUb2tlblJlc29sdmVyKG5ldyBTdHJpbmdDb25jYXQoKSksXG4gIH0pO1xuICByZXR1cm4gbGFzdE5DaGFyYWN0ZXJzKHJlc29sdmVkTG9naWNhbElkLCBNQVhfUE9MSUNZX05BTUVfTEVOKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgc3RyaW5nIGNvbXBvc2VkIG9mIHRoZSBsYXN0IG4gY2hhcmFjdGVycyBvZiBzdHIuXG4gKiBJZiBzdHIgaXMgc2hvcnRlciB0aGFuIG4sIHJldHVybnMgc3RyLlxuICpcbiAqIEBwYXJhbSBzdHIgdGhlIHN0cmluZyB0byByZXR1cm4gdGhlIGxhc3QgbiBjaGFyYWN0ZXJzIG9mXG4gKiBAcGFyYW0gbiBob3cgbWFueSBjaGFyYWN0ZXJzIHRvIHJldHVyblxuICovXG5mdW5jdGlvbiBsYXN0TkNoYXJhY3RlcnMoc3RyOiBzdHJpbmcsIG46IG51bWJlcikge1xuICBjb25zdCBzdGFydEluZGV4ID0gTWF0aC5tYXgoc3RyLmxlbmd0aCAtIG4sIDApO1xuICByZXR1cm4gc3RyLnN1YnN0cmluZyhzdGFydEluZGV4LCBzdHIubGVuZ3RoKTtcbn1cblxuLyoqXG4gKiBIZWxwZXIgY2xhc3MgdGhhdCBtYWludGFpbnMgdGhlIHNldCBvZiBhdHRhY2hlZCBwb2xpY2llcyBmb3IgYSBwcmluY2lwYWwuXG4gKi9cbmV4cG9ydCBjbGFzcyBBdHRhY2hlZFBvbGljaWVzIHtcbiAgcHJpdmF0ZSBwb2xpY2llcyA9IG5ldyBBcnJheTxJUG9saWN5PigpO1xuXG4gIC8qKlxuICAgKiBBZGRzIGEgcG9saWN5IHRvIHRoZSBsaXN0IG9mIGF0dGFjaGVkIHBvbGljaWVzLlxuICAgKlxuICAgKiBJZiB0aGlzIHBvbGljeSBpcyBhbHJlYWR5LCBhdHRhY2hlZCwgcmV0dXJucyBmYWxzZS5cbiAgICogSWYgdGhlcmUgaXMgYW5vdGhlciBwb2xpY3kgYXR0YWNoZWQgd2l0aCB0aGUgc2FtZSBuYW1lLCB0aHJvd3MgYW4gZXhjZXB0aW9uLlxuICAgKi9cbiAgcHVibGljIGF0dGFjaChwb2xpY3k6IElQb2xpY3kpIHtcbiAgICBpZiAodGhpcy5wb2xpY2llcy5maW5kKHAgPT4gcCA9PT0gcG9saWN5KSkge1xuICAgICAgcmV0dXJuOyAvLyBhbHJlYWR5IGF0dGFjaGVkXG4gICAgfVxuXG4gICAgaWYgKHRoaXMucG9saWNpZXMuZmluZChwID0+IHAucG9saWN5TmFtZSA9PT0gcG9saWN5LnBvbGljeU5hbWUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEEgcG9saWN5IG5hbWVkIFwiJHtwb2xpY3kucG9saWN5TmFtZX1cIiBpcyBhbHJlYWR5IGF0dGFjaGVkYCk7XG4gICAgfVxuXG4gICAgdGhpcy5wb2xpY2llcy5wdXNoKHBvbGljeSk7XG4gIH1cbn1cblxuLyoqXG4gKiBNZXJnZSB0d28gZGljdGlvbmFyaWVzIHRoYXQgcmVwcmVzZW50IElBTSBwcmluY2lwYWxzXG4gKlxuICogRG9lcyBhbiBpbi1wbGFjZSBtZXJnZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlUHJpbmNpcGFsKHRhcmdldDogeyBba2V5OiBzdHJpbmddOiBzdHJpbmdbXSB9LCBzb3VyY2U6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nW10gfSkge1xuICAvLyBJZiBvbmUgcmVwcmVzZW50cyBhIGxpdGVyYWwgc3RyaW5nLCB0aGUgb3RoZXIgb25lIG11c3QgYmUgZW1wdHlcbiAgY29uc3Qgc291cmNlS2V5cyA9IE9iamVjdC5rZXlzKHNvdXJjZSk7XG4gIGNvbnN0IHRhcmdldEtleXMgPSBPYmplY3Qua2V5cyh0YXJnZXQpO1xuXG4gIGlmICgoTElURVJBTF9TVFJJTkdfS0VZIGluIHNvdXJjZSAmJiB0YXJnZXRLZXlzLnNvbWUoayA9PiBrICE9PSBMSVRFUkFMX1NUUklOR19LRVkpKSB8fFxuICAgIChMSVRFUkFMX1NUUklOR19LRVkgaW4gdGFyZ2V0ICYmIHNvdXJjZUtleXMuc29tZShrID0+IGsgIT09IExJVEVSQUxfU1RSSU5HX0tFWSkpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgbWVyZ2UgcHJpbmNpcGFscyAke0pTT04uc3RyaW5naWZ5KHRhcmdldCl9IGFuZCAke0pTT04uc3RyaW5naWZ5KHNvdXJjZSl9OyBpZiBvbmUgdXNlcyBhIGxpdGVyYWwgcHJpbmNpcGFsIHN0cmluZyB0aGUgb3RoZXIgb25lIG11c3QgYmUgZW1wdHlgKTtcbiAgfVxuXG4gIGZvciAoY29uc3Qga2V5IG9mIHNvdXJjZUtleXMpIHtcbiAgICB0YXJnZXRba2V5XSA9IHRhcmdldFtrZXldID8/IFtdO1xuXG4gICAgbGV0IHZhbHVlID0gc291cmNlW2tleV07XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgdmFsdWUgPSBbdmFsdWVdO1xuICAgIH1cblxuICAgIHRhcmdldFtrZXldLnB1c2goLi4udmFsdWUpO1xuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuLyoqXG4gKiBMYXp5IHN0cmluZyBzZXQgdG9rZW4gdGhhdCBkZWR1cGVzIGVudHJpZXNcbiAqXG4gKiBOZWVkcyB0byBvcGVyYXRlIHBvc3QtcmVzb2x2ZSwgYmVjYXVzZSB0aGUgaW5wdXRzIGNvdWxkIGJlXG4gKiBgWyAnJHtUb2tlbltUT0tFTi45XX0nLCAnJHtUb2tlbltUT0tFTi4xMF19JywgJyR7VG9rZW5bVE9LRU4uMjBdfScgXWAsIHdoaWNoXG4gKiBzdGlsbCBhbGwgcmVzb2x2ZSB0byB0aGUgc2FtZSBzdHJpbmcgdmFsdWUuXG4gKlxuICogTmVlZHMgdG8gSlNPTi5zdHJpbmdpZnkoKSByZXN1bHRzIGJlY2F1c2Ugc3RyaW5ncyBjb3VsZCByZXNvbHZlIHRvIGxpdGVyYWxcbiAqIHN0cmluZ3MgYnV0IGNvdWxkIGFsc28gcmVzb2x2ZSB0byBgeyBGbjo6Sm9pbjogWy4uLl0gfWAuXG4gKi9cbmV4cG9ydCBjbGFzcyBVbmlxdWVTdHJpbmdTZXQgaW1wbGVtZW50cyBJUmVzb2x2YWJsZSwgSVBvc3RQcm9jZXNzb3Ige1xuICBwdWJsaWMgc3RhdGljIGZyb20oZm46ICgpID0+IHN0cmluZ1tdKSB7XG4gICAgcmV0dXJuIFRva2VuLmFzTGlzdChuZXcgVW5pcXVlU3RyaW5nU2V0KGZuKSk7XG4gIH1cblxuICBwdWJsaWMgcmVhZG9ubHkgY3JlYXRpb25TdGFjazogc3RyaW5nW107XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGZuOiAoKSA9PiBzdHJpbmdbXSkge1xuICAgIHRoaXMuY3JlYXRpb25TdGFjayA9IGNhcHR1cmVTdGFja1RyYWNlKCk7XG4gIH1cblxuICBwdWJsaWMgcmVzb2x2ZShjb250ZXh0OiBJUmVzb2x2ZUNvbnRleHQpIHtcbiAgICBjb250ZXh0LnJlZ2lzdGVyUG9zdFByb2Nlc3Nvcih0aGlzKTtcbiAgICByZXR1cm4gdGhpcy5mbigpO1xuICB9XG5cbiAgcHVibGljIHBvc3RQcm9jZXNzKGlucHV0OiBhbnksIF9jb250ZXh0OiBJUmVzb2x2ZUNvbnRleHQpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoaW5wdXQpKSB7IHJldHVybiBpbnB1dDsgfVxuICAgIGlmIChpbnB1dC5sZW5ndGggPT09IDApIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuXG4gICAgY29uc3QgdW5pcTogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgIGZvciAoY29uc3QgZWwgb2YgaW5wdXQpIHtcbiAgICAgIHVuaXFbSlNPTi5zdHJpbmdpZnkoZWwpXSA9IGVsO1xuICAgIH1cbiAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyh1bmlxKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgIHJldHVybiBUb2tlbi5hc1N0cmluZyh0aGlzKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3VtKHhzOiBudW1iZXJbXSkge1xuICByZXR1cm4geHMucmVkdWNlKChhLCBiKSA9PiBhICsgYiwgMCk7XG59XG4iXX0=