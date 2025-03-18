/**
 * This integration test needs 2 accounts properly configured beforehand to properly test,
 * and so is tested by hand.
 *
 * To test:
 *
 * ```
 * env AWS_REGION=eu-west-1 STACKSET_ACCOUNTS=11111111,22222222 cdk deploy -a test/cloudformation/integ.stacksets.js
 * ```
 *
 * Then make the pipeline in your account run.
 *
 * To update the snapshot:
 *
 * ```
 * yarn integ --dry-run cloudformation/integ.stacksets.js
 * ```
 */
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Asset } from 'aws-cdk-lib/aws-s3-assets';
import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

export class StackSetPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
      artifactBucket: new s3.Bucket(this, 'ArtifactBucket', {
        removalPolicy: RemovalPolicy.DESTROY,
        autoDeleteObjects: true,
      }),
    });

    const asset = new Asset(this, 'Asset', {
      path: `${__dirname}/test-artifact`,
    });

    const sourceOutput = new codepipeline.Artifact('SourceArtifact');

    pipeline.addStage({
      stageName: 'Source',
      actions: [
        new cpactions.S3SourceAction({
          actionName: 'Source',
          output: sourceOutput,
          bucket: asset.bucket,
          bucketKey: asset.s3ObjectKey,
        }),
      ],
    });

    const accounts = process.env.STACKSET_ACCOUNTS?.split(',') ?? ['1111', '2222'];

    pipeline.addStage({
      stageName: 'Cfn',
      actions: [
        new cpactions.CloudFormationDeployStackSetAction({
          actionName: 'StackSet',
          stackSetName: 'TestStackSet',
          template: cpactions.StackSetTemplate.fromArtifactPath(sourceOutput.atPath('template.yaml')),
          stackInstances: cpactions.StackInstances.inAccounts(accounts, ['us-east-1', 'eu-west-1']),
          runOrder: 1,
        }),
        new cpactions.CloudFormationDeployStackInstancesAction({
          actionName: 'Instances',
          stackSetName: 'TestStackSet',
          stackInstances: cpactions.StackInstances.inAccounts(accounts, ['us-east-1', 'eu-west-1']),
          runOrder: 2,
        }),
      ],
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-codepipeline:defaultPipelineTypeToV2': false,
    '@aws-cdk/pipelines:reduceStageRoleTrustScope': false,
  },
});
const stack = new StackSetPipelineStack(app, 'StackSetPipelineStack');
new IntegTest(app, 'StackSetPipelineStackInteg', {
  testCases: [stack],
  diffAssets: true,
});
