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
_a = JSII_RTTI_SYMBOL_1;
AclCidr[_a] = { fqn: "@aws-cdk/aws-ec2.AclCidr", version: "0.0.0" };
exports.AclCidr = AclCidr;
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
_b = JSII_RTTI_SYMBOL_1;
AclTraffic[_b] = { fqn: "@aws-cdk/aws-ec2.AclTraffic", version: "0.0.0" };
exports.AclTraffic = AclTraffic;
class AclTrafficImpl extends AclTraffic {
    constructor(config) {
        super();
        this.config = config;
    }
    toTrafficConfig() {
        return this.config;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV0d29yay1hY2wtdHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuZXR3b3JrLWFjbC10eXBlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztHQUlHO0FBQ0gsTUFBc0IsT0FBTztJQUMzQjs7T0FFRztJQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBZ0I7UUFDakMsT0FBTyxJQUFJLFdBQVcsQ0FBQztZQUNyQixTQUFTLEVBQUUsUUFBUTtTQUNwQixDQUFDLENBQUM7S0FDSjtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLE9BQU87UUFDbkIsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0tBQ2xDO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQWdCO1FBQ2pDLE9BQU8sSUFBSSxXQUFXLENBQUM7WUFDckIsYUFBYSxFQUFFLFFBQVE7U0FDeEIsQ0FBQyxDQUFDO0tBQ0o7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxPQUFPO1FBQ25CLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUM3Qjs7OztBQS9CbUIsMEJBQU87QUFvQzdCLE1BQU0sV0FBWSxTQUFRLE9BQU87SUFDL0IsWUFBNkIsTUFBcUI7UUFDaEQsS0FBSyxFQUFFLENBQUM7UUFEbUIsV0FBTSxHQUFOLE1BQU0sQ0FBZTtLQUVqRDtJQUVNLFlBQVk7UUFDakIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0tBQ3BCO0NBQ0Y7QUFtQkQ7Ozs7R0FJRztBQUNILE1BQXNCLFVBQVU7SUFDOUI7O09BRUc7SUFDSSxNQUFNLENBQUMsVUFBVTtRQUN0QixPQUFPLElBQUksY0FBYyxDQUFDO1lBQ3hCLFFBQVEsRUFBRSxDQUFDLENBQUM7U0FDYixDQUFDLENBQUM7S0FDSjtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFjOzs7Ozs7Ozs7O1FBQy9CLE9BQU8sSUFBSSxjQUFjLENBQUM7WUFDeEIsUUFBUSxFQUFFLENBQUM7WUFDWCxJQUFJLEVBQUUsS0FBSztTQUNaLENBQUMsQ0FBQztLQUNKO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBYzs7Ozs7Ozs7OztRQUNqQyxPQUFPLElBQUksY0FBYyxDQUFDO1lBQ3hCLFFBQVEsRUFBRSxFQUFFO1lBQ1osSUFBSSxFQUFFLEtBQUs7U0FDWixDQUFDLENBQUM7S0FDSjtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFZO1FBQ2hDLE9BQU8sSUFBSSxjQUFjLENBQUM7WUFDeEIsUUFBUSxFQUFFLENBQUM7WUFDWCxTQUFTLEVBQUU7Z0JBQ1QsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsRUFBRSxFQUFFLElBQUk7YUFDVDtTQUNGLENBQUMsQ0FBQztLQUNKO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsWUFBWSxDQUFDLFNBQWlCLEVBQUUsT0FBZTtRQUMzRCxPQUFPLElBQUksY0FBYyxDQUFDO1lBQ3hCLFFBQVEsRUFBRSxDQUFDO1lBQ1gsU0FBUyxFQUFFO2dCQUNULElBQUksRUFBRSxTQUFTO2dCQUNmLEVBQUUsRUFBRSxPQUFPO2FBQ1o7U0FDRixDQUFDLENBQUM7S0FDSjtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFZO1FBQ2hDLE9BQU8sSUFBSSxjQUFjLENBQUM7WUFDeEIsUUFBUSxFQUFFLEVBQUU7WUFDWixTQUFTLEVBQUU7Z0JBQ1QsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsRUFBRSxFQUFFLElBQUk7YUFDVDtTQUNGLENBQUMsQ0FBQztLQUNKO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsWUFBWSxDQUFDLFNBQWlCLEVBQUUsT0FBZTtRQUMzRCxPQUFPLElBQUksY0FBYyxDQUFDO1lBQ3hCLFFBQVEsRUFBRSxFQUFFO1lBQ1osU0FBUyxFQUFFO2dCQUNULElBQUksRUFBRSxTQUFTO2dCQUNmLEVBQUUsRUFBRSxPQUFPO2FBQ1o7U0FDRixDQUFDLENBQUM7S0FDSjs7OztBQWxGbUIsZ0NBQVU7QUF1RmhDLE1BQU0sY0FBZSxTQUFRLFVBQVU7SUFDckMsWUFBNkIsTUFBd0I7UUFDbkQsS0FBSyxFQUFFLENBQUM7UUFEbUIsV0FBTSxHQUFOLE1BQU0sQ0FBa0I7S0FFcEQ7SUFFTSxlQUFlO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztLQUNwQjtDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBFaXRoZXIgYW4gSVB2NCBvciBhbiBJUHY2IENJRFJcbiAqXG4gKlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQWNsQ2lkciB7XG4gIC8qKlxuICAgKiBBbiBJUCBuZXR3b3JrIHJhbmdlIGluIENJRFIgbm90YXRpb24gKGZvciBleGFtcGxlLCAxNzIuMTYuMC4wLzI0KS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgaXB2NChpcHY0Q2lkcjogc3RyaW5nKTogQWNsQ2lkciB7XG4gICAgcmV0dXJuIG5ldyBBY2xDaWRySW1wbCh7XG4gICAgICBjaWRyQmxvY2s6IGlwdjRDaWRyLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBDSURSIGNvbnRhaW5pbmcgYWxsIElQdjQgYWRkcmVzc2VzIChpLmUuLCAwLjAuMC4wLzApXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFueUlwdjQoKTogQWNsQ2lkciB7XG4gICAgcmV0dXJuIEFjbENpZHIuaXB2NCgnMC4wLjAuMC8wJyk7XG4gIH1cblxuICAvKipcbiAgICogQW4gSVB2NiBuZXR3b3JrIHJhbmdlIGluIENJRFIgbm90YXRpb24gKGZvciBleGFtcGxlLCAyMDAxOmRiODo6LzQ4KVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBpcHY2KGlwdjZDaWRyOiBzdHJpbmcpOiBBY2xDaWRyIHtcbiAgICByZXR1cm4gbmV3IEFjbENpZHJJbXBsKHtcbiAgICAgIGlwdjZDaWRyQmxvY2s6IGlwdjZDaWRyLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBDSURSIGNvbnRhaW5pbmcgYWxsIElQdjYgYWRkcmVzc2VzIChpLmUuLCA6Oi8wKVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBhbnlJcHY2KCk6IEFjbENpZHIge1xuICAgIHJldHVybiBBY2xDaWRyLmlwdjYoJzo6LzAnKTtcbiAgfVxuXG4gIHB1YmxpYyBhYnN0cmFjdCB0b0NpZHJDb25maWcoKTogQWNsQ2lkckNvbmZpZztcbn1cblxuY2xhc3MgQWNsQ2lkckltcGwgZXh0ZW5kcyBBY2xDaWRyIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBjb25maWc6IEFjbENpZHJDb25maWcpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgcHVibGljIHRvQ2lkckNvbmZpZygpOiBBY2xDaWRyQ29uZmlnIHtcbiAgICByZXR1cm4gdGhpcy5jb25maWc7XG4gIH1cbn1cblxuLyoqXG4gKiBBY2wgQ29uZmlndXJhdGlvbiBmb3IgQ0lEUlxuICpcbiAqXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQWNsQ2lkckNvbmZpZyB7XG4gIC8qKlxuICAgKiBJcHY0IENJRFJcbiAgICovXG4gIHJlYWRvbmx5IGNpZHJCbG9jaz86IHN0cmluZztcblxuICAvKipcbiAgICogSXB2NiBDSURSXG4gICAqL1xuICByZWFkb25seSBpcHY2Q2lkckJsb2NrPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIFRoZSB0cmFmZmljIHRoYXQgaXMgY29uZmlndXJlZCB1c2luZyBhIE5ldHdvcmsgQUNMIGVudHJ5XG4gKlxuICpcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFjbFRyYWZmaWMge1xuICAvKipcbiAgICogQXBwbHkgdGhlIEFDTCBlbnRyeSB0byBhbGwgdHJhZmZpY1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBhbGxUcmFmZmljKCk6IEFjbFRyYWZmaWMge1xuICAgIHJldHVybiBuZXcgQWNsVHJhZmZpY0ltcGwoe1xuICAgICAgcHJvdG9jb2w6IC0xLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGx5IHRoZSBBQ0wgZW50cnkgdG8gSUNNUCB0cmFmZmljIG9mIGdpdmVuIHR5cGUgYW5kIGNvZGVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgaWNtcChwcm9wczogQWNsSWNtcCk6IEFjbFRyYWZmaWMge1xuICAgIHJldHVybiBuZXcgQWNsVHJhZmZpY0ltcGwoe1xuICAgICAgcHJvdG9jb2w6IDEsXG4gICAgICBpY21wOiBwcm9wcyxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBseSB0aGUgQUNMIGVudHJ5IHRvIElDTVB2NiB0cmFmZmljIG9mIGdpdmVuIHR5cGUgYW5kIGNvZGVcbiAgICpcbiAgICogUmVxdWlyZXMgYW4gSVB2NiBDSURSIGJsb2NrLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBpY21wdjYocHJvcHM6IEFjbEljbXApOiBBY2xUcmFmZmljIHtcbiAgICByZXR1cm4gbmV3IEFjbFRyYWZmaWNJbXBsKHtcbiAgICAgIHByb3RvY29sOiA1OCxcbiAgICAgIGljbXA6IHByb3BzLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGx5IHRoZSBBQ0wgZW50cnkgdG8gVENQIHRyYWZmaWMgb24gYSBnaXZlbiBwb3J0XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHRjcFBvcnQocG9ydDogbnVtYmVyKTogQWNsVHJhZmZpYyB7XG4gICAgcmV0dXJuIG5ldyBBY2xUcmFmZmljSW1wbCh7XG4gICAgICBwcm90b2NvbDogNixcbiAgICAgIHBvcnRSYW5nZToge1xuICAgICAgICBmcm9tOiBwb3J0LFxuICAgICAgICB0bzogcG9ydCxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQXBwbHkgdGhlIEFDTCBlbnRyeSB0byBUQ1AgdHJhZmZpYyBvbiBhIGdpdmVuIHBvcnQgcmFuZ2VcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgdGNwUG9ydFJhbmdlKHN0YXJ0UG9ydDogbnVtYmVyLCBlbmRQb3J0OiBudW1iZXIpOiBBY2xUcmFmZmljIHtcbiAgICByZXR1cm4gbmV3IEFjbFRyYWZmaWNJbXBsKHtcbiAgICAgIHByb3RvY29sOiA2LFxuICAgICAgcG9ydFJhbmdlOiB7XG4gICAgICAgIGZyb206IHN0YXJ0UG9ydCxcbiAgICAgICAgdG86IGVuZFBvcnQsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGx5IHRoZSBBQ0wgZW50cnkgdG8gVURQIHRyYWZmaWMgb24gYSBnaXZlbiBwb3J0XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHVkcFBvcnQocG9ydDogbnVtYmVyKTogQWNsVHJhZmZpYyB7XG4gICAgcmV0dXJuIG5ldyBBY2xUcmFmZmljSW1wbCh7XG4gICAgICBwcm90b2NvbDogMTcsXG4gICAgICBwb3J0UmFuZ2U6IHtcbiAgICAgICAgZnJvbTogcG9ydCxcbiAgICAgICAgdG86IHBvcnQsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGx5IHRoZSBBQ0wgZW50cnkgdG8gVURQIHRyYWZmaWMgb24gYSBnaXZlbiBwb3J0IHJhbmdlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHVkcFBvcnRSYW5nZShzdGFydFBvcnQ6IG51bWJlciwgZW5kUG9ydDogbnVtYmVyKTogQWNsVHJhZmZpYyB7XG4gICAgcmV0dXJuIG5ldyBBY2xUcmFmZmljSW1wbCh7XG4gICAgICBwcm90b2NvbDogMTcsXG4gICAgICBwb3J0UmFuZ2U6IHtcbiAgICAgICAgZnJvbTogc3RhcnRQb3J0LFxuICAgICAgICB0bzogZW5kUG9ydCxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgYWJzdHJhY3QgdG9UcmFmZmljQ29uZmlnKCk6IEFjbFRyYWZmaWNDb25maWc7XG59XG5cbmNsYXNzIEFjbFRyYWZmaWNJbXBsIGV4dGVuZHMgQWNsVHJhZmZpYyB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgY29uZmlnOiBBY2xUcmFmZmljQ29uZmlnKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIHB1YmxpYyB0b1RyYWZmaWNDb25maWcoKTogQWNsVHJhZmZpY0NvbmZpZyB7XG4gICAgcmV0dXJuIHRoaXMuY29uZmlnO1xuICB9XG59XG5cbi8qKlxuICogQWNsIENvbmZpZ3VyYXRpb24gZm9yIHRyYWZmaWNcbiAqXG4gKlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFjbFRyYWZmaWNDb25maWcge1xuICAvKipcbiAgICogVGhlIEludGVybmV0IENvbnRyb2wgTWVzc2FnZSBQcm90b2NvbCAoSUNNUCkgY29kZSBhbmQgdHlwZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBSZXF1aXJlZCBpZiBzcGVjaWZ5aW5nIDEgKElDTVApIGZvciB0aGUgcHJvdG9jb2wgcGFyYW1ldGVyLlxuICAgKi9cbiAgcmVhZG9ubHkgaWNtcD86IEFjbEljbXA7XG5cbiAgLyoqXG4gICAqIFRoZSByYW5nZSBvZiBwb3J0IG51bWJlcnMgZm9yIHRoZSBVRFAvVENQIHByb3RvY29sLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFJlcXVpcmVkIGlmIHNwZWNpZnlpbmcgNiAoVENQKSBvciAxNyAoVURQKSBmb3IgdGhlIHByb3RvY29sIHBhcmFtZXRlclxuICAgKi9cbiAgcmVhZG9ubHkgcG9ydFJhbmdlPzogQWNsUG9ydFJhbmdlO1xuXG4gIC8qKlxuICAgKiBUaGUgcHJvdG9jb2wgbnVtYmVyLlxuICAgKlxuICAgKiBBIHZhbHVlIG9mIFwiLTFcIiBtZWFucyBhbGwgcHJvdG9jb2xzLlxuICAgKlxuICAgKiBJZiB5b3Ugc3BlY2lmeSBcIi0xXCIgb3IgYSBwcm90b2NvbCBudW1iZXIgb3RoZXIgdGhhbiBcIjZcIiAoVENQKSwgXCIxN1wiIChVRFApLFxuICAgKiBvciBcIjFcIiAoSUNNUCksIHRyYWZmaWMgb24gYWxsIHBvcnRzIGlzIGFsbG93ZWQsIHJlZ2FyZGxlc3Mgb2YgYW55IHBvcnRzIG9yXG4gICAqIElDTVAgdHlwZXMgb3IgY29kZXMgdGhhdCB5b3Ugc3BlY2lmeS5cbiAgICpcbiAgICogSWYgeW91IHNwZWNpZnkgcHJvdG9jb2wgXCI1OFwiIChJQ01QdjYpIGFuZCBzcGVjaWZ5IGFuIElQdjQgQ0lEUlxuICAgKiBibG9jaywgdHJhZmZpYyBmb3IgYWxsIElDTVAgdHlwZXMgYW5kIGNvZGVzIGFsbG93ZWQsIHJlZ2FyZGxlc3Mgb2YgYW55IHRoYXRcbiAgICogeW91IHNwZWNpZnkuIElmIHlvdSBzcGVjaWZ5IHByb3RvY29sIFwiNThcIiAoSUNNUHY2KSBhbmQgc3BlY2lmeSBhbiBJUHY2IENJRFJcbiAgICogYmxvY2ssIHlvdSBtdXN0IHNwZWNpZnkgYW4gSUNNUCB0eXBlIGFuZCBjb2RlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAxN1xuICAgKi9cbiAgcmVhZG9ubHkgcHJvdG9jb2w6IG51bWJlcjtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIHRvIGNyZWF0ZSBJY21wXG4gKlxuICpcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBY2xJY21wIHtcbiAgLyoqXG4gICAqIFRoZSBJbnRlcm5ldCBDb250cm9sIE1lc3NhZ2UgUHJvdG9jb2wgKElDTVApIHR5cGUuIFlvdSBjYW4gdXNlIC0xIHRvIHNwZWNpZnkgYWxsIElDTVAgdHlwZXMuXG4gICAqIENvbmRpdGlvbmFsIHJlcXVpcmVtZW50OiBSZXF1aXJlZCBpZiB5b3Ugc3BlY2lmeSAxIChJQ01QKSBmb3IgdGhlIENyZWF0ZU5ldHdvcmtBY2xFbnRyeSBwcm90b2NvbCBwYXJhbWV0ZXIuXG4gICAqL1xuICByZWFkb25seSB0eXBlPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgSW50ZXJuZXQgQ29udHJvbCBNZXNzYWdlIFByb3RvY29sIChJQ01QKSBjb2RlLiBZb3UgY2FuIHVzZSAtMSB0byBzcGVjaWZ5IGFsbCBJQ01QXG4gICAqIGNvZGVzIGZvciB0aGUgZ2l2ZW4gSUNNUCB0eXBlLiBSZXF1aXJlbWVudCBpcyBjb25kaXRpb25hbDogUmVxdWlyZWQgaWYgeW91XG4gICAqIHNwZWNpZnkgMSAoSUNNUCkgZm9yIHRoZSBwcm90b2NvbCBwYXJhbWV0ZXIuXG4gICAqL1xuICByZWFkb25seSBjb2RlPzogbnVtYmVyO1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgdG8gY3JlYXRlIFBvcnRSYW5nZVxuICpcbiAqXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQWNsUG9ydFJhbmdlIHtcbiAgLyoqXG4gICAqIFRoZSBmaXJzdCBwb3J0IGluIHRoZSByYW5nZS4gUmVxdWlyZWQgaWYgeW91IHNwZWNpZnkgNiAoVENQKSBvciAxNyAoVURQKSBmb3IgdGhlIHByb3RvY29sIHBhcmFtZXRlci5cbiAgICovXG4gIHJlYWRvbmx5IGZyb20/OiBudW1iZXJcblxuICAvKipcbiAgICogVGhlIGxhc3QgcG9ydCBpbiB0aGUgcmFuZ2UuIFJlcXVpcmVkIGlmIHlvdSBzcGVjaWZ5IDYgKFRDUCkgb3IgMTcgKFVEUCkgZm9yIHRoZSBwcm90b2NvbCBwYXJhbWV0ZXIuXG4gICAqL1xuICByZWFkb25seSB0bz86IG51bWJlclxufVxuIl19