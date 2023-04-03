"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicGalleryAuthorizationToken = exports.AuthorizationToken = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
/**
 * Authorization token to access private ECR repositories in the current environment via Docker CLI.
 *
 * @see https://docs.aws.amazon.com/AmazonECR/latest/userguide/registry_auth.html
 */
class AuthorizationToken {
    constructor() {
    }
    /**
     * Grant access to retrieve an authorization token.
     */
    static grantRead(grantee) {
        grantee.grantPrincipal.addToPrincipalPolicy(new iam.PolicyStatement({
            actions: ['ecr:GetAuthorizationToken'],
            // GetAuthorizationToken only allows '*'. See https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonelasticcontainerregistry.html#amazonelasticcontainerregistry-actions-as-permissions
            resources: ['*'],
        }));
    }
}
exports.AuthorizationToken = AuthorizationToken;
_a = JSII_RTTI_SYMBOL_1;
AuthorizationToken[_a] = { fqn: "@aws-cdk/aws-ecr.AuthorizationToken", version: "0.0.0" };
/**
 * Authorization token to access the global public ECR Gallery via Docker CLI.
 *
 * @see https://docs.aws.amazon.com/AmazonECR/latest/public/public-registries.html#public-registry-auth
 */
class PublicGalleryAuthorizationToken {
    constructor() {
    }
    /**
     * Grant access to retrieve an authorization token.
     */
    static grantRead(grantee) {
        grantee.grantPrincipal.addToPrincipalPolicy(new iam.PolicyStatement({
            actions: ['ecr-public:GetAuthorizationToken', 'sts:GetServiceBearerToken'],
            // GetAuthorizationToken only allows '*'. See https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonelasticcontainerregistry.html#amazonelasticcontainerregistry-actions-as-permissions
            // GetServiceBearerToken only allows '*'. See https://docs.aws.amazon.com/service-authorization/latest/reference/list_awssecuritytokenservice.html#awssecuritytokenservice-actions-as-permissions
            resources: ['*'],
        }));
    }
}
exports.PublicGalleryAuthorizationToken = PublicGalleryAuthorizationToken;
_b = JSII_RTTI_SYMBOL_1;
PublicGalleryAuthorizationToken[_b] = { fqn: "@aws-cdk/aws-ecr.PublicGalleryAuthorizationToken", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC10b2tlbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImF1dGgtdG9rZW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx3Q0FBd0M7QUFFeEM7Ozs7R0FJRztBQUNILE1BQWEsa0JBQWtCO0lBWTdCO0tBQ0M7SUFaRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBdUI7UUFDN0MsT0FBTyxDQUFDLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7WUFDbEUsT0FBTyxFQUFFLENBQUMsMkJBQTJCLENBQUM7WUFDdEMsK01BQStNO1lBQy9NLFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQztTQUNqQixDQUFDLENBQUMsQ0FBQztLQUNMOztBQVZILGdEQWNDOzs7QUFFRDs7OztHQUlHO0FBQ0gsTUFBYSwrQkFBK0I7SUFjMUM7S0FDQztJQWJEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUF1QjtRQUM3QyxPQUFPLENBQUMsY0FBYyxDQUFDLG9CQUFvQixDQUFDLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztZQUNsRSxPQUFPLEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRSwyQkFBMkIsQ0FBQztZQUMxRSwrTUFBK007WUFDL00saU1BQWlNO1lBQ2pNLFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQztTQUNqQixDQUFDLENBQUMsQ0FBQztLQUNMOztBQVpILDBFQWlCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcblxuLyoqXG4gKiBBdXRob3JpemF0aW9uIHRva2VuIHRvIGFjY2VzcyBwcml2YXRlIEVDUiByZXBvc2l0b3JpZXMgaW4gdGhlIGN1cnJlbnQgZW52aXJvbm1lbnQgdmlhIERvY2tlciBDTEkuXG4gKlxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uRUNSL2xhdGVzdC91c2VyZ3VpZGUvcmVnaXN0cnlfYXV0aC5odG1sXG4gKi9cbmV4cG9ydCBjbGFzcyBBdXRob3JpemF0aW9uVG9rZW4ge1xuICAvKipcbiAgICogR3JhbnQgYWNjZXNzIHRvIHJldHJpZXZlIGFuIGF1dGhvcml6YXRpb24gdG9rZW4uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdyYW50UmVhZChncmFudGVlOiBpYW0uSUdyYW50YWJsZSkge1xuICAgIGdyYW50ZWUuZ3JhbnRQcmluY2lwYWwuYWRkVG9QcmluY2lwYWxQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogWydlY3I6R2V0QXV0aG9yaXphdGlvblRva2VuJ10sXG4gICAgICAvLyBHZXRBdXRob3JpemF0aW9uVG9rZW4gb25seSBhbGxvd3MgJyonLiBTZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3NlcnZpY2UtYXV0aG9yaXphdGlvbi9sYXRlc3QvcmVmZXJlbmNlL2xpc3RfYW1hem9uZWxhc3RpY2NvbnRhaW5lcnJlZ2lzdHJ5Lmh0bWwjYW1hem9uZWxhc3RpY2NvbnRhaW5lcnJlZ2lzdHJ5LWFjdGlvbnMtYXMtcGVybWlzc2lvbnNcbiAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgfSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHtcbiAgfVxufVxuXG4vKipcbiAqIEF1dGhvcml6YXRpb24gdG9rZW4gdG8gYWNjZXNzIHRoZSBnbG9iYWwgcHVibGljIEVDUiBHYWxsZXJ5IHZpYSBEb2NrZXIgQ0xJLlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkVDUi9sYXRlc3QvcHVibGljL3B1YmxpYy1yZWdpc3RyaWVzLmh0bWwjcHVibGljLXJlZ2lzdHJ5LWF1dGhcbiAqL1xuZXhwb3J0IGNsYXNzIFB1YmxpY0dhbGxlcnlBdXRob3JpemF0aW9uVG9rZW4ge1xuXG4gIC8qKlxuICAgKiBHcmFudCBhY2Nlc3MgdG8gcmV0cmlldmUgYW4gYXV0aG9yaXphdGlvbiB0b2tlbi5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ3JhbnRSZWFkKGdyYW50ZWU6IGlhbS5JR3JhbnRhYmxlKSB7XG4gICAgZ3JhbnRlZS5ncmFudFByaW5jaXBhbC5hZGRUb1ByaW5jaXBhbFBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbJ2Vjci1wdWJsaWM6R2V0QXV0aG9yaXphdGlvblRva2VuJywgJ3N0czpHZXRTZXJ2aWNlQmVhcmVyVG9rZW4nXSxcbiAgICAgIC8vIEdldEF1dGhvcml6YXRpb25Ub2tlbiBvbmx5IGFsbG93cyAnKicuIFNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vc2VydmljZS1hdXRob3JpemF0aW9uL2xhdGVzdC9yZWZlcmVuY2UvbGlzdF9hbWF6b25lbGFzdGljY29udGFpbmVycmVnaXN0cnkuaHRtbCNhbWF6b25lbGFzdGljY29udGFpbmVycmVnaXN0cnktYWN0aW9ucy1hcy1wZXJtaXNzaW9uc1xuICAgICAgLy8gR2V0U2VydmljZUJlYXJlclRva2VuIG9ubHkgYWxsb3dzICcqJy4gU2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9zZXJ2aWNlLWF1dGhvcml6YXRpb24vbGF0ZXN0L3JlZmVyZW5jZS9saXN0X2F3c3NlY3VyaXR5dG9rZW5zZXJ2aWNlLmh0bWwjYXdzc2VjdXJpdHl0b2tlbnNlcnZpY2UtYWN0aW9ucy1hcy1wZXJtaXNzaW9uc1xuICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICB9KSk7XG4gIH1cblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge1xuICB9XG5cbn1cbiJdfQ==