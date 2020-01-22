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
      Instances: {
        KeepJobFlowAliveWhenNoSteps: true
      },
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
      Instances: {
        KeepJobFlowAliveWhenNoSteps: true
      },
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
      'Instances': {
        KeepJobFlowAliveWhenNoSteps: true
      },
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
      Instances: {
        KeepJobFlowAliveWhenNoSteps: true
      },
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

test('Create Cluster with Applications', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', { task: new tasks.EmrCreateCluster({
    instances: {},
    clusterRole,
    name: 'Cluster',
    serviceRole,
    autoScalingRole,
    applications: [
      { name: 'Hive', version: '0.0' },
      { name: 'Spark', version: '0.0' }
    ],
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
      Instances: {
        KeepJobFlowAliveWhenNoSteps: true
      },
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
      Applications: [
        { Name: 'Hive', Version: '0.0' },
        { Name: 'Spark', Version: '0.0' }
      ]
    },
  });
});

test('Create Cluster with Bootstrap Actions', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', { task: new tasks.EmrCreateCluster({
    instances: {},
    clusterRole,
    name: 'Cluster',
    serviceRole,
    autoScalingRole,
    bootstrapActions: [{
      name: 'Bootstrap',
      path: 's3://null',
      args: [ 'Arg' ]
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
      Instances: {
        KeepJobFlowAliveWhenNoSteps: true
      },
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
      BootstrapActions: [{
        Name: 'Bootstrap',
        ScriptBootstrapAction: {
          Path: 's3://null',
          Args: [ 'Arg' ]
        }
      }]
    },
  });
});

test('Create Cluster with Configurations', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', { task: new tasks.EmrCreateCluster({
    instances: {},
    clusterRole,
    name: 'Cluster',
    serviceRole,
    autoScalingRole,
    configurations: [{
      classification: 'classification',
      properties: {
        Key: 'Value'
      }
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
      Instances: {
        KeepJobFlowAliveWhenNoSteps: true
      },
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
      Configurations: [{
        Classification: 'classification',
        Properties: {
          Key: 'Value'
        }
      }]
    },
  });
});

test('Create Cluster with KerberosAttributes', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', { task: new tasks.EmrCreateCluster({
    instances: {},
    clusterRole,
    name: 'Cluster',
    serviceRole,
    autoScalingRole,
    kerberosAttributes: {
      realm: 'realm',
      adDomainJoinPassword: 'password1',
      adDomainJoinUser: 'user',
      crossRealmTrustPrincipalPassword: 'password2',
      kdcAdminPassword: 'password3'
    },
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
      Instances: {
        KeepJobFlowAliveWhenNoSteps: true
      },
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
      KerberosAttributes: {
        Realm: 'realm',
        ADDomainJoinPassword: 'password1',
        ADDomainJoinUser: 'user',
        CrossRealmTrustPrincipalPassword: 'password2',
        KdcAdminPassword: 'password3'
      }
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
      Instances: {
        KeepJobFlowAliveWhenNoSteps: true
      },
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

test('Create Cluster with Instances configuration', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', { task: new tasks.EmrCreateCluster({
    instances: {
      additionalMasterSecurityGroups: ['MasterGroup'],
      additionalSlaveSecurityGroups: ['SlaveGroup'],
      ec2KeyName: 'Ec2KeyName',
      ec2SubnetId: 'Ec2SubnetId',
      ec2SubnetIds: ['Ec2SubnetId'],
      emrManagedMasterSecurityGroup: 'MasterGroup',
      emrManagedSlaveSecurityGroup: 'SlaveGroup',
      hadoopVersion: 'HadoopVersion',
      instanceCount: 1,
      masterInstanceType: 'MasterInstanceType',
      placement: {
        availabilityZone: 'AvailabilityZone',
        availabilityZones: ['AvailabilityZone']
      },
      serviceAccessSecurityGroup: 'ServiceAccessGroup',
      slaveInstanceType: 'SlaveInstanceType',
      terminationProtected: true
    },
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
      Instances: {
        AdditionalMasterSecurityGroups: ['MasterGroup'],
        AdditionalSlaveSecurityGroups: ['SlaveGroup'],
        Ec2KeyName: 'Ec2KeyName',
        Ec2SubnetId: 'Ec2SubnetId',
        Ec2SubnetIds: ['Ec2SubnetId'],
        EmrManagedMasterSecurityGroup: 'MasterGroup',
        EmrManagedSlaveSecurityGroup: 'SlaveGroup',
        HadoopVersion: 'HadoopVersion',
        InstanceCount: 1,
        KeepJobFlowAliveWhenNoSteps: true,
        MasterInstanceType: 'MasterInstanceType',
        Placement: {
          AvailabilityZone: 'AvailabilityZone',
          AvailabilityZones: ['AvailabilityZone']
        },
        ServiceAccessSecurityGroup: 'ServiceAccessGroup',
        SlaveInstanceType: 'SlaveInstanceType',
        TerminationProtected: true
      },
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