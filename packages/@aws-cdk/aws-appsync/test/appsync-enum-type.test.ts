import '@aws-cdk/assert/jest';
import * as cdk from '@aws-cdk/core';
import * as appsync from '../lib';
import * as t from './scalar-type-defintions';

const out = 'enum Test {\n  test1\n  test2\n  test3\n}\n';

let stack: cdk.Stack;
let api: appsync.GraphQLApi;
beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
  api = new appsync.GraphQLApi(stack, 'api', {
    name: 'api',
  });
});

describe('testing Enum Type properties', () => {
  test('EnumType configures properly', () => {
    // WHEN
    const test = new appsync.EnumType('Test', {
      definition: ['test1', 'test2', 'test3'],
    });
    api.addType(test);

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: `${out}`,
    });
    expect(stack).not.toHaveResource('AWS::AppSync::Resolver');
  });

  test('EnumType can addField', () => {
    // WHEN
    const test = new appsync.EnumType('Test', {
      definition: ['test1', 'test2'],
    });
    api.addType(test);
    test.addField('test3', t.string);

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: `${out}`,
    });
  });

  test('EnumType can be a GraphqlType', () => {
    // WHEN
    const test = new appsync.EnumType('Test', {
      definition: ['test1', 'test2', 'test3'],
    });
    api.addType(test);

    api.addType(new appsync.ObjectType('Test2', {
      definition: { enum: test.attribute() },
    }));

    const obj = 'type Test2 {\n  enum: Test\n}\n';

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: `${out}${obj}`,
    });
  });
});