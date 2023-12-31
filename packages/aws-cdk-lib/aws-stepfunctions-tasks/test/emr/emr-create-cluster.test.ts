import { Template } from '../../../assertions';
import * as iam from '../../../aws-iam';
import * as sfn from '../../../aws-stepfunctions';
import * as cdk from '../../../core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ENABLE_EMR_SERVICE_POLICY_V2 } from '../../../cx-api';
import { EmrCreateCluster } from '../../lib';

let stack: cdk.Stack;
let clusterRole: iam.Role;
let serviceRole: iam.Role;
let autoScalingRole: iam.Role;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
  clusterRole = new iam.Role(stack, 'ClusterRole', {
    assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
  });
  serviceRole = new iam.Role(stack, 'ServiceRole', {
    assumedBy: new iam.ServicePrincipal('elasticmapreduce.amazonaws.com'),
  });
  autoScalingRole = new iam.Role(stack, 'AutoScalingRole', {
    assumedBy: new iam.ServicePrincipal('elasticmapreduce.amazonaws.com'),
  });
  autoScalingRole.assumeRolePolicy?.addStatements(
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      principals: [
        new iam.ServicePrincipal('application-autoscaling.amazonaws.com'),
      ],
      actions: [
        'sts:AssumeRole',
      ],
    }),
  );
});

test('Create Cluster with an unresolved release label', () => {
  new EmrCreateCluster(stack, 'Task', {
    instances: {},
    name: 'Cluster',
    releaseLabel: cdk.Token.asString({}),
  });
});

test('Create Cluster with FIRE_AND_FORGET integrationPattern', () => {
  // WHEN
  const task = new EmrCreateCluster(stack, 'Task', {
    instances: {},
    clusterRole,
    name: 'Cluster',
    serviceRole,
    autoScalingRole,
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
          ':states:::elasticmapreduce:createCluster',
        ],
      ],
    },
    End: true,
    Parameters: {
      Name: 'Cluster',
      Instances: {
        KeepJobFlowAliveWhenNoSteps: true,
      },
      VisibleToAllUsers: true,
      JobFlowRole: {
        Ref: 'ClusterRoleD9CA7471',
      },
      ServiceRole: {
        Ref: 'ServiceRole4288B192',
      },
      AutoScalingRole: {
        Ref: 'AutoScalingRole015ADA0A',
      },
    },
  });
});

test('Create Cluster with SYNC integrationPattern', () => {
  // WHEN
  const task = new EmrCreateCluster(stack, 'Task', {
    instances: {},
    clusterRole,
    name: 'Cluster',
    serviceRole,
    autoScalingRole,
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
          ':states:::elasticmapreduce:createCluster.sync',
        ],
      ],
    },
    End: true,
    Parameters: {
      Name: 'Cluster',
      Instances: {
        KeepJobFlowAliveWhenNoSteps: true,
      },
      VisibleToAllUsers: true,
      JobFlowRole: {
        Ref: 'ClusterRoleD9CA7471',
      },
      ServiceRole: {
        Ref: 'ServiceRole4288B192',
      },
      AutoScalingRole: {
        Ref: 'AutoScalingRole015ADA0A',
      },
    },
  });
});

test('Create Cluster with clusterConfiguration Name from payload', () => {
  // WHEN
  const task = new EmrCreateCluster(stack, 'Task', {
    instances: {},
    clusterRole,
    name: sfn.TaskInput.fromJsonPathAt('$.ClusterName').value,
    serviceRole,
    autoScalingRole,
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
          ':states:::elasticmapreduce:createCluster',
        ],
      ],
    },
    End: true,
    Parameters: {
      'Name.$': '$.ClusterName',
      'Instances': {
        KeepJobFlowAliveWhenNoSteps: true,
      },
      'VisibleToAllUsers': true,
      'JobFlowRole': {
        Ref: 'ClusterRoleD9CA7471',
      },
      'ServiceRole': {
        Ref: 'ServiceRole4288B192',
      },
      'AutoScalingRole': {
        Ref: 'AutoScalingRole015ADA0A',
      },
    },
  });
});

