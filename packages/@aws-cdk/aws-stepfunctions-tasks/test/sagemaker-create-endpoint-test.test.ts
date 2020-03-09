import '@aws-cdk/assert/jest';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as tasks from '../lib';

let stack: cdk.Stack;

beforeEach(() => {
    // GIVEN
    stack = new cdk.Stack();
});

test('create basic Endpoint', () => {
    // WHEN
    const task = new sfn.Task(stack, 'Create Endpoint', { task: new tasks.SagemakerCreateEndpointTask({
      endpointConfigName: 'myEndpointConfig',
      endpointName: 'myEndpoint'
    })});

    // THEN
    expect(stack.resolve(task.toStateJson())).toEqual({
      Type: 'Task',
      Resource: {
        "Fn::Join": [
          "",
          [
            "arn:",
            {
              Ref: "AWS::Partition",
            },
            ":states:::sagemaker:createEndpoint",
          ],
        ],
      },
      End: true,
      Parameters: {
        EndpointConfigName:  'myEndpointConfig',
        EndpointName: 'myEndpoint'
      },
    });
});

test('create complex Endpoint', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Create Endpoint', { task: new tasks.SagemakerCreateEndpointTask({
    endpointConfigName: sfn.Data.stringAt("$.endpoint.endpoint_config"),
    endpointName: sfn.Data.stringAt("$.endpoint.endpoint_name"),
    tags: {
      Project: "MyProject"
    }
  })});

  // THEN
  expect(stack.resolve(task.toStateJson())).toEqual({
    Type: 'Task',
    Resource: {
      "Fn::Join": [
        "",
        [
          "arn:",
          {
            Ref: "AWS::Partition",
          },
          ":states:::sagemaker:createEndpoint",
        ],
      ],
    },
    End: true,
    Parameters: {
      'EndpointConfigName.$':  '$.endpoint.endpoint_config',
      'EndpointName.$': '$.endpoint.endpoint_name',
      'Tags': [
          {
              Key: 'Project',
              Value: 'MyProject'
          }
      ],
    },
  });
});
