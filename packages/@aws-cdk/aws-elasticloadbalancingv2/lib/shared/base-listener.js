"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseListener = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cxschema = require("@aws-cdk/cloud-assembly-schema");
const core_1 = require("@aws-cdk/core");
const util_1 = require("./util");
const elasticloadbalancingv2_generated_1 = require("../elasticloadbalancingv2.generated");
/**
 * Base class for listeners
 */
class BaseListener extends core_1.Resource {
    constructor(scope, id, additionalProps) {
        super(scope, id);
        const resource = new elasticloadbalancingv2_generated_1.CfnListener(this, 'Resource', {
            ...additionalProps,
            defaultActions: core_1.Lazy.any({ produce: () => this.defaultAction?.renderActions() ?? [] }),
        });
        this.listenerArn = resource.ref;
        this.node.addValidation({ validate: () => this.validateListener() });
    }
    /**
     * Queries the load balancer listener context provider for load balancer
     * listener info.
     * @internal
     */
    static _queryContextProvider(scope, options) {
        if (core_1.Token.isUnresolved(options.userOptions.loadBalancerArn)
            || Object.values(options.userOptions.loadBalancerTags ?? {}).some(core_1.Token.isUnresolved)
            || core_1.Token.isUnresolved(options.userOptions.listenerPort)) {
            throw new Error('All arguments to look up a load balancer listener must be concrete (no Tokens)');
        }
        let cxschemaTags;
        if (options.userOptions.loadBalancerTags) {
            cxschemaTags = util_1.mapTagMapToCxschema(options.userOptions.loadBalancerTags);
        }
        const props = core_1.ContextProvider.getValue(scope, {
            provider: cxschema.ContextProvider.LOAD_BALANCER_LISTENER_PROVIDER,
            props: {
                listenerArn: options.listenerArn,
                listenerPort: options.userOptions.listenerPort,
                listenerProtocol: options.listenerProtocol,
                loadBalancerArn: options.userOptions.loadBalancerArn,
                loadBalancerTags: cxschemaTags,
                loadBalancerType: options.loadBalancerType,
            },
            dummyValue: {
                listenerArn: `arn:aws:elasticloadbalancing:us-west-2:123456789012:listener/${options.loadBalancerType}/my-load-balancer/50dc6c495c0c9188/f2f7dc8efc522ab2`,
                listenerPort: 80,
                securityGroupIds: ['sg-123456789012'],
            },
        }).value;
        return props;
    }
    /**
     * Validate this listener
     */
    validateListener() {
        if (!this.defaultAction) {
            return ['Listener needs at least one default action or target group (call addTargetGroups or addAction)'];
        }
        return [];
    }
    /**
     * Configure the default action
     *
     * @internal
     */
    _setDefaultAction(action) {
        // It might make sense to 'throw' here.
        //
        // However, programs may already exist out there which configured an action twice,
        // in which case the second action accidentally overwrite the initial action, and in some
        // way ended up with a program that did what the author intended. If we were to add throw now,
        // the previously working program would be broken.
        //
        // Instead, signal this through a warning.
        // @deprecate: upon the next major version bump, replace this with a `throw`
        if (this.defaultAction) {
            core_1.Annotations.of(this).addWarning('A default Action already existed on this Listener and was replaced. Configure exactly one default Action.');
        }
        this.defaultAction = action;
    }
}
exports.BaseListener = BaseListener;
_a = JSII_RTTI_SYMBOL_1;
BaseListener[_a] = { fqn: "@aws-cdk/aws-elasticloadbalancingv2.BaseListener", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1saXN0ZW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJhc2UtbGlzdGVuZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwyREFBMkQ7QUFDM0Qsd0NBQStGO0FBSS9GLGlDQUE2QztBQUM3QywwRkFBa0U7QUErRGxFOztHQUVHO0FBQ0gsTUFBc0IsWUFBYSxTQUFRLGVBQVE7SUE0Q2pELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsZUFBb0I7UUFDNUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLFFBQVEsR0FBRyxJQUFJLDhDQUFXLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUNqRCxHQUFHLGVBQWU7WUFDbEIsY0FBYyxFQUFFLFdBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQztTQUN2RixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUM7UUFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQ3RFO0lBckREOzs7O09BSUc7SUFDTyxNQUFNLENBQUMscUJBQXFCLENBQUMsS0FBZ0IsRUFBRSxPQUE0QztRQUNuRyxJQUFJLFlBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUM7ZUFDdEQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLGdCQUFnQixJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFLLENBQUMsWUFBWSxDQUFDO2VBQ2xGLFlBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsRUFBRTtZQUN6RCxNQUFNLElBQUksS0FBSyxDQUFDLGdGQUFnRixDQUFDLENBQUM7U0FDbkc7UUFFRCxJQUFJLFlBQXdDLENBQUM7UUFDN0MsSUFBSSxPQUFPLENBQUMsV0FBVyxDQUFDLGdCQUFnQixFQUFFO1lBQ3hDLFlBQVksR0FBRywwQkFBbUIsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUM7U0FDMUU7UUFFRCxNQUFNLEtBQUssR0FBOEMsc0JBQWUsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFO1lBQ3ZGLFFBQVEsRUFBRSxRQUFRLENBQUMsZUFBZSxDQUFDLCtCQUErQjtZQUNsRSxLQUFLLEVBQUU7Z0JBQ0wsV0FBVyxFQUFFLE9BQU8sQ0FBQyxXQUFXO2dCQUNoQyxZQUFZLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxZQUFZO2dCQUM5QyxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsZ0JBQWdCO2dCQUMxQyxlQUFlLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxlQUFlO2dCQUNwRCxnQkFBZ0IsRUFBRSxZQUFZO2dCQUM5QixnQkFBZ0IsRUFBRSxPQUFPLENBQUMsZ0JBQWdCO2FBQ0U7WUFDOUMsVUFBVSxFQUFFO2dCQUNWLFdBQVcsRUFBRSxnRUFBZ0UsT0FBTyxDQUFDLGdCQUFnQixxREFBcUQ7Z0JBQzFKLFlBQVksRUFBRSxFQUFFO2dCQUNoQixnQkFBZ0IsRUFBRSxDQUFDLGlCQUFpQixDQUFDO2FBQ087U0FDL0MsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUVULE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFvQkQ7O09BRUc7SUFDTyxnQkFBZ0I7UUFDeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDdkIsT0FBTyxDQUFDLGdHQUFnRyxDQUFDLENBQUM7U0FDM0c7UUFDRCxPQUFPLEVBQUUsQ0FBQztLQUNYO0lBRUQ7Ozs7T0FJRztJQUNPLGlCQUFpQixDQUFDLE1BQXVCO1FBQ2pELHVDQUF1QztRQUN2QyxFQUFFO1FBQ0Ysa0ZBQWtGO1FBQ2xGLHlGQUF5RjtRQUN6Riw4RkFBOEY7UUFDOUYsa0RBQWtEO1FBQ2xELEVBQUU7UUFDRiwwQ0FBMEM7UUFDMUMsNEVBQTRFO1FBQzVFLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUN0QixrQkFBVyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsMkdBQTJHLENBQUMsQ0FBQztTQUM5STtRQUVELElBQUksQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDO0tBQzdCOztBQXRGSCxvQ0F1RkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjeHNjaGVtYSBmcm9tICdAYXdzLWNkay9jbG91ZC1hc3NlbWJseS1zY2hlbWEnO1xuaW1wb3J0IHsgQW5ub3RhdGlvbnMsIENvbnRleHRQcm92aWRlciwgSVJlc291cmNlLCBMYXp5LCBSZXNvdXJjZSwgVG9rZW4gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGN4YXBpIGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IElMaXN0ZW5lckFjdGlvbiB9IGZyb20gJy4vbGlzdGVuZXItYWN0aW9uJztcbmltcG9ydCB7IG1hcFRhZ01hcFRvQ3hzY2hlbWEgfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHsgQ2ZuTGlzdGVuZXIgfSBmcm9tICcuLi9lbGFzdGljbG9hZGJhbGFuY2luZ3YyLmdlbmVyYXRlZCc7XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgbGlzdGVuZXIgbG9va3VwXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQmFzZUxpc3RlbmVyTG9va3VwT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBGaWx0ZXIgbGlzdGVuZXJzIGJ5IGFzc29jaWF0ZWQgbG9hZCBiYWxhbmNlciBhcm5cbiAgICogQGRlZmF1bHQgLSBkb2VzIG5vdCBmaWx0ZXIgYnkgbG9hZCBiYWxhbmNlciBhcm5cbiAgICovXG4gIHJlYWRvbmx5IGxvYWRCYWxhbmNlckFybj86IHN0cmluZztcblxuICAvKipcbiAgICogRmlsdGVyIGxpc3RlbmVycyBieSBhc3NvY2lhdGVkIGxvYWQgYmFsYW5jZXIgdGFnc1xuICAgKiBAZGVmYXVsdCAtIGRvZXMgbm90IGZpbHRlciBieSBsb2FkIGJhbGFuY2VyIHRhZ3NcbiAgICovXG4gIHJlYWRvbmx5IGxvYWRCYWxhbmNlclRhZ3M/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuXG4gIC8qKlxuICAgKiBGaWx0ZXIgbGlzdGVuZXJzIGJ5IGxpc3RlbmVyIHBvcnRcbiAgICogQGRlZmF1bHQgLSBkb2VzIG5vdCBmaWx0ZXIgYnkgbGlzdGVuZXIgcG9ydFxuICAgKi9cbiAgcmVhZG9ubHkgbGlzdGVuZXJQb3J0PzogbnVtYmVyO1xufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIHF1ZXJ5aW5nIHRoZSBsb2FkIGJhbGFuY2VyIGxpc3RlbmVyIGNvbnRleHQgcHJvdmlkZXJcbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIExpc3RlbmVyUXVlcnlDb250ZXh0UHJvdmlkZXJPcHRpb25zIHtcbiAgLyoqXG4gICAqIFVzZXIncyBwcm92aWRlZCBvcHRpb25zXG4gICAqL1xuICByZWFkb25seSB1c2VyT3B0aW9uczogQmFzZUxpc3RlbmVyTG9va3VwT3B0aW9ucztcblxuICAvKipcbiAgICogVHlwZSBvZiBsb2FkIGJhbGFuY2VyIGV4cGVjdGVkXG4gICAqL1xuICByZWFkb25seSBsb2FkQmFsYW5jZXJUeXBlOiBjeHNjaGVtYS5Mb2FkQmFsYW5jZXJUeXBlO1xuXG4gIC8qKlxuICAgKiBBUk4gb2YgdGhlIGxpc3RlbmVyIHRvIGxvb2sgdXBcbiAgICogQGRlZmF1bHQgLSBkb2VzIG5vdCBmaWx0ZXIgYnkgbGlzdGVuZXIgYXJuXG4gICAqL1xuICByZWFkb25seSBsaXN0ZW5lckFybj86IHN0cmluZztcblxuICAvKipcbiAgICogT3B0aW9uYWwgcHJvdG9jb2wgb2YgdGhlIGxpc3RlbmVyIHRvIGxvb2sgdXBcbiAgICovXG4gIHJlYWRvbmx5IGxpc3RlbmVyUHJvdG9jb2w/OiBjeHNjaGVtYS5Mb2FkQmFsYW5jZXJMaXN0ZW5lclByb3RvY29sO1xufVxuXG4vKipcbiAqIEJhc2UgaW50ZXJmYWNlIGZvciBsaXN0ZW5lcnNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJTGlzdGVuZXIgZXh0ZW5kcyBJUmVzb3VyY2Uge1xuICAvKipcbiAgICogQVJOIG9mIHRoZSBsaXN0ZW5lclxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBsaXN0ZW5lckFybjogc3RyaW5nO1xufVxuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIGxpc3RlbmVyc1xuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQmFzZUxpc3RlbmVyIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJTGlzdGVuZXIge1xuICAvKipcbiAgICogUXVlcmllcyB0aGUgbG9hZCBiYWxhbmNlciBsaXN0ZW5lciBjb250ZXh0IHByb3ZpZGVyIGZvciBsb2FkIGJhbGFuY2VyXG4gICAqIGxpc3RlbmVyIGluZm8uXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHJvdGVjdGVkIHN0YXRpYyBfcXVlcnlDb250ZXh0UHJvdmlkZXIoc2NvcGU6IENvbnN0cnVjdCwgb3B0aW9uczogTGlzdGVuZXJRdWVyeUNvbnRleHRQcm92aWRlck9wdGlvbnMpIHtcbiAgICBpZiAoVG9rZW4uaXNVbnJlc29sdmVkKG9wdGlvbnMudXNlck9wdGlvbnMubG9hZEJhbGFuY2VyQXJuKVxuICAgICAgfHwgT2JqZWN0LnZhbHVlcyhvcHRpb25zLnVzZXJPcHRpb25zLmxvYWRCYWxhbmNlclRhZ3MgPz8ge30pLnNvbWUoVG9rZW4uaXNVbnJlc29sdmVkKVxuICAgICAgfHwgVG9rZW4uaXNVbnJlc29sdmVkKG9wdGlvbnMudXNlck9wdGlvbnMubGlzdGVuZXJQb3J0KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBbGwgYXJndW1lbnRzIHRvIGxvb2sgdXAgYSBsb2FkIGJhbGFuY2VyIGxpc3RlbmVyIG11c3QgYmUgY29uY3JldGUgKG5vIFRva2VucyknKTtcbiAgICB9XG5cbiAgICBsZXQgY3hzY2hlbWFUYWdzOiBjeHNjaGVtYS5UYWdbXSB8IHVuZGVmaW5lZDtcbiAgICBpZiAob3B0aW9ucy51c2VyT3B0aW9ucy5sb2FkQmFsYW5jZXJUYWdzKSB7XG4gICAgICBjeHNjaGVtYVRhZ3MgPSBtYXBUYWdNYXBUb0N4c2NoZW1hKG9wdGlvbnMudXNlck9wdGlvbnMubG9hZEJhbGFuY2VyVGFncyk7XG4gICAgfVxuXG4gICAgY29uc3QgcHJvcHM6IGN4YXBpLkxvYWRCYWxhbmNlckxpc3RlbmVyQ29udGV4dFJlc3BvbnNlID0gQ29udGV4dFByb3ZpZGVyLmdldFZhbHVlKHNjb3BlLCB7XG4gICAgICBwcm92aWRlcjogY3hzY2hlbWEuQ29udGV4dFByb3ZpZGVyLkxPQURfQkFMQU5DRVJfTElTVEVORVJfUFJPVklERVIsXG4gICAgICBwcm9wczoge1xuICAgICAgICBsaXN0ZW5lckFybjogb3B0aW9ucy5saXN0ZW5lckFybixcbiAgICAgICAgbGlzdGVuZXJQb3J0OiBvcHRpb25zLnVzZXJPcHRpb25zLmxpc3RlbmVyUG9ydCxcbiAgICAgICAgbGlzdGVuZXJQcm90b2NvbDogb3B0aW9ucy5saXN0ZW5lclByb3RvY29sLFxuICAgICAgICBsb2FkQmFsYW5jZXJBcm46IG9wdGlvbnMudXNlck9wdGlvbnMubG9hZEJhbGFuY2VyQXJuLFxuICAgICAgICBsb2FkQmFsYW5jZXJUYWdzOiBjeHNjaGVtYVRhZ3MsXG4gICAgICAgIGxvYWRCYWxhbmNlclR5cGU6IG9wdGlvbnMubG9hZEJhbGFuY2VyVHlwZSxcbiAgICAgIH0gYXMgY3hzY2hlbWEuTG9hZEJhbGFuY2VyTGlzdGVuZXJDb250ZXh0UXVlcnksXG4gICAgICBkdW1teVZhbHVlOiB7XG4gICAgICAgIGxpc3RlbmVyQXJuOiBgYXJuOmF3czplbGFzdGljbG9hZGJhbGFuY2luZzp1cy13ZXN0LTI6MTIzNDU2Nzg5MDEyOmxpc3RlbmVyLyR7b3B0aW9ucy5sb2FkQmFsYW5jZXJUeXBlfS9teS1sb2FkLWJhbGFuY2VyLzUwZGM2YzQ5NWMwYzkxODgvZjJmN2RjOGVmYzUyMmFiMmAsXG4gICAgICAgIGxpc3RlbmVyUG9ydDogODAsXG4gICAgICAgIHNlY3VyaXR5R3JvdXBJZHM6IFsnc2ctMTIzNDU2Nzg5MDEyJ10sXG4gICAgICB9IGFzIGN4YXBpLkxvYWRCYWxhbmNlckxpc3RlbmVyQ29udGV4dFJlc3BvbnNlLFxuICAgIH0pLnZhbHVlO1xuXG4gICAgcmV0dXJuIHByb3BzO1xuICB9XG4gIC8qKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgbGlzdGVuZXJBcm46IHN0cmluZztcblxuICBwcml2YXRlIGRlZmF1bHRBY3Rpb24/OiBJTGlzdGVuZXJBY3Rpb247XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgYWRkaXRpb25hbFByb3BzOiBhbnkpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQ2ZuTGlzdGVuZXIodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgLi4uYWRkaXRpb25hbFByb3BzLFxuICAgICAgZGVmYXVsdEFjdGlvbnM6IExhenkuYW55KHsgcHJvZHVjZTogKCkgPT4gdGhpcy5kZWZhdWx0QWN0aW9uPy5yZW5kZXJBY3Rpb25zKCkgPz8gW10gfSksXG4gICAgfSk7XG5cbiAgICB0aGlzLmxpc3RlbmVyQXJuID0gcmVzb3VyY2UucmVmO1xuICAgIHRoaXMubm9kZS5hZGRWYWxpZGF0aW9uKHsgdmFsaWRhdGU6ICgpID0+IHRoaXMudmFsaWRhdGVMaXN0ZW5lcigpIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIHRoaXMgbGlzdGVuZXJcbiAgICovXG4gIHByb3RlY3RlZCB2YWxpZGF0ZUxpc3RlbmVyKCk6IHN0cmluZ1tdIHtcbiAgICBpZiAoIXRoaXMuZGVmYXVsdEFjdGlvbikge1xuICAgICAgcmV0dXJuIFsnTGlzdGVuZXIgbmVlZHMgYXQgbGVhc3Qgb25lIGRlZmF1bHQgYWN0aW9uIG9yIHRhcmdldCBncm91cCAoY2FsbCBhZGRUYXJnZXRHcm91cHMgb3IgYWRkQWN0aW9uKSddO1xuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH1cblxuICAvKipcbiAgICogQ29uZmlndXJlIHRoZSBkZWZhdWx0IGFjdGlvblxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHByb3RlY3RlZCBfc2V0RGVmYXVsdEFjdGlvbihhY3Rpb246IElMaXN0ZW5lckFjdGlvbikge1xuICAgIC8vIEl0IG1pZ2h0IG1ha2Ugc2Vuc2UgdG8gJ3Rocm93JyBoZXJlLlxuICAgIC8vXG4gICAgLy8gSG93ZXZlciwgcHJvZ3JhbXMgbWF5IGFscmVhZHkgZXhpc3Qgb3V0IHRoZXJlIHdoaWNoIGNvbmZpZ3VyZWQgYW4gYWN0aW9uIHR3aWNlLFxuICAgIC8vIGluIHdoaWNoIGNhc2UgdGhlIHNlY29uZCBhY3Rpb24gYWNjaWRlbnRhbGx5IG92ZXJ3cml0ZSB0aGUgaW5pdGlhbCBhY3Rpb24sIGFuZCBpbiBzb21lXG4gICAgLy8gd2F5IGVuZGVkIHVwIHdpdGggYSBwcm9ncmFtIHRoYXQgZGlkIHdoYXQgdGhlIGF1dGhvciBpbnRlbmRlZC4gSWYgd2Ugd2VyZSB0byBhZGQgdGhyb3cgbm93LFxuICAgIC8vIHRoZSBwcmV2aW91c2x5IHdvcmtpbmcgcHJvZ3JhbSB3b3VsZCBiZSBicm9rZW4uXG4gICAgLy9cbiAgICAvLyBJbnN0ZWFkLCBzaWduYWwgdGhpcyB0aHJvdWdoIGEgd2FybmluZy5cbiAgICAvLyBAZGVwcmVjYXRlOiB1cG9uIHRoZSBuZXh0IG1ham9yIHZlcnNpb24gYnVtcCwgcmVwbGFjZSB0aGlzIHdpdGggYSBgdGhyb3dgXG4gICAgaWYgKHRoaXMuZGVmYXVsdEFjdGlvbikge1xuICAgICAgQW5ub3RhdGlvbnMub2YodGhpcykuYWRkV2FybmluZygnQSBkZWZhdWx0IEFjdGlvbiBhbHJlYWR5IGV4aXN0ZWQgb24gdGhpcyBMaXN0ZW5lciBhbmQgd2FzIHJlcGxhY2VkLiBDb25maWd1cmUgZXhhY3RseSBvbmUgZGVmYXVsdCBBY3Rpb24uJyk7XG4gICAgfVxuXG4gICAgdGhpcy5kZWZhdWx0QWN0aW9uID0gYWN0aW9uO1xuICB9XG59XG4iXX0=