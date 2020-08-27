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
  });
});

describe('testing InterfaceType properties', () => {
  let baseTest: appsync.InterfaceType;
  beforeEach(()=>{
    baseTest = new appsync.InterfaceType('baseTest', {
      definition: {
        id: t.id,
      },
    });
  });
  test('basic InterfaceType produces correct schema', () => {
    // WHEN
    api.addToSchema(baseTest.toString());
    const out = 'interface baseTest {\n  id: ID\n}\n';

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: `${out}`,
    });
  });

  test('InterfaceType fields can have arguments', () => {
    // WHEN
    baseTest.addField('test', new appsync.Field({
      returnType: t.string,
      args: { success: t.int },
    }));
    api.addToSchema(baseTest.toString());
    const out = 'interface baseTest {\n  id: ID\n  test(success: Int): String\n}\n';

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: `${out}`,
    });
  });

  test('InterfaceType fields will not produce resolvers', () => {
    // WHEN
    baseTest.addField('test', new appsync.ResolvableField({
      returnType: t.string,
      args: { success: t.int },
      dataSource: api.addNoneDataSource('none'),
    }));
    api.addToSchema(baseTest.toString());
    const out = 'interface baseTest {\n  id: ID\n  test(success: Int): String\n}\n';

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: `${out}`,
    });
    expect(stack).not.toHaveResource('AWS::AppSync::Resolver');
  });

  test('Interface Type can be a Graphql Type', () => {
    // WHEN
    const graphqlType = baseTest.attribute();

    const test = new appsync.ObjectType('Test', {
      definition: {
        test: graphqlType,
      },
    });
    api.addToSchema(test.toString());
    const out = 'type Test {\n  test: baseTest\n}\n';

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: `${out}`,
    });
  });
});