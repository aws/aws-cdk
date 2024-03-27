import { HttpApi, HttpIntegrationSubtype, HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { App, Stack } from 'aws-cdk-lib';
import { HttpSqsIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'sqs-integration');

const queue = new sqs.Queue(stack, 'Queue');

const httpApi = new HttpApi(stack, 'Api');
httpApi.addRoutes({
  path: '/default',
  methods: [HttpMethod.POST],
  integration: new HttpSqsIntegration('Integration', {
    queue,
  }),
});
httpApi.addRoutes({
  path: '/send-message',
  methods: [HttpMethod.POST],
  integration: new HttpSqsIntegration('Integration', {
    queue,
    subtype: HttpIntegrationSubtype.SQS_SEND_MESSAGE,
  }),
});
httpApi.addRoutes({
  path: '/receive-message',
  methods: [HttpMethod.POST],
  integration: new HttpSqsIntegration('Integration', {
    queue,
    subtype: HttpIntegrationSubtype.SQS_RECEIVE_MESSAGE,
  }),
});
httpApi.addRoutes({
  path: '/delete-message',
  methods: [HttpMethod.POST],
  integration: new HttpSqsIntegration('Integration', {
    queue,
    subtype: HttpIntegrationSubtype.SQS_DELETE_MESSAGE,
  }),
});
httpApi.addRoutes({
  path: '/purge-queue',
  methods: [HttpMethod.POST],
  integration: new HttpSqsIntegration('Integration', {
    queue,
    subtype: HttpIntegrationSubtype.SQS_PURGE_QUEUE,
  }),
});

const integTest = new integ.IntegTest(app, 'SqsIntegrationIntegTest', {
  testCases: [stack],
});

const assertion = integTest.assertions.httpApiCall(`${httpApi.apiEndpoint}/default`);
// https://docs.aws.amazon.com/lambda/latest/api/API_Invoke.html#API_Invoke_ResponseElements
assertion.expect(ExpectedResult.objectLike({ StatusCode: 200 }));
