"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpTarget = exports.InstanceTarget = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const enums_1 = require("./enums");
/**
 * An EC2 instance that is the target for load balancing
 *
 * If you register a target of this type, you are responsible for making
 * sure the load balancer's security group can connect to the instance.
 *
 * @deprecated Use IpTarget from the @aws-cdk/aws-elasticloadbalancingv2-targets package instead.
 */
class InstanceTarget {
    /**
     * Create a new Instance target
     *
     * @param instanceId Instance ID of the instance to register to
     * @param port Override the default port for the target group
     */
    constructor(instanceId, port) {
        this.instanceId = instanceId;
        this.port = port;
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.InstanceTarget", "Use IpTarget from the");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, InstanceTarget);
            }
            throw error;
        }
    }
    /**
     * Register this instance target with a load balancer
     *
     * Don't call this, it is called automatically when you add the target to a
     * load balancer.
     */
    attachToApplicationTargetGroup(targetGroup) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.InstanceTarget#attachToApplicationTargetGroup", "Use IpTarget from the");
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_IApplicationTargetGroup(targetGroup);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.attachToApplicationTargetGroup);
            }
            throw error;
        }
        return this.attach(targetGroup);
    }
    /**
     * Register this instance target with a load balancer
     *
     * Don't call this, it is called automatically when you add the target to a
     * load balancer.
     */
    attachToNetworkTargetGroup(targetGroup) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.InstanceTarget#attachToNetworkTargetGroup", "Use IpTarget from the");
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_INetworkTargetGroup(targetGroup);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.attachToNetworkTargetGroup);
            }
            throw error;
        }
        return this.attach(targetGroup);
    }
    attach(_targetGroup) {
        return {
            targetType: enums_1.TargetType.INSTANCE,
            targetJson: { id: this.instanceId, port: this.port },
        };
    }
}
exports.InstanceTarget = InstanceTarget;
_a = JSII_RTTI_SYMBOL_1;
InstanceTarget[_a] = { fqn: "@aws-cdk/aws-elasticloadbalancingv2.InstanceTarget", version: "0.0.0" };
/**
 * An IP address that is a target for load balancing.
 *
 * Specify IP addresses from the subnets of the virtual private cloud (VPC) for
 * the target group, the RFC 1918 range (10.0.0.0/8, 172.16.0.0/12, and
 * 192.168.0.0/16), and the RFC 6598 range (100.64.0.0/10). You can't specify
 * publicly routable IP addresses.
 *
 * If you register a target of this type, you are responsible for making
 * sure the load balancer's security group can send packets to the IP address.
 *
 * @deprecated Use IpTarget from the @aws-cdk/aws-elasticloadbalancingv2-targets package instead.
 */
