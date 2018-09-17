import ec2 = require('@aws-cdk/aws-ec2');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import { cloudformation, LoadBalancerArn, LoadBalancerCanonicalHostedZoneId,
    LoadBalancerDnsName, LoadBalancerFullName, LoadBalancerName } from './elasticloadbalancingv2.generated';
import { LoadBalancerRef } from './load-balancer-ref';
import { Attributes, renderAttributes } from './util';

/**
 * Properties to define a load balancer
 */
export interface LoadBalancerProps {
    /**
     * Type of the load balancer
     *
     * @default Application
     */
    type?: LoadBalancerType;

    /**
     * Name of the load balancer
     *
     * @default Automatically generated name
     */
    loadBalancerName?: string;

    /**
     * The VPC network to place the load balancer in
     */
    vpc: ec2.VpcNetworkRef;

    /**
     * Whether the load balancer has an internet-routable address
     *
     * @default false
     */
    internetFacing?: boolean;

    /**
     * Where in the VPC to place the load balancer
     *
     * @default Public subnets if internetFacing, otherwise private subnets
     */
    vpcPlacement?: ec2.VpcPlacementStrategy;

    /**
     * Security group to associate with this load balancer
     *
     * @default A security group is created
     */
    securityGroup?: ec2.SecurityGroupRef;

    /**
     * The type of IP addresses to use
     *
     * Only applies to application load balancers.
     *
     * @default IpAddressType.Ipv4
     */
    ipAddressType?: IpAddressType;

    /**
     * Indicates whether deletion protection is enabled.
     *
     * @default false
     */
    deletionProtection?: boolean;

    /**
     * Indicates whether HTTP/2 is enabled.
     *
     * @default true
     */
    http2Enabled?: boolean;

    /**
     * The load balancer idle timeout, in seconds
     *
     * @default 60
     */
    idleTimeoutSecs?: number;

    /**
     * Indicates whether cross-zone load balancing is enabled.
     *
     * @default false
     */
    crossZoneEnabled?: boolean;
}

/**
 * Define a load balancer
 */
export class LoadBalancer extends LoadBalancerRef implements ec2.IConnectable {
    public readonly canonicalHostedZoneId: LoadBalancerCanonicalHostedZoneId;
    public readonly dnsName: LoadBalancerDnsName;
    public readonly fullName: LoadBalancerFullName;
    public readonly loadBalancerName: LoadBalancerName;
    public readonly loadBalancerArn: LoadBalancerArn;
    public readonly connections: ec2.Connections;
    public readonly type: LoadBalancerType;
    private readonly attributes: Attributes = {};

    constructor(parent: cdk.Construct, id: string, props: LoadBalancerProps) {
        super(parent, id);

        this.type = props.type || LoadBalancerType.Application;

        if (this.type !== LoadBalancerType.Application && props.ipAddressType) {
            throw new Error('ipAddressType can only be supplied for application load balancers');
        }

        const securityGroup = props.securityGroup || new ec2.SecurityGroup(this, 'SecurityGroup', {
            vpc: props.vpc,
            description: `Automatically created Security Group for ELB ${this.uniqueId}`
        });
        const internetFacing = ifUndefined(props.internetFacing, false);

        const subnets = props.vpc.subnets(ifUndefined(props.vpcPlacement,
            { subnetsToUse: internetFacing ? ec2.SubnetType.Public : ec2.SubnetType.Private }));

        const resource = new cloudformation.LoadBalancerResource(this, 'Resource', {
            type: this.type,
            loadBalancerName: props.loadBalancerName,
            subnets: subnets.map(s => s.subnetId),
            securityGroups: [securityGroup.securityGroupId],
            scheme: internetFacing ? 'internet-facing' : 'internal',
            ipAddressType: props.ipAddressType,
            loadBalancerAttributes: new cdk.Token(() => renderAttributes(this.attributes)),
        });

        if (props.deletionProtection) { this.attributes['deletion_protection.enabled'] = 'true'; }
        if (props.http2Enabled === false) { this.attributes['routing.http2.enabled'] = 'false'; }
        if (props.idleTimeoutSecs !== undefined) { this.attributes['idle_timeout.timeout_seconds'] = props.idleTimeoutSecs.toString(); }
        if (props.crossZoneEnabled) { this.attributes['load_balancing.cross_zone.enabled'] = 'true'; }

        this.connections = new ec2.Connections({ securityGroup });
        this.canonicalHostedZoneId = resource.loadBalancerCanonicalHostedZoneId;
        this.dnsName = resource.loadBalancerDnsName;
        this.fullName = resource.loadBalancerFullName;
        this.loadBalancerName = resource.loadBalancerName;
        this.loadBalancerArn = resource.ref;
    }

    /**
     * Enable access logging for this load balancer
     */
    public logAccessLogs(bucket: s3.BucketRef, prefix?: string) {
        this.attributes['access_logs.s3.enabled'] = 'true';
        this.attributes['access_logs.s3.bucket'] = bucket.bucketName.toString();
        this.attributes['access_logs.s3.prefix'] = prefix;

        const stack = cdk.Stack.find(this);

        const region = stack.requireRegion('Enable ELBv2 access logging');
        const account = ELBV2_ACCOUNTS[region];
        if (!account) {
            throw new Error(`Cannot enable access logging; don't know ELBv2 account for region ${region}`);
        }

        // FIXME: can't use grantPut() here because that only takes IAM objects, not arbitrary principals
        bucket.addToResourcePolicy(new cdk.PolicyStatement()
            .addPrincipal(new cdk.AccountPrincipal(account))
            .addAction('s3:PutObject')
            .addResource(bucket.arnForObjects(prefix || '', '*')));
    }

    /**
     * Set a non-standard attribute on the load balancer
     *
     * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/application-load-balancers.html#load-balancer-attributes
     */
    public setAttribute(key: string, value: string | undefined) {
        this.attributes[key] = value;
    }
}

/**
 * The type of the load balancer
 */
export enum LoadBalancerType {
    /**
     * An application load balancer
     */
    Application = 'application',

    /**
     * A network load balancer
     */
    Network = 'network',
}

/**
 * What kind of addresses to allocate to the load balancer
 */
export enum IpAddressType {
    /**
     * Allocate IPv4 addresses
     */
    Ipv4 = 'ipv4',

    /**
     * Allocate both IPv4 and IPv6 addresses
     */
    DualStack = 'dualstack',
}

function ifUndefined<T>(x: T | undefined, def: T) {
    return x !== undefined ? x : def;
}

// https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-access-logs.html#access-logging-bucket-permissions
const ELBV2_ACCOUNTS: {[region: string]: string } = {
    'us-east-1': '127311923021',
    'us-east-2': '033677994240',
    'us-west-1': '027434742980',
    'us-west-2': '797873946194',
    'ca-central-1': '985666609251',
    'eu-central-1': '054676820928',
    'eu-west-1': '156460612806',
    'eu-west-2': '652711504416',
    'eu-west-3': '009996457667',
    'ap-northeast-1': '582318560864',
    'ap-northeast-2': '600734575887',
    'ap-northeast-3': '383597477331',
    'ap-southeast-1': '114774131450',
    'ap-southeast-2': '783225319266',
    'ap-south-1': '718504428378',
    'sa-east-1': '507241528517',
    'us-gov-west-1': '048591011584',
    'cn-north-1': '638102146993',
    'cn-northwest-1': '037604701340',
};
