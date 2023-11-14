import * as path from 'path';
import { Template } from '../../assertions';
import * as eventBridge from '../../aws-events';
import * as cdk from '../../core';
import * as appsync from '../lib';

// GLOBAL GIVEN
let stack: cdk.Stack;
let api: appsync.GraphqlApi;
let eventBus: eventBridge.EventBus;

beforeEach(() => {
  stack = new cdk.Stack();
  api = new appsync.GraphqlApi(stack, 'baseApi', {
    name: 'api',
    schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
  });
  eventBus = new eventBridge.EventBus(stack, 'targetEventBus', {
    eventBusName: 'EventBus',
  });
});

describe('EventBridge Data Source Configuration', () => {
  test('The Datasource policy is configured to put events to the event bus', () => {
    // WHEN
    api.addEventBridgeDataSource('ds', eventBus);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [{
          Action: 'events:PutEvents',
          Effect: 'Allow',
          Resource: {
            'Fn::GetAtt': ['targetEventBus07F5DAC9', 'Arn'],
          },
        }],
      },
    });
  });

  test('The EventBridge configuration contains the event bus arn', () => {
    // WHEN
    api.addEventBridgeDataSource('ds', eventBus);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      EventBridgeConfig: {
        EventBusArn: {
          'Fn::GetAtt': ['targetEventBus07F5DAC9', 'Arn'],
        },
      },
    });
  });

  test('The default configuration produces a name identical to the id', () => {
    // WHEN
    api.addEventBridgeDataSource('ds', eventBus);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'AMAZON_EVENTBRIDGE',
      Name: 'ds',
    });
  });

  test('A custom name is used when provided', () => {
    // WHEN
    api.addEventBridgeDataSource('id', eventBus, { name: 'custom' });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'AMAZON_EVENTBRIDGE',
      Name: 'custom',
    });
  });

  test('A custom description is used when provided', () => {
    // WHEN
    api.addEventBridgeDataSource('ds', eventBus, { name: 'custom', description: 'custom description' });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'AMAZON_EVENTBRIDGE',
      Name: 'custom',
      Description: 'custom description',
    });
  });

  test('An error occurs when creating multiple EventBridge data sources with the same name', () => {
    // WHEN
    const when = () => {
      api.addEventBridgeDataSource('ds', eventBus);
      api.addEventBridgeDataSource('ds', eventBus);
    };

    // THEN
    expect(when).toThrow('There is already a Construct with name \'ds\' in GraphqlApi [baseApi]');
  });
});
