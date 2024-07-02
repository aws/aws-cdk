import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const env = {
  account: process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION,
};

class SgLookupStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

    const testVpc = new ec2.Vpc(this, 'MyVpc', {
      vpcName: 'my-vpc-name',
      ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
      subnetConfiguration: [],
      natGateways: 0,
    });
    const testSgA = new ec2.SecurityGroup(this, 'MySgA', { vpc: testVpc, description: 'my-description' });
    new ec2.SecurityGroup(this, 'MySgB', { vpc: testVpc, description: 'my-description' });
    cdk.Tags.of(testSgA).add('myTag', 'my-value');

    ec2.SecurityGroup.fromLookupByFilters(this, 'SgFromLookup', {
      description: 'my-description',
      tags: {
        myTag: ['my-value'],
      },
    });
  }
}

const stack = new SgLookupStack(app, 'StackWithSg', { env });
new IntegTest(app, 'SgLookupTest', {
  testCases: [stack],
});

app.synth();

