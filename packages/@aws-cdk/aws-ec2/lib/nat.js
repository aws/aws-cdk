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
exports.NatProvider = NatProvider;
_a = JSII_RTTI_SYMBOL_1;
NatProvider[_a] = { fqn: "@aws-cdk/aws-ec2.NatProvider", version: "0.0.0" };
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
exports.NatInstanceProvider = NatInstanceProvider;
_b = JSII_RTTI_SYMBOL_1;
NatInstanceProvider[_b] = { fqn: "@aws-cdk/aws-ec2.NatInstanceProvider", version: "0.0.0" };
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
exports.NatInstanceImage = NatInstanceImage;
_c = JSII_RTTI_SYMBOL_1;
NatInstanceImage[_c] = { fqn: "@aws-cdk/aws-ec2.NatInstanceImage", version: "0.0.0" };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibmF0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUF3QztBQUN4Qyx3Q0FBMEM7QUFDMUMsK0NBQTBEO0FBQzFELHlDQUFzQztBQUV0QyxtREFBb0U7QUFDcEUsaUNBQThCO0FBQzlCLHFEQUFpRTtBQUNqRSwrQkFBcUU7QUFFckU7O0dBRUc7QUFDSCxJQUFZLG1CQWVYO0FBZkQsV0FBWSxtQkFBbUI7SUFDN0I7O09BRUc7SUFDSCxzREFBK0IsQ0FBQTtJQUUvQjs7T0FFRztJQUNILG9FQUE2QyxDQUFBO0lBRTdDOztPQUVHO0lBQ0gsb0NBQWEsQ0FBQTtBQUNmLENBQUMsRUFmVyxtQkFBbUIsR0FBbkIsMkJBQW1CLEtBQW5CLDJCQUFtQixRQWU5QjtBQWtCRDs7Ozs7OztHQU9HO0FBQ0gsTUFBc0IsV0FBVztJQUMvQjs7Ozs7O09BTUc7SUFDSSxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQXlCLEVBQUU7Ozs7Ozs7Ozs7UUFDL0MsT0FBTyxJQUFJLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3RDO0lBRUQ7Ozs7Ozs7Ozs7T0FVRztJQUNJLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBdUI7Ozs7Ozs7Ozs7UUFDNUMsT0FBTyxJQUFJLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3ZDOztBQXpCSCxrQ0E2Q0M7OztBQWtIRDs7R0FFRztBQUNILE1BQU0sa0JBQW1CLFNBQVEsV0FBVztJQUcxQyxZQUE2QixRQUF5QixFQUFFO1FBQ3RELEtBQUssRUFBRSxDQUFDO1FBRG1CLFVBQUssR0FBTCxLQUFLLENBQXNCO1FBRmhELGFBQVEsR0FBb0IsSUFBSSxPQUFPLEVBQVUsQ0FBQztLQUl6RDtJQUVNLFlBQVksQ0FBQyxPQUE0QjtRQUM5QyxJQUNFLElBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLElBQUksSUFBSTtlQUNoQyxDQUFDLFlBQUssQ0FBQyxZQUFZLENB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QUFFLENBQUMsUUFBUSxDQUFDO1NBQ25CLENBQUMsQ0FBQztLQUNKOztBQU5ILDRDQU9DOzs7QUFFRCxTQUFTLGlCQUFpQixDQUFDLFNBQThCO0lBQ3ZELE9BQU8sU0FBUyxLQUFLLG1CQUFtQixDQUFDLG9CQUFvQjtRQUMzRCxTQUFTLEtBQUssbUJBQW1CLENBQUMsYUFBYSxDQUFDO0FBQ3BELENBQUM7QUFFRCxTQUFTLGdCQUFnQixDQUFDLFNBQThCO0lBQ3RELE9BQU8sU0FBUyxLQUFLLG1CQUFtQixDQUFDLG9CQUFvQixDQUFDO0FBQ2hFLENBQUM7QUFFRDs7R0FFRztBQUNILFNBQVMsS0FBSyxDQUFDLENBQVMsRUFBRSxFQUFZO0lBQ3BDLElBQUksWUFBSyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsRUFBRTtRQUFFLE9BQU8sU0FBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FBRTtJQUV4RCxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFO1FBQ2xCLE1BQU0sSUFBSSxLQUFLLENBQUMsc0JBQXNCLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQ3ZEO0lBRUQsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0IHsgRm4sIFRva2VuIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25uZWN0aW9ucywgSUNvbm5lY3RhYmxlIH0gZnJvbSAnLi9jb25uZWN0aW9ucyc7XG5pbXBvcnQgeyBJbnN0YW5jZSB9IGZyb20gJy4vaW5zdGFuY2UnO1xuaW1wb3J0IHsgSW5zdGFuY2VUeXBlIH0gZnJvbSAnLi9pbnN0YW5jZS10eXBlcyc7XG5pbXBvcnQgeyBJTWFjaGluZUltYWdlLCBMb29rdXBNYWNoaW5lSW1hZ2UgfSBmcm9tICcuL21hY2hpbmUtaW1hZ2UnO1xuaW1wb3J0IHsgUG9ydCB9IGZyb20gJy4vcG9ydCc7XG5pbXBvcnQgeyBJU2VjdXJpdHlHcm91cCwgU2VjdXJpdHlHcm91cCB9IGZyb20gJy4vc2VjdXJpdHktZ3JvdXAnO1xuaW1wb3J0IHsgUHJpdmF0ZVN1Ym5ldCwgUHVibGljU3VibmV0LCBSb3V0ZXJUeXBlLCBWcGMgfSBmcm9tICcuL3ZwYyc7XG5cbi8qKlxuICogRGlyZWN0aW9uIG9mIHRyYWZmaWMgdG8gYWxsb3cgYWxsIGJ5IGRlZmF1bHQuXG4gKi9cbmV4cG9ydCBlbnVtIE5hdFRyYWZmaWNEaXJlY3Rpb24ge1xuICAvKipcbiAgICogQWxsb3cgYWxsIG91dGJvdW5kIHRyYWZmaWMgYW5kIGRpc2FsbG93IGFsbCBpbmJvdW5kIHRyYWZmaWMuXG4gICAqL1xuICBPVVRCT1VORF9PTkxZID0gJ09VVEJPVU5EX09OTFknLFxuXG4gIC8qKlxuICAgKiBBbGxvdyBhbGwgb3V0Ym91bmQgYW5kIGluYm91bmQgdHJhZmZpYy5cbiAgICovXG4gIElOQk9VTkRfQU5EX09VVEJPVU5EID0gJ0lOQk9VTkRfQU5EX09VVEJPVU5EJyxcblxuICAvKipcbiAgICogRGlzYWxsb3cgYWxsIG91dGJvdW5kIGFuZCBpbmJvdW5kIHRyYWZmaWMuXG4gICAqL1xuICBOT05FID0gJ05PTkUnLFxufVxuXG4vKipcbiAqIFBhaXIgcmVwcmVzZW50cyBhIGdhdGV3YXkgY3JlYXRlZCBieSBOQVQgUHJvdmlkZXJcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBHYXRld2F5Q29uZmlnIHtcblxuICAvKipcbiAgICogQXZhaWxhYmlsaXR5IFpvbmVcbiAgICovXG4gIHJlYWRvbmx5IGF6OiBzdHJpbmdcblxuICAvKipcbiAgICogSWRlbnRpdHkgb2YgZ2F0ZXdheSBzcGF3bmVkIGJ5IHRoZSBwcm92aWRlclxuICAgKi9cbiAgcmVhZG9ubHkgZ2F0ZXdheUlkOiBzdHJpbmdcbn1cblxuLyoqXG4gKiBOQVQgcHJvdmlkZXJzXG4gKlxuICogRGV0ZXJtaW5lcyB3aGF0IHR5cGUgb2YgTkFUIHByb3ZpZGVyIHRvIGNyZWF0ZSwgZWl0aGVyIE5BVCBnYXRld2F5cyBvciBOQVRcbiAqIGluc3RhbmNlLlxuICpcbiAqXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBOYXRQcm92aWRlciB7XG4gIC8qKlxuICAgKiBVc2UgTkFUIEdhdGV3YXlzIHRvIHByb3ZpZGUgTkFUIHNlcnZpY2VzIGZvciB5b3VyIFZQQ1xuICAgKlxuICAgKiBOQVQgZ2F0ZXdheXMgYXJlIG1hbmFnZWQgYnkgQVdTLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS92cGMvbGF0ZXN0L3VzZXJndWlkZS92cGMtbmF0LWdhdGV3YXkuaHRtbFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBnYXRld2F5KHByb3BzOiBOYXRHYXRld2F5UHJvcHMgPSB7fSk6IE5hdFByb3ZpZGVyIHtcbiAgICByZXR1cm4gbmV3IE5hdEdhdGV3YXlQcm92aWRlcihwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogVXNlIE5BVCBpbnN0YW5jZXMgdG8gcHJvdmlkZSBOQVQgc2VydmljZXMgZm9yIHlvdXIgVlBDXG4gICAqXG4gICAqIE5BVCBpbnN0YW5jZXMgYXJlIG1hbmFnZWQgYnkgeW91LCBidXQgaW4gcmV0dXJuIGFsbG93IG1vcmUgY29uZmlndXJhdGlvbi5cbiAgICpcbiAgICogQmUgYXdhcmUgdGhhdCBpbnN0YW5jZXMgY3JlYXRlZCB1c2luZyB0aGlzIHByb3ZpZGVyIHdpbGwgbm90IGJlXG4gICAqIGF1dG9tYXRpY2FsbHkgcmVwbGFjZWQgaWYgdGhleSBhcmUgc3RvcHBlZCBmb3IgYW55IHJlYXNvbi4gWW91IHNob3VsZCBpbXBsZW1lbnRcbiAgICogeW91ciBvd24gTmF0UHJvdmlkZXIgYmFzZWQgb24gQXV0b1NjYWxpbmcgZ3JvdXBzIGlmIHlvdSBuZWVkIHRoYXQuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3ZwYy9sYXRlc3QvdXNlcmd1aWRlL1ZQQ19OQVRfSW5zdGFuY2UuaHRtbFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBpbnN0YW5jZShwcm9wczogTmF0SW5zdGFuY2VQcm9wcyk6IE5hdEluc3RhbmNlUHJvdmlkZXIge1xuICAgIHJldHVybiBuZXcgTmF0SW5zdGFuY2VQcm92aWRlcihwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGxpc3Qgb2YgZ2F0ZXdheXMgc3Bhd25lZCBieSB0aGUgcHJvdmlkZXJcbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBjb25maWd1cmVkR2F0ZXdheXM6IEdhdGV3YXlDb25maWdbXTtcblxuICAvKipcbiAgICogQ2FsbGVkIGJ5IHRoZSBWUEMgdG8gY29uZmlndXJlIE5BVFxuICAgKlxuICAgKiBEb24ndCBjYWxsIHRoaXMgZGlyZWN0bHksIHRoZSBWUEMgd2lsbCBjYWxsIGl0IGF1dG9tYXRpY2FsbHkuXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgY29uZmlndXJlTmF0KG9wdGlvbnM6IENvbmZpZ3VyZU5hdE9wdGlvbnMpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBDb25maWd1cmVzIHN1Ym5ldCB3aXRoIHRoZSBnYXRld2F5XG4gICAqXG4gICAqIERvbid0IGNhbGwgdGhpcyBkaXJlY3RseSwgdGhlIFZQQyB3aWxsIGNhbGwgaXQgYXV0b21hdGljYWxseS5cbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCBjb25maWd1cmVTdWJuZXQoc3VibmV0OiBQcml2YXRlU3VibmV0KTogdm9pZDtcbn1cblxuLyoqXG4gKiBPcHRpb25zIHBhc3NlZCBieSB0aGUgVlBDIHdoZW4gTkFUIG5lZWRzIHRvIGJlIGNvbmZpZ3VyZWRcbiAqXG4gKlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENvbmZpZ3VyZU5hdE9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIFZQQyB3ZSdyZSBjb25maWd1cmluZyBOQVQgZm9yXG4gICAqL1xuICByZWFkb25seSB2cGM6IFZwYztcblxuICAvKipcbiAgICogVGhlIHB1YmxpYyBzdWJuZXRzIHdoZXJlIHRoZSBOQVQgcHJvdmlkZXJzIG5lZWQgdG8gYmUgcGxhY2VkXG4gICAqL1xuICByZWFkb25seSBuYXRTdWJuZXRzOiBQdWJsaWNTdWJuZXRbXTtcblxuICAvKipcbiAgICogVGhlIHByaXZhdGUgc3VibmV0cyB0aGF0IG5lZWQgdG8gcm91dGUgdGhyb3VnaCB0aGUgTkFUIHByb3ZpZGVycy5cbiAgICpcbiAgICogVGhlcmUgbWF5IGJlIG1vcmUgcHJpdmF0ZSBzdWJuZXRzIHRoYW4gcHVibGljIHN1Ym5ldHMgd2l0aCBOQVQgcHJvdmlkZXJzLlxuICAgKi9cbiAgcmVhZG9ubHkgcHJpdmF0ZVN1Ym5ldHM6IFByaXZhdGVTdWJuZXRbXTtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBhIE5BVCBnYXRld2F5XG4gKlxuICovXG5leHBvcnQgaW50ZXJmYWNlIE5hdEdhdGV3YXlQcm9wcyB7XG4gIC8qKlxuICAgKiBFSVAgYWxsb2NhdGlvbiBJRHMgZm9yIHRoZSBOQVQgZ2F0ZXdheXNcbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBmaXhlZCBFSVBzIGFsbG9jYXRlZCBmb3IgdGhlIE5BVCBnYXRld2F5c1xuICAgKi9cbiAgcmVhZG9ubHkgZWlwQWxsb2NhdGlvbklkcz86IHN0cmluZ1tdO1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGEgTkFUIGluc3RhbmNlXG4gKlxuICpcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBOYXRJbnN0YW5jZVByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBtYWNoaW5lIGltYWdlIChBTUkpIHRvIHVzZVxuICAgKlxuICAgKiBCeSBkZWZhdWx0LCB3aWxsIGRvIGFuIEFNSSBsb29rdXAgZm9yIHRoZSBsYXRlc3QgTkFUIGluc3RhbmNlIGltYWdlLlxuICAgKlxuICAgKiBJZiB5b3UgaGF2ZSBhIHNwZWNpZmljIEFNSSBJRCB5b3Ugd2FudCB0byB1c2UsIHBhc3MgYSBgR2VuZXJpY0xpbnV4SW1hZ2VgLiBGb3IgZXhhbXBsZTpcbiAgICpcbiAgICogYGBgdHNcbiAgICogZWMyLk5hdFByb3ZpZGVyLmluc3RhbmNlKHtcbiAgICogICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCd0My5taWNybycpLFxuICAgKiAgIG1hY2hpbmVJbWFnZTogbmV3IGVjMi5HZW5lcmljTGludXhJbWFnZSh7XG4gICAqICAgICAndXMtZWFzdC0yJzogJ2FtaS0wZjljNjFiNWE1NjJhMTZhZidcbiAgICogICB9KVxuICAgKiB9KVxuICAgKiBgYGBcbiAgICpcbiAgICogQGRlZmF1bHQgLSBMYXRlc3QgTkFUIGluc3RhbmNlIGltYWdlXG4gICAqL1xuICByZWFkb25seSBtYWNoaW5lSW1hZ2U/OiBJTWFjaGluZUltYWdlO1xuXG4gIC8qKlxuICAgKiBJbnN0YW5jZSB0eXBlIG9mIHRoZSBOQVQgaW5zdGFuY2VcbiAgICovXG4gIHJlYWRvbmx5IGluc3RhbmNlVHlwZTogSW5zdGFuY2VUeXBlO1xuXG4gIC8qKlxuICAgKiBOYW1lIG9mIFNTSCBrZXlwYWlyIHRvIGdyYW50IGFjY2VzcyB0byBpbnN0YW5jZVxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIFNTSCBhY2Nlc3Mgd2lsbCBiZSBwb3NzaWJsZS5cbiAgICovXG4gIHJlYWRvbmx5IGtleU5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFNlY3VyaXR5IEdyb3VwIGZvciBOQVQgaW5zdGFuY2VzXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQSBuZXcgc2VjdXJpdHkgZ3JvdXAgd2lsbCBiZSBjcmVhdGVkXG4gICAqL1xuICByZWFkb25seSBzZWN1cml0eUdyb3VwPzogSVNlY3VyaXR5R3JvdXA7XG5cbiAgLyoqXG4gICAqIEFsbG93IGFsbCBpbmJvdW5kIHRyYWZmaWMgdGhyb3VnaCB0aGUgTkFUIGluc3RhbmNlXG4gICAqXG4gICAqIElmIHlvdSBzZXQgdGhpcyB0byBmYWxzZSwgeW91IG11c3QgY29uZmlndXJlIHRoZSBOQVQgaW5zdGFuY2UncyBzZWN1cml0eVxuICAgKiBncm91cHMgaW4gYW5vdGhlciB3YXksIGVpdGhlciBieSBwYXNzaW5nIGluIGEgZnVsbHkgY29uZmlndXJlZCBTZWN1cml0eVxuICAgKiBHcm91cCB1c2luZyB0aGUgYHNlY3VyaXR5R3JvdXBgIHByb3BlcnR5LCBvciBieSBjb25maWd1cmluZyBpdCB1c2luZyB0aGVcbiAgICogYC5zZWN1cml0eUdyb3VwYCBvciBgLmNvbm5lY3Rpb25zYCBtZW1iZXJzIGFmdGVyIHBhc3NpbmcgdGhlIE5BVCBJbnN0YW5jZVxuICAgKiBQcm92aWRlciB0byBhIFZwYy5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKiBAZGVwcmVjYXRlZCAtIFVzZSBgZGVmYXVsdEFsbG93ZWRUcmFmZmljYC5cbiAgICovXG4gIHJlYWRvbmx5IGFsbG93QWxsVHJhZmZpYz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIERpcmVjdGlvbiB0byBhbGxvdyBhbGwgdHJhZmZpYyB0aHJvdWdoIHRoZSBOQVQgaW5zdGFuY2UgYnkgZGVmYXVsdC5cbiAgICpcbiAgICogQnkgZGVmYXVsdCwgaW5ib3VuZCBhbmQgb3V0Ym91bmQgdHJhZmZpYyBpcyBhbGxvd2VkLlxuICAgKlxuICAgKiBJZiB5b3Ugc2V0IHRoaXMgdG8gYW5vdGhlciB2YWx1ZSB0aGFuIElOQk9VTkRfQU5EX09VVEJPVU5ELCB5b3UgbXVzdFxuICAgKiBjb25maWd1cmUgdGhlIE5BVCBpbnN0YW5jZSdzIHNlY3VyaXR5IGdyb3VwcyBpbiBhbm90aGVyIHdheSwgZWl0aGVyIGJ5XG4gICAqIHBhc3NpbmcgaW4gYSBmdWxseSBjb25maWd1cmVkIFNlY3VyaXR5IEdyb3VwIHVzaW5nIHRoZSBgc2VjdXJpdHlHcm91cGBcbiAgICogcHJvcGVydHksIG9yIGJ5IGNvbmZpZ3VyaW5nIGl0IHVzaW5nIHRoZSBgLnNlY3VyaXR5R3JvdXBgIG9yXG4gICAqIGAuY29ubmVjdGlvbnNgIG1lbWJlcnMgYWZ0ZXIgcGFzc2luZyB0aGUgTkFUIEluc3RhbmNlIFByb3ZpZGVyIHRvIGEgVnBjLlxuICAgKlxuICAgKiBAZGVmYXVsdCBOYXRUcmFmZmljRGlyZWN0aW9uLklOQk9VTkRfQU5EX09VVEJPVU5EXG4gICAqL1xuICByZWFkb25seSBkZWZhdWx0QWxsb3dlZFRyYWZmaWM/OiBOYXRUcmFmZmljRGlyZWN0aW9uO1xufVxuXG4vKipcbiAqIFByb3ZpZGVyIGZvciBOQVQgR2F0ZXdheXNcbiAqL1xuY2xhc3MgTmF0R2F0ZXdheVByb3ZpZGVyIGV4dGVuZHMgTmF0UHJvdmlkZXIge1xuICBwcml2YXRlIGdhdGV3YXlzOiBQcmVmU2V0PHN0cmluZz4gPSBuZXcgUHJlZlNldDxzdHJpbmc+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBwcm9wczogTmF0R2F0ZXdheVByb3BzID0ge30pIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgcHVibGljIGNvbmZpZ3VyZU5hdChvcHRpb25zOiBDb25maWd1cmVOYXRPcHRpb25zKSB7XG4gICAgaWYgKFxuICAgICAgdGhpcy5wcm9wcy5laXBBbGxvY2F0aW9uSWRzICE9IG51bGxcbiAgICAgICYmICFUb2tlbi5pc1VucmVzb2x2ZWQodGhpcy5wcm9wcy5laXBBbGxvY2F0aW9uSWRzKVxuICAgICAgJiYgdGhpcy5wcm9wcy5laXBBbGxvY2F0aW9uSWRzLmxlbmd0aCA8IG9wdGlvbnMubmF0U3VibmV0cy5sZW5ndGhcbiAgICApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTm90IGVub3VnaCBOQVQgZ2F0ZXdheSBFSVAgYWxsb2NhdGlvbiBJRHMgKCR7dGhpcy5wcm9wcy5laXBBbGxvY2F0aW9uSWRzLmxlbmd0aH0gcHJvdmlkZWQpIGZvciB0aGUgcmVxdWVzdGVkIHN1Ym5ldCBjb3VudCAoJHtvcHRpb25zLm5hdFN1Ym5ldHMubGVuZ3RofSBuZWVkZWQpLmApO1xuICAgIH1cblxuICAgIC8vIENyZWF0ZSB0aGUgTkFUIGdhdGV3YXlzXG4gICAgbGV0IGkgPSAwO1xuICAgIGZvciAoY29uc3Qgc3ViIG9mIG9wdGlvbnMubmF0U3VibmV0cykge1xuICAgICAgY29uc3QgZWlwQWxsb2NhdGlvbklkID0gdGhpcy5wcm9wcy5laXBBbGxvY2F0aW9uSWRzID8gcGlja04oaSwgdGhpcy5wcm9wcy5laXBBbGxvY2F0aW9uSWRzKSA6IHVuZGVmaW5lZDtcbiAgICAgIGNvbnN0IGdhdGV3YXkgPSBzdWIuYWRkTmF0R2F0ZXdheShlaXBBbGxvY2F0aW9uSWQpO1xuICAgICAgdGhpcy5nYXRld2F5cy5hZGQoc3ViLmF2YWlsYWJpbGl0eVpvbmUsIGdhdGV3YXkucmVmKTtcbiAgICAgIGkrKztcbiAgICB9XG5cbiAgICAvLyBBZGQgcm91dGVzIHRvIHRoZW0gaW4gdGhlIHByaXZhdGUgc3VibmV0c1xuICAgIGZvciAoY29uc3Qgc3ViIG9mIG9wdGlvbnMucHJpdmF0ZVN1Ym5ldHMpIHtcbiAgICAgIHRoaXMuY29uZmlndXJlU3VibmV0KHN1Yik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGNvbmZpZ3VyZVN1Ym5ldChzdWJuZXQ6IFByaXZhdGVTdWJuZXQpIHtcbiAgICBjb25zdCBheiA9IHN1Ym5ldC5hdmFpbGFiaWxpdHlab25lO1xuICAgIGNvbnN0IGdhdGV3YXlJZCA9IHRoaXMuZ2F0ZXdheXMucGljayhheik7XG4gICAgc3VibmV0LmFkZFJvdXRlKCdEZWZhdWx0Um91dGUnLCB7XG4gICAgICByb3V0ZXJUeXBlOiBSb3V0ZXJUeXBlLk5BVF9HQVRFV0FZLFxuICAgICAgcm91dGVySWQ6IGdhdGV3YXlJZCxcbiAgICAgIGVuYWJsZXNJbnRlcm5ldENvbm5lY3Rpdml0eTogdHJ1ZSxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgY29uZmlndXJlZEdhdGV3YXlzKCk6IEdhdGV3YXlDb25maWdbXSB7XG4gICAgcmV0dXJuIHRoaXMuZ2F0ZXdheXMudmFsdWVzKCkubWFwKHggPT4gKHsgYXo6IHhbMF0sIGdhdGV3YXlJZDogeFsxXSB9KSk7XG4gIH1cbn1cblxuLyoqXG4gKiBOQVQgcHJvdmlkZXIgd2hpY2ggdXNlcyBOQVQgSW5zdGFuY2VzXG4gKi9cbmV4cG9ydCBjbGFzcyBOYXRJbnN0YW5jZVByb3ZpZGVyIGV4dGVuZHMgTmF0UHJvdmlkZXIgaW1wbGVtZW50cyBJQ29ubmVjdGFibGUge1xuICBwcml2YXRlIGdhdGV3YXlzOiBQcmVmU2V0PEluc3RhbmNlPiA9IG5ldyBQcmVmU2V0PEluc3RhbmNlPigpO1xuICBwcml2YXRlIF9zZWN1cml0eUdyb3VwPzogSVNlY3VyaXR5R3JvdXA7XG4gIHByaXZhdGUgX2Nvbm5lY3Rpb25zPzogQ29ubmVjdGlvbnM7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBwcm9wczogTmF0SW5zdGFuY2VQcm9wcykge1xuICAgIHN1cGVyKCk7XG5cbiAgICBpZiAocHJvcHMuZGVmYXVsdEFsbG93ZWRUcmFmZmljICE9PSB1bmRlZmluZWQgJiYgcHJvcHMuYWxsb3dBbGxUcmFmZmljICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2FuIG5vdCBzcGVjaWZ5IGJvdGggb2YgXFwnZGVmYXVsdEFsbG93ZWRUcmFmZmljXFwnIGFuZCBcXCdkZWZhdWx0QWxsb3dlZFRyYWZmaWNcXCc7IHByZWZlciBcXCdkZWZhdWx0QWxsb3dlZFRyYWZmaWNcXCcnKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgY29uZmlndXJlTmF0KG9wdGlvbnM6IENvbmZpZ3VyZU5hdE9wdGlvbnMpIHtcbiAgICBjb25zdCBkZWZhdWx0RGlyZWN0aW9uID0gdGhpcy5wcm9wcy5kZWZhdWx0QWxsb3dlZFRyYWZmaWMgPz9cbiAgICAgICh0aGlzLnByb3BzLmFsbG93QWxsVHJhZmZpYyA/PyB0cnVlID8gTmF0VHJhZmZpY0RpcmVjdGlvbi5JTkJPVU5EX0FORF9PVVRCT1VORCA6IE5hdFRyYWZmaWNEaXJlY3Rpb24uT1VUQk9VTkRfT05MWSk7XG5cbiAgICAvLyBDcmVhdGUgdGhlIE5BVCBpbnN0YW5jZXMuIFRoZXkgY2FuIHNoYXJlIGEgc2VjdXJpdHkgZ3JvdXAgYW5kIGEgUm9sZS5cbiAgICBjb25zdCBtYWNoaW5lSW1hZ2UgPSB0aGlzLnByb3BzLm1hY2hpbmVJbWFnZSB8fCBuZXcgTmF0SW5zdGFuY2VJbWFnZSgpO1xuICAgIHRoaXMuX3NlY3VyaXR5R3JvdXAgPSB0aGlzLnByb3BzLnNlY3VyaXR5R3JvdXAgPz8gbmV3IFNlY3VyaXR5R3JvdXAob3B0aW9ucy52cGMsICdOYXRTZWN1cml0eUdyb3VwJywge1xuICAgICAgdnBjOiBvcHRpb25zLnZwYyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnU2VjdXJpdHkgR3JvdXAgZm9yIE5BVCBpbnN0YW5jZXMnLFxuICAgICAgYWxsb3dBbGxPdXRib3VuZDogaXNPdXRib3VuZEFsbG93ZWQoZGVmYXVsdERpcmVjdGlvbiksXG4gICAgfSk7XG4gICAgdGhpcy5fY29ubmVjdGlvbnMgPSBuZXcgQ29ubmVjdGlvbnMoeyBzZWN1cml0eUdyb3VwczogW3RoaXMuX3NlY3VyaXR5R3JvdXBdIH0pO1xuXG4gICAgaWYgKGlzSW5ib3VuZEFsbG93ZWQoZGVmYXVsdERpcmVjdGlvbikpIHtcbiAgICAgIHRoaXMuY29ubmVjdGlvbnMuYWxsb3dGcm9tQW55SXB2NChQb3J0LmFsbFRyYWZmaWMoKSk7XG4gICAgfVxuXG4gICAgLy8gRklYTUU6IElkZWFsbHksIE5BVCBpbnN0YW5jZXMgZG9uJ3QgaGF2ZSBhIHJvbGUgYXQgYWxsLCBidXRcbiAgICAvLyAnSW5zdGFuY2UnIGRvZXMgbm90IGFsbG93IHRoYXQgcmlnaHQgbm93LlxuICAgIGNvbnN0IHJvbGUgPSBuZXcgaWFtLlJvbGUob3B0aW9ucy52cGMsICdOYXRSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2VjMi5hbWF6b25hd3MuY29tJyksXG4gICAgfSk7XG5cbiAgICBmb3IgKGNvbnN0IHN1YiBvZiBvcHRpb25zLm5hdFN1Ym5ldHMpIHtcbiAgICAgIGNvbnN0IG5hdEluc3RhbmNlID0gbmV3IEluc3RhbmNlKHN1YiwgJ05hdEluc3RhbmNlJywge1xuICAgICAgICBpbnN0YW5jZVR5cGU6IHRoaXMucHJvcHMuaW5zdGFuY2VUeXBlLFxuICAgICAgICBtYWNoaW5lSW1hZ2UsXG4gICAgICAgIHNvdXJjZURlc3RDaGVjazogZmFsc2UsIC8vIFJlcXVpcmVkIGZvciBOQVRcbiAgICAgICAgdnBjOiBvcHRpb25zLnZwYyxcbiAgICAgICAgdnBjU3VibmV0czogeyBzdWJuZXRzOiBbc3ViXSB9LFxuICAgICAgICBzZWN1cml0eUdyb3VwOiB0aGlzLl9zZWN1cml0eUdyb3VwLFxuICAgICAgICByb2xlLFxuICAgICAgICBrZXlOYW1lOiB0aGlzLnByb3BzLmtleU5hbWUsXG4gICAgICB9KTtcbiAgICAgIC8vIE5BVCBpbnN0YW5jZSByb3V0ZXMgYWxsIHRyYWZmaWMsIGJvdGggd2F5c1xuICAgICAgdGhpcy5nYXRld2F5cy5hZGQoc3ViLmF2YWlsYWJpbGl0eVpvbmUsIG5hdEluc3RhbmNlKTtcbiAgICB9XG5cbiAgICAvLyBBZGQgcm91dGVzIHRvIHRoZW0gaW4gdGhlIHByaXZhdGUgc3VibmV0c1xuICAgIGZvciAoY29uc3Qgc3ViIG9mIG9wdGlvbnMucHJpdmF0ZVN1Ym5ldHMpIHtcbiAgICAgIHRoaXMuY29uZmlndXJlU3VibmV0KHN1Yik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBTZWN1cml0eSBHcm91cCBhc3NvY2lhdGVkIHdpdGggdGhlIE5BVCBpbnN0YW5jZXNcbiAgICovXG4gIHB1YmxpYyBnZXQgc2VjdXJpdHlHcm91cCgpOiBJU2VjdXJpdHlHcm91cCB7XG4gICAgaWYgKCF0aGlzLl9zZWN1cml0eUdyb3VwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Bhc3MgdGhlIE5hdEluc3RhbmNlUHJvdmlkZXIgdG8gYSBWcGMgYmVmb3JlIGFjY2Vzc2luZyBcXCdzZWN1cml0eUdyb3VwXFwnJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9zZWN1cml0eUdyb3VwO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hbmFnZSB0aGUgU2VjdXJpdHkgR3JvdXBzIGFzc29jaWF0ZWQgd2l0aCB0aGUgTkFUIGluc3RhbmNlc1xuICAgKi9cbiAgcHVibGljIGdldCBjb25uZWN0aW9ucygpOiBDb25uZWN0aW9ucyB7XG4gICAgaWYgKCF0aGlzLl9jb25uZWN0aW9ucykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdQYXNzIHRoZSBOYXRJbnN0YW5jZVByb3ZpZGVyIHRvIGEgVnBjIGJlZm9yZSBhY2Nlc3NpbmcgXFwnY29ubmVjdGlvbnNcXCcnKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb25zO1xuICB9XG5cbiAgcHVibGljIGdldCBjb25maWd1cmVkR2F0ZXdheXMoKTogR2F0ZXdheUNvbmZpZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5nYXRld2F5cy52YWx1ZXMoKS5tYXAoeCA9PiAoeyBhejogeFswXSwgZ2F0ZXdheUlkOiB4WzFdLmluc3RhbmNlSWQgfSkpO1xuICB9XG5cbiAgcHVibGljIGNvbmZpZ3VyZVN1Ym5ldChzdWJuZXQ6IFByaXZhdGVTdWJuZXQpIHtcbiAgICBjb25zdCBheiA9IHN1Ym5ldC5hdmFpbGFiaWxpdHlab25lO1xuICAgIGNvbnN0IGdhdGV3YXlJZCA9IHRoaXMuZ2F0ZXdheXMucGljayhheikuaW5zdGFuY2VJZDtcbiAgICBzdWJuZXQuYWRkUm91dGUoJ0RlZmF1bHRSb3V0ZScsIHtcbiAgICAgIHJvdXRlclR5cGU6IFJvdXRlclR5cGUuSU5TVEFOQ0UsXG4gICAgICByb3V0ZXJJZDogZ2F0ZXdheUlkLFxuICAgICAgZW5hYmxlc0ludGVybmV0Q29ubmVjdGl2aXR5OiB0cnVlLFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogUHJlZmVyZW50aWFsIHNldFxuICpcbiAqIFBpY2tzIHRoZSB2YWx1ZSB3aXRoIHRoZSBnaXZlbiBrZXkgaWYgYXZhaWxhYmxlLCBvdGhlcndpc2UgZGlzdHJpYnV0ZXNcbiAqIGV2ZW5seSBhbW9uZyB0aGUgYXZhaWxhYmxlIG9wdGlvbnMuXG4gKi9cbmNsYXNzIFByZWZTZXQ8QT4ge1xuICBwcml2YXRlIHJlYWRvbmx5IG1hcDogUmVjb3JkPHN0cmluZywgQT4gPSB7fTtcbiAgcHJpdmF0ZSByZWFkb25seSB2YWxzID0gbmV3IEFycmF5PFtzdHJpbmcsIEFdPigpO1xuICBwcml2YXRlIG5leHQ6IG51bWJlciA9IDA7XG5cbiAgcHVibGljIGFkZChwcmVmOiBzdHJpbmcsIHZhbHVlOiBBKSB7XG4gICAgdGhpcy5tYXBbcHJlZl0gPSB2YWx1ZTtcbiAgICB0aGlzLnZhbHMucHVzaChbcHJlZiwgdmFsdWVdKTtcbiAgfVxuXG4gIHB1YmxpYyBwaWNrKHByZWY6IHN0cmluZyk6IEEge1xuICAgIGlmICh0aGlzLnZhbHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBwaWNrLCBzZXQgaXMgZW1wdHknKTtcbiAgICB9XG5cbiAgICBpZiAocHJlZiBpbiB0aGlzLm1hcCkgeyByZXR1cm4gdGhpcy5tYXBbcHJlZl07IH1cbiAgICByZXR1cm4gdGhpcy52YWxzW3RoaXMubmV4dCsrICUgdGhpcy52YWxzLmxlbmd0aF1bMV07XG4gIH1cblxuICBwdWJsaWMgdmFsdWVzKCk6IEFycmF5PFtzdHJpbmcsIEFdPiB7XG4gICAgcmV0dXJuIHRoaXMudmFscztcbiAgfVxufVxuXG4vKipcbiAqIE1hY2hpbmUgaW1hZ2UgcmVwcmVzZW50aW5nIHRoZSBsYXRlc3QgTkFUIGluc3RhbmNlIGltYWdlXG4gKlxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIE5hdEluc3RhbmNlSW1hZ2UgZXh0ZW5kcyBMb29rdXBNYWNoaW5lSW1hZ2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7XG4gICAgICBuYW1lOiAnYW16bi1hbWktdnBjLW5hdC0qJyxcbiAgICAgIG93bmVyczogWydhbWF6b24nXSxcbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc091dGJvdW5kQWxsb3dlZChkaXJlY3Rpb246IE5hdFRyYWZmaWNEaXJlY3Rpb24pIHtcbiAgcmV0dXJuIGRpcmVjdGlvbiA9PT0gTmF0VHJhZmZpY0RpcmVjdGlvbi5JTkJPVU5EX0FORF9PVVRCT1VORCB8fFxuICAgIGRpcmVjdGlvbiA9PT0gTmF0VHJhZmZpY0RpcmVjdGlvbi5PVVRCT1VORF9PTkxZO1xufVxuXG5mdW5jdGlvbiBpc0luYm91bmRBbGxvd2VkKGRpcmVjdGlvbjogTmF0VHJhZmZpY0RpcmVjdGlvbikge1xuICByZXR1cm4gZGlyZWN0aW9uID09PSBOYXRUcmFmZmljRGlyZWN0aW9uLklOQk9VTkRfQU5EX09VVEJPVU5EO1xufVxuXG4vKipcbiAqIFRva2VuLWF3YXJlIHBpY2sgaW5kZXggZnVuY3Rpb25cbiAqL1xuZnVuY3Rpb24gcGlja04oaTogbnVtYmVyLCB4czogc3RyaW5nW10pIHtcbiAgaWYgKFRva2VuLmlzVW5yZXNvbHZlZCh4cykpIHsgcmV0dXJuIEZuLnNlbGVjdChpLCB4cyk7IH1cblxuICBpZiAoaSA+PSB4cy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBnZXQgZWxlbWVudCAke2l9IGZyb20gJHt4c31gKTtcbiAgfVxuXG4gIHJldHVybiB4c1tpXTtcbn1cbiJdfQ==