import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cloudtrail from 'aws-cdk-lib/aws-cloudtrail';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new cdk.Stack(app, 'integ-cloudtrail-data-events');

const bucket = new s3.Bucket(stack, 'Bucket', { removalPolicy: cdk.RemovalPolicy.DESTROY });
const lambdaFunction = new lambda.Function(stack, 'LambdaFunction', {
  runtime: lambda.Runtime.NODEJS_18_X,
  handler: 'hello.handler',
  code: lambda.Code.fromInline('exports.handler = {}'),
});

const trail = new cloudtrail.Trail(stack, 'Trail', {
  managementEvents: cloudtrail.ReadWriteType.NONE,
});
trail.addLambdaEventSelector([lambdaFunction]);
trail.addS3EventSelector([{ bucket }]);

new integ.IntegTest(app, 'CloudTrailDataEventsOnlyTest', {
  testCases: [stack],
});

app.synth();
