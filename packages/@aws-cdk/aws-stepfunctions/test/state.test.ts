import * as cdk from '@aws-cdk/core';
import { FakeTask } from './integ.state-machine-credentials';
import { renderGraph } from './private/render-util';
import { JsonPath } from '../lib';

test('JsonPath.DISCARD can be used to discard a state\'s output', () => {
  const stack = new cdk.Stack();

  const task = new FakeTask(stack, 'my-state', {
    inputPath: JsonPath.DISCARD,
    outputPath: JsonPath.DISCARD,
    resultPath: JsonPath.DISCARD,
  });

  expect(renderGraph(task)).toEqual({
    StartAt: 'my-state',
    States: {
      'my-state': {
        End: true,
        Type: 'Task',
        Resource: expect.any(String),
        Parameters: expect.any(Object),
        // The important bits:
        InputPath: null,
        OutputPath: null,
        ResultPath: null,
      },
    },
  });
});
