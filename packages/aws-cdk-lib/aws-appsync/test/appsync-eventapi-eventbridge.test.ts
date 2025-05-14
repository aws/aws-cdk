import * as path from 'path';
import { Template } from '../../assertions';
import * as eventBridge from '../../aws-events';
import * as cdk from '../../core';
import * as appsync from '../lib';

// GLOBAL GIVEN
let stack: cdk.Stack;
let eventApi: appsync.EventApi;
let eventBus: eventBridge.EventBus;

beforeEach(() => {
  stack = new cdk.Stack();
  eventApi = new appsync.EventApi(stack, 'baseApi', {
    apiName: 'api',
  });
  eventBus = new eventBridge.EventBus(stack, 'targetEventBus', {
    eventBusName: 'EventBus',
  });
});

describe('EventBridge Data Source Configuration', () => {
  test('The Datasource policy is configured to put events to the event bus', () => {
    // WHEN
    eventApi.addEventBridgeDataSource('ds', eventBus);

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
    eventApi.addEventBridgeDataSource('ds', eventBus);

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
    eventApi.addEventBridgeDataSource('ds', eventBus);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'AMAZON_EVENTBRIDGE',
      Name: 'ds',
    });
  });

  test('A custom name is used when provided', () => {
    // WHEN
    eventApi.addEventBridgeDataSource('id', eventBus, { name: 'custom' });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'AMAZON_EVENTBRIDGE',
      Name: 'custom',
    });
  });

  test('A custom description is used when provided', () => {
    // WHEN
    eventApi.addEventBridgeDataSource('ds', eventBus, { name: 'custom', description: 'custom description' });

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
      eventApi.addEventBridgeDataSource('ds', eventBus);
      eventApi.addEventBridgeDataSource('ds', eventBus);
    };

    // THEN
    expect(when).toThrow('There is already a Construct with name \'ds\' in EventApi [baseApi]');
  });
});

describe('EventBridge Data Source association with Channel Namespace', () => {
  test('Adding a channel namespace with API data source that exists - publish and subscribe handler', () => {
    // WHEN
    const datasource = eventApi.addEventBridgeDataSource('ds', eventBus);
    eventApi.addChannelNamespace('newChannel', {
      code: appsync.Code.fromInline('/* handler code goes here */'),
      publishHandlerConfig: {
        dataSource: datasource,
      },
      subscribeHandlerConfig: {
        dataSource: datasource,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ChannelNamespace', {
      Name: 'newChannel',
      HandlerConfigs: {
        OnPublish: {
          Behavior: 'CODE',
          Integration: {
            DataSourceName: 'ds',
          },
        },
        OnSubscribe: {
          Behavior: 'CODE',
          Integration: {
            DataSourceName: 'ds',
          },
        },
      },
    });
  });

  test('Adding a channel namespace with API data source that exists - publish handler', () => {
    // WHEN
    const datasource = eventApi.addEventBridgeDataSource('ds', eventBus);
    eventApi.addChannelNamespace('newChannel', {
      code: appsync.Code.fromInline('/* handler code goes here */'),
      publishHandlerConfig: {
        dataSource: datasource,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ChannelNamespace', {
      Name: 'newChannel',
      HandlerConfigs: {
        OnPublish: {
          Behavior: 'CODE',
          Integration: {
            DataSourceName: 'ds',
          },
        },
      },
    });
  });

  test('Adding a channel namespace with API data source that exists - subscribe handler', () => {
    // WHEN
    const datasource = eventApi.addEventBridgeDataSource('ds', eventBus);
    eventApi.addChannelNamespace('newChannel', {
      code: appsync.Code.fromInline('/* handler code goes here */'),
      subscribeHandlerConfig: {
        dataSource: datasource,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ChannelNamespace', {
      Name: 'newChannel',
      HandlerConfigs: {
        OnSubscribe: {
          Behavior: 'CODE',
          Integration: {
            DataSourceName: 'ds',
          },
        },
      },
    });
  });

  test('Adding a channel namespace with API data source that doesn\'t support DIRECT behavior', () => {
    // WHEN
    const when = () => {
      const datasource = eventApi.addEventBridgeDataSource('ds', eventBus);
      eventApi.addChannelNamespace('newChannel', {
        code: appsync.Code.fromInline('/* handler code goes here */'),
        subscribeHandlerConfig: {
          direct: true,
          dataSource: datasource,
        },
      });
    };

    // THEN
    expect(when).toThrow('Direct integration is only supported for AWS_LAMBDA data sources.');
  });
});

describe('adding EventBridge data source from imported api', () => {
  test('imported api can add EventBridgeDataSource from id', () => {
    // WHEN
    const importedApi = appsync.EventApi.fromEventApiAttributes(stack, 'importedApi', {
      apiId: eventApi.apiId,
      httpDns: eventApi.httpDns,
      realtimeDns: eventApi.realtimeDns,
    });
    importedApi.addEventBridgeDataSource('ds', eventBus);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'AMAZON_EVENTBRIDGE',
      ApiId: { 'Fn::GetAtt': ['baseApiCDA4D43A', 'ApiId'] },
    });
  });

  test('imported api can add DynamoDbDataSource from attributes', () => {
    // WHEN
    const importedApi = appsync.EventApi.fromEventApiAttributes(stack, 'importedApi', {
      apiId: eventApi.apiId,
      httpDns: eventApi.httpDns,
      realtimeDns: eventApi.realtimeDns,
    });
    importedApi.addEventBridgeDataSource('ds', eventBus);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'AMAZON_EVENTBRIDGE',
      ApiId: { 'Fn::GetAtt': ['baseApiCDA4D43A', 'ApiId'] },
    });
  });
});
