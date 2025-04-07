import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { App, Stack } from 'aws-cdk-lib';
import { HttpSqsIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'sqs-integration');

const queue = new sqs.Queue(stack, 'Queue');

const httpApi = new apigwv2.HttpApi(stack, 'Api');
httpApi.addRoutes({
  path: '/default',
  methods: [apigwv2.HttpMethod.POST],
  integration: new HttpSqsIntegration('defaultIntegration', {
    queue,
  }),
});
httpApi.addRoutes({
  path: '/send-message',
  methods: [apigwv2.HttpMethod.POST],
  integration: new HttpSqsIntegration('sendMessageIntegration', {
    queue,
    subtype: apigwv2.HttpIntegrationSubtype.SQS_SEND_MESSAGE,
  }),
});
httpApi.addRoutes({
  path: '/receive-message',
  methods: [apigwv2.HttpMethod.POST],
  integration: new HttpSqsIntegration('receiveMessageIntegration', {
    queue,
    subtype: apigwv2.HttpIntegrationSubtype.SQS_RECEIVE_MESSAGE,
  }),
});
httpApi.addRoutes({
  path: '/delete-message',
  methods: [apigwv2.HttpMethod.POST],
  integration: new HttpSqsIntegration('deleteMessageIntegration', {
    queue,
    subtype: apigwv2.HttpIntegrationSubtype.SQS_DELETE_MESSAGE,
  }),
});
httpApi.addRoutes({
  path: '/purge-queue',
  methods: [apigwv2.HttpMethod.POST],
  integration: new HttpSqsIntegration('purgeQueueIntegration', {
    queue,
    subtype: apigwv2.HttpIntegrationSubtype.SQS_PURGE_QUEUE,
  }),
});

const integTest = new integ.IntegTest(app, 'SqsIntegrationIntegTest', {
  testCases: [stack],
});

const defaultAssertion = integTest.assertions.httpApiCall(
  `${httpApi.apiEndpoint}/default`, {
    body: JSON.stringify({ MessageBody: 'Hello World!' }),
    method: 'POST',
  },
);
defaultAssertion.expect(integ.ExpectedResult.objectLike({ status: 200, statusText: 'OK' }));

const sendMessageAssertion = integTest.assertions.httpApiCall(
  `${httpApi.apiEndpoint}/send-message`, {
    body: JSON.stringify({ MessageBody: 'Hello World!' }),
    method: 'POST',
  },
);
sendMessageAssertion.expect(integ.ExpectedResult.objectLike({ status: 200, statusText: 'OK' }));

const receiveMessageAssertion = integTest.assertions.httpApiCall(
  `${httpApi.apiEndpoint}/receive-message`, {
    method: 'POST',
  },
);
receiveMessageAssertion.expect(integ.ExpectedResult.objectLike({ status: 200, statusText: 'OK' }));

const purgeQueueAssertion = integTest.assertions.httpApiCall(
  `${httpApi.apiEndpoint}/purge-queue`, {
    method: 'POST',
  },
);
purgeQueueAssertion.expect(integ.ExpectedResult.objectLike({ status: 200, statusText: 'OK' }));
