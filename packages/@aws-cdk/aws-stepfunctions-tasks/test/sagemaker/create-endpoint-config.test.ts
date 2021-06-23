import '@aws-cdk/assert-internal/jest';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as kms from '@aws-cdk/aws-kms';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as tasks from '../../lib';

let stack: cdk.Stack;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
});

test('create basic endpoint config', () => {
  // WHEN
  const task = new tasks.SageMakerCreateEndpointConfig(stack, 'SagemakerEndpointConfig', {
    endpointConfigName: 'MyEndpointConfig',
    productionVariants: [{
      initialInstanceCount: 2,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.XLARGE),
      modelName: 'MyModel',
      variantName: 'awesome-variant',
    }],
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
          ':states:::sagemaker:createEndpointConfig',
        ],
      ],
    },
    End: true,
    Parameters: {
      EndpointConfigName: 'MyEndpointConfig',
      ProductionVariants: [{
        InitialInstanceCount: 2,
        InstanceType: 'ml.m5.xlarge',
        ModelName: 'MyModel',
        VariantName: 'awesome-variant',
      }],
    },
  });
});

test('create complex endpoint config', () => {
  // WHEN
  const key = new kms.Key(stack, 'Key');

  const task = new tasks.SageMakerCreateEndpointConfig(stack, 'SagemakerEndpointConfig', {
    endpointConfigName: sfn.JsonPath.stringAt('$.Endpoint.EndpointConfig'),
    kmsKey: key,
    productionVariants: [{
      initialInstanceCount: 1,
      initialVariantWeight: 0.8,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.XLARGE),
      modelName: 'MyModel',
      variantName: 'awesome-variant',
    },
    {
      initialInstanceCount: 1,
      initialVariantWeight: 0.2,
      instanceType: new ec2.InstanceType(sfn.JsonPath.stringAt('$.Endpoint.InstanceType')),
      modelName: sfn.JsonPath.stringAt('$.Endpoint.Model'),
      variantName: 'awesome-variant-2',
    }],
    tags: sfn.TaskInput.fromObject([{
      Key: 'Project',
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
          ':states:::sagemaker:createEndpointConfig',
        ],
      ],
    },
    End: true,
    Parameters: {
      'EndpointConfigName.$': '$.Endpoint.EndpointConfig',
      'KmsKeyId': {
        Ref: 'Key961B73FD',
      },
      'ProductionVariants': [{
        InitialInstanceCount: 1,
        InitialVariantWeight: 0.8,
        InstanceType: 'ml.m5.xlarge',
        ModelName: 'MyModel',
        VariantName: 'awesome-variant',
      },
      {
        'InitialInstanceCount': 1,
        'InitialVariantWeight': 0.2,
        'InstanceType.$': '$.Endpoint.InstanceType',
        'ModelName.$': '$.Endpoint.Model',
        'VariantName': 'awesome-variant-2',
      }],
      'Tags': [
        {
          Key: 'Project',
          Value: 'ML',
        },
      ],
    },
  });
});

test('Cannot create a SageMaker create enpoint config task with empty production variant', () => {
  expect(() => new tasks.SageMakerCreateEndpointConfig(stack, 'EndpointConfig', {
    endpointConfigName: 'MyEndpointConfig',
    productionVariants: [],
  }))
    .toThrowError(/Must specify from 1 to 10 production variants per endpoint configuration/);
});

test('Task throws if WAIT_FOR_TASK_TOKEN is supplied as service integration pattern', () => {
  expect(() => new tasks.SageMakerCreateEndpointConfig(stack, 'EndpointConfig', {
    endpointConfigName: 'MyEndpointConfig',
    integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
    productionVariants: [{
      initialInstanceCount: 2,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.XLARGE),
      modelName: 'MyModel',
      variantName: 'awesome-variant',
    }],
  }))
    .toThrowError(/Unsupported service integration pattern. Supported Patterns: REQUEST_RESPONSE. Received: WAIT_FOR_TASK_TOKEN/i);
});


