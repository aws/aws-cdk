import * as path from 'path';
import { Template } from '../../assertions';
import * as opensearch from '../../aws-opensearchservice';
import * as cdk from '../../core';
import * as appsync from '../lib';

// GLOBAL GIVEN
let stack: cdk.Stack;
let eventApi: appsync.EventApi;
let domain: opensearch.Domain;
beforeEach(() => {
  stack = new cdk.Stack();
  eventApi = new appsync.EventApi(stack, 'baseApi', {
    apiName: 'api',
  });
  domain = new opensearch.Domain(stack, 'OsDomain', {
    version: opensearch.EngineVersion.OPENSEARCH_1_1,
  });
});

describe('OpenSearch Data Source Configuration', () => {
  test('OpenSearch configure properly', () => {
    // WHEN
    eventApi.addOpenSearchDataSource('ds', domain);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [{
          Action: [
            'es:ESHttpGet',
            'es:ESHttpHead',
            'es:ESHttpDelete',
            'es:ESHttpPost',
            'es:ESHttpPut',
            'es:ESHttpPatch',
          ],
          Effect: 'Allow',
          Resource: [{
            'Fn::GetAtt': ['OsDomain5D09FC6A', 'Arn'],
          },
          {
            'Fn::Join': ['', [{
              'Fn::GetAtt': ['OsDomain5D09FC6A', 'Arn'],
            }, '/*']],
          }],
        }],
      },
    });
  });

  test('OpenSearch configuration contains fully qualified url', () => {
    // WHEN
    eventApi.addOpenSearchDataSource('ds', domain);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      OpenSearchServiceConfig: {
        Endpoint: {
          'Fn::Join': ['', ['https://', {
            'Fn::GetAtt': ['OsDomain5D09FC6A', 'DomainEndpoint'],
          }]],
        },
      },
    });
  });

  test('default configuration produces name identical to the id', () => {
    // WHEN
    eventApi.addOpenSearchDataSource('ds', domain);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'AMAZON_OPENSEARCH_SERVICE',
      Name: 'ds',
    });
  });

  test('appsync configures name correctly', () => {
    // WHEN
    eventApi.addOpenSearchDataSource('ds', domain, {
      name: 'custom',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'AMAZON_OPENSEARCH_SERVICE',
      Name: 'custom',
    });
  });

  test('appsync configures name and description correctly', () => {
    // WHEN
    eventApi.addOpenSearchDataSource('ds', domain, {
      name: 'custom',
      description: 'custom description',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'AMAZON_OPENSEARCH_SERVICE',
      Name: 'custom',
      Description: 'custom description',
    });
  });

  test('appsync errors when creating multiple openSearch data sources with no configuration', () => {
    // WHEN
    const when = () => {
      eventApi.addOpenSearchDataSource('ds', domain);
      eventApi.addOpenSearchDataSource('ds', domain);
    };

    // THEN
    expect(when).toThrow('There is already a Construct with name \'ds\' in EventApi [baseApi]');
  });
});

describe('Http Data Source association with Channel Namespace', () => {
  test('Adding a channel namespace with API data source that exists - publish and subscribe handler', () => {
    // WHEN
    const datasource = eventApi.addOpenSearchDataSource('ds', domain);
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
    const datasource = eventApi.addOpenSearchDataSource('ds', domain);
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
    const datasource = eventApi.addOpenSearchDataSource('ds', domain);
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
      const datasource = eventApi.addOpenSearchDataSource('ds', domain);
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

describe('adding openSearch data source from imported api', () => {
  test('imported api can add OpenSearchDataSource from id', () => {
    // WHEN
    const importedApi = appsync.EventApi.fromEventApiAttributes(stack, 'importedApi', {
      apiId: eventApi.apiId,
      httpDns: eventApi.httpDns,
      realtimeDns: eventApi.realtimeDns,
    });
    importedApi.addOpenSearchDataSource('ds', domain);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'AMAZON_OPENSEARCH_SERVICE',
      ApiId: { 'Fn::GetAtt': ['baseApiCDA4D43A', 'ApiId'] },
    });
  });

  test('imported api can add OpenSearchDataSource from attributes', () => {
    // WHEN
    const importedApi = appsync.EventApi.fromEventApiAttributes(stack, 'importedApi', {
      apiId: eventApi.apiId,
      httpDns: eventApi.httpDns,
      realtimeDns: eventApi.realtimeDns,
    });
    importedApi.addOpenSearchDataSource('ds', domain);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'AMAZON_OPENSEARCH_SERVICE',
      ApiId: { 'Fn::GetAtt': ['baseApiCDA4D43A', 'ApiId'] },
    });
  });
});
