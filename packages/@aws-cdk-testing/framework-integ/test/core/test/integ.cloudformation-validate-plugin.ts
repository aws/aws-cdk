import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'CloudFormationValidatePluginStack');

const bucket = new s3.Bucket(stack, 'MyBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

// Inject an invalid property via escape hatch to trigger a schema violation
const cfnBucket = bucket.node.defaultChild as s3.CfnBucket;
cfnBucket.addPropertyOverride('BogusProperty', 'invalid-value');

new IntegTest(app, 'CloudFormationValidatePluginTest', {
  testCases: [stack],
});
