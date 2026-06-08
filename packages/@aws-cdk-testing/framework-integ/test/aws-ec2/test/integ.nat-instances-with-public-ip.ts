import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import type { CfnResource } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';

class NatInstanceStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

    const natGatewayProvider = ec2.NatProvider.instanceV2({
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T4G, ec2.InstanceSize.MICRO),
      associatePublicIpAddress: true,
    });

    new ec2.Vpc(this, 'Vpc', {
      natGatewayProvider,
      subnetConfiguration: [
        {
          subnetType: ec2.SubnetType.PUBLIC,
          name: 'Public',
          mapPublicIpOnLaunch: false,
        },
        {
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          name: 'Private',
        },
      ],
    });

    // Suppress Security Guardian for NAT instance security group (open by design)
    const natSgCfn = natGatewayProvider.securityGroup.node.defaultChild as CfnResource;
    natSgCfn.addMetadata('guard', { SuppressedRules: ['EC2_NO_OPEN_SECURITY_GROUPS'] });
  }
}

const app = new cdk.App();
const stack = new NatInstanceStack(app, 'aws-cdk-vpc-nat-instances-v2-with-public-ip');

new IntegTest(app, 'nat-instance-v2-with-public-ip-integ-test', {
  testCases: [stack],
});
