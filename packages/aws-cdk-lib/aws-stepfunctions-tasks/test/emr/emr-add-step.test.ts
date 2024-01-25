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

test('Add Step with static ClusterId and Step configuration', () => {
  // WHEN
  const task = new tasks.EmrAddStep(stack, 'Task', {
    clusterId: 'ClusterId',
    name: 'StepName',
    jar: 'Jar',
    actionOnFailure: tasks.ActionOnFailure.CONTINUE,
    integrationPattern: sfn.IntegrationPattern.RUN_JOB,
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
          ':states:::elasticmapreduce:addStep.sync',
        ],
      ],
    },
    End: true,
    Parameters: {
      ClusterId: 'ClusterId',
      Step: {
        Name: 'StepName',
        ActionOnFailure: 'CONTINUE',
        HadoopJarStep: {
          Jar: 'Jar',
        },
      },
    },
  });
});

test('Add Step with execution role ARN', () => {
  const executionRole = new iam.Role(stack, 'Role', {
    roleName: 'EmrStepExecutionRole',
    // The actual trust policy required is more complicated.
    // See https://aws.amazon.com/blogs/big-data/introducing-runtime-roles-for-amazon-emr-steps-use-iam-roles-and-aws-lake-formation-for-access-control-with-amazon-emr/
    assumedBy: new iam.ServicePrincipal('elasticmapreduce.amazonaws.com'),
  });

  // WHEN
  const task = new tasks.EmrAddStep(stack, 'Task', {
    clusterId: 'ClusterId',
    name: 'StepName',
    jar: 'Jar',
    actionOnFailure: tasks.ActionOnFailure.CONTINUE,
    integrationPattern: sfn.IntegrationPattern.RUN_JOB,
    executionRoleArn: executionRole.roleArn,
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
          ':states:::elasticmapreduce:addStep.sync',
        ],
      ],
    },
    End: true,
    Parameters: {
      ClusterId: 'ClusterId',
      ExecutionRoleArn: {
        'Fn::GetAtt': [
          'Role1ABCC5F0',
          'Arn',
        ],
      },
      Step: {
        Name: 'StepName',
        ActionOnFailure: 'CONTINUE',
        HadoopJarStep: {
          Jar: 'Jar',
        },
      },
    },
  });
});

test('Terminate cluster with ClusterId from payload and static Step configuration', () => {
  // WHEN
  const task = new tasks.EmrAddStep(stack, 'Task', {
    clusterId: sfn.JsonPath.stringAt('$.ClusterId'),
    name: 'StepName',
    jar: 'Jar',
    actionOnFailure: tasks.ActionOnFailure.CONTINUE,
    integrationPattern: sfn.IntegrationPattern.RUN_JOB,
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
          ':states:::elasticmapreduce:addStep.sync',
        ],
      ],
    },
    End: true,
    Parameters: {
      'ClusterId.$': '$.ClusterId',
      'Step': {
        Name: 'StepName',
        ActionOnFailure: 'CONTINUE',
        HadoopJarStep: {
          Jar: 'Jar',
        },
      },
    },
  });
});

test('Add Step with static ClusterId and Step Name from payload', () => {
  // WHEN
  const task = new tasks.EmrAddStep(stack, 'Task', {
    clusterId: 'ClusterId',
    name: sfn.JsonPath.stringAt('$.StepName'),
    jar: 'Jar',
    actionOnFailure: tasks.ActionOnFailure.CONTINUE,
    integrationPattern: sfn.IntegrationPattern.RUN_JOB,
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
          ':states:::elasticmapreduce:addStep.sync',
        ],
      ],
    },
    End: true,
    Parameters: {
      ClusterId: 'ClusterId',
      Step: {
        'Name.$': '$.StepName',
        'ActionOnFailure': 'CONTINUE',
        'HadoopJarStep': {
          Jar: 'Jar',
        },
      },
    },
  });
});

test('Add Step with static ClusterId and Step configuration and FIRE_AND_FORGET integrationPattern', () => {
  // WHEN
  const task = new tasks.EmrAddStep(stack, 'Task', {
    clusterId: 'ClusterId',
    name: 'StepName',
    jar: 'Jar',
    actionOnFailure: tasks.ActionOnFailure.CONTINUE,
    integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
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
          ':states:::elasticmapreduce:addStep',
        ],
      ],
    },
    End: true,
    Parameters: {
      ClusterId: 'ClusterId',
      Step: {
        Name: 'StepName',
        ActionOnFailure: 'CONTINUE',
        HadoopJarStep: {
          Jar: 'Jar',
        },
      },
    },
  });
});

