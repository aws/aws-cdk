"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGateway = exports.ApiGatewayDomain = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
/**
 * Defines an API Gateway domain name as the alias target.
 *
 * Use the `ApiGateway` class if you wish to map the alias to an REST API with a
 * domain name defined through the `RestApiProps.domainName` prop.
 */
class ApiGatewayDomain {
    constructor(domainName) {
        this.domainName = domainName;
    }
    bind(_record, _zone) {
        return {
            dnsName: this.domainName.domainNameAliasDomainName,
            hostedZoneId: this.domainName.domainNameAliasHostedZoneId,
        };
    }
}
exports.ApiGatewayDomain = ApiGatewayDomain;
_a = JSII_RTTI_SYMBOL_1;
ApiGatewayDomain[_a] = { fqn: "@aws-cdk/aws-route53-targets.ApiGatewayDomain", version: "0.0.0" };
/**
 * Defines an API Gateway REST API as the alias target. Requires that the domain
 * name will be defined through `RestApiProps.domainName`.
 *
 * You can direct the alias to any `apigateway.DomainName` resource through the
 * `ApiGatewayDomain` class.
 */
class ApiGateway extends ApiGatewayDomain {
    constructor(api) {
        if (!api.domainName) {
            throw new Error('API does not define a default domain name');
        }
        super(api.domainName);
    }
}
exports.ApiGateway = ApiGateway;
_b = JSII_RTTI_SYMBOL_1;
ApiGateway[_b] = { fqn: "@aws-cdk/aws-route53-targets.ApiGateway", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLWdhdGV3YXktZG9tYWluLW5hbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcGktZ2F0ZXdheS1kb21haW4tbmFtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUdBOzs7OztHQUtHO0FBQ0gsTUFBYSxnQkFBZ0I7SUFDM0IsWUFBNkIsVUFBNEI7UUFBNUIsZUFBVSxHQUFWLFVBQVUsQ0FBa0I7S0FBSztJQUV2RCxJQUFJLENBQUMsT0FBMkIsRUFBRSxLQUEyQjtRQUNsRSxPQUFPO1lBQ0wsT0FBTyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMseUJBQXlCO1lBQ2xELFlBQVksRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLDJCQUEyQjtTQUMxRCxDQUFDO0tBQ0g7O0FBUkgsNENBU0M7OztBQUVEOzs7Ozs7R0FNRztBQUNILE1BQWEsVUFBVyxTQUFRLGdCQUFnQjtJQUM5QyxZQUFZLEdBQXFCO1FBQy9CLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFO1lBQ25CLE1BQU0sSUFBSSxLQUFLLENBQUMsMkNBQTJDLENBQUMsQ0FBQztTQUM5RDtRQUVELEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDdkI7O0FBUEgsZ0NBUUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBhcGlnIGZyb20gJ0Bhd3MtY2RrL2F3cy1hcGlnYXRld2F5JztcbmltcG9ydCAqIGFzIHJvdXRlNTMgZnJvbSAnQGF3cy1jZGsvYXdzLXJvdXRlNTMnO1xuXG4vKipcbiAqIERlZmluZXMgYW4gQVBJIEdhdGV3YXkgZG9tYWluIG5hbWUgYXMgdGhlIGFsaWFzIHRhcmdldC5cbiAqXG4gKiBVc2UgdGhlIGBBcGlHYXRld2F5YCBjbGFzcyBpZiB5b3Ugd2lzaCB0byBtYXAgdGhlIGFsaWFzIHRvIGFuIFJFU1QgQVBJIHdpdGggYVxuICogZG9tYWluIG5hbWUgZGVmaW5lZCB0aHJvdWdoIHRoZSBgUmVzdEFwaVByb3BzLmRvbWFpbk5hbWVgIHByb3AuXG4gKi9cbmV4cG9ydCBjbGFzcyBBcGlHYXRld2F5RG9tYWluIGltcGxlbWVudHMgcm91dGU1My5JQWxpYXNSZWNvcmRUYXJnZXQge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGRvbWFpbk5hbWU6IGFwaWcuSURvbWFpbk5hbWUpIHsgfVxuXG4gIHB1YmxpYyBiaW5kKF9yZWNvcmQ6IHJvdXRlNTMuSVJlY29yZFNldCwgX3pvbmU/OiByb3V0ZTUzLklIb3N0ZWRab25lKTogcm91dGU1My5BbGlhc1JlY29yZFRhcmdldENvbmZpZyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRuc05hbWU6IHRoaXMuZG9tYWluTmFtZS5kb21haW5OYW1lQWxpYXNEb21haW5OYW1lLFxuICAgICAgaG9zdGVkWm9uZUlkOiB0aGlzLmRvbWFpbk5hbWUuZG9tYWluTmFtZUFsaWFzSG9zdGVkWm9uZUlkLFxuICAgIH07XG4gIH1cbn1cblxuLyoqXG4gKiBEZWZpbmVzIGFuIEFQSSBHYXRld2F5IFJFU1QgQVBJIGFzIHRoZSBhbGlhcyB0YXJnZXQuIFJlcXVpcmVzIHRoYXQgdGhlIGRvbWFpblxuICogbmFtZSB3aWxsIGJlIGRlZmluZWQgdGhyb3VnaCBgUmVzdEFwaVByb3BzLmRvbWFpbk5hbWVgLlxuICpcbiAqIFlvdSBjYW4gZGlyZWN0IHRoZSBhbGlhcyB0byBhbnkgYGFwaWdhdGV3YXkuRG9tYWluTmFtZWAgcmVzb3VyY2UgdGhyb3VnaCB0aGVcbiAqIGBBcGlHYXRld2F5RG9tYWluYCBjbGFzcy5cbiAqL1xuZXhwb3J0IGNsYXNzIEFwaUdhdGV3YXkgZXh0ZW5kcyBBcGlHYXRld2F5RG9tYWluIHtcbiAgY29uc3RydWN0b3IoYXBpOiBhcGlnLlJlc3RBcGlCYXNlKSB7XG4gICAgaWYgKCFhcGkuZG9tYWluTmFtZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBUEkgZG9lcyBub3QgZGVmaW5lIGEgZGVmYXVsdCBkb21haW4gbmFtZScpO1xuICAgIH1cblxuICAgIHN1cGVyKGFwaS5kb21haW5OYW1lKTtcbiAgfVxufVxuIl19