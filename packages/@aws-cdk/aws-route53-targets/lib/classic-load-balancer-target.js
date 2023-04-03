"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassicLoadBalancerTarget = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
/**
 * Use a classic ELB as an alias record target
 */
class ClassicLoadBalancerTarget {
    constructor(loadBalancer) {
        this.loadBalancer = loadBalancer;
    }
    bind(_record, _zone) {
        return {
            hostedZoneId: this.loadBalancer.loadBalancerCanonicalHostedZoneNameId,
            dnsName: `dualstack.${this.loadBalancer.loadBalancerDnsName}`,
        };
    }
}
exports.ClassicLoadBalancerTarget = ClassicLoadBalancerTarget;
_a = JSII_RTTI_SYMBOL_1;
ClassicLoadBalancerTarget[_a] = { fqn: "@aws-cdk/aws-route53-targets.ClassicLoadBalancerTarget", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xhc3NpYy1sb2FkLWJhbGFuY2VyLXRhcmdldC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNsYXNzaWMtbG9hZC1iYWxhbmNlci10YXJnZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFHQTs7R0FFRztBQUNILE1BQWEseUJBQXlCO0lBQ3BDLFlBQTZCLFlBQThCO1FBQTlCLGlCQUFZLEdBQVosWUFBWSxDQUFrQjtLQUMxRDtJQUVNLElBQUksQ0FBQyxPQUEyQixFQUFFLEtBQTJCO1FBQ2xFLE9BQU87WUFDTCxZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxxQ0FBcUM7WUFDckUsT0FBTyxFQUFFLGFBQWEsSUFBSSxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsRUFBRTtTQUM5RCxDQUFDO0tBQ0g7O0FBVEgsOERBVUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBlbGIgZnJvbSAnQGF3cy1jZGsvYXdzLWVsYXN0aWNsb2FkYmFsYW5jaW5nJztcbmltcG9ydCAqIGFzIHJvdXRlNTMgZnJvbSAnQGF3cy1jZGsvYXdzLXJvdXRlNTMnO1xuXG4vKipcbiAqIFVzZSBhIGNsYXNzaWMgRUxCIGFzIGFuIGFsaWFzIHJlY29yZCB0YXJnZXRcbiAqL1xuZXhwb3J0IGNsYXNzIENsYXNzaWNMb2FkQmFsYW5jZXJUYXJnZXQgaW1wbGVtZW50cyByb3V0ZTUzLklBbGlhc1JlY29yZFRhcmdldCB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgbG9hZEJhbGFuY2VyOiBlbGIuTG9hZEJhbGFuY2VyKSB7XG4gIH1cblxuICBwdWJsaWMgYmluZChfcmVjb3JkOiByb3V0ZTUzLklSZWNvcmRTZXQsIF96b25lPzogcm91dGU1My5JSG9zdGVkWm9uZSk6IHJvdXRlNTMuQWxpYXNSZWNvcmRUYXJnZXRDb25maWcge1xuICAgIHJldHVybiB7XG4gICAgICBob3N0ZWRab25lSWQ6IHRoaXMubG9hZEJhbGFuY2VyLmxvYWRCYWxhbmNlckNhbm9uaWNhbEhvc3RlZFpvbmVOYW1lSWQsXG4gICAgICBkbnNOYW1lOiBgZHVhbHN0YWNrLiR7dGhpcy5sb2FkQmFsYW5jZXIubG9hZEJhbGFuY2VyRG5zTmFtZX1gLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==