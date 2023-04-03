"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadBalancerTarget = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
/**
 * Use an ELBv2 as an alias record target
 */
class LoadBalancerTarget {
    constructor(loadBalancer) {
        this.loadBalancer = loadBalancer;
    }
    bind(_record, _zone) {
        return {
            hostedZoneId: this.loadBalancer.loadBalancerCanonicalHostedZoneId,
            dnsName: `dualstack.${this.loadBalancer.loadBalancerDnsName}`,
        };
    }
}
exports.LoadBalancerTarget = LoadBalancerTarget;
_a = JSII_RTTI_SYMBOL_1;
LoadBalancerTarget[_a] = { fqn: "@aws-cdk/aws-route53-targets.LoadBalancerTarget", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZC1iYWxhbmNlci10YXJnZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsb2FkLWJhbGFuY2VyLXRhcmdldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUdBOztHQUVHO0FBQ0gsTUFBYSxrQkFBa0I7SUFDN0IsWUFBNkIsWUFBbUM7UUFBbkMsaUJBQVksR0FBWixZQUFZLENBQXVCO0tBQy9EO0lBRU0sSUFBSSxDQUFDLE9BQTJCLEVBQUUsS0FBMkI7UUFDbEUsT0FBTztZQUNMLFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLGlDQUFpQztZQUNqRSxPQUFPLEVBQUUsYUFBYSxJQUFJLENBQUMsWUFBWSxDQUFDLG1CQUFtQixFQUFFO1NBQzlELENBQUM7S0FDSDs7QUFUSCxnREFVQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGVsYnYyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lbGFzdGljbG9hZGJhbGFuY2luZ3YyJztcbmltcG9ydCAqIGFzIHJvdXRlNTMgZnJvbSAnQGF3cy1jZGsvYXdzLXJvdXRlNTMnO1xuXG4vKipcbiAqIFVzZSBhbiBFTEJ2MiBhcyBhbiBhbGlhcyByZWNvcmQgdGFyZ2V0XG4gKi9cbmV4cG9ydCBjbGFzcyBMb2FkQmFsYW5jZXJUYXJnZXQgaW1wbGVtZW50cyByb3V0ZTUzLklBbGlhc1JlY29yZFRhcmdldCB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgbG9hZEJhbGFuY2VyOiBlbGJ2Mi5JTG9hZEJhbGFuY2VyVjIpIHtcbiAgfVxuXG4gIHB1YmxpYyBiaW5kKF9yZWNvcmQ6IHJvdXRlNTMuSVJlY29yZFNldCwgX3pvbmU/OiByb3V0ZTUzLklIb3N0ZWRab25lKTogcm91dGU1My5BbGlhc1JlY29yZFRhcmdldENvbmZpZyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhvc3RlZFpvbmVJZDogdGhpcy5sb2FkQmFsYW5jZXIubG9hZEJhbGFuY2VyQ2Fub25pY2FsSG9zdGVkWm9uZUlkLFxuICAgICAgZG5zTmFtZTogYGR1YWxzdGFjay4ke3RoaXMubG9hZEJhbGFuY2VyLmxvYWRCYWxhbmNlckRuc05hbWV9YCxcbiAgICB9O1xuICB9XG59XG4iXX0=