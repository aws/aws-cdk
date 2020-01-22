import '@aws-cdk/assert/jest';
import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as tasks from '../lib';

let stack: cdk.Stack;
let clusterRole: iam.Role;
let serviceRole: iam.Role;
let autoScalingRole: iam.Role;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
  clusterRole = new iam.Role(stack, 'ClusterRole', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com')
  });
  serviceRole = new iam.Role(stack, 'ServiceRole', {
    assumedBy: new iam.ServicePrincipal('elasticmapreduce.amazonaws.com')
  });
  autoScalingRole = new iam.Role(stack, 'AutoScalingRole', {
    assumedBy: new iam.ServicePrincipal('elasticmapreduce.amazonaws.com')
  });
  autoScalingRole.assumeRolePolicy?.addStatements(
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      principals: [
        new iam.ServicePrincipal('application-autoscaling.amazonaws.com')
      ],
      actions: [
        'sts:AssumeRole'
      ]
    })
  );
});

test('Create Cluster with FIRE_AND_FORGET integrationPattern', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', { task: new tasks.EmrCreateCluster({
    instances: {},
    clusterRole,
    name: 'Cluster',
    serviceRole,
    autoScalingRole,
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
      VisibleToAllUsers: true,
      JobFlowRole: {
        Ref: 'ClusterRoleD9CA7471',
      },
      ServiceRole: {
        Ref: 'ServiceRole4288B192'
      },
      AutoScalingRole: {
        Ref: 'AutoScalingRole015ADA0A'
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
    autoScalingRole,
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
      VisibleToAllUsers: true,
      JobFlowRole: {
        Ref: 'ClusterRoleD9CA7471',
      },
      ServiceRole: {
        Ref: 'ServiceRole4288B192'
      },
      AutoScalingRole: {
        Ref: 'AutoScalingRole015ADA0A'
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
    autoScalingRole,
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
      'VisibleToAllUsers': true,
      'JobFlowRole': {
        Ref: 'ClusterRoleD9CA7471',
      },
      'ServiceRole': {
        Ref: 'ServiceRole4288B192'
      },
      'AutoScalingRole': {
        Ref: 'AutoScalingRole015ADA0A'
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
    autoScalingRole,
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
      VisibleToAllUsers: true,
      JobFlowRole: {
        Ref: 'ClusterRoleD9CA7471',
      },
      ServiceRole: {
        Ref: 'ServiceRole4288B192'
      },
      AutoScalingRole: {
        Ref: 'AutoScalingRole015ADA0A'
      },
      Tags: [{
        Key: 'Key',
        Value: 'Value'
      }]
    },
  });
});

test('Create Cluster without Roles', () => {
  // WHEN
  const createClusterTask = new tasks.EmrCreateCluster({
    instances: {},
    name: 'Cluster',
    integrationPattern: sfn.ServiceIntegrationPattern.SYNC
  });
  const task = new sfn.Task(stack, 'Task', { task: createClusterTask});

  // tslint:disable-next-line:no-console
  console.log();

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
      VisibleToAllUsers: true,
      JobFlowRole: {
        Ref: 'TaskInstanceRoleB72072BF'
      },
      ServiceRole: {
        Ref: 'TaskServiceRoleBF55F61E'
      },
      AutoScalingRole: {
        Ref: 'TaskAutoScalingRoleD06F8423'
      }
    },
  });

  expect(stack).toHaveResourceLike('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Principal: { Service: 'elasticmapreduce.amazonaws.com' },
          Action: 'sts:AssumeRole',
          Effect: 'Allow'
        }
      ],
    }
  });

  // The stack renders the ec2.amazonaws.com Service principal id with a
  // Join to the URLSuffix
  expect(stack).toHaveResourceLike('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Principal: { Service:
            {
              'Fn::Join': [
                '',
                [
                  'ec2.',
                  {
                    Ref: 'AWS::URLSuffix'
                  }
                ]
              ]
            }
          },
          Action: 'sts:AssumeRole',
          Effect: 'Allow'
        }
      ],
    }
  });

  expect(stack).toHaveResourceLike('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Principal: { Service: 'elasticmapreduce.amazonaws.com' },
          Action: 'sts:AssumeRole',
          Effect: 'Allow'
        },
        {
          Principal: { Service: 'application-autoscaling.amazonaws.com' },
          Action: 'sts:AssumeRole',
          Effect: 'Allow'
        }
      ],
    }
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
        autoScalingRole,
        integrationPattern: sfn.ServiceIntegrationPattern.WAIT_FOR_TASK_TOKEN
      })
    });
  }).toThrow(/Invalid Service Integration Pattern: WAIT_FOR_TASK_TOKEN is not supported to call CreateCluster./i);
});