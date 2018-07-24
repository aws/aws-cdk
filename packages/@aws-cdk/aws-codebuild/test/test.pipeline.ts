import { expect, haveResource } from '@aws-cdk/assert';
import codecommit = require('@aws-cdk/aws-codecommit');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import s3 = require('@aws-cdk/aws-s3');
import sns = require('@aws-cdk/aws-sns');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import { BuildProject, CodePipelineSource, PipelineBuildAction } from '../lib';

// tslint:disable:object-literal-key-quotes

export = {
    'basic pipeline'(test: Test) {

        const stack = new cdk.Stack();

        const repo = new codecommit.Repository(stack, 'MyRepo', { repositoryName: 'my-repo' });

        const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');
        const sourceStage = new codepipeline.Stage(pipeline, 'source');
        const source = new codecommit.PipelineSource(sourceStage, 'source', {
            artifactName: 'SourceArtifact',
            repository: repo,
        });

        const buildStage = new codepipeline.Stage(pipeline, 'build');
        const project = new BuildProject(stack, 'MyBuildProject', { source: new CodePipelineSource() });

        new PipelineBuildAction(buildStage, 'build', {
            project,
            inputArtifact: source.artifact
        });

        test.notDeepEqual(stack.toCloudFormation(), {});
        test.deepEqual([], pipeline.validate());
        test.done();
    },

    'github action uses ThirdParty owner'(test: Test) {
        const stack = new cdk.Stack();

        const secret = new cdk.SecretParameter(stack, 'GitHubToken', { ssmParameter: 'my-token' });

        const p = new codepipeline.Pipeline(stack, 'P');

        new codepipeline.GitHubSource(new codepipeline.Stage(p, 'Source'), 'GH', {
            artifactName: 'A',
            branch: 'branch',
            oauthToken: secret,
            owner: 'foo',
            repo: 'bar'
        });

        new codepipeline.ApprovalAction(new codepipeline.Stage(p, 'Two'), 'Boo');

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
                  "RunOrder": 1
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

        new codepipeline.AmazonS3Source(new codepipeline.Stage(pipeline, 'S1'), 'A1', {
          artifactName: 'Artifact',
          bucket: new s3.Bucket(stack, 'Bucket'),
          bucketKey: 'Key'
        });
        new codepipeline.ApprovalAction(new codepipeline.Stage(pipeline, 'S2'), 'A2');

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
    }
};
