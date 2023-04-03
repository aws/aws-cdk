"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeInspector = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRyZWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7O0dBRUc7QUFDSCxNQUFhLGFBQWE7SUFBMUI7UUFDRTs7V0FFRztRQUNhLGVBQVUsR0FBMkIsRUFBRSxDQUFDO0lBWTFELENBQUM7SUFWQzs7Ozs7O09BTUc7SUFDSSxZQUFZLENBQUMsR0FBVyxFQUFFLEtBQVU7UUFDekMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7SUFDL0IsQ0FBQztDQUNGO0FBaEJELHNDQWdCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogSW5zcGVjdG9yIHRoYXQgbWFpbnRhaW5zIGFuIGF0dHJpYnV0ZSBiYWdcbiAqL1xuZXhwb3J0IGNsYXNzIFRyZWVJbnNwZWN0b3Ige1xuICAvKipcbiAgICogUmVwcmVzZW50cyB0aGUgYmFnIG9mIGF0dHJpYnV0ZXMgYXMga2V5LXZhbHVlIHBhaXJzLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGF0dHJpYnV0ZXM6IHsgW2tleTogc3RyaW5nXTogYW55IH0gPSB7fTtcblxuICAvKipcbiAgICogQWRkcyBhdHRyaWJ1dGUgdG8gYmFnLiBLZXlzIHNob3VsZCBiZSBhZGRlZCBieSBjb252ZW50aW9uIHRvIHByZXZlbnQgY29uZmxpY3RzXG4gICAqIGkuZS4gTDEgY29uc3RydWN0cyB3aWxsIGNvbnRhaW4gYXR0cmlidXRlcyB3aXRoIGtleXMgcHJlZml4ZWQgd2l0aCBhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uXG4gICAqXG4gICAqIEBwYXJhbSBrZXkgLSBrZXkgZm9yIG1ldGFkYXRhXG4gICAqIEBwYXJhbSB2YWx1ZSAtIHZhbHVlIG9mIG1ldGFkYXRhLlxuICAgKi9cbiAgcHVibGljIGFkZEF0dHJpYnV0ZShrZXk6IHN0cmluZywgdmFsdWU6IGFueSkge1xuICAgIHRoaXMuYXR0cmlidXRlc1trZXldID0gdmFsdWU7XG4gIH1cbn1cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIGV4YW1pbmluZyBhIGNvbnN0cnVjdCBhbmQgZXhwb3NpbmcgbWV0YWRhdGEuXG4gKlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElJbnNwZWN0YWJsZSB7XG4gIC8qKlxuICAgKiBFeGFtaW5lcyBjb25zdHJ1Y3RcbiAgICpcbiAgICogQHBhcmFtIGluc3BlY3RvciAtIHRyZWUgaW5zcGVjdG9yIHRvIGNvbGxlY3QgYW5kIHByb2Nlc3MgYXR0cmlidXRlc1xuICAgKi9cbiAgaW5zcGVjdChpbnNwZWN0b3I6IFRyZWVJbnNwZWN0b3IpOiB2b2lkO1xufVxuIl19