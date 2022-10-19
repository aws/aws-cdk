import { Match, Template } from '@aws-cdk/assertions';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import { Stack, App } from '@aws-cdk/core';
import * as s3n from '../../lib';

test('add notifications to multiple functions', () => {

  const stack = new Stack();
  const bucket = new s3.Bucket(stack, 'MyBucket');
  const fn1 = new lambda.Function(stack, 'MyFunction1', {
    runtime: lambda.Runtime.NODEJS_14_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('foo'),
  });

  const fn2 = new lambda.Function(stack, 'MyFunction2', {
    runtime: lambda.Runtime.NODEJS_14_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('foo'),
  });

  const lambdaDestination1 = new s3n.LambdaDestination(fn1);
  const lambdaDestination2 = new s3n.LambdaDestination(fn2);

  bucket.addEventNotification(s3.EventType.OBJECT_CREATED, lambdaDestination1, { prefix: 'v1/' });
  bucket.addEventNotification(s3.EventType.OBJECT_CREATED, lambdaDestination2, { prefix: 'v2/' });

  // expecting notification configuration to have both events
  Template.fromStack(stack).hasResourceProperties('Custom::S3BucketNotifications', {
    NotificationConfiguration: Match.objectLike({
      LambdaFunctionConfigurations: [
        Match.objectLike({ Filter: { Key: { FilterRules: [{ Name: 'prefix', Value: 'v1/' }] } } }),
        Match.objectLike({ Filter: { Key: { FilterRules: [{ Name: 'prefix', Value: 'v2/' }] } } }),
      ],
    }),
  });

  // expecting one permission for each function
  Template.fromStack(stack).resourceCountIs('AWS::Lambda::Permission', 2);

  // make sure each permission points to the correct function
  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
    FunctionName: {
      'Fn::GetAtt': [
        'MyFunction12A744C2E',
        'Arn',
      ],
    },
    SourceArn: {
      'Fn::GetAtt': [
        'MyBucketF68F3FF0',
        'Arn',
      ],
    },
  });
  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
    FunctionName: {
      'Fn::GetAtt': [
        'MyFunction2F2A964CA',
        'Arn',
      ],
    },
    SourceArn: {
      'Fn::GetAtt': [
        'MyBucketF68F3FF0',
        'Arn',
      ],
    },
  });

});

test('lambda in a different stack as notification target', () => {

  const app = new App();
  const lambdaStack = new Stack(app, 'stack1');
  const bucketStack = new Stack(app, 'stack2');

  const lambdaFunction = new lambda.Function(lambdaStack, 'lambdaFunction', {
    code: lambda.Code.fromInline('whatever'),
    handler: 'index.handler',
    runtime: lambda.Runtime.NODEJS_14_X,
  });

  const bucket = new s3.Bucket(bucketStack, 'bucket');
  bucket.addObjectCreatedNotification(new s3n.LambdaDestination(lambdaFunction));

  // permission should be in the bucket stack
  Template.fromStack(bucketStack).hasResourceProperties('AWS::Lambda::Permission', {
    FunctionName: {
      'Fn::ImportValue': 'stack1:ExportsOutputFnGetAttlambdaFunction940E68ADArn6B2878AF',
    },
    SourceArn: {
      'Fn::GetAtt': [
        'bucket43879C71',
        'Arn',
      ],
    },
  });
});

test('imported lambda in a different account as notification target', () => {
  const app = new App();
  const stack = new Stack(app, 'stack', {
    env: { account: '111111111111' },
  });

  // Lambda account and stack account differ; no permissions should be created.
  const lambdaFunction = lambda.Function.fromFunctionArn(stack, 'lambdaFunction', 'arn:aws:lambda:us-east-1:123456789012:function:BaseFunction');
  const bucket = new s3.Bucket(stack, 'bucket');

  bucket.addObjectCreatedNotification(new s3n.LambdaDestination(lambdaFunction));

  // no permissions created
  Template.fromStack(stack).resourceCountIs('AWS::Lambda::Permission', 0);
});

test('lambda as notification target', () => {
  // GIVEN
  const stack = new Stack();
  const bucketA = new s3.Bucket(stack, 'MyBucket');
  const fn = new lambda.Function(stack, 'MyFunction', {
    runtime: lambda.Runtime.NODEJS_14_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('foo'),
  });

  // WHEN
  bucketA.addObjectCreatedNotification(new s3n.LambdaDestination(fn), { suffix: '.png' });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
    Action: 'lambda:InvokeFunction',
    FunctionName: { 'Fn::GetAtt': ['MyFunction3BAA72D1', 'Arn'] },
    Principal: 's3.amazonaws.com',
    SourceAccount: { Ref: 'AWS::AccountId' },
    SourceArn: { 'Fn::GetAtt': ['MyBucketF68F3FF0', 'Arn'] },
  });

  Template.fromStack(stack).hasResourceProperties('Custom::S3BucketNotifications', {
    NotificationConfiguration: {
      LambdaFunctionConfigurations: [
        {
          Events: ['s3:ObjectCreated:*'],
          Filter: {
            Key: {
              FilterRules: [{ Name: 'suffix', Value: '.png' }],
            },
          },
          LambdaFunctionArn: { 'Fn::GetAtt': ['MyFunction3BAA72D1', 'Arn'] },
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
  Template.fromStack(stack).hasResourceProperties('Custom::S3BucketNotifications', {
    NotificationConfiguration: {
      LambdaFunctionConfigurations: [
        {
          Events: ['s3:ObjectCreated:*'],
          Filter: {
            Key: {
              FilterRules: [{ Name: 'suffix', Value: '.png' }],
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
    runtime: lambda.Runtime.NODEJS_14_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('foo'),
  });

  const lambdaDestination = new s3n.LambdaDestination(fn);

  bucket.addEventNotification(s3.EventType.OBJECT_CREATED, lambdaDestination, { prefix: 'v1/' });

  Template.fromStack(stack).hasResource('Custom::S3BucketNotifications', {
    DependsOn: ['MyBucketAllowBucketNotificationsToSingletonLambdauuid28C96883'],
  });
});

test('add multiple event notifications using a singleton function', () => {

  const stack = new Stack();
  const bucket = new s3.Bucket(stack, 'MyBucket');
  const fn = new lambda.SingletonFunction(stack, 'MyFunction', {
    uuid: 'uuid',
    runtime: lambda.Runtime.NODEJS_14_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('foo'),
  });

  const lambdaDestination = new s3n.LambdaDestination(fn);

  bucket.addEventNotification(s3.EventType.OBJECT_CREATED, lambdaDestination, { prefix: 'v1/' });
  bucket.addEventNotification(s3.EventType.OBJECT_CREATED, lambdaDestination, { prefix: 'v2/' });

  Template.fromStack(stack).hasResourceProperties('Custom::S3BucketNotifications', {
    NotificationConfiguration: Match.objectLike({
      LambdaFunctionConfigurations: [
        Match.objectLike({ Filter: { Key: { FilterRules: [{ Name: 'prefix', Value: 'v1/' }] } } }),
        Match.objectLike({ Filter: { Key: { FilterRules: [{ Name: 'prefix', Value: 'v2/' }] } } }),
      ],
    }),
  });

});
