import { expect, haveResourceLike } from "@aws-cdk/assert";
import codedeploy = require('@aws-cdk/aws-codedeploy');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import cpactions = require('../../lib');

export = {
  'CodeDeploy ECS Deploy Action': {
    'throws an exception if more than 4 container image inputs are provided'(test: Test) {
      const stack = new cdk.Stack();
      const deploymentGroup = addEcsDeploymentGroup(stack);
      const artifact = new codepipeline.Artifact('Artifact');

      const containerImageInputs: cpactions.CodeDeployEcsContainerImageInput[] = [];
      for (let i = 0; i < 5; i++) {
        containerImageInputs.push({
          input: artifact
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
      }, /Action cannot have more than 4 container image inputs/);

      test.done();
    },

    'defaults task definition and appspec template paths'(test: Test) {
      const stack = new cdk.Stack();
      const deploymentGroup = addEcsDeploymentGroup(stack);
      addCodeDeployECSCodePipeline(stack, {
        actionName: 'DeployToECS',
        deploymentGroup,
        taskDefinitionTemplateInput: new codepipeline.Artifact('TaskDefArtifact'),
        appSpecTemplateInput: new codepipeline.Artifact('AppSpecArtifact')
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
                  AppSpecTemplatePath: 'appspec.yaml'
                },
                InputArtifacts: [
                  {
                    Name: 'TaskDefArtifact'
                  },
                  {
                    Name: 'AppSpecArtifact'
                  }
                ]
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
      const artifact1 = new codepipeline.Artifact('Artifact1');
      const artifact2 = new codepipeline.Artifact('Artifact2');
      addCodeDeployECSCodePipeline(stack, {
        actionName: 'DeployToECS',
        deploymentGroup,
        taskDefinitionTemplateInput: artifact1,
        taskDefinitionTemplatePath: 'task-definition.json',
        appSpecTemplateInput: artifact2,
        appSpecTemplatePath: 'appspec-test.yaml',
        containerImageInputs: [
          {
            input: artifact1
          },
          {
            input: artifact2
          }
        ]
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
                  TaskDefinitionTemplateArtifact: 'Artifact1',
                  AppSpecTemplateArtifact: 'Artifact2',
                  TaskDefinitionTemplatePath: 'task-definition.json',
                  AppSpecTemplatePath: 'appspec-test.yaml',
                  Image1ArtifactName: 'Artifact1',
                  Image1ContainerName: 'IMAGE',
                  Image2ArtifactName: 'Artifact2',
                  Image2ContainerName: 'IMAGE'
                },
                InputArtifacts: [
                  {
                    Name: 'Artifact1'
                  },
                  {
                    Name: 'Artifact2'
                  }
                ]
              },
            ],
          },
        ],
      }));

      test.done();
    },
  },
};

function addEcsDeploymentGroup(stack: cdk.Stack): codedeploy.IEcsDeploymentGroup {
  return codedeploy.EcsDeploymentGroup.fromEcsDeploymentGroupAttributes(
    stack, 'EDG', {
      application: codedeploy.EcsApplication.fromEcsApplicationName(
        stack, 'EA', 'MyApplication'
      ),
      deploymentGroupName: 'MyDeploymentGroup'
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
            output: props.taskDefinitionTemplateInput,
            oauthToken: cdk.SecretValue.plainText('secret'),
            owner: 'awslabs',
            repo: 'aws-cdk',
          }),
          new cpactions.GitHubSourceAction({
            actionName: 'GitHub2',
            output: props.appSpecTemplateInput,
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