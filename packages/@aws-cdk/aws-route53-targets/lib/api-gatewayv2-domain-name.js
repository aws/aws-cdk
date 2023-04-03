"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGatewayv2DomainProperties = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
/**
 * Defines an API Gateway V2 domain name as the alias target.
 */
class ApiGatewayv2DomainProperties {
    /**
     * @param regionalDomainName the domain name associated with the regional endpoint for this custom domain name.
     * @param regionalHostedZoneId the region-specific Amazon Route 53 Hosted Zone ID of the regional endpoint.
     */
    constructor(regionalDomainName, regionalHostedZoneId) {
        this.regionalDomainName = regionalDomainName;
        this.regionalHostedZoneId = regionalHostedZoneId;
    }
    bind(_record, _zone) {
        return {
            dnsName: this.regionalDomainName,
            hostedZoneId: this.regionalHostedZoneId,
        };
    }
}
exports.ApiGatewayv2DomainProperties = ApiGatewayv2DomainProperties;
_a = JSII_RTTI_SYMBOL_1;
ApiGatewayv2DomainProperties[_a] = { fqn: "@aws-cdk/aws-route53-targets.ApiGatewayv2DomainProperties", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLWdhdGV3YXl2Mi1kb21haW4tbmFtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwaS1nYXRld2F5djItZG9tYWluLW5hbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFFQTs7R0FFRztBQUNILE1BQWEsNEJBQTRCO0lBQ3ZDOzs7T0FHRztJQUNILFlBQTZCLGtCQUEwQixFQUFtQixvQkFBNEI7UUFBekUsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFRO1FBQW1CLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBUTtLQUFLO0lBRXBHLElBQUksQ0FBQyxPQUEyQixFQUFFLEtBQTJCO1FBQ2xFLE9BQU87WUFDTCxPQUFPLEVBQUUsSUFBSSxDQUFDLGtCQUFrQjtZQUNoQyxZQUFZLEVBQUUsSUFBSSxDQUFDLG9CQUFvQjtTQUN4QyxDQUFDO0tBQ0g7O0FBWkgsb0VBYUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyByb3V0ZTUzIGZyb20gJ0Bhd3MtY2RrL2F3cy1yb3V0ZTUzJztcblxuLyoqXG4gKiBEZWZpbmVzIGFuIEFQSSBHYXRld2F5IFYyIGRvbWFpbiBuYW1lIGFzIHRoZSBhbGlhcyB0YXJnZXQuXG4gKi9cbmV4cG9ydCBjbGFzcyBBcGlHYXRld2F5djJEb21haW5Qcm9wZXJ0aWVzIGltcGxlbWVudHMgcm91dGU1My5JQWxpYXNSZWNvcmRUYXJnZXQge1xuICAvKipcbiAgICogQHBhcmFtIHJlZ2lvbmFsRG9tYWluTmFtZSB0aGUgZG9tYWluIG5hbWUgYXNzb2NpYXRlZCB3aXRoIHRoZSByZWdpb25hbCBlbmRwb2ludCBmb3IgdGhpcyBjdXN0b20gZG9tYWluIG5hbWUuXG4gICAqIEBwYXJhbSByZWdpb25hbEhvc3RlZFpvbmVJZCB0aGUgcmVnaW9uLXNwZWNpZmljIEFtYXpvbiBSb3V0ZSA1MyBIb3N0ZWQgWm9uZSBJRCBvZiB0aGUgcmVnaW9uYWwgZW5kcG9pbnQuXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHJlZ2lvbmFsRG9tYWluTmFtZTogc3RyaW5nLCBwcml2YXRlIHJlYWRvbmx5IHJlZ2lvbmFsSG9zdGVkWm9uZUlkOiBzdHJpbmcpIHsgfVxuXG4gIHB1YmxpYyBiaW5kKF9yZWNvcmQ6IHJvdXRlNTMuSVJlY29yZFNldCwgX3pvbmU/OiByb3V0ZTUzLklIb3N0ZWRab25lKTogcm91dGU1My5BbGlhc1JlY29yZFRhcmdldENvbmZpZyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRuc05hbWU6IHRoaXMucmVnaW9uYWxEb21haW5OYW1lLFxuICAgICAgaG9zdGVkWm9uZUlkOiB0aGlzLnJlZ2lvbmFsSG9zdGVkWm9uZUlkLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==