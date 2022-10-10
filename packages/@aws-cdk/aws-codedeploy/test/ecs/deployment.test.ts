import { Template } from '@aws-cdk/assertions';
import * as ecs from '@aws-cdk/aws-ecs';
import * as cdk from '@aws-cdk/core';
import * as codedeploy from '../../lib';

describe('CodeDeploy ECS Deployment', () => {
  test('can be created with default configuration', () => {
    const stack = new cdk.Stack();
    const arn = 'taskdefarn';
    const taskDefinition = ecs.FargateTaskDefinition.fromFargateTaskDefinitionArn(stack, 'taskdef', arn);
    const deploymentGroup = codedeploy.EcsDeploymentGroup.fromEcsDeploymentGroupAttributes(stack, 'MyDG', {
      application: codedeploy.EcsApplication.fromEcsApplicationName(stack, 'MyApp', 'TestApp'),
      deploymentGroupName: 'MyDG',
    });
    const appspec = new codedeploy.EcsAppSpec({
      taskDefinition,
      containerName: 'testContainer',
      containerPort: 80,
    });
    new codedeploy.EcsDeployment({
      deploymentGroup,
      appspec,
    });

    Template.fromStack(stack).hasResource('Custom::EcsDeployment', {
      Properties: {
        applicationName: 'TestApp',
        deploymentConfigName: 'CodeDeployDefault.ECSAllAtOnce',
        deploymentGroupName: 'MyDG',
        autoRollbackConfigurationEnabled: 'false',
        autoRollbackConfigurationEvents: '',
        revisionAppSpecContent: appspec.toString(),
      },
    });

    Template.fromStack(stack).hasResource('AWS::Lambda::Function', {
      Properties: {
        FunctionName: 'EcsDeploymentProvider-TestApp-MyDG-onEvent',
        Timeout: 60,
        Runtime: 'nodejs16.x',
        Handler: 'index.handler',
      },
    });

    Template.fromStack(stack).hasResource('AWS::Lambda::Function', {
      Properties: {
        FunctionName: 'EcsDeploymentProvider-TestApp-MyDG-isComplete',
        Timeout: 60,
        Runtime: 'nodejs16.x',
        Handler: 'index.handler',
      },
    });

    Template.fromStack(stack).hasResource('AWS::Lambda::Function', {
      Properties: {
        FunctionName: 'EcsDeploymentProvider-TestApp-MyDG-provider',
      },
    });

  });

  test('can be created with autorollback configuration', () => {
    const stack = new cdk.Stack();
    const arn = 'taskdefarn';
    const taskDefinition = ecs.FargateTaskDefinition.fromFargateTaskDefinitionArn(stack, 'taskdef', arn);
    const deploymentGroup = codedeploy.EcsDeploymentGroup.fromEcsDeploymentGroupAttributes(stack, 'MyDG', {
      application: codedeploy.EcsApplication.fromEcsApplicationName(stack, 'MyApp', 'TestApp'),
      deploymentGroupName: 'MyDG',
    });
    const appspec = new codedeploy.EcsAppSpec({
      taskDefinition,
      containerName: 'testContainer',
      containerPort: 80,
    });
    new codedeploy.EcsDeployment({
      deploymentGroup,
      appspec,
      description: 'test deployment',
      autoRollback: {
        deploymentInAlarm: true,
        failedDeployment: true,
        stoppedDeployment: true,
      },
    });

    Template.fromStack(stack).hasResource('Custom::EcsDeployment', {
      Properties: {
        applicationName: 'TestApp',
        deploymentConfigName: 'CodeDeployDefault.ECSAllAtOnce',
        deploymentGroupName: 'MyDG',
        autoRollbackConfigurationEnabled: 'true',
        autoRollbackConfigurationEvents: 'DEPLOYMENT_STOP_ON_ALARM,DEPLOYMENT_FAILURE,DEPLOYMENT_STOP_ON_REQUEST',
        description: 'test deployment',
        revisionAppSpecContent: appspec.toString(),
      },
    });
  });

});
