import { expect, haveResource, haveResourceLike, not, SynthUtils } from '@aws-cdk/assert';
import codebuild = require('@aws-cdk/aws-codebuild');
import codecommit = require('@aws-cdk/aws-codecommit');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import targets = require('@aws-cdk/aws-events-targets');
import lambda = require('@aws-cdk/aws-lambda');
import s3 = require('@aws-cdk/aws-s3');
import sns = require('@aws-cdk/aws-sns');
import { App, CfnParameter, SecretValue, Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import cpactions = require('../lib');

// tslint:disable:object-literal-key-quotes

export = {
  'basic pipeline'(test: Test) {
    const stack = new Stack();

    const repository = new codecommit.Repository(stack, 'MyRepo', {
       repositoryName: 'my-repo',
    });

    const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');
    const sourceOutput = new codepipeline.Artifact('SourceArtifact');
    const source = new cpactions.CodeCommitSourceAction({
      actionName: 'source',
      output: sourceOutput,
      repository,
    });
    pipeline.addStage({
      name: 'source',
      actions: [source],
    });

    const project = new codebuild.Project(stack, 'MyBuildProject', {
       source: new codebuild.CodePipelineSource()
    });
    pipeline.addStage({
      name: 'build',
      actions: [
        new cpactions.CodeBuildAction({
          actionName: 'build',
          input: sourceOutput,
          project,
        }),
      ],
    });

    test.notDeepEqual(SynthUtils.toCloudFormation(stack), {});
    test.deepEqual([], pipeline.node.validateTree());
    test.done();
  },

  'Tokens can be used as physical names of the Pipeline'(test: Test) {
    const stack = new Stack(undefined, 'StackName');

    new codepipeline.Pipeline(stack, 'Pipeline', {
      pipelineName: stack.stackName,
    });

    expect(stack, true).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
      "Name": {
        "Ref": "AWS::StackName",
      },
    }));

    test.done();
  },

  'pipeline with GitHub source with poll trigger'(test: Test) {
    const stack = new Stack();

    const secret = new CfnParameter(stack, 'GitHubToken', { type: 'String', default: 'my-token' });

    const p = new codepipeline.Pipeline(stack, 'P');

    p.addStage({
      name: 'Source',
      actions: [
        new cpactions.GitHubSourceAction({
          actionName: 'GH',
          runOrder: 8,
          output: new codepipeline.Artifact('A'),
          branch: 'branch',
          oauthToken: SecretValue.plainText(secret.stringValue),
          owner: 'foo',
          repo: 'bar',
          trigger: cpactions.GitHubTrigger.Poll
        }),
      ],
    });

    p.addStage({
      name: 'Two',
      actions: [
        new cpactions.ManualApprovalAction({ actionName: 'Boo' }),
      ],
    });

    expect(stack).to(not(haveResourceLike('AWS::CodePipeline::Webhook')));

    expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
      "Stages": [
      {
        "Actions": [
          {
            "Configuration": {
              "PollForSourceChanges": true
            },
            "Name": "GH"
          }
        ],
        "Name": "Source"
      },
      {
        "Actions": [
          {
            "Name": "Boo",
          }
        ],
        "Name": "Two"
      }
      ]
    }));

    test.done();
  },

  'pipeline with GitHub source without triggers'(test: Test) {
    const stack = new Stack();

    const secret = new CfnParameter(stack, 'GitHubToken', { type: 'String', default: 'my-token' });

    const p = new codepipeline.Pipeline(stack, 'P');

    p.addStage({
      name: 'Source',
      actions: [
        new cpactions.GitHubSourceAction({
          actionName: 'GH',
          runOrder: 8,
          output: new codepipeline.Artifact('A'),
          branch: 'branch',
          oauthToken: SecretValue.plainText(secret.stringValue),
          owner: 'foo',
          repo: 'bar',
          trigger: cpactions.GitHubTrigger.None
        }),
      ],
    });

    p.addStage({
      name: 'Two',
      actions: [
        new cpactions.ManualApprovalAction({ actionName: 'Boo' }),
      ],
    });

    expect(stack).to(not(haveResourceLike('AWS::CodePipeline::Webhook')));

    expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
      "Stages": [
      {
        "Actions": [
          {
            "Configuration": {
              "PollForSourceChanges": false
            },
            "Name": "GH"
          }
        ],
        "Name": "Source"
      },
      {
        "Actions": [
          {
            "Name": "Boo",
          }
        ],
        "Name": "Two"
      }
      ]
    }));

    test.done();
  },

  'github action uses ThirdParty owner'(test: Test) {
    const stack = new Stack();

    const secret = new CfnParameter(stack, 'GitHubToken', { type: 'String', default: 'my-token' });

    const p = new codepipeline.Pipeline(stack, 'P');

    p.addStage({
      name: 'Source',
      actions: [
        new cpactions.GitHubSourceAction({
          actionName: 'GH',
          runOrder: 8,
          output: new codepipeline.Artifact('A'),
          branch: 'branch',
          oauthToken: SecretValue.plainText(secret.stringValue),
          owner: 'foo',
          repo: 'bar'
        }),
      ],
    });

    p.addStage({
      name: 'Two',
      actions: [
        new cpactions.ManualApprovalAction({ actionName: 'Boo' }),
      ],
    });

    expect(stack).to(haveResourceLike('AWS::CodePipeline::Webhook'));

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
            "Ref": "GitHubToken"
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

    test.deepEqual([], p.node.validateTree());
    test.done();
  },

  'onStateChange'(test: Test) {
    const stack = new Stack();

    const topic = new sns.Topic(stack, 'Topic');

    const pipeline = new codepipeline.Pipeline(stack, 'PL');

    pipeline.addStage({
      name: 'S1',
      actions: [
        new cpactions.S3SourceAction({
          actionName: 'A1',
          output: new codepipeline.Artifact('Artifact'),
          bucket: new s3.Bucket(stack, 'Bucket'),
          bucketKey: 'Key'
        }),
      ],
    });

    pipeline.addStage({
      name: 'S2',
      actions: [
        new cpactions.ManualApprovalAction({ actionName: 'A2' }),
      ],
    });

    pipeline.onStateChange('OnStateChange', new targets.SnsTopic(topic), {
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
      const stack = new Stack();
      const topic = new sns.Topic(stack, 'Topic');
      const manualApprovalAction = new cpactions.ManualApprovalAction({
        actionName: 'Approve',
        notificationTopic: topic,
      });
      stageForTesting(stack).addAction(manualApprovalAction);

      test.equal(manualApprovalAction.notificationTopic, topic);

      test.done();
    },
  },

  'PipelineProject': {
    'with a custom Project Name': {
      'sets the source and artifacts to CodePipeline'(test: Test) {
        const stack = new Stack();

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
          "Image": "aws/codebuild/standard:1.0",
          "ComputeType": "BUILD_GENERAL1_SMALL"
          }
        }));

        test.done();
      }
    }
  },

  'Lambda PipelineInvokeAction can be used to invoke Lambda functions from a CodePipeline'(test: Test) {
    const stack = new Stack();

    const lambdaFun = new lambda.Function(stack, 'Function', {
      code: new lambda.InlineCode('bla'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NodeJS43,
    });

    const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');

    const bucket = new s3.Bucket(stack, 'Bucket');
    const source1Output = new codepipeline.Artifact('sourceArtifact1');
    const source1 = new cpactions.S3SourceAction({
      actionName: 'SourceAction1',
      bucketKey: 'some/key',
      output: source1Output,
      bucket,
    });
    const source2Output = new codepipeline.Artifact('sourceArtifact2');
    const source2 = new cpactions.S3SourceAction({
      actionName: 'SourceAction2',
      bucketKey: 'another/key',
      output: source2Output,
      bucket,
    });
    pipeline.addStage({
      name: 'Source',
      actions: [
        source1,
        source2,
      ],
    });

    const lambdaAction = new cpactions.LambdaInvokeAction({
      actionName: 'InvokeAction',
      lambda: lambdaFun,
      userParameters: 'foo-bar/42',
      inputs: [
          source2Output,
          source1Output,
      ],
      outputs: [
          new codepipeline.Artifact('lambdaOutput1'),
          new codepipeline.Artifact('lambdaOutput2'),
          new codepipeline.Artifact('lambdaOutput3'),
      ],
    });
    pipeline.addStage({
      name: 'Stage',
      actions: [lambdaAction],
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
          "RunOrder": 1
          }
        ],
        "Name": "Stage"
        }
      ]
    }));

    test.equal(lambdaAction.outputs.length, 3);

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
      const stack = new Stack();
      const sourceAction = new cpactions.CodeCommitSourceAction({
        actionName: 'stage',
        output: new codepipeline.Artifact('SomeArtifact'),
        repository: repositoryForTesting(stack),
      });

      test.equal(sourceAction.configuration.PollForSourceChanges, false);

      test.done();
    },

    'does not poll for source changes when explicitly set to false'(test: Test) {
      const stack = new Stack();
      const sourceAction = new cpactions.CodeCommitSourceAction({
        actionName: 'stage',
        output: new codepipeline.Artifact('SomeArtifact'),
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

      const app = new App();

      const stack = new Stack(app, 'TestStack', {
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

      const sourceOutput = new codepipeline.Artifact('SourceOutput');
      const sourceAction = new cpactions.S3SourceAction({
        actionName: 'BucketSource',
        bucketKey: '/some/key',
        output: sourceOutput,
        bucket,
      });
      pipeline.addStage({
        name: 'Stage1',
        actions: [sourceAction],
      });

      pipeline.addStage({
        name: 'Stage2',
        actions: [
          new cpactions.CloudFormationCreateReplaceChangeSetAction({
            actionName: 'Action1',
            changeSetName: 'ChangeSet',
            templatePath: sourceOutput.atPath('template.yaml'),
            stackName: 'SomeStack',
            region: pipelineRegion,
            adminPermissions: false,
          }),
          new cpactions.CloudFormationCreateUpdateStackAction({
            actionName: 'Action2',
            templatePath: sourceOutput.atPath('template.yaml'),
            stackName: 'OtherStack',
            region: 'us-east-1',
            adminPermissions: false,
          }),
          new cpactions.CloudFormationExecuteChangeSetAction({
            actionName: 'Action3',
            changeSetName: 'ChangeSet',
            stackName: 'SomeStack',
            region: 'us-west-1',
          }),
        ],
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

  'Pipeline.fromPipelineArn'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const pl = codepipeline.Pipeline.fromPipelineArn(stack, 'imported', 'arn:aws:codepipeline:us-east-1:123456789012:MyDemoPipeline');

    // THEN
    test.deepEqual(pl.pipelineArn, 'arn:aws:codepipeline:us-east-1:123456789012:MyDemoPipeline');
    test.deepEqual(pl.pipelineName, 'MyDemoPipeline');
    test.done();
  }
};

function stageForTesting(stack: Stack): codepipeline.IStage {
  const pipeline = new codepipeline.Pipeline(stack, 'pipeline');
  return pipeline.addStage({ name: 'stage' });
}

function repositoryForTesting(stack: Stack): codecommit.Repository {
  return new codecommit.Repository(stack, 'Repository', {
    repositoryName: 'Repository'
  });
}
