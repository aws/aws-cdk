import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import { STANDARD_NODEJS_RUNTIME } from '../../../config';
import * as constructs from 'constructs';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-s3:keepNotificationInImportedBucket': false,
  },
});

const stack = new cdk.Stack(app, 'cdk-integ-lambda-bucket-s3-notifications');

const bucketA = new s3.Bucket(stack, 'MyBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const fn = new lambda.Function(stack, 'MyFunction', {
  runtime: STANDARD_NODEJS_RUNTIME,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`exports.handler = ${handler.toString()}`),
});

const bucketB = new s3.Bucket(stack, 'YourBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

bucketB.addEventNotification(s3.EventType.OBJECT_REMOVED, new s3n.LambdaDestination(fn));

const c1 = new constructs.Construct(stack, 'Construct1');
const unmanagedBucket = s3.Bucket.fromBucketName(c1, 'IntegUnmanagedBucket1', bucketA.bucketName);

unmanagedBucket.addObjectCreatedNotification(new s3n.LambdaDestination(fn), { prefix: 'TEST1/', suffix: '.png' });
unmanagedBucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3n.LambdaDestination(fn), { prefix: 'TEST2/' });

/* eslint-disable no-console */
function handler(event: any, _context: any, callback: any) {
  console.log(JSON.stringify(event, undefined, 2));
  return callback(null, event);
}

const integTest = new integ.IntegTest(app, 'LambdaBucketNotificationsTest', {
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: false,
      },
    },
  },
  testCases: [stack],
  diffAssets: true,
});

const getNotifications = integTest.assertions
  .awsApiCall('S3', 'getBucketNotificationConfiguration', {
    Bucket: unmanagedBucket.bucketName,
  });
getNotifications.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: ['s3:GetBucketNotification'],
  Resource: ['*'],
});

getNotifications.expect(integ.ExpectedResult.objectLike({
  LambdaFunctionConfigurations: [
    {
      Events: [
        's3:ObjectCreated:*',
      ],
      Filter: {
        Key: {
          FilterRules: [
            {
              Name: 'Prefix',
              Value: 'TEST1/',
            },
            {
              Name: 'Suffix',
              Value: '.png',
            },
          ],
        },
      },
    },
    {
      Events: [
        's3:ObjectCreated:*',
      ],
      Filter: {
        Key: {
          FilterRules: [
            {
              Name: 'Prefix',
              Value: 'TEST2/',
            },
          ],
        },
      },
    },
  ],
}));
app.synth();
