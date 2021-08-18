import { HttpApi } from '@aws-cdk/aws-apigatewayv2';
import { EventBus, Rule } from '@aws-cdk/aws-events';
import { CloudWatchLogGroup } from '@aws-cdk/aws-events-targets';
import { PolicyStatement, Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { LogGroup, RetentionDays } from '@aws-cdk/aws-logs';
import { App, CfnOutput, Stack } from '@aws-cdk/core';
import { EventBridgePutEventsIntegration } from '../../lib/http/aws-proxy';
import { ArrayMappingExpression, EventBusMappingExpression, Mapping, StringMappingExpression } from '../../lib/http/mapping-expression';

/*
 * Stack verification steps:
 * * <step-1> Deploy the stack and wait for the API URL to be displayed.
 * * <step-2> send a POST request to /putEvent.
 * * <step-3> verify that the request has arrived at the log group /aws/events/integ-event-bridge
 */

const app = new App();
const stack = new Stack(app, 'integ-event-bridge');
const httpApi = new HttpApi(stack, 'IntegrationApi');
const putEventsRole = new Role(stack, 'PutEvents', {
  assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
});

const eventBus = EventBus.fromEventBusName(stack, 'Default', 'default');
httpApi.addRoutes({
  path: '/putEvent',
  integration: new EventBridgePutEventsIntegration({
    detail: StringMappingExpression.fromValue('$request.body'),
    detailType: StringMappingExpression.fromValue('test'),
    source: StringMappingExpression.fromValue('integ-event-bridge'),
    eventBus: EventBusMappingExpression.fromEventBus(eventBus),
    role: putEventsRole,
    resources: ArrayMappingExpression.fromMapping(Mapping.fromRequestBody('resources')),
  }),
});

putEventsRole.addToPrincipalPolicy(new PolicyStatement({
  actions: ['events:PutEvents'],
  resources: [eventBus.eventBusArn],
}));

const logGroup = new LogGroup(stack, 'Verification', {
  logGroupName: '/aws/events/integ-event-bridge',
  retention: RetentionDays.ONE_DAY,
});

new Rule(stack, 'LogRule', {
  eventPattern: {
    source: ['integ-event-bridge'],
    detailType: ['test'],
  },
  targets: [new CloudWatchLogGroup(logGroup)],
});

new CfnOutput(stack, 'ApiGatewayUrl', {
  value: httpApi.apiEndpoint,
});
