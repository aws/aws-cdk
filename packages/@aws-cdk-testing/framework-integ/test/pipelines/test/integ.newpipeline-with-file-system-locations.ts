import * as path from 'path';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3_assets from 'aws-cdk-lib/aws-s3-assets';
import { PIPELINE_REDUCE_ASSET_ROLE_TRUST_SCOPE } from 'aws-cdk-lib/cx-api';
import { App, Stack, StackProps, Stage, StageProps, Aws, RemovalPolicy, DefaultStackSynthesizer } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as pipelines from 'aws-cdk-lib/pipelines';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc', { restrictDefaultSecurityGroup: false });

    const sourceBucket = new s3.Bucket(this, 'SourceBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      codeBuildDefaults: {
        vpc: vpc,
        fileSystemLocations: [codebuild.FileSystemLocation.efs({
          identifier: 'myidentifier',
          location: `fs-c8d04839.efs.${Aws.REGION}.amazonaws.com:/mnt`,
          mountOptions: 'nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2',
          mountPoint: '/media',
        })],
        buildEnvironment: {
          privileged: true,
        },
      },
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.s3(sourceBucket, 'key'),
        commands: ['mkdir cdk.out', 'touch cdk.out/dummy'],
      }),
      selfMutation: false,
      useChangeSets: false,
    });

    pipeline.addStage(new AppStage(this, 'Beta'));
  }
}

class AppStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const stack = new Stack(this, 'Stack1', {
      synthesizer: new DefaultStackSynthesizer(),
    });
    new s3_assets.Asset(stack, 'Asset', {
      path: path.join(__dirname, 'testhelpers/assets/test-file-asset.txt'),
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/core:newStyleStackSynthesis': '1',
    '@aws-cdk/aws-codepipeline:defaultPipelineTypeToV2': false,
    [PIPELINE_REDUCE_ASSET_ROLE_TRUST_SCOPE]: true,
    '@aws-cdk/pipelines:reduceStageRoleTrustScope': true,
  },
});

const stack = new TestStack(app, 'PipelinesFileSystemLocations');

new integ.IntegTest(app, 'cdk-integ-codepipeline-with-file-system-locations', {
  testCases: [stack],
  diffAssets: true,
});

app.synth();
