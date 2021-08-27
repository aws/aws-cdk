import * as path from 'path';
import { Template } from '@aws-cdk/assertions';
import * as opensearch from '@aws-cdk/aws-opensearchservice';
import * as cdk from '@aws-cdk/core';
import * as appsync from '../lib';

// GLOBAL GIVEN
let stack: cdk.Stack;
let api: appsync.GraphqlApi;
let domain: opensearch.Domain;
beforeEach(() => {
  stack = new cdk.Stack();
  api = new appsync.GraphqlApi(stack, 'baseApi', {
    name: 'api',
    schema: appsync.Schema.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
  });
  domain = new opensearch.Domain(stack, 'EsDomain', {
    version: opensearch.EngineVersion.ELASTICSEARCH_7_10,
  });
});

describe('OpenSearch Data Source Configuration', () => {
  test('OpenSearch configure properly', () => {
    // WHEN
    api.addOpenSearchDataSource('ds', domain);

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
            'Fn::GetAtt': ['EsDomain1213C634', 'Arn'],
          },
          {
            'Fn::Join': ['', [{
              'Fn::GetAtt': ['EsDomain1213C634', 'Arn'],
            }, '/*']],
          }],
        }],
      },
    });
  });

  test('OpenSearch configuration contains fully qualified url', () => {
    // WHEN
    api.addOpenSearchDataSource('ds', domain);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      OpenSearchConfig: {
        Endpoint: {
          'Fn::Join': ['', ['https://', {
            'Fn::GetAtt': ['EsDomain1213C634', 'DomainEndpoint'],
          }]],
        },
      },
    });
  });

  test('default configuration produces name identical to the id', () => {
    // WHEN
    api.addOpenSearchDataSource('ds', domain);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'AMAZON_OPENSEARCH',
      Name: 'ds',
    });
  });

  test('appsync configures name correctly', () => {
    // WHEN
    api.addOpenSearchDataSource('ds', domain, {
      name: 'custom',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'AMAZON_OPENSEARCH',
      Name: 'custom',
    });
  });

  test('appsync configures name and description correctly', () => {
    // WHEN
    api.addOpenSearchDataSource('ds', domain, {
      name: 'custom',
      description: 'custom description',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'AMAZON_OPENSEARCH',
      Name: 'custom',
      Description: 'custom description',
    });
  });

  test('appsync errors when creating multiple openSearch data sources with no configuration', () => {
    // WHEN
    const when = () => {
      api.addOpenSearchDataSource('ds', domain);
      api.addOpenSearchDataSource('ds', domain);
    };

    // THEN
    expect(when).toThrow('There is already a Construct with name \'ds\' in GraphqlApi [baseApi]');
  });
});

describe('adding openSearch data source from imported api', () => {
  test('imported api can add OpenSearchDataSource from id', () => {
    // WHEN
    const importedApi = appsync.GraphqlApi.fromGraphqlApiAttributes(stack, 'importedApi', {
      graphqlApiId: api.apiId,
    });
    importedApi.addOpenSearchDataSource('ds', domain);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'AMAZON_OPENSEARCH',
      ApiId: { 'Fn::GetAtt': ['baseApiCDA4D43A', 'ApiId'] },
    });
  });

  test('imported api can add OpenSearchDataSource from attributes', () => {
    // WHEN
    const importedApi = appsync.GraphqlApi.fromGraphqlApiAttributes(stack, 'importedApi', {
      graphqlApiId: api.apiId,
      graphqlApiArn: api.arn,
    });
    importedApi.addOpenSearchDataSource('ds', domain);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::DataSource', {
      Type: 'AMAZON_OPENSEARCH',
      ApiId: { 'Fn::GetAtt': ['baseApiCDA4D43A', 'ApiId'] },
    });
  });
});
