import '@aws-cdk/assert/jest';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as tasks from '../../lib';

let stack: cdk.Stack;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
});

test('update endpoint', () => {
  // WHEN
  const task = new tasks.SageMakerUpdateEndpoint(stack, 'SagemakerEndpoint', {
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
          ':states:::sagemaker:updateEndpoint',
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

test('pass parameters to update endpoint', () => {
  // WHEN
  const task = new tasks.SageMakerUpdateEndpoint(stack, 'SagemakerEndpoint', {
    endpointName: sfn.JsonPath.stringAt('$.Endpoint.Name'),
    endpointConfigName: sfn.JsonPath.stringAt('$.Endpoint.Config'),
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
          ':states:::sagemaker:updateEndpoint',
        ],
      ],
    },
    End: true,
    Parameters: {
      'EndpointConfigName.$': '$.Endpoint.Config',
      'EndpointName.$': '$.Endpoint.Name',
    },
  });
});


test('Task throws if WAIT_FOR_TASK_TOKEN is supplied as service integration pattern', () => {
  expect(() => {
    new tasks.SageMakerUpdateEndpoint(stack, 'UpdateSagemaker', {
      integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
      endpointConfigName: 'MyEndpointConfig',
      endpointName: 'MyEndpoint',
    });
  }).toThrow(/Unsupported service integration pattern. Supported Patterns: REQUEST_RESPONSE. Received: WAIT_FOR_TASK_TOKEN/i);
});
