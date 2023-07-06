import * as iot from '@aws-cdk/aws-iot-alpha';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as actions from '../../lib';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'test-step-functions-start-state-machine-action-stack');

const topicRule = new iot.TopicRule(stack, 'TopicRule', {
  sql: iot.IotSql.fromStringAsVer20160323(
    "SELECT * FROM 'device/+/data'",
  ),
});

const stateMachine = new sfn.StateMachine(stack, 'SM', {
  definitionBody: sfn.DefinitionBody.fromChainable(new sfn.Wait(stack, 'Hello', { time: sfn.WaitTime.duration(cdk.Duration.seconds(10)) })),
});

topicRule.addAction(new actions.StepFunctionsStateMachineAction(stateMachine));

new integ.IntegTest(app, 'state-machine-integtest', {
  testCases: [stack],
});

app.synth();
