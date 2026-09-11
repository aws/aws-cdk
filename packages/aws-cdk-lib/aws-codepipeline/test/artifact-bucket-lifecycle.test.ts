import { FakeBuildAction } from './fake-build-action';
import { FakeSourceAction } from './fake-source-action';
import { Match, Template } from '../../assertions';
import * as s3 from '../../aws-s3';
import * as cdk from '../../core';
import * as codepipeline from '../lib';

describe('artifact bucket lifecycle props', () => {
  test('default behavior retains the artifact bucket', () => {
    const stack = new cdk.Stack();
    const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');
    addMinimalStages(pipeline);

    const template = Template.fromStack(stack);
    template.hasResource('AWS::S3::Bucket', {
      DeletionPolicy: 'Retain',
      UpdateReplacePolicy: 'Retain',
    });
  });

  test('can set artifactBucketRemovalPolicy to DESTROY', () => {
    const stack = new cdk.Stack();
    const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
      artifactBucketRemovalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    addMinimalStages(pipeline);

    const template = Template.fromStack(stack);
    template.hasResource('AWS::S3::Bucket', {
      DeletionPolicy: 'Delete',
      UpdateReplacePolicy: 'Delete',
    });
  });

  test('can set artifactBucketRemovalPolicy to RETAIN', () => {
    const stack = new cdk.Stack();
    const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
      artifactBucketRemovalPolicy: cdk.RemovalPolicy.RETAIN,
    });
    addMinimalStages(pipeline);

    const template = Template.fromStack(stack);
    template.hasResource('AWS::S3::Bucket', {
      DeletionPolicy: 'Retain',
      UpdateReplacePolicy: 'Retain',
    });
  });

  test('can set artifactBucketAutoDeleteObjects to true with DESTROY policy', () => {
    const stack = new cdk.Stack();
    const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
      artifactBucketRemovalPolicy: cdk.RemovalPolicy.DESTROY,
      artifactBucketAutoDeleteObjects: true,
    });
    addMinimalStages(pipeline);

    const template = Template.fromStack(stack);
    template.hasResource('AWS::S3::Bucket', {
      DeletionPolicy: 'Delete',
      UpdateReplacePolicy: 'Delete',
    });
    // autoDeleteObjects adds a custom resource
    template.hasResourceProperties('Custom::S3AutoDeleteObjects', {
      BucketName: Match.anyValue(),
    });
  });

  test('fails when artifactBucketAutoDeleteObjects is true without DESTROY policy', () => {
    const stack = new cdk.Stack();
    expect(() => {
      new codepipeline.Pipeline(stack, 'Pipeline', {
        artifactBucketAutoDeleteObjects: true,
      });
    }).toThrow(/'artifactBucketAutoDeleteObjects' requires 'artifactBucketRemovalPolicy' to be set to 'RemovalPolicy.DESTROY'/);
  });

  test('fails when artifactBucketAutoDeleteObjects is true with RETAIN policy', () => {
    const stack = new cdk.Stack();
    expect(() => {
      new codepipeline.Pipeline(stack, 'Pipeline', {
        artifactBucketRemovalPolicy: cdk.RemovalPolicy.RETAIN,
        artifactBucketAutoDeleteObjects: true,
      });
    }).toThrow(/'artifactBucketAutoDeleteObjects' requires 'artifactBucketRemovalPolicy' to be set to 'RemovalPolicy.DESTROY'/);
  });

  test('fails when artifactBucketRemovalPolicy is set with artifactBucket', () => {
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Bucket');
    expect(() => {
      new codepipeline.Pipeline(stack, 'Pipeline', {
        artifactBucket: bucket,
        artifactBucketRemovalPolicy: cdk.RemovalPolicy.DESTROY,
      });
    }).toThrow(/Cannot set 'artifactBucketRemovalPolicy' or 'artifactBucketAutoDeleteObjects' when 'artifactBucket' is provided/);
  });

  test('fails when artifactBucketAutoDeleteObjects is set with artifactBucket', () => {
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Bucket');
    expect(() => {
      new codepipeline.Pipeline(stack, 'Pipeline', {
        artifactBucket: bucket,
        artifactBucketAutoDeleteObjects: true,
      });
    }).toThrow(/Cannot set 'artifactBucketRemovalPolicy' or 'artifactBucketAutoDeleteObjects' when 'artifactBucket' is provided/);
  });

  test('fails when artifactBucketRemovalPolicy is set with crossRegionReplicationBuckets', () => {
    const stack = new cdk.Stack(undefined, undefined, { env: { region: 'us-east-1', account: '123456789012' } });
    const bucket = new s3.Bucket(stack, 'Bucket');
    expect(() => {
      new codepipeline.Pipeline(stack, 'Pipeline', {
        crossRegionReplicationBuckets: { 'us-east-1': bucket },
        artifactBucketRemovalPolicy: cdk.RemovalPolicy.DESTROY,
      });
    }).toThrow(/Cannot set 'artifactBucketRemovalPolicy' or 'artifactBucketAutoDeleteObjects' when 'crossRegionReplicationBuckets' is provided/);
  });
});

function addMinimalStages(pipeline: codepipeline.Pipeline) {
  const sourceArtifact = new codepipeline.Artifact();
  pipeline.addStage({
    stageName: 'Source',
    actions: [new FakeSourceAction({
      actionName: 'FakeSource',
      output: sourceArtifact,
    })],
  });
  pipeline.addStage({
    stageName: 'Build',
    actions: [new FakeBuildAction({
      actionName: 'FakeBuild',
      input: sourceArtifact,
    })],
  });
}
