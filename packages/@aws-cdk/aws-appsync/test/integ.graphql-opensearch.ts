import * as path from 'path';
import { User } from '@aws-cdk/aws-iam';
import * as opensearch from '@aws-cdk/aws-opensearchservice';
import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as appsync from '../lib';

class OpensSearch23Stack extends cdk.Stack {
  constructor(scope: Construct) {
    super(scope, 'appsync-opensearch');

    const user = new User(this, 'User');

    const domain = new opensearch.Domain(this, 'Domain', {
      version: opensearch.EngineVersion.OPENSEARCH_2_3,
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

    const api = new appsync.GraphqlApi(this, 'api', {
      name: 'api',
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
    });

    const ds = api.addOpenSearchDataSource('ds', domain);

    ds.createResolver('QueryGetTests', {
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
  }
}

const app = new cdk.App();
const testCase = new OpensSearch23Stack(app);
new IntegTest(app, 'opensearch-2.3-stack', {
  testCases: [testCase],
});

app.synth();
