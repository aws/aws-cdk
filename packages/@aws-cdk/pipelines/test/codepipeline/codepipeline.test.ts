import { Template, Annotations, Match } from '@aws-cdk/assertions';
import * as ccommit from '@aws-cdk/aws-codecommit';
import { Pipeline } from '@aws-cdk/aws-codepipeline';
import * as iam from '@aws-cdk/aws-iam';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';
import { Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as cdkp from '../../lib';
import { CodePipeline } from '../../lib';
import { PIPELINE_ENV, TestApp, ModernTestGitHubNpmPipeline, FileAssetApp, TwoStackApp, StageWithStackOutput } from '../testhelpers';

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

describe('Providing codePipeline parameter and prop(s) of codePipeline parameter to CodePipeline constructor should throw error', () => {
  test('Providing codePipeline parameter and pipelineName parameter should throw error', () => {
    expect(() => new CodePipelinePropsCheckTest(app, 'CodePipeline', {
      pipelineName: 'randomName',
    }).create()).toThrowError('Cannot set \'pipelineName\' if an existing CodePipeline is given using \'codePipeline\'');
  });
  test('Providing codePipeline parameter and enableKeyRotation parameter should throw error', () => {
    expect(() => new CodePipelinePropsCheckTest(app, 'CodePipeline', {
      enableKeyRotation: true,
    }).create()).toThrowError('Cannot set \'enableKeyRotation\' if an existing CodePipeline is given using \'codePipeline\'');
  });
  test('Providing codePipeline parameter and crossAccountKeys parameter should throw error', () => {
    expect(() => new CodePipelinePropsCheckTest(app, 'CodePipeline', {
      crossAccountKeys: true,
    }).create()).toThrowError('Cannot set \'crossAccountKeys\' if an existing CodePipeline is given using \'codePipeline\'');
  });
  test('Providing codePipeline parameter and reuseCrossRegionSupportStacks parameter should throw error', () => {
    expect(() => new CodePipelinePropsCheckTest(app, 'CodePipeline', {
      reuseCrossRegionSupportStacks: true,
    }).create()).toThrowError('Cannot set \'reuseCrossRegionSupportStacks\' if an existing CodePipeline is given using \'codePipeline\'');
  });
  test('Providing codePipeline parameter and role parameter should throw error', () => {
    const stack = new Stack(app, 'Stack');

    expect(() => new CodePipelinePropsCheckTest(stack, 'CodePipeline', {
      role: new iam.Role(stack, 'Role', {
        assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
      }),
    }).create()).toThrowError('Cannot set \'role\' if an existing CodePipeline is given using \'codePipeline\'');
  });
});

test('Policy sizes do not exceed the maximum size', () => {
  const pipelineStack = new cdk.Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
  pipelineStack.node.setContext('@aws-cdk/aws-iam:minimizePolicies', true);
  const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
    crossAccountKeys: true,
  });

  // WHEN
  const regions = ['us-east-1', 'us-east-2', 'eu-west-1', 'eu-west-2', 'somethingelse1', 'somethingelse-2', 'yapregion', 'more-region'];
  for (let i = 0; i < 70; i++) {
    pipeline.addStage(new FileAssetApp(pipelineStack, `App${i}`, {
      env: {
        account: `account${i}`,
        region: regions[i % regions.length],
      },
    }), {
      post: [
        new cdkp.ShellStep('DoAThing', { commands: ['true'] }),
        new cdkp.ShellStep('DoASecondThing', { commands: ['false'] }),
      ],
    });
  }

  // THEN
  const template = Template.fromStack(pipelineStack);

  // Collect policies by role
  const rolePolicies: Record<string, any[]> = {};
  for (const pol of Object.values(template.findResources('AWS::IAM::Policy'))) {
    for (const roleName of pol.Properties?.Roles ?? []) {
      const roleLogicalId = roleName.Ref; // Roles: [ { Ref: MyRole } ]
      if (!roleLogicalId) { continue; }

      if (!rolePolicies[roleLogicalId]) {
        rolePolicies[roleLogicalId] = [];
      }

      rolePolicies[roleLogicalId].push(pol.Properties.PolicyDocument);
    }
  }

  // Validate sizes
  //
  // Not entirely accurate, because our "Ref"s and "Fn::GetAtt"s actually need to be evaluated
  // to ARNs... but it gives an order-of-magnitude indication.
  // 10% of margin for CFN intrinsics like { Fn::Join } and { Ref: 'AWS::Partition' } which don't contribute to
  // the ACTUAL size, but do contribute to the measured size here.
  const cfnOverheadMargin = 1.10;

  for (const [logId, poldoc] of Object.entries(rolePolicies)) {
    const totalJson = JSON.stringify(poldoc);
    if (totalJson.length > 10000 * cfnOverheadMargin) {
      throw new Error(`Policy for Role ${logId} is too large (${totalJson.length} bytes): ${JSON.stringify(poldoc, undefined, 2)}`);
    }
  }

  for (const [logId, poldoc] of Object.entries(template.findResources('AWS::IAM::ManagedPolicy'))) {
    const totalJson = JSON.stringify(poldoc);
    if (totalJson.length > 6000 * cfnOverheadMargin) {
      throw new Error(`Managed Policy ${logId} is too large (${totalJson.length} bytes): ${JSON.stringify(poldoc, undefined, 2)}`);
    }
  }

  Annotations.fromStack(pipelineStack).hasNoWarning('*', Match.anyValue());
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

test('CodePipeline throws when key rotation is enabled without enabling cross account keys', ()=>{
  const pipelineStack = new cdk.Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
  const repo = new ccommit.Repository(pipelineStack, 'Repo', {
    repositoryName: 'MyRepo',
  });
  const cdkInput = cdkp.CodePipelineSource.codeCommit(
    repo,
    'main',
  );

  expect(() => new CodePipeline(pipelineStack, 'Pipeline', {
    enableKeyRotation: true,
    synth: new cdkp.ShellStep('Synth', {
      input: cdkInput,
      installCommands: ['npm ci'],
      commands: [
        'npm run build',
        'npx cdk synth',
      ],
    }),
  }).buildPipeline()).toThrowError('Setting \'enableKeyRotation\' to true also requires \'crossAccountKeys\' to be enabled');
});


test('CodePipeline enables key rotation on cross account keys', ()=>{
  const pipelineStack = new cdk.Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
  const repo = new ccommit.Repository(pipelineStack, 'Repo', {
    repositoryName: 'MyRepo',
  });
  const cdkInput = cdkp.CodePipelineSource.codeCommit(
    repo,
    'main',
  );

  new CodePipeline(pipelineStack, 'Pipeline', {
    enableKeyRotation: true,
    crossAccountKeys: true, // requirement of key rotation
    synth: new cdkp.ShellStep('Synth', {
      input: cdkInput,
      installCommands: ['npm ci'],
      commands: [
        'npm run build',
        'npx cdk synth',
      ],
    }),
  });

  const template = Template.fromStack(pipelineStack);

  template.hasResourceProperties('AWS::KMS::Key', {
    EnableKeyRotation: true,
  });
});

test('CodePipeline supports use of existing role', () => {
  const pipelineStack = new cdk.Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
  const repo = new ccommit.Repository(pipelineStack, 'Repo', {
    repositoryName: 'MyRepo',
  });
  const cdkInput = cdkp.CodePipelineSource.codeCommit(
    repo,
    'main',
  );

  new CodePipeline(pipelineStack, 'Pipeline', {
    synth: new cdkp.ShellStep('Synth', {
      input: cdkInput,
      installCommands: ['npm ci'],
      commands: [
        'npm run build',
        'npx cdk synth',
      ],
    }),
    role: new iam.Role(pipelineStack, 'CustomRole', {
      assumedBy: new iam.ServicePrincipal('codepipeline.amazonaws.com'),
      roleName: 'MyCustomPipelineRole',
    }),
  });

  const template = Template.fromStack(pipelineStack);
  template.hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [
        {
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Principal: {
            Service: 'codepipeline.amazonaws.com',
          },
        },
      ],
    },
    RoleName: 'MyCustomPipelineRole',
  });
  template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
    RoleArn: { 'Fn::GetAtt': ['CustomRole6D8E6809', 'Arn'] },
  });
});

