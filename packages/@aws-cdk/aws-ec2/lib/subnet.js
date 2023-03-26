"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubnetFilter = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const network_util_1 = require("./network-util");
/**
 * Contains logic which chooses a set of subnets from a larger list, in conjunction
 * with SubnetSelection, to determine where to place AWS resources such as VPC
 * endpoints, EC2 instances, etc.
 */
class SubnetFilter {
    /**
     * Chooses subnets by id.
     */
    static byIds(subnetIds) {
        return new SubnetIdSubnetFilter(subnetIds);
    }
    /**
     * Chooses subnets which are in one of the given availability zones.
    */
    static availabilityZones(availabilityZones) {
        return new AvailabilityZoneSubnetFilter(availabilityZones);
    }
    /**
     * Chooses subnets such that there is at most one per availability zone.
    */
    static onePerAz() {
        return new OnePerAZSubnetFilter();
    }
    /**
     * Chooses subnets which contain any of the specified IP addresses.
    */
    static containsIpAddresses(ipv4addrs) {
        return new ContainsIpAddressesSubnetFilter(ipv4addrs);
    }
    /**
     * Chooses subnets which have the provided CIDR netmask.
     */
    static byCidrMask(mask) {
        return new CidrMaskSubnetFilter(mask);
    }
    /**
     * Executes the subnet filtering logic, returning a filtered set of subnets.
     */
    selectSubnets(_subnets) {
        throw new Error('Cannot select subnets with an abstract SubnetFilter. `selectSubnets` needs to be implmemented.');
    }
}
exports.SubnetFilter = SubnetFilter;
_a = JSII_RTTI_SYMBOL_1;
SubnetFilter[_a] = { fqn: "@aws-cdk/aws-ec2.SubnetFilter", version: "0.0.0" };
/**
 * Chooses subnets which are in one of the given availability zones.
 */
class AvailabilityZoneSubnetFilter extends SubnetFilter {
    constructor(availabilityZones) {
        super();
        this.availabilityZones = availabilityZones;
    }
    /**
     * Executes the subnet filtering logic.
     */
    selectSubnets(subnets) {
        return subnets.filter(s => this.availabilityZones.includes(s.availabilityZone));
    }
}
/**
 * Chooses subnets such that there is at most one per availability zone.
 */
class OnePerAZSubnetFilter extends SubnetFilter {
    constructor() {
        super();
    }
    /**
     * Executes the subnet filtering logic.
     */
    selectSubnets(subnets) {
        return this.retainOnePerAz(subnets);
    }
    retainOnePerAz(subnets) {
        const azsSeen = new Set();
        return subnets.filter(subnet => {
            if (azsSeen.has(subnet.availabilityZone)) {
                return false;
            }
            azsSeen.add(subnet.availabilityZone);
            return true;
        });
    }
}
/**
 * Chooses subnets which contain any of the specified IP addresses.
 */
class ContainsIpAddressesSubnetFilter extends SubnetFilter {
    constructor(ipAddresses) {
        super();
        this.ipAddresses = ipAddresses;
    }
    /**
     * Executes the subnet filtering logic.
     */
    selectSubnets(subnets) {
        return this.retainByIp(subnets, this.ipAddresses);
    }
    retainByIp(subnets, ips) {
        const cidrBlockObjs = ips.map(ip => {
            const ipNum = network_util_1.NetworkUtils.ipToNum(ip);
            return new network_util_1.CidrBlock(ipNum, 32);
        });
        return subnets.filter(s => {
            const subnetCidrBlock = new network_util_1.CidrBlock(s.ipv4CidrBlock);
            return cidrBlockObjs.some(cidr => subnetCidrBlock.containsCidr(cidr));
        });
    }
}
/**
 * Chooses subnets based on the subnetId
 */
class SubnetIdSubnetFilter extends SubnetFilter {
    constructor(subnetIds) {
        super();
        this.subnetIds = subnetIds;
    }
    /**
     * Executes the subnet filtering logic.
     */
    selectSubnets(subnets) {
        return subnets.filter(subnet => this.subnetIds.includes(subnet.subnetId));
    }
}
/**
 * Chooses subnets based on the CIDR Netmask
 */
