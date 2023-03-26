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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsd0NBQStKO0FBSS9KLE1BQU0sbUJBQW1CLEdBQUcsR0FBRyxDQUFDO0FBRW5CLFFBQUEsa0JBQWtCLEdBQUcsZUFBZSxDQUFDO0FBRWxELFNBQWdCLGdCQUFnQixDQUFDLENBQWlCO0lBQ2hELE9BQU8sV0FBSSxDQUFDLElBQUksQ0FBQztRQUNmLE9BQU8sRUFBRSxHQUFHLEVBQUU7WUFDWixNQUFNLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUNsQixPQUFPLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQ3pELENBQUM7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDO0FBUEQsNENBT0M7QUFFRDs7Ozs7R0FLRztBQUNILFNBQWdCLGtCQUFrQixDQUFDLEtBQWlCLEVBQUUsU0FBaUI7SUFDckUsbURBQW1EO0lBQ25ELE1BQU0saUJBQWlCLEdBQUcsbUJBQVksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFO1FBQ3hELEtBQUs7UUFDTCxRQUFRLEVBQUUsSUFBSSwyQkFBb0IsQ0FBQyxJQUFJLG1CQUFZLEVBQUUsQ0FBQztLQUN2RCxDQUFDLENBQUM7SUFDSCxPQUFPLGVBQWUsQ0FBQyxpQkFBaUIsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0FBQ2pFLENBQUM7QUFQRCxnREFPQztBQUVEOzs7Ozs7R0FNRztBQUNILFNBQVMsZUFBZSxDQUFDLEdBQVcsRUFBRSxDQUFTO0lBQzdDLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDL0MsT0FBTyxHQUFHLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMs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QztTQUFFO1FBQzVDLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFBRSxPQUFPLFNBQVMsQ0FBQztTQUFFO1FBRTdDLE1BQU0sSUFBSSxHQUF3QixFQUFFLENBQUM7UUFDckMsS0FBSyxNQUFNLEVBQUUsSUFBSSxLQUFLLEVBQUU7WUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7U0FDL0I7UUFDRCxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDNUI7SUFFTSxRQUFRO1FBQ2IsT0FBTyxZQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzdCO0NBQ0Y7QUE5QkQsMENBOEJDO0FBRUQsU0FBZ0IsR0FBRyxDQUFDLEVBQVk7SUFDOUIsT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN2QyxDQUFDO0FBRkQsa0JBRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjYXB0dXJlU3RhY2tUcmFjZSwgRGVmYXVsdFRva2VuUmVzb2x2ZXIsIElQb3N0UHJvY2Vzc29yLCBJUmVzb2x2YWJsZSwgSVJlc29sdmVDb250ZXh0LCBMYXp5LCBTdHJpbmdDb25jYXQsIFRva2VuLCBUb2tlbml6YXRpb24gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IElDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IElQb2xpY3kgfSBmcm9tICcuLi9wb2xpY3knO1xuXG5jb25zdCBNQVhfUE9MSUNZX05BTUVfTEVOID0gMTI4O1xuXG5leHBvcnQgY29uc3QgTElURVJBTF9TVFJJTkdfS0VZID0gJ0xpdGVyYWxTdHJpbmcnO1xuXG5leHBvcnQgZnVuY3Rpb24gdW5kZWZpbmVkSWZFbXB0eShmOiAoKSA9PiBzdHJpbmdbXSk6IHN0cmluZ1tdIHtcbiAgcmV0dXJuIExhenkubGlzdCh7XG4gICAgcHJvZHVjZTogKCkgPT4ge1xuICAgICAgY29uc3QgYXJyYXkgPSBmKCk7XG4gICAgICByZXR1cm4gKGFycmF5ICYmIGFycmF5Lmxlbmd0aCA+IDApID8gYXJyYXkgOiB1bmRlZmluZWQ7XG4gICAgfSxcbiAgfSk7XG59XG5cbi8qKlxuICogVXNlZCB0byBnZW5lcmF0ZSBhIHVuaXF1ZSBwb2xpY3kgbmFtZSBiYXNlZCBvbiB0aGUgcG9saWN5IHJlc291cmNlIGNvbnN0cnVjdC5cbiAqIFRoZSBsb2dpY2FsIElEIG9mIHRoZSByZXNvdXJjZSBpcyBhIGdyZWF0IGNhbmRpZGF0ZSBhcyBsb25nIGFzIGl0IGRvZXNuJ3QgZXhjZWVkXG4gKiAxMjggY2hhcmFjdGVycywgc28gd2UgdGFrZSB0aGUgbGFzdCAxMjggY2hhcmFjdGVycyAoaW4gb3JkZXIgdG8gbWFrZSBzdXJlIHRoZSBoYXNoXG4gKiBpcyB0aGVyZSkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZVBvbGljeU5hbWUoc2NvcGU6IElDb25zdHJ1Y3QsIGxvZ2ljYWxJZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgLy8gYXMgbG9naWNhbElkIGlzIGl0c2VsZiBhIFRva2VuLCByZXNvbHZlIGl0IGZpcnN0XG4gIGNvbnN0IHJlc29sdmVkTG9naWNhbElkID0gVG9rZW5pemF0aW9uLnJlc29sdmUobG9naWNhbElkLCB7XG4gICAgc2NvcGUsXG4gICAgcmVzb2x2ZXI6IG5ldyBEZWZhdWx0VG9rZW5SZXNvbHZlcihuZXcgU3RyaW5nQ29uY2F0KCkpLFxuICB9KTtcbiAgcmV0dXJuIGxhc3ROQ2hhcmFjdGVycyhyZXNvbHZlZExvZ2ljYWxJZCwgTUFYX1BPTElDWV9OQU1FX0xFTik7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIHN0cmluZyBjb21wb3NlZCBvZiB0aGUgbGFzdCBuIGNoYXJhY3RlcnMgb2Ygc3RyLlxuICogSWYgc3RyIGlzIHNob3J0ZXIgdGhhbiBuLCByZXR1cm5zIHN0ci5cbiAqXG4gKiBAcGFyYW0gc3RyIHRoZSBzdHJpbmcgdG8gcmV0dXJuIHRoZSBsYXN0IG4gY2hhcmFjdGVycyBvZlxuICogQHBhcmFtIG4gaG93IG1hbnkgY2hhcmFjdGVycyB0byByZXR1cm5cbiAqL1xuZnVuY3Rpb24gbGFzdE5DaGFyYWN0ZXJzKHN0cjogc3RyaW5nLCBuOiBudW1iZXIpIHtcbiAgY29uc3Qgc3RhcnRJbmRleCA9IE1hdGgubWF4KHN0ci5sZW5ndGggLSBuLCAwKTtcbiAgcmV0dXJuIHN0ci5zdWJzdHJpbmcoc3RhcnRJbmRleCwgc3RyLmxlbmd0aCk7XG59XG5cbi8qKlxuICogSGVscGVyIGNsYXNzIHRoYXQgbWFpbnRhaW5zIHRoZSBzZXQgb2YgYXR0YWNoZWQgcG9saWNpZXMgZm9yIGEgcHJpbmNpcGFsLlxuICovXG5leHBvcnQgY2xhc3MgQXR0YWNoZWRQb2xpY2llcyB7XG4gIHByaXZhdGUgcG9saWNpZXMgPSBuZXcgQXJyYXk8SVBvbGljeT4oKTtcblxuICAvKipcbiAgICogQWRkcyBhIHBvbGljeSB0byB0aGUgbGlzdCBvZiBhdHRhY2hlZCBwb2xpY2llcy5cbiAgICpcbiAgICogSWYgdGhpcyBwb2xpY3kgaXMgYWxyZWFkeSwgYXR0YWNoZWQsIHJldHVybnMgZmFsc2UuXG4gICAqIElmIHRoZXJlIGlzIGFub3RoZXIgcG9saWN5IGF0dGFjaGVkIHdpdGggdGhlIHNhbWUgbmFtZSwgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cbiAgICovXG4gIHB1YmxpYyBhdHRhY2gocG9saWN5OiBJUG9saWN5KSB7XG4gICAgaWYgKHRoaXMucG9saWNpZXMuZmluZChwID0+IHAgPT09IHBvbGljeSkpIHtcbiAgICAgIHJldHVybjsgLy8gYWxyZWFkeSBhdHRhY2hlZFxuICAgIH1cblxuICAgIGlmICh0aGlzLnBvbGljaWVzLmZpbmQocCA9PiBwLnBvbGljeU5hbWUgPT09IHBvbGljeS5wb2xpY3lOYW1lKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBIHBvbGljeSBuYW1lZCBcIiR7cG9saWN5LnBvbGljeU5hbWV9XCIgaXMgYWxyZWFkeSBhdHRhY2hlZGApO1xuICAgIH1cblxuICAgIHRoaXMucG9saWNpZXMucHVzaChwb2xpY3kpO1xuICB9XG59XG5cbi8qKlxuICogTWVyZ2UgdHdvIGRpY3Rpb25hcmllcyB0aGF0IHJlcHJlc2VudCBJQU0gcHJpbmNpcGFsc1xuICpcbiAqIERvZXMgYW4gaW4tcGxhY2UgbWVyZ2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZVByaW5jaXBhbCh0YXJnZXQ6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nW10gfSwgc291cmNlOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZ1tdIH0pIHtcbiAgLy8gSWYgb25lIHJlcHJlc2VudHMgYSBsaXRlcmFsIHN0cmluZywgdGhlIG90aGVyIG9uZSBtdXN0IGJlIGVtcHR5XG4gIGNvbnN0IHNvdXJjZUtleXMgPSBPYmplY3Qua2V5cyhzb3VyY2UpO1xuICBjb25zdCB0YXJnZXRLZXlzID0gT2JqZWN0LmtleXModGFyZ2V0KTtcblxuICBpZiAoKExJVEVSQUxfU1RSSU5HX0tFWSBpbiBzb3VyY2UgJiYgdGFyZ2V0S2V5cy5zb21lKGsgPT4gayAhPT0gTElURVJBTF9TVFJJTkdfS0VZKSkgfHxcbiAgICAoTElURVJBTF9TVFJJTkdfS0VZIGluIHRhcmdldCAmJiBzb3VyY2VLZXlzLnNvbWUoayA9PiBrICE9PSBMSVRFUkFMX1NUUklOR19LRVkpKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IG1lcmdlIHByaW5jaXBhbHMgJHtKU09OLnN0cmluZ2lmeSh0YXJnZXQpfSBhbmQgJHtKU09OLnN0cmluZ2lmeShzb3VyY2UpfTsgaWYgb25lIHVzZXMgYSBsaXRlcmFsIHByaW5jaXBhbCBzdHJpbmcgdGhlIG90aGVyIG9uZSBtdXN0IGJlIGVtcHR5YCk7XG4gIH1cblxuICBmb3IgKGNvbnN0IGtleSBvZiBzb3VyY2VLZXlzKSB7XG4gICAgdGFyZ2V0W2tleV0gPSB0YXJnZXRba2V5XSA/PyBbXTtcblxuICAgIGxldCB2YWx1ZSA9IHNvdXJjZVtrZXldO1xuICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIHZhbHVlID0gW3ZhbHVlXTtcbiAgICB9XG5cbiAgICB0YXJnZXRba2V5XS5wdXNoKC4uLnZhbHVlKTtcbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbi8qKlxuICogTGF6eSBzdHJpbmcgc2V0IHRva2VuIHRoYXQgZGVkdXBlcyBlbnRyaWVzXG4gKlxuICogTmVlZHMgdG8gb3BlcmF0ZSBwb3N0LXJlc29sdmUsIGJlY2F1c2UgdGhlIGlucHV0cyBjb3VsZCBiZVxuICogYFsgJyR7VG9rZW5bVE9LRU4uOV19JywgJyR7VG9rZW5bVE9LRU4uMTBdfScsICcke1Rva2VuW1RPS0VOLjIwXX0nIF1gLCB3aGljaFxuICogc3RpbGwgYWxsIHJlc29sdmUgdG8gdGhlIHNhbWUgc3RyaW5nIHZhbHVlLlxuICpcbiAqIE5lZWRzIHRvIEpTT04uc3RyaW5naWZ5KCkgcmVzdWx0cyBiZWNhdXNlIHN0cmluZ3MgY291bGQgcmVzb2x2ZSB0byBsaXRlcmFsXG4gKiBzdHJpbmdzIGJ1dCBjb3VsZCBhbHNvIHJlc29sdmUgdG8gYHsgRm46OkpvaW46IFsuLi5dIH1gLlxuICovXG5leHBvcnQgY2xhc3MgVW5pcXVlU3RyaW5nU2V0IGltcGxlbWVudHMgSVJlc29sdmFibGUsIElQb3N0UHJvY2Vzc29yIHtcbiAgcHVibGljIHN0YXRpYyBmcm9tKGZuOiAoKSA9PiBzdHJpbmdbXSkge1xuICAgIHJldHVybiBUb2tlbi5hc0xpc3QobmV3IFVuaXF1ZVN0cmluZ1NldChmbikpO1xuICB9XG5cbiAgcHVibGljIHJlYWRvbmx5IGNyZWF0aW9uU3RhY2s6IHN0cmluZ1tdO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBmbjogKCkgPT4gc3RyaW5nW10pIHtcbiAgICB0aGlzLmNyZWF0aW9uU3RhY2sgPSBjYXB0dXJlU3RhY2tUcmFjZSgpO1xuICB9XG5cbiAgcHVibGljIHJlc29sdmUoY29udGV4dDogSVJlc29sdmVDb250ZXh0KSB7XG4gICAgY29udGV4dC5yZWdpc3RlclBvc3RQcm9jZXNzb3IodGhpcyk7XG4gICAgcmV0dXJuIHRoaXMuZm4oKTtcbiAgfVxuXG4gIHB1YmxpYyBwb3N0UHJvY2VzcyhpbnB1dDogYW55LCBfY29udGV4dDogSVJlc29sdmVDb250ZXh0KSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGlucHV0KSkgeyByZXR1cm4gaW5wdXQ7IH1cbiAgICBpZiAoaW5wdXQubGVuZ3RoID09PSAwKSB7IHJldHVybiB1bmRlZmluZWQ7IH1cblxuICAgIGNvbnN0IHVuaXE6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgICBmb3IgKGNvbnN0IGVsIG9mIGlucHV0KSB7XG4gICAgICB1bmlxW0pTT04uc3RyaW5naWZ5KGVsKV0gPSBlbDtcbiAgICB9XG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXModW5pcSk7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gVG9rZW4uYXNTdHJpbmcodGhpcyk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN1bSh4czogbnVtYmVyW10pIHtcbiAgcmV0dXJuIHhzLnJlZHVjZSgoYSwgYikgPT4gYSArIGIsIDApO1xufVxuIl19