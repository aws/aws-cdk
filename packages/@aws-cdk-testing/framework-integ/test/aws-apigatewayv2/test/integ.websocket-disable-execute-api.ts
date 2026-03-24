import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';

const app = new App();
const stack = new Stack(app, 'WebSocketDisableExecuteApiStack');

new apigwv2.WebSocketApi(stack, 'Api', {
  disableExecuteApiEndpoint: true,
});

new IntegTest(app, 'WebSocketDisableExecuteApiInteg', {
  testCases: [stack],
});
