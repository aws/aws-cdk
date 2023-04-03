"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NatInstanceImage = exports.NatInstanceProvider = exports.NatProvider = exports.NatTrafficDirection = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const connections_1 = require("./connections");
const instance_1 = require("./instance");
const machine_image_1 = require("./machine-image");
const port_1 = require("./port");
const security_group_1 = require("./security-group");
const vpc_1 = require("./vpc");
/**
 * Direction of traffic to allow all by default.
 */
var NatTrafficDirection;
(function (NatTrafficDirection) {
    /**
     * Allow all outbound traffic and disallow all inbound traffic.
     */
    NatTrafficDirection["OUTBOUND_ONLY"] = "OUTBOUND_ONLY";
    /**
     * Allow all outbound and inbound traffic.
     */
    NatTrafficDirection["INBOUND_AND_OUTBOUND"] = "INBOUND_AND_OUTBOUND";
    /**
     * Disallow all outbound and inbound traffic.
     */
    NatTrafficDirection["NONE"] = "NONE";
})(NatTrafficDirection = exports.NatTrafficDirection || (exports.NatTrafficDirection = {}));
/**
 * NAT providers
 *
 * Determines what type of NAT provider to create, either NAT gateways or NAT
 * instance.
 *
 *
 */
class NatProvider {
    /**
     * Use NAT Gateways to provide NAT services for your VPC
     *
     * NAT gateways are managed by AWS.
     *
     * @see https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html
     */
    static gateway(props = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_NatGatewayProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.gateway);
            }
            throw error;
        }
        return new NatGatewayProvider(props);
    }
    /**
     * Use NAT instances to provide NAT services for your VPC
     *
     * NAT instances are managed by you, but in return allow more configuration.
     *
     * Be aware that instances created using this provider will not be
     * automatically replaced if they are stopped for any reason. You should implement
     * your own NatProvider based on AutoScaling groups if you need that.
     *
     * @see https://docs.aws.amazon.com/vpc/latest/userguide/VPC_NAT_Instance.html
     */
    static instance(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_NatInstanceProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.instance);
            }
            throw error;
        }
        return new NatInstanceProvider(props);
    }
}
_a = JSII_RTTI_SYMBOL_1;
NatProvider[_a] = { fqn: "@aws-cdk/aws-ec2.NatProvider", version: "0.0.0" };
exports.NatProvider = NatProvider;
/**
 * Provider for NAT Gateways
 */
class NatGatewayProvider extends NatProvider {
    constructor(props = {}) {
        super();
        this.props = props;
        this.gateways = new PrefSet();
    }
    configureNat(options) {
        if (this.props.eipAllocationIds != null
            && !core_1.Token.isUnresolved(this.props.eipAllocationIds)
            && this.props.eipAllocationIds.length < options.natSubnets.length) {
            throw new Error(`Not enough NAT gateway EIP allocation IDs (${this.props.eipAllocationIds.length} provided) for the requested subnet count (${options.natSubnets.length} needed).`);
        }
        // Create the NAT gateways
        let i = 0;
        for (const sub of options.natSubnets) {
            const eipAllocationId = this.props.eipAllocationIds ? pickN(i, this.props.eipAllocationIds) : undefined;
            const gateway = sub.addNatGateway(eipAllocationId);
            this.gateways.add(sub.availabilityZone, gateway.ref);
            i++;
        }
        // Add routes to them in the private subnets
        for (const sub of options.privateSubnets) {
            this.configureSubnet(sub);
        }
    }
    configureSubnet(subnet) {
        const az = subnet.availabilityZone;
        const gatewayId = this.gateways.pick(az);
        subnet.addRoute('DefaultRoute', {
            routerType: vpc_1.RouterType.NAT_GATEWAY,
            routerId: gatewayId,
            enablesInternetConnectivity: true,
        });
    }
    get configuredGateways() {
        return this.gateways.values().map(x => ({ az: x[0], gatewayId: x[1] }));
    }
}
/**
 * NAT provider which uses NAT Instances
 */
class NatInstanceProvider extends NatProvider {
    constructor(props) {
        super();
        this.props = props;
        this.gateways = new PrefSet();
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_NatInstanceProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, NatInstanceProvider);
            }
            throw error;
        }
        if (props.defaultAllowedTraffic !== undefined && props.allowAllTraffic !== undefined) {
            throw new Error('Can not specify both of \'defaultAllowedTraffic\' and \'defaultAllowedTraffic\'; prefer \'defaultAllowedTraffic\'');
        }
    }
    configureNat(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_ConfigureNatOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.configureNat);
            }
            throw error;
        }
        const defaultDirection = this.props.defaultAllowedTraffic ??
            (this.props.allowAllTraffic ?? true ? NatTrafficDirection.INBOUND_AND_OUTBOUND : NatTrafficDirection.OUTBOUND_ONLY);
        // Create the NAT instances. They can share a security group and a Role.
        const machineImage = this.props.machineImage || new NatInstanceImage();
        this._securityGroup = this.props.securityGroup ?? new security_group_1.SecurityGroup(options.vpc, 'NatSecurityGroup', {
            vpc: options.vpc,
            description: 'Security Group for NAT instances',
            allowAllOutbound: isOutboundAllowed(defaultDirection),
        });
        this._connections = new connections_1.Connections({ securityGroups: [this._securityGroup] });
        if (isInboundAllowed(defaultDirection)) {
            this.connections.allowFromAnyIpv4(port_1.Port.allTraffic());
        }
        // FIXME: Ideally, NAT instances don't have a role at all, but
        // 'Instance' does not allow that right now.
        const role = new iam.Role(options.vpc, 'NatRole', {
            assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
        });
        for (const sub of options.natSubnets) {
            const natInstance = new instance_1.Instance(sub, 'NatInstance', {
                instanceType: this.props.instanceType,
                machineImage,
                sourceDestCheck: false,
                vpc: options.vpc,
                vpcSubnets: { subnets: [sub] },
                securityGroup: this._securityGroup,
                role,
                keyName: this.props.keyName,
            });
            // NAT instance routes all traffic, both ways
            this.gateways.add(sub.availabilityZone, natInstance);
        }
        // Add routes to them in the private subnets
        for (const sub of options.privateSubnets) {
            this.configureSubnet(sub);
        }
    }
    /**
     * The Security Group associated with the NAT instances
     */
    get securityGroup() {
        if (!this._securityGroup) {
            throw new Error('Pass the NatInstanceProvider to a Vpc before accessing \'securityGroup\'');
        }
        return this._securityGroup;
    }
    /**
     * Manage the Security Groups associated with the NAT instances
     */
    get connections() {
        if (!this._connections) {
            throw new Error('Pass the NatInstanceProvider to a Vpc before accessing \'connections\'');
        }
        return this._connections;
    }
    get configuredGateways() {
        return this.gateways.values().map(x => ({ az: x[0], gatewayId: x[1].instanceId }));
    }
    configureSubnet(subnet) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_PrivateSubnet(subnet);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.configureSubnet);
            }
            throw error;
        }
        const az = subnet.availabilityZone;
        const gatewayId = this.gateways.pick(az).instanceId;
        subnet.addRoute('DefaultRoute', {
            routerType: vpc_1.RouterType.INSTANCE,
            routerId: gatewayId,
            enablesInternetConnectivity: true,
        });
    }
}
_b = JSII_RTTI_SYMBOL_1;
NatInstanceProvider[_b] = { fqn: "@aws-cdk/aws-ec2.NatInstanceProvider", version: "0.0.0" };
exports.NatInstanceProvider = NatInstanceProvider;
/**
 * Preferential set
 *
 * Picks the value with the given key if available, otherwise distributes
 * evenly among the available options.
 */
