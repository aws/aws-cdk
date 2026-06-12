import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cx_api from 'aws-cdk-lib/cx-api';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  context: {
    [cx_api.VALIDATE_AGAINST_DEFAULT_RULES]: true,
    [cx_api.FAIL_SYNTH_ON_VALIDATION_ERRORS_CONTEXT]: false,
  },
});

const stack = new cdk.Stack(app, 'DefaultValidationPluginStack');

const bucket = new s3.Bucket(stack, 'MyBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

// Inject an invalid property via escape hatch to trigger a schema violation
const cfnBucket = bucket.node.defaultChild as s3.CfnBucket;
cfnBucket.addPropertyOverride('BogusProperty', 'invalid-value');

new IntegTest(app, 'DefaultValidationPluginTest', {
  testCases: [stack],
});
