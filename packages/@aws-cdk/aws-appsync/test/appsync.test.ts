import '@aws-cdk/assert/jest';
import * as cdk from '@aws-cdk/core';
import * as path from 'path';
import * as appsync from '../lib';

test('should not throw an Error', () => {
  // Given
  const stack = new cdk.Stack();

  // When
  const when = () => {
    new appsync.GraphQLApi(stack, 'api', {
      authorizationConfig: {},
      name: 'api',
      schemaDefinitionFile: path.join(__dirname, 'schema.graphql'),
    });
  };

  // Then
  expect(when).not.toThrow();
});

test('should not throw an Error', () => {
  // Given
  const stack = new cdk.Stack();

  // When
  const api = new appsync.GraphQLApi(stack, 'api', {
    authorizationConfig: {},
    name: 'api',
    schemaDefinitionFile: path.join(__dirname, 'schema.graphql'),
  }); 

  const when = () => {
    new appsync.Resolver(stack, 'resolver', {
      api: api,
      typeName: "test",
      fieldName: "test2",
      kind: appsync.ResolverType.PIPELINE,
    });
  };

  // Then
  expect(when).not.toThrow();
});