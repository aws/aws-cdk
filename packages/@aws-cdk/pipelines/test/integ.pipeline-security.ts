/// !cdk-integ PipelineSecurityStack pragma:set-context:@aws-cdk/core:newStyleStackSynthesis=true
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as sns from '@aws-cdk/aws-sns';
import * as subscriptions from '@aws-cdk/aws-sns-subscriptions';
import { App, RemovalPolicy, Stack, StackProps, Stage, StageProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as cdkp from '../lib';

class MyStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);
    const stack = new Stack(this, 'MyStack', {
    });
    const topic = new sns.Topic(stack, 'Topic');
    topic.grantPublish(new iam.AccountPrincipal(stack.account));
  }
}

class MySafeStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);
    const stack = new Stack(this, 'MySafeStack', {
    });
    new sns.Topic(stack, 'MySafeTopic');
  }
}

export class TestCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const sourceArtifact = new codepipeline.Artifact();
    const cloudAssemblyArtifact = new codepipeline.Artifact('CloudAsm');
    const sourceBucket = new s3.Bucket(this, 'SourceBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const pipeline = new cdkp.CdkPipeline(this, 'TestPipeline', {
      selfMutating: false,
      pipelineName: 'TestPipeline',
      cloudAssemblyArtifact,
      sourceAction: new codepipeline_actions.S3SourceAction({
        bucket: sourceBucket,
        output: sourceArtifact,
        bucketKey: 'key',
        actionName: 'S3',
      }),
      synthAction: cdkp.SimpleSynthAction.standardYarnSynth({
        sourceArtifact,
        cloudAssemblyArtifact,
        buildCommand: 'yarn build',
      }),
    });

    const pipelineStage = pipeline.codePipeline.addStage({
      stageName: 'UnattachedStage',
    });

    const unattachedStage = new cdkp.CdkStage(this, 'UnattachedStage', {
      stageName: 'UnattachedStage',
      pipelineStage,
      cloudAssemblyArtifact,
      host: {
        publishAsset: () => undefined,
        stackOutputArtifact: () => undefined,
      },
    });

    const topic = new sns.Topic(this, 'SecurityChangesTopic');
    topic.addSubscription(new subscriptions.EmailSubscription('test@email.com'));

    unattachedStage.addApplication(new MyStage(this, 'SingleStage', {
    }), { confirmBroadeningPermissions: true, securityNotificationTopic: topic });

    const stage1 = pipeline.addApplicationStage(new MyStage(this, 'PreProduction', {
    }), { confirmBroadeningPermissions: true, securityNotificationTopic: topic });

    stage1.addApplication(new MySafeStage(this, 'SafeProduction', {
    }));

    stage1.addApplication(new MySafeStage(this, 'DisableSecurityCheck', {
    }), { confirmBroadeningPermissions: false });

    const stage2 = pipeline.addApplicationStage(new MyStage(this, 'NoSecurityCheck', {
    }));

    stage2.addApplication(new MyStage(this, 'EnableSecurityCheck', { }), { confirmBroadeningPermissions: true });
  }
}

const app = new App({
  context: {
    '@aws-cdk/core:newStyleStackSynthesis': 'true',
  },
});
new TestCdkStack(app, 'PipelineSecurityStack');
app.synth();
