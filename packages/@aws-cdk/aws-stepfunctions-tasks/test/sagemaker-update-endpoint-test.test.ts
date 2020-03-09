import '@aws-cdk/assert/jest';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as tasks from '../lib';

let stack: cdk.Stack;

beforeEach(() => {
    // GIVEN
    stack = new cdk.Stack();
});

test('update basic Endpoint', () => {
    // WHEN
    const task = new sfn.Task(stack, 'Update Endpoint', { task: new tasks.SagemakerUpdateEndpointTask({
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
            ":states:::sagemaker:updateEndpoint",
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

test('update complex Endpoint', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Create Endpoint', { task: new tasks.SagemakerUpdateEndpointTask({
    endpointConfigName: sfn.Data.stringAt("$.endpoint.endpoint_config"),
    endpointName: sfn.Data.stringAt("$.endpoint.endpoint_name"),
    excludeRetainedVariantProperties: [tasks.VariantPropertyType.DATA_CAPTURE_CONFIG],
    retainAllVariantProperties: true
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
          ":states:::sagemaker:updateEndpoint",
        ],
      ],
    },
    End: true,
    Parameters: {
      'EndpointConfigName.$':  '$.endpoint.endpoint_config',
      'EndpointName.$': '$.endpoint.endpoint_name',
      'RetainAllVariantProperties': true,
      'ExcludeRetainedVariantProperties': [{
        VariantPropertyType: 'DataCaptureConfig'
      }]
    },
  });
});
