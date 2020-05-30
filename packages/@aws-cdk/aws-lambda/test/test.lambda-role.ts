import { expect } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { LambdaRole } from '../lib/lambda-role';

export = {
  'all permissions'(test: Test) {
    const stack = new Stack();

    new LambdaRole(stack, 'Role', {
      vpcExecutionAccess: true,
      kinesisExecutionAccess: true,
      dynamoDBExecutionAccess: true,
      sqsQueueExecutionAccess: true,
      xrayDaemonWriteAccess: true,
    });

    expect(stack).toMatch({
      Resources:
      {
        Role1ABCC5F0:
        {
          Type: 'AWS::IAM::Role',
          Properties:
          {
            AssumeRolePolicyDocument:
            {
              Statement:
                [{
                  Action: 'sts:AssumeRole',
                  Effect: 'Allow',
                  Principal: { Service: 'lambda.amazonaws.com' },
                }],
              Version: '2012-10-17',
            },
            ManagedPolicyArns:
              // tslint:disable-next-line:max-line-length
              [{ 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole']] },
                { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole']] },
                { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/service-role/AWSLambdaKinesisExecutionRole']] },
                { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/service-role/AWSLambdaDynamoDBExecutionRole']] },
                { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/service-role/AWSLambdaSQSQueueExecutionRole']] },
                { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/service-role/AWSXRayDaemonWriteAccess']] }],
          },
        },
      },
    });
    test.done();
  },
  'no permissions'(test: Test) {
    const stack = new Stack();

    new LambdaRole(stack, 'Role', {});

    expect(stack).toMatch({
      Resources:
      {
        Role1ABCC5F0:
        {
          Type: 'AWS::IAM::Role',
          Properties:
          {
            AssumeRolePolicyDocument:
            {
              Statement:
                [{
                  Action: 'sts:AssumeRole',
                  Effect: 'Allow',
                  Principal: { Service: 'lambda.amazonaws.com' },
                }],
              Version: '2012-10-17',
            },
            ManagedPolicyArns:
              // tslint:disable-next-line:max-line-length
              [{ 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole']] }],
          },
        },
      },
    });
    test.done();
  },
};
