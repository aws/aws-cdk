import * as path from 'path';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as s3_assets from '@aws-cdk/aws-s3-assets';
import * as sqs from '@aws-cdk/aws-sqs';
import { App, Stack, StackProps, Stage, StageProps, Aws } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as pipelines from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      codeBuildDefaults: {
        fileSystemLocations: [codebuild.FileSystemLocation.efs({
          identifier: 'myidentifier',
          location: `fs-c8d04839.efs.${Aws.REGION}.amazonaws.com:/mnt`,
          mountOptions: 'nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2',
          mountPoint: '/media',
        })],
      },
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

const app = new App();

const stack = new TestStack(app, 'PipelinesFileSystemLocations');

new IntegTest(app, 'cdk-integ-codepipeline-with-file-system-locations', {
  testCases: [stack],
});