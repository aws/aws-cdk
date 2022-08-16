// eslint-disable-next-line import/no-extraneous-dependencies
/// !cdk-integ VariablePipelineStack pragma:set-context:@aws-cdk/core:newStyleStackSynthesis=true
import * as path from 'path';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3_assets from '@aws-cdk/aws-s3-assets';
import { App, Stack, StackProps, RemovalPolicy, Stage, StageProps, DefaultStackSynthesizer } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as pipelines from '../lib';

class MyStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const stack = new Stack(this, 'Stack', {
      ...props,
      synthesizer: new DefaultStackSynthesizer(),
    });

    new s3_assets.Asset(stack, 'Asset', {
      path: path.join(__dirname, 'testhelpers/assets/test-file-asset.txt'),
    });
  }
}

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
      assetPublishingCodeBuildDefaults: {
        partialBuildSpec: codebuild.BuildSpec.fromObject({
          phases: {
            post_build: {
              commands: [
                'export ASSET_OUTPUT_VAR="Hello from assets steps"',
              ],
            },
          },
        }),
      },
      selfMutation: false,
    });

    pipeline.assetStepExportedVariable('ASSET_OUTPUT_VAR');

    const cacheBucket = new s3.Bucket(this, 'TestCacheBucket');

    const consumer = new pipelines.CodeBuildStep('Consume', {
      env: {
        // Currently needs to refer manually, as amount of assets known only after synth
        ASSET_VAR: '#{Assets@FileAsset1.ASSET_OUTPUT_VAR}',
      },
      commands: [
        'echo "The variable was: $ASSET_VAR"',
      ],
      cache: codebuild.Cache.bucket(cacheBucket),
    });

    // WHEN
    pipeline.addWave('MyWave', {
      post: [consumer],
    }).addStage(new MyStage(this, 'PreProd'));
  }
}

const app = new App({
  context: {
    '@aws-cdk/core:newStyleStackSynthesis': '1',
  },
});

const stack = new PipelineStack(app, 'AssetVariablePipelineStack');

new integ.IntegTest(app, 'AssetVariablePipelineTest', {
  testCases: [stack],
});

app.synth();
