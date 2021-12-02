import * as path from 'path';
import { Template } from '@aws-cdk/assertions';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as appsync from '../lib';

let stack: cdk.Stack;
let api: appsync.GraphqlApi;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
  api = new appsync.GraphqlApi(stack, 'api', {
    name: 'api',
    schema: appsync.Schema.fromAsset(path.join(__dirname, 'appsync.lambda.graphql')),
  });
});

describe('Lambda caching config', () => {
  // GIVEN
  let func: lambda.Function;

  beforeEach(() => {
    func = new lambda.Function(stack, 'func', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'verify/lambda-tutorial')),
      handler: 'lambda-tutorial.handler',
      runtime: lambda.Runtime.NODEJS_12_X,
    });
  });

  test('Lambda resolver contains caching config with caching keys and TTL', () => {
    // WHEN
    const lambdaDS = api.addLambdaDataSource('LambdaDS', func);

    lambdaDS.createResolver({
      typeName: 'Query',
      fieldName: 'allPosts',
      cachingConfig: {
        cachingKeys: ['$context.identity'],
        ttl: 300,
      }
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Resolver', {
      TypeName: 'Query',
      FieldName: 'allPosts',
      CachingConfig: {
        CachingKeys: ['$context.identity'],
        Ttl: 300
      }
    });
  });
});
