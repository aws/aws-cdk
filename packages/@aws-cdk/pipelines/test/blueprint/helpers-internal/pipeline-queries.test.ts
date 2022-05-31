/* eslint-disable import/no-extraneous-dependencies */
import * as cdkp from '../../../lib';
import { PipelineQueries } from '../../../lib/helpers-internal/pipeline-queries';
import { AppWithOutput, TestApp } from '../../testhelpers/test-app';

let app: TestApp;

beforeEach(() => {
  app = new TestApp();
});

afterEach(() => {
  app.cleanup();
});

describe('pipeline-queries', () => {

  describe('stackOutputsReferenced', () => {
    let blueprint: Blueprint;
    let stageDeployment: cdkp.StageDeployment;
    let step: cdkp.ShellStep;
    let queries: PipelineQueries;
    let stackDeployment: cdkp.StackDeployment;
    let outputName: string | undefined;
    beforeEach(() => {
      blueprint = new Blueprint(app, 'Bp', {
        synth: new cdkp.ShellStep('Synth', {
          input: cdkp.CodePipelineSource.gitHub('test/test', 'main'),
          commands: ['build'],
        }),
      });
      const stage = new AppWithOutput(app, 'CrossAccount');
      outputName = 'MyOutput';
      stageDeployment = blueprint.addStage(stage);
      stackDeployment = stageDeployment.stacks[0];
      expect(stackDeployment).not.toBeUndefined();
      step = new cdkp.ShellStep('test', {
        input: cdkp.CodePipelineSource.gitHub('test/test', 'main'),
        commands: ['build'],
        envFromCfnOutputs: {
          INPUT: stage.theOutput,
        },
      });
      queries = new PipelineQueries(blueprint);
    });

    const cases = [
      {
        description: 'output referenced in stage pre step',
        additionalSetup: () => stageDeployment.addPre(step),
        expectedResultGetter: () => [outputName],
      },
      {
        description: 'output referenced in stage post step',
        additionalSetup: () => stageDeployment.addPost(step),
        expectedResultGetter: () => [outputName],
      },
      {
        description: 'output referenced in stack pre step',
        additionalSetup: () => stackDeployment.addStackSteps([step], [], []),
        expectedResultGetter: () => [outputName],
      },
      {
        description: 'output referenced in stack changeSet step',
        additionalSetup: () => stackDeployment.addStackSteps([], [step], []),
        expectedResultGetter: () => [outputName],
      },
      {
        description: 'output referenced in stack post step',
        additionalSetup: () => stackDeployment.addStackSteps([], [], [step]),
        expectedResultGetter: () => [outputName],
      },
      {
        description: 'output not referenced',
        additionalSetup: () => { },
        expectedResultGetter: () => [],
      },

    ];

    cases.forEach(testCase => {
      test(testCase.description, () => {
        //WHEN
        testCase.additionalSetup();

        //THEN
        expect(queries.stackOutputsReferenced(stackDeployment)).toEqual(testCase.expectedResultGetter());
      });
    });

  });
});


class Blueprint extends cdkp.PipelineBase {
  protected doBuildPipeline(): void {
  }
}
