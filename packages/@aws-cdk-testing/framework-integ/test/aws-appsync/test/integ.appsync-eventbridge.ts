import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as events from 'aws-cdk-lib/aws-events';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'stack');

const api = new appsync.GraphqlApi(stack, 'EventBridgeApi', {
  name: 'EventBridgeApi',
  schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.eventbridge.graphql')),
});

const bus = new events.EventBus(stack, 'DestinationEventBus', {});

const dataSource = api.addEventBridgeDataSource('EventBridgeDs', bus);

dataSource.createResolver('EventResolver', {
  typeName: 'Mutation',
  fieldName: 'emitEvent',
  requestMappingTemplate: appsync.MappingTemplate.fromString('{"version" : "2018-05-29", "operation": "PutEvents", "events" : [{ "source": "integ.appsync.eventbridge", "detailType": "Mutation.emitEvent", "detail": $util.toJson($context.arguments) }]}'),
  responseMappingTemplate: appsync.MappingTemplate.fromString('$util.toJson($ctx.result)'),
});

new IntegTest(app, 'api', {
  testCases: [stack],
});

app.synth();
