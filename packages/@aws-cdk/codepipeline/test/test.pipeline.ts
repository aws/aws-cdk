import { expect, haveResource } from '@aws-cdk/assert';
import { BuildProject, CodePipelineSource } from '@aws-cdk/codebuild';
import { Repository } from '@aws-cdk/codecommit';
import { SecretParameter, Stack } from '@aws-cdk/core';
import { Bucket } from '@aws-cdk/s3';
import { Topic } from '@aws-cdk/sns';
import { Test } from 'nodeunit';
import { AmazonS3Source, ApprovalAction, CodeBuildAction, CodeCommitSource, GitHubSource, Pipeline, Stage } from '../lib';

// tslint:disable:object-literal-key-quotes

export = {
    'basic pipeline'(test: Test) {

        const stack = new Stack();

        const repo = new Repository(stack, 'MyRepo', { repositoryName: 'my-repo' });

        const pipeline = new Pipeline(stack, 'Pipeline');
        const sourceStage = new Stage(pipeline, 'source');
        const source = new CodeCommitSource(sourceStage, 'source', {
            artifactName: 'SourceArtifact',
            repository: repo,
        });

        const buildStage = new Stage(pipeline, 'build');
        const project = new BuildProject(stack, 'MyBuildProject', { source: new CodePipelineSource() });

        new CodeBuildAction(buildStage, 'build', {
            project,
            inputArtifact: source.artifact
        });

        test.notDeepEqual(stack.toCloudFormation(), {});
        test.done();
    },

    'github action uses ThirdParty owner'(test: Test) {
        const stack = new Stack();

        const secret = new SecretParameter(stack, 'GitHubToken', { ssmParameter: 'my-token' });

        const p = new Pipeline(stack, 'P');

        new GitHubSource(new Stage(p, 'Source'), 'GH', {
            artifactName: 'A',
            branch: 'branch',
            oauthToken: secret,
            owner: 'foo',
            repo: 'bar'
        });

        new ApprovalAction(new Stage(p, 'Two'), 'Boo');

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

        test.done();
    },

    'onStateChange'(test: Test) {
        const stack = new Stack();

        const topic = new Topic(stack, 'Topic');

        const pipeline = new Pipeline(stack, 'PL');

        new AmazonS3Source(new Stage(pipeline, 'S1'), 'A1', { artifactName: 'Artifact', bucket: new Bucket(stack, 'Bucket'), bucketKey: 'Key' });
        new ApprovalAction(new Stage(pipeline, 'S2'), 'A2');

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
        test.done();
    }
};
