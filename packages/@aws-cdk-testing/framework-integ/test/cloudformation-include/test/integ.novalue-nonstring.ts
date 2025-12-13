import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { CfnInclude } from 'aws-cdk-lib/cloudformation-include';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-cfninclude-novalue-boolean');

const templateFile = path.join(__dirname, 'test-templates', 'novalue-boolean.json');

// Include a template that has a AWS::NoValue property in place of a boolean
const cfnInclude = new CfnInclude(stack, 'Template', {
  templateFile,
});

const bucket = cfnInclude.getResource('TestBucket');

new cdk.CfnOutput(stack, 'BucketName', {
  value: bucket.ref,
});

// The fact that synthesis is successful means that AWS::NoValue is evaluated correctly.
new IntegTest(app, 'CfnIncludeNoValueBooleanTest', {
  testCases: [stack],
});
