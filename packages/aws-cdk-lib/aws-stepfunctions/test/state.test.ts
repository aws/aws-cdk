import { FakeTask } from './fake-task';
import * as assert from '../../assertions';
import * as cdk from '../../core';
import { DefinitionBody, JsonPath, StateMachine } from '../lib';

test('JsonPath.DISCARD can be used to discard a state\'s output', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');
  const task = new FakeTask(stack, 'my-state', {
    inputPath: JsonPath.DISCARD,
    outputPath: JsonPath.DISCARD,
    resultPath: JsonPath.DISCARD,
  });
  new StateMachine(stack, 'state-machine', {
    definitionBody: DefinitionBody.fromChainable(task),
  });

  // WHEN
  const definitionString = new assert.Capture();
  assert.Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
    DefinitionString: definitionString,
  });

  // THEN
  const definition = JSON.parse(definitionString.asString());

  expect(definition).toMatchObject({
    States: {
      'my-state': {
        InputPath: null,
        OutputPath: null,
        ResultPath: null,
      },
    },
  });
});
