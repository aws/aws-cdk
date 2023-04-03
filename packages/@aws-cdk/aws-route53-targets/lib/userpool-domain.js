"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPoolDomainTarget = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cloudfront_target_1 = require("./cloudfront-target");
/**
 * Use a user pool domain as an alias record target
 */
class UserPoolDomainTarget {
    constructor(domain) {
        this.domain = domain;
    }
    bind(_record, _zone) {
        return {
            dnsName: this.domain.cloudFrontDomainName,
            hostedZoneId: cloudfront_target_1.CloudFrontTarget.getHostedZoneId(this.domain),
        };
    }
}
exports.UserPoolDomainTarget = UserPoolDomainTarget;
_a = JSII_RTTI_SYMBOL_1;
UserPoolDomainTarget[_a] = { fqn: "@aws-cdk/aws-route53-targets.UserPoolDomainTarget", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcnBvb2wtZG9tYWluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlcnBvb2wtZG9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBRUEsMkRBQXVEO0FBRXZEOztHQUVHO0FBQ0gsTUFBYSxvQkFBb0I7SUFDL0IsWUFBNkIsTUFBc0I7UUFBdEIsV0FBTSxHQUFOLE1BQU0sQ0FBZ0I7S0FDbEQ7SUFFTSxJQUFJLENBQUMsT0FBbUIsRUFBRSxLQUFtQjtRQUNsRCxPQUFPO1lBQ0wsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsb0JBQW9CO1lBQ3pDLFlBQVksRUFBRSxvQ0FBZ0IsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztTQUM1RCxDQUFDO0tBQ0g7O0FBVEgsb0RBVUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBVc2VyUG9vbERvbWFpbiB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2duaXRvJztcbmltcG9ydCB7IEFsaWFzUmVjb3JkVGFyZ2V0Q29uZmlnLCBJQWxpYXNSZWNvcmRUYXJnZXQsIElIb3N0ZWRab25lLCBJUmVjb3JkU2V0IH0gZnJvbSAnQGF3cy1jZGsvYXdzLXJvdXRlNTMnO1xuaW1wb3J0IHsgQ2xvdWRGcm9udFRhcmdldCB9IGZyb20gJy4vY2xvdWRmcm9udC10YXJnZXQnO1xuXG4vKipcbiAqIFVzZSBhIHVzZXIgcG9vbCBkb21haW4gYXMgYW4gYWxpYXMgcmVjb3JkIHRhcmdldFxuICovXG5leHBvcnQgY2xhc3MgVXNlclBvb2xEb21haW5UYXJnZXQgaW1wbGVtZW50cyBJQWxpYXNSZWNvcmRUYXJnZXQge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGRvbWFpbjogVXNlclBvb2xEb21haW4pIHtcbiAgfVxuXG4gIHB1YmxpYyBiaW5kKF9yZWNvcmQ6IElSZWNvcmRTZXQsIF96b25lPzogSUhvc3RlZFpvbmUpOiBBbGlhc1JlY29yZFRhcmdldENvbmZpZyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRuc05hbWU6IHRoaXMuZG9tYWluLmNsb3VkRnJvbnREb21haW5OYW1lLFxuICAgICAgaG9zdGVkWm9uZUlkOiBDbG91ZEZyb250VGFyZ2V0LmdldEhvc3RlZFpvbmVJZCh0aGlzLmRvbWFpbiksXG4gICAgfTtcbiAgfVxufVxuIl19