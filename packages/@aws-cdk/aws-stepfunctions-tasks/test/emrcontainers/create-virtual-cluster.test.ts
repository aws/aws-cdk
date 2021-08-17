import '@aws-cdk/assert-internal/jest';
import * as eks from '@aws-cdk/aws-eks';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Stack } from '@aws-cdk/core';
import { EmrContainersEksCreateVirtualCluster, EksClusterInput } from '../../lib/emrcontainers/create-virtual-cluster';

const emrContainersVirtualClusterName = 'EMR Containers Virtual Cluster';
let stack: Stack;
let clusterId: string;
/**
 * To do for testing
 * 1. Needs to test with(default) and without EksInfo and ContainerInfo, make sure it works without it - FINISHED
 * 2. Needs to test ALL supported integration patterns and throw errors when needed - Finished
 * 3. Need to finish testing for all policy statements - Finished
 * 4. Need to test with both input formats: task input and cluster input - Finished
 */

beforeEach(() => {
  stack = new Stack();
  clusterId = 'test-eks';
});

test('Invoke emr-containers CreateVirtualCluster without required properties', () => {
  // WHEN
  const task = new EmrContainersEksCreateVirtualCluster(stack, 'Task', {
    virtualClusterName: emrContainersVirtualClusterName,
    eksCluster: EksClusterInput.fromTaskInput(sfn.TaskInput.fromText(clusterId)),
    integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
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
      Name: emrContainersVirtualClusterName,
      ContainerProvider: {
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

test('Invoke emr-containers CreateVirtualCluster with all required/non-required properties', () => {
  // WHEN
  const task = new EmrContainersEksCreateVirtualCluster(stack, 'Task', {
    virtualClusterName: emrContainersVirtualClusterName,
    eksCluster: EksClusterInput.fromTaskInput(sfn.TaskInput.fromText(clusterId)),
    eksNamespace: 'default',
    integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
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
      Name: emrContainersVirtualClusterName,
      ContainerProvider: {
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

test('Create virtual cluster with clusterId from payload', () => {
  // WHEN
  const task = new EmrContainersEksCreateVirtualCluster(stack, 'Task', {
    virtualClusterName: emrContainersVirtualClusterName,
    eksCluster: EksClusterInput.fromTaskInput(sfn.TaskInput.fromJsonPathAt('$.ClusterId')),
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
          ':states:::emr-containers:createVirtualCluster',
        ],
      ],
    },
    End: true,
    Parameters: {
      Name: emrContainersVirtualClusterName,
      ContainerProvider: {
        'Id.$': '$.ClusterId',
        'Info': {
          EksInfo: {
            Namespace: 'default',
          },
        },
        'Type': 'EKS',
      },
    },
  });
});

test('Create virtual cluster with an existing EKS cluster', () => {
  // WHEN
  const eksCluster = new eks.Cluster(stack, 'EKS Cluster', {
    version: eks.KubernetesVersion.V1_20,
  });

  const task = new EmrContainersEksCreateVirtualCluster(stack, 'Task', {
    virtualClusterName: emrContainersVirtualClusterName,
    eksCluster: EksClusterInput.fromCluster(eksCluster),
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
          ':states:::emr-containers:createVirtualCluster',
        ],
      ],
    },
    End: true,
    Parameters: {
      Name: emrContainersVirtualClusterName,
      ContainerProvider: {
        Id: {
          Ref: 'EKSClusterEDAD5FD1',
        },
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


test('Permitted role actions included for CreateVirtualCluster if service integration pattern is REQUEST_RESPONSE', () => {
  // WHEN
  const task = new EmrContainersEksCreateVirtualCluster(stack, 'Task', {
    virtualClusterName: emrContainersVirtualClusterName,
    eksCluster: EksClusterInput.fromTaskInput(sfn.TaskInput.fromText(clusterId)),
    integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
  });

  new sfn.StateMachine(stack, 'SM', {
    definition: task,
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [{
        Action: 'emr-containers:CreateVirtualCluster',
      },
      {
        Action: 'iam:CreateServiceLinkedRole',
        Condition: {
          StringLike: {
            'iam:AWSServiceName': 'emr-containers.amazonaws.com',
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
    new EmrContainersEksCreateVirtualCluster(stack, 'EMR Containers CreateVirtualCluster Job', {
      virtualClusterName: emrContainersVirtualClusterName,
      eksCluster: EksClusterInput.fromTaskInput(sfn.TaskInput.fromText(clusterId)),
      integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
    });
  }).toThrow(/Unsupported service integration pattern. Supported Patterns: REQUEST_RESPONSE. Received: WAIT_FOR_TASK_TOKEN/);
});

test('Task throws if RUN_JOB is supplied as service integration pattern', () => {
  expect(() => {
    new EmrContainersEksCreateVirtualCluster(stack, 'EMR Containers CreateVirtualCluster Job', {
      virtualClusterName: emrContainersVirtualClusterName,
      eksCluster: EksClusterInput.fromTaskInput(sfn.TaskInput.fromText(clusterId)),
      integrationPattern: sfn.IntegrationPattern.RUN_JOB,
    });
  }).toThrow(/Unsupported service integration pattern. Supported Patterns: REQUEST_RESPONSE. Received: RUN_JOB/);
});