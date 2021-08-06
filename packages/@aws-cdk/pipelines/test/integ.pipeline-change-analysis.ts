import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';
import { App, Stack, StackProps, Stage, StageProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as pipelines from '../lib';

interface MyStageProps extends StageProps {
  makeUnsafe?: boolean;
}

class MyStage extends Stage {
  constructor (scope: Construct, id: string, props?: MyStageProps) {
    super(scope, id, props);
    const stack = new Stack(this, props?.makeUnsafe ? 'MyUnsafeStack' : 'MyStack', {
      env: props?.env,
    });

    const topic = new sns.Topic(stack, 'Topic');
    topic.grantPublish(new iam.AccountPrincipal(stack.account));
  }
}

class PipelinesStack extends Stack {
  constructor (scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new pipelines.CodePipeline(this, 'C2APipeline', {
      pipelineName: 'C2APipeline',
      selfMutation: false,
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.connection('bryanpan342/cdk-pipelines-v2', 'master', {
          connectionArn: 'arn:aws:codestar-connections:us-east-1:045046196850:connection/ace566cc-cc19-44ce-a133-6b1777328832',
        }),
        commands: [
          'yarn install',
          'yarn build',
          'npx cdk synth',
        ],
      }),
    });

    const unsafeStage = new MyStage(this, 'Beta', { makeUnsafe: true });
    pipeline.addStage(unsafeStage, {
      pre: [
        new pipelines.PerformChangeAnalysis('c2a', { stage: unsafeStage }),
      ],
    });
  }
}

const app = new App({
  context: {
    '@aws-cdk/core:newStyleStackSynthesis': 'true',
  },
});
new PipelinesStack(app, 'C2APipelinesStack', {
  env: { account: '045046196850', region: 'us-west-2' },
});
app.synth();
