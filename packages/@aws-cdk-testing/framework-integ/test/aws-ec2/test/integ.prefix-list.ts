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
    const prefixList = new ec2.PrefixList(this, 'PrefixList', {
      entries: [
        { cidr: '10.0.0.1/32' },
        { cidr: '10.0.0.2/32', description: 'sample1' },
      ],
    });
    const vpc = new ec2.Vpc(this, 'vpc', {
      natGateways: 0,
      maxAzs: 1,
    });
    const sg = new ec2.SecurityGroup(this, 'sg', { vpc });
    sg.connections.allowFrom(prefixList, ec2.Port.udp(80));
  }
}

const app = new App();
new IntegTest(app, 'integ-test', {
  testCases: [new TestCase(app, 'integ-ec2-prefix-list-test')],
});