describe('Cluster with StepConcurrencyLevel', () => {
  test('can be specified', async () => {
    // WHEN
    const task = new EmrCreateCluster(stack, 'Task', {
      instances: {},
      clusterRole,
      name: 'Cluster',
      serviceRole,
      autoScalingRole,
      stepConcurrencyLevel: 2,
      integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toMatchObject({
      Parameters: {
        Name: 'Cluster',
        StepConcurrencyLevel: 2,
      },
    });
  });

  test('can be set dynamically through JsonPath', async () => {
    // WHEN
    const task = new EmrCreateCluster(stack, 'Task', {
      instances: {},
      clusterRole,
      name: 'Cluster',
      serviceRole,
      autoScalingRole,
      stepConcurrencyLevel: sfn.JsonPath.numberAt('$.foo.bar'),
      integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toMatchObject({
      Parameters: {
        'Name': 'Cluster',
        'StepConcurrencyLevel.$': '$.foo.bar',
      },
    });
  });

  test('throws if < 1 or > 256', async () => {
    expect(() => new EmrCreateCluster(stack, 'Task1', {
      instances: {},
      clusterRole,
      name: 'Cluster',
      serviceRole,
      autoScalingRole,
      stepConcurrencyLevel: 0,
      integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
    })).toThrow('Step concurrency level must be in range [1, 256], but got 0.');

    expect(() => new EmrCreateCluster(stack, 'Task2', {
      instances: {},
      clusterRole,
      name: 'Cluster',
      serviceRole,
      autoScalingRole,
      stepConcurrencyLevel: 257,
      integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
    })).toThrow('Step concurrency level must be in range [1, 256], but got 257.');
  });

  test('throws if EMR release label below 5.28 and StepConcurrencyLevel !== 1', async () => {
    expect(() => new EmrCreateCluster(stack, 'Task2', {
      instances: {},
      clusterRole,
      name: 'Cluster',
      serviceRole,
      autoScalingRole,
      releaseLabel: 'emr-5.14.0',
      stepConcurrencyLevel: 2,
      integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
    })).toThrow('Step concurrency is only supported in EMR release version 5.28.0 and above but got emr-5.14.0.');
  });

  test('does not throw if EMR release label below 5.28 and StepConcurrencyLevel === 1', async () => {
    new EmrCreateCluster(stack, 'Task1', {
      instances: {},
      clusterRole,
      name: 'Cluster',
      serviceRole,
      autoScalingRole,
      releaseLabel: 'emr-5.14.0',
      stepConcurrencyLevel: 1,
      integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
    });
  });
});

test('Cluster with invalid release label will throw', async () => {
  expect(() => new EmrCreateCluster(stack, 'Task1', {
    instances: {},
    clusterRole,
    name: 'Cluster',
    serviceRole,
    autoScalingRole,
    releaseLabel: 'emra-5.14.0',
    stepConcurrencyLevel: 1,
    integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
  })).toThrow('The release label must be in the format \'emr-x.x.x\' but got emra-5.14.0');

  expect(() => new EmrCreateCluster(stack, 'Task2', {
    instances: {},
    clusterRole,
    name: 'Cluster',
    serviceRole,
    autoScalingRole,
    releaseLabel: 'emr-5.14.a',
    stepConcurrencyLevel: 1,
    integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
  })).toThrow('The release label must be in the format \'emr-x.x.x\' but got emr-5.14.a');

  expect(() => new EmrCreateCluster(stack, 'Task3', {
    instances: {},
    clusterRole,
    name: 'Cluster',
    serviceRole,
    autoScalingRole,
    releaseLabel: 'emr-5.14.0.0',
    stepConcurrencyLevel: 1,
    integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
  })).toThrow('The release label must be in the format \'emr-x.x.x\' but got emr-5.14.0.0');
});

test('Create Cluster with Tags', () => {
  // WHEN
  const task = new EmrCreateCluster(stack, 'Task', {
    instances: {},
    clusterRole,
    name: 'Cluster',
    serviceRole,
    autoScalingRole,
    tags: {
      key: 'value',
    },
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
          ':states:::elasticmapreduce:createCluster',
        ],
      ],
    },
    End: true,
    Parameters: {
      Name: 'Cluster',
      Instances: {
        KeepJobFlowAliveWhenNoSteps: true,
      },
      VisibleToAllUsers: true,
      JobFlowRole: {
        Ref: 'ClusterRoleD9CA7471',
      },
      ServiceRole: {
        Ref: 'ServiceRole4288B192',
      },
      AutoScalingRole: {
        Ref: 'AutoScalingRole015ADA0A',
      },
      Tags: [{
        Key: 'key',
        Value: 'value',
      }],
    },
  });
});

test('Create Cluster with Applications', () => {
  // WHEN
  const task = new EmrCreateCluster(stack, 'Task', {
    instances: {},
    clusterRole,
    name: 'Cluster',
    serviceRole,
    autoScalingRole,
    applications: [
      { name: 'Hive', version: '0.0' },
      { name: 'Spark', version: '0.0' },
    ],
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
          ':states:::elasticmapreduce:createCluster',
        ],
      ],
    },
    End: true,
    Parameters: {
      Name: 'Cluster',
      Instances: {
        KeepJobFlowAliveWhenNoSteps: true,
      },
      VisibleToAllUsers: true,
      JobFlowRole: {
        Ref: 'ClusterRoleD9CA7471',
      },
      ServiceRole: {
        Ref: 'ServiceRole4288B192',
      },
      AutoScalingRole: {
        Ref: 'AutoScalingRole015ADA0A',
      },
      Applications: [
        { Name: 'Hive', Version: '0.0' },
        { Name: 'Spark', Version: '0.0' },
      ],
    },
  });
});

