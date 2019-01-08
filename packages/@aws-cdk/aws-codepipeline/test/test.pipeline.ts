import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import cloudformation = require('@aws-cdk/aws-cloudformation');
import codebuild = require('@aws-cdk/aws-codebuild');
import codecommit = require('@aws-cdk/aws-codecommit');
import iam = require( '@aws-cdk/aws-iam');
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
      outputArtifactName: 'SourceArtifact',
      repository,
    });

    const buildStage = new codepipeline.Stage(pipeline, 'build', { pipeline });
    const project = new codebuild.Project(stack, 'MyBuildProject', {
       source: new codebuild.CodePipelineSource()
    });
    new codebuild.PipelineBuildAction(stack, 'build', {
      stage: buildStage,
      inputArtifact: source.outputArtifact,
      project,
    });

    test.notDeepEqual(stack.toCloudFormation(), {});
    test.deepEqual([], pipeline.node.validateTree());
    test.done();
  },

  'github action uses ThirdParty owner'(test: Test) {
    const stack = new cdk.Stack();

    const secret = new cdk.SecretParameter(stack, 'GitHubToken', { ssmParameter: 'my-token' });

    const p = new codepipeline.Pipeline(stack, 'P');

    const role = iam.Role.import(stack, 'PipelineActionRole', {
      roleArn: 'arn:aws:iam::123456789012:root'
    });

    const s1 = new codepipeline.Stage(stack, 'Source', { pipeline: p });
    new codepipeline.GitHubSourceAction(stack, 'GH', {
      stage: s1,
      runOrder: 8,
      outputArtifactName: 'A',
      branch: 'branch',
      oauthToken: secret.value,
      owner: 'foo',
      repo: 'bar',
      role
    });

    const s2 = new codepipeline.Stage(stack, 'Two', { pipeline: p });
    new codepipeline.ManualApprovalAction(stack, 'Boo', { stage: s2 });

    expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
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
          "PollForSourceChanges": false
          },
          "InputArtifacts": [],
          "Name": "GH",
          "OutputArtifacts": [
          {
            "Name": "A"
          }
          ],
          "RunOrder": 8,
          "RoleArn": "arn:aws:iam::123456789012:root"
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

    test.deepEqual([], p.node.validateTree());
    test.done();
  },

  'onStateChange'(test: Test) {
    const stack = new cdk.Stack();

    const topic = new sns.Topic(stack, 'Topic');

    const pipeline = new codepipeline.Pipeline(stack, 'PL');

    const stage1 = new codepipeline.Stage(stack, 'S1', { pipeline });
    new s3.PipelineSourceAction(stack, 'A1', {
      stage: stage1,
      outputArtifactName: 'Artifact',
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
            "arn:",
            {
            "Ref": "AWS::Partition"
            },
            ":codepipeline:",
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

    test.deepEqual([], pipeline.node.validateTree());
    test.done();
  },

  'manual approval Action': {
    'allows passing an SNS Topic when constructing it'(test: Test) {
      const stack = new cdk.Stack();
      const topic = new sns.Topic(stack, 'Topic');
      const manualApprovalAction = new codepipeline.ManualApprovalAction(stack, 'Approve', {
        stage: stageForTesting(stack),
        notificationTopic: topic,
      });

      test.equal(manualApprovalAction.notificationTopic, topic);

      test.done();
    },
  },

  'PipelineProject': {
    'with a custom Project Name': {
      'sets the source and artifacts to CodePipeline'(test: Test) {
        const stack = new cdk.Stack();

        new codebuild.PipelineProject(stack, 'MyProject', {
          projectName: 'MyProject',
        });

        expect(stack).to(haveResourceLike('AWS::CodeBuild::Project', {
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

    const bucket = new s3.Bucket(stack, 'Bucket');
    const sourceStage = pipeline.addStage('Source');
    const source1 = bucket.addToPipeline(sourceStage, 'SourceAction1', {
      bucketKey: 'some/key',
      outputArtifactName: 'sourceArtifact1',
    });
    const source2 = bucket.addToPipeline(sourceStage, 'SourceAction2', {
      bucketKey: 'another/key',
      outputArtifactName: 'sourceArtifact2',
    });

    const role = iam.Role.import(stack, 'PipelineActionRole', {
      roleArn: 'arn:aws:iam::123456789012:root'
    });

    const stage = new codepipeline.Stage(stack, 'Stage', { pipeline });
    const lambdaAction = new lambda.PipelineInvokeAction(stack, 'InvokeAction', {
      stage,
      lambda: lambdaFun,
      userParameters: 'foo-bar/42',
      role,
      inputArtifacts: [
          source2.outputArtifact,
          source1.outputArtifact,
      ],
      outputArtifactNames: [
          'lambdaOutput1',
          'lambdaOutput2',
          'lambdaOutput3',
      ],
    });

    expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
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
          "Name": "Source",
        },
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
          "InputArtifacts": [
            { "Name": "sourceArtifact2" },
            { "Name": "sourceArtifact1" },
          ],
          "Name": "InvokeAction",
          "OutputArtifacts": [
            { "Name": "lambdaOutput1" },
            { "Name": "lambdaOutput2" },
            { "Name": "lambdaOutput3" },
          ],
          "RoleArn": "arn:aws:iam::123456789012:root",
          "RunOrder": 1
          }
        ],
        "Name": "Stage"
        }
      ]
    }));

    test.equal(lambdaAction.outputArtifacts().length, 3);
    test.notEqual(lambdaAction.outputArtifact('lambdaOutput2'), undefined);

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

  'CodeCommit Action': {
    'does not poll for changes by default'(test: Test) {
      const stack = new cdk.Stack();
      const sourceAction = new codecommit.PipelineSourceAction(stack, 'stage', {
        stage: stageForTesting(stack),
        outputArtifactName: 'SomeArtifact',
        repository: repositoryForTesting(stack),
      });

      test.equal(sourceAction.configuration.PollForSourceChanges, false);

      test.done();
    },

    'does not poll for source changes when explicitly set to false'(test: Test) {
      const stack = new cdk.Stack();
      const sourceAction = new codecommit.PipelineSourceAction(stack, 'stage', {
        stage: stageForTesting(stack),
        outputArtifactName: 'SomeArtifact',
        repository: repositoryForTesting(stack),
        pollForSourceChanges: false,
      });

      test.equal(sourceAction.configuration.PollForSourceChanges, false);

      test.done();
    },
  },

  'cross-region Pipeline': {
    'generates the required Action & ArtifactStores properties in the template'(test: Test) {
      const pipelineRegion = 'us-west-2';
      const pipelineAccount = '123';

      const app = new cdk.App();

      const stack = new cdk.Stack(app, 'TestStack', {
        env: {
          region: pipelineRegion,
          account: pipelineAccount,
        },
      });
      const bucket = new s3.Bucket(stack, 'MyBucket');
      const pipeline = new codepipeline.Pipeline(stack, 'MyPipeline', {
        crossRegionReplicationBuckets: {
          'us-west-1': 'sfo-replication-bucket',
        },
      });

      const stage1 = pipeline.addStage('Stage1');
      const sourceAction = bucket.addToPipeline(stage1, 'BucketSource', {
        bucketKey: '/some/key',
      });

      const stage2 = pipeline.addStage('Stage2');
      new cloudformation.PipelineCreateReplaceChangeSetAction(stack, 'Action1', {
        stage: stage2,
        changeSetName: 'ChangeSet',
        templatePath: sourceAction.outputArtifact.atPath('template.yaml'),
        stackName: 'SomeStack',
        region: pipelineRegion,
        adminPermissions: false,
      });
      new cloudformation.PipelineCreateUpdateStackAction(stack, 'Action2', {
        stage: stage2,
        templatePath: sourceAction.outputArtifact.atPath('template.yaml'),
        stackName: 'OtherStack',
        region: 'us-east-1',
        adminPermissions: false,
      });
      new cloudformation.PipelineExecuteChangeSetAction(stack, 'Action3', {
        stage: stage2,
        changeSetName: 'ChangeSet',
        stackName: 'SomeStack',
        region: 'us-west-1',
      });

      expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
        "ArtifactStores": [
          {
            "Region": "us-east-1",
            "ArtifactStore": {
              "Type": "S3",
            },
          },
          {
            "Region": "us-west-1",
            "ArtifactStore": {
              "Location": "sfo-replication-bucket",
              "Type": "S3",
            },
          },
          {
            "Region": "us-west-2",
            "ArtifactStore": {
              "Type": "S3",
            },
          },
        ],
        "Stages": [
          {
            "Name": "Stage1",
          },
          {
            "Name": "Stage2",
            "Actions": [
              {
                "Name": "Action1",
                "Region": "us-west-2",
              },
              {
                "Name": "Action2",
                "Region": "us-east-1",
              },
              {
                "Name": "Action3",
                "Region": "us-west-1",
              },
            ],
          },
        ]
      }));

      test.equal(pipeline.crossRegionScaffoldStacks[pipelineRegion], undefined);
      test.equal(pipeline.crossRegionScaffoldStacks['us-west-1'], undefined);

      const usEast1ScaffoldStack = pipeline.crossRegionScaffoldStacks['us-east-1'];
      test.notEqual(usEast1ScaffoldStack, undefined);
      test.equal(usEast1ScaffoldStack.env.region, 'us-east-1');
      test.equal(usEast1ScaffoldStack.env.account, pipelineAccount);
      test.ok(usEast1ScaffoldStack.node.id.indexOf('us-east-1') !== -1,
        `expected '${usEast1ScaffoldStack.node.id}' to contain 'us-east-1'`);

      test.done();
    },
  },
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
