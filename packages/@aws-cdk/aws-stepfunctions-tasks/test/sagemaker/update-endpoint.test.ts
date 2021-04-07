import '@aws-cdk/assert-internal/jest';
import * as iam from '@aws-cdk/aws-iam';
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

test('PolicyStatement has sufficient permissions', () => {
  // WHEN
  const props = {
    endpointName: 'MyEndpoint',
    endpointConfigName: 'MyEndpointConfig',
  };
  const task = new tasks.SageMakerUpdateEndpoint(stack, 'SagemakerEndpoint', props);

  const graph = new sfn.StateGraph(task, 'test');

  // THEN
  expect(graph.policyStatements).toEqual(
    [
      new iam.PolicyStatement({
        actions: ['sagemaker:updateEndpoint'],
        resources: [
          stack.formatArn({
            service: 'sagemaker',
            resource: 'endpoint',
            resourceName: props.endpointName.toLowerCase(),
          }),
          stack.formatArn({
            service: 'sagemaker',
            resource: 'endpoint-config',
            resourceName: props.endpointConfigName.toLowerCase(),
          }),
        ],
      }),
    ],
  );

  // WHEN
  const props2 = {
    endpointName: sfn.JsonPath.stringAt('$.Endpoint.Name'),
    endpointConfigName: sfn.JsonPath.stringAt('$.Endpoint.Config'),
  };
  const task2 = new tasks.SageMakerUpdateEndpoint(stack, 'SagemakerEndpoint2', props2);

  const graph2 = new sfn.StateGraph(task2, 'test');

  // THEN
  expect(graph2.policyStatements).toEqual(
    [
      new iam.PolicyStatement({
        actions: ['sagemaker:updateEndpoint'],
        resources: [
          stack.formatArn({
            service: 'sagemaker',
            resource: 'endpoint',
            resourceName: '*',
          }),
          stack.formatArn({
            service: 'sagemaker',
            resource: 'endpoint-config',
            resourceName: '*',
          }),
        ],
      }),
    ],
  );
});