test('Create Cluster with Bootstrap Actions', () => {
  // WHEN
  const task = new EmrCreateCluster(stack, 'Task', {
    instances: {},
    clusterRole,
    name: 'Cluster',
    serviceRole,
    autoScalingRole,
    bootstrapActions: [{
      name: 'Bootstrap',
      scriptBootstrapAction: {
        path: 's3://null',
        args: ['Arg'],
      },
    }],
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
          ':states:::elasticmapreduce:createCluster',
        ],
      ],
    },
    End: true,
    Parameters: {
      Name: 'Cluster',
      Instances: {
        KeepJobFlowAliveWhenNoSteps: true,
      },
      VisibleToAllUsers: true,
      JobFlowRole: {
        Ref: 'ClusterRoleD9CA7471',
      },
      ServiceRole: {
        Ref: 'ServiceRole4288B192',
      },
      AutoScalingRole: {
        Ref: 'AutoScalingRole015ADA0A',
      },
      BootstrapActions: [{
        Name: 'Bootstrap',
        ScriptBootstrapAction: {
          Path: 's3://null',
          Args: ['Arg'],
        },
      }],
    },
  });
});

test('Create Cluster with Configurations', () => {
  // WHEN
  const task = new EmrCreateCluster(stack, 'Task', {
    instances: {},
    clusterRole,
    name: 'Cluster',
    serviceRole,
    autoScalingRole,
    configurations: [{
      classification: 'classification',
      properties: {
        Key: 'Value',
      },
    }],
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
          ':states:::elasticmapreduce:createCluster',
        ],
      ],
    },
    End: true,
    Parameters: {
      Name: 'Cluster',
      Instances: {
        KeepJobFlowAliveWhenNoSteps: true,
      },
      VisibleToAllUsers: true,
      JobFlowRole: {
        Ref: 'ClusterRoleD9CA7471',
      },
      ServiceRole: {
        Ref: 'ServiceRole4288B192',
      },
      AutoScalingRole: {
        Ref: 'AutoScalingRole015ADA0A',
      },
      Configurations: [{
        Classification: 'classification',
        Properties: {
          Key: 'Value',
        },
      }],
    },
  });
});

test('Create Cluster with KerberosAttributes', () => {
  // WHEN
  const task = new EmrCreateCluster(stack, 'Task', {
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
      kdcAdminPassword: 'password3',
    },
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
          ':states:::elasticmapreduce:createCluster',
        ],
      ],
    },
    End: true,
    Parameters: {
      Name: 'Cluster',
      Instances: {
        KeepJobFlowAliveWhenNoSteps: true,
      },
      VisibleToAllUsers: true,
      JobFlowRole: {
        Ref: 'ClusterRoleD9CA7471',
      },
      ServiceRole: {
        Ref: 'ServiceRole4288B192',
      },
      AutoScalingRole: {
        Ref: 'AutoScalingRole015ADA0A',
      },
      KerberosAttributes: {
        Realm: 'realm',
        ADDomainJoinPassword: 'password1',
        ADDomainJoinUser: 'user',
        CrossRealmTrustPrincipalPassword: 'password2',
        KdcAdminPassword: 'password3',
      },
    },
  });
});

test('Create Cluster without Roles', () => {
  // WHEN
  const task = new EmrCreateCluster(stack, 'Task', {
    instances: {},
    name: 'Cluster',
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
          ':states:::elasticmapreduce:createCluster.sync',
        ],
      ],
    },
    End: true,
    Parameters: {
      Name: 'Cluster',
      Instances: {
        KeepJobFlowAliveWhenNoSteps: true,
      },
      VisibleToAllUsers: true,
      JobFlowRole: {
        Ref: 'TaskInstanceRoleB72072BF',
      },
      ServiceRole: {
        Ref: 'TaskServiceRoleBF55F61E',
      },
      AutoScalingRole: {
        Ref: 'TaskAutoScalingRoleD06F8423',
      },
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Principal: { Service: 'elasticmapreduce.amazonaws.com' },
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
        },
      ],
    },
  });

  // The stack renders the ec2.amazonaws.com Service principal id with a
  // Join to the URLSuffix
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Principal: {
            Service: 'ec2.amazonaws.com',
          },
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
        },
      ],
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Principal: { Service: 'elasticmapreduce.amazonaws.com' },
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
        },
        {
          Principal: { Service: 'application-autoscaling.amazonaws.com' },
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
        },
      ],
    },
  });
});

test('Create Cluster with AmazonElasticMapReduceRole managed policies', () => {
  // WHEN
  const app = new cdk.App({ context: { [ENABLE_EMR_SERVICE_POLICY_V2]: false } });
  const newStack = new cdk.Stack(app, 'NewStack');

  new EmrCreateCluster(newStack, 'Task', {
    instances: {},
    name: 'Cluster',
    integrationPattern: sfn.IntegrationPattern.RUN_JOB,
  });

  // THEN
  Template.fromStack(newStack).hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Principal: { Service: 'elasticmapreduce.amazonaws.com' },
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
        },
      ],
    },
    ManagedPolicyArns: [
      {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':iam::aws:policy/service-role/AmazonElasticMapReduceRole',
          ],
        ],
      },
    ],
  });
});

