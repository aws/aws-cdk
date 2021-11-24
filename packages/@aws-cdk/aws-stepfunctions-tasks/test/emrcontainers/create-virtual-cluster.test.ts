import { Template } from '@aws-cdk/assertions';
import * as eks from '@aws-cdk/aws-eks';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Stack } from '@aws-cdk/core';
import { EmrContainersCreateVirtualCluster, EksClusterInput } from '../../lib/emrcontainers/create-virtual-cluster';

const emrContainersVirtualClusterName = 'EMR Containers Virtual Cluster';
let stack: Stack;
let clusterId: string;

beforeEach(() => {
  stack = new Stack();
  clusterId = 'test-eks';
});

describe('Invoke emr-containers CreateVirtualCluster with ', () => {
  test('only required properties', () => {
    // WHEN
    const task = new EmrContainersCreateVirtualCluster(stack, 'Task', {
      eksCluster: EksClusterInput.fromTaskInput(sfn.TaskInput.fromText(clusterId)),
    });

    new sfn.StateMachine(stack, 'SM', {
      definition: task,
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
            ':states:::emr-containers:createVirtualCluster',
          ],
        ],
      },
      End: true,
      Parameters: {
        'Name.$': "States.Format('{}/{}', $$.Execution.Name, $$.State.Name)",
        'ContainerProvider': {
          Id: clusterId,
          Info: {
            EksInfo: {
              Namespace: 'default',
            },
          },
          Type: 'EKS',
        },
      },
    });
  });

  test('all required/non-required properties', () => {
    // WHEN
    const task = new EmrContainersCreateVirtualCluster(stack, 'Task', {
      virtualClusterName: emrContainersVirtualClusterName,
      eksCluster: EksClusterInput.fromTaskInput(sfn.TaskInput.fromText(clusterId)),
      eksNamespace: 'namespace',
      integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
    });

    new sfn.StateMachine(stack, 'SM', {
      definition: task,
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toMatchObject({
      Parameters: {
        Name: emrContainersVirtualClusterName,
        ContainerProvider: {
          Id: clusterId,
          Info: {
            EksInfo: {
              Namespace: 'namespace',
            },
          },
        },
      },
    });
  });

  test('clusterId from payload', () => {
    // WHEN
    const task = new EmrContainersCreateVirtualCluster(stack, 'Task', {
      eksCluster: EksClusterInput.fromTaskInput(sfn.TaskInput.fromJsonPathAt('$.ClusterId')),
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toMatchObject({
      Parameters: {
        ContainerProvider: {
          'Id.$': '$.ClusterId',
        },
      },
    });
  });

  test('with an existing EKS cluster', () => {
    // WHEN
    const eksCluster = new eks.Cluster(stack, 'EKS Cluster', {
      version: eks.KubernetesVersion.V1_20,
    });

    const task = new EmrContainersCreateVirtualCluster(stack, 'Task', {
      eksCluster: EksClusterInput.fromCluster(eksCluster),
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toMatchObject({
      Parameters: {
        ContainerProvider: {
          Id: {
            Ref: 'EKSClusterEDAD5FD1',
          },
        },
      },
    });
  });

  test('Tags', () => {
    // WHEN
    const task = new EmrContainersCreateVirtualCluster(stack, 'Task', {
      eksCluster: EksClusterInput.fromTaskInput(sfn.TaskInput.fromText(clusterId)),
      tags: {
        key: 'value',
      },
    });

    new sfn.StateMachine(stack, 'SM', {
      definition: task,
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toMatchObject({
      Parameters: {
        Tags: {
          key: 'value',
        },
      },
    });
  });
});

test('Permitted role actions included for CreateVirtualCluster if service integration pattern is REQUEST_RESPONSE', () => {
  // WHEN
  const task = new EmrContainersCreateVirtualCluster(stack, 'Task', {
    virtualClusterName: emrContainersVirtualClusterName,
    eksCluster: EksClusterInput.fromTaskInput(sfn.TaskInput.fromText(clusterId)),
  });

  new sfn.StateMachine(stack, 'SM', {
    definition: task,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [{
        Action: 'emr-containers:CreateVirtualCluster',
        Effect: 'Allow',
        Resource: '*',
      },
      {
        Action: 'iam:CreateServiceLinkedRole',
        Condition: {
          StringLike: {
            'iam:AWSServiceName': 'emr-containers.amazonaws.com',
          },
        },
        Effect: 'Allow',
        Resource: {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':iam::',
              {
                Ref: 'AWS::AccountId',
              },
              ':role/aws-service-role/emr-containers.amazonaws.com/AWSServiceRoleForAmazonEMRContainers',
            ],
          ],
        },
      }],
    },
  });
});

test('Task throws if WAIT_FOR_TASK_TOKEN is supplied as service integration pattern', () => {
  expect(() => {
    new EmrContainersCreateVirtualCluster(stack, 'EMR Containers CreateVirtualCluster Job', {
      virtualClusterName: emrContainersVirtualClusterName,
      eksCluster: EksClusterInput.fromTaskInput(sfn.TaskInput.fromText(clusterId)),
      integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
    });
  }).toThrow(/Unsupported service integration pattern. Supported Patterns: REQUEST_RESPONSE. Received: WAIT_FOR_TASK_TOKEN/);
});

test('Task throws if RUN_JOB is supplied as service integration pattern', () => {
  expect(() => {
    new EmrContainersCreateVirtualCluster(stack, 'EMR Containers CreateVirtualCluster Job', {
      virtualClusterName: emrContainersVirtualClusterName,
      eksCluster: EksClusterInput.fromTaskInput(sfn.TaskInput.fromText(clusterId)),
      integrationPattern: sfn.IntegrationPattern.RUN_JOB,
    });
  }).toThrow(/Unsupported service integration pattern. Supported Patterns: REQUEST_RESPONSE. Received: RUN_JOB/);
});
