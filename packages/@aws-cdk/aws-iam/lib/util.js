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
    static from(fn) {
        return core_1.Token.asList(new UniqueStringSet(fn));
    }
    constructor(fn) {
        this.fn = fn;
        this.creationStack = (0, core_1.captureStackTrace)();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsd0NBQStKO0FBSS9KLE1BQU0sbUJBQW1CLEdBQUcsR0FBRyxDQUFDO0FBRW5CLFFBQUEsa0JBQWtCLEdBQUcsZUFBZSxDQUFDO0FBRWxELFNBQWdCLGdCQUFnQixDQUFDLENBQWlCO0lBQ2hELE9BQU8sV0FBSSxDQUFDLElBQUksQ0FBQztRQUNmLE9BQU8sRUFBRSxHQUFHLEVBQUU7WUFDWixNQUFNLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUNsQixPQUFPLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQ3pELENBQUM7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDO0FBUEQsNENBT0M7QUFFRDs7Ozs7R0FLRztBQUNILFNBQWdCLGtCQUFrQixDQUFDLEtBQWlCLEVBQUUsU0FBaUI7SUFDckUsbURBQW1EO0lBQ25ELE1BQU0saUJBQWlCLEdBQUcsbUJBQVksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFO1FBQ3hELEtBQUs7UUFDTCxRQUFRLEVBQUUsSUFBSSwyQkFBb0IsQ0FBQyxJQUFJLG1CQUFZLEVBQUUsQ0FBQztLQUN2RCxDQUFDLENBQUM7SUFDSCxPQUFPLGVBQWUsQ0FBQyxpQkFBaUIsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0FBQ2pFLENBQUM7QUFQRCxnREFPQztBQUVEOzs7Ozs7R0FNRztBQUNILFNBQVMsZUFBZSxDQUFDLEdBQVcsRUFBRSxDQUFTO0lBQzdDLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDL0MsT0FBTyxHQUFHLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMs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SyxDQUFDO1NBQUU7UUFDNUMsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUFFLE9BQU8sU0FBUyxDQUFDO1NBQUU7UUFFN0MsTUFBTSxJQUFJLEdBQXdCLEVBQUUsQ0FBQztRQUNyQyxLQUFLLE1BQU0sRUFBRSxJQUFJLEtBQUssRUFBRTtZQUN0QixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztTQUMvQjtRQUNELE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUM1QjtJQUVNLFFBQVE7UUFDYixPQUFPLFlBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDN0I7Q0FDRjtBQTlCRCwwQ0E4QkM7QUFFRCxTQUFnQixHQUFHLENBQUMsRUFBWTtJQUM5QixPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLENBQUM7QUFGRCxrQkFFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNhcHR1cmVTdGFja1RyYWNlLCBEZWZhdWx0VG9rZW5SZXNvbHZlciwgSVBvc3RQcm9jZXNzb3IsIElSZXNvbHZhYmxlLCBJUmVzb2x2ZUNvbnRleHQsIExhenksIFN0cmluZ0NvbmNhdCwgVG9rZW4sIFRva2VuaXphdGlvbiB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgSUNvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgSVBvbGljeSB9IGZyb20gJy4vcG9saWN5JztcblxuY29uc3QgTUFYX1BPTElDWV9OQU1FX0xFTiA9IDEyODtcblxuZXhwb3J0IGNvbnN0IExJVEVSQUxfU1RSSU5HX0tFWSA9ICdMaXRlcmFsU3RyaW5nJztcblxuZXhwb3J0IGZ1bmN0aW9uIHVuZGVmaW5lZElmRW1wdHkoZjogKCkgPT4gc3RyaW5nW10pOiBzdHJpbmdbXSB7XG4gIHJldHVybiBMYXp5Lmxpc3Qoe1xuICAgIHByb2R1Y2U6ICgpID0+IHtcbiAgICAgIGNvbnN0IGFycmF5ID0gZigpO1xuICAgICAgcmV0dXJuIChhcnJheSAmJiBhcnJheS5sZW5ndGggPiAwKSA/IGFycmF5IDogdW5kZWZpbmVkO1xuICAgIH0sXG4gIH0pO1xufVxuXG4vKipcbiAqIFVzZWQgdG8gZ2VuZXJhdGUgYSB1bmlxdWUgcG9saWN5IG5hbWUgYmFzZWQgb24gdGhlIHBvbGljeSByZXNvdXJjZSBjb25zdHJ1Y3QuXG4gKiBUaGUgbG9naWNhbCBJRCBvZiB0aGUgcmVzb3VyY2UgaXMgYSBncmVhdCBjYW5kaWRhdGUgYXMgbG9uZyBhcyBpdCBkb2Vzbid0IGV4Y2VlZFxuICogMTI4IGNoYXJhY3RlcnMsIHNvIHdlIHRha2UgdGhlIGxhc3QgMTI4IGNoYXJhY3RlcnMgKGluIG9yZGVyIHRvIG1ha2Ugc3VyZSB0aGUgaGFzaFxuICogaXMgdGhlcmUpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVQb2xpY3lOYW1lKHNjb3BlOiBJQ29uc3RydWN0LCBsb2dpY2FsSWQ6IHN0cmluZyk6IHN0cmluZyB7XG4gIC8vIGFzIGxvZ2ljYWxJZCBpcyBpdHNlbGYgYSBUb2tlbiwgcmVzb2x2ZSBpdCBmaXJzdFxuICBjb25zdCByZXNvbHZlZExvZ2ljYWxJZCA9IFRva2VuaXphdGlvbi5yZXNvbHZlKGxvZ2ljYWxJZCwge1xuICAgIHNjb3BlLFxuICAgIHJlc29sdmVyOiBuZXcgRGVmYXVsdFRva2VuUmVzb2x2ZXIobmV3IFN0cmluZ0NvbmNhdCgpKSxcbiAgfSk7XG4gIHJldHVybiBsYXN0TkNoYXJhY3RlcnMocmVzb2x2ZWRMb2dpY2FsSWQsIE1BWF9QT0xJQ1lfTkFNRV9MRU4pO1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBzdHJpbmcgY29tcG9zZWQgb2YgdGhlIGxhc3QgbiBjaGFyYWN0ZXJzIG9mIHN0ci5cbiAqIElmIHN0ciBpcyBzaG9ydGVyIHRoYW4gbiwgcmV0dXJucyBzdHIuXG4gKlxuICogQHBhcmFtIHN0ciB0aGUgc3RyaW5nIHRvIHJldHVybiB0aGUgbGFzdCBuIGNoYXJhY3RlcnMgb2ZcbiAqIEBwYXJhbSBuIGhvdyBtYW55IGNoYXJhY3RlcnMgdG8gcmV0dXJuXG4gKi9cbmZ1bmN0aW9uIGxhc3ROQ2hhcmFjdGVycyhzdHI6IHN0cmluZywgbjogbnVtYmVyKSB7XG4gIGNvbnN0IHN0YXJ0SW5kZXggPSBNYXRoLm1heChzdHIubGVuZ3RoIC0gbiwgMCk7XG4gIHJldHVybiBzdHIuc3Vic3RyaW5nKHN0YXJ0SW5kZXgsIHN0ci5sZW5ndGgpO1xufVxuXG4vKipcbiAqIEhlbHBlciBjbGFzcyB0aGF0IG1haW50YWlucyB0aGUgc2V0IG9mIGF0dGFjaGVkIHBvbGljaWVzIGZvciBhIHByaW5jaXBhbC5cbiAqL1xuZXhwb3J0IGNsYXNzIEF0dGFjaGVkUG9saWNpZXMge1xuICBwcml2YXRlIHBvbGljaWVzID0gbmV3IEFycmF5PElQb2xpY3k+KCk7XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBwb2xpY3kgdG8gdGhlIGxpc3Qgb2YgYXR0YWNoZWQgcG9saWNpZXMuXG4gICAqXG4gICAqIElmIHRoaXMgcG9saWN5IGlzIGFscmVhZHksIGF0dGFjaGVkLCByZXR1cm5zIGZhbHNlLlxuICAgKiBJZiB0aGVyZSBpcyBhbm90aGVyIHBvbGljeSBhdHRhY2hlZCB3aXRoIHRoZSBzYW1lIG5hbWUsIHRocm93cyBhbiBleGNlcHRpb24uXG4gICAqL1xuICBwdWJsaWMgYXR0YWNoKHBvbGljeTogSVBvbGljeSkge1xuICAgIGlmICh0aGlzLnBvbGljaWVzLmZpbmQocCA9PiBwID09PSBwb2xpY3kpKSB7XG4gICAgICByZXR1cm47IC8vIGFscmVhZHkgYXR0YWNoZWRcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wb2xpY2llcy5maW5kKHAgPT4gcC5wb2xpY3lOYW1lID09PSBwb2xpY3kucG9saWN5TmFtZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQSBwb2xpY3kgbmFtZWQgXCIke3BvbGljeS5wb2xpY3lOYW1lfVwiIGlzIGFscmVhZHkgYXR0YWNoZWRgKTtcbiAgICB9XG5cbiAgICB0aGlzLnBvbGljaWVzLnB1c2gocG9saWN5KTtcbiAgfVxufVxuXG4vKipcbiAqIE1lcmdlIHR3byBkaWN0aW9uYXJpZXMgdGhhdCByZXByZXNlbnQgSUFNIHByaW5jaXBhbHNcbiAqXG4gKiBEb2VzIGFuIGluLXBsYWNlIG1lcmdlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VQcmluY2lwYWwodGFyZ2V0OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZ1tdIH0sIHNvdXJjZTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmdbXSB9KSB7XG4gIC8vIElmIG9uZSByZXByZXNlbnRzIGEgbGl0ZXJhbCBzdHJpbmcsIHRoZSBvdGhlciBvbmUgbXVzdCBiZSBlbXB0eVxuICBjb25zdCBzb3VyY2VLZXlzID0gT2JqZWN0LmtleXMoc291cmNlKTtcbiAgY29uc3QgdGFyZ2V0S2V5cyA9IE9iamVjdC5rZXlzKHRhcmdldCk7XG5cbiAgaWYgKChMSVRFUkFMX1NUUklOR19LRVkgaW4gc291cmNlICYmIHRhcmdldEtleXMuc29tZShrID0+IGsgIT09IExJVEVSQUxfU1RSSU5HX0tFWSkpIHx8XG4gICAgKExJVEVSQUxfU1RSSU5HX0tFWSBpbiB0YXJnZXQgJiYgc291cmNlS2V5cy5zb21lKGsgPT4gayAhPT0gTElURVJBTF9TVFJJTkdfS0VZKSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBtZXJnZSBwcmluY2lwYWxzICR7SlNPTi5zdHJpbmdpZnkodGFyZ2V0KX0gYW5kICR7SlNPTi5zdHJpbmdpZnkoc291cmNlKX07IGlmIG9uZSB1c2VzIGEgbGl0ZXJhbCBwcmluY2lwYWwgc3RyaW5nIHRoZSBvdGhlciBvbmUgbXVzdCBiZSBlbXB0eWApO1xuICB9XG5cbiAgZm9yIChjb25zdCBrZXkgb2Ygc291cmNlS2V5cykge1xuICAgIHRhcmdldFtrZXldID0gdGFyZ2V0W2tleV0gPz8gW107XG5cbiAgICBsZXQgdmFsdWUgPSBzb3VyY2Vba2V5XTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICB2YWx1ZSA9IFt2YWx1ZV07XG4gICAgfVxuXG4gICAgdGFyZ2V0W2tleV0ucHVzaCguLi52YWx1ZSk7XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG4vKipcbiAqIExhenkgc3RyaW5nIHNldCB0b2tlbiB0aGF0IGRlZHVwZXMgZW50cmllc1xuICpcbiAqIE5lZWRzIHRvIG9wZXJhdGUgcG9zdC1yZXNvbHZlLCBiZWNhdXNlIHRoZSBpbnB1dHMgY291bGQgYmVcbiAqIGBbICcke1Rva2VuW1RPS0VOLjldfScsICcke1Rva2VuW1RPS0VOLjEwXX0nLCAnJHtUb2tlbltUT0tFTi4yMF19JyBdYCwgd2hpY2hcbiAqIHN0aWxsIGFsbCByZXNvbHZlIHRvIHRoZSBzYW1lIHN0cmluZyB2YWx1ZS5cbiAqXG4gKiBOZWVkcyB0byBKU09OLnN0cmluZ2lmeSgpIHJlc3VsdHMgYmVjYXVzZSBzdHJpbmdzIGNvdWxkIHJlc29sdmUgdG8gbGl0ZXJhbFxuICogc3RyaW5ncyBidXQgY291bGQgYWxzbyByZXNvbHZlIHRvIGB7IEZuOjpKb2luOiBbLi4uXSB9YC5cbiAqL1xuZXhwb3J0IGNsYXNzIFVuaXF1ZVN0cmluZ1NldCBpbXBsZW1lbnRzIElSZXNvbHZhYmxlLCBJUG9zdFByb2Nlc3NvciB7XG4gIHB1YmxpYyBzdGF0aWMgZnJvbShmbjogKCkgPT4gc3RyaW5nW10pIHtcbiAgICByZXR1cm4gVG9rZW4uYXNMaXN0KG5ldyBVbmlxdWVTdHJpbmdTZXQoZm4pKTtcbiAgfVxuXG4gIHB1YmxpYyByZWFkb25seSBjcmVhdGlvblN0YWNrOiBzdHJpbmdbXTtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgZm46ICgpID0+IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5jcmVhdGlvblN0YWNrID0gY2FwdHVyZVN0YWNrVHJhY2UoKTtcbiAgfVxuXG4gIHB1YmxpYyByZXNvbHZlKGNvbnRleHQ6IElSZXNvbHZlQ29udGV4dCkge1xuICAgIGNvbnRleHQucmVnaXN0ZXJQb3N0UHJvY2Vzc29yKHRoaXMpO1xuICAgIHJldHVybiB0aGlzLmZuKCk7XG4gIH1cblxuICBwdWJsaWMgcG9zdFByb2Nlc3MoaW5wdXQ6IGFueSwgX2NvbnRleHQ6IElSZXNvbHZlQ29udGV4dCkge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShpbnB1dCkpIHsgcmV0dXJuIGlucHV0OyB9XG4gICAgaWYgKGlucHV0Lmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9XG5cbiAgICBjb25zdCB1bmlxOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG4gICAgZm9yIChjb25zdCBlbCBvZiBpbnB1dCkge1xuICAgICAgdW5pcVtKU09OLnN0cmluZ2lmeShlbCldID0gZWw7XG4gICAgfVxuICAgIHJldHVybiBPYmplY3QudmFsdWVzKHVuaXEpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFRva2VuLmFzU3RyaW5nKHRoaXMpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdW0oeHM6IG51bWJlcltdKSB7XG4gIHJldHVybiB4cy5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiLCAwKTtcbn1cbiJdfQ==