test('Create Cluster with AmazonEMRServicePolicy_v2 managed policies', () => {
  // WHEN
  const app = new cdk.App({ context: { [ENABLE_EMR_SERVICE_POLICY_V2]: true } });
  const newStack = new cdk.Stack(app, 'NewStack');

  const task = new EmrCreateCluster(newStack, 'Task', {
    instances: {},
    name: 'Cluster',
    integrationPattern: sfn.IntegrationPattern.RUN_JOB,
  });

  // THEN
  Template.fromStack(newStack).hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Principal: { Service: 'elasticmapreduce.amazonaws.com' },
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
        },
      ],
    },
    ManagedPolicyArns: [
      {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':iam::aws:policy/service-role/AmazonEMRServicePolicy_v2',
          ],
        ],
      },
    ],
  });

  expect(stack.resolve(task.toStateJson())).toEqual(expect.objectContaining({
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
      Tags: [{
        Key: 'for-use-with-amazon-emr-managed-policies',
        Value: 'true',
      }],
      VisibleToAllUsers: true,
      JobFlowRole: {
        Ref: 'TaskInstanceRoleB72072BF',
      },
      ServiceRole: {
        Ref: 'TaskServiceRoleBF55F61E',
      },
      AutoScalingRole: {
        Ref: 'TaskAutoScalingRoleD06F8423',
      },
      Instances: {
        KeepJobFlowAliveWhenNoSteps: true,
      },
    },
  }));
});

test('Create Cluster with Instances configuration', () => {
  // WHEN
  const task = new EmrCreateCluster(stack, 'Task', {
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
        availabilityZones: ['AvailabilityZone'],
      },
      serviceAccessSecurityGroup: 'ServiceAccessGroup',
      slaveInstanceType: 'SlaveInstanceType',
      terminationProtected: true,
    },
    clusterRole,
    name: 'Cluster',
    serviceRole,
    autoScalingRole,
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
          AvailabilityZones: ['AvailabilityZone'],
        },
        ServiceAccessSecurityGroup: 'ServiceAccessGroup',
        SlaveInstanceType: 'SlaveInstanceType',
        TerminationProtected: true,
      },
      VisibleToAllUsers: true,
      JobFlowRole: {
        Ref: 'ClusterRoleD9CA7471',
      },
      ServiceRole: {
        Ref: 'ServiceRole4288B192',
      },
      AutoScalingRole: {
        Ref: 'AutoScalingRole015ADA0A',
      },
    },
  });
});

test.each([
  [EmrCreateCluster.SpotAllocationStrategy.CAPACITY_OPTIMIZED, 'capacity-optimized'],
  [EmrCreateCluster.SpotAllocationStrategy.PRICE_CAPACITY_OPTIMIZED, 'price-capacity-optimized'],
  [EmrCreateCluster.SpotAllocationStrategy.LOWEST_PRICE, 'lowest-price'],
  [EmrCreateCluster.SpotAllocationStrategy.DIVERSIFIED, 'diversified'],
])('Create Cluster with InstanceFleet with allocation strategy %s for Spot instances', (strategy, expected) => {
  // WHEN
  const task = new EmrCreateCluster(stack, 'Task', {
    instances: {
      instanceFleets: [{
        instanceFleetType: EmrCreateCluster.InstanceRoleType.MASTER,
        instanceTypeConfigs: [{
          bidPrice: '1',
          configurations: [{
            classification: 'Classification',
            properties: {
              Key: 'Value',
            },
          }],
          ebsConfiguration: {
            ebsBlockDeviceConfigs: [{
              volumeSpecification: {
                iops: 1,
                volumeSize: cdk.Size.gibibytes(1),
                volumeType: EmrCreateCluster.EbsBlockDeviceVolumeType.STANDARD,
              },
              volumesPerInstance: 1,
            }],
            ebsOptimized: true,
          },
          instanceType: 'm5.xlarge',
          weightedCapacity: 1,
        }],
        launchSpecifications: {
          spotSpecification: {
            allocationStrategy: strategy,
            blockDurationMinutes: 1,
            timeoutAction: EmrCreateCluster.SpotTimeoutAction.TERMINATE_CLUSTER,
            timeout: cdk.Duration.minutes(5),
          },
        },
        name: 'Main',
        targetSpotCapacity: 1,
      }],
    },
    clusterRole,
    name: 'Cluster',
    serviceRole,
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
          ':states:::elasticmapreduce:createCluster',
        ],
      ],
    },
    End: true,
    Parameters: {
      Name: 'Cluster',
      Instances: {
        KeepJobFlowAliveWhenNoSteps: true,
        InstanceFleets: [{
          InstanceFleetType: 'MASTER',
          InstanceTypeConfigs: [{
            BidPrice: '1',
            Configurations: [{
              Classification: 'Classification',
              Properties: {
                Key: 'Value',
              },
            }],
            EbsConfiguration: {
              EbsBlockDeviceConfigs: [{
                VolumeSpecification: {
                  Iops: 1,
                  SizeInGB: 1,
                  VolumeType: 'standard',
                },
                VolumesPerInstance: 1,
              }],
              EbsOptimized: true,
            },
            InstanceType: 'm5.xlarge',
            WeightedCapacity: 1,
          }],
          LaunchSpecifications: {
            SpotSpecification: {
              AllocationStrategy: expected,
              BlockDurationMinutes: 1,
              TimeoutAction: 'TERMINATE_CLUSTER',
              TimeoutDurationMinutes: 5,
            },
          },
          Name: 'Main',
          TargetSpotCapacity: 1,
        }],
      },
      VisibleToAllUsers: true,
      JobFlowRole: {
        Ref: 'ClusterRoleD9CA7471',
      },
      ServiceRole: {
        Ref: 'ServiceRole4288B192',
      },
    },
  });
});

