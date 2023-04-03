"use strict";
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateSubnet = exports.PublicSubnet = exports.RouterType = exports.Subnet = exports.Vpc = exports.DefaultInstanceTenancy = exports.SubnetType = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cxschema = require("@aws-cdk/cloud-assembly-schema");
const core_1 = require("@aws-cdk/core");
const cxapi = require("@aws-cdk/cx-api");
const constructs_1 = require("constructs");
const client_vpn_endpoint_1 = require("./client-vpn-endpoint");
const ec2_generated_1 = require("./ec2.generated");
const ip_addresses_1 = require("./ip-addresses");
const nat_1 = require("./nat");
const network_acl_1 = require("./network-acl");
const subnet_1 = require("./subnet");
const util_1 = require("./util");
const vpc_endpoint_1 = require("./vpc-endpoint");
const vpc_flow_logs_1 = require("./vpc-flow-logs");
const vpn_1 = require("./vpn");
const VPC_SUBNET_SYMBOL = Symbol.for('@aws-cdk/aws-ec2.VpcSubnet');
const FAKE_AZ_NAME = 'fake-az';
/**
 * The type of Subnet
 */
var SubnetType;
(function (SubnetType) {
    /**
     * Isolated Subnets do not route traffic to the Internet (in this VPC),
     * and as such, do not require NAT gateways.
     *
     * Isolated subnets can only connect to or be connected to from other
     * instances in the same VPC. A default VPC configuration will not include
     * isolated subnets.
     *
     * This can be good for subnets with RDS or Elasticache instances,
     * or which route Internet traffic through a peer VPC.
     */
    SubnetType["PRIVATE_ISOLATED"] = "Isolated";
    /**
     * Isolated Subnets do not route traffic to the Internet (in this VPC),
     * and as such, do not require NAT gateways.
     *
     * Isolated subnets can only connect to or be connected to from other
     * instances in the same VPC. A default VPC configuration will not include
     * isolated subnets.
     *
     * This can be good for subnets with RDS or Elasticache instances,
     * or which route Internet traffic through a peer VPC.
     *
     * @deprecated use `SubnetType.PRIVATE_ISOLATED`
     */
    SubnetType["ISOLATED"] = "Deprecated_Isolated";
    /**
     * Subnet that routes to the internet, but not vice versa.
     *
     * Instances in a private subnet can connect to the Internet, but will not
     * allow connections to be initiated from the Internet. Egress to the internet will
     * need to be provided.
     * NAT Gateway(s) are the default solution to providing this subnet type the ability to route Internet traffic.
     * If a NAT Gateway is not required or desired, set `natGateways:0` or use
     * `SubnetType.PRIVATE_ISOLATED` instead.
     *
     * By default, a NAT gateway is created in every public subnet for maximum availability.
     * Be aware that you will be charged for NAT gateways.
     *
     * Normally a Private subnet will use a NAT gateway in the same AZ, but
     * if `natGateways` is used to reduce the number of NAT gateways, a NAT
     * gateway from another AZ will be used instead.
     */
    SubnetType["PRIVATE_WITH_EGRESS"] = "Private";
    /**
     * Subnet that routes to the internet (via a NAT gateway), but not vice versa.
     *
     * Instances in a private subnet can connect to the Internet, but will not
     * allow connections to be initiated from the Internet. NAT Gateway(s) are
     * required with this subnet type to route the Internet traffic through.
     * If a NAT Gateway is not required or desired, use `SubnetType.PRIVATE_ISOLATED` instead.
     *
     * By default, a NAT gateway is created in every public subnet for maximum availability.
     * Be aware that you will be charged for NAT gateways.
     *
     * Normally a Private subnet will use a NAT gateway in the same AZ, but
     * if `natGateways` is used to reduce the number of NAT gateways, a NAT
     * gateway from another AZ will be used instead.
     * @deprecated use `PRIVATE_WITH_EGRESS`
     */
    SubnetType["PRIVATE_WITH_NAT"] = "Deprecated_Private_NAT";
    /**
     * Subnet that routes to the internet, but not vice versa.
     *
     * Instances in a private subnet can connect to the Internet, but will not
     * allow connections to be initiated from the Internet. NAT Gateway(s) are
     * required with this subnet type to route the Internet traffic through.
     * If a NAT Gateway is not required or desired, use `SubnetType.PRIVATE_ISOLATED` instead.
     *
     * By default, a NAT gateway is created in every public subnet for maximum availability.
     * Be aware that you will be charged for NAT gateways.
     *
     * Normally a Private subnet will use a NAT gateway in the same AZ, but
     * if `natGateways` is used to reduce the number of NAT gateways, a NAT
     * gateway from another AZ will be used instead.
     *
     * @deprecated use `PRIVATE_WITH_EGRESS`
     */
    SubnetType["PRIVATE"] = "Deprecated_Private";
    /**
     * Subnet connected to the Internet
     *
     * Instances in a Public subnet can connect to the Internet and can be
     * connected to from the Internet as long as they are launched with public
     * IPs (controlled on the AutoScalingGroup or other constructs that launch
     * instances).
     *
     * Public subnets route outbound traffic via an Internet Gateway.
     */
    SubnetType["PUBLIC"] = "Public";
})(SubnetType = exports.SubnetType || (exports.SubnetType = {}));
/**
 * A new or imported VPC
 */
class VpcBase extends core_1.Resource {
    constructor() {
        super(...arguments);
        /**
         * Dependencies for NAT connectivity
         *
         * @deprecated - This value is no longer used.
         */
        this.natDependencies = new Array();
        /**
         * If this is set to true, don't error out on trying to select subnets
         */
        this.incompleteSubnetDefinition = false;
    }
    /**
     * Returns IDs of selected subnets
     */
    selectSubnets(selection = {}) {
        const subnets = this.selectSubnetObjects(selection);
        const pubs = new Set(this.publicSubnets);
        return {
            subnetIds: subnets.map(s => s.subnetId),
            get availabilityZones() { return subnets.map(s => s.availabilityZone); },
            internetConnectivityEstablished: tap(new CompositeDependable(), d => subnets.forEach(s => d.add(s.internetConnectivityEstablished))),
            subnets,
            hasPublic: subnets.some(s => pubs.has(s)),
            isPendingLookup: this.incompleteSubnetDefinition,
        };
    }
    /**
     * Adds a VPN Gateway to this VPC
     */
    enableVpnGateway(options) {
        if (this.vpnGatewayId) {
            throw new Error('The VPN Gateway has already been enabled.');
        }
        const vpnGateway = new vpn_1.VpnGateway(this, 'VpnGateway', {
            amazonSideAsn: options.amazonSideAsn,
            type: vpn_1.VpnConnectionType.IPSEC_1,
        });
        this._vpnGatewayId = vpnGateway.gatewayId;
        const attachment = new ec2_generated_1.CfnVPCGatewayAttachment(this, 'VPCVPNGW', {
            vpcId: this.vpcId,
            vpnGatewayId: this._vpnGatewayId,
        });
        // Propagate routes on route tables associated with the right subnets
        const vpnRoutePropagation = options.vpnRoutePropagation ?? [{}];
        const routeTableIds = (0, util_1.allRouteTableIds)((0, util_1.flatten)(vpnRoutePropagation.map(s => this.selectSubnets(s).subnets)));
        if (routeTableIds.length === 0) {
            core_1.Annotations.of(this).addError(`enableVpnGateway: no subnets matching selection: '${JSON.stringify(vpnRoutePropagation)}'. Select other subnets to add routes to.`);
        }
        const routePropagation = new ec2_generated_1.CfnVPNGatewayRoutePropagation(this, 'RoutePropagation', {
            routeTableIds,
            vpnGatewayId: this._vpnGatewayId,
        });
        // The AWS::EC2::VPNGatewayRoutePropagation resource cannot use the VPN gateway
        // until it has successfully attached to the VPC.
        // See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpn-gatewayrouteprop.html
        routePropagation.node.addDependency(attachment);
    }
    /**
     * Adds a new VPN connection to this VPC
     */
    addVpnConnection(id, options) {
        return new vpn_1.VpnConnection(this, id, {
            vpc: this,
            ...options,
        });
    }
    /**
     * Adds a new client VPN endpoint to this VPC
     */
    addClientVpnEndpoint(id, options) {
        return new client_vpn_endpoint_1.ClientVpnEndpoint(this, id, {
            ...options,
            vpc: this,
        });
    }
    /**
     * Adds a new interface endpoint to this VPC
     */
    addInterfaceEndpoint(id, options) {
        return new vpc_endpoint_1.InterfaceVpcEndpoint(this, id, {
            vpc: this,
            ...options,
        });
    }
    /**
     * Adds a new gateway endpoint to this VPC
     */
    addGatewayEndpoint(id, options) {
        return new vpc_endpoint_1.GatewayVpcEndpoint(this, id, {
            vpc: this,
            ...options,
        });
    }
    /**
     * Adds a new flow log to this VPC
     */
    addFlowLog(id, options) {
        return new vpc_flow_logs_1.FlowLog(this, id, {
            resourceType: vpc_flow_logs_1.FlowLogResourceType.fromVpc(this),
            ...options,
        });
    }
    /**
     * Returns the id of the VPN Gateway (if enabled)
     */
    get vpnGatewayId() {
        return this._vpnGatewayId;
    }
    /**
     * Return the subnets appropriate for the placement strategy
     */
    selectSubnetObjects(selection = {}) {
        selection = this.reifySelectionDefaults(selection);
        if (selection.subnets !== undefined) {
            return selection.subnets;
        }
        let subnets;
        if (selection.subnetGroupName !== undefined) { // Select by name
            subnets = this.selectSubnetObjectsByName(selection.subnetGroupName);
        }
        else { // Or specify by type
            const type = selection.subnetType || SubnetType.PRIVATE_WITH_EGRESS;
            subnets = this.selectSubnetObjectsByType(type);
        }
        // Apply all the filters
        subnets = this.applySubnetFilters(subnets, selection.subnetFilters ?? []);
        return subnets;
    }
    applySubnetFilters(subnets, filters) {
        let filtered = subnets;
        // Apply each filter in sequence
        for (const filter of filters) {
            filtered = filter.selectSubnets(filtered);
        }
        return filtered;
    }
    selectSubnetObjectsByName(groupName) {
        const allSubnets = [...this.publicSubnets, ...this.privateSubnets, ...this.isolatedSubnets];
        const subnets = allSubnets.filter(s => (0, util_1.subnetGroupNameFromConstructId)(s) === groupName);
        if (subnets.length === 0 && !this.incompleteSubnetDefinition) {
            const names = Array.from(new Set(allSubnets.map(util_1.subnetGroupNameFromConstructId)));
            throw new Error(`There are no subnet groups with name '${groupName}' in this VPC. Available names: ${names}`);
        }
        return subnets;
    }
    selectSubnetObjectsByType(subnetType) {
        const allSubnets = {
            [SubnetType.PRIVATE_ISOLATED]: this.isolatedSubnets,
            [SubnetType.ISOLATED]: this.isolatedSubnets,
            [SubnetType.PRIVATE_WITH_NAT]: this.privateSubnets,
            [SubnetType.PRIVATE_WITH_EGRESS]: this.privateSubnets,
            [SubnetType.PRIVATE]: this.privateSubnets,
            [SubnetType.PUBLIC]: this.publicSubnets,
        };
        const subnets = allSubnets[subnetType];
        // Force merge conflict here with https://github.com/aws/aws-cdk/pull/4089
        // see ImportedVpc
        if (subnets.length === 0 && !this.incompleteSubnetDefinition) {
            const availableTypes = Object.entries(allSubnets).filter(([_, subs]) => subs.length > 0).map(([typeName, _]) => typeName);
            throw new Error(`There are no '${subnetType}' subnet groups in this VPC. Available types: ${availableTypes}`);
        }
        return subnets;
    }
    /**
     * Validate the fields in a SubnetSelection object, and reify defaults if necessary
     *
     * In case of default selection, select the first type of PRIVATE, ISOLATED,
     * PUBLIC (in that order) that has any subnets.
     */
    reifySelectionDefaults(placement) {
        if (placement.subnetName !== undefined) {
            if (placement.subnetGroupName !== undefined) {
                throw new Error('Please use only \'subnetGroupName\' (\'subnetName\' is deprecated and has the same behavior)');
            }
            else {
                core_1.Annotations.of(this).addWarning('Usage of \'subnetName\' in SubnetSelection is deprecated, use \'subnetGroupName\' instead');
            }
            placement = { ...placement, subnetGroupName: placement.subnetName };
        }
        const exclusiveSelections = ['subnets', 'subnetType', 'subnetGroupName'];
        const providedSelections = exclusiveSelections.filter(key => placement[key] !== undefined);
        if (providedSelections.length > 1) {
            throw new Error(`Only one of '${providedSelections}' can be supplied to subnet selection.`);
        }
        if (placement.subnetType === undefined && placement.subnetGroupName === undefined && placement.subnets === undefined) {
            // Return default subnet type based on subnets that actually exist
            let subnetType = this.privateSubnets.length
                ? SubnetType.PRIVATE_WITH_EGRESS : this.isolatedSubnets.length ? SubnetType.PRIVATE_ISOLATED : SubnetType.PUBLIC;
            placement = { ...placement, subnetType: subnetType };
        }
        // Establish which subnet filters are going to be used
        let subnetFilters = placement.subnetFilters ?? [];
        // Backwards compatibility with existing `availabilityZones` and `onePerAz` functionality
        if (placement.availabilityZones !== undefined) { // Filter by AZs, if specified
            subnetFilters.push(subnet_1.SubnetFilter.availabilityZones(placement.availabilityZones));
        }
        if (!!placement.onePerAz) { // Ensure one per AZ if specified
            subnetFilters.push(subnet_1.SubnetFilter.onePerAz());
        }
        // Overwrite the provided placement filters and remove the availabilityZones and onePerAz properties
        placement = { ...placement, subnetFilters: subnetFilters, availabilityZones: undefined, onePerAz: undefined };
        const { availabilityZones, onePerAz, ...rest } = placement;
        return rest;
    }
}
/**
 * Name tag constant
 */
const NAME_TAG = 'Name';
/**
 * The default tenancy of instances launched into the VPC.
 */
var DefaultInstanceTenancy;
(function (DefaultInstanceTenancy) {
    /**
     * Instances can be launched with any tenancy.
     */
    DefaultInstanceTenancy["DEFAULT"] = "default";
    /**
     * Any instance launched into the VPC automatically has dedicated tenancy, unless you launch it with the default tenancy.
     */
    DefaultInstanceTenancy["DEDICATED"] = "dedicated";
})(DefaultInstanceTenancy = exports.DefaultInstanceTenancy || (exports.DefaultInstanceTenancy = {}));
/**
 * Define an AWS Virtual Private Cloud
 *
 * See the package-level documentation of this package for an overview
 * of the various dimensions in which you can configure your VPC.
 *
 * For example:
 *
 * ```ts
 * const vpc = new ec2.Vpc(this, 'TheVPC', {
 *   ipAddresses: IpAddresses.cidr('10.0.0.0/16'),
 * })
 *
 * // Iterate the private subnets
 * const selection = vpc.selectSubnets({
 *   subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS
 * });
 *
 * for (const subnet of selection.subnets) {
 *   // ...
 * }
 * ```
 *
 * @resource AWS::EC2::VPC
 */
class Vpc extends VpcBase {
    /**
     * Import a VPC by supplying all attributes directly
     *
     * NOTE: using `fromVpcAttributes()` with deploy-time parameters (like a `Fn.importValue()` or
     * `CfnParameter` to represent a list of subnet IDs) sometimes accidentally works. It happens
     * to work for constructs that need a list of subnets (like `AutoScalingGroup` and `eks.Cluster`)
     * but it does not work for constructs that need individual subnets (like
     * `Instance`). See https://github.com/aws/aws-cdk/issues/4118 for more
     * information.
     *
     * Prefer to use `Vpc.fromLookup()` instead.
     */
    static fromVpcAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_VpcAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromVpcAttributes);
            }
            throw error;
        }
        return new ImportedVpc(scope, id, attrs, false);
    }
    /**
     * Import an existing VPC by querying the AWS environment this stack is deployed to.
     *
     * This function only needs to be used to use VPCs not defined in your CDK
     * application. If you are looking to share a VPC between stacks, you can
     * pass the `Vpc` object between stacks and use it as normal.
     *
     * Calling this method will lead to a lookup when the CDK CLI is executed.
     * You can therefore not use any values that will only be available at
     * CloudFormation execution time (i.e., Tokens).
     *
     * The VPC information will be cached in `cdk.context.json` and the same VPC
     * will be used on future runs. To refresh the lookup, you will have to
     * evict the value from the cache using the `cdk context` command. See
     * https://docs.aws.amazon.com/cdk/latest/guide/context.html for more information.
     */
    static fromLookup(scope, id, options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_VpcLookupOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromLookup);
            }
            throw error;
        }
        if (core_1.Token.isUnresolved(options.vpcId)
            || core_1.Token.isUnresolved(options.vpcName)
            || Object.values(options.tags || {}).some(core_1.Token.isUnresolved)
            || Object.keys(options.tags || {}).some(core_1.Token.isUnresolved)) {
            throw new Error('All arguments to Vpc.fromLookup() must be concrete (no Tokens)');
        }
        const filter = makeTagFilter(options.tags);
        // We give special treatment to some tags
        if (options.vpcId) {
            filter['vpc-id'] = options.vpcId;
        }
        if (options.vpcName) {
            filter['tag:Name'] = options.vpcName;
        }
        if (options.isDefault !== undefined) {
            filter.isDefault = options.isDefault ? 'true' : 'false';
        }
        const overrides = {};
        if (options.region) {
            overrides.region = options.region;
        }
        const attributes = core_1.ContextProvider.getValue(scope, {
            provider: cxschema.ContextProvider.VPC_PROVIDER,
            props: {
                ...overrides,
                filter,
                returnAsymmetricSubnets: true,
                returnVpnGateways: options.returnVpnGateways,
                subnetGroupNameTag: options.subnetGroupNameTag,
            },
            dummyValue: undefined,
        }).value;
        return new LookedUpVpc(scope, id, attributes ?? DUMMY_VPC_PROPS, attributes === undefined);
        /**
         * Prefixes all keys in the argument with `tag:`.`
         */
        function makeTagFilter(tags) {
            const result = {};
            for (const [name, value] of Object.entries(tags || {})) {
                result[`tag:${name}`] = value;
            }
            return result;
        }
    }
    /**
     * Vpc creates a VPC that spans a whole region.
     * It will automatically divide the provided VPC CIDR range, and create public and private subnets per Availability Zone.
     * Network routing for the public subnets will be configured to allow outbound access directly via an Internet Gateway.
     * Network routing for the private subnets will be configured to allow outbound access via a set of resilient NAT Gateways (one per AZ).
     */
    constructor(scope, id, props = {}) {
        super(scope, id);
        /**
         * List of public subnets in this VPC
         */
        this.publicSubnets = [];
        /**
         * List of private subnets in this VPC
         */
        this.privateSubnets = [];
        /**
         * List of isolated subnets in this VPC
         */
        this.isolatedSubnets = [];
        /**
         * Subnet configurations for this VPC
         */
        this.subnetConfiguration = [];
        this._internetConnectivityEstablished = new constructs_1.DependencyGroup();
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_VpcProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Vpc);
            }
            throw error;
        }
        const stack = core_1.Stack.of(this);
        // Can't have enabledDnsHostnames without enableDnsSupport
        if (props.enableDnsHostnames && !props.enableDnsSupport) {
            throw new Error('To use DNS Hostnames, DNS Support must be enabled, however, it was explicitly disabled.');
        }
        if (props.availabilityZones && props.maxAzs) {
            throw new Error('Vpc supports \'availabilityZones\' or \'maxAzs\', but not both.');
        }
        const cidrBlock = ifUndefined(props.cidr, Vpc.DEFAULT_CIDR_RANGE);
        if (core_1.Token.isUnresolved(cidrBlock)) {
            throw new Error('\'cidr\' property must be a concrete CIDR string, got a Token (we need to parse it for automatic subdivision)');
        }
        if (props.ipAddresses && props.cidr) {
            throw new Error('supply at most one of ipAddresses or cidr');
        }
        this.ipAddresses = props.ipAddresses ?? ip_addresses_1.IpAddresses.cidr(cidrBlock);
        this.dnsHostnamesEnabled = props.enableDnsHostnames == null ? true : props.enableDnsHostnames;
        this.dnsSupportEnabled = props.enableDnsSupport == null ? true : props.enableDnsSupport;
        const instanceTenancy = props.defaultInstanceTenancy || 'default';
        this.internetConnectivityEstablished = this._internetConnectivityEstablished;
        const vpcIpAddressOptions = this.ipAddresses.allocateVpcCidr();
        // Define a VPC using the provided CIDR range
        this.resource = new ec2_generated_1.CfnVPC(this, 'Resource', {
            cidrBlock: vpcIpAddressOptions.cidrBlock,
            ipv4IpamPoolId: vpcIpAddressOptions.ipv4IpamPoolId,
            ipv4NetmaskLength: vpcIpAddressOptions.ipv4NetmaskLength,
            enableDnsHostnames: this.dnsHostnamesEnabled,
            enableDnsSupport: this.dnsSupportEnabled,
            instanceTenancy,
        });
        this.vpcDefaultNetworkAcl = this.resource.attrDefaultNetworkAcl;
        this.vpcCidrBlockAssociations = this.resource.attrCidrBlockAssociations;
        this.vpcCidrBlock = this.resource.attrCidrBlock;
        this.vpcDefaultSecurityGroup = this.resource.attrDefaultSecurityGroup;
        this.vpcIpv6CidrBlocks = this.resource.attrIpv6CidrBlocks;
        core_1.Tags.of(this).add(NAME_TAG, props.vpcName || this.node.path);
        if (props.availabilityZones) {
            // If given AZs and stack AZs are both resolved, then validate their compatibility.
            const resolvedStackAzs = stack.availabilityZones.filter(az => !core_1.Token.isUnresolved(az));
            const areGivenAzsSubsetOfStack = resolvedStackAzs.length === 0 // stack AZs are tokenized, so we cannot validate it
                || props.availabilityZones.every(az => core_1.Token.isUnresolved(az) // given AZ is tokenized, such as in integ tests, so we cannot validate it
                    || resolvedStackAzs.includes(az));
            if (!areGivenAzsSubsetOfStack) {
                throw new Error(`Given VPC 'availabilityZones' ${props.availabilityZones} must be a subset of the stack's availability zones ${stack.availabilityZones}`);
            }
            this.availabilityZones = props.availabilityZones;
        }
        else {
            const maxAZs = props.maxAzs ?? 3;
            this.availabilityZones = stack.availabilityZones.slice(0, maxAZs);
        }
        for (let i = 0; props.reservedAzs && i < props.reservedAzs; i++) {
            this.availabilityZones.push(FAKE_AZ_NAME);
        }
        this.vpcId = this.resource.ref;
        this.vpcArn = core_1.Arn.format({
            service: 'ec2',
            resource: 'vpc',
            resourceName: this.vpcId,
        }, stack);
        const defaultSubnet = props.natGateways === 0 ? Vpc.DEFAULT_SUBNETS_NO_NAT : Vpc.DEFAULT_SUBNETS;
        this.subnetConfiguration = ifUndefined(props.subnetConfiguration, defaultSubnet);
        const natGatewayPlacement = props.natGatewaySubnets || { subnetType: SubnetType.PUBLIC };
        const natGatewayCount = determineNatGatewayCount(props.natGateways, this.subnetConfiguration, this.availabilityZones.length);
        // subnetConfiguration must be set before calling createSubnets
        this.createSubnets();
        const allowOutbound = this.subnetConfiguration.filter(subnet => (subnet.subnetType !== SubnetType.PRIVATE_ISOLATED && subnet.subnetType !== SubnetType.ISOLATED)).length > 0;
        // Create an Internet Gateway and attach it if necessary
        if (allowOutbound) {
            const igw = new ec2_generated_1.CfnInternetGateway(this, 'IGW', {});
            this.internetGatewayId = igw.ref;
            this._internetConnectivityEstablished.add(igw);
            const att = new ec2_generated_1.CfnVPCGatewayAttachment(this, 'VPCGW', {
                internetGatewayId: igw.ref,
                vpcId: this.resource.ref,
            });
            this.publicSubnets.forEach(publicSubnet => {
                publicSubnet.addDefaultInternetRoute(igw.ref, att);
            });
            // if gateways are needed create them
            if (natGatewayCount > 0) {
                const provider = props.natGatewayProvider || nat_1.NatProvider.gateway();
                this.createNatGateways(provider, natGatewayCount, natGatewayPlacement);
            }
        }
        if (props.vpnGateway && this.publicSubnets.length === 0 && this.privateSubnets.length === 0 && this.isolatedSubnets.length === 0) {
            throw new Error('Can not enable the VPN gateway while the VPC has no subnets at all');
        }
        if ((props.vpnConnections || props.vpnGatewayAsn) && props.vpnGateway === false) {
            throw new Error('Cannot specify `vpnConnections` or `vpnGatewayAsn` when `vpnGateway` is set to false.');
        }
        if (props.vpnGateway || props.vpnConnections || props.vpnGatewayAsn) {
            this.enableVpnGateway({
                amazonSideAsn: props.vpnGatewayAsn,
                type: vpn_1.VpnConnectionType.IPSEC_1,
                vpnRoutePropagation: props.vpnRoutePropagation,
            });
            const vpnConnections = props.vpnConnections || {};
            for (const [connectionId, connection] of Object.entries(vpnConnections)) {
                this.addVpnConnection(connectionId, connection);
            }
        }
        // Allow creation of gateway endpoints on VPC instantiation as those can be
        // immediately functional without further configuration. This is not the case
        // for interface endpoints where the security group must be configured.
        if (props.gatewayEndpoints) {
            const gatewayEndpoints = props.gatewayEndpoints || {};
            for (const [endpointId, endpoint] of Object.entries(gatewayEndpoints)) {
                this.addGatewayEndpoint(endpointId, endpoint);
            }
        }
        // Add flow logs to the VPC
        if (props.flowLogs) {
            const flowLogs = props.flowLogs || {};
            for (const [flowLogId, flowLog] of Object.entries(flowLogs)) {
                this.addFlowLog(flowLogId, flowLog);
            }
        }
    }
    /**
     * Adds a new S3 gateway endpoint to this VPC
     *
     * @deprecated use `addGatewayEndpoint()` instead
     */
    addS3Endpoint(id, subnets) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-ec2.Vpc#addS3Endpoint", "use `addGatewayEndpoint()` instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addS3Endpoint);
            }
            throw error;
        }
        return new vpc_endpoint_1.GatewayVpcEndpoint(this, id, {
            service: vpc_endpoint_1.GatewayVpcEndpointAwsService.S3,
            vpc: this,
            subnets,
        });
    }
    /**
     * Adds a new DynamoDB gateway endpoint to this VPC
     *
     * @deprecated use `addGatewayEndpoint()` instead
     */
    addDynamoDbEndpoint(id, subnets) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-ec2.Vpc#addDynamoDbEndpoint", "use `addGatewayEndpoint()` instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addDynamoDbEndpoint);
            }
            throw error;
        }
        return new vpc_endpoint_1.GatewayVpcEndpoint(this, id, {
            service: vpc_endpoint_1.GatewayVpcEndpointAwsService.DYNAMODB,
            vpc: this,
            subnets,
        });
    }
    createNatGateways(provider, natCount, placement) {
        const natSubnets = this.selectSubnetObjects(placement);
        for (const sub of natSubnets) {
            if (this.publicSubnets.indexOf(sub) === -1) {
                throw new Error(`natGatewayPlacement ${placement} contains non public subnet ${sub}`);
            }
        }
        provider.configureNat({
            vpc: this,
            natSubnets: natSubnets.slice(0, natCount),
            privateSubnets: this.privateSubnets,
        });
    }
    /**
     * createSubnets creates the subnets specified by the subnet configuration
     * array or creates the `DEFAULT_SUBNETS` configuration
     */
    createSubnets() {
        const requestedSubnets = [];
        this.subnetConfiguration.forEach((configuration) => (this.availabilityZones.forEach((az, index) => {
            requestedSubnets.push({
                availabilityZone: az,
                subnetConstructId: (0, util_1.subnetId)(configuration.name, index),
                configuration,
            });
        })));
        const { allocatedSubnets } = this.ipAddresses.allocateSubnetsCidr({
            vpcCidr: this.vpcCidrBlock,
            requestedSubnets,
        });
        if (allocatedSubnets.length != requestedSubnets.length) {
            throw new Error('Incomplete Subnet Allocation; response array dose not equal input array');
        }
        this.createSubnetResources(requestedSubnets, allocatedSubnets);
    }
    createSubnetResources(requestedSubnets, allocatedSubnets) {
        allocatedSubnets.forEach((allocated, i) => {
            const { configuration: subnetConfig, subnetConstructId, availabilityZone } = requestedSubnets[i];
            if (subnetConfig.reserved === true) {
                // For reserved subnets, do not create any resources
                return;
            }
            if (availabilityZone === FAKE_AZ_NAME) {
                // For reserved azs, do not create any resources
                return;
            }
            // mapPublicIpOnLaunch true in Subnet.Public, false in Subnet.Private or Subnet.Isolated.
            let mapPublicIpOnLaunch = false;
            if (subnetConfig.subnetType !== SubnetType.PUBLIC && subnetConfig.mapPublicIpOnLaunch !== undefined) {
                throw new Error(`${subnetConfig.subnetType} subnet cannot include mapPublicIpOnLaunch parameter`);
            }
            if (subnetConfig.subnetType === SubnetType.PUBLIC) {
                mapPublicIpOnLaunch = (subnetConfig.mapPublicIpOnLaunch !== undefined)
                    ? subnetConfig.mapPublicIpOnLaunch
                    : true;
            }
            const subnetProps = {
                availabilityZone,
                vpcId: this.vpcId,
                cidrBlock: allocated.cidr,
                mapPublicIpOnLaunch: mapPublicIpOnLaunch,
            };
            let subnet;
            switch (subnetConfig.subnetType) {
                case SubnetType.PUBLIC:
                    const publicSubnet = new PublicSubnet(this, subnetConstructId, subnetProps);
                    this.publicSubnets.push(publicSubnet);
                    subnet = publicSubnet;
                    break;
                case SubnetType.PRIVATE_WITH_EGRESS:
                case SubnetType.PRIVATE_WITH_NAT:
                case SubnetType.PRIVATE:
                    const privateSubnet = new PrivateSubnet(this, subnetConstructId, subnetProps);
                    this.privateSubnets.push(privateSubnet);
                    subnet = privateSubnet;
                    break;
                case SubnetType.PRIVATE_ISOLATED:
                case SubnetType.ISOLATED:
                    const isolatedSubnet = new PrivateSubnet(this, subnetConstructId, subnetProps);
                    this.isolatedSubnets.push(isolatedSubnet);
                    subnet = isolatedSubnet;
                    break;
                default:
                    throw new Error(`Unrecognized subnet type: ${subnetConfig.subnetType}`);
            }
            // These values will be used to recover the config upon provider import
            const includeResourceTypes = [ec2_generated_1.CfnSubnet.CFN_RESOURCE_TYPE_NAME];
            core_1.Tags.of(subnet).add(SUBNETNAME_TAG, subnetConfig.name, { includeResourceTypes });
            core_1.Tags.of(subnet).add(SUBNETTYPE_TAG, subnetTypeTagValue(subnetConfig.subnetType), { includeResourceTypes });
        });
    }
}
_a = JSII_RTTI_SYMBOL_1;
Vpc[_a] = { fqn: "@aws-cdk/aws-ec2.Vpc", version: "0.0.0" };
/**
 * The default CIDR range used when creating VPCs.
 * This can be overridden using VpcProps when creating a VPCNetwork resource.
 * e.g. new VpcResource(this, { cidr: '192.168.0.0./16' })
 */
Vpc.DEFAULT_CIDR_RANGE = '10.0.0.0/16';
/**
 * The default subnet configuration
 *
 * 1 Public and 1 Private subnet per AZ evenly split
 */
Vpc.DEFAULT_SUBNETS = [
    {
        subnetType: SubnetType.PUBLIC,
        name: (0, util_1.defaultSubnetName)(SubnetType.PUBLIC),
    },
    {
        subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        name: (0, util_1.defaultSubnetName)(SubnetType.PRIVATE_WITH_EGRESS),
    },
];
/**
 * The default subnet configuration if natGateways specified to be 0
 *
 * 1 Public and 1 Isolated Subnet per AZ evenly split
 */
Vpc.DEFAULT_SUBNETS_NO_NAT = [
    {
        subnetType: SubnetType.PUBLIC,
        name: (0, util_1.defaultSubnetName)(SubnetType.PUBLIC),
    },
    {
        subnetType: SubnetType.PRIVATE_ISOLATED,
        name: (0, util_1.defaultSubnetName)(SubnetType.PRIVATE_ISOLATED),
    },
];
exports.Vpc = Vpc;
const SUBNETTYPE_TAG = 'aws-cdk:subnet-type';
const SUBNETNAME_TAG = 'aws-cdk:subnet-name';
function subnetTypeTagValue(type) {
    switch (type) {
        case SubnetType.PUBLIC: return 'Public';
        case SubnetType.PRIVATE_WITH_EGRESS:
        case SubnetType.PRIVATE_WITH_NAT:
        case SubnetType.PRIVATE:
            return 'Private';
        case SubnetType.PRIVATE_ISOLATED:
        case SubnetType.ISOLATED:
            return 'Isolated';
    }
}
/**
 * Represents a new VPC subnet resource
 *
 * @resource AWS::EC2::Subnet
 */
