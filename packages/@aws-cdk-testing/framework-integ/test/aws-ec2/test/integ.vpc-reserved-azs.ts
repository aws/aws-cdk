import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integtest-vpc-reserved-azs');
stack.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

new ec2.Vpc(stack, 'MyVpc', {
  reservedAzs: 2,
  maxAzs: 3,
});

new IntegTest(app, 'vpc-reserved-azs', {
  testCases: [stack],
});