test('Create Cluster with InstanceFleet for Spot instances', () => {
  // WHEN
  const task = new EmrCreateCluster(stack, 'Task', {
    instances: {
      instanceFleets: [{
        instanceFleetType: EmrCreateCluster.InstanceRoleType.MASTER,
        instanceTypeConfigs: [{
          bidPrice: '1',
          configurations: [{
            classification: 'Classification',
            properties: {
              Key: 'Value',
            },
          }],
          ebsConfiguration: {
            ebsBlockDeviceConfigs: [{
              volumeSpecification: {
                iops: 1,
                volumeSize: cdk.Size.gibibytes(1),
                volumeType: EmrCreateCluster.EbsBlockDeviceVolumeType.STANDARD,
              },
              volumesPerInstance: 1,
            }],
            ebsOptimized: true,
          },
          instanceType: 'm5.xlarge',
          weightedCapacity: 1,
        }],
        launchSpecifications: {
          spotSpecification: {
            blockDurationMinutes: 1,
            timeoutAction: EmrCreateCluster.SpotTimeoutAction.TERMINATE_CLUSTER,
            timeout: cdk.Duration.minutes(5),
          },
        },
        name: 'Main',
        targetSpotCapacity: 1,
      }],
    },
    clusterRole,
    name: 'Cluster',
    serviceRole,
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
          ':states:::elasticmapreduce:createCluster',
        ],
      ],
    },
    End: true,
    Parameters: {
      Name: 'Cluster',
      Instances: {
        KeepJobFlowAliveWhenNoSteps: true,
        InstanceFleets: [{
          InstanceFleetType: 'MASTER',
          InstanceTypeConfigs: [{
            BidPrice: '1',
            Configurations: [{
              Classification: 'Classification',
              Properties: {
                Key: 'Value',
              },
            }],
            EbsConfiguration: {
              EbsBlockDeviceConfigs: [{
                VolumeSpecification: {
                  Iops: 1,
                  SizeInGB: 1,
                  VolumeType: 'standard',
                },
                VolumesPerInstance: 1,
              }],
              EbsOptimized: true,
            },
            InstanceType: 'm5.xlarge',
            WeightedCapacity: 1,
          }],
          LaunchSpecifications: {
            SpotSpecification: {
              BlockDurationMinutes: 1,
              TimeoutAction: 'TERMINATE_CLUSTER',
              TimeoutDurationMinutes: 5,
            },
          },
          Name: 'Main',
          TargetSpotCapacity: 1,
        }],
      },
      VisibleToAllUsers: true,
      JobFlowRole: {
        Ref: 'ClusterRoleD9CA7471',
      },
      ServiceRole: {
        Ref: 'ServiceRole4288B192',
      },
    },
  });
});

test('Create Cluster with InstanceFleet for On-Demand instances', () => {
  // WHEN
  const task = new EmrCreateCluster(stack, 'Task', {
    instances: {
      instanceFleets: [{
        instanceFleetType: EmrCreateCluster.InstanceRoleType.MASTER,
        instanceTypeConfigs: [{
          bidPrice: '1',
          configurations: [{
            classification: 'Classification',
            properties: {
              Key: 'Value',
            },
          }],
          ebsConfiguration: {
            ebsBlockDeviceConfigs: [{
              volumeSpecification: {
                iops: 1,
                volumeSize: cdk.Size.gibibytes(1),
                volumeType: EmrCreateCluster.EbsBlockDeviceVolumeType.STANDARD,
              },
              volumesPerInstance: 1,
            }],
            ebsOptimized: true,
          },
          instanceType: 'm5.xlarge',
          weightedCapacity: 1,
        }],
        launchSpecifications: {
          onDemandSpecification: {
            allocationStrategy: EmrCreateCluster.OnDemandAllocationStrategy.LOWEST_PRICE,
          },
        },
        name: 'Main',
        targetOnDemandCapacity: 1,
      }],
    },
    clusterRole,
    name: 'Cluster',
    serviceRole,
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
          ':states:::elasticmapreduce:createCluster',
        ],
      ],
    },
    End: true,
    Parameters: {
      Name: 'Cluster',
      Instances: {
        KeepJobFlowAliveWhenNoSteps: true,
        InstanceFleets: [{
          InstanceFleetType: 'MASTER',
          InstanceTypeConfigs: [{
            BidPrice: '1',
            Configurations: [{
              Classification: 'Classification',
              Properties: {
                Key: 'Value',
              },
            }],
            EbsConfiguration: {
              EbsBlockDeviceConfigs: [{
                VolumeSpecification: {
                  Iops: 1,
                  SizeInGB: 1,
                  VolumeType: 'standard',
                },
                VolumesPerInstance: 1,
              }],
              EbsOptimized: true,
            },
            InstanceType: 'm5.xlarge',
            WeightedCapacity: 1,
          }],
          LaunchSpecifications: {
            OnDemandSpecification: {
              AllocationStrategy: 'lowest-price',
            },
          },
          Name: 'Main',
          TargetOnDemandCapacity: 1,
        }],
      },
      VisibleToAllUsers: true,
      JobFlowRole: {
        Ref: 'ClusterRoleD9CA7471',
      },
      ServiceRole: {
        Ref: 'ServiceRole4288B192',
      },
    },
  });
});

