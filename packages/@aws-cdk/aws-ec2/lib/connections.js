"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connections = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const peer_1 = require("./peer");
/**
 * Manage the allowed network connections for constructs with Security Groups.
 *
 * Security Groups can be thought of as a firewall for network-connected
 * devices. This class makes it easy to allow network connections to and
 * from security groups, and between security groups individually. When
 * establishing connectivity between security groups, it will automatically
 * add rules in both security groups
 *
 * This object can manage one or more security groups.
 */
class Connections {
    constructor(props = {}) {
        /**
         * Underlying securityGroup for this Connections object, if present
         *
         * May be empty if this Connections object is not managing a SecurityGroup,
         * but simply representing a Connectable peer.
         */
        this._securityGroups = new ReactiveList();
        /**
         * The rule that defines how to represent this peer in a security group
         */
        this._securityGroupRules = new ReactiveList();
        /**
         * When doing bidirectional grants between Connections, make sure we don't recursive infinitely
         */
        this.skip = false;
        /**
         * When doing bidirectional grants between Security Groups in different stacks, put the rule on the other SG
         */
        this.remoteRule = false;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_ConnectionsProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Connections);
            }
            throw error;
        }
        this.connections = this;
        this._securityGroups.push(...(props.securityGroups || []));
        this._securityGroupRules.push(...this._securityGroups.asArray());
        if (props.peer) {
            this._securityGroupRules.push(props.peer);
        }
        this.defaultPort = props.defaultPort;
    }
    get securityGroups() {
        return this._securityGroups.asArray();
    }
    /**
     * Add a security group to the list of security groups managed by this object
     */
    addSecurityGroup(...securityGroups) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_ISecurityGroup(securityGroups);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addSecurityGroup);
            }
            throw error;
        }
        for (const securityGroup of securityGroups) {
            this._securityGroups.push(securityGroup);
            this._securityGroupRules.push(securityGroup);
        }
    }
    /**
     * Allow connections to the peer on the given port
     */
    allowTo(other, portRange, description) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_IConnectable(other);
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_Port(portRange);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.allowTo);
            }
            throw error;
        }
        if (this.skip) {
            return;
        }
        const remoteRule = this.remoteRule; // Capture current value into local for callback to close over
        this._securityGroups.forEachAndForever(securityGroup => {
            other.connections._securityGroupRules.forEachAndForever(rule => {
                securityGroup.addEgressRule(rule, portRange, description, remoteRule);
            });
        });
        this.skip = true;
        other.connections.remoteRule = true;
        try {
            other.connections.allowFrom(this, portRange, description);
        }
        finally {
            this.skip = false;
            other.connections.remoteRule = false;
        }
    }
    /**
     * Allow connections from the peer on the given port
     */
    allowFrom(other, portRange, description) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_IConnectable(other);
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_Port(portRange);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.allowFrom);
            }
            throw error;
        }
        if (this.skip) {
            return;
        }
        const remoteRule = this.remoteRule; // Capture current value into local for callback to close over
        this._securityGroups.forEachAndForever(securityGroup => {
            other.connections._securityGroupRules.forEachAndForever(rule => {
                securityGroup.addIngressRule(rule, portRange, description, remoteRule);
            });
        });
        this.skip = true;
        other.connections.remoteRule = true;
        try {
            other.connections.allowTo(this, portRange, description);
        }
        finally {
            this.skip = false;
            other.connections.remoteRule = false;
        }
    }
    /**
     * Allow hosts inside the security group to connect to each other on the given port
     */
    allowInternally(portRange, description) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_Port(portRange);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.allowInternally);
            }
            throw error;
        }
        this._securityGroups.forEachAndForever(securityGroup => {
            this._securityGroupRules.forEachAndForever(rule => {
                securityGroup.addIngressRule(rule, portRange, description);
                securityGroup.addEgressRule(rule, portRange, description);
            });
        });
    }
    /**
     * Allow to all IPv4 ranges
     */
    allowToAnyIpv4(portRange, description) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_Port(portRange);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.allowToAnyIpv4);
            }
            throw error;
        }
        this.allowTo(peer_1.Peer.anyIpv4(), portRange, description);
    }
    /**
     * Allow from any IPv4 ranges
     */
    allowFromAnyIpv4(portRange, description) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_Port(portRange);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.allowFromAnyIpv4);
            }
            throw error;
        }
        this.allowFrom(peer_1.Peer.anyIpv4(), portRange, description);
    }
    /**
     * Allow connections from the peer on our default port
     *
     * Even if the peer has a default port, we will always use our default port.
     */
    allowDefaultPortFrom(other, description) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_IConnectable(other);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.allowDefaultPortFrom);
            }
            throw error;
        }
        if (!this.defaultPort) {
            throw new Error('Cannot call allowDefaultPortFrom(): this resource has no default port');
        }
        this.allowFrom(other, this.defaultPort, description);
    }
    /**
     * Allow hosts inside the security group to connect to each other
     */
    allowDefaultPortInternally(description) {
        if (!this.defaultPort) {
            throw new Error('Cannot call allowDefaultPortInternally(): this resource has no default port');
        }
        this.allowInternally(this.defaultPort, description);
    }
    /**
     * Allow default connections from all IPv4 ranges
     */
    allowDefaultPortFromAnyIpv4(description) {
        if (!this.defaultPort) {
            throw new Error('Cannot call allowDefaultPortFromAnyIpv4(): this resource has no default port');
        }
        this.allowFromAnyIpv4(this.defaultPort, description);
    }
    /**
     * Allow connections to the security group on their default port
     */
    allowToDefaultPort(other, description) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_IConnectable(other);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.allowToDefaultPort);
            }
            throw error;
        }
        if (other.connections.defaultPort === undefined) {
            throw new Error('Cannot call allowToDefaultPort(): other resource has no default port');
        }
        this.allowTo(other, other.connections.defaultPort, description);
    }
    /**
     * Allow connections from the peer on our default port
     *
     * Even if the peer has a default port, we will always use our default port.
     */
    allowDefaultPortTo(other, description) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_IConnectable(other);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.allowDefaultPortTo);
            }
            throw error;
        }
        if (!this.defaultPort) {
            throw new Error('Cannot call allowDefaultPortTo(): this resource has no default port');
        }
        this.allowTo(other, this.defaultPort, description);
    }
}
exports.Connections = Connections;
_a = JSII_RTTI_SYMBOL_1;
Connections[_a] = { fqn: "@aws-cdk/aws-ec2.Connections", version: "0.0.0" };
class ReactiveList {
    constructor() {
        this.elements = new Array();
        this.listeners = new Array();
    }
    push(...xs) {
        this.elements.push(...xs);
        for (const listener of this.listeners) {
            for (const x of xs) {
                listener(x);
            }
        }
    }
    forEachAndForever(listener) {
        for (const element of this.elements) {
            listener(element);
        }
        this.listeners.push(listener);
    }
    asArray() {
        return this.elements.slice();
    }
    get length() {
        return this.elements.length;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb25uZWN0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxpQ0FBcUM7QUF3RHJDOzs7Ozs7Ozs7O0dBVUc7QUFDSCxNQUFhLFdBQVc7SUErQnRCLFlBQVksUUFBMEIsRUFBRTtRQXZCeEM7Ozs7O1dBS0c7UUFDYyxvQkFBZSxHQUFHLElBQUksWUFBWSxFQUFrQixDQUFDO1FBRXRFOztXQUVHO1FBQ2Msd0JBQW1CLEdBQUcsSUFBSSxZQUFZLEVBQVMsQ0FBQztRQUVqRTs7V0FFRztRQUNLLFNBQUksR0FBWSxLQUFLLENBQUM7UUFFOUI7O1dBRUc7UUFDSyxlQUFVLEdBQVksS0FBSyxDQUFDOzs7Ozs7K0NBN0J6QixXQUFXOzs7O1FBZ0NwQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztRQUN4QixJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLGNBQWMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRTNELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDakUsSUFBSSxLQUFLLENBQUMsSUFBSSxFQUFFO1lBQ2QsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDM0M7UUFFRCxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7S0FDdEM7SUFFRCxJQUFXLGNBQWM7UUFDdkIsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ3ZDO0lBRUQ7O09BRUc7SUFDSSxnQkFBZ0IsQ0FBQyxHQUFHLGNBQWdDOzs7Ozs7Ozs7O1FBQ3pELEtBQUssTUFBTSxhQUFhLElBQUksY0FBYyxFQUFFO1lBQzFDLElBQUksQ0FB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LEVBQUUsQ0FBQztLQUM5QjtJQUVELElBQVcsTUFBTTtRQUNmLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7S0FDN0I7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElQZWVyLCBQZWVyIH0gZnJvbSAnLi9wZWVyJztcbmltcG9ydCB7IFBvcnQgfSBmcm9tICcuL3BvcnQnO1xuaW1wb3J0IHsgSVNlY3VyaXR5R3JvdXAgfSBmcm9tICcuL3NlY3VyaXR5LWdyb3VwJztcblxuLyoqXG4gKiBUaGUgZ29hbCBvZiB0aGlzIG1vZHVsZSBpcyB0byBtYWtlIHBvc3NpYmxlIHRvIHdyaXRlIHN0YXRlbWVudHMgbGlrZSB0aGlzOlxuICpcbiAqICBgYGB0c1xuICogIGRhdGFiYXNlLmNvbm5lY3Rpb25zLmFsbG93RnJvbShmbGVldCk7XG4gKiAgZmxlZXQuY29ubmVjdGlvbnMuYWxsb3dUbyhkYXRhYmFzZSk7XG4gKiAgcmRndy5jb25uZWN0aW9ucy5hbGxvd0Zyb21DaWRySXAoJzAuMy4xLjUvODYnKTtcbiAqICByZ2R3LmNvbm5lY3Rpb25zLmFsbG93VHJhZmZpY1RvKGZsZWV0LCBuZXcgQWxsUG9ydHMoKSk7XG4gKiAgYGBgXG4gKlxuICogVGhlIGluc2lnaHQgaGVyZSBpcyB0aGF0IHNvbWUgY29ubmVjdGluZyBwZWVycyBoYXZlIGluZm9ybWF0aW9uIG9uIHdoYXQgcG9ydHMgc2hvdWxkXG4gKiBiZSBpbnZvbHZlZCBpbiB0aGUgY29ubmVjdGlvbiwgYW5kIHNvbWUgZG9uJ3QuXG4gKi9cblxuLyoqXG4gKiBBbiBvYmplY3QgdGhhdCBoYXMgYSBDb25uZWN0aW9ucyBvYmplY3RcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJQ29ubmVjdGFibGUge1xuICAvKipcbiAgICogVGhlIG5ldHdvcmsgY29ubmVjdGlvbnMgYXNzb2NpYXRlZCB3aXRoIHRoaXMgcmVzb3VyY2UuXG4gICAqL1xuICByZWFkb25seSBjb25uZWN0aW9uczogQ29ubmVjdGlvbnM7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyB0byBpbnRpYWxpemUgYSBuZXcgQ29ubmVjdGlvbnMgb2JqZWN0XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29ubmVjdGlvbnNQcm9wcyB7XG4gIC8qKlxuICAgKiBDbGFzcyB0aGF0IHJlcHJlc2VudHMgdGhlIHJ1bGUgYnkgd2hpY2ggb3RoZXJzIGNhbiBjb25uZWN0IHRvIHRoaXMgY29ubmVjdGFibGVcbiAgICpcbiAgICogVGhpcyBvYmplY3QgaXMgcmVxdWlyZWQsIGJ1dCB3aWxsIGJlIGRlcml2ZWQgZnJvbSBzZWN1cml0eUdyb3VwIGlmIHRoYXQgaXMgcGFzc2VkLlxuICAgKlxuICAgKiBAZGVmYXVsdCBEZXJpdmVkIGZyb20gc2VjdXJpdHlHcm91cCBpZiBzZXQuXG4gICAqL1xuICByZWFkb25seSBwZWVyPzogSVBlZXI7XG5cbiAgLyoqXG4gICAqIFdoYXQgc2VjdXJpdHlHcm91cChzKSB0aGlzIG9iamVjdCBpcyBtYW5hZ2luZyBjb25uZWN0aW9ucyBmb3JcbiAgICpcbiAgICogQGRlZmF1bHQgTm8gc2VjdXJpdHkgZ3JvdXBzXG4gICAqL1xuICByZWFkb25seSBzZWN1cml0eUdyb3Vwcz86IElTZWN1cml0eUdyb3VwW107XG5cbiAgLyoqXG4gICAqIERlZmF1bHQgcG9ydCByYW5nZSBmb3IgaW5pdGlhdGluZyBjb25uZWN0aW9ucyB0byBhbmQgZnJvbSB0aGlzIG9iamVjdFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGRlZmF1bHQgcG9ydFxuICAgKi9cbiAgcmVhZG9ubHkgZGVmYXVsdFBvcnQ/OiBQb3J0O1xufVxuXG4vKipcbiAqIE1hbmFnZSB0aGUgYWxsb3dlZCBuZXR3b3JrIGNvbm5lY3Rpb25zIGZvciBjb25zdHJ1Y3RzIHdpdGggU2VjdXJpdHkgR3JvdXBzLlxuICpcbiAqIFNlY3VyaXR5IEdyb3VwcyBjYW4gYmUgdGhvdWdodCBvZiBhcyBhIGZpcmV3YWxsIGZvciBuZXR3b3JrLWNvbm5lY3RlZFxuICogZGV2aWNlcy4gVGhpcyBjbGFzcyBtYWtlcyBpdCBlYXN5IHRvIGFsbG93IG5ldHdvcmsgY29ubmVjdGlvbnMgdG8gYW5kXG4gKiBmcm9tIHNlY3VyaXR5IGdyb3VwcywgYW5kIGJldHdlZW4gc2VjdXJpdHkgZ3JvdXBzIGluZGl2aWR1YWxseS4gV2hlblxuICogZXN0YWJsaXNoaW5nIGNvbm5lY3Rpdml0eSBiZXR3ZWVuIHNlY3VyaXR5IGdyb3VwcywgaXQgd2lsbCBhdXRvbWF0aWNhbGx5XG4gKiBhZGQgcnVsZXMgaW4gYm90aCBzZWN1cml0eSBncm91cHNcbiAqXG4gKiBUaGlzIG9iamVjdCBjYW4gbWFuYWdlIG9uZSBvciBtb3JlIHNlY3VyaXR5IGdyb3Vwcy5cbiAqL1xuZXhwb3J0IGNsYXNzIENvbm5lY3Rpb25zIGltcGxlbWVudHMgSUNvbm5lY3RhYmxlIHtcbiAgcHVibGljIHJlYWRvbmx5IGNvbm5lY3Rpb25zOiBDb25uZWN0aW9ucztcblxuICAvKipcbiAgICogVGhlIGRlZmF1bHQgcG9ydCBjb25maWd1cmVkIGZvciB0aGlzIGNvbm5lY3Rpb24gcGVlciwgaWYgYXZhaWxhYmxlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZGVmYXVsdFBvcnQ/OiBQb3J0O1xuXG4gIC8qKlxuICAgKiBVbmRlcmx5aW5nIHNlY3VyaXR5R3JvdXAgZm9yIHRoaXMgQ29ubmVjdGlvbnMgb2JqZWN0LCBpZiBwcmVzZW50XG4gICAqXG4gICAqIE1heSBiZSBlbXB0eSBpZiB0aGlzIENvbm5lY3Rpb25zIG9iamVjdCBpcyBub3QgbWFuYWdpbmcgYSBTZWN1cml0eUdyb3VwLFxuICAgKiBidXQgc2ltcGx5IHJlcHJlc2VudGluZyBhIENvbm5lY3RhYmxlIHBlZXIuXG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9zZWN1cml0eUdyb3VwcyA9IG5ldyBSZWFjdGl2ZUxpc3Q8SVNlY3VyaXR5R3JvdXA+KCk7XG5cbiAgLyoqXG4gICAqIFRoZSBydWxlIHRoYXQgZGVmaW5lcyBob3cgdG8gcmVwcmVzZW50IHRoaXMgcGVlciBpbiBhIHNlY3VyaXR5IGdyb3VwXG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9zZWN1cml0eUdyb3VwUnVsZXMgPSBuZXcgUmVhY3RpdmVMaXN0PElQZWVyPigpO1xuXG4gIC8qKlxuICAgKiBXaGVuIGRvaW5nIGJpZGlyZWN0aW9uYWwgZ3JhbnRzIGJldHdlZW4gQ29ubmVjdGlvbnMsIG1ha2Ugc3VyZSB3ZSBkb24ndCByZWN1cnNpdmUgaW5maW5pdGVseVxuICAgKi9cbiAgcHJpdmF0ZSBza2lwOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFdoZW4gZG9pbmcgYmlkaXJlY3Rpb25hbCBncmFudHMgYmV0d2VlbiBTZWN1cml0eSBHcm91cHMgaW4gZGlmZmVyZW50IHN0YWNrcywgcHV0IHRoZSBydWxlIG9uIHRoZSBvdGhlciBTR1xuICAgKi9cbiAgcHJpdmF0ZSByZW1vdGVSdWxlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHJvcHM6IENvbm5lY3Rpb25zUHJvcHMgPSB7fSkge1xuICAgIHRoaXMuY29ubmVjdGlvbnMgPSB0aGlzO1xuICAgIHRoaXMuX3NlY3VyaXR5R3JvdXBzLnB1c2goLi4uKHByb3BzLnNlY3VyaXR5R3JvdXBzIHx8IFtdKSk7XG5cbiAgICB0aGlzLl9zZWN1cml0eUdyb3VwUnVsZXMucHVzaCguLi50aGlzLl9zZWN1cml0eUdyb3Vwcy5hc0FycmF5KCkpO1xuICAgIGlmIChwcm9wcy5wZWVyKSB7XG4gICAgICB0aGlzLl9zZWN1cml0eUdyb3VwUnVsZXMucHVzaChwcm9wcy5wZWVyKTtcbiAgICB9XG5cbiAgICB0aGlzLmRlZmF1bHRQb3J0ID0gcHJvcHMuZGVmYXVsdFBvcnQ7XG4gIH1cblxuICBwdWJsaWMgZ2V0IHNlY3VyaXR5R3JvdXBzKCk6IElTZWN1cml0eUdyb3VwW10ge1xuICAgIHJldHVybiB0aGlzLl9zZWN1cml0eUdyb3Vwcy5hc0FycmF5KCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgc2VjdXJpdHkgZ3JvdXAgdG8gdGhlIGxpc3Qgb2Ygc2VjdXJpdHkgZ3JvdXBzIG1hbmFnZWQgYnkgdGhpcyBvYmplY3RcbiAgICovXG4gIHB1YmxpYyBhZGRTZWN1cml0eUdyb3VwKC4uLnNlY3VyaXR5R3JvdXBzOiBJU2VjdXJpdHlHcm91cFtdKSB7XG4gICAgZm9yIChjb25zdCBzZWN1cml0eUdyb3VwIG9mIHNlY3VyaXR5R3JvdXBzKSB7XG4gICAgICB0aGlzLl9zZWN1cml0eUdyb3Vwcy5wdXNoKHNlY3VyaXR5R3JvdXApO1xuICAgICAgdGhpcy5fc2VjdXJpdHlHcm91cFJ1bGVzLnB1c2goc2VjdXJpdHlHcm91cCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFsbG93IGNvbm5lY3Rpb25zIHRvIHRoZSBwZWVyIG9uIHRoZSBnaXZlbiBwb3J0XG4gICAqL1xuICBwdWJsaWMgYWxsb3dUbyhvdGhlcjogSUNvbm5lY3RhYmxlLCBwb3J0UmFuZ2U6IFBvcnQsIGRlc2NyaXB0aW9uPzogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuc2tpcCkgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IHJlbW90ZVJ1bGUgPSB0aGlzLnJlbW90ZVJ1bGU7IC8vIENhcHR1cmUgY3VycmVudCB2YWx1ZSBpbnRvIGxvY2FsIGZvciBjYWxsYmFjayB0byBjbG9zZSBvdmVyXG4gICAgdGhpcy5fc2VjdXJpdHlHcm91cHMuZm9yRWFjaEFuZEZvcmV2ZXIoc2VjdXJpdHlHcm91cCA9PiB7XG4gICAgICBvdGhlci5jb25uZWN0aW9ucy5fc2VjdXJpdHlHcm91cFJ1bGVzLmZvckVhY2hBbmRGb3JldmVyKHJ1bGUgPT4ge1xuICAgICAgICBzZWN1cml0eUdyb3VwLmFkZEVncmVzc1J1bGUocnVsZSwgcG9ydFJhbmdlLCBkZXNjcmlwdGlvbiwgcmVtb3RlUnVsZSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMuc2tpcCA9IHRydWU7XG4gICAgb3RoZXIuY29ubmVjdGlvbnMucmVtb3RlUnVsZSA9IHRydWU7XG4gICAgdHJ5IHtcbiAgICAgIG90aGVyLmNvbm5lY3Rpb25zLmFsbG93RnJvbSh0aGlzLCBwb3J0UmFuZ2UsIGRlc2NyaXB0aW9uKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5za2lwID0gZmFsc2U7XG4gICAgICBvdGhlci5jb25uZWN0aW9ucy5yZW1vdGVSdWxlID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFsbG93IGNvbm5lY3Rpb25zIGZyb20gdGhlIHBlZXIgb24gdGhlIGdpdmVuIHBvcnRcbiAgICovXG4gIHB1YmxpYyBhbGxvd0Zyb20ob3RoZXI6IElDb25uZWN0YWJsZSwgcG9ydFJhbmdlOiBQb3J0LCBkZXNjcmlwdGlvbj86IHN0cmluZykge1xuICAgIGlmICh0aGlzLnNraXApIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCByZW1vdGVSdWxlID0gdGhpcy5yZW1vdGVSdWxlOyAvLyBDYXB0dXJlIGN1cnJlbnQgdmFsdWUgaW50byBsb2NhbCBmb3IgY2FsbGJhY2sgdG8gY2xvc2Ugb3ZlclxuICAgIHRoaXMuX3NlY3VyaXR5R3JvdXBzLmZvckVhY2hBbmRGb3JldmVyKHNlY3VyaXR5R3JvdXAgPT4ge1xuICAgICAgb3RoZXIuY29ubmVjdGlvbnMuX3NlY3VyaXR5R3JvdXBSdWxlcy5mb3JFYWNoQW5kRm9yZXZlcihydWxlID0+IHtcbiAgICAgICAgc2VjdXJpdHlHcm91cC5hZGRJbmdyZXNzUnVsZShydWxlLCBwb3J0UmFuZ2UsIGRlc2NyaXB0aW9uLCByZW1vdGVSdWxlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5za2lwID0gdHJ1ZTtcbiAgICBvdGhlci5jb25uZWN0aW9ucy5yZW1vdGVSdWxlID0gdHJ1ZTtcbiAgICB0cnkge1xuICAgICAgb3RoZXIuY29ubmVjdGlvbnMuYWxsb3dUbyh0aGlzLCBwb3J0UmFuZ2UsIGRlc2NyaXB0aW9uKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5za2lwID0gZmFsc2U7XG4gICAgICBvdGhlci5jb25uZWN0aW9ucy5yZW1vdGVSdWxlID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFsbG93IGhvc3RzIGluc2lkZSB0aGUgc2VjdXJpdHkgZ3JvdXAgdG8gY29ubmVjdCB0byBlYWNoIG90aGVyIG9uIHRoZSBnaXZlbiBwb3J0XG4gICAqL1xuICBwdWJsaWMgYWxsb3dJbnRlcm5hbGx5KHBvcnRSYW5nZTogUG9ydCwgZGVzY3JpcHRpb24/OiBzdHJpbmcpIHtcbiAgICB0aGlzLl9zZWN1cml0eUdyb3Vwcy5mb3JFYWNoQW5kRm9yZXZlcihzZWN1cml0eUdyb3VwID0+IHtcbiAgICAgIHRoaXMuX3NlY3VyaXR5R3JvdXBSdWxlcy5mb3JFYWNoQW5kRm9yZXZlcihydWxlID0+IHtcbiAgICAgICAgc2VjdXJpdHlHcm91cC5hZGRJbmdyZXNzUnVsZShydWxlLCBwb3J0UmFuZ2UsIGRlc2NyaXB0aW9uKTtcbiAgICAgICAgc2VjdXJpdHlHcm91cC5hZGRFZ3Jlc3NSdWxlKHJ1bGUsIHBvcnRSYW5nZSwgZGVzY3JpcHRpb24pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQWxsb3cgdG8gYWxsIElQdjQgcmFuZ2VzXG4gICAqL1xuICBwdWJsaWMgYWxsb3dUb0FueUlwdjQocG9ydFJhbmdlOiBQb3J0LCBkZXNjcmlwdGlvbj86IHN0cmluZykge1xuICAgIHRoaXMuYWxsb3dUbyhQZWVyLmFueUlwdjQoKSwgcG9ydFJhbmdlLCBkZXNjcmlwdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogQWxsb3cgZnJvbSBhbnkgSVB2NCByYW5nZXNcbiAgICovXG4gIHB1YmxpYyBhbGxvd0Zyb21BbnlJcHY0KHBvcnRSYW5nZTogUG9ydCwgZGVzY3JpcHRpb24/OiBzdHJpbmcpIHtcbiAgICB0aGlzLmFsbG93RnJvbShQZWVyLmFueUlwdjQoKSwgcG9ydFJhbmdlLCBkZXNjcmlwdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogQWxsb3cgY29ubmVjdGlvbnMgZnJvbSB0aGUgcGVlciBvbiBvdXIgZGVmYXVsdCBwb3J0XG4gICAqXG4gICAqIEV2ZW4gaWYgdGhlIHBlZXIgaGFzIGEgZGVmYXVsdCBwb3J0LCB3ZSB3aWxsIGFsd2F5cyB1c2Ugb3VyIGRlZmF1bHQgcG9ydC5cbiAgICovXG4gIHB1YmxpYyBhbGxvd0RlZmF1bHRQb3J0RnJvbShvdGhlcjogSUNvbm5lY3RhYmxlLCBkZXNjcmlwdGlvbj86IHN0cmluZykge1xuICAgIGlmICghdGhpcy5kZWZhdWx0UG9ydCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY2FsbCBhbGxvd0RlZmF1bHRQb3J0RnJvbSgpOiB0aGlzIHJlc291cmNlIGhhcyBubyBkZWZhdWx0IHBvcnQnKTtcbiAgICB9XG4gICAgdGhpcy5hbGxvd0Zyb20ob3RoZXIsIHRoaXMuZGVmYXVsdFBvcnQsIGRlc2NyaXB0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbGxvdyBob3N0cyBpbnNpZGUgdGhlIHNlY3VyaXR5IGdyb3VwIHRvIGNvbm5lY3QgdG8gZWFjaCBvdGhlclxuICAgKi9cbiAgcHVibGljIGFsbG93RGVmYXVsdFBvcnRJbnRlcm5hbGx5KGRlc2NyaXB0aW9uPzogc3RyaW5nKSB7XG4gICAgaWYgKCF0aGlzLmRlZmF1bHRQb3J0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBjYWxsIGFsbG93RGVmYXVsdFBvcnRJbnRlcm5hbGx5KCk6IHRoaXMgcmVzb3VyY2UgaGFzIG5vIGRlZmF1bHQgcG9ydCcpO1xuICAgIH1cbiAgICB0aGlzLmFsbG93SW50ZXJuYWxseSh0aGlzLmRlZmF1bHRQb3J0LCBkZXNjcmlwdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogQWxsb3cgZGVmYXVsdCBjb25uZWN0aW9ucyBmcm9tIGFsbCBJUHY0IHJhbmdlc1xuICAgKi9cbiAgcHVibGljIGFsbG93RGVmYXVsdFBvcnRGcm9tQW55SXB2NChkZXNjcmlwdGlvbj86IHN0cmluZykge1xuICAgIGlmICghdGhpcy5kZWZhdWx0UG9ydCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY2FsbCBhbGxvd0RlZmF1bHRQb3J0RnJvbUFueUlwdjQoKTogdGhpcyByZXNvdXJjZSBoYXMgbm8gZGVmYXVsdCBwb3J0Jyk7XG4gICAgfVxuICAgIHRoaXMuYWxsb3dGcm9tQW55SXB2NCh0aGlzLmRlZmF1bHRQb3J0LCBkZXNjcmlwdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogQWxsb3cgY29ubmVjdGlvbnMgdG8gdGhlIHNlY3VyaXR5IGdyb3VwIG9uIHRoZWlyIGRlZmF1bHQgcG9ydFxuICAgKi9cbiAgcHVibGljIGFsbG93VG9EZWZhdWx0UG9ydChvdGhlcjogSUNvbm5lY3RhYmxlLCBkZXNjcmlwdGlvbj86IHN0cmluZykge1xuICAgIGlmIChvdGhlci5jb25uZWN0aW9ucy5kZWZhdWx0UG9ydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBjYWxsIGFsbG93VG9EZWZhdWx0UG9ydCgpOiBvdGhlciByZXNvdXJjZSBoYXMgbm8gZGVmYXVsdCBwb3J0Jyk7XG4gICAgfVxuXG4gICAgdGhpcy5hbGxvd1RvKG90aGVyLCBvdGhlci5jb25uZWN0aW9ucy5kZWZhdWx0UG9ydCwgZGVzY3JpcHRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFsbG93IGNvbm5lY3Rpb25zIGZyb20gdGhlIHBlZXIgb24gb3VyIGRlZmF1bHQgcG9ydFxuICAgKlxuICAgKiBFdmVuIGlmIHRoZSBwZWVyIGhhcyBhIGRlZmF1bHQgcG9ydCwgd2Ugd2lsbCBhbHdheXMgdXNlIG91ciBkZWZhdWx0IHBvcnQuXG4gICAqL1xuICBwdWJsaWMgYWxsb3dEZWZhdWx0UG9ydFRvKG90aGVyOiBJQ29ubmVjdGFibGUsIGRlc2NyaXB0aW9uPzogc3RyaW5nKSB7XG4gICAgaWYgKCF0aGlzLmRlZmF1bHRQb3J0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBjYWxsIGFsbG93RGVmYXVsdFBvcnRUbygpOiB0aGlzIHJlc291cmNlIGhhcyBubyBkZWZhdWx0IHBvcnQnKTtcbiAgICB9XG4gICAgdGhpcy5hbGxvd1RvKG90aGVyLCB0aGlzLmRlZmF1bHRQb3J0LCBkZXNjcmlwdGlvbik7XG4gIH1cbn1cblxudHlwZSBBY3Rpb248VD4gPSAoeDogVCkgPT4gdm9pZDtcblxuY2xhc3MgUmVhY3RpdmVMaXN0PFQ+IHtcbiAgcHJpdmF0ZSByZWFkb25seSBlbGVtZW50cyA9IG5ldyBBcnJheTxUPigpO1xuICBwcml2YXRlIHJlYWRvbmx5IGxpc3RlbmVycyA9IG5ldyBBcnJheTxBY3Rpb248VD4+KCk7XG5cbiAgcHVibGljIHB1c2goLi4ueHM6IFRbXSkge1xuICAgIHRoaXMuZWxlbWVudHMucHVzaCguLi54cyk7XG4gICAgZm9yIChjb25zdCBsaXN0ZW5lciBvZiB0aGlzLmxpc3RlbmVycykge1xuICAgICAgZm9yIChjb25zdCB4IG9mIHhzKSB7XG4gICAgICAgIGxpc3RlbmVyKHgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBmb3JFYWNoQW5kRm9yZXZlcihsaXN0ZW5lcjogQWN0aW9uPFQ+KSB7XG4gICAgZm9yIChjb25zdCBlbGVtZW50IG9mIHRoaXMuZWxlbWVudHMpIHtcbiAgICAgIGxpc3RlbmVyKGVsZW1lbnQpO1xuICAgIH1cbiAgICB0aGlzLmxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgfVxuXG4gIHB1YmxpYyBhc0FycmF5KCk6IFRbXSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudHMuc2xpY2UoKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudHMubGVuZ3RoO1xuICB9XG59XG4iXX0=