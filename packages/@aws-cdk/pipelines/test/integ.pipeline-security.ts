/// !cdk-integ PipelineStack
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import * as s3 from '@aws-cdk/aws-s3';
import { App, SecretValue, Stack, StackProps, Stage, StageProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as cdkp from '../lib';

class MyStage extends Stage {

  public readonly bucket: s3.Bucket;

  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const bucketStack = new Stack(this, 'BucketStack', props);

    this.bucket = new s3.Bucket(bucketStack, 'MyFirstBucket', {
      versioned: true,
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

    const pipeline = new cdkp.CdkPipeline(this, 'Pipeline', {
      cloudAssemblyArtifact,

      // Where the source can be found
      sourceAction: new codepipeline_actions.GitHubSourceAction({
        actionName: 'GitHub',
        output: sourceArtifact,
        oauthToken: SecretValue.secretsManager('github-token'),
        owner: 'BryanPan342',
        repo: 'http-proxy',
        branch: 'main',
      }),

      // How it will be built
      synthAction: cdkp.SimpleSynthAction.standardYarnSynth({
        sourceArtifact,
        cloudAssemblyArtifact,
        buildCommand: 'yarn build',
      }),
    });

    // This is where we add the application stages
    // ...
    pipeline.addApplicationStage(new MyStage(this, 'PreProd', {
      env: { account: this.account, region: this.region },
    }), {
      securityCheck: true,
    });
  }
}

const app = new App({
  context: {
    '@aws-cdk/core:newStyleStackSynthesis': 'true',
  },
});
new CdkpipelinesDemoPipelineStack(app, 'PipelineSecurityStack', {
  env: { account: '045046196850', region: 'us-west-2' },
});
app.synth();
