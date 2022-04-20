/// !cdk-integ PipelineStack pragma:set-context:@aws-cdk/core:newStyleStackSynthesis=true
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import * as s3 from '@aws-cdk/aws-s3';
import { App, CfnResource, RemovalPolicy, Stack, StackProps, Stage, StageProps } from '@aws-cdk/core';
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

    const sourceArtifact = new codepipeline.Artifact();
    const cloudAssemblyArtifact = new codepipeline.Artifact('CloudAsm');
    const integTestArtifact = new codepipeline.Artifact('IntegTests');

    const sourceBucket = new s3.Bucket(this, 'SourceBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
    const pipeline = new cdkp.CdkPipeline(this, 'Pipeline', {
      cloudAssemblyArtifact,

      // Where the source can be found
      sourceAction: new codepipeline_actions.S3SourceAction({
        bucket: sourceBucket,
        output: sourceArtifact,
        bucketKey: 'key',
        actionName: 'S3',
      }),

      // How it will be built
      synthAction: cdkp.SimpleSynthAction.standardNpmSynth({
        sourceArtifact,
        cloudAssemblyArtifact,
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
    const stage = pipeline.addApplicationStage(new MyStage(this, 'PreProd'));
    stage.addActions(
      new cdkp.ShellScriptAction({
        actionName: 'UseSource',
        commands: [
          // Comes from source
          'cat README.md',
        ],
        additionalArtifacts: [sourceArtifact],
      }),
    );
  }
}

const app = new App({
  context: {
    '@aws-cdk/core:newStyleStackSynthesis': 'true',
  },
});
new CdkpipelinesDemoPipelineStack(app, 'PipelineStack');
app.synth();
