import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import type { StackProps } from 'aws-cdk-lib';
import { App, Stack, RemovalPolicy } from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import * as pipelines from 'aws-cdk-lib/pipelines';

const pipelineName = 'integ-pipelines-assume-role';

class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sourceBucket = new s3.Bucket(this, 'SourceBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      pipelineName,
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.s3(sourceBucket, 'key'),
        commands: ['mkdir cdk.out', 'touch cdk.out/dummy'],
      }),
      selfMutation: false,
    });

    const assumeRole = new iam.Role(this, 'AssumeRole', {
      assumedBy: new iam.AccountPrincipal(this.account),
    });

    const integTest = new pipelines.CodeBuildStep('IntegTest', {
      commands: ['aws sts get-caller-identity'],
      assumeRole,
    });

    // WHEN
    pipeline.addWave('MyWave', {
      post: [integTest],
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/core:newStyleStackSynthesis': '1',
    '@aws-cdk/aws-codepipeline:defaultPipelineTypeToV2': false,
    '@aws-cdk/pipelines:reduceStageRoleTrustScope': true,
  },
});

const stack = new PipelineStack(app, 'PipelineWithAssumeRole');

const apiCall = new IntegTest(app, 'PipelineWithAssumeRoleTest', {
  testCases: [stack],
  diffAssets: true,
}).assertions.awsApiCall('CodePipeline', 'getPipeline', { name: pipelineName });
apiCall.assertAtPath('pipeline.name', ExpectedResult.stringLikeRegexp(pipelineName));

app.synth();
