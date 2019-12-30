import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as tasks from '../lib';

let stack: cdk.Stack;
let clusterRole: iam.Role;
let serviceRole: iam.Role;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
  clusterRole = new iam.Role(stack, 'ClusterRole', {
      assumedBy: new iam.ServicePrincipal('elasticmapreduce.amazonaws.com')
  });
  serviceRole = new iam.Role(stack, 'ServiceRole', {
    assumedBy: new iam.ServicePrincipal('elasticmapreduce.amazonaws.com')
});

});

test('Create Cluster with FIRE_AND_FORGET integrationPattern', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', { task: new tasks.EmrCreateCluster({
    instances: {},
    clusterRole,
    name: 'Cluster',
    serviceRole,
    integrationPattern: sfn.ServiceIntegrationPattern.FIRE_AND_FORGET
  }) });

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
          ':states:::elasticmapreduce:createCluster',
        ],
      ],
    },
    End: true,
    Parameters: {
      Name: 'Cluster',
      Instances: {},
      JobFlowRole: {
        'Fn::GetAtt': ['ClusterRoleD9CA7471', 'Arn']
      },
      ServiceRole: {
        'Fn::GetAtt': ['ServiceRole4288B192', 'Arn']
      }
    },
  });
});

test('Create Cluster with SYNC integrationPattern', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', { task: new tasks.EmrCreateCluster({
    instances: {},
    clusterRole,
    name: 'Cluster',
    serviceRole,
    integrationPattern: sfn.ServiceIntegrationPattern.SYNC
  }) });

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
          ':states:::elasticmapreduce:createCluster.sync',
        ],
      ],
    },
    End: true,
    Parameters: {
      Name: 'Cluster',
      Instances: {},
      JobFlowRole: {
        'Fn::GetAtt': ['ClusterRoleD9CA7471', 'Arn']
      },
      ServiceRole: {
        'Fn::GetAtt': ['ServiceRole4288B192', 'Arn']
      }
    },
  });
});

test('Create Cluster with clusterConfiguration Name from payload', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', { task: new tasks.EmrCreateCluster({
    instances: {},
    clusterRole,
    name: sfn.TaskInput.fromDataAt('$.ClusterName').value,
    serviceRole,
    integrationPattern: sfn.ServiceIntegrationPattern.FIRE_AND_FORGET
  }) });

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
          ':states:::elasticmapreduce:createCluster',
        ],
      ],
    },
    End: true,
    Parameters: {
      'Name.$': '$.ClusterName',
      'Instances': {},
      'JobFlowRole': {
        'Fn::GetAtt': ['ClusterRoleD9CA7471', 'Arn']
      },
      'ServiceRole': {
        'Fn::GetAtt': ['ServiceRole4288B192', 'Arn']
      }
    },
  });
});

test('Create Cluster with Tags', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', { task: new tasks.EmrCreateCluster({
    instances: {},
    clusterRole,
    name: 'Cluster',
    serviceRole,
    tags: [{
      key: 'Key',
      value: 'Value'
    }],
    integrationPattern: sfn.ServiceIntegrationPattern.FIRE_AND_FORGET
  }) });

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
          ':states:::elasticmapreduce:createCluster',
        ],
      ],
    },
    End: true,
    Parameters: {
      Name: 'Cluster',
      Instances: {},
      JobFlowRole: {
        'Fn::GetAtt': ['ClusterRoleD9CA7471', 'Arn']
      },
      ServiceRole: {
        'Fn::GetAtt': ['ServiceRole4288B192', 'Arn']
      },
      Tags: [{
        Key: 'Key',
        Value: 'Value'
      }]
    },
  });
});

test('Task throws if WAIT_FOR_TASK_TOKEN is supplied as service integration pattern', () => {
  expect(() => {
    new sfn.Task(stack, 'Task', {
      task: new tasks.EmrCreateCluster({
        instances: {},
        clusterRole,
        name: 'Cluster',
        serviceRole,
        integrationPattern: sfn.ServiceIntegrationPattern.WAIT_FOR_TASK_TOKEN
      })
    });
  }).toThrow(/Invalid Service Integration Pattern: WAIT_FOR_TASK_TOKEN is not supported to call CreateCluster./i);
});