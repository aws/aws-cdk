import iam = require('@aws-cdk/aws-iam');
import sfn = require('@aws-cdk/aws-stepfunctions');
import cdk = require('@aws-cdk/core');
import tasks = require('../lib');

let stack: cdk.Stack;
let role: iam.Role;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
  role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('elasticmapreduce.amazonaws.com')
  });
});

test('Create Cluster with FIRE_AND_FORGET integrationPattern', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', { task: new tasks.EmrCreateCluster({
      clusterConfiguration: sfn.TaskInput.fromObject({
        Name: 'Cluster'
      }),
      clusterRoles: [role],
      integrationPattern: sfn.ServiceIntegrationPattern.FIRE_AND_FORGET
  }) });

  // THEN
  expect(stack.resolve(task.toStateJson())).toEqual({
    Type: 'Task',
    Resource: {
      "Fn::Join": [
        "",
        [
          "arn:",
          {
            Ref: "AWS::Partition",
          },
          ":states:::elasticmapreduce:createCluster",
        ],
      ],
    },
    End: true,
    Parameters: {
      Name: 'Cluster'
    },
  });
});

test('Create Cluster with SYNC integrationPattern', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', { task: new tasks.EmrCreateCluster({
      clusterConfiguration: sfn.TaskInput.fromObject({
        Name: 'Cluster'
      }),
      clusterRoles: [role],
      integrationPattern: sfn.ServiceIntegrationPattern.SYNC
  }) });

  // THEN
  expect(stack.resolve(task.toStateJson())).toEqual({
    Type: 'Task',
    Resource: {
      "Fn::Join": [
        "",
        [
          "arn:",
          {
            Ref: "AWS::Partition",
          },
          ":states:::elasticmapreduce:createCluster.sync",
        ],
      ],
    },
    End: true,
    Parameters: {
      Name: 'Cluster'
    },
  });
});

test('Create Cluster with clusterConfiguration Name from payload', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', { task: new tasks.EmrCreateCluster({
      clusterConfiguration: sfn.TaskInput.fromObject({
        Name: sfn.TaskInput.fromDataAt('$.ClusterName').value
      }),
      clusterRoles: [role],
      integrationPattern: sfn.ServiceIntegrationPattern.FIRE_AND_FORGET
  }) });

  // THEN
  expect(stack.resolve(task.toStateJson())).toEqual({
    Type: 'Task',
    Resource: {
      "Fn::Join": [
        "",
        [
          "arn:",
          {
            Ref: "AWS::Partition",
          },
          ":states:::elasticmapreduce:createCluster",
        ],
      ],
    },
    End: true,
    Parameters: {
      'Name.$': '$.ClusterName'
    },
  });
});

test('Task throws if WAIT_FOR_TASK_TOKEN is supplied as service integration pattern', () => {
  expect(() => {
    new sfn.Task(stack, 'Task', {
      task: new tasks.EmrCreateCluster({
        clusterConfiguration: sfn.TaskInput.fromObject({}),
        clusterRoles: [role],
        integrationPattern: sfn.ServiceIntegrationPattern.WAIT_FOR_TASK_TOKEN
      })
    });
  }).toThrow(/Invalid Service Integration Pattern: WAIT_FOR_TASK_TOKEN is not supported to call CreateCluster./i);
});

test('Task throws if clusterRoles has length 0', () => {
  expect(() => {
    new sfn.Task(stack, 'Task', {
      task: new tasks.EmrCreateCluster({
        clusterConfiguration: sfn.TaskInput.fromObject({}),
        clusterRoles: []
      })
    });
  }).toThrow(/The property clusterRoles must have length greater than 0./i);
});