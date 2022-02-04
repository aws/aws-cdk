import * as codepipeline from '@aws-cdk/aws-codepipeline';
import { Asset } from '@aws-cdk/aws-s3-assets';
import { App, Stack, StackProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as cpactions from '../../lib';

export class StackSetPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const pipeline = new codepipeline.Pipeline(this, 'Pipeline');

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
        new cpactions.CloudFormationStackSetAction({
          actionName: 'StackSet',
          stackSetName: 'TestStackSet',
          templatePath: sourceOutput.atPath('template.yaml'),
          stackInstances: cpactions.StackInstances.fromList(accounts, ['us-east-1', 'eu-west-1']),
          runOrder: 1,
        }),
        new cpactions.CloudFormationStackInstancesAction({
          actionName: 'Instances',
          stackSetName: 'TestStackSet',
          stackInstances: cpactions.StackInstances.fromList(accounts, ['us-east-1', 'eu-west-1']),
          runOrder: 2,
        }),
      ],
    });
  }
}

const app = new App();
new StackSetPipelineStack(app, 'StackSetPipelineStack', {
  env: {
    region: process.env.CDK_DEFAULT_REGION,
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
});