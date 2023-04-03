"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeInspector = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
/**
 * Inspector that maintains an attribute bag
 */
class TreeInspector {
    constructor() {
        /**
         * Represents the bag of attributes as key-value pairs.
         */
        this.attributes = {};
    }
    /**
     * Adds attribute to bag. Keys should be added by convention to prevent conflicts
     * i.e. L1 constructs will contain attributes with keys prefixed with aws:cdk:cloudformation
     *
     * @param key - key for metadata
     * @param value - value of metadata.
     */
    addAttribute(key, value) {
        this.attributes[key] = value;
    }
}
exports.TreeInspector = TreeInspector;
_a = JSII_RTTI_SYMBOL_1;
TreeInspector[_a] = { fqn: "@aws-cdk/core.TreeInspector", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRyZWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTs7R0FFRztBQUNILE1BQWEsYUFBYTtJQUExQjtRQUNFOztXQUVHO1FBQ2EsZUFBVSxHQUEyQixFQUFFLENBQUM7S0FZekQ7SUFWQzs7Ozs7O09BTUc7SUFDSSxZQUFZLENBQUMsR0FBVyxFQUFFLEtBQVU7UUFDekMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7S0FDOUI7O0FBZkgsc0NBZ0JDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBJbnNwZWN0b3IgdGhhdCBtYWludGFpbnMgYW4gYXR0cmlidXRlIGJhZ1xuICovXG5leHBvcnQgY2xhc3MgVHJlZUluc3BlY3RvciB7XG4gIC8qKlxuICAgKiBSZXByZXNlbnRzIHRoZSBiYWcgb2YgYXR0cmlidXRlcyBhcyBrZXktdmFsdWUgcGFpcnMuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgYXR0cmlidXRlczogeyBba2V5OiBzdHJpbmddOiBhbnkgfSA9IHt9O1xuXG4gIC8qKlxuICAgKiBBZGRzIGF0dHJpYnV0ZSB0byBiYWcuIEtleXMgc2hvdWxkIGJlIGFkZGVkIGJ5IGNvbnZlbnRpb24gdG8gcHJldmVudCBjb25mbGljdHNcbiAgICogaS5lLiBMMSBjb25zdHJ1Y3RzIHdpbGwgY29udGFpbiBhdHRyaWJ1dGVzIHdpdGgga2V5cyBwcmVmaXhlZCB3aXRoIGF3czpjZGs6Y2xvdWRmb3JtYXRpb25cbiAgICpcbiAgICogQHBhcmFtIGtleSAtIGtleSBmb3IgbWV0YWRhdGFcbiAgICogQHBhcmFtIHZhbHVlIC0gdmFsdWUgb2YgbWV0YWRhdGEuXG4gICAqL1xuICBwdWJsaWMgYWRkQXR0cmlidXRlKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KSB7XG4gICAgdGhpcy5hdHRyaWJ1dGVzW2tleV0gPSB2YWx1ZTtcbiAgfVxufVxuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgZXhhbWluaW5nIGEgY29uc3RydWN0IGFuZCBleHBvc2luZyBtZXRhZGF0YS5cbiAqXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUluc3BlY3RhYmxlIHtcbiAgLyoqXG4gICAqIEV4YW1pbmVzIGNvbnN0cnVjdFxuICAgKlxuICAgKiBAcGFyYW0gaW5zcGVjdG9yIC0gdHJlZSBpbnNwZWN0b3IgdG8gY29sbGVjdCBhbmQgcHJvY2VzcyBhdHRyaWJ1dGVzXG4gICAqL1xuICBpbnNwZWN0KGluc3BlY3RvcjogVHJlZUluc3BlY3Rvcik6IHZvaWQ7XG59XG4iXX0=