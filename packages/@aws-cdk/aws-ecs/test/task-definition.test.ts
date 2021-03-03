import { expect, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import * as ecs from '../lib';
import * as iam from '@aws-cdk/aws-iam';

nodeunitShim({
  'When creating a new TaskDefinition': {
    'A task definition with both compatibilities defaults to networkmode AwsVpc'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      new ecs.TaskDefinition(stack, 'TD', {
        cpu: '512',
        memoryMiB: '512',
        compatibility: ecs.Compatibility.EC2_AND_FARGATE,
      });

      // THEN
      expect(stack).to(haveResource('AWS::ECS::TaskDefinition', {
        NetworkMode: 'awsvpc',
      }));

      test.done();
    },
  },

  'When importing from an existing Task definition': {
    'can import using a task definition arn'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinitionArn = 'TDArn';

      // WHEN
      const taskDefinition = ecs.TaskDefinition.fromTaskDefinitionArn(stack, 'TD_ID', taskDefinitionArn);

      // THEN
      test.equal(taskDefinition.taskDefinitionArn, taskDefinitionArn);
      test.equal(taskDefinition.compatibility, ecs.Compatibility.EC2_AND_FARGATE);
      test.equal(taskDefinition.executionRole, undefined);

      test.done();
    },

    'can import a Task Definition using attributes'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const expectTaskDefinitionArn = 'TD_ARN';
      const expectCompatibility = ecs.Compatibility.EC2;
      const expectNetworkMode = ecs.NetworkMode.AWS_VPC;
      const expectTaskRole = new iam.Role(stack, 'TaskRole', {
        assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      });

      // WHEN
      const taskDefinition = ecs.TaskDefinition.fromTaskDefinitionAttributes(stack, 'TD_ID', {
        taskDefinitionArn: expectTaskDefinitionArn,
        compatibility: expectCompatibility,
        networkMode: expectNetworkMode,
        taskRole: expectTaskRole,
      });

      // THEN
      test.equal(taskDefinition.taskDefinitionArn, expectTaskDefinitionArn);
      test.equal(taskDefinition.compatibility, expectCompatibility);
      test.equal(taskDefinition.executionRole, undefined);
      test.equal(taskDefinition.networkMode, expectNetworkMode);
      test.equal(taskDefinition.taskRole, expectTaskRole);

      test.done();
    },

    'returns an imported TaskDefinition that will throw an error when trying to access its yet to defined networkMode'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const expectTaskDefinitionArn = 'TD_ARN';
      const expectCompatibility = ecs.Compatibility.EC2;
      const expectTaskRole = new iam.Role(stack, 'TaskRole', {
        assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      });

      // WHEN
      const taskDefinition = ecs.TaskDefinition.fromTaskDefinitionAttributes(stack, 'TD_ID', {
        taskDefinitionArn: expectTaskDefinitionArn,
        compatibility: expectCompatibility,
        taskRole: expectTaskRole,
      });

      // THEN
      test.throws(() => {
        taskDefinition.networkMode;
      }, 'This operation requires the networkMode in ImportedTaskDefinition to be defined. ' +
        'Add the \'networkMode\' in ImportedTaskDefinitionProps to instantiate ImportedTaskDefinition');

      test.done();
    },

    'returns an imported TaskDefinition that will throw an error when trying to access its yet to defined taskRole'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const expectTaskDefinitionArn = 'TD_ARN';
      const expectCompatibility = ecs.Compatibility.EC2;
      const expectNetworkMode = ecs.NetworkMode.AWS_VPC;

      // WHEN
      const taskDefinition = ecs.TaskDefinition.fromTaskDefinitionAttributes(stack, 'TD_ID', {
        taskDefinitionArn: expectTaskDefinitionArn,
        compatibility: expectCompatibility,
        networkMode: expectNetworkMode,
      });

      // THEN
      test.throws(() => {
        taskDefinition.taskRole;
      }, 'This operation requires the taskRole in ImportedTaskDefinition to be defined. ' +
        'Add the \'taskRole\' in ImportedTaskDefinitionProps to instantiate ImportedTaskDefinition');

      test.done();
    },
  },
});
