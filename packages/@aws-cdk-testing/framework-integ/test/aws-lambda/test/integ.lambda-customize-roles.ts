import * as iam from 'aws-cdk-lib/aws-iam';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new cdk.Stack(app, 'integ-lambda-customize-roles');
iam.Role.customizeRoles(stack, {
  usePrecreatedRoles: {
    'integ-lambda-customize-roles/MyLambda/ServiceRole': 'precreated-role',
  },
});

const fn = new lambda.Function(stack, 'MyLambda', {
  code: new lambda.InlineCode('foo'),
  handler: 'index.handler',
  runtime: STANDARD_NODEJS_RUNTIME,
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
