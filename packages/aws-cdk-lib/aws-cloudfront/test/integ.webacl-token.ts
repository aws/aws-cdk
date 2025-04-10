import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { Stack, CfnParameter } from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3 from 'aws-cdk-lib/aws-s3';

const app = new cdk.App();

const stack = new Stack(app, 'IntegCloudFrontWebAclToken');

const bucket = new s3.Bucket(stack, 'Bucket')

const origin = new origins.S3Origin(bucket);

// Parameter simulating an imported or unresolved WebACL ID
const webAclParam = new CfnParameter(stack, 'WebAclIdParam', {
  type: 'String',
  description: 'WebACL ID or ARN',
});

new cloudfront.Distribution(stack, 'DistWithResolvedWebAcl', {
  defaultBehavior: { origin },
  webAclId: 'arn:aws:wafv2:us-east-1:123456789012:global/webacl/ExampleWebACL/473e64fd-f30b-4765-81a0-62ad96dd167a',
});

new cloudfront.Distribution(stack, 'DistWithTokenWebAcl', {
  defaultBehavior: { origin },
  webAclId: webAclParam.valueAsString, // unresolved token
});

new cdk.CfnOutput(stack, 'ResolvedWebAclId', {
  value: 'arn:aws:wafv2:us-east-1:123456789012:global/webacl/ExampleWebACL/473e64fd-f30b-4765-81a0-62ad96dd167a',
});

new cdk.CfnOutput(stack, 'TokenWebAclId', {
  value: webAclParam.valueAsString,
});

// Wrap the stack in an IntegTest
new IntegTest(app, 'IntegCloudFrontWebAclTokenTest', {
  testCases: [stack],
});
