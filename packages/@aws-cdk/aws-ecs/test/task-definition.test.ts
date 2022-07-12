import { Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as ecs from '../lib';

describe('task definition', () => {
  describe('When creating a new TaskDefinition', () => {
    test('A task definition with EC2 and Fargate compatibilities defaults to networkmode AwsVpc', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      new ecs.TaskDefinition(stack, 'TD', {
        cpu: '512',
        memoryMiB: '512',
        compatibility: ecs.Compatibility.EC2_AND_FARGATE,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
        NetworkMode: 'awsvpc',
      });


    });

    test('A task definition with External compatibility defaults to networkmode Bridge', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      new ecs.TaskDefinition(stack, 'TD', {
        cpu: '512',
        memoryMiB: '512',
        compatibility: ecs.Compatibility.EXTERNAL,
      });

      //THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
        NetworkMode: 'bridge',
      });
    });
  });

  describe('When importing from an existing Task definition', () => {
    test('can import using a task definition arn', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinitionArn = 'TDArn';

      // WHEN
      const taskDefinition = ecs.TaskDefinition.fromTaskDefinitionArn(stack, 'TD_ID', taskDefinitionArn);

      // THEN
      expect(taskDefinition.taskDefinitionArn).toEqual(taskDefinitionArn);
      expect(taskDefinition.compatibility).toEqual(ecs.Compatibility.EC2_AND_FARGATE);
      expect(taskDefinition.executionRole).toEqual(undefined);


    });

    test('can import a Task Definition using attributes', () => {
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
      expect(taskDefinition.taskDefinitionArn).toEqual(expectTaskDefinitionArn);
      expect(taskDefinition.compatibility).toEqual(expectCompatibility);
      expect(taskDefinition.executionRole).toEqual(undefined);
      expect(taskDefinition.networkMode).toEqual(expectNetworkMode);
      expect(taskDefinition.taskRole).toEqual(expectTaskRole);


    });

    test('returns an imported TaskDefinition that will throw an error when trying to access its yet to defined networkMode', () => {
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
      expect(() => {
        taskDefinition.networkMode;
      }).toThrow('This operation requires the networkMode in ImportedTaskDefinition to be defined. ' +
        'Add the \'networkMode\' in ImportedTaskDefinitionProps to instantiate ImportedTaskDefinition');


    });

    test('returns an imported TaskDefinition that will throw an error when trying to access its yet to defined taskRole', () => {
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
      expect(() => {
        taskDefinition.taskRole;
      }).toThrow('This operation requires the taskRole in ImportedTaskDefinition to be defined. ' +
        'Add the \'taskRole\' in ImportedTaskDefinitionProps to instantiate ImportedTaskDefinition');


    });
  });
});
