import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as cdk from 'aws-cdk-lib';
import * as cloudtrail from 'aws-cdk-lib/aws-cloudtrail';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new cdk.Stack(app, 'integ-cloudtrail');

const bucket = new s3.Bucket(stack, 'Bucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});
const topic = new sns.Topic(stack, 'Topic');
const lambdaFunction = new lambda.Function(stack, 'LambdaFunction', {
  runtime: STANDARD_NODEJS_RUNTIME,
  handler: 'hello.handler',
  code: lambda.Code.fromInline('exports.handler = {}'),
});

const trail = new cloudtrail.Trail(stack, 'Trail', {
  snsTopic: topic,
});
trail.addLambdaEventSelector([lambdaFunction]);
trail.addS3EventSelector([{ bucket }]);

app.synth();
