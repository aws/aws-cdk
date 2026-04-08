import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
/*
 * Stack verification steps:
 *
 * -- aws stepfunctions describe-state-machine --state-machine-arn <stack-output> has a status of `ACTIVE`
 * -- the definition contains TimeoutSeconds and Comment injected from CDK props
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-string-definition-props');

new sfn.StateMachine(stack, 'StateMachine', {
  definitionBody: sfn.DefinitionBody.fromString(JSON.stringify({
    StartAt: 'Pass',
    States: {
      Pass: { Type: 'Pass', End: true },
    },
  })),
  timeout: cdk.Duration.hours(1),
  comment: 'integ test state machine',
});

new IntegTest(app, 'IntegTest', {
  testCases: [stack],
});

app.synth();
