import { Template } from '../../../assertions';
import * as iam from '../../../aws-iam';
import * as sfn from '../../../aws-stepfunctions';
import * as cdk from '../../../core';
import * as tasks from '../../lib';

let stack: cdk.Stack;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
});

test('CallAwsServiceCrossRegion task', () => {
  // WHEN
  const task = new tasks.CallAwsServiceCrossRegion(stack, 'GetObject', {
    service: 's3',
    action: 'getObject',
    parameters: {
      Bucket: 'my-bucket',
      Key: sfn.JsonPath.stringAt('$.key'),
    },
    region: 'us-east-1',
    iamResources: ['*'],
  });

  new sfn.StateMachine(stack, 'StateMachine', {
    definitionBody: sfn.DefinitionBody.fromChainable(task),
  });

  // THEN
  expect(stack.resolve(task.toStateJson())).toEqual({
    Type: 'Task',
    Resource: {
      'Fn::GetAtt': [
        'CrossRegionAwsSdk8a0c93f3dbef4b71ac137aaf2048ce7eF7430F4F',
        'Arn',
      ],
    },
    End: true,
    Parameters: {
      parameters: {
        'Bucket': 'my-bucket',
        'Key.$': '$.key',
      },
      action: 'getObject',
      region: 'us-east-1',
      service: 's3',
    },
    Retry: [
      {
        ErrorEquals: [
          'Lambda.ClientExecutionTimeoutException',
          'Lambda.ServiceException',
          'Lambda.AWSLambdaException',
          'Lambda.SdkClientException',
        ],
        IntervalSeconds: 2,
        MaxAttempts: 6,
        BackoffRate: 2,
      },
    ],
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

test('with retryOnServiceExceptions disabled', () => {
  // WHEN
  const task = new tasks.CallAwsServiceCrossRegion(stack, 'GetObject', {
    service: 's3',
    action: 'getObject',
    parameters: {
      Bucket: 'my-bucket',
      Key: sfn.JsonPath.stringAt('$.key'),
    },
    region: 'us-east-1',
    iamResources: ['*'],
    retryOnServiceExceptions: false,
  });

  new sfn.StateMachine(stack, 'StateMachine', {
    definitionBody: sfn.DefinitionBody.fromChainable(task),
  });

  // THEN
  expect(stack.resolve(task.toStateJson())).toEqual({
    Type: 'Task',
    Resource: {
      'Fn::GetAtt': [
        'CrossRegionAwsSdk8a0c93f3dbef4b71ac137aaf2048ce7eF7430F4F',
        'Arn',
      ],
    },
    End: true,
    Parameters: {
      parameters: {
        'Bucket': 'my-bucket',
        'Key.$': '$.key',
      },
      action: 'getObject',
      region: 'us-east-1',
      service: 's3',
    },
  });
});

test('with custom IAM action', () => {
  // WHEN
  const task = new tasks.CallAwsServiceCrossRegion(stack, 'ListBuckets', {
    service: 's3',
    action: 'listBuckets',
    iamResources: ['*'],
    region: 'us-east-1',
    iamAction: 's3:ListAllMyBuckets',
    retryOnServiceExceptions: false,
  });

  new sfn.StateMachine(stack, 'StateMachine', {
    definitionBody: sfn.DefinitionBody.fromChainable(task),
  });

  // THEN
  expect(stack.resolve(task.toStateJson())).toEqual({
    Type: 'Task',
    Resource: {
      'Fn::GetAtt': [
        'CrossRegionAwsSdk8a0c93f3dbef4b71ac137aaf2048ce7eF7430F4F',
        'Arn',
      ],
    },
    End: true,
    Parameters: {
      action: 'listBuckets',
      region: 'us-east-1',
      service: 's3',
    },
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

test('parameters with camelCase', () => {
  // WHEN
  const task = new tasks.CallAwsServiceCrossRegion(stack, 'GetRestApi', {
    service: 'api-gateway',
    action: 'getRestApi',
    parameters: {
      restApiId: 'id',
    },
    region: 'us-east-1',
    iamResources: ['*'],
    retryOnServiceExceptions: false,
  });

  // THEN
  expect(stack.resolve(task.toStateJson())).toEqual({
    Type: 'Task',
    Resource: {
      'Fn::GetAtt': [
        'CrossRegionAwsSdk8a0c93f3dbef4b71ac137aaf2048ce7eF7430F4F',
        'Arn',
      ],
    },
    End: true,
    Parameters: {
      action: 'getRestApi',
      region: 'us-east-1',
      service: 'api-gateway',
      parameters: {
        restApiId: 'id',
      },
    },
  });
});

test('throws with invalid integration pattern', () => {
  expect(() => new tasks.CallAwsServiceCrossRegion(stack, 'GetObject', {
    integrationPattern: sfn.IntegrationPattern.RUN_JOB,
    service: 's3',
    action: 'getObject',
    parameters: {
      Bucket: 'my-bucket',
      Key: sfn.JsonPath.stringAt('$.key'),
    },
    region: 'us-east-1',
    iamResources: ['*'],
  })).toThrow(/The RUN_JOB integration pattern is not supported for CallAwsService/);
});

test('throws if action is not camelCase', () => {
  expect(() => new tasks.CallAwsServiceCrossRegion(stack, 'GetObject', {
    service: 's3',
    action: 'GetObject',
    parameters: {
      Bucket: 'my-bucket',
      Key: sfn.JsonPath.stringAt('$.key'),
    },
    region: 'us-east-1',
    iamResources: ['*'],
  })).toThrow(/action must be camelCase, got: GetObject/);
});

test('can pass additional IAM statements', () => {
  // WHEN
  const task = new tasks.CallAwsServiceCrossRegion(stack, 'DetectLabels', {
    service: 'rekognition',
    action: 'detectLabels',
    region: 'us-east-1',
    iamResources: ['*'],
    additionalIamStatements: [
      new iam.PolicyStatement({
        actions: ['s3:getObject'],
        resources: ['arn:aws:s3:::my-bucket/*'],
      }),
    ],
  });

  new sfn.StateMachine(stack, 'StateMachine', {
    definitionBody: sfn.DefinitionBody.fromChainable(task),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'rekognition:detectLabels',
          Effect: 'Allow',
          Resource: '*',
        },
        {
          Action: 's3:getObject',
          Effect: 'Allow',
          Resource: 'arn:aws:s3:::my-bucket/*',
        },
      ],
      Version: '2012-10-17',
    },
  });
});
