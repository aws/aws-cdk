"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatten = exports.allRouteTableIds = exports.range = exports.ImportSubnetGroup = exports.subnetId = exports.subnetGroupNameFromConstructId = exports.defaultSubnetName = exports.slugify = void 0;
const vpc_1 = require("./vpc");
/**
 * Turn an arbitrary string into one that can be used as a CloudFormation identifier by stripping special characters
 *
 * (At the moment, no efforts are taken to prevent collisions, but we can add that later when it becomes necessary).
 */
function slugify(x) {
    return x.replace(/[^a-zA-Z0-9]/g, '');
}
exports.slugify = slugify;
/**
 * The default names for every subnet type
 */
function defaultSubnetName(type) {
    switch (type) {
        case vpc_1.SubnetType.PUBLIC: return 'Public';
        case vpc_1.SubnetType.PRIVATE_WITH_NAT:
        case vpc_1.SubnetType.PRIVATE_WITH_EGRESS:
        case vpc_1.SubnetType.PRIVATE:
            return 'Private';
        case vpc_1.SubnetType.PRIVATE_ISOLATED:
        case vpc_1.SubnetType.ISOLATED:
            return 'Isolated';
    }
}
exports.defaultSubnetName = defaultSubnetName;
/**
 * Return a subnet name from its construct ID
 *
 * All subnet names look like NAME <> "Subnet" <> INDEX
 */
function subnetGroupNameFromConstructId(subnet) {
    return subnet.node.id.replace(/Subnet\d+$/, '');
}
exports.subnetGroupNameFromConstructId = subnetGroupNameFromConstructId;
/**
 * Make the subnet construct ID from a name and number
 */
function subnetId(name, i) {
    return `${name}Subnet${i + 1}`;
}
exports.subnetId = subnetId;
class ImportSubnetGroup {
    constructor(subnetIds, names, routeTableIds, ipv4CidrBlocks, type, availabilityZones, idField, nameField, routeTableIdField, ipv4CidrBlockField) {
        this.availabilityZones = availabilityZones;
        this.subnetIds = subnetIds || [];
        this.routeTableIds = routeTableIds || [];
        this.ipv4CidrBlocks = ipv4CidrBlocks || [];
        this.groups = this.subnetIds.length / this.availabilityZones.length;
        if (Math.floor(this.groups) !== this.groups) {
            // eslint-disable-next-line max-len
            throw new Error(`Number of ${idField} (${this.subnetIds.length}) must be a multiple of availability zones (${this.availabilityZones.length}).`);
        }
        if (this.routeTableIds.length !== this.subnetIds.length && routeTableIds != null) {
            // We don't err if no routeTableIds were provided to maintain backwards-compatibility. See https://github.com/aws/aws-cdk/pull/3171
            /* eslint-disable max-len */
            throw new Error(`Number of ${routeTableIdField} (${this.routeTableIds.length}) must be equal to the amount of ${idField} (${this.subnetIds.length}).`);
        }
        if (this.ipv4CidrBlocks.length !== this.subnetIds.length && ipv4CidrBlocks != null) {
            // We don't err if no ipv4CidrBlocks were provided to maintain backwards-compatibility.
            /* eslint-disable max-len */
            throw new Error(`Number of ${ipv4CidrBlockField} (${this.ipv4CidrBlocks.length}) must be equal to the amount of ${idField} (${this.subnetIds.length}).`);
        }
        this.names = this.normalizeNames(names, defaultSubnetName(type), nameField);
    }
    import(scope) {
        return range(this.subnetIds.length).map(i => {
            const k = Math.floor(i / this.availabilityZones.length);
            return vpc_1.Subnet.fromSubnetAttributes(scope, subnetId(this.names[k], i), {
                availabilityZone: this.pickAZ(i),
                subnetId: this.subnetIds[i],
                routeTableId: this.routeTableIds[i],
                ipv4CidrBlock: this.ipv4CidrBlocks[i],
            });
        });
    }
    /**
     * Return a list with a name for every subnet
     */
    normalizeNames(names, defaultName, fieldName) {
        // If not given, return default
        if (names === undefined || names.length === 0) {
            return [defaultName];
        }
        // If given, must match given subnets
        if (names.length !== this.groups) {
            throw new Error(`${fieldName} must have an entry for every corresponding subnet group, got: ${JSON.stringify(names)}`);
        }
        return names;
    }
    /**
     * Return the i'th AZ
     */
    pickAZ(i) {
        return this.availabilityZones[i % this.availabilityZones.length];
    }
}
exports.ImportSubnetGroup = ImportSubnetGroup;
/**
 * Generate the list of numbers of [0..n)
 */