test('Throws if timeout for Spot instances is less than 5 minutes', () => {
  // GIVEN
  const task = new EmrCreateCluster(stack, 'Task', {
    instances: {
      instanceFleets: [{
        instanceFleetType: EmrCreateCluster.InstanceRoleType.MASTER,
        launchSpecifications: {
          spotSpecification: {
            timeoutAction: EmrCreateCluster.SpotTimeoutAction.TERMINATE_CLUSTER,
            timeout: cdk.Duration.minutes(4),
          },
        },
        name: 'Main',
        targetSpotCapacity: 1,
      }],
    },
    clusterRole,
    name: 'Cluster',
    serviceRole,
    integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
  });

  // THEN
  expect(() => {
    task.toStateJson();
  }).toThrow(/timeout must be between 5 and 1440 minutes, got 4/);
});

test('Throws if timeout for Spot instances is greater than 1440 minutes', () => {
  // GIVEN
  const task = new EmrCreateCluster(stack, 'Task', {
    instances: {
      instanceFleets: [{
        instanceFleetType: EmrCreateCluster.InstanceRoleType.MASTER,
        launchSpecifications: {
          spotSpecification: {
            timeoutAction: EmrCreateCluster.SpotTimeoutAction.TERMINATE_CLUSTER,
            timeout: cdk.Duration.minutes(1441),
          },
        },
        name: 'Main',
        targetSpotCapacity: 1,
      }],
    },
    clusterRole,
    name: 'Cluster',
    serviceRole,
    integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
  });

  // THEN
  expect(() => {
    task.toStateJson();
  }).toThrow(/timeout must be between 5 and 1440 minutes, got 1441/);
});

test('Throws if timeoutDurationMinutes for Spot instances is less than 5 minutes', () => {
  // GIVEN
  const task = new EmrCreateCluster(stack, 'Task', {
    instances: {
      instanceFleets: [{
        instanceFleetType: EmrCreateCluster.InstanceRoleType.MASTER,
        launchSpecifications: {
          spotSpecification: {
            timeoutAction: EmrCreateCluster.SpotTimeoutAction.TERMINATE_CLUSTER,
            timeoutDurationMinutes: 4,
          },
        },
        name: 'Main',
        targetSpotCapacity: 1,
      }],
    },
    clusterRole,
    name: 'Cluster',
    serviceRole,
    integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
  });

  // THEN
  expect(() => {
    task.toStateJson();
  }).toThrow(/timeout must be between 5 and 1440 minutes, got 4/);
});

test('Throws if timeoutDurationMinutes for Spot instances is greater than 1440 minutes', () => {
  // GIVEN
  const task = new EmrCreateCluster(stack, 'Task', {
    instances: {
      instanceFleets: [{
        instanceFleetType: EmrCreateCluster.InstanceRoleType.MASTER,
        launchSpecifications: {
          spotSpecification: {
            timeoutAction: EmrCreateCluster.SpotTimeoutAction.TERMINATE_CLUSTER,
            timeoutDurationMinutes: 1441,
          },
        },
        name: 'Main',
        targetSpotCapacity: 1,
      }],
    },
    clusterRole,
    name: 'Cluster',
    serviceRole,
    integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
  });

  // THEN
  expect(() => {
    task.toStateJson();
  }).toThrow(/timeout must be between 5 and 1440 minutes, got 1441/);
});

test('Throws if neither timeout nor timeoutDurationMinutes is specified', () => {
  // GIVEN
  const task = new EmrCreateCluster(stack, 'Task', {
    instances: {
      instanceFleets: [{
        instanceFleetType: EmrCreateCluster.InstanceRoleType.MASTER,
        launchSpecifications: {
          spotSpecification: {
            timeoutAction: EmrCreateCluster.SpotTimeoutAction.TERMINATE_CLUSTER,
          },
        },
        name: 'Main',
        targetSpotCapacity: 1,
      }],
    },
    clusterRole,
    name: 'Cluster',
    serviceRole,
    integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
  });

  // THEN
  expect(() => {
    task.toStateJson();
  }).toThrow(/one of timeout and timeoutDurationMinutes must be specified/);
});

test('Throws if both timeout and timeoutDurationMinutes are specified', () => {
  // WHEN
  const task = new EmrCreateCluster(stack, 'Task', {
    instances: {
      instanceFleets: [{
        instanceFleetType: EmrCreateCluster.InstanceRoleType.MASTER,
        launchSpecifications: {
          spotSpecification: {
            timeoutAction: EmrCreateCluster.SpotTimeoutAction.TERMINATE_CLUSTER,
            timeout: cdk.Duration.minutes(5),
            timeoutDurationMinutes: 10,
          },
        },
        name: 'Main',
        targetSpotCapacity: 1,
      }],
    },
    clusterRole,
    name: 'Cluster',
    serviceRole,
    integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
  });

  // THEN
  expect(() => {
    task.toStateJson();
  }).toThrow(/one of timeout and timeoutDurationMinutes must be specified/);
});

