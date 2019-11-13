import { expect, haveResourceLike, ResourcePart } from '@aws-cdk/assert';
import iam = require('@aws-cdk/aws-iam');
import kms = require('@aws-cdk/aws-kms');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import codepipeline = require('../lib');
import { FakeBuildAction } from './fake-build-action';
import { FakeSourceAction } from './fake-source-action';

// tslint:disable:object-literal-key-quotes

export = {
  'Pipeline': {
    'can be passed an IAM role during pipeline creation'(test: Test) {
      const stack = new cdk.Stack();
      const role = new iam.Role(stack, 'Role', {
        assumedBy: new iam.ServicePrincipal('codepipeline.amazonaws.com')
      });
      new codepipeline.Pipeline(stack, 'Pipeline', {
        role
      });

      expect(stack, true).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
        "RoleArn": {
          "Fn::GetAtt": [
            "Role1ABCC5F0",
            "Arn",
          ]
        }
      }));

      test.done();
    },

    'can be imported by ARN'(test: Test) {
      const stack = new cdk.Stack();

      const pipeline = codepipeline.Pipeline.fromPipelineArn(stack, 'Pipeline',
        'arn:aws:codepipeline:us-east-1:123456789012:MyPipeline');

      test.equal(pipeline.pipelineArn, 'arn:aws:codepipeline:us-east-1:123456789012:MyPipeline');
      test.equal(pipeline.pipelineName, 'MyPipeline');

      test.done();
    },

    'that is cross-region': {
      'validates that source actions are in the same account as the pipeline'(test: Test) {
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'PipelineStack', { env: { region: 'us-west-1', account: '123456789012' }});
        const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');
        const sourceStage = pipeline.addStage({
          stageName: 'Source',
        });
        const sourceAction = new FakeSourceAction({
          actionName: 'FakeSource',
          output: new codepipeline.Artifact(),
          region: 'ap-southeast-1',
        });

        test.throws(() => {
          sourceStage.addAction(sourceAction);
        }, /Source action 'FakeSource' must be in the same region as the pipeline/);

        test.done();
      },

      'allows passing an Alias in place of the KMS Key in the replication Bucket'(test: Test) {
        const app = new cdk.App();

        const replicationRegion = 'us-west-1';
        const replicationStack = new cdk.Stack(app, 'ReplicationStack', {
          env: { region: replicationRegion, account: '123456789012' },
        });
        const replicationKey = new kms.Key(replicationStack, 'ReplicationKey');
        const replicationAlias = replicationKey.addAlias('alias/my-replication-alias');
        const replicationBucket = new s3.Bucket(replicationStack, 'ReplicationBucket', {
          encryptionKey: replicationAlias,
          bucketName: cdk.PhysicalName.GENERATE_IF_NEEDED,
        });

        const pipelineRegion = 'us-west-2';
        const pipelineStack = new cdk.Stack(app, 'PipelineStack', {
          env: { region: pipelineRegion, account: '123456789012' },
        });
        const sourceOutput = new codepipeline.Artifact();
        new codepipeline.Pipeline(pipelineStack, 'Pipeline', {
          crossRegionReplicationBuckets: {
            [replicationRegion]: replicationBucket,
          },
          stages: [
            {
              stageName: 'Source',
              actions: [new FakeSourceAction({
                actionName: 'Source',
                output: sourceOutput,
              })],
            },
            {
              stageName: 'Build',
              actions: [new FakeBuildAction({
                actionName: 'Build',
                input: sourceOutput,
                region: replicationRegion,
              })],
            },
          ],
        });

        expect(pipelineStack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
          "ArtifactStores": [
            {
              "Region": replicationRegion,
              "ArtifactStore": {
                "Type": "S3",
                "EncryptionKey": {
                  "Type": "KMS",
                  "Id": {
                    "Fn::Join": [
                      "",
                      [
                        "arn:",
                        {
                          "Ref": "AWS::Partition",
                        },
                        ":kms:us-west-1:123456789012:alias/my-replication-alias",
                      ],
                    ],
                  },
                },
              },
            },
            {
              "Region": pipelineRegion,
            },
          ],
        }));

        expect(replicationStack).to(haveResourceLike('AWS::KMS::Key', {
          "KeyPolicy": {
            "Statement": [
              {
                // owning account management permissions - we don't care about them in this test
              },
              {
                // KMS verifies whether the principal given in its key policy exists when creating that key.
                // Since the replication bucket must be deployed before the pipeline,
                // we cannot put the pipeline role as the principal here -
                // hence, we put the account itself
                "Action": [
                  "kms:Decrypt",
                  "kms:DescribeKey",
                  "kms:Encrypt",
                  "kms:ReEncrypt*",
                  "kms:GenerateDataKey*",
                ],
                "Effect": "Allow",
                "Principal": {
                  "AWS": {
                    "Fn::Join": ["", [
                      "arn:",
                      { "Ref": "AWS::Partition" },
                      ":iam::123456789012:root",
                    ]],
                  },
                },
                "Resource": "*",
              },
            ],
          },
        }));

        test.done();
      },

      "generates ArtifactStores with the alias' ARN as the KeyID"(test: Test) {
        const app = new cdk.App();
        const replicationRegion = 'us-west-1';

        const pipelineRegion = 'us-west-2';
        const pipelineStack = new cdk.Stack(app, 'MyStack', {
          env: { region: pipelineRegion, account: '123456789012' },
        });
        const sourceOutput = new codepipeline.Artifact();
        const pipeline = new codepipeline.Pipeline(pipelineStack, 'Pipeline', {
          stages: [
            {
              stageName: 'Source',
              actions: [new FakeSourceAction({
                actionName: 'Source',
                output: sourceOutput,
              })],
            },
            {
              stageName: 'Build',
              actions: [new FakeBuildAction({
                actionName: 'Build',
                input: sourceOutput,
                region: replicationRegion,
              })],
            },
          ],
        });

        expect(pipelineStack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
          "ArtifactStores": [
            {
              "Region": replicationRegion,
              "ArtifactStore": {
                "Type": "S3",
                "EncryptionKey": {
                  "Type": "KMS",
                  "Id": {
                    "Fn::Join": [
                      "",
                      [
                        "arn:",
                        {
                          "Ref": "AWS::Partition",
                        },
                        ":kms:us-west-1:123456789012:alias/s-west-1tencryptionalias9b344b2b8e6825cb1f7d",
                      ],
                    ],
                  },
                },
              },
            },
            {
              "Region": pipelineRegion,
            },
          ],
        }));

        expect(pipeline.crossRegionSupport[replicationRegion].stack).to(haveResourceLike('AWS::KMS::Alias', {
          "DeletionPolicy": "Delete",
          "UpdateReplacePolicy": "Delete",
        }, ResourcePart.CompleteDefinition));

        test.done();
      },

      'allows passing an imported Bucket and Key for the replication Bucket'(test: Test) {
        const replicationRegion = 'us-west-1';

        const pipelineRegion = 'us-west-2';
        const pipelineStack = new cdk.Stack(undefined, undefined, {
          env: { region: pipelineRegion },
        });
        const sourceOutput = new codepipeline.Artifact();
        new codepipeline.Pipeline(pipelineStack, 'Pipeline', {
          crossRegionReplicationBuckets: {
            [replicationRegion]: s3.Bucket.fromBucketAttributes(pipelineStack, 'ReplicationBucket', {
              bucketArn: 'arn:aws:s3:::my-us-west-1-replication-bucket',
              encryptionKey: kms.Key.fromKeyArn(pipelineStack, 'ReplicationKey',
                `arn:aws:kms:${replicationRegion}:123456789012:key/1234-5678-9012`
              ),
            }),
          },
          stages: [
            {
              stageName: 'Source',
              actions: [new FakeSourceAction({
                actionName: 'Source',
                output: sourceOutput,
              })],
            },
            {
              stageName: 'Build',
              actions: [new FakeBuildAction({
                actionName: 'Build',
                input: sourceOutput,
              })],
            },
          ],
        });

        expect(pipelineStack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
          "ArtifactStores": [
            {
              "Region": replicationRegion,
              "ArtifactStore": {
                "Type": "S3",
                "Location": "my-us-west-1-replication-bucket",
                "EncryptionKey": {
                  "Type": "KMS",
                  "Id": "arn:aws:kms:us-west-1:123456789012:key/1234-5678-9012",
                },
              },
            },
            {
              "Region": pipelineRegion,
            },
          ],
        }));

        test.done();
      },
    },

    'that is cross-account': {
      'does not allow passing a dynamic value in the Action account property'(test: Test) {
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'PipelineStack', { env: { account: '123456789012' }});
        const sourceOutput = new codepipeline.Artifact();
        const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
          stages: [
            {
              stageName: 'Source',
              actions: [new FakeSourceAction({ actionName: 'Source', output: sourceOutput })],
            },
          ],
        });
        const buildStage = pipeline.addStage({ stageName: 'Build' });

        test.throws(() => {
          buildStage.addAction(new FakeBuildAction({
            actionName: 'FakeBuild',
            input: sourceOutput,
            account: cdk.Aws.ACCOUNT_ID,
          }));
        }, /The 'account' property must be a concrete value \(action: 'FakeBuild'\)/);

        test.done();
      },

      'does not allow an env-agnostic Pipeline Stack if an Action account has been provided'(test: Test) {
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'PipelineStack');
        const sourceOutput = new codepipeline.Artifact();
        const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
          stages: [
            {
              stageName: 'Source',
              actions: [new FakeSourceAction({ actionName: 'Source', output: sourceOutput })],
            },
          ],
        });
        const buildStage = pipeline.addStage({ stageName: 'Build' });

        test.throws(() => {
          buildStage.addAction(new FakeBuildAction({
            actionName: 'FakeBuild',
            input: sourceOutput,
            account: '123456789012',
          }));
        }, /Pipeline stack which uses cross-environment actions must have an explicitly set account/);

        test.done();
      },
    },
  },
};
