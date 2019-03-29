import { expect, haveResourceLike } from '@aws-cdk/assert';
import codebuild = require('@aws-cdk/aws-codebuild');
import codecommit = require('@aws-cdk/aws-codecommit');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import cpactions = require('../lib');

// tslint:disable:object-literal-key-quotes

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
      const result = codepipeline.validateSourceAction(true, codepipeline.ActionCategory.Source, 'test action', 'test stage');
      test.deepEqual(result.length, 0);
      test.done();
    },

    'must be source and is not source'(test: Test) {
      const result = codepipeline.validateSourceAction(true, codepipeline.ActionCategory.Deploy, 'test action', 'test stage');
      test.deepEqual(result.length, 1);
      test.ok(result[0].match(/may only contain Source actions/), 'the validation should have failed');
      test.done();
    },

    'cannot be source and is source'(test: Test) {
      const result = codepipeline.validateSourceAction(false, codepipeline.ActionCategory.Source, 'test action', 'test stage');
      test.deepEqual(result.length, 1);
      test.ok(result[0].match(/may only occur in first stage/), 'the validation should have failed');
      test.done();
    },

    'cannot be source and is not source'(test: Test) {
      const result = codepipeline.validateSourceAction(false, codepipeline.ActionCategory.Deploy, 'test action', 'test stage');
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
    const sourceAction = new cpactions.CodeCommitSourceAction({
      actionName: 'CodeCommit',
      repository: repo,
    });
    pipeline.addStage({
      name: 'Source',
      actions: [sourceAction],
    });

    const project = new codebuild.PipelineProject(stack, 'Project');
    pipeline.addStage({
      name: 'Build',
      actions: [
        new cpactions.CodeBuildBuildAction({
          actionName: 'CodeBuild',
          project,
          inputArtifact: sourceAction.outputArtifact,
        }),
      ],
    });

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
                  "Name": "Artifact_CodeCommit_Repo",
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
                  "Name": "Artifact_CodeCommit_Repo",
                }
              ],
              "OutputArtifacts": [
                {
                  "Name": "Artifact_CodeBuild_Project",
                },
              ],
            }
          ],
        },
      ],
    }));

    test.done();
  },

  'the same Action cannot be added to 2 different Stages'(test: Test) {
    const stack = new cdk.Stack();
    const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');
    const action = new FakeAction('FakeAction');

    const stage1 = {
      name: 'Stage1',
      actions: [
        action,
      ],
    };
    const stage2 = {
      name: 'Stage2',
      actions: [action],
    };

    pipeline.addStage(stage1); // fine

    test.throws(() => {
      pipeline.addStage(stage2);
    }, /FakeAction/);

    test.done();
  },

  'input Artifacts': {
    'can be added multiple times to an Action safely'(test: Test) {
      const artifact = new codepipeline.Artifact('SomeArtifact');

      const stack = new cdk.Stack();
      const project = new codebuild.PipelineProject(stack, 'Project');
      const action = new cpactions.CodeBuildBuildAction({
        actionName: 'CodeBuild',
        project,
        inputArtifact: artifact,
        additionalInputArtifacts: [artifact],
      });

      test.equal((action as any).actionInputArtifacts.length, 1);

      test.done();
    },

    'cannot have duplicate names'(test: Test) {
      const artifact1 = new codepipeline.Artifact('SomeArtifact');
      const artifact2 = new codepipeline.Artifact('SomeArtifact');

      const stack = new cdk.Stack();
      const project = new codebuild.PipelineProject(stack, 'Project');

      test.throws(() =>
        new cpactions.CodeBuildBuildAction({
          actionName: 'CodeBuild',
          project,
          inputArtifact: artifact1,
          additionalInputArtifacts: [artifact2],
        })
      , /SomeArtifact/);

      test.done();
    },
  },

  'output Artifact names': {
    'accept the same name multiple times safely'(test: Test) {
      const artifact = new codepipeline.Artifact('SomeArtifact');

      const stack = new cdk.Stack();
      const project = new codebuild.PipelineProject(stack, 'Project');
      const action = new cpactions.CodeBuildBuildAction({
        actionName: 'CodeBuild',
        project,
        inputArtifact: artifact,
        outputArtifactName: 'Artifact1',
        additionalOutputArtifactNames: [
          'Artifact1',
          'Artifact1',
        ],
      });

      test.equal((action as any).actionOutputArtifacts.length, 1);

      test.done();
    },
  },
};

function boundsValidationResult(numberOfArtifacts: number, min: number, max: number): string[] {
  const artifacts: codepipeline.Artifact[] = [];
  for (let i = 0; i < numberOfArtifacts; i++) {
    artifacts.push(new codepipeline.Artifact(`TestArtifact${i}`));
  }
  return codepipeline.validateArtifactBounds('output', artifacts, min, max, 'testCategory', 'testProvider');
}

class FakeAction extends codepipeline.Action {
  constructor(actionName: string) {
    super({
      actionName,
      category: codepipeline.ActionCategory.Source,
      provider: 'SomeService',
      artifactBounds: codepipeline.defaultBounds(),
    });
  }

  protected bind(_info: codepipeline.ActionBind): void {
    // do nothing
  }
}
