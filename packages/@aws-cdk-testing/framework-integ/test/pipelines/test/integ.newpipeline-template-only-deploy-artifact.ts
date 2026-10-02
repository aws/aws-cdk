import * as path from 'path';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3_assets from 'aws-cdk-lib/aws-s3-assets';
import type { StackProps, StageProps } from 'aws-cdk-lib';
import { App, Stack, Stage, RemovalPolicy } from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import * as pipelines from 'aws-cdk-lib/pipelines';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as integ from '@aws-cdk/integ-tests-alpha';

class PipelineStack extends Stack {
  public readonly pipeline: pipelines.CodePipeline;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sourceBucket = new s3.Bucket(this, 'SourceBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    this.pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      pipelineType: codepipeline.PipelineType.V2,
      templateOnlyDeployArtifact: true,
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.s3(sourceBucket, 'key'),
        commands: [
          'npm ci',
          'npm run build',
          'npx cdk synth',
        ],
      }),
    });

    this.pipeline.addStage(new AppStage(this, 'Beta'));
    this.pipeline.buildPipeline();
  }
}

class AppStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const stack = new Stack(this, 'Stack');
    new s3_assets.Asset(stack, 'Asset', {
      path: path.join(__dirname, 'testhelpers/assets/test-file-asset.txt'),
    });
  }
}

const app = new App();
const stack = new PipelineStack(app, 'PipelineStack');

const test = new integ.IntegTest(app, 'PipelineTemplateOnlyDeployArtifactTest', {
  testCases: [stack],
});

test.assertions.awsApiCall('CodePipeline', 'getPipeline', {
  name: stack.pipeline.pipeline.pipelineName,
}).expect(integ.ExpectedResult.objectLike({
  pipeline: {
    stages: integ.Match.arrayWith([
      integ.Match.objectLike({
        name: 'Assets',
        actions: integ.Match.arrayWith([
          integ.Match.objectLike({
            name: 'StripAssets',
            inputArtifacts: [{ name: 'Synth_Output' }],
            outputArtifacts: [{ name: 'StripAssets_Output' }],
          }),
        ]),
      }),
      integ.Match.objectLike({
        name: 'Beta',
        actions: integ.Match.arrayWith([
          integ.Match.objectLike({
            name: 'Prepare',
            inputArtifacts: [{ name: 'StripAssets_Output' }],
          }),
        ]),
      }),
    ]),
  },
}));
