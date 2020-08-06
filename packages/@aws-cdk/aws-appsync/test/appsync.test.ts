import * as path from 'path';
import '@aws-cdk/assert/jest';
import * as cdk from '@aws-cdk/core';
import * as appsync from '../lib';

test('should not throw an Error', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const when = () => {
    new appsync.GraphQLApi(stack, 'api', {
      authorizationConfig: {},
      schemaDefinition: appsync.SchemaDefinition.FILE,
      name: 'api',
      schemaDefinitionFile: path.join(__dirname, 'appsync.test.graphql'),
    });
  };

  // THEN
  expect(when).not.toThrow();
});

test('appsync should configure pipeline when pipelineConfig has contents', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const api = new appsync.GraphQLApi(stack, 'api', {
    authorizationConfig: {},
    name: 'api',
    schemaDefinition: appsync.SchemaDefinition.FILE,
    schemaDefinitionFile: path.join(__dirname, 'appsync.test.graphql'),
  });

  new appsync.Resolver(stack, 'resolver', {
    api: api,
    typeName: 'test',
    fieldName: 'test2',
    pipelineConfig: ['test', 'test'],
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::AppSync::Resolver', {
    Kind: 'PIPELINE',
    PipelineConfig: { Functions: [ 'test', 'test' ] },
  });
});

test('appsync should configure resolver as unit when pipelineConfig is empty', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const api = new appsync.GraphQLApi(stack, 'api', {
    authorizationConfig: {},
    name: 'api',
    schemaDefinition: appsync.SchemaDefinition.FILE,
    schemaDefinitionFile: path.join(__dirname, 'appsync.test.graphql'),
  });

  new appsync.Resolver(stack, 'resolver', {
    api: api,
    typeName: 'test',
    fieldName: 'test2',
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::AppSync::Resolver', {
    Kind: 'UNIT',
  });
});

test('appsync should configure resolver as unit when pipelineConfig is empty array', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const api = new appsync.GraphQLApi(stack, 'api', {
    authorizationConfig: {},
    name: 'api',
    schemaDefinition: appsync.SchemaDefinition.FILE,
    schemaDefinitionFile: path.join(__dirname, 'appsync.test.graphql'),
  });

  new appsync.Resolver(stack, 'resolver', {
    api: api,
    typeName: 'test',
    fieldName: 'test2',
    pipelineConfig: [],
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::AppSync::Resolver', {
    Kind: 'UNIT',
  });
});

test('when xray is enabled should not throw an Error', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  new appsync.GraphQLApi(stack, 'api', {
    authorizationConfig: {},
    name: 'api',
    schemaDefinition: appsync.SchemaDefinition.FILE,
    schemaDefinitionFile: path.join(__dirname, 'appsync.test.graphql'),
    xrayEnabled: true,
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLApi', {
    XrayEnabled: true,
  });
});
