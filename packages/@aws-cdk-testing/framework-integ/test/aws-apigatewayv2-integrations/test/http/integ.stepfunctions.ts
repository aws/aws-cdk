import { HttpApi } from 'aws-cdk-lib/aws-apigatewayv2';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { App, Stack } from 'aws-cdk-lib';
import { HttpStepFunctionsIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'stepfunctions-integration');

const stateMachine = new sfn.StateMachine(stack, 'StateMachine', {
  definition: new sfn.Pass(stack, 'Pass'),
});

new HttpApi(stack, 'Api', {
  defaultIntegration: new HttpStepFunctionsIntegration('DefaultIntegration', {
    stateMachine,
  }),
});

new integ.IntegTest(app, 'stepfunctions-integration-integ-test', {
  testCases: [stack],
});
app.synth();