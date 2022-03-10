import { Template } from '@aws-cdk/assertions';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Stack } from '@aws-cdk/core';
import { EmrContainersDeleteVirtualCluster } from '../../lib/emrcontainers/delete-virtual-cluster';

let stack: Stack;
let virtualClusterId: string;

beforeEach(() => {
  stack = new Stack();
  virtualClusterId = 'x01f27i9a7cv1td52keaktr6j';
});

describe('Invoke EMR Containers Delete Virtual cluster with ', () => {
  test('a valid cluster ID', () => {
    // WHEN
    const task = new EmrContainersDeleteVirtualCluster(stack, 'Task', {
      virtualClusterId: sfn.TaskInput.fromText(virtualClusterId),
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
            ':states:::emr-containers:deleteVirtualCluster',
          ],
        ],
      },
      End: true,
      Parameters: {
        Id: virtualClusterId,
      },
    });
  });

  test('a RUN_JOB call', () => {
    // WHEN
    const task = new EmrContainersDeleteVirtualCluster(stack, 'Task', {
      virtualClusterId: sfn.TaskInput.fromText(virtualClusterId),
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
            ':states:::emr-containers:deleteVirtualCluster.sync',
          ],
        ],
      },
      End: true,
      Parameters: {
        Id: virtualClusterId,
      },
    });
  });

  test('passing in JSON Path', () => {
    // WHEN
    const task = new EmrContainersDeleteVirtualCluster(stack, 'Task', {
      virtualClusterId: sfn.TaskInput.fromJsonPathAt('$.VirtualClusterId'),
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toMatchObject({
      Parameters: {
        'Id.$': '$.VirtualClusterId',
      },
    });
  });
});

describe('Valid policy statements and resources are passed ', () => {
  test('to the state machine with a REQUEST_RESPONSE call', () => {
    // WHEN
    const task = new EmrContainersDeleteVirtualCluster(stack, 'Task', {
      virtualClusterId: sfn.TaskInput.fromText(virtualClusterId),
    });

    new sfn.StateMachine(stack, 'SM', {
      definition: task,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [{
          Action: 'emr-containers:DeleteVirtualCluster',
          Effect: 'Allow',
          Resource: {
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':emr-containers:',
                {
                  Ref: 'AWS::Region',
                },
                ':',
                {
                  Ref: 'AWS::AccountId',
                },
                `:/virtualclusters/${virtualClusterId}`,
              ],
            ],
          },
        }],
      },
    });
  });

  test('to the state machine with a RUN_JOB call', () => {
    // WHEN
    const task = new EmrContainersDeleteVirtualCluster(stack, 'Task', {
      virtualClusterId: sfn.TaskInput.fromText(virtualClusterId),
      integrationPattern: sfn.IntegrationPattern.RUN_JOB,
    });

    new sfn.StateMachine(stack, 'SM', {
      definition: task,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [{
          Action: [
            'emr-containers:DeleteVirtualCluster',
            'emr-containers:DescribeVirtualCluster',
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
                ':emr-containers:',
                {
                  Ref: 'AWS::Region',
                },
                ':',
                {
                  Ref: 'AWS::AccountId',
                },
                `:/virtualclusters/${virtualClusterId}`,
              ],
            ],
          },
        }],
      },
    });
  });

  test('when the virtual cluster ID is from a payload', () => {
    // WHEN
    const task = new EmrContainersDeleteVirtualCluster(stack, 'Task', {
      virtualClusterId: sfn.TaskInput.fromJsonPathAt('$.ClusterId'),
      integrationPattern: sfn.IntegrationPattern.RUN_JOB,
    });

    new sfn.StateMachine(stack, 'SM', {
      definition: task,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [{
          Action: [
            'emr-containers:DeleteVirtualCluster',
            'emr-containers:DescribeVirtualCluster',
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
                ':emr-containers:',
                {
                  Ref: 'AWS::Region',
                },
                ':',
                {
                  Ref: 'AWS::AccountId',
                },
                ':/virtualclusters/*',
              ],
            ],
          },
        }],
      },
    });
  });
});


test('Task throws if WAIT_FOR_TASK_TOKEN is supplied as service integration pattern', () => {
  expect(() => {
    new EmrContainersDeleteVirtualCluster(stack, 'EMR Containers DeleteVirtualCluster Job', {
      virtualClusterId: sfn.TaskInput.fromText(virtualClusterId),
      integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
    });
  }).toThrow(/Unsupported service integration pattern. Supported Patterns: REQUEST_RESPONSE,RUN_JOB. Received: WAIT_FOR_TASK_TOKEN/);
});