class Subnet extends core_1.Resource {
    static isVpcSubnet(x) {
        return VPC_SUBNET_SYMBOL in x;
    }
    static fromSubnetAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_SubnetAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromSubnetAttributes);
            }
            throw error;
        }
        return new ImportedSubnet(scope, id, attrs);
    }
    /**
     * Import existing subnet from id.
     */
    // eslint-disable-next-line @typescript-eslint/no-shadow
    static fromSubnetId(scope, id, subnetId) {
        return this.fromSubnetAttributes(scope, id, { subnetId });
    }
    constructor(scope, id, props) {
        super(scope, id);
        /**
         * Parts of this VPC subnet
         */
        this.dependencyElements = [];
        this._internetConnectivityEstablished = new constructs_1.DependencyGroup();
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_SubnetProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Subnet);
            }
            throw error;
        }
        Object.defineProperty(this, VPC_SUBNET_SYMBOL, { value: true });
        core_1.Tags.of(this).add(NAME_TAG, this.node.path);
        this.availabilityZone = props.availabilityZone;
        this.ipv4CidrBlock = props.cidrBlock;
        const subnet = new ec2_generated_1.CfnSubnet(this, 'Subnet', {
            vpcId: props.vpcId,
            cidrBlock: props.cidrBlock,
            availabilityZone: props.availabilityZone,
            mapPublicIpOnLaunch: props.mapPublicIpOnLaunch,
        });
        this.subnetId = subnet.ref;
        this.subnetVpcId = subnet.attrVpcId;
        this.subnetAvailabilityZone = subnet.attrAvailabilityZone;
        this.subnetIpv6CidrBlocks = subnet.attrIpv6CidrBlocks;
        this.subnetOutpostArn = subnet.attrOutpostArn;
        // subnet.attrNetworkAclAssociationId is the default ACL after the subnet
        // was just created. However, the ACL can be replaced at a later time.
        this._networkAcl = network_acl_1.NetworkAcl.fromNetworkAclId(this, 'Acl', subnet.attrNetworkAclAssociationId);
        this.subnetNetworkAclAssociationId = core_1.Lazy.string({ produce: () => this._networkAcl.networkAclId });
        this.node.defaultChild = subnet;
        const table = new ec2_generated_1.CfnRouteTable(this, 'RouteTable', {
            vpcId: props.vpcId,
        });
        this.routeTable = { routeTableId: table.ref };
        // Associate the public route table for this subnet, to this subnet
        const routeAssoc = new ec2_generated_1.CfnSubnetRouteTableAssociation(this, 'RouteTableAssociation', {
            subnetId: this.subnetId,
            routeTableId: table.ref,
        });
        this._internetConnectivityEstablished.add(routeAssoc);
        this.internetConnectivityEstablished = this._internetConnectivityEstablished;
    }
    /**
     * Create a default route that points to a passed IGW, with a dependency
     * on the IGW's attachment to the VPC.
     *
     * @param gatewayId the logical ID (ref) of the gateway attached to your VPC
     * @param gatewayAttachment the gateway attachment construct to be added as a dependency
     */
    addDefaultInternetRoute(gatewayId, gatewayAttachment) {
        const route = new ec2_generated_1.CfnRoute(this, 'DefaultRoute', {
            routeTableId: this.routeTable.routeTableId,
            destinationCidrBlock: '0.0.0.0/0',
            gatewayId,
        });
        route.node.addDependency(gatewayAttachment);
        // Since the 'route' depends on the gateway attachment, just
        // depending on the route is enough.
        this._internetConnectivityEstablished.add(route);
    }
    /**
     * Network ACL associated with this Subnet
     *
     * Upon creation, this is the default ACL which allows all traffic, except
     * explicit DENY entries that you add.
     *
     * You can replace it with a custom ACL which denies all traffic except
     * the explicit ALLOW entries that you add by creating a `NetworkAcl`
     * object and calling `associateNetworkAcl()`.
     */
    get networkAcl() {
        return this._networkAcl;
    }
    /**
     * Adds an entry to this subnets route table that points to the passed NATGatewayId
     * @param natGatewayId The ID of the NAT gateway
     */
    addDefaultNatRoute(natGatewayId) {
        this.addRoute('DefaultRoute', {
            routerType: RouterType.NAT_GATEWAY,
            routerId: natGatewayId,
            enablesInternetConnectivity: true,
        });
    }
    /**
     * Adds an entry to this subnets route table
     */
    addRoute(id, options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_AddRouteOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addRoute);
            }
            throw error;
        }
        if (options.destinationCidrBlock && options.destinationIpv6CidrBlock) {
            throw new Error('Cannot specify both \'destinationCidrBlock\' and \'destinationIpv6CidrBlock\'');
        }
        const route = new ec2_generated_1.CfnRoute(this, id, {
            routeTableId: this.routeTable.routeTableId,
            destinationCidrBlock: options.destinationCidrBlock || (options.destinationIpv6CidrBlock === undefined ? '0.0.0.0/0' : undefined),
            destinationIpv6CidrBlock: options.destinationIpv6CidrBlock,
            [routerTypeToPropName(options.routerType)]: options.routerId,
        });
        if (options.enablesInternetConnectivity) {
            this._internetConnectivityEstablished.add(route);
        }
    }
    associateNetworkAcl(id, networkAcl) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_INetworkAcl(networkAcl);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.associateNetworkAcl);
            }
            throw error;
        }
        this._networkAcl = networkAcl;
        const scope = networkAcl instanceof constructs_1.Construct ? networkAcl : this;
        const other = networkAcl instanceof constructs_1.Construct ? this : networkAcl;
        new network_acl_1.SubnetNetworkAclAssociation(scope, id + core_1.Names.nodeUniqueId(other.node), {
            networkAcl,
            subnet: this,
        });
    }
}
_b = JSII_RTTI_SYMBOL_1;
Subnet[_b] = { fqn: "@aws-cdk/aws-ec2.Subnet", version: "0.0.0" };
exports.Subnet = Subnet;
/**
 * Type of router used in route
 */
var RouterType;
(function (RouterType) {
    /**
     * Carrier gateway
     */
    RouterType["CARRIER_GATEWAY"] = "CarrierGateway";
    /**
     * Egress-only Internet Gateway
     */
    RouterType["EGRESS_ONLY_INTERNET_GATEWAY"] = "EgressOnlyInternetGateway";
    /**
     * Internet Gateway
     */
    RouterType["GATEWAY"] = "Gateway";
    /**
     * Instance
     */
    RouterType["INSTANCE"] = "Instance";
    /**
     * Local Gateway
     */
    RouterType["LOCAL_GATEWAY"] = "LocalGateway";
    /**
     * NAT Gateway
     */
    RouterType["NAT_GATEWAY"] = "NatGateway";
    /**
     * Network Interface
     */
    RouterType["NETWORK_INTERFACE"] = "NetworkInterface";
    /**
     * Transit Gateway
     */
    RouterType["TRANSIT_GATEWAY"] = "TransitGateway";
    /**
     * VPC peering connection
     */
    RouterType["VPC_PEERING_CONNECTION"] = "VpcPeeringConnection";
    /**
     * VPC Endpoint for gateway load balancers
     */
    RouterType["VPC_ENDPOINT"] = "VpcEndpoint";
})(RouterType = exports.RouterType || (exports.RouterType = {}));
function routerTypeToPropName(routerType) {
    return ({
        [RouterType.CARRIER_GATEWAY]: 'carrierGatewayId',
        [RouterType.EGRESS_ONLY_INTERNET_GATEWAY]: 'egressOnlyInternetGatewayId',
        [RouterType.GATEWAY]: 'gatewayId',
        [RouterType.INSTANCE]: 'instanceId',
        [RouterType.LOCAL_GATEWAY]: 'localGatewayId',
        [RouterType.NAT_GATEWAY]: 'natGatewayId',
        [RouterType.NETWORK_INTERFACE]: 'networkInterfaceId',
        [RouterType.TRANSIT_GATEWAY]: 'transitGatewayId',
        [RouterType.VPC_PEERING_CONNECTION]: 'vpcPeeringConnectionId',
        [RouterType.VPC_ENDPOINT]: 'vpcEndpointId',
    })[routerType];
}
/**
 * Represents a public VPC subnet resource
 */
class PublicSubnet extends Subnet {
    static fromPublicSubnetAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_PublicSubnetAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromPublicSubnetAttributes);
            }
            throw error;
        }
        return new ImportedSubnet(scope, id, attrs);
    }
    constructor(scope, id, props) {
        super(scope, id, props);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_PublicSubnetProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, PublicSubnet);
            }
            throw error;
        }
    }
    /**
     * Creates a new managed NAT gateway attached to this public subnet.
     * Also adds the EIP for the managed NAT.
     * @returns A ref to the the NAT Gateway ID
     */
    addNatGateway(eipAllocationId) {
        // Create a NAT Gateway in this public subnet
        const ngw = new ec2_generated_1.CfnNatGateway(this, 'NATGateway', {
            subnetId: this.subnetId,
            allocationId: eipAllocationId ?? new ec2_generated_1.CfnEIP(this, 'EIP', {
                domain: 'vpc',
            }).attrAllocationId,
        });
        ngw.node.addDependency(this.internetConnectivityEstablished);
        return ngw;
    }
}
_c = JSII_RTTI_SYMBOL_1;
PublicSubnet[_c] = { fqn: "@aws-cdk/aws-ec2.PublicSubnet", version: "0.0.0" };
exports.PublicSubnet = PublicSubnet;
/**
 * Represents a private VPC subnet resource
 */
class PrivateSubnet extends Subnet {
    static fromPrivateSubnetAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_PrivateSubnetAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromPrivateSubnetAttributes);
            }
            throw error;
        }
        return new ImportedSubnet(scope, id, attrs);
    }
    constructor(scope, id, props) {
        super(scope, id, props);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_PrivateSubnetProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, PrivateSubnet);
            }
            throw error;
        }
    }
}
_d = JSII_RTTI_SYMBOL_1;
PrivateSubnet[_d] = { fqn: "@aws-cdk/aws-ec2.PrivateSubnet", version: "0.0.0" };
exports.PrivateSubnet = PrivateSubnet;
function ifUndefined(value, defaultValue) {
    return value ?? defaultValue;
}
class ImportedVpc extends VpcBase {
    constructor(scope, id, props, isIncomplete) {
        super(scope, id, {
            region: props.region,
        });
        this.internetConnectivityEstablished = new constructs_1.DependencyGroup();
        this.vpcId = props.vpcId;
        this.vpcArn = core_1.Arn.format({
            service: 'ec2',
            resource: 'vpc',
            resourceName: this.vpcId,
        }, core_1.Stack.of(this));
        this.cidr = props.vpcCidrBlock;
        this.availabilityZones = props.availabilityZones;
        this._vpnGatewayId = props.vpnGatewayId;
        this.incompleteSubnetDefinition = isIncomplete;
        // None of the values may be unresolved list tokens
        for (const k of Object.keys(props)) {
            if (Array.isArray(props[k]) && core_1.Token.isUnresolved(props[k])) {
                core_1.Annotations.of(this).addWarning(`fromVpcAttributes: '${k}' is a list token: the imported VPC will not work with constructs that require a list of subnets at synthesis time. Use 'Vpc.fromLookup()' or 'Fn.importListValue' instead.`);
            }
        }
        /* eslint-disable max-len */
        const pub = new util_1.ImportSubnetGroup(props.publicSubnetIds, props.publicSubnetNames, props.publicSubnetRouteTableIds, props.publicSubnetIpv4CidrBlocks, SubnetType.PUBLIC, this.availabilityZones, 'publicSubnetIds', 'publicSubnetNames', 'publicSubnetRouteTableIds', 'publicSubnetIpv4CidrBlocks');
        const priv = new util_1.ImportSubnetGroup(props.privateSubnetIds, props.privateSubnetNames, props.privateSubnetRouteTableIds, props.privateSubnetIpv4CidrBlocks, SubnetType.PRIVATE_WITH_EGRESS, this.availabilityZones, 'privateSubnetIds', 'privateSubnetNames', 'privateSubnetRouteTableIds', 'privateSubnetIpv4CidrBlocks');
        const iso = new util_1.ImportSubnetGroup(props.isolatedSubnetIds, props.isolatedSubnetNames, props.isolatedSubnetRouteTableIds, props.isolatedSubnetIpv4CidrBlocks, SubnetType.PRIVATE_ISOLATED, this.availabilityZones, 'isolatedSubnetIds', 'isolatedSubnetNames', 'isolatedSubnetRouteTableIds', 'isolatedSubnetIpv4CidrBlocks');
        /* eslint-enable max-len */
        this.publicSubnets = pub.import(this);
        this.privateSubnets = priv.import(this);
        this.isolatedSubnets = iso.import(this);
    }
    get vpcCidrBlock() {
        if (this.cidr === undefined) {
            throw new Error('Cannot perform this operation: \'vpcCidrBlock\' was not supplied when creating this VPC');
        }
        return this.cidr;
    }
}
class LookedUpVpc extends VpcBase {
    constructor(scope, id, props, isIncomplete) {
        super(scope, id, {
            region: props.region,
        });
        this.internetConnectivityEstablished = new constructs_1.DependencyGroup();
        this.vpcId = props.vpcId;
        this.vpcArn = core_1.Arn.format({
            service: 'ec2',
            resource: 'vpc',
            resourceName: this.vpcId,
        }, core_1.Stack.of(this));
        this.cidr = props.vpcCidrBlock;
        this._vpnGatewayId = props.vpnGatewayId;
        this.incompleteSubnetDefinition = isIncomplete;
        const subnetGroups = props.subnetGroups || [];
        const availabilityZones = Array.from(new Set(flatMap(subnetGroups, subnetGroup => {
            return subnetGroup.subnets.map(subnet => subnet.availabilityZone);
        })));
        availabilityZones.sort((az1, az2) => az1.localeCompare(az2));
        this.availabilityZones = availabilityZones;
        this.publicSubnets = this.extractSubnetsOfType(subnetGroups, cxapi.VpcSubnetGroupType.PUBLIC);
        this.privateSubnets = this.extractSubnetsOfType(subnetGroups, cxapi.VpcSubnetGroupType.PRIVATE);
        this.isolatedSubnets = this.extractSubnetsOfType(subnetGroups, cxapi.VpcSubnetGroupType.ISOLATED);
    }
    get vpcCidrBlock() {
        if (this.cidr === undefined) {
            // Value might be cached from an old CLI version, so bumping the CX API protocol to
            // force the value to exist would not have helped.
            throw new Error('Cannot perform this operation: \'vpcCidrBlock\' was not found when looking up this VPC. Use a newer version of the CDK CLI and clear the old context value.');
        }
        return this.cidr;
    }
    extractSubnetsOfType(subnetGroups, subnetGroupType) {
        return flatMap(subnetGroups.filter(subnetGroup => subnetGroup.type === subnetGroupType), subnetGroup => this.subnetGroupToSubnets(subnetGroup));
    }
    subnetGroupToSubnets(subnetGroup) {
        const ret = new Array();
        for (let i = 0; i < subnetGroup.subnets.length; i++) {
            const vpcSubnet = subnetGroup.subnets[i];
            ret.push(Subnet.fromSubnetAttributes(this, `${subnetGroup.name}Subnet${i + 1}`, {
                availabilityZone: vpcSubnet.availabilityZone,
                subnetId: vpcSubnet.subnetId,
                routeTableId: vpcSubnet.routeTableId,
                ipv4CidrBlock: vpcSubnet.cidr,
            }));
        }
        return ret;
    }
}
function flatMap(xs, fn) {
    const ret = new Array();
    for (const x of xs) {
        ret.push(...fn(x));
    }
    return ret;
}
class CompositeDependable {
    constructor() {
        this.dependables = new Array();
        const self = this;
        constructs_1.Dependable.implement(this, {
            get dependencyRoots() {
                const ret = new Array();
                for (const dep of self.dependables) {
                    ret.push(...constructs_1.Dependable.of(dep).dependencyRoots);
                }
                return ret;
            },
        });
    }
    /**
     * Add a construct to the dependency roots
     */
    add(dep) {
        this.dependables.push(dep);
    }
}
/**
 * Invoke a function on a value (for its side effect) and return the value
 */
function tap(x, fn) {
    fn(x);
    return x;
}
class ImportedSubnet extends core_1.Resource {
    constructor(scope, id, attrs) {
        super(scope, id);
        this.internetConnectivityEstablished = new constructs_1.DependencyGroup();
        if (!attrs.routeTableId) {
            // The following looks a little weird, but comes down to:
            //
            // * Is the subnetId itself unresolved ({ Ref: Subnet }); or
            // * Was it the accidentally extracted first element of a list-encoded
            //   token? ({ Fn::ImportValue: Subnets } => ['#{Token[1234]}'] =>
            //   '#{Token[1234]}'
            //
            // There's no other API to test for the second case than to the string back into
            // a list and see if the combination is Unresolved.
            //
            // In both cases we can't output the subnetId literally into the metadata (because it'll
            // be useless). In the 2nd case even, if we output it to metadata, the `resolve()` call
            // that gets done on the metadata will even `throw`, because the '#{Token}' value will
            // occur in an illegal position (not in a list context).
            const ref = core_1.Token.isUnresolved(attrs.subnetId) || core_1.Token.isUnresolved([attrs.subnetId])
                ? `at '${constructs_1.Node.of(scope).path}/${id}'`
                : `'${attrs.subnetId}'`;
            // eslint-disable-next-line max-len
            core_1.Annotations.of(this).addWarning(`No routeTableId was provided to the subnet ${ref}. Attempting to read its .routeTable.routeTableId will return null/undefined. (More info: https://github.com/aws/aws-cdk/pull/3171)`);
        }
        this._ipv4CidrBlock = attrs.ipv4CidrBlock;
        this._availabilityZone = attrs.availabilityZone;
        this.subnetId = attrs.subnetId;
        this.routeTable = {
            // Forcing routeTableId to pretend non-null to maintain backwards-compatibility. See https://github.com/aws/aws-cdk/pull/3171
            routeTableId: attrs.routeTableId,
        };
    }
    get availabilityZone() {
        if (!this._availabilityZone) {
            // eslint-disable-next-line max-len
            throw new Error('You cannot reference a Subnet\'s availability zone if it was not supplied. Add the availabilityZone when importing using Subnet.fromSubnetAttributes()');
        }
        return this._availabilityZone;
    }
    get ipv4CidrBlock() {
        if (!this._ipv4CidrBlock) {
            // tslint:disable-next-line: max-line-length
            throw new Error('You cannot reference an imported Subnet\'s IPv4 CIDR if it was not supplied. Add the ipv4CidrBlock when importing using Subnet.fromSubnetAttributes()');
        }
        return this._ipv4CidrBlock;
    }
    associateNetworkAcl(id, networkAcl) {
        const scope = networkAcl instanceof constructs_1.Construct ? networkAcl : this;
        const other = networkAcl instanceof constructs_1.Construct ? this : networkAcl;
        new network_acl_1.SubnetNetworkAclAssociation(scope, id + core_1.Names.nodeUniqueId(other.node), {
            networkAcl,
            subnet: this,
        });
    }
}
/**
 * Determine (and validate) the NAT gateway count w.r.t. the rest of the subnet configuration
 *
 * We have the following requirements:
 *
 * - NatGatewayCount = 0 ==> there are no private subnets
 * - NatGatewayCount > 0 ==> there must be public subnets
 *
 * Do we want to require that there are private subnets if there are NatGateways?
 * They seem pointless but I see no reason to prevent it.
 */
function determineNatGatewayCount(requestedCount, subnetConfig, azCount) {
    const hasPrivateSubnets = subnetConfig.some(c => (c.subnetType === SubnetType.PRIVATE_WITH_EGRESS
        || c.subnetType === SubnetType.PRIVATE || c.subnetType === SubnetType.PRIVATE_WITH_NAT) && !c.reserved);
    const hasPublicSubnets = subnetConfig.some(c => c.subnetType === SubnetType.PUBLIC);
    const hasCustomEgress = subnetConfig.some(c => c.subnetType === SubnetType.PRIVATE_WITH_EGRESS);
    const count = requestedCount !== undefined ? Math.min(requestedCount, azCount) : (hasPrivateSubnets ? azCount : 0);
    if (count === 0 && hasPrivateSubnets && !hasCustomEgress) {
        // eslint-disable-next-line max-len
        throw new Error('If you do not want NAT gateways (natGateways=0), make sure you don\'t configure any PRIVATE(_WITH_NAT) subnets in \'subnetConfiguration\' (make them PUBLIC or ISOLATED instead)');
    }
    if (count > 0 && !hasPublicSubnets) {
        // eslint-disable-next-line max-len
        throw new Error(`If you configure PRIVATE subnets in 'subnetConfiguration', you must also configure PUBLIC subnets to put the NAT gateways into (got ${JSON.stringify(subnetConfig)}.`);
    }
    return count;
}
/**
 * There are returned when the provider has not supplied props yet
 *
 * It's only used for testing and on the first run-through.
 */
