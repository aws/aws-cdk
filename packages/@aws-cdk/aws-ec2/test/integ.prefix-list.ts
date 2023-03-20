import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as ec2 from '../lib/index';

const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new ec2.PrefixList(this, 'prefix-list', {
      entries: [
        { cidr: '10.0.0.1/32' },
        { cidr: '10.0.0.2/32', description: 'sample1' },
      ],
    });
  }
}

new IntegTest(app, 'prefix-list', {
  testCases: [
    new TestStack(app, 'PrefixListTestStack', {}),
  ],
});

app.synth();
