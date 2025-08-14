import { Template } from '../../../assertions';
import * as iam from '../../../aws-iam';
import { LogGroup } from '../../../aws-logs';
import * as sfn from '../../../aws-stepfunctions';
import * as cdk from '../../../core';
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
    definitionBody: sfn.DefinitionBody.fromChainable(task),
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

test('CallAwsService task - using JSONata', () => {
  // WHEN
  const task = tasks.CallAwsService.jsonata(stack, 'GetObject', {
    service: 's3',
    action: 'getObject',
    parameters: {
      Bucket: 'my-bucket',
      Key: '{% $states.input.key %}',
    },
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
    Arguments: {
      Bucket: 'my-bucket',
      Key: '{% $states.input.key %}',
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
    definitionBody: sfn.DefinitionBody.fromChainable(task),
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
    definitionBody: sfn.DefinitionBody.fromChainable(task),
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

test('throws if action is not camelCase', () => {
  expect(() => new tasks.CallAwsService(stack, 'GetObject', {
    service: 's3',
    action: 'GetObject',
    parameters: {
      Bucket: 'my-bucket',
      Key: sfn.JsonPath.stringAt('$.key'),
    },
    iamResources: ['*'],
  })).toThrow(/action must be camelCase, got: GetObject/);
});

test('throws if parameters has keys as not PascalCase', () => {
  expect(() => new tasks.CallAwsService(stack, 'GetObject', {
    service: 's3',
    action: 'getObject',
    parameters: {
      bucket: 'my-bucket',
      key: sfn.JsonPath.stringAt('$.key'),
    },
    iamResources: ['*'],
  })).toThrow(/parameter names must be PascalCase, got: bucket, key/);
});

test('can pass additional IAM statements', () => {
  // WHEN
  const task = new tasks.CallAwsService(stack, 'DetectLabels', {
    service: 'rekognition',
    action: 'detectLabels',
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

test('IAM policy for sfn', () => {
  // WHEN
  const task = new tasks.CallAwsService(stack, 'SendTaskSuccess', {
    service: 'sfn',
    action: 'sendTaskSuccess',
    iamResources: ['*'],
    parameters: {
      Output: sfn.JsonPath.objectAt('$.output'),
      TaskToken: sfn.JsonPath.stringAt('$.taskToken'),
    },
  });

  new sfn.StateMachine(stack, 'StateMachine', {
    definitionBody: sfn.DefinitionBody.fromChainable(task),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'states:sendTaskSuccess',
          Effect: 'Allow',
          Resource: '*',
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('IAM policy for cloudwatchlogs', () => {
  // WHEN
  const myLogGroup = new LogGroup(stack, 'MyLogGroup');
  const task = new tasks.CallAwsService(stack, 'SendTaskSuccess', {
    service: 'cloudwatchlogs',
    action: 'createLogStream',
    parameters: {
      LogGroupName: myLogGroup.logGroupName,
      LogStreamName: sfn.JsonPath.stringAt('$$.Execution.Name'),
    },
    resultPath: sfn.JsonPath.DISCARD,
    iamResources: [myLogGroup.logGroupArn],
  });

  new sfn.StateMachine(stack, 'StateMachine', {
    definitionBody: sfn.DefinitionBody.fromChainable(task),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'logs:createLogStream',
          Effect: 'Allow',
          Resource: {
            'Fn::GetAtt': ['MyLogGroup5C0DAD85', 'Arn'],
          },
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('IAM policy for mediapackagevod', () => {
  // WHEN
  const task = new tasks.CallAwsService(stack, 'ListMediaPackageVoDPackagingGroups', {
    service: 'mediapackagevod',
    action: 'listPackagingGroups',
    resultPath: sfn.JsonPath.DISCARD,
    iamResources: ['*'],
  });

  new sfn.StateMachine(stack, 'StateMachine', {
    definitionBody: sfn.DefinitionBody.fromChainable(task),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'mediapackage-vod:listPackagingGroups',
          Effect: 'Allow',
          Resource: '*',
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('IAM policy for mwaa', () => {
  // WHEN
  const task = new tasks.CallAwsService(stack, 'ListMWAAEnvironments', {
    service: 'mwaa',
    action: 'listEnvironments',
    resultPath: sfn.JsonPath.DISCARD,
    iamResources: ['*'],
  });

  new sfn.StateMachine(stack, 'StateMachine', {
    definitionBody: sfn.DefinitionBody.fromChainable(task),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'airflow:listEnvironments',
          Effect: 'Allow',
          Resource: '*',
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('IAM policy for efs', () => {
  // WHEN
  const task = new tasks.CallAwsService(stack, 'TagEfsAccessPoint', {
    service: 'efs',
    action: 'tagResource',
    iamResources: ['*'],
    parameters: {
      ResourceId: sfn.JsonPath.stringAt('$.pathToArn'),
      Tags: [
        {
          Key: 'MYTAGNAME',
          Value: sfn.JsonPath.stringAt('$.pathToId'),
        },
      ],
    },
    resultPath: sfn.JsonPath.DISCARD,
  });

  new sfn.StateMachine(stack, 'StateMachine', {
    definitionBody: sfn.DefinitionBody.fromChainable(task),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'elasticfilesystem:tagResource',
          Effect: 'Allow',
          Resource: '*',
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('IAM policy for elasticloadbalancingv2', () => {
  // WHEN
  const task = new tasks.CallAwsService(stack, 'DescribeELBV2TargetGroups', {
    service: 'elasticloadbalancingv2',
    action: 'describeTargetGroups',
    iamResources: ['*'],
    resultPath: sfn.JsonPath.DISCARD,
  });

  new sfn.StateMachine(stack, 'StateMachine', {
    definitionBody: sfn.DefinitionBody.fromChainable(task),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'elasticloadbalancing:describeTargetGroups',
          Resource: '*',
          Effect: 'Allow',
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('CallAwsService without iamResources - no IAM policy generated', () => {
  // WHEN
  const task = new tasks.CallAwsService(stack, 'StartExecution', {
    service: 'sfn',
    action: 'startExecution',
    parameters: {
      StateMachineArn: 'arn:aws:states:us-east-1:123456789012:stateMachine:MyStateMachine',
      Input: sfn.JsonPath.objectAt('$'),
    },
  });

  new sfn.StateMachine(stack, 'StateMachine', {
    definitionBody: sfn.DefinitionBody.fromChainable(task),
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
          ':states:::aws-sdk:sfn:startExecution',
        ],
      ],
    },
    End: true,
    Parameters: {
      'StateMachineArn': 'arn:aws:states:us-east-1:123456789012:stateMachine:MyStateMachine',
      'Input.$': '$',
    },
  });

  // Verify no IAM policy is created
  Template.fromStack(stack).resourceCountIs('AWS::IAM::Policy', 0);
});

test('CallAwsService with only additionalIamStatements - only additional statements included', () => {
  // WHEN
  const task = new tasks.CallAwsService(stack, 'StartExecution', {
    service: 'sfn',
    action: 'startExecution',
    parameters: {
      StateMachineArn: 'arn:aws:states:us-east-1:123456789012:stateMachine:MyStateMachine',
      Input: sfn.JsonPath.objectAt('$'),
    },
    additionalIamStatements: [
      new iam.PolicyStatement({
        actions: ['states:StartExecution'],
        resources: ['arn:aws:states:us-east-1:123456789012:stateMachine:MyStateMachine'],
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
          Action: 'states:StartExecution',
          Effect: 'Allow',
          Resource: 'arn:aws:states:us-east-1:123456789012:stateMachine:MyStateMachine',
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('CallAwsService without iamResources and without additionalIamStatements - no IAM policy generated', () => {
  // WHEN
  const task = new tasks.CallAwsService(stack, 'StartExecution', {
    service: 'sfn',
    action: 'startExecution',
    parameters: {
      StateMachineArn: 'arn:aws:states:us-east-1:123456789012:stateMachine:MyStateMachine',
      Input: sfn.JsonPath.objectAt('$'),
    },
  });

  new sfn.StateMachine(stack, 'StateMachine', {
    definitionBody: sfn.DefinitionBody.fromChainable(task),
  });

  // THEN
  // Verify no IAM policy is created
  Template.fromStack(stack).resourceCountIs('AWS::IAM::Policy', 0);
});
