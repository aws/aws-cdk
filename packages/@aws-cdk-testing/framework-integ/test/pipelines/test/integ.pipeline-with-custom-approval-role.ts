import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, RemovalPolicy, Stack, StackProps, Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as pipelines from 'aws-cdk-lib/pipelines';
import * as s3 from 'aws-cdk-lib/aws-s3';

class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sourceBucket = new s3.Bucket(this, 'SourceBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const pipelineRole = new iam.Role(this, 'PipelineRole', {
      assumedBy: new iam.ServicePrincipal('codepipeline.amazonaws.com'),
    });

    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      role: pipelineRole,
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.s3(sourceBucket, 'key'),
        commands: ['mkdir cdk.out', 'touch cdk.out/dummy'],
      }),
      selfMutation: false,
    });

    pipeline.addStage(new AppStage(this, 'StackStage'), {
      pre: [new pipelines.ManualApprovalStep('ApproveDeployment', {
        role: new iam.Role(this, 'ApprovalRole', {
          assumedBy: pipelineRole,
        }),
      })],
    });
  }
}

class AppStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);
    const stack = new Stack(this, 'ProdStack');
    new s3.Bucket(stack, 'ProdBucket', {});
  }
}

const app = new App();

const stack = new PipelineStack(app, 'UseCustomApprovalRole');

new IntegTest(app, 'UseCustomApprovalRoleTest', {
  testCases: [stack],
  diffAssets: true,
});

app.synth();
