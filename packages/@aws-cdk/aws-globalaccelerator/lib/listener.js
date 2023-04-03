"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listener = exports.ClientAffinity = exports.ConnectionProtocol = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("@aws-cdk/core");
const endpoint_group_1 = require("./endpoint-group");
const ga = require("./globalaccelerator.generated");
/**
 * The protocol for the connections from clients to the accelerator.
 */
var ConnectionProtocol;
(function (ConnectionProtocol) {
    /**
     * TCP
     */
    ConnectionProtocol["TCP"] = "TCP";
    /**
     * UDP
     */
    ConnectionProtocol["UDP"] = "UDP";
})(ConnectionProtocol = exports.ConnectionProtocol || (exports.ConnectionProtocol = {}));
/**
 * Client affinity gives you control over whether to always route each client to the same specific endpoint.
 *
 * @see https://docs.aws.amazon.com/global-accelerator/latest/dg/about-listeners.html#about-listeners-client-affinity
 */
var ClientAffinity;
(function (ClientAffinity) {
    /**
     * Route traffic based on the 5-tuple `(source IP, source port, destination IP, destination port, protocol)`
     */
    ClientAffinity["NONE"] = "NONE";
    /**
     * Route traffic based on the 2-tuple `(source IP, destination IP)`
     *
     * The result is that multiple connections from the same client will be routed the same.
     */
    ClientAffinity["SOURCE_IP"] = "SOURCE_IP";
})(ClientAffinity = exports.ClientAffinity || (exports.ClientAffinity = {}));
/**
 * The construct for the Listener
 */
