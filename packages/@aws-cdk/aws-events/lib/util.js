"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderEventPattern = exports.mergeEventPattern = void 0;
/**
 * Merge the `src` event pattern into the `dest` event pattern by adding all
 * values from `src` into the fields in `dest`.
 *
 * See `rule.addEventPattern` for details.
 */
function mergeEventPattern(dest, src) {
    dest = dest || {};
    mergeObject(dest, src);
    return dest;
    function mergeObject(destObj, srcObj) {
        if (typeof (srcObj) !== 'object') {
            throw new Error(`Invalid event pattern '${JSON.stringify(srcObj)}', expecting an object or an array`);
        }
        for (const field of Object.keys(srcObj)) {
            const srcValue = srcObj[field];
            const destValue = destObj[field];
            if (srcValue === undefined) {
                continue;
            }
            if (typeof (srcValue) !== 'object') {
                throw new Error(`Invalid event pattern field { ${field}: ${JSON.stringify(srcValue)} }. All fields must be arrays`);
            }
            // dest doesn't have this field
            if (destObj[field] === undefined) {
                destObj[field] = srcValue;
                continue;
            }
            if (Array.isArray(srcValue) !== Array.isArray(destValue)) {
                throw new Error(`Invalid event pattern field ${field}. ` +
                    `Type mismatch between existing pattern ${JSON.stringify(destValue)} and added pattern ${JSON.stringify(srcValue)}`);
            }
            // if this is an array, concat and deduplicate the values
            if (Array.isArray(srcValue)) {
                const result = [...destValue, ...srcValue];
                const resultJson = result.map(i => JSON.stringify(i));
                destObj[field] = result.filter((value, index) => resultJson.indexOf(JSON.stringify(value)) === index);
                continue;
            }
            // otherwise, it's an object, so recurse
            mergeObject(destObj[field], srcValue);
        }
    }
}
exports.mergeEventPattern = mergeEventPattern;
/**
 * Transform an eventPattern object into a valid Event Rule Pattern
 * by changing detailType into detail-type when present.
 */
