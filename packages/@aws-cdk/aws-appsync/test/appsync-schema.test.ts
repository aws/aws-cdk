import { join } from 'path';
import '@aws-cdk/assert/jest';
import * as cdk from '@aws-cdk/core';
import * as appsync from '../lib';

// Schema Definitions
const type = 'type test {\n  version: String!\n}\n\n';
const query = 'type Query {\n  getTests: [ test! ]!\n}\n\n';
const mutation = 'type Mutation {\n  addTest(version: String!): test\n}\n';

let stack: cdk.Stack;
beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
});

describe('testing schema definition mode `code`', () => {

  test('definition mode `code` produces empty schema definition', () => {
    // WHEN
    new appsync.GraphQLApi(stack, 'API', {
      name: 'demo',
      schemaDefinition: appsync.SchemaDefinition.CODE,
    });

    //THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: '',
    });
  });

  test('definition mode `code` generates correct schema with updateDefinition', () => {
    // WHEN
    const api = new appsync.GraphQLApi(stack, 'API', {
      name: 'demo',
      schemaDefinition: appsync.SchemaDefinition.CODE,
    });
    api.updateDefinition(`${type}${query}${mutation}`);

    //THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: `${type}${query}${mutation}`,
    });
  });

  test('definition mode `code` errors when schemaDefinitionFile is configured', () => {
    // WHEN
    const when = () => {
      new appsync.GraphQLApi(stack, 'API', {
        name: 'demo',
        schemaDefinition: appsync.SchemaDefinition.CODE,
        schemaDefinitionFile: join(__dirname, 'appsync.test.graphql'),
      });
    };

    //THEN
    expect(when).toThrowError('definition mode CODE is incompatible with file definition. Change mode to FILE/S3 or unconfigure schemaDefinitionFile');
  });

});

describe('testing schema definition mode `file`', () => {

  test('definition mode `file` produces correct output', () => {
    // WHEN
    new appsync.GraphQLApi(stack, 'API', {
      name: 'demo',
      schemaDefinition: appsync.SchemaDefinition.FILE,
      schemaDefinitionFile: join(__dirname, 'appsync.test.graphql'),
    });

    //THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: `${type}${query}${mutation}`,
    });
  });

  test('definition mode `file` errors when calling updateDefiniton function', () => {
    // WHEN
    const api = new appsync.GraphQLApi(stack, 'API', {
      name: 'demo',
      schemaDefinition: appsync.SchemaDefinition.FILE,
      schemaDefinitionFile: join(__dirname, 'appsync.test.graphql'),
    });
    const when = () => { api.updateDefinition('error'); };

    //THEN
    expect(when).toThrowError('API cannot add type because schema definition mode is not configured as CODE.');
  });

  test('definition mode `file` errors when schemaDefinitionFile is not configured', () => {
    // WHEN
    const when = () => {
      new appsync.GraphQLApi(stack, 'API', {
        name: 'demo',
        schemaDefinition: appsync.SchemaDefinition.FILE,
      });
    };

    //THEN
    expect(when).toThrowError('schemaDefinitionFile must be configured if using FILE definition mode.');
  });

});