const DUMMY_VPC_PROPS = {
    availabilityZones: [],
    vpcCidrBlock: '1.2.3.4/5',
    isolatedSubnetIds: undefined,
    isolatedSubnetNames: undefined,
    isolatedSubnetRouteTableIds: undefined,
    privateSubnetIds: undefined,
    privateSubnetNames: undefined,
    privateSubnetRouteTableIds: undefined,
    publicSubnetIds: undefined,
    publicSubnetNames: undefined,
    publicSubnetRouteTableIds: undefined,
    subnetGroups: [
        {
            name: 'Public',
            type: cxapi.VpcSubnetGroupType.PUBLIC,
            subnets: [
                {
                    availabilityZone: 'dummy1a',
                    subnetId: 's-12345',
                    routeTableId: 'rtb-12345s',
                    cidr: '1.2.3.4/5',
                },
                {
                    availabilityZone: 'dummy1b',
                    subnetId: 's-67890',
                    routeTableId: 'rtb-67890s',
                    cidr: '1.2.3.4/5',
                },
            ],
        },
        {
            name: 'Private',
            type: cxapi.VpcSubnetGroupType.PRIVATE,
            subnets: [
                {
                    availabilityZone: 'dummy1a',
                    subnetId: 'p-12345',
                    routeTableId: 'rtb-12345p',
                    cidr: '1.2.3.4/5',
                },
                {
                    availabilityZone: 'dummy1b',
                    subnetId: 'p-67890',
                    routeTableId: 'rtb-57890p',
                    cidr: '1.2.3.4/5',
                },
            ],
        },
        {
            name: 'Isolated',
            type: cxapi.VpcSubnetGroupType.ISOLATED,
            subnets: [
                {
                    availabilityZone: 'dummy1a',
                    subnetId: 'p-12345',
                    routeTableId: 'rtb-12345p',
                    cidr: '1.2.3.4/5',
                },
                {
                    availabilityZone: 'dummy1b',
                    subnetId: 'p-67890',
                    routeTableId: 'rtb-57890p',
                    cidr: '1.2.3.4/5',
                },
            ],
        },
    ],
    vpcId: 'vpc-12345',
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnBjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidnBjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDJEQUEyRDtBQUMzRCx3Q0FHdUI7QUFDdkIseUNBQXlDO0FBQ3pDLDJDQUFtRztBQUNuRywrREFBb0Y7QUFDcEYsbURBR3lCO0FBQ3pCLGlEQUE2RjtBQUM3RiwrQkFBb0M7QUFDcEMsK0NBQXFGO0FBQ3JGLHFDQUF3QztBQUN4QyxpQ0FBbUk7QUFDbkksaURBQWdLO0FBQ2hLLG1EQUErRTtBQUUvRSwrQkFBb0g7QUFFcEgsTUFBTSxpQkFBaUIsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDbkUsTUFBTSxZQUFZLEdBQUcsU0FBUyxDQUFDO0FBd0kvQjs7R0FFRztBQUNILElBQVksVUFnR1g7QUFoR0QsV0FBWSxVQUFVO0lBQ3BCOzs7Ozs7Ozs7O09BVUc7SUFDSCwyQ0FBNkIsQ0FBQTtJQUU3Qjs7Ozs7Ozs7Ozs7O09BWUc7SUFDSCw4Q0FBZ0MsQ0FBQTtJQUVoQzs7Ozs7Ozs7Ozs7Ozs7OztPQWdCRztJQUNILDZDQUErQixDQUFBO0lBRS9COzs7Ozs7Ozs7Ozs7Ozs7T0FlRztJQUNILHlEQUEyQyxDQUFBO0lBRTNDOzs7Ozs7Ozs7Ozs7Ozs7O09BZ0JHO0lBQ0gsNENBQThCLENBQUE7SUFFOUI7Ozs7Ozs7OztPQVNHO0lBQ0gsK0JBQWlCLENBQUE7QUFDbkIsQ0FBQyxFQWhHVyxVQUFVLEdBQVYsa0JBQVUsS0FBVixrQkFBVSxRQWdHckI7QUE2SEQ7O0dBRUc7QUFDSCxNQUFlLE9BQVEsU0FBUSxlQUFRO0lBQXZDOztRQTBDRTs7OztXQUlHO1FBQ2dCLG9CQUFlLEdBQUcsSUFBSSxLQUFLLEVBQWMsQ0FBQztRQUU3RDs7V0FFRztRQUNPLCtCQUEwQixHQUFZLEtBQUssQ0FBQztJQThPeEQsQ0FBQztJQXJPQzs7T0FFRztJQUNJLGFBQWEsQ0FBQyxZQUE2QixFQUFFO1FBQ2xELE1BQU0s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LE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxnQkFBZ0IsRUFBRSxTQUFTO29CQUMzQixRQUFRLEVBQUUsU0FBUztvQkFDbkIsWUFBWSxFQUFFLFlBQVk7b0JBQzFCLElBQUksRUFBRSxXQUFXO2lCQUNsQjtnQkFDRDtvQkFDRSxnQkFBZ0IsRUFBRSxTQUFTO29CQUMzQixRQUFRLEVBQUUsU0FBUztvQkFDbkIsWUFBWSxFQUFFLFlBQVk7b0JBQzFCLElBQUksRUFBRSxXQUFXO2lCQUNsQjthQUNGO1NBQ0Y7UUFDRDtZQUNFLElBQUksRUFBRSxVQUFVO1lBQ2hCLElBQUksRUFBRSxLQUFLLENBQUMsa0JBQWtCLENBQUMsUUFBUTtZQUN2QyxPQUFPLEVBQUU7Z0JBQ1A7b0JBQ0UsZ0JBQWdCLEVBQUUsU0FBUztvQkFDM0IsUUFBUSxFQUFFLFNBQVM7b0JBQ25CLFlBQVksRUFBRSxZQUFZO29CQUMxQixJQUFJLEVBQUUsV0FBVztpQkFDbEI7Z0JBQ0Q7b0JBQ0UsZ0JBQWdCLEVBQUUsU0FBUztvQkFDM0IsUUFBUSxFQUFFLFNBQVM7b0JBQ25CLFlBQVksRUFBRSxZQUFZO29CQUMxQixJQUFJLEVBQUUsV0FBVztpQkFDbEI7YUFDRjtTQUNGO0tBQ0Y7SUFDRCxLQUFLLEVBQUUsV0FBVztDQUNuQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY3hzY2hlbWEgZnJvbSAnQGF3cy1jZGsvY2xvdWQtYXNzZW1ibHktc2NoZW1hJztcbmltcG9ydCB7XG4gIEFybiwgQW5ub3RhdGlvbnMsIENvbnRleHRQcm92aWRlcixcbiAgSVJlc291cmNlLCBMYXp5LCBSZXNvdXJjZSwgU3RhY2ssIFRva2VuLCBUYWdzLCBOYW1lcyxcbn0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjeGFwaSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0IHsgQ29uc3RydWN0LCBEZXBlbmRhYmxlLCBEZXBlbmRlbmN5R3JvdXAsIElDb25zdHJ1Y3QsIElEZXBlbmRhYmxlLCBOb2RlIH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDbGllbnRWcG5FbmRwb2ludCwgQ2xpZW50VnBuRW5kcG9pbnRPcHRpb25zIH0gZnJvbSAnLi9jbGllbnQtdnBuLWVuZHBvaW50JztcbmltcG9ydCB7XG4gIENmbkVJUCwgQ2ZuSW50ZXJuZXRHYXRld2F5LCBDZm5OYXRHYXRld2F5LCBDZm5Sb3V0ZSwgQ2ZuUm91dGVUYWJsZSwgQ2ZuU3VibmV0LFxuICBDZm5TdWJuZXRSb3V0ZVRhYmxlQXNzb2NpYXRpb24sIENmblZQQywgQ2ZuVlBDR2F0ZXdheUF0dGFjaG1lbnQsIENmblZQTkdhdGV3YXlSb3V0ZVByb3BhZ2F0aW9uLFxufSBmcm9tICcuL2VjMi5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgQWxsb2NhdGVkU3VibmV0LCBJSXBBZGRyZXNzZXMsIFJlcXVlc3RlZFN1Ym5ldCwgSXBBZGRyZXNzZXMgfSBmcm9tICcuL2lwLWFkZHJlc3Nlcyc7XG5pbXBvcnQgeyBOYXRQcm92aWRlciB9IGZyb20gJy4vbmF0JztcbmltcG9ydCB7IElOZXR3b3JrQWNsLCBOZXR3b3JrQWNsLCBTdWJuZXROZXR3b3JrQWNsQXNzb2NpYXRpb24gfSBmcm9tICcuL25ldHdvcmstYWNsJztcbmltcG9ydCB7IFN1Ym5ldEZpbHRlciB9IGZyb20gJy4vc3VibmV0JztcbmltcG9ydCB7IGFsbFJvdXRlVGFibGVJZHMsIGRlZmF1bHRTdWJuZXROYW1lLCBmbGF0dGVuLCBJbXBvcnRTdWJuZXRHcm91cCwgc3VibmV0R3JvdXBOYW1lRnJvbUNvbnN0cnVjdElkLCBzdWJuZXRJZCB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgeyBHYXRld2F5VnBjRW5kcG9pbnQsIEdhdGV3YXlWcGNFbmRwb2ludEF3c1NlcnZpY2UsIEdhdGV3YXlWcGNFbmRwb2ludE9wdGlvbnMsIEludGVyZmFjZVZwY0VuZHBvaW50LCBJbnRlcmZhY2VWcGNFbmRwb2ludE9wdGlvbnMgfSBmcm9tICcuL3ZwYy1lbmRwb2ludCc7XG5pbXBvcnQgeyBGbG93TG9nLCBGbG93TG9nT3B0aW9ucywgRmxvd0xvZ1Jlc291cmNlVHlwZSB9IGZyb20gJy4vdnBjLWZsb3ctbG9ncyc7XG5pbXBvcnQgeyBWcGNMb29rdXBPcHRpb25zIH0gZnJvbSAnLi92cGMtbG9va3VwJztcbmltcG9ydCB7IEVuYWJsZVZwbkdhdGV3YXlPcHRpb25zLCBWcG5Db25uZWN0aW9uLCBWcG5Db25uZWN0aW9uT3B0aW9ucywgVnBuQ29ubmVjdGlvblR5cGUsIFZwbkdhdGV3YXkgfSBmcm9tICcuL3Zwbic7XG5cbmNvbnN0IFZQQ19TVUJORVRfU1lNQk9MID0gU3ltYm9sLmZvcignQGF3cy1jZGsvYXdzLWVjMi5WcGNTdWJuZXQnKTtcbmNvbnN0IEZBS0VfQVpfTkFNRSA9ICdmYWtlLWF6JztcblxuZXhwb3J0IGludGVyZmFjZSBJU3VibmV0IGV4dGVuZHMgSVJlc291cmNlIHtcbiAgLyoqXG4gICAqIFRoZSBBdmFpbGFiaWxpdHkgWm9uZSB0aGUgc3VibmV0IGlzIGxvY2F0ZWQgaW5cbiAgICovXG4gIHJlYWRvbmx5IGF2YWlsYWJpbGl0eVpvbmU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHN1Ym5ldElkIGZvciB0aGlzIHBhcnRpY3VsYXIgc3VibmV0XG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IHN1Ym5ldElkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIERlcGVuZGFibGUgdGhhdCBjYW4gYmUgZGVwZW5kZWQgdXBvbiB0byBmb3JjZSBpbnRlcm5ldCBjb25uZWN0aXZpdHkgZXN0YWJsaXNoZWQgb24gdGhlIFZQQ1xuICAgKi9cbiAgcmVhZG9ubHkgaW50ZXJuZXRDb25uZWN0aXZpdHlFc3RhYmxpc2hlZDogSURlcGVuZGFibGU7XG5cbiAgLyoqXG4gICAqIFRoZSBJUHY0IENJRFIgYmxvY2sgZm9yIHRoaXMgc3VibmV0XG4gICAqL1xuICByZWFkb25seSBpcHY0Q2lkckJsb2NrOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSByb3V0ZSB0YWJsZSBmb3IgdGhpcyBzdWJuZXRcbiAgICovXG4gIHJlYWRvbmx5IHJvdXRlVGFibGU6IElSb3V0ZVRhYmxlO1xuXG4gIC8qKlxuICAgKiBBc3NvY2lhdGUgYSBOZXR3b3JrIEFDTCB3aXRoIHRoaXMgc3VibmV0XG4gICAqXG4gICAqIEBwYXJhbSBhY2wgVGhlIE5ldHdvcmsgQUNMIHRvIGFzc29jaWF0ZVxuICAgKi9cbiAgYXNzb2NpYXRlTmV0d29ya0FjbChpZDogc3RyaW5nLCBhY2w6IElOZXR3b3JrQWNsKTogdm9pZDtcbn1cblxuLyoqXG4gKiBBbiBhYnN0cmFjdCByb3V0ZSB0YWJsZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIElSb3V0ZVRhYmxlIHtcbiAgLyoqXG4gICAqIFJvdXRlIHRhYmxlIElEXG4gICAqL1xuICByZWFkb25seSByb3V0ZVRhYmxlSWQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJVnBjIGV4dGVuZHMgSVJlc291cmNlIHtcbiAgLyoqXG4gICAqIElkZW50aWZpZXIgZm9yIHRoaXMgVlBDXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IHZwY0lkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEFSTiBmb3IgdGhpcyBWUENcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgdnBjQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIENJRFIgcmFuZ2UgZm9yIHRoaXMgVlBDXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IHZwY0NpZHJCbG9jazogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIHB1YmxpYyBzdWJuZXRzIGluIHRoaXMgVlBDXG4gICAqL1xuICByZWFkb25seSBwdWJsaWNTdWJuZXRzOiBJU3VibmV0W107XG5cbiAgLyoqXG4gICAqIExpc3Qgb2YgcHJpdmF0ZSBzdWJuZXRzIGluIHRoaXMgVlBDXG4gICAqL1xuICByZWFkb25seSBwcml2YXRlU3VibmV0czogSVN1Ym5ldFtdO1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIGlzb2xhdGVkIHN1Ym5ldHMgaW4gdGhpcyBWUENcbiAgICovXG4gIHJlYWRvbmx5IGlzb2xhdGVkU3VibmV0czogSVN1Ym5ldFtdO1xuXG4gIC8qKlxuICAgKiBBWnMgZm9yIHRoaXMgVlBDXG4gICAqL1xuICByZWFkb25seSBhdmFpbGFiaWxpdHlab25lczogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIElkZW50aWZpZXIgZm9yIHRoZSBWUE4gZ2F0ZXdheVxuICAgKi9cbiAgcmVhZG9ubHkgdnBuR2F0ZXdheUlkPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBEZXBlbmRhYmxlIHRoYXQgY2FuIGJlIGRlcGVuZGVkIHVwb24gdG8gZm9yY2UgaW50ZXJuZXQgY29ubmVjdGl2aXR5IGVzdGFibGlzaGVkIG9uIHRoZSBWUENcbiAgICovXG4gIHJlYWRvbmx5IGludGVybmV0Q29ubmVjdGl2aXR5RXN0YWJsaXNoZWQ6IElEZXBlbmRhYmxlO1xuXG4gIC8qKlxuICAgKiBSZXR1cm4gaW5mb3JtYXRpb24gb24gdGhlIHN1Ym5ldHMgYXBwcm9wcmlhdGUgZm9yIHRoZSBnaXZlbiBzZWxlY3Rpb24gc3RyYXRlZ3lcbiAgICpcbiAgICogUmVxdWlyZXMgdGhhdCBhdCBsZWFzdCBvbmUgc3VibmV0IGlzIG1hdGNoZWQsIHRocm93cyBhIGRlc2NyaXB0aXZlXG4gICAqIGVycm9yIG1lc3NhZ2Ugb3RoZXJ3aXNlLlxuICAgKi9cbiAgc2VsZWN0U3VibmV0cyhzZWxlY3Rpb24/OiBTdWJuZXRTZWxlY3Rpb24pOiBTZWxlY3RlZFN1Ym5ldHM7XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBWUE4gR2F0ZXdheSB0byB0aGlzIFZQQ1xuICAgKi9cbiAgZW5hYmxlVnBuR2F0ZXdheShvcHRpb25zOiBFbmFibGVWcG5HYXRld2F5T3B0aW9ucyk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBuZXcgVlBOIGNvbm5lY3Rpb24gdG8gdGhpcyBWUENcbiAgICovXG4gIGFkZFZwbkNvbm5lY3Rpb24oaWQ6IHN0cmluZywgb3B0aW9uczogVnBuQ29ubmVjdGlvbk9wdGlvbnMpOiBWcG5Db25uZWN0aW9uO1xuXG4gIC8qKlxuICAgKiBBZGRzIGEgbmV3IGNsaWVudCBWUE4gZW5kcG9pbnQgdG8gdGhpcyBWUENcbiAgICovXG4gIGFkZENsaWVudFZwbkVuZHBvaW50KGlkOiBzdHJpbmcsIG9wdGlvbnM6IENsaWVudFZwbkVuZHBvaW50T3B0aW9ucyk6IENsaWVudFZwbkVuZHBvaW50O1xuXG4gIC8qKlxuICAgKiBBZGRzIGEgbmV3IGdhdGV3YXkgZW5kcG9pbnQgdG8gdGhpcyBWUENcbiAgICovXG4gIGFkZEdhdGV3YXlFbmRwb2ludChpZDogc3RyaW5nLCBvcHRpb25zOiBHYXRld2F5VnBjRW5kcG9pbnRPcHRpb25zKTogR2F0ZXdheVZwY0VuZHBvaW50XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBuZXcgaW50ZXJmYWNlIGVuZHBvaW50IHRvIHRoaXMgVlBDXG4gICAqL1xuICBhZGRJbnRlcmZhY2VFbmRwb2ludChpZDogc3RyaW5nLCBvcHRpb25zOiBJbnRlcmZhY2VWcGNFbmRwb2ludE9wdGlvbnMpOiBJbnRlcmZhY2VWcGNFbmRwb2ludFxuXG4gIC8qKlxuICAgKiBBZGRzIGEgbmV3IEZsb3cgTG9nIHRvIHRoaXMgVlBDXG4gICAqL1xuICBhZGRGbG93TG9nKGlkOiBzdHJpbmcsIG9wdGlvbnM/OiBGbG93TG9nT3B0aW9ucyk6IEZsb3dMb2dcbn1cblxuLyoqXG4gKiBUaGUgdHlwZSBvZiBTdWJuZXRcbiAqL1xuZXhwb3J0IGVudW0gU3VibmV0VHlwZSB7XG4gIC8qKlxuICAgKiBJc29sYXRlZCBTdWJuZXRzIGRvIG5vdCByb3V0ZSB0cmFmZmljIHRvIHRoZSBJbnRlcm5ldCAoaW4gdGhpcyBWUEMpLFxuICAgKiBhbmQgYXMgc3VjaCwgZG8gbm90IHJlcXVpcmUgTkFUIGdhdGV3YXlzLlxuICAgKlxuICAgKiBJc29sYXRlZCBzdWJuZXRzIGNhbiBvbmx5IGNvbm5lY3QgdG8gb3IgYmUgY29ubmVjdGVkIHRvIGZyb20gb3RoZXJcbiAgICogaW5zdGFuY2VzIGluIHRoZSBzYW1lIFZQQy4gQSBkZWZhdWx0IFZQQyBjb25maWd1cmF0aW9uIHdpbGwgbm90IGluY2x1ZGVcbiAgICogaXNvbGF0ZWQgc3VibmV0cy5cbiAgICpcbiAgICogVGhpcyBjYW4gYmUgZ29vZCBmb3Igc3VibmV0cyB3aXRoIFJEUyBvciBFbGFzdGljYWNoZSBpbnN0YW5jZXMsXG4gICAqIG9yIHdoaWNoIHJvdXRlIEludGVybmV0IHRyYWZmaWMgdGhyb3VnaCBhIHBlZXIgVlBDLlxuICAgKi9cbiAgUFJJVkFURV9JU09MQVRFRCA9ICdJc29sYXRlZCcsXG5cbiAgLyoqXG4gICAqIElzb2xhdGVkIFN1Ym5ldHMgZG8gbm90IHJvdXRlIHRyYWZmaWMgdG8gdGhlIEludGVybmV0IChpbiB0aGlzIFZQQyksXG4gICAqIGFuZCBhcyBzdWNoLCBkbyBub3QgcmVxdWlyZSBOQVQgZ2F0ZXdheXMuXG4gICAqXG4gICAqIElzb2xhdGVkIHN1Ym5ldHMgY2FuIG9ubHkgY29ubmVjdCB0byBvciBiZSBjb25uZWN0ZWQgdG8gZnJvbSBvdGhlclxuICAgKiBpbnN0YW5jZXMgaW4gdGhlIHNhbWUgVlBDLiBBIGRlZmF1bHQgVlBDIGNvbmZpZ3VyYXRpb24gd2lsbCBub3QgaW5jbHVkZVxuICAgKiBpc29sYXRlZCBzdWJuZXRzLlxuICAgKlxuICAgKiBUaGlzIGNhbiBiZSBnb29kIGZvciBzdWJuZXRzIHdpdGggUkRTIG9yIEVsYXN0aWNhY2hlIGluc3RhbmNlcyxcbiAgICogb3Igd2hpY2ggcm91dGUgSW50ZXJuZXQgdHJhZmZpYyB0aHJvdWdoIGEgcGVlciBWUEMuXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIHVzZSBgU3VibmV0VHlwZS5QUklWQVRFX0lTT0xBVEVEYFxuICAgKi9cbiAgSVNPTEFURUQgPSAnRGVwcmVjYXRlZF9Jc29sYXRlZCcsXG5cbiAgLyoqXG4gICAqIFN1Ym5ldCB0aGF0IHJvdXRlcyB0byB0aGUgaW50ZXJuZXQsIGJ1dCBub3QgdmljZSB2ZXJzYS5cbiAgICpcbiAgICogSW5zdGFuY2VzIGluIGEgcHJpdmF0ZSBzdWJuZXQgY2FuIGNvbm5lY3QgdG8gdGhlIEludGVybmV0LCBidXQgd2lsbCBub3RcbiAgICogYWxsb3cgY29ubmVjdGlvbnMgdG8gYmUgaW5pdGlhdGVkIGZyb20gdGhlIEludGVybmV0LiBFZ3Jlc3MgdG8gdGhlIGludGVybmV0IHdpbGxcbiAgICogbmVlZCB0byBiZSBwcm92aWRlZC5cbiAgICogTkFUIEdhdGV3YXkocykgYXJlIHRoZSBkZWZhdWx0IHNvbHV0aW9uIHRvIHByb3ZpZGluZyB0aGlzIHN1Ym5ldCB0eXBlIHRoZSBhYmlsaXR5IHRvIHJvdXRlIEludGVybmV0IHRyYWZmaWMuXG4gICAqIElmIGEgTkFUIEdhdGV3YXkgaXMgbm90IHJlcXVpcmVkIG9yIGRlc2lyZWQsIHNldCBgbmF0R2F0ZXdheXM6MGAgb3IgdXNlXG4gICAqIGBTdWJuZXRUeXBlLlBSSVZBVEVfSVNPTEFURURgIGluc3RlYWQuXG4gICAqXG4gICAqIEJ5IGRlZmF1bHQsIGEgTkFUIGdhdGV3YXkgaXMgY3JlYXRlZCBpbiBldmVyeSBwdWJsaWMgc3VibmV0IGZvciBtYXhpbXVtIGF2YWlsYWJpbGl0eS5cbiAgICogQmUgYXdhcmUgdGhhdCB5b3Ugd2lsbCBiZSBjaGFyZ2VkIGZvciBOQVQgZ2F0ZXdheXMuXG4gICAqXG4gICAqIE5vcm1hbGx5IGEgUHJpdmF0ZSBzdWJuZXQgd2lsbCB1c2UgYSBOQVQgZ2F0ZXdheSBpbiB0aGUgc2FtZSBBWiwgYnV0XG4gICAqIGlmIGBuYXRHYXRld2F5c2AgaXMgdXNlZCB0byByZWR1Y2UgdGhlIG51bWJlciBvZiBOQVQgZ2F0ZXdheXMsIGEgTkFUXG4gICAqIGdhdGV3YXkgZnJvbSBhbm90aGVyIEFaIHdpbGwgYmUgdXNlZCBpbnN0ZWFkLlxuICAgKi9cbiAgUFJJVkFURV9XSVRIX0VHUkVTUyA9ICdQcml2YXRlJyxcblxuICAvKipcbiAgICogU3VibmV0IHRoYXQgcm91dGVzIHRvIHRoZSBpbnRlcm5ldCAodmlhIGEgTkFUIGdhdGV3YXkpLCBidXQgbm90IHZpY2UgdmVyc2EuXG4gICAqXG4gICAqIEluc3RhbmNlcyBpbiBhIHByaXZhdGUgc3VibmV0IGNhbiBjb25uZWN0IHRvIHRoZSBJbnRlcm5ldCwgYnV0IHdpbGwgbm90XG4gICAqIGFsbG93IGNvbm5lY3Rpb25zIHRvIGJlIGluaXRpYXRlZCBmcm9tIHRoZSBJbnRlcm5ldC4gTkFUIEdhdGV3YXkocykgYXJlXG4gICAqIHJlcXVpcmVkIHdpdGggdGhpcyBzdWJuZXQgdHlwZSB0byByb3V0ZSB0aGUgSW50ZXJuZXQgdHJhZmZpYyB0aHJvdWdoLlxuICAgKiBJZiBhIE5BVCBHYXRld2F5IGlzIG5vdCByZXF1aXJlZCBvciBkZXNpcmVkLCB1c2UgYFN1Ym5ldFR5cGUuUFJJVkFURV9JU09MQVRFRGAgaW5zdGVhZC5cbiAgICpcbiAgICogQnkgZGVmYXVsdCwgYSBOQVQgZ2F0ZXdheSBpcyBjcmVhdGVkIGluIGV2ZXJ5IHB1YmxpYyBzdWJuZXQgZm9yIG1heGltdW0gYXZhaWxhYmlsaXR5LlxuICAgKiBCZSBhd2FyZSB0aGF0IHlvdSB3aWxsIGJlIGNoYXJnZWQgZm9yIE5BVCBnYXRld2F5cy5cbiAgICpcbiAgICogTm9ybWFsbHkgYSBQcml2YXRlIHN1Ym5ldCB3aWxsIHVzZSBhIE5BVCBnYXRld2F5IGluIHRoZSBzYW1lIEFaLCBidXRcbiAgICogaWYgYG5hdEdhdGV3YXlzYCBpcyB1c2VkIHRvIHJlZHVjZSB0aGUgbnVtYmVyIG9mIE5BVCBnYXRld2F5cywgYSBOQVRcbiAgICogZ2F0ZXdheSBmcm9tIGFub3RoZXIgQVogd2lsbCBiZSB1c2VkIGluc3RlYWQuXG4gICAqIEBkZXByZWNhdGVkIHVzZSBgUFJJVkFURV9XSVRIX0VHUkVTU2BcbiAgICovXG4gIFBSSVZBVEVfV0lUSF9OQVQgPSAnRGVwcmVjYXRlZF9Qcml2YXRlX05BVCcsXG5cbiAgLyoqXG4gICAqIFN1Ym5ldCB0aGF0IHJvdXRlcyB0byB0aGUgaW50ZXJuZXQsIGJ1dCBub3QgdmljZSB2ZXJzYS5cbiAgICpcbiAgICogSW5zdGFuY2VzIGluIGEgcHJpdmF0ZSBzdWJuZXQgY2FuIGNvbm5lY3QgdG8gdGhlIEludGVybmV0LCBidXQgd2lsbCBub3RcbiAgICogYWxsb3cgY29ubmVjdGlvbnMgdG8gYmUgaW5pdGlhdGVkIGZyb20gdGhlIEludGVybmV0LiBOQVQgR2F0ZXdheShzKSBhcmVcbiAgICogcmVxdWlyZWQgd2l0aCB0aGlzIHN1Ym5ldCB0eXBlIHRvIHJvdXRlIHRoZSBJbnRlcm5ldCB0cmFmZmljIHRocm91Z2guXG4gICAqIElmIGEgTkFUIEdhdGV3YXkgaXMgbm90IHJlcXVpcmVkIG9yIGRlc2lyZWQsIHVzZSBgU3VibmV0VHlwZS5QUklWQVRFX0lTT0xBVEVEYCBpbnN0ZWFkLlxuICAgKlxuICAgKiBCeSBkZWZhdWx0LCBhIE5BVCBnYXRld2F5IGlzIGNyZWF0ZWQgaW4gZXZlcnkgcHVibGljIHN1Ym5ldCBmb3IgbWF4aW11bSBhdmFpbGFiaWxpdHkuXG4gICAqIEJlIGF3YXJlIHRoYXQgeW91IHdpbGwgYmUgY2hhcmdlZCBmb3IgTkFUIGdhdGV3YXlzLlxuICAgKlxuICAgKiBOb3JtYWxseSBhIFByaXZhdGUgc3VibmV0IHdpbGwgdXNlIGEgTkFUIGdhdGV3YXkgaW4gdGhlIHNhbWUgQVosIGJ1dFxuICAgKiBpZiBgbmF0R2F0ZXdheXNgIGlzIHVzZWQgdG8gcmVkdWNlIHRoZSBudW1iZXIgb2YgTkFUIGdhdGV3YXlzLCBhIE5BVFxuICAgKiBnYXRld2F5IGZyb20gYW5vdGhlciBBWiB3aWxsIGJlIHVzZWQgaW5zdGVhZC5cbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgdXNlIGBQUklWQVRFX1dJVEhfRUdSRVNTYFxuICAgKi9cbiAgUFJJVkFURSA9ICdEZXByZWNhdGVkX1ByaXZhdGUnLFxuXG4gIC8qKlxuICAgKiBTdWJuZXQgY29ubmVjdGVkIHRvIHRoZSBJbnRlcm5ldFxuICAgKlxuICAgKiBJbnN0YW5jZXMgaW4gYSBQdWJsaWMgc3VibmV0IGNhbiBjb25uZWN0IHRvIHRoZSBJbnRlcm5ldCBhbmQgY2FuIGJlXG4gICAqIGNvbm5lY3RlZCB0byBmcm9tIHRoZSBJbnRlcm5ldCBhcyBsb25nIGFzIHRoZXkgYXJlIGxhdW5jaGVkIHdpdGggcHVibGljXG4gICAqIElQcyAoY29udHJvbGxlZCBvbiB0aGUgQXV0b1NjYWxpbmdHcm91cCBvciBvdGhlciBjb25zdHJ1Y3RzIHRoYXQgbGF1bmNoXG4gICAqIGluc3RhbmNlcykuXG4gICAqXG4gICAqIFB1YmxpYyBzdWJuZXRzIHJvdXRlIG91dGJvdW5kIHRyYWZmaWMgdmlhIGFuIEludGVybmV0IEdhdGV3YXkuXG4gICAqL1xuICBQVUJMSUMgPSAnUHVibGljJ1xufVxuXG4vKipcbiAqIEN1c3RvbWl6ZSBzdWJuZXRzIHRoYXQgYXJlIHNlbGVjdGVkIGZvciBwbGFjZW1lbnQgb2YgRU5Jc1xuICpcbiAqIENvbnN0cnVjdHMgdGhhdCBhbGxvdyBjdXN0b21pemF0aW9uIG9mIFZQQyBwbGFjZW1lbnQgdXNlIHBhcmFtZXRlcnMgb2YgdGhpc1xuICogdHlwZSB0byBwcm92aWRlIHBsYWNlbWVudCBzZXR0aW5ncy5cbiAqXG4gKiBCeSBkZWZhdWx0LCB0aGUgaW5zdGFuY2VzIGFyZSBwbGFjZWQgaW4gdGhlIHByaXZhdGUgc3VibmV0cy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTdWJuZXRTZWxlY3Rpb24ge1xuICAvKipcbiAgICogU2VsZWN0IGFsbCBzdWJuZXRzIG9mIHRoZSBnaXZlbiB0eXBlXG4gICAqXG4gICAqIEF0IG1vc3Qgb25lIG9mIGBzdWJuZXRUeXBlYCBhbmQgYHN1Ym5ldEdyb3VwTmFtZWAgY2FuIGJlIHN1cHBsaWVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCBTdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9FR1JFU1MgKG9yIElTT0xBVEVEIG9yIFBVQkxJQyBpZiB0aGVyZSBhcmUgbm8gUFJJVkFURV9XSVRIX0VHUkVTUyBzdWJuZXRzKVxuICAgKi9cbiAgcmVhZG9ubHkgc3VibmV0VHlwZT86IFN1Ym5ldFR5cGU7XG5cbiAgLyoqXG4gICAqIFNlbGVjdCBzdWJuZXRzIG9ubHkgaW4gdGhlIGdpdmVuIEFacy5cbiAgICpcbiAgICogQGRlZmF1bHQgbm8gZmlsdGVyaW5nIG9uIEFacyBpcyBkb25lXG4gICAqL1xuICByZWFkb25seSBhdmFpbGFiaWxpdHlab25lcz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBTZWxlY3QgdGhlIHN1Ym5ldCBncm91cCB3aXRoIHRoZSBnaXZlbiBuYW1lXG4gICAqXG4gICAqIFNlbGVjdCB0aGUgc3VibmV0IGdyb3VwIHdpdGggdGhlIGdpdmVuIG5hbWUuIFRoaXMgb25seSBuZWVkc1xuICAgKiB0byBiZSB1c2VkIGlmIHlvdSBoYXZlIG11bHRpcGxlIHN1Ym5ldCBncm91cHMgb2YgdGhlIHNhbWUgdHlwZVxuICAgKiBhbmQgeW91IG5lZWQgdG8gZGlzdGluZ3Vpc2ggYmV0d2VlbiB0aGVtLiBPdGhlcndpc2UsIHByZWZlclxuICAgKiBgc3VibmV0VHlwZWAuXG4gICAqXG4gICAqIFRoaXMgZmllbGQgZG9lcyBub3Qgc2VsZWN0IGluZGl2aWR1YWwgc3VibmV0cywgaXQgc2VsZWN0cyBhbGwgc3VibmV0cyB0aGF0XG4gICAqIHNoYXJlIHRoZSBnaXZlbiBzdWJuZXQgZ3JvdXAgbmFtZS4gVGhpcyBpcyB0aGUgbmFtZSBzdXBwbGllZCBpblxuICAgKiBgc3VibmV0Q29uZmlndXJhdGlvbmAuXG4gICAqXG4gICAqIEF0IG1vc3Qgb25lIG9mIGBzdWJuZXRUeXBlYCBhbmQgYHN1Ym5ldEdyb3VwTmFtZWAgY2FuIGJlIHN1cHBsaWVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFNlbGVjdGlvbiBieSB0eXBlIGluc3RlYWQgb2YgYnkgbmFtZVxuICAgKi9cbiAgcmVhZG9ubHkgc3VibmV0R3JvdXBOYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBbGlhcyBmb3IgYHN1Ym5ldEdyb3VwTmFtZWBcbiAgICpcbiAgICogU2VsZWN0IHRoZSBzdWJuZXQgZ3JvdXAgd2l0aCB0aGUgZ2l2ZW4gbmFtZS4gVGhpcyBvbmx5IG5lZWRzXG4gICAqIHRvIGJlIHVzZWQgaWYgeW91IGhhdmUgbXVsdGlwbGUgc3VibmV0IGdyb3VwcyBvZiB0aGUgc2FtZSB0eXBlXG4gICAqIGFuZCB5b3UgbmVlZCB0byBkaXN0aW5ndWlzaCBiZXR3ZWVuIHRoZW0uXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgc3VibmV0R3JvdXBOYW1lYCBpbnN0ZWFkXG4gICAqL1xuICByZWFkb25seSBzdWJuZXROYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBJZiB0cnVlLCByZXR1cm4gYXQgbW9zdCBvbmUgc3VibmV0IHBlciBBWlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgb25lUGVyQXo/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIHByb3ZpZGVkIHN1Ym5ldCBmaWx0ZXJzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vbmVcbiAgICovXG4gIHJlYWRvbmx5IHN1Ym5ldEZpbHRlcnM/OiBTdWJuZXRGaWx0ZXJbXTtcblxuICAvKipcbiAgICogRXhwbGljaXRseSBzZWxlY3QgaW5kaXZpZHVhbCBzdWJuZXRzXG4gICAqXG4gICAqIFVzZSB0aGlzIGlmIHlvdSBkb24ndCB3YW50IHRvIGF1dG9tYXRpY2FsbHkgdXNlIGFsbCBzdWJuZXRzIGluXG4gICAqIGEgZ3JvdXAsIGJ1dCBoYXZlIGEgbmVlZCB0byBjb250cm9sIHNlbGVjdGlvbiBkb3duIHRvXG4gICAqIGluZGl2aWR1YWwgc3VibmV0cy5cbiAgICpcbiAgICogQ2Fubm90IGJlIHNwZWNpZmllZCB0b2dldGhlciB3aXRoIGBzdWJuZXRUeXBlYCBvciBgc3VibmV0R3JvdXBOYW1lYC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBVc2UgYWxsIHN1Ym5ldHMgaW4gYSBzZWxlY3RlZCBncm91cCAoYWxsIHByaXZhdGUgc3VibmV0cyBieSBkZWZhdWx0KVxuICAgKi9cbiAgcmVhZG9ubHkgc3VibmV0cz86IElTdWJuZXRbXVxufVxuXG4vKipcbiAqIFJlc3VsdCBvZiBzZWxlY3RpbmcgYSBzdWJzZXQgb2Ygc3VibmV0cyBmcm9tIGEgVlBDXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU2VsZWN0ZWRTdWJuZXRzIHtcbiAgLyoqXG4gICAqIFRoZSBzdWJuZXQgSURzXG4gICAqL1xuICByZWFkb25seSBzdWJuZXRJZHM6IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBUaGUgcmVzcGVjdGl2ZSBBWnMgb2YgZWFjaCBzdWJuZXRcbiAgICovXG4gIHJlYWRvbmx5IGF2YWlsYWJpbGl0eVpvbmVzOiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogRGVwZW5kZW5jeSByZXByZXNlbnRpbmcgaW50ZXJuZXQgY29ubmVjdGl2aXR5IGZvciB0aGVzZSBzdWJuZXRzXG4gICAqL1xuICByZWFkb25seSBpbnRlcm5ldENvbm5lY3Rpdml0eUVzdGFibGlzaGVkOiBJRGVwZW5kYWJsZTtcblxuICAvKipcbiAgICogU2VsZWN0ZWQgc3VibmV0IG9iamVjdHNcbiAgICovXG4gIHJlYWRvbmx5IHN1Ym5ldHM6IElTdWJuZXRbXTtcblxuICAvKipcbiAgICogV2hldGhlciBhbnkgb2YgdGhlIGdpdmVuIHN1Ym5ldHMgYXJlIGZyb20gdGhlIFZQQydzIHB1YmxpYyBzdWJuZXRzLlxuICAgKi9cbiAgcmVhZG9ubHkgaGFzUHVibGljOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgc3VibmV0IHNlbGVjdGlvbiBpcyBub3QgYWN0dWFsbHkgcmVhbCB5ZXRcbiAgICpcbiAgICogSWYgdGhpcyB2YWx1ZSBpcyB0cnVlLCBkb24ndCB2YWxpZGF0ZSBhbnl0aGluZyBhYm91dCB0aGUgc3VibmV0cy4gVGhlIGNvdW50XG4gICAqIG9yIGlkZW50aXRpZXMgYXJlIG5vdCBrbm93biB5ZXQsIGFuZCB0aGUgdmFsaWRhdGlvbiB3aWxsIG1vc3QgbGlrZWx5IGZhaWxcbiAgICogd2hpY2ggd2lsbCBwcmV2ZW50IGEgc3VjY2Vzc2Z1bCBsb29rdXAuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBpc1BlbmRpbmdMb29rdXA/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIEEgbmV3IG9yIGltcG9ydGVkIFZQQ1xuICovXG5hYnN0cmFjdCBjbGFzcyBWcGNCYXNlIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJVnBjIHtcblxuICAvKipcbiAgICogSWRlbnRpZmllciBmb3IgdGhpcyBWUENcbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSB2cGNJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBcm4gb2YgdGhpcyBWUENcbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSB2cGNBcm46IHN0cmluZztcblxuICAvKipcbiAgICogQ0lEUiByYW5nZSBmb3IgdGhpcyBWUENcbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSB2cGNDaWRyQmxvY2s6IHN0cmluZztcblxuICAvKipcbiAgICogTGlzdCBvZiBwdWJsaWMgc3VibmV0cyBpbiB0aGlzIFZQQ1xuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IHB1YmxpY1N1Ym5ldHM6IElTdWJuZXRbXTtcblxuICAvKipcbiAgICogTGlzdCBvZiBwcml2YXRlIHN1Ym5ldHMgaW4gdGhpcyBWUENcbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBwcml2YXRlU3VibmV0czogSVN1Ym5ldFtdO1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIGlzb2xhdGVkIHN1Ym5ldHMgaW4gdGhpcyBWUENcbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBpc29sYXRlZFN1Ym5ldHM6IElTdWJuZXRbXTtcblxuICAvKipcbiAgICogQVpzIGZvciB0aGlzIFZQQ1xuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGF2YWlsYWJpbGl0eVpvbmVzOiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogRGVwZW5kZW5jaWVzIGZvciBpbnRlcm5ldCBjb25uZWN0aXZpdHlcbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBpbnRlcm5ldENvbm5lY3Rpdml0eUVzdGFibGlzaGVkOiBJRGVwZW5kYWJsZTtcblxuICAvKipcbiAgICogRGVwZW5kZW5jaWVzIGZvciBOQVQgY29ubmVjdGl2aXR5XG4gICAqXG4gICAqIEBkZXByZWNhdGVkIC0gVGhpcyB2YWx1ZSBpcyBubyBsb25nZXIgdXNlZC5cbiAgICovXG4gIHByb3RlY3RlZCByZWFkb25seSBuYXREZXBlbmRlbmNpZXMgPSBuZXcgQXJyYXk8SUNvbnN0cnVjdD4oKTtcblxuICAvKipcbiAgICogSWYgdGhpcyBpcyBzZXQgdG8gdHJ1ZSwgZG9uJ3QgZXJyb3Igb3V0IG9uIHRyeWluZyB0byBzZWxlY3Qgc3VibmV0c1xuICAgKi9cbiAgcHJvdGVjdGVkIGluY29tcGxldGVTdWJuZXREZWZpbml0aW9uOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIE11dGFibGUgcHJpdmF0ZSBmaWVsZCBmb3IgdGhlIHZwbkdhdGV3YXlJZFxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHByb3RlY3RlZCBfdnBuR2F0ZXdheUlkPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIElEcyBvZiBzZWxlY3RlZCBzdWJuZXRzXG4gICAqL1xuICBwdWJsaWMgc2VsZWN0U3VibmV0cyhzZWxlY3Rpb246IFN1Ym5ldFNlbGVjdGlvbiA9IHt9KTogU2VsZWN0ZWRTdWJuZXRzIHtcbiAgICBjb25zdCBzdWJuZXRzID0gdGhpcy5zZWxlY3RTdWJuZXRPYmplY3RzKHNlbGVjdGlvbik7XG4gICAgY29uc3QgcHVicyA9IG5ldyBTZXQodGhpcy5wdWJsaWNTdWJuZXRzKTtcblxuICAgIHJldHVybiB7XG4gICAgICBzdWJuZXRJZHM6IHN1Ym5ldHMubWFwKHMgPT4gcy5zdWJuZXRJZCksXG4gICAgICBnZXQgYXZhaWxhYmlsaXR5Wm9uZXMoKTogc3RyaW5nW10geyByZXR1cm4gc3VibmV0cy5tYXAocyA9PiBzLmF2YWlsYWJpbGl0eVpvbmUpOyB9LFxuICAgICAgaW50ZXJuZXRDb25uZWN0aXZpdHlFc3RhYmxpc2hlZDogdGFwKG5ldyBDb21wb3NpdGVEZXBlbmRhYmxlKCksIGQgPT4gc3VibmV0cy5mb3JFYWNoKHMgPT4gZC5hZGQocy5pbnRlcm5ldENvbm5lY3Rpdml0eUVzdGFibGlzaGVkKSkpLFxuICAgICAgc3VibmV0cyxcbiAgICAgIGhhc1B1YmxpYzogc3VibmV0cy5zb21lKHMgPT4gcHVicy5oYXMocykpLFxuICAgICAgaXNQZW5kaW5nTG9va3VwOiB0aGlzLmluY29tcGxldGVTdWJuZXREZWZpbml0aW9uLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIFZQTiBHYXRld2F5IHRvIHRoaXMgVlBDXG4gICAqL1xuICBwdWJsaWMgZW5hYmxlVnBuR2F0ZXdheShvcHRpb25zOiBFbmFibGVWcG5HYXRld2F5T3B0aW9ucyk6IHZvaWQge1xuICAgIGlmICh0aGlzLnZwbkdhdGV3YXlJZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgVlBOIEdhdGV3YXkgaGFzIGFscmVhZHkgYmVlbiBlbmFibGVkLicpO1xuICAgIH1cblxuICAgIGNvbnN0IHZwbkdhdGV3YXkgPSBuZXcgVnBuR2F0ZXdheSh0aGlzLCAnVnBuR2F0ZXdheScsIHtcbiAgICAgIGFtYXpvblNpZGVBc246IG9wdGlvbnMuYW1hem9uU2lkZUFzbixcbiAgICAgIHR5cGU6IFZwbkNvbm5lY3Rpb25UeXBlLklQU0VDXzEsXG4gICAgfSk7XG5cbiAgICB0aGlzLl92cG5HYXRld2F5SWQgPSB2cG5HYXRld2F5LmdhdGV3YXlJZDtcblxuICAgIGNvbnN0IGF0dGFjaG1lbnQgPSBuZXcgQ2ZuVlBDR2F0ZXdheUF0dGFjaG1lbnQodGhpcywgJ1ZQQ1ZQTkdXJywge1xuICAgICAgdnBjSWQ6IHRoaXMudnBjSWQsXG4gICAgICB2cG5HYXRld2F5SWQ6IHRoaXMuX3ZwbkdhdGV3YXlJZCxcbiAgICB9KTtcblxuICAgIC8vIFByb3BhZ2F0ZSByb3V0ZXMgb24gcm91dGUgdGFibGVzIGFzc29jaWF0ZWQgd2l0aCB0aGUgcmlnaHQgc3VibmV0c1xuICAgIGNvbnN0IHZwblJvdXRlUHJvcGFnYXRpb24gPSBvcHRpb25zLnZwblJvdXRlUHJvcGFnYXRpb24gPz8gW3t9XTtcbiAgICBjb25zdCByb3V0ZVRhYmxlSWRzID0gYWxsUm91dGVUYWJsZUlkcyhmbGF0dGVuKHZwblJvdXRlUHJvcGFnYXRpb24ubWFwKHMgPT4gdGhpcy5zZWxlY3RTdWJuZXRzKHMpLnN1Ym5ldHMpKSk7XG5cbiAgICBpZiAocm91dGVUYWJsZUlkcy5sZW5ndGggPT09IDApIHtcbiAgICAgIEFubm90YXRpb25zLm9mKHRoaXMpLmFkZEVycm9yKGBlbmFibGVWcG5HYXRld2F5OiBubyBzdWJuZXRzIG1hdGNoaW5nIHNlbGVjdGlvbjogJyR7SlNPTi5zdHJpbmdpZnkodnBuUm91dGVQcm9wYWdhdGlvbil9Jy4gU2VsZWN0IG90aGVyIHN1Ym5ldHMgdG8gYWRkIHJvdXRlcyB0by5gKTtcbiAgICB9XG5cbiAgICBjb25zdCByb3V0ZVByb3BhZ2F0aW9uID0gbmV3IENmblZQTkdhdGV3YXlSb3V0ZVByb3BhZ2F0aW9uKHRoaXMsICdSb3V0ZVByb3BhZ2F0aW9uJywge1xuICAgICAgcm91dGVUYWJsZUlkcyxcbiAgICAgIHZwbkdhdGV3YXlJZDogdGhpcy5fdnBuR2F0ZXdheUlkLFxuICAgIH0pO1xuICAgIC8vIFRoZSBBV1M6OkVDMjo6VlBOR2F0ZXdheVJvdXRlUHJvcGFnYXRpb24gcmVzb3VyY2UgY2Fubm90IHVzZSB0aGUgVlBOIGdhdGV3YXlcbiAgICAvLyB1bnRpbCBpdCBoYXMgc3VjY2Vzc2Z1bGx5IGF0dGFjaGVkIHRvIHRoZSBWUEMuXG4gICAgLy8gU2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1lYzItdnBuLWdhdGV3YXlyb3V0ZXByb3AuaHRtbFxuICAgIHJvdXRlUHJvcGFnYXRpb24ubm9kZS5hZGREZXBlbmRlbmN5KGF0dGFjaG1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBuZXcgVlBOIGNvbm5lY3Rpb24gdG8gdGhpcyBWUENcbiAgICovXG4gIHB1YmxpYyBhZGRWcG5Db25uZWN0aW9uKGlkOiBzdHJpbmcsIG9wdGlvbnM6IFZwbkNvbm5lY3Rpb25PcHRpb25zKTogVnBuQ29ubmVjdGlvbiB7XG4gICAgcmV0dXJuIG5ldyBWcG5Db25uZWN0aW9uKHRoaXMsIGlkLCB7XG4gICAgICB2cGM6IHRoaXMsXG4gICAgICAuLi5vcHRpb25zLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBuZXcgY2xpZW50IFZQTiBlbmRwb2ludCB0byB0aGlzIFZQQ1xuICAgKi9cbiAgcHVibGljIGFkZENsaWVudFZwbkVuZHBvaW50KGlkOiBzdHJpbmcsIG9wdGlvbnM6IENsaWVudFZwbkVuZHBvaW50T3B0aW9ucyk6IENsaWVudFZwbkVuZHBvaW50IHtcbiAgICByZXR1cm4gbmV3IENsaWVudFZwbkVuZHBvaW50KHRoaXMsIGlkLCB7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgdnBjOiB0aGlzLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBuZXcgaW50ZXJmYWNlIGVuZHBvaW50IHRvIHRoaXMgVlBDXG4gICAqL1xuICBwdWJsaWMgYWRkSW50ZXJmYWNlRW5kcG9pbnQoaWQ6IHN0cmluZywgb3B0aW9uczogSW50ZXJmYWNlVnBjRW5kcG9pbnRPcHRpb25zKTogSW50ZXJmYWNlVnBjRW5kcG9pbnQge1xuICAgIHJldHVybiBuZXcgSW50ZXJmYWNlVnBjRW5kcG9pbnQodGhpcywgaWQsIHtcbiAgICAgIHZwYzogdGhpcyxcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIG5ldyBnYXRld2F5IGVuZHBvaW50IHRvIHRoaXMgVlBDXG4gICAqL1xuICBwdWJsaWMgYWRkR2F0ZXdheUVuZHBvaW50KGlkOiBzdHJpbmcsIG9wdGlvbnM6IEdhdGV3YXlWcGNFbmRwb2ludE9wdGlvbnMpOiBHYXRld2F5VnBjRW5kcG9pbnQge1xuICAgIHJldHVybiBuZXcgR2F0ZXdheVZwY0VuZHBvaW50KHRoaXMsIGlkLCB7XG4gICAgICB2cGM6IHRoaXMsXG4gICAgICAuLi5vcHRpb25zLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBuZXcgZmxvdyBsb2cgdG8gdGhpcyBWUENcbiAgICovXG4gIHB1YmxpYyBhZGRGbG93TG9nKGlkOiBzdHJpbmcsIG9wdGlvbnM/OiBGbG93TG9nT3B0aW9ucyk6IEZsb3dMb2cge1xuICAgIHJldHVybiBuZXcgRmxvd0xvZyh0aGlzLCBpZCwge1xuICAgICAgcmVzb3VyY2VUeXBlOiBGbG93TG9nUmVzb3VyY2VUeXBlLmZyb21WcGModGhpcyksXG4gICAgICAuLi5vcHRpb25zLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGlkIG9mIHRoZSBWUE4gR2F0ZXdheSAoaWYgZW5hYmxlZClcbiAgICovXG4gIHB1YmxpYyBnZXQgdnBuR2F0ZXdheUlkKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuX3ZwbkdhdGV3YXlJZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHN1Ym5ldHMgYXBwcm9wcmlhdGUgZm9yIHRoZSBwbGFjZW1lbnQgc3RyYXRlZ3lcbiAgICovXG4gIHByb3RlY3RlZCBzZWxlY3RTdWJuZXRPYmplY3RzKHNlbGVjdGlvbjogU3VibmV0U2VsZWN0aW9uID0ge30pOiBJU3VibmV0W10ge1xuICAgIHNlbGVjdGlvbiA9IHRoaXMucmVpZnlTZWxlY3Rpb25EZWZhdWx0cyhzZWxlY3Rpb24pO1xuXG4gICAgaWYgKHNlbGVjdGlvbi5zdWJuZXRzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBzZWxlY3Rpb24uc3VibmV0cztcbiAgICB9XG5cbiAgICBsZXQgc3VibmV0cztcblxuICAgIGlmIChzZWxlY3Rpb24uc3VibmV0R3JvdXBOYW1lICE9PSB1bmRlZmluZWQpIHsgLy8gU2VsZWN0IGJ5IG5hbWVcbiAgICAgIHN1Ym5ldHMgPSB0aGlzLnNlbGVjdFN1Ym5ldE9iamVjdHNCeU5hbWUoc2VsZWN0aW9uLnN1Ym5ldEdyb3VwTmFtZSk7XG5cbiAgICB9IGVsc2UgeyAvLyBPciBzcGVjaWZ5IGJ5IHR5cGVcbiAgICAgIGNvbnN0IHR5cGUgPSBzZWxlY3Rpb24uc3VibmV0VHlwZSB8fCBTdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9FR1JFU1M7XG4gICAgICBzdWJuZXRzID0gdGhpcy5zZWxlY3RTdWJuZXRPYmplY3RzQnlUeXBlKHR5cGUpO1xuICAgIH1cblxuICAgIC8vIEFwcGx5IGFsbCB0aGUgZmlsdGVyc1xuICAgIHN1Ym5ldHMgPSB0aGlzLmFwcGx5U3VibmV0RmlsdGVycyhzdWJuZXRzLCBzZWxlY3Rpb24uc3VibmV0RmlsdGVycyA/PyBbXSk7XG5cbiAgICByZXR1cm4gc3VibmV0cztcbiAgfVxuXG4gIHByaXZhdGUgYXBwbHlTdWJuZXRGaWx0ZXJzKHN1Ym5ldHM6IElTdWJuZXRbXSwgZmlsdGVyczogU3VibmV0RmlsdGVyW10pOiBJU3VibmV0W10ge1xuICAgIGxldCBmaWx0ZXJlZCA9IHN1Ym5ldHM7XG4gICAgLy8gQXBwbHkgZWFjaCBmaWx0ZXIgaW4gc2VxdWVuY2VcbiAgICBmb3IgKGNvbnN0IGZpbHRlciBvZiBmaWx0ZXJzKSB7XG4gICAgICBmaWx0ZXJlZCA9IGZpbHRlci5zZWxlY3RTdWJuZXRzKGZpbHRlcmVkKTtcbiAgICB9XG4gICAgcmV0dXJuIGZpbHRlcmVkO1xuICB9XG5cbiAgcHJpdmF0ZSBzZWxlY3RTdWJuZXRPYmplY3RzQnlOYW1lKGdyb3VwTmFtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgYWxsU3VibmV0cyA9IFsuLi50aGlzLnB1YmxpY1N1Ym5ldHMsIC4uLnRoaXMucHJpdmF0ZVN1Ym5ldHMsIC4uLnRoaXMuaXNvbGF0ZWRTdWJuZXRzXTtcbiAgICBjb25zdCBzdWJuZXRzID0gYWxsU3VibmV0cy5maWx0ZXIocyA9PiBzdWJuZXRHcm91cE5hbWVGcm9tQ29uc3RydWN0SWQocykgPT09IGdyb3VwTmFtZSk7XG5cbiAgICBpZiAoc3VibmV0cy5sZW5ndGggPT09IDAgJiYgIXRoaXMuaW5jb21wbGV0ZVN1Ym5ldERlZmluaXRpb24pIHtcbiAgICAgIGNvbnN0IG5hbWVzID0gQXJyYXkuZnJvbShuZXcgU2V0KGFsbFN1Ym5ldHMubWFwKHN1Ym5ldEdyb3VwTmFtZUZyb21Db25zdHJ1Y3RJZCkpKTtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlcmUgYXJlIG5vIHN1Ym5ldCBncm91cHMgd2l0aCBuYW1lICcke2dyb3VwTmFtZX0nIGluIHRoaXMgVlBDLiBBdmFpbGFibGUgbmFtZXM6ICR7bmFtZXN9YCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN1Ym5ldHM7XG4gIH1cblxuICBwcml2YXRlIHNlbGVjdFN1Ym5ldE9iamVjdHNCeVR5cGUoc3VibmV0VHlwZTogU3VibmV0VHlwZSkge1xuICAgIGNvbnN0IGFsbFN1Ym5ldHMgPSB7XG4gICAgICBbU3VibmV0VHlwZS5QUklWQVRFX0lTT0xBVEVEXTogdGhpcy5pc29sYXRlZFN1Ym5ldHMsXG4gICAgICBbU3VibmV0VHlwZS5JU09MQVRFRF06IHRoaXMuaXNvbGF0ZWRTdWJuZXRzLFxuICAgICAgW1N1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX05BVF06IHRoaXMucHJpdmF0ZVN1Ym5ldHMsXG4gICAgICBbU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfRUdSRVNTXTogdGhpcy5wcml2YXRlU3VibmV0cyxcbiAgICAgIFtTdWJuZXRUeXBlLlBSSVZBVEVdOiB0aGlzLnByaXZhdGVTdWJuZXRzLFxuICAgICAgW1N1Ym5ldFR5cGUuUFVCTElDXTogdGhpcy5wdWJsaWNTdWJuZXRzLFxuICAgIH07XG5cbiAgICBjb25zdCBzdWJuZXRzID0gYWxsU3VibmV0c1tzdWJuZXRUeXBlXTtcblxuICAgIC8vIEZvcmNlIG1lcmdlIGNvbmZsaWN0IGhlcmUgd2l0aCBodHRwczovL2dpdGh1Yi5jb20vYXdzL2F3cy1jZGsvcHVsbC80MDg5XG4gICAgLy8gc2VlIEltcG9ydGVkVnBjXG5cbiAgICBpZiAoc3VibmV0cy5sZW5ndGggPT09IDAgJiYgIXRoaXMuaW5jb21wbGV0ZVN1Ym5ldERlZmluaXRpb24pIHtcbiAgICAgIGNvbnN0IGF2YWlsYWJsZVR5cGVzID0gT2JqZWN0LmVudHJpZXMoYWxsU3VibmV0cykuZmlsdGVyKChbXywgc3Vic10pID0+IHN1YnMubGVuZ3RoID4gMCkubWFwKChbdHlwZU5hbWUsIF9dKSA9PiB0eXBlTmFtZSk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZXJlIGFyZSBubyAnJHtzdWJuZXRUeXBlfScgc3VibmV0IGdyb3VwcyBpbiB0aGlzIFZQQy4gQXZhaWxhYmxlIHR5cGVzOiAke2F2YWlsYWJsZVR5cGVzfWApO1xuICAgIH1cblxuICAgIHJldHVybiBzdWJuZXRzO1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIHRoZSBmaWVsZHMgaW4gYSBTdWJuZXRTZWxlY3Rpb24gb2JqZWN0LCBhbmQgcmVpZnkgZGVmYXVsdHMgaWYgbmVjZXNzYXJ5XG4gICAqXG4gICAqIEluIGNhc2Ugb2YgZGVmYXVsdCBzZWxlY3Rpb24sIHNlbGVjdCB0aGUgZmlyc3QgdHlwZSBvZiBQUklWQVRFLCBJU09MQVRFRCxcbiAgICogUFVCTElDIChpbiB0aGF0IG9yZGVyKSB0aGF0IGhhcyBhbnkgc3VibmV0cy5cbiAgICovXG4gIHByaXZhdGUgcmVpZnlTZWxlY3Rpb25EZWZhdWx0cyhwbGFjZW1lbnQ6IFN1Ym5ldFNlbGVjdGlvbik6IFN1Ym5ldFNlbGVjdGlvbiB7XG5cbiAgICBpZiAocGxhY2VtZW50LnN1Ym5ldE5hbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKHBsYWNlbWVudC5zdWJuZXRHcm91cE5hbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BsZWFzZSB1c2Ugb25seSBcXCdzdWJuZXRHcm91cE5hbWVcXCcgKFxcJ3N1Ym5ldE5hbWVcXCcgaXMgZGVwcmVjYXRlZCBhbmQgaGFzIHRoZSBzYW1lIGJlaGF2aW9yKScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgQW5ub3RhdGlvbnMub2YodGhpcykuYWRkV2FybmluZygnVXNhZ2Ugb2YgXFwnc3VibmV0TmFtZVxcJyBpbiBTdWJuZXRTZWxlY3Rpb24gaXMgZGVwcmVjYXRlZCwgdXNlIFxcJ3N1Ym5ldEdyb3VwTmFtZVxcJyBpbnN0ZWFkJyk7XG4gICAgICB9XG4gICAgICBwbGFjZW1lbnQgPSB7IC4uLnBsYWNlbWVudCwgc3VibmV0R3JvdXBOYW1lOiBwbGFjZW1lbnQuc3VibmV0TmFtZSB9O1xuICAgIH1cblxuICAgIGNvbnN0IGV4Y2x1c2l2ZVNlbGVjdGlvbnM6IEFycmF5PGtleW9mIFN1Ym5ldFNlbGVjdGlvbj4gPSBbJ3N1Ym5ldHMnLCAnc3VibmV0VHlwZScsICdzdWJuZXRHcm91cE5hbWUnXTtcbiAgICBjb25zdCBwcm92aWRlZFNlbGVjdGlvbnMgPSBleGNsdXNpdmVTZWxlY3Rpb25zLmZpbHRlcihrZXkgPT4gcGxhY2VtZW50W2tleV0gIT09IHVuZGVmaW5lZCk7XG4gICAgaWYgKHByb3ZpZGVkU2VsZWN0aW9ucy5sZW5ndGggPiAxKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE9ubHkgb25lIG9mICcke3Byb3ZpZGVkU2VsZWN0aW9uc30nIGNhbiBiZSBzdXBwbGllZCB0byBzdWJuZXQgc2VsZWN0aW9uLmApO1xuICAgIH1cblxuICAgIGlmIChwbGFjZW1lbnQuc3VibmV0VHlwZSA9PT0gdW5kZWZpbmVkICYmIHBsYWNlbWVudC5zdWJuZXRHcm91cE5hbWUgPT09IHVuZGVmaW5lZCAmJiBwbGFjZW1lbnQuc3VibmV0cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBSZXR1cm4gZGVmYXVsdCBzdWJuZXQgdHlwZSBiYXNlZCBvbiBzdWJuZXRzIHRoYXQgYWN0dWFsbHkgZXhpc3RcbiAgICAgIGxldCBzdWJuZXRUeXBlID0gdGhpcy5wcml2YXRlU3VibmV0cy5sZW5ndGhcbiAgICAgICAgPyBTdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9FR1JFU1MgOiB0aGlzLmlzb2xhdGVkU3VibmV0cy5sZW5ndGggPyBTdWJuZXRUeXBlLlBSSVZBVEVfSVNPTEFURUQgOiBTdWJuZXRUeXBlLlBVQkxJQztcbiAgICAgIHBsYWNlbWVudCA9IHsgLi4ucGxhY2VtZW50LCBzdWJuZXRUeXBlOiBzdWJuZXRUeXBlIH07XG4gICAgfVxuXG4gICAgLy8gRXN0YWJsaXNoIHdoaWNoIHN1Ym5ldCBmaWx0ZXJzIGFyZSBnb2luZyB0byBiZSB1c2VkXG4gICAgbGV0IHN1Ym5ldEZpbHRlcnMgPSBwbGFjZW1lbnQuc3VibmV0RmlsdGVycyA/PyBbXTtcblxuICAgIC8vIEJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IHdpdGggZXhpc3RpbmcgYGF2YWlsYWJpbGl0eVpvbmVzYCBhbmQgYG9uZVBlckF6YCBmdW5jdGlvbmFsaXR5XG4gICAgaWYgKHBsYWNlbWVudC5hdmFpbGFiaWxpdHlab25lcyAhPT0gdW5kZWZpbmVkKSB7IC8vIEZpbHRlciBieSBBWnMsIGlmIHNwZWNpZmllZFxuICAgICAgc3VibmV0RmlsdGVycy5wdXNoKFN1Ym5ldEZpbHRlci5hdmFpbGFiaWxpdHlab25lcyhwbGFjZW1lbnQuYXZhaWxhYmlsaXR5Wm9uZXMpKTtcbiAgICB9XG4gICAgaWYgKCEhcGxhY2VtZW50Lm9uZVBlckF6KSB7IC8vIEVuc3VyZSBvbmUgcGVyIEFaIGlmIHNwZWNpZmllZFxuICAgICAgc3VibmV0RmlsdGVycy5wdXNoKFN1Ym5ldEZpbHRlci5vbmVQZXJBeigpKTtcbiAgICB9XG5cbiAgICAvLyBPdmVyd3JpdGUgdGhlIHByb3ZpZGVkIHBsYWNlbWVudCBmaWx0ZXJzIGFuZCByZW1vdmUgdGhlIGF2YWlsYWJpbGl0eVpvbmVzIGFuZCBvbmVQZXJBeiBwcm9wZXJ0aWVzXG4gICAgcGxhY2VtZW50ID0geyAuLi5wbGFjZW1lbnQsIHN1Ym5ldEZpbHRlcnM6IHN1Ym5ldEZpbHRlcnMsIGF2YWlsYWJpbGl0eVpvbmVzOiB1bmRlZmluZWQsIG9uZVBlckF6OiB1bmRlZmluZWQgfTtcbiAgICBjb25zdCB7IGF2YWlsYWJpbGl0eVpvbmVzLCBvbmVQZXJBeiwgLi4ucmVzdCB9ID0gcGxhY2VtZW50O1xuXG4gICAgcmV0dXJuIHJlc3Q7XG4gIH1cbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIHRoYXQgcmVmZXJlbmNlIGFuIGV4dGVybmFsIFZwY1xuICovXG5leHBvcnQgaW50ZXJmYWNlIFZwY0F0dHJpYnV0ZXMge1xuICAvKipcbiAgICogVlBDJ3MgaWRlbnRpZmllclxuICAgKi9cbiAgcmVhZG9ubHkgdnBjSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVlBDJ3MgQ0lEUiByYW5nZVxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFJldHJpZXZpbmcgdGhlIENJRFIgZnJvbSB0aGUgVlBDIHdpbGwgZmFpbFxuICAgKi9cbiAgcmVhZG9ubHkgdnBjQ2lkckJsb2NrPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIGF2YWlsYWJpbGl0eSB6b25lcyBmb3IgdGhlIHN1Ym5ldHMgaW4gdGhpcyBWUEMuXG4gICAqL1xuICByZWFkb25seSBhdmFpbGFiaWxpdHlab25lczogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIExpc3Qgb2YgcHVibGljIHN1Ym5ldCBJRHNcbiAgICpcbiAgICogTXVzdCBiZSB1bmRlZmluZWQgb3IgbWF0Y2ggdGhlIGF2YWlsYWJpbGl0eSB6b25lcyBpbiBsZW5ndGggYW5kIG9yZGVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFRoZSBWUEMgZG9lcyBub3QgaGF2ZSBhbnkgcHVibGljIHN1Ym5ldHNcbiAgICovXG4gIHJlYWRvbmx5IHB1YmxpY1N1Ym5ldElkcz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIG5hbWVzIGZvciB0aGUgcHVibGljIHN1Ym5ldHNcbiAgICpcbiAgICogTXVzdCBiZSB1bmRlZmluZWQgb3IgaGF2ZSBhIG5hbWUgZm9yIGV2ZXJ5IHB1YmxpYyBzdWJuZXQgZ3JvdXAuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQWxsIHB1YmxpYyBzdWJuZXRzIHdpbGwgaGF2ZSB0aGUgbmFtZSBgUHVibGljYFxuICAgKi9cbiAgcmVhZG9ubHkgcHVibGljU3VibmV0TmFtZXM/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogTGlzdCBvZiBJRHMgb2Ygcm91dGUgdGFibGVzIGZvciB0aGUgcHVibGljIHN1Ym5ldHMuXG4gICAqXG4gICAqIE11c3QgYmUgdW5kZWZpbmVkIG9yIGhhdmUgYSBuYW1lIGZvciBldmVyeSBwdWJsaWMgc3VibmV0IGdyb3VwLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFJldHJpZXZpbmcgdGhlIHJvdXRlIHRhYmxlIElEIG9mIGFueSBwdWJsaWMgc3VibmV0IHdpbGwgZmFpbFxuICAgKi9cbiAgcmVhZG9ubHkgcHVibGljU3VibmV0Um91dGVUYWJsZUlkcz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIElQdjQgQ0lEUiBibG9ja3MgZm9yIHRoZSBwdWJsaWMgc3VibmV0cy5cbiAgICpcbiAgICogTXVzdCBiZSB1bmRlZmluZWQgb3IgaGF2ZSBhbiBlbnRyeSBmb3IgZXZlcnkgcHVibGljIHN1Ym5ldCBncm91cC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBSZXRyaWV2aW5nIHRoZSBJUHY0IENJRFIgYmxvY2sgb2YgYW55IHB1YmxpYyBzdWJuZXQgd2lsbCBmYWlsXG4gICAqL1xuICByZWFkb25seSBwdWJsaWNTdWJuZXRJcHY0Q2lkckJsb2Nrcz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIHByaXZhdGUgc3VibmV0IElEc1xuICAgKlxuICAgKiBNdXN0IGJlIHVuZGVmaW5lZCBvciBtYXRjaCB0aGUgYXZhaWxhYmlsaXR5IHpvbmVzIGluIGxlbmd0aCBhbmQgb3JkZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gVGhlIFZQQyBkb2VzIG5vdCBoYXZlIGFueSBwcml2YXRlIHN1Ym5ldHNcbiAgICovXG4gIHJlYWRvbmx5IHByaXZhdGVTdWJuZXRJZHM/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogTGlzdCBvZiBuYW1lcyBmb3IgdGhlIHByaXZhdGUgc3VibmV0c1xuICAgKlxuICAgKiBNdXN0IGJlIHVuZGVmaW5lZCBvciBoYXZlIGEgbmFtZSBmb3IgZXZlcnkgcHJpdmF0ZSBzdWJuZXQgZ3JvdXAuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQWxsIHByaXZhdGUgc3VibmV0cyB3aWxsIGhhdmUgdGhlIG5hbWUgYFByaXZhdGVgXG4gICAqL1xuICByZWFkb25seSBwcml2YXRlU3VibmV0TmFtZXM/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogTGlzdCBvZiBJRHMgb2Ygcm91dGUgdGFibGVzIGZvciB0aGUgcHJpdmF0ZSBzdWJuZXRzLlxuICAgKlxuICAgKiBNdXN0IGJlIHVuZGVmaW5lZCBvciBoYXZlIGEgbmFtZSBmb3IgZXZlcnkgcHJpdmF0ZSBzdWJuZXQgZ3JvdXAuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gUmV0cmlldmluZyB0aGUgcm91dGUgdGFibGUgSUQgb2YgYW55IHByaXZhdGUgc3VibmV0IHdpbGwgZmFpbFxuICAgKi9cbiAgcmVhZG9ubHkgcHJpdmF0ZVN1Ym5ldFJvdXRlVGFibGVJZHM/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogTGlzdCBvZiBJUHY0IENJRFIgYmxvY2tzIGZvciB0aGUgcHJpdmF0ZSBzdWJuZXRzLlxuICAgKlxuICAgKiBNdXN0IGJlIHVuZGVmaW5lZCBvciBoYXZlIGFuIGVudHJ5IGZvciBldmVyeSBwcml2YXRlIHN1Ym5ldCBncm91cC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBSZXRyaWV2aW5nIHRoZSBJUHY0IENJRFIgYmxvY2sgb2YgYW55IHByaXZhdGUgc3VibmV0IHdpbGwgZmFpbFxuICAgKi9cbiAgcmVhZG9ubHkgcHJpdmF0ZVN1Ym5ldElwdjRDaWRyQmxvY2tzPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIExpc3Qgb2YgaXNvbGF0ZWQgc3VibmV0IElEc1xuICAgKlxuICAgKiBNdXN0IGJlIHVuZGVmaW5lZCBvciBtYXRjaCB0aGUgYXZhaWxhYmlsaXR5IHpvbmVzIGluIGxlbmd0aCBhbmQgb3JkZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gVGhlIFZQQyBkb2VzIG5vdCBoYXZlIGFueSBpc29sYXRlZCBzdWJuZXRzXG4gICAqL1xuICByZWFkb25seSBpc29sYXRlZFN1Ym5ldElkcz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIG5hbWVzIGZvciB0aGUgaXNvbGF0ZWQgc3VibmV0c1xuICAgKlxuICAgKiBNdXN0IGJlIHVuZGVmaW5lZCBvciBoYXZlIGEgbmFtZSBmb3IgZXZlcnkgaXNvbGF0ZWQgc3VibmV0IGdyb3VwLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEFsbCBpc29sYXRlZCBzdWJuZXRzIHdpbGwgaGF2ZSB0aGUgbmFtZSBgSXNvbGF0ZWRgXG4gICAqL1xuICByZWFkb25seSBpc29sYXRlZFN1Ym5ldE5hbWVzPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIExpc3Qgb2YgSURzIG9mIHJvdXRlIHRhYmxlcyBmb3IgdGhlIGlzb2xhdGVkIHN1Ym5ldHMuXG4gICAqXG4gICAqIE11c3QgYmUgdW5kZWZpbmVkIG9yIGhhdmUgYSBuYW1lIGZvciBldmVyeSBpc29sYXRlZCBzdWJuZXQgZ3JvdXAuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gUmV0cmlldmluZyB0aGUgcm91dGUgdGFibGUgSUQgb2YgYW55IGlzb2xhdGVkIHN1Ym5ldCB3aWxsIGZhaWxcbiAgICovXG4gIHJlYWRvbmx5IGlzb2xhdGVkU3VibmV0Um91dGVUYWJsZUlkcz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIElQdjQgQ0lEUiBibG9ja3MgZm9yIHRoZSBpc29sYXRlZCBzdWJuZXRzLlxuICAgKlxuICAgKiBNdXN0IGJlIHVuZGVmaW5lZCBvciBoYXZlIGFuIGVudHJ5IGZvciBldmVyeSBpc29sYXRlZCBzdWJuZXQgZ3JvdXAuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gUmV0cmlldmluZyB0aGUgSVB2NCBDSURSIGJsb2NrIG9mIGFueSBpc29sYXRlZCBzdWJuZXQgd2lsbCBmYWlsXG4gICAqL1xuICByZWFkb25seSBpc29sYXRlZFN1Ym5ldElwdjRDaWRyQmxvY2tzPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIFZQTiBnYXRld2F5J3MgaWRlbnRpZmllclxuICAgKi9cbiAgcmVhZG9ubHkgdnBuR2F0ZXdheUlkPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcmVnaW9uIHRoZSBWUEMgaXMgaW5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBUaGUgcmVnaW9uIG9mIHRoZSBzdGFjayB3aGVyZSB0aGUgVlBDIGJlbG9uZ3MgdG9cbiAgICovXG4gIHJlYWRvbmx5IHJlZ2lvbj86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTdWJuZXRBdHRyaWJ1dGVzIHtcblxuICAvKipcbiAgICogVGhlIEF2YWlsYWJpbGl0eSBab25lIHRoZSBzdWJuZXQgaXMgbG9jYXRlZCBpblxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIEFaIGluZm9ybWF0aW9uLCBjYW5ub3QgdXNlIEFaIHNlbGVjdGlvbiBmZWF0dXJlc1xuICAgKi9cbiAgcmVhZG9ubHkgYXZhaWxhYmlsaXR5Wm9uZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIElQdjQgQ0lEUiBibG9jayBhc3NvY2lhdGVkIHdpdGggdGhlIHN1Ym5ldFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIENJRFIgaW5mb3JtYXRpb24sIGNhbm5vdCB1c2UgQ0lEUiBmaWx0ZXIgZmVhdHVyZXNcbiAgICovXG4gIHJlYWRvbmx5IGlwdjRDaWRyQmxvY2s/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBJRCBvZiB0aGUgcm91dGUgdGFibGUgZm9yIHRoaXMgcGFydGljdWxhciBzdWJuZXRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyByb3V0ZSB0YWJsZSBpbmZvcm1hdGlvbiwgY2Fubm90IGNyZWF0ZSBWUEMgZW5kcG9pbnRzXG4gICAqL1xuICByZWFkb25seSByb3V0ZVRhYmxlSWQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBzdWJuZXRJZCBmb3IgdGhpcyBwYXJ0aWN1bGFyIHN1Ym5ldFxuICAgKi9cbiAgcmVhZG9ubHkgc3VibmV0SWQ6IHN0cmluZztcbn1cblxuLyoqXG4gKiBOYW1lIHRhZyBjb25zdGFudFxuICovXG5jb25zdCBOQU1FX1RBRzogc3RyaW5nID0gJ05hbWUnO1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gZm9yIFZwY1xuICovXG5leHBvcnQgaW50ZXJmYWNlIFZwY1Byb3BzIHtcblxuICAvKipcbiAgICogVGhlIFByb3ZpZGVyIHRvIHVzZSB0byBhbGxvY2F0ZSBJUCBTcGFjZSB0byB5b3VyIFZQQy5cbiAgICpcbiAgICogT3B0aW9ucyBpbmNsdWRlIHN0YXRpYyBhbGxvY2F0aW9uIG9yIGZyb20gYSBwb29sLlxuICAgKlxuICAgKiBAZGVmYXVsdCBlYzIuSXBBZGRyZXNzZXMuY2lkclxuICAgKi9cbiAgcmVhZG9ubHkgaXBBZGRyZXNzZXM/OiBJSXBBZGRyZXNzZXM7XG5cbiAgLyoqXG4gICAqIFRoZSBDSURSIHJhbmdlIHRvIHVzZSBmb3IgdGhlIFZQQywgZS5nLiAnMTAuMC4wLjAvMTYnLlxuICAgKlxuICAgKiBTaG91bGQgYmUgYSBtaW5pbXVtIG9mIC8yOCBhbmQgbWF4aW11bSBzaXplIG9mIC8xNi4gVGhlIHJhbmdlIHdpbGwgYmVcbiAgICogc3BsaXQgYWNyb3NzIGFsbCBzdWJuZXRzIHBlciBBdmFpbGFiaWxpdHkgWm9uZS5cbiAgICpcbiAgICogQGRlZmF1bHQgVnBjLkRFRkFVTFRfQ0lEUl9SQU5HRVxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgaXBBZGRyZXNzZXMgaW5zdGVhZFxuICAgKi9cbiAgcmVhZG9ubHkgY2lkcj86IHN0cmluZztcblxuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGluc3RhbmNlcyBsYXVuY2hlZCBpbiB0aGUgVlBDIGdldCBwdWJsaWMgRE5TIGhvc3RuYW1lcy5cbiAgICpcbiAgICogSWYgdGhpcyBhdHRyaWJ1dGUgaXMgdHJ1ZSwgaW5zdGFuY2VzIGluIHRoZSBWUEMgZ2V0IHB1YmxpYyBETlMgaG9zdG5hbWVzLFxuICAgKiBidXQgb25seSBpZiB0aGUgZW5hYmxlRG5zU3VwcG9ydCBhdHRyaWJ1dGUgaXMgYWxzbyBzZXQgdG8gdHJ1ZS5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgZW5hYmxlRG5zSG9zdG5hbWVzPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIEROUyByZXNvbHV0aW9uIGlzIHN1cHBvcnRlZCBmb3IgdGhlIFZQQy5cbiAgICpcbiAgICogSWYgdGhpcyBhdHRyaWJ1dGUgaXMgZmFsc2UsIHRoZSBBbWF6b24tcHJvdmlkZWQgRE5TIHNlcnZlciBpbiB0aGUgVlBDIHRoYXRcbiAgICogcmVzb2x2ZXMgcHVibGljIEROUyBob3N0bmFtZXMgdG8gSVAgYWRkcmVzc2VzIGlzIG5vdCBlbmFibGVkLiBJZiB0aGlzXG4gICAqIGF0dHJpYnV0ZSBpcyB0cnVlLCBxdWVyaWVzIHRvIHRoZSBBbWF6b24gcHJvdmlkZWQgRE5TIHNlcnZlciBhdCB0aGVcbiAgICogMTY5LjI1NC4xNjkuMjUzIElQIGFkZHJlc3MsIG9yIHRoZSByZXNlcnZlZCBJUCBhZGRyZXNzIGF0IHRoZSBiYXNlIG9mIHRoZVxuICAgKiBWUEMgSVB2NCBuZXR3b3JrIHJhbmdlIHBsdXMgdHdvIHdpbGwgc3VjY2VlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgZW5hYmxlRG5zU3VwcG9ydD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSBkZWZhdWx0IHRlbmFuY3kgb2YgaW5zdGFuY2VzIGxhdW5jaGVkIGludG8gdGhlIFZQQy5cbiAgICpcbiAgICogQnkgc2V0dGluZyB0aGlzIHRvIGRlZGljYXRlZCB0ZW5hbmN5LCBpbnN0YW5jZXMgd2lsbCBiZSBsYXVuY2hlZCBvblxuICAgKiBoYXJkd2FyZSBkZWRpY2F0ZWQgdG8gYSBzaW5nbGUgQVdTIGN1c3RvbWVyLCB1bmxlc3Mgc3BlY2lmaWNhbGx5IHNwZWNpZmllZFxuICAgKiBhdCBpbnN0YW5jZSBsYXVuY2ggdGltZS4gUGxlYXNlIG5vdGUsIG5vdCBhbGwgaW5zdGFuY2UgdHlwZXMgYXJlIHVzYWJsZVxuICAgKiB3aXRoIERlZGljYXRlZCB0ZW5hbmN5LlxuICAgKlxuICAgKiBAZGVmYXVsdCBEZWZhdWx0SW5zdGFuY2VUZW5hbmN5LkRlZmF1bHQgKHNoYXJlZCkgdGVuYW5jeVxuICAgKi9cbiAgcmVhZG9ubHkgZGVmYXVsdEluc3RhbmNlVGVuYW5jeT86IERlZmF1bHRJbnN0YW5jZVRlbmFuY3k7XG5cbiAgLyoqXG4gICAqIERlZmluZSB0aGUgbWF4aW11bSBudW1iZXIgb2YgQVpzIHRvIHVzZSBpbiB0aGlzIHJlZ2lvblxuICAgKlxuICAgKiBJZiB0aGUgcmVnaW9uIGhhcyBtb3JlIEFacyB0aGFuIHlvdSB3YW50IHRvIHVzZSAoZm9yIGV4YW1wbGUsIGJlY2F1c2Ugb2ZcbiAgICogRUlQIGxpbWl0cyksIHBpY2sgYSBsb3dlciBudW1iZXIgaGVyZS4gVGhlIEFacyB3aWxsIGJlIHNvcnRlZCBhbmQgcGlja2VkXG4gICAqIGZyb20gdGhlIHN0YXJ0IG9mIHRoZSBsaXN0LlxuICAgKlxuICAgKiBJZiB5b3UgcGljayBhIGhpZ2hlciBudW1iZXIgdGhhbiB0aGUgbnVtYmVyIG9mIEFacyBpbiB0aGUgcmVnaW9uLCBhbGwgQVpzXG4gICAqIGluIHRoZSByZWdpb24gd2lsbCBiZSBzZWxlY3RlZC4gVG8gdXNlIFwiYWxsIEFac1wiIGF2YWlsYWJsZSB0byB5b3VyXG4gICAqIGFjY291bnQsIHVzZSBhIGhpZ2ggbnVtYmVyIChzdWNoIGFzIDk5KS5cbiAgICpcbiAgICogQmUgYXdhcmUgdGhhdCBlbnZpcm9ubWVudC1hZ25vc3RpYyBzdGFja3Mgd2lsbCBiZSBjcmVhdGVkIHdpdGggYWNjZXNzIHRvXG4gICAqIG9ubHkgMiBBWnMsIHNvIHRvIHVzZSBtb3JlIHRoYW4gMiBBWnMsIGJlIHN1cmUgdG8gc3BlY2lmeSB0aGUgYWNjb3VudCBhbmRcbiAgICogcmVnaW9uIG9uIHlvdXIgc3RhY2suXG4gICAqXG4gICAqIFNwZWNpZnkgdGhpcyBvcHRpb24gb25seSBpZiB5b3UgZG8gbm90IHNwZWNpZnkgYGF2YWlsYWJpbGl0eVpvbmVzYC5cbiAgICpcbiAgICogQGRlZmF1bHQgM1xuICAgKi9cbiAgcmVhZG9ubHkgbWF4QXpzPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBEZWZpbmUgdGhlIG51bWJlciBvZiBBWnMgdG8gcmVzZXJ2ZS5cbiAgICpcbiAgICogV2hlbiBzcGVjaWZpZWQsIHRoZSBJUCBzcGFjZSBpcyByZXNlcnZlZCBmb3IgdGhlIGF6cyBidXQgbm8gYWN0dWFsXG4gICAqIHJlc291cmNlcyBhcmUgcHJvdmlzaW9uZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IDBcbiAgICovXG4gIHJlYWRvbmx5IHJlc2VydmVkQXpzPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBBdmFpbGFiaWxpdHkgem9uZXMgdGhpcyBWUEMgc3BhbnMuXG4gICAqXG4gICAqIFNwZWNpZnkgdGhpcyBvcHRpb24gb25seSBpZiB5b3UgZG8gbm90IHNwZWNpZnkgYG1heEF6c2AuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gYSBzdWJzZXQgb2YgQVpzIG9mIHRoZSBzdGFja1xuICAgKi9cbiAgcmVhZG9ubHkgYXZhaWxhYmlsaXR5Wm9uZXM/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBOQVQgR2F0ZXdheXMvSW5zdGFuY2VzIHRvIGNyZWF0ZS5cbiAgICpcbiAgICogVGhlIHR5cGUgb2YgTkFUIGdhdGV3YXkgb3IgaW5zdGFuY2Ugd2lsbCBiZSBkZXRlcm1pbmVkIGJ5IHRoZVxuICAgKiBgbmF0R2F0ZXdheVByb3ZpZGVyYCBwYXJhbWV0ZXIuXG4gICAqXG4gICAqIFlvdSBjYW4gc2V0IHRoaXMgbnVtYmVyIGxvd2VyIHRoYW4gdGhlIG51bWJlciBvZiBBdmFpbGFiaWxpdHkgWm9uZXMgaW4geW91clxuICAgKiBWUEMgaW4gb3JkZXIgdG8gc2F2ZSBvbiBOQVQgY29zdC4gQmUgYXdhcmUgeW91IG1heSBiZSBjaGFyZ2VkIGZvclxuICAgKiBjcm9zcy1BWiBkYXRhIHRyYWZmaWMgaW5zdGVhZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBPbmUgTkFUIGdhdGV3YXkvaW5zdGFuY2UgcGVyIEF2YWlsYWJpbGl0eSBab25lXG4gICAqL1xuICByZWFkb25seSBuYXRHYXRld2F5cz86IG51bWJlcjtcblxuICAvKipcbiAgICogQ29uZmlndXJlcyB0aGUgc3VibmV0cyB3aGljaCB3aWxsIGhhdmUgTkFUIEdhdGV3YXlzL0luc3RhbmNlc1xuICAgKlxuICAgKiBZb3UgY2FuIHBpY2sgYSBzcGVjaWZpYyBncm91cCBvZiBzdWJuZXRzIGJ5IHNwZWNpZnlpbmcgdGhlIGdyb3VwIG5hbWU7XG4gICAqIHRoZSBwaWNrZWQgc3VibmV0cyBtdXN0IGJlIHB1YmxpYyBzdWJuZXRzLlxuICAgKlxuICAgKiBPbmx5IG5lY2Vzc2FyeSBpZiB5b3UgaGF2ZSBtb3JlIHRoYW4gb25lIHB1YmxpYyBzdWJuZXQgZ3JvdXAuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQWxsIHB1YmxpYyBzdWJuZXRzLlxuICAgKi9cbiAgcmVhZG9ubHkgbmF0R2F0ZXdheVN1Ym5ldHM/OiBTdWJuZXRTZWxlY3Rpb247XG5cbiAgLyoqXG4gICAqIFdoYXQgdHlwZSBvZiBOQVQgcHJvdmlkZXIgdG8gdXNlXG4gICAqXG4gICAqIFNlbGVjdCBiZXR3ZWVuIE5BVCBnYXRld2F5cyBvciBOQVQgaW5zdGFuY2VzLiBOQVQgZ2F0ZXdheXNcbiAgICogbWF5IG5vdCBiZSBhdmFpbGFibGUgaW4gYWxsIEFXUyByZWdpb25zLlxuICAgKlxuICAgKiBAZGVmYXVsdCBOYXRQcm92aWRlci5nYXRld2F5KClcbiAgICpcbiAgICovXG4gIHJlYWRvbmx5IG5hdEdhdGV3YXlQcm92aWRlcj86IE5hdFByb3ZpZGVyO1xuXG4gIC8qKlxuICAgKiBDb25maWd1cmUgdGhlIHN1Ym5ldHMgdG8gYnVpbGQgZm9yIGVhY2ggQVpcbiAgICpcbiAgICogRWFjaCBlbnRyeSBpbiB0aGlzIGxpc3QgY29uZmlndXJlcyBhIFN1Ym5ldCBHcm91cDsgZWFjaCBncm91cCB3aWxsIGNvbnRhaW4gYVxuICAgKiBzdWJuZXQgZm9yIGVhY2ggQXZhaWxhYmlsaXR5IFpvbmUuXG4gICAqXG4gICAqIEZvciBleGFtcGxlLCBpZiB5b3Ugd2FudCAxIHB1YmxpYyBzdWJuZXQsIDEgcHJpdmF0ZSBzdWJuZXQsIGFuZCAxIGlzb2xhdGVkXG4gICAqIHN1Ym5ldCBpbiBlYWNoIEFaIHByb3ZpZGUgdGhlIGZvbGxvd2luZzpcbiAgICpcbiAgICogYGBgdHNcbiAgICogbmV3IGVjMi5WcGModGhpcywgJ1ZQQycsIHtcbiAgICogICBzdWJuZXRDb25maWd1cmF0aW9uOiBbXG4gICAqICAgICAge1xuICAgKiAgICAgICAgY2lkck1hc2s6IDI0LFxuICAgKiAgICAgICAgbmFtZTogJ2luZ3Jlc3MnLFxuICAgKiAgICAgICAgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFVCTElDLFxuICAgKiAgICAgIH0sXG4gICAqICAgICAge1xuICAgKiAgICAgICAgY2lkck1hc2s6IDI0LFxuICAgKiAgICAgICAgbmFtZTogJ2FwcGxpY2F0aW9uJyxcbiAgICogICAgICAgIHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9FR1JFU1MsXG4gICAqICAgICAgfSxcbiAgICogICAgICB7XG4gICAqICAgICAgICBjaWRyTWFzazogMjgsXG4gICAqICAgICAgICBuYW1lOiAncmRzJyxcbiAgICogICAgICAgIHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBSSVZBVEVfSVNPTEFURUQsXG4gICAqICAgICAgfVxuICAgKiAgIF1cbiAgICogfSk7XG4gICAqIGBgYFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFRoZSBWUEMgQ0lEUiB3aWxsIGJlIGV2ZW5seSBkaXZpZGVkIGJldHdlZW4gMSBwdWJsaWMgYW5kIDFcbiAgICogcHJpdmF0ZSBzdWJuZXQgcGVyIEFaLlxuICAgKi9cbiAgcmVhZG9ubHkgc3VibmV0Q29uZmlndXJhdGlvbj86IFN1Ym5ldENvbmZpZ3VyYXRpb25bXTtcblxuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgYSBWUE4gZ2F0ZXdheSBzaG91bGQgYmUgY3JlYXRlZCBhbmQgYXR0YWNoZWQgdG8gdGhpcyBWUEMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gdHJ1ZSB3aGVuIHZwbkdhdGV3YXlBc24gb3IgdnBuQ29ubmVjdGlvbnMgaXMgc3BlY2lmaWVkXG4gICAqL1xuICByZWFkb25seSB2cG5HYXRld2F5PzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIHByaXZhdGUgQXV0b25vbW91cyBTeXN0ZW0gTnVtYmVyIChBU04pIGZvciB0aGUgVlBOIGdhdGV3YXkuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQW1hem9uIGRlZmF1bHQgQVNOLlxuICAgKi9cbiAgcmVhZG9ubHkgdnBuR2F0ZXdheUFzbj86IG51bWJlcjtcblxuICAvKipcbiAgICogVlBOIGNvbm5lY3Rpb25zIHRvIHRoaXMgVlBDLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGNvbm5lY3Rpb25zLlxuICAgKi9cbiAgcmVhZG9ubHkgdnBuQ29ubmVjdGlvbnM/OiB7IFtpZDogc3RyaW5nXTogVnBuQ29ubmVjdGlvbk9wdGlvbnMgfVxuXG4gIC8qKlxuICAgKiBXaGVyZSB0byBwcm9wYWdhdGUgVlBOIHJvdXRlcy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBPbiB0aGUgcm91dGUgdGFibGVzIGFzc29jaWF0ZWQgd2l0aCBwcml2YXRlIHN1Ym5ldHMuIElmIG5vXG4gICAqIHByaXZhdGUgc3VibmV0cyBleGlzdHMsIGlzb2xhdGVkIHN1Ym5ldHMgYXJlIHVzZWQuIElmIG5vIGlzb2xhdGVkIHN1Ym5ldHNcbiAgICogZXhpc3RzLCBwdWJsaWMgc3VibmV0cyBhcmUgdXNlZC5cbiAgICovXG4gIHJlYWRvbmx5IHZwblJvdXRlUHJvcGFnYXRpb24/OiBTdWJuZXRTZWxlY3Rpb25bXVxuXG4gIC8qKlxuICAgKiBHYXRld2F5IGVuZHBvaW50cyB0byBhZGQgdG8gdGhpcyBWUEMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm9uZS5cbiAgICovXG4gIHJlYWRvbmx5IGdhdGV3YXlFbmRwb2ludHM/OiB7IFtpZDogc3RyaW5nXTogR2F0ZXdheVZwY0VuZHBvaW50T3B0aW9ucyB9XG5cbiAgLyoqXG4gICAqIEZsb3cgbG9ncyB0byBhZGQgdG8gdGhpcyBWUEMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZmxvdyBsb2dzLlxuICAgKi9cbiAgcmVhZG9ubHkgZmxvd0xvZ3M/OiB7IFtpZDogc3RyaW5nXTogRmxvd0xvZ09wdGlvbnMgfVxuXG4gIC8qKlxuICAgKiBUaGUgVlBDIG5hbWUuXG4gICAqXG4gICAqIFNpbmNlIHRoZSBWUEMgcmVzb3VyY2UgZG9lc24ndCBzdXBwb3J0IHByb3ZpZGluZyBhIHBoeXNpY2FsIG5hbWUsIHRoZSB2YWx1ZSBwcm92aWRlZCBoZXJlIHdpbGwgYmUgcmVjb3JkZWQgaW4gdGhlIGBOYW1lYCB0YWdcbiAgICpcbiAgICogQGRlZmF1bHQgdGhpcy5ub2RlLnBhdGhcbiAgICovXG4gIHJlYWRvbmx5IHZwY05hbWU/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgdGVuYW5jeSBvZiBpbnN0YW5jZXMgbGF1bmNoZWQgaW50byB0aGUgVlBDLlxuICovXG5leHBvcnQgZW51bSBEZWZhdWx0SW5zdGFuY2VUZW5hbmN5IHtcbiAgLyoqXG4gICAqIEluc3RhbmNlcyBjYW4gYmUgbGF1bmNoZWQgd2l0aCBhbnkgdGVuYW5jeS5cbiAgICovXG4gIERFRkFVTFQgPSAnZGVmYXVsdCcsXG5cbiAgLyoqXG4gICAqIEFueSBpbnN0YW5jZSBsYXVuY2hlZCBpbnRvIHRoZSBWUEMgYXV0b21hdGljYWxseSBoYXMgZGVkaWNhdGVkIHRlbmFuY3ksIHVubGVzcyB5b3UgbGF1bmNoIGl0IHdpdGggdGhlIGRlZmF1bHQgdGVuYW5jeS5cbiAgICovXG4gIERFRElDQVRFRCA9ICdkZWRpY2F0ZWQnXG59XG5cbi8qKlxuICogU3BlY2lmeSBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnMgZm9yIGEgc2luZ2xlIHN1Ym5ldCBncm91cCBpbiBhIFZQQy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTdWJuZXRDb25maWd1cmF0aW9uIHtcbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgbGVhZGluZyAxIGJpdHMgaW4gdGhlIHJvdXRpbmcgbWFzay5cbiAgICpcbiAgICogVGhlIG51bWJlciBvZiBhdmFpbGFibGUgSVAgYWRkcmVzc2VzIGluIGVhY2ggc3VibmV0IG9mIHRoaXMgZ3JvdXBcbiAgICogd2lsbCBiZSBlcXVhbCB0byBgMl4oMzIgLSBjaWRyTWFzaykgLSAyYC5cbiAgICpcbiAgICogVmFsaWQgdmFsdWVzIGFyZSBgMTYtLTI4YC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBBdmFpbGFibGUgSVAgc3BhY2UgaXMgZXZlbmx5IGRpdmlkZWQgYWNyb3NzIHN1Ym5ldHMuXG4gICAqL1xuICByZWFkb25seSBjaWRyTWFzaz86IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIHR5cGUgb2YgU3VibmV0IHRvIGNvbmZpZ3VyZS5cbiAgICpcbiAgICogVGhlIFN1Ym5ldCB0eXBlIHdpbGwgY29udHJvbCB0aGUgYWJpbGl0eSB0byByb3V0ZSBhbmQgY29ubmVjdCB0byB0aGVcbiAgICogSW50ZXJuZXQuXG4gICAqL1xuICByZWFkb25seSBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlO1xuXG4gIC8qKlxuICAgKiBMb2dpY2FsIG5hbWUgZm9yIHRoZSBzdWJuZXQgZ3JvdXAuXG4gICAqXG4gICAqIFRoaXMgbmFtZSBjYW4gYmUgdXNlZCB3aGVuIHNlbGVjdGluZyBWUEMgc3VibmV0cyB0byBkaXN0aW5ndWlzaFxuICAgKiBiZXR3ZWVuIGRpZmZlcmVudCBzdWJuZXQgZ3JvdXBzIG9mIHRoZSBzYW1lIHR5cGUuXG4gICAqL1xuICByZWFkb25seSBuYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIENvbnRyb2xzIGlmIHN1Ym5ldCBJUCBzcGFjZSBuZWVkcyB0byBiZSByZXNlcnZlZC5cbiAgICpcbiAgICogV2hlbiB0cnVlLCB0aGUgSVAgc3BhY2UgZm9yIHRoZSBzdWJuZXQgaXMgcmVzZXJ2ZWQgYnV0IG5vIGFjdHVhbFxuICAgKiByZXNvdXJjZXMgYXJlIHByb3Zpc2lvbmVkLiBUaGlzIHNwYWNlIGlzIG9ubHkgZGVwZW5kZW50IG9uIHRoZVxuICAgKiBudW1iZXIgb2YgYXZhaWxhYmlsaXR5IHpvbmVzIGFuZCBvbiBgY2lkck1hc2tgIC0gYWxsIG90aGVyIHN1Ym5ldFxuICAgKiBwcm9wZXJ0aWVzIGFyZSBpZ25vcmVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgcmVzZXJ2ZWQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBDb250cm9scyBpZiBhIHB1YmxpYyBJUCBpcyBhc3NvY2lhdGVkIHRvIGFuIGluc3RhbmNlIGF0IGxhdW5jaFxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlIGluIFN1Ym5ldC5QdWJsaWMsIGZhbHNlIGluIFN1Ym5ldC5Qcml2YXRlIG9yIFN1Ym5ldC5Jc29sYXRlZC5cbiAgICovXG4gIHJlYWRvbmx5IG1hcFB1YmxpY0lwT25MYXVuY2g/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIERlZmluZSBhbiBBV1MgVmlydHVhbCBQcml2YXRlIENsb3VkXG4gKlxuICogU2VlIHRoZSBwYWNrYWdlLWxldmVsIGRvY3VtZW50YXRpb24gb2YgdGhpcyBwYWNrYWdlIGZvciBhbiBvdmVydmlld1xuICogb2YgdGhlIHZhcmlvdXMgZGltZW5zaW9ucyBpbiB3aGljaCB5b3UgY2FuIGNvbmZpZ3VyZSB5b3VyIFZQQy5cbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBgYGB0c1xuICogY29uc3QgdnBjID0gbmV3IGVjMi5WcGModGhpcywgJ1RoZVZQQycsIHtcbiAqICAgaXBBZGRyZXNzZXM6IElwQWRkcmVzc2VzLmNpZHIoJzEwLjAuMC4wLzE2JyksXG4gKiB9KVxuICpcbiAqIC8vIEl0ZXJhdGUgdGhlIHByaXZhdGUgc3VibmV0c1xuICogY29uc3Qgc2VsZWN0aW9uID0gdnBjLnNlbGVjdFN1Ym5ldHMoe1xuICogICBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfRUdSRVNTXG4gKiB9KTtcbiAqXG4gKiBmb3IgKGNvbnN0IHN1Ym5ldCBvZiBzZWxlY3Rpb24uc3VibmV0cykge1xuICogICAvLyAuLi5cbiAqIH1cbiAqIGBgYFxuICpcbiAqIEByZXNvdXJjZSBBV1M6OkVDMjo6VlBDXG4gKi9cbmV4cG9ydCBjbGFzcyBWcGMgZXh0ZW5kcyBWcGNCYXNlIHtcbiAgLyoqXG4gICAqIFRoZSBkZWZhdWx0IENJRFIgcmFuZ2UgdXNlZCB3aGVuIGNyZWF0aW5nIFZQQ3MuXG4gICAqIFRoaXMgY2FuIGJlIG92ZXJyaWRkZW4gdXNpbmcgVnBjUHJvcHMgd2hlbiBjcmVhdGluZyBhIFZQQ05ldHdvcmsgcmVzb3VyY2UuXG4gICAqIGUuZy4gbmV3IFZwY1Jlc291cmNlKHRoaXMsIHsgY2lkcjogJzE5Mi4xNjguMC4wLi8xNicgfSlcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgREVGQVVMVF9DSURSX1JBTkdFOiBzdHJpbmcgPSAnMTAuMC4wLjAvMTYnO1xuXG4gIC8qKlxuICAgKiBUaGUgZGVmYXVsdCBzdWJuZXQgY29uZmlndXJhdGlvblxuICAgKlxuICAgKiAxIFB1YmxpYyBhbmQgMSBQcml2YXRlIHN1Ym5ldCBwZXIgQVogZXZlbmx5IHNwbGl0XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IERFRkFVTFRfU1VCTkVUUzogU3VibmV0Q29uZmlndXJhdGlvbltdID0gW1xuICAgIHtcbiAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgbmFtZTogZGVmYXVsdFN1Ym5ldE5hbWUoU3VibmV0VHlwZS5QVUJMSUMpLFxuICAgIH0sXG4gICAge1xuICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfRUdSRVNTLFxuICAgICAgbmFtZTogZGVmYXVsdFN1Ym5ldE5hbWUoU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfRUdSRVNTKSxcbiAgICB9LFxuICBdO1xuXG4gIC8qKlxuICAgKiBUaGUgZGVmYXVsdCBzdWJuZXQgY29uZmlndXJhdGlvbiBpZiBuYXRHYXRld2F5cyBzcGVjaWZpZWQgdG8gYmUgMFxuICAgKlxuICAgKiAxIFB1YmxpYyBhbmQgMSBJc29sYXRlZCBTdWJuZXQgcGVyIEFaIGV2ZW5seSBzcGxpdFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBERUZBVUxUX1NVQk5FVFNfTk9fTkFUOiBTdWJuZXRDb25maWd1cmF0aW9uW10gPSBbXG4gICAge1xuICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QVUJMSUMsXG4gICAgICBuYW1lOiBkZWZhdWx0U3VibmV0TmFtZShTdWJuZXRUeXBlLlBVQkxJQyksXG4gICAgfSxcbiAgICB7XG4gICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfSVNPTEFURUQsXG4gICAgICBuYW1lOiBkZWZhdWx0U3VibmV0TmFtZShTdWJuZXRUeXBlLlBSSVZBVEVfSVNPTEFURUQpLFxuICAgIH0sXG4gIF07XG5cbiAgLyoqXG4gICAqIEltcG9ydCBhIFZQQyBieSBzdXBwbHlpbmcgYWxsIGF0dHJpYnV0ZXMgZGlyZWN0bHlcbiAgICpcbiAgICogTk9URTogdXNpbmcgYGZyb21WcGNBdHRyaWJ1dGVzKClgIHdpdGggZGVwbG95LXRpbWUgcGFyYW1ldGVycyAobGlrZSBhIGBGbi5pbXBvcnRWYWx1ZSgpYCBvclxuICAgKiBgQ2ZuUGFyYW1ldGVyYCB0byByZXByZXNlbnQgYSBsaXN0IG9mIHN1Ym5ldCBJRHMpIHNvbWV0aW1lcyBhY2NpZGVudGFsbHkgd29ya3MuIEl0IGhhcHBlbnNcbiAgICogdG8gd29yayBmb3IgY29uc3RydWN0cyB0aGF0IG5lZWQgYSBsaXN0IG9mIHN1Ym5ldHMgKGxpa2UgYEF1dG9TY2FsaW5nR3JvdXBgIGFuZCBgZWtzLkNsdXN0ZXJgKVxuICAgKiBidXQgaXQgZG9lcyBub3Qgd29yayBmb3IgY29uc3RydWN0cyB0aGF0IG5lZWQgaW5kaXZpZHVhbCBzdWJuZXRzIChsaWtlXG4gICAqIGBJbnN0YW5jZWApLiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3cy9hd3MtY2RrL2lzc3Vlcy80MTE4IGZvciBtb3JlXG4gICAqIGluZm9ybWF0aW9uLlxuICAgKlxuICAgKiBQcmVmZXIgdG8gdXNlIGBWcGMuZnJvbUxvb2t1cCgpYCBpbnN0ZWFkLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tVnBjQXR0cmlidXRlcyhzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBhdHRyczogVnBjQXR0cmlidXRlcyk6IElWcGMge1xuICAgIHJldHVybiBuZXcgSW1wb3J0ZWRWcGMoc2NvcGUsIGlkLCBhdHRycywgZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcG9ydCBhbiBleGlzdGluZyBWUEMgYnkgcXVlcnlpbmcgdGhlIEFXUyBlbnZpcm9ubWVudCB0aGlzIHN0YWNrIGlzIGRlcGxveWVkIHRvLlxuICAgKlxuICAgKiBUaGlzIGZ1bmN0aW9uIG9ubHkgbmVlZHMgdG8gYmUgdXNlZCB0byB1c2UgVlBDcyBub3QgZGVmaW5lZCBpbiB5b3VyIENES1xuICAgKiBhcHBsaWNhdGlvbi4gSWYgeW91IGFyZSBsb29raW5nIHRvIHNoYXJlIGEgVlBDIGJldHdlZW4gc3RhY2tzLCB5b3UgY2FuXG4gICAqIHBhc3MgdGhlIGBWcGNgIG9iamVjdCBiZXR3ZWVuIHN0YWNrcyBhbmQgdXNlIGl0IGFzIG5vcm1hbC5cbiAgICpcbiAgICogQ2FsbGluZyB0aGlzIG1ldGhvZCB3aWxsIGxlYWQgdG8gYSBsb29rdXAgd2hlbiB0aGUgQ0RLIENMSSBpcyBleGVjdXRlZC5cbiAgICogWW91IGNhbiB0aGVyZWZvcmUgbm90IHVzZSBhbnkgdmFsdWVzIHRoYXQgd2lsbCBvbmx5IGJlIGF2YWlsYWJsZSBhdFxuICAgKiBDbG91ZEZvcm1hdGlvbiBleGVjdXRpb24gdGltZSAoaS5lLiwgVG9rZW5zKS5cbiAgICpcbiAgICogVGhlIFZQQyBpbmZvcm1hdGlvbiB3aWxsIGJlIGNhY2hlZCBpbiBgY2RrLmNvbnRleHQuanNvbmAgYW5kIHRoZSBzYW1lIFZQQ1xuICAgKiB3aWxsIGJlIHVzZWQgb24gZnV0dXJlIHJ1bnMuIFRvIHJlZnJlc2ggdGhlIGxvb2t1cCwgeW91IHdpbGwgaGF2ZSB0b1xuICAgKiBldmljdCB0aGUgdmFsdWUgZnJvbSB0aGUgY2FjaGUgdXNpbmcgdGhlIGBjZGsgY29udGV4dGAgY29tbWFuZC4gU2VlXG4gICAqIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jZGsvbGF0ZXN0L2d1aWRlL2NvbnRleHQuaHRtbCBmb3IgbW9yZSBpbmZvcm1hdGlvbi5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUxvb2t1cChzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBvcHRpb25zOiBWcGNMb29rdXBPcHRpb25zKTogSVZwYyB7XG4gICAgaWYgKFRva2VuLmlzVW5yZXNvbHZlZChvcHRpb25zLnZwY0lkKVxuICAgICAgfHwgVG9rZW4uaXNVbnJlc29sdmVkKG9wdGlvbnMudnBjTmFtZSlcbiAgICAgIHx8IE9iamVjdC52YWx1ZXMob3B0aW9ucy50YWdzIHx8IHt9KS5zb21lKFRva2VuLmlzVW5yZXNvbHZlZClcbiAgICAgIHx8IE9iamVjdC5rZXlzKG9wdGlvbnMudGFncyB8fCB7fSkuc29tZShUb2tlbi5pc1VucmVzb2x2ZWQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FsbCBhcmd1bWVudHMgdG8gVnBjLmZyb21Mb29rdXAoKSBtdXN0IGJlIGNvbmNyZXRlIChubyBUb2tlbnMpJyk7XG4gICAgfVxuXG4gICAgY29uc3QgZmlsdGVyOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSA9IG1ha2VUYWdGaWx0ZXIob3B0aW9ucy50YWdzKTtcblxuICAgIC8vIFdlIGdpdmUgc3BlY2lhbCB0cmVhdG1lbnQgdG8gc29tZSB0YWdzXG4gICAgaWYgKG9wdGlvbnMudnBjSWQpIHsgZmlsdGVyWyd2cGMtaWQnXSA9IG9wdGlvbnMudnBjSWQ7IH1cbiAgICBpZiAob3B0aW9ucy52cGNOYW1lKSB7IGZpbHRlclsndGFnOk5hbWUnXSA9IG9wdGlvbnMudnBjTmFtZTsgfVxuICAgIGlmIChvcHRpb25zLmlzRGVmYXVsdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBmaWx0ZXIuaXNEZWZhdWx0ID0gb3B0aW9ucy5pc0RlZmF1bHQgPyAndHJ1ZScgOiAnZmFsc2UnO1xuICAgIH1cblxuICAgIGNvbnN0IG92ZXJyaWRlczoge1trZXk6IHN0cmluZ106IHN0cmluZ30gPSB7fTtcbiAgICBpZiAob3B0aW9ucy5yZWdpb24pIHtcbiAgICAgIG92ZXJyaWRlcy5yZWdpb24gPSBvcHRpb25zLnJlZ2lvbjtcbiAgICB9XG5cbiAgICBjb25zdCBhdHRyaWJ1dGVzOiBjeGFwaS5WcGNDb250ZXh0UmVzcG9uc2UgPSBDb250ZXh0UHJvdmlkZXIuZ2V0VmFsdWUoc2NvcGUsIHtcbiAgICAgIHByb3ZpZGVyOiBjeHNjaGVtYS5Db250ZXh0UHJvdmlkZXIuVlBDX1BST1ZJREVSLFxuICAgICAgcHJvcHM6IHtcbiAgICAgICAgLi4ub3ZlcnJpZGVzLFxuICAgICAgICBmaWx0ZXIsXG4gICAgICAgIHJldHVybkFzeW1tZXRyaWNTdWJuZXRzOiB0cnVlLFxuICAgICAgICByZXR1cm5WcG5HYXRld2F5czogb3B0aW9ucy5yZXR1cm5WcG5HYXRld2F5cyxcbiAgICAgICAgc3VibmV0R3JvdXBOYW1lVGFnOiBvcHRpb25zLnN1Ym5ldEdyb3VwTmFtZVRhZyxcbiAgICAgIH0gYXMgY3hzY2hlbWEuVnBjQ29udGV4dFF1ZXJ5LFxuICAgICAgZHVtbXlWYWx1ZTogdW5kZWZpbmVkLFxuICAgIH0pLnZhbHVlO1xuXG4gICAgcmV0dXJuIG5ldyBMb29rZWRVcFZwYyhzY29wZSwgaWQsIGF0dHJpYnV0ZXMgPz8gRFVNTVlfVlBDX1BST1BTLCBhdHRyaWJ1dGVzID09PSB1bmRlZmluZWQpO1xuXG4gICAgLyoqXG4gICAgICogUHJlZml4ZXMgYWxsIGtleXMgaW4gdGhlIGFyZ3VtZW50IHdpdGggYHRhZzpgLmBcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtYWtlVGFnRmlsdGVyKHRhZ3M6IHsgW25hbWU6IHN0cmluZ106IHN0cmluZyB9IHwgdW5kZWZpbmVkKTogeyBbbmFtZTogc3RyaW5nXTogc3RyaW5nIH0ge1xuICAgICAgY29uc3QgcmVzdWx0OiB7IFtuYW1lOiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xuICAgICAgZm9yIChjb25zdCBbbmFtZSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHRhZ3MgfHwge30pKSB7XG4gICAgICAgIHJlc3VsdFtgdGFnOiR7bmFtZX1gXSA9IHZhbHVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSWRlbnRpZmllciBmb3IgdGhpcyBWUENcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB2cGNJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgdnBjQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB2cGNDaWRyQmxvY2s6IHN0cmluZztcblxuICAvKipcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHZwY0RlZmF1bHROZXR3b3JrQWNsOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB2cGNDaWRyQmxvY2tBc3NvY2lhdGlvbnM6IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgdnBjRGVmYXVsdFNlY3VyaXR5R3JvdXA6IHN0cmluZztcblxuICAvKipcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHZwY0lwdjZDaWRyQmxvY2tzOiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogTGlzdCBvZiBwdWJsaWMgc3VibmV0cyBpbiB0aGlzIFZQQ1xuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHB1YmxpY1N1Ym5ldHM6IElTdWJuZXRbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIHByaXZhdGUgc3VibmV0cyBpbiB0aGlzIFZQQ1xuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHByaXZhdGVTdWJuZXRzOiBJU3VibmV0W10gPSBbXTtcblxuICAvKipcbiAgICogTGlzdCBvZiBpc29sYXRlZCBzdWJuZXRzIGluIHRoaXMgVlBDXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgaXNvbGF0ZWRTdWJuZXRzOiBJU3VibmV0W10gPSBbXTtcblxuICAvKipcbiAgICogQVpzIGZvciB0aGlzIFZQQ1xuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGF2YWlsYWJpbGl0eVpvbmVzOiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogSW50ZXJuZXQgR2F0ZXdheSBmb3IgdGhlIFZQQy4gTm90ZSB0aGF0IGluIGNhc2UgdGhlIFZQQyBpcyBjb25maWd1cmVkIG9ubHlcbiAgICogd2l0aCBJU09MQVRFRCBzdWJuZXRzLCB0aGlzIGF0dHJpYnV0ZSB3aWxsIGJlIGB1bmRlZmluZWRgLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGludGVybmV0R2F0ZXdheUlkPzogc3RyaW5nO1xuXG4gIHB1YmxpYyByZWFkb25seSBpbnRlcm5ldENvbm5lY3Rpdml0eUVzdGFibGlzaGVkOiBJRGVwZW5kYWJsZTtcblxuICAvKipcbiAgICogSW5kaWNhdGVzIGlmIGluc3RhbmNlcyBsYXVuY2hlZCBpbiB0aGlzIFZQQyB3aWxsIGhhdmUgcHVibGljIEROUyBob3N0bmFtZXMuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZG5zSG9zdG5hbWVzRW5hYmxlZDogYm9vbGVhbjtcblxuICAvKipcbiAgICogSW5kaWNhdGVzIGlmIEROUyBzdXBwb3J0IGlzIGVuYWJsZWQgZm9yIHRoaXMgVlBDLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGRuc1N1cHBvcnRFbmFibGVkOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgVlBDIHJlc291cmNlXG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IHJlc291cmNlOiBDZm5WUEM7XG5cbiAgLyoqXG4gICAqIFRoZSBwcm92aWRlciBvZiBpcCBhZGRyZXNzZXNcbiAgICovXG4gIHByaXZhdGUgcmVhZG9ubHkgaXBBZGRyZXNzZXM6IElJcEFkZHJlc3NlcztcblxuICAvKipcbiAgICogU3VibmV0IGNvbmZpZ3VyYXRpb25zIGZvciB0aGlzIFZQQ1xuICAgKi9cbiAgcHJpdmF0ZSBzdWJuZXRDb25maWd1cmF0aW9uOiBTdWJuZXRDb25maWd1cmF0aW9uW10gPSBbXTtcblxuICBwcml2YXRlIHJlYWRvbmx5IF9pbnRlcm5ldENvbm5lY3Rpdml0eUVzdGFibGlzaGVkID0gbmV3IERlcGVuZGVuY3lHcm91cCgpO1xuXG4gIC8qKlxuICAgKiBWcGMgY3JlYXRlcyBhIFZQQyB0aGF0IHNwYW5zIGEgd2hvbGUgcmVnaW9uLlxuICAgKiBJdCB3aWxsIGF1dG9tYXRpY2FsbHkgZGl2aWRlIHRoZSBwcm92aWRlZCBWUEMgQ0lEUiByYW5nZSwgYW5kIGNyZWF0ZSBwdWJsaWMgYW5kIHByaXZhdGUgc3VibmV0cyBwZXIgQXZhaWxhYmlsaXR5IFpvbmUuXG4gICAqIE5ldHdvcmsgcm91dGluZyBmb3IgdGhlIHB1YmxpYyBzdWJuZXRzIHdpbGwgYmUgY29uZmlndXJlZCB0byBhbGxvdyBvdXRib3VuZCBhY2Nlc3MgZGlyZWN0bHkgdmlhIGFuIEludGVybmV0IEdhdGV3YXkuXG4gICAqIE5ldHdvcmsgcm91dGluZyBmb3IgdGhlIHByaXZhdGUgc3VibmV0cyB3aWxsIGJlIGNvbmZpZ3VyZWQgdG8gYWxsb3cgb3V0Ym91bmQgYWNjZXNzIHZpYSBhIHNldCBvZiByZXNpbGllbnQgTkFUIEdhdGV3YXlzIChvbmUgcGVyIEFaKS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBWcGNQcm9wcyA9IHt9KSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IHN0YWNrID0gU3RhY2sub2YodGhpcyk7XG5cbiAgICAvLyBDYW4ndCBoYXZlIGVuYWJsZWREbnNIb3N0bmFtZXMgd2l0aG91dCBlbmFibGVEbnNTdXBwb3J0XG4gICAgaWYgKHByb3BzLmVuYWJsZURuc0hvc3RuYW1lcyAmJiAhcHJvcHMuZW5hYmxlRG5zU3VwcG9ydCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUbyB1c2UgRE5TIEhvc3RuYW1lcywgRE5TIFN1cHBvcnQgbXVzdCBiZSBlbmFibGVkLCBob3dldmVyLCBpdCB3YXMgZXhwbGljaXRseSBkaXNhYmxlZC4nKTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMuYXZhaWxhYmlsaXR5Wm9uZXMgJiYgcHJvcHMubWF4QXpzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1ZwYyBzdXBwb3J0cyBcXCdhdmFpbGFiaWxpdHlab25lc1xcJyBvciBcXCdtYXhBenNcXCcsIGJ1dCBub3QgYm90aC4nKTtcbiAgICB9XG5cbiAgICBjb25zdCBjaWRyQmxvY2sgPSBpZlVuZGVmaW5lZChwcm9wcy5jaWRyLCBWcGMuREVGQVVMVF9DSURSX1JBTkdFKTtcbiAgICBpZiAoVG9rZW4uaXNVbnJlc29sdmVkKGNpZHJCbG9jaykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignXFwnY2lkclxcJyBwcm9wZXJ0eSBtdXN0IGJlIGEgY29uY3JldGUgQ0lEUiBzdHJpbmcsIGdvdCBhIFRva2VuICh3ZSBuZWVkIHRvIHBhcnNlIGl0IGZvciBhdXRvbWF0aWMgc3ViZGl2aXNpb24pJyk7XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLmlwQWRkcmVzc2VzICYmIHByb3BzLmNpZHIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignc3VwcGx5IGF0IG1vc3Qgb25lIG9mIGlwQWRkcmVzc2VzIG9yIGNpZHInKTtcbiAgICB9XG5cbiAgICB0aGlzLmlwQWRkcmVzc2VzID0gcHJvcHMuaXBBZGRyZXNzZXMgPz8gSXBBZGRyZXNzZXMuY2lkcihjaWRyQmxvY2spO1xuXG4gICAgdGhpcy5kbnNIb3N0bmFtZXNFbmFibGVkID0gcHJvcHMuZW5hYmxlRG5zSG9zdG5hbWVzID09IG51bGwgPyB0cnVlIDogcHJvcHMuZW5hYmxlRG5zSG9zdG5hbWVzO1xuICAgIHRoaXMuZG5zU3VwcG9ydEVuYWJsZWQgPSBwcm9wcy5lbmFibGVEbnNTdXBwb3J0ID09IG51bGwgPyB0cnVlIDogcHJvcHMuZW5hYmxlRG5zU3VwcG9ydDtcbiAgICBjb25zdCBpbnN0YW5jZVRlbmFuY3kgPSBwcm9wcy5kZWZhdWx0SW5zdGFuY2VUZW5hbmN5IHx8ICdkZWZhdWx0JztcbiAgICB0aGlzLmludGVybmV0Q29ubmVjdGl2aXR5RXN0YWJsaXNoZWQgPSB0aGlzLl9pbnRlcm5ldENvbm5lY3Rpdml0eUVzdGFibGlzaGVkO1xuXG4gICAgY29uc3QgdnBjSXBBZGRyZXNzT3B0aW9ucyA9IHRoaXMuaXBBZGRyZXNzZXMuYWxsb2NhdGVWcGNDaWRyKCk7XG5cbiAgICAvLyBEZWZpbmUgYSBWUEMgdXNpbmcgdGhlIHByb3ZpZGVkIENJRFIgcmFuZ2VcbiAgICB0aGlzLnJlc291cmNlID0gbmV3IENmblZQQyh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBjaWRyQmxvY2s6IHZwY0lwQWRkcmVzc09wdGlvbnMuY2lkckJsb2NrLFxuICAgICAgaXB2NElwYW1Qb29sSWQ6IHZwY0lwQWRkcmVzc09wdGlvbnMuaXB2NElwYW1Qb29sSWQsXG4gICAgICBpcHY0TmV0bWFza0xlbmd0aDogdnBjSXBBZGRyZXNzT3B0aW9ucy5pcHY0TmV0bWFza0xlbmd0aCxcbiAgICAgIGVuYWJsZURuc0hvc3RuYW1lczogdGhpcy5kbnNIb3N0bmFtZXNFbmFibGVkLFxuICAgICAgZW5hYmxlRG5zU3VwcG9ydDogdGhpcy5kbnNTdXBwb3J0RW5hYmxlZCxcbiAgICAgIGluc3RhbmNlVGVuYW5jeSxcbiAgICB9KTtcblxuICAgIHRoaXMudnBjRGVmYXVsdE5ldHdvcmtBY2wgPSB0aGlzLnJlc291cmNlLmF0dHJEZWZhdWx0TmV0d29ya0FjbDtcbiAgICB0aGlzLnZwY0NpZHJCbG9ja0Fzc29jaWF0aW9ucyA9IHRoaXMucmVzb3VyY2UuYXR0ckNpZHJCbG9ja0Fzc29jaWF0aW9ucztcbiAgICB0aGlzLnZwY0NpZHJCbG9jayA9IHRoaXMucmVzb3VyY2UuYXR0ckNpZHJCbG9jaztcbiAgICB0aGlzLnZwY0RlZmF1bHRTZWN1cml0eUdyb3VwID0gdGhpcy5yZXNvdXJjZS5hdHRyRGVmYXVsdFNlY3VyaXR5R3JvdXA7XG4gICAgdGhpcy52cGNJcHY2Q2lkckJsb2NrcyA9IHRoaXMucmVzb3VyY2UuYXR0cklwdjZDaWRyQmxvY2tzO1xuXG4gICAgVGFncy5vZih0aGlzKS5hZGQoTkFNRV9UQUcsIHByb3BzLnZwY05hbWUgfHwgdGhpcy5ub2RlLnBhdGgpO1xuXG4gICAgaWYgKHByb3BzLmF2YWlsYWJpbGl0eVpvbmVzKSB7XG4gICAgICAvLyBJZiBnaXZlbiBBWnMgYW5kIHN0YWNrIEFacyBhcmUgYm90aCByZXNvbHZlZCwgdGhlbiB2YWxpZGF0ZSB0aGVpciBjb21wYXRpYmlsaXR5LlxuICAgICAgY29uc3QgcmVzb2x2ZWRTdGFja0F6cyA9IHN0YWNrLmF2YWlsYWJpbGl0eVpvbmVzLmZpbHRlcihheiA9PiAhVG9rZW4uaXNVbnJlc29sdmVkKGF6KSk7XG4gICAgICBjb25zdCBhcmVHaXZlbkF6c1N1YnNldE9mU3RhY2sgPSByZXNvbHZlZFN0YWNrQXpzLmxlbmd0aCA9PT0gMCAvLyBzdGFjayBBWnMgYXJlIHRva2VuaXplZCwgc28gd2UgY2Fubm90IHZhbGlkYXRlIGl0XG4gICAgICAgIHx8IHByb3BzLmF2YWlsYWJpbGl0eVpvbmVzLmV2ZXJ5KFxuICAgICAgICAgIGF6ID0+IFRva2VuLmlzVW5yZXNvbHZlZChheikgLy8gZ2l2ZW4gQVogaXMgdG9rZW5pemVkLCBzdWNoIGFzIGluIGludGVnIHRlc3RzLCBzbyB3ZSBjYW5ub3QgdmFsaWRhdGUgaXRcbiAgICAgICAgICAgIHx8IHJlc29sdmVkU3RhY2tBenMuaW5jbHVkZXMoYXopKTtcbiAgICAgIGlmICghYXJlR2l2ZW5BenNTdWJzZXRPZlN0YWNrKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgR2l2ZW4gVlBDICdhdmFpbGFiaWxpdHlab25lcycgJHtwcm9wcy5hdmFpbGFiaWxpdHlab25lc30gbXVzdCBiZSBhIHN1YnNldCBvZiB0aGUgc3RhY2sncyBhdmFpbGFiaWxpdHkgem9uZXMgJHtzdGFjay5hdmFpbGFiaWxpdHlab25lc31gKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuYXZhaWxhYmlsaXR5Wm9uZXMgPSBwcm9wcy5hdmFpbGFiaWxpdHlab25lcztcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgbWF4QVpzID0gcHJvcHMubWF4QXpzID8/IDM7XG4gICAgICB0aGlzLmF2YWlsYWJpbGl0eVpvbmVzID0gc3RhY2suYXZhaWxhYmlsaXR5Wm9uZXMuc2xpY2UoMCwgbWF4QVpzKTtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IHByb3BzLnJlc2VydmVkQXpzICYmIGkgPCBwcm9wcy5yZXNlcnZlZEF6czsgaSsrKSB7XG4gICAgICB0aGlzLmF2YWlsYWJpbGl0eVpvbmVzLnB1c2goRkFLRV9BWl9OQU1FKTtcbiAgICB9XG5cblxuICAgIHRoaXMudnBjSWQgPSB0aGlzLnJlc291cmNlLnJlZjtcbiAgICB0aGlzLnZwY0FybiA9IEFybi5mb3JtYXQoe1xuICAgICAgc2VydmljZTogJ2VjMicsXG4gICAgICByZXNvdXJjZTogJ3ZwYycsXG4gICAgICByZXNvdXJjZU5hbWU6IHRoaXMudnBjSWQsXG4gICAgfSwgc3RhY2spO1xuXG4gICAgY29uc3QgZGVmYXVsdFN1Ym5ldCA9IHByb3BzLm5hdEdhdGV3YXlzID09PSAwID8gVnBjLkRFRkFVTFRfU1VCTkVUU19OT19OQVQgOiBWcGMuREVGQVVMVF9TVUJORVRTO1xuICAgIHRoaXMuc3VibmV0Q29uZmlndXJhdGlvbiA9IGlmVW5kZWZpbmVkKHByb3BzLnN1Ym5ldENvbmZpZ3VyYXRpb24sIGRlZmF1bHRTdWJuZXQpO1xuXG4gICAgY29uc3QgbmF0R2F0ZXdheVBsYWNlbWVudCA9IHByb3BzLm5hdEdhdGV3YXlTdWJuZXRzIHx8IHsgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QVUJMSUMgfTtcbiAgICBjb25zdCBuYXRHYXRld2F5Q291bnQgPSBkZXRlcm1pbmVOYXRHYXRld2F5Q291bnQocHJvcHMubmF0R2F0ZXdheXMsIHRoaXMuc3VibmV0Q29uZmlndXJhdGlvbiwgdGhpcy5hdmFpbGFiaWxpdHlab25lcy5sZW5ndGgpO1xuXG4gICAgLy8gc3VibmV0Q29uZmlndXJhdGlvbiBtdXN0IGJlIHNldCBiZWZvcmUgY2FsbGluZyBjcmVhdGVTdWJuZXRzXG4gICAgdGhpcy5jcmVhdGVTdWJuZXRzKCk7XG5cbiAgICBjb25zdCBhbGxvd091dGJvdW5kID0gdGhpcy5zdWJuZXRDb25maWd1cmF0aW9uLmZpbHRlcihcbiAgICAgIHN1Ym5ldCA9PiAoc3VibmV0LnN1Ym5ldFR5cGUgIT09IFN1Ym5ldFR5cGUuUFJJVkFURV9JU09MQVRFRCAmJiBzdWJuZXQuc3VibmV0VHlwZSAhPT0gU3VibmV0VHlwZS5JU09MQVRFRCkpLmxlbmd0aCA+IDA7XG5cbiAgICAvLyBDcmVhdGUgYW4gSW50ZXJuZXQgR2F0ZXdheSBhbmQgYXR0YWNoIGl0IGlmIG5lY2Vzc2FyeVxuICAgIGlmIChhbGxvd091dGJvdW5kKSB7XG4gICAgICBjb25zdCBpZ3cgPSBuZXcgQ2ZuSW50ZXJuZXRHYXRld2F5KHRoaXMsICdJR1cnLCB7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5pbnRlcm5ldEdhdGV3YXlJZCA9IGlndy5yZWY7XG5cbiAgICAgIHRoaXMuX2ludGVybmV0Q29ubmVjdGl2aXR5RXN0YWJsaXNoZWQuYWRkKGlndyk7XG4gICAgICBjb25zdCBhdHQgPSBuZXcgQ2ZuVlBDR2F0ZXdheUF0dGFjaG1lbnQodGhpcywgJ1ZQQ0dXJywge1xuICAgICAgICBpbnRlcm5ldEdhdGV3YXlJZDogaWd3LnJlZixcbiAgICAgICAgdnBjSWQ6IHRoaXMucmVzb3VyY2UucmVmLFxuICAgICAgfSk7XG5cbiAgICAgICh0aGlzLnB1YmxpY1N1Ym5ldHMgYXMgUHVibGljU3VibmV0W10pLmZvckVhY2gocHVibGljU3VibmV0ID0+IHtcbiAgICAgICAgcHVibGljU3VibmV0LmFkZERlZmF1bHRJbnRlcm5ldFJvdXRlKGlndy5yZWYsIGF0dCk7XG4gICAgICB9KTtcblxuICAgICAgLy8gaWYgZ2F0ZXdheXMgYXJlIG5lZWRlZCBjcmVhdGUgdGhlbVxuICAgICAgaWYgKG5hdEdhdGV3YXlDb3VudCA+IDApIHtcbiAgICAgICAgY29uc3QgcHJvdmlkZXIgPSBwcm9wcy5uYXRHYXRld2F5UHJvdmlkZXIgfHwgTmF0UHJvdmlkZXIuZ2F0ZXdheSgpO1xuICAgICAgICB0aGlzLmNyZWF0ZU5hdEdhdGV3YXlzKHByb3ZpZGVyLCBuYXRHYXRld2F5Q291bnQsIG5hdEdhdGV3YXlQbGFjZW1lbnQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwcm9wcy52cG5HYXRld2F5ICYmIHRoaXMucHVibGljU3VibmV0cy5sZW5ndGggPT09IDAgJiYgdGhpcy5wcml2YXRlU3VibmV0cy5sZW5ndGggPT09IDAgJiYgdGhpcy5pc29sYXRlZFN1Ym5ldHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhbiBub3QgZW5hYmxlIHRoZSBWUE4gZ2F0ZXdheSB3aGlsZSB0aGUgVlBDIGhhcyBubyBzdWJuZXRzIGF0IGFsbCcpO1xuICAgIH1cblxuICAgIGlmICgocHJvcHMudnBuQ29ubmVjdGlvbnMgfHwgcHJvcHMudnBuR2F0ZXdheUFzbikgJiYgcHJvcHMudnBuR2F0ZXdheSA9PT0gZmFsc2UpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHNwZWNpZnkgYHZwbkNvbm5lY3Rpb25zYCBvciBgdnBuR2F0ZXdheUFzbmAgd2hlbiBgdnBuR2F0ZXdheWAgaXMgc2V0IHRvIGZhbHNlLicpO1xuICAgIH1cblxuICAgIGlmIChwcm9wcy52cG5HYXRld2F5IHx8IHByb3BzLnZwbkNvbm5lY3Rpb25zIHx8IHByb3BzLnZwbkdhdGV3YXlBc24pIHtcbiAgICAgIHRoaXMuZW5hYmxlVnBuR2F0ZXdheSh7XG4gICAgICAgIGFtYXpvblNpZGVBc246IHByb3BzLnZwbkdhdGV3YXlBc24sXG4gICAgICAgIHR5cGU6IFZwbkNvbm5lY3Rpb25UeXBlLklQU0VDXzEsXG4gICAgICAgIHZwblJvdXRlUHJvcGFnYXRpb246IHByb3BzLnZwblJvdXRlUHJvcGFnYXRpb24sXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgdnBuQ29ubmVjdGlvbnMgPSBwcm9wcy52cG5Db25uZWN0aW9ucyB8fCB7fTtcbiAgICAgIGZvciAoY29uc3QgW2Nvbm5lY3Rpb25JZCwgY29ubmVjdGlvbl0gb2YgT2JqZWN0LmVudHJpZXModnBuQ29ubmVjdGlvbnMpKSB7XG4gICAgICAgIHRoaXMuYWRkVnBuQ29ubmVjdGlvbihjb25uZWN0aW9uSWQsIGNvbm5lY3Rpb24pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFsbG93IGNyZWF0aW9uIG9mIGdhdGV3YXkgZW5kcG9pbnRzIG9uIFZQQyBpbnN0YW50aWF0aW9uIGFzIHRob3NlIGNhbiBiZVxuICAgIC8vIGltbWVkaWF0ZWx5IGZ1bmN0aW9uYWwgd2l0aG91dCBmdXJ0aGVyIGNvbmZpZ3VyYXRpb24uIFRoaXMgaXMgbm90IHRoZSBjYXNlXG4gICAgLy8gZm9yIGludGVyZmFjZSBlbmRwb2ludHMgd2hlcmUgdGhlIHNlY3VyaXR5IGdyb3VwIG11c3QgYmUgY29uZmlndXJlZC5cbiAgICBpZiAocHJvcHMuZ2F0ZXdheUVuZHBvaW50cykge1xuICAgICAgY29uc3QgZ2F0ZXdheUVuZHBvaW50cyA9IHByb3BzLmdhdGV3YXlFbmRwb2ludHMgfHwge307XG4gICAgICBmb3IgKGNvbnN0IFtlbmRwb2ludElkLCBlbmRwb2ludF0gb2YgT2JqZWN0LmVudHJpZXMoZ2F0ZXdheUVuZHBvaW50cykpIHtcbiAgICAgICAgdGhpcy5hZGRHYXRld2F5RW5kcG9pbnQoZW5kcG9pbnRJZCwgZW5kcG9pbnQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFkZCBmbG93IGxvZ3MgdG8gdGhlIFZQQ1xuICAgIGlmIChwcm9wcy5mbG93TG9ncykge1xuICAgICAgY29uc3QgZmxvd0xvZ3MgPSBwcm9wcy5mbG93TG9ncyB8fCB7fTtcbiAgICAgIGZvciAoY29uc3QgW2Zsb3dMb2dJZCwgZmxvd0xvZ10gb2YgT2JqZWN0LmVudHJpZXMoZmxvd0xvZ3MpKSB7XG4gICAgICAgIHRoaXMuYWRkRmxvd0xvZyhmbG93TG9nSWQsIGZsb3dMb2cpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgbmV3IFMzIGdhdGV3YXkgZW5kcG9pbnQgdG8gdGhpcyBWUENcbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgdXNlIGBhZGRHYXRld2F5RW5kcG9pbnQoKWAgaW5zdGVhZFxuICAgKi9cbiAgcHVibGljIGFkZFMzRW5kcG9pbnQoaWQ6IHN0cmluZywgc3VibmV0cz86IFN1Ym5ldFNlbGVjdGlvbltdKTogR2F0ZXdheVZwY0VuZHBvaW50IHtcbiAgICByZXR1cm4gbmV3IEdhdGV3YXlWcGNFbmRwb2ludCh0aGlzLCBpZCwge1xuICAgICAgc2VydmljZTogR2F0ZXdheVZwY0VuZHBvaW50QXdzU2VydmljZS5TMyxcbiAgICAgIHZwYzogdGhpcyxcbiAgICAgIHN1Ym5ldHMsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIG5ldyBEeW5hbW9EQiBnYXRld2F5IGVuZHBvaW50IHRvIHRoaXMgVlBDXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIHVzZSBgYWRkR2F0ZXdheUVuZHBvaW50KClgIGluc3RlYWRcbiAgICovXG4gIHB1YmxpYyBhZGREeW5hbW9EYkVuZHBvaW50KGlkOiBzdHJpbmcsIHN1Ym5ldHM/OiBTdWJuZXRTZWxlY3Rpb25bXSk6IEdhdGV3YXlWcGNFbmRwb2ludCB7XG4gICAgcmV0dXJuIG5ldyBHYXRld2F5VnBjRW5kcG9pbnQodGhpcywgaWQsIHtcbiAgICAgIHNlcnZpY2U6IEdhdGV3YXlWcGNFbmRwb2ludEF3c1NlcnZpY2UuRFlOQU1PREIsXG4gICAgICB2cGM6IHRoaXMsXG4gICAgICBzdWJuZXRzLFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVOYXRHYXRld2F5cyhwcm92aWRlcjogTmF0UHJvdmlkZXIsIG5hdENvdW50OiBudW1iZXIsIHBsYWNlbWVudDogU3VibmV0U2VsZWN0aW9uKTogdm9pZCB7XG4gICAgY29uc3QgbmF0U3VibmV0czogUHVibGljU3VibmV0W10gPSB0aGlzLnNlbGVjdFN1Ym5ldE9iamVjdHMocGxhY2VtZW50KSBhcyBQdWJsaWNTdWJuZXRbXTtcbiAgICBmb3IgKGNvbnN0IHN1YiBvZiBuYXRTdWJuZXRzKSB7XG4gICAgICBpZiAodGhpcy5wdWJsaWNTdWJuZXRzLmluZGV4T2Yoc3ViKSA9PT0gLTEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBuYXRHYXRld2F5UGxhY2VtZW50ICR7cGxhY2VtZW50fSBjb250YWlucyBub24gcHVibGljIHN1Ym5ldCAke3N1Yn1gKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwcm92aWRlci5jb25maWd1cmVOYXQoe1xuICAgICAgdnBjOiB0aGlzLFxuICAgICAgbmF0U3VibmV0czogbmF0U3VibmV0cy5zbGljZSgwLCBuYXRDb3VudCksXG4gICAgICBwcml2YXRlU3VibmV0czogdGhpcy5wcml2YXRlU3VibmV0cyBhcyBQcml2YXRlU3VibmV0W10sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogY3JlYXRlU3VibmV0cyBjcmVhdGVzIHRoZSBzdWJuZXRzIHNwZWNpZmllZCBieSB0aGUgc3VibmV0IGNvbmZpZ3VyYXRpb25cbiAgICogYXJyYXkgb3IgY3JlYXRlcyB0aGUgYERFRkFVTFRfU1VCTkVUU2AgY29uZmlndXJhdGlvblxuICAgKi9cbiAgcHJpdmF0ZSBjcmVhdGVTdWJuZXRzKCkge1xuXG4gICAgY29uc3QgcmVxdWVzdGVkU3VibmV0czogUmVxdWVzdGVkU3VibmV0W10gPSBbXTtcblxuICAgIHRoaXMuc3VibmV0Q29uZmlndXJhdGlvbi5mb3JFYWNoKChjb25maWd1cmF0aW9uKT0+IChcbiAgICAgIHRoaXMuYXZhaWxhYmlsaXR5Wm9uZXMuZm9yRWFjaCgoYXosIGluZGV4KSA9PiB7XG4gICAgICAgIHJlcXVlc3RlZFN1Ym5ldHMucHVzaCh7XG4gICAgICAgICAgYXZhaWxhYmlsaXR5Wm9uZTogYXosXG4gICAgICAgICAgc3VibmV0Q29uc3RydWN0SWQ6IHN1Ym5ldElkKGNvbmZpZ3VyYXRpb24ubmFtZSwgaW5kZXgpLFxuICAgICAgICAgIGNvbmZpZ3VyYXRpb24sXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgICkpKTtcblxuICAgIGNvbnN0IHsgYWxsb2NhdGVkU3VibmV0cyB9ID0gdGhpcy5pcEFkZHJlc3Nlcy5hbGxvY2F0ZVN1Ym5ldHNDaWRyKHtcbiAgICAgIHZwY0NpZHI6IHRoaXMudnBjQ2lkckJsb2NrLFxuICAgICAgcmVxdWVzdGVkU3VibmV0cyxcbiAgICB9KTtcblxuICAgIGlmIChhbGxvY2F0ZWRTdWJuZXRzLmxlbmd0aCAhPSByZXF1ZXN0ZWRTdWJuZXRzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbmNvbXBsZXRlIFN1Ym5ldCBBbGxvY2F0aW9uOyByZXNwb25zZSBhcnJheSBkb3NlIG5vdCBlcXVhbCBpbnB1dCBhcnJheScpO1xuICAgIH1cblxuICAgIHRoaXMuY3JlYXRlU3VibmV0UmVzb3VyY2VzKHJlcXVlc3RlZFN1Ym5ldHMsIGFsbG9jYXRlZFN1Ym5ldHMpO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVTdWJuZXRSZXNvdXJjZXMocmVxdWVzdGVkU3VibmV0czogUmVxdWVzdGVkU3VibmV0W10sIGFsbG9jYXRlZFN1Ym5ldHM6IEFsbG9jYXRlZFN1Ym5ldFtdKSB7XG4gICAgYWxsb2NhdGVkU3VibmV0cy5mb3JFYWNoKChhbGxvY2F0ZWQsIGkpID0+IHtcblxuICAgICAgY29uc3QgeyBjb25maWd1cmF0aW9uOiBzdWJuZXRDb25maWcsIHN1Ym5ldENvbnN0cnVjdElkLCBhdmFpbGFiaWxpdHlab25lIH0gPSByZXF1ZXN0ZWRTdWJuZXRzW2ldO1xuXG4gICAgICBpZiAoc3VibmV0Q29uZmlnLnJlc2VydmVkID09PSB0cnVlKSB7XG4gICAgICAgIC8vIEZvciByZXNlcnZlZCBzdWJuZXRzLCBkbyBub3QgY3JlYXRlIGFueSByZXNvdXJjZXNcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGF2YWlsYWJpbGl0eVpvbmUgPT09IEZBS0VfQVpfTkFNRSkge1xuICAgICAgICAvLyBGb3IgcmVzZXJ2ZWQgYXpzLCBkbyBub3QgY3JlYXRlIGFueSByZXNvdXJjZXNcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBtYXBQdWJsaWNJcE9uTGF1bmNoIHRydWUgaW4gU3VibmV0LlB1YmxpYywgZmFsc2UgaW4gU3VibmV0LlByaXZhdGUgb3IgU3VibmV0Lklzb2xhdGVkLlxuICAgICAgbGV0IG1hcFB1YmxpY0lwT25MYXVuY2ggPSBmYWxzZTtcbiAgICAgIGlmIChzdWJuZXRDb25maWcuc3VibmV0VHlwZSAhPT0gU3VibmV0VHlwZS5QVUJMSUMgJiYgc3VibmV0Q29uZmlnLm1hcFB1YmxpY0lwT25MYXVuY2ggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7c3VibmV0Q29uZmlnLnN1Ym5ldFR5cGV9IHN1Ym5ldCBjYW5ub3QgaW5jbHVkZSBtYXBQdWJsaWNJcE9uTGF1bmNoIHBhcmFtZXRlcmApO1xuICAgICAgfVxuICAgICAgaWYgKHN1Ym5ldENvbmZpZy5zdWJuZXRUeXBlID09PSBTdWJuZXRUeXBlLlBVQkxJQykge1xuICAgICAgICBtYXBQdWJsaWNJcE9uTGF1bmNoID0gKHN1Ym5ldENvbmZpZy5tYXBQdWJsaWNJcE9uTGF1bmNoICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgPyBzdWJuZXRDb25maWcubWFwUHVibGljSXBPbkxhdW5jaFxuICAgICAgICAgIDogdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc3VibmV0UHJvcHM6IFN1Ym5ldFByb3BzID0ge1xuICAgICAgICBhdmFpbGFiaWxpdHlab25lLFxuICAgICAgICB2cGNJZDogdGhpcy52cGNJZCxcbiAgICAgICAgY2lkckJsb2NrOiBhbGxvY2F0ZWQuY2lkcixcbiAgICAgICAgbWFwUHVibGljSXBPbkxhdW5jaDogbWFwUHVibGljSXBPbkxhdW5jaCxcbiAgICAgIH07XG5cbiAgICAgIGxldCBzdWJuZXQ6IFN1Ym5ldDtcbiAgICAgIHN3aXRjaCAoc3VibmV0Q29uZmlnLnN1Ym5ldFR5cGUpIHtcbiAgICAgICAgY2FzZSBTdWJuZXRUeXBlLlBVQkxJQzpcbiAgICAgICAgICBjb25zdCBwdWJsaWNTdWJuZXQgPSBuZXcgUHVibGljU3VibmV0KHRoaXMsIHN1Ym5ldENvbnN0cnVjdElkLCBzdWJuZXRQcm9wcyk7XG4gICAgICAgICAgdGhpcy5wdWJsaWNTdWJuZXRzLnB1c2gocHVibGljU3VibmV0KTtcbiAgICAgICAgICBzdWJuZXQgPSBwdWJsaWNTdWJuZXQ7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfRUdSRVNTOlxuICAgICAgICBjYXNlIFN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX05BVDpcbiAgICAgICAgY2FzZSBTdWJuZXRUeXBlLlBSSVZBVEU6XG4gICAgICAgICAgY29uc3QgcHJpdmF0ZVN1Ym5ldCA9IG5ldyBQcml2YXRlU3VibmV0KHRoaXMsIHN1Ym5ldENvbnN0cnVjdElkLCBzdWJuZXRQcm9wcyk7XG4gICAgICAgICAgdGhpcy5wcml2YXRlU3VibmV0cy5wdXNoKHByaXZhdGVTdWJuZXQpO1xuICAgICAgICAgIHN1Ym5ldCA9IHByaXZhdGVTdWJuZXQ7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgU3VibmV0VHlwZS5QUklWQVRFX0lTT0xBVEVEOlxuICAgICAgICBjYXNlIFN1Ym5ldFR5cGUuSVNPTEFURUQ6XG4gICAgICAgICAgY29uc3QgaXNvbGF0ZWRTdWJuZXQgPSBuZXcgUHJpdmF0ZVN1Ym5ldCh0aGlzLCBzdWJuZXRDb25zdHJ1Y3RJZCwgc3VibmV0UHJvcHMpO1xuICAgICAgICAgIHRoaXMuaXNvbGF0ZWRTdWJuZXRzLnB1c2goaXNvbGF0ZWRTdWJuZXQpO1xuICAgICAgICAgIHN1Ym5ldCA9IGlzb2xhdGVkU3VibmV0O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5yZWNvZ25pemVkIHN1Ym5ldCB0eXBlOiAke3N1Ym5ldENvbmZpZy5zdWJuZXRUeXBlfWApO1xuICAgICAgfVxuXG4gICAgICAvLyBUaGVzZSB2YWx1ZXMgd2lsbCBiZSB1c2VkIHRvIHJlY292ZXIgdGhlIGNvbmZpZyB1cG9uIHByb3ZpZGVyIGltcG9ydFxuICAgICAgY29uc3QgaW5jbHVkZVJlc291cmNlVHlwZXMgPSBbQ2ZuU3VibmV0LkNGTl9SRVNPVVJDRV9UWVBFX05BTUVdO1xuICAgICAgVGFncy5vZihzdWJuZXQpLmFkZChTVUJORVROQU1FX1RBRywgc3VibmV0Q29uZmlnLm5hbWUsIHsgaW5jbHVkZVJlc291cmNlVHlwZXMgfSk7XG4gICAgICBUYWdzLm9mKHN1Ym5ldCkuYWRkKFNVQk5FVFRZUEVfVEFHLCBzdWJuZXRUeXBlVGFnVmFsdWUoc3VibmV0Q29uZmlnLnN1Ym5ldFR5cGUpLCB7IGluY2x1ZGVSZXNvdXJjZVR5cGVzIH0pO1xuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IFNVQk5FVFRZUEVfVEFHID0gJ2F3cy1jZGs6c3VibmV0LXR5cGUnO1xuY29uc3QgU1VCTkVUTkFNRV9UQUcgPSAnYXdzLWNkazpzdWJuZXQtbmFtZSc7XG5cbmZ1bmN0aW9uIHN1Ym5ldFR5cGVUYWdWYWx1ZSh0eXBlOiBTdWJuZXRUeXBlKSB7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgU3VibmV0VHlwZS5QVUJMSUM6IHJldHVybiAnUHVibGljJztcbiAgICBjYXNlIFN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX0VHUkVTUzpcbiAgICBjYXNlIFN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX05BVDpcbiAgICBjYXNlIFN1Ym5ldFR5cGUuUFJJVkFURTpcbiAgICAgIHJldHVybiAnUHJpdmF0ZSc7XG4gICAgY2FzZSBTdWJuZXRUeXBlLlBSSVZBVEVfSVNPTEFURUQ6XG4gICAgY2FzZSBTdWJuZXRUeXBlLklTT0xBVEVEOlxuICAgICAgcmV0dXJuICdJc29sYXRlZCc7XG4gIH1cbn1cblxuLyoqXG4gKiBTcGVjaWZ5IGNvbmZpZ3VyYXRpb24gcGFyYW1ldGVycyBmb3IgYSBWUEMgc3VibmV0XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU3VibmV0UHJvcHMge1xuXG4gIC8qKlxuICAgKiBUaGUgYXZhaWxhYmlsaXR5IHpvbmUgZm9yIHRoZSBzdWJuZXRcbiAgICovXG4gIHJlYWRvbmx5IGF2YWlsYWJpbGl0eVpvbmU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIFZQQyB3aGljaCB0aGlzIHN1Ym5ldCBpcyBwYXJ0IG9mXG4gICAqL1xuICByZWFkb25seSB2cGNJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgQ0lEUiBub3RhdGlvbiBmb3IgdGhpcyBzdWJuZXRcbiAgICovXG4gIHJlYWRvbmx5IGNpZHJCbG9jazogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBDb250cm9scyBpZiBhIHB1YmxpYyBJUCBpcyBhc3NvY2lhdGVkIHRvIGFuIGluc3RhbmNlIGF0IGxhdW5jaFxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlIGluIFN1Ym5ldC5QdWJsaWMsIGZhbHNlIGluIFN1Ym5ldC5Qcml2YXRlIG9yIFN1Ym5ldC5Jc29sYXRlZC5cbiAgICovXG4gIHJlYWRvbmx5IG1hcFB1YmxpY0lwT25MYXVuY2g/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBuZXcgVlBDIHN1Ym5ldCByZXNvdXJjZVxuICpcbiAqIEByZXNvdXJjZSBBV1M6OkVDMjo6U3VibmV0XG4gKi9cbmV4cG9ydCBjbGFzcyBTdWJuZXQgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElTdWJuZXQge1xuXG4gIHB1YmxpYyBzdGF0aWMgaXNWcGNTdWJuZXQoeDogYW55KTogeCBpcyBTdWJuZXQge1xuICAgIHJldHVybiBWUENfU1VCTkVUX1NZTUJPTCBpbiB4O1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBmcm9tU3VibmV0QXR0cmlidXRlcyhzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBhdHRyczogU3VibmV0QXR0cmlidXRlcyk6IElTdWJuZXQge1xuICAgIHJldHVybiBuZXcgSW1wb3J0ZWRTdWJuZXQoc2NvcGUsIGlkLCBhdHRycyk7XG4gIH1cblxuICAvKipcbiAgICogSW1wb3J0IGV4aXN0aW5nIHN1Ym5ldCBmcm9tIGlkLlxuICAgKi9cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1zaGFkb3dcbiAgcHVibGljIHN0YXRpYyBmcm9tU3VibmV0SWQoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgc3VibmV0SWQ6IHN0cmluZyk6IElTdWJuZXQge1xuICAgIHJldHVybiB0aGlzLmZyb21TdWJuZXRBdHRyaWJ1dGVzKHNjb3BlLCBpZCwgeyBzdWJuZXRJZCB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgQXZhaWxhYmlsaXR5IFpvbmUgdGhlIHN1Ym5ldCBpcyBsb2NhdGVkIGluXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgYXZhaWxhYmlsaXR5Wm9uZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgaXB2NENpZHJCbG9jazogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgc3VibmV0SWQgZm9yIHRoaXMgcGFydGljdWxhciBzdWJuZXRcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBzdWJuZXRJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgc3VibmV0VnBjSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHN1Ym5ldEF2YWlsYWJpbGl0eVpvbmU6IHN0cmluZztcblxuICAvKipcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHN1Ym5ldElwdjZDaWRyQmxvY2tzOiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogVGhlIEFtYXpvbiBSZXNvdXJjZSBOYW1lIChBUk4pIG9mIHRoZSBPdXRwb3N0IGZvciB0aGlzIHN1Ym5ldCAoaWYgb25lIGV4aXN0cykuXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBzdWJuZXRPdXRwb3N0QXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBzdWJuZXROZXR3b3JrQWNsQXNzb2NpYXRpb25JZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBQYXJ0cyBvZiB0aGlzIFZQQyBzdWJuZXRcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBkZXBlbmRlbmN5RWxlbWVudHM6IElEZXBlbmRhYmxlW10gPSBbXTtcblxuICAvKipcbiAgICogVGhlIHJvdXRlVGFibGVJZCBhdHRhY2hlZCB0byB0aGlzIHN1Ym5ldC5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSByb3V0ZVRhYmxlOiBJUm91dGVUYWJsZTtcblxuICBwdWJsaWMgcmVhZG9ubHkgaW50ZXJuZXRDb25uZWN0aXZpdHlFc3RhYmxpc2hlZDogSURlcGVuZGFibGU7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBfaW50ZXJuZXRDb25uZWN0aXZpdHlFc3RhYmxpc2hlZCA9IG5ldyBEZXBlbmRlbmN5R3JvdXAoKTtcblxuICBwcml2YXRlIF9uZXR3b3JrQWNsOiBJTmV0d29ya0FjbDtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogU3VibmV0UHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFZQQ19TVUJORVRfU1lNQk9MLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG4gICAgVGFncy5vZih0aGlzKS5hZGQoTkFNRV9UQUcsIHRoaXMubm9kZS5wYXRoKTtcblxuICAgIHRoaXMuYXZhaWxhYmlsaXR5Wm9uZSA9IHByb3BzLmF2YWlsYWJpbGl0eVpvbmU7XG4gICAgdGhpcy5pcHY0Q2lkckJsb2NrID0gcHJvcHMuY2lkckJsb2NrO1xuICAgIGNvbnN0IHN1Ym5ldCA9IG5ldyBDZm5TdWJuZXQodGhpcywgJ1N1Ym5ldCcsIHtcbiAgICAgIHZwY0lkOiBwcm9wcy52cGNJZCxcbiAgICAgIGNpZHJCbG9jazogcHJvcHMuY2lkckJsb2NrLFxuICAgICAgYXZhaWxhYmlsaXR5Wm9uZTogcHJvcHMuYXZhaWxhYmlsaXR5Wm9uZSxcbiAgICAgIG1hcFB1YmxpY0lwT25MYXVuY2g6IHByb3BzLm1hcFB1YmxpY0lwT25MYXVuY2gsXG4gICAgfSk7XG4gICAgdGhpcy5zdWJuZXRJZCA9IHN1Ym5ldC5yZWY7XG4gICAgdGhpcy5zdWJuZXRWcGNJZCA9IHN1Ym5ldC5hdHRyVnBjSWQ7XG4gICAgdGhpcy5zdWJuZXRBdmFpbGFiaWxpdHlab25lID0gc3VibmV0LmF0dHJBdmFpbGFiaWxpdHlab25lO1xuICAgIHRoaXMuc3VibmV0SXB2NkNpZHJCbG9ja3MgPSBzdWJuZXQuYXR0cklwdjZDaWRyQmxvY2tzO1xuICAgIHRoaXMuc3VibmV0T3V0cG9zdEFybiA9IHN1Ym5ldC5hdHRyT3V0cG9zdEFybjtcblxuICAgIC8vIHN1Ym5ldC5hdHRyTmV0d29ya0FjbEFzc29jaWF0aW9uSWQgaXMgdGhlIGRlZmF1bHQgQUNMIGFmdGVyIHRoZSBzdWJuZXRcbiAgICAvLyB3YXMganVzdCBjcmVhdGVkLiBIb3dldmVyLCB0aGUgQUNMIGNhbiBiZSByZXBsYWNlZCBhdCBhIGxhdGVyIHRpbWUuXG4gICAgdGhpcy5fbmV0d29ya0FjbCA9IE5ldHdvcmtBY2wuZnJvbU5ldHdvcmtBY2xJZCh0aGlzLCAnQWNsJywgc3VibmV0LmF0dHJOZXR3b3JrQWNsQXNzb2NpYXRpb25JZCk7XG4gICAgdGhpcy5zdWJuZXROZXR3b3JrQWNsQXNzb2NpYXRpb25JZCA9IExhenkuc3RyaW5nKHsgcHJvZHVjZTogKCkgPT4gdGhpcy5fbmV0d29ya0FjbC5uZXR3b3JrQWNsSWQgfSk7XG4gICAgdGhpcy5ub2RlLmRlZmF1bHRDaGlsZCA9IHN1Ym5ldDtcblxuICAgIGNvbnN0IHRhYmxlID0gbmV3IENmblJvdXRlVGFibGUodGhpcywgJ1JvdXRlVGFibGUnLCB7XG4gICAgICB2cGNJZDogcHJvcHMudnBjSWQsXG4gICAgfSk7XG4gICAgdGhpcy5yb3V0ZVRhYmxlID0geyByb3V0ZVRhYmxlSWQ6IHRhYmxlLnJlZiB9O1xuXG4gICAgLy8gQXNzb2NpYXRlIHRoZSBwdWJsaWMgcm91dGUgdGFibGUgZm9yIHRoaXMgc3VibmV0LCB0byB0aGlzIHN1Ym5ldFxuICAgIGNvbnN0IHJvdXRlQXNzb2MgPSBuZXcgQ2ZuU3VibmV0Um91dGVUYWJsZUFzc29jaWF0aW9uKHRoaXMsICdSb3V0ZVRhYmxlQXNzb2NpYXRpb24nLCB7XG4gICAgICBzdWJuZXRJZDogdGhpcy5zdWJuZXRJZCxcbiAgICAgIHJvdXRlVGFibGVJZDogdGFibGUucmVmLFxuICAgIH0pO1xuICAgIHRoaXMuX2ludGVybmV0Q29ubmVjdGl2aXR5RXN0YWJsaXNoZWQuYWRkKHJvdXRlQXNzb2MpO1xuXG4gICAgdGhpcy5pbnRlcm5ldENvbm5lY3Rpdml0eUVzdGFibGlzaGVkID0gdGhpcy5faW50ZXJuZXRDb25uZWN0aXZpdHlFc3RhYmxpc2hlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBkZWZhdWx0IHJvdXRlIHRoYXQgcG9pbnRzIHRvIGEgcGFzc2VkIElHVywgd2l0aCBhIGRlcGVuZGVuY3lcbiAgICogb24gdGhlIElHVydzIGF0dGFjaG1lbnQgdG8gdGhlIFZQQy5cbiAgICpcbiAgICogQHBhcmFtIGdhdGV3YXlJZCB0aGUgbG9naWNhbCBJRCAocmVmKSBvZiB0aGUgZ2F0ZXdheSBhdHRhY2hlZCB0byB5b3VyIFZQQ1xuICAgKiBAcGFyYW0gZ2F0ZXdheUF0dGFjaG1lbnQgdGhlIGdhdGV3YXkgYXR0YWNobWVudCBjb25zdHJ1Y3QgdG8gYmUgYWRkZWQgYXMgYSBkZXBlbmRlbmN5XG4gICAqL1xuICBwdWJsaWMgYWRkRGVmYXVsdEludGVybmV0Um91dGUoZ2F0ZXdheUlkOiBzdHJpbmcsIGdhdGV3YXlBdHRhY2htZW50OiBJRGVwZW5kYWJsZSkge1xuICAgIGNvbnN0IHJvdXRlID0gbmV3IENmblJvdXRlKHRoaXMsICdEZWZhdWx0Um91dGUnLCB7XG4gICAgICByb3V0ZVRhYmxlSWQ6IHRoaXMucm91dGVUYWJsZS5yb3V0ZVRhYmxlSWQsXG4gICAgICBkZXN0aW5hdGlvbkNpZHJCbG9jazogJzAuMC4wLjAvMCcsXG4gICAgICBnYXRld2F5SWQsXG4gICAgfSk7XG4gICAgcm91dGUubm9kZS5hZGREZXBlbmRlbmN5KGdhdGV3YXlBdHRhY2htZW50KTtcblxuICAgIC8vIFNpbmNlIHRoZSAncm91dGUnIGRlcGVuZHMgb24gdGhlIGdhdGV3YXkgYXR0YWNobWVudCwganVzdFxuICAgIC8vIGRlcGVuZGluZyBvbiB0aGUgcm91dGUgaXMgZW5vdWdoLlxuICAgIHRoaXMuX2ludGVybmV0Q29ubmVjdGl2aXR5RXN0YWJsaXNoZWQuYWRkKHJvdXRlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBOZXR3b3JrIEFDTCBhc3NvY2lhdGVkIHdpdGggdGhpcyBTdWJuZXRcbiAgICpcbiAgICogVXBvbiBjcmVhdGlvbiwgdGhpcyBpcyB0aGUgZGVmYXVsdCBBQ0wgd2hpY2ggYWxsb3dzIGFsbCB0cmFmZmljLCBleGNlcHRcbiAgICogZXhwbGljaXQgREVOWSBlbnRyaWVzIHRoYXQgeW91IGFkZC5cbiAgICpcbiAgICogWW91IGNhbiByZXBsYWNlIGl0IHdpdGggYSBjdXN0b20gQUNMIHdoaWNoIGRlbmllcyBhbGwgdHJhZmZpYyBleGNlcHRcbiAgICogdGhlIGV4cGxpY2l0IEFMTE9XIGVudHJpZXMgdGhhdCB5b3UgYWRkIGJ5IGNyZWF0aW5nIGEgYE5ldHdvcmtBY2xgXG4gICAqIG9iamVjdCBhbmQgY2FsbGluZyBgYXNzb2NpYXRlTmV0d29ya0FjbCgpYC5cbiAgICovXG4gIHB1YmxpYyBnZXQgbmV0d29ya0FjbCgpOiBJTmV0d29ya0FjbCB7XG4gICAgcmV0dXJuIHRoaXMuX25ldHdvcmtBY2w7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhbiBlbnRyeSB0byB0aGlzIHN1Ym5ldHMgcm91dGUgdGFibGUgdGhhdCBwb2ludHMgdG8gdGhlIHBhc3NlZCBOQVRHYXRld2F5SWRcbiAgICogQHBhcmFtIG5hdEdhdGV3YXlJZCBUaGUgSUQgb2YgdGhlIE5BVCBnYXRld2F5XG4gICAqL1xuICBwdWJsaWMgYWRkRGVmYXVsdE5hdFJvdXRlKG5hdEdhdGV3YXlJZDogc3RyaW5nKSB7XG4gICAgdGhpcy5hZGRSb3V0ZSgnRGVmYXVsdFJvdXRlJywge1xuICAgICAgcm91dGVyVHlwZTogUm91dGVyVHlwZS5OQVRfR0FURVdBWSxcbiAgICAgIHJvdXRlcklkOiBuYXRHYXRld2F5SWQsXG4gICAgICBlbmFibGVzSW50ZXJuZXRDb25uZWN0aXZpdHk6IHRydWUsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhbiBlbnRyeSB0byB0aGlzIHN1Ym5ldHMgcm91dGUgdGFibGVcbiAgICovXG4gIHB1YmxpYyBhZGRSb3V0ZShpZDogc3RyaW5nLCBvcHRpb25zOiBBZGRSb3V0ZU9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy5kZXN0aW5hdGlvbkNpZHJCbG9jayAmJiBvcHRpb25zLmRlc3RpbmF0aW9uSXB2NkNpZHJCbG9jaykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3Qgc3BlY2lmeSBib3RoIFxcJ2Rlc3RpbmF0aW9uQ2lkckJsb2NrXFwnIGFuZCBcXCdkZXN0aW5hdGlvbklwdjZDaWRyQmxvY2tcXCcnKTtcbiAgICB9XG5cbiAgICBjb25zdCByb3V0ZSA9IG5ldyBDZm5Sb3V0ZSh0aGlzLCBpZCwge1xuICAgICAgcm91dGVUYWJsZUlkOiB0aGlzLnJvdXRlVGFibGUucm91dGVUYWJsZUlkLFxuICAgICAgZGVzdGluYXRpb25DaWRyQmxvY2s6IG9wdGlvbnMuZGVzdGluYXRpb25DaWRyQmxvY2sgfHwgKG9wdGlvbnMuZGVzdGluYXRpb25JcHY2Q2lkckJsb2NrID09PSB1bmRlZmluZWQgPyAnMC4wLjAuMC8wJyA6IHVuZGVmaW5lZCksXG4gICAgICBkZXN0aW5hdGlvbklwdjZDaWRyQmxvY2s6IG9wdGlvbnMuZGVzdGluYXRpb25JcHY2Q2lkckJsb2NrLFxuICAgICAgW3JvdXRlclR5cGVUb1Byb3BOYW1lKG9wdGlvbnMucm91dGVyVHlwZSldOiBvcHRpb25zLnJvdXRlcklkLFxuICAgIH0pO1xuXG4gICAgaWYgKG9wdGlvbnMuZW5hYmxlc0ludGVybmV0Q29ubmVjdGl2aXR5KSB7XG4gICAgICB0aGlzLl9pbnRlcm5ldENvbm5lY3Rpdml0eUVzdGFibGlzaGVkLmFkZChyb3V0ZSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGFzc29jaWF0ZU5ldHdvcmtBY2woaWQ6IHN0cmluZywgbmV0d29ya0FjbDogSU5ldHdvcmtBY2wpIHtcbiAgICB0aGlzLl9uZXR3b3JrQWNsID0gbmV0d29ya0FjbDtcblxuICAgIGNvbnN0IHNjb3BlID0gbmV0d29ya0FjbCBpbnN0YW5jZW9mIENvbnN0cnVjdCA/IG5ldHdvcmtBY2wgOiB0aGlzO1xuICAgIGNvbnN0IG90aGVyID0gbmV0d29ya0FjbCBpbnN0YW5jZW9mIENvbnN0cnVjdCA/IHRoaXMgOiBuZXR3b3JrQWNsO1xuICAgIG5ldyBTdWJuZXROZXR3b3JrQWNsQXNzb2NpYXRpb24oc2NvcGUsIGlkICsgTmFtZXMubm9kZVVuaXF1ZUlkKG90aGVyLm5vZGUpLCB7XG4gICAgICBuZXR3b3JrQWNsLFxuICAgICAgc3VibmV0OiB0aGlzLFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgYWRkaW5nIGEgbmV3IHJvdXRlIHRvIGEgc3VibmV0XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQWRkUm91dGVPcHRpb25zIHtcbiAgLyoqXG4gICAqIElQdjQgcmFuZ2UgdGhpcyByb3V0ZSBhcHBsaWVzIHRvXG4gICAqXG4gICAqIEBkZWZhdWx0ICcwLjAuMC4wLzAnXG4gICAqL1xuICByZWFkb25seSBkZXN0aW5hdGlvbkNpZHJCbG9jaz86IHN0cmluZztcblxuICAvKipcbiAgICogSVB2NiByYW5nZSB0aGlzIHJvdXRlIGFwcGxpZXMgdG9cbiAgICpcbiAgICogQGRlZmF1bHQgLSBVc2VzIElQdjZcbiAgICovXG4gIHJlYWRvbmx5IGRlc3RpbmF0aW9uSXB2NkNpZHJCbG9jaz86IHN0cmluZztcblxuICAvKipcbiAgICogV2hhdCB0eXBlIG9mIHJvdXRlciB0byByb3V0ZSB0aGlzIHRyYWZmaWMgdG9cbiAgICovXG4gIHJlYWRvbmx5IHJvdXRlclR5cGU6IFJvdXRlclR5cGU7XG5cbiAgLyoqXG4gICAqIFRoZSBJRCBvZiB0aGUgcm91dGVyXG4gICAqXG4gICAqIENhbiBiZSBhbiBpbnN0YW5jZSBJRCwgZ2F0ZXdheSBJRCwgZXRjLCBkZXBlbmRpbmcgb24gdGhlIHJvdXRlciB0eXBlLlxuICAgKi9cbiAgcmVhZG9ubHkgcm91dGVySWQ6IHN0cmluZztcblxuICAvKipcbiAgICogV2hldGhlciB0aGlzIHJvdXRlIHdpbGwgZW5hYmxlIGludGVybmV0IGNvbm5lY3Rpdml0eVxuICAgKlxuICAgKiBJZiB0cnVlLCB0aGlzIHJvdXRlIHdpbGwgYmUgYWRkZWQgYmVmb3JlIGFueSBBV1MgcmVzb3VyY2VzIHRoYXQgZGVwZW5kXG4gICAqIG9uIGludGVybmV0IGNvbm5lY3Rpdml0eSBpbiB0aGUgVlBDIHdpbGwgYmUgY3JlYXRlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGVuYWJsZXNJbnRlcm5ldENvbm5lY3Rpdml0eT86IGJvb2xlYW47XG59XG5cbi8qKlxuICogVHlwZSBvZiByb3V0ZXIgdXNlZCBpbiByb3V0ZVxuICovXG5leHBvcnQgZW51bSBSb3V0ZXJUeXBlIHtcbiAgLyoqXG4gICAqIENhcnJpZXIgZ2F0ZXdheVxuICAgKi9cbiAgQ0FSUklFUl9HQVRFV0FZID0gJ0NhcnJpZXJHYXRld2F5JyxcblxuICAvKipcbiAgICogRWdyZXNzLW9ubHkgSW50ZXJuZXQgR2F0ZXdheVxuICAgKi9cbiAgRUdSRVNTX09OTFlfSU5URVJORVRfR0FURVdBWSA9ICdFZ3Jlc3NPbmx5SW50ZXJuZXRHYXRld2F5JyxcblxuICAvKipcbiAgICogSW50ZXJuZXQgR2F0ZXdheVxuICAgKi9cbiAgR0FURVdBWSA9ICdHYXRld2F5JyxcblxuICAvKipcbiAgICogSW5zdGFuY2VcbiAgICovXG4gIElOU1RBTkNFID0gJ0luc3RhbmNlJyxcblxuICAvKipcbiAgICogTG9jYWwgR2F0ZXdheVxuICAgKi9cbiAgTE9DQUxfR0FURVdBWSA9ICdMb2NhbEdhdGV3YXknLFxuXG4gIC8qKlxuICAgKiBOQVQgR2F0ZXdheVxuICAgKi9cbiAgTkFUX0dBVEVXQVkgPSAnTmF0R2F0ZXdheScsXG5cbiAgLyoqXG4gICAqIE5ldHdvcmsgSW50ZXJmYWNlXG4gICAqL1xuICBORVRXT1JLX0lOVEVSRkFDRSA9ICdOZXR3b3JrSW50ZXJmYWNlJyxcblxuICAvKipcbiAgICogVHJhbnNpdCBHYXRld2F5XG4gICAqL1xuICBUUkFOU0lUX0dBVEVXQVkgPSAnVHJhbnNpdEdhdGV3YXknLFxuXG4gIC8qKlxuICAgKiBWUEMgcGVlcmluZyBjb25uZWN0aW9uXG4gICAqL1xuICBWUENfUEVFUklOR19DT05ORUNUSU9OID0gJ1ZwY1BlZXJpbmdDb25uZWN0aW9uJyxcblxuICAvKipcbiAgICogVlBDIEVuZHBvaW50IGZvciBnYXRld2F5IGxvYWQgYmFsYW5jZXJzXG4gICAqL1xuICBWUENfRU5EUE9JTlQgPSAnVnBjRW5kcG9pbnQnLFxufVxuXG5mdW5jdGlvbiByb3V0ZXJUeXBlVG9Qcm9wTmFtZShyb3V0ZXJUeXBlOiBSb3V0ZXJUeXBlKSB7XG4gIHJldHVybiAoe1xuICAgIFtSb3V0ZXJUeXBlLkNBUlJJRVJfR0FURVdBWV06ICdjYXJyaWVyR2F0ZXdheUlkJyxcbiAgICBbUm91dGVyVHlwZS5FR1JFU1NfT05MWV9JTlRFUk5FVF9HQVRFV0FZXTogJ2VncmVzc09ubHlJbnRlcm5ldEdhdGV3YXlJZCcsXG4gICAgW1JvdXRlclR5cGUuR0FURVdBWV06ICdnYXRld2F5SWQnLFxuICAgIFtSb3V0ZXJUeXBlLklOU1RBTkNFXTogJ2luc3RhbmNlSWQnLFxuICAgIFtSb3V0ZXJUeXBlLkxPQ0FMX0dBVEVXQVldOiAnbG9jYWxHYXRld2F5SWQnLFxuICAgIFtSb3V0ZXJUeXBlLk5BVF9HQVRFV0FZXTogJ25hdEdhdGV3YXlJZCcsXG4gICAgW1JvdXRlclR5cGUuTkVUV09SS19JTlRFUkZBQ0VdOiAnbmV0d29ya0ludGVyZmFjZUlkJyxcbiAgICBbUm91dGVyVHlwZS5UUkFOU0lUX0dBVEVXQVldOiAndHJhbnNpdEdhdGV3YXlJZCcsXG4gICAgW1JvdXRlclR5cGUuVlBDX1BFRVJJTkdfQ09OTkVDVElPTl06ICd2cGNQZWVyaW5nQ29ubmVjdGlvbklkJyxcbiAgICBbUm91dGVyVHlwZS5WUENfRU5EUE9JTlRdOiAndnBjRW5kcG9pbnRJZCcsXG4gIH0pW3JvdXRlclR5cGVdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFB1YmxpY1N1Ym5ldFByb3BzIGV4dGVuZHMgU3VibmV0UHJvcHMge1xuXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVB1YmxpY1N1Ym5ldCBleHRlbmRzIElTdWJuZXQgeyB9XG5cbmV4cG9ydCBpbnRlcmZhY2UgUHVibGljU3VibmV0QXR0cmlidXRlcyBleHRlbmRzIFN1Ym5ldEF0dHJpYnV0ZXMgeyB9XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIHB1YmxpYyBWUEMgc3VibmV0IHJlc291cmNlXG4gKi9cbmV4cG9ydCBjbGFzcyBQdWJsaWNTdWJuZXQgZXh0ZW5kcyBTdWJuZXQgaW1wbGVtZW50cyBJUHVibGljU3VibmV0IHtcblxuICBwdWJsaWMgc3RhdGljIGZyb21QdWJsaWNTdWJuZXRBdHRyaWJ1dGVzKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGF0dHJzOiBQdWJsaWNTdWJuZXRBdHRyaWJ1dGVzKTogSVB1YmxpY1N1Ym5ldCB7XG4gICAgcmV0dXJuIG5ldyBJbXBvcnRlZFN1Ym5ldChzY29wZSwgaWQsIGF0dHJzKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBQdWJsaWNTdWJuZXRQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgbWFuYWdlZCBOQVQgZ2F0ZXdheSBhdHRhY2hlZCB0byB0aGlzIHB1YmxpYyBzdWJuZXQuXG4gICAqIEFsc28gYWRkcyB0aGUgRUlQIGZvciB0aGUgbWFuYWdlZCBOQVQuXG4gICAqIEByZXR1cm5zIEEgcmVmIHRvIHRoZSB0aGUgTkFUIEdhdGV3YXkgSURcbiAgICovXG4gIHB1YmxpYyBhZGROYXRHYXRld2F5KGVpcEFsbG9jYXRpb25JZD86IHN0cmluZykge1xuICAgIC8vIENyZWF0ZSBhIE5BVCBHYXRld2F5IGluIHRoaXMgcHVibGljIHN1Ym5ldFxuICAgIGNvbnN0IG5ndyA9IG5ldyBDZm5OYXRHYXRld2F5KHRoaXMsICdOQVRHYXRld2F5Jywge1xuICAgICAgc3VibmV0SWQ6IHRoaXMuc3VibmV0SWQsXG4gICAgICBhbGxvY2F0aW9uSWQ6IGVpcEFsbG9jYXRpb25JZCA/PyBuZXcgQ2ZuRUlQKHRoaXMsICdFSVAnLCB7XG4gICAgICAgIGRvbWFpbjogJ3ZwYycsXG4gICAgICB9KS5hdHRyQWxsb2NhdGlvbklkLFxuICAgIH0pO1xuICAgIG5ndy5ub2RlLmFkZERlcGVuZGVuY3kodGhpcy5pbnRlcm5ldENvbm5lY3Rpdml0eUVzdGFibGlzaGVkKTtcbiAgICByZXR1cm4gbmd3O1xuICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUHJpdmF0ZVN1Ym5ldFByb3BzIGV4dGVuZHMgU3VibmV0UHJvcHMge1xuXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVByaXZhdGVTdWJuZXQgZXh0ZW5kcyBJU3VibmV0IHsgfVxuXG5leHBvcnQgaW50ZXJmYWNlIFByaXZhdGVTdWJuZXRBdHRyaWJ1dGVzIGV4dGVuZHMgU3VibmV0QXR0cmlidXRlcyB7IH1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgcHJpdmF0ZSBWUEMgc3VibmV0IHJlc291cmNlXG4gKi9cbmV4cG9ydCBjbGFzcyBQcml2YXRlU3VibmV0IGV4dGVuZHMgU3VibmV0IGltcGxlbWVudHMgSVByaXZhdGVTdWJuZXQge1xuXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVByaXZhdGVTdWJuZXRBdHRyaWJ1dGVzKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGF0dHJzOiBQcml2YXRlU3VibmV0QXR0cmlidXRlcyk6IElQcml2YXRlU3VibmV0IHtcbiAgICByZXR1cm4gbmV3IEltcG9ydGVkU3VibmV0KHNjb3BlLCBpZCwgYXR0cnMpO1xuICB9XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFByaXZhdGVTdWJuZXRQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGlmVW5kZWZpbmVkPFQ+KHZhbHVlOiBUIHwgdW5kZWZpbmVkLCBkZWZhdWx0VmFsdWU6IFQpOiBUIHtcbiAgcmV0dXJuIHZhbHVlID8/IGRlZmF1bHRWYWx1ZTtcbn1cblxuY2xhc3MgSW1wb3J0ZWRWcGMgZXh0ZW5kcyBWcGNCYXNlIHtcbiAgcHVibGljIHJlYWRvbmx5IHZwY0lkOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSB2cGNBcm46IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IHB1YmxpY1N1Ym5ldHM6IElTdWJuZXRbXTtcbiAgcHVibGljIHJlYWRvbmx5IHByaXZhdGVTdWJuZXRzOiBJU3VibmV0W107XG4gIHB1YmxpYyByZWFkb25seSBpc29sYXRlZFN1Ym5ldHM6IElTdWJuZXRbXTtcbiAgcHVibGljIHJlYWRvbmx5IGF2YWlsYWJpbGl0eVpvbmVzOiBzdHJpbmdbXTtcbiAgcHVibGljIHJlYWRvbmx5IGludGVybmV0Q29ubmVjdGl2aXR5RXN0YWJsaXNoZWQ6IElEZXBlbmRhYmxlID0gbmV3IERlcGVuZGVuY3lHcm91cCgpO1xuICBwcml2YXRlIHJlYWRvbmx5IGNpZHI/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFZwY0F0dHJpYnV0ZXMsIGlzSW5jb21wbGV0ZTogYm9vbGVhbikge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgcmVnaW9uOiBwcm9wcy5yZWdpb24sXG4gICAgfSk7XG5cbiAgICB0aGlzLnZwY0lkID0gcHJvcHMudnBjSWQ7XG4gICAgdGhpcy52cGNBcm4gPSBBcm4uZm9ybWF0KHtcbiAgICAgIHNlcnZpY2U6ICdlYzInLFxuICAgICAgcmVzb3VyY2U6ICd2cGMnLFxuICAgICAgcmVzb3VyY2VOYW1lOiB0aGlzLnZwY0lkLFxuICAgIH0sIFN0YWNrLm9mKHRoaXMpKTtcbiAgICB0aGlzLmNpZHIgPSBwcm9wcy52cGNDaWRyQmxvY2s7XG4gICAgdGhpcy5hdmFpbGFiaWxpdHlab25lcyA9IHByb3BzLmF2YWlsYWJpbGl0eVpvbmVzO1xuICAgIHRoaXMuX3ZwbkdhdGV3YXlJZCA9IHByb3BzLnZwbkdhdGV3YXlJZDtcbiAgICB0aGlzLmluY29tcGxldGVTdWJuZXREZWZpbml0aW9uID0gaXNJbmNvbXBsZXRlO1xuXG4gICAgLy8gTm9uZSBvZiB0aGUgdmFsdWVzIG1heSBiZSB1bnJlc29sdmVkIGxpc3QgdG9rZW5zXG4gICAgZm9yIChjb25zdCBrIG9mIE9iamVjdC5rZXlzKHByb3BzKSBhcyBBcnJheTxrZXlvZiBWcGNBdHRyaWJ1dGVzPikge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocHJvcHNba10pICYmIFRva2VuLmlzVW5yZXNvbHZlZChwcm9wc1trXSkpIHtcbiAgICAgICAgQW5ub3RhdGlvbnMub2YodGhpcykuYWRkV2FybmluZyhgZnJvbVZwY0F0dHJpYnV0ZXM6ICcke2t9JyBpcyBhIGxpc3QgdG9rZW46IHRoZSBpbXBvcnRlZCBWUEMgd2lsbCBub3Qgd29yayB3aXRoIGNvbnN0cnVjdHMgdGhhdCByZXF1aXJlIGEgbGlzdCBvZiBzdWJuZXRzIGF0IHN5bnRoZXNpcyB0aW1lLiBVc2UgJ1ZwYy5mcm9tTG9va3VwKCknIG9yICdGbi5pbXBvcnRMaXN0VmFsdWUnIGluc3RlYWQuYCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqL1xuICAgIGNvbnN0IHB1YiA9IG5ldyBJbXBvcnRTdWJuZXRHcm91cChwcm9wcy5wdWJsaWNTdWJuZXRJZHMsIHByb3BzLnB1YmxpY1N1Ym5ldE5hbWVzLCBwcm9wcy5wdWJsaWNTdWJuZXRSb3V0ZVRhYmxlSWRzLCBwcm9wcy5wdWJsaWNTdWJuZXRJcHY0Q2lkckJsb2NrcywgU3VibmV0VHlwZS5QVUJMSUMsIHRoaXMuYXZhaWxhYmlsaXR5Wm9uZXMsICdwdWJsaWNTdWJuZXRJZHMnLCAncHVibGljU3VibmV0TmFtZXMnLCAncHVibGljU3VibmV0Um91dGVUYWJsZUlkcycsICdwdWJsaWNTdWJuZXRJcHY0Q2lkckJsb2NrcycpO1xuICAgIGNvbnN0IHByaXYgPSBuZXcgSW1wb3J0U3VibmV0R3JvdXAocHJvcHMucHJpdmF0ZVN1Ym5ldElkcywgcHJvcHMucHJpdmF0ZVN1Ym5ldE5hbWVzLCBwcm9wcy5wcml2YXRlU3VibmV0Um91dGVUYWJsZUlkcywgcHJvcHMucHJpdmF0ZVN1Ym5ldElwdjRDaWRyQmxvY2tzLCBTdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9FR1JFU1MsIHRoaXMuYXZhaWxhYmlsaXR5Wm9uZXMsICdwcml2YXRlU3VibmV0SWRzJywgJ3ByaXZhdGVTdWJuZXROYW1lcycsICdwcml2YXRlU3VibmV0Um91dGVUYWJsZUlkcycsICdwcml2YXRlU3VibmV0SXB2NENpZHJCbG9ja3MnKTtcbiAgICBjb25zdCBpc28gPSBuZXcgSW1wb3J0U3VibmV0R3JvdXAocHJvcHMuaXNvbGF0ZWRTdWJuZXRJZHMsIHByb3BzLmlzb2xhdGVkU3VibmV0TmFtZXMsIHByb3BzLmlzb2xhdGVkU3VibmV0Um91dGVUYWJsZUlkcywgcHJvcHMuaXNvbGF0ZWRTdWJuZXRJcHY0Q2lkckJsb2NrcywgU3VibmV0VHlwZS5QUklWQVRFX0lTT0xBVEVELCB0aGlzLmF2YWlsYWJpbGl0eVpvbmVzLCAnaXNvbGF0ZWRTdWJuZXRJZHMnLCAnaXNvbGF0ZWRTdWJuZXROYW1lcycsICdpc29sYXRlZFN1Ym5ldFJvdXRlVGFibGVJZHMnLCAnaXNvbGF0ZWRTdWJuZXRJcHY0Q2lkckJsb2NrcycpO1xuICAgIC8qIGVzbGludC1lbmFibGUgbWF4LWxlbiAqL1xuXG4gICAgdGhpcy5wdWJsaWNTdWJuZXRzID0gcHViLmltcG9ydCh0aGlzKTtcbiAgICB0aGlzLnByaXZhdGVTdWJuZXRzID0gcHJpdi5pbXBvcnQodGhpcyk7XG4gICAgdGhpcy5pc29sYXRlZFN1Ym5ldHMgPSBpc28uaW1wb3J0KHRoaXMpO1xuICB9XG5cbiAgcHVibGljIGdldCB2cGNDaWRyQmxvY2soKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5jaWRyID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHBlcmZvcm0gdGhpcyBvcGVyYXRpb246IFxcJ3ZwY0NpZHJCbG9ja1xcJyB3YXMgbm90IHN1cHBsaWVkIHdoZW4gY3JlYXRpbmcgdGhpcyBWUEMnKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY2lkcjtcbiAgfVxufVxuXG5jbGFzcyBMb29rZWRVcFZwYyBleHRlbmRzIFZwY0Jhc2Uge1xuICBwdWJsaWMgcmVhZG9ubHkgdnBjSWQ6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IHZwY0Fybjogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgaW50ZXJuZXRDb25uZWN0aXZpdHlFc3RhYmxpc2hlZDogSURlcGVuZGFibGUgPSBuZXcgRGVwZW5kZW5jeUdyb3VwKCk7XG4gIHB1YmxpYyByZWFkb25seSBhdmFpbGFiaWxpdHlab25lczogc3RyaW5nW107XG4gIHB1YmxpYyByZWFkb25seSBwdWJsaWNTdWJuZXRzOiBJU3VibmV0W107XG4gIHB1YmxpYyByZWFkb25seSBwcml2YXRlU3VibmV0czogSVN1Ym5ldFtdO1xuICBwdWJsaWMgcmVhZG9ubHkgaXNvbGF0ZWRTdWJuZXRzOiBJU3VibmV0W107XG4gIHByaXZhdGUgcmVhZG9ubHkgY2lkcj86IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogY3hhcGkuVnBjQ29udGV4dFJlc3BvbnNlLCBpc0luY29tcGxldGU6IGJvb2xlYW4pIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIHJlZ2lvbjogcHJvcHMucmVnaW9uLFxuICAgIH0pO1xuXG4gICAgdGhpcy52cGNJZCA9IHByb3BzLnZwY0lkO1xuICAgIHRoaXMudnBjQXJuID0gQXJuLmZvcm1hdCh7XG4gICAgICBzZXJ2aWNlOiAnZWMyJyxcbiAgICAgIHJlc291cmNlOiAndnBjJyxcbiAgICAgIHJlc291cmNlTmFtZTogdGhpcy52cGNJZCxcbiAgICB9LCBTdGFjay5vZih0aGlzKSk7XG4gICAgdGhpcy5jaWRyID0gcHJvcHMudnBjQ2lkckJsb2NrO1xuICAgIHRoaXMuX3ZwbkdhdGV3YXlJZCA9IHByb3BzLnZwbkdhdGV3YXlJZDtcbiAgICB0aGlzLmluY29tcGxldGVTdWJuZXREZWZpbml0aW9uID0gaXNJbmNvbXBsZXRlO1xuXG4gICAgY29uc3Qgc3VibmV0R3JvdXBzID0gcHJvcHMuc3VibmV0R3JvdXBzIHx8IFtdO1xuICAgIGNvbnN0IGF2YWlsYWJpbGl0eVpvbmVzID0gQXJyYXkuZnJvbShuZXcgU2V0PHN0cmluZz4oZmxhdE1hcChzdWJuZXRHcm91cHMsIHN1Ym5ldEdyb3VwID0+IHtcbiAgICAgIHJldHVybiBzdWJuZXRHcm91cC5zdWJuZXRzLm1hcChzdWJuZXQgPT4gc3VibmV0LmF2YWlsYWJpbGl0eVpvbmUpO1xuICAgIH0pKSk7XG4gICAgYXZhaWxhYmlsaXR5Wm9uZXMuc29ydCgoYXoxLCBhejIpID0+IGF6MS5sb2NhbGVDb21wYXJlKGF6MikpO1xuICAgIHRoaXMuYXZhaWxhYmlsaXR5Wm9uZXMgPSBhdmFpbGFiaWxpdHlab25lcztcblxuICAgIHRoaXMucHVibGljU3VibmV0cyA9IHRoaXMuZXh0cmFjdFN1Ym5ldHNPZlR5cGUoc3VibmV0R3JvdXBzLCBjeGFwaS5WcGNTdWJuZXRHcm91cFR5cGUuUFVCTElDKTtcbiAgICB0aGlzLnByaXZhdGVTdWJuZXRzID0gdGhpcy5leHRyYWN0U3VibmV0c09mVHlwZShzdWJuZXRHcm91cHMsIGN4YXBpLlZwY1N1Ym5ldEdyb3VwVHlwZS5QUklWQVRFKTtcbiAgICB0aGlzLmlzb2xhdGVkU3VibmV0cyA9IHRoaXMuZXh0cmFjdFN1Ym5ldHNPZlR5cGUoc3VibmV0R3JvdXBzLCBjeGFwaS5WcGNTdWJuZXRHcm91cFR5cGUuSVNPTEFURUQpO1xuICB9XG5cbiAgcHVibGljIGdldCB2cGNDaWRyQmxvY2soKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5jaWRyID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIFZhbHVlIG1pZ2h0IGJlIGNhY2hlZCBmcm9tIGFuIG9sZCBDTEkgdmVyc2lvbiwgc28gYnVtcGluZyB0aGUgQ1ggQVBJIHByb3RvY29sIHRvXG4gICAgICAvLyBmb3JjZSB0aGUgdmFsdWUgdG8gZXhpc3Qgd291bGQgbm90IGhhdmUgaGVscGVkLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgcGVyZm9ybSB0aGlzIG9wZXJhdGlvbjogXFwndnBjQ2lkckJsb2NrXFwnIHdhcyBub3QgZm91bmQgd2hlbiBsb29raW5nIHVwIHRoaXMgVlBDLiBVc2UgYSBuZXdlciB2ZXJzaW9uIG9mIHRoZSBDREsgQ0xJIGFuZCBjbGVhciB0aGUgb2xkIGNvbnRleHQgdmFsdWUuJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNpZHI7XG4gIH1cblxuICBwcml2YXRlIGV4dHJhY3RTdWJuZXRzT2ZUeXBlKHN1Ym5ldEdyb3VwczogY3hhcGkuVnBjU3VibmV0R3JvdXBbXSwgc3VibmV0R3JvdXBUeXBlOiBjeGFwaS5WcGNTdWJuZXRHcm91cFR5cGUpOiBJU3VibmV0W10ge1xuICAgIHJldHVybiBmbGF0TWFwKHN1Ym5ldEdyb3Vwcy5maWx0ZXIoc3VibmV0R3JvdXAgPT4gc3VibmV0R3JvdXAudHlwZSA9PT0gc3VibmV0R3JvdXBUeXBlKSxcbiAgICAgIHN1Ym5ldEdyb3VwID0+IHRoaXMuc3VibmV0R3JvdXBUb1N1Ym5ldHMoc3VibmV0R3JvdXApKTtcbiAgfVxuXG4gIHByaXZhdGUgc3VibmV0R3JvdXBUb1N1Ym5ldHMoc3VibmV0R3JvdXA6IGN4YXBpLlZwY1N1Ym5ldEdyb3VwKTogSVN1Ym5ldFtdIHtcbiAgICBjb25zdCByZXQgPSBuZXcgQXJyYXk8SVN1Ym5ldD4oKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN1Ym5ldEdyb3VwLnN1Ym5ldHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHZwY1N1Ym5ldCA9IHN1Ym5ldEdyb3VwLnN1Ym5ldHNbaV07XG4gICAgICByZXQucHVzaChTdWJuZXQuZnJvbVN1Ym5ldEF0dHJpYnV0ZXModGhpcywgYCR7c3VibmV0R3JvdXAubmFtZX1TdWJuZXQke2kgKyAxfWAsIHtcbiAgICAgICAgYXZhaWxhYmlsaXR5Wm9uZTogdnBjU3VibmV0LmF2YWlsYWJpbGl0eVpvbmUsXG4gICAgICAgIHN1Ym5ldElkOiB2cGNTdWJuZXQuc3VibmV0SWQsXG4gICAgICAgIHJvdXRlVGFibGVJZDogdnBjU3VibmV0LnJvdXRlVGFibGVJZCxcbiAgICAgICAgaXB2NENpZHJCbG9jazogdnBjU3VibmV0LmNpZHIsXG4gICAgICB9KSk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cbn1cblxuZnVuY3Rpb24gZmxhdE1hcDxULCBVPih4czogVFtdLCBmbjogKHg6IFQpID0+IFVbXSk6IFVbXSB7XG4gIGNvbnN0IHJldCA9IG5ldyBBcnJheTxVPigpO1xuICBmb3IgKGNvbnN0IHggb2YgeHMpIHtcbiAgICByZXQucHVzaCguLi5mbih4KSk7XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cblxuY2xhc3MgQ29tcG9zaXRlRGVwZW5kYWJsZSBpbXBsZW1lbnRzIElEZXBlbmRhYmxlIHtcbiAgcHJpdmF0ZSByZWFkb25seSBkZXBlbmRhYmxlcyA9IG5ldyBBcnJheTxJRGVwZW5kYWJsZT4oKTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBEZXBlbmRhYmxlLmltcGxlbWVudCh0aGlzLCB7XG4gICAgICBnZXQgZGVwZW5kZW5jeVJvb3RzKCkge1xuICAgICAgICBjb25zdCByZXQgPSBuZXcgQXJyYXk8SUNvbnN0cnVjdD4oKTtcbiAgICAgICAgZm9yIChjb25zdCBkZXAgb2Ygc2VsZi5kZXBlbmRhYmxlcykge1xuICAgICAgICAgIHJldC5wdXNoKC4uLkRlcGVuZGFibGUub2YoZGVwKS5kZXBlbmRlbmN5Um9vdHMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGNvbnN0cnVjdCB0byB0aGUgZGVwZW5kZW5jeSByb290c1xuICAgKi9cbiAgcHVibGljIGFkZChkZXA6IElEZXBlbmRhYmxlKSB7XG4gICAgdGhpcy5kZXBlbmRhYmxlcy5wdXNoKGRlcCk7XG4gIH1cbn1cblxuLyoqXG4gKiBJbnZva2UgYSBmdW5jdGlvbiBvbiBhIHZhbHVlIChmb3IgaXRzIHNpZGUgZWZmZWN0KSBhbmQgcmV0dXJuIHRoZSB2YWx1ZVxuICovXG5mdW5jdGlvbiB0YXA8VD4oeDogVCwgZm46ICh4OiBUKSA9PiB2b2lkKTogVCB7XG4gIGZuKHgpO1xuICByZXR1cm4geDtcbn1cblxuY2xhc3MgSW1wb3J0ZWRTdWJuZXQgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElTdWJuZXQsIElQdWJsaWNTdWJuZXQsIElQcml2YXRlU3VibmV0IHtcbiAgcHVibGljIHJlYWRvbmx5IGludGVybmV0Q29ubmVjdGl2aXR5RXN0YWJsaXNoZWQ6IElEZXBlbmRhYmxlID0gbmV3IERlcGVuZGVuY3lHcm91cCgpO1xuICBwdWJsaWMgcmVhZG9ubHkgc3VibmV0SWQ6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IHJvdXRlVGFibGU6IElSb3V0ZVRhYmxlO1xuICBwcml2YXRlIHJlYWRvbmx5IF9hdmFpbGFiaWxpdHlab25lPzogc3RyaW5nO1xuICBwcml2YXRlIHJlYWRvbmx5IF9pcHY0Q2lkckJsb2NrPzogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGF0dHJzOiBTdWJuZXRBdHRyaWJ1dGVzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGlmICghYXR0cnMucm91dGVUYWJsZUlkKSB7XG4gICAgICAvLyBUaGUgZm9sbG93aW5nIGxvb2tzIGEgbGl0dGxlIHdlaXJkLCBidXQgY29tZXMgZG93biB0bzpcbiAgICAgIC8vXG4gICAgICAvLyAqIElzIHRoZSBzdWJuZXRJZCBpdHNlbGYgdW5yZXNvbHZlZCAoeyBSZWY6IFN1Ym5ldCB9KTsgb3JcbiAgICAgIC8vICogV2FzIGl0IHRoZSBhY2NpZGVudGFsbHkgZXh0cmFjdGVkIGZpcnN0IGVsZW1lbnQgb2YgYSBsaXN0LWVuY29kZWRcbiAgICAgIC8vICAgdG9rZW4/ICh7IEZuOjpJbXBvcnRWYWx1ZTogU3VibmV0cyB9ID0+IFsnI3tUb2tlblsxMjM0XX0nXSA9PlxuICAgICAgLy8gICAnI3tUb2tlblsxMjM0XX0nXG4gICAgICAvL1xuICAgICAgLy8gVGhlcmUncyBubyBvdGhlciBBUEkgdG8gdGVzdCBmb3IgdGhlIHNlY29uZCBjYXNlIHRoYW4gdG8gdGhlIHN0cmluZyBiYWNrIGludG9cbiAgICAgIC8vIGEgbGlzdCBhbmQgc2VlIGlmIHRoZSBjb21iaW5hdGlvbiBpcyBVbnJlc29sdmVkLlxuICAgICAgLy9cbiAgICAgIC8vIEluIGJvdGggY2FzZXMgd2UgY2FuJ3Qgb3V0cHV0IHRoZSBzdWJuZXRJZCBsaXRlcmFsbHkgaW50byB0aGUgbWV0YWRhdGEgKGJlY2F1c2UgaXQnbGxcbiAgICAgIC8vIGJlIHVzZWxlc3MpLiBJbiB0aGUgMm5kIGNhc2UgZXZlbiwgaWYgd2Ugb3V0cHV0IGl0IHRvIG1ldGFkYXRhLCB0aGUgYHJlc29sdmUoKWAgY2FsbFxuICAgICAgLy8gdGhhdCBnZXRzIGRvbmUgb24gdGhlIG1ldGFkYXRhIHdpbGwgZXZlbiBgdGhyb3dgLCBiZWNhdXNlIHRoZSAnI3tUb2tlbn0nIHZhbHVlIHdpbGxcbiAgICAgIC8vIG9jY3VyIGluIGFuIGlsbGVnYWwgcG9zaXRpb24gKG5vdCBpbiBhIGxpc3QgY29udGV4dCkuXG4gICAgICBjb25zdCByZWYgPSBUb2tlbi5pc1VucmVzb2x2ZWQoYXR0cnMuc3VibmV0SWQpIHx8IFRva2VuLmlzVW5yZXNvbHZlZChbYXR0cnMuc3VibmV0SWRdKVxuICAgICAgICA/IGBhdCAnJHtOb2RlLm9mKHNjb3BlKS5wYXRofS8ke2lkfSdgXG4gICAgICAgIDogYCcke2F0dHJzLnN1Ym5ldElkfSdgO1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgICAgIEFubm90YXRpb25zLm9mKHRoaXMpLmFkZFdhcm5pbmcoYE5vIHJvdXRlVGFibGVJZCB3YXMgcHJvdmlkZWQgdG8gdGhlIHN1Ym5ldCAke3JlZn0uIEF0dGVtcHRpbmcgdG8gcmVhZCBpdHMgLnJvdXRlVGFibGUucm91dGVUYWJsZUlkIHdpbGwgcmV0dXJuIG51bGwvdW5kZWZpbmVkLiAoTW9yZSBpbmZvOiBodHRwczovL2dpdGh1Yi5jb20vYXdzL2F3cy1jZGsvcHVsbC8zMTcxKWApO1xuICAgIH1cblxuICAgIHRoaXMuX2lwdjRDaWRyQmxvY2sgPSBhdHRycy5pcHY0Q2lkckJsb2NrO1xuICAgIHRoaXMuX2F2YWlsYWJpbGl0eVpvbmUgPSBhdHRycy5hdmFpbGFiaWxpdHlab25lO1xuICAgIHRoaXMuc3VibmV0SWQgPSBhdHRycy5zdWJuZXRJZDtcbiAgICB0aGlzLnJvdXRlVGFibGUgPSB7XG4gICAgICAvLyBGb3JjaW5nIHJvdXRlVGFibGVJZCB0byBwcmV0ZW5kIG5vbi1udWxsIHRvIG1haW50YWluIGJhY2t3YXJkcy1jb21wYXRpYmlsaXR5LiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3cy9hd3MtY2RrL3B1bGwvMzE3MVxuICAgICAgcm91dGVUYWJsZUlkOiBhdHRycy5yb3V0ZVRhYmxlSWQhLFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgZ2V0IGF2YWlsYWJpbGl0eVpvbmUoKTogc3RyaW5nIHtcbiAgICBpZiAoIXRoaXMuX2F2YWlsYWJpbGl0eVpvbmUpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBjYW5ub3QgcmVmZXJlbmNlIGEgU3VibmV0XFwncyBhdmFpbGFiaWxpdHkgem9uZSBpZiBpdCB3YXMgbm90IHN1cHBsaWVkLiBBZGQgdGhlIGF2YWlsYWJpbGl0eVpvbmUgd2hlbiBpbXBvcnRpbmcgdXNpbmcgU3VibmV0LmZyb21TdWJuZXRBdHRyaWJ1dGVzKCknKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2F2YWlsYWJpbGl0eVpvbmU7XG4gIH1cblxuICBwdWJsaWMgZ2V0IGlwdjRDaWRyQmxvY2soKTogc3RyaW5nIHtcbiAgICBpZiAoIXRoaXMuX2lwdjRDaWRyQmxvY2spIHtcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbWF4LWxpbmUtbGVuZ3RoXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBjYW5ub3QgcmVmZXJlbmNlIGFuIGltcG9ydGVkIFN1Ym5ldFxcJ3MgSVB2NCBDSURSIGlmIGl0IHdhcyBub3Qgc3VwcGxpZWQuIEFkZCB0aGUgaXB2NENpZHJCbG9jayB3aGVuIGltcG9ydGluZyB1c2luZyBTdWJuZXQuZnJvbVN1Ym5ldEF0dHJpYnV0ZXMoKScpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5faXB2NENpZHJCbG9jaztcbiAgfVxuXG4gIHB1YmxpYyBhc3NvY2lhdGVOZXR3b3JrQWNsKGlkOiBzdHJpbmcsIG5ldHdvcmtBY2w6IElOZXR3b3JrQWNsKTogdm9pZCB7XG4gICAgY29uc3Qgc2NvcGUgPSBuZXR3b3JrQWNsIGluc3RhbmNlb2YgQ29uc3RydWN0ID8gbmV0d29ya0FjbCA6IHRoaXM7XG4gICAgY29uc3Qgb3RoZXIgPSBuZXR3b3JrQWNsIGluc3RhbmNlb2YgQ29uc3RydWN0ID8gdGhpcyA6IG5ldHdvcmtBY2w7XG4gICAgbmV3IFN1Ym5ldE5ldHdvcmtBY2xBc3NvY2lhdGlvbihzY29wZSwgaWQgKyBOYW1lcy5ub2RlVW5pcXVlSWQob3RoZXIubm9kZSksIHtcbiAgICAgIG5ldHdvcmtBY2wsXG4gICAgICBzdWJuZXQ6IHRoaXMsXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgKGFuZCB2YWxpZGF0ZSkgdGhlIE5BVCBnYXRld2F5IGNvdW50IHcuci50LiB0aGUgcmVzdCBvZiB0aGUgc3VibmV0IGNvbmZpZ3VyYXRpb25cbiAqXG4gKiBXZSBoYXZlIHRoZSBmb2xsb3dpbmcgcmVxdWlyZW1lbnRzOlxuICpcbiAqIC0gTmF0R2F0ZXdheUNvdW50ID0gMCA9PT4gdGhlcmUgYXJlIG5vIHByaXZhdGUgc3VibmV0c1xuICogLSBOYXRHYXRld2F5Q291bnQgPiAwID09PiB0aGVyZSBtdXN0IGJlIHB1YmxpYyBzdWJuZXRzXG4gKlxuICogRG8gd2Ugd2FudCB0byByZXF1aXJlIHRoYXQgdGhlcmUgYXJlIHByaXZhdGUgc3VibmV0cyBpZiB0aGVyZSBhcmUgTmF0R2F0ZXdheXM/XG4gKiBUaGV5IHNlZW0gcG9pbnRsZXNzIGJ1dCBJIHNlZSBubyByZWFzb24gdG8gcHJldmVudCBpdC5cbiAqL1xuZnVuY3Rpb24gZGV0ZXJtaW5lTmF0R2F0ZXdheUNvdW50KHJlcXVlc3RlZENvdW50OiBudW1iZXIgfCB1bmRlZmluZWQsIHN1Ym5ldENvbmZpZzogU3VibmV0Q29uZmlndXJhdGlvbltdLCBhekNvdW50OiBudW1iZXIpIHtcbiAgY29uc3QgaGFzUHJpdmF0ZVN1Ym5ldHMgPSBzdWJuZXRDb25maWcuc29tZShjID0+IChjLnN1Ym5ldFR5cGUgPT09IFN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX0VHUkVTU1xuICAgIHx8IGMuc3VibmV0VHlwZSA9PT0gU3VibmV0VHlwZS5QUklWQVRFIHx8IGMuc3VibmV0VHlwZSA9PT0gU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfTkFUKSAmJiAhYy5yZXNlcnZlZCk7XG4gIGNvbnN0IGhhc1B1YmxpY1N1Ym5ldHMgPSBzdWJuZXRDb25maWcuc29tZShjID0+IGMuc3VibmV0VHlwZSA9PT0gU3VibmV0VHlwZS5QVUJMSUMpO1xuICBjb25zdCBoYXNDdXN0b21FZ3Jlc3MgPSBzdWJuZXRDb25maWcuc29tZShjID0+IGMuc3VibmV0VHlwZSA9PT0gU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfRUdSRVNTKTtcblxuICBjb25zdCBjb3VudCA9IHJlcXVlc3RlZENvdW50ICE9PSB1bmRlZmluZWQgPyBNYXRoLm1pbihyZXF1ZXN0ZWRDb3VudCwgYXpDb3VudCkgOiAoaGFzUHJpdmF0ZVN1Ym5ldHMgPyBhekNvdW50IDogMCk7XG5cbiAgaWYgKGNvdW50ID09PSAwICYmIGhhc1ByaXZhdGVTdWJuZXRzICYmICFoYXNDdXN0b21FZ3Jlc3MpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICAgIHRocm93IG5ldyBFcnJvcignSWYgeW91IGRvIG5vdCB3YW50IE5BVCBnYXRld2F5cyAobmF0R2F0ZXdheXM9MCksIG1ha2Ugc3VyZSB5b3UgZG9uXFwndCBjb25maWd1cmUgYW55IFBSSVZBVEUoX1dJVEhfTkFUKSBzdWJuZXRzIGluIFxcJ3N1Ym5ldENvbmZpZ3VyYXRpb25cXCcgKG1ha2UgdGhlbSBQVUJMSUMgb3IgSVNPTEFURUQgaW5zdGVhZCknKTtcbiAgfVxuXG4gIGlmIChjb3VudCA+IDAgJiYgIWhhc1B1YmxpY1N1Ym5ldHMpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICAgIHRocm93IG5ldyBFcnJvcihgSWYgeW91IGNvbmZpZ3VyZSBQUklWQVRFIHN1Ym5ldHMgaW4gJ3N1Ym5ldENvbmZpZ3VyYXRpb24nLCB5b3UgbXVzdCBhbHNvIGNvbmZpZ3VyZSBQVUJMSUMgc3VibmV0cyB0byBwdXQgdGhlIE5BVCBnYXRld2F5cyBpbnRvIChnb3QgJHtKU09OLnN0cmluZ2lmeShzdWJuZXRDb25maWcpfS5gKTtcbiAgfVxuXG4gIHJldHVybiBjb3VudDtcbn1cblxuLyoqXG4gKiBUaGVyZSBhcmUgcmV0dXJuZWQgd2hlbiB0aGUgcHJvdmlkZXIgaGFzIG5vdCBzdXBwbGllZCBwcm9wcyB5ZXRcbiAqXG4gKiBJdCdzIG9ubHkgdXNlZCBmb3IgdGVzdGluZyBhbmQgb24gdGhlIGZpcnN0IHJ1bi10aHJvdWdoLlxuICovXG5jb25zdCBEVU1NWV9WUENfUFJPUFM6IGN4YXBpLlZwY0NvbnRleHRSZXNwb25zZSA9IHtcbiAgYXZhaWxhYmlsaXR5Wm9uZXM6IFtdLFxuICB2cGNDaWRyQmxvY2s6ICcxLjIuMy40LzUnLFxuICBpc29sYXRlZFN1Ym5ldElkczogdW5kZWZpbmVkLFxuICBpc29sYXRlZFN1Ym5ldE5hbWVzOiB1bmRlZmluZWQsXG4gIGlzb2xhdGVkU3VibmV0Um91dGVUYWJsZUlkczogdW5kZWZpbmVkLFxuICBwcml2YXRlU3VibmV0SWRzOiB1bmRlZmluZWQsXG4gIHByaXZhdGVTdWJuZXROYW1lczogdW5kZWZpbmVkLFxuICBwcml2YXRlU3VibmV0Um91dGVUYWJsZUlkczogdW5kZWZpbmVkLFxuICBwdWJsaWNTdWJuZXRJZHM6IHVuZGVmaW5lZCxcbiAgcHVibGljU3VibmV0TmFtZXM6IHVuZGVmaW5lZCxcbiAgcHVibGljU3VibmV0Um91dGVUYWJsZUlkczogdW5kZWZpbmVkLFxuICBzdWJuZXRHcm91cHM6IFtcbiAgICB7XG4gICAgICBuYW1lOiAnUHVibGljJyxcbiAgICAgIHR5cGU6IGN4YXBpLlZwY1N1Ym5ldEdyb3VwVHlwZS5QVUJMSUMsXG4gICAgICBzdWJuZXRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBhdmFpbGFiaWxpdHlab25lOiAnZHVtbXkxYScsXG4gICAgICAgICAgc3VibmV0SWQ6ICdzLTEyMzQ1JyxcbiAgICAgICAgICByb3V0ZVRhYmxlSWQ6ICdydGItMTIzNDVzJyxcbiAgICAgICAgICBjaWRyOiAnMS4yLjMuNC81JyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICdkdW1teTFiJyxcbiAgICAgICAgICBzdWJuZXRJZDogJ3MtNjc4OTAnLFxuICAgICAgICAgIHJvdXRlVGFibGVJZDogJ3J0Yi02Nzg5MHMnLFxuICAgICAgICAgIGNpZHI6ICcxLjIuMy40LzUnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdQcml2YXRlJyxcbiAgICAgIHR5cGU6IGN4YXBpLlZwY1N1Ym5ldEdyb3VwVHlwZS5QUklWQVRFLFxuICAgICAgc3VibmV0czogW1xuICAgICAgICB7XG4gICAgICAgICAgYXZhaWxhYmlsaXR5Wm9uZTogJ2R1bW15MWEnLFxuICAgICAgICAgIHN1Ym5ldElkOiAncC0xMjM0NScsXG4gICAgICAgICAgcm91dGVUYWJsZUlkOiAncnRiLTEyMzQ1cCcsXG4gICAgICAgICAgY2lkcjogJzEuMi4zLjQvNScsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBhdmFpbGFiaWxpdHlab25lOiAnZHVtbXkxYicsXG4gICAgICAgICAgc3VibmV0SWQ6ICdwLTY3ODkwJyxcbiAgICAgICAgICByb3V0ZVRhYmxlSWQ6ICdydGItNTc4OTBwJyxcbiAgICAgICAgICBjaWRyOiAnMS4yLjMuNC81JyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnSXNvbGF0ZWQnLFxuICAgICAgdHlwZTogY3hhcGkuVnBjU3VibmV0R3JvdXBUeXBlLklTT0xBVEVELFxuICAgICAgc3VibmV0czogW1xuICAgICAgICB7XG4gICAgICAgICAgYXZhaWxhYmlsaXR5Wm9uZTogJ2R1bW15MWEnLFxuICAgICAgICAgIHN1Ym5ldElkOiAncC0xMjM0NScsXG4gICAgICAgICAgcm91dGVUYWJsZUlkOiAncnRiLTEyMzQ1cCcsXG4gICAgICAgICAgY2lkcjogJzEuMi4zLjQvNScsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBhdmFpbGFiaWxpdHlab25lOiAnZHVtbXkxYicsXG4gICAgICAgICAgc3VibmV0SWQ6ICdwLTY3ODkwJyxcbiAgICAgICAgICByb3V0ZVRhYmxlSWQ6ICdydGItNTc4OTBwJyxcbiAgICAgICAgICBjaWRyOiAnMS4yLjMuNC81JyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgXSxcbiAgdnBjSWQ6ICd2cGMtMTIzNDUnLFxufTtcbiJdfQ==