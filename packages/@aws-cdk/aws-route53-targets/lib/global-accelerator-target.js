"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalAcceleratorTarget = exports.GlobalAcceleratorDomainTarget = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
/**
 * Use a Global Accelerator domain name as an alias record target.
 */
class GlobalAcceleratorDomainTarget {
    /**
     * Create an Alias Target for a Global Accelerator domain name.
     */
    constructor(acceleratorDomainName) {
        this.acceleratorDomainName = acceleratorDomainName;
    }
    bind(_record, _zone) {
        return {
            hostedZoneId: GlobalAcceleratorTarget.GLOBAL_ACCELERATOR_ZONE_ID,
            dnsName: this.acceleratorDomainName,
        };
    }
}
exports.GlobalAcceleratorDomainTarget = GlobalAcceleratorDomainTarget;
_a = JSII_RTTI_SYMBOL_1;
GlobalAcceleratorDomainTarget[_a] = { fqn: "@aws-cdk/aws-route53-targets.GlobalAcceleratorDomainTarget", version: "0.0.0" };
/**
 * The hosted zone Id if using an alias record in Route53.
 * This value never changes.
 * Ref: https://docs.aws.amazon.com/general/latest/gr/global_accelerator.html
 */
GlobalAcceleratorDomainTarget.GLOBAL_ACCELERATOR_ZONE_ID = 'Z2BJ6XQ5FK7U4H';
/**
 * Use a Global Accelerator instance domain name as an alias record target.
 */
class GlobalAcceleratorTarget extends GlobalAcceleratorDomainTarget {
    /**
     * Create an Alias Target for a Global Accelerator instance.
     */
    constructor(accelerator) {
        super(accelerator.dnsName);
    }
}
exports.GlobalAcceleratorTarget = GlobalAcceleratorTarget;
_b = JSII_RTTI_SYMBOL_1;
GlobalAcceleratorTarget[_b] = { fqn: "@aws-cdk/aws-route53-targets.GlobalAcceleratorTarget", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYmFsLWFjY2VsZXJhdG9yLXRhcmdldC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdsb2JhbC1hY2NlbGVyYXRvci10YXJnZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFJQTs7R0FFRztBQUNILE1BQWEsNkJBQTZCO0lBUXhDOztPQUVHO0lBQ0gsWUFBNkIscUJBQTZCO1FBQTdCLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBUTtLQUN6RDtJQUVELElBQUksQ0FBQyxPQUEyQixFQUFFLEtBQTJCO1FBQzNELE9BQU87WUFDTCxZQUFZLEVBQUUsdUJBQXVCLENBQUMsMEJBQTBCO1lBQ2hFLE9BQU8sRUFBRSxJQUFJLENBQUMscUJBQXFCO1NBQ3BDLENBQUM7S0FDSDs7QUFuQkgsc0VBb0JDOzs7QUFuQkM7Ozs7R0FJRztBQUNvQix3REFBMEIsR0FBRyxnQkFBZ0IsQ0FBQztBQWdCdkU7O0dBRUc7QUFDSCxNQUFhLHVCQUF3QixTQUFRLDZCQUE2QjtJQUV4RTs7T0FFRztJQUNILFlBQVksV0FBMkM7UUFDckQsS0FBSyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUM1Qjs7QUFQSCwwREFRQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGdsb2JhbGFjY2VsZXJhdG9yIGZyb20gJ0Bhd3MtY2RrL2F3cy1nbG9iYWxhY2NlbGVyYXRvcic7XG5pbXBvcnQgKiBhcyByb3V0ZTUzIGZyb20gJ0Bhd3MtY2RrL2F3cy1yb3V0ZTUzJztcblxuXG4vKipcbiAqIFVzZSBhIEdsb2JhbCBBY2NlbGVyYXRvciBkb21haW4gbmFtZSBhcyBhbiBhbGlhcyByZWNvcmQgdGFyZ2V0LlxuICovXG5leHBvcnQgY2xhc3MgR2xvYmFsQWNjZWxlcmF0b3JEb21haW5UYXJnZXQgaW1wbGVtZW50cyByb3V0ZTUzLklBbGlhc1JlY29yZFRhcmdldCB7XG4gIC8qKlxuICAgKiBUaGUgaG9zdGVkIHpvbmUgSWQgaWYgdXNpbmcgYW4gYWxpYXMgcmVjb3JkIGluIFJvdXRlNTMuXG4gICAqIFRoaXMgdmFsdWUgbmV2ZXIgY2hhbmdlcy5cbiAgICogUmVmOiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vZ2VuZXJhbC9sYXRlc3QvZ3IvZ2xvYmFsX2FjY2VsZXJhdG9yLmh0bWxcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgR0xPQkFMX0FDQ0VMRVJBVE9SX1pPTkVfSUQgPSAnWjJCSjZYUTVGSzdVNEgnO1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW4gQWxpYXMgVGFyZ2V0IGZvciBhIEdsb2JhbCBBY2NlbGVyYXRvciBkb21haW4gbmFtZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgYWNjZWxlcmF0b3JEb21haW5OYW1lOiBzdHJpbmcpIHtcbiAgfVxuXG4gIGJpbmQoX3JlY29yZDogcm91dGU1My5JUmVjb3JkU2V0LCBfem9uZT86IHJvdXRlNTMuSUhvc3RlZFpvbmUpOiByb3V0ZTUzLkFsaWFzUmVjb3JkVGFyZ2V0Q29uZmlnIHtcbiAgICByZXR1cm4ge1xuICAgICAgaG9zdGVkWm9uZUlkOiBHbG9iYWxBY2NlbGVyYXRvclRhcmdldC5HTE9CQUxfQUNDRUxFUkFUT1JfWk9ORV9JRCxcbiAgICAgIGRuc05hbWU6IHRoaXMuYWNjZWxlcmF0b3JEb21haW5OYW1lLFxuICAgIH07XG4gIH1cbn1cblxuLyoqXG4gKiBVc2UgYSBHbG9iYWwgQWNjZWxlcmF0b3IgaW5zdGFuY2UgZG9tYWluIG5hbWUgYXMgYW4gYWxpYXMgcmVjb3JkIHRhcmdldC5cbiAqL1xuZXhwb3J0IGNsYXNzIEdsb2JhbEFjY2VsZXJhdG9yVGFyZ2V0IGV4dGVuZHMgR2xvYmFsQWNjZWxlcmF0b3JEb21haW5UYXJnZXQge1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW4gQWxpYXMgVGFyZ2V0IGZvciBhIEdsb2JhbCBBY2NlbGVyYXRvciBpbnN0YW5jZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGFjY2VsZXJhdG9yOiBnbG9iYWxhY2NlbGVyYXRvci5JQWNjZWxlcmF0b3IpIHtcbiAgICBzdXBlcihhY2NlbGVyYXRvci5kbnNOYW1lKTtcbiAgfVxufVxuIl19