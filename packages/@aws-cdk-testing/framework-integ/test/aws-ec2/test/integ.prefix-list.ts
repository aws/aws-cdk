import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import {
  Stack,
  StackProps,
  App,
  aws_ec2 as ec2,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class TestCase extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 1, natGateways: 0, restrictDefaultSecurityGroup: false });
    const securityGroup = new ec2.SecurityGroup(this, 'SG', { vpc, allowAllOutbound: false });

    const pl = new ec2.PrefixList(this, 'PrefixList', {
      entries: [
        { cidr: '10.0.0.1/32' },
        { cidr: '10.0.0.2/32', description: 'sample1' },
      ],
    });
    securityGroup.connections.allowFrom(pl, ec2.Port.SSH);
    securityGroup.connections.allowTo(pl, ec2.Port.HTTP);
  }
}

const app = new App();
new IntegTest(app, 'integ-test', {
  testCases: [new TestCase(app, 'integ-ec2-prefix-list-test')],
});
