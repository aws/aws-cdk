import * as path from 'path';
import { Match, Template } from '@aws-cdk/assertions';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { Duration } from '@aws-cdk/core';
import * as appsync from '../lib';

let stack: cdk.Stack;
let api: appsync.GraphqlApi;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
  api = new appsync.GraphqlApi(stack, 'api', {
    name: 'api',
    schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.lambda.graphql')),
  });
});

describe('Lambda caching config', () => {
  // GIVEN
  let func: lambda.Function;

  beforeEach(() => {
    func = new lambda.Function(stack, 'func', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'verify/lambda-tutorial')),
      handler: 'lambda-tutorial.handler',
      runtime: lambda.Runtime.NODEJS_14_X,
    });
  });

  test('Lambda resolver can be created without caching config', () => {
    // WHEN
    const lambdaDS = api.addLambdaDataSource('LambdaDS', func);

    lambdaDS.createResolver({
      typeName: 'Query',
      fieldName: 'allPosts',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Resolver', {
      TypeName: 'Query',
      FieldName: 'allPosts',
      CachingConfig: Match.absent(),
    });
  });

  test('Lambda resolver contains caching config with caching key and TTL', () => {
    // WHEN
    const lambdaDS = api.addLambdaDataSource('LambdaDS', func);

    lambdaDS.createResolver({
      typeName: 'Query',
      fieldName: 'allPosts',
      cachingConfig: {
        cachingKeys: ['$context.arguments', '$context.source', '$context.identity'],
        ttl: Duration.seconds(300),
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::Resolver', {
      TypeName: 'Query',
      FieldName: 'allPosts',
      CachingConfig: {
        CachingKeys: ['$context.arguments', '$context.source', '$context.identity'],
        Ttl: 300,
      },
    });
  });

  test('Lambda resolver throws error when caching config with TTL is less than 1 second', () => {
    // WHEN
    const ttlInSconds = 0;
    const lambdaDS = api.addLambdaDataSource('LambdaDS', func);

    // THEN
    expect(() => {
      lambdaDS.createResolver({
        typeName: 'Query',
        fieldName: 'allPosts',
        cachingConfig: {
          cachingKeys: ['$context.identity'],
          ttl: Duration.seconds(0),
        },
      });
    }).toThrowError(`Caching config TTL must be between 1 and 3600 seconds. Received: ${ttlInSconds}`);
  });

  test('Lambda resolver throws error when caching config with TTL is greater than 3600 seconds', () => {
    // WHEN
    const ttlInSconds = 4200;
    const lambdaDS = api.addLambdaDataSource('LambdaDS', func);

    // THEN
    expect(() => {
      lambdaDS.createResolver({
        typeName: 'Query',
        fieldName: 'allPosts',
        cachingConfig: {
          cachingKeys: ['$context.identity'],
          ttl: Duration.seconds(ttlInSconds),
        },
      });
    }).toThrowError(`Caching config TTL must be between 1 and 3600 seconds. Received: ${ttlInSconds}`);
  });

  test('Lambda resolver throws error when caching config has invalid caching keys', () => {
    // WHEN
    const invalidCachingKeys = ['$context.metadata'];
    const lambdaDS = api.addLambdaDataSource('LambdaDS', func);

    // THEN
    expect(() => {
      lambdaDS.createResolver({
        typeName: 'Query',
        fieldName: 'allPosts',
        cachingConfig: {
          cachingKeys: invalidCachingKeys,
          ttl: Duration.seconds(300),
        },
      });
    }).toThrowError(`Caching config keys must begin with $context.arguments, $context.source or $context.identity. Received: ${invalidCachingKeys}`);
  });
});
