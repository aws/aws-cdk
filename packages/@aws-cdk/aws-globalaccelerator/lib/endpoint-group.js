"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndpointGroup = exports.HealthCheckProtocol = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("@aws-cdk/core");
const _accelerator_security_group_1 = require("./_accelerator-security-group");
const ga = require("./globalaccelerator.generated");
/**
 * The protocol for the connections from clients to the accelerator.
 */
var HealthCheckProtocol;
(function (HealthCheckProtocol) {
    /**
     * TCP
     */
    HealthCheckProtocol["TCP"] = "TCP";
    /**
     * HTTP
     */
    HealthCheckProtocol["HTTP"] = "HTTP";
    /**
     * HTTPS
     */
    HealthCheckProtocol["HTTPS"] = "HTTPS";
})(HealthCheckProtocol = exports.HealthCheckProtocol || (exports.HealthCheckProtocol = {}));
/**
 * EndpointGroup construct
 */
class EndpointGroup extends cdk.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        /**
         * The array of the endpoints in this endpoint group
         */
        this.endpoints = new Array();
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_globalaccelerator_EndpointGroupProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, EndpointGroup);
            }
            throw error;
        }
        const resource = new ga.CfnEndpointGroup(this, 'Resource', {
            listenerArn: props.listener.listenerArn,
            endpointGroupRegion: props.region ?? cdk.Lazy.string({ produce: () => this.firstEndpointRegion() }),
            endpointConfigurations: cdk.Lazy.any({ produce: () => this.renderEndpoints() }, { omitEmptyArray: true }),
            healthCheckIntervalSeconds: props.healthCheckInterval?.toSeconds({ integral: true }),
            healthCheckPath: props.healthCheckPath,
            healthCheckPort: props.healthCheckPort,
            healthCheckProtocol: props.healthCheckProtocol,
            thresholdCount: props.healthCheckThreshold,
            trafficDialPercentage: props.trafficDialPercentage,
            portOverrides: props.portOverrides?.map(o => ({
                endpointPort: o.endpointPort,
                listenerPort: o.listenerPort,
            })),
        });
        this.endpointGroupArn = resource.attrEndpointGroupArn;
        this.endpointGroupName = props.endpointGroupName ?? resource.logicalId;
        for (const endpoint of props.endpoints ?? []) {
            this.addEndpoint(endpoint);
        }
    }
    /**
     * import from ARN
     */
    static fromEndpointGroupArn(scope, id, endpointGroupArn) {
        class Import extends cdk.Resource {
            constructor() {
                super(...arguments);
                this.endpointGroupArn = endpointGroupArn;
            }
        }
        return new Import(scope, id);
    }
    /**
     * Add an endpoint
     */
    addEndpoint(endpoint) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_globalaccelerator_IEndpoint(endpoint);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addEndpoint);
            }
            throw error;
        }
        this.endpoints.push(endpoint);
    }
    /**
     * Return an object that represents the Accelerator's Security Group
     *
     * Uses a Custom Resource to look up the Security Group that Accelerator
     * creates at deploy time. Requires your VPC ID to perform the lookup.
     *
     * The Security Group will only be created if you enable **Client IP
     * Preservation** on any of the endpoints.
     *
     * You cannot manipulate the rules inside this security group, but you can
     * use this security group as a Peer in Connections rules on other
     * constructs.
     */
    connectionsPeer(id, vpc) {
        return _accelerator_security_group_1.AcceleratorSecurityGroupPeer.fromVpc(this, id, vpc, this);
    }
    renderEndpoints() {
        return this.endpoints.map(e => e.renderEndpointConfiguration());
    }
    /**
     * Return the first (readable) region of the endpoints in this group
     */
    firstEndpointRegion() {
        for (const endpoint of this.endpoints) {
            if (endpoint.region) {
                return endpoint.region;
            }
        }
        return cdk.Stack.of(this).region;
    }
}
exports.EndpointGroup = EndpointGroup;
_a = JSII_RTTI_SYMBOL_1;
EndpointGroup[_a] = { fqn: "@aws-cdk/aws-globalaccelerator.EndpointGroup", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5kcG9pbnQtZ3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlbmRwb2ludC1ncm91cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSxxQ0FBcUM7QUFFckMsK0VBQTZFO0FBRTdFLG9EQUFvRDtBQXNIcEQ7O0dBRUc7QUFDSCxJQUFZLG1CQWFYO0FBYkQsV0FBWSxtQkFBbUI7SUFDN0I7O09BRUc7SUFDSCxrQ0FBVyxDQUFBO0lBQ1g7O09BRUc7SUFDSCxvQ0FBYSxDQUFBO0lBQ2I7O09BRUc7SUFDSCxzQ0FBZSxDQUFBO0FBQ2pCLENBQUMsRUFiVyxtQkFBbUIsR0FBbkIsMkJBQW1CLEtBQW5CLDJCQUFtQixRQWE5QjtBQVlEOztHQUVHO0FBQ0gsTUFBYSxhQUFjLFNBQVEsR0FBRyxDQUFDLFFBQVE7SUF3QjdDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBeUI7UUFDakUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQU5uQjs7V0FFRztRQUNnQixjQUFTLEdBQUcsSUFBSSxLQUFLLEVBQWEsQ0FBQzs7Ozs7OytDQXRCM0MsYUFBYTs7OztRQTJCdEIsTUFBTSxRQUFRLEdBQUcsSUFBSSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUN6RCxXQUFXLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxXQUFXO1lBQ3ZDLG1CQUFtQixFQUFFLEtBQUssQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLEVBQUUsQ0FBQztZQUNuRyxzQkFBc0IsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLEVBQUUsRUFBRSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsQ0FBQztZQUN6RywwQkFBMEIsRUFBRSxLQUFLLENBQUMsbUJBQW1CLEVBQUUsU0FBUyxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDO1lBQ3BGLGVBQWUsRUFBRSxLQUFLLENBQUMsZUFBZTtZQUN0QyxlQUFlLEVBQUUsS0FBSyxDQUFDLGVBQWU7WUFDdEMsbUJBQW1CLEVBQUUsS0FBSyxDQUFDLG1CQUFtQjtZQUM5QyxjQUFjLEVBQUUsS0FBSyxDQUFDLG9CQUFvQjtZQUMxQyxxQkFBcUIsRUFBRSxLQUFLLENBQUMscUJBQXFCO1lBQ2xELGFBQWEsRUFBRSxLQUFLLENBQUMsYUFBYSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQzVDLFlBQVksRUFBRSxDQUFDLENBQUMsWUFBWTtnQkFDNUIsWUFBWSxFQUFFLENBQUMsQ0FBQyxZQUFZO2FBQzdCLENBQUMsQ0FBQztTQUNKLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxRQUFRLENBQUMsb0JBQW9CLENBQUM7UUFDdEQsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQyxpQkFBaUIsSUFBSSxRQUFRLENBQUMsU0FBUyxDQUFDO1FBRXZFLEtBQUssTUFBTSxRQUFRLElBQUksS0FBSyxDQUFDLFNBQVMsSUFBSSxFQUFFLEVBQUU7WUFDNUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUM1QjtLQUNGO0lBaEREOztPQUVHO0lBQ0ksTUFBTSxDQUFDLG9CQUFvQixDQUFDLEtBQWdCLEVBQUUsRUFBVSxFQUFFLGdCQUF3QjtRQUN2RixNQUFNLE1BQU8sU0FBUSxHQUFHLENBQUMsUUFBUTtZQUFqQzs7Z0JBQ2tCLHFCQUFnQixHQUFHLGdCQUFnQixDQUFDO1lBQ3RELENBQUM7U0FBQTtRQUNELE9BQU8sSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQzlCO0lBMENEOztPQUVHO0lBQ0ksV0FBVyxDQUFDLFFBQW1COzs7Ozs7Ozs7O1FBQ3BDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQy9CO0lBRUQ7Ozs7Ozs7Ozs7OztPQVlHO0lBQ0ksZUFBZSxDQUFDLEVBQVUsRUFBRSxHQUFhO1FBQzlDLE9BQU8sMERBQTRCLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ2xFO0lBRU8sZUFBZTtRQUNyQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLDJCQUEyQixFQUFFLENBQUMsQ0FBQztLQUNqRTtJQUVEOztPQUVHO0lBQ0ssbUJBQW1CO1FBQ3pCLEtBQUssTUFBTSxRQUFRLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNyQyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUU7Z0JBQ25CLE9BQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQzthQUN4QjtTQUNGO1FBQ0QsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUM7S0FDbEM7O0FBekZILHNDQTBGQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGVjMiBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQWNjZWxlcmF0b3JTZWN1cml0eUdyb3VwUGVlciB9IGZyb20gJy4vX2FjY2VsZXJhdG9yLXNlY3VyaXR5LWdyb3VwJztcbmltcG9ydCB7IElFbmRwb2ludCB9IGZyb20gJy4vZW5kcG9pbnQnO1xuaW1wb3J0ICogYXMgZ2EgZnJvbSAnLi9nbG9iYWxhY2NlbGVyYXRvci5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgSUxpc3RlbmVyIH0gZnJvbSAnLi9saXN0ZW5lcic7XG5cbi8qKlxuICogVGhlIGludGVyZmFjZSBvZiB0aGUgRW5kcG9pbnRHcm91cFxuICovXG5leHBvcnQgaW50ZXJmYWNlIElFbmRwb2ludEdyb3VwIGV4dGVuZHMgY2RrLklSZXNvdXJjZSB7XG4gIC8qKlxuICAgKiBFbmRwb2ludEdyb3VwIEFSTlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBlbmRwb2ludEdyb3VwQXJuOiBzdHJpbmc7XG59XG5cbi8qKlxuICogQmFzaWMgb3B0aW9ucyBmb3IgY3JlYXRpbmcgYSBuZXcgRW5kcG9pbnRHcm91cFxuICovXG5leHBvcnQgaW50ZXJmYWNlIEVuZHBvaW50R3JvdXBPcHRpb25zIHtcbiAgLyoqXG4gICAqIE5hbWUgb2YgdGhlIGVuZHBvaW50IGdyb3VwXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbG9naWNhbCBJRCBvZiB0aGUgcmVzb3VyY2VcbiAgICovXG4gIHJlYWRvbmx5IGVuZHBvaW50R3JvdXBOYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgQVdTIFJlZ2lvbiB3aGVyZSB0aGUgZW5kcG9pbnQgZ3JvdXAgaXMgbG9jYXRlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSByZWdpb24gb2YgdGhlIGZpcnN0IGVuZHBvaW50IGluIHRoaXMgZ3JvdXAsIG9yIHRoZSBzdGFjayByZWdpb24gaWYgdGhhdCByZWdpb24gY2FuJ3QgYmUgZGV0ZXJtaW5lZFxuICAgKi9cbiAgcmVhZG9ubHkgcmVnaW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgdGltZSBiZXR3ZWVuIGhlYWx0aCBjaGVja3MgZm9yIGVhY2ggZW5kcG9pbnRcbiAgICpcbiAgICogTXVzdCBiZSBlaXRoZXIgMTAgb3IgMzAgc2Vjb25kcy5cbiAgICpcbiAgICogQGRlZmF1bHQgRHVyYXRpb24uc2Vjb25kcygzMClcbiAgICovXG4gIHJlYWRvbmx5IGhlYWx0aENoZWNrSW50ZXJ2YWw/OiBjZGsuRHVyYXRpb247XG5cbiAgLyoqXG4gICAqIFRoZSBwaW5nIHBhdGggZm9yIGhlYWx0aCBjaGVja3MgKGlmIHRoZSBwcm90b2NvbCBpcyBIVFRQKFMpKS5cbiAgICpcbiAgICogQGRlZmF1bHQgJy8nXG4gICAqL1xuICByZWFkb25seSBoZWFsdGhDaGVja1BhdGg/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBwb3J0IHVzZWQgdG8gcGVyZm9ybSBoZWFsdGggY2hlY2tzXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gVGhlIGxpc3RlbmVyJ3MgcG9ydFxuICAgKi9cbiAgcmVhZG9ubHkgaGVhbHRoQ2hlY2tQb3J0PzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgcHJvdG9jb2wgdXNlZCB0byBwZXJmb3JtIGhlYWx0aCBjaGVja3NcbiAgICpcbiAgICogQGRlZmF1bHQgSGVhbHRoQ2hlY2tQcm90b2NvbC5UQ1BcbiAgICovXG4gIHJlYWRvbmx5IGhlYWx0aENoZWNrUHJvdG9jb2w/OiBIZWFsdGhDaGVja1Byb3RvY29sO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIGNvbnNlY3V0aXZlIGhlYWx0aCBjaGVja3MgcmVxdWlyZWQgdG8gc2V0IHRoZSBzdGF0ZSBvZiBhXG4gICAqIGhlYWx0aHkgZW5kcG9pbnQgdG8gdW5oZWFsdGh5LCBvciB0byBzZXQgYW4gdW5oZWFsdGh5IGVuZHBvaW50IHRvIGhlYWx0aHkuXG4gICAqXG4gICAqIEBkZWZhdWx0IDNcbiAgICovXG4gIHJlYWRvbmx5IGhlYWx0aENoZWNrVGhyZXNob2xkPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgcGVyY2VudGFnZSBvZiB0cmFmZmljIHRvIHNlbmQgdG8gdGhpcyBBV1MgUmVnaW9uLlxuICAgKlxuICAgKiBUaGUgcGVyY2VudGFnZSBpcyBhcHBsaWVkIHRvIHRoZSB0cmFmZmljIHRoYXQgd291bGQgb3RoZXJ3aXNlIGhhdmUgYmVlblxuICAgKiByb3V0ZWQgdG8gdGhlIFJlZ2lvbiBiYXNlZCBvbiBvcHRpbWFsIHJvdXRpbmcuIEFkZGl0aW9uYWwgdHJhZmZpYyBpc1xuICAgKiBkaXN0cmlidXRlZCB0byBvdGhlciBlbmRwb2ludCBncm91cHMgZm9yIHRoaXMgbGlzdGVuZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IDEwMFxuICAgKi9cbiAgcmVhZG9ubHkgdHJhZmZpY0RpYWxQZXJjZW50YWdlPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBPdmVycmlkZSB0aGUgZGVzdGluYXRpb24gcG9ydHMgdXNlZCB0byByb3V0ZSB0cmFmZmljIHRvIGFuIGVuZHBvaW50LlxuICAgKlxuICAgKiBVbmxlc3Mgb3ZlcnJpZGRlbiwgdGhlIHBvcnQgdXNlZCB0byBoaXQgdGhlIGVuZHBvaW50IHdpbGwgYmUgdGhlIHNhbWUgYXMgdGhlIHBvcnRcbiAgICogdGhhdCB0cmFmZmljIGFycml2ZXMgb24gYXQgdGhlIGxpc3RlbmVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIG92ZXJyaWRlc1xuICAgKi9cbiAgcmVhZG9ubHkgcG9ydE92ZXJyaWRlcz86IFBvcnRPdmVycmlkZVtdXG5cbiAgLyoqXG4gICAqIEluaXRpYWwgbGlzdCBvZiBlbmRwb2ludHMgZm9yIHRoaXMgZ3JvdXBcbiAgICpcbiAgICogQGRlZmF1bHQgLSBHcm91cCBpcyBpbml0aWFsbHkgZW1wdHlcbiAgICovXG4gIHJlYWRvbmx5IGVuZHBvaW50cz86IElFbmRwb2ludFtdO1xufVxuXG4vKipcbiAqIE92ZXJyaWRlIHNwZWNpZmljIGxpc3RlbmVyIHBvcnRzIHVzZWQgdG8gcm91dGUgdHJhZmZpYyB0byBlbmRwb2ludHMgdGhhdCBhcmUgcGFydCBvZiBhbiBlbmRwb2ludCBncm91cC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBQb3J0T3ZlcnJpZGUge1xuICAvKipcbiAgICogVGhlIGxpc3RlbmVyIHBvcnQgdGhhdCB5b3Ugd2FudCB0byBtYXAgdG8gYSBzcGVjaWZpYyBlbmRwb2ludCBwb3J0LlxuICAgKlxuICAgKiBUaGlzIGlzIHRoZSBwb3J0IHRoYXQgdXNlciB0cmFmZmljIGFycml2ZXMgdG8gdGhlIEdsb2JhbCBBY2NlbGVyYXRvciBvbi5cbiAgICovXG4gIHJlYWRvbmx5IGxpc3RlbmVyUG9ydDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgZW5kcG9pbnQgcG9ydCB0aGF0IHlvdSB3YW50IGEgbGlzdGVuZXIgcG9ydCB0byBiZSBtYXBwZWQgdG8uXG4gICAqXG4gICAqIFRoaXMgaXMgdGhlIHBvcnQgb24gdGhlIGVuZHBvaW50LCBzdWNoIGFzIHRoZSBBcHBsaWNhdGlvbiBMb2FkIEJhbGFuY2VyIG9yIEFtYXpvbiBFQzIgaW5zdGFuY2UuXG4gICAqL1xuICByZWFkb25seSBlbmRwb2ludFBvcnQ6IG51bWJlcjtcbn1cblxuLyoqXG4gKiBUaGUgcHJvdG9jb2wgZm9yIHRoZSBjb25uZWN0aW9ucyBmcm9tIGNsaWVudHMgdG8gdGhlIGFjY2VsZXJhdG9yLlxuICovXG5leHBvcnQgZW51bSBIZWFsdGhDaGVja1Byb3RvY29sIHtcbiAgLyoqXG4gICAqIFRDUFxuICAgKi9cbiAgVENQID0gJ1RDUCcsXG4gIC8qKlxuICAgKiBIVFRQXG4gICAqL1xuICBIVFRQID0gJ0hUVFAnLFxuICAvKipcbiAgICogSFRUUFNcbiAgICovXG4gIEhUVFBTID0gJ0hUVFBTJyxcbn1cblxuLyoqXG4gKiBQcm9wZXJ0eSBvZiB0aGUgRW5kcG9pbnRHcm91cFxuICovXG5leHBvcnQgaW50ZXJmYWNlIEVuZHBvaW50R3JvdXBQcm9wcyBleHRlbmRzIEVuZHBvaW50R3JvdXBPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBBbWF6b24gUmVzb3VyY2UgTmFtZSAoQVJOKSBvZiB0aGUgbGlzdGVuZXIuXG4gICAqL1xuICByZWFkb25seSBsaXN0ZW5lcjogSUxpc3RlbmVyO1xufVxuXG4vKipcbiAqIEVuZHBvaW50R3JvdXAgY29uc3RydWN0XG4gKi9cbmV4cG9ydCBjbGFzcyBFbmRwb2ludEdyb3VwIGV4dGVuZHMgY2RrLlJlc291cmNlIGltcGxlbWVudHMgSUVuZHBvaW50R3JvdXAge1xuICAvKipcbiAgICogaW1wb3J0IGZyb20gQVJOXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21FbmRwb2ludEdyb3VwQXJuKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGVuZHBvaW50R3JvdXBBcm46IHN0cmluZyk6IElFbmRwb2ludEdyb3VwIHtcbiAgICBjbGFzcyBJbXBvcnQgZXh0ZW5kcyBjZGsuUmVzb3VyY2UgaW1wbGVtZW50cyBJRW5kcG9pbnRHcm91cCB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgZW5kcG9pbnRHcm91cEFybiA9IGVuZHBvaW50R3JvdXBBcm47XG4gICAgfVxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCk7XG4gIH1cblxuICBwdWJsaWMgcmVhZG9ubHkgZW5kcG9pbnRHcm91cEFybjogc3RyaW5nO1xuICAvKipcbiAgICpcbiAgICogVGhlIG5hbWUgb2YgdGhlIGVuZHBvaW50IGdyb3VwXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBlbmRwb2ludEdyb3VwTmFtZTogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIGFycmF5IG9mIHRoZSBlbmRwb2ludHMgaW4gdGhpcyBlbmRwb2ludCBncm91cFxuICAgKi9cbiAgcHJvdGVjdGVkIHJlYWRvbmx5IGVuZHBvaW50cyA9IG5ldyBBcnJheTxJRW5kcG9pbnQ+KCk7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEVuZHBvaW50R3JvdXBQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBnYS5DZm5FbmRwb2ludEdyb3VwKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIGxpc3RlbmVyQXJuOiBwcm9wcy5saXN0ZW5lci5saXN0ZW5lckFybixcbiAgICAgIGVuZHBvaW50R3JvdXBSZWdpb246IHByb3BzLnJlZ2lvbiA/PyBjZGsuTGF6eS5zdHJpbmcoeyBwcm9kdWNlOiAoKSA9PiB0aGlzLmZpcnN0RW5kcG9pbnRSZWdpb24oKSB9KSxcbiAgICAgIGVuZHBvaW50Q29uZmlndXJhdGlvbnM6IGNkay5MYXp5LmFueSh7IHByb2R1Y2U6ICgpID0+IHRoaXMucmVuZGVyRW5kcG9pbnRzKCkgfSwgeyBvbWl0RW1wdHlBcnJheTogdHJ1ZSB9KSxcbiAgICAgIGhlYWx0aENoZWNrSW50ZXJ2YWxTZWNvbmRzOiBwcm9wcy5oZWFsdGhDaGVja0ludGVydmFsPy50b1NlY29uZHMoeyBpbnRlZ3JhbDogdHJ1ZSB9KSxcbiAgICAgIGhlYWx0aENoZWNrUGF0aDogcHJvcHMuaGVhbHRoQ2hlY2tQYXRoLFxuICAgICAgaGVhbHRoQ2hlY2tQb3J0OiBwcm9wcy5oZWFsdGhDaGVja1BvcnQsXG4gICAgICBoZWFsdGhDaGVja1Byb3RvY29sOiBwcm9wcy5oZWFsdGhDaGVja1Byb3RvY29sLFxuICAgICAgdGhyZXNob2xkQ291bnQ6IHByb3BzLmhlYWx0aENoZWNrVGhyZXNob2xkLFxuICAgICAgdHJhZmZpY0RpYWxQZXJjZW50YWdlOiBwcm9wcy50cmFmZmljRGlhbFBlcmNlbnRhZ2UsXG4gICAgICBwb3J0T3ZlcnJpZGVzOiBwcm9wcy5wb3J0T3ZlcnJpZGVzPy5tYXAobyA9PiAoe1xuICAgICAgICBlbmRwb2ludFBvcnQ6IG8uZW5kcG9pbnRQb3J0LFxuICAgICAgICBsaXN0ZW5lclBvcnQ6IG8ubGlzdGVuZXJQb3J0LFxuICAgICAgfSkpLFxuICAgIH0pO1xuXG4gICAgdGhpcy5lbmRwb2ludEdyb3VwQXJuID0gcmVzb3VyY2UuYXR0ckVuZHBvaW50R3JvdXBBcm47XG4gICAgdGhpcy5lbmRwb2ludEdyb3VwTmFtZSA9IHByb3BzLmVuZHBvaW50R3JvdXBOYW1lID8/IHJlc291cmNlLmxvZ2ljYWxJZDtcblxuICAgIGZvciAoY29uc3QgZW5kcG9pbnQgb2YgcHJvcHMuZW5kcG9pbnRzID8/IFtdKSB7XG4gICAgICB0aGlzLmFkZEVuZHBvaW50KGVuZHBvaW50KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIGFuIGVuZHBvaW50XG4gICAqL1xuICBwdWJsaWMgYWRkRW5kcG9pbnQoZW5kcG9pbnQ6IElFbmRwb2ludCkge1xuICAgIHRoaXMuZW5kcG9pbnRzLnB1c2goZW5kcG9pbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBhbiBvYmplY3QgdGhhdCByZXByZXNlbnRzIHRoZSBBY2NlbGVyYXRvcidzIFNlY3VyaXR5IEdyb3VwXG4gICAqXG4gICAqIFVzZXMgYSBDdXN0b20gUmVzb3VyY2UgdG8gbG9vayB1cCB0aGUgU2VjdXJpdHkgR3JvdXAgdGhhdCBBY2NlbGVyYXRvclxuICAgKiBjcmVhdGVzIGF0IGRlcGxveSB0aW1lLiBSZXF1aXJlcyB5b3VyIFZQQyBJRCB0byBwZXJmb3JtIHRoZSBsb29rdXAuXG4gICAqXG4gICAqIFRoZSBTZWN1cml0eSBHcm91cCB3aWxsIG9ubHkgYmUgY3JlYXRlZCBpZiB5b3UgZW5hYmxlICoqQ2xpZW50IElQXG4gICAqIFByZXNlcnZhdGlvbioqIG9uIGFueSBvZiB0aGUgZW5kcG9pbnRzLlxuICAgKlxuICAgKiBZb3UgY2Fubm90IG1hbmlwdWxhdGUgdGhlIHJ1bGVzIGluc2lkZSB0aGlzIHNlY3VyaXR5IGdyb3VwLCBidXQgeW91IGNhblxuICAgKiB1c2UgdGhpcyBzZWN1cml0eSBncm91cCBhcyBhIFBlZXIgaW4gQ29ubmVjdGlvbnMgcnVsZXMgb24gb3RoZXJcbiAgICogY29uc3RydWN0cy5cbiAgICovXG4gIHB1YmxpYyBjb25uZWN0aW9uc1BlZXIoaWQ6IHN0cmluZywgdnBjOiBlYzIuSVZwYyk6IGVjMi5JUGVlciB7XG4gICAgcmV0dXJuIEFjY2VsZXJhdG9yU2VjdXJpdHlHcm91cFBlZXIuZnJvbVZwYyh0aGlzLCBpZCwgdnBjLCB0aGlzKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyRW5kcG9pbnRzKCkge1xuICAgIHJldHVybiB0aGlzLmVuZHBvaW50cy5tYXAoZSA9PiBlLnJlbmRlckVuZHBvaW50Q29uZmlndXJhdGlvbigpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGZpcnN0IChyZWFkYWJsZSkgcmVnaW9uIG9mIHRoZSBlbmRwb2ludHMgaW4gdGhpcyBncm91cFxuICAgKi9cbiAgcHJpdmF0ZSBmaXJzdEVuZHBvaW50UmVnaW9uKCkge1xuICAgIGZvciAoY29uc3QgZW5kcG9pbnQgb2YgdGhpcy5lbmRwb2ludHMpIHtcbiAgICAgIGlmIChlbmRwb2ludC5yZWdpb24pIHtcbiAgICAgICAgcmV0dXJuIGVuZHBvaW50LnJlZ2lvbjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNkay5TdGFjay5vZih0aGlzKS5yZWdpb247XG4gIH1cbn1cbiJdfQ==