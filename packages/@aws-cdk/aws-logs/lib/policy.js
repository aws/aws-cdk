"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourcePolicy = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const logs_generated_1 = require("./logs.generated");
/**
 * Resource Policy for CloudWatch Log Groups
 *
 * Policies define the operations that are allowed on this resource.
 *
 * You almost never need to define this construct directly.
 *
 * All AWS resources that support resource policies have a method called
 * `addToResourcePolicy()`, which will automatically create a new resource
 * policy if one doesn't exist yet, otherwise it will add to the existing
 * policy.
 *
 * Prefer to use `addToResourcePolicy()` instead.
 */
class ResourcePolicy extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id, {
            physicalName: props?.resourcePolicyName,
        });
        /**
         * The IAM policy document for this resource policy.
         */
        this.document = new aws_iam_1.PolicyDocument();
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_logs_ResourcePolicyProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, ResourcePolicy);
            }
            throw error;
        }
        const l1 = new logs_generated_1.CfnResourcePolicy(this, 'ResourcePolicy', {
            policyName: core_1.Lazy.string({
                produce: () => props?.resourcePolicyName ?? core_1.Names.uniqueId(this),
            }),
            policyDocument: core_1.Lazy.string({
                produce: () => JSON.stringify(this.document),
            }),
        });
        this.node.defaultChild = l1;
        if (props?.policyStatements) {
            this.document.addStatements(...props.policyStatements);
        }
    }
}
exports.ResourcePolicy = ResourcePolicy;
_a = JSII_RTTI_SYMBOL_1;
ResourcePolicy[_a] = { fqn: "@aws-cdk/aws-logs.ResourcePolicy", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9saWN5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicG9saWN5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDhDQUFtRTtBQUNuRSx3Q0FBc0Q7QUFFdEQscURBQXFEO0FBb0JyRDs7Ozs7Ozs7Ozs7OztHQWFHO0FBQ0gsTUFBYSxjQUFlLFNBQVEsZUFBUTtJQU0xQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQTJCO1FBQ25FLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQ2YsWUFBWSxFQUFFLEtBQUssRUFBRSxrQkFBa0I7U0FDeEMsQ0FBQyxDQUFDO1FBUkw7O1dBRUc7UUFDYSxhQUFRLEdBQUcsSUFBSSx3QkFBYyxFQUFFLENBQUM7Ozs7OzsrQ0FKckMsY0FBYzs7OztRQVd2QixNQUFNLEVBQUUsR0FBRyxJQUFJLGtDQUFpQixDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtZQUN2RCxVQUFVLEVBQUUsV0FBSSxDQUFDLE1BQU0sQ0FBQztnQkFDdEIsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLEtBQUssRUFBRSxrQkFBa0IsSUFBSSxZQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQzthQUNqRSxDQUFDO1lBQ0YsY0FBYyxFQUFFLFdBQUksQ0FBQyxNQUFNLENBQUM7Z0JBQzFCLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7YUFDN0MsQ0FBQztTQUNILENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztRQUU1QixJQUFJLEtBQUssRUFBRSxnQkFBZ0IsRUFBRTtZQUMzQixJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1NBQ3hEO0tBQ0Y7O0FBekJILHdDQTBCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBvbGljeURvY3VtZW50LCBQb2xpY3lTdGF0ZW1lbnQgfSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCB7IFJlc291cmNlLCBMYXp5LCBOYW1lcyB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDZm5SZXNvdXJjZVBvbGljeSB9IGZyb20gJy4vbG9ncy5nZW5lcmF0ZWQnO1xuXG4vKipcbiAqIFByb3BlcnRpZXMgdG8gZGVmaW5lIENsb3Vkd2F0Y2ggbG9nIGdyb3VwIHJlc291cmNlIHBvbGljeVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJlc291cmNlUG9saWN5UHJvcHMge1xuICAvKipcbiAgICogTmFtZSBvZiB0aGUgbG9nIGdyb3VwIHJlc291cmNlIHBvbGljeVxuICAgKiBAZGVmYXVsdCAtIFVzZXMgYSB1bmlxdWUgaWQgYmFzZWQgb24gdGhlIGNvbnN0cnVjdCBwYXRoXG4gICAqL1xuICByZWFkb25seSByZXNvdXJjZVBvbGljeU5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEluaXRpYWwgc3RhdGVtZW50cyB0byBhZGQgdG8gdGhlIHJlc291cmNlIHBvbGljeVxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIHN0YXRlbWVudHNcbiAgICovXG4gIHJlYWRvbmx5IHBvbGljeVN0YXRlbWVudHM/OiBQb2xpY3lTdGF0ZW1lbnRbXTtcbn1cblxuLyoqXG4gKiBSZXNvdXJjZSBQb2xpY3kgZm9yIENsb3VkV2F0Y2ggTG9nIEdyb3Vwc1xuICpcbiAqIFBvbGljaWVzIGRlZmluZSB0aGUgb3BlcmF0aW9ucyB0aGF0IGFyZSBhbGxvd2VkIG9uIHRoaXMgcmVzb3VyY2UuXG4gKlxuICogWW91IGFsbW9zdCBuZXZlciBuZWVkIHRvIGRlZmluZSB0aGlzIGNvbnN0cnVjdCBkaXJlY3RseS5cbiAqXG4gKiBBbGwgQVdTIHJlc291cmNlcyB0aGF0IHN1cHBvcnQgcmVzb3VyY2UgcG9saWNpZXMgaGF2ZSBhIG1ldGhvZCBjYWxsZWRcbiAqIGBhZGRUb1Jlc291cmNlUG9saWN5KClgLCB3aGljaCB3aWxsIGF1dG9tYXRpY2FsbHkgY3JlYXRlIGEgbmV3IHJlc291cmNlXG4gKiBwb2xpY3kgaWYgb25lIGRvZXNuJ3QgZXhpc3QgeWV0LCBvdGhlcndpc2UgaXQgd2lsbCBhZGQgdG8gdGhlIGV4aXN0aW5nXG4gKiBwb2xpY3kuXG4gKlxuICogUHJlZmVyIHRvIHVzZSBgYWRkVG9SZXNvdXJjZVBvbGljeSgpYCBpbnN0ZWFkLlxuICovXG5leHBvcnQgY2xhc3MgUmVzb3VyY2VQb2xpY3kgZXh0ZW5kcyBSZXNvdXJjZSB7XG4gIC8qKlxuICAgKiBUaGUgSUFNIHBvbGljeSBkb2N1bWVudCBmb3IgdGhpcyByZXNvdXJjZSBwb2xpY3kuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZG9jdW1lbnQgPSBuZXcgUG9saWN5RG9jdW1lbnQoKTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IFJlc291cmNlUG9saWN5UHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIHBoeXNpY2FsTmFtZTogcHJvcHM/LnJlc291cmNlUG9saWN5TmFtZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGwxID0gbmV3IENmblJlc291cmNlUG9saWN5KHRoaXMsICdSZXNvdXJjZVBvbGljeScsIHtcbiAgICAgIHBvbGljeU5hbWU6IExhenkuc3RyaW5nKHtcbiAgICAgICAgcHJvZHVjZTogKCkgPT4gcHJvcHM/LnJlc291cmNlUG9saWN5TmFtZSA/PyBOYW1lcy51bmlxdWVJZCh0aGlzKSxcbiAgICAgIH0pLFxuICAgICAgcG9saWN5RG9jdW1lbnQ6IExhenkuc3RyaW5nKHtcbiAgICAgICAgcHJvZHVjZTogKCkgPT4gSlNPTi5zdHJpbmdpZnkodGhpcy5kb2N1bWVudCksXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIHRoaXMubm9kZS5kZWZhdWx0Q2hpbGQgPSBsMTtcblxuICAgIGlmIChwcm9wcz8ucG9saWN5U3RhdGVtZW50cykge1xuICAgICAgdGhpcy5kb2N1bWVudC5hZGRTdGF0ZW1lbnRzKC4uLnByb3BzLnBvbGljeVN0YXRlbWVudHMpO1xuICAgIH1cbiAgfVxufVxuIl19