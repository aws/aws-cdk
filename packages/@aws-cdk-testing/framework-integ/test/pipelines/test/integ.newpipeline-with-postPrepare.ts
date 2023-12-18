// eslint-disable-next-line import/no-extraneous-dependencies
/// !cdk-integ PipelineStack pragma:set-context:@aws-cdk/core:newStyleStackSynthesis=true
import {
  IntegTest,
} from '@aws-cdk/integ-tests-alpha';
import { App, Stack, StackProps, Stage, StageProps } from 'aws-cdk-lib';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as pipelines from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';

class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new pipelines.CodePipeline(
      this,
      'PipelineWithPostPrepare',
      {
        synth: new pipelines.ShellStep('Synth', {
          input: pipelines.CodePipelineSource.gitHub('Nico-DB/aws-cdk', 'main'),
          commands: ['npm ci', 'npm run build', 'npx cdk synth'],
        }),
        allPrepareNodesFirst: true,
      },
    );

    pipeline.addStage(new AppStage(this, 'Beta'), {
      postPrepare: [new pipelines.ManualApprovalStep('Approval0')],
    });

    const group = pipeline.addWave('Wave1', {

      postPrepare: [new pipelines.ManualApprovalStep('Approval1')],
    });
    group.addStage(new AppStage(this, 'Prod1'));
    group.addStage(new AppStage(this, 'Prod2'));

    const group2 = pipeline.addWave('Wave2', { postPrepare: [new pipelines.ManualApprovalStep('Approval2')] });
    group2.addStage(new AppStage2(this, 'Prod3'));
    group2.addStage(new AppStage3(this, 'Prod4'));

  }
}

class AppStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const stack1 = new Stack(this, 'Stack1');
    const queue1 = new sqs.Queue(stack1, 'Queue');

    const stack2 = new Stack(this, 'Stack2');
    new sqs.Queue(stack2, 'OtherQueue', {
      deadLetterQueue: {
        queue: queue1,
        maxReceiveCount: 5,
      },
    });
  }
}

class AppStage2 extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    new Stack(this, 'Stack1');
  }
}

class AppStage3 extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    new Stack(this, 'Stack2');
  }
}

const app = new App({
  context: {
    '@aws-cdk/core:newStyleStackSynthesis': '1',
  },
});
const pipeStack = new PipelineStack(app, 'PipelineWithPostPrepareStack');

new IntegTest(app, 'Integ', {
  testCases: [pipeStack],
});

app.synth();
