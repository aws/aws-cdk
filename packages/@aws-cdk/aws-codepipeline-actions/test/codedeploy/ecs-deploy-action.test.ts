import { expect, haveResourceLike } from '@aws-cdk/assert';
import * as codedeploy from '@aws-cdk/aws-codedeploy';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as cdk from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import * as cpactions from '../../lib';

nodeunitShim({
  'CodeDeploy ECS Deploy Action': {
    'throws an exception if more than 4 container image inputs are provided'(test: Test) {
      const stack = new cdk.Stack();
      const deploymentGroup = addEcsDeploymentGroup(stack);
      const artifact = new codepipeline.Artifact('Artifact');

      const containerImageInputs: cpactions.CodeDeployEcsContainerImageInput[] = [];
      for (let i = 0; i < 5; i++) {
        containerImageInputs.push({
          input: artifact,
        });
      }

      test.throws(() => {
        new cpactions.CodeDeployEcsDeployAction({
          actionName: 'DeployToECS',
          deploymentGroup,
          taskDefinitionTemplateInput: artifact,
          appSpecTemplateInput: artifact,
          containerImageInputs,
        });
      }, /Action cannot have more than 4 container image inputs, got: 5/);

      test.done();
    },

    'throws an exception if both appspec artifact input and file are specified'(test: Test) {
      const stack = new cdk.Stack();
      const deploymentGroup = addEcsDeploymentGroup(stack);
      const artifact = new codepipeline.Artifact('Artifact');
      const artifactPath = new codepipeline.ArtifactPath(artifact, 'hello');

      test.throws(() => {
        new cpactions.CodeDeployEcsDeployAction({
          actionName: 'DeployToECS',
          deploymentGroup,
          taskDefinitionTemplateInput: artifact,
          appSpecTemplateInput: artifact,
          appSpecTemplateFile: artifactPath,
        });
      }, /Exactly one of 'appSpecTemplateInput' or 'appSpecTemplateFile' can be provided in the ECS CodeDeploy Action/);

      test.done();
    },

    'throws an exception if neither appspec artifact input nor file are specified'(test: Test) {
      const stack = new cdk.Stack();
      const deploymentGroup = addEcsDeploymentGroup(stack);
      const artifact = new codepipeline.Artifact('Artifact');

      test.throws(() => {
        new cpactions.CodeDeployEcsDeployAction({
          actionName: 'DeployToECS',
          deploymentGroup,
          taskDefinitionTemplateInput: artifact,
        });
      }, /Specifying one of 'appSpecTemplateInput' or 'appSpecTemplateFile' is required for the ECS CodeDeploy Action/);

      test.done();
    },

    'throws an exception if both task definition artifact input and file are specified'(test: Test) {
      const stack = new cdk.Stack();
      const deploymentGroup = addEcsDeploymentGroup(stack);
      const artifact = new codepipeline.Artifact('Artifact');
      const artifactPath = new codepipeline.ArtifactPath(artifact, 'hello');

      test.throws(() => {
        new cpactions.CodeDeployEcsDeployAction({
          actionName: 'DeployToECS',
          deploymentGroup,
          taskDefinitionTemplateInput: artifact,
          taskDefinitionTemplateFile: artifactPath,
          appSpecTemplateInput: artifact,
        });
      }, /Exactly one of 'taskDefinitionTemplateInput' or 'taskDefinitionTemplateFile' can be provided in the ECS CodeDeploy Action/);

      test.done();
    },

    'throws an exception if neither task definition artifact input nor file are specified'(test: Test) {
      const stack = new cdk.Stack();
      const deploymentGroup = addEcsDeploymentGroup(stack);
      const artifact = new codepipeline.Artifact('Artifact');

      test.throws(() => {
        new cpactions.CodeDeployEcsDeployAction({
          actionName: 'DeployToECS',
          deploymentGroup,
          appSpecTemplateInput: artifact,
        });
      }, /Specifying one of 'taskDefinitionTemplateInput' or 'taskDefinitionTemplateFile' is required for the ECS CodeDeploy Action/);

      test.done();
    },

    'defaults task definition and appspec template paths'(test: Test) {
      const stack = new cdk.Stack();
      const deploymentGroup = addEcsDeploymentGroup(stack);
      addCodeDeployECSCodePipeline(stack, {
        actionName: 'DeployToECS',
        deploymentGroup,
        taskDefinitionTemplateInput: new codepipeline.Artifact('TaskDefArtifact'),
        appSpecTemplateInput: new codepipeline.Artifact('AppSpecArtifact'),
      });

      expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
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
      }));

      test.done();
    },

    'defaults task definition placeholder string'(test: Test) {
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

      expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
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
      }));

      test.done();
    },
  },
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
            oauthToken: cdk.SecretValue.plainText('secret'),
            owner: 'awslabs',
            repo: 'aws-cdk',
          }),
          new cpactions.GitHubSourceAction({
            actionName: 'GitHub2',
            output: props.appSpecTemplateInput || props.appSpecTemplateFile!.artifact,
            oauthToken: cdk.SecretValue.plainText('secret'),
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
