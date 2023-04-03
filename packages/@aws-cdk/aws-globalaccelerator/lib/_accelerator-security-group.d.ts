import * as ec2 from '@aws-cdk/aws-ec2';
import { Construct } from 'constructs';
import { EndpointGroup } from '../lib';
/**
 * The security group used by a Global Accelerator to send traffic to resources in a VPC.
 */
export declare class AcceleratorSecurityGroupPeer implements ec2.IPeer {
    private readonly securityGroupId;
    /**
     * Lookup the Global Accelerator security group at CloudFormation deployment time.
     *
     * As of this writing, Global Accelerators (AGA) create a single security group per VPC. AGA security groups are shared
     * by all AGAs in an account. Additionally, there is no CloudFormation mechanism to reference the AGA security groups.
     *
     * This makes creating security group rules which allow traffic from an AGA complicated in CDK. This lookup will identify
     * the AGA security group for a given VPC at CloudFormation deployment time, and lets you create rules for traffic from AGA
     * to other resources created by CDK.
     */
    static fromVpc(scope: Construct, id: string, vpc: ec2.IVpc, endpointGroup: EndpointGroup): AcceleratorSecurityGroupPeer;
    readonly canInlineRule = false;
    readonly connections: ec2.Connections;
    readonly uniqueId: string;
    private constructor();
    toIngressRuleConfig(): any;
    toEgressRuleConfig(): any;
}
