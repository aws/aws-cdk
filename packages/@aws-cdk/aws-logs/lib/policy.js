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
_a = JSII_RTTI_SYMBOL_1;
ResourcePolicy[_a] = { fqn: "@aws-cdk/aws-logs.ResourcePolicy", version: "0.0.0" };
exports.ResourcePolicy = ResourcePolicy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9saWN5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicG9saWN5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDhDQUFtRTtBQUNuRSx3Q0FBc0Q7QUFFdEQscURBQXFEO0FBb0JyRDs7Ozs7Ozs7Ozs7OztHQWFHO0FBQ0gsTUFBYSxjQUFlLFNBQVEsZUFBUTtJQU0xQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQTJCO1FBQ25FLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQ2YsWUFBWSxFQUFFLEtBQUssRUFBRSxrQkFBa0I7U0FDeEMsQ0FBQyxDQUFDO1FBUkw7O1dBRUc7UUFDYSxhQUFRLEdBQUcsSUFBSSx3QkFBYyxFQUFFLENBQUM7Ozs7OzsrQ0FKckMsY0FBYzs7OztRQVd2QixNQUFNLEVBQUUsR0FBRyxJQUFJLGtDQUFpQixDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtZQUN2RCxVQUFVLEVBQUUsV0FBSSxDQUFDLE1BQU0sQ0FBQztnQkFDdEIsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLEtBQUssRUFBRSxrQkFBa0IsSUFBSSxZQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQzthQUNqRSxDQUFDO1lBQ0YsY0FBYyxFQUFFLFdBQUksQ0FBQyxNQUFNLENBQUM7Z0JBQzFCLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7YUFDN0MsQ0FBQztTQUNILENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztRQUU1QixJQUFJLEtBQUssRUFBRSxnQkFBZ0IsRUFBRTtZQUMzQixJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1NBQ3hEO0tBQ0Y7Ozs7QUF6QlUsd0NBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQb2xpY3lEb2N1bWVudCwgUG9saWN5U3RhdGVtZW50IH0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgeyBSZXNvdXJjZSwgTGF6eSwgTmFtZXMgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ2ZuUmVzb3VyY2VQb2xpY3kgfSBmcm9tICcuL2xvZ3MuZ2VuZXJhdGVkJztcblxuLyoqXG4gKiBQcm9wZXJ0aWVzIHRvIGRlZmluZSBDbG91ZHdhdGNoIGxvZyBncm91cCByZXNvdXJjZSBwb2xpY3lcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSZXNvdXJjZVBvbGljeVByb3BzIHtcbiAgLyoqXG4gICAqIE5hbWUgb2YgdGhlIGxvZyBncm91cCByZXNvdXJjZSBwb2xpY3lcbiAgICogQGRlZmF1bHQgLSBVc2VzIGEgdW5pcXVlIGlkIGJhc2VkIG9uIHRoZSBjb25zdHJ1Y3QgcGF0aFxuICAgKi9cbiAgcmVhZG9ubHkgcmVzb3VyY2VQb2xpY3lOYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBJbml0aWFsIHN0YXRlbWVudHMgdG8gYWRkIHRvIHRoZSByZXNvdXJjZSBwb2xpY3lcbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBzdGF0ZW1lbnRzXG4gICAqL1xuICByZWFkb25seSBwb2xpY3lTdGF0ZW1lbnRzPzogUG9saWN5U3RhdGVtZW50W107XG59XG5cbi8qKlxuICogUmVzb3VyY2UgUG9saWN5IGZvciBDbG91ZFdhdGNoIExvZyBHcm91cHNcbiAqXG4gKiBQb2xpY2llcyBkZWZpbmUgdGhlIG9wZXJhdGlvbnMgdGhhdCBhcmUgYWxsb3dlZCBvbiB0aGlzIHJlc291cmNlLlxuICpcbiAqIFlvdSBhbG1vc3QgbmV2ZXIgbmVlZCB0byBkZWZpbmUgdGhpcyBjb25zdHJ1Y3QgZGlyZWN0bHkuXG4gKlxuICogQWxsIEFXUyByZXNvdXJjZXMgdGhhdCBzdXBwb3J0IHJlc291cmNlIHBvbGljaWVzIGhhdmUgYSBtZXRob2QgY2FsbGVkXG4gKiBgYWRkVG9SZXNvdXJjZVBvbGljeSgpYCwgd2hpY2ggd2lsbCBhdXRvbWF0aWNhbGx5IGNyZWF0ZSBhIG5ldyByZXNvdXJjZVxuICogcG9saWN5IGlmIG9uZSBkb2Vzbid0IGV4aXN0IHlldCwgb3RoZXJ3aXNlIGl0IHdpbGwgYWRkIHRvIHRoZSBleGlzdGluZ1xuICogcG9saWN5LlxuICpcbiAqIFByZWZlciB0byB1c2UgYGFkZFRvUmVzb3VyY2VQb2xpY3koKWAgaW5zdGVhZC5cbiAqL1xuZXhwb3J0IGNsYXNzIFJlc291cmNlUG9saWN5IGV4dGVuZHMgUmVzb3VyY2Uge1xuICAvKipcbiAgICogVGhlIElBTSBwb2xpY3kgZG9jdW1lbnQgZm9yIHRoaXMgcmVzb3VyY2UgcG9saWN5LlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGRvY3VtZW50ID0gbmV3IFBvbGljeURvY3VtZW50KCk7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBSZXNvdXJjZVBvbGljeVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBwaHlzaWNhbE5hbWU6IHByb3BzPy5yZXNvdXJjZVBvbGljeU5hbWUsXG4gICAgfSk7XG5cbiAgICBjb25zdCBsMSA9IG5ldyBDZm5SZXNvdXJjZVBvbGljeSh0aGlzLCAnUmVzb3VyY2VQb2xpY3knLCB7XG4gICAgICBwb2xpY3lOYW1lOiBMYXp5LnN0cmluZyh7XG4gICAgICAgIHByb2R1Y2U6ICgpID0+IHByb3BzPy5yZXNvdXJjZVBvbGljeU5hbWUgPz8gTmFtZXMudW5pcXVlSWQodGhpcyksXG4gICAgICB9KSxcbiAgICAgIHBvbGljeURvY3VtZW50OiBMYXp5LnN0cmluZyh7XG4gICAgICAgIHByb2R1Y2U6ICgpID0+IEpTT04uc3RyaW5naWZ5KHRoaXMuZG9jdW1lbnQpLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICB0aGlzLm5vZGUuZGVmYXVsdENoaWxkID0gbDE7XG5cbiAgICBpZiAocHJvcHM/LnBvbGljeVN0YXRlbWVudHMpIHtcbiAgICAgIHRoaXMuZG9jdW1lbnQuYWRkU3RhdGVtZW50cyguLi5wcm9wcy5wb2xpY3lTdGF0ZW1lbnRzKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==