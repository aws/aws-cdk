import { HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2';
import { PolicyStatement, Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Queue } from '@aws-cdk/aws-sqs';
import { App, CfnOutput, Duration, Stack } from '@aws-cdk/core';
import { SqsMessageAttributeListMappingExpression, SqsMessageAttribute, SqsDeleteMessageIntegration, SqsPurgeQueueIntegration, SqsReceiveMessageIntegration, SqsSendMessageIntegration } from '../../lib/http/aws-proxy';
import { ArrayMappingExpression, DurationMappingExpression, Mapping, QueueMappingExpression, SqsAttributeListMappingExpression, SqsStringAttribute, StringMappingExpression } from '../../lib/http/mapping-expression';

/*
 * Verification steps:
 * <step-1>: Deploy the stack and locate the ApiGatewayUrl output
 * <step-2>: make a POST request to <url>/message with a message body
 * <step-3>: Immediately make a GET request to <url>/message; no messages should be returned
 * <step-4>: Wait 10 seconds and get from <url>/message again; the message should be displayed;
 *   note the ReceiptHandle in the response.
 * <step-5>: make a DELETE request to <url>/message/<reciept handle>
 * <step-6>: get messages; none should be present.
 * <step-7>: post a new message.
 * <step-8>: make a DELETE request to <url>/message.
 * <step-9>: get messages; none should be present.
 */
const app = new App();
const stack = new Stack(app, 'integ-sqs');
const httpApi = new HttpApi(stack, 'IntegrationApi');

const queue = new Queue(stack, 'Queue', {
});
const queueMapping = QueueMappingExpression.fromQueue(queue);

const role = new Role(stack, 'SQSRole', {
  assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
});
role.addToPrincipalPolicy(new PolicyStatement({
  actions: ['sqs:*'],
  resources: [queue.queueArn],
}));

httpApi.addRoutes({
  path: '/message',
  methods: [HttpMethod.POST],
  integration: new SqsSendMessageIntegration({
    role,
    body: StringMappingExpression.fromMapping(Mapping.fromRequestBody()),
    queue: queueMapping,
    attributes: SqsAttributeListMappingExpression.fromSqsAttributeList([new SqsStringAttribute('foo', 'bar')]),
    delay: DurationMappingExpression.fromDuration(Duration.seconds(10)),
  }),
});

httpApi.addRoutes({
  path: '/message',
  methods: [HttpMethod.GET],
  integration: new SqsReceiveMessageIntegration({
    role,
    queue: queueMapping,
    attributeNames: ArrayMappingExpression.fromValue(['foo']),
    messageAttributeNames: SqsMessageAttributeListMappingExpression.fromAttributeList([SqsMessageAttribute.ALL]),
  }),
});

httpApi.addRoutes({
  path: '/message/{messageId+}',
  methods: [HttpMethod.DELETE],
  integration: new SqsDeleteMessageIntegration({
    role,
    queue: queueMapping,
    receiptHandle: StringMappingExpression.fromMapping(Mapping.fromRequestPath('messageId')),
  }),
});

httpApi.addRoutes({
  path: '/message',
  methods: [HttpMethod.DELETE],
  integration: new SqsPurgeQueueIntegration({
    role,
    queue: queueMapping,
  }),
});

new CfnOutput(stack, 'ApiGatewayUrl', {
  value: httpApi.apiEndpoint,
});