describe('deployment of stack', () => {
  test('is done with Prepare and Deploy step by default', () => {
    const pipelineStack = new cdk.Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
    const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
      crossAccountKeys: true,
    });
    pipeline.addStage(new FileAssetApp(pipelineStack, 'App', {}));

    // THEN
    const template = Template.fromStack(pipelineStack);

    // There should be Prepare step in piepline
    template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
      Stages: Match.arrayWith([{
        Actions: Match.arrayWith([
          Match.objectLike({
            Configuration: Match.objectLike({
              ActionMode: 'CHANGE_SET_REPLACE',
            }),
            Name: 'Prepare',
          }),
          Match.objectLike({
            Configuration: Match.objectLike({
              ActionMode: 'CHANGE_SET_EXECUTE',
            }),
            Name: 'Deploy',
          }),
        ]),
        Name: 'App',
      }]),
    });
  });

  test('can be done with single step', () => {
    const pipelineStack = new cdk.Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
    const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
      crossAccountKeys: true,
      useChangeSets: false,
    });
    pipeline.addStage(new FileAssetApp(pipelineStack, 'App', {}));

    // THEN
    const template = Template.fromStack(pipelineStack);

    // There should be Prepare step in piepline
    template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
      Stages: Match.arrayWith([{
        Actions: Match.arrayWith([
          Match.objectLike({
            Configuration: Match.objectLike({
              ActionMode: 'CREATE_UPDATE',
            }),
            Name: 'Deploy',
          }),
        ]),
        Name: 'App',
      }]),
    });
  });
});

