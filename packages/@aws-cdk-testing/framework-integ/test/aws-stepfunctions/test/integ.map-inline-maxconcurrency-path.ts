import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';

/*
 * An inline Map state that reads its maximum concurrency from the state input.
 * `maxConcurrency` only accepts an integer; a JSON path must be passed as
 * `maxConcurrencyPath`, which renders `MaxConcurrencyPath`.
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'cdk-stepfunctions-map-inline-maxconcurrency-path-stack');

const map = new sfn.Map(stack, 'Map', {
  maxConcurrencyPath: sfn.JsonPath.stringAt('$.maxConcurrency'),
  itemsPath: sfn.JsonPath.stringAt('$.inputForMap'),
});
map.itemProcessor(new sfn.Pass(stack, 'Pass State'));

const stateMachine = new sfn.StateMachine(stack, 'StateMachine', {
  definitionBody: sfn.DefinitionBody.fromChainable(map),
  timeout: cdk.Duration.seconds(30),
});

const integ = new IntegTest(app, 'cdk-stepfunctions-map-inline-maxconcurrency-path-integ', {
  testCases: [stack],
});

const start = integ.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: stateMachine.stateMachineArn,
  input: JSON.stringify({ maxConcurrency: 2, inputForMap: [1, 2, 3] }),
});
integ.assertions.awsApiCall('StepFunctions', 'describeExecution', {
  executionArn: start.getAttString('executionArn'),
}).expect(ExpectedResult.objectLike({
  status: 'SUCCEEDED',
})).waitForAssertions({
  totalTimeout: cdk.Duration.seconds(30),
  interval: cdk.Duration.seconds(3),
});