class PrefSet {
    constructor() {
        this.map = {};
        this.vals = new Array();
        this.next = 0;
    }
    add(pref, value) {
        this.map[pref] = value;
        this.vals.push([pref, value]);
    }
    pick(pref) {
        if (this.vals.length === 0) {
            throw new Error('Cannot pick, set is empty');
        }
        if (pref in this.map) {
            return this.map[pref];
        }
        return this.vals[this.next++ % this.vals.length][1];
    }
    values() {
        return this.vals;
    }
}
/**
 * Machine image representing the latest NAT instance image
 *
 *
 */
class NatInstanceImage extends machine_image_1.LookupMachineImage {
    constructor() {
        super({
            name: 'amzn-ami-vpc-nat-*',
            owners: ['amazon'],
        });
    }
}
_c = JSII_RTTI_SYMBOL_1;
NatInstanceImage[_c] = { fqn: "@aws-cdk/aws-ec2.NatInstanceImage", version: "0.0.0" };
exports.NatInstanceImage = NatInstanceImage;
function isOutboundAllowed(direction) {
    return direction === NatTrafficDirection.INBOUND_AND_OUTBOUND ||
        direction === NatTrafficDirection.OUTBOUND_ONLY;
}
function isInboundAllowed(direction) {
    return direction === NatTrafficDirection.INBOUND_AND_OUTBOUND;
}
/**
 * Token-aware pick index function
 */
