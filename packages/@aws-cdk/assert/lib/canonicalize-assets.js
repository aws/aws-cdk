"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canonicalizeTemplate = void 0;
/**
 * Reduce template to a normal form where asset references have been normalized
 *
 * This makes it possible to compare templates if all that's different between
 * them is the hashes of the asset values.
 *
 * Currently only handles parameterized assets, but can (and should)
 * be adapted to handle convention-mode assets as well when we start using
 * more of those.
 */
function canonicalizeTemplate(template) {
    // For the weird case where we have an array of templates...
    if (Array.isArray(template)) {
        return template.map(canonicalizeTemplate);
    }
    // Find assets via parameters
    const stringSubstitutions = new Array();
    const paramRe = /^AssetParameters([a-zA-Z0-9]{64})(S3Bucket|S3VersionKey|ArtifactHash)([a-zA-Z0-9]{8})$/;
    const assetsSeen = new Set();
    for (const paramName of Object.keys(template?.Parameters || {})) {
        const m = paramRe.exec(paramName);
        if (!m) {
            continue;
        }
        if (assetsSeen.has(m[1])) {
            continue;
        }
        assetsSeen.add(m[1]);
        const ix = assetsSeen.size;
        // Full parameter reference
        stringSubstitutions.push([
            new RegExp(`AssetParameters${m[1]}(S3Bucket|S3VersionKey|ArtifactHash)([a-zA-Z0-9]{8})`),
            `Asset${ix}$1`,
        ]);
        // Substring asset hash reference
        stringSubstitutions.push([
            new RegExp(`${m[1]}`),
            `Asset${ix}Hash`,
        ]);
    }
    // Substitute them out
    return substitute(template);
    function substitute(what) {
        if (Array.isArray(what)) {
            return what.map(substitute);
        }
        if (typeof what === 'object' && what !== null) {
            const ret = {};
            for (const [k, v] of Object.entries(what)) {
                ret[stringSub(k)] = substitute(v);
            }
            return ret;
        }
        if (typeof what === 'string') {
            return stringSub(what);
        }
        return what;
    }
    function stringSub(x) {
        for (const [re, replacement] of stringSubstitutions) {
            x = x.replace(re, replacement);
        }
        return x;
    }
}
exports.canonicalizeTemplate = canonicalizeTemplate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2Fub25pY2FsaXplLWFzc2V0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNhbm9uaWNhbGl6ZS1hc3NldHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7Ozs7Ozs7OztHQVNHO0FBQ0gsU0FBZ0Isb0JBQW9CLENBQUMsUUFBYTtJQUNoRCw0REFBNEQ7SUFDNUQsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQzNCLE9BQU8sUUFBUSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0tBQzNDO0lBRUQsNkJBQTZCO0lBQzdCLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxLQUFLLEVBQW9CLENBQUM7SUFDMUQsTUFBTSxPQUFPLEdBQUcsd0ZBQXdGLENBQUM7SUFFekcsTUFBTSxVQUFVLEdBQUcsSUFBSSxHQUFHLEVBQVUsQ0FBQztJQUNyQyxLQUFLLE1BQU0sU0FBUyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFVBQVUsSUFBSSxFQUFFLENBQUMsRUFBRTtRQUMvRCxNQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxDQUFDLEVBQUU7WUFBRSxTQUFTO1NBQUU7UUFDckIsSUFBSSxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQUUsU0FBUztTQUFFO1FBRXZDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckIsTUFBTSxFQUFFLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQztRQUUzQiwyQkFBMkI7UUFDM0IsbUJBQW1CLENBQUMsSUFBSSxDQUFDO1lBQ3ZCLElBQUksTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLHNEQUFzRCxDQUFDO1lBQ3hGLFFBQVEsRUFBRSxJQUFJO1NBQ2YsQ0FBQyxDQUFDO1FBQ0gsaUNBQWlDO1FBQ2pDLG1CQUFtQixDQUFDLElBQUksQ0FBQztZQUN2QixJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ3JCLFFBQVEsRUFBRSxNQUFNO1NBQ2pCLENBQUMsQ0FBQztLQUNKO0lBRUQsc0JBQXNCO0lBQ3RCLE9BQU8sVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRTVCLFNBQVMsVUFBVSxDQUFDLElBQVM7UUFDM0IsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3ZCLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUM3QjtRQUVELElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxJQUFJLElBQUksS0FBSyxJQUFJLEVBQUU7WUFDN0MsTUFBTSxHQUFHLEdBQVEsRUFBRSxDQUFDO1lBQ3BCLEtBQUssTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUN6QyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ25DO1lBQ0QsT0FBTyxHQUFHLENBQUM7U0FDWjtRQUVELElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFO1lBQzVCLE9BQU8sU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3hCO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsU0FBUyxTQUFTLENBQUMsQ0FBUztRQUMxQixLQUFLLE1BQU0sQ0FBQyxFQUFFLEVBQUUsV0FBVyxDQUFDLElBQUksbUJBQW1CLEVBQUU7WUFDbkQsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1NBQ2hDO1FBQ0QsT0FBTyxDQUFDLENBQUM7SUFDWCxDQUFDO0FBQ0gsQ0FBQztBQTVERCxvREE0REMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFJlZHVjZSB0ZW1wbGF0ZSB0byBhIG5vcm1hbCBmb3JtIHdoZXJlIGFzc2V0IHJlZmVyZW5jZXMgaGF2ZSBiZWVuIG5vcm1hbGl6ZWRcbiAqXG4gKiBUaGlzIG1ha2VzIGl0IHBvc3NpYmxlIHRvIGNvbXBhcmUgdGVtcGxhdGVzIGlmIGFsbCB0aGF0J3MgZGlmZmVyZW50IGJldHdlZW5cbiAqIHRoZW0gaXMgdGhlIGhhc2hlcyBvZiB0aGUgYXNzZXQgdmFsdWVzLlxuICpcbiAqIEN1cnJlbnRseSBvbmx5IGhhbmRsZXMgcGFyYW1ldGVyaXplZCBhc3NldHMsIGJ1dCBjYW4gKGFuZCBzaG91bGQpXG4gKiBiZSBhZGFwdGVkIHRvIGhhbmRsZSBjb252ZW50aW9uLW1vZGUgYXNzZXRzIGFzIHdlbGwgd2hlbiB3ZSBzdGFydCB1c2luZ1xuICogbW9yZSBvZiB0aG9zZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhbm9uaWNhbGl6ZVRlbXBsYXRlKHRlbXBsYXRlOiBhbnkpOiBhbnkge1xuICAvLyBGb3IgdGhlIHdlaXJkIGNhc2Ugd2hlcmUgd2UgaGF2ZSBhbiBhcnJheSBvZiB0ZW1wbGF0ZXMuLi5cbiAgaWYgKEFycmF5LmlzQXJyYXkodGVtcGxhdGUpKSB7XG4gICAgcmV0dXJuIHRlbXBsYXRlLm1hcChjYW5vbmljYWxpemVUZW1wbGF0ZSk7XG4gIH1cblxuICAvLyBGaW5kIGFzc2V0cyB2aWEgcGFyYW1ldGVyc1xuICBjb25zdCBzdHJpbmdTdWJzdGl0dXRpb25zID0gbmV3IEFycmF5PFtSZWdFeHAsIHN0cmluZ10+KCk7XG4gIGNvbnN0IHBhcmFtUmUgPSAvXkFzc2V0UGFyYW1ldGVycyhbYS16QS1aMC05XXs2NH0pKFMzQnVja2V0fFMzVmVyc2lvbktleXxBcnRpZmFjdEhhc2gpKFthLXpBLVowLTldezh9KSQvO1xuXG4gIGNvbnN0IGFzc2V0c1NlZW4gPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgZm9yIChjb25zdCBwYXJhbU5hbWUgb2YgT2JqZWN0LmtleXModGVtcGxhdGU/LlBhcmFtZXRlcnMgfHwge30pKSB7XG4gICAgY29uc3QgbSA9IHBhcmFtUmUuZXhlYyhwYXJhbU5hbWUpO1xuICAgIGlmICghbSkgeyBjb250aW51ZTsgfVxuICAgIGlmIChhc3NldHNTZWVuLmhhcyhtWzFdKSkgeyBjb250aW51ZTsgfVxuXG4gICAgYXNzZXRzU2Vlbi5hZGQobVsxXSk7XG4gICAgY29uc3QgaXggPSBhc3NldHNTZWVuLnNpemU7XG5cbiAgICAvLyBGdWxsIHBhcmFtZXRlciByZWZlcmVuY2VcbiAgICBzdHJpbmdTdWJzdGl0dXRpb25zLnB1c2goW1xuICAgICAgbmV3IFJlZ0V4cChgQXNzZXRQYXJhbWV0ZXJzJHttWzFdfShTM0J1Y2tldHxTM1ZlcnNpb25LZXl8QXJ0aWZhY3RIYXNoKShbYS16QS1aMC05XXs4fSlgKSxcbiAgICAgIGBBc3NldCR7aXh9JDFgLFxuICAgIF0pO1xuICAgIC8vIFN1YnN0cmluZyBhc3NldCBoYXNoIHJlZmVyZW5jZVxuICAgIHN0cmluZ1N1YnN0aXR1dGlvbnMucHVzaChbXG4gICAgICBuZXcgUmVnRXhwKGAke21bMV19YCksXG4gICAgICBgQXNzZXQke2l4fUhhc2hgLFxuICAgIF0pO1xuICB9XG5cbiAgLy8gU3Vic3RpdHV0ZSB0aGVtIG91dFxuICByZXR1cm4gc3Vic3RpdHV0ZSh0ZW1wbGF0ZSk7XG5cbiAgZnVuY3Rpb24gc3Vic3RpdHV0ZSh3aGF0OiBhbnkpOiBhbnkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHdoYXQpKSB7XG4gICAgICByZXR1cm4gd2hhdC5tYXAoc3Vic3RpdHV0ZSk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB3aGF0ID09PSAnb2JqZWN0JyAmJiB3aGF0ICE9PSBudWxsKSB7XG4gICAgICBjb25zdCByZXQ6IGFueSA9IHt9O1xuICAgICAgZm9yIChjb25zdCBbaywgdl0gb2YgT2JqZWN0LmVudHJpZXMod2hhdCkpIHtcbiAgICAgICAgcmV0W3N0cmluZ1N1YihrKV0gPSBzdWJzdGl0dXRlKHYpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHdoYXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gc3RyaW5nU3ViKHdoYXQpO1xuICAgIH1cblxuICAgIHJldHVybiB3aGF0O1xuICB9XG5cbiAgZnVuY3Rpb24gc3RyaW5nU3ViKHg6IHN0cmluZykge1xuICAgIGZvciAoY29uc3QgW3JlLCByZXBsYWNlbWVudF0gb2Ygc3RyaW5nU3Vic3RpdHV0aW9ucykge1xuICAgICAgeCA9IHgucmVwbGFjZShyZSwgcmVwbGFjZW1lbnQpO1xuICAgIH1cbiAgICByZXR1cm4geDtcbiAgfVxufVxuIl19