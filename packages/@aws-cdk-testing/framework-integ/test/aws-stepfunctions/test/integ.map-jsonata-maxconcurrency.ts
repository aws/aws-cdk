import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';

/**
 * Stack verification steps:
 *
 * -- aws stepfunctions describe-state-machine --state-machine-arn <stack-output> has a status of `ACTIVE`
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'cdk-stepfunctions-map-jsonata-maxconcurrency-stack');

const map = new sfn.Map(stack, 'Map', {
  queryLanguage: sfn.QueryLanguage.JSONATA,
  stateName: 'My-Map-State',
  jsonataMaxConcurrency: '{% $states.input.maxConcurrency %}',
  items: sfn.ProvideItems.jsonata('{% $states.input.items %}'),
});
map.itemProcessor(new sfn.Pass(stack, 'Pass State'));

const sm = new sfn.StateMachine(stack, 'StateMachine', {
  definition: map,
  timeout: cdk.Duration.seconds(30),
});

const testCase = new IntegTest(app, 'cdk-stepfunctions-map-jsonata-maxconcurrency-integ', {
  testCases: [stack],
});

testCase.assertions.awsApiCall('StepFunctions', 'describeStateMachine', {
  stateMachineArn: sm.stateMachineArn,
}).expect(ExpectedResult.objectLike({
  status: 'ACTIVE',
}));
