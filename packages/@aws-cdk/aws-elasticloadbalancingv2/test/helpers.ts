import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import elbv2 = require('../lib');

export class FakeSelfRegisteringTarget extends cdk.Construct implements elbv2.IApplicationLoadBalancerTarget, elbv2.INetworkLoadBalancerTarget,
    ec2.IConnectable {
  public readonly securityGroup: ec2.SecurityGroup;
  public readonly connections: ec2.Connections;

  constructor(parent: cdk.Construct, id: string, vpc: ec2.VpcNetwork) {
    super(parent, id);
    this.securityGroup = new ec2.SecurityGroup(this, 'SG', { vpc });
    this.connections = new ec2.Connections({
      securityGroup: this.securityGroup
    });
  }

  public attachToApplicationTargetGroup(targetGroup: elbv2.ApplicationTargetGroup): elbv2.LoadBalancerTargetProps {
    targetGroup.registerConnectable(this);
    return { targetType: elbv2.TargetType.SelfRegistering };
  }

  public attachToNetworkTargetGroup(_targetGroup: elbv2.NetworkTargetGroup): elbv2.LoadBalancerTargetProps {
    return { targetType: elbv2.TargetType.SelfRegistering };
  }
}
