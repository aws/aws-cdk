import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Tags } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});

const stack = new cdk.Stack(app, 'aws-cdk-lambda-loggroup-tag-inherit');

const fn = new lambda.Function(stack, 'TaggedFunction', {
  code: lambda.Code.fromInline('exports.handler = async () => {};'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_20_X,
  createLogGroup: true,
  logGroupProps: {
    retention: logs.RetentionDays.ONE_WEEK,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
  },
});

// Tag the function
Tags.of(fn).add('Environment', 'Test');
Tags.of(fn).add('Owner', 'CDKTeam');
Tags.of(fn).add('Phase', 'Neo');
Tags.of(fn).add('Code', 'Buggy');

// Create a version to force synth of currentVersion
void fn.currentVersion;
new integ.IntegTest(app, 'integ-tests-lambda-loggroup-tag-inherit', { testCases: [stack] });

app.synth();
