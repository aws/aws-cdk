"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AclTraffic = exports.AclCidr = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
/**
 * Either an IPv4 or an IPv6 CIDR
 *
 *
 */
class AclCidr {
    /**
     * An IP network range in CIDR notation (for example, 172.16.0.0/24).
     */
    static ipv4(ipv4Cidr) {
        return new AclCidrImpl({
            cidrBlock: ipv4Cidr,
        });
    }
    /**
     * The CIDR containing all IPv4 addresses (i.e., 0.0.0.0/0)
     */
    static anyIpv4() {
        return AclCidr.ipv4('0.0.0.0/0');
    }
    /**
     * An IPv6 network range in CIDR notation (for example, 2001:db8::/48)
     */
    static ipv6(ipv6Cidr) {
        return new AclCidrImpl({
            ipv6CidrBlock: ipv6Cidr,
        });
    }
    /**
     * The CIDR containing all IPv6 addresses (i.e., ::/0)
     */
    static anyIpv6() {
        return AclCidr.ipv6('::/0');
    }
}
exports.AclCidr = AclCidr;
_a = JSII_RTTI_SYMBOL_1;
AclCidr[_a] = { fqn: "@aws-cdk/aws-ec2.AclCidr", version: "0.0.0" };
class AclCidrImpl extends AclCidr {
    constructor(config) {
        super();
        this.config = config;
    }
    toCidrConfig() {
        return this.config;
    }
}
/**
 * The traffic that is configured using a Network ACL entry
 *
 *
 */