class Listener extends cdk.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_globalaccelerator_ListenerProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Listener);
            }
            throw error;
        }
        const resource = new ga.CfnListener(this, 'Resource', {
            acceleratorArn: props.accelerator.acceleratorArn,
            portRanges: props.portRanges.map(m => ({
                fromPort: m.fromPort,
                toPort: m.toPort ?? m.fromPort,
            })),
            protocol: props.protocol ?? ConnectionProtocol.TCP,
            clientAffinity: props.clientAffinity ?? ClientAffinity.NONE,
        });
        this.listenerArn = resource.attrListenerArn;
        this.listenerName = props.listenerName ?? resource.logicalId;
    }
    /**
     * import from ARN
     */
    static fromListenerArn(scope, id, listenerArn) {
        class Import extends cdk.Resource {
            constructor() {
                super(...arguments);
                this.listenerArn = listenerArn;
            }
        }
        return new Import(scope, id);
    }
    /**
     * Add a new endpoint group to this listener
     */
    addEndpointGroup(id, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_globalaccelerator_EndpointGroupOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addEndpointGroup);
            }
            throw error;
        }
        return new endpoint_group_1.EndpointGroup(this, id, {
            listener: this,
            ...options,
        });
    }
}
exports.Listener = Listener;
_a = JSII_RTTI_SYMBOL_1;
Listener[_a] = { fqn: "@aws-cdk/aws-globalaccelerator.Listener", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdGVuZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsaXN0ZW5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxxQ0FBcUM7QUFHckMscURBQXVFO0FBQ3ZFLG9EQUFvRDtBQStFcEQ7O0dBRUc7QUFDSCxJQUFZLGtCQVNYO0FBVEQsV0FBWSxrQkFBa0I7SUFDNUI7O09BRUc7SUFDSCxpQ0FBVyxDQUFBO0lBQ1g7O09BRUc7SUFDSCxpQ0FBVyxDQUFBO0FBQ2IsQ0FBQyxFQVRXLGtCQUFrQixHQUFsQiwwQkFBa0IsS0FBbEIsMEJBQWtCLFFBUzdCO0FBRUQ7Ozs7R0FJRztBQUNILElBQVksY0FZWDtBQVpELFdBQVksY0FBYztJQUN4Qjs7T0FFRztJQUNILCtCQUFhLENBQUE7SUFFYjs7OztPQUlHO0lBQ0gseUNBQXVCLENBQUE7QUFDekIsQ0FBQyxFQVpXLGNBQWMsR0FBZCxzQkFBYyxLQUFkLHNCQUFjLFFBWXpCO0FBRUQ7O0dBRUc7QUFDSCxNQUFhLFFBQVMsU0FBUSxHQUFHLENBQUMsUUFBUTtJQW1CeEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFvQjtRQUM1RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7K0NBcEJSLFFBQVE7Ozs7UUFzQmpCLE1BQU0sUUFBUSxHQUFHLElBQUksRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ3BELGNBQWMsRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLGNBQWM7WUFDaEQsVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDckMsUUFBUSxFQUFFLENBQUMsQ0FBQyxRQUFRO2dCQUNwQixNQUFNLEVBQUUsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsUUFBUTthQUMvQixDQUFDLENBQUM7WUFDSCxRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVEsSUFBSSxrQkFBa0IsQ0FBQyxHQUFHO1lBQ2xELGNBQWMsRUFBRSxLQUFLLENBQUMsY0FBYyxJQUFJLGNBQWMsQ0FBQyxJQUFJO1NBQzVELENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQztRQUM1QyxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxZQUFZLElBQUksUUFBUSxDQUFDLFNBQVMsQ0FBQztLQUM5RDtJQWpDRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxlQUFlLENBQUMsS0FBZ0IsRUFBRSxFQUFVLEVBQUUsV0FBbUI7UUFDN0UsTUFBTSxNQUFPLFNBQVEsR0FBRyxDQUFDLFFBQVE7WUFBakM7O2dCQUNrQixnQkFBVyxHQUFHLFdBQVcsQ0FBQztZQUM1QyxDQUFDO1NBQUE7UUFDRCxPQUFPLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztLQUM5QjtJQTJCRDs7T0FFRztJQUNJLGdCQUFnQixDQUFDLEVBQVUsRUFBRSxVQUFnQyxFQUFFOzs7Ozs7Ozs7O1FBQ3BFLE9BQU8sSUFBSSw4QkFBYSxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUU7WUFDakMsUUFBUSxFQUFFLElBQUk7WUFDZCxHQUFHLE9BQU87U0FDWCxDQUFDLENBQUM7S0FDSjs7QUE1Q0gsNEJBNkNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBJQWNjZWxlcmF0b3IgfSBmcm9tICcuL2FjY2VsZXJhdG9yJztcbmltcG9ydCB7IEVuZHBvaW50R3JvdXAsIEVuZHBvaW50R3JvdXBPcHRpb25zIH0gZnJvbSAnLi9lbmRwb2ludC1ncm91cCc7XG5pbXBvcnQgKiBhcyBnYSBmcm9tICcuL2dsb2JhbGFjY2VsZXJhdG9yLmdlbmVyYXRlZCc7XG5cbi8qKlxuICogSW50ZXJmYWNlIG9mIHRoZSBMaXN0ZW5lclxuICovXG5leHBvcnQgaW50ZXJmYWNlIElMaXN0ZW5lciBleHRlbmRzIGNkay5JUmVzb3VyY2Uge1xuICAvKipcbiAgICogVGhlIEFSTiBvZiB0aGUgbGlzdGVuZXJcbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgbGlzdGVuZXJBcm46IHN0cmluZztcbn1cblxuLyoqXG4gKiBDb25zdHJ1Y3Qgb3B0aW9ucyBmb3IgTGlzdGVuZXJcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBMaXN0ZW5lck9wdGlvbnMge1xuICAvKipcbiAgICogTmFtZSBvZiB0aGUgbGlzdGVuZXJcbiAgICpcbiAgICogQGRlZmF1bHQgLSBsb2dpY2FsIElEIG9mIHRoZSByZXNvdXJjZVxuICAgKi9cbiAgcmVhZG9ubHkgbGlzdGVuZXJOYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbGlzdCBvZiBwb3J0IHJhbmdlcyBmb3IgdGhlIGNvbm5lY3Rpb25zIGZyb20gY2xpZW50cyB0byB0aGUgYWNjZWxlcmF0b3JcbiAgICovXG4gIHJlYWRvbmx5IHBvcnRSYW5nZXM6IFBvcnRSYW5nZVtdO1xuXG4gIC8qKlxuICAgKiBUaGUgcHJvdG9jb2wgZm9yIHRoZSBjb25uZWN0aW9ucyBmcm9tIGNsaWVudHMgdG8gdGhlIGFjY2VsZXJhdG9yXG4gICAqXG4gICAqIEBkZWZhdWx0IENvbm5lY3Rpb25Qcm90b2NvbC5UQ1BcbiAgICovXG4gIHJlYWRvbmx5IHByb3RvY29sPzogQ29ubmVjdGlvblByb3RvY29sO1xuXG4gIC8qKlxuICAgKiBDbGllbnQgYWZmaW5pdHkgdG8gZGlyZWN0IGFsbCByZXF1ZXN0cyBmcm9tIGEgdXNlciB0byB0aGUgc2FtZSBlbmRwb2ludFxuICAgKlxuICAgKiBJZiB5b3UgaGF2ZSBzdGF0ZWZ1bCBhcHBsaWNhdGlvbnMsIGNsaWVudCBhZmZpbml0eSBsZXRzIHlvdSBkaXJlY3QgYWxsXG4gICAqIHJlcXVlc3RzIGZyb20gYSB1c2VyIHRvIHRoZSBzYW1lIGVuZHBvaW50LlxuICAgKlxuICAgKiBCeSBkZWZhdWx0LCBlYWNoIGNvbm5lY3Rpb24gZnJvbSBlYWNoIGNsaWVudCBpcyByb3V0ZWQgdG8gc2VwZXJhdGVcbiAgICogZW5kcG9pbnRzLiBTZXQgY2xpZW50IGFmZmluaXR5IHRvIFNPVVJDRV9JUCB0byByb3V0ZSBhbGwgY29ubmVjdGlvbnMgZnJvbVxuICAgKiBhIHNpbmdsZSBjbGllbnQgdG8gdGhlIHNhbWUgZW5kcG9pbnQuXG4gICAqXG4gICAqIEBkZWZhdWx0IENsaWVudEFmZmluaXR5Lk5PTkVcbiAgICovXG4gIHJlYWRvbmx5IGNsaWVudEFmZmluaXR5PzogQ2xpZW50QWZmaW5pdHk7XG59XG5cbi8qKlxuICogQ29uc3RydWN0IHByb3BlcnRpZXMgZm9yIExpc3RlbmVyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTGlzdGVuZXJQcm9wcyBleHRlbmRzIExpc3RlbmVyT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgYWNjZWxlcmF0b3IgZm9yIHRoaXMgbGlzdGVuZXJcbiAgICovXG4gIHJlYWRvbmx5IGFjY2VsZXJhdG9yOiBJQWNjZWxlcmF0b3I7XG59XG5cbi8qKlxuICogVGhlIGxpc3Qgb2YgcG9ydCByYW5nZXMgZm9yIHRoZSBjb25uZWN0aW9ucyBmcm9tIGNsaWVudHMgdG8gdGhlIGFjY2VsZXJhdG9yLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFBvcnRSYW5nZSB7XG4gIC8qKlxuICAgKiBUaGUgZmlyc3QgcG9ydCBpbiB0aGUgcmFuZ2Ugb2YgcG9ydHMsIGluY2x1c2l2ZS5cbiAgICovXG4gIHJlYWRvbmx5IGZyb21Qb3J0OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBsYXN0IHBvcnQgaW4gdGhlIHJhbmdlIG9mIHBvcnRzLCBpbmNsdXNpdmUuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gc2FtZSBhcyBgZnJvbVBvcnRgXG4gICAqL1xuICByZWFkb25seSB0b1BvcnQ/OiBudW1iZXI7XG59XG5cbi8qKlxuICogVGhlIHByb3RvY29sIGZvciB0aGUgY29ubmVjdGlvbnMgZnJvbSBjbGllbnRzIHRvIHRoZSBhY2NlbGVyYXRvci5cbiAqL1xuZXhwb3J0IGVudW0gQ29ubmVjdGlvblByb3RvY29sIHtcbiAgLyoqXG4gICAqIFRDUFxuICAgKi9cbiAgVENQID0gJ1RDUCcsXG4gIC8qKlxuICAgKiBVRFBcbiAgICovXG4gIFVEUCA9ICdVRFAnLFxufVxuXG4vKipcbiAqIENsaWVudCBhZmZpbml0eSBnaXZlcyB5b3UgY29udHJvbCBvdmVyIHdoZXRoZXIgdG8gYWx3YXlzIHJvdXRlIGVhY2ggY2xpZW50IHRvIHRoZSBzYW1lIHNwZWNpZmljIGVuZHBvaW50LlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2dsb2JhbC1hY2NlbGVyYXRvci9sYXRlc3QvZGcvYWJvdXQtbGlzdGVuZXJzLmh0bWwjYWJvdXQtbGlzdGVuZXJzLWNsaWVudC1hZmZpbml0eVxuICovXG5leHBvcnQgZW51bSBDbGllbnRBZmZpbml0eSB7XG4gIC8qKlxuICAgKiBSb3V0ZSB0cmFmZmljIGJhc2VkIG9uIHRoZSA1LXR1cGxlIGAoc291cmNlIElQLCBzb3VyY2UgcG9ydCwgZGVzdGluYXRpb24gSVAsIGRlc3RpbmF0aW9uIHBvcnQsIHByb3RvY29sKWBcbiAgICovXG4gIE5PTkUgPSAnTk9ORScsXG5cbiAgLyoqXG4gICAqIFJvdXRlIHRyYWZmaWMgYmFzZWQgb24gdGhlIDItdHVwbGUgYChzb3VyY2UgSVAsIGRlc3RpbmF0aW9uIElQKWBcbiAgICpcbiAgICogVGhlIHJlc3VsdCBpcyB0aGF0IG11bHRpcGxlIGNvbm5lY3Rpb25zIGZyb20gdGhlIHNhbWUgY2xpZW50IHdpbGwgYmUgcm91dGVkIHRoZSBzYW1lLlxuICAgKi9cbiAgU09VUkNFX0lQID0gJ1NPVVJDRV9JUCcsXG59XG5cbi8qKlxuICogVGhlIGNvbnN0cnVjdCBmb3IgdGhlIExpc3RlbmVyXG4gKi9cbmV4cG9ydCBjbGFzcyBMaXN0ZW5lciBleHRlbmRzIGNkay5SZXNvdXJjZSBpbXBsZW1lbnRzIElMaXN0ZW5lciB7XG4gIC8qKlxuICAgKiBpbXBvcnQgZnJvbSBBUk5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUxpc3RlbmVyQXJuKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGxpc3RlbmVyQXJuOiBzdHJpbmcpOiBJTGlzdGVuZXIge1xuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIGNkay5SZXNvdXJjZSBpbXBsZW1lbnRzIElMaXN0ZW5lciB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgbGlzdGVuZXJBcm4gPSBsaXN0ZW5lckFybjtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoc2NvcGUsIGlkKTtcbiAgfVxuXG4gIHB1YmxpYyByZWFkb25seSBsaXN0ZW5lckFybjogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIGxpc3RlbmVyXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBsaXN0ZW5lck5hbWU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogTGlzdGVuZXJQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBnYS5DZm5MaXN0ZW5lcih0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBhY2NlbGVyYXRvckFybjogcHJvcHMuYWNjZWxlcmF0b3IuYWNjZWxlcmF0b3JBcm4sXG4gICAgICBwb3J0UmFuZ2VzOiBwcm9wcy5wb3J0UmFuZ2VzLm1hcChtID0+ICh7XG4gICAgICAgIGZyb21Qb3J0OiBtLmZyb21Qb3J0LFxuICAgICAgICB0b1BvcnQ6IG0udG9Qb3J0ID8/IG0uZnJvbVBvcnQsXG4gICAgICB9KSksXG4gICAgICBwcm90b2NvbDogcHJvcHMucHJvdG9jb2wgPz8gQ29ubmVjdGlvblByb3RvY29sLlRDUCxcbiAgICAgIGNsaWVudEFmZmluaXR5OiBwcm9wcy5jbGllbnRBZmZpbml0eSA/PyBDbGllbnRBZmZpbml0eS5OT05FLFxuICAgIH0pO1xuXG4gICAgdGhpcy5saXN0ZW5lckFybiA9IHJlc291cmNlLmF0dHJMaXN0ZW5lckFybjtcbiAgICB0aGlzLmxpc3RlbmVyTmFtZSA9IHByb3BzLmxpc3RlbmVyTmFtZSA/PyByZXNvdXJjZS5sb2dpY2FsSWQ7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgbmV3IGVuZHBvaW50IGdyb3VwIHRvIHRoaXMgbGlzdGVuZXJcbiAgICovXG4gIHB1YmxpYyBhZGRFbmRwb2ludEdyb3VwKGlkOiBzdHJpbmcsIG9wdGlvbnM6IEVuZHBvaW50R3JvdXBPcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gbmV3IEVuZHBvaW50R3JvdXAodGhpcywgaWQsIHtcbiAgICAgIGxpc3RlbmVyOiB0aGlzLFxuICAgICAgLi4ub3B0aW9ucyxcbiAgICB9KTtcbiAgfVxufVxuIl19