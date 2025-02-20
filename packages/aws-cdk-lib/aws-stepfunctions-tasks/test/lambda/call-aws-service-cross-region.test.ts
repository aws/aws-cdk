import { describe } from 'node:test';
import { Template } from '../../../assertions';
import * as iam from '../../../aws-iam';
import * as sfn from '../../../aws-stepfunctions';
import * as cdk from '../../../core';
import * as cxapi from '../../../cx-api';
import * as tasks from '../../lib';

describe('default tests', () => {
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

  test('CallAwsServiceCrossRegion task - using JSONata', () => {
    // WHEN
    const task = tasks.CallAwsServiceCrossRegion.jsonata(stack, 'GetObject', {
      service: 's3',
      action: 'getObject',
      parameters: {
        Bucket: 'my-bucket',
        Key: '{% $key %}',
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
      QueryLanguage: 'JSONata',
      Resource: {
        'Fn::GetAtt': [
          'CrossRegionAwsSdk8a0c93f3dbef4b71ac137aaf2048ce7eF7430F4F',
          'Arn',
        ],
      },
      End: true,
      Arguments: {
        parameters: {
          Bucket: 'my-bucket',
          Key: '{% $key %}',
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

  test('integrationPattern is WAIT_FOR_TASK_TOKEN', () => {
    // WHEN
    const task = new tasks.CallAwsServiceCrossRegion(stack, 'StartExecution', {
      integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
      service: 'sfn',
      action: 'startExecution',
      region: 'us-east-1',
      parameters: {
        StateMachineArn: 'dummy-arn',
        Input: sfn.TaskInput.fromObject({
          taskToken: sfn.JsonPath.taskToken,
          payload: sfn.JsonPath.stringAt('$.payload'),
        }),
      },
      iamResources: ['*'],
    });
    new sfn.StateMachine(stack, 'StateMachine', {
      definitionBody: sfn.DefinitionBody.fromChainable(task),
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toEqual({
      End: true,
      Parameters: {
        FunctionName: {
          'Fn::GetAtt': ['CrossRegionAwsSdk8a0c93f3dbef4b71ac137aaf2048ce7eF7430F4F', 'Arn'],
        },
        Payload: {
          action: 'startExecution',
          parameters: {
            Input: {
              type: 1,
              value: {
                'payload.$': '$.payload',
                'taskToken.$': '$$.Task.Token',
              },
            },
            StateMachineArn: 'dummy-arn',
          },
          region: 'us-east-1',
          service: 'sfn',
        },
      },
      Resource: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':states:::lambda:invoke.waitForTaskToken',
          ],
        ],
      },
      Retry: [
        {
          BackoffRate: 2,
          ErrorEquals: ['Lambda.ClientExecutionTimeoutException', 'Lambda.ServiceException', 'Lambda.AWSLambdaException', 'Lambda.SdkClientException'],
          IntervalSeconds: 2,
          MaxAttempts: 6,
        },
      ],
      Type: 'Task',
    });
  });
});

describe('feature tests', () => {
  describe('can pass additional IAM statements', () => {
    test('@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy enabled', () => {
      // GIVEN
      const app = new cdk.App({
        context: {
          [cxapi.LAMBDA_CREATE_NEW_POLICIES_WITH_ADDTOROLEPOLICY]: true,
        },
      });
      const stack = new cdk.Stack(app);

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
          ],
          Version: '2012-10-17',
        },
      });
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
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

    test('@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy disabled', () => {
      // GIVEN
      const app = new cdk.App({
        context: {
          [cxapi.LAMBDA_CREATE_NEW_POLICIES_WITH_ADDTOROLEPOLICY]: false,
        },
      });
      const stack = new cdk.Stack(app);

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
  });
});
