import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import { PipelineCreateReplaceChangeSetAction, PipelineCreateUpdateStackAction, PipelineExecuteChangeSetAction } from '@aws-cdk/aws-cloudformation';
import { CodePipelineBuildArtifacts, CodePipelineSource, PipelineBuildAction, Project } from '@aws-cdk/aws-codebuild';
import { PipelineSourceAction, Repository } from '@aws-cdk/aws-codecommit';
import cpapi = require('@aws-cdk/aws-codepipeline-api');
import { PolicyStatement, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Role } from '@aws-cdk/aws-iam';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import { Pipeline } from '../lib';

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

  const source = new PipelineSourceAction({
    actionName: 'source',
    outputArtifactName: 'SourceArtifact',
    repository: repo,
    pollForSourceChanges: true,
  });
  pipeline.addStage({
    name: 'source',
    actions: [source]
  });

  /** Build! */

  const buildArtifacts = new CodePipelineBuildArtifacts();
  const project = new Project(stack, 'MyBuildProject', {
    source: new CodePipelineSource(),
    artifacts: buildArtifacts,
  });

  const buildAction = new PipelineBuildAction({
    actionName: 'build',
    project,
    inputArtifact: source.outputArtifact,
    outputArtifactName: "OutputYo"
  });
  pipeline.addStage({
    name: 'build',
    actions: [buildAction],
  });

  /** Deploy! */

  // To execute a change set - yes, you probably do need *:* 🤷‍♀️
  changeSetExecRole.addToPolicy(new PolicyStatement().addAllResources().addAction("*"));

  const stackName = 'BrelandsStack';
  const changeSetName = 'MyMagicalChangeSet';
  pipeline.addStage({
    name: 'prod',
    actions: [
      new PipelineCreateReplaceChangeSetAction({
        actionName: 'BuildChangeSetProd',
        stackName,
        changeSetName,
        deploymentRole: changeSetExecRole,
        templatePath: new cpapi.ArtifactPath(buildAction.outputArtifact, 'template.yaml'),
        templateConfiguration: new cpapi.ArtifactPath(buildAction.outputArtifact, 'templateConfig.json'),
        adminPermissions: false,
      }),
      new PipelineExecuteChangeSetAction({
        actionName: 'ExecuteChangeSetProd',
        stackName,
        changeSetName,
      }),
    ],
  });

  expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
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
        "TemplatePath": "OutputYo::template.yaml",
        "TemplateConfiguration": "OutputYo::templateConfig.json"
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
  stack.deployStage.addAction(new PipelineCreateUpdateStackAction({
    actionName: 'CreateUpdate',
    stackName: 'MyStack',
    templatePath: stack.source.outputArtifact.atPath('template.yaml'),
    adminPermissions: true,
  }));

  const roleId = "PipelineDeployCreateUpdateRole515CB7D4";

  // THEN: Action in Pipeline has named IAM capabilities
  expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
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
      Version: '2012-10-17',
      Statement: [
        {
          Action: "*",
          Effect: 'Allow',
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
  stack.deployStage.addAction(new PipelineCreateUpdateStackAction({
    actionName: 'CreateUpdate',
    stackName: 'MyStack',
    templatePath: stack.source.outputArtifact.atPath('template.yaml'),
    outputFileName: 'CreateResponse.json',
    adminPermissions: false,
  }));

  // THEN: Action has output artifacts
  expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
    "Stages": [
    { "Name": "Source" /* don't care about the rest */ },
    {
      "Name": "Deploy",
      "Actions": [
      {
        "OutputArtifacts": [{"Name": "CreateUpdate_MyStack_Artifact"}],
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
  stack.deployStage.addAction(new PipelineCreateUpdateStackAction({
    actionName: 'CreateUpdate',
    stackName: 'MyStack',
    templatePath: stack.source.outputArtifact.atPath('template.yaml'),
    replaceOnFailure: true,
    adminPermissions: false,
  }));

  // THEN: Action has output artifacts
  expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
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

  'parameterOverrides are serialized as a string'(test: Test) {
  // GIVEN
  const stack = new TestFixture();

  // WHEN
  stack.deployStage.addAction(new PipelineCreateUpdateStackAction({
    actionName: 'CreateUpdate',
    stackName: 'MyStack',
    templatePath: stack.source.outputArtifact.atPath('template.yaml'),
    adminPermissions: false,
    parameterOverrides: {
    RepoName: stack.repo.repositoryName
    }
  }));

  // THEN
  expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
    "Stages": [
    { "Name": "Source" /* don't care about the rest */ },
    {
      "Name": "Deploy",
      "Actions": [
      {
        "Configuration": {
        "ParameterOverrides": { "Fn::Join": [ "", [
          "{\"RepoName\":\"",
          { "Fn::GetAtt": [ "MyVeryImportantRepo11BC3EBD", "Name" ] },
          "\"}"
        ]]}
        },
        "Name": "CreateUpdate",
      },
      ],
    }
    ]
  }));

  test.done();
  },

  'Action service role is passed to template'(test: Test) {
    const stack = new TestFixture();

    const importedRole = Role.import(stack, 'ImportedRole', {
      roleArn: 'arn:aws:iam::000000000000:role/action-role'
    });
    const freshRole = new Role(stack, 'FreshRole', {
      assumedBy: new ServicePrincipal('magicservice')
    });

    stack.deployStage.addAction(new PipelineExecuteChangeSetAction({
      actionName: 'ImportedRoleAction',
      role: importedRole,
      changeSetName: 'magicSet',
      stackName: 'magicStack',
    }));

    stack.deployStage.addAction(new PipelineExecuteChangeSetAction({
      actionName: 'FreshRoleAction',
      role: freshRole,
      changeSetName: 'magicSet',
      stackName: 'magicStack',
    }));

    expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
      "Stages": [
        {
          "Name": "Source" /* don't care about the rest */
        },
        {
          "Name": "Deploy",
          "Actions": [
            {
              "Name": "ImportedRoleAction",
              "RoleArn": "arn:aws:iam::000000000000:role/action-role"
            },
            {
              "Name": "FreshRoleAction",
              "RoleArn": {
                "Fn::GetAtt": [
                  "FreshRole472F6E18",
                  "Arn"
                ]
              }
            }
          ]
        }
      ]
    }));

    test.done();
  }
};

/**
 * A test stack with a half-prepared pipeline ready to add CloudFormation actions to
 */
class TestFixture extends cdk.Stack {
  public readonly pipeline: Pipeline;
  public readonly sourceStage: cpapi.IStage;
  public readonly deployStage: cpapi.IStage;
  public readonly repo: Repository;
  public readonly source: PipelineSourceAction;

  constructor() {
    super();

    this.pipeline = new Pipeline(this, 'Pipeline');
    this.sourceStage = this.pipeline.addStage({ name: 'Source' });
    this.deployStage = this.pipeline.addStage({ name: 'Deploy' });
    this.repo = new Repository(this, 'MyVeryImportantRepo', { repositoryName: 'my-very-important-repo' });
    this.source = new PipelineSourceAction({
      actionName: 'Source',
      outputArtifactName: 'SourceArtifact',
      repository: this.repo,
    });
    this.sourceStage.addAction(this.source);
    // this.pipeline = new Pipeline(this, 'Pipeline', {
    //   stages: [
    //       this.sourceStage.addAction(this.source),
    //       this.deployStage,
    //   ],
    // });
  }
}
