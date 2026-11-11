import * as path from 'path';
import * as es from 'aws-cdk-lib/aws-opensearchservice';
import { User } from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import * as appsync from 'aws-cdk-lib/aws-appsync';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'appsync-elasticsearch');
const user = new User(stack, 'User');
const domain = new es.Domain(stack, 'Domain', {
  version: es.EngineVersion.ELASTICSEARCH_7_1,
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
  definition: {
    schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
  },
});

const ds = api.addOpenSearchDataSource('ds', domain);
// const ds = api.addElasticsearchDataSource('ds', domain);

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

app.synth();
