import { join } from 'path';
import '@aws-cdk/assert/jest';
import * as assets from '@aws-cdk/aws-s3-assets';
import * as cdk from '@aws-cdk/core';
import * as appsync from '../lib';
import * as t from './scalar-type-defintions';

// Schema Definitions
const type = new appsync.ObjectType('test', {
  definition: {
    version: t.required_string,
  },
});
const query = new appsync.ObjectType('Query', {
  definition: {
    getTests: new appsync.ResolvableField({
      returnType: type.attribute({ isRequiredList: true, isList: true }),
    }),
  },
});
const mutation = new appsync.ObjectType('Mutation', {
  definition: {
    addTest: new appsync.ResolvableField({
      returnType: type.attribute(),
      args: { version: t.required_string },
    }),
  },
});

let stack: cdk.Stack;
beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
});

test('appsync fails when both file path and s3 location are configured', () => {
  // THEN
  expect(() => {
    new appsync.GraphqlApi(stack, 'API', {
      name: 'demo',
      schema: new appsync.Schema({ filePath: 'fail', s3Location: 'garbage' }),
    });
  }).toThrowError('Schema can only be configured with either file path or s3 location, not both.');
});

describe('basic testing schema definition mode `code`', () => {

  test('definition mode `code` produces empty schema definition', () => {
    // WHEN
    new appsync.GraphqlApi(stack, 'API', {
      name: 'demo',
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: '',
    });
  });

  test('definition mode `code` generates correct schema with addToSchema', () => {
    // WHEN
    const api = new appsync.GraphqlApi(stack, 'API', {
      name: 'demo',
    });
    api.addType(type);
    api.addType(query);
    api.addType(mutation);

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: `${type.toString()}\n${query.toString()}\n${mutation.toString()}\n`,
    });
  });

  test('definition mode `code` allows for api to addQuery', () => {
    // WHEN
    const api = new appsync.GraphqlApi(stack, 'API', {
      name: 'demo',
    });
    api.addQuery('test', new appsync.ResolvableField({
      returnType: t.string,
    }));

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: 'schema {\n  query: Query\n}\ntype Query {\n  test: String\n}\n',
    });
  });

  test('definition mode `code` allows for schema to addQuery', () => {
    // WHEN
    const schema = new appsync.Schema();
    new appsync.GraphqlApi(stack, 'API', {
      name: 'demo',
      schema,
    });
    schema.addQuery('test', new appsync.ResolvableField({
      returnType: t.string,
    }));

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: 'schema {\n  query: Query\n}\ntype Query {\n  test: String\n}\n',
    });
  });

  test('definition mode `code` allows for api to addMutation', () => {
    // WHEN
    const api = new appsync.GraphqlApi(stack, 'API', {
      name: 'demo',
    });
    api.addMutation('test', new appsync.ResolvableField({
      returnType: t.string,
    }));

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: 'schema {\n  mutation: Mutation\n}\ntype Mutation {\n  test: String\n}\n',
    });
  });

  test('definition mode `code` allows for schema to addMutation', () => {
    // WHEN
    const schema = new appsync.Schema();
    new appsync.GraphqlApi(stack, 'API', {
      name: 'demo',
      schema,
    });
    schema.addMutation('test', new appsync.ResolvableField({
      returnType: t.string,
    }));

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: 'schema {\n  mutation: Mutation\n}\ntype Mutation {\n  test: String\n}\n',
    });
  });
});

