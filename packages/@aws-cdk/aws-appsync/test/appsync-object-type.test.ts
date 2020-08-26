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

describe('testing Object Type properties', () => {
  test('ObjectType can implement from interface types', () => {
    // WHEN
    const baseTest = new appsync.InterfaceType('baseTest', {
      definition: {
        id: t.id,
      },
    });
    const objectTest = new appsync.ObjectType('objectTest', {
      interfaceTypes: [baseTest],
      definition: {
        id2: t.id,
      },
      directives: [appsync.Directive.custom('@test')],
    });

    api.addToSchema(baseTest.toString());
    api.addToSchema(objectTest.toString());
    const gql_interface = 'interface baseTest {\n  id: ID\n}\n';
    const gql_object = 'type objectTest implements baseTest @test {\n  id2: ID\n  id: ID\n}\n';
    const out = `${gql_interface}${gql_object}`;

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: `${out}`,
    });
  });

  test('ObjectType can implement from multiple interface types', () => {
    // WHEN
    const baseTest = new appsync.InterfaceType('baseTest', {
      definition: { id: t.id },
    });
    const anotherTest = new appsync.InterfaceType('anotherTest', {
      definition: { id2: t.id },
    });
    const objectTest = new appsync.ObjectType('objectTest', {
      interfaceTypes: [anotherTest, baseTest],
      definition: {
        id3: t.id,
      },
    });

    api.addToSchema(baseTest.toString());
    api.addToSchema(anotherTest.toString());
    api.addToSchema(objectTest.toString());

    const gql_interface = 'interface baseTest {\n  id: ID\n}\ninterface anotherTest {\n  id2: ID\n}\n';
    const gql_object = 'type objectTest implements anotherTest, baseTest {\n  id3: ID\n  id2: ID\n  id: ID\n}\n';
    const out = `${gql_interface}${gql_object}`;

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: `${out}`,
    });
  });

  test('Object Type can be a Graphql Type', () => {
    // WHEN
    const baseTest = new appsync.ObjectType('baseTest', {
      definition: {
        id: t.id,
      },
    });
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

  test('Object Type can implement Resolvable Field in definition', () => {
    // WHEN
    const field = new appsync.ResolvableField({
      returnType: t.string,
      dataSource: api.addNoneDataSource('none'),
      args: {
        arg: t.int,
      },
    });
    const test = new appsync.ObjectType('Test', {
      definition: {
        test: t.string,
        resolve: field,
      },
    });
    api.addToSchema(test.toString());
    const out = 'type Test {\n  test: String\n  resolve(arg: Int): String\n}\n';

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: `${out}`,
    });
  });

  test('Object Type can implement Resolvable Field from GraphqlType', () => {
    // WHEN
    const field = new appsync.ResolvableField({
      returnType: t.string,
      dataSource: api.addNoneDataSource('none'),
      args: {
        arg: t.int,
      },
    });
    const test = new appsync.ObjectType('Test', {
      definition: {
        test: t.string,
        resolve: field,
      },
    });
    api.addToSchema(test.toString());
    const out = 'type Test {\n  test: String\n  resolve(arg: Int): String\n}\n';

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: `${out}`,
    });
  });

  test('Object Type can implement Resolvable Field for pipelineResolvers', () => {
    // WHEN
    const test = new appsync.ObjectType('Test', {
      definition: {
        resolve: new appsync.ResolvableField({
          returnType: t.string,
          dataSource: api.addNoneDataSource('none'),
          args: {
            arg: t.int,
          },
          pipelineConfig: ['test', 'test'],
        }),
      },
    });
    api.addToSchema(test.toString());

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::Resolver', {
      Kind: 'PIPELINE',
      PipelineConfig: { Functions: ['test', 'test'] },
    });
  });

  test('Object Type can dynamically add Fields', () => {
    // WHEN
    const field = new appsync.ResolvableField({
      returnType: t.string,
      dataSource: api.addNoneDataSource('none'),
      args: {
        arg: t.int,
      },
    });
    const test = new appsync.ObjectType('Test', {
      definition: {
        test: t.string,
      },
    });
    test.addField('resolve', field);
    // test.addField('resolve', field);
    test.addField('dynamic', t.string);

    api.addToSchema(test.toString());
    const out = 'type Test {\n  test: String\n  resolve(arg: Int): String\n  dynamic: String\n}\n';

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: `${out}`,
    });
    expect(stack).toHaveResource('AWS::AppSync::Resolver');
  });

  test('Object Type can dynamically add Fields', () => {
    // WHEN
    const garbage = new appsync.InterfaceType('Garbage', {
      definition: {
        garbage: t.string,
      },
    });
    const test = new appsync.ObjectType('Test', {
      definition: {
        test: t.string,
      },
    });
    const field = new appsync.ResolvableField({
      returnType: garbage.attribute(),
      dataSource: api.addNoneDataSource('none'),
      args: {
        arg: garbage.attribute(),
      },
    });
    test.addField('resolve', field);
    // test.addField('resolve', field);
    test.addField('dynamic', garbage.attribute());

    api.addToSchema(test.toString());
    const out = 'type Test {\n  test: String\n  resolve(arg: Garbage): Garbage\n  dynamic: Garbage\n}\n';

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: `${out}`,
    });
    expect(stack).toHaveResource('AWS::AppSync::Resolver');
  });
});
