"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadBalancer = exports.LoadBalancerGeneration = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
/**
 * The generations of AWS load balancing solutions.
 */
var LoadBalancerGeneration;
(function (LoadBalancerGeneration) {
    /**
     * The first generation (ELB Classic).
     */
    LoadBalancerGeneration[LoadBalancerGeneration["FIRST"] = 0] = "FIRST";
    /**
     * The second generation (ALB and NLB).
     */
    LoadBalancerGeneration[LoadBalancerGeneration["SECOND"] = 1] = "SECOND";
})(LoadBalancerGeneration = exports.LoadBalancerGeneration || (exports.LoadBalancerGeneration = {}));
/**
 * An interface of an abstract load balancer, as needed by CodeDeploy.
 * Create instances using the static factory methods:
 * `#classic`, `#application` and `#network`.
 */
class LoadBalancer {
    /**
     * Creates a new CodeDeploy load balancer from a Classic ELB Load Balancer.
     *
     * @param loadBalancer a classic ELB Load Balancer
     */
    static classic(loadBalancer) {
        class ClassicLoadBalancer extends LoadBalancer {
            constructor() {
                super(...arguments);
                this.generation = LoadBalancerGeneration.FIRST;
                this.name = loadBalancer.loadBalancerName;
            }
        }
        return new ClassicLoadBalancer();
    }
    /**
     * Creates a new CodeDeploy load balancer from an Application Load Balancer Target Group.
     *
     * @param albTargetGroup an ALB Target Group
     */
    static application(albTargetGroup) {
        class AlbLoadBalancer extends LoadBalancer {
            constructor() {
                super(...arguments);
                this.generation = LoadBalancerGeneration.SECOND;
                this.name = albTargetGroup.targetGroupName;
            }
        }
        return new AlbLoadBalancer();
    }
    /**
     * Creates a new CodeDeploy load balancer from a Network Load Balancer Target Group.
     *
     * @param nlbTargetGroup an NLB Target Group
     */
    static network(nlbTargetGroup) {
        class NlbLoadBalancer extends LoadBalancer {
            constructor() {
                super(...arguments);
                this.generation = LoadBalancerGeneration.SECOND;
                this.name = nlbTargetGroup.targetGroupName;
            }
        }
        return new NlbLoadBalancer();
    }
}
exports.LoadBalancer = LoadBalancer;
_a = JSII_RTTI_SYMBOL_1;
LoadBalancer[_a] = { fqn: "@aws-cdk/aws-codedeploy.LoadBalancer", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZC1iYWxhbmNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxvYWQtYmFsYW5jZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFHQTs7R0FFRztBQUNILElBQVksc0JBVVg7QUFWRCxXQUFZLHNCQUFzQjtJQUNoQzs7T0FFRztJQUNILHFFQUFTLENBQUE7SUFFVDs7T0FFRztJQUNILHVFQUFVLENBQUE7QUFDWixDQUFDLEVBVlcsc0JBQXNCLEdBQXRCLDhCQUFzQixLQUF0Qiw4QkFBc0IsUUFVakM7QUFFRDs7OztHQUlHO0FBQ0gsTUFBc0IsWUFBWTtJQUNoQzs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUE4QjtRQUNsRCxNQUFNLG1CQUFvQixTQUFRLFlBQVk7WUFBOUM7O2dCQUNrQixlQUFVLEdBQUcsc0JBQXNCLENBQUMsS0FBSyxDQUFDO2dCQUMxQyxTQUFJLEdBQUcsWUFBWSxDQUFDLGdCQUFnQixDQUFDO1lBQ3ZELENBQUM7U0FBQTtRQUVELE9BQU8sSUFBSSxtQkFBbUIsRUFBRSxDQUFDO0tBQ2xDO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxXQUFXLENBQUMsY0FBNkM7UUFDckUsTUFBTSxlQUFnQixTQUFRLFlBQVk7WUFBMUM7O2dCQUNrQixlQUFVLEdBQUcsc0JBQXNCLENBQUMsTUFBTSxDQUFDO2dCQUMzQyxTQUFJLEdBQUcsY0FBYyxDQUFDLGVBQWUsQ0FBQztZQUN4RCxDQUFDO1NBQUE7UUFFRCxPQUFPLElBQUksZUFBZSxFQUFFLENBQUM7S0FDOUI7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUF5QztRQUM3RCxNQUFNLGVBQWdCLFNBQVEsWUFBWTtZQUExQzs7Z0JBQ2tCLGVBQVUsR0FBRyxzQkFBc0IsQ0FBQyxNQUFNLENBQUM7Z0JBQzNDLFNBQUksR0FBRyxjQUFjLENBQUMsZUFBZSxDQUFDO1lBQ3hELENBQUM7U0FBQTtRQUVELE9BQU8sSUFBSSxlQUFlLEVBQUUsQ0FBQztLQUM5Qjs7QUF6Q0gsb0NBNkNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZWxiIGZyb20gJ0Bhd3MtY2RrL2F3cy1lbGFzdGljbG9hZGJhbGFuY2luZyc7XG5pbXBvcnQgKiBhcyBlbGJ2MiBmcm9tICdAYXdzLWNkay9hd3MtZWxhc3RpY2xvYWRiYWxhbmNpbmd2Mic7XG5cbi8qKlxuICogVGhlIGdlbmVyYXRpb25zIG9mIEFXUyBsb2FkIGJhbGFuY2luZyBzb2x1dGlvbnMuXG4gKi9cbmV4cG9ydCBlbnVtIExvYWRCYWxhbmNlckdlbmVyYXRpb24ge1xuICAvKipcbiAgICogVGhlIGZpcnN0IGdlbmVyYXRpb24gKEVMQiBDbGFzc2ljKS5cbiAgICovXG4gIEZJUlNUID0gMCxcblxuICAvKipcbiAgICogVGhlIHNlY29uZCBnZW5lcmF0aW9uIChBTEIgYW5kIE5MQikuXG4gICAqL1xuICBTRUNPTkQgPSAxXG59XG5cbi8qKlxuICogQW4gaW50ZXJmYWNlIG9mIGFuIGFic3RyYWN0IGxvYWQgYmFsYW5jZXIsIGFzIG5lZWRlZCBieSBDb2RlRGVwbG95LlxuICogQ3JlYXRlIGluc3RhbmNlcyB1c2luZyB0aGUgc3RhdGljIGZhY3RvcnkgbWV0aG9kczpcbiAqIGAjY2xhc3NpY2AsIGAjYXBwbGljYXRpb25gIGFuZCBgI25ldHdvcmtgLlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTG9hZEJhbGFuY2VyIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgQ29kZURlcGxveSBsb2FkIGJhbGFuY2VyIGZyb20gYSBDbGFzc2ljIEVMQiBMb2FkIEJhbGFuY2VyLlxuICAgKlxuICAgKiBAcGFyYW0gbG9hZEJhbGFuY2VyIGEgY2xhc3NpYyBFTEIgTG9hZCBCYWxhbmNlclxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjbGFzc2ljKGxvYWRCYWxhbmNlcjogZWxiLkxvYWRCYWxhbmNlcik6IExvYWRCYWxhbmNlciB7XG4gICAgY2xhc3MgQ2xhc3NpY0xvYWRCYWxhbmNlciBleHRlbmRzIExvYWRCYWxhbmNlciB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgZ2VuZXJhdGlvbiA9IExvYWRCYWxhbmNlckdlbmVyYXRpb24uRklSU1Q7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgbmFtZSA9IGxvYWRCYWxhbmNlci5sb2FkQmFsYW5jZXJOYW1lO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgQ2xhc3NpY0xvYWRCYWxhbmNlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgQ29kZURlcGxveSBsb2FkIGJhbGFuY2VyIGZyb20gYW4gQXBwbGljYXRpb24gTG9hZCBCYWxhbmNlciBUYXJnZXQgR3JvdXAuXG4gICAqXG4gICAqIEBwYXJhbSBhbGJUYXJnZXRHcm91cCBhbiBBTEIgVGFyZ2V0IEdyb3VwXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFwcGxpY2F0aW9uKGFsYlRhcmdldEdyb3VwOiBlbGJ2Mi5JQXBwbGljYXRpb25UYXJnZXRHcm91cCk6IExvYWRCYWxhbmNlciB7XG4gICAgY2xhc3MgQWxiTG9hZEJhbGFuY2VyIGV4dGVuZHMgTG9hZEJhbGFuY2VyIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBnZW5lcmF0aW9uID0gTG9hZEJhbGFuY2VyR2VuZXJhdGlvbi5TRUNPTkQ7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgbmFtZSA9IGFsYlRhcmdldEdyb3VwLnRhcmdldEdyb3VwTmFtZTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEFsYkxvYWRCYWxhbmNlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgQ29kZURlcGxveSBsb2FkIGJhbGFuY2VyIGZyb20gYSBOZXR3b3JrIExvYWQgQmFsYW5jZXIgVGFyZ2V0IEdyb3VwLlxuICAgKlxuICAgKiBAcGFyYW0gbmxiVGFyZ2V0R3JvdXAgYW4gTkxCIFRhcmdldCBHcm91cFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBuZXR3b3JrKG5sYlRhcmdldEdyb3VwOiBlbGJ2Mi5JTmV0d29ya1RhcmdldEdyb3VwKTogTG9hZEJhbGFuY2VyIHtcbiAgICBjbGFzcyBObGJMb2FkQmFsYW5jZXIgZXh0ZW5kcyBMb2FkQmFsYW5jZXIge1xuICAgICAgcHVibGljIHJlYWRvbmx5IGdlbmVyYXRpb24gPSBMb2FkQmFsYW5jZXJHZW5lcmF0aW9uLlNFQ09ORDtcbiAgICAgIHB1YmxpYyByZWFkb25seSBuYW1lID0gbmxiVGFyZ2V0R3JvdXAudGFyZ2V0R3JvdXBOYW1lO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgTmxiTG9hZEJhbGFuY2VyKCk7XG4gIH1cblxuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgZ2VuZXJhdGlvbjogTG9hZEJhbGFuY2VyR2VuZXJhdGlvbjtcbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IG5hbWU6IHN0cmluZztcbn1cbiJdfQ==