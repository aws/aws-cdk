import { Template, Annotations, Match } from '@aws-cdk/assertions';
import * as ccommit from '@aws-cdk/aws-codecommit';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as cdkp from '../../lib';
import { PIPELINE_ENV, TestApp } from '../testhelpers';

let app: TestApp;

beforeEach(() => {
  app = new TestApp();
});

afterEach(() => {
  app.cleanup();
});

const testStageEnv: Required<cdk.Environment> = {
  account: '123456789012',
  region: 'us-east-1',
};

describe('CodePipeline support stack reuse', () => {
  test('CodePipeline generates the same support stack containing the replication Bucket without the need to bootstrap in that environment for multiple pipelines', () => {
    new ReuseCodePipelineStack(app, 'PipelineStackA', {
      env: PIPELINE_ENV,
    });
    new ReuseCodePipelineStack(app, 'PipelineStackB', {
      env: PIPELINE_ENV,
    });
    const assembly = app.synth();
    // 2 Pipeline Stacks and 1 support stack for both pipeline stacks.
    expect(assembly.stacks.length).toEqual(3);
    assembly.getStackByName(`PipelineStackA-support-${testStageEnv.region}`);
    expect(() => {
      assembly.getStackByName(`PipelineStackB-support-${testStageEnv.region}`);
    }).toThrowError(/Unable to find stack with stack name/);
  });

  test('CodePipeline generates the unique support stack containing the replication Bucket without the need to bootstrap in that environment for multiple pipelines', () => {
    new ReuseCodePipelineStack(app, 'PipelineStackA', {
      env: PIPELINE_ENV,
      reuseCrossRegionSupportStacks: false,
    });
    new ReuseCodePipelineStack(app, 'PipelineStackB', {
      env: PIPELINE_ENV,
      reuseCrossRegionSupportStacks: false,
    });
    const assembly = app.synth();
    // 2 Pipeline Stacks and 1 support stack for each pipeline stack.
    expect(assembly.stacks.length).toEqual(4);
    const supportStackAArtifact = assembly.getStackByName(`PipelineStackA-support-${testStageEnv.region}`);
    const supportStackBArtifact = assembly.getStackByName(`PipelineStackB-support-${testStageEnv.region}`);

    const supportStackATemplate = Template.fromJSON(supportStackAArtifact.template);
    supportStackATemplate.hasResourceProperties('AWS::S3::Bucket', {
      BucketName: 'pipelinestacka-support-useplicationbucket80db3753a0ebbf052279',
    });
    supportStackATemplate.hasResourceProperties('AWS::KMS::Alias', {
      AliasName: 'alias/pport-ustencryptionalias5cad45754e1ff088476b',
    });

    const supportStackBTemplate = Template.fromJSON(supportStackBArtifact.template);
    supportStackBTemplate.hasResourceProperties('AWS::S3::Bucket', {
      BucketName: 'pipelinestackb-support-useplicationbucket1d556ec7f959b336abf8',
    });
    supportStackBTemplate.hasResourceProperties('AWS::KMS::Alias', {
      AliasName: 'alias/pport-ustencryptionalias668c7ffd0de17c9867b0',
    });
  });
});

test('CodeBuild action role has the right AssumeRolePolicyDocument', () => {
  const pipelineStack = new cdk.Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
  new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');

  const template = Template.fromStack(pipelineStack);
  template.hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [
        {
          Action: 'sts:AssumeRole',
          Principal: {
            AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::123pipeline:root']] },
          },
          Condition: {
            Bool: {
              'aws:ViaAWSService': 'codepipeline.amazonaws.com',
            },
          },
        },
      ],
    },
  });
});

interface ReuseCodePipelineStackProps extends cdk.StackProps {
  reuseCrossRegionSupportStacks?: boolean;
}
class ReuseCodePipelineStack extends cdk.Stack {
  public constructor(scope: Construct, id: string, props: ReuseCodePipelineStackProps ) {
    super(scope, id, props);
    const repo = new ccommit.Repository(this, 'Repo', {
      repositoryName: 'MyRepo',
    });

    const cdkInput = cdkp.CodePipelineSource.codeCommit(
      repo,
      'main',
    );

    const synthStep = new cdkp.ShellStep('Synth', {
      input: cdkInput,
      installCommands: ['npm ci'],
      commands: [
        'npm run build',
        'npx cdk synth',
      ],
    });

    const pipeline = new cdkp.CodePipeline(this, 'Pipeline', {
      synth: synthStep,
      selfMutation: true,
      crossAccountKeys: true,
      reuseCrossRegionSupportStacks: props.reuseCrossRegionSupportStacks,
    });

    const stage = new ReuseStage(
      this,
      `SampleStage-${testStageEnv.account}-${testStageEnv.region}`,
      {
        env: testStageEnv,
      },
    );
    pipeline.addStage(stage);

  }
}

class ReuseStage extends cdk.Stage {
  public constructor(scope: Construct, id: string, props: cdk.StageProps) {
    super(scope, id, props);
    new ReuseStack(this, 'SampleStack', {});
  }
}

class ReuseStack extends cdk.Stack {
  public constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);
    new sqs.Queue(this, 'Queue');
  }
}