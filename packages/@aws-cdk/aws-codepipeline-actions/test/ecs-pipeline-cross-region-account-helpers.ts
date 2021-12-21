import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as cpactions from '../lib';

/**
 * This is our pipeline which has initial actions.
 */
export class EcsServiceCrossRegionAccountPipelineStack extends cdk.Stack {
  public artifact: codepipeline.Artifact;
  public pipeline: codepipeline.Pipeline;

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const artifact = new codepipeline.Artifact('Artifact');
    this.artifact = artifact;
    const bucket = new s3.Bucket(this, 'PipelineBucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    const source = new cpactions.S3SourceAction({
      actionName: 'Source',
      output: artifact,
      bucket,
      bucketKey: 'key',
    });
    this.pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
      stages: [
        {
          stageName: 'Source',
          actions: [source],
        },
      ],
    });

  }
}