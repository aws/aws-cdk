import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as tasks from '../../lib';

let stack: cdk.Stack;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
});

test('create endpoint', () => {
  // WHEN
  const task = new tasks.SageMakerCreateEndpoint(stack, 'SagemakerEndpoint', {
    endpointName: 'MyEndpoint',
    endpointConfigName: 'MyEndpointConfig',
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
          ':states:::sagemaker:createEndpoint',
        ],
      ],
    },
    End: true,
    Parameters: {
      EndpointConfigName: 'MyEndpointConfig',
      EndpointName: 'MyEndpoint',
    },
  });
});

test('create endpoint with tags', () => {
  // WHEN
  const task = new tasks.SageMakerCreateEndpoint(stack, 'SagemakerEndpoint', {
    endpointName: 'MyEndpoint',
    endpointConfigName: 'MyEndpointConfig',
    tags: sfn.TaskInput.fromObject([{
      Key: 'Label',
      Value: 'ML',
    }]),
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
          ':states:::sagemaker:createEndpoint',
        ],
      ],
    },
    End: true,
    Parameters: {
      EndpointConfigName: 'MyEndpointConfig',
      EndpointName: 'MyEndpoint',
      Tags: [
        { Key: 'Label', Value: 'ML' },
      ],
    },
  });
});

test('create endpoint with input from task', () => {
  // WHEN
  const task = new tasks.SageMakerCreateEndpoint(stack, 'SagemakerEndpoint', {
    endpointName: sfn.JsonPath.stringAt('$.EndpointName'),
    endpointConfigName: sfn.JsonPath.stringAt('$.EndpointConfig'),
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
          ':states:::sagemaker:createEndpoint',
        ],
      ],
    },
    End: true,
    Parameters: {
      'EndpointConfigName.$': '$.EndpointConfig',
      'EndpointName.$': '$.EndpointName',
    },
  });
});

test('Task throws if WAIT_FOR_TASK_TOKEN is supplied as service integration pattern', () => {
  expect(() => {
    new tasks.SageMakerCreateEndpoint(stack, 'TrainSagemaker', {
      integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
      endpointConfigName: 'MyEndpointConfig',
      endpointName: 'MyEndpoint',
    });
  }).toThrow(/Unsupported service integration pattern. Supported Patterns: REQUEST_RESPONSE. Received: WAIT_FOR_TASK_TOKEN/i);
});