test('action name is calculated properly if it has cross-stack dependencies', () => {
  // GIVEN
  const pipelineStack = new cdk.Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
  const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
    crossAccountKeys: true,
  });

  // WHEN
  const s1step = new cdkp.ManualApprovalStep('S1');
  const s2step = new cdkp.ManualApprovalStep('S2');
  s1step.addStepDependency(s2step);

  // The issue we were diagnosing only manifests if the stacks don't have
  // a dependency on each other
  const stage = new TwoStackApp(app, 'TheApp', { withDependency: false });
  pipeline.addStage(stage, {
    stackSteps: [
      { stack: stage.stack1, post: [s1step] },
      { stack: stage.stack2, post: [s2step] },
    ],
  });

  // THEN
  const template = Template.fromStack(pipelineStack);
  template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
    Stages: Match.arrayWith([{
      Name: 'TheApp',
      Actions: Match.arrayWith([
        Match.objectLike({ Name: 'Stack2.S2', RunOrder: 3 }),
        Match.objectLike({ Name: 'Stack1.S1', RunOrder: 4 }),
      ]),
    }]),
  });
});

test('synths with change set approvers', () => {
  // GIVEN
  const pipelineStack = new cdk.Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
  const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');

  // WHEN
  const csApproval = new cdkp.ManualApprovalStep('ChangeSetApproval');

  // The issue we were diagnosing only manifests if the stacks don't have
  // a dependency on each other
  const stage = new TwoStackApp(app, 'TheApp', { withDependency: false });
  pipeline.addStage(stage, {
    stackSteps: [
      { stack: stage.stack1, changeSet: [csApproval] },
      { stack: stage.stack2, changeSet: [csApproval] },
    ],
  });

  // THEN
  const template = Template.fromStack(pipelineStack);
  template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
    Stages: Match.arrayWith([{
      Name: 'TheApp',
      Actions: Match.arrayWith([
        Match.objectLike({ Name: 'Stack1.Prepare', RunOrder: 1 }),
        Match.objectLike({ Name: 'Stack2.Prepare', RunOrder: 1 }),
        Match.objectLike({ Name: 'Stack1.ChangeSetApproval', RunOrder: 2 }),
        Match.objectLike({ Name: 'Stack1.Deploy', RunOrder: 3 }),
        Match.objectLike({ Name: 'Stack2.Deploy', RunOrder: 3 }),
      ]),
    }]),
  });
});

