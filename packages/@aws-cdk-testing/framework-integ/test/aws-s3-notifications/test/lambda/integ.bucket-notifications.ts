import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'lambda-bucket-notifications');

const bucketA = new s3.Bucket(stack, 'MyBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const fn = new lambda.Function(stack, 'MyFunction', {
  runtime: lambda.Runtime.NODEJS_14_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`exports.handler = ${handler.toString()}`),
});

const bucketB = new s3.Bucket(stack, 'YourBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

bucketA.addObjectCreatedNotification(new s3n.LambdaDestination(fn), { suffix: '.png' });
bucketB.addEventNotification(s3.EventType.OBJECT_REMOVED, new s3n.LambdaDestination(fn));

app.synth();

/* eslint-disable no-console */
function handler(event: any, _context: any, callback: any) {
  console.log(JSON.stringify(event, undefined, 2));
  return callback(null, event);
}
