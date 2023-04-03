"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Peer = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const connections_1 = require("./connections");
/**
 * Peer object factories (to be used in Security Group management)
 *
 * The static methods on this object can be used to create peer objects
 * which represent a connection partner in Security Group rules.
 *
 * Use this object if you need to represent connection partners using plain IP
 * addresses, or a prefix list ID.
 *
 * If you want to address a connection partner by Security Group, you can just
 * use the Security Group (or the construct that contains a Security Group)
 * directly, as it already implements `IPeer`.
 */
class Peer {
    /**
     * Create an IPv4 peer from a CIDR
     */
    static ipv4(cidrIp) {
        return new CidrIPv4(cidrIp);
    }
    /**
     * Any IPv4 address
     */
    static anyIpv4() {
        return new AnyIPv4();
    }
    /**
     * Create an IPv6 peer from a CIDR
     */
    static ipv6(cidrIp) {
        return new CidrIPv6(cidrIp);
    }
    /**
     * Any IPv6 address
     */
    static anyIpv6() {
        return new AnyIPv6();
    }
    /**
     * A prefix list
     */
    static prefixList(prefixListId) {
        return new PrefixList(prefixListId);
    }
    /**
     * A security group ID
     */
    static securityGroupId(securityGroupId, sourceSecurityGroupOwnerId) {
        return new SecurityGroupId(securityGroupId, sourceSecurityGroupOwnerId);
    }
    constructor() {
    }
}
_a = JSII_RTTI_SYMBOL_1;
Peer[_a] = { fqn: "@aws-cdk/aws-ec2.Peer", version: "0.0.0" };
exports.Peer = Peer;
/**
 * A connection to and from a given IP range
 */
class CidrIPv4 {
    constructor(cidrIp) {
        this.cidrIp = cidrIp;
        this.canInlineRule = true;
        this.connections = new connections_1.Connections({ peer: this });
        if (!core_1.Token.isUnresolved(cidrIp)) {
            const cidrMatch = cidrIp.match(/^(\d{1,3}\.){3}\d{1,3}(\/\d+)?$/);
            if (!cidrMatch) {
                throw new Error(`Invalid IPv4 CIDR: "${cidrIp}"`);
            }
            if (!cidrMatch[2]) {
                throw new Error(`CIDR mask is missing in IPv4: "${cidrIp}". Did you mean "${cidrIp}/32"?`);
            }
        }
        this.uniqueId = cidrIp;
    }
    /**
     * Produce the ingress rule JSON for the given connection
     */
    toIngressRuleConfig() {
        return { cidrIp: this.cidrIp };
    }
    /**
     * Produce the egress rule JSON for the given connection
     */
    toEgressRuleConfig() {
        return { cidrIp: this.cidrIp };
    }
}
/**
 * Any IPv4 address
 */
class AnyIPv4 extends CidrIPv4 {
    constructor() {
        super('0.0.0.0/0');
    }
}
/**
 * A connection to a from a given IPv6 range
 */
class CidrIPv6 {
    constructor(cidrIpv6) {
        this.cidrIpv6 = cidrIpv6;
        this.canInlineRule = true;
        this.connections = new connections_1.Connections({ peer: this });
        if (!core_1.Token.isUnresolved(cidrIpv6)) {
            const cidrMatch = cidrIpv6.match(/^([\da-f]{0,4}:){2,7}([\da-f]{0,4})?(\/\d+)?$/);
            if (!cidrMatch) {
                throw new Error(`Invalid IPv6 CIDR: "${cidrIpv6}"`);
            }
            if (!cidrMatch[3]) {
                throw new Error(`CIDR mask is missing in IPv6: "${cidrIpv6}". Did you mean "${cidrIpv6}/128"?`);
            }
        }
        this.uniqueId = cidrIpv6;
    }
    /**
     * Produce the ingress rule JSON for the given connection
     */
    toIngressRuleConfig() {
        return { cidrIpv6: this.cidrIpv6 };
    }
    /**
     * Produce the egress rule JSON for the given connection
     */
    toEgressRuleConfig() {
        return { cidrIpv6: this.cidrIpv6 };
    }
}
/**
 * Any IPv6 address
 */
