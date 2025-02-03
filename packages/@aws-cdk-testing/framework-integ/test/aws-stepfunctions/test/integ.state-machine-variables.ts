import * as cdk from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { executionSync } from './util';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-state-machine-variables-integ');

const step1 = sfn.Pass.jsonata(stack, 'Step1', {
  assign: { count: '{% $states.input.init + 1 %}' },
});
const step2 = sfn.Pass.jsonPath(stack, 'Step2', {
  assign: {
    count: sfn.JsonPath.mathAdd(
      sfn.JsonPath.numberAt('$count'),
      1,
    ),
  },
});
const step3 = sfn.Pass.jsonata(stack, 'Step3', {
  assign: { count: '{% $count + 1 %}' },
});
const step4 = sfn.Pass.jsonPath(stack, 'Step4', {
  assign: {
    count: sfn.JsonPath.mathAdd(
      sfn.JsonPath.numberAt('$count'),
      1,
    ),
  },
});
const step5 = sfn.Pass.jsonata(stack, 'Step5', {
  outputs: { count: '{% $count + 1 %}' },
});

const stateMachine = new sfn.StateMachine(stack, 'StateMachine', {
  definitionBody: sfn.DefinitionBody.fromChainable(
    step1.next(
      step2.next(
        step3.next(
          step4.next(
            step5,
          ),
        ),
      ),
    ),
  ),
});

const testCase = new IntegTest(app, 'StateMachineVariables', { testCases: [stack] });
const result = executionSync(testCase, stateMachine, {
  init: 1,
});

// assert the results
result.expect(ExpectedResult.objectLike({
  status: 'SUCCEEDED',
  output: JSON.stringify({
    count: 6,
  }),
})).waitForAssertions({
  interval: cdk.Duration.seconds(10),
  totalTimeout: cdk.Duration.minutes(2),
});
