import { expect, haveResourceLike } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import codepipeline = require('../lib');
import validations = require('../lib/validation');
import { FakeBuildAction } from './fake-build-action';
import { FakeSourceAction } from './fake-source-action';

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
      const result = validations.validateSourceAction(true, codepipeline.ActionCategory.SOURCE, 'test action', 'test stage');
      test.deepEqual(result.length, 0);
      test.done();
    },

    'must be source and is not source'(test: Test) {
      const result = validations.validateSourceAction(true, codepipeline.ActionCategory.DEPLOY, 'test action', 'test stage');
      test.deepEqual(result.length, 1);
      test.ok(result[0].match(/may only contain Source actions/), 'the validation should have failed');
      test.done();
    },

    'cannot be source and is source'(test: Test) {
      const result = validations.validateSourceAction(false, codepipeline.ActionCategory.SOURCE, 'test action', 'test stage');
      test.deepEqual(result.length, 1);
      test.ok(result[0].match(/may only occur in first stage/), 'the validation should have failed');
      test.done();
    },

    'cannot be source and is not source'(test: Test) {
      const result = validations.validateSourceAction(false, codepipeline.ActionCategory.DEPLOY, 'test action', 'test stage');
      test.deepEqual(result.length, 0);
      test.done();
    },
  },

  'action Artifacts validation': {
    'validates that input Artifacts are within bounds'(test: Test) {
      const stack = new cdk.Stack();
      const sourceOutput = new codepipeline.Artifact();
      const extraOutput1 = new codepipeline.Artifact('A1');
      const extraOutput2 = new codepipeline.Artifact('A2');
      const extraOutput3 = new codepipeline.Artifact('A3');

      new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [
              new FakeSourceAction({
                actionName: 'Source',
                output: sourceOutput,
                extraOutputs: [
                  extraOutput1,
                  extraOutput2,
                  extraOutput3,
                ],
              }),
            ],
          },
          {
            stageName: 'Build',
            actions: [
              new FakeBuildAction({
                actionName: 'Build',
                input: sourceOutput,
                extraInputs: [
                  extraOutput1,
                  extraOutput2,
                  extraOutput3,
                ],
              }),
            ],
          },
        ],
      });

      test.throws(() => {
        expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
        }));
      }, /Build\/Fake cannot have more than 3 input artifacts/);

      test.done();
    },

    'validates that output Artifacts are within bounds'(test: Test) {
      const stack = new cdk.Stack();
      const sourceOutput = new codepipeline.Artifact();
      const extraOutput1 = new codepipeline.Artifact('A1');
      const extraOutput2 = new codepipeline.Artifact('A2');
      const extraOutput3 = new codepipeline.Artifact('A3');
      const extraOutput4 = new codepipeline.Artifact('A4');

      new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [
              new FakeSourceAction({
                actionName: 'Source',
                output: sourceOutput,
                extraOutputs: [
                  extraOutput1,
                  extraOutput2,
                  extraOutput3,
                  extraOutput4,
                ],
              }),
            ],
          },
          {
            stageName: 'Build',
            actions: [
              new FakeBuildAction({
                actionName: 'Build',
                input: sourceOutput,
              }),
            ],
          },
        ],
      });

      test.throws(() => {
        expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
        }));
      }, /Source\/Fake cannot have more than 4 output artifacts/);

      test.done();
    },
  },

  'automatically assigns artifact names to the Actions'(test: Test) {
    const stack = new cdk.Stack();
    const pipeline = new codepipeline.Pipeline(stack, 'pipeline');

    const sourceOutput = new codepipeline.Artifact();
    const sourceAction = new FakeSourceAction({
      actionName: 'CodeCommit',
      output: sourceOutput,
    });
    pipeline.addStage({
      stageName: 'Source',
      actions: [sourceAction],
    });

    pipeline.addStage({
      stageName: 'Build',
      actions: [
        new FakeBuildAction({
          actionName: 'CodeBuild',
          input: sourceOutput,
          output: new codepipeline.Artifact(),
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
                  "Name": "Artifact_Source_CodeCommit",
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
                  "Name": "Artifact_Source_CodeCommit",
                }
              ],
              "OutputArtifacts": [
                {
                  "Name": "Artifact_Build_CodeBuild",
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

    const sourceOutput = new codepipeline.Artifact();
    const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
      stages: [
        {
          stageName: 'Source',
          actions: [
            new FakeSourceAction({
              actionName: 'Source',
              output: sourceOutput,
            }),
          ],
        },
      ],
    });

    const action = new FakeBuildAction({ actionName: 'FakeAction', input: sourceOutput });
    const stage2: codepipeline.StageProps = {
      stageName: 'Stage2',
      actions: [action],
    };
    const stage3: codepipeline.StageProps = {
      stageName: 'Stage3',
      actions: [action],
    };

    pipeline.addStage(stage2); // fine
    test.throws(() => {
      pipeline.addStage(stage3);
    }, /FakeAction/);

    test.done();
  },

  'input Artifacts': {
    'can be added multiple times to an Action safely'(test: Test) {
      const artifact = new codepipeline.Artifact('SomeArtifact');
      const action = new FakeBuildAction({
        actionName: 'CodeBuild',
        input: artifact,
        extraInputs: [artifact],
      });

      test.equal(action.inputs.length, 1);

      test.done();
    },

    'can have duplicate names'(test: Test) {
      const artifact1 = new codepipeline.Artifact('SomeArtifact');
      const artifact2 = new codepipeline.Artifact('SomeArtifact');

      test.doesNotThrow(() => {
        new FakeBuildAction({
          actionName: 'CodeBuild',
          input: artifact1,
          extraInputs: [artifact2],
        });
      });

      test.done();
    },
  },

  'output Artifacts': {
    'accept multiple Artifacts with the same name safely'(test: Test) {
      const action = new FakeSourceAction({
        actionName: 'CodeBuild',
        output: new codepipeline.Artifact('Artifact1'),
        extraOutputs: [
          new codepipeline.Artifact('Artifact1'),
          new codepipeline.Artifact('Artifact1'),
        ],
      });

      test.equal(action.outputs.length, 1);

      test.done();
    },
  },
};

function boundsValidationResult(numberOfArtifacts: number, min: number, max: number): string[] {
  const artifacts: codepipeline.Artifact[] = [];
  for (let i = 0; i < numberOfArtifacts; i++) {
    artifacts.push(new codepipeline.Artifact(`TestArtifact${i}`));
  }
  return validations.validateArtifactBounds('output', artifacts, min, max, 'testCategory', 'testProvider');
}
