import '@aws-cdk/assert-internal/jest';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Stack } from '@aws-cdk/core';
import { EmrContainersCreateVirtualCluster, ContainerProviderTypes, EksClusterInput } from '../../lib/emrcontainers/create-virtual-cluster';

const emrContainersVirtualClusterName = 'EMR Containers Virtual Cluster';
let stack: Stack;
let clusterId: string;
/**
 * To do for testing
 * 1. Needs to test with(default) and without EksInfo and ContainerInfo, make sure it works without it - FINISHED
 * 2. Needs to test ALL supported integration patterns and throw errors when needed - Finished
 * 3. Need to finish testing for all policy statements - Finished
 */

beforeEach(() => {
  stack = new Stack();
  clusterId = 'test-eks';
});

test('Invoke emr-containers CreateVirtualCluster without required properties', () => {
  // WHEN
  const task = new EmrContainersCreateVirtualCluster(stack, 'Task', {
    virtuaClusterName: emrContainersVirtualClusterName,
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
        Type: ContainerProviderTypes.EKS.type,
      },
    },
  });
});

test('Invoke emr-containers CreateVirtualCluster with all required/non-required properties', () => {
  // WHEN
  const task = new EmrContainersCreateVirtualCluster(stack, 'Task', {
    virtuaClusterName: emrContainersVirtualClusterName,
    eksCluster: EksClusterInput.fromTaskInput(sfn.TaskInput.fromText(clusterId)),
    eksNamespace: 'kube-system',
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
            Namespace: 'kube-system',
          },
        },
        Type: ContainerProviderTypes.EKS.type,
      },
    },
  });
});

test('Create virtual cluster with clusterId from payload', () => {
  // WHEN
  const task = new EmrContainersCreateVirtualCluster(stack, 'Task', {
    virtuaClusterName: emrContainersVirtualClusterName,
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
        'Type': ContainerProviderTypes.EKS.type,
      },
    },
  });
});

test('Permitted role actions included for CreateVirtualCluster if service integration pattern is REQUEST_RESPONSE', () => {
  // WHEN
  const task = new EmrContainersCreateVirtualCluster(stack, 'Task', {
    virtuaClusterName: emrContainersVirtualClusterName,
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
        Action: [
          'emr-containers:CreateVirtualCluster',
        ],
      }],
    },
  });
});

test('Task throws if WAIT_FOR_TASK_TOKEN is supplied as service integration pattern', () => {
  expect(() => {
    new EmrContainersCreateVirtualCluster(stack, 'EMR Containers CreateVirtualCluster Job', {
      virtuaClusterName: emrContainersVirtualClusterName,
      eksCluster: EksClusterInput.fromTaskInput(sfn.TaskInput.fromText(clusterId)),
      integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
    });
  }).toThrow(/Unsupported service integration pattern. Supported Patterns: REQUEST_RESPONSE. Received: WAIT_FOR_TASK_TOKEN/);
});

test('Task throws if RUN_JOB is supplied as service integration pattern', () => {
  expect(() => {
    new EmrContainersCreateVirtualCluster(stack, 'EMR Containers CreateVirtualCluster Job', {
      virtuaClusterName: emrContainersVirtualClusterName,
      eksCluster: EksClusterInput.fromTaskInput(sfn.TaskInput.fromText(clusterId)),
      integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
    });
  }).toThrow(/Unsupported service integration pattern. Supported Patterns: REQUEST_RESPONSE. Received: RUN_JOB/);
});