function renderEventPattern(eventPattern) {
    if (Object.keys(eventPattern).length === 0) {
        return undefined;
    }
    // rename 'detailType' to 'detail-type'
    const out = {};
    for (let key of Object.keys(eventPattern)) {
        const value = eventPattern[key];
        if (key === 'detailType') {
            key = 'detail-type';
        }
        out[key] = value;
    }
    return out;
}
exports.renderEventPattern = renderEventPattern;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUE7Ozs7O0dBS0c7QUFDSCxTQUFnQixpQkFBaUIsQ0FBQyxJQUFTLEVBQUUsR0FBUTtJQUNuRCxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUcsQ0FBQztJQUVuQixXQUFXLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBRXZCLE9BQU8sSUFBSSxDQUFDO0lBRVosU0FBUyxXQUFXLENBQUMsT0FBWSxFQUFFLE1BQVc7UUFDNUMsSUFBSSxPQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssUUFBUSxFQUFFO1lBQy9CLE1BQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLG9DQUFvQyxDQUFDLENBQUM7U0FDdkc7UUFFRCxLQUFLLE1BQU0sS0FBSyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFFdkMsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQy9CLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUVqQyxJQUFJLFFBQVEsS0FBSyxTQUFTLEVBQUU7Z0JBQUUsU0FBUzthQUFFO1lBRXpDLElBQUksT0FBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLFFBQVEsRUFBRTtnQkFDakMsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQ0FBaUMsS0FBSyxLQUFLLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLCtCQUErQixDQUFDLENBQUM7YUFDckg7WUFFRCwrQkFBK0I7WUFDL0IsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssU0FBUyxFQUFFO2dCQUNoQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsUUFBUSxDQUFDO2dCQUMxQixTQUFTO2FBQ1Y7WUFFRCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRTtnQkFDeEQsTUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBK0IsS0FBSyxJQUFJO29CQUN0RCwwQ0FBMEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsc0JBQXNCLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQ3hIO1lBRUQseURBQXlEO1lBQ3pELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDM0IsTUFBTSxNQUFNLEdBQUcsQ0FBQyxHQUFHLFNBQVMsRUFBRSxHQUFHLFFBQVEsQ0FBQyxDQUFDO2dCQUMzQyxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0RCxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDO2dCQUN0RyxTQUFTO2FBQ1Y7WUFFRCx3Q0FBd0M7WUFDeEMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztTQUN2QztJQUNILENBQUM7QUFDSCxDQUFDO0FBOUNELDhDQThDQztBQUVEOzs7R0FHRztBQUNILFNBQWdCLGtCQUFrQixDQUFDLFlBQTBCO0lBQzNELElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQzFDLE9BQU8sU0FBUyxDQUFDO0tBQ2xCO0lBRUQsdUNBQXVDO0lBQ3ZDLE1BQU0sR0FBRyxHQUFRLEVBQUUsQ0FBQztJQUNwQixLQUFLLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUU7UUFDekMsTUFBTSxLQUFLLEdBQUksWUFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN6QyxJQUFJLEdBQUcsS0FBSyxZQUFZLEVBQUU7WUFDeEIsR0FBRyxHQUFHLGFBQWEsQ0FBQztTQUNyQjtRQUNELEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7S0FDbEI7SUFFRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFoQkQsZ0RBZ0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRQYXR0ZXJuIH0gZnJvbSAnLi9ldmVudC1wYXR0ZXJuJztcblxuLyoqXG4gKiBNZXJnZSB0aGUgYHNyY2AgZXZlbnQgcGF0dGVybiBpbnRvIHRoZSBgZGVzdGAgZXZlbnQgcGF0dGVybiBieSBhZGRpbmcgYWxsXG4gKiB2YWx1ZXMgZnJvbSBgc3JjYCBpbnRvIHRoZSBmaWVsZHMgaW4gYGRlc3RgLlxuICpcbiAqIFNlZSBgcnVsZS5hZGRFdmVudFBhdHRlcm5gIGZvciBkZXRhaWxzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VFdmVudFBhdHRlcm4oZGVzdDogYW55LCBzcmM6IGFueSkge1xuICBkZXN0ID0gZGVzdCB8fCB7IH07XG5cbiAgbWVyZ2VPYmplY3QoZGVzdCwgc3JjKTtcblxuICByZXR1cm4gZGVzdDtcblxuICBmdW5jdGlvbiBtZXJnZU9iamVjdChkZXN0T2JqOiBhbnksIHNyY09iajogYW55KSB7XG4gICAgaWYgKHR5cGVvZihzcmNPYmopICE9PSAnb2JqZWN0Jykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGV2ZW50IHBhdHRlcm4gJyR7SlNPTi5zdHJpbmdpZnkoc3JjT2JqKX0nLCBleHBlY3RpbmcgYW4gb2JqZWN0IG9yIGFuIGFycmF5YCk7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBmaWVsZCBvZiBPYmplY3Qua2V5cyhzcmNPYmopKSB7XG5cbiAgICAgIGNvbnN0IHNyY1ZhbHVlID0gc3JjT2JqW2ZpZWxkXTtcbiAgICAgIGNvbnN0IGRlc3RWYWx1ZSA9IGRlc3RPYmpbZmllbGRdO1xuXG4gICAgICBpZiAoc3JjVmFsdWUgPT09IHVuZGVmaW5lZCkgeyBjb250aW51ZTsgfVxuXG4gICAgICBpZiAodHlwZW9mKHNyY1ZhbHVlKSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGV2ZW50IHBhdHRlcm4gZmllbGQgeyAke2ZpZWxkfTogJHtKU09OLnN0cmluZ2lmeShzcmNWYWx1ZSl9IH0uIEFsbCBmaWVsZHMgbXVzdCBiZSBhcnJheXNgKTtcbiAgICAgIH1cblxuICAgICAgLy8gZGVzdCBkb2Vzbid0IGhhdmUgdGhpcyBmaWVsZFxuICAgICAgaWYgKGRlc3RPYmpbZmllbGRdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZGVzdE9ialtmaWVsZF0gPSBzcmNWYWx1ZTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHNyY1ZhbHVlKSAhPT0gQXJyYXkuaXNBcnJheShkZXN0VmFsdWUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBldmVudCBwYXR0ZXJuIGZpZWxkICR7ZmllbGR9LiBgICtcbiAgICAgICAgICBgVHlwZSBtaXNtYXRjaCBiZXR3ZWVuIGV4aXN0aW5nIHBhdHRlcm4gJHtKU09OLnN0cmluZ2lmeShkZXN0VmFsdWUpfSBhbmQgYWRkZWQgcGF0dGVybiAke0pTT04uc3RyaW5naWZ5KHNyY1ZhbHVlKX1gKTtcbiAgICAgIH1cblxuICAgICAgLy8gaWYgdGhpcyBpcyBhbiBhcnJheSwgY29uY2F0IGFuZCBkZWR1cGxpY2F0ZSB0aGUgdmFsdWVzXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShzcmNWYWx1ZSkpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gWy4uLmRlc3RWYWx1ZSwgLi4uc3JjVmFsdWVdO1xuICAgICAgICBjb25zdCByZXN1bHRKc29uID0gcmVzdWx0Lm1hcChpID0+IEpTT04uc3RyaW5naWZ5KGkpKTtcbiAgICAgICAgZGVzdE9ialtmaWVsZF0gPSByZXN1bHQuZmlsdGVyKCh2YWx1ZSwgaW5kZXgpID0+IHJlc3VsdEpzb24uaW5kZXhPZihKU09OLnN0cmluZ2lmeSh2YWx1ZSkpID09PSBpbmRleCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBvdGhlcndpc2UsIGl0J3MgYW4gb2JqZWN0LCBzbyByZWN1cnNlXG4gICAgICBtZXJnZU9iamVjdChkZXN0T2JqW2ZpZWxkXSwgc3JjVmFsdWUpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFRyYW5zZm9ybSBhbiBldmVudFBhdHRlcm4gb2JqZWN0IGludG8gYSB2YWxpZCBFdmVudCBSdWxlIFBhdHRlcm5cbiAqIGJ5IGNoYW5naW5nIGRldGFpbFR5cGUgaW50byBkZXRhaWwtdHlwZSB3aGVuIHByZXNlbnQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJFdmVudFBhdHRlcm4oZXZlbnRQYXR0ZXJuOiBFdmVudFBhdHRlcm4pOiBhbnkge1xuICBpZiAoT2JqZWN0LmtleXMoZXZlbnRQYXR0ZXJuKS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgLy8gcmVuYW1lICdkZXRhaWxUeXBlJyB0byAnZGV0YWlsLXR5cGUnXG4gIGNvbnN0IG91dDogYW55ID0ge307XG4gIGZvciAobGV0IGtleSBvZiBPYmplY3Qua2V5cyhldmVudFBhdHRlcm4pKSB7XG4gICAgY29uc3QgdmFsdWUgPSAoZXZlbnRQYXR0ZXJuIGFzIGFueSlba2V5XTtcbiAgICBpZiAoa2V5ID09PSAnZGV0YWlsVHlwZScpIHtcbiAgICAgIGtleSA9ICdkZXRhaWwtdHlwZSc7XG4gICAgfVxuICAgIG91dFtrZXldID0gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gb3V0O1xufVxuIl19