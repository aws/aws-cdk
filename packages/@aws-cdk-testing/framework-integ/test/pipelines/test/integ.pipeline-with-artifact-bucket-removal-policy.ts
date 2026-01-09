/// !cdk-integ PipelineStack pragma:set-context:@aws-cdk/core:newStyleStackSynthesis=true
import * as s3 from 'aws-cdk-lib/aws-s3';
import { App, Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as pipelines from 'aws-cdk-lib/pipelines';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

const pipelineName = 'integ-pipeline-artifact-bucket-removal-policy';

class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sourceBucket = new s3.Bucket(this, 'SourceBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    new pipelines.CodePipeline(this, 'Pipeline', {
      pipelineName,
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.s3(sourceBucket, 'key'),
        commands: ['mkdir cdk.out', 'touch cdk.out/dummy'],
      }),
      // Test the new artifact bucket removal policy feature
      artifactBucketRemovalPolicy: RemovalPolicy.DESTROY,
      artifactBucketAutoDeleteObjects: true,
      selfMutation: false,
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/core:newStyleStackSynthesis': '1',
    '@aws-cdk/aws-codepipeline:defaultPipelineTypeToV2': true,
    '@aws-cdk/pipelines:reduceStageRoleTrustScope': true,
  },
});

const stack = new PipelineStack(app, 'PipelineStack');

const integTest = new IntegTest(app, 'PipelineArtifactBucketRemovalPolicyTest', {
  testCases: [stack],
  diffAssets: true,
});

// Verify the pipeline was created successfully with the artifact bucket
const pipelineCall = integTest.assertions.awsApiCall('CodePipeline', 'getPipeline', {
  name: pipelineName,
});
pipelineCall.assertAtPath('pipeline.name', ExpectedResult.stringLikeRegexp(pipelineName));
pipelineCall.assertAtPath('pipeline.pipelineType', ExpectedResult.stringLikeRegexp('V2'));

app.synth();
