import * as path from 'path';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3_assets from 'aws-cdk-lib/aws-s3-assets';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as pipelines from 'aws-cdk-lib/pipelines';
import { App, RemovalPolicy, Stack, StackProps, Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'Source', {
      removalPolicy: RemovalPolicy.DESTROY,
    });
    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.s3(bucket, 'source.zip'),
        commands: [
          'npm ci',
          'npm run build',
          'npx cdk synth',
        ],
      }),
      publishAssetsInParallel: false,
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

const app = new App();
const stack = new PipelineStack(app, 'PipelineStackSinglePublisher');
new IntegTest(app, 'PipelineStackSinglePublisher-integ', {
  testCases: [stack],
});
