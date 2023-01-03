import { Template } from '@aws-cdk/assertions';
import * as ecr from '@aws-cdk/aws-ecr';
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

    test('A task definition creates the correct policy for grantRun', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const role = new iam.Role(stack, 'Role', {
        assumedBy: new iam.AccountRootPrincipal(),
      });
      const taskDef = new ecs.TaskDefinition(stack, 'TD', {
        cpu: '512',
        memoryMiB: '512',
        compatibility: ecs.Compatibility.EC2_AND_FARGATE,
      });
      taskDef.grantRun(role);

      // THEN
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: 'iam:PassRole',
              Effect: 'Allow',
              Resource: {
                'Fn::GetAtt': [
                  'TDTaskRoleC497AFFC',
                  'Arn',
                ],
              },
            },
            {
              Action: 'ecs:RunTask',
              Effect: 'Allow',
              Resource: {
                Ref: 'TD49C78F36',
              },
            },
          ],
          Version: '2012-10-17',
        },
      });
    });

    test('A task definition with executionRole creates the correct policy for grantRun', () => {
      // GIVEN
      const stack = new cdk.Stack();

      const role = new iam.Role(stack, 'Role', {
        assumedBy: new iam.AccountRootPrincipal(),
      });
      const executionRole = new iam.Role(stack, 'ExecutionRole', {
        assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      });
      const taskDef = new ecs.TaskDefinition(stack, 'TD', {
        cpu: '512',
        memoryMiB: '512',
        compatibility: ecs.Compatibility.EC2_AND_FARGATE,
        executionRole: executionRole,
      });
      taskDef.grantRun(role);

      // THEN
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: 'iam:PassRole',
              Effect: 'Allow',
              Resource: [
                {
                  'Fn::GetAtt': [
                    'TDTaskRoleC497AFFC',
                    'Arn',
                  ],
                },
                {
                  'Fn::GetAtt': [
                    'ExecutionRole605A040B',
                    'Arn',
                  ],
                },
              ],
            },
            {
              Action: 'ecs:RunTask',
              Effect: 'Allow',
              Resource: {
                Ref: 'TD49C78F36',
              },
            },
          ],
          Version: '2012-10-17',
        },
      });
    });

    test('A task definition creates the correct policy for grantRun with ContainerDefinition added late', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const role = new iam.Role(stack, 'Role', {
        assumedBy: new iam.AccountRootPrincipal(),
      });
      const repo = ecr.Repository.fromRepositoryAttributes(
        stack, 'Repo', {
          repositoryArn: 'arn:aws:ecr:us-east-1:012345678901:repository/repo',
          repositoryName: 'repo',
        },
      );
      const taskDef = new ecs.TaskDefinition(stack, 'TD', {
        cpu: '512',
        memoryMiB: '512',
        compatibility: ecs.Compatibility.EC2_AND_FARGATE,
      });
      // Creates policy statement before executionRole is defined
      taskDef.grantRun(role);
      // Defines executionRole
      taskDef.addContainer('ECRContainer', {
        image: ecs.ContainerImage.fromEcrRepository(repo),
        memoryLimitMiB: 2048,
      });

      // THEN
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: 'iam:PassRole',
              Effect: 'Allow',
              Resource: [
                {
                  'Fn::GetAtt': [
                    'TDTaskRoleC497AFFC',
                    'Arn',
                  ],
                },
                {
                  'Fn::GetAtt': [
                    'TDExecutionRole88C96BCD',
                    'Arn',
                  ],
                },
              ],
            },
            {
              Action: 'ecs:RunTask',
              Effect: 'Allow',
              Resource: {
                Ref: 'TD49C78F36',
              },
            },
          ],
          Version: '2012-10-17',
        },
      });
    });

    test('A task definition where multiple containers have a port mapping with the same name throws an error', () =>{
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');

      new ecs.ContainerDefinition(stack, 'Container', {
        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
        taskDefinition,
        memoryLimitMiB: 2048,
        portMappings: [{
          containerPort: 80,
          name: 'api',
        }],
      });
      new ecs.ContainerDefinition(stack, 'Container2', {
        taskDefinition,
        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
        memoryLimitMiB: 2048,
        portMappings: [{
          containerPort: 8080,
          name: 'api',
        }],
      });

      // THEN
      expect(() => {
        Template.fromStack(stack);
      }).toThrow("Port mapping name 'api' cannot appear in both 'Container2' and 'Container'");
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
