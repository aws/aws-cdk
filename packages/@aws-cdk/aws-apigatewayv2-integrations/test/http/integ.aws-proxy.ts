import { HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2';
import { EventBus } from '@aws-cdk/aws-events';
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Queue } from '@aws-cdk/aws-sqs';
import { App, CfnOutput, Stack } from '@aws-cdk/core';
import { DurationMappingExpression, EventBridgePutEventsIntegration, EventBusMappingExpression, MappingExpression, QueueMappingExpression, SQSSendMessageIntegration } from '../../lib/http/aws-proxy';

/*
 * Stack verification steps:
 * * <step-1> Deploy the stack and wait for the API URL to be displayed.
 * * <step-2> Create a Cloudwatch Log Group called '/aws/events/integ-aws-proxy'
 * * <step-3> Add a events rule matching events {"detailType": "test", "source": "integ-aws-proxy"};
 *   send these to the '/aws/events/integ-aws-proxy' log group.
 * * <step-4> send a POST request to /putEvent.
 * * <step-5> verify that the request has arrived at the log group /aws/events/integ-aws-proxy
 */

const app = new App();
const stack = new Stack(app, 'integ-aws-proxy');
const httpApi = new HttpApi(stack, 'IntegrationApi');
const putEventsRole = new Role(stack, 'PutEvents', {
  assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
});

const eventBus = EventBus.fromEventBusName(stack, 'Default', 'default');
httpApi.addRoutes({
  path: '/putEvent',
  integration: new EventBridgePutEventsIntegration({
    detail: MappingExpression.staticValue('$request.body'),
    detailType: MappingExpression.staticValue('test'),
    source: MappingExpression.staticValue('integ-aws-proxy'),
    eventBus: EventBusMappingExpression.fromEventBus(eventBus),
    role: putEventsRole,
    resources: MappingExpression.fromRequestBody('resources'),
  }),
});

const queue = new Queue(stack, 'Queue');
const sendMessageRole = new Role(stack, 'SendMessage', {
  assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
});

httpApi.addRoutes({
  path: '/sqs',
  methods: [HttpMethod.POST],
  integration: new SQSSendMessageIntegration({
    queue: QueueMappingExpression.fromQueue(queue),
    body: MappingExpression.requestBody(),
    attributes: MappingExpression.staticValue('TestMessage=true'),
    role: sendMessageRole,
    delay: DurationMappingExpression.fromRequestBody('delay'),
  }),
});

new CfnOutput(stack, 'ApiGatewayUrl', {
  value: httpApi.apiEndpoint,
});
