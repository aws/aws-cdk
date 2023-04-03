"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationListenerCertificate = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const constructs_1 = require("constructs");
const elasticloadbalancingv2_generated_1 = require("../elasticloadbalancingv2.generated");
/**
 * Add certificates to a listener
 */
class ApplicationListenerCertificate extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_ApplicationListenerCertificateProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, ApplicationListenerCertificate);
            }
            throw error;
        }
        if (!props.certificateArns && !props.certificates) {
            throw new Error('At least one of \'certificateArns\' or \'certificates\' is required');
        }
        const certificates = [
            ...(props.certificates || []).map(c => ({ certificateArn: c.certificateArn })),
            ...(props.certificateArns || []).map(certificateArn => ({ certificateArn })),
        ];
        new elasticloadbalancingv2_generated_1.CfnListenerCertificate(this, 'Resource', {
            listenerArn: props.listener.listenerArn,
            certificates,
        });
    }
}
exports.ApplicationListenerCertificate = ApplicationListenerCertificate;
_a = JSII_RTTI_SYMBOL_1;
ApplicationListenerCertificate[_a] = { fqn: "@aws-cdk/aws-elasticloadbalancingv2.ApplicationListenerCertificate", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb24tbGlzdGVuZXItY2VydGlmaWNhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcHBsaWNhdGlvbi1saXN0ZW5lci1jZXJ0aWZpY2F0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSwyQ0FBdUM7QUFFdkMsMEZBQTZFO0FBZ0M3RTs7R0FFRztBQUNILE1BQWEsOEJBQStCLFNBQVEsc0JBQVM7SUFDM0QsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUEwQztRQUNsRixLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7K0NBRlIsOEJBQThCOzs7O1FBSXZDLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRTtZQUNqRCxNQUFNLElBQUksS0FBSyxDQUFDLHFFQUFxRSxDQUFDLENBQUM7U0FDeEY7UUFFRCxNQUFNLFlBQVksR0FBRztZQUNuQixHQUFHLENBQUMsS0FBSyxDQUFDLFlBQVksSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO1lBQzlFLEdBQUcsQ0FBQyxLQUFLLENBQUMsZUFBZSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDO1NBQzdFLENBQUM7UUFFRixJQUFJLHlEQUFzQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDM0MsV0FBVyxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsV0FBVztZQUN2QyxZQUFZO1NBQ2IsQ0FBQyxDQUFDO0tBQ0o7O0FBakJILHdFQWtCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgSUFwcGxpY2F0aW9uTGlzdGVuZXIgfSBmcm9tICcuL2FwcGxpY2F0aW9uLWxpc3RlbmVyJztcbmltcG9ydCB7IENmbkxpc3RlbmVyQ2VydGlmaWNhdGUgfSBmcm9tICcuLi9lbGFzdGljbG9hZGJhbGFuY2luZ3YyLmdlbmVyYXRlZCc7XG5pbXBvcnQgeyBJTGlzdGVuZXJDZXJ0aWZpY2F0ZSB9IGZyb20gJy4uL3NoYXJlZC9saXN0ZW5lci1jZXJ0aWZpY2F0ZSc7XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgYWRkaW5nIGEgc2V0IG9mIGNlcnRpZmljYXRlcyB0byBhIGxpc3RlbmVyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXBwbGljYXRpb25MaXN0ZW5lckNlcnRpZmljYXRlUHJvcHMge1xuICAvKipcbiAgICogVGhlIGxpc3RlbmVyIHRvIGF0dGFjaCB0aGUgcnVsZSB0b1xuICAgKi9cbiAgcmVhZG9ubHkgbGlzdGVuZXI6IElBcHBsaWNhdGlvbkxpc3RlbmVyO1xuXG4gIC8qKlxuICAgKiBBUk5zIG9mIGNlcnRpZmljYXRlcyB0byBhdHRhY2hcbiAgICpcbiAgICogRHVwbGljYXRlcyBhcmUgbm90IGFsbG93ZWQuXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgY2VydGlmaWNhdGVzYCBpbnN0ZWFkLlxuICAgKiBAZGVmYXVsdCAtIE9uZSBvZiAnY2VydGlmaWNhdGVzJyBhbmQgJ2NlcnRpZmljYXRlQXJucycgaXMgcmVxdWlyZWQuXG4gICAqL1xuICByZWFkb25seSBjZXJ0aWZpY2F0ZUFybnM/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogQ2VydGlmaWNhdGVzIHRvIGF0dGFjaFxuICAgKlxuICAgKiBEdXBsaWNhdGVzIGFyZSBub3QgYWxsb3dlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBPbmUgb2YgJ2NlcnRpZmljYXRlcycgYW5kICdjZXJ0aWZpY2F0ZUFybnMnIGlzIHJlcXVpcmVkLlxuICAgKi9cbiAgcmVhZG9ubHkgY2VydGlmaWNhdGVzPzogSUxpc3RlbmVyQ2VydGlmaWNhdGVbXTtcbn1cblxuLyoqXG4gKiBBZGQgY2VydGlmaWNhdGVzIHRvIGEgbGlzdGVuZXJcbiAqL1xuZXhwb3J0IGNsYXNzIEFwcGxpY2F0aW9uTGlzdGVuZXJDZXJ0aWZpY2F0ZSBleHRlbmRzIENvbnN0cnVjdCB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBBcHBsaWNhdGlvbkxpc3RlbmVyQ2VydGlmaWNhdGVQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBpZiAoIXByb3BzLmNlcnRpZmljYXRlQXJucyAmJiAhcHJvcHMuY2VydGlmaWNhdGVzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0F0IGxlYXN0IG9uZSBvZiBcXCdjZXJ0aWZpY2F0ZUFybnNcXCcgb3IgXFwnY2VydGlmaWNhdGVzXFwnIGlzIHJlcXVpcmVkJyk7XG4gICAgfVxuXG4gICAgY29uc3QgY2VydGlmaWNhdGVzID0gW1xuICAgICAgLi4uKHByb3BzLmNlcnRpZmljYXRlcyB8fCBbXSkubWFwKGMgPT4gKHsgY2VydGlmaWNhdGVBcm46IGMuY2VydGlmaWNhdGVBcm4gfSkpLFxuICAgICAgLi4uKHByb3BzLmNlcnRpZmljYXRlQXJucyB8fCBbXSkubWFwKGNlcnRpZmljYXRlQXJuID0+ICh7IGNlcnRpZmljYXRlQXJuIH0pKSxcbiAgICBdO1xuXG4gICAgbmV3IENmbkxpc3RlbmVyQ2VydGlmaWNhdGUodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgbGlzdGVuZXJBcm46IHByb3BzLmxpc3RlbmVyLmxpc3RlbmVyQXJuLFxuICAgICAgY2VydGlmaWNhdGVzLFxuICAgIH0pO1xuICB9XG59XG4iXX0=