test('Throws if both bidPrice and bidPriceAsPercentageOfOnDemandPrice are specified', () => {
  // GIVEN
  const task = new EmrCreateCluster(stack, 'Task', {
    instances: {
      instanceFleets: [{
        instanceFleetType: EmrCreateCluster.InstanceRoleType.MASTER,
        instanceTypeConfigs: [{
          bidPrice: '1',
          bidPriceAsPercentageOfOnDemandPrice: 1,
          instanceType: 'm5.xlarge',
        }],
        name: 'Main',
        targetSpotCapacity: 1,
      }],
    },
    clusterRole,
    name: 'Cluster',
    serviceRole,
    integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
  });

  // THEN
  expect(() => {
    task.toStateJson();
  }).toThrow(/Cannot specify both bidPrice and bidPriceAsPercentageOfOnDemandPrice/);
});

test('Throws if neither targetSpotCapacity nor targetOnDemandCapacity is specified', () => {
  // GIVEN
  const task = new EmrCreateCluster(stack, 'Task', {
    instances: {
      instanceFleets: [{
        instanceFleetType: EmrCreateCluster.InstanceRoleType.MASTER,
        name: 'Main',
      }],
    },
    clusterRole,
    name: 'Cluster',
    serviceRole,
    integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
  });

  // THEN
  expect(() => {
    task.toStateJson();
  }).toThrow(/At least one of targetSpotCapacity and targetOnDemandCapacity should be greater than 0/);
});

test('Throws if both targetSpotCapacity and targetOnDemandCapacity are specified for a master instance fleet', () => {
  // GIVEN
  const task = new EmrCreateCluster(stack, 'Task', {
    instances: {
      instanceFleets: [{
        instanceFleetType: EmrCreateCluster.InstanceRoleType.MASTER,
        name: 'Main',
        targetSpotCapacity: 1,
        targetOnDemandCapacity: 1,
      }],
    },
    clusterRole,
    name: 'Cluster',
    serviceRole,
    integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
  });

  // THEN
  expect(() => {
    task.toStateJson();
  }).toThrow(/For a master instance fleet, only one of targetSpotCapacity and targetOnDemandCapacity can be specified/);
});

test('Throws if a number other than 1 as targetSpotCapacity is specified for a master instance fleet', () => {
  // GIVEN
  const task = new EmrCreateCluster(stack, 'Task', {
    instances: {
      instanceFleets: [{
        instanceFleetType: EmrCreateCluster.InstanceRoleType.MASTER,
        name: 'Main',
        targetSpotCapacity: 2,
      }],
    },
    clusterRole,
    name: 'Cluster',
    serviceRole,
    integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
  });

  // THEN
  expect(() => {
    task.toStateJson();
  }).toThrow(/For a master instance fleet, targetSpotCapacity cannot be a number other than 1, got 2/);
});

test('Throws if a number other than 1 as targetOnDemandCapacity is specified for a master instance fleet', () => {
  // GIVEN
  const task = new EmrCreateCluster(stack, 'Task', {
    instances: {
      instanceFleets: [{
        instanceFleetType: EmrCreateCluster.InstanceRoleType.MASTER,
        name: 'Main',
        targetOnDemandCapacity: 2,
      }],
    },
    clusterRole,
    name: 'Cluster',
    serviceRole,
    integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
  });

  // THEN
  expect(() => {
    task.toStateJson();
  }).toThrow(/For a master instance fleet, targetOnDemandCapacity cannot be a number other than 1, got 2/);
});

