import { AwsRegion, Construct, Token } from '@aws-cdk/core';
import { VpcNetworkRef } from '@aws-cdk/ec2';
import { logs, route53 } from '@aws-cdk/resources';
import { HostedZoneId, HostedZoneRef } from './hosted-zone-ref';
import { validateZoneName } from './util';

/**
 * Properties of a new hosted zone
 */
export interface PublicHostedZoneProps {
    /**
     * The fully qualified domain name for the hosted zone
     */
    zoneName: string;

    /**
     * Any comments that you want to include about the hosted zone.
     *
     * @default no comment
     */
    comment?: string;

    /**
     * The Amazon Resource Name (ARN) for the log group that you want Amazon Route 53 to send query logs to.
     *
     * @default no DNS query logging
     */
    queryLogsLogGroupArn?: logs.LogGroupArn;
}

/**
 * Create a Route53 public hosted zone.
 */
export class PublicHostedZone extends HostedZoneRef {
    /**
     * Identifier of this hosted zone
     */
    public readonly hostedZoneId: HostedZoneId;

    /**
     * Fully qualified domain name for the hosted zone
     */
    public readonly zoneName: string;

    /**
     * Nameservers for this public hosted zone
     */
    public readonly nameServers: HostedZoneNameServers;

    constructor(parent: Construct, name: string, props: PublicHostedZoneProps) {
        super(parent, name);

        validateZoneName(props.zoneName);

        const hostedZone = new route53.HostedZoneResource(this, 'Resource', {
            ...determineHostedZoneProps(props)
        });

        this.hostedZoneId = hostedZone.ref;
        this.nameServers = hostedZone.hostedZoneNameServers;
        this.zoneName = props.zoneName;
    }
}

/**
 * Properties for a private hosted zone.
 */
export interface PrivateHostedZoneProps extends PublicHostedZoneProps {
    /**
     * One VPC that you want to associate with this hosted zone.
     */
    vpc: VpcNetworkRef;
}

/**
 * Create a Route53 private hosted zone for use in one or more VPCs.
 *
 * Note that `enableDnsHostnames` and `enableDnsSupport` must have been enabled
 * for the VPC you're configuring for private hosted zones.
 */
export class PrivateHostedZone extends HostedZoneRef {
    /**
     * Identifier of this hosted zone
     */
    public readonly hostedZoneId: HostedZoneId;

    /**
     * Fully qualified domain name for the hosted zone
     */
    public readonly zoneName: string;

    /**
     * VPCs to which this hosted zone will be added
     */
    private readonly vpcs: route53.HostedZoneResource.VPCProperty[] = [];

    constructor(parent: Construct, name: string, props: PrivateHostedZoneProps) {
        super(parent, name);

        validateZoneName(props.zoneName);

        const hostedZone = new route53.HostedZoneResource(this, 'Resource', {
            vpcs: new Token(() => this.vpcs ? this.vpcs : undefined),
            ...determineHostedZoneProps(props)
        });

        this.hostedZoneId = hostedZone.ref;
        this.zoneName = props.zoneName;

        this.addVpc(props.vpc);
    }

    /**
     * Add another VPC to this private hosted zone.
     *
     * @param vpc the other VPC to add.
     */
    public addVpc(vpc: VpcNetworkRef) {
        this.vpcs.push(toVpcProperty(vpc));
    }
}

function toVpcProperty(vpc: VpcNetworkRef): route53.HostedZoneResource.VPCProperty {
    return { vpcId: vpc.vpcId, vpcRegion: new AwsRegion() };
}

export class HostedZoneNameServers extends Token {
}

function determineHostedZoneProps(props: PublicHostedZoneProps) {
    const hostedZoneName = props.zoneName + '.';
    const hostedZoneConfig = props.comment ? { comment: props.comment } : undefined;
    const queryLoggingConfig = props.queryLogsLogGroupArn ? { cloudWatchLogsLogGroupArn: props.queryLogsLogGroupArn } : undefined;

    return { hostedZoneName, hostedZoneConfig, queryLoggingConfig };
}
