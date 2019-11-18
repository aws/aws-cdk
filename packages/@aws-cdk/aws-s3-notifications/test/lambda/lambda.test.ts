// import { SynthUtils } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import lambda = require('@aws-cdk/aws-lambda');
import s3 = require('@aws-cdk/aws-s3');
import { Stack } from '@aws-cdk/core';
import s3n = require('../../lib');

test('lambda as notification target', () => {
  // GIVEN
  const stack = new Stack();
  const bucketA = new s3.Bucket(stack, 'MyBucket');
  const fn = new lambda.Function(stack, 'MyFunction', {
    runtime: lambda.Runtime.NODEJS_10_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline(`foo`)
  });

  // WHEN
  bucketA.addObjectCreatedNotification(new s3n.LambdaDestination(fn), { suffix: '.png' });

  // THEN
  expect(stack).toHaveResource("AWS::Lambda::Permission",  {
    Action: "lambda:InvokeFunction",
    FunctionName: { "Fn::GetAtt": [ "MyFunction3BAA72D1", "Arn" ] },
    Principal: "s3.amazonaws.com",
    SourceAccount: { Ref: "AWS::AccountId" },
    SourceArn: { "Fn::GetAtt": [ "MyBucketF68F3FF0", "Arn" ] }
  });

  expect(stack).toHaveResource('Custom::S3BucketNotifications', {
    NotificationConfiguration: {
      LambdaFunctionConfigurations: [
        {
          Events: [ "s3:ObjectCreated:*" ],
          Filter: {
            Key: {
              FilterRules: [ { Name: "suffix", Value: ".png" } ]
            }
          },
          LambdaFunctionArn: { "Fn::GetAtt": [ "MyFunction3BAA72D1", "Arn" ] }
        }
      ]
    }
  });
});
