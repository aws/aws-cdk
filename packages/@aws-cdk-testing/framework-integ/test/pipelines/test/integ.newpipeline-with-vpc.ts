// eslint-disable-next-line import/no-extraneous-dependencies
/// !cdk-integ PipelineStack pragma:set-context:@aws-cdk/core:newStyleStackSynthesis=true
import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3_assets from 'aws-cdk-lib/aws-s3-assets';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { App, Stack, StackProps, Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as pipelines from 'aws-cdk-lib/pipelines';
import { PIPELINE_REDUCE_ASSET_ROLE_TRUST_SCOPE } from 'aws-cdk-lib/cx-api';

class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc', { restrictDefaultSecurityGroup: false });

    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      codeBuildDefaults: { vpc },
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.gitHub('aws/aws-cdk', 'v2-main'),
        commands: [
          'npm ci',
          'npm run build',
          'npx cdk synth',
        ],
      }),
    });

    pipeline.addStage(new AppStage(this, 'Beta'));
  }
}

class AppStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const stack = new Stack(this, 'Stack1');
    new s3_assets.Asset(stack, 'Asset', {
      path: path.join(__dirname, 'testhelpers/assets/test-file-asset.txt'),
    });
    new s3_assets.Asset(stack, 'Asset2', {
      path: path.join(__dirname, 'testhelpers/assets/test-file-asset-two.txt'),
    });

    new sqs.Queue(stack, 'OtherQueue');
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/core:newStyleStackSynthesis': '1',
    '@aws-cdk/aws-codepipeline:defaultPipelineTypeToV2': false,
    [PIPELINE_REDUCE_ASSET_ROLE_TRUST_SCOPE]: false,
    '@aws-cdk/pipelines:reduceStageRoleTrustScope': true,
  },
});
new PipelineStack(app, 'PipelineStack');
app.synth();
