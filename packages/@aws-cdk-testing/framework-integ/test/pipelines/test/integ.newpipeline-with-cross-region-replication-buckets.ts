// eslint-disable-next-line import/no-extraneous-dependencies
/// !cdk-integ PipelineStack pragma:set-context:@aws-cdk/core:newStyleStackSynthesis=true
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { App, Stack, StackProps, Stage, StageProps, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as pipelines from 'aws-cdk-lib/pipelines';
import * as s3 from 'aws-cdk-lib/aws-s3';

const regions = ['us-east-1', 'us-west-2'];

class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const regionalBucket = new s3.Bucket(this, 'RegionalBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const crossRegionReplicationBuckets = {
      'us-east-1': regionalBucket,
    };

    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.gitHub('jose-clickup/cdk-pipelines-demo', 'main'),
        // commands: ['npm ci', 'npm run build', 'npx cdk synth'],
        commands: ['echo Running integ tests...'],
      }),
      // Error: Only one of artifactBucket and crossRegionReplicationBuckets can be specified!
      // artifactBucket,
      crossRegionReplicationBuckets,
    });

    const wave = pipeline.addWave('MultiRegion');
    for (const region of regions) {
      wave.addStage(new AppStage(this, region, { env: { region: region } }));
    }
  }
}

class AppStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const stack1 = new Stack(this, 'Queue1');
    new sqs.Queue(stack1, 'Queue');

    const stack2 = new Stack(this, 'Queue2');
    new sqs.Queue(stack2, 'OtherQueue');
  }
}

const app = new App({
  context: {
    '@aws-cdk/core:newStyleStackSynthesis': '1',
  },
});

const stack = new PipelineStack(app, 'PipelineStack', {
  env: {
    region: 'us-east-1',
    //Error("You need to specify an explicit account when using CodePipeline's cross-region support")
    account: '425845004253',
  },
});

new integ.IntegTest(
  app,
  'cdk-integ-codepipeline-with-cross-region-replication-buckets',
  {
    testCases: [stack],
  },
);

app.synth();
