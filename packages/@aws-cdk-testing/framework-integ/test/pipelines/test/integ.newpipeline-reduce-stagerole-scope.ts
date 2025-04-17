import * as cdk from 'aws-cdk-lib';
import { App, Stack, StackProps, Stage, StageProps } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as pipelines from 'aws-cdk-lib/pipelines';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as sqs from 'aws-cdk-lib/aws-sqs';

/**
 * A stack that defines an SQS queue.
 */
class ProdStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new sqs.Queue(this, 'MyQueue', {
      queueName: 'prod-queue',
      visibilityTimeout: cdk.Duration.seconds(300),
    });
  }
}

/**
 * A stage that deploys the `ProdStack`.
 */
class ProdStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);
    new ProdStack(this, 'ProdStack', props);
  }
}

/**
 * The main pipeline stack, using a GitHub connection source.
 */
class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipelineSource = pipelines.CodePipelineSource.connection('aws/aws-cdk', 'main', {
      connectionArn: 'arn:aws:codeconnections:us-east-1:486673125664:connection/a3bf1dc7-eefb-4278-9f04-cc8fed8b569a',
      codeBuildCloneOutput: true,
    });

    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      pipelineName: 'pipeline-name',
      useChangeSets: false,
      crossAccountKeys: false,
      synth: new pipelines.ShellStep('Synth', {
        input: pipelineSource,
        commands: ['npm ci && npm run build'],
      }),
      dockerEnabledForSynth: true,
      codeBuildDefaults: {
        buildEnvironment: {
          buildImage: codebuild.LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_3_0,
          computeType: codebuild.ComputeType.SMALL,
        },
        cache: codebuild.Cache.local(codebuild.LocalCacheMode.DOCKER_LAYER),
      },
    });

    pipeline.addStage(new ProdStage(this, 'Prod'), {
      pre: [new pipelines.ManualApprovalStep('PromoteToProd')],
    });
  }
}

/**
 * Integration test that ensures the pipeline can be deployed.
 */
const app = new App({
  postCliContext: {
    '@aws-cdk/pipelines:reduceStageRoleTrustScope': true,
    '@aws-cdk/aws-codepipeline:defaultPipelineTypeToV2': false,
  },
});
const stack = new PipelineStack(app, 'CdkPipelineInvestigationStack');

new integ.IntegTest(app, 'CdkPipelineInvestigationTest', {
  testCases: [stack],
  diffAssets: true,
});

app.synth();
