import { expect, haveResource } from '@aws-cdk/assert';
import { CodePipelineBuildArtifacts, CodePipelineSource, Project } from '@aws-cdk/aws-codebuild';
import { PipelineBuildAction } from '@aws-cdk/aws-codebuild-codepipeline';
import { Repository } from '@aws-cdk/aws-codecommit';
import { PipelineSource } from '@aws-cdk/aws-codecommit-codepipeline';
import { ArtifactPath, Pipeline, Stage } from '@aws-cdk/aws-codepipeline';
import { Role } from '@aws-cdk/aws-iam';
import cdk = require('@aws-cdk/cdk');
import { PolicyStatement, ServicePrincipal } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { CreateReplaceChangeSet, CreateUpdateStack, ExecuteChangeSet } from '../lib/pipeline-actions';

// tslint:disable:object-literal-key-quotes

export = {
  'CreateChangeSetAction can be used to make a change set from a CodePipeline'(test: Test) {
    const stack = new cdk.Stack();

    const pipeline = new Pipeline(stack, 'MagicPipeline');

    const changeSetExecRole = new Role(stack, 'ChangeSetRole', {
      assumedBy: new ServicePrincipal('cloudformation.amazonaws.com'),
    });

    /** Source! */
    const repo = new Repository(stack, 'MyVeryImportantRepo', { repositoryName: 'my-very-important-repo' });

    const sourceStage = new Stage(pipeline, 'source');

    const source = new PipelineSource(sourceStage, 'source', {
      artifactName: 'SourceArtifact',
      repository: repo,
    });

    /** Build! */

    const buildStage = new Stage(pipeline, 'build');
    const buildArtifacts = new CodePipelineBuildArtifacts();
    const project = new Project(stack, 'MyBuildProject', {
      source: new CodePipelineSource(),
      artifacts: buildArtifacts,
    });

    const buildAction = new PipelineBuildAction(buildStage, 'build', {
      project,
      inputArtifact: source.artifact,
      artifactName: "OutputYo"
    });

    /** Deploy! */

    // To execute a change set - yes, you probably do need *:* 🤷‍♀️
    changeSetExecRole.addToPolicy(new PolicyStatement().addAllResources().addAction("*"));

    const prodStage = new Stage(pipeline, 'prod');
    const stackName = 'BrelandsStack';
    const changeSetName = 'MyMagicalChangeSet';

    new CreateReplaceChangeSet(prodStage, 'BuildChangeSetProd', {
      stackName,
      changeSetName,
      role: changeSetExecRole,
      templatePath: new ArtifactPath(buildAction.artifact!, 'template.yaml'),
    });

    new ExecuteChangeSet(prodStage, 'ExecuteChangeSetProd', {
      stackName,
      changeSetName,
    });

    expect(stack).to(haveResource('AWS::CodePipeline::Pipeline', {
      "ArtifactStore": {
        "Location": {
          "Ref": "MagicPipelineArtifactsBucket212FE7BF"
        },
        "Type": "S3"
      }, "RoleArn": {
        "Fn::GetAtt": ["MagicPipelineRoleFB2BD6DE",
          "Arn"
        ]
      },
      "Stages": [{
        "Actions": [
          {
            "ActionTypeId": {
              "Category": "Source",
              "Owner": "AWS", "Provider": "CodeCommit", "Version": "1"
            },
            "Configuration": {
              "RepositoryName": {
                "Fn::GetAtt": [
                  "MyVeryImportantRepo11BC3EBD",
                  "Name"
                ]
              },
              "BranchName": "master",
              "PollForSourceChanges": true
            },
            "InputArtifacts": [],
            "Name": "source",
            "OutputArtifacts": [
              {
                "Name": "SourceArtifact"
              }
            ],
            "RunOrder": 1
          }
        ],
        "Name": "source"
      },
      {
        "Actions": [
          {
            "ActionTypeId": {
              "Category": "Build",
              "Owner": "AWS",
              "Provider": "CodeBuild",
              "Version": "1"
            },
            "Configuration": {
              "ProjectName": {
                "Ref": "MyBuildProject30DB9D6E"
              }
            },
            "InputArtifacts": [
              {
                "Name": "SourceArtifact"
              }
            ],
            "Name": "build",
            "OutputArtifacts": [
              {
                "Name": "OutputYo"
              }
            ],
            "RunOrder": 1
          }
        ],
        "Name": "build"
      },
      {
        "Actions": [
          {
            "ActionTypeId": {
              "Category": "Deploy",
              "Owner": "AWS",
              "Provider": "CloudFormation",
              "Version": "1"
            },
            "Configuration": {
              "ActionMode": "CHANGE_SET_REPLACE",
              "ChangeSetName": "MyMagicalChangeSet",
              "RoleArn": {
                "Fn::GetAtt": [
                  "ChangeSetRole0BCF99E6",
                  "Arn"
                ]
              },
              "StackName": "BrelandsStack",
              "TemplatePath": "OutputYo::template.yaml"
            },
            "InputArtifacts": [{"Name": "OutputYo"}],
            "Name": "BuildChangeSetProd",
            "OutputArtifacts": [],
            "RunOrder": 1
          },
          {
            "ActionTypeId": {
              "Category": "Deploy",
              "Owner": "AWS",
              "Provider": "CloudFormation",
              "Version": "1"
            },
            "Configuration": {
              "ActionMode": "CHANGE_SET_EXECUTE",
              "ChangeSetName": "MyMagicalChangeSet"
            },
            "InputArtifacts": [],
            "Name": "ExecuteChangeSetProd",
            "OutputArtifacts": [],
            "RunOrder": 1
          }
        ],
        "Name": "prod"
      }
      ]
    }));

    test.done();

  },

  'fullPermissions leads to admin role and full IAM capabilities'(test: Test) {
    // GIVEN
    const stack = new TestFixture();

    // WHEN
    new CreateUpdateStack(stack.deployStage, 'CreateUpdate', {
      stackName: 'MyStack',
      templatePath: stack.source.artifact.subartifact('template.yaml'),
      fullPermissions: true,
    });

    const roleId = "PipelineDeployCreateUpdateRole515CB7D4";

    // THEN: Action in Pipeline has named IAM capabilities
    expect(stack).to(haveResource('AWS::CodePipeline::Pipeline', {
      "Stages": [
        { "Name": "Source" /* don't care about the rest */ },
        {
          "Name": "Deploy",
          "Actions": [
            {
              "Configuration": {
                "Capabilities": "CAPABILITY_NAMED_IAM",
                "RoleArn": { "Fn::GetAtt": [ roleId, "Arn" ] },
                "ActionMode": "CREATE_UPDATE",
                "StackName": "MyStack",
                "TemplatePath": "SourceArtifact::template.yaml"
              },
              "InputArtifacts": [{"Name": "SourceArtifact"}],
              "Name": "CreateUpdate",
            },
          ],
        }
      ]
    }));

    // THEN: Role is created with full permissions
    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: "*",
            Resource: "*"
          }
        ],
      },
      Roles: [{ Ref: roleId }]
    }));

    test.done();
  },

  'outputFileName leads to creation of output artifact'(test: Test) {
    // GIVEN
    const stack = new TestFixture();

    // WHEN
    new CreateUpdateStack(stack.deployStage, 'CreateUpdate', {
      stackName: 'MyStack',
      templatePath: stack.source.artifact.subartifact('template.yaml'),
      outputFileName: 'CreateResponse.json',
    });

    // THEN: Action has output artifacts
    expect(stack).to(haveResource('AWS::CodePipeline::Pipeline', {
      "Stages": [
        { "Name": "Source" /* don't care about the rest */ },
        {
          "Name": "Deploy",
          "Actions": [
            {
              "OutputArtifacts": [{"Name": "DeployCreateUpdateArtifact"}],
              "Name": "CreateUpdate",
            },
          ],
        }
      ]
    }));

    test.done();
  },

  'replaceOnFailure switches action type'(test: Test) {
    // GIVEN
    const stack = new TestFixture();

    // WHEN
    new CreateUpdateStack(stack.deployStage, 'CreateUpdate', {
      stackName: 'MyStack',
      templatePath: stack.source.artifact.subartifact('template.yaml'),
      replaceOnFailure: true,
    });

    // THEN: Action has output artifacts
    expect(stack).to(haveResource('AWS::CodePipeline::Pipeline', {
      "Stages": [
        { "Name": "Source" /* don't care about the rest */ },
        {
          "Name": "Deploy",
          "Actions": [
            {
              "Configuration": {
                "ActionMode": "REPLACE_ON_FAILURE",
              },
              "Name": "CreateUpdate",
            },
          ],
        }
      ]
    }));

    test.done();
  },
};

/**
 * A test stack with a half-prepared pipeline ready to add CloudFormation actions to
 */
class TestFixture extends cdk.Stack {
  public readonly pipeline: Pipeline;
  public readonly sourceStage: Stage;
  public readonly deployStage: Stage;
  public readonly repo: Repository;
  public readonly source: PipelineSource;

  constructor() {
    super();

    this.pipeline = new Pipeline(this, 'Pipeline');
    this.sourceStage = new Stage(this.pipeline, 'Source');
    this.deployStage = new Stage(this.pipeline, 'Deploy');
    this.repo = new Repository(this, 'MyVeryImportantRepo', { repositoryName: 'my-very-important-repo' });
    this.source = new PipelineSource(this.sourceStage, 'Source', {
      artifactName: 'SourceArtifact',
      repository: this.repo,
    });
  }
}