test('Create Cluster with InstanceGroup', () => {
  // WHEN
  const task = new EmrCreateCluster(stack, 'Task', {
    instances: {
      instanceGroups: [{
        autoScalingPolicy: {
          constraints: {
            maxCapacity: 2,
            minCapacity: 1,
          },
          rules: [{
            action: {
              market: EmrCreateCluster.InstanceMarket.ON_DEMAND,
              simpleScalingPolicyConfiguration: {
                adjustmentType: EmrCreateCluster.ScalingAdjustmentType.CHANGE_IN_CAPACITY,
                coolDown: 1,
                scalingAdjustment: 1,
              },
            },
            description: 'Description',
            name: 'Name',
            trigger: {
              cloudWatchAlarmDefinition: {
                comparisonOperator: EmrCreateCluster.CloudWatchAlarmComparisonOperator.GREATER_THAN,
                dimensions: [{
                  key: 'Key',
                  value: 'Value',
                }],
                evaluationPeriods: 1,
                metricName: 'Name',
                namespace: 'Namespace',
                period: cdk.Duration.seconds(300),
                statistic: EmrCreateCluster.CloudWatchAlarmStatistic.AVERAGE,
                threshold: 1,
                unit: EmrCreateCluster.CloudWatchAlarmUnit.NONE,
              },
            },
          }, {
            action: {
              market: EmrCreateCluster.InstanceMarket.ON_DEMAND,
              simpleScalingPolicyConfiguration: {
                adjustmentType: EmrCreateCluster.ScalingAdjustmentType.CHANGE_IN_CAPACITY,
                coolDown: 1,
                scalingAdjustment: 1,
              },
            },
            description: 'Description',
            name: 'Name',
            trigger: {
              cloudWatchAlarmDefinition: {
                comparisonOperator: EmrCreateCluster.CloudWatchAlarmComparisonOperator.GREATER_THAN,
                dimensions: [{
                  key: 'Key',
                  value: 'Value',
                }],
                evaluationPeriods: 1,
                metricName: 'Name',
                namespace: 'Namespace',
                period: cdk.Duration.seconds(sfn.JsonPath.numberAt('$.CloudWatchPeriod')),
                statistic: EmrCreateCluster.CloudWatchAlarmStatistic.AVERAGE,
                threshold: 1,
                unit: EmrCreateCluster.CloudWatchAlarmUnit.NONE,
              },
            },
          }],
        },
        bidPrice: '1',
        configurations: [{
          classification: 'Classification',
          properties: {
            Key: 'Value',
          },
        }],
        ebsConfiguration: {
          ebsBlockDeviceConfigs: [{
            volumeSpecification: {
              iops: 1,
              volumeSize: cdk.Size.gibibytes(1),
              volumeType: EmrCreateCluster.EbsBlockDeviceVolumeType.STANDARD,
            },
            volumesPerInstance: 1,
          }],
          ebsOptimized: true,
        },
        instanceCount: 1,
        instanceRole: EmrCreateCluster.InstanceRoleType.MASTER,
        instanceType: 'm5.xlarge',
        market: EmrCreateCluster.InstanceMarket.ON_DEMAND,
        name: 'Name',
      }],
    },
    clusterRole,
    name: 'Cluster',
    serviceRole,
    autoScalingRole,
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
          ':states:::elasticmapreduce:createCluster',
        ],
      ],
    },
    End: true,
    Parameters: {
      Name: 'Cluster',
      Instances: {
        KeepJobFlowAliveWhenNoSteps: true,
        InstanceGroups: [{
          AutoScalingPolicy: {
            Constraints: {
              MaxCapacity: 2,
              MinCapacity: 1,
            },
            Rules: [{
              Action: {
                Market: 'ON_DEMAND',
                SimpleScalingPolicyConfiguration: {
                  AdjustmentType: 'CHANGE_IN_CAPACITY',
                  CoolDown: 1,
                  ScalingAdjustment: 1,
                },
              },
              Description: 'Description',
              Name: 'Name',
              Trigger: {
                CloudWatchAlarmDefinition: {
                  ComparisonOperator: 'GREATER_THAN',
                  Dimensions: [{
                    Key: 'Key',
                    Value: 'Value',
                  }],
                  EvaluationPeriods: 1,
                  MetricName: 'Name',
                  Namespace: 'Namespace',
                  Period: 300,
                  Statistic: 'AVERAGE',
                  Threshold: 1,
                  Unit: 'NONE',
                },
              },
            }, {
              Action: {
                Market: 'ON_DEMAND',
                SimpleScalingPolicyConfiguration: {
                  AdjustmentType: 'CHANGE_IN_CAPACITY',
                  CoolDown: 1,
                  ScalingAdjustment: 1,
                },
              },
              Description: 'Description',
              Name: 'Name',
              Trigger: {
                CloudWatchAlarmDefinition: {
                  'ComparisonOperator': 'GREATER_THAN',
                  'Dimensions': [{
                    Key: 'Key',
                    Value: 'Value',
                  }],
                  'EvaluationPeriods': 1,
                  'MetricName': 'Name',
                  'Namespace': 'Namespace',
                  'Period.$': '$.CloudWatchPeriod',
                  'Statistic': 'AVERAGE',
                  'Threshold': 1,
                  'Unit': 'NONE',
                },
              },
            }],
          },
          BidPrice: '1',
          Configurations: [{
            Classification: 'Classification',
            Properties: {
              Key: 'Value',
            },
          }],
          EbsConfiguration: {
            EbsBlockDeviceConfigs: [{
              VolumeSpecification: {
                Iops: 1,
                SizeInGB: 1,
                VolumeType: 'standard',
              },
              VolumesPerInstance: 1,
            }],
            EbsOptimized: true,
          },
          InstanceCount: 1,
          InstanceRole: 'MASTER',
          InstanceType: 'm5.xlarge',
          Market: 'ON_DEMAND',
          Name: 'Name',
        }],
      },
      VisibleToAllUsers: true,
      JobFlowRole: {
        Ref: 'ClusterRoleD9CA7471',
      },
      ServiceRole: {
        Ref: 'ServiceRole4288B192',
      },
      AutoScalingRole: {
        Ref: 'AutoScalingRole015ADA0A',
      },
    },
  });
});

test('Task throws if WAIT_FOR_TASK_TOKEN is supplied as service integration pattern', () => {
  expect(() => {
    new EmrCreateCluster(stack, 'Task', {
      instances: {},
      clusterRole,
      name: 'Cluster',
      serviceRole,
      autoScalingRole,
      integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
    });
  }).toThrow(/Unsupported service integration pattern. Supported Patterns: REQUEST_RESPONSE,RUN_JOB. Received: WAIT_FOR_TASK_TOKEN/);
});
