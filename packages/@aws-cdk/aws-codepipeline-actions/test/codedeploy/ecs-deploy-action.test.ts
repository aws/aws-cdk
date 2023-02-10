import { Template } from '@aws-cdk/assertions';
import * as codedeploy from '@aws-cdk/aws-codedeploy';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as cdk from '@aws-cdk/core';
import * as cpactions from '../../lib';

describe('CodeDeploy ECS Deploy Action', () => {
  describe('CodeDeploy ECS Deploy Action', () => {
    test('throws an exception if more than 4 container image inputs are provided', () => {
      const stack = new cdk.Stack();
      const deploymentGroup = addEcsDeploymentGroup(stack);
      const artifact = new codepipeline.Artifact('Artifact');

      const containerImageInputs: cpactions.CodeDeployEcsContainerImageInput[] = [];
      for (let i = 0; i < 5; i++) {
        containerImageInputs.push({
          input: artifact,
        });
      }

      expect(() => {
        new cpactions.CodeDeployEcsDeployAction({
          actionName: 'DeployToECS',
          deploymentGroup,
          taskDefinitionTemplateInput: artifact,
          appSpecTemplateInput: artifact,
          containerImageInputs,
        });
      }).toThrow(/Action cannot have more than 4 container image inputs, got: 5/);


    });

    test('throws an exception if both appspec artifact input and file are specified', () => {
      const stack = new cdk.Stack();
      const deploymentGroup = addEcsDeploymentGroup(stack);
      const artifact = new codepipeline.Artifact('Artifact');
      const artifactPath = new codepipeline.ArtifactPath(artifact, 'hello');

      expect(() => {
        new cpactions.CodeDeployEcsDeployAction({
          actionName: 'DeployToECS',
          deploymentGroup,
          taskDefinitionTemplateInput: artifact,
          appSpecTemplateInput: artifact,
          appSpecTemplateFile: artifactPath,
        });
      }).toThrow(/Exactly one of 'appSpecTemplateInput' or 'appSpecTemplateFile' can be provided in the ECS CodeDeploy Action/);


    });

    test('throws an exception if neither appspec artifact input nor file are specified', () => {
      const stack = new cdk.Stack();
      const deploymentGroup = addEcsDeploymentGroup(stack);
      const artifact = new codepipeline.Artifact('Artifact');

      expect(() => {
        new cpactions.CodeDeployEcsDeployAction({
          actionName: 'DeployToECS',
          deploymentGroup,
          taskDefinitionTemplateInput: artifact,
        });
      }).toThrow(/Specifying one of 'appSpecTemplateInput' or 'appSpecTemplateFile' is required for the ECS CodeDeploy Action/);


    });

    test('throws an exception if both task definition artifact input and file are specified', () => {
      const stack = new cdk.Stack();
      const deploymentGroup = addEcsDeploymentGroup(stack);
      const artifact = new codepipeline.Artifact('Artifact');
      const artifactPath = new codepipeline.ArtifactPath(artifact, 'hello');

      expect(() => {
        new cpactions.CodeDeployEcsDeployAction({
          actionName: 'DeployToECS',
          deploymentGroup,
          taskDefinitionTemplateInput: artifact,
          taskDefinitionTemplateFile: artifactPath,
          appSpecTemplateInput: artifact,
        });
      }).toThrow(/Exactly one of 'taskDefinitionTemplateInput' or 'taskDefinitionTemplateFile' can be provided in the ECS CodeDeploy Action/);


    });

    test('throws an exception if neither task definition artifact input nor file are specified', () => {
      const stack = new cdk.Stack();
      const deploymentGroup = addEcsDeploymentGroup(stack);
      const artifact = new codepipeline.Artifact('Artifact');

      expect(() => {
        new cpactions.CodeDeployEcsDeployAction({
          actionName: 'DeployToECS',
          deploymentGroup,
          appSpecTemplateInput: artifact,
        });
      }).toThrow(/Specifying one of 'taskDefinitionTemplateInput' or 'taskDefinitionTemplateFile' is required for the ECS CodeDeploy Action/);


    });

    test('defaults task definition and appspec template paths', () => {
      const stack = new cdk.Stack();
      const deploymentGroup = addEcsDeploymentGroup(stack);
      addCodeDeployECSCodePipeline(stack, {
        actionName: 'DeployToECS',
        deploymentGroup,
        taskDefinitionTemplateInput: new codepipeline.Artifact('TaskDefArtifact'),
        appSpecTemplateInput: new codepipeline.Artifact('AppSpecArtifact'),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
        Stages: [
          {},
          {
            Actions: [
              {
                Configuration: {
                  ApplicationName: 'MyApplication',
                  DeploymentGroupName: 'MyDeploymentGroup',
                  TaskDefinitionTemplateArtifact: 'TaskDefArtifact',
                  AppSpecTemplateArtifact: 'AppSpecArtifact',
                  TaskDefinitionTemplatePath: 'taskdef.json',
                  AppSpecTemplatePath: 'appspec.yaml',
                },
                InputArtifacts: [
                  {
                    Name: 'TaskDefArtifact',
                  },
                  {
                    Name: 'AppSpecArtifact',
                  },
                ],
              },
            ],
          },
        ],
      });


    });

    test('defaults task definition placeholder string', () => {
      const stack = new cdk.Stack();
      const deploymentGroup = addEcsDeploymentGroup(stack);
      const artifact1 = new codepipeline.Artifact();
      const artifact2 = new codepipeline.Artifact();
      addCodeDeployECSCodePipeline(stack, {
        actionName: 'DeployToECS',
        deploymentGroup,
        taskDefinitionTemplateFile: artifact1.atPath('task-definition.json'),
        appSpecTemplateFile: artifact2.atPath('appspec-test.yaml'),
        containerImageInputs: [
          {
            input: artifact1,
          },
          {
            input: artifact2,
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
        Stages: [
          {},
          {
            Actions: [
              {
                Configuration: {
                  ApplicationName: 'MyApplication',
                  DeploymentGroupName: 'MyDeploymentGroup',
                  TaskDefinitionTemplateArtifact: 'Artifact_Source_GitHub',
                  AppSpecTemplateArtifact: 'Artifact_Source_GitHub2',
                  TaskDefinitionTemplatePath: 'task-definition.json',
                  AppSpecTemplatePath: 'appspec-test.yaml',
                  Image1ArtifactName: 'Artifact_Source_GitHub',
                  Image1ContainerName: 'IMAGE',
                  Image2ArtifactName: 'Artifact_Source_GitHub2',
                  Image2ContainerName: 'IMAGE',
                },
                InputArtifacts: [
                  {
                    Name: 'Artifact_Source_GitHub',
                  },
                  {
                    Name: 'Artifact_Source_GitHub2',
                  },
                ],
              },
            ],
          },
        ],
      });


    });
  });

  test('cross-account cross-region deployment has correct dependency between support stacks', () => {
    // GIVEN
    const stackEnv: cdk.Environment = { account: '111111111111', region: 'us-east-1' };
    const deployEnv: cdk.Environment = { account: '222222222222', region: 'us-east-2' };

    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Pipe', { env: stackEnv });
    const deploymentGroup = codedeploy.EcsDeploymentGroup.fromEcsDeploymentGroupAttributes(stack, 'Group', {
      application: codedeploy.EcsApplication.fromEcsApplicationArn(stack, 'Application',
        `arn:aws:codedeploy:${deployEnv.region}:${deployEnv.account}:application:MyApplication`),
      deploymentGroupName: 'MyGroup',
    });

    // WHEN
    addCodeDeployECSCodePipeline(stack, {
      actionName: 'DeployECS',
      deploymentGroup,
      taskDefinitionTemplateInput: new codepipeline.Artifact('Artifact'),
      appSpecTemplateInput: new codepipeline.Artifact('Artifact2'),
    });

    // THEN - dependency from region stack to account stack
    // (region stack has bucket, account stack has role)
    const asm = app.synth();

    const stacks = Object.fromEntries(asm.stacks.map(s => [s.stackName, s]));
    expect(Object.keys(stacks)).toContain('Pipe-support-us-east-2');
    expect(Object.keys(stacks)).toContain('Pipe-support-222222222222');

    expect(stacks['Pipe-support-us-east-2'].dependencies).toContain(stacks['Pipe-support-222222222222']);
  });
});

function addEcsDeploymentGroup(stack: cdk.Stack): codedeploy.IEcsDeploymentGroup {
  return codedeploy.EcsDeploymentGroup.fromEcsDeploymentGroupAttributes(
    stack, 'EDG', {
      application: codedeploy.EcsApplication.fromEcsApplicationName(
        stack, 'EA', 'MyApplication',
      ),
      deploymentGroupName: 'MyDeploymentGroup',
    });
}

function addCodeDeployECSCodePipeline(stack: cdk.Stack, props: cpactions.CodeDeployEcsDeployActionProps) {
  new codepipeline.Pipeline(stack, 'Pipeline', {
    stages: [
      {
        stageName: 'Source',
        actions: [
          new cpactions.GitHubSourceAction({
            actionName: 'GitHub',
            output: props.taskDefinitionTemplateInput || props.taskDefinitionTemplateFile!.artifact,
            oauthToken: cdk.SecretValue.unsafePlainText('secret'),
            owner: 'awslabs',
            repo: 'aws-cdk',
          }),
          new cpactions.GitHubSourceAction({
            actionName: 'GitHub2',
            output: props.appSpecTemplateInput || props.appSpecTemplateFile!.artifact,
            oauthToken: cdk.SecretValue.unsafePlainText('secret'),
            owner: 'awslabs',
            repo: 'aws-cdk-2',
          }),
        ],
      },
      {
        stageName: 'Invoke',
        actions: [
          new cpactions.CodeDeployEcsDeployAction(props),
        ],
      },
    ],
  });
}
