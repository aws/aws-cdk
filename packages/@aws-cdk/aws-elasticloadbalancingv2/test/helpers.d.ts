import * as ec2 from '@aws-cdk/aws-ec2';
import { Construct } from 'constructs';
import * as elbv2 from '../lib';
export declare class FakeSelfRegisteringTarget extends Construct implements elbv2.IApplicationLoadBalancerTarget, elbv2.INetworkLoadBalancerTarget, ec2.IConnectable {
    readonly securityGroup: ec2.SecurityGroup;
    readonly connections: ec2.Connections;
    constructor(scope: Construct, id: string, vpc: ec2.Vpc);
    attachToApplicationTargetGroup(targetGroup: elbv2.ApplicationTargetGroup): elbv2.LoadBalancerTargetProps;
    attachToNetworkTargetGroup(_targetGroup: elbv2.NetworkTargetGroup): elbv2.LoadBalancerTargetProps;
}