class IpTarget {
    /**
     * Create a new IPAddress target
     *
     * The availabilityZone parameter determines whether the target receives
     * traffic from the load balancer nodes in the specified Availability Zone
     * or from all enabled Availability Zones for the load balancer.
     *
     * This parameter is not supported if the target type of the target group
     * is instance. If the IP address is in a subnet of the VPC for the target
     * group, the Availability Zone is automatically detected and this
     * parameter is optional. If the IP address is outside the VPC, this
     * parameter is required.
     *
     * With an Application Load Balancer, if the IP address is outside the VPC
     * for the target group, the only supported value is all.
     *
     * Default is automatic.
     *
     * @param ipAddress The IP Address to load balance to
     * @param port Override the group's default port
     * @param availabilityZone Availability zone to send traffic from
     */
    constructor(ipAddress, port, availabilityZone) {
        this.ipAddress = ipAddress;
        this.port = port;
        this.availabilityZone = availabilityZone;
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.IpTarget", "Use IpTarget from the");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, IpTarget);
            }
            throw error;
        }
    }
    /**
     * Register this instance target with a load balancer
     *
     * Don't call this, it is called automatically when you add the target to a
     * load balancer.
     */
    attachToApplicationTargetGroup(targetGroup) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.IpTarget#attachToApplicationTargetGroup", "Use IpTarget from the");
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_IApplicationTargetGroup(targetGroup);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.attachToApplicationTargetGroup);
            }
            throw error;
        }
        return this.attach(targetGroup);
    }
    /**
     * Register this instance target with a load balancer
     *
     * Don't call this, it is called automatically when you add the target to a
     * load balancer.
     */
    attachToNetworkTargetGroup(targetGroup) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-elasticloadbalancingv2.IpTarget#attachToNetworkTargetGroup", "Use IpTarget from the");
            jsiiDeprecationWarnings._aws_cdk_aws_elasticloadbalancingv2_INetworkTargetGroup(targetGroup);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.attachToNetworkTargetGroup);
            }
            throw error;
        }
        return this.attach(targetGroup);
    }
    attach(_targetGroup) {
        return {
            targetType: enums_1.TargetType.IP,
            targetJson: { id: this.ipAddress, port: this.port, availabilityZone: this.availabilityZone },
        };
    }
}
exports.IpTarget = IpTarget;
_b = JSII_RTTI_SYMBOL_1;
IpTarget[_b] = { fqn: "@aws-cdk/aws-elasticloadbalancingv2.IpTarget", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZC1iYWxhbmNlci10YXJnZXRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9hZC1iYWxhbmNlci10YXJnZXRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLG1DQUFxQztBQUlyQzs7Ozs7OztHQU9HO0FBQ0gsTUFBYSxjQUFjO0lBQ3pCOzs7OztPQUtHO0lBQ0gsWUFBNkIsVUFBa0IsRUFBbUIsSUFBYTtRQUFsRCxlQUFVLEdBQVYsVUFBVSxDQUFRO1FBQW1CLFNBQUksR0FBSixJQUFJLENBQVM7Ozs7OzsrQ0FQcEUsY0FBYzs7OztLQVF4QjtJQUVEOzs7OztPQUtHO0lBQ0ksOEJBQThCLENBQUMsV0FBb0M7Ozs7Ozs7Ozs7O1FBQ3hFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztLQUNqQztJQUVEOzs7OztPQUtHO0lBQ0ksMEJBQTBCLENBQUMsV0FBZ0M7Ozs7Ozs7Ozs7O1FBQ2hFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztLQUNqQztJQUVPLE1BQU0sQ0FBQyxZQUEwQjtRQUN2QyxPQUFPO1lBQ0wsVUFBVSxFQUFFLGtCQUFVLENBQUMsUUFBUTtZQUMvQixVQUFVLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRTtTQUNyRCxDQUFDO0tBQ0g7O0FBbkNILHdDQW9DQzs7O0FBRUQ7Ozs7Ozs7Ozs7OztHQVlHO0FBQ0gsTUFBYSxRQUFRO0lBQ25COzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FxQkc7SUFDSCxZQUE2QixTQUFpQixFQUFtQixJQUFhLEVBQW1CLGdCQUF5QjtRQUE3RixjQUFTLEdBQVQsU0FBUyxDQUFRO1FBQW1CLFNBQUksR0FBSixJQUFJLENBQVM7UUFBbUIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFTOzs7Ozs7K0NBdkIvRyxRQUFROzs7O0tBd0JsQjtJQUVEOzs7OztPQUtHO0lBQ0ksOEJBQThCLENBQUMsV0FBb0M7Ozs7Ozs7Ozs7O1FBQ3hFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztLQUNqQztJQUVEOzs7OztPQUtHO0lBQ0ksMEJBQTBCLENBQUMsV0FBZ0M7Ozs7Ozs7Ozs7O1FBQ2hFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztLQUNqQztJQUVPLE1BQU0sQ0FBQyxZQUEwQjtRQUN2QyxPQUFPO1lBQ0wsVUFBVSxFQUFFLGtCQUFVLENBQUMsRUFBRTtZQUN6QixVQUFVLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7U0FDN0YsQ0FBQztLQUNIOztBQW5ESCw0QkFvREMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJVGFyZ2V0R3JvdXAsIExvYWRCYWxhbmNlclRhcmdldFByb3BzIH0gZnJvbSAnLi9iYXNlLXRhcmdldC1ncm91cCc7XG5pbXBvcnQgeyBUYXJnZXRUeXBlIH0gZnJvbSAnLi9lbnVtcyc7XG5pbXBvcnQgeyBJQXBwbGljYXRpb25Mb2FkQmFsYW5jZXJUYXJnZXQsIElBcHBsaWNhdGlvblRhcmdldEdyb3VwIH0gZnJvbSAnLi4vYWxiL2FwcGxpY2F0aW9uLXRhcmdldC1ncm91cCc7XG5pbXBvcnQgeyBJTmV0d29ya0xvYWRCYWxhbmNlclRhcmdldCwgSU5ldHdvcmtUYXJnZXRHcm91cCB9IGZyb20gJy4uL25sYi9uZXR3b3JrLXRhcmdldC1ncm91cCc7XG5cbi8qKlxuICogQW4gRUMyIGluc3RhbmNlIHRoYXQgaXMgdGhlIHRhcmdldCBmb3IgbG9hZCBiYWxhbmNpbmdcbiAqXG4gKiBJZiB5b3UgcmVnaXN0ZXIgYSB0YXJnZXQgb2YgdGhpcyB0eXBlLCB5b3UgYXJlIHJlc3BvbnNpYmxlIGZvciBtYWtpbmdcbiAqIHN1cmUgdGhlIGxvYWQgYmFsYW5jZXIncyBzZWN1cml0eSBncm91cCBjYW4gY29ubmVjdCB0byB0aGUgaW5zdGFuY2UuXG4gKlxuICogQGRlcHJlY2F0ZWQgVXNlIElwVGFyZ2V0IGZyb20gdGhlIEBhd3MtY2RrL2F3cy1lbGFzdGljbG9hZGJhbGFuY2luZ3YyLXRhcmdldHMgcGFja2FnZSBpbnN0ZWFkLlxuICovXG5leHBvcnQgY2xhc3MgSW5zdGFuY2VUYXJnZXQgaW1wbGVtZW50cyBJQXBwbGljYXRpb25Mb2FkQmFsYW5jZXJUYXJnZXQsIElOZXR3b3JrTG9hZEJhbGFuY2VyVGFyZ2V0IHtcbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBJbnN0YW5jZSB0YXJnZXRcbiAgICpcbiAgICogQHBhcmFtIGluc3RhbmNlSWQgSW5zdGFuY2UgSUQgb2YgdGhlIGluc3RhbmNlIHRvIHJlZ2lzdGVyIHRvXG4gICAqIEBwYXJhbSBwb3J0IE92ZXJyaWRlIHRoZSBkZWZhdWx0IHBvcnQgZm9yIHRoZSB0YXJnZXQgZ3JvdXBcbiAgICovXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgaW5zdGFuY2VJZDogc3RyaW5nLCBwcml2YXRlIHJlYWRvbmx5IHBvcnQ/OiBudW1iZXIpIHtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciB0aGlzIGluc3RhbmNlIHRhcmdldCB3aXRoIGEgbG9hZCBiYWxhbmNlclxuICAgKlxuICAgKiBEb24ndCBjYWxsIHRoaXMsIGl0IGlzIGNhbGxlZCBhdXRvbWF0aWNhbGx5IHdoZW4geW91IGFkZCB0aGUgdGFyZ2V0IHRvIGFcbiAgICogbG9hZCBiYWxhbmNlci5cbiAgICovXG4gIHB1YmxpYyBhdHRhY2hUb0FwcGxpY2F0aW9uVGFyZ2V0R3JvdXAodGFyZ2V0R3JvdXA6IElBcHBsaWNhdGlvblRhcmdldEdyb3VwKTogTG9hZEJhbGFuY2VyVGFyZ2V0UHJvcHMge1xuICAgIHJldHVybiB0aGlzLmF0dGFjaCh0YXJnZXRHcm91cCk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgdGhpcyBpbnN0YW5jZSB0YXJnZXQgd2l0aCBhIGxvYWQgYmFsYW5jZXJcbiAgICpcbiAgICogRG9uJ3QgY2FsbCB0aGlzLCBpdCBpcyBjYWxsZWQgYXV0b21hdGljYWxseSB3aGVuIHlvdSBhZGQgdGhlIHRhcmdldCB0byBhXG4gICAqIGxvYWQgYmFsYW5jZXIuXG4gICAqL1xuICBwdWJsaWMgYXR0YWNoVG9OZXR3b3JrVGFyZ2V0R3JvdXAodGFyZ2V0R3JvdXA6IElOZXR3b3JrVGFyZ2V0R3JvdXApOiBMb2FkQmFsYW5jZXJUYXJnZXRQcm9wcyB7XG4gICAgcmV0dXJuIHRoaXMuYXR0YWNoKHRhcmdldEdyb3VwKTtcbiAgfVxuXG4gIHByaXZhdGUgYXR0YWNoKF90YXJnZXRHcm91cDogSVRhcmdldEdyb3VwKTogTG9hZEJhbGFuY2VyVGFyZ2V0UHJvcHMge1xuICAgIHJldHVybiB7XG4gICAgICB0YXJnZXRUeXBlOiBUYXJnZXRUeXBlLklOU1RBTkNFLFxuICAgICAgdGFyZ2V0SnNvbjogeyBpZDogdGhpcy5pbnN0YW5jZUlkLCBwb3J0OiB0aGlzLnBvcnQgfSxcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogQW4gSVAgYWRkcmVzcyB0aGF0IGlzIGEgdGFyZ2V0IGZvciBsb2FkIGJhbGFuY2luZy5cbiAqXG4gKiBTcGVjaWZ5IElQIGFkZHJlc3NlcyBmcm9tIHRoZSBzdWJuZXRzIG9mIHRoZSB2aXJ0dWFsIHByaXZhdGUgY2xvdWQgKFZQQykgZm9yXG4gKiB0aGUgdGFyZ2V0IGdyb3VwLCB0aGUgUkZDIDE5MTggcmFuZ2UgKDEwLjAuMC4wLzgsIDE3Mi4xNi4wLjAvMTIsIGFuZFxuICogMTkyLjE2OC4wLjAvMTYpLCBhbmQgdGhlIFJGQyA2NTk4IHJhbmdlICgxMDAuNjQuMC4wLzEwKS4gWW91IGNhbid0IHNwZWNpZnlcbiAqIHB1YmxpY2x5IHJvdXRhYmxlIElQIGFkZHJlc3Nlcy5cbiAqXG4gKiBJZiB5b3UgcmVnaXN0ZXIgYSB0YXJnZXQgb2YgdGhpcyB0eXBlLCB5b3UgYXJlIHJlc3BvbnNpYmxlIGZvciBtYWtpbmdcbiAqIHN1cmUgdGhlIGxvYWQgYmFsYW5jZXIncyBzZWN1cml0eSBncm91cCBjYW4gc2VuZCBwYWNrZXRzIHRvIHRoZSBJUCBhZGRyZXNzLlxuICpcbiAqIEBkZXByZWNhdGVkIFVzZSBJcFRhcmdldCBmcm9tIHRoZSBAYXdzLWNkay9hd3MtZWxhc3RpY2xvYWRiYWxhbmNpbmd2Mi10YXJnZXRzIHBhY2thZ2UgaW5zdGVhZC5cbiAqL1xuZXhwb3J0IGNsYXNzIElwVGFyZ2V0IGltcGxlbWVudHMgSUFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyVGFyZ2V0LCBJTmV0d29ya0xvYWRCYWxhbmNlclRhcmdldCB7XG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgSVBBZGRyZXNzIHRhcmdldFxuICAgKlxuICAgKiBUaGUgYXZhaWxhYmlsaXR5Wm9uZSBwYXJhbWV0ZXIgZGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSB0YXJnZXQgcmVjZWl2ZXNcbiAgICogdHJhZmZpYyBmcm9tIHRoZSBsb2FkIGJhbGFuY2VyIG5vZGVzIGluIHRoZSBzcGVjaWZpZWQgQXZhaWxhYmlsaXR5IFpvbmVcbiAgICogb3IgZnJvbSBhbGwgZW5hYmxlZCBBdmFpbGFiaWxpdHkgWm9uZXMgZm9yIHRoZSBsb2FkIGJhbGFuY2VyLlxuICAgKlxuICAgKiBUaGlzIHBhcmFtZXRlciBpcyBub3Qgc3VwcG9ydGVkIGlmIHRoZSB0YXJnZXQgdHlwZSBvZiB0aGUgdGFyZ2V0IGdyb3VwXG4gICAqIGlzIGluc3RhbmNlLiBJZiB0aGUgSVAgYWRkcmVzcyBpcyBpbiBhIHN1Ym5ldCBvZiB0aGUgVlBDIGZvciB0aGUgdGFyZ2V0XG4gICAqIGdyb3VwLCB0aGUgQXZhaWxhYmlsaXR5IFpvbmUgaXMgYXV0b21hdGljYWxseSBkZXRlY3RlZCBhbmQgdGhpc1xuICAgKiBwYXJhbWV0ZXIgaXMgb3B0aW9uYWwuIElmIHRoZSBJUCBhZGRyZXNzIGlzIG91dHNpZGUgdGhlIFZQQywgdGhpc1xuICAgKiBwYXJhbWV0ZXIgaXMgcmVxdWlyZWQuXG4gICAqXG4gICAqIFdpdGggYW4gQXBwbGljYXRpb24gTG9hZCBCYWxhbmNlciwgaWYgdGhlIElQIGFkZHJlc3MgaXMgb3V0c2lkZSB0aGUgVlBDXG4gICAqIGZvciB0aGUgdGFyZ2V0IGdyb3VwLCB0aGUgb25seSBzdXBwb3J0ZWQgdmFsdWUgaXMgYWxsLlxuICAgKlxuICAgKiBEZWZhdWx0IGlzIGF1dG9tYXRpYy5cbiAgICpcbiAgICogQHBhcmFtIGlwQWRkcmVzcyBUaGUgSVAgQWRkcmVzcyB0byBsb2FkIGJhbGFuY2UgdG9cbiAgICogQHBhcmFtIHBvcnQgT3ZlcnJpZGUgdGhlIGdyb3VwJ3MgZGVmYXVsdCBwb3J0XG4gICAqIEBwYXJhbSBhdmFpbGFiaWxpdHlab25lIEF2YWlsYWJpbGl0eSB6b25lIHRvIHNlbmQgdHJhZmZpYyBmcm9tXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGlwQWRkcmVzczogc3RyaW5nLCBwcml2YXRlIHJlYWRvbmx5IHBvcnQ/OiBudW1iZXIsIHByaXZhdGUgcmVhZG9ubHkgYXZhaWxhYmlsaXR5Wm9uZT86IHN0cmluZykge1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIHRoaXMgaW5zdGFuY2UgdGFyZ2V0IHdpdGggYSBsb2FkIGJhbGFuY2VyXG4gICAqXG4gICAqIERvbid0IGNhbGwgdGhpcywgaXQgaXMgY2FsbGVkIGF1dG9tYXRpY2FsbHkgd2hlbiB5b3UgYWRkIHRoZSB0YXJnZXQgdG8gYVxuICAgKiBsb2FkIGJhbGFuY2VyLlxuICAgKi9cbiAgcHVibGljIGF0dGFjaFRvQXBwbGljYXRpb25UYXJnZXRHcm91cCh0YXJnZXRHcm91cDogSUFwcGxpY2F0aW9uVGFyZ2V0R3JvdXApOiBMb2FkQmFsYW5jZXJUYXJnZXRQcm9wcyB7XG4gICAgcmV0dXJuIHRoaXMuYXR0YWNoKHRhcmdldEdyb3VwKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciB0aGlzIGluc3RhbmNlIHRhcmdldCB3aXRoIGEgbG9hZCBiYWxhbmNlclxuICAgKlxuICAgKiBEb24ndCBjYWxsIHRoaXMsIGl0IGlzIGNhbGxlZCBhdXRvbWF0aWNhbGx5IHdoZW4geW91IGFkZCB0aGUgdGFyZ2V0IHRvIGFcbiAgICogbG9hZCBiYWxhbmNlci5cbiAgICovXG4gIHB1YmxpYyBhdHRhY2hUb05ldHdvcmtUYXJnZXRHcm91cCh0YXJnZXRHcm91cDogSU5ldHdvcmtUYXJnZXRHcm91cCk6IExvYWRCYWxhbmNlclRhcmdldFByb3BzIHtcbiAgICByZXR1cm4gdGhpcy5hdHRhY2godGFyZ2V0R3JvdXApO1xuICB9XG5cbiAgcHJpdmF0ZSBhdHRhY2goX3RhcmdldEdyb3VwOiBJVGFyZ2V0R3JvdXApOiBMb2FkQmFsYW5jZXJUYXJnZXRQcm9wcyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRhcmdldFR5cGU6IFRhcmdldFR5cGUuSVAsXG4gICAgICB0YXJnZXRKc29uOiB7IGlkOiB0aGlzLmlwQWRkcmVzcywgcG9ydDogdGhpcy5wb3J0LCBhdmFpbGFiaWxpdHlab25lOiB0aGlzLmF2YWlsYWJpbGl0eVpvbmUgfSxcbiAgICB9O1xuICB9XG59XG4iXX0=