test('Add Step with static ClusterId and Step configuration with TERMINATE_CLUSTER', () => {
  // WHEN
  const task = new tasks.EmrAddStep(stack, 'Task', {
    clusterId: 'ClusterId',
    name: 'StepName',
    jar: 'Jar',
    actionOnFailure: tasks.ActionOnFailure.TERMINATE_CLUSTER,
    integrationPattern: sfn.IntegrationPattern.RUN_JOB,
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
          ':states:::elasticmapreduce:addStep.sync',
        ],
      ],
    },
    End: true,
    Parameters: {
      ClusterId: 'ClusterId',
      Step: {
        Name: 'StepName',
        ActionOnFailure: 'TERMINATE_CLUSTER',
        HadoopJarStep: {
          Jar: 'Jar',
        },
      },
    },
  });
});

test('Add Step with static ClusterId and Step configuration with Args', () => {
  // WHEN
  const task = new tasks.EmrAddStep(stack, 'Task', {
    clusterId: 'ClusterId',
    name: 'StepName',
    jar: 'Jar',
    args: ['Arg1'],
    actionOnFailure: tasks.ActionOnFailure.CONTINUE,
    integrationPattern: sfn.IntegrationPattern.RUN_JOB,
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
          ':states:::elasticmapreduce:addStep.sync',
        ],
      ],
    },
    End: true,
    Parameters: {
      ClusterId: 'ClusterId',
      Step: {
        Name: 'StepName',
        ActionOnFailure: 'CONTINUE',
        HadoopJarStep: {
          Jar: 'Jar',
          Args: ['Arg1'],
        },
      },
    },
  });
});

test('Add Step with static ClusterId and Step configuration with Properties', () => {
  // WHEN
  const task = new tasks.EmrAddStep(stack, 'Task', {
    clusterId: 'ClusterId',
    name: 'StepName',
    jar: 'Jar',
    properties: {
      PropertyKey: 'PropertyValue',
    },
    actionOnFailure: tasks.ActionOnFailure.CONTINUE,
    integrationPattern: sfn.IntegrationPattern.RUN_JOB,
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
          ':states:::elasticmapreduce:addStep.sync',
        ],
      ],
    },
    End: true,
    Parameters: {
      ClusterId: 'ClusterId',
      Step: {
        Name: 'StepName',
        ActionOnFailure: 'CONTINUE',
        HadoopJarStep: {
          Jar: 'Jar',
          Properties: [{
            Key: 'PropertyKey',
            Value: 'PropertyValue',
          }],
        },
      },
    },
  });
});

test('task policies are generated', () => {
  // WHEN
  const task = new tasks.EmrAddStep(stack, 'Task', {
    clusterId: 'ClusterId',
    name: 'StepName',
    jar: 'Jar',
    integrationPattern: sfn.IntegrationPattern.RUN_JOB,
  });
  new sfn.StateMachine(stack, 'SM', {
    definitionBody: sfn.DefinitionBody.fromChainable(task),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [{
        Action: [
          'elasticmapreduce:AddJobFlowSteps',
          'elasticmapreduce:DescribeStep',
          'elasticmapreduce:CancelSteps',
        ],
        Effect: 'Allow',
        Resource: {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':elasticmapreduce:',
              {
                Ref: 'AWS::Region',
              },
              ':',
              {
                Ref: 'AWS::AccountId',
              },
              ':cluster/*',
            ],
          ],
        },
      },
      {
        Action: [
          'events:PutTargets',
          'events:PutRule',
          'events:DescribeRule',
        ],
        Effect: 'Allow',
        Resource: {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':events:',
              {
                Ref: 'AWS::Region',
              },
              ':',
              {
                Ref: 'AWS::AccountId',
              },
              ':rule/StepFunctionsGetEventForEMRAddJobFlowStepsRule',
            ],
          ],
        },
      }],
    },
  });
});

test('Task throws if WAIT_FOR_TASK_TOKEN is supplied as service integration pattern', () => {
  expect(() => {
    new tasks.EmrAddStep(stack, 'Task', {
      clusterId: 'ClusterId',
      name: 'StepName',
      jar: 'Jar',
      actionOnFailure: tasks.ActionOnFailure.CONTINUE,
      integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
    });
  }).toThrow(/Unsupported service integration pattern. Supported Patterns: REQUEST_RESPONSE,RUN_JOB. Received: WAIT_FOR_TASK_TOKEN/);
});
