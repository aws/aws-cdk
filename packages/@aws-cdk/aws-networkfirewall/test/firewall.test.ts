//import { Template, Match } from '@aws-cdk/assertions';
import { Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as NetFW from '../lib';

test('Default property', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'MyTestVpc', {
    cidr: '10.0.0.0/16',
  });

  // WHEN
  const policy = new NetFW.FirewallPolicy(stack, 'MyNetworkFirewallPolicy', {
    statelessDefaultActions: [NetFW.StatelessStandardAction.DROP],
    statelessFragmentDefaultActions: [NetFW.StatelessStandardAction.DROP],
  });
  new NetFW.Firewall(stack, 'MyNetworkFirewall', {
    vpc: vpc,
    policy: policy,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::NetworkFirewall::Firewall', {
    SubnetMappings: [
      {
        SubnetId: {
          Ref: 'MyTestVpcPublicSubnet1SubnetA7B59A2C',
        },
      },
      {
        SubnetId: {
          Ref: 'MyTestVpcPublicSubnet2SubnetBE93625D',
        },
      },
    ],
    VpcId: {
      Ref: 'MyTestVpcE144EEF4',
    },
  });
});
test('Can get firewall name', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'MyTestVpc', {
    cidr: '10.0.0.0/16',
  });
  const policy = new NetFW.FirewallPolicy(stack, 'MyNetworkFirewallPolicy', {
    statelessDefaultActions: [NetFW.StatelessStandardAction.DROP],
    statelessFragmentDefaultActions: [NetFW.StatelessStandardAction.DROP],
  });

  const firewall = new NetFW.Firewall(stack, 'MyNetworkFirewall', {
    vpc: vpc,
    policy: policy,
  });
  // WHEN
  new cdk.CfnResource(stack, 'Res', {
    type: 'Test::Resource',
    properties: {
      FirewallName: firewall.firewallId,
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('Test::Resource', {
    FirewallName: {
      Ref: 'MyNetworkFirewall02A8AE68',
    },
  });
});

test('Can get firewall by name', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const firewall = NetFW.Firewall.fromFirewallName(stack, 'MyNetworkFirewall', 'MyFirewall');
  // WHEN
  new cdk.CfnResource(stack, 'Res', {
    type: 'Test::Resource',
    properties: {
      FirewallName: firewall.firewallId,
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('Test::Resource', {
    FirewallName: 'MyFirewall',
  });
});

test('firewall name is verified', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'MyTestVpc', {
    cidr: '10.0.0.0/16',
  });
  const policy = new NetFW.FirewallPolicy(stack, 'MyNetworkFirewallPolicy', {
    statelessDefaultActions: [NetFW.StatelessStandardAction.DROP],
    statelessFragmentDefaultActions: [NetFW.StatelessStandardAction.DROP],
  });
  // WHEN
  expect(() => {
    new NetFW.Firewall(stack, 'MyNetworkFirewall', {
      vpc: vpc,
      policy: policy,
      firewallName: 'MyFirewall%3',
    });
  // THEN
  }).toThrow('firewallName must be non-empty and contain only letters, numbers, and dashes, got: \'MyFirewall%3\'');
});


test('Can provide Policy by Arn', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'MyTestVpc', {
    cidr: '10.0.0.0/16',
  });
  const policy = NetFW.FirewallPolicy.fromFirewallPolicyArn(stack, 'MyNetworkFirewallPolicy',
    'arn:aws:network-firewall:us-east-1:012345678910:firewall-policy/MyNetworkFirewallPolicy645720A6',
  );
  // WHEN
  new NetFW.Firewall(stack, 'MyNetworkFirewall', {
    vpc: vpc,
    policy: policy,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::NetworkFirewall::Firewall', {
    SubnetMappings: [
      {
        SubnetId: {
          Ref: 'MyTestVpcPublicSubnet1SubnetA7B59A2C',
        },
      },
      {
        SubnetId: {
          Ref: 'MyTestVpcPublicSubnet2SubnetBE93625D',
        },
      },
    ],
    VpcId: {
      Ref: 'MyTestVpcE144EEF4',
    },
  });
});

test('Can provide full props', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'MyTestVpc', {
    cidr: '10.0.0.0/16',
  });
  const policy = new NetFW.FirewallPolicy(stack, 'MyNetworkFirewallPolicy', {
    statelessDefaultActions: [NetFW.StatelessStandardAction.DROP],
    statelessFragmentDefaultActions: [NetFW.StatelessStandardAction.DROP],
  });
  // WHEN
  new NetFW.Firewall(stack, 'MyNetworkFirewall', {
    firewallName: 'MyFirewall',
    vpc: vpc,
    policy: policy,
    subnetMappings: vpc.selectSubnets({ subnetType: ec2.SubnetType.PUBLIC }),
    description: 'A test firewall',
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::NetworkFirewall::Firewall', {
    FirewallName: 'MyFirewall',
    FirewallPolicyArn: {
      'Fn::GetAtt': [
        'MyNetworkFirewallPolicy645720A6',
        'FirewallPolicyArn',
      ],
    },
    SubnetMappings: [
      {
        SubnetId: {
          Ref: 'MyTestVpcPublicSubnet1SubnetA7B59A2C',
        },
      },
      {
        SubnetId: {
          Ref: 'MyTestVpcPublicSubnet2SubnetBE93625D',
        },
      },
    ],
    VpcId: {
      Ref: 'MyTestVpcE144EEF4',
    },
  });
});
