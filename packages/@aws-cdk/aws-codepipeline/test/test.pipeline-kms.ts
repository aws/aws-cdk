import { expect, haveResourceLike } from '@aws-cdk/assert';
import cloudformation = require('@aws-cdk/aws-cloudformation');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import codepipeline = require('../lib');

// tslint:disable:object-literal-key-quotes

export = {
  'Pipeline artifacts KMS support': {
    'KMS key is used in output artifacts (cross region)'(test: Test) {
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
        artifactsStore: new codepipeline.ArtifactsStore(stack, 'PipelineDefaultStore', {
          encryptionMaterialArn: `arn:aws:kms:us-west-2:111122223333:alias/pipeline-bucket-alias`
        }),
        crossRegionArtifactsStores: {
          'us-west-1': new codepipeline.ImportedArtifactsStore(stack, 'Imported-us-west-1', {
            bucketName: 'sfo-replication-bucket',
            encryptionMaterialArn: `arn:aws:kms:us-west-1:111122223333:alias/sfo-replication-bucket-alias`
          })
        }
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
        region: 'us-west-2',
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
            "Region": "us-west-2",
            "ArtifactStore": {
              "Location": {
                "Ref": "PipelineDefaultStoreBucket6B583860"
              },
              "Type": "S3",
              "EncryptionKey": {
                "Type": "KMS",
                "Id": "arn:aws:kms:us-west-2:111122223333:alias/pipeline-bucket-alias"
              }
            }
          },
          {
            "Region": "us-west-1",
            "ArtifactStore": {
              "Location": "sfo-replication-bucket",
              "Type": "S3",
              "EncryptionKey": {
                "Type": "KMS",
                "Id": "arn:aws:kms:us-west-1:111122223333:alias/sfo-replication-bucket-alias"
              }
            }
          }
        ]
      }));

      // No scaffold stacks should be generated
      test.equal(pipeline.crossRegionScaffoldStacks[pipelineRegion], undefined);
      test.equal(pipeline.crossRegionScaffoldStacks['us-west-1'], undefined);

      test.equal(pipeline.artifactsStores['us-west-1'].encryptionMaterialArn,
        'arn:aws:kms:us-west-1:111122223333:alias/sfo-replication-bucket-alias');
      test.equal(pipeline.artifactsStores['us-west-2'], undefined);

      test.done();
    },
    'KMS key is used in output artifacts (single region)'(test: Test) {
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
        artifactsStore: new codepipeline.ArtifactsStore(stack, 'PipelineDefaultStore', {
          encryptionMaterialArn: `arn:aws:kms:us-west-2:111122223333:alias/pipeline-bucket-alias`
        })
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
        adminPermissions: false,
      });

      expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
        "ArtifactStores": [
          {
            "Region": "us-west-2",
            "ArtifactStore": {
              "Location": {
                "Ref": "PipelineDefaultStoreBucket6B583860"
              },
              "Type": "S3",
              "EncryptionKey": {
                "Type": "KMS",
                "Id": "arn:aws:kms:us-west-2:111122223333:alias/pipeline-bucket-alias"
              }
            }
          }
        ]
      }));

      // No scaffold stacks should be generated
      test.equal(pipeline.crossRegionScaffoldStacks[pipelineRegion], undefined);
      test.equal(pipeline.crossRegionScaffoldStacks['us-west-1'], undefined);

      test.equal(pipeline.artifactsStores['us-west-1'], undefined);
      test.equal(pipeline.artifactsStores['us-west-2'], undefined);

      test.equal(pipeline.artifactsStore.encryptionMaterialArn, 'arn:aws:kms:us-west-2:111122223333:alias/pipeline-bucket-alias');
      test.done();
    },
    'KMS key is used in output artifacts (no region)'(test: Test) {
      const pipelineAccount = '123';

      const app = new cdk.App();

      const stack = new cdk.Stack(app, 'TestStack', {
        env: {
          account: pipelineAccount,
        },
      });
      const bucket = new s3.Bucket(stack, 'MyBucket');
      const pipeline = new codepipeline.Pipeline(stack, 'MyPipeline', {
        artifactsStore: new codepipeline.ArtifactsStore(stack, 'PipelineDefaultStore', {
          encryptionMaterialArn: `arn:aws:kms:us-west-2:111122223333:alias/pipeline-bucket-alias`
        })
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
        adminPermissions: false,
      });

      expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
        "ArtifactStore": {
          "EncryptionKey": {
            "Id": "arn:aws:kms:us-west-2:111122223333:alias/pipeline-bucket-alias",
            "Type": "KMS"
          },
          "Location": {
            "Ref": "PipelineDefaultStoreBucket6B583860"
          },
          "Type": "S3"
        }
      }));

      // No scaffold stacks should be generated
      test.equal(Object.keys(pipeline.crossRegionScaffoldStacks).length, 0);
      test.equal(pipeline.artifactsStore.encryptionMaterialArn, 'arn:aws:kms:us-west-2:111122223333:alias/pipeline-bucket-alias');
      test.done();
    },
  }
};
