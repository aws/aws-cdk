/// !cdk-integ PipelineStack
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import { App, CfnResource, SecretValue, Stack, StackProps, Stage, StageProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as cdkp from '../lib';

class MyStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const stack = new Stack(this, 'Stack', props);
    new CfnResource(stack, 'Resource', {
      type: 'AWS::Test::SomeResource',
    });
  }
}

/**
 * The stack that defines the application pipeline
 */
class CdkpipelinesDemoPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const integTestArtifact = new codepipeline.Artifact('IntegTests');

    const pipeline = new cdkp.CdkPipeline(this, 'Pipeline', {
      // Where the source can be found
      source: new cdkp.GitHubSource({
        oauthToken: SecretValue.plainText('not-a-secret'),
        slug: 'OWNER/REPO',
        trigger: codepipeline_actions.GitHubTrigger.POLL,
      }),

      // How it will be built
      synthAction: cdkp.SimpleSynthAction.standardNpmSynth({
        projectName: 'MyServicePipeline-synth',
        additionalArtifacts: [
          {
            directory: 'test',
            artifact: integTestArtifact,
          },
        ],
      }),
    });

    // This is where we add the application stages
    // ...
    const stage = pipeline.addApplicationStage(new MyStage(this, 'PreProd', {
      env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
    }));
    stage.addActions(
      new cdkp.ShellScriptAction({
        actionName: 'UseSource',
        commands: [
          // Comes from source
          'cat README.md',
        ],
        additionalArtifacts: [pipeline.sourceArtifact],
      }),
    );
  }
}

const app = new App({
  context: {
    '@aws-cdk/core:newStyleStackSynthesis': 'true',
  },
});
new CdkpipelinesDemoPipelineStack(app, 'PipelineStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});
app.synth();
