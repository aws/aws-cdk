// eslint-disable-next-line import/no-extraneous-dependencies
/// !cdk-integ PipelineStack pragma:set-context:@aws-cdk/core:newStyleStackSynthesis=true
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { App, Stack, StackProps, Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as pipelines from 'aws-cdk-lib/pipelines';
import * as integ from '@aws-cdk/integ-tests-alpha';

class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.connection(
          'owner/group/repo', 'master', {
            // connectionArn is dummy as this test case just validates if pipeline is deployed successfully or not.
            connectionArn: 'arn:aws:codestar-connections:us-east-1:111111111111:connection/184ba85d-b626-48ef-960f-b377c9c01a76',
          }),
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

    const stack1 = new Stack(this, 'Stack1');
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
const stack = new PipelineStack(app, 'PipelineStack');

new integ.IntegTest(app, 'PipelineStackInteg', {
  testCases: [stack],
});
