// import { validateArtifactBounds, validateSourceAction } from '../lib/validation';
import { expect, haveResourceLike } from '@aws-cdk/assert';
import codebuild = require('@aws-cdk/aws-codebuild');
import codecommit = require('@aws-cdk/aws-codecommit');
import actions = require('@aws-cdk/aws-codepipeline-api');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import codepipeline = require('../lib');

// tslint:disable:object-literal-key-quotes

class TestAction extends actions.Action {}

export = {
  'artifact bounds validation': {

    'artifacts count exceed maximum'(test: Test) {
      const result = boundsValidationResult(1, 0, 0);
      test.deepEqual(result.length, 1);
      test.ok(result[0].match(/cannot have more than 0/), 'the validation should have failed');
      test.done();
    },

    'artifacts count below minimum'(test: Test) {
      const result = boundsValidationResult(1, 2, 2);
      test.deepEqual(result.length, 1);
      test.ok(result[0].match(/must have at least 2/), 'the validation should have failed');
      test.done();
    },

    'artifacts count within bounds'(test: Test) {
      const result = boundsValidationResult(1, 0, 2);
      test.deepEqual(result.length, 0);
      test.done();
    },
  },

  'action type validation': {

    'must be source and is source'(test: Test) {
      const result = actions.validateSourceAction(true, actions.ActionCategory.Source, 'test action', 'test stage');
      test.deepEqual(result.length, 0);
      test.done();
    },

    'must be source and is not source'(test: Test) {
      const result = actions.validateSourceAction(true, actions.ActionCategory.Deploy, 'test action', 'test stage');
      test.deepEqual(result.length, 1);
      test.ok(result[0].match(/may only contain Source actions/), 'the validation should have failed');
      test.done();
    },

    'cannot be source and is source'(test: Test) {
      const result = actions.validateSourceAction(false, actions.ActionCategory.Source, 'test action', 'test stage');
      test.deepEqual(result.length, 1);
      test.ok(result[0].match(/may only occur in first stage/), 'the validation should have failed');
      test.done();
    },

    'cannot be source and is not source'(test: Test) {
      const result = actions.validateSourceAction(false, actions.ActionCategory.Deploy, 'test action', 'test stage');
      test.deepEqual(result.length, 0);
      test.done();
    },
  },

  'automatically assigns artifact names to the Actions'(test: Test) {
    const stack = new cdk.Stack();
    const pipeline = new codepipeline.Pipeline(stack, 'pipeline');

    const repo = new codecommit.Repository(stack, 'Repo', {
      repositoryName: 'Repo',
    });
    const sourceStage = pipeline.addStage('Source');
    repo.addToPipeline(sourceStage, 'CodeCommit');

    const project = new codebuild.PipelineProject(stack, 'Project');
    const buildStage = pipeline.addStage('Build');
    project.addToPipeline(buildStage, 'CodeBuild');

    expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
      "Stages": [
        {
          "Name": "Source",
          "Actions": [
            {
              "Name": "CodeCommit",
              "InputArtifacts": [],
              "OutputArtifacts": [
                {
                  "Name": "Artifact_RepoCodeCommit7910F5F9",
                },
              ],
            }
          ],
        },
        {
          "Name": "Build",
          "Actions": [
            {
              "Name": "CodeBuild",
              "InputArtifacts": [
                {
                  "Name": "Artifact_RepoCodeCommit7910F5F9",
                }
              ],
              "OutputArtifacts": [
                {
                  "Name": "Artifact_ProjectCodeBuildE34AD2EC",
                },
              ],
            }
          ],
        },
      ],
    }));

    test.done();
  },
};

function boundsValidationResult(numberOfArtifacts: number, min: number, max: number): string[] {
  const stack = new cdk.Stack();
  const pipeline = new codepipeline.Pipeline(stack, 'pipeline');
  const stage = new codepipeline.Stage(stack, 'stage', { pipeline });
  const action = new TestAction(stack, 'TestAction', {
    stage,
    artifactBounds: actions.defaultBounds(),
    category: actions.ActionCategory.Test,
    provider: 'test provider'
  });
  const artifacts: actions.Artifact[] = [];
  for (let i = 0; i < numberOfArtifacts; i++) {
    artifacts.push(new actions.Artifact(action, `TestArtifact${i}`));
  }
  return actions.validateArtifactBounds('output', artifacts, min, max, 'testCategory', 'testProvider');
}
