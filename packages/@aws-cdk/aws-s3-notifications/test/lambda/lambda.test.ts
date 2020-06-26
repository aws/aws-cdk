// import { SynthUtils } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import { Stack } from '@aws-cdk/core';
import * as s3n from '../../lib';

test('lambda as notification target', () => {
  // GIVEN
  const stack = new Stack();
  const bucketA = new s3.Bucket(stack, 'MyBucket');
  const fn = new lambda.Function(stack, 'MyFunction', {
    runtime: lambda.Runtime.NODEJS_10_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('foo'),
  });

  // WHEN
  bucketA.addObjectCreatedNotification(new s3n.LambdaDestination(fn), { suffix: '.png' });

  // THEN
  expect(stack).toHaveResource('AWS::Lambda::Permission',  {
    Action: 'lambda:InvokeFunction',
    FunctionName: { 'Fn::GetAtt': [ 'MyFunction3BAA72D1', 'Arn' ] },
    Principal: 's3.amazonaws.com',
    SourceAccount: { Ref: 'AWS::AccountId' },
    SourceArn: { 'Fn::GetAtt': [ 'MyBucketF68F3FF0', 'Arn' ] },
  });

  expect(stack).toHaveResource('Custom::S3BucketNotifications', {
    NotificationConfiguration: {
      LambdaFunctionConfigurations: [
        {
          Events: [ 's3:ObjectCreated:*' ],
          Filter: {
            Key: {
              FilterRules: [ { Name: 'suffix', Value: '.png' } ],
            },
          },
          LambdaFunctionArn: { 'Fn::GetAtt': [ 'MyFunction3BAA72D1', 'Arn' ] },
        },
      ],
    },
  });
});

test('lambda as notification target specified by function arn', () => {
  // GIVEN
  const stack = new Stack();
  const bucketA = new s3.Bucket(stack, 'MyBucket');
  const fn = lambda.Function.fromFunctionArn(stack, 'MyFunction', 'arn:aws:lambda:us-east-1:123456789012:function:ProcessKinesisRecords');

  // WHEN
  bucketA.addObjectCreatedNotification(new s3n.LambdaDestination(fn), { suffix: '.png' });

  // THEN
  expect(stack).toHaveResource('Custom::S3BucketNotifications', {
    NotificationConfiguration: {
      LambdaFunctionConfigurations: [
        {
          Events: [ 's3:ObjectCreated:*' ],
          Filter: {
            Key: {
              FilterRules: [ { Name: 'suffix', Value: '.png' } ],
            },
          },
          LambdaFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:function:ProcessKinesisRecords',
        },
      ],
    },
  });
});

test('permissions are added as a dependency to the notifications resource when using singleton function', () => {

  const stack = new Stack();
  const bucket = new s3.Bucket(stack, 'MyBucket');
  const fn = new lambda.SingletonFunction(stack, 'MyFunction', {
    uuid: 'uuid',
    runtime: lambda.Runtime.NODEJS_10_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('foo'),
  });

  const lambdaDestination = new s3n.LambdaDestination(fn);

  bucket.addEventNotification(s3.EventType.OBJECT_CREATED, lambdaDestination, { prefix: 'v1/'});

  const notifications = stack.node.findAll().filter(c => c.node.id === 'Notifications')[0];
  const dependencies = notifications!.node.dependencies;

  expect(dependencies[0].target.node.id).toEqual('AllowBucketNotificationsFromMyBucket');

});

test('add multiple event notifications using a singleton function', () => {

  const stack = new Stack();
  const bucket = new s3.Bucket(stack, 'MyBucket');
  const fn = new lambda.SingletonFunction(stack, 'MyFunction', {
    uuid: 'uuid',
    runtime: lambda.Runtime.NODEJS_10_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('foo'),
  });

  const lambdaDestination = new s3n.LambdaDestination(fn);

  bucket.addEventNotification(s3.EventType.OBJECT_CREATED, lambdaDestination, { prefix: 'v1/'});
  bucket.addEventNotification(s3.EventType.OBJECT_CREATED, lambdaDestination, { prefix: 'v2/'});

  expect(stack).toHaveResourceLike('Custom::S3BucketNotifications', {
    NotificationConfiguration: {
      LambdaFunctionConfigurations: [
        { Filter: { Key: { FilterRules: [{ Name: 'prefix', Value: 'v1/'}]}}},
        { Filter: { Key: { FilterRules: [{ Name: 'prefix', Value: 'v2/'}]}}},
      ],
    },
  });

});
