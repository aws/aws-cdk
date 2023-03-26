"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CfnInclude = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cfn_element_1 = require("./cfn-element");
/**
 * Includes a CloudFormation template into a stack. All elements of the template will be merged into
 * the current stack, together with any elements created programmatically.
 *
 * @deprecated use the CfnInclude class from the cloudformation-include module instead
 */
class CfnInclude extends cfn_element_1.CfnElement {
    /**
     * Creates an adopted template construct. The template will be incorporated into the stack as-is with no changes at all.
     * This means that logical IDs of entities within this template may conflict with logical IDs of entities that are part of the
     * stack.
     * @param scope The parent construct of this template
     * @param id The ID of this construct
     * @param props Initialization properties.
     */
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/core.CfnInclude", "use the CfnInclude class from the cloudformation-include module instead");
            jsiiDeprecationWarnings._aws_cdk_core_CfnIncludeProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnInclude);
            }
            throw error;
        }
        this.template = props.template;
    }
    /**
     * @internal
     */
    _toCloudFormation() {
        return this.template;
    }
}
_a = JSII_RTTI_SYMBOL_1;
CfnInclude[_a] = { fqn: "@aws-cdk/core.CfnInclude", version: "0.0.0" };
exports.CfnInclude = CfnInclude;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLWluY2x1ZGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjZm4taW5jbHVkZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSwrQ0FBMkM7QUFjM0M7Ozs7O0dBS0c7QUFDSCxNQUFhLFVBQVcsU0FBUSx3QkFBVTtJQU14Qzs7Ozs7OztPQU9HO0lBQ0gsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM5RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7OytDQWZSLFVBQVU7Ozs7UUFnQm5CLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQztLQUNoQztJQUVEOztPQUVHO0lBQ0ksaUJBQWlCO1FBQ3RCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztLQUN0Qjs7OztBQXhCVSxnQ0FBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ2ZuRWxlbWVudCB9IGZyb20gJy4vY2ZuLWVsZW1lbnQnO1xuXG4vKipcbiAqIENvbnN0cnVjdGlvbiBwcm9wZXJ0aWVzIGZvciBgQ2ZuSW5jbHVkZWAuXG4gKlxuICogQGRlcHJlY2F0ZWQgdXNlIHRoZSBDZm5JbmNsdWRlIGNsYXNzIGZyb20gdGhlIGNsb3VkZm9ybWF0aW9uLWluY2x1ZGUgbW9kdWxlIGluc3RlYWRcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5JbmNsdWRlUHJvcHMge1xuICAvKipcbiAgICogVGhlIENsb3VkRm9ybWF0aW9uIHRlbXBsYXRlIHRvIGluY2x1ZGUgaW4gdGhlIHN0YWNrIChhcyBpcykuXG4gICAqL1xuICByZWFkb25seSB0ZW1wbGF0ZTogb2JqZWN0O1xufVxuXG4vKipcbiAqIEluY2x1ZGVzIGEgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUgaW50byBhIHN0YWNrLiBBbGwgZWxlbWVudHMgb2YgdGhlIHRlbXBsYXRlIHdpbGwgYmUgbWVyZ2VkIGludG9cbiAqIHRoZSBjdXJyZW50IHN0YWNrLCB0b2dldGhlciB3aXRoIGFueSBlbGVtZW50cyBjcmVhdGVkIHByb2dyYW1tYXRpY2FsbHkuXG4gKlxuICogQGRlcHJlY2F0ZWQgdXNlIHRoZSBDZm5JbmNsdWRlIGNsYXNzIGZyb20gdGhlIGNsb3VkZm9ybWF0aW9uLWluY2x1ZGUgbW9kdWxlIGluc3RlYWRcbiAqL1xuZXhwb3J0IGNsYXNzIENmbkluY2x1ZGUgZXh0ZW5kcyBDZm5FbGVtZW50IHtcbiAgLyoqXG4gICAqIFRoZSBpbmNsdWRlZCB0ZW1wbGF0ZS5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB0ZW1wbGF0ZTogb2JqZWN0O1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGFkb3B0ZWQgdGVtcGxhdGUgY29uc3RydWN0LiBUaGUgdGVtcGxhdGUgd2lsbCBiZSBpbmNvcnBvcmF0ZWQgaW50byB0aGUgc3RhY2sgYXMtaXMgd2l0aCBubyBjaGFuZ2VzIGF0IGFsbC5cbiAgICogVGhpcyBtZWFucyB0aGF0IGxvZ2ljYWwgSURzIG9mIGVudGl0aWVzIHdpdGhpbiB0aGlzIHRlbXBsYXRlIG1heSBjb25mbGljdCB3aXRoIGxvZ2ljYWwgSURzIG9mIGVudGl0aWVzIHRoYXQgYXJlIHBhcnQgb2YgdGhlXG4gICAqIHN0YWNrLlxuICAgKiBAcGFyYW0gc2NvcGUgVGhlIHBhcmVudCBjb25zdHJ1Y3Qgb2YgdGhpcyB0ZW1wbGF0ZVxuICAgKiBAcGFyYW0gaWQgVGhlIElEIG9mIHRoaXMgY29uc3RydWN0XG4gICAqIEBwYXJhbSBwcm9wcyBJbml0aWFsaXphdGlvbiBwcm9wZXJ0aWVzLlxuICAgKi9cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENmbkluY2x1ZGVQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG4gICAgdGhpcy50ZW1wbGF0ZSA9IHByb3BzLnRlbXBsYXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIF90b0Nsb3VkRm9ybWF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnRlbXBsYXRlO1xuICB9XG59XG4iXX0=