class AnyIPv6 extends CidrIPv6 {
    constructor() {
        super('::/0');
    }
}
/**
 * A prefix list
 *
 * Prefix lists are used to allow traffic to VPC-local service endpoints.
 *
 * For more information, see this page:
 *
 * https://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/vpc-endpoints.html
 */
class PrefixList {
    constructor(prefixListId) {
        this.prefixListId = prefixListId;
        this.canInlineRule = false;
        this.connections = new connections_1.Connections({ peer: this });
        this.uniqueId = prefixListId;
    }
    toIngressRuleConfig() {
        return { sourcePrefixListId: this.prefixListId };
    }
    toEgressRuleConfig() {
        return { destinationPrefixListId: this.prefixListId };
    }
}
/**
 * A connection to or from a given security group ID
 *
 * For ingress rules, a sourceSecurityGroupOwnerId parameter can be specified if
 * the security group exists in another account.
 * This parameter will be ignored for egress rules.
 */
class SecurityGroupId {
    constructor(securityGroupId, sourceSecurityGroupOwnerId) {
        this.securityGroupId = securityGroupId;
        this.sourceSecurityGroupOwnerId = sourceSecurityGroupOwnerId;
        this.canInlineRule = true;
        this.connections = new connections_1.Connections({ peer: this });
        if (!core_1.Token.isUnresolved(securityGroupId)) {
            const securityGroupMatch = securityGroupId.match(/^sg-[a-z0-9]{8,17}$/);
            if (!securityGroupMatch) {
                throw new Error(`Invalid security group ID: "${securityGroupId}"`);
            }
        }
        if (sourceSecurityGroupOwnerId && !core_1.Token.isUnresolved(sourceSecurityGroupOwnerId)) {
            const accountNumberMatch = sourceSecurityGroupOwnerId.match(/^[0-9]{12}$/);
            if (!accountNumberMatch) {
                throw new Error(`Invalid security group owner ID: "${sourceSecurityGroupOwnerId}"`);
            }
        }
        this.uniqueId = securityGroupId;
    }
    /**
     * Produce the ingress rule JSON for the given connection
     */
    toIngressRuleConfig() {
        return {
            sourceSecurityGroupId: this.securityGroupId,
            ...(this.sourceSecurityGroupOwnerId && { sourceSecurityGroupOwnerId: this.sourceSecurityGroupOwnerId }),
        };
    }
    /**
     * Produce the egress rule JSON for the given connection
     */
    toEgressRuleConfig() {
        return { destinationSecurityGroupId: this.securityGroupId };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBlZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx3Q0FBc0M7QUFDdEMsK0NBQTBEO0FBMkIxRDs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCxNQUFhLElBQUk7SUFDZjs7T0FFRztJQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBYztRQUMvQixPQUFPLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzdCO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsT0FBTztRQUNuQixPQUFPLElBQUksT0FBTyxFQUFFLENBQUM7S0FDdEI7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBYztRQUMvQixPQUFPLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzdCO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsT0FBTztRQUNuQixPQUFPLElBQUksT0FBTyxFQUFFLENBQUM7S0FDdEI7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxVQUFVLENBQUMsWUFBb0I7UUFDM0MsT0FBTyxJQUFJLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUNyQztJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLGVBQWUsQ0FBQyxlQUF1QixFQUFFLDBCQUFtQztRQUN4RixPQUFPLElBQUksZUFBZSxDQUFDLGVBQWUsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO0tBQ3pFO0lBRUQ7S0FDQzs7OztBQTVDVSxvQkFBSTtBQStDakI7O0dBRUc7QUFDSCxNQUFNLFFBQVE7SUFLWixZQUE2QixNQUFjO1FBQWQsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUozQixrQkFBYSxHQUFHLElBQUksQ0FBQztRQUNyQixnQkFBVyxHQUFnQixJQUFJLHlCQUFXLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUl6RSxJQUFJLENBQUMsWUFBSyxDQUFDLFlBQVksQ0FBQyxN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QixDQUFTO1FBSjFGLGtCQUFhLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLGdCQUFXLEdBQWdCLElBQUkseUJBQVcsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBSXpFLElBQUksQ0FBQyxZQUFLLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxFQUFFO1lBQ3hDLE1BQU0sa0JBQWtCLEdBQUcsZUFBZSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBRXhFLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtnQkFDdkIsTUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBK0IsZUFBZSxHQUFHLENBQUMsQ0FBQzthQUNwRTtTQUNGO1FBRUQsSUFBSSwwQkFBMEIsSUFBSSxDQUFDLFlBQUssQ0FBQyxZQUFZLENBQUMsMEJBQTBCLENBQUMsRUFBRTtZQUNqRixNQUFNLGtCQUFrQixHQUFHLDBCQUEwQixDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUUzRSxJQUFJLENBQUMsa0JBQWtCLEVBQUU7Z0JBQ3ZCLE1BQU0sSUFBSSxLQUFLLENBQUMscUNBQXFDLDBCQUEwQixHQUFHLENBQUMsQ0FBQzthQUNyRjtTQUNGO1FBQ0QsSUFBSSxDQUFDLFFBQVEsR0FBRyxlQUFlLENBQUM7S0FDakM7SUFFRDs7T0FFRztJQUNJLG1CQUFtQjtRQUN4QixPQUFPO1lBQ0wscUJBQXFCLEVBQUUsSUFBSSxDQUFDLGVBQWU7WUFDM0MsR0FBRyxDQUFDLElBQUksQ0FBQywwQkFBMEIsSUFBSSxFQUFFLDBCQUEwQixFQUFFLElBQUksQ0FBQywwQkFBMEIsRUFBRSxDQUFDO1NBQ3hHLENBQUM7S0FDSDtJQUVEOztPQUVHO0lBQ0ksa0JBQWtCO1FBQ3ZCLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7S0FDN0Q7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRva2VuIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25uZWN0aW9ucywgSUNvbm5lY3RhYmxlIH0gZnJvbSAnLi9jb25uZWN0aW9ucyc7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciBjbGFzc2VzIHRoYXQgcHJvdmlkZSB0aGUgcGVlci1zcGVjaWZpY2F0aW9uIHBhcnRzIG9mIGEgc2VjdXJpdHkgZ3JvdXAgcnVsZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIElQZWVyIGV4dGVuZHMgSUNvbm5lY3RhYmxlIHtcbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIHJ1bGUgY2FuIGJlIGlubGluZWQgaW50byBhIFNlY3VyaXR5R3JvdXAgb3Igbm90XG4gICAqL1xuICByZWFkb25seSBjYW5JbmxpbmVSdWxlOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBBIHVuaXF1ZSBpZGVudGlmaWVyIGZvciB0aGlzIGNvbm5lY3Rpb24gcGVlclxuICAgKi9cbiAgcmVhZG9ubHkgdW5pcXVlSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogUHJvZHVjZSB0aGUgaW5ncmVzcyBydWxlIEpTT04gZm9yIHRoZSBnaXZlbiBjb25uZWN0aW9uXG4gICAqL1xuICB0b0luZ3Jlc3NSdWxlQ29uZmlnKCk6IGFueTtcblxuICAvKipcbiAgICogUHJvZHVjZSB0aGUgZWdyZXNzIHJ1bGUgSlNPTiBmb3IgdGhlIGdpdmVuIGNvbm5lY3Rpb25cbiAgICovXG4gIHRvRWdyZXNzUnVsZUNvbmZpZygpOiBhbnk7XG59XG5cbi8qKlxuICogUGVlciBvYmplY3QgZmFjdG9yaWVzICh0byBiZSB1c2VkIGluIFNlY3VyaXR5IEdyb3VwIG1hbmFnZW1lbnQpXG4gKlxuICogVGhlIHN0YXRpYyBtZXRob2RzIG9uIHRoaXMgb2JqZWN0IGNhbiBiZSB1c2VkIHRvIGNyZWF0ZSBwZWVyIG9iamVjdHNcbiAqIHdoaWNoIHJlcHJlc2VudCBhIGNvbm5lY3Rpb24gcGFydG5lciBpbiBTZWN1cml0eSBHcm91cCBydWxlcy5cbiAqXG4gKiBVc2UgdGhpcyBvYmplY3QgaWYgeW91IG5lZWQgdG8gcmVwcmVzZW50IGNvbm5lY3Rpb24gcGFydG5lcnMgdXNpbmcgcGxhaW4gSVBcbiAqIGFkZHJlc3Nlcywgb3IgYSBwcmVmaXggbGlzdCBJRC5cbiAqXG4gKiBJZiB5b3Ugd2FudCB0byBhZGRyZXNzIGEgY29ubmVjdGlvbiBwYXJ0bmVyIGJ5IFNlY3VyaXR5IEdyb3VwLCB5b3UgY2FuIGp1c3RcbiAqIHVzZSB0aGUgU2VjdXJpdHkgR3JvdXAgKG9yIHRoZSBjb25zdHJ1Y3QgdGhhdCBjb250YWlucyBhIFNlY3VyaXR5IEdyb3VwKVxuICogZGlyZWN0bHksIGFzIGl0IGFscmVhZHkgaW1wbGVtZW50cyBgSVBlZXJgLlxuICovXG5leHBvcnQgY2xhc3MgUGVlciB7XG4gIC8qKlxuICAgKiBDcmVhdGUgYW4gSVB2NCBwZWVyIGZyb20gYSBDSURSXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGlwdjQoY2lkcklwOiBzdHJpbmcpOiBJUGVlciB7XG4gICAgcmV0dXJuIG5ldyBDaWRySVB2NChjaWRySXApO1xuICB9XG5cbiAgLyoqXG4gICAqIEFueSBJUHY0IGFkZHJlc3NcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYW55SXB2NCgpOiBJUGVlciB7XG4gICAgcmV0dXJuIG5ldyBBbnlJUHY0KCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGFuIElQdjYgcGVlciBmcm9tIGEgQ0lEUlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBpcHY2KGNpZHJJcDogc3RyaW5nKTogSVBlZXIge1xuICAgIHJldHVybiBuZXcgQ2lkcklQdjYoY2lkcklwKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbnkgSVB2NiBhZGRyZXNzXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFueUlwdjYoKTogSVBlZXIge1xuICAgIHJldHVybiBuZXcgQW55SVB2NigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgcHJlZml4IGxpc3RcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcHJlZml4TGlzdChwcmVmaXhMaXN0SWQ6IHN0cmluZyk6IElQZWVyIHtcbiAgICByZXR1cm4gbmV3IFByZWZpeExpc3QocHJlZml4TGlzdElkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHNlY3VyaXR5IGdyb3VwIElEXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHNlY3VyaXR5R3JvdXBJZChzZWN1cml0eUdyb3VwSWQ6IHN0cmluZywgc291cmNlU2VjdXJpdHlHcm91cE93bmVySWQ/OiBzdHJpbmcpOiBJUGVlciB7XG4gICAgcmV0dXJuIG5ldyBTZWN1cml0eUdyb3VwSWQoc2VjdXJpdHlHcm91cElkLCBzb3VyY2VTZWN1cml0eUdyb3VwT3duZXJJZCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgY29uc3RydWN0b3IoKSB7XG4gIH1cbn1cblxuLyoqXG4gKiBBIGNvbm5lY3Rpb24gdG8gYW5kIGZyb20gYSBnaXZlbiBJUCByYW5nZVxuICovXG5jbGFzcyBDaWRySVB2NCBpbXBsZW1lbnRzIElQZWVyIHtcbiAgcHVibGljIHJlYWRvbmx5IGNhbklubGluZVJ1bGUgPSB0cnVlO1xuICBwdWJsaWMgcmVhZG9ubHkgY29ubmVjdGlvbnM6IENvbm5lY3Rpb25zID0gbmV3IENvbm5lY3Rpb25zKHsgcGVlcjogdGhpcyB9KTtcbiAgcHVibGljIHJlYWRvbmx5IHVuaXF1ZUlkOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBjaWRySXA6IHN0cmluZykge1xuICAgIGlmICghVG9rZW4uaXNVbnJlc29sdmVkKGNpZHJJcCkpIHtcbiAgICAgIGNvbnN0IGNpZHJNYXRjaCA9IGNpZHJJcC5tYXRjaCgvXihcXGR7MSwzfVxcLil7M31cXGR7MSwzfShcXC9cXGQrKT8kLyk7XG5cbiAgICAgIGlmICghY2lkck1hdGNoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBJUHY0IENJRFI6IFwiJHtjaWRySXB9XCJgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFjaWRyTWF0Y2hbMl0pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDSURSIG1hc2sgaXMgbWlzc2luZyBpbiBJUHY0OiBcIiR7Y2lkcklwfVwiLiBEaWQgeW91IG1lYW4gXCIke2NpZHJJcH0vMzJcIj9gKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnVuaXF1ZUlkID0gY2lkcklwO1xuICB9XG5cbiAgLyoqXG4gICAqIFByb2R1Y2UgdGhlIGluZ3Jlc3MgcnVsZSBKU09OIGZvciB0aGUgZ2l2ZW4gY29ubmVjdGlvblxuICAgKi9cbiAgcHVibGljIHRvSW5ncmVzc1J1bGVDb25maWcoKTogYW55IHtcbiAgICByZXR1cm4geyBjaWRySXA6IHRoaXMuY2lkcklwIH07XG4gIH1cbiAgLyoqXG4gICAqIFByb2R1Y2UgdGhlIGVncmVzcyBydWxlIEpTT04gZm9yIHRoZSBnaXZlbiBjb25uZWN0aW9uXG4gICAqL1xuICBwdWJsaWMgdG9FZ3Jlc3NSdWxlQ29uZmlnKCk6IGFueSB7XG4gICAgcmV0dXJuIHsgY2lkcklwOiB0aGlzLmNpZHJJcCB9O1xuICB9XG59XG5cbi8qKlxuICogQW55IElQdjQgYWRkcmVzc1xuICovXG5jbGFzcyBBbnlJUHY0IGV4dGVuZHMgQ2lkcklQdjQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcignMC4wLjAuMC8wJyk7XG4gIH1cbn1cblxuLyoqXG4gKiBBIGNvbm5lY3Rpb24gdG8gYSBmcm9tIGEgZ2l2ZW4gSVB2NiByYW5nZVxuICovXG5jbGFzcyBDaWRySVB2NiBpbXBsZW1lbnRzIElQZWVyIHtcbiAgcHVibGljIHJlYWRvbmx5IGNhbklubGluZVJ1bGUgPSB0cnVlO1xuICBwdWJsaWMgcmVhZG9ubHkgY29ubmVjdGlvbnM6IENvbm5lY3Rpb25zID0gbmV3IENvbm5lY3Rpb25zKHsgcGVlcjogdGhpcyB9KTtcbiAgcHVibGljIHJlYWRvbmx5IHVuaXF1ZUlkOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBjaWRySXB2Njogc3RyaW5nKSB7XG4gICAgaWYgKCFUb2tlbi5pc1VucmVzb2x2ZWQoY2lkcklwdjYpKSB7XG4gICAgICBjb25zdCBjaWRyTWF0Y2ggPSBjaWRySXB2Ni5tYXRjaCgvXihbXFxkYS1mXXswLDR9Oil7Miw3fShbXFxkYS1mXXswLDR9KT8oXFwvXFxkKyk/JC8pO1xuXG4gICAgICBpZiAoIWNpZHJNYXRjaCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgSVB2NiBDSURSOiBcIiR7Y2lkcklwdjZ9XCJgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFjaWRyTWF0Y2hbM10pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDSURSIG1hc2sgaXMgbWlzc2luZyBpbiBJUHY2OiBcIiR7Y2lkcklwdjZ9XCIuIERpZCB5b3UgbWVhbiBcIiR7Y2lkcklwdjZ9LzEyOFwiP2ApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMudW5pcXVlSWQgPSBjaWRySXB2NjtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9kdWNlIHRoZSBpbmdyZXNzIHJ1bGUgSlNPTiBmb3IgdGhlIGdpdmVuIGNvbm5lY3Rpb25cbiAgICovXG4gIHB1YmxpYyB0b0luZ3Jlc3NSdWxlQ29uZmlnKCk6IGFueSB7XG4gICAgcmV0dXJuIHsgY2lkcklwdjY6IHRoaXMuY2lkcklwdjYgfTtcbiAgfVxuICAvKipcbiAgICogUHJvZHVjZSB0aGUgZWdyZXNzIHJ1bGUgSlNPTiBmb3IgdGhlIGdpdmVuIGNvbm5lY3Rpb25cbiAgICovXG4gIHB1YmxpYyB0b0VncmVzc1J1bGVDb25maWcoKTogYW55IHtcbiAgICByZXR1cm4geyBjaWRySXB2NjogdGhpcy5jaWRySXB2NiB9O1xuICB9XG59XG5cbi8qKlxuICogQW55IElQdjYgYWRkcmVzc1xuICovXG5jbGFzcyBBbnlJUHY2IGV4dGVuZHMgQ2lkcklQdjYge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcignOjovMCcpO1xuICB9XG59XG5cbi8qKlxuICogQSBwcmVmaXggbGlzdFxuICpcbiAqIFByZWZpeCBsaXN0cyBhcmUgdXNlZCB0byBhbGxvdyB0cmFmZmljIHRvIFZQQy1sb2NhbCBzZXJ2aWNlIGVuZHBvaW50cy5cbiAqXG4gKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIHRoaXMgcGFnZTpcbiAqXG4gKiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uVlBDL2xhdGVzdC9Vc2VyR3VpZGUvdnBjLWVuZHBvaW50cy5odG1sXG4gKi9cbmNsYXNzIFByZWZpeExpc3QgaW1wbGVtZW50cyBJUGVlciB7XG4gIHB1YmxpYyByZWFkb25seSBjYW5JbmxpbmVSdWxlID0gZmFsc2U7XG4gIHB1YmxpYyByZWFkb25seSBjb25uZWN0aW9uczogQ29ubmVjdGlvbnMgPSBuZXcgQ29ubmVjdGlvbnMoeyBwZWVyOiB0aGlzIH0pO1xuICBwdWJsaWMgcmVhZG9ubHkgdW5pcXVlSWQ6IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHByZWZpeExpc3RJZDogc3RyaW5nKSB7XG4gICAgdGhpcy51bmlxdWVJZCA9IHByZWZpeExpc3RJZDtcbiAgfVxuXG4gIHB1YmxpYyB0b0luZ3Jlc3NSdWxlQ29uZmlnKCk6IGFueSB7XG4gICAgcmV0dXJuIHsgc291cmNlUHJlZml4TGlzdElkOiB0aGlzLnByZWZpeExpc3RJZCB9O1xuICB9XG5cbiAgcHVibGljIHRvRWdyZXNzUnVsZUNvbmZpZygpOiBhbnkge1xuICAgIHJldHVybiB7IGRlc3RpbmF0aW9uUHJlZml4TGlzdElkOiB0aGlzLnByZWZpeExpc3RJZCB9O1xuICB9XG59XG5cbi8qKlxuICogQSBjb25uZWN0aW9uIHRvIG9yIGZyb20gYSBnaXZlbiBzZWN1cml0eSBncm91cCBJRFxuICpcbiAqIEZvciBpbmdyZXNzIHJ1bGVzLCBhIHNvdXJjZVNlY3VyaXR5R3JvdXBPd25lcklkIHBhcmFtZXRlciBjYW4gYmUgc3BlY2lmaWVkIGlmXG4gKiB0aGUgc2VjdXJpdHkgZ3JvdXAgZXhpc3RzIGluIGFub3RoZXIgYWNjb3VudC5cbiAqIFRoaXMgcGFyYW1ldGVyIHdpbGwgYmUgaWdub3JlZCBmb3IgZWdyZXNzIHJ1bGVzLlxuICovXG5jbGFzcyBTZWN1cml0eUdyb3VwSWQgaW1wbGVtZW50cyBJUGVlciB7XG4gIHB1YmxpYyByZWFkb25seSBjYW5JbmxpbmVSdWxlID0gdHJ1ZTtcbiAgcHVibGljIHJlYWRvbmx5IGNvbm5lY3Rpb25zOiBDb25uZWN0aW9ucyA9IG5ldyBDb25uZWN0aW9ucyh7IHBlZXI6IHRoaXMgfSk7XG4gIHB1YmxpYyByZWFkb25seSB1bmlxdWVJZDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgc2VjdXJpdHlHcm91cElkOiBzdHJpbmcsIHByaXZhdGUgcmVhZG9ubHkgc291cmNlU2VjdXJpdHlHcm91cE93bmVySWQ/OiBzdHJpbmcpIHtcbiAgICBpZiAoIVRva2VuLmlzVW5yZXNvbHZlZChzZWN1cml0eUdyb3VwSWQpKSB7XG4gICAgICBjb25zdCBzZWN1cml0eUdyb3VwTWF0Y2ggPSBzZWN1cml0eUdyb3VwSWQubWF0Y2goL15zZy1bYS16MC05XXs4LDE3fSQvKTtcblxuICAgICAgaWYgKCFzZWN1cml0eUdyb3VwTWF0Y2gpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHNlY3VyaXR5IGdyb3VwIElEOiBcIiR7c2VjdXJpdHlHcm91cElkfVwiYCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNvdXJjZVNlY3VyaXR5R3JvdXBPd25lcklkICYmICFUb2tlbi5pc1VucmVzb2x2ZWQoc291cmNlU2VjdXJpdHlHcm91cE93bmVySWQpKSB7XG4gICAgICBjb25zdCBhY2NvdW50TnVtYmVyTWF0Y2ggPSBzb3VyY2VTZWN1cml0eUdyb3VwT3duZXJJZC5tYXRjaCgvXlswLTldezEyfSQvKTtcblxuICAgICAgaWYgKCFhY2NvdW50TnVtYmVyTWF0Y2gpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHNlY3VyaXR5IGdyb3VwIG93bmVyIElEOiBcIiR7c291cmNlU2VjdXJpdHlHcm91cE93bmVySWR9XCJgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy51bmlxdWVJZCA9IHNlY3VyaXR5R3JvdXBJZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9kdWNlIHRoZSBpbmdyZXNzIHJ1bGUgSlNPTiBmb3IgdGhlIGdpdmVuIGNvbm5lY3Rpb25cbiAgICovXG4gIHB1YmxpYyB0b0luZ3Jlc3NSdWxlQ29uZmlnKCk6IGFueSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNvdXJjZVNlY3VyaXR5R3JvdXBJZDogdGhpcy5zZWN1cml0eUdyb3VwSWQsXG4gICAgICAuLi4odGhpcy5zb3VyY2VTZWN1cml0eUdyb3VwT3duZXJJZCAmJiB7IHNvdXJjZVNlY3VyaXR5R3JvdXBPd25lcklkOiB0aGlzLnNvdXJjZVNlY3VyaXR5R3JvdXBPd25lcklkIH0pLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogUHJvZHVjZSB0aGUgZWdyZXNzIHJ1bGUgSlNPTiBmb3IgdGhlIGdpdmVuIGNvbm5lY3Rpb25cbiAgICovXG4gIHB1YmxpYyB0b0VncmVzc1J1bGVDb25maWcoKTogYW55IHtcbiAgICByZXR1cm4geyBkZXN0aW5hdGlvblNlY3VyaXR5R3JvdXBJZDogdGhpcy5zZWN1cml0eUdyb3VwSWQgfTtcbiAgfVxufSJdfQ==