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
_a = JSII_RTTI_SYMBOL_1;
Connections[_a] = { fqn: "@aws-cdk/aws-ec2.Connections", version: "0.0.0" };
exports.Connections = Connections;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb25uZWN0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxpQ0FBcUM7QUF3RHJDOzs7Ozs7Ozs7O0dBVUc7QUFDSCxNQUFhLFdBQVc7SUErQnRCLFlBQVksUUFBMEIsRUFBRTtRQXZCeEM7Ozs7O1dBS0c7UUFDYyxvQkFBZSxHQUFHLElBQUksWUFBWSxFQUFrQixDQUFDO1FBRXRFOztXQUVHO1FBQ2Msd0JBQW1CLEdBQUcsSUFBSSxZQUFZLEVBQVMsQ0FBQztRQUVqRTs7V0FFRztRQUNLLFNBQUksR0FBWSxLQUFLLENBQUM7UUFFOUI7O1dBRUc7UUFDSyxlQUFVLEdBQVksS0FBSyxDQUFDOzs7Ozs7K0NBN0J6QixXQUFXOzs7O1FBZ0NwQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztRQUN4QixJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLGNBQWMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRTNELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDakUsSUFBSSxLQUFLLENBQUMsSUFBSSxFQUFFO1lBQ2QsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDM0M7UUFFRCxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7S0FDdEM7SUFFRCxJQUFXLGNBQWM7UUFDdkIsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ3ZDO0lBRUQ7O09BRUc7SUFDSSxnQkFBZ0IsQ0FBQyxHQUFHLGNBQWdDOzs7Ozs7Ozs7O1FBQ3pELEtBQUssTUFBTSxhQUFhLElBQUksY0FBYyxFQUFFO1lBQzFDLElBQUksQ0FB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SyxFQUFFLENBQUM7S0FDOUI7SUFFRCxJQUFXLE1BQU07UUFDZixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO0tBQzdCO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJUGVlciwgUGVlciB9IGZyb20gJy4vcGVlcic7XG5pbXBvcnQgeyBQb3J0IH0gZnJvbSAnLi9wb3J0JztcbmltcG9ydCB7IElTZWN1cml0eUdyb3VwIH0gZnJvbSAnLi9zZWN1cml0eS1ncm91cCc7XG5cbi8qKlxuICogVGhlIGdvYWwgb2YgdGhpcyBtb2R1bGUgaXMgdG8gbWFrZSBwb3NzaWJsZSB0byB3cml0ZSBzdGF0ZW1lbnRzIGxpa2UgdGhpczpcbiAqXG4gKiAgYGBgdHNcbiAqICBkYXRhYmFzZS5jb25uZWN0aW9ucy5hbGxvd0Zyb20oZmxlZXQpO1xuICogIGZsZWV0LmNvbm5lY3Rpb25zLmFsbG93VG8oZGF0YWJhc2UpO1xuICogIHJkZ3cuY29ubmVjdGlvbnMuYWxsb3dGcm9tQ2lkcklwKCcwLjMuMS41Lzg2Jyk7XG4gKiAgcmdkdy5jb25uZWN0aW9ucy5hbGxvd1RyYWZmaWNUbyhmbGVldCwgbmV3IEFsbFBvcnRzKCkpO1xuICogIGBgYFxuICpcbiAqIFRoZSBpbnNpZ2h0IGhlcmUgaXMgdGhhdCBzb21lIGNvbm5lY3RpbmcgcGVlcnMgaGF2ZSBpbmZvcm1hdGlvbiBvbiB3aGF0IHBvcnRzIHNob3VsZFxuICogYmUgaW52b2x2ZWQgaW4gdGhlIGNvbm5lY3Rpb24sIGFuZCBzb21lIGRvbid0LlxuICovXG5cbi8qKlxuICogQW4gb2JqZWN0IHRoYXQgaGFzIGEgQ29ubmVjdGlvbnMgb2JqZWN0XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUNvbm5lY3RhYmxlIHtcbiAgLyoqXG4gICAqIFRoZSBuZXR3b3JrIGNvbm5lY3Rpb25zIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHJlc291cmNlLlxuICAgKi9cbiAgcmVhZG9ubHkgY29ubmVjdGlvbnM6IENvbm5lY3Rpb25zO1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgdG8gaW50aWFsaXplIGEgbmV3IENvbm5lY3Rpb25zIG9iamVjdFxuICovXG5leHBvcnQgaW50ZXJmYWNlIENvbm5lY3Rpb25zUHJvcHMge1xuICAvKipcbiAgICogQ2xhc3MgdGhhdCByZXByZXNlbnRzIHRoZSBydWxlIGJ5IHdoaWNoIG90aGVycyBjYW4gY29ubmVjdCB0byB0aGlzIGNvbm5lY3RhYmxlXG4gICAqXG4gICAqIFRoaXMgb2JqZWN0IGlzIHJlcXVpcmVkLCBidXQgd2lsbCBiZSBkZXJpdmVkIGZyb20gc2VjdXJpdHlHcm91cCBpZiB0aGF0IGlzIHBhc3NlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgRGVyaXZlZCBmcm9tIHNlY3VyaXR5R3JvdXAgaWYgc2V0LlxuICAgKi9cbiAgcmVhZG9ubHkgcGVlcj86IElQZWVyO1xuXG4gIC8qKlxuICAgKiBXaGF0IHNlY3VyaXR5R3JvdXAocykgdGhpcyBvYmplY3QgaXMgbWFuYWdpbmcgY29ubmVjdGlvbnMgZm9yXG4gICAqXG4gICAqIEBkZWZhdWx0IE5vIHNlY3VyaXR5IGdyb3Vwc1xuICAgKi9cbiAgcmVhZG9ubHkgc2VjdXJpdHlHcm91cHM/OiBJU2VjdXJpdHlHcm91cFtdO1xuXG4gIC8qKlxuICAgKiBEZWZhdWx0IHBvcnQgcmFuZ2UgZm9yIGluaXRpYXRpbmcgY29ubmVjdGlvbnMgdG8gYW5kIGZyb20gdGhpcyBvYmplY3RcbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBkZWZhdWx0IHBvcnRcbiAgICovXG4gIHJlYWRvbmx5IGRlZmF1bHRQb3J0PzogUG9ydDtcbn1cblxuLyoqXG4gKiBNYW5hZ2UgdGhlIGFsbG93ZWQgbmV0d29yayBjb25uZWN0aW9ucyBmb3IgY29uc3RydWN0cyB3aXRoIFNlY3VyaXR5IEdyb3Vwcy5cbiAqXG4gKiBTZWN1cml0eSBHcm91cHMgY2FuIGJlIHRob3VnaHQgb2YgYXMgYSBmaXJld2FsbCBmb3IgbmV0d29yay1jb25uZWN0ZWRcbiAqIGRldmljZXMuIFRoaXMgY2xhc3MgbWFrZXMgaXQgZWFzeSB0byBhbGxvdyBuZXR3b3JrIGNvbm5lY3Rpb25zIHRvIGFuZFxuICogZnJvbSBzZWN1cml0eSBncm91cHMsIGFuZCBiZXR3ZWVuIHNlY3VyaXR5IGdyb3VwcyBpbmRpdmlkdWFsbHkuIFdoZW5cbiAqIGVzdGFibGlzaGluZyBjb25uZWN0aXZpdHkgYmV0d2VlbiBzZWN1cml0eSBncm91cHMsIGl0IHdpbGwgYXV0b21hdGljYWxseVxuICogYWRkIHJ1bGVzIGluIGJvdGggc2VjdXJpdHkgZ3JvdXBzXG4gKlxuICogVGhpcyBvYmplY3QgY2FuIG1hbmFnZSBvbmUgb3IgbW9yZSBzZWN1cml0eSBncm91cHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBDb25uZWN0aW9ucyBpbXBsZW1lbnRzIElDb25uZWN0YWJsZSB7XG4gIHB1YmxpYyByZWFkb25seSBjb25uZWN0aW9uczogQ29ubmVjdGlvbnM7XG5cbiAgLyoqXG4gICAqIFRoZSBkZWZhdWx0IHBvcnQgY29uZmlndXJlZCBmb3IgdGhpcyBjb25uZWN0aW9uIHBlZXIsIGlmIGF2YWlsYWJsZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGRlZmF1bHRQb3J0PzogUG9ydDtcblxuICAvKipcbiAgICogVW5kZXJseWluZyBzZWN1cml0eUdyb3VwIGZvciB0aGlzIENvbm5lY3Rpb25zIG9iamVjdCwgaWYgcHJlc2VudFxuICAgKlxuICAgKiBNYXkgYmUgZW1wdHkgaWYgdGhpcyBDb25uZWN0aW9ucyBvYmplY3QgaXMgbm90IG1hbmFnaW5nIGEgU2VjdXJpdHlHcm91cCxcbiAgICogYnV0IHNpbXBseSByZXByZXNlbnRpbmcgYSBDb25uZWN0YWJsZSBwZWVyLlxuICAgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfc2VjdXJpdHlHcm91cHMgPSBuZXcgUmVhY3RpdmVMaXN0PElTZWN1cml0eUdyb3VwPigpO1xuXG4gIC8qKlxuICAgKiBUaGUgcnVsZSB0aGF0IGRlZmluZXMgaG93IHRvIHJlcHJlc2VudCB0aGlzIHBlZXIgaW4gYSBzZWN1cml0eSBncm91cFxuICAgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfc2VjdXJpdHlHcm91cFJ1bGVzID0gbmV3IFJlYWN0aXZlTGlzdDxJUGVlcj4oKTtcblxuICAvKipcbiAgICogV2hlbiBkb2luZyBiaWRpcmVjdGlvbmFsIGdyYW50cyBiZXR3ZWVuIENvbm5lY3Rpb25zLCBtYWtlIHN1cmUgd2UgZG9uJ3QgcmVjdXJzaXZlIGluZmluaXRlbHlcbiAgICovXG4gIHByaXZhdGUgc2tpcDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBXaGVuIGRvaW5nIGJpZGlyZWN0aW9uYWwgZ3JhbnRzIGJldHdlZW4gU2VjdXJpdHkgR3JvdXBzIGluIGRpZmZlcmVudCBzdGFja3MsIHB1dCB0aGUgcnVsZSBvbiB0aGUgb3RoZXIgU0dcbiAgICovXG4gIHByaXZhdGUgcmVtb3RlUnVsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzOiBDb25uZWN0aW9uc1Byb3BzID0ge30pIHtcbiAgICB0aGlzLmNvbm5lY3Rpb25zID0gdGhpcztcbiAgICB0aGlzLl9zZWN1cml0eUdyb3Vwcy5wdXNoKC4uLihwcm9wcy5zZWN1cml0eUdyb3VwcyB8fCBbXSkpO1xuXG4gICAgdGhpcy5fc2VjdXJpdHlHcm91cFJ1bGVzLnB1c2goLi4udGhpcy5fc2VjdXJpdHlHcm91cHMuYXNBcnJheSgpKTtcbiAgICBpZiAocHJvcHMucGVlcikge1xuICAgICAgdGhpcy5fc2VjdXJpdHlHcm91cFJ1bGVzLnB1c2gocHJvcHMucGVlcik7XG4gICAgfVxuXG4gICAgdGhpcy5kZWZhdWx0UG9ydCA9IHByb3BzLmRlZmF1bHRQb3J0O1xuICB9XG5cbiAgcHVibGljIGdldCBzZWN1cml0eUdyb3VwcygpOiBJU2VjdXJpdHlHcm91cFtdIHtcbiAgICByZXR1cm4gdGhpcy5fc2VjdXJpdHlHcm91cHMuYXNBcnJheSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIHNlY3VyaXR5IGdyb3VwIHRvIHRoZSBsaXN0IG9mIHNlY3VyaXR5IGdyb3VwcyBtYW5hZ2VkIGJ5IHRoaXMgb2JqZWN0XG4gICAqL1xuICBwdWJsaWMgYWRkU2VjdXJpdHlHcm91cCguLi5zZWN1cml0eUdyb3VwczogSVNlY3VyaXR5R3JvdXBbXSkge1xuICAgIGZvciAoY29uc3Qgc2VjdXJpdHlHcm91cCBvZiBzZWN1cml0eUdyb3Vwcykge1xuICAgICAgdGhpcy5fc2VjdXJpdHlHcm91cHMucHVzaChzZWN1cml0eUdyb3VwKTtcbiAgICAgIHRoaXMuX3NlY3VyaXR5R3JvdXBSdWxlcy5wdXNoKHNlY3VyaXR5R3JvdXApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBbGxvdyBjb25uZWN0aW9ucyB0byB0aGUgcGVlciBvbiB0aGUgZ2l2ZW4gcG9ydFxuICAgKi9cbiAgcHVibGljIGFsbG93VG8ob3RoZXI6IElDb25uZWN0YWJsZSwgcG9ydFJhbmdlOiBQb3J0LCBkZXNjcmlwdGlvbj86IHN0cmluZykge1xuICAgIGlmICh0aGlzLnNraXApIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCByZW1vdGVSdWxlID0gdGhpcy5yZW1vdGVSdWxlOyAvLyBDYXB0dXJlIGN1cnJlbnQgdmFsdWUgaW50byBsb2NhbCBmb3IgY2FsbGJhY2sgdG8gY2xvc2Ugb3ZlclxuICAgIHRoaXMuX3NlY3VyaXR5R3JvdXBzLmZvckVhY2hBbmRGb3JldmVyKHNlY3VyaXR5R3JvdXAgPT4ge1xuICAgICAgb3RoZXIuY29ubmVjdGlvbnMuX3NlY3VyaXR5R3JvdXBSdWxlcy5mb3JFYWNoQW5kRm9yZXZlcihydWxlID0+IHtcbiAgICAgICAgc2VjdXJpdHlHcm91cC5hZGRFZ3Jlc3NSdWxlKHJ1bGUsIHBvcnRSYW5nZSwgZGVzY3JpcHRpb24sIHJlbW90ZVJ1bGUpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnNraXAgPSB0cnVlO1xuICAgIG90aGVyLmNvbm5lY3Rpb25zLnJlbW90ZVJ1bGUgPSB0cnVlO1xuICAgIHRyeSB7XG4gICAgICBvdGhlci5jb25uZWN0aW9ucy5hbGxvd0Zyb20odGhpcywgcG9ydFJhbmdlLCBkZXNjcmlwdGlvbik7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMuc2tpcCA9IGZhbHNlO1xuICAgICAgb3RoZXIuY29ubmVjdGlvbnMucmVtb3RlUnVsZSA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBbGxvdyBjb25uZWN0aW9ucyBmcm9tIHRoZSBwZWVyIG9uIHRoZSBnaXZlbiBwb3J0XG4gICAqL1xuICBwdWJsaWMgYWxsb3dGcm9tKG90aGVyOiBJQ29ubmVjdGFibGUsIHBvcnRSYW5nZTogUG9ydCwgZGVzY3JpcHRpb24/OiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5za2lwKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgcmVtb3RlUnVsZSA9IHRoaXMucmVtb3RlUnVsZTsgLy8gQ2FwdHVyZSBjdXJyZW50IHZhbHVlIGludG8gbG9jYWwgZm9yIGNhbGxiYWNrIHRvIGNsb3NlIG92ZXJcbiAgICB0aGlzLl9zZWN1cml0eUdyb3Vwcy5mb3JFYWNoQW5kRm9yZXZlcihzZWN1cml0eUdyb3VwID0+IHtcbiAgICAgIG90aGVyLmNvbm5lY3Rpb25zLl9zZWN1cml0eUdyb3VwUnVsZXMuZm9yRWFjaEFuZEZvcmV2ZXIocnVsZSA9PiB7XG4gICAgICAgIHNlY3VyaXR5R3JvdXAuYWRkSW5ncmVzc1J1bGUocnVsZSwgcG9ydFJhbmdlLCBkZXNjcmlwdGlvbiwgcmVtb3RlUnVsZSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMuc2tpcCA9IHRydWU7XG4gICAgb3RoZXIuY29ubmVjdGlvbnMucmVtb3RlUnVsZSA9IHRydWU7XG4gICAgdHJ5IHtcbiAgICAgIG90aGVyLmNvbm5lY3Rpb25zLmFsbG93VG8odGhpcywgcG9ydFJhbmdlLCBkZXNjcmlwdGlvbik7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMuc2tpcCA9IGZhbHNlO1xuICAgICAgb3RoZXIuY29ubmVjdGlvbnMucmVtb3RlUnVsZSA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBbGxvdyBob3N0cyBpbnNpZGUgdGhlIHNlY3VyaXR5IGdyb3VwIHRvIGNvbm5lY3QgdG8gZWFjaCBvdGhlciBvbiB0aGUgZ2l2ZW4gcG9ydFxuICAgKi9cbiAgcHVibGljIGFsbG93SW50ZXJuYWxseShwb3J0UmFuZ2U6IFBvcnQsIGRlc2NyaXB0aW9uPzogc3RyaW5nKSB7XG4gICAgdGhpcy5fc2VjdXJpdHlHcm91cHMuZm9yRWFjaEFuZEZvcmV2ZXIoc2VjdXJpdHlHcm91cCA9PiB7XG4gICAgICB0aGlzLl9zZWN1cml0eUdyb3VwUnVsZXMuZm9yRWFjaEFuZEZvcmV2ZXIocnVsZSA9PiB7XG4gICAgICAgIHNlY3VyaXR5R3JvdXAuYWRkSW5ncmVzc1J1bGUocnVsZSwgcG9ydFJhbmdlLCBkZXNjcmlwdGlvbik7XG4gICAgICAgIHNlY3VyaXR5R3JvdXAuYWRkRWdyZXNzUnVsZShydWxlLCBwb3J0UmFuZ2UsIGRlc2NyaXB0aW9uKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFsbG93IHRvIGFsbCBJUHY0IHJhbmdlc1xuICAgKi9cbiAgcHVibGljIGFsbG93VG9BbnlJcHY0KHBvcnRSYW5nZTogUG9ydCwgZGVzY3JpcHRpb24/OiBzdHJpbmcpIHtcbiAgICB0aGlzLmFsbG93VG8oUGVlci5hbnlJcHY0KCksIHBvcnRSYW5nZSwgZGVzY3JpcHRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFsbG93IGZyb20gYW55IElQdjQgcmFuZ2VzXG4gICAqL1xuICBwdWJsaWMgYWxsb3dGcm9tQW55SXB2NChwb3J0UmFuZ2U6IFBvcnQsIGRlc2NyaXB0aW9uPzogc3RyaW5nKSB7XG4gICAgdGhpcy5hbGxvd0Zyb20oUGVlci5hbnlJcHY0KCksIHBvcnRSYW5nZSwgZGVzY3JpcHRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFsbG93IGNvbm5lY3Rpb25zIGZyb20gdGhlIHBlZXIgb24gb3VyIGRlZmF1bHQgcG9ydFxuICAgKlxuICAgKiBFdmVuIGlmIHRoZSBwZWVyIGhhcyBhIGRlZmF1bHQgcG9ydCwgd2Ugd2lsbCBhbHdheXMgdXNlIG91ciBkZWZhdWx0IHBvcnQuXG4gICAqL1xuICBwdWJsaWMgYWxsb3dEZWZhdWx0UG9ydEZyb20ob3RoZXI6IElDb25uZWN0YWJsZSwgZGVzY3JpcHRpb24/OiBzdHJpbmcpIHtcbiAgICBpZiAoIXRoaXMuZGVmYXVsdFBvcnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGNhbGwgYWxsb3dEZWZhdWx0UG9ydEZyb20oKTogdGhpcyByZXNvdXJjZSBoYXMgbm8gZGVmYXVsdCBwb3J0Jyk7XG4gICAgfVxuICAgIHRoaXMuYWxsb3dGcm9tKG90aGVyLCB0aGlzLmRlZmF1bHRQb3J0LCBkZXNjcmlwdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogQWxsb3cgaG9zdHMgaW5zaWRlIHRoZSBzZWN1cml0eSBncm91cCB0byBjb25uZWN0IHRvIGVhY2ggb3RoZXJcbiAgICovXG4gIHB1YmxpYyBhbGxvd0RlZmF1bHRQb3J0SW50ZXJuYWxseShkZXNjcmlwdGlvbj86IHN0cmluZykge1xuICAgIGlmICghdGhpcy5kZWZhdWx0UG9ydCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY2FsbCBhbGxvd0RlZmF1bHRQb3J0SW50ZXJuYWxseSgpOiB0aGlzIHJlc291cmNlIGhhcyBubyBkZWZhdWx0IHBvcnQnKTtcbiAgICB9XG4gICAgdGhpcy5hbGxvd0ludGVybmFsbHkodGhpcy5kZWZhdWx0UG9ydCwgZGVzY3JpcHRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFsbG93IGRlZmF1bHQgY29ubmVjdGlvbnMgZnJvbSBhbGwgSVB2NCByYW5nZXNcbiAgICovXG4gIHB1YmxpYyBhbGxvd0RlZmF1bHRQb3J0RnJvbUFueUlwdjQoZGVzY3JpcHRpb24/OiBzdHJpbmcpIHtcbiAgICBpZiAoIXRoaXMuZGVmYXVsdFBvcnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGNhbGwgYWxsb3dEZWZhdWx0UG9ydEZyb21BbnlJcHY0KCk6IHRoaXMgcmVzb3VyY2UgaGFzIG5vIGRlZmF1bHQgcG9ydCcpO1xuICAgIH1cbiAgICB0aGlzLmFsbG93RnJvbUFueUlwdjQodGhpcy5kZWZhdWx0UG9ydCwgZGVzY3JpcHRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFsbG93IGNvbm5lY3Rpb25zIHRvIHRoZSBzZWN1cml0eSBncm91cCBvbiB0aGVpciBkZWZhdWx0IHBvcnRcbiAgICovXG4gIHB1YmxpYyBhbGxvd1RvRGVmYXVsdFBvcnQob3RoZXI6IElDb25uZWN0YWJsZSwgZGVzY3JpcHRpb24/OiBzdHJpbmcpIHtcbiAgICBpZiAob3RoZXIuY29ubmVjdGlvbnMuZGVmYXVsdFBvcnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY2FsbCBhbGxvd1RvRGVmYXVsdFBvcnQoKTogb3RoZXIgcmVzb3VyY2UgaGFzIG5vIGRlZmF1bHQgcG9ydCcpO1xuICAgIH1cblxuICAgIHRoaXMuYWxsb3dUbyhvdGhlciwgb3RoZXIuY29ubmVjdGlvbnMuZGVmYXVsdFBvcnQsIGRlc2NyaXB0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbGxvdyBjb25uZWN0aW9ucyBmcm9tIHRoZSBwZWVyIG9uIG91ciBkZWZhdWx0IHBvcnRcbiAgICpcbiAgICogRXZlbiBpZiB0aGUgcGVlciBoYXMgYSBkZWZhdWx0IHBvcnQsIHdlIHdpbGwgYWx3YXlzIHVzZSBvdXIgZGVmYXVsdCBwb3J0LlxuICAgKi9cbiAgcHVibGljIGFsbG93RGVmYXVsdFBvcnRUbyhvdGhlcjogSUNvbm5lY3RhYmxlLCBkZXNjcmlwdGlvbj86IHN0cmluZykge1xuICAgIGlmICghdGhpcy5kZWZhdWx0UG9ydCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY2FsbCBhbGxvd0RlZmF1bHRQb3J0VG8oKTogdGhpcyByZXNvdXJjZSBoYXMgbm8gZGVmYXVsdCBwb3J0Jyk7XG4gICAgfVxuICAgIHRoaXMuYWxsb3dUbyhvdGhlciwgdGhpcy5kZWZhdWx0UG9ydCwgZGVzY3JpcHRpb24pO1xuICB9XG59XG5cbnR5cGUgQWN0aW9uPFQ+ID0gKHg6IFQpID0+IHZvaWQ7XG5cbmNsYXNzIFJlYWN0aXZlTGlzdDxUPiB7XG4gIHByaXZhdGUgcmVhZG9ubHkgZWxlbWVudHMgPSBuZXcgQXJyYXk8VD4oKTtcbiAgcHJpdmF0ZSByZWFkb25seSBsaXN0ZW5lcnMgPSBuZXcgQXJyYXk8QWN0aW9uPFQ+PigpO1xuXG4gIHB1YmxpYyBwdXNoKC4uLnhzOiBUW10pIHtcbiAgICB0aGlzLmVsZW1lbnRzLnB1c2goLi4ueHMpO1xuICAgIGZvciAoY29uc3QgbGlzdGVuZXIgb2YgdGhpcy5saXN0ZW5lcnMpIHtcbiAgICAgIGZvciAoY29uc3QgeCBvZiB4cykge1xuICAgICAgICBsaXN0ZW5lcih4KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZm9yRWFjaEFuZEZvcmV2ZXIobGlzdGVuZXI6IEFjdGlvbjxUPikge1xuICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiB0aGlzLmVsZW1lbnRzKSB7XG4gICAgICBsaXN0ZW5lcihlbGVtZW50KTtcbiAgICB9XG4gICAgdGhpcy5saXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gIH1cblxuICBwdWJsaWMgYXNBcnJheSgpOiBUW10ge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnRzLnNsaWNlKCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0IGxlbmd0aCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnRzLmxlbmd0aDtcbiAgfVxufVxuIl19