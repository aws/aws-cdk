"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterCriteria = exports.FilterRule = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
/**
 * Filter rules for Lambda event filtering
 */
class FilterRule {
    /**
     * Null comparison operator
     */
    static null() {
        return [];
    }
    /**
     * Empty comparison operator
     */
    static empty() {
        return [''];
    }
    /**
     * Equals comparison operator
     */
    static isEqual(item) {
        if (typeof item === 'number') {
            return [{ numeric: ['=', item] }];
        }
        return [item];
    }
    /**
     * Or comparison operator
     */
    static or(...elem) {
        return elem;
    }
    /**
     * Not equals comparison operator
     */
    static notEquals(elem) {
        return [{ 'anything-but': [elem] }];
    }
    /**
     * Numeric range comparison operator
     */
    static between(first, second) {
        return [{ numeric: ['>', first, '<=', second] }];
    }
    /**
     * Exists comparison operator
     */
    static exists() {
        return [{ exists: true }];
    }
    /**
     * Not exists comparison operator
     */
    static notExists() {
        return [{ exists: false }];
    }
    /**
     * Begins with comparison operator
     */
    static beginsWith(elem) {
        return [{ prefix: elem }];
    }
}
exports.FilterRule = FilterRule;
_a = JSII_RTTI_SYMBOL_1;
FilterRule[_a] = { fqn: "@aws-cdk/aws-lambda.FilterRule", version: "0.0.0" };
/**
 * Filter criteria for Lambda event filtering
 */
class FilterCriteria {
    /**
     * Filter for event source
     */
    static filter(filter) {
        return { pattern: JSON.stringify(filter) };
    }
}
exports.FilterCriteria = FilterCriteria;
_b = JSII_RTTI_SYMBOL_1;
FilterCriteria[_b] = { fqn: "@aws-cdk/aws-lambda.FilterCriteria", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQtc291cmNlLWZpbHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImV2ZW50LXNvdXJjZS1maWx0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTs7R0FFRztBQUNILE1BQWEsVUFBVTtJQUNyQjs7T0FFRztJQUNJLE1BQU0sQ0FBQyxJQUFJO1FBQ2hCLE9BQU8sRUFBRSxDQUFDO0tBQ1g7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxLQUFLO1FBQ2pCLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUNiO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsT0FBTyxDQUFDLElBQXFCO1FBQ3pDLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFO1lBQzVCLE9BQU8sQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDbkM7UUFDRCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDZjtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQWM7UUFDaEMsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFZO1FBQ2xDLE9BQU8sQ0FBQyxFQUFFLGNBQWMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUNyQztJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFhLEVBQUUsTUFBYztRQUNqRCxPQUFPLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDbEQ7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxNQUFNO1FBQ2xCLE9BQU8sQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0tBQzNCO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsU0FBUztRQUNyQixPQUFPLENBQUMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztLQUM1QjtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFZO1FBQ25DLE9BQU8sQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0tBQzNCOztBQWpFSCxnQ0FrRUM7OztBQUVEOztHQUVHO0FBQ0gsTUFBYSxjQUFjO0lBQ3pCOztPQUVHO0lBQ0ksTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUEyQjtRQUM5QyxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztLQUM1Qzs7QUFOSCx3Q0FPQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRmlsdGVyIHJ1bGVzIGZvciBMYW1iZGEgZXZlbnQgZmlsdGVyaW5nXG4gKi9cbmV4cG9ydCBjbGFzcyBGaWx0ZXJSdWxlIHtcbiAgLyoqXG4gICAqIE51bGwgY29tcGFyaXNvbiBvcGVyYXRvclxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBudWxsKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICAvKipcbiAgICogRW1wdHkgY29tcGFyaXNvbiBvcGVyYXRvclxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBlbXB0eSgpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIFsnJ107XG4gIH1cblxuICAvKipcbiAgICogRXF1YWxzIGNvbXBhcmlzb24gb3BlcmF0b3JcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgaXNFcXVhbChpdGVtOiBzdHJpbmcgfCBudW1iZXIpOiBhbnkge1xuICAgIGlmICh0eXBlb2YgaXRlbSA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiBbeyBudW1lcmljOiBbJz0nLCBpdGVtXSB9XTtcbiAgICB9XG4gICAgcmV0dXJuIFtpdGVtXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPciBjb21wYXJpc29uIG9wZXJhdG9yXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIG9yKC4uLmVsZW06IHN0cmluZ1tdKTogc3RyaW5nW10ge1xuICAgIHJldHVybiBlbGVtO1xuICB9XG5cbiAgLyoqXG4gICAqIE5vdCBlcXVhbHMgY29tcGFyaXNvbiBvcGVyYXRvclxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBub3RFcXVhbHMoZWxlbTogc3RyaW5nKToge1trZXk6c3RyaW5nXTogc3RyaW5nW119W10ge1xuICAgIHJldHVybiBbeyAnYW55dGhpbmctYnV0JzogW2VsZW1dIH1dO1xuICB9XG5cbiAgLyoqXG4gICAqIE51bWVyaWMgcmFuZ2UgY29tcGFyaXNvbiBvcGVyYXRvclxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBiZXR3ZWVuKGZpcnN0OiBudW1iZXIsIHNlY29uZDogbnVtYmVyKToge1trZXk6c3RyaW5nXTogYW55W119W10ge1xuICAgIHJldHVybiBbeyBudW1lcmljOiBbJz4nLCBmaXJzdCwgJzw9Jywgc2Vjb25kXSB9XTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeGlzdHMgY29tcGFyaXNvbiBvcGVyYXRvclxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBleGlzdHMoKToge1trZXk6c3RyaW5nXTogYm9vbGVhbn1bXSB7XG4gICAgcmV0dXJuIFt7IGV4aXN0czogdHJ1ZSB9XTtcbiAgfVxuXG4gIC8qKlxuICAgKiBOb3QgZXhpc3RzIGNvbXBhcmlzb24gb3BlcmF0b3JcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbm90RXhpc3RzKCk6IHtba2V5OnN0cmluZ106IGJvb2xlYW59W10ge1xuICAgIHJldHVybiBbeyBleGlzdHM6IGZhbHNlIH1dO1xuICB9XG5cbiAgLyoqXG4gICAqIEJlZ2lucyB3aXRoIGNvbXBhcmlzb24gb3BlcmF0b3JcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYmVnaW5zV2l0aChlbGVtOiBzdHJpbmcpOiB7W2tleTpzdHJpbmddOiBzdHJpbmd9W10ge1xuICAgIHJldHVybiBbeyBwcmVmaXg6IGVsZW0gfV07XG4gIH1cbn1cblxuLyoqXG4gKiBGaWx0ZXIgY3JpdGVyaWEgZm9yIExhbWJkYSBldmVudCBmaWx0ZXJpbmdcbiAqL1xuZXhwb3J0IGNsYXNzIEZpbHRlckNyaXRlcmlhIHtcbiAgLyoqXG4gICAqIEZpbHRlciBmb3IgZXZlbnQgc291cmNlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZpbHRlcihmaWx0ZXI6IHtba2V5OnN0cmluZ106IGFueX0pOiB7W2tleTpzdHJpbmddOiBhbnl9IHtcbiAgICByZXR1cm4geyBwYXR0ZXJuOiBKU09OLnN0cmluZ2lmeShmaWx0ZXIpIH07XG4gIH1cbn0iXX0=