import { Template } from '@aws-cdk/assertions';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as tasks from '../../lib';

let stack: cdk.Stack;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
});

test('CallAwsService task', () => {
  // WHEN
  const task = new tasks.CallAwsService(stack, 'GetObject', {
    service: 's3',
    action: 'getObject',
    parameters: {
      Bucket: 'my-bucket',
      Key: sfn.JsonPath.stringAt('$.key'),
    },
    iamResources: ['*'],
  });

  new sfn.StateMachine(stack, 'StateMachine', {
    definition: task,
  });

  // THEN
  expect(stack.resolve(task.toStateJson())).toEqual({
    Type: 'Task',
    Resource: {
      'Fn::Join': [
        '',
        [
          'arn:',
          {
            Ref: 'AWS::Partition',
          },
          ':states:::aws-sdk:s3:getObject',
        ],
      ],
    },
    End: true,
    Parameters: {
      'Bucket': 'my-bucket',
      'Key.$': '$.key',
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 's3:getObject',
          Effect: 'Allow',
          Resource: '*',
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('with custom IAM action', () => {
  // WHEN
  const task = new tasks.CallAwsService(stack, 'ListBuckets', {
    service: 's3',
    action: 'listBuckets',
    iamResources: ['*'],
    iamAction: 's3:ListAllMyBuckets',
  });

  new sfn.StateMachine(stack, 'StateMachine', {
    definition: task,
  });

  // THEN
  expect(stack.resolve(task.toStateJson())).toEqual({
    Type: 'Task',
    Resource: {
      'Fn::Join': [
        '',
        [
          'arn:',
          {
            Ref: 'AWS::Partition',
          },
          ':states:::aws-sdk:s3:listBuckets',
        ],
      ],
    },
    End: true,
    Parameters: {},
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 's3:ListAllMyBuckets',
          Effect: 'Allow',
          Resource: '*',
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('with unresolved tokens', () => {
  // WHEN
  const task = new tasks.CallAwsService(stack, 'ListBuckets', {
    service: new cdk.CfnParameter(stack, 'Service').valueAsString,
    action: new cdk.CfnParameter(stack, 'Action').valueAsString,
    iamResources: ['*'],
  });

  new sfn.StateMachine(stack, 'StateMachine', {
    definition: task,
  });

  // THEN
  expect(stack.resolve(task.toStateJson())).toEqual({
    Type: 'Task',
    Resource: {
      'Fn::Join': [
        '',
        [
          'arn:',
          {
            Ref: 'AWS::Partition',
          },
          ':states:::aws-sdk:',
          {
            Ref: 'Service',
          },
          ':',
          {
            Ref: 'Action',
          },
        ],
      ],
    },
    End: true,
    Parameters: {},
  });
});

test('throws with invalid integration pattern', () => {
  expect(() => new tasks.CallAwsService(stack, 'GetObject', {
    integrationPattern: sfn.IntegrationPattern.RUN_JOB,
    service: 's3',
    action: 'getObject',
    parameters: {
      Bucket: 'my-bucket',
      Key: sfn.JsonPath.stringAt('$.key'),
    },
    iamResources: ['*'],
  })).toThrow(/The RUN_JOB integration pattern is not supported for CallAwsService/);
});
