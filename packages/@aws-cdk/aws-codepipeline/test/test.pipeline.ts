import { expect, haveResource } from '@aws-cdk/assert';
import codebuild = require('@aws-cdk/aws-codebuild');
import codecommit = require('@aws-cdk/aws-codecommit');
import lambda = require('@aws-cdk/aws-lambda');
import s3 = require('@aws-cdk/aws-s3');
import sns = require('@aws-cdk/aws-sns');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import codepipeline = require('../lib');

// tslint:disable:object-literal-key-quotes

export = {
  'basic pipeline'(test: Test) {
    const stack = new cdk.Stack();

    const repository = new codecommit.Repository(stack, 'MyRepo', {
       repositoryName: 'my-repo',
    });

    const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');
    const sourceStage = new codepipeline.Stage(pipeline, 'source', { pipeline });
    const source = new codecommit.PipelineSourceAction(stack, 'source', {
      stage: sourceStage,
      artifactName: 'SourceArtifact',
      repository,
    });

    const buildStage = new codepipeline.Stage(pipeline, 'build', { pipeline });
    const project = new codebuild.Project(stack, 'MyBuildProject', {
       source: new codebuild.CodePipelineSource()
    });
    new codebuild.PipelineBuildAction(stack, 'build', {
      stage: buildStage,
      inputArtifact: source.artifact,
      project,
    });

    test.notDeepEqual(stack.toCloudFormation(), {});
    test.deepEqual([], pipeline.validate());
    test.done();
  },

  'github action uses ThirdParty owner'(test: Test) {
    const stack = new cdk.Stack();

    const secret = new cdk.SecretParameter(stack, 'GitHubToken', { ssmParameter: 'my-token' });

    const p = new codepipeline.Pipeline(stack, 'P');

    const s1 = new codepipeline.Stage(stack, 'Source', { pipeline: p });
    new codepipeline.GitHubSourceAction(stack, 'GH', {
      stage: s1,
      runOrder: 8,
      artifactName: 'A',
      branch: 'branch',
      oauthToken: secret.value,
      owner: 'foo',
      repo: 'bar'
    });

    const s2 = new codepipeline.Stage(stack, 'Two', { pipeline: p });
    new codepipeline.ManualApprovalAction(stack, 'Boo', { stage: s2 });

    expect(stack).to(haveResource('AWS::CodePipeline::Pipeline', {
      "ArtifactStore": {
      "Location": {
        "Ref": "PArtifactsBucket5E711C12"
      },
      "Type": "S3"
      },
      "RoleArn": {
      "Fn::GetAtt": [
        "PRole07BDC907",
        "Arn"
      ]
      },
      "Stages": [
      {
        "Actions": [
        {
          "ActionTypeId": {
          "Category": "Source",
          "Owner": "ThirdParty",
          "Provider": "GitHub",
          "Version": "1"
          },
          "Configuration": {
          "Owner": "foo",
          "Repo": "bar",
          "Branch": "branch",
          "OAuthToken": {
            "Ref": "GitHubTokenParameterBB166B9D"
          },
          "PollForSourceChanges": true
          },
          "InputArtifacts": [],
          "Name": "GH",
          "OutputArtifacts": [
          {
            "Name": "A"
          }
          ],
          "RunOrder": 8
        }
        ],
        "Name": "Source"
      },
      {
        "Actions": [
        {
          "ActionTypeId": {
          "Category": "Approval",
          "Owner": "AWS",
          "Provider": "Manual",
          "Version": "1"
          },
          "InputArtifacts": [],
          "Name": "Boo",
          "OutputArtifacts": [],
          "RunOrder": 1
        }
        ],
        "Name": "Two"
      }
      ]
    }));

    test.deepEqual([], p.validate());
    test.done();
  },

  'onStateChange'(test: Test) {
    const stack = new cdk.Stack();

    const topic = new sns.Topic(stack, 'Topic');

    const pipeline = new codepipeline.Pipeline(stack, 'PL');

    const stage1 = new codepipeline.Stage(stack, 'S1', { pipeline });
    new s3.PipelineSourceAction(stack, 'A1', {
      stage: stage1,
      artifactName: 'Artifact',
      bucket: new s3.Bucket(stack, 'Bucket'),
      bucketKey: 'Key'
    });

    const stage2 = new codepipeline.Stage(stack, 'S2', { pipeline });
    new codepipeline.ManualApprovalAction(stack, 'A2', { stage: stage2 });

    pipeline.onStateChange('OnStateChange', topic, {
      description: 'desc',
      scheduleExpression: 'now',
      eventPattern: {
        detail: {
          state: [ 'FAILED' ]
        }
      }
    });

    expect(stack).to(haveResource('AWS::Events::Rule', {
      "Description": "desc",
      "EventPattern": {
        "detail": {
        "state": [
          "FAILED"
        ]
        },
        "detail-type": [
        "CodePipeline Pipeline Execution State Change"
        ],
        "source": [
        "aws.codepipeline"
        ],
        "resources": [
        {
          "Fn::Join": [
          "",
          [
            "arn",
            ":",
            {
            "Ref": "AWS::Partition"
            },
            ":",
            "codepipeline",
            ":",
            {
            "Ref": "AWS::Region"
            },
            ":",
            {
            "Ref": "AWS::AccountId"
            },
            ":",
            {
            "Ref": "PLD5425AEA"
            }
          ]
          ]
        }
        ]
      },
      "ScheduleExpression": "now",
      "State": "ENABLED",
      "Targets": [
        {
        "Arn": {
          "Ref": "TopicBFC7AF6E"
        },
        "Id": "Topic"
        }
      ]
    }));

    test.deepEqual([], pipeline.validate());
    test.done();
  },

  'PipelineProject': {
    'with a custom Project Name': {
      'sets the source and artifacts to CodePipeline'(test: Test) {
        const stack = new cdk.Stack();

        new codebuild.PipelineProject(stack, 'MyProject', {
          projectName: 'MyProject',
        });

        expect(stack).to(haveResource('AWS::CodeBuild::Project', {
          "Name": "MyProject",
          "Source": {
          "Type": "CODEPIPELINE"
          },
          "Artifacts": {
          "Type": "CODEPIPELINE"
          },
          "ServiceRole": {
          "Fn::GetAtt": [
            "MyProjectRole9BBE5233",
            "Arn"
          ]
          },
          "Environment": {
          "Type": "LINUX_CONTAINER",
          "PrivilegedMode": false,
          "Image": "aws/codebuild/ubuntu-base:14.04",
          "ComputeType": "BUILD_GENERAL1_SMALL"
          }
        }));

        test.done();
      }
    }
  },

  'Lambda PipelineInvokeAction can be used to invoke Lambda functions from a CodePipeline'(test: Test) {
    const stack = new cdk.Stack();

    const lambdaFun = new lambda.Function(stack, 'Function', {
      code: new lambda.InlineCode('bla'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NodeJS43,
    });

    const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');

    // first stage must contain a Source action so we can't use it to test Lambda
    const stage = new codepipeline.Stage(stack, 'Stage', { pipeline });
    new lambda.PipelineInvokeAction(stack, 'InvokeAction', {
      stage,
      lambda: lambdaFun,
      userParameters: 'foo-bar/42'
    });

    expect(stack, /* skip validation */ true).to(haveResource('AWS::CodePipeline::Pipeline', {
      "ArtifactStore": {
        "Location": {
        "Ref": "PipelineArtifactsBucket22248F97"
        },
        "Type": "S3"
      },
      "RoleArn": {
        "Fn::GetAtt": [
        "PipelineRoleD68726F7",
        "Arn"
        ]
      },
      "Stages": [
        {
        "Actions": [
          {
          "ActionTypeId": {
            "Category": "Invoke",
            "Owner": "AWS",
            "Provider": "Lambda",
            "Version": "1"
          },
          "Configuration": {
            "FunctionName": {
            "Ref": "Function76856677"
            },
            "UserParameters": "foo-bar/42"
          },
          "InputArtifacts": [],
          "Name": "InvokeAction",
          "OutputArtifacts": [],
          "RunOrder": 1
          }
        ],
        "Name": "Stage"
        }
      ]
    }));

    expect(stack, /* skip validation */ true).to(haveResource('AWS::IAM::Policy', {
      "PolicyDocument": {
        "Statement": [
        {
          "Action": [
          "codepipeline:PutJobSuccessResult",
          "codepipeline:PutJobFailureResult"
          ],
          "Effect": "Allow",
          "Resource": "*"
        }
        ],
        "Version": "2012-10-17"
      },
      "PolicyName": "FunctionServiceRoleDefaultPolicy2F49994A",
      "Roles": [
        {
        "Ref": "FunctionServiceRole675BB04A"
        }
      ]
    }));

    test.done();
  },

  'polling for changes': {
    'does not poll for changes'(test: Test) {
      const stack = new cdk.Stack();

      const result = new codecommit.PipelineSourceAction(stack, 'stage', {
        stage: stageForTesting(stack),
        artifactName: 'SomeArtifact',
        repository: repositoryForTesting(stack),
        pollForSourceChanges: false,
      });
      test.equal(result.configuration.PollForSourceChanges, false);
      test.done();
    },

    'polls for changes'(test: Test) {
      const stack = new cdk.Stack();

      const result = new codecommit.PipelineSourceAction(stack, 'stage', {
        stage: stageForTesting(stack),
        artifactName: 'SomeArtifact',
        repository: repositoryForTesting(stack),
        pollForSourceChanges: true,
      });
      test.equal(result.configuration.PollForSourceChanges, true);
      test.done();
    }
  }
};

function stageForTesting(stack: cdk.Stack): codepipeline.Stage {
  const pipeline = new codepipeline.Pipeline(stack, 'pipeline');
  return new codepipeline.Stage(pipeline, 'stage', { pipeline });
}

function repositoryForTesting(stack: cdk.Stack): codecommit.Repository {
  return new codecommit.Repository(stack, 'Repository', {
    repositoryName: 'Repository'
  });
}
