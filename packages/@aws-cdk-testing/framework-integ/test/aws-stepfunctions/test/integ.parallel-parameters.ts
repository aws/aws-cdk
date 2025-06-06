import * as cdk from 'aws-cdk-lib';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { IntegTest, ExpectedResult, Match } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-integ');

const firstPassBranch = new sfn.Pass(stack, 'Pass Branch 1', {
  resultPath: sfn.JsonPath.DISCARD,
});

const secondPassBranch = new sfn.Pass(stack, 'Pass Branch 2', {
  resultPath: sfn.JsonPath.DISCARD,
});

const parallel = new sfn.Parallel(stack, 'ParallelWithParams', {
  parameters: {
    'staticValue': 'hello',
    'dynamicValue.$': '$.inputField',
    'execId.$': '$$.Execution.Id',
  },
});

parallel.branch(firstPassBranch);
parallel.branch(secondPassBranch);

const sm = new sfn.StateMachine(stack, 'StateMachine', {
  definition: parallel,
});

const integ = new IntegTest(app, 'ParallelParametersTest', {
  testCases: [stack],
});

const execution = integ.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: sm.stateMachineArn,
  input: JSON.stringify({ inputField: 'world' }),
});

integ.assertions.awsApiCall('StepFunctions', 'describeExecution', {
  executionArn: execution.getAttString('executionArn'),
}).expect(ExpectedResult.objectLike({
  status: 'SUCCEEDED',
  output: Match.serializedJson(
    Match.arrayWith([
      Match.objectLike({
        staticValue: 'hello',
        dynamicValue: 'world',
        execId: Match.stringLikeRegexp('.+'),
      }),
      Match.objectLike({
        staticValue: 'hello',
        dynamicValue: 'world',
        execId: Match.stringLikeRegexp('.+'),
      }),
    ]),
  ),
})).waitForAssertions({
  totalTimeout: cdk.Duration.seconds(30),
  interval: cdk.Duration.seconds(5),
});

app.synth();