class CidrMaskSubnetFilter extends SubnetFilter {
    constructor(mask) {
        super();
        this.mask = mask;
    }
    /**
     * Executes the subnet filtering logic.
     */
    selectSubnets(subnets) {
        return subnets.filter(subnet => {
            const subnetCidr = new network_util_1.CidrBlock(subnet.ipv4CidrBlock);
            return subnetCidr.mask === this.mask;
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VibmV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3VibmV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsaURBQXlEO0FBR3pEOzs7O0dBSUc7QUFDSCxNQUFzQixZQUFZO0lBRWhDOztPQUVHO0lBQ0ksTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFtQjtRQUNyQyxPQUFPLElBQUksb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDNUM7SUFFRDs7TUFFRTtJQUNLLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxpQkFBMkI7UUFDekQsT0FBTyxJQUFJLDRCQUE0QixDQUFDLGlCQUFpQixDQUFDLENBQUM7S0FDNUQ7SUFFRDs7TUFFRTtJQUNLLE1BQU0sQ0FBQyxRQUFRO1FBQ3BCLE9BQU8sSUFBSSxvQkFBb0IsRUFBRSxDQUFDO0tBQ25DO0lBRUQ7O01BRUU7SUFDSyxNQUFNLENBQUMsbUJBQW1CLENBQUMsU0FBbUI7UUFDbkQsT0FBTyxJQUFJLCtCQUErQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQ3ZEO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsVUFBVSxDQUFDLElBQVk7UUFDbkMsT0FBTyxJQUFJLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3ZDO0lBRUQ7O09BRUc7SUFDSSxhQUFhLENBQUMsUUFBbUI7UUFDdEMsTUFBTSxJQUFJLEtBQUssQ0FBQyxnR0FBZ0csQ0FBQyxDQUFDO0tBQ25IOztBQTFDSCxvQ0EyQ0M7OztBQUVEOztHQUVHO0FBQ0gsTUFBTSw0QkFBNkIsU0FBUSxZQUFZO0lBSXJELFlBQVksaUJBQTJCO1FBQ3JDLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGlCQUFpQixDQUFDO0tBQzVDO0lBRUQ7O09BRUc7SUFDSSxhQUFhLENBQUMsT0FBa0I7UUFDckMsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGlCQUFp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dCI6WyJpbXBvcnQgeyBDaWRyQmxvY2ssIE5ldHdvcmtVdGlscyB9IGZyb20gJy4vbmV0d29yay11dGlsJztcbmltcG9ydCB7IElTdWJuZXQgfSBmcm9tICcuL3ZwYyc7XG5cbi8qKlxuICogQ29udGFpbnMgbG9naWMgd2hpY2ggY2hvb3NlcyBhIHNldCBvZiBzdWJuZXRzIGZyb20gYSBsYXJnZXIgbGlzdCwgaW4gY29uanVuY3Rpb25cbiAqIHdpdGggU3VibmV0U2VsZWN0aW9uLCB0byBkZXRlcm1pbmUgd2hlcmUgdG8gcGxhY2UgQVdTIHJlc291cmNlcyBzdWNoIGFzIFZQQ1xuICogZW5kcG9pbnRzLCBFQzIgaW5zdGFuY2VzLCBldGMuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTdWJuZXRGaWx0ZXIge1xuXG4gIC8qKlxuICAgKiBDaG9vc2VzIHN1Ym5ldHMgYnkgaWQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGJ5SWRzKHN1Ym5ldElkczogc3RyaW5nW10pOiBTdWJuZXRGaWx0ZXIge1xuICAgIHJldHVybiBuZXcgU3VibmV0SWRTdWJuZXRGaWx0ZXIoc3VibmV0SWRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaG9vc2VzIHN1Ym5ldHMgd2hpY2ggYXJlIGluIG9uZSBvZiB0aGUgZ2l2ZW4gYXZhaWxhYmlsaXR5IHpvbmVzLlxuICAqL1xuICBwdWJsaWMgc3RhdGljIGF2YWlsYWJpbGl0eVpvbmVzKGF2YWlsYWJpbGl0eVpvbmVzOiBzdHJpbmdbXSk6IFN1Ym5ldEZpbHRlciB7XG4gICAgcmV0dXJuIG5ldyBBdmFpbGFiaWxpdHlab25lU3VibmV0RmlsdGVyKGF2YWlsYWJpbGl0eVpvbmVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaG9vc2VzIHN1Ym5ldHMgc3VjaCB0aGF0IHRoZXJlIGlzIGF0IG1vc3Qgb25lIHBlciBhdmFpbGFiaWxpdHkgem9uZS5cbiAgKi9cbiAgcHVibGljIHN0YXRpYyBvbmVQZXJBeigpOiBTdWJuZXRGaWx0ZXIge1xuICAgIHJldHVybiBuZXcgT25lUGVyQVpTdWJuZXRGaWx0ZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaG9vc2VzIHN1Ym5ldHMgd2hpY2ggY29udGFpbiBhbnkgb2YgdGhlIHNwZWNpZmllZCBJUCBhZGRyZXNzZXMuXG4gICovXG4gIHB1YmxpYyBzdGF0aWMgY29udGFpbnNJcEFkZHJlc3NlcyhpcHY0YWRkcnM6IHN0cmluZ1tdKTogU3VibmV0RmlsdGVyIHtcbiAgICByZXR1cm4gbmV3IENvbnRhaW5zSXBBZGRyZXNzZXNTdWJuZXRGaWx0ZXIoaXB2NGFkZHJzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaG9vc2VzIHN1Ym5ldHMgd2hpY2ggaGF2ZSB0aGUgcHJvdmlkZWQgQ0lEUiBuZXRtYXNrLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBieUNpZHJNYXNrKG1hc2s6IG51bWJlcik6IFN1Ym5ldEZpbHRlciB7XG4gICAgcmV0dXJuIG5ldyBDaWRyTWFza1N1Ym5ldEZpbHRlcihtYXNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlcyB0aGUgc3VibmV0IGZpbHRlcmluZyBsb2dpYywgcmV0dXJuaW5nIGEgZmlsdGVyZWQgc2V0IG9mIHN1Ym5ldHMuXG4gICAqL1xuICBwdWJsaWMgc2VsZWN0U3VibmV0cyhfc3VibmV0czogSVN1Ym5ldFtdKTogSVN1Ym5ldFtdIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBzZWxlY3Qgc3VibmV0cyB3aXRoIGFuIGFic3RyYWN0IFN1Ym5ldEZpbHRlci4gYHNlbGVjdFN1Ym5ldHNgIG5lZWRzIHRvIGJlIGltcGxtZW1lbnRlZC4nKTtcbiAgfVxufVxuXG4vKipcbiAqIENob29zZXMgc3VibmV0cyB3aGljaCBhcmUgaW4gb25lIG9mIHRoZSBnaXZlbiBhdmFpbGFiaWxpdHkgem9uZXMuXG4gKi9cbmNsYXNzIEF2YWlsYWJpbGl0eVpvbmVTdWJuZXRGaWx0ZXIgZXh0ZW5kcyBTdWJuZXRGaWx0ZXIge1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgYXZhaWxhYmlsaXR5Wm9uZXM6IHN0cmluZ1tdO1xuXG4gIGNvbnN0cnVjdG9yKGF2YWlsYWJpbGl0eVpvbmVzOiBzdHJpbmdbXSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5hdmFpbGFiaWxpdHlab25lcyA9IGF2YWlsYWJpbGl0eVpvbmVzO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGVzIHRoZSBzdWJuZXQgZmlsdGVyaW5nIGxvZ2ljLlxuICAgKi9cbiAgcHVibGljIHNlbGVjdFN1Ym5ldHMoc3VibmV0czogSVN1Ym5ldFtdKTogSVN1Ym5ldFtdIHtcbiAgICByZXR1cm4gc3VibmV0cy5maWx0ZXIocyA9PiB0aGlzLmF2YWlsYWJpbGl0eVpvbmVzLmluY2x1ZGVzKHMuYXZhaWxhYmlsaXR5Wm9uZSkpO1xuICB9XG59XG5cbi8qKlxuICogQ2hvb3NlcyBzdWJuZXRzIHN1Y2ggdGhhdCB0aGVyZSBpcyBhdCBtb3N0IG9uZSBwZXIgYXZhaWxhYmlsaXR5IHpvbmUuXG4gKi9cbmNsYXNzIE9uZVBlckFaU3VibmV0RmlsdGVyIGV4dGVuZHMgU3VibmV0RmlsdGVyIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGVzIHRoZSBzdWJuZXQgZmlsdGVyaW5nIGxvZ2ljLlxuICAgKi9cbiAgcHVibGljIHNlbGVjdFN1Ym5ldHMoc3VibmV0czogSVN1Ym5ldFtdKTogSVN1Ym5ldFtdIHtcbiAgICByZXR1cm4gdGhpcy5yZXRhaW5PbmVQZXJBeihzdWJuZXRzKTtcbiAgfVxuXG4gIHByaXZhdGUgcmV0YWluT25lUGVyQXooc3VibmV0czogSVN1Ym5ldFtdKTogSVN1Ym5ldFtdIHtcbiAgICBjb25zdCBhenNTZWVuID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgcmV0dXJuIHN1Ym5ldHMuZmlsdGVyKHN1Ym5ldCA9PiB7XG4gICAgICBpZiAoYXpzU2Vlbi5oYXMoc3VibmV0LmF2YWlsYWJpbGl0eVpvbmUpKSB7IHJldHVybiBmYWxzZTsgfVxuICAgICAgYXpzU2Vlbi5hZGQoc3VibmV0LmF2YWlsYWJpbGl0eVpvbmUpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDaG9vc2VzIHN1Ym5ldHMgd2hpY2ggY29udGFpbiBhbnkgb2YgdGhlIHNwZWNpZmllZCBJUCBhZGRyZXNzZXMuXG4gKi9cbmNsYXNzIENvbnRhaW5zSXBBZGRyZXNzZXNTdWJuZXRGaWx0ZXIgZXh0ZW5kcyBTdWJuZXRGaWx0ZXIge1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgaXBBZGRyZXNzZXM6IHN0cmluZ1tdO1xuXG4gIGNvbnN0cnVjdG9yKGlwQWRkcmVzc2VzOiBzdHJpbmdbXSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5pcEFkZHJlc3NlcyA9IGlwQWRkcmVzc2VzO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGVzIHRoZSBzdWJuZXQgZmlsdGVyaW5nIGxvZ2ljLlxuICAgKi9cbiAgcHVibGljIHNlbGVjdFN1Ym5ldHMoc3VibmV0czogSVN1Ym5ldFtdKTogSVN1Ym5ldFtdIHtcbiAgICByZXR1cm4gdGhpcy5yZXRhaW5CeUlwKHN1Ym5ldHMsIHRoaXMuaXBBZGRyZXNzZXMpO1xuICB9XG5cbiAgcHJpdmF0ZSByZXRhaW5CeUlwKHN1Ym5ldHM6IElTdWJuZXRbXSwgaXBzOiBzdHJpbmdbXSk6IElTdWJuZXRbXSB7XG4gICAgY29uc3QgY2lkckJsb2NrT2JqcyA9IGlwcy5tYXAoaXAgPT4ge1xuICAgICAgY29uc3QgaXBOdW0gPSBOZXR3b3JrVXRpbHMuaXBUb051bShpcCk7XG4gICAgICByZXR1cm4gbmV3IENpZHJCbG9jayhpcE51bSwgMzIpO1xuICAgIH0pO1xuICAgIHJldHVybiBzdWJuZXRzLmZpbHRlcihzID0+IHtcbiAgICAgIGNvbnN0IHN1Ym5ldENpZHJCbG9jayA9IG5ldyBDaWRyQmxvY2socy5pcHY0Q2lkckJsb2NrKTtcbiAgICAgIHJldHVybiBjaWRyQmxvY2tPYmpzLnNvbWUoY2lkciA9PiBzdWJuZXRDaWRyQmxvY2suY29udGFpbnNDaWRyKGNpZHIpKTtcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIENob29zZXMgc3VibmV0cyBiYXNlZCBvbiB0aGUgc3VibmV0SWRcbiAqL1xuY2xhc3MgU3VibmV0SWRTdWJuZXRGaWx0ZXIgZXh0ZW5kcyBTdWJuZXRGaWx0ZXIge1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgc3VibmV0SWRzOiBzdHJpbmdbXTtcblxuICBjb25zdHJ1Y3RvcihzdWJuZXRJZHM6IHN0cmluZ1tdKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnN1Ym5ldElkcyA9IHN1Ym5ldElkcztcbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlcyB0aGUgc3VibmV0IGZpbHRlcmluZyBsb2dpYy5cbiAgICovXG4gIHB1YmxpYyBzZWxlY3RTdWJuZXRzKHN1Ym5ldHM6IElTdWJuZXRbXSk6IElTdWJuZXRbXSB7XG4gICAgcmV0dXJuIHN1Ym5ldHMuZmlsdGVyKHN1Ym5ldCA9PiB0aGlzLnN1Ym5ldElkcy5pbmNsdWRlcyhzdWJuZXQuc3VibmV0SWQpKTtcbiAgfVxufVxuXG4vKipcbiAqIENob29zZXMgc3VibmV0cyBiYXNlZCBvbiB0aGUgQ0lEUiBOZXRtYXNrXG4gKi9cbmNsYXNzIENpZHJNYXNrU3VibmV0RmlsdGVyIGV4dGVuZHMgU3VibmV0RmlsdGVyIHtcbiAgcHJpdmF0ZSByZWFkb25seSBtYXNrOiBudW1iZXJcblxuICBjb25zdHJ1Y3RvcihtYXNrOiBudW1iZXIpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMubWFzayA9IG1hc2s7XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZXMgdGhlIHN1Ym5ldCBmaWx0ZXJpbmcgbG9naWMuXG4gICAqL1xuICBwdWJsaWMgc2VsZWN0U3VibmV0cyhzdWJuZXRzOiBJU3VibmV0W10pOiBJU3VibmV0W10ge1xuICAgIHJldHVybiBzdWJuZXRzLmZpbHRlcihzdWJuZXQgPT4ge1xuICAgICAgY29uc3Qgc3VibmV0Q2lkciA9IG5ldyBDaWRyQmxvY2soc3VibmV0LmlwdjRDaWRyQmxvY2spO1xuICAgICAgcmV0dXJuIHN1Ym5ldENpZHIubWFzayA9PT0gdGhpcy5tYXNrO1xuICAgIH0pO1xuICB9XG59XG4iXX0=