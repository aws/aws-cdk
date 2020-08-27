import '@aws-cdk/assert/jest';
import * as cdk from '@aws-cdk/core';
import * as appsync from '../lib';
import * as t from './scalar-type-defintions';

const out = 'type Test1 {\n  test1: String\n}\ntype Test2 {\n  test2: String\n}\nunion UnionTest = Test1 | Test2\n';
const test1 = new appsync.ObjectType('Test1', {
  definition: { test1: t.string },
});
const test2 = new appsync.ObjectType('Test2', {
  definition: { test2: t.string },
});
let stack: cdk.Stack;
let api: appsync.GraphQLApi;
beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
  api = new appsync.GraphQLApi(stack, 'api', {
    name: 'api',
  });
  api.addType(test1);
  api.addType(test2);
});

describe('testing Union Type properties', () => {
  test('UnionType configures properly', () => {
    // WHEN
    const union = new appsync.UnionType('UnionTest', {
      definition: [test1, test2],
    });
    api.addType(union);
    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: `${out}`,
    });
    expect(stack).not.toHaveResource('AWS::AppSync::Resolver');
  });

  test('UnionType can addField', () => {
    // WHEN
    const union = new appsync.UnionType('UnionTest', {
      definition: [test1],
    });
    api.addType(union);
    union.addField('test2', test2.attribute());

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: `${out}`,
    });
  });

  test('UnionType can be a GraphqlType', () => {
    // WHEN
    const union = new appsync.UnionType('UnionTest', {
      definition: [test1, test2],
    });
    api.addType(union);

    api.addType(new appsync.ObjectType('Test2', {
      definition: { union: union.attribute() },
    }));

    const obj = 'type Test2 {\n  union: UnionTest\n}\n';

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: `${out}${obj}`,
    });
  });

  test('appsync errors when addField with Graphql Types', () => {
    // WHEN
    const test = new appsync.UnionType('Test', {
      definition: [],
    });
    // THEN
    expect(() => {
      test.addField('', t.string);
    }).toThrowError('Fields for Union Types must be Object Types.');
  });

  test('appsync errors when addField with Field', () => {
    // WHEN
    const test = new appsync.UnionType('Test', {
      definition: [],
    });
    // THEN
    expect(() => {
      test.addField('', new appsync.Field({ returnType: t.string }));
    }).toThrowError('Fields for Union Types must be Object Types.');
  });

  test('appsync errors when addField with ResolvableField', () => {
    // WHEN
    const test = new appsync.UnionType('Test', {
      definition: [],
    });
    // THEN
    expect(() => {
      test.addField('', new appsync.ResolvableField({ returnType: t.string }));
    }).toThrowError('Fields for Union Types must be Object Types.');
  });

  test('appsync errors when addField with Interface Types', () => {
    // WHEN
    const test = new appsync.UnionType('Test', {
      definition: [],
    });
    // THEN
    expect(() => {
      test.addField('', new appsync.InterfaceType('break', { definition: {} }).attribute());
    }).toThrowError('Fields for Union Types must be Object Types.');
  });

  test('appsync errors when addField with Union Types', () => {
    // WHEN
    const test = new appsync.UnionType('Test', {
      definition: [],
    });
    // THEN
    expect(() => {
      test.addField('', test.attribute());
    }).toThrowError('Fields for Union Types must be Object Types.');
  });
});