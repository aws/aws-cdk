import * as path from 'path';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3_assets from 'aws-cdk-lib/aws-s3-assets';
import * as ecr_assets from 'aws-cdk-lib/aws-ecr-assets';
import * as pipelines from 'aws-cdk-lib/pipelines';
import { App, RemovalPolicy, Stack, StackProps, Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

/**
 * Integration test for pipeline conditional asset builds.
 *
 * This test verifies that when conditionallyBuildAssets is enabled, the pipeline
 * generates the appropriate CodeBuild commands to check S3 and ECR before
 * publishing assets.
 *
 * Stack verification steps:
 * 1. Verify the pipeline synthesizes successfully with conditionallyBuildAssets enabled
 * 2. Check that the asset publishing CodeBuild projects include existence check commands
 * 3. Verify IAM permissions are granted for S3 HeadObject and ECR DescribeImages
 */

class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sourceBucket = new s3.Bucket(this, 'SourceBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.s3(sourceBucket, 'source.zip'),
        commands: [
          'npm ci',
          'npm run build',
          'npx cdk synth',
        ],
      }),

      // Enable conditional asset builds to skip publishing assets that already exist
      conditionallyBuildAssets: true,

      // Use single publisher to make the buildspec easier to inspect
      publishAssetsInParallel: false,
    });

    // Add a stage with both file and Docker assets
    pipeline.addStage(new AppStage(this, 'TestStage'));
  }
}

class AppStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const stack = new Stack(this, 'AppStack');

    // Add file assets to test conditional S3 builds
    new s3_assets.Asset(stack, 'FileAsset1', {
      path: path.join(__dirname, 'testhelpers/assets/test-file-asset.txt'),
    });

    new s3_assets.Asset(stack, 'FileAsset2', {
      path: path.join(__dirname, 'testhelpers/assets/test-file-asset-two.txt'),
    });

    // Add a Docker image asset to test conditional ECR builds
    new ecr_assets.DockerImageAsset(stack, 'DockerAsset', {
      directory: path.join(__dirname, 'testhelpers/assets/test-docker-asset'),
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/core:newStyleStackSynthesis': '1',
    '@aws-cdk/aws-codepipeline:defaultPipelineTypeToV2': false,
  },
});

const stack = new PipelineStack(app, 'AssetBuilds');

new IntegTest(app, 'BuildTest', {
  testCases: [stack],
});

app.synth();

