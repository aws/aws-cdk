import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-integ');

new sfn.StateMachine(stack, 'StateMachine', {
  comment: 'a super cool state machine',
  definition: new sfn.Pass(stack, 'StartState'),
  tracingEnabled: false,
});

new IntegTest(app, 'StateMachineDisableXray', { testCases: [stack] });
