import * as path from 'path';
import { Template } from '../../assertions';
import * as cdk from '../../core';
import * as appsync from '../lib';

// GLOBAL GIVEN
let stack: cdk.Stack;
let api: appsync.GraphqlApi;
let cache: appsync.ApiCache;
beforeEach(() => {
  stack = new cdk.Stack();
  api = new appsync.GraphqlApi(stack, 'baseApi', {
    name: 'api',
    schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
  });
});

describe('Api Cache configuration', () => {
  test('API cache produces AWS::AppSync::ApiCache', () => {
    cache = new appsync.ApiCache(stack, 'baseApiCache', {
      apiId: api.apiId,
      apiCachingBehavior: appsync.CacheBehavior.FULL_REQUEST_CACHING,
      type: appsync.CacheType.LARGE,
      ttl: 60,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ApiCache', {
      Type: 'LARGE',
      Ttl: 60,
      ApiCachingBehavior: 'FULL_REQUEST_CACHING',
      ApiId: { 'Fn::GetAtt': ['baseApiCDA4D43A', 'ApiId'] },
    });
  });
});

describe('Add a Cache to a GraphQL API resource', () => {
  test('API cache gets added to api with addCache function', ()=> {
    api.addCache('ApiCache', {
      apiCachingBehavior: appsync.CacheBehavior.PER_RESOLVER_CACHING,
      type: appsync.CacheType.LARGE,
      ttl: 360,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::ApiCache', {
      Type: 'LARGE',
      Ttl: 360,
      ApiCachingBehavior: 'PER_RESOLVER_CACHING',
      ApiId: { 'Fn::GetAtt': ['baseApiCDA4D43A', 'ApiId'] },
    });
  });
});