function pickN(i, xs) {
    if (core_1.Token.isUnresolved(xs)) {
        return core_1.Fn.select(i, xs);
    }
    if (i >= xs.length) {
        throw new Error(`Cannot get element ${i} from ${xs}`);
    }
    return xs[i];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibmF0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUF3QztBQUN4Qyx3Q0FBMEM7QUFDMUMsK0NBQTBEO0FBQzFELHlDQUFzQztBQUV0QyxtREFBb0U7QUFDcEUsaUNBQThCO0FBQzlCLHFEQUFpRTtBQUNqRSwrQkFBcUU7QUFFckU7O0dBRUc7QUFDSCxJQUFZLG1CQWVYO0FBZkQsV0FBWSxtQkFBbUI7SUFDN0I7O09BRUc7SUFDSCxzREFBK0IsQ0FBQTtJQUUvQjs7T0FFRztJQUNILG9FQUE2QyxDQUFBO0lBRTdDOztPQUVHO0lBQ0gsb0NBQWEsQ0FBQTtBQUNmLENBQUMsRUFmVyxtQkFBbUIsR0FBbkIsMkJBQW1CLEtBQW5CLDJCQUFtQixRQWU5QjtBQWtCRDs7Ozs7OztHQU9HO0FBQ0gsTUFBc0IsV0FBVztJQUMvQjs7Ozs7O09BTUc7SUFDSSxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQXlCLEVBQUU7Ozs7Ozs7Ozs7UUFDL0MsT0FBTyxJQUFJLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3RDO0lBRUQ7Ozs7Ozs7Ozs7T0FVRztJQUNJLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBdUI7Ozs7Ozs7Ozs7UUFDNUMsT0FBTyxJQUFJLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3ZDOzs7O0FBekJtQixrQ0FBVztBQStKakM7O0dBRUc7QUFDSCxNQUFNLGtCQUFtQixTQUFRLFdBQVc7SUFHMUMsWUFBNkIsUUFBeUIsRUFBRTtRQUN0RCxLQUFLLEVBQUUsQ0FBQztRQURtQixVQUFLLEdBQUwsS0FBSyxDQUFzQjtRQUZoRCxhQUFRLEdBQW9CLElBQUksT0FBTyxFQUFVLENBQUM7S0FJekQ7SUFFTSxZQUFZLENBQUMsT0FBNEI7UUFDOUMsSUFDRSxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixJQUFJLElBQUk7ZUFDaEMsQ0FBQyxZQUFLLENBQUMsWUFBWSxD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TSxFQUFFLENBQUMsUUFBUSxDQUFDO1NBQ25CLENBQUMsQ0FBQztLQUNKOzs7O0FBTlUsNENBQWdCO0FBUzdCLFNBQVMsaUJBQWlCLENBQUMsU0FBOEI7SUFDdkQsT0FBTyxTQUFTLEtBQUssbUJBQW1CLENBQUMsb0JBQW9CO1FBQzNELFNBQVMsS0FBSyxtQkFBbUIsQ0FBQyxhQUFhLENBQUM7QUFDcEQsQ0FBQztBQUVELFNBQVMsZ0JBQWdCLENBQUMsU0FBOEI7SUFDdEQsT0FBTyxTQUFTLEtBQUssbUJBQW1CLENBQUMsb0JBQW9CLENBQUM7QUFDaEUsQ0FBQztBQUVEOztHQUVHO0FBQ0gsU0FBUyxLQUFLLENBQUMsQ0FBUyxFQUFFLEVBQVk7SUFDcEMsSUFBSSxZQUFLLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1FBQUUsT0FBTyxTQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUFFO0lBRXhELElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUU7UUFDbEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDdkQ7SUFFRCxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNmLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgeyBGbiwgVG9rZW4gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbm5lY3Rpb25zLCBJQ29ubmVjdGFibGUgfSBmcm9tICcuL2Nvbm5lY3Rpb25zJztcbmltcG9ydCB7IEluc3RhbmNlIH0gZnJvbSAnLi9pbnN0YW5jZSc7XG5pbXBvcnQgeyBJbnN0YW5jZVR5cGUgfSBmcm9tICcuL2luc3RhbmNlLXR5cGVzJztcbmltcG9ydCB7IElNYWNoaW5lSW1hZ2UsIExvb2t1cE1hY2hpbmVJbWFnZSB9IGZyb20gJy4vbWFjaGluZS1pbWFnZSc7XG5pbXBvcnQgeyBQb3J0IH0gZnJvbSAnLi9wb3J0JztcbmltcG9ydCB7IElTZWN1cml0eUdyb3VwLCBTZWN1cml0eUdyb3VwIH0gZnJvbSAnLi9zZWN1cml0eS1ncm91cCc7XG5pbXBvcnQgeyBQcml2YXRlU3VibmV0LCBQdWJsaWNTdWJuZXQsIFJvdXRlclR5cGUsIFZwYyB9IGZyb20gJy4vdnBjJztcblxuLyoqXG4gKiBEaXJlY3Rpb24gb2YgdHJhZmZpYyB0byBhbGxvdyBhbGwgYnkgZGVmYXVsdC5cbiAqL1xuZXhwb3J0IGVudW0gTmF0VHJhZmZpY0RpcmVjdGlvbiB7XG4gIC8qKlxuICAgKiBBbGxvdyBhbGwgb3V0Ym91bmQgdHJhZmZpYyBhbmQgZGlzYWxsb3cgYWxsIGluYm91bmQgdHJhZmZpYy5cbiAgICovXG4gIE9VVEJPVU5EX09OTFkgPSAnT1VUQk9VTkRfT05MWScsXG5cbiAgLyoqXG4gICAqIEFsbG93IGFsbCBvdXRib3VuZCBhbmQgaW5ib3VuZCB0cmFmZmljLlxuICAgKi9cbiAgSU5CT1VORF9BTkRfT1VUQk9VTkQgPSAnSU5CT1VORF9BTkRfT1VUQk9VTkQnLFxuXG4gIC8qKlxuICAgKiBEaXNhbGxvdyBhbGwgb3V0Ym91bmQgYW5kIGluYm91bmQgdHJhZmZpYy5cbiAgICovXG4gIE5PTkUgPSAnTk9ORScsXG59XG5cbi8qKlxuICogUGFpciByZXByZXNlbnRzIGEgZ2F0ZXdheSBjcmVhdGVkIGJ5IE5BVCBQcm92aWRlclxuICovXG5leHBvcnQgaW50ZXJmYWNlIEdhdGV3YXlDb25maWcge1xuXG4gIC8qKlxuICAgKiBBdmFpbGFiaWxpdHkgWm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgYXo6IHN0cmluZ1xuXG4gIC8qKlxuICAgKiBJZGVudGl0eSBvZiBnYXRld2F5IHNwYXduZWQgYnkgdGhlIHByb3ZpZGVyXG4gICAqL1xuICByZWFkb25seSBnYXRld2F5SWQ6IHN0cmluZ1xufVxuXG4vKipcbiAqIE5BVCBwcm92aWRlcnNcbiAqXG4gKiBEZXRlcm1pbmVzIHdoYXQgdHlwZSBvZiBOQVQgcHJvdmlkZXIgdG8gY3JlYXRlLCBlaXRoZXIgTkFUIGdhdGV3YXlzIG9yIE5BVFxuICogaW5zdGFuY2UuXG4gKlxuICpcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE5hdFByb3ZpZGVyIHtcbiAgLyoqXG4gICAqIFVzZSBOQVQgR2F0ZXdheXMgdG8gcHJvdmlkZSBOQVQgc2VydmljZXMgZm9yIHlvdXIgVlBDXG4gICAqXG4gICAqIE5BVCBnYXRld2F5cyBhcmUgbWFuYWdlZCBieSBBV1MuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3ZwYy9sYXRlc3QvdXNlcmd1aWRlL3ZwYy1uYXQtZ2F0ZXdheS5odG1sXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdhdGV3YXkocHJvcHM6IE5hdEdhdGV3YXlQcm9wcyA9IHt9KTogTmF0UHJvdmlkZXIge1xuICAgIHJldHVybiBuZXcgTmF0R2F0ZXdheVByb3ZpZGVyKHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2UgTkFUIGluc3RhbmNlcyB0byBwcm92aWRlIE5BVCBzZXJ2aWNlcyBmb3IgeW91ciBWUENcbiAgICpcbiAgICogTkFUIGluc3RhbmNlcyBhcmUgbWFuYWdlZCBieSB5b3UsIGJ1dCBpbiByZXR1cm4gYWxsb3cgbW9yZSBjb25maWd1cmF0aW9uLlxuICAgKlxuICAgKiBCZSBhd2FyZSB0aGF0IGluc3RhbmNlcyBjcmVhdGVkIHVzaW5nIHRoaXMgcHJvdmlkZXIgd2lsbCBub3QgYmVcbiAgICogYXV0b21hdGljYWxseSByZXBsYWNlZCBpZiB0aGV5IGFyZSBzdG9wcGVkIGZvciBhbnkgcmVhc29uLiBZb3Ugc2hvdWxkIGltcGxlbWVudFxuICAgKiB5b3VyIG93biBOYXRQcm92aWRlciBiYXNlZCBvbiBBdXRvU2NhbGluZyBncm91cHMgaWYgeW91IG5lZWQgdGhhdC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vdnBjL2xhdGVzdC91c2VyZ3VpZGUvVlBDX05BVF9JbnN0YW5jZS5odG1sXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGluc3RhbmNlKHByb3BzOiBOYXRJbnN0YW5jZVByb3BzKTogTmF0SW5zdGFuY2VQcm92aWRlciB7XG4gICAgcmV0dXJuIG5ldyBOYXRJbnN0YW5jZVByb3ZpZGVyKHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gbGlzdCBvZiBnYXRld2F5cyBzcGF3bmVkIGJ5IHRoZSBwcm92aWRlclxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGNvbmZpZ3VyZWRHYXRld2F5czogR2F0ZXdheUNvbmZpZ1tdO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgYnkgdGhlIFZQQyB0byBjb25maWd1cmUgTkFUXG4gICAqXG4gICAqIERvbid0IGNhbGwgdGhpcyBkaXJlY3RseSwgdGhlIFZQQyB3aWxsIGNhbGwgaXQgYXV0b21hdGljYWxseS5cbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCBjb25maWd1cmVOYXQob3B0aW9uczogQ29uZmlndXJlTmF0T3B0aW9ucyk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyZXMgc3VibmV0IHdpdGggdGhlIGdhdGV3YXlcbiAgICpcbiAgICogRG9uJ3QgY2FsbCB0aGlzIGRpcmVjdGx5LCB0aGUgVlBDIHdpbGwgY2FsbCBpdCBhdXRvbWF0aWNhbGx5LlxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IGNvbmZpZ3VyZVN1Ym5ldChzdWJuZXQ6IFByaXZhdGVTdWJuZXQpOiB2b2lkO1xufVxuXG4vKipcbiAqIE9wdGlvbnMgcGFzc2VkIGJ5IHRoZSBWUEMgd2hlbiBOQVQgbmVlZHMgdG8gYmUgY29uZmlndXJlZFxuICpcbiAqXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29uZmlndXJlTmF0T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgVlBDIHdlJ3JlIGNvbmZpZ3VyaW5nIE5BVCBmb3JcbiAgICovXG4gIHJlYWRvbmx5IHZwYzogVnBjO1xuXG4gIC8qKlxuICAgKiBUaGUgcHVibGljIHN1Ym5ldHMgd2hlcmUgdGhlIE5BVCBwcm92aWRlcnMgbmVlZCB0byBiZSBwbGFjZWRcbiAgICovXG4gIHJlYWRvbmx5IG5hdFN1Ym5ldHM6IFB1YmxpY1N1Ym5ldFtdO1xuXG4gIC8qKlxuICAgKiBUaGUgcHJpdmF0ZSBzdWJuZXRzIHRoYXQgbmVlZCB0byByb3V0ZSB0aHJvdWdoIHRoZSBOQVQgcHJvdmlkZXJzLlxuICAgKlxuICAgKiBUaGVyZSBtYXkgYmUgbW9yZSBwcml2YXRlIHN1Ym5ldHMgdGhhbiBwdWJsaWMgc3VibmV0cyB3aXRoIE5BVCBwcm92aWRlcnMuXG4gICAqL1xuICByZWFkb25seSBwcml2YXRlU3VibmV0czogUHJpdmF0ZVN1Ym5ldFtdO1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGEgTkFUIGdhdGV3YXlcbiAqXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTmF0R2F0ZXdheVByb3BzIHtcbiAgLyoqXG4gICAqIEVJUCBhbGxvY2F0aW9uIElEcyBmb3IgdGhlIE5BVCBnYXRld2F5c1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGZpeGVkIEVJUHMgYWxsb2NhdGVkIGZvciB0aGUgTkFUIGdhdGV3YXlzXG4gICAqL1xuICByZWFkb25seSBlaXBBbGxvY2F0aW9uSWRzPzogc3RyaW5nW107XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgYSBOQVQgaW5zdGFuY2VcbiAqXG4gKlxuICovXG5leHBvcnQgaW50ZXJmYWNlIE5hdEluc3RhbmNlUHJvcHMge1xuICAvKipcbiAgICogVGhlIG1hY2hpbmUgaW1hZ2UgKEFNSSkgdG8gdXNlXG4gICAqXG4gICAqIEJ5IGRlZmF1bHQsIHdpbGwgZG8gYW4gQU1JIGxvb2t1cCBmb3IgdGhlIGxhdGVzdCBOQVQgaW5zdGFuY2UgaW1hZ2UuXG4gICAqXG4gICAqIElmIHlvdSBoYXZlIGEgc3BlY2lmaWMgQU1JIElEIHlvdSB3YW50IHRvIHVzZSwgcGFzcyBhIGBHZW5lcmljTGludXhJbWFnZWAuIEZvciBleGFtcGxlOlxuICAgKlxuICAgKiBgYGB0c1xuICAgKiBlYzIuTmF0UHJvdmlkZXIuaW5zdGFuY2Uoe1xuICAgKiAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QzLm1pY3JvJyksXG4gICAqICAgbWFjaGluZUltYWdlOiBuZXcgZWMyLkdlbmVyaWNMaW51eEltYWdlKHtcbiAgICogICAgICd1cy1lYXN0LTInOiAnYW1pLTBmOWM2MWI1YTU2MmExNmFmJ1xuICAgKiAgIH0pXG4gICAqIH0pXG4gICAqIGBgYFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIExhdGVzdCBOQVQgaW5zdGFuY2UgaW1hZ2VcbiAgICovXG4gIHJlYWRvbmx5IG1hY2hpbmVJbWFnZT86IElNYWNoaW5lSW1hZ2U7XG5cbiAgLyoqXG4gICAqIEluc3RhbmNlIHR5cGUgb2YgdGhlIE5BVCBpbnN0YW5jZVxuICAgKi9cbiAgcmVhZG9ubHkgaW5zdGFuY2VUeXBlOiBJbnN0YW5jZVR5cGU7XG5cbiAgLyoqXG4gICAqIE5hbWUgb2YgU1NIIGtleXBhaXIgdG8gZ3JhbnQgYWNjZXNzIHRvIGluc3RhbmNlXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gU1NIIGFjY2VzcyB3aWxsIGJlIHBvc3NpYmxlLlxuICAgKi9cbiAgcmVhZG9ubHkga2V5TmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogU2VjdXJpdHkgR3JvdXAgZm9yIE5BVCBpbnN0YW5jZXNcbiAgICpcbiAgICogQGRlZmF1bHQgLSBBIG5ldyBzZWN1cml0eSBncm91cCB3aWxsIGJlIGNyZWF0ZWRcbiAgICovXG4gIHJlYWRvbmx5IHNlY3VyaXR5R3JvdXA/OiBJU2VjdXJpdHlHcm91cDtcblxuICAvKipcbiAgICogQWxsb3cgYWxsIGluYm91bmQgdHJhZmZpYyB0aHJvdWdoIHRoZSBOQVQgaW5zdGFuY2VcbiAgICpcbiAgICogSWYgeW91IHNldCB0aGlzIHRvIGZhbHNlLCB5b3UgbXVzdCBjb25maWd1cmUgdGhlIE5BVCBpbnN0YW5jZSdzIHNlY3VyaXR5XG4gICAqIGdyb3VwcyBpbiBhbm90aGVyIHdheSwgZWl0aGVyIGJ5IHBhc3NpbmcgaW4gYSBmdWxseSBjb25maWd1cmVkIFNlY3VyaXR5XG4gICAqIEdyb3VwIHVzaW5nIHRoZSBgc2VjdXJpdHlHcm91cGAgcHJvcGVydHksIG9yIGJ5IGNvbmZpZ3VyaW5nIGl0IHVzaW5nIHRoZVxuICAgKiBgLnNlY3VyaXR5R3JvdXBgIG9yIGAuY29ubmVjdGlvbnNgIG1lbWJlcnMgYWZ0ZXIgcGFzc2luZyB0aGUgTkFUIEluc3RhbmNlXG4gICAqIFByb3ZpZGVyIHRvIGEgVnBjLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqIEBkZXByZWNhdGVkIC0gVXNlIGBkZWZhdWx0QWxsb3dlZFRyYWZmaWNgLlxuICAgKi9cbiAgcmVhZG9ubHkgYWxsb3dBbGxUcmFmZmljPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogRGlyZWN0aW9uIHRvIGFsbG93IGFsbCB0cmFmZmljIHRocm91Z2ggdGhlIE5BVCBpbnN0YW5jZSBieSBkZWZhdWx0LlxuICAgKlxuICAgKiBCeSBkZWZhdWx0LCBpbmJvdW5kIGFuZCBvdXRib3VuZCB0cmFmZmljIGlzIGFsbG93ZWQuXG4gICAqXG4gICAqIElmIHlvdSBzZXQgdGhpcyB0byBhbm90aGVyIHZhbHVlIHRoYW4gSU5CT1VORF9BTkRfT1VUQk9VTkQsIHlvdSBtdXN0XG4gICAqIGNvbmZpZ3VyZSB0aGUgTkFUIGluc3RhbmNlJ3Mgc2VjdXJpdHkgZ3JvdXBzIGluIGFub3RoZXIgd2F5LCBlaXRoZXIgYnlcbiAgICogcGFzc2luZyBpbiBhIGZ1bGx5IGNvbmZpZ3VyZWQgU2VjdXJpdHkgR3JvdXAgdXNpbmcgdGhlIGBzZWN1cml0eUdyb3VwYFxuICAgKiBwcm9wZXJ0eSwgb3IgYnkgY29uZmlndXJpbmcgaXQgdXNpbmcgdGhlIGAuc2VjdXJpdHlHcm91cGAgb3JcbiAgICogYC5jb25uZWN0aW9uc2AgbWVtYmVycyBhZnRlciBwYXNzaW5nIHRoZSBOQVQgSW5zdGFuY2UgUHJvdmlkZXIgdG8gYSBWcGMuXG4gICAqXG4gICAqIEBkZWZhdWx0IE5hdFRyYWZmaWNEaXJlY3Rpb24uSU5CT1VORF9BTkRfT1VUQk9VTkRcbiAgICovXG4gIHJlYWRvbmx5IGRlZmF1bHRBbGxvd2VkVHJhZmZpYz86IE5hdFRyYWZmaWNEaXJlY3Rpb247XG59XG5cbi8qKlxuICogUHJvdmlkZXIgZm9yIE5BVCBHYXRld2F5c1xuICovXG5jbGFzcyBOYXRHYXRld2F5UHJvdmlkZXIgZXh0ZW5kcyBOYXRQcm92aWRlciB7XG4gIHByaXZhdGUgZ2F0ZXdheXM6IFByZWZTZXQ8c3RyaW5nPiA9IG5ldyBQcmVmU2V0PHN0cmluZz4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHByb3BzOiBOYXRHYXRld2F5UHJvcHMgPSB7fSkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBwdWJsaWMgY29uZmlndXJlTmF0KG9wdGlvbnM6IENvbmZpZ3VyZU5hdE9wdGlvbnMpIHtcbiAgICBpZiAoXG4gICAgICB0aGlzLnByb3BzLmVpcEFsbG9jYXRpb25JZHMgIT0gbnVsbFxuICAgICAgJiYgIVRva2VuLmlzVW5yZXNvbHZlZCh0aGlzLnByb3BzLmVpcEFsbG9jYXRpb25JZHMpXG4gICAgICAmJiB0aGlzLnByb3BzLmVpcEFsbG9jYXRpb25JZHMubGVuZ3RoIDwgb3B0aW9ucy5uYXRTdWJuZXRzLmxlbmd0aFxuICAgICkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBOb3QgZW5vdWdoIE5BVCBnYXRld2F5IEVJUCBhbGxvY2F0aW9uIElEcyAoJHt0aGlzLnByb3BzLmVpcEFsbG9jYXRpb25JZHMubGVuZ3RofSBwcm92aWRlZCkgZm9yIHRoZSByZXF1ZXN0ZWQgc3VibmV0IGNvdW50ICgke29wdGlvbnMubmF0U3VibmV0cy5sZW5ndGh9IG5lZWRlZCkuYCk7XG4gICAgfVxuXG4gICAgLy8gQ3JlYXRlIHRoZSBOQVQgZ2F0ZXdheXNcbiAgICBsZXQgaSA9IDA7XG4gICAgZm9yIChjb25zdCBzdWIgb2Ygb3B0aW9ucy5uYXRTdWJuZXRzKSB7XG4gICAgICBjb25zdCBlaXBBbGxvY2F0aW9uSWQgPSB0aGlzLnByb3BzLmVpcEFsbG9jYXRpb25JZHMgPyBwaWNrTihpLCB0aGlzLnByb3BzLmVpcEFsbG9jYXRpb25JZHMpIDogdW5kZWZpbmVkO1xuICAgICAgY29uc3QgZ2F0ZXdheSA9IHN1Yi5hZGROYXRHYXRld2F5KGVpcEFsbG9jYXRpb25JZCk7XG4gICAgICB0aGlzLmdhdGV3YXlzLmFkZChzdWIuYXZhaWxhYmlsaXR5Wm9uZSwgZ2F0ZXdheS5yZWYpO1xuICAgICAgaSsrO1xuICAgIH1cblxuICAgIC8vIEFkZCByb3V0ZXMgdG8gdGhlbSBpbiB0aGUgcHJpdmF0ZSBzdWJuZXRzXG4gICAgZm9yIChjb25zdCBzdWIgb2Ygb3B0aW9ucy5wcml2YXRlU3VibmV0cykge1xuICAgICAgdGhpcy5jb25maWd1cmVTdWJuZXQoc3ViKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgY29uZmlndXJlU3VibmV0KHN1Ym5ldDogUHJpdmF0ZVN1Ym5ldCkge1xuICAgIGNvbnN0IGF6ID0gc3VibmV0LmF2YWlsYWJpbGl0eVpvbmU7XG4gICAgY29uc3QgZ2F0ZXdheUlkID0gdGhpcy5nYXRld2F5cy5waWNrKGF6KTtcbiAgICBzdWJuZXQuYWRkUm91dGUoJ0RlZmF1bHRSb3V0ZScsIHtcbiAgICAgIHJvdXRlclR5cGU6IFJvdXRlclR5cGUuTkFUX0dBVEVXQVksXG4gICAgICByb3V0ZXJJZDogZ2F0ZXdheUlkLFxuICAgICAgZW5hYmxlc0ludGVybmV0Q29ubmVjdGl2aXR5OiB0cnVlLFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGdldCBjb25maWd1cmVkR2F0ZXdheXMoKTogR2F0ZXdheUNvbmZpZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5nYXRld2F5cy52YWx1ZXMoKS5tYXAoeCA9PiAoeyBhejogeFswXSwgZ2F0ZXdheUlkOiB4WzFdIH0pKTtcbiAgfVxufVxuXG4vKipcbiAqIE5BVCBwcm92aWRlciB3aGljaCB1c2VzIE5BVCBJbnN0YW5jZXNcbiAqL1xuZXhwb3J0IGNsYXNzIE5hdEluc3RhbmNlUHJvdmlkZXIgZXh0ZW5kcyBOYXRQcm92aWRlciBpbXBsZW1lbnRzIElDb25uZWN0YWJsZSB7XG4gIHByaXZhdGUgZ2F0ZXdheXM6IFByZWZTZXQ8SW5zdGFuY2U+ID0gbmV3IFByZWZTZXQ8SW5zdGFuY2U+KCk7XG4gIHByaXZhdGUgX3NlY3VyaXR5R3JvdXA/OiBJU2VjdXJpdHlHcm91cDtcbiAgcHJpdmF0ZSBfY29ubmVjdGlvbnM/OiBDb25uZWN0aW9ucztcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHByb3BzOiBOYXRJbnN0YW5jZVByb3BzKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIGlmIChwcm9wcy5kZWZhdWx0QWxsb3dlZFRyYWZmaWMgIT09IHVuZGVmaW5lZCAmJiBwcm9wcy5hbGxvd0FsbFRyYWZmaWMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW4gbm90IHNwZWNpZnkgYm90aCBvZiBcXCdkZWZhdWx0QWxsb3dlZFRyYWZmaWNcXCcgYW5kIFxcJ2RlZmF1bHRBbGxvd2VkVHJhZmZpY1xcJzsgcHJlZmVyIFxcJ2RlZmF1bHRBbGxvd2VkVHJhZmZpY1xcJycpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBjb25maWd1cmVOYXQob3B0aW9uczogQ29uZmlndXJlTmF0T3B0aW9ucykge1xuICAgIGNvbnN0IGRlZmF1bHREaXJlY3Rpb24gPSB0aGlzLnByb3BzLmRlZmF1bHRBbGxvd2VkVHJhZmZpYyA/P1xuICAgICAgKHRoaXMucHJvcHMuYWxsb3dBbGxUcmFmZmljID8/IHRydWUgPyBOYXRUcmFmZmljRGlyZWN0aW9uLklOQk9VTkRfQU5EX09VVEJPVU5EIDogTmF0VHJhZmZpY0RpcmVjdGlvbi5PVVRCT1VORF9PTkxZKTtcblxuICAgIC8vIENyZWF0ZSB0aGUgTkFUIGluc3RhbmNlcy4gVGhleSBjYW4gc2hhcmUgYSBzZWN1cml0eSBncm91cCBhbmQgYSBSb2xlLlxuICAgIGNvbnN0IG1hY2hpbmVJbWFnZSA9IHRoaXMucHJvcHMubWFjaGluZUltYWdlIHx8IG5ldyBOYXRJbnN0YW5jZUltYWdlKCk7XG4gICAgdGhpcy5fc2VjdXJpdHlHcm91cCA9IHRoaXMucHJvcHMuc2VjdXJpdHlHcm91cCA/PyBuZXcgU2VjdXJpdHlHcm91cChvcHRpb25zLnZwYywgJ05hdFNlY3VyaXR5R3JvdXAnLCB7XG4gICAgICB2cGM6IG9wdGlvbnMudnBjLFxuICAgICAgZGVzY3JpcHRpb246ICdTZWN1cml0eSBHcm91cCBmb3IgTkFUIGluc3RhbmNlcycsXG4gICAgICBhbGxvd0FsbE91dGJvdW5kOiBpc091dGJvdW5kQWxsb3dlZChkZWZhdWx0RGlyZWN0aW9uKSxcbiAgICB9KTtcbiAgICB0aGlzLl9jb25uZWN0aW9ucyA9IG5ldyBDb25uZWN0aW9ucyh7IHNlY3VyaXR5R3JvdXBzOiBbdGhpcy5fc2VjdXJpdHlHcm91cF0gfSk7XG5cbiAgICBpZiAoaXNJbmJvdW5kQWxsb3dlZChkZWZhdWx0RGlyZWN0aW9uKSkge1xuICAgICAgdGhpcy5jb25uZWN0aW9ucy5hbGxvd0Zyb21BbnlJcHY0KFBvcnQuYWxsVHJhZmZpYygpKTtcbiAgICB9XG5cbiAgICAvLyBGSVhNRTogSWRlYWxseSwgTkFUIGluc3RhbmNlcyBkb24ndCBoYXZlIGEgcm9sZSBhdCBhbGwsIGJ1dFxuICAgIC8vICdJbnN0YW5jZScgZG9lcyBub3QgYWxsb3cgdGhhdCByaWdodCBub3cuXG4gICAgY29uc3Qgcm9sZSA9IG5ldyBpYW0uUm9sZShvcHRpb25zLnZwYywgJ05hdFJvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnZWMyLmFtYXpvbmF3cy5jb20nKSxcbiAgICB9KTtcblxuICAgIGZvciAoY29uc3Qgc3ViIG9mIG9wdGlvbnMubmF0U3VibmV0cykge1xuICAgICAgY29uc3QgbmF0SW5zdGFuY2UgPSBuZXcgSW5zdGFuY2Uoc3ViLCAnTmF0SW5zdGFuY2UnLCB7XG4gICAgICAgIGluc3RhbmNlVHlwZTogdGhpcy5wcm9wcy5pbnN0YW5jZVR5cGUsXG4gICAgICAgIG1hY2hpbmVJbWFnZSxcbiAgICAgICAgc291cmNlRGVzdENoZWNrOiBmYWxzZSwgLy8gUmVxdWlyZWQgZm9yIE5BVFxuICAgICAgICB2cGM6IG9wdGlvbnMudnBjLFxuICAgICAgICB2cGNTdWJuZXRzOiB7IHN1Ym5ldHM6IFtzdWJdIH0sXG4gICAgICAgIHNlY3VyaXR5R3JvdXA6IHRoaXMuX3NlY3VyaXR5R3JvdXAsXG4gICAgICAgIHJvbGUsXG4gICAgICAgIGtleU5hbWU6IHRoaXMucHJvcHMua2V5TmFtZSxcbiAgICAgIH0pO1xuICAgICAgLy8gTkFUIGluc3RhbmNlIHJvdXRlcyBhbGwgdHJhZmZpYywgYm90aCB3YXlzXG4gICAgICB0aGlzLmdhdGV3YXlzLmFkZChzdWIuYXZhaWxhYmlsaXR5Wm9uZSwgbmF0SW5zdGFuY2UpO1xuICAgIH1cblxuICAgIC8vIEFkZCByb3V0ZXMgdG8gdGhlbSBpbiB0aGUgcHJpdmF0ZSBzdWJuZXRzXG4gICAgZm9yIChjb25zdCBzdWIgb2Ygb3B0aW9ucy5wcml2YXRlU3VibmV0cykge1xuICAgICAgdGhpcy5jb25maWd1cmVTdWJuZXQoc3ViKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhlIFNlY3VyaXR5IEdyb3VwIGFzc29jaWF0ZWQgd2l0aCB0aGUgTkFUIGluc3RhbmNlc1xuICAgKi9cbiAgcHVibGljIGdldCBzZWN1cml0eUdyb3VwKCk6IElTZWN1cml0eUdyb3VwIHtcbiAgICBpZiAoIXRoaXMuX3NlY3VyaXR5R3JvdXApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUGFzcyB0aGUgTmF0SW5zdGFuY2VQcm92aWRlciB0byBhIFZwYyBiZWZvcmUgYWNjZXNzaW5nIFxcJ3NlY3VyaXR5R3JvdXBcXCcnKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3NlY3VyaXR5R3JvdXA7XG4gIH1cblxuICAvKipcbiAgICogTWFuYWdlIHRoZSBTZWN1cml0eSBHcm91cHMgYXNzb2NpYXRlZCB3aXRoIHRoZSBOQVQgaW5zdGFuY2VzXG4gICAqL1xuICBwdWJsaWMgZ2V0IGNvbm5lY3Rpb25zKCk6IENvbm5lY3Rpb25zIHtcbiAgICBpZiAoIXRoaXMuX2Nvbm5lY3Rpb25zKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Bhc3MgdGhlIE5hdEluc3RhbmNlUHJvdmlkZXIgdG8gYSBWcGMgYmVmb3JlIGFjY2Vzc2luZyBcXCdjb25uZWN0aW9uc1xcJycpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fY29ubmVjdGlvbnM7XG4gIH1cblxuICBwdWJsaWMgZ2V0IGNvbmZpZ3VyZWRHYXRld2F5cygpOiBHYXRld2F5Q29uZmlnW10ge1xuICAgIHJldHVybiB0aGlzLmdhdGV3YXlzLnZhbHVlcygpLm1hcCh4ID0+ICh7IGF6OiB4WzBdLCBnYXRld2F5SWQ6IHhbMV0uaW5zdGFuY2VJZCB9KSk7XG4gIH1cblxuICBwdWJsaWMgY29uZmlndXJlU3VibmV0KHN1Ym5ldDogUHJpdmF0ZVN1Ym5ldCkge1xuICAgIGNvbnN0IGF6ID0gc3VibmV0LmF2YWlsYWJpbGl0eVpvbmU7XG4gICAgY29uc3QgZ2F0ZXdheUlkID0gdGhpcy5nYXRld2F5cy5waWNrKGF6KS5pbnN0YW5jZUlkO1xuICAgIHN1Ym5ldC5hZGRSb3V0ZSgnRGVmYXVsdFJvdXRlJywge1xuICAgICAgcm91dGVyVHlwZTogUm91dGVyVHlwZS5JTlNUQU5DRSxcbiAgICAgIHJvdXRlcklkOiBnYXRld2F5SWQsXG4gICAgICBlbmFibGVzSW50ZXJuZXRDb25uZWN0aXZpdHk6IHRydWUsXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBQcmVmZXJlbnRpYWwgc2V0XG4gKlxuICogUGlja3MgdGhlIHZhbHVlIHdpdGggdGhlIGdpdmVuIGtleSBpZiBhdmFpbGFibGUsIG90aGVyd2lzZSBkaXN0cmlidXRlc1xuICogZXZlbmx5IGFtb25nIHRoZSBhdmFpbGFibGUgb3B0aW9ucy5cbiAqL1xuY2xhc3MgUHJlZlNldDxBPiB7XG4gIHByaXZhdGUgcmVhZG9ubHkgbWFwOiBSZWNvcmQ8c3RyaW5nLCBBPiA9IHt9O1xuICBwcml2YXRlIHJlYWRvbmx5IHZhbHMgPSBuZXcgQXJyYXk8W3N0cmluZywgQV0+KCk7XG4gIHByaXZhdGUgbmV4dDogbnVtYmVyID0gMDtcblxuICBwdWJsaWMgYWRkKHByZWY6IHN0cmluZywgdmFsdWU6IEEpIHtcbiAgICB0aGlzLm1hcFtwcmVmXSA9IHZhbHVlO1xuICAgIHRoaXMudmFscy5wdXNoKFtwcmVmLCB2YWx1ZV0pO1xuICB9XG5cbiAgcHVibGljIHBpY2socHJlZjogc3RyaW5nKTogQSB7XG4gICAgaWYgKHRoaXMudmFscy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHBpY2ssIHNldCBpcyBlbXB0eScpO1xuICAgIH1cblxuICAgIGlmIChwcmVmIGluIHRoaXMubWFwKSB7IHJldHVybiB0aGlzLm1hcFtwcmVmXTsgfVxuICAgIHJldHVybiB0aGlzLnZhbHNbdGhpcy5uZXh0KysgJSB0aGlzLnZhbHMubGVuZ3RoXVsxXTtcbiAgfVxuXG4gIHB1YmxpYyB2YWx1ZXMoKTogQXJyYXk8W3N0cmluZywgQV0+IHtcbiAgICByZXR1cm4gdGhpcy52YWxzO1xuICB9XG59XG5cbi8qKlxuICogTWFjaGluZSBpbWFnZSByZXByZXNlbnRpbmcgdGhlIGxhdGVzdCBOQVQgaW5zdGFuY2UgaW1hZ2VcbiAqXG4gKlxuICovXG5leHBvcnQgY2xhc3MgTmF0SW5zdGFuY2VJbWFnZSBleHRlbmRzIExvb2t1cE1hY2hpbmVJbWFnZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKHtcbiAgICAgIG5hbWU6ICdhbXpuLWFtaS12cGMtbmF0LSonLFxuICAgICAgb3duZXJzOiBbJ2FtYXpvbiddLFxuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzT3V0Ym91bmRBbGxvd2VkKGRpcmVjdGlvbjogTmF0VHJhZmZpY0RpcmVjdGlvbikge1xuICByZXR1cm4gZGlyZWN0aW9uID09PSBOYXRUcmFmZmljRGlyZWN0aW9uLklOQk9VTkRfQU5EX09VVEJPVU5EIHx8XG4gICAgZGlyZWN0aW9uID09PSBOYXRUcmFmZmljRGlyZWN0aW9uLk9VVEJPVU5EX09OTFk7XG59XG5cbmZ1bmN0aW9uIGlzSW5ib3VuZEFsbG93ZWQoZGlyZWN0aW9uOiBOYXRUcmFmZmljRGlyZWN0aW9uKSB7XG4gIHJldHVybiBkaXJlY3Rpb24gPT09IE5hdFRyYWZmaWNEaXJlY3Rpb24uSU5CT1VORF9BTkRfT1VUQk9VTkQ7XG59XG5cbi8qKlxuICogVG9rZW4tYXdhcmUgcGljayBpbmRleCBmdW5jdGlvblxuICovXG5mdW5jdGlvbiBwaWNrTihpOiBudW1iZXIsIHhzOiBzdHJpbmdbXSkge1xuICBpZiAoVG9rZW4uaXNVbnJlc29sdmVkKHhzKSkgeyByZXR1cm4gRm4uc2VsZWN0KGksIHhzKTsgfVxuXG4gIGlmIChpID49IHhzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGdldCBlbGVtZW50ICR7aX0gZnJvbSAke3hzfWApO1xuICB9XG5cbiAgcmV0dXJuIHhzW2ldO1xufVxuIl19