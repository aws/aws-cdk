"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicPolicy = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const sns_generated_1 = require("./sns.generated");
/**
 * The policy for an SNS Topic
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
class TopicPolicy extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        /**
         * The IAM policy document for this policy.
         */
        this.document = new aws_iam_1.PolicyDocument({
            // statements must be unique, so we use the statement index.
            // potantially SIDs can change as a result of order change, but this should
            // not have an impact on the policy evaluation.
            // https://docs.aws.amazon.com/sns/latest/dg/AccessPolicyLanguage_SpecialInfo.html
            assignSids: true,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_sns_TopicPolicyProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, TopicPolicy);
            }
            throw error;
        }
        this.document = props.policyDocument ?? this.document;
        new sns_generated_1.CfnTopicPolicy(this, 'Resource', {
            policyDocument: this.document,
            topics: props.topics.map(t => t.topicArn),
        });
    }
}
exports.TopicPolicy = TopicPolicy;
_a = JSII_RTTI_SYMBOL_1;
TopicPolicy[_a] = { fqn: "@aws-cdk/aws-sns.TopicPolicy", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9saWN5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicG9saWN5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDhDQUFrRDtBQUNsRCx3Q0FBeUM7QUFFekMsbURBQWlEO0FBbUJqRDs7Ozs7Ozs7Ozs7OztHQWFHO0FBQ0gsTUFBYSxXQUFZLFNBQVEsZUFBUTtJQVl2QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXVCO1FBQy9ELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFabkI7O1dBRUc7UUFDYSxhQUFRLEdBQUcsSUFBSSx3QkFBYyxDQUFDO1lBQzVDLDREQUE0RDtZQUM1RCwyRUFBMkU7WUFDM0UsK0NBQStDO1lBQy9DLGtGQUFrRjtZQUNsRixVQUFVLEVBQUUsSUFBSTtTQUNqQixDQUFDLENBQUM7Ozs7OzsrQ0FWUSxXQUFXOzs7O1FBZXBCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLGNBQWMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDO1FBRXRELElBQUksOEJBQWMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ25DLGNBQWMsRUFBRSxJQUFJLENBQUMsUUFBUTtZQUM3QixNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO1NBQzFDLENBQUMsQ0FBQztLQUNKOztBQXJCSCxrQ0FzQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQb2xpY3lEb2N1bWVudCB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0IHsgUmVzb3VyY2UgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ2ZuVG9waWNQb2xpY3kgfSBmcm9tICcuL3Nucy5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgSVRvcGljIH0gZnJvbSAnLi90b3BpYy1iYXNlJztcblxuLyoqXG4gKiBQcm9wZXJ0aWVzIHRvIGFzc29jaWF0ZSBTTlMgdG9waWNzIHdpdGggYSBwb2xpY3lcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUb3BpY1BvbGljeVByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBzZXQgb2YgdG9waWNzIHRoaXMgcG9saWN5IGFwcGxpZXMgdG8uXG4gICAqL1xuICByZWFkb25seSB0b3BpY3M6IElUb3BpY1tdO1xuICAvKipcbiAgICogSUFNIHBvbGljeSBkb2N1bWVudCB0byBhcHBseSB0byB0b3BpYyhzKS5cbiAgICogQGRlZmF1bHQgZW1wdHkgcG9saWN5IGRvY3VtZW50XG4gICAqL1xuICByZWFkb25seSBwb2xpY3lEb2N1bWVudD86IFBvbGljeURvY3VtZW50O1xuXG59XG5cbi8qKlxuICogVGhlIHBvbGljeSBmb3IgYW4gU05TIFRvcGljXG4gKlxuICogUG9saWNpZXMgZGVmaW5lIHRoZSBvcGVyYXRpb25zIHRoYXQgYXJlIGFsbG93ZWQgb24gdGhpcyByZXNvdXJjZS5cbiAqXG4gKiBZb3UgYWxtb3N0IG5ldmVyIG5lZWQgdG8gZGVmaW5lIHRoaXMgY29uc3RydWN0IGRpcmVjdGx5LlxuICpcbiAqIEFsbCBBV1MgcmVzb3VyY2VzIHRoYXQgc3VwcG9ydCByZXNvdXJjZSBwb2xpY2llcyBoYXZlIGEgbWV0aG9kIGNhbGxlZFxuICogYGFkZFRvUmVzb3VyY2VQb2xpY3koKWAsIHdoaWNoIHdpbGwgYXV0b21hdGljYWxseSBjcmVhdGUgYSBuZXcgcmVzb3VyY2VcbiAqIHBvbGljeSBpZiBvbmUgZG9lc24ndCBleGlzdCB5ZXQsIG90aGVyd2lzZSBpdCB3aWxsIGFkZCB0byB0aGUgZXhpc3RpbmdcbiAqIHBvbGljeS5cbiAqXG4gKiBQcmVmZXIgdG8gdXNlIGBhZGRUb1Jlc291cmNlUG9saWN5KClgIGluc3RlYWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBUb3BpY1BvbGljeSBleHRlbmRzIFJlc291cmNlIHtcbiAgLyoqXG4gICAqIFRoZSBJQU0gcG9saWN5IGRvY3VtZW50IGZvciB0aGlzIHBvbGljeS5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBkb2N1bWVudCA9IG5ldyBQb2xpY3lEb2N1bWVudCh7XG4gICAgLy8gc3RhdGVtZW50cyBtdXN0IGJlIHVuaXF1ZSwgc28gd2UgdXNlIHRoZSBzdGF0ZW1lbnQgaW5kZXguXG4gICAgLy8gcG90YW50aWFsbHkgU0lEcyBjYW4gY2hhbmdlIGFzIGEgcmVzdWx0IG9mIG9yZGVyIGNoYW5nZSwgYnV0IHRoaXMgc2hvdWxkXG4gICAgLy8gbm90IGhhdmUgYW4gaW1wYWN0IG9uIHRoZSBwb2xpY3kgZXZhbHVhdGlvbi5cbiAgICAvLyBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vc25zL2xhdGVzdC9kZy9BY2Nlc3NQb2xpY3lMYW5ndWFnZV9TcGVjaWFsSW5mby5odG1sXG4gICAgYXNzaWduU2lkczogdHJ1ZSxcbiAgfSk7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFRvcGljUG9saWN5UHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgdGhpcy5kb2N1bWVudCA9IHByb3BzLnBvbGljeURvY3VtZW50ID8/IHRoaXMuZG9jdW1lbnQ7XG5cbiAgICBuZXcgQ2ZuVG9waWNQb2xpY3kodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgcG9saWN5RG9jdW1lbnQ6IHRoaXMuZG9jdW1lbnQsXG4gICAgICB0b3BpY3M6IHByb3BzLnRvcGljcy5tYXAodCA9PiB0LnRvcGljQXJuKSxcbiAgICB9KTtcbiAgfVxufVxuIl19