class AclTraffic {
    /**
     * Apply the ACL entry to all traffic
     */
    static allTraffic() {
        return new AclTrafficImpl({
            protocol: -1,
        });
    }
    /**
     * Apply the ACL entry to ICMP traffic of given type and code
     */
    static icmp(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_AclIcmp(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.icmp);
            }
            throw error;
        }
        return new AclTrafficImpl({
            protocol: 1,
            icmp: props,
        });
    }
    /**
     * Apply the ACL entry to ICMPv6 traffic of given type and code
     *
     * Requires an IPv6 CIDR block.
     */
    static icmpv6(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_AclIcmp(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.icmpv6);
            }
            throw error;
        }
        return new AclTrafficImpl({
            protocol: 58,
            icmp: props,
        });
    }
    /**
     * Apply the ACL entry to TCP traffic on a given port
     */
    static tcpPort(port) {
        return new AclTrafficImpl({
            protocol: 6,
            portRange: {
                from: port,
                to: port,
            },
        });
    }
    /**
     * Apply the ACL entry to TCP traffic on a given port range
     */
    static tcpPortRange(startPort, endPort) {
        return new AclTrafficImpl({
            protocol: 6,
            portRange: {
                from: startPort,
                to: endPort,
            },
        });
    }
    /**
     * Apply the ACL entry to UDP traffic on a given port
     */
    static udpPort(port) {
        return new AclTrafficImpl({
            protocol: 17,
            portRange: {
                from: port,
                to: port,
            },
        });
    }
    /**
     * Apply the ACL entry to UDP traffic on a given port range
     */
    static udpPortRange(startPort, endPort) {
        return new AclTrafficImpl({
            protocol: 17,
            portRange: {
                from: startPort,
                to: endPort,
            },
        });
    }
}
exports.AclTraffic = AclTraffic;
_b = JSII_RTTI_SYMBOL_1;
AclTraffic[_b] = { fqn: "@aws-cdk/aws-ec2.AclTraffic", version: "0.0.0" };
class AclTrafficImpl extends AclTraffic {
    constructor(config) {
        super();
        this.config = config;
    }
    toTrafficConfig() {
        return this.config;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV0d29yay1hY2wtdHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuZXR3b3JrLWFjbC10eXBlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztHQUlHO0FBQ0gsTUFBc0IsT0FBTztJQUMzQjs7T0FFRztJQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBZ0I7UUFDakMsT0FBTyxJQUFJLFdBQVcsQ0FBQztZQUNyQixTQUFTLEVBQUUsUUFBUTtTQUNwQixDQUFDLENBQUM7S0FDSjtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLE9BQU87UUFDbkIsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0tBQ2xDO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQWdCO1FBQ2pDLE9BQU8sSUFBSSxXQUFXLENBQUM7WUFDckIsYUFBYSxFQUFFLFFBQVE7U0FDeEIsQ0FBQyxDQUFDO0tBQ0o7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxPQUFPO1FBQ25CLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUM3Qjs7QUEvQkgsMEJBa0NDOzs7QUFFRCxNQUFNLFdBQVksU0FBUSxPQUFPO0lBQy9CLFlBQTZCLE1BQXFCO1FBQ2hELEtBQUssRUFBRSxDQUFDO1FBRG1CLFdBQU0sR0FBTixNQUFNLENBQWU7S0FFakQ7SUFFTSxZQUFZO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztLQUNwQjtDQUNGO0FBbUJEOzs7O0dBSUc7QUFDSCxNQUFzQixVQUFVO0lBQzlCOztPQUVHO0lBQ0ksTUFBTSxDQUFDLFVBQVU7UUFDdEIsT0FBTyxJQUFJLGNBQWMsQ0FBQztZQUN4QixRQUFRLEVBQUUsQ0FBQyxDQUFDO1NBQ2IsQ0FBQyxDQUFDO0tBQ0o7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBYzs7Ozs7Ozs7OztRQUMvQixPQUFPLElBQUksY0FBYyxDQUFDO1lBQ3hCLFFBQVEsRUFBRSxDQUFDO1lBQ1gsSUFBSSxFQUFFLEtBQUs7U0FDWixDQUFDLENBQUM7S0FDSjtJQUVEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQWM7Ozs7Ozs7Ozs7UUFDakMsT0FBTyxJQUFJLGNBQWMsQ0FBQztZQUN4QixRQUFRLEVBQUUsRUFBRTtZQUNaLElBQUksRUFBRSxLQUFLO1NBQ1osQ0FBQyxDQUFDO0tBQ0o7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBWTtRQUNoQyxPQUFPLElBQUksY0FBYyxDQUFDO1lBQ3hCLFFBQVEsRUFBRSxDQUFDO1lBQ1gsU0FBUyxFQUFFO2dCQUNULElBQUksRUFBRSxJQUFJO2dCQUNWLEVBQUUsRUFBRSxJQUFJO2FBQ1Q7U0FDRixDQUFDLENBQUM7S0FDSjtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLFlBQVksQ0FBQyxTQUFpQixFQUFFLE9BQWU7UUFDM0QsT0FBTyxJQUFJLGNBQWMsQ0FBQztZQUN4QixRQUFRLEVBQUUsQ0FBQztZQUNYLFNBQVMsRUFBRTtnQkFDVCxJQUFJLEVBQUUsU0FBUztnQkFDZixFQUFFLEVBQUUsT0FBTzthQUNaO1NBQ0YsQ0FBQyxDQUFDO0tBQ0o7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBWTtRQUNoQyxPQUFPLElBQUksY0FBYyxDQUFDO1lBQ3hCLFFBQVEsRUFBRSxFQUFFO1lBQ1osU0FBUyxFQUFFO2dCQUNULElBQUksRUFBRSxJQUFJO2dCQUNWLEVBQUUsRUFBRSxJQUFJO2FBQ1Q7U0FDRixDQUFDLENBQUM7S0FDSjtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLFlBQVksQ0FBQyxTQUFpQixFQUFFLE9BQWU7UUFDM0QsT0FBTyxJQUFJLGNBQWMsQ0FBQztZQUN4QixRQUFRLEVBQUUsRUFBRTtZQUNaLFNBQVMsRUFBRTtnQkFDVCxJQUFJLEVBQUUsU0FBUztnQkFDZixFQUFFLEVBQUUsT0FBTzthQUNaO1NBQ0YsQ0FBQyxDQUFDO0tBQ0o7O0FBbEZILGdDQXFGQzs7O0FBRUQsTUFBTSxjQUFlLFNBQVEsVUFBVTtJQUNyQyxZQUE2QixNQUF3QjtRQUNuRCxLQUFLLEVBQUUsQ0FBQztRQURtQixXQUFNLEdBQU4sTUFBTSxDQUFrQjtLQUVwRDtJQUVNLGVBQWU7UUFDcEIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0tBQ3BCO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEVpdGhlciBhbiBJUHY0IG9yIGFuIElQdjYgQ0lEUlxuICpcbiAqXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBY2xDaWRyIHtcbiAgLyoqXG4gICAqIEFuIElQIG5ldHdvcmsgcmFuZ2UgaW4gQ0lEUiBub3RhdGlvbiAoZm9yIGV4YW1wbGUsIDE3Mi4xNi4wLjAvMjQpLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBpcHY0KGlwdjRDaWRyOiBzdHJpbmcpOiBBY2xDaWRyIHtcbiAgICByZXR1cm4gbmV3IEFjbENpZHJJbXBsKHtcbiAgICAgIGNpZHJCbG9jazogaXB2NENpZHIsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIENJRFIgY29udGFpbmluZyBhbGwgSVB2NCBhZGRyZXNzZXMgKGkuZS4sIDAuMC4wLjAvMClcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYW55SXB2NCgpOiBBY2xDaWRyIHtcbiAgICByZXR1cm4gQWNsQ2lkci5pcHY0KCcwLjAuMC4wLzAnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBJUHY2IG5ldHdvcmsgcmFuZ2UgaW4gQ0lEUiBub3RhdGlvbiAoZm9yIGV4YW1wbGUsIDIwMDE6ZGI4OjovNDgpXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGlwdjYoaXB2NkNpZHI6IHN0cmluZyk6IEFjbENpZHIge1xuICAgIHJldHVybiBuZXcgQWNsQ2lkckltcGwoe1xuICAgICAgaXB2NkNpZHJCbG9jazogaXB2NkNpZHIsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIENJRFIgY29udGFpbmluZyBhbGwgSVB2NiBhZGRyZXNzZXMgKGkuZS4sIDo6LzApXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFueUlwdjYoKTogQWNsQ2lkciB7XG4gICAgcmV0dXJuIEFjbENpZHIuaXB2NignOjovMCcpO1xuICB9XG5cbiAgcHVibGljIGFic3RyYWN0IHRvQ2lkckNvbmZpZygpOiBBY2xDaWRyQ29uZmlnO1xufVxuXG5jbGFzcyBBY2xDaWRySW1wbCBleHRlbmRzIEFjbENpZHIge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGNvbmZpZzogQWNsQ2lkckNvbmZpZykge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBwdWJsaWMgdG9DaWRyQ29uZmlnKCk6IEFjbENpZHJDb25maWcge1xuICAgIHJldHVybiB0aGlzLmNvbmZpZztcbiAgfVxufVxuXG4vKipcbiAqIEFjbCBDb25maWd1cmF0aW9uIGZvciBDSURSXG4gKlxuICpcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBY2xDaWRyQ29uZmlnIHtcbiAgLyoqXG4gICAqIElwdjQgQ0lEUlxuICAgKi9cbiAgcmVhZG9ubHkgY2lkckJsb2NrPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBJcHY2IENJRFJcbiAgICovXG4gIHJlYWRvbmx5IGlwdjZDaWRyQmxvY2s/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogVGhlIHRyYWZmaWMgdGhhdCBpcyBjb25maWd1cmVkIHVzaW5nIGEgTmV0d29yayBBQ0wgZW50cnlcbiAqXG4gKlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQWNsVHJhZmZpYyB7XG4gIC8qKlxuICAgKiBBcHBseSB0aGUgQUNMIGVudHJ5IHRvIGFsbCB0cmFmZmljXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFsbFRyYWZmaWMoKTogQWNsVHJhZmZpYyB7XG4gICAgcmV0dXJuIG5ldyBBY2xUcmFmZmljSW1wbCh7XG4gICAgICBwcm90b2NvbDogLTEsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQXBwbHkgdGhlIEFDTCBlbnRyeSB0byBJQ01QIHRyYWZmaWMgb2YgZ2l2ZW4gdHlwZSBhbmQgY29kZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBpY21wKHByb3BzOiBBY2xJY21wKTogQWNsVHJhZmZpYyB7XG4gICAgcmV0dXJuIG5ldyBBY2xUcmFmZmljSW1wbCh7XG4gICAgICBwcm90b2NvbDogMSxcbiAgICAgIGljbXA6IHByb3BzLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGx5IHRoZSBBQ0wgZW50cnkgdG8gSUNNUHY2IHRyYWZmaWMgb2YgZ2l2ZW4gdHlwZSBhbmQgY29kZVxuICAgKlxuICAgKiBSZXF1aXJlcyBhbiBJUHY2IENJRFIgYmxvY2suXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGljbXB2Nihwcm9wczogQWNsSWNtcCk6IEFjbFRyYWZmaWMge1xuICAgIHJldHVybiBuZXcgQWNsVHJhZmZpY0ltcGwoe1xuICAgICAgcHJvdG9jb2w6IDU4LFxuICAgICAgaWNtcDogcHJvcHMsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQXBwbHkgdGhlIEFDTCBlbnRyeSB0byBUQ1AgdHJhZmZpYyBvbiBhIGdpdmVuIHBvcnRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgdGNwUG9ydChwb3J0OiBudW1iZXIpOiBBY2xUcmFmZmljIHtcbiAgICByZXR1cm4gbmV3IEFjbFRyYWZmaWNJbXBsKHtcbiAgICAgIHByb3RvY29sOiA2LFxuICAgICAgcG9ydFJhbmdlOiB7XG4gICAgICAgIGZyb206IHBvcnQsXG4gICAgICAgIHRvOiBwb3J0LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBseSB0aGUgQUNMIGVudHJ5IHRvIFRDUCB0cmFmZmljIG9uIGEgZ2l2ZW4gcG9ydCByYW5nZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyB0Y3BQb3J0UmFuZ2Uoc3RhcnRQb3J0OiBudW1iZXIsIGVuZFBvcnQ6IG51bWJlcik6IEFjbFRyYWZmaWMge1xuICAgIHJldHVybiBuZXcgQWNsVHJhZmZpY0ltcGwoe1xuICAgICAgcHJvdG9jb2w6IDYsXG4gICAgICBwb3J0UmFuZ2U6IHtcbiAgICAgICAgZnJvbTogc3RhcnRQb3J0LFxuICAgICAgICB0bzogZW5kUG9ydCxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQXBwbHkgdGhlIEFDTCBlbnRyeSB0byBVRFAgdHJhZmZpYyBvbiBhIGdpdmVuIHBvcnRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgdWRwUG9ydChwb3J0OiBudW1iZXIpOiBBY2xUcmFmZmljIHtcbiAgICByZXR1cm4gbmV3IEFjbFRyYWZmaWNJbXBsKHtcbiAgICAgIHByb3RvY29sOiAxNyxcbiAgICAgIHBvcnRSYW5nZToge1xuICAgICAgICBmcm9tOiBwb3J0LFxuICAgICAgICB0bzogcG9ydCxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQXBwbHkgdGhlIEFDTCBlbnRyeSB0byBVRFAgdHJhZmZpYyBvbiBhIGdpdmVuIHBvcnQgcmFuZ2VcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgdWRwUG9ydFJhbmdlKHN0YXJ0UG9ydDogbnVtYmVyLCBlbmRQb3J0OiBudW1iZXIpOiBBY2xUcmFmZmljIHtcbiAgICByZXR1cm4gbmV3IEFjbFRyYWZmaWNJbXBsKHtcbiAgICAgIHByb3RvY29sOiAxNyxcbiAgICAgIHBvcnRSYW5nZToge1xuICAgICAgICBmcm9tOiBzdGFydFBvcnQsXG4gICAgICAgIHRvOiBlbmRQb3J0LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBhYnN0cmFjdCB0b1RyYWZmaWNDb25maWcoKTogQWNsVHJhZmZpY0NvbmZpZztcbn1cblxuY2xhc3MgQWNsVHJhZmZpY0ltcGwgZXh0ZW5kcyBBY2xUcmFmZmljIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBjb25maWc6IEFjbFRyYWZmaWNDb25maWcpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgcHVibGljIHRvVHJhZmZpY0NvbmZpZygpOiBBY2xUcmFmZmljQ29uZmlnIHtcbiAgICByZXR1cm4gdGhpcy5jb25maWc7XG4gIH1cbn1cblxuLyoqXG4gKiBBY2wgQ29uZmlndXJhdGlvbiBmb3IgdHJhZmZpY1xuICpcbiAqXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQWNsVHJhZmZpY0NvbmZpZyB7XG4gIC8qKlxuICAgKiBUaGUgSW50ZXJuZXQgQ29udHJvbCBNZXNzYWdlIFByb3RvY29sIChJQ01QKSBjb2RlIGFuZCB0eXBlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFJlcXVpcmVkIGlmIHNwZWNpZnlpbmcgMSAoSUNNUCkgZm9yIHRoZSBwcm90b2NvbCBwYXJhbWV0ZXIuXG4gICAqL1xuICByZWFkb25seSBpY21wPzogQWNsSWNtcDtcblxuICAvKipcbiAgICogVGhlIHJhbmdlIG9mIHBvcnQgbnVtYmVycyBmb3IgdGhlIFVEUC9UQ1AgcHJvdG9jb2wuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gUmVxdWlyZWQgaWYgc3BlY2lmeWluZyA2IChUQ1ApIG9yIDE3IChVRFApIGZvciB0aGUgcHJvdG9jb2wgcGFyYW1ldGVyXG4gICAqL1xuICByZWFkb25seSBwb3J0UmFuZ2U/OiBBY2xQb3J0UmFuZ2U7XG5cbiAgLyoqXG4gICAqIFRoZSBwcm90b2NvbCBudW1iZXIuXG4gICAqXG4gICAqIEEgdmFsdWUgb2YgXCItMVwiIG1lYW5zIGFsbCBwcm90b2NvbHMuXG4gICAqXG4gICAqIElmIHlvdSBzcGVjaWZ5IFwiLTFcIiBvciBhIHByb3RvY29sIG51bWJlciBvdGhlciB0aGFuIFwiNlwiIChUQ1ApLCBcIjE3XCIgKFVEUCksXG4gICAqIG9yIFwiMVwiIChJQ01QKSwgdHJhZmZpYyBvbiBhbGwgcG9ydHMgaXMgYWxsb3dlZCwgcmVnYXJkbGVzcyBvZiBhbnkgcG9ydHMgb3JcbiAgICogSUNNUCB0eXBlcyBvciBjb2RlcyB0aGF0IHlvdSBzcGVjaWZ5LlxuICAgKlxuICAgKiBJZiB5b3Ugc3BlY2lmeSBwcm90b2NvbCBcIjU4XCIgKElDTVB2NikgYW5kIHNwZWNpZnkgYW4gSVB2NCBDSURSXG4gICAqIGJsb2NrLCB0cmFmZmljIGZvciBhbGwgSUNNUCB0eXBlcyBhbmQgY29kZXMgYWxsb3dlZCwgcmVnYXJkbGVzcyBvZiBhbnkgdGhhdFxuICAgKiB5b3Ugc3BlY2lmeS4gSWYgeW91IHNwZWNpZnkgcHJvdG9jb2wgXCI1OFwiIChJQ01QdjYpIGFuZCBzcGVjaWZ5IGFuIElQdjYgQ0lEUlxuICAgKiBibG9jaywgeW91IG11c3Qgc3BlY2lmeSBhbiBJQ01QIHR5cGUgYW5kIGNvZGUuXG4gICAqXG4gICAqIEBkZWZhdWx0IDE3XG4gICAqL1xuICByZWFkb25seSBwcm90b2NvbDogbnVtYmVyO1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgdG8gY3JlYXRlIEljbXBcbiAqXG4gKlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFjbEljbXAge1xuICAvKipcbiAgICogVGhlIEludGVybmV0IENvbnRyb2wgTWVzc2FnZSBQcm90b2NvbCAoSUNNUCkgdHlwZS4gWW91IGNhbiB1c2UgLTEgdG8gc3BlY2lmeSBhbGwgSUNNUCB0eXBlcy5cbiAgICogQ29uZGl0aW9uYWwgcmVxdWlyZW1lbnQ6IFJlcXVpcmVkIGlmIHlvdSBzcGVjaWZ5IDEgKElDTVApIGZvciB0aGUgQ3JlYXRlTmV0d29ya0FjbEVudHJ5IHByb3RvY29sIHBhcmFtZXRlci5cbiAgICovXG4gIHJlYWRvbmx5IHR5cGU/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBJbnRlcm5ldCBDb250cm9sIE1lc3NhZ2UgUHJvdG9jb2wgKElDTVApIGNvZGUuIFlvdSBjYW4gdXNlIC0xIHRvIHNwZWNpZnkgYWxsIElDTVBcbiAgICogY29kZXMgZm9yIHRoZSBnaXZlbiBJQ01QIHR5cGUuIFJlcXVpcmVtZW50IGlzIGNvbmRpdGlvbmFsOiBSZXF1aXJlZCBpZiB5b3VcbiAgICogc3BlY2lmeSAxIChJQ01QKSBmb3IgdGhlIHByb3RvY29sIHBhcmFtZXRlci5cbiAgICovXG4gIHJlYWRvbmx5IGNvZGU/OiBudW1iZXI7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyB0byBjcmVhdGUgUG9ydFJhbmdlXG4gKlxuICpcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBY2xQb3J0UmFuZ2Uge1xuICAvKipcbiAgICogVGhlIGZpcnN0IHBvcnQgaW4gdGhlIHJhbmdlLiBSZXF1aXJlZCBpZiB5b3Ugc3BlY2lmeSA2IChUQ1ApIG9yIDE3IChVRFApIGZvciB0aGUgcHJvdG9jb2wgcGFyYW1ldGVyLlxuICAgKi9cbiAgcmVhZG9ubHkgZnJvbT86IG51bWJlclxuXG4gIC8qKlxuICAgKiBUaGUgbGFzdCBwb3J0IGluIHRoZSByYW5nZS4gUmVxdWlyZWQgaWYgeW91IHNwZWNpZnkgNiAoVENQKSBvciAxNyAoVURQKSBmb3IgdGhlIHByb3RvY29sIHBhcmFtZXRlci5cbiAgICovXG4gIHJlYWRvbmx5IHRvPzogbnVtYmVyXG59XG4iXX0=