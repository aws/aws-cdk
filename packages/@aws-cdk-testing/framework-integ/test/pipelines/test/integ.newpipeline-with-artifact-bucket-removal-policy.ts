import type { StackProps } from 'aws-cdk-lib';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import type { Construct } from 'constructs';
import * as pipelines from 'aws-cdk-lib/pipelines';

/**
 * Integration test for artifactBucketRemovalPolicy and artifactBucketAutoDeleteObjects.
 *
 * Verifies that CodePipeline creates a managed artifact bucket with the given
 * removal policy and automatic object deletion when no explicit artifactBucket
 * is provided.
 */
class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new pipelines.CodePipeline(this, 'Pipeline', {
      artifactBucketRemovalPolicy: RemovalPolicy.DESTROY,
      artifactBucketAutoDeleteObjects: true,
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.gitHub('aws-samples/cdk-pipelines-demo', 'main'),
        commands: [
          'npm ci',
          'npm run build',
          'npx cdk synth',
        ],
      }),
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-codepipeline:defaultPipelineTypeToV2': false,
    '@aws-cdk/pipelines:reduceStageRoleTrustScope': true,
  },
});
const stack = new PipelineStack(app, 'PipelineStack');

new integ.IntegTest(app, 'PipelineTest', {
  testCases: [stack],
});

app.synth();
