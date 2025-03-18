// eslint-disable-next-line import/no-extraneous-dependencies
/// !cdk-integ VariablePipelineStack pragma:set-context:@aws-cdk/core:newStyleStackSynthesis=true
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as pipelines from 'aws-cdk-lib/pipelines';

class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sourceBucket = new s3.Bucket(this, 'SourceBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.s3(sourceBucket, 'key'),
        // input: pipelines.CodePipelineSource.gitHub('cdklabs/construct-hub-probe', 'main', {
        //   trigger: GitHubTrigger.POLL,
        // }),
        commands: ['mkdir cdk.out', 'touch cdk.out/dummy'],
      }),
      selfMutation: false,
    });

    const cacheBucket = new s3.Bucket(this, 'TestCacheBucket');

    const producer = new pipelines.CodeBuildStep('Produce', {
      commands: ['export MY_VAR=hello'],
      cache: codebuild.Cache.bucket(cacheBucket),
    });

    const consumer = new pipelines.CodeBuildStep('Consume', {
      env: {
        THE_VAR: producer.exportedVariable('MY_VAR'),
      },
      commands: [
        'echo "The variable was: $THE_VAR"',
      ],
      cache: codebuild.Cache.bucket(cacheBucket),
    });

    // WHEN
    pipeline.addWave('MyWave', {
      post: [consumer, producer],
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

const stack = new PipelineStack(app, 'VariablePipelineStack');

new IntegTest(app, 'VariablePipelineTest', {
  testCases: [stack],
  diffAssets: true,
});

app.synth();
