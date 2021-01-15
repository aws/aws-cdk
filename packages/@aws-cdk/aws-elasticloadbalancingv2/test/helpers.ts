import * as ec2 from '@aws-cdk/aws-ec2';
import * as constructs from 'constructs';
import * as elbv2 from '../lib';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

export class FakeSelfRegisteringTarget extends Construct implements elbv2.IApplicationLoadBalancerTarget, elbv2.INetworkLoadBalancerTarget,
    ec2.IConnectable {
  public readonly securityGroup: ec2.SecurityGroup;
  public readonly connections: ec2.Connections;

  constructor(scope: constructs.Construct, id: string, vpc: ec2.Vpc) {
    super(scope, id);
    this.securityGroup = new ec2.SecurityGroup(this, 'SG', { vpc });
    this.connections = new ec2.Connections({
      securityGroups: [this.securityGroup],
    });
  }

  public attachToApplicationTargetGroup(targetGroup: elbv2.ApplicationTargetGroup): elbv2.LoadBalancerTargetProps {
    targetGroup.registerConnectable(this);
    return { targetType: elbv2.TargetType.INSTANCE };
  }

  public attachToNetworkTargetGroup(_targetGroup: elbv2.NetworkTargetGroup): elbv2.LoadBalancerTargetProps {
    return { targetType: elbv2.TargetType.INSTANCE };
  }
}
