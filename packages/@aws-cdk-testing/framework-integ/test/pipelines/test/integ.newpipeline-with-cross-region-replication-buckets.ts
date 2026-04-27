import * as sqs from 'aws-cdk-lib/aws-sqs';
import type {
  StackProps,
  StageProps,
} from 'aws-cdk-lib';
import {
  App,
  PhysicalName,
  Stack,
  Stage,
  RemovalPolicy,
} from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as pipelines from 'aws-cdk-lib/pipelines';
import * as s3 from 'aws-cdk-lib/aws-s3';

interface CrossRegionReplicationBuckets {
  [key: string]: s3.Bucket;
}

class RegionalS3Stack extends Stack {
  public bucket: s3.Bucket;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.bucket = new s3.Bucket(this, 'RegionalBucket', {
      bucketName: PhysicalName.GENERATE_IF_NEEDED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: true,
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }
}

class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps, crossRegionReplicationBuckets?: CrossRegionReplicationBuckets) {
    super(scope, id, props);

    const sourceBucket = new s3.Bucket(this, 'SourceBucket', {
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.s3(sourceBucket, 'key'),
        commands: ['npm ci', 'npm run build', 'npx cdk synth'],
      }),
      crossRegionReplicationBuckets,
    });

    const wave = pipeline.addWave('MultiRegion');
    wave.addStage(new AppStage(this, 'us-east-1', { env: { region: 'us-east-1' } }));
    wave.addStage(new AppStage(this, 'us-west-2', { env: { region: 'us-west-2' } }));
  }
}

class AppStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const stack1 = new Stack(this, 'Queue1');
    new sqs.Queue(stack1, 'Queue');
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/core:newStyleStackSynthesis': '1',
    '@aws-cdk/aws-codepipeline:defaultPipelineTypeToV2': false,
    '@aws-cdk/pipelines:reduceStageRoleTrustScope': true,
  },
});

const account = process.env.CDK_INTEG_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT;

const usEast1S3Stack = new RegionalS3Stack(app, 'usEast1S3Stack', {
  env: {
    account,
    region: 'us-east-1',
  },
});

const usWest2S3Stack = new RegionalS3Stack(app, 'usWest2S3Stack', {
  env: {
    account,
    region: 'us-west-2',
  },
});

const crossRegionReplicationBuckets = {
  'us-east-1': usEast1S3Stack.bucket,
  'us-west-2': usWest2S3Stack.bucket,
};

const pipelineStack = new PipelineStack(app, 'PipelineStack', {
  env: {
    account,
    region: 'us-east-1',
  },
}, crossRegionReplicationBuckets);

new integ.IntegTest(
  app,
  'cdk-integ-codepipeline-with-cross-region-replication-buckets',
  {
    testCases: [pipelineStack, usEast1S3Stack, usWest2S3Stack],
  },
);

app.synth();
