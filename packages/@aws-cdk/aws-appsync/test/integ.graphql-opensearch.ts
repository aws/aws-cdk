import * as path from 'path';
import { User } from '@aws-cdk/aws-iam';
import * as opensearch from '@aws-cdk/aws-opensearchservice';
import * as cdk from '@aws-cdk/core';
import * as appsync from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'appsync-opensearch');
const user = new User(stack, 'User');
const domain = new opensearch.Domain(stack, 'Domain', {
  version: opensearch.EngineVersion.OPENSEARCH_1_3,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  fineGrainedAccessControl: {
    masterUserArn: user.userArn,
  },
  encryptionAtRest: {
    enabled: true,
  },
  nodeToNodeEncryption: true,
  enforceHttps: true,
});

const api = new appsync.GraphqlApi(stack, 'api', {
  name: 'api',
  schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
});

const ds = api.addOpenSearchDataSource('ds', domain);

ds.createResolver({
  typeName: 'Query',
  fieldName: 'getTests',
  requestMappingTemplate: appsync.MappingTemplate.fromString(JSON.stringify({
    version: '2017-02-28',
    operation: 'GET',
    path: '/id/post/_search',
    params: {
      headers: {},
      queryString: {},
      body: {
        from: 0,
        size: 50,
      },
    },
  })),
  responseMappingTemplate: appsync.MappingTemplate.fromString(JSON.stringify({
    version: '2017-02-28',
    operation: 'GET',
    path: '/id/post/_search',
    params: {
      headers: {},
      queryString: {},
      body: {
        from: 0,
        size: 50,
        query: {
          term: {
            author: '$util.toJson($context.arguments.author)',
          },
        },
      },
    },
  })),
});

app.synth();
