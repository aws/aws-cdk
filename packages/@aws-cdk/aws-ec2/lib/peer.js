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
    constructor() {
    }
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
}
exports.Peer = Peer;
_a = JSII_RTTI_SYMBOL_1;
Peer[_a] = { fqn: "@aws-cdk/aws-ec2.Peer", version: "0.0.0" };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBlZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx3Q0FBc0M7QUFDdEMsK0NBQTBEO0FBMkIxRDs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCxNQUFhLElBQUk7SUEyQ2Y7S0FDQztJQTNDRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBYztRQUMvQixPQUFPLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzdCO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsT0FBTztRQUNuQixPQUFPLElBQUksT0FBTyxFQUFFLENBQUM7S0FDdEI7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBYztRQUMvQixPQUFPLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzdCO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsT0FBTztRQUNuQixPQUFPLElBQUksT0FBTyxFQUFFLENBQUM7S0FDdEI7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxVQUFVLENBQUMsWUFBb0I7UUFDM0MsT0FBTyxJQUFJLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUNyQztJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLGVBQWUsQ0FBQyxlQUF1QixFQUFFLDBCQUFtQztRQUN4RixPQUFPLElBQUksZUFBZSxDQUFDLGVBQWUsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO0tBQ3pFOztBQXpDSCxvQkE2Q0M7OztBQUVEOztHQUVHO0FBQ0gsTUFBTSxRQUFRO0lBS1osWUFBNkIsTUFBYztRQUFkLFdBQU0sR0FBTixNQUFNLENBQVE7UUFKM0Isa0JBQWEsR0FBRyxJQUFJLENBQUM7UUFDckIsZ0JBQVcsR0FBZ0IsSUFBSSx5QkFBVyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFJekUsSUFBSSxDQUFDLFlBQUssQ0FBQyxZQUFZLENBQUMs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MEIsQ0FBUztRQUoxRixrQkFBYSxHQUFHLElBQUksQ0FBQztRQUNyQixnQkFBVyxHQUFnQixJQUFJLHlCQUFXLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUl6RSxJQUFJLENBQUMsWUFBSyxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsRUFBRTtZQUN4QyxNQUFNLGtCQUFrQixHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQztZQUV4RSxJQUFJLENBQUMsa0JBQWtCLEVBQUU7Z0JBQ3ZCLE1BQU0sSUFBSSxLQUFLLENBQUMsK0JBQStCLGVBQWUsR0FBRyxDQUFDLENBQUM7YUFDcEU7U0FDRjtRQUVELElBQUksMEJBQTBCLElBQUksQ0FBQyxZQUFLLENBQUMsWUFBWSxDQUFDLDBCQUEwQixDQUFDLEVBQUU7WUFDakYsTUFBTSxrQkFBa0IsR0FBRywwQkFBMEIsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFM0UsSUFBSSxDQUFDLGtCQUFrQixFQUFFO2dCQUN2QixNQUFNLElBQUksS0FBSyxDQUFDLHFDQUFxQywwQkFBMEIsR0FBRyxDQUFDLENBQUM7YUFDckY7U0FDRjtRQUNELElBQUksQ0FBQyxRQUFRLEdBQUcsZUFBZSxDQUFDO0tBQ2pDO0lBRUQ7O09BRUc7SUFDSSxtQkFBbUI7UUFDeEIsT0FBTztZQUNMLHFCQUFxQixFQUFFLElBQUksQ0FBQyxlQUFlO1lBQzNDLEdBQUcsQ0FBQyxJQUFJLENBQUMsMEJBQTBCLElBQUksRUFBRSwwQkFBMEIsRUFBRSxJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztTQUN4RyxDQUFDO0tBQ0g7SUFFRDs7T0FFRztJQUNJLGtCQUFrQjtRQUN2QixPQUFPLEVBQUUsMEJBQTBCLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0tBQzdEO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUb2tlbiB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29ubmVjdGlvbnMsIElDb25uZWN0YWJsZSB9IGZyb20gJy4vY29ubmVjdGlvbnMnO1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgY2xhc3NlcyB0aGF0IHByb3ZpZGUgdGhlIHBlZXItc3BlY2lmaWNhdGlvbiBwYXJ0cyBvZiBhIHNlY3VyaXR5IGdyb3VwIHJ1bGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJUGVlciBleHRlbmRzIElDb25uZWN0YWJsZSB7XG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBydWxlIGNhbiBiZSBpbmxpbmVkIGludG8gYSBTZWN1cml0eUdyb3VwIG9yIG5vdFxuICAgKi9cbiAgcmVhZG9ubHkgY2FuSW5saW5lUnVsZTogYm9vbGVhbjtcblxuICAvKipcbiAgICogQSB1bmlxdWUgaWRlbnRpZmllciBmb3IgdGhpcyBjb25uZWN0aW9uIHBlZXJcbiAgICovXG4gIHJlYWRvbmx5IHVuaXF1ZUlkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFByb2R1Y2UgdGhlIGluZ3Jlc3MgcnVsZSBKU09OIGZvciB0aGUgZ2l2ZW4gY29ubmVjdGlvblxuICAgKi9cbiAgdG9JbmdyZXNzUnVsZUNvbmZpZygpOiBhbnk7XG5cbiAgLyoqXG4gICAqIFByb2R1Y2UgdGhlIGVncmVzcyBydWxlIEpTT04gZm9yIHRoZSBnaXZlbiBjb25uZWN0aW9uXG4gICAqL1xuICB0b0VncmVzc1J1bGVDb25maWcoKTogYW55O1xufVxuXG4vKipcbiAqIFBlZXIgb2JqZWN0IGZhY3RvcmllcyAodG8gYmUgdXNlZCBpbiBTZWN1cml0eSBHcm91cCBtYW5hZ2VtZW50KVxuICpcbiAqIFRoZSBzdGF0aWMgbWV0aG9kcyBvbiB0aGlzIG9iamVjdCBjYW4gYmUgdXNlZCB0byBjcmVhdGUgcGVlciBvYmplY3RzXG4gKiB3aGljaCByZXByZXNlbnQgYSBjb25uZWN0aW9uIHBhcnRuZXIgaW4gU2VjdXJpdHkgR3JvdXAgcnVsZXMuXG4gKlxuICogVXNlIHRoaXMgb2JqZWN0IGlmIHlvdSBuZWVkIHRvIHJlcHJlc2VudCBjb25uZWN0aW9uIHBhcnRuZXJzIHVzaW5nIHBsYWluIElQXG4gKiBhZGRyZXNzZXMsIG9yIGEgcHJlZml4IGxpc3QgSUQuXG4gKlxuICogSWYgeW91IHdhbnQgdG8gYWRkcmVzcyBhIGNvbm5lY3Rpb24gcGFydG5lciBieSBTZWN1cml0eSBHcm91cCwgeW91IGNhbiBqdXN0XG4gKiB1c2UgdGhlIFNlY3VyaXR5IEdyb3VwIChvciB0aGUgY29uc3RydWN0IHRoYXQgY29udGFpbnMgYSBTZWN1cml0eSBHcm91cClcbiAqIGRpcmVjdGx5LCBhcyBpdCBhbHJlYWR5IGltcGxlbWVudHMgYElQZWVyYC5cbiAqL1xuZXhwb3J0IGNsYXNzIFBlZXIge1xuICAvKipcbiAgICogQ3JlYXRlIGFuIElQdjQgcGVlciBmcm9tIGEgQ0lEUlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBpcHY0KGNpZHJJcDogc3RyaW5nKTogSVBlZXIge1xuICAgIHJldHVybiBuZXcgQ2lkcklQdjQoY2lkcklwKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbnkgSVB2NCBhZGRyZXNzXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFueUlwdjQoKTogSVBlZXIge1xuICAgIHJldHVybiBuZXcgQW55SVB2NCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbiBJUHY2IHBlZXIgZnJvbSBhIENJRFJcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgaXB2NihjaWRySXA6IHN0cmluZyk6IElQZWVyIHtcbiAgICByZXR1cm4gbmV3IENpZHJJUHY2KGNpZHJJcCk7XG4gIH1cblxuICAvKipcbiAgICogQW55IElQdjYgYWRkcmVzc1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBhbnlJcHY2KCk6IElQZWVyIHtcbiAgICByZXR1cm4gbmV3IEFueUlQdjYoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHByZWZpeCBsaXN0XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHByZWZpeExpc3QocHJlZml4TGlzdElkOiBzdHJpbmcpOiBJUGVlciB7XG4gICAgcmV0dXJuIG5ldyBQcmVmaXhMaXN0KHByZWZpeExpc3RJZCk7XG4gIH1cblxuICAvKipcbiAgICogQSBzZWN1cml0eSBncm91cCBJRFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBzZWN1cml0eUdyb3VwSWQoc2VjdXJpdHlHcm91cElkOiBzdHJpbmcsIHNvdXJjZVNlY3VyaXR5R3JvdXBPd25lcklkPzogc3RyaW5nKTogSVBlZXIge1xuICAgIHJldHVybiBuZXcgU2VjdXJpdHlHcm91cElkKHNlY3VyaXR5R3JvdXBJZCwgc291cmNlU2VjdXJpdHlHcm91cE93bmVySWQpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKCkge1xuICB9XG59XG5cbi8qKlxuICogQSBjb25uZWN0aW9uIHRvIGFuZCBmcm9tIGEgZ2l2ZW4gSVAgcmFuZ2VcbiAqL1xuY2xhc3MgQ2lkcklQdjQgaW1wbGVtZW50cyBJUGVlciB7XG4gIHB1YmxpYyByZWFkb25seSBjYW5JbmxpbmVSdWxlID0gdHJ1ZTtcbiAgcHVibGljIHJlYWRvbmx5IGNvbm5lY3Rpb25zOiBDb25uZWN0aW9ucyA9IG5ldyBDb25uZWN0aW9ucyh7IHBlZXI6IHRoaXMgfSk7XG4gIHB1YmxpYyByZWFkb25seSB1bmlxdWVJZDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgY2lkcklwOiBzdHJpbmcpIHtcbiAgICBpZiAoIVRva2VuLmlzVW5yZXNvbHZlZChjaWRySXApKSB7XG4gICAgICBjb25zdCBjaWRyTWF0Y2ggPSBjaWRySXAubWF0Y2goL14oXFxkezEsM31cXC4pezN9XFxkezEsM30oXFwvXFxkKyk/JC8pO1xuXG4gICAgICBpZiAoIWNpZHJNYXRjaCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgSVB2NCBDSURSOiBcIiR7Y2lkcklwfVwiYCk7XG4gICAgICB9XG5cbiAgICAgIGlmICghY2lkck1hdGNoWzJdKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ0lEUiBtYXNrIGlzIG1pc3NpbmcgaW4gSVB2NDogXCIke2NpZHJJcH1cIi4gRGlkIHlvdSBtZWFuIFwiJHtjaWRySXB9LzMyXCI/YCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy51bmlxdWVJZCA9IGNpZHJJcDtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9kdWNlIHRoZSBpbmdyZXNzIHJ1bGUgSlNPTiBmb3IgdGhlIGdpdmVuIGNvbm5lY3Rpb25cbiAgICovXG4gIHB1YmxpYyB0b0luZ3Jlc3NSdWxlQ29uZmlnKCk6IGFueSB7XG4gICAgcmV0dXJuIHsgY2lkcklwOiB0aGlzLmNpZHJJcCB9O1xuICB9XG4gIC8qKlxuICAgKiBQcm9kdWNlIHRoZSBlZ3Jlc3MgcnVsZSBKU09OIGZvciB0aGUgZ2l2ZW4gY29ubmVjdGlvblxuICAgKi9cbiAgcHVibGljIHRvRWdyZXNzUnVsZUNvbmZpZygpOiBhbnkge1xuICAgIHJldHVybiB7IGNpZHJJcDogdGhpcy5jaWRySXAgfTtcbiAgfVxufVxuXG4vKipcbiAqIEFueSBJUHY0IGFkZHJlc3NcbiAqL1xuY2xhc3MgQW55SVB2NCBleHRlbmRzIENpZHJJUHY0IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoJzAuMC4wLjAvMCcpO1xuICB9XG59XG5cbi8qKlxuICogQSBjb25uZWN0aW9uIHRvIGEgZnJvbSBhIGdpdmVuIElQdjYgcmFuZ2VcbiAqL1xuY2xhc3MgQ2lkcklQdjYgaW1wbGVtZW50cyBJUGVlciB7XG4gIHB1YmxpYyByZWFkb25seSBjYW5JbmxpbmVSdWxlID0gdHJ1ZTtcbiAgcHVibGljIHJlYWRvbmx5IGNvbm5lY3Rpb25zOiBDb25uZWN0aW9ucyA9IG5ldyBDb25uZWN0aW9ucyh7IHBlZXI6IHRoaXMgfSk7XG4gIHB1YmxpYyByZWFkb25seSB1bmlxdWVJZDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgY2lkcklwdjY6IHN0cmluZykge1xuICAgIGlmICghVG9rZW4uaXNVbnJlc29sdmVkKGNpZHJJcHY2KSkge1xuICAgICAgY29uc3QgY2lkck1hdGNoID0gY2lkcklwdjYubWF0Y2goL14oW1xcZGEtZl17MCw0fTopezIsN30oW1xcZGEtZl17MCw0fSk/KFxcL1xcZCspPyQvKTtcblxuICAgICAgaWYgKCFjaWRyTWF0Y2gpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIElQdjYgQ0lEUjogXCIke2NpZHJJcHY2fVwiYCk7XG4gICAgICB9XG5cbiAgICAgIGlmICghY2lkck1hdGNoWzNdKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ0lEUiBtYXNrIGlzIG1pc3NpbmcgaW4gSVB2NjogXCIke2NpZHJJcHY2fVwiLiBEaWQgeW91IG1lYW4gXCIke2NpZHJJcHY2fS8xMjhcIj9gKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnVuaXF1ZUlkID0gY2lkcklwdjY7XG4gIH1cblxuICAvKipcbiAgICogUHJvZHVjZSB0aGUgaW5ncmVzcyBydWxlIEpTT04gZm9yIHRoZSBnaXZlbiBjb25uZWN0aW9uXG4gICAqL1xuICBwdWJsaWMgdG9JbmdyZXNzUnVsZUNvbmZpZygpOiBhbnkge1xuICAgIHJldHVybiB7IGNpZHJJcHY2OiB0aGlzLmNpZHJJcHY2IH07XG4gIH1cbiAgLyoqXG4gICAqIFByb2R1Y2UgdGhlIGVncmVzcyBydWxlIEpTT04gZm9yIHRoZSBnaXZlbiBjb25uZWN0aW9uXG4gICAqL1xuICBwdWJsaWMgdG9FZ3Jlc3NSdWxlQ29uZmlnKCk6IGFueSB7XG4gICAgcmV0dXJuIHsgY2lkcklwdjY6IHRoaXMuY2lkcklwdjYgfTtcbiAgfVxufVxuXG4vKipcbiAqIEFueSBJUHY2IGFkZHJlc3NcbiAqL1xuY2xhc3MgQW55SVB2NiBleHRlbmRzIENpZHJJUHY2IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoJzo6LzAnKTtcbiAgfVxufVxuXG4vKipcbiAqIEEgcHJlZml4IGxpc3RcbiAqXG4gKiBQcmVmaXggbGlzdHMgYXJlIHVzZWQgdG8gYWxsb3cgdHJhZmZpYyB0byBWUEMtbG9jYWwgc2VydmljZSBlbmRwb2ludHMuXG4gKlxuICogRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSB0aGlzIHBhZ2U6XG4gKlxuICogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvblZQQy9sYXRlc3QvVXNlckd1aWRlL3ZwYy1lbmRwb2ludHMuaHRtbFxuICovXG5jbGFzcyBQcmVmaXhMaXN0IGltcGxlbWVudHMgSVBlZXIge1xuICBwdWJsaWMgcmVhZG9ubHkgY2FuSW5saW5lUnVsZSA9IGZhbHNlO1xuICBwdWJsaWMgcmVhZG9ubHkgY29ubmVjdGlvbnM6IENvbm5lY3Rpb25zID0gbmV3IENvbm5lY3Rpb25zKHsgcGVlcjogdGhpcyB9KTtcbiAgcHVibGljIHJlYWRvbmx5IHVuaXF1ZUlkOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBwcmVmaXhMaXN0SWQ6IHN0cmluZykge1xuICAgIHRoaXMudW5pcXVlSWQgPSBwcmVmaXhMaXN0SWQ7XG4gIH1cblxuICBwdWJsaWMgdG9JbmdyZXNzUnVsZUNvbmZpZygpOiBhbnkge1xuICAgIHJldHVybiB7IHNvdXJjZVByZWZpeExpc3RJZDogdGhpcy5wcmVmaXhMaXN0SWQgfTtcbiAgfVxuXG4gIHB1YmxpYyB0b0VncmVzc1J1bGVDb25maWcoKTogYW55IHtcbiAgICByZXR1cm4geyBkZXN0aW5hdGlvblByZWZpeExpc3RJZDogdGhpcy5wcmVmaXhMaXN0SWQgfTtcbiAgfVxufVxuXG4vKipcbiAqIEEgY29ubmVjdGlvbiB0byBvciBmcm9tIGEgZ2l2ZW4gc2VjdXJpdHkgZ3JvdXAgSURcbiAqXG4gKiBGb3IgaW5ncmVzcyBydWxlcywgYSBzb3VyY2VTZWN1cml0eUdyb3VwT3duZXJJZCBwYXJhbWV0ZXIgY2FuIGJlIHNwZWNpZmllZCBpZlxuICogdGhlIHNlY3VyaXR5IGdyb3VwIGV4aXN0cyBpbiBhbm90aGVyIGFjY291bnQuXG4gKiBUaGlzIHBhcmFtZXRlciB3aWxsIGJlIGlnbm9yZWQgZm9yIGVncmVzcyBydWxlcy5cbiAqL1xuY2xhc3MgU2VjdXJpdHlHcm91cElkIGltcGxlbWVudHMgSVBlZXIge1xuICBwdWJsaWMgcmVhZG9ubHkgY2FuSW5saW5lUnVsZSA9IHRydWU7XG4gIHB1YmxpYyByZWFkb25seSBjb25uZWN0aW9uczogQ29ubmVjdGlvbnMgPSBuZXcgQ29ubmVjdGlvbnMoeyBwZWVyOiB0aGlzIH0pO1xuICBwdWJsaWMgcmVhZG9ubHkgdW5pcXVlSWQ6IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHNlY3VyaXR5R3JvdXBJZDogc3RyaW5nLCBwcml2YXRlIHJlYWRvbmx5IHNvdXJjZVNlY3VyaXR5R3JvdXBPd25lcklkPzogc3RyaW5nKSB7XG4gICAgaWYgKCFUb2tlbi5pc1VucmVzb2x2ZWQoc2VjdXJpdHlHcm91cElkKSkge1xuICAgICAgY29uc3Qgc2VjdXJpdHlHcm91cE1hdGNoID0gc2VjdXJpdHlHcm91cElkLm1hdGNoKC9ec2ctW2EtejAtOV17OCwxN30kLyk7XG5cbiAgICAgIGlmICghc2VjdXJpdHlHcm91cE1hdGNoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBzZWN1cml0eSBncm91cCBJRDogXCIke3NlY3VyaXR5R3JvdXBJZH1cImApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzb3VyY2VTZWN1cml0eUdyb3VwT3duZXJJZCAmJiAhVG9rZW4uaXNVbnJlc29sdmVkKHNvdXJjZVNlY3VyaXR5R3JvdXBPd25lcklkKSkge1xuICAgICAgY29uc3QgYWNjb3VudE51bWJlck1hdGNoID0gc291cmNlU2VjdXJpdHlHcm91cE93bmVySWQubWF0Y2goL15bMC05XXsxMn0kLyk7XG5cbiAgICAgIGlmICghYWNjb3VudE51bWJlck1hdGNoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBzZWN1cml0eSBncm91cCBvd25lciBJRDogXCIke3NvdXJjZVNlY3VyaXR5R3JvdXBPd25lcklkfVwiYCk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMudW5pcXVlSWQgPSBzZWN1cml0eUdyb3VwSWQ7XG4gIH1cblxuICAvKipcbiAgICogUHJvZHVjZSB0aGUgaW5ncmVzcyBydWxlIEpTT04gZm9yIHRoZSBnaXZlbiBjb25uZWN0aW9uXG4gICAqL1xuICBwdWJsaWMgdG9JbmdyZXNzUnVsZUNvbmZpZygpOiBhbnkge1xuICAgIHJldHVybiB7XG4gICAgICBzb3VyY2VTZWN1cml0eUdyb3VwSWQ6IHRoaXMuc2VjdXJpdHlHcm91cElkLFxuICAgICAgLi4uKHRoaXMuc291cmNlU2VjdXJpdHlHcm91cE93bmVySWQgJiYgeyBzb3VyY2VTZWN1cml0eUdyb3VwT3duZXJJZDogdGhpcy5zb3VyY2VTZWN1cml0eUdyb3VwT3duZXJJZCB9KSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFByb2R1Y2UgdGhlIGVncmVzcyBydWxlIEpTT04gZm9yIHRoZSBnaXZlbiBjb25uZWN0aW9uXG4gICAqL1xuICBwdWJsaWMgdG9FZ3Jlc3NSdWxlQ29uZmlnKCk6IGFueSB7XG4gICAgcmV0dXJuIHsgZGVzdGluYXRpb25TZWN1cml0eUdyb3VwSWQ6IHRoaXMuc2VjdXJpdHlHcm91cElkIH07XG4gIH1cbn0iXX0=