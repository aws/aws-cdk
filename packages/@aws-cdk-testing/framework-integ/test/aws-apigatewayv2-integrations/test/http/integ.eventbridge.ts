import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as events from 'aws-cdk-lib/aws-events';
import { App, Stack } from 'aws-cdk-lib';
import { HttpEventBridgeIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'eventbridge-integration');

const bus = new events.EventBus(stack, 'Bus');

const httpApi = new apigwv2.HttpApi(stack, 'Api');
httpApi.addRoutes({
  path: '/default',
  methods: [apigwv2.HttpMethod.POST],
  integration: new HttpEventBridgeIntegration('defaultIntegration', {
    eventBusRef: bus.eventBusRef,
  }),
});

httpApi.addRoutes({
  path: '/put-events',
  methods: [apigwv2.HttpMethod.POST],
  integration: new HttpEventBridgeIntegration('putEventsIntegration', {
    eventBusRef: bus.eventBusRef,
    subtype: apigwv2.HttpIntegrationSubtype.EVENTBRIDGE_PUT_EVENTS,
  }),
});

const integTest = new integ.IntegTest(app, 'EventBridgeIntegrationIntegTest', {
  testCases: [stack],
});

const defaultAssertion = integTest.assertions.httpApiCall(
  `${httpApi.apiEndpoint}/default`, {
    body: JSON.stringify({ Detail: JSON.stringify({ message: 'Hello World!' }), DetailType: 'MyDetailType', Source: 'my.source' }),
    method: 'POST',
  },
);
defaultAssertion.expect(integ.ExpectedResult.objectLike({ status: 200, statusText: 'OK' }));

const putEventsAssertion = integTest.assertions.httpApiCall(
  `${httpApi.apiEndpoint}/put-events`, {
    body: JSON.stringify({ Detail: JSON.stringify({ message: 'Hello Again!' }), DetailType: 'MyDetailType', Source: 'my.source' }),
    method: 'POST',
  },
);
putEventsAssertion.expect(integ.ExpectedResult.objectLike({ status: 200, statusText: 'OK' }));
