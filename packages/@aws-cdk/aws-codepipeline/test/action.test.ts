import { Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { FakeBuildAction } from './fake-build-action';
import { FakeSourceAction } from './fake-source-action';
import * as codepipeline from '../lib';
import * as validations from '../lib/private/validation';

/* eslint-disable quote-props */

describe('action', () => {
  describe('artifact bounds validation', () => {
    test('artifacts count exceed maximum', () => {
      const result = boundsValidationResult(1, 0, 0);
      expect(result.length).toEqual(1);
      expect(result[0]).toMatch(/cannot have more than 0/);
    });

    test('artifacts count below minimum', () => {
      const result = boundsValidationResult(1, 2, 2);
      expect(result.length).toEqual(1);
      expect(result[0]).toMatch(/must have at least 2/);
    });

    test('artifacts count within bounds', () => {
      const result = boundsValidationResult(1, 0, 2);
      expect(result.length).toEqual(0);
    });
  });

  describe('action type validation', () => {
    test('must be source and is source', () => {
      const result = validations.validateSourceAction(true, codepipeline.ActionCategory.SOURCE, 'test action', 'test stage');
      expect(result.length).toEqual(0);
    });

    test('must be source and is not source', () => {
      const result = validations.validateSourceAction(true, codepipeline.ActionCategory.DEPLOY, 'test action', 'test stage');
      expect(result.length).toEqual(1);
      expect(result[0]).toMatch(/may only contain Source actions/);
    });

    test('cannot be source and is source', () => {
      const result = validations.validateSourceAction(false, codepipeline.ActionCategory.SOURCE, 'test action', 'test stage');
      expect(result.length).toEqual(1);
      expect(result[0]).toMatch(/may only occur in first stage/);
    });

    test('cannot be source and is not source', () => {
      const result = validations.validateSourceAction(false, codepipeline.ActionCategory.DEPLOY, 'test action', 'test stage');
      expect(result.length).toEqual(0);
    });
  });

  describe('action name validation', () => {
    test('throws an exception when adding an Action with an empty name to the Pipeline', () => {
      const stack = new cdk.Stack();
      const action = new FakeSourceAction({
        actionName: '',
        output: new codepipeline.Artifact(),
      });

      const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');
      const stage = pipeline.addStage({ stageName: 'Source' });
      expect(() => {
        stage.addAction(action);
      }).toThrow(/Action name must match regular expression:/);
    });
  });

  describe('action Artifacts validation', () => {
    test('validates that input Artifacts are within bounds', () => {
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

      expect(() => {
        Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
        });
      }).toThrow(/Build\/Fake cannot have more than 3 input artifacts/);
    });

    test('validates that output Artifacts are within bounds', () => {
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

      expect(() => {
        Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
        });
      }).toThrow(/Source\/Fake cannot have more than 4 output artifacts/);
    });
  });

  test('automatically assigns artifact names to the Actions', () => {
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

    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
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
    });
  });

  test('the same Action can be safely added to 2 different Stages', () => {
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
    expect(() => {
      pipeline.addStage(stage3);
    }).not.toThrow(/FakeAction/);
  });

  describe('input Artifacts', () => {
    test('can be added multiple times to an Action safely', () => {
      const artifact = new codepipeline.Artifact('SomeArtifact');

      expect(() => {
        new FakeBuildAction({
          actionName: 'CodeBuild',
          input: artifact,
          extraInputs: [artifact],
        });
      }).not.toThrow();
    });

    test('can have duplicate names', () => {
      const artifact1 = new codepipeline.Artifact('SomeArtifact');
      const artifact2 = new codepipeline.Artifact('SomeArtifact');

      expect(() => {
        new FakeBuildAction({
          actionName: 'CodeBuild',
          input: artifact1,
          extraInputs: [artifact2],
        });
      }).not.toThrow();
    });
  });

  describe('output Artifacts', () => {
    test('accept multiple Artifacts with the same name safely', () => {
      expect(() => {
        new FakeSourceAction({
          actionName: 'CodeBuild',
          output: new codepipeline.Artifact('Artifact1'),
          extraOutputs: [
            new codepipeline.Artifact('Artifact1'),
            new codepipeline.Artifact('Artifact1'),
          ],
        });
      }).not.toThrow();
    });
  });

  test('an Action with a non-AWS owner cannot have a Role passed for it', () => {
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
    expect(() => {
      buildStage.addAction(buildAction);
    }).toThrow(/Role is not supported for actions with an owner different than 'AWS' - got 'ThirdParty' \(Action: 'build' in Stage: 'Build'\)/);
  });

  test('actions can be retrieved from stages they have been added to', () => {
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

    expect(sourceStage.actions.length).toEqual(1);
    expect(sourceStage.actions[0].actionProperties.actionName).toEqual('source');

    expect(buildStage.actions.length).toEqual(2);
    expect(buildStage.actions[0].actionProperties.actionName).toEqual('build1');
    expect(buildStage.actions[1].actionProperties.actionName).toEqual('build2');
  });
});

function boundsValidationResult(numberOfArtifacts: number, min: number, max: number): string[] {
  const artifacts: codepipeline.Artifact[] = [];
  for (let i = 0; i < numberOfArtifacts; i++) {
    artifacts.push(new codepipeline.Artifact(`TestArtifact${i}`));
  }
  return validations.validateArtifactBounds('output', artifacts, min, max, 'testCategory', 'testProvider');
}
