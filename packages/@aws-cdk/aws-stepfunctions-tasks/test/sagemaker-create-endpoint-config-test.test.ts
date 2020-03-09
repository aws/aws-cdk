import '@aws-cdk/assert/jest';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as kms from '@aws-cdk/aws-kms';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as tasks from '../lib';

let stack: cdk.Stack;

beforeEach(() => {
    // GIVEN
    stack = new cdk.Stack();
});

test('create basic endpoint config', () => {
    // WHEN
    const task = new sfn.Task(stack, 'Create Endpoint Config', { task: new tasks.SagemakerCreateEndpointConfigTask({
      endpointConfigName: 'myEndpointConfig',
      productionVariants: [{
        initialInstanceCount: 1,
        instanceType:  ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.XLARGE),
        modelName: 'myModelName',
        variantName: "default-variant-name"
      }]
      }),
    });

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
            ":states:::sagemaker:createEndpointConfig",
          ],
        ],
      },
      End: true,
      Parameters: {
        EndpointConfigName:  'myEndpointConfig',
        ProductionVariants: [{
            InitialInstanceCount: 1,
            InstanceType: 'ml.m5.xlarge',
            ModelName: 'myModelName',
            VariantName: 'default-variant-name'
        }]
      },
    });
});

test('create complex endpoint config', () => {
    // WHEN
    const kmsKey = new kms.Key(stack, 'Key');

    const task = new sfn.Task(stack, 'Create Endpoint Config', { task: new tasks.SagemakerCreateEndpointConfigTask({
      endpointConfigName: sfn.Data.stringAt("$.endpoint.endpoint_config"),
      kmsKeyId: kmsKey.keyId,
      productionVariants: [{
        initialInstanceCount: 1,
        instanceType:  ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.XLARGE),
        modelName: sfn.Data.stringAt("$.Model.model_name"),
        variantName: "default-variant-name"
      }],
      tags: {
        Project: "MyProject"
      }
      }),
    });

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
            ":states:::sagemaker:createEndpointConfig",
          ],
        ],
      },
      End: true,
      Parameters: {
        'EndpointConfigName.$':  '$.endpoint.endpoint_config',
        'KmsKeyId': {
          Ref: 'Key961B73FD'
        },
        'ProductionVariants': [{
            'InitialInstanceCount': 1,
            'InstanceType': 'ml.m5.xlarge',
            'ModelName.$': '$.Model.model_name',
            'VariantName': 'default-variant-name'
        }],
        'Tags': [
          {
              Key: 'Project',
              Value: 'MyProject'
          }
      ]
      },
    });
});