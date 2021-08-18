import { HttpApi } from '@aws-cdk/aws-apigatewayv2';
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Queue } from '@aws-cdk/aws-sqs';
import { App, CfnOutput, Duration, Stack } from '@aws-cdk/core';
import { SqsReceiveMessageIntegration, SqsSendMessageIntegration } from '../../lib/http/aws-proxy';
import { DurationMappingExpression, Mapping, QueueMappingExpression, StringMappingExpression } from '../../lib/http/mapping-expression';

const app = new App();
const stack = new Stack(app, 'integ-sqs');
const httpApi = new HttpApi(stack, 'IntegrationApi');
const role = new Role(stack, 'SQSRole', {
  assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
});

const queue = new Queue(stack, 'Queue', {
});

httpApi.addRoutes({
  path: '/send',
  integration: new SqsSendMessageIntegration({
    role,
    body: StringMappingExpression.fromMapping(Mapping.fromRequestBody()),
    queue: QueueMappingExpression.fromQueue(queue),
    attributes: StringMappingExpression.fromValue('foo=bar'),
    delay: DurationMappingExpression.fromDuration(Duration.seconds(10)),
  }),
});

httpApi.addRoutes({
  path: '/read',
  integration: new SqsReceiveMessageIntegration({
    role,
    queue: QueueMappingExpression.fromQueue(queue),
    // attributeNames: MappingExpression.staticValue('["foo"]')
  }),
});

new CfnOutput(stack, 'ApiGatewayUrl', {
  value: httpApi.apiEndpoint,
});
