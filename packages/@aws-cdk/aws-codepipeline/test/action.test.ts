import { expect, haveResourceLike } from '@aws-cdk/assert-internal';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import * as codepipeline from '../lib';
import * as validations from '../lib/private/validation';
import { FakeBuildAction } from './fake-build-action';
import { FakeSourceAction } from './fake-source-action';

/* eslint-disable quote-props */

nodeunitShim({
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

  'action name validation': {
    'throws an exception when adding an Action with an empty name to the Pipeline'(test: Test) {
      const stack = new cdk.Stack();
      const action = new FakeSourceAction({
        actionName: '',
        output: new codepipeline.Artifact(),
      });

      const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');
      const stage = pipeline.addStage({ stageName: 'Source' });
      test.throws(() => {
        stage.addAction(action);
      }, /Action name must match regular expression:/);

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
      'Stages': [
        {
          'Name': 'Source',
          'Actions': [
            {
              'Name': 'CodeCommit',
              'OutputArtifacts': [
                {
                  'Name': 'Artifact_Source_CodeCommit',
                },
              ],
            },
          ],
        },
        {
          'Name': 'Build',
          'Actions': [
            {
              'Name': 'CodeBuild',
              'InputArtifacts': [
                {
                  'Name': 'Artifact_Source_CodeCommit',
                },
              ],
              'OutputArtifacts': [
                {
                  'Name': 'Artifact_Build_CodeBuild',
                },
              ],
            },
          ],
        },
      ],
    }));

    test.done();
  },

  'the same Action can be safely added to 2 different Stages'(test: Test) {
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

    pipeline.addStage(stage2);
    test.doesNotThrow(() => {
      pipeline.addStage(stage3);
    }, /FakeAction/);

    test.done();
  },

  'input Artifacts': {
    'can be added multiple times to an Action safely'(test: Test) {
      const artifact = new codepipeline.Artifact('SomeArtifact');

      test.doesNotThrow(() => {
        new FakeBuildAction({
          actionName: 'CodeBuild',
          input: artifact,
          extraInputs: [artifact],
        });
      });

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
      test.doesNotThrow(() => {
        new FakeSourceAction({
          actionName: 'CodeBuild',
          output: new codepipeline.Artifact('Artifact1'),
          extraOutputs: [
            new codepipeline.Artifact('Artifact1'),
            new codepipeline.Artifact('Artifact1'),
          ],
        });
      });

      test.done();
    },
  },

  'an Action with a non-AWS owner cannot have a Role passed for it'(test: Test) {
    const stack = new cdk.Stack();

    const sourceOutput = new codepipeline.Artifact();
    const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
      stages: [
        {
          stageName: 'Source',
          actions: [
            new FakeSourceAction({
              actionName: 'source',
              output: sourceOutput,
            }),
          ],
        },
      ],
    });
    const buildStage = pipeline.addStage({ stageName: 'Build' });

    // constructing it is fine
    const buildAction = new FakeBuildAction({
      actionName: 'build',
      input: sourceOutput,
      owner: 'ThirdParty',
      role: new iam.Role(stack, 'Role', {
        assumedBy: new iam.AnyPrincipal(),
      }),
    });

    // an attempt to add it to the Pipeline is where things blow up
    test.throws(() => {
      buildStage.addAction(buildAction);
    }, /Role is not supported for actions with an owner different than 'AWS' - got 'ThirdParty' \(Action: 'build' in Stage: 'Build'\)/);

    test.done();
  },

  'actions can be retrieved from stages they have been added to'(test: Test) {
    const stack = new cdk.Stack();

    const sourceOutput = new codepipeline.Artifact();
    const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
      stages: [
        {
          stageName: 'Source',
          actions: [
            new FakeSourceAction({
              actionName: 'source',
              output: sourceOutput,
            }),
          ],
        },
      ],
    });
    const sourceStage = pipeline.stages[0];
    const buildStage = pipeline.addStage({
      stageName: 'Build',
      actions: [
        new FakeBuildAction({
          actionName: 'build1',
          input: sourceOutput,
          runOrder: 11,
        }),
        new FakeBuildAction({
          actionName: 'build2',
          input: sourceOutput,
          runOrder: 2,
        }),
      ],
    });

    test.equal(sourceStage.actions.length, 1);
    test.equal(sourceStage.actions[0].actionProperties.actionName, 'source');

    test.equal(buildStage.actions.length, 2);
    test.equal(buildStage.actions[0].actionProperties.actionName, 'build1');
    test.equal(buildStage.actions[1].actionProperties.actionName, 'build2');

    test.done();
  },
});

function boundsValidationResult(numberOfArtifacts: number, min: number, max: number): string[] {
  const artifacts: codepipeline.Artifact[] = [];
  for (let i = 0; i < numberOfArtifacts; i++) {
    artifacts.push(new codepipeline.Artifact(`TestArtifact${i}`));
  }
  return validations.validateArtifactBounds('output', artifacts, min, max, 'testCategory', 'testProvider');
}
