// eslint-disable-next-line import/no-extraneous-dependencies
/// !cdk-integ VarablePipelineStack pragma:set-context:@aws-cdk/core:newStyleStackSynthesis=true
import * as s3 from '@aws-cdk/aws-s3';
import { App, Stack, StackProps, RemovalPolicy, Stage, StageProps, DefaultStackSynthesizer } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as pipelines from '../lib';
import { PlainStackApp } from './testhelpers';

class MyStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const stack1 = new Stack(this, 'Stack1', {
      ...props,
      synthesizer: new DefaultStackSynthesizer(),
    });

    const stack2 = new Stack(this, 'Stack2', {
      ...props,
      synthesizer: new DefaultStackSynthesizer(),
    });

    new PlainStackApp(stack1, 'MyApp1');
    new PlainStackApp(stack2, 'MyApp2');
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
        commands: ['mkdir cdk.out', 'touch cdk.out/dummy'],
      }),
      selfMutation: false,
    });

    pipeline.addStage(new MyStage(this, 'MyStage', {}), {
      prepareStepForStacks: [
        {
          prepareStep: false,
          stackName: 'MyStage-Stack1',
        },
      ],
    });
  }
}

const app = new App({
  context: {
    '@aws-cdk/core:newStyleStackSynthesis': '1',
  },
});

const stack = new PipelineStack(app, 'PreparelessPipelineStageStackStack');

new integ.IntegTest(app, 'PreparelessPipelineStageStackTest', {
  testCases: [stack],
});

app.synth();