function range(n) {
    const ret = [];
    for (let i = 0; i < n; i++) {
        ret.push(i);
    }
    return ret;
}
exports.range = range;
/**
 * Return the union of table IDs from all selected subnets
 */
function allRouteTableIds(subnets) {
    const ret = new Set();
    for (const subnet of subnets) {
        if (subnet.routeTable && subnet.routeTable.routeTableId) {
            ret.add(subnet.routeTable.routeTableId);
        }
    }
    return Array.from(ret);
}
exports.allRouteTableIds = allRouteTableIds;
function flatten(xs) {
    return Array.prototype.concat.apply([], xs);
}
exports.flatten = flatten;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsK0JBQW9EO0FBRXBEOzs7O0dBSUc7QUFDSCxTQUFnQixPQUFPLENBQUMsQ0FBUztJQUMvQixPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3hDLENBQUM7QUFGRCwwQkFFQztBQUVEOztHQUVHO0FBQ0gsU0FBZ0IsaUJBQWlCLENBQUMsSUFBZ0I7SUFDaEQsUUFBUSxJQUFJLEVBQUU7UUFDWixLQUFLLGdCQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxRQUFRLENBQUM7UUFDeEMsS0FBSyxnQkFBVSxDQUFDLGdCQUFnQixDQUFDO1FBQ2pDLEtBQUssZ0JBQVUsQ0FBQyxtQkFBbUIsQ0FBQztRQUNwQyxLQUFLLGdCQUFVLENBQUMsT0FBTztZQUNyQixPQUFPLFNBQVMsQ0FBQztRQUNuQixLQUFLLGdCQUFVLENBQUMsZ0JBQWdCLENBQUM7UUFDakMsS0FBSyxnQkFBVSxDQUFDLFFBQVE7WUFDdEIsT0FBTyxVQUFVLENBQUM7S0FDckI7QUFDSCxDQUFDO0FBWEQsOENBV0M7QUFFRDs7OztHQUlHO0FBQ0gsU0FBZ0IsOEJBQThCLENBQUMsTUFBZTtJQUM1RCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDbEQsQ0FBQztBQUZELHdFQUVDO0FBRUQ7O0dBRUc7QUFDSCxTQUFnQixRQUFRLENBQUMsSUFBWSxFQUFFLENBQVM7SUFDOUMsT0FBTyxHQUFHLElBQUksU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7QUFDakMsQ0FBQztBQUZELDRCQUVDO0FBRUQsTUFBYSxpQkFBaUI7SUFPNUIsWUFDRSxTQUErQixFQUMvQixLQUEyQixFQUMzQixhQUFtQyxFQUNuQyxjQUFvQyxFQUNwQyxJQUFn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SUFDbEMsT0FBTyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQzlDLENBQUM7QUFGRCwwQkFFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgSVN1Ym5ldCwgU3VibmV0LCBTdWJuZXRUeXBlIH0gZnJvbSAnLi92cGMnO1xuXG4vKipcbiAqIFR1cm4gYW4gYXJiaXRyYXJ5IHN0cmluZyBpbnRvIG9uZSB0aGF0IGNhbiBiZSB1c2VkIGFzIGEgQ2xvdWRGb3JtYXRpb24gaWRlbnRpZmllciBieSBzdHJpcHBpbmcgc3BlY2lhbCBjaGFyYWN0ZXJzXG4gKlxuICogKEF0IHRoZSBtb21lbnQsIG5vIGVmZm9ydHMgYXJlIHRha2VuIHRvIHByZXZlbnQgY29sbGlzaW9ucywgYnV0IHdlIGNhbiBhZGQgdGhhdCBsYXRlciB3aGVuIGl0IGJlY29tZXMgbmVjZXNzYXJ5KS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNsdWdpZnkoeDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHgucmVwbGFjZSgvW15hLXpBLVowLTldL2csICcnKTtcbn1cblxuLyoqXG4gKiBUaGUgZGVmYXVsdCBuYW1lcyBmb3IgZXZlcnkgc3VibmV0IHR5cGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRTdWJuZXROYW1lKHR5cGU6IFN1Ym5ldFR5cGUpIHtcbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSBTdWJuZXRUeXBlLlBVQkxJQzogcmV0dXJuICdQdWJsaWMnO1xuICAgIGNhc2UgU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfTkFUOlxuICAgIGNhc2UgU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfRUdSRVNTOlxuICAgIGNhc2UgU3VibmV0VHlwZS5QUklWQVRFOlxuICAgICAgcmV0dXJuICdQcml2YXRlJztcbiAgICBjYXNlIFN1Ym5ldFR5cGUuUFJJVkFURV9JU09MQVRFRDpcbiAgICBjYXNlIFN1Ym5ldFR5cGUuSVNPTEFURUQ6XG4gICAgICByZXR1cm4gJ0lzb2xhdGVkJztcbiAgfVxufVxuXG4vKipcbiAqIFJldHVybiBhIHN1Ym5ldCBuYW1lIGZyb20gaXRzIGNvbnN0cnVjdCBJRFxuICpcbiAqIEFsbCBzdWJuZXQgbmFtZXMgbG9vayBsaWtlIE5BTUUgPD4gXCJTdWJuZXRcIiA8PiBJTkRFWFxuICovXG5leHBvcnQgZnVuY3Rpb24gc3VibmV0R3JvdXBOYW1lRnJvbUNvbnN0cnVjdElkKHN1Ym5ldDogSVN1Ym5ldCkge1xuICByZXR1cm4gc3VibmV0Lm5vZGUuaWQucmVwbGFjZSgvU3VibmV0XFxkKyQvLCAnJyk7XG59XG5cbi8qKlxuICogTWFrZSB0aGUgc3VibmV0IGNvbnN0cnVjdCBJRCBmcm9tIGEgbmFtZSBhbmQgbnVtYmVyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdWJuZXRJZChuYW1lOiBzdHJpbmcsIGk6IG51bWJlcikge1xuICByZXR1cm4gYCR7bmFtZX1TdWJuZXQke2kgKyAxfWA7XG59XG5cbmV4cG9ydCBjbGFzcyBJbXBvcnRTdWJuZXRHcm91cCB7XG4gIHByaXZhdGUgcmVhZG9ubHkgc3VibmV0SWRzOiBzdHJpbmdbXTtcbiAgcHJpdmF0ZSByZWFkb25seSBuYW1lczogc3RyaW5nW107XG4gIHByaXZhdGUgcmVhZG9ubHkgcm91dGVUYWJsZUlkczogc3RyaW5nW107XG4gIHByaXZhdGUgcmVhZG9ubHkgaXB2NENpZHJCbG9ja3M6IHN0cmluZ1tdO1xuICBwcml2YXRlIHJlYWRvbmx5IGdyb3VwczogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHN1Ym5ldElkczogc3RyaW5nW10gfCB1bmRlZmluZWQsXG4gICAgbmFtZXM6IHN0cmluZ1tdIHwgdW5kZWZpbmVkLFxuICAgIHJvdXRlVGFibGVJZHM6IHN0cmluZ1tdIHwgdW5kZWZpbmVkLFxuICAgIGlwdjRDaWRyQmxvY2tzOiBzdHJpbmdbXSB8IHVuZGVmaW5lZCxcbiAgICB0eXBlOiBTdWJuZXRUeXBlLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgYXZhaWxhYmlsaXR5Wm9uZXM6IHN0cmluZ1tdLFxuICAgIGlkRmllbGQ6IHN0cmluZyxcbiAgICBuYW1lRmllbGQ6IHN0cmluZyxcbiAgICByb3V0ZVRhYmxlSWRGaWVsZDogc3RyaW5nLFxuICAgIGlwdjRDaWRyQmxvY2tGaWVsZDogc3RyaW5nKSB7XG5cbiAgICB0aGlzLnN1Ym5ldElkcyA9IHN1Ym5ldElkcyB8fCBbXTtcbiAgICB0aGlzLnJvdXRlVGFibGVJZHMgPSByb3V0ZVRhYmxlSWRzIHx8IFtdO1xuICAgIHRoaXMuaXB2NENpZHJCbG9ja3MgPSBpcHY0Q2lkckJsb2NrcyB8fCBbXTtcbiAgICB0aGlzLmdyb3VwcyA9IHRoaXMuc3VibmV0SWRzLmxlbmd0aCAvIHRoaXMuYXZhaWxhYmlsaXR5Wm9uZXMubGVuZ3RoO1xuXG4gICAgaWYgKE1hdGguZmxvb3IodGhpcy5ncm91cHMpICE9PSB0aGlzLmdyb3Vwcykge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgICAgIHRocm93IG5ldyBFcnJvcihgTnVtYmVyIG9mICR7aWRGaWVsZH0gKCR7dGhpcy5zdWJuZXRJZHMubGVuZ3RofSkgbXVzdCBiZSBhIG11bHRpcGxlIG9mIGF2YWlsYWJpbGl0eSB6b25lcyAoJHt0aGlzLmF2YWlsYWJpbGl0eVpvbmVzLmxlbmd0aH0pLmApO1xuICAgIH1cbiAgICBpZiAodGhpcy5yb3V0ZVRhYmxlSWRzLmxlbmd0aCAhPT0gdGhpcy5zdWJuZXRJZHMubGVuZ3RoICYmIHJvdXRlVGFibGVJZHMgIT0gbnVsbCkge1xuICAgICAgLy8gV2UgZG9uJ3QgZXJyIGlmIG5vIHJvdXRlVGFibGVJZHMgd2VyZSBwcm92aWRlZCB0byBtYWludGFpbiBiYWNrd2FyZHMtY29tcGF0aWJpbGl0eS4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3MvYXdzLWNkay9wdWxsLzMxNzFcbiAgICAgIC8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi9cbiAgICAgIHRocm93IG5ldyBFcnJvcihgTnVtYmVyIG9mICR7cm91dGVUYWJsZUlkRmllbGR9ICgke3RoaXMucm91dGVUYWJsZUlkcy5sZW5ndGh9KSBtdXN0IGJlIGVxdWFsIHRvIHRoZSBhbW91bnQgb2YgJHtpZEZpZWxkfSAoJHt0aGlzLnN1Ym5ldElkcy5sZW5ndGh9KS5gKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuaXB2NENpZHJCbG9ja3MubGVuZ3RoICE9PSB0aGlzLnN1Ym5ldElkcy5sZW5ndGggJiYgaXB2NENpZHJCbG9ja3MgIT0gbnVsbCkge1xuICAgICAgLy8gV2UgZG9uJ3QgZXJyIGlmIG5vIGlwdjRDaWRyQmxvY2tzIHdlcmUgcHJvdmlkZWQgdG8gbWFpbnRhaW4gYmFja3dhcmRzLWNvbXBhdGliaWxpdHkuXG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE51bWJlciBvZiAke2lwdjRDaWRyQmxvY2tGaWVsZH0gKCR7dGhpcy5pcHY0Q2lkckJsb2Nrcy5sZW5ndGh9KSBtdXN0IGJlIGVxdWFsIHRvIHRoZSBhbW91bnQgb2YgJHtpZEZpZWxkfSAoJHt0aGlzLnN1Ym5ldElkcy5sZW5ndGh9KS5gKTtcbiAgICB9XG5cbiAgICB0aGlzLm5hbWVzID0gdGhpcy5ub3JtYWxpemVOYW1lcyhuYW1lcywgZGVmYXVsdFN1Ym5ldE5hbWUodHlwZSksIG5hbWVGaWVsZCk7XG4gIH1cblxuICBwdWJsaWMgaW1wb3J0KHNjb3BlOiBDb25zdHJ1Y3QpOiBJU3VibmV0W10ge1xuICAgIHJldHVybiByYW5nZSh0aGlzLnN1Ym5ldElkcy5sZW5ndGgpLm1hcChpID0+IHtcbiAgICAgIGNvbnN0IGsgPSBNYXRoLmZsb29yKGkgLyB0aGlzLmF2YWlsYWJpbGl0eVpvbmVzLmxlbmd0aCk7XG4gICAgICByZXR1cm4gU3VibmV0LmZyb21TdWJuZXRBdHRyaWJ1dGVzKHNjb3BlLCBzdWJuZXRJZCh0aGlzLm5hbWVzW2tdLCBpKSwge1xuICAgICAgICBhdmFpbGFiaWxpdHlab25lOiB0aGlzLnBpY2tBWihpKSxcbiAgICAgICAgc3VibmV0SWQ6IHRoaXMuc3VibmV0SWRzW2ldLFxuICAgICAgICByb3V0ZVRhYmxlSWQ6IHRoaXMucm91dGVUYWJsZUlkc1tpXSxcbiAgICAgICAgaXB2NENpZHJCbG9jazogdGhpcy5pcHY0Q2lkckJsb2Nrc1tpXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBhIGxpc3Qgd2l0aCBhIG5hbWUgZm9yIGV2ZXJ5IHN1Ym5ldFxuICAgKi9cbiAgcHJpdmF0ZSBub3JtYWxpemVOYW1lcyhuYW1lczogc3RyaW5nW10gfCB1bmRlZmluZWQsIGRlZmF1bHROYW1lOiBzdHJpbmcsIGZpZWxkTmFtZTogc3RyaW5nKSB7XG4gICAgLy8gSWYgbm90IGdpdmVuLCByZXR1cm4gZGVmYXVsdFxuICAgIGlmIChuYW1lcyA9PT0gdW5kZWZpbmVkIHx8IG5hbWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIFtkZWZhdWx0TmFtZV07XG4gICAgfVxuXG4gICAgLy8gSWYgZ2l2ZW4sIG11c3QgbWF0Y2ggZ2l2ZW4gc3VibmV0c1xuICAgIGlmIChuYW1lcy5sZW5ndGggIT09IHRoaXMuZ3JvdXBzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7ZmllbGROYW1lfSBtdXN0IGhhdmUgYW4gZW50cnkgZm9yIGV2ZXJ5IGNvcnJlc3BvbmRpbmcgc3VibmV0IGdyb3VwLCBnb3Q6ICR7SlNPTi5zdHJpbmdpZnkobmFtZXMpfWApO1xuICAgIH1cblxuICAgIHJldHVybiBuYW1lcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGkndGggQVpcbiAgICovXG4gIHByaXZhdGUgcGlja0FaKGk6IG51bWJlcikge1xuICAgIHJldHVybiB0aGlzLmF2YWlsYWJpbGl0eVpvbmVzW2kgJSB0aGlzLmF2YWlsYWJpbGl0eVpvbmVzLmxlbmd0aF07XG4gIH1cbn1cblxuLyoqXG4gKiBHZW5lcmF0ZSB0aGUgbGlzdCBvZiBudW1iZXJzIG9mIFswLi5uKVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmFuZ2UobjogbnVtYmVyKTogbnVtYmVyW10ge1xuICBjb25zdCByZXQ6IG51bWJlcltdID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgcmV0LnB1c2goaSk7XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBSZXR1cm4gdGhlIHVuaW9uIG9mIHRhYmxlIElEcyBmcm9tIGFsbCBzZWxlY3RlZCBzdWJuZXRzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhbGxSb3V0ZVRhYmxlSWRzKHN1Ym5ldHM6IElTdWJuZXRbXSk6IHN0cmluZ1tdIHtcbiAgY29uc3QgcmV0ID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gIGZvciAoY29uc3Qgc3VibmV0IG9mIHN1Ym5ldHMpIHtcbiAgICBpZiAoc3VibmV0LnJvdXRlVGFibGUgJiYgc3VibmV0LnJvdXRlVGFibGUucm91dGVUYWJsZUlkKSB7XG4gICAgICByZXQuYWRkKHN1Ym5ldC5yb3V0ZVRhYmxlLnJvdXRlVGFibGVJZCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBBcnJheS5mcm9tKHJldCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmbGF0dGVuPEE+KHhzOiBBW11bXSk6IEFbXSB7XG4gIHJldHVybiBBcnJheS5wcm90b3R5cGUuY29uY2F0LmFwcGx5KFtdLCB4cyk7XG59XG4iXX0=