import * as iam from '@aws-cdk/aws-iam';
import { Bucket } from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as lambda from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-lambda-customize-roles');
iam.Role.customizeRoles(stack, {
  usePrecreatedRoles: {
    'integ-lambda-customize-roles/MyLambda/ServiceRole': 'precreated-role',
  },
});

const fn = new lambda.Function(stack, 'MyLambda', {
  code: new lambda.InlineCode('foo'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_14_X,
});

const bucket = new Bucket(stack, 'Bucket');
bucket.grantRead(fn);

/**
 * This test will not deploy and is only used to provide an example
 * of the synthesized iam policy report
 */
new IntegTest(app, 'IntegTest', {
  testCases: [stack],
  cdkCommandOptions: {
    deploy: {
      enabled: false,
    },
    destroy: {
      enabled: false,
    },
  },
});
