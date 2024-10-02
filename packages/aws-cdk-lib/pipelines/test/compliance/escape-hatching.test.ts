import { Match, Template } from '../../../assertions';
import * as cp from '../../../aws-codepipeline';
import * as cpa from '../../../aws-codepipeline-actions';
import { SecretValue, Stack } from '../../../core';
import * as cdkp from '../../lib';
import { ModernTestGitHubNpmPipeline, PIPELINE_ENV, TestApp } from '../testhelpers';

let app: TestApp;
let pipelineStack: Stack;
let sourceArtifact: cp.Artifact;
let codePipeline: cp.Pipeline;

beforeEach(() => {
  app = new TestApp();
  pipelineStack = new Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
  sourceArtifact = new cp.Artifact();
});

afterEach(() => {
  app.cleanup();
});

describe('with empty existing CodePipeline', () => {
  beforeEach(() => {
    codePipeline = new cp.Pipeline(pipelineStack, 'CodePipeline');
  });

  test('can give both actions', () => {

    // WHEN
    new cdkp.CodePipeline(pipelineStack, 'Cdk', {
      codePipeline,
      synth: new cdkp.ShellStep('Synth', {
        input: cdkp.CodePipelineSource.gitHub('test/test', 'main'),
        commands: ['true'],
      }),
    });

    // THEN
    Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      Stages: [
        Match.objectLike({ Name: 'Source' }),
        Match.objectLike({ Name: 'Build' }),
        Match.objectLike({ Name: 'UpdatePipeline' }),
      ],
    });
  },
  );
});

describe('with custom Source stage in existing Pipeline', () => {
  beforeEach(() => {
    codePipeline = new cp.Pipeline(pipelineStack, 'CodePipeline', {
      stages: [
        {
          stageName: 'CustomSource',
          actions: [new cpa.GitHubSourceAction({
            actionName: 'GitHub',
            output: sourceArtifact,
            oauthToken: SecretValue.unsafePlainText('$3kr1t'),
            owner: 'test',
            repo: 'test',
            trigger: cpa.GitHubTrigger.POLL,
          })],
        },
      ],
    });
  });

  test('Work with synthAction', () => {

    new cdkp.CodePipeline(pipelineStack, 'Cdk', {
      codePipeline,
      synth: new cdkp.ShellStep('Synth', {
        input: cdkp.CodePipelineFileSet.fromArtifact(sourceArtifact),
        commands: ['true'],
      }),
    });

    // THEN
    Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      Stages: [
        Match.objectLike({ Name: 'CustomSource' }),
        Match.objectLike({ Name: 'Build' }),
        Match.objectLike({ Name: 'UpdatePipeline' }),
      ],
    });
  },
  );
});

test('can add another action to an existing stage', () => {
  const pipeline = new ModernTestGitHubNpmPipeline(pipelineStack, 'Cdk');
  pipeline.buildPipeline();

  pipeline.pipeline.stages[0].addAction(new cpa.GitHubSourceAction({
    actionName: 'GitHub2',
    oauthToken: SecretValue.unsafePlainText('oops'),
    output: new cp.Artifact(),
    owner: 'OWNER',
    repo: 'REPO',
  }));

  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
    Stages: Match.arrayWith([{
      Name: 'Source',
      Actions: [
        Match.objectLike({ ActionTypeId: Match.objectLike({ Provider: 'GitHub' }) }),
        Match.objectLike({ ActionTypeId: Match.objectLike({ Provider: 'GitHub' }), Name: 'GitHub2' }),
      ],
    }]),
  });
});