test('selfMutationProject can be accessed after buildPipeline', () => {
  // GIVEN
  const pipelineStack = new cdk.Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
  const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
  pipeline.addStage(new StageWithStackOutput(pipelineStack, 'Stage'));

  // WHEN
  pipeline.buildPipeline();

  // THEN
  expect(pipeline.selfMutationProject).toBeTruthy();
});

test('selfMutationProject is undefined if switched off', () => {
  // GIVEN
  const pipelineStack = new cdk.Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
  const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk', {
    selfMutation: false,
  });
  pipeline.addStage(new StageWithStackOutput(pipelineStack, 'Stage'));

  // WHEN
  pipeline.buildPipeline();

  // THEN
  expect(() => pipeline.selfMutationProject).toThrow(/No selfMutationProject/);
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

interface CodePipelineStackProps extends cdk.StackProps {
  pipelineName?: string;
  crossAccountKeys?: boolean;
  enableKeyRotation?: boolean;
  reuseCrossRegionSupportStacks?: boolean;
  role?: iam.IRole;
}

class CodePipelinePropsCheckTest extends cdk.Stack {
  cProps: CodePipelineStackProps;
  public constructor(scope: Construct, id: string, props: CodePipelineStackProps) {
    super(scope, id, props);
    this.cProps = props;
  }
  public create() {
    if (this.cProps.pipelineName !== undefined) {
      new cdkp.CodePipeline(this, 'CodePipeline1', {
        pipelineName: this.cProps.pipelineName,
        codePipeline: new Pipeline(this, 'Pipeline1'),
        synth: new cdkp.ShellStep('Synth', { commands: ['ls'] }),
      }).buildPipeline();
    }
    if (this.cProps.crossAccountKeys !== undefined) {
      new cdkp.CodePipeline(this, 'CodePipeline2', {
        crossAccountKeys: this.cProps.crossAccountKeys,
        codePipeline: new Pipeline(this, 'Pipeline2'),
        synth: new cdkp.ShellStep('Synth', { commands: ['ls'] }),
      }).buildPipeline();
    }
    if (this.cProps.enableKeyRotation !== undefined) {
      new cdkp.CodePipeline(this, 'CodePipeline3', {
        enableKeyRotation: this.cProps.enableKeyRotation,
        codePipeline: new Pipeline(this, 'Pipeline3'),
        synth: new cdkp.ShellStep('Synth', { commands: ['ls'] }),
      }).buildPipeline();
    }
    if (this.cProps.reuseCrossRegionSupportStacks !== undefined) {
      new cdkp.CodePipeline(this, 'CodePipeline4', {
        reuseCrossRegionSupportStacks: this.cProps.reuseCrossRegionSupportStacks,
        codePipeline: new Pipeline(this, 'Pipeline4'),
        synth: new cdkp.ShellStep('Synth', { commands: ['ls'] }),
      }).buildPipeline();
    }
    if (this.cProps.role !== undefined) {
      new cdkp.CodePipeline(this, 'CodePipeline5', {
        role: this.cProps.role,
        codePipeline: new Pipeline(this, 'Pipeline5'),
        synth: new cdkp.ShellStep('Synth', { commands: ['ls'] }),
      }).buildPipeline();
    }
  }
}
