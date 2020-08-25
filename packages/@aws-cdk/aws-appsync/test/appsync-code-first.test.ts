import '@aws-cdk/assert/jest';
import * as cdk from '@aws-cdk/core';
import * as appsync from '../lib';
import * as t from './scalar-type-defintions';

let stack: cdk.Stack;
let api: appsync.GraphQLApi;
beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
  api = new appsync.GraphQLApi(stack, 'api', {
    name: 'api',
    schemaDefinition: appsync.SchemaDefinition.CODE,
  });
});

describe('testing addType for schema definition mode `code`', () => {
  test('check scalar type id with all options', () => {
    // WHEN
    api.addType('Test', {
      definition: {
        id: t.id,
        lid: t.list_id,
        rid: t.required_id,
        rlid: t.required_list_id,
        rlrid: t.required_list_required_id,
        dupid: t.dup_id,
      },
    });
    const out = 'type Test {\n  id: ID\n  lid: [ID]\n  rid: ID!\n  rlid: [ID]!\n  rlrid: [ID!]!\n  dupid: [ID!]!\n}\n';

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: `${out}`,
    });
  });

});