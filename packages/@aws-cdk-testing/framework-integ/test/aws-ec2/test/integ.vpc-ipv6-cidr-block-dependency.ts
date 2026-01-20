/// !cdk-integ VpcIpv6CidrBlockDependencyStack
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

/**
 * Integration test for GitHub issue #36714
 *
 * This test verifies that the `ipv6CidrBlockCreated` property on the VPC class
 * can be used to add explicit dependencies when creating resources that
 * reference `vpcIpv6CidrBlocks`.
 *
 * Without this dependency, CloudFormation may attempt to create resources
 * (like SecurityGroups with IPv6 CIDR rules) before the IPv6 CIDR is allocated,
 * causing deployment failures with:
 * "Fn::Select cannot select nonexistent value at index 0"
 *
 * The fix exposes the `ipv6CidrBlockCreated` property as an IDependable so users
 * can add explicit dependencies to prevent this race condition.
 */
const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a dual-stack VPC with IPv6 enabled
    const vpc = new ec2.Vpc(this, 'DualStackVpc', {
      ipProtocol: ec2.IpProtocol.DUAL_STACK,
      maxAzs: 2,
      subnetConfiguration: [
        {
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
      // Disable NAT gateways to reduce cost and complexity for this test
      natGateways: 0,
      restrictDefaultSecurityGroup: false,
    });

    // Create a SecurityGroup that uses the VPC's IPv6 CIDR blocks
    const securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc,
      description: 'Security group with IPv6 CIDR ingress rule',
      allowAllOutbound: true,
    });

    // Add an ingress rule using the VPC's IPv6 CIDR blocks
    // This is the scenario that causes the race condition without proper dependency
    securityGroup.addIngressRule(
      ec2.Peer.ipv6(cdk.Fn.select(0, vpc.vpcIpv6CidrBlocks)),
      ec2.Port.tcp(443),
      'Allow HTTPS from VPC IPv6 CIDR',
    );

    // Add dependency on ipv6CidrBlockCreated to prevent race condition
    // This is the fix for GitHub issue #36714
    securityGroup.node.addDependency(vpc.ipv6CidrBlockCreated);

    // Output the VPC ID and Security Group ID for verification
    new cdk.CfnOutput(this, 'VpcId', {
      value: vpc.vpcId,
      description: 'VPC ID',
    });

    new cdk.CfnOutput(this, 'SecurityGroupId', {
      value: securityGroup.securityGroupId,
      description: 'Security Group ID',
    });
  }
}

const testStack = new TestStack(app, 'VpcIpv6CidrBlockDependencyStack');

new IntegTest(app, 'VpcIpv6CidrBlockDependency', {
  testCases: [testStack],
});

app.synth();
