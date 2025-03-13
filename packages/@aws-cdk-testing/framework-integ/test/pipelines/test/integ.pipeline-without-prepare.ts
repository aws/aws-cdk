// eslint-disable-next-line import/no-extraneous-dependencies
/// !cdk-integ VarablePipelineStack pragma:set-context:@aws-cdk/core:newStyleStackSynthesis=true
import * as s3 from 'aws-cdk-lib/aws-s3';
import { App, Stack, StackProps, RemovalPolicy, Stage, StageProps, DefaultStackSynthesizer } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as pipelines from 'aws-cdk-lib/pipelines';

/**
 * A test stack
 *
 * It contains a single Bucket. Such robust. Much uptime.
 */
export class BucketStack extends Stack {
  public readonly bucket: s3.IBucket;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this.bucket = new s3.Bucket(this, 'Bucket');
  }
}

export class PlainStackApp extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);
    new BucketStack(this, 'Stack');
  }
}

class MyStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const stack = new Stack(this, 'Stack', {
      ...props,
      synthesizer: new DefaultStackSynthesizer(),
    });

    new PlainStackApp(stack, 'MyApp');
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
      selfMutation: false,
      useChangeSets: false,
    });

    pipeline.addStage(new MyStage(this, 'MyStage', {}));
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/core:newStyleStackSynthesis': '1',
    '@aws-cdk/aws-codepipeline:defaultPipelineTypeToV2': false,
    '@aws-cdk/pipelines:reduceStageRoleTrustScope': true,
  },
});

const stack = new PipelineStack(app, 'PreparelessPipelineStack');

new integ.IntegTest(app, 'PreparelessPipelineTest', {
  testCases: [stack],
  diffAssets: true,
});

app.synth();
