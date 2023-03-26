"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CfnRule = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cfn_element_1 = require("./cfn-element");
const util_1 = require("./util");
/**
 * The Rules that define template constraints in an AWS Service Catalog portfolio describe when
 * end users can use the template and which values they can specify for parameters that are declared
 * in the AWS CloudFormation template used to create the product they are attempting to use. Rules
 * are useful for preventing end users from inadvertently specifying an incorrect value.
 * For example, you can add a rule to verify whether end users specified a valid subnet in a
 * given VPC or used m1.small instance types for test environments. AWS CloudFormation uses
 * rules to validate parameter values before it creates the resources for the product.
 *
 * A rule can include a RuleCondition property and must include an Assertions property.
 * For each rule, you can define only one rule condition; you can define one or more asserts within the Assertions property.
 * You define a rule condition and assertions by using rule-specific intrinsic functions.
 *
 * @link https://docs.aws.amazon.com/servicecatalog/latest/adminguide/reference-template_constraint_rules.html
 */
class CfnRule extends cfn_element_1.CfnRefElement {
    /**
     * Creates and adds a rule.
     * @param scope The parent construct.
     * @param props The rule props.
     */
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_core_CfnRuleProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnRule);
            }
            throw error;
        }
        this.ruleCondition = props && props.ruleCondition;
        this.assertions = props && props.assertions;
    }
    /**
     * Adds an assertion to the rule.
     * @param condition The expression to evaluation.
     * @param description The description of the assertion.
     */
    addAssertion(condition, description) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_ICfnConditionExpression(condition);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addAssertion);
            }
            throw error;
        }
        if (!this.assertions) {
            this.assertions = [];
        }
        this.assertions.push({
            assert: condition,
            assertDescription: description,
        });
    }
    /**
     * @internal
     */
    _toCloudFormation() {
        return {
            Rules: {
                [this.logicalId]: {
                    RuleCondition: this.ruleCondition,
                    Assertions: (0, util_1.capitalizePropertyNames)(this, this.assertions),
                },
            },
        };
    }
}
_a = JSII_RTTI_SYMBOL_1;
CfnRule[_a] = { fqn: "@aws-cdk/core.CfnRule", version: "0.0.0" };
exports.CfnRule = CfnRule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLXJ1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjZm4tcnVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQSwrQ0FBOEM7QUFDOUMsaUNBQWlEO0FBd0NqRDs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQUNILE1BQWEsT0FBUSxTQUFRLDJCQUFhO0lBSXhDOzs7O09BSUc7SUFDSCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQW9CO1FBQzVELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7Ozs7OzsrQ0FWUixPQUFPOzs7O1FBWWhCLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxJQUFJLEtBQUssQ0FBQyxhQUFhLENBQUM7UUFDbEQsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQztLQUM3QztJQUVEOzs7O09BSUc7SUFDSSxZQUFZLENBQUMsU0FBa0MsRUFBRSxXQUFtQjs7Ozs7Ozs7OztRQUN6RSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNwQixJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztTQUN0QjtRQUVELElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO1lBQ25CLE1BQU0sRUFBRSxTQUFTO1lBQ2pCLGlCQUFpQixFQUFFLFdBQVc7U0FDL0IsQ0FBQyxDQUFDO0tBQ0o7SUFFRDs7T0FFRztJQUNJLGlCQUFpQjtRQUN0QixPQUFPO1lBQ0wsS0FBSyxFQUFFO2dCQUNMLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFO29CQUNoQixhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWE7b0JBQ2pDLFVBQVUsRUFBRSxJQUFBLDhCQUF1QixFQUFDLElBQUksRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDO2lCQUMzRDthQUNGO1NBQ0YsQ0FBQztLQUNIOzs7O0FBNUNVLDBCQUFPIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBJQ2ZuQ29uZGl0aW9uRXhwcmVzc2lvbiB9IGZyb20gJy4vY2ZuLWNvbmRpdGlvbic7XG5pbXBvcnQgeyBDZm5SZWZFbGVtZW50IH0gZnJvbSAnLi9jZm4tZWxlbWVudCc7XG5pbXBvcnQgeyBjYXBpdGFsaXplUHJvcGVydHlOYW1lcyB9IGZyb20gJy4vdXRpbCc7XG5cbi8qKlxuICogQSBydWxlIGNhbiBpbmNsdWRlIGEgUnVsZUNvbmRpdGlvbiBwcm9wZXJ0eSBhbmQgbXVzdCBpbmNsdWRlIGFuIEFzc2VydGlvbnMgcHJvcGVydHkuXG4gKiBGb3IgZWFjaCBydWxlLCB5b3UgY2FuIGRlZmluZSBvbmx5IG9uZSBydWxlIGNvbmRpdGlvbjsgeW91IGNhbiBkZWZpbmUgb25lIG9yIG1vcmUgYXNzZXJ0cyB3aXRoaW4gdGhlIEFzc2VydGlvbnMgcHJvcGVydHkuXG4gKiBZb3UgZGVmaW5lIGEgcnVsZSBjb25kaXRpb24gYW5kIGFzc2VydGlvbnMgYnkgdXNpbmcgcnVsZS1zcGVjaWZpYyBpbnRyaW5zaWMgZnVuY3Rpb25zLlxuICpcbiAqIFlvdSBjYW4gdXNlIHRoZSBmb2xsb3dpbmcgcnVsZS1zcGVjaWZpYyBpbnRyaW5zaWMgZnVuY3Rpb25zIHRvIGRlZmluZSBydWxlIGNvbmRpdGlvbnMgYW5kIGFzc2VydGlvbnM6XG4gKlxuICogIEZuOjpBbmRcbiAqICBGbjo6Q29udGFpbnNcbiAqICBGbjo6RWFjaE1lbWJlckVxdWFsc1xuICogIEZuOjpFYWNoTWVtYmVySW5cbiAqICBGbjo6RXF1YWxzXG4gKiAgRm46OklmXG4gKiAgRm46Ok5vdFxuICogIEZuOjpPclxuICogIEZuOjpSZWZBbGxcbiAqICBGbjo6VmFsdWVPZlxuICogIEZuOjpWYWx1ZU9mQWxsXG4gKlxuICogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3NlcnZpY2VjYXRhbG9nL2xhdGVzdC9hZG1pbmd1aWRlL3JlZmVyZW5jZS10ZW1wbGF0ZV9jb25zdHJhaW50X3J1bGVzLmh0bWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5SdWxlUHJvcHMge1xuICAvKipcbiAgICogSWYgdGhlIHJ1bGUgY29uZGl0aW9uIGV2YWx1YXRlcyB0byBmYWxzZSwgdGhlIHJ1bGUgZG9lc24ndCB0YWtlIGVmZmVjdC5cbiAgICogSWYgdGhlIGZ1bmN0aW9uIGluIHRoZSBydWxlIGNvbmRpdGlvbiBldmFsdWF0ZXMgdG8gdHJ1ZSwgZXhwcmVzc2lvbnMgaW4gZWFjaCBhc3NlcnQgYXJlIGV2YWx1YXRlZCBhbmQgYXBwbGllZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBSdWxlJ3MgYXNzZXJ0aW9ucyB3aWxsIGFsd2F5cyB0YWtlIGVmZmVjdC5cbiAgICovXG4gIHJlYWRvbmx5IHJ1bGVDb25kaXRpb24/OiBJQ2ZuQ29uZGl0aW9uRXhwcmVzc2lvbjtcblxuICAvKipcbiAgICogQXNzZXJ0aW9ucyB3aGljaCBkZWZpbmUgdGhlIHJ1bGUuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gYXNzZXJ0aW9ucyBmb3IgdGhlIHJ1bGUuXG4gICAqL1xuICByZWFkb25seSBhc3NlcnRpb25zPzogQ2ZuUnVsZUFzc2VydGlvbltdO1xufVxuXG4vKipcbiAqIFRoZSBSdWxlcyB0aGF0IGRlZmluZSB0ZW1wbGF0ZSBjb25zdHJhaW50cyBpbiBhbiBBV1MgU2VydmljZSBDYXRhbG9nIHBvcnRmb2xpbyBkZXNjcmliZSB3aGVuXG4gKiBlbmQgdXNlcnMgY2FuIHVzZSB0aGUgdGVtcGxhdGUgYW5kIHdoaWNoIHZhbHVlcyB0aGV5IGNhbiBzcGVjaWZ5IGZvciBwYXJhbWV0ZXJzIHRoYXQgYXJlIGRlY2xhcmVkXG4gKiBpbiB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHRlbXBsYXRlIHVzZWQgdG8gY3JlYXRlIHRoZSBwcm9kdWN0IHRoZXkgYXJlIGF0dGVtcHRpbmcgdG8gdXNlLiBSdWxlc1xuICogYXJlIHVzZWZ1bCBmb3IgcHJldmVudGluZyBlbmQgdXNlcnMgZnJvbSBpbmFkdmVydGVudGx5IHNwZWNpZnlpbmcgYW4gaW5jb3JyZWN0IHZhbHVlLlxuICogRm9yIGV4YW1wbGUsIHlvdSBjYW4gYWRkIGEgcnVsZSB0byB2ZXJpZnkgd2hldGhlciBlbmQgdXNlcnMgc3BlY2lmaWVkIGEgdmFsaWQgc3VibmV0IGluIGFcbiAqIGdpdmVuIFZQQyBvciB1c2VkIG0xLnNtYWxsIGluc3RhbmNlIHR5cGVzIGZvciB0ZXN0IGVudmlyb25tZW50cy4gQVdTIENsb3VkRm9ybWF0aW9uIHVzZXNcbiAqIHJ1bGVzIHRvIHZhbGlkYXRlIHBhcmFtZXRlciB2YWx1ZXMgYmVmb3JlIGl0IGNyZWF0ZXMgdGhlIHJlc291cmNlcyBmb3IgdGhlIHByb2R1Y3QuXG4gKlxuICogQSBydWxlIGNhbiBpbmNsdWRlIGEgUnVsZUNvbmRpdGlvbiBwcm9wZXJ0eSBhbmQgbXVzdCBpbmNsdWRlIGFuIEFzc2VydGlvbnMgcHJvcGVydHkuXG4gKiBGb3IgZWFjaCBydWxlLCB5b3UgY2FuIGRlZmluZSBvbmx5IG9uZSBydWxlIGNvbmRpdGlvbjsgeW91IGNhbiBkZWZpbmUgb25lIG9yIG1vcmUgYXNzZXJ0cyB3aXRoaW4gdGhlIEFzc2VydGlvbnMgcHJvcGVydHkuXG4gKiBZb3UgZGVmaW5lIGEgcnVsZSBjb25kaXRpb24gYW5kIGFzc2VydGlvbnMgYnkgdXNpbmcgcnVsZS1zcGVjaWZpYyBpbnRyaW5zaWMgZnVuY3Rpb25zLlxuICpcbiAqIEBsaW5rIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9zZXJ2aWNlY2F0YWxvZy9sYXRlc3QvYWRtaW5ndWlkZS9yZWZlcmVuY2UtdGVtcGxhdGVfY29uc3RyYWludF9ydWxlcy5odG1sXG4gKi9cbmV4cG9ydCBjbGFzcyBDZm5SdWxlIGV4dGVuZHMgQ2ZuUmVmRWxlbWVudCB7XG4gIHByaXZhdGUgcnVsZUNvbmRpdGlvbj86IElDZm5Db25kaXRpb25FeHByZXNzaW9uO1xuICBwcml2YXRlIGFzc2VydGlvbnM/OiBDZm5SdWxlQXNzZXJ0aW9uW107XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW5kIGFkZHMgYSBydWxlLlxuICAgKiBAcGFyYW0gc2NvcGUgVGhlIHBhcmVudCBjb25zdHJ1Y3QuXG4gICAqIEBwYXJhbSBwcm9wcyBUaGUgcnVsZSBwcm9wcy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogQ2ZuUnVsZVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIHRoaXMucnVsZUNvbmRpdGlvbiA9IHByb3BzICYmIHByb3BzLnJ1bGVDb25kaXRpb247XG4gICAgdGhpcy5hc3NlcnRpb25zID0gcHJvcHMgJiYgcHJvcHMuYXNzZXJ0aW9ucztcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGFuIGFzc2VydGlvbiB0byB0aGUgcnVsZS5cbiAgICogQHBhcmFtIGNvbmRpdGlvbiBUaGUgZXhwcmVzc2lvbiB0byBldmFsdWF0aW9uLlxuICAgKiBAcGFyYW0gZGVzY3JpcHRpb24gVGhlIGRlc2NyaXB0aW9uIG9mIHRoZSBhc3NlcnRpb24uXG4gICAqL1xuICBwdWJsaWMgYWRkQXNzZXJ0aW9uKGNvbmRpdGlvbjogSUNmbkNvbmRpdGlvbkV4cHJlc3Npb24sIGRlc2NyaXB0aW9uOiBzdHJpbmcpIHtcbiAgICBpZiAoIXRoaXMuYXNzZXJ0aW9ucykge1xuICAgICAgdGhpcy5hc3NlcnRpb25zID0gW107XG4gICAgfVxuXG4gICAgdGhpcy5hc3NlcnRpb25zLnB1c2goe1xuICAgICAgYXNzZXJ0OiBjb25kaXRpb24sXG4gICAgICBhc3NlcnREZXNjcmlwdGlvbjogZGVzY3JpcHRpb24sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgX3RvQ2xvdWRGb3JtYXRpb24oKTogb2JqZWN0IHtcbiAgICByZXR1cm4ge1xuICAgICAgUnVsZXM6IHtcbiAgICAgICAgW3RoaXMubG9naWNhbElkXToge1xuICAgICAgICAgIFJ1bGVDb25kaXRpb246IHRoaXMucnVsZUNvbmRpdGlvbixcbiAgICAgICAgICBBc3NlcnRpb25zOiBjYXBpdGFsaXplUHJvcGVydHlOYW1lcyh0aGlzLCB0aGlzLmFzc2VydGlvbnMpLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogQSBydWxlIGFzc2VydGlvbi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5SdWxlQXNzZXJ0aW9uIHtcbiAgLyoqXG4gICAqIFRoZSBhc3NlcnRpb24uXG4gICAqL1xuICByZWFkb25seSBhc3NlcnQ6IElDZm5Db25kaXRpb25FeHByZXNzaW9uO1xuXG4gIC8qKlxuICAgKiBUaGUgYXNzZXJ0aW9uIGRlc2NyaXB0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgYXNzZXJ0RGVzY3JpcHRpb246IHN0cmluZztcbn1cbiJdfQ==