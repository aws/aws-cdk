import * as ec2 from '@aws-cdk/aws-ec2';
import * as route53 from '@aws-cdk/aws-route53';
/**
 * Set an InterfaceVpcEndpoint as a target for an ARecord
 */
export declare class InterfaceVpcEndpointTarget implements route53.IAliasRecordTarget {
    private readonly vpcEndpoint;
    private readonly cfnVpcEndpoint;
    constructor(vpcEndpoint: ec2.InterfaceVpcEndpoint);
    bind(_record: route53.IRecordSet, _zone?: route53.IHostedZone): route53.AliasRecordTargetConfig;
}