describe('testing schema definition mode `file`', () => {

  test('definition mode `file` produces correct output', () => {
    // WHEN
    new appsync.GraphqlApi(stack, 'API', {
      name: 'demo',
      schema: appsync.Schema.fromAsset(join(__dirname, 'appsync.test.graphql')),
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      Definition: `${type.toString()}\n${query.toString()}\n${mutation.toString()}\n`,
    });
  });

  test('definition mode `file` errors when addType for object is called', () => {
    // WHEN
    const api = new appsync.GraphqlApi(stack, 'API', {
      name: 'demo',
      schema: appsync.Schema.fromAsset(join(__dirname, 'appsync.test.graphql')),
    });

    // THEN
    expect(() => {
      api.addType(new appsync.ObjectType('blah', {
        definition: { fail: t.id },
      }));
    }).toThrowError('API cannot add type because schema definition mode is not configured as CODE.');
  });

  test('definition mode `file` errors when addType for interface is called', () => {
    // WHEN
    const api = new appsync.GraphqlApi(stack, 'API', {
      name: 'demo',
      schema: appsync.Schema.fromAsset(join(__dirname, 'appsync.test.graphql')),
    });

    // THEN
    expect(() => {
      api.addType(new appsync.InterfaceType('blah', {
        definition: { fail: t.id },
      }));
    }).toThrowError('API cannot add type because schema definition mode is not configured as CODE.');
  });

  test('definition mode `file` errors when addToSchema is called', () => {
    // WHEN
    const api = new appsync.GraphqlApi(stack, 'API', {
      name: 'demo',
      schema: appsync.Schema.fromAsset(join(__dirname, 'appsync.test.graphql')),
    });

    // THEN
    expect(() => {
      api.addToSchema('blah');
    }).toThrowError('API cannot append to schema because schema definition mode is not configured as CODE.');
  });

  test('definition mode `file` errors when addQuery is called', () => {
    // WHEN
    const api = new appsync.GraphqlApi(stack, 'API', {
      name: 'demo',
      schema: appsync.Schema.fromAsset(join(__dirname, 'appsync.test.graphql')),
    });

    // THEN
    expect(() => {
      api.addQuery('blah', new appsync.ResolvableField({ returnType: t.string }));
    }).toThrowError('Unable to add query. Schema definition mode must be CODE Received: FILE');
  });

  test('definition mode `file` errors when addMutation is called', () => {
    // WHEN
    const api = new appsync.GraphqlApi(stack, 'API', {
      name: 'demo',
      schema: appsync.Schema.fromAsset(join(__dirname, 'appsync.test.graphql')),
    });

    // THEN
    expect(() => {
      api.addMutation('blah', new appsync.ResolvableField({ returnType: t.string }));
    }).toThrowError('Unable to add mutation. Schema definition mode must be CODE Received: FILE');
  });
});

describe('testing schema definition mode `s3`', () => {

  test('definition mode `s3` produces correct output', () => {
    // GIVEN
    const schemaAsset = new assets.Asset(stack, 'Schema', {
      path: join(__dirname, 'appsync.test.graphql'),
    });
    // WHEN
    new appsync.GraphqlApi(stack, 'API', {
      name: 'demo',
      schema: appsync.Schema.fromS3Location(schemaAsset.s3ObjectUrl),
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
      DefinitionS3Location: {
        'Fn::Join': ['', ['s3://',
          { Ref: 'AssetParametersd915eeba150016e6e51f327f3d1f8a3701dfb7456e8dc17426c8960cecb2d9beS3BucketCB5CC368' },
          '/',
          {
            'Fn::Select': [0, {
              'Fn::Split': ['||',
                { Ref: 'AssetParametersd915eeba150016e6e51f327f3d1f8a3701dfb7456e8dc17426c8960cecb2d9beS3VersionKeyB59D7BBD' }],
            }],
          },
          {
            'Fn::Select': [1, {
              'Fn::Split': ['||'],
            }],
          }]],
      },
    });
  });

  test('definition mode `s3` errors when addType for object is called', () => {
    // WHEN
    const api = new appsync.GraphqlApi(stack, 'API', {
      name: 'demo',
      schema: appsync.Schema.fromS3Location('garbage'),
    });

    // THEN
    expect(() => {
      api.addType(new appsync.ObjectType('blah', {
        definition: { fail: t.id },
      }));
    }).toThrowError('API cannot add type because schema definition mode is not configured as CODE.');
  });

  test('definition mode `s3` errors when addType for interface is called', () => {
    // WHEN
    const api = new appsync.GraphqlApi(stack, 'API', {
      name: 'demo',
      schema: appsync.Schema.fromS3Location('garbage'),
    });

    // THEN
    expect(() => {
      api.addType(new appsync.InterfaceType('blah', {
        definition: { fail: t.id },
      }));
    }).toThrowError('API cannot add type because schema definition mode is not configured as CODE.');
  });

  test('definition mode `s3` errors when addToSchema is called', () => {
    // WHEN
    const api = new appsync.GraphqlApi(stack, 'API', {
      name: 'demo',
      schema: appsync.Schema.fromS3Location('garbage'),
    });

    // THEN
    expect(() => {
      api.addToSchema('blah');
    }).toThrowError('API cannot append to schema because schema definition mode is not configured as CODE.');
  });

  test('definition mode `s3` errors when addQuery is called', () => {
    // WHEN
    const api = new appsync.GraphqlApi(stack, 'API', {
      name: 'demo',
      schema: appsync.Schema.fromS3Location('garbage'),
    });

    // THEN
    expect(() => {
      api.addQuery('blah', new appsync.ResolvableField({ returnType: t.string }));
    }).toThrowError('Unable to add query. Schema definition mode must be CODE Received: S3');
  });

  test('definition mode `s3` errors when addMutation is called', () => {
    // WHEN
    const api = new appsync.GraphqlApi(stack, 'API', {
      name: 'demo',
      schema: appsync.Schema.fromS3Location('garbage'),
    });

    // THEN
    expect(() => {
      api.addMutation('blah', new appsync.ResolvableField({ returnType: t.string }));
    }).toThrowError('Unable to add mutation. Schema definition mode must be CODE Received: S3');
  });
});