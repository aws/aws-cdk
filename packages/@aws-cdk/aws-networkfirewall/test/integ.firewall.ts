import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as NetFW from '../lib';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const vpc = new ec2.Vpc(this, 'MyTestVpc', {
      cidr: '10.0.0.0/16',
    });

    const policy = new NetFW.FirewallPolicy(this, 'MyNetworkfirewallPolicy', {
      statelessDefaultActions: [NetFW.StatelessStandardAction.DROP],
      statelessFragmentDefaultActions: [NetFW.StatelessStandardAction.DROP],
    });

    new NetFW.Firewall(this, 'networkFirewall', {
      firewallName: 'my-network-firewall',
      vpc: vpc,
      policy: policy,
    });
  }
}

const app = new cdk.App();
new TestStack(app, 'network-firewall-integ-stack');
app.synth();
