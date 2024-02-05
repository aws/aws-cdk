import { HttpApi, HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { App, Stack } from 'aws-cdk-lib';
import { HttpStepFunctionsIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'stepfunctions-integration');

const stateMachine = new sfn.StateMachine(stack, 'RouteStateMachine', {
  definition: new sfn.Pass(stack, 'Pass'),
});

const httpApi = new HttpApi(stack, 'Api');
httpApi.addRoutes({
  path: '/test',
  methods: [HttpMethod.POST],
  integration: new HttpStepFunctionsIntegration('Integration', {
    stateMachine: stateMachine,
  }),
});

new integ.IntegTest(app, 'stepfunctions-integration-integ-test', {
  testCases: [stack],
});
app.synth();