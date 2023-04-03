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
exports.CfnInclude = CfnInclude;
_a = JSII_RTTI_SYMBOL_1;
CfnInclude[_a] = { fqn: "@aws-cdk/core.CfnInclude", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLWluY2x1ZGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjZm4taW5jbHVkZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSwrQ0FBMkM7QUFjM0M7Ozs7O0dBS0c7QUFDSCxNQUFhLFVBQVcsU0FBUSx3QkFBVTtJQU14Qzs7Ozs7OztPQU9HO0lBQ0gsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM5RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7OytDQWZSLFVBQVU7Ozs7UUFnQm5CLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQztLQUNoQztJQUVEOztPQUVHO0lBQ0ksaUJBQWlCO1FBQ3RCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztLQUN0Qjs7QUF4QkgsZ0NBeUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDZm5FbGVtZW50IH0gZnJvbSAnLi9jZm4tZWxlbWVudCc7XG5cbi8qKlxuICogQ29uc3RydWN0aW9uIHByb3BlcnRpZXMgZm9yIGBDZm5JbmNsdWRlYC5cbiAqXG4gKiBAZGVwcmVjYXRlZCB1c2UgdGhlIENmbkluY2x1ZGUgY2xhc3MgZnJvbSB0aGUgY2xvdWRmb3JtYXRpb24taW5jbHVkZSBtb2R1bGUgaW5zdGVhZFxuICovXG5leHBvcnQgaW50ZXJmYWNlIENmbkluY2x1ZGVQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUgdG8gaW5jbHVkZSBpbiB0aGUgc3RhY2sgKGFzIGlzKS5cbiAgICovXG4gIHJlYWRvbmx5IHRlbXBsYXRlOiBvYmplY3Q7XG59XG5cbi8qKlxuICogSW5jbHVkZXMgYSBDbG91ZEZvcm1hdGlvbiB0ZW1wbGF0ZSBpbnRvIGEgc3RhY2suIEFsbCBlbGVtZW50cyBvZiB0aGUgdGVtcGxhdGUgd2lsbCBiZSBtZXJnZWQgaW50b1xuICogdGhlIGN1cnJlbnQgc3RhY2ssIHRvZ2V0aGVyIHdpdGggYW55IGVsZW1lbnRzIGNyZWF0ZWQgcHJvZ3JhbW1hdGljYWxseS5cbiAqXG4gKiBAZGVwcmVjYXRlZCB1c2UgdGhlIENmbkluY2x1ZGUgY2xhc3MgZnJvbSB0aGUgY2xvdWRmb3JtYXRpb24taW5jbHVkZSBtb2R1bGUgaW5zdGVhZFxuICovXG5leHBvcnQgY2xhc3MgQ2ZuSW5jbHVkZSBleHRlbmRzIENmbkVsZW1lbnQge1xuICAvKipcbiAgICogVGhlIGluY2x1ZGVkIHRlbXBsYXRlLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHRlbXBsYXRlOiBvYmplY3Q7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gYWRvcHRlZCB0ZW1wbGF0ZSBjb25zdHJ1Y3QuIFRoZSB0ZW1wbGF0ZSB3aWxsIGJlIGluY29ycG9yYXRlZCBpbnRvIHRoZSBzdGFjayBhcy1pcyB3aXRoIG5vIGNoYW5nZXMgYXQgYWxsLlxuICAgKiBUaGlzIG1lYW5zIHRoYXQgbG9naWNhbCBJRHMgb2YgZW50aXRpZXMgd2l0aGluIHRoaXMgdGVtcGxhdGUgbWF5IGNvbmZsaWN0IHdpdGggbG9naWNhbCBJRHMgb2YgZW50aXRpZXMgdGhhdCBhcmUgcGFydCBvZiB0aGVcbiAgICogc3RhY2suXG4gICAqIEBwYXJhbSBzY29wZSBUaGUgcGFyZW50IGNvbnN0cnVjdCBvZiB0aGlzIHRlbXBsYXRlXG4gICAqIEBwYXJhbSBpZCBUaGUgSUQgb2YgdGhpcyBjb25zdHJ1Y3RcbiAgICogQHBhcmFtIHByb3BzIEluaXRpYWxpemF0aW9uIHByb3BlcnRpZXMuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ2ZuSW5jbHVkZVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcbiAgICB0aGlzLnRlbXBsYXRlID0gcHJvcHMudGVtcGxhdGU7XG4gIH1cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgX3RvQ2xvdWRGb3JtYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudGVtcGxhdGU7XG4gIH1cbn1cbiJdfQ==