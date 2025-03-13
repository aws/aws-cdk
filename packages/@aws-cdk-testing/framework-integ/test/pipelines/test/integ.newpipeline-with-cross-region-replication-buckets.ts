// eslint-disable-next-line import/no-extraneous-dependencies
/// !cdk-integ PipelineStack pragma:set-context:@aws-cdk/core:newStyleStackSynthesis=true
import * as sqs from 'aws-cdk-lib/aws-sqs';
import {
  App,
  Stack,
  StackProps,
  Stage,
  StageProps,
  RemovalPolicy,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as pipelines from 'aws-cdk-lib/pipelines';
import * as s3 from 'aws-cdk-lib/aws-s3';

const regionalBuckets: {[key: string]: string} = {
  'us-east-1': 'us-east-1-newpipeline-with-cross-region-replication-buckets',
  'us-west-2': 'us-west-2-newpipeline-with-cross-region-replication-buckets',
};

interface CrossRegionReplicationBuckets {
  [key: string]: s3.Bucket;
}

class RegionalS3Stack extends Stack {
  public bucket: s3.Bucket;

  constructor(scope: Construct, id: string, props?: StackProps, bucketName?: string) {
    super(scope, id, props);

    this.bucket = new s3.Bucket(this, 'RegionalBucket', {
      bucketName: bucketName,
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

    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.gitHub(
          'jose-clickup/cdk-pipelines-demo',
          'main',
        ),
        commands: ['npm ci', 'npm run build', 'npx cdk synth'],
      }),
      crossRegionReplicationBuckets,
    });

    const wave = pipeline.addWave('MultiRegion');
    for (const region in regionalBuckets) {
      wave.addStage(new AppStage(this, region, { env: { region: region } }));
    }
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

const usEast1S3Stack = new RegionalS3Stack(app, 'usEast1S3Stack', {
  env: {
    region: 'us-east-1',
  },
}, regionalBuckets['us-east-1']);

const usWest2S3Stack = new RegionalS3Stack(app, 'usWest2S3Stack', {
  env: {
    region: 'us-west-2',
  },
}, regionalBuckets['us-west-2']);

const crossRegionReplicationBuckets = {
  'us-east-1': usEast1S3Stack.bucket,
  'us-west-2': usWest2S3Stack.bucket,
};

const pipelineStack = new PipelineStack(app, 'PipelineStack', {
  env: {
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
