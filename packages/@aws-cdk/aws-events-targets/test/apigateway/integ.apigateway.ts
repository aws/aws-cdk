import * as events from '@aws-cdk/aws-events';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as cdk from '@aws-cdk/core';
import * as targets from '../../lib';

// ---------------------------------
// Define a rule that triggers an invoke of API Gateway every 1min.

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-apigateway-event-target');


const restApi = new apigateway.RestApi(stack, 'MyApiGateway');
restApi.root.addResource('v1').addResource('{id}').addMethod('PUT');
const event = new events.Rule(stack, 'EveryMinute', {
  schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
});

event.addTarget(new targets.ApiGateway(restApi, {
  path: '/v1/*',
  method: 'PUT',
  stage: 'prod',
  input: events.RuleTargetInput.fromObject({
    foo: events.EventField.fromPath('$.detail.bar'),
  }),
  httpParameters: {
    pathParameterValues: ['$.detail.id'],
  },
}));

app.synth();
