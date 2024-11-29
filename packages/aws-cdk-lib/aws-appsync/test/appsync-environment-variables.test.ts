import * as path from 'path';
import { IConstruct } from 'constructs';
import { Match, Template } from '../../assertions';
import * as cdk from '../../core';
import * as appsync from '../lib';

let stack: cdk.Stack;
beforeEach(() => {
  stack = new cdk.Stack();
});

describe('environment variables', () => {
  test('can set environment variables', () => {
    // WHEN
    new appsync.GraphqlApi(stack, 'api', {
      name: 'api',
      definition: appsync.Definition.fromSchema(appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql'))),
      environmentVariables: {
        EnvKey1: 'non-empty-1',
        EnvKey2: 'non-empty-2',
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::GraphQLApi', {
      EnvironmentVariables: {
        EnvKey1: 'non-empty-1',
        EnvKey2: 'non-empty-2',
      },
    });
  });

  test('can set environment variables by addEnvironmentVariable method', () => {
    // WHEN
    const api = new appsync.GraphqlApi(stack, 'api', {
      name: 'api',
      definition: appsync.Definition.fromSchema(appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql'))),
    });
    api.addEnvironmentVariable('EnvKey1', 'non-empty-1');
    api.addEnvironmentVariable('EnvKey2', 'non-empty-2');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::GraphQLApi', {
      EnvironmentVariables: {
        EnvKey1: 'non-empty-1',
        EnvKey2: 'non-empty-2',
      },
    });
  });

  test('can set to undefined if environment variables is not specified', () => {
    // WHEN
    new appsync.GraphqlApi(stack, 'api', {
      name: 'api',
      definition: appsync.Definition.fromSchema(appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql'))),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::GraphQLApi', {
      EnvironmentVariables: Match.absent(),
    });
  });

  test('throws if environment variables key does not begin with a letter', () => {
    expect(() => {
      new appsync.GraphqlApi(stack, 'api', {
        name: 'api',
        definition: appsync.Definition.fromSchema(appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql'))),
        environmentVariables: {
          '1EnvKey': 'non-empty-1',
        },
      });
    }).toThrow(/Key '1EnvKey' must begin with a letter and can only contain letters, numbers, and underscores/);
  });

  test('throws if environment variables key by addEnvironmentVariable method does not begin with a letter', () => {
    // WHEN
    const api = new appsync.GraphqlApi(stack, 'api', {
      name: 'api',
      definition: appsync.Definition.fromSchema(appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql'))),
    });

    // THEN
    expect(() => {
      api.addEnvironmentVariable('1EnvKey', 'non-empty-1');
    }).toThrow(/Key '1EnvKey' must begin with a letter and can only contain letters, numbers, and underscores/);
  });

  test('throws if environment variables key is less than 2 characters long', () => {
    expect(() => {
      new appsync.GraphqlApi(stack, 'api', {
        name: 'api',
        definition: appsync.Definition.fromSchema(appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql'))),
        environmentVariables: {
          a: 'non-empty-1',
        },
      });
    }).toThrow(/Key 'a' must be between 2 and 64 characters long, got 1/);
  });

  test('throws if environment variables key by addEnvironmentVariable method is less than 2 characters long', () => {
    // WHEN
    const api = new appsync.GraphqlApi(stack, 'api', {
      name: 'api',
      definition: appsync.Definition.fromSchema(appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql'))),
    });

    // THEN
    expect(() => {
      api.addEnvironmentVariable('a', 'non-empty-1');
    }).toThrow(/Key 'a' must be between 2 and 64 characters long, got 1/);
  });

  test('throws if environment variables key is greater than 64 characters long', () => {
    expect(() => {
      new appsync.GraphqlApi(stack, 'api', {
        name: 'api',
        definition: appsync.Definition.fromSchema(appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql'))),
        environmentVariables: {
          aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa: 'non-empty-1',
        },
      });
    }).toThrow(/Key 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' must be between 2 and 64 characters long, got 65/);
  });

  test('throws if environment variables key by addEnvironmentVariable method is greater than 64 characters long', () => {
    // WHEN
    const api = new appsync.GraphqlApi(stack, 'api', {
      name: 'api',
      definition: appsync.Definition.fromSchema(appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql'))),
    });

    // THEN
    expect(() => {
      api.addEnvironmentVariable('a'.repeat(65), 'non-empty-1');
    }).toThrow(/Key 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' must be between 2 and 64 characters long, got 65/);
  });

  test('throws if environment variables key contains invalid characters', () => {
    expect(() => {
      new appsync.GraphqlApi(stack, 'api', {
        name: 'api',
        definition: appsync.Definition.fromSchema(appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql'))),
        environmentVariables: {
          '1|2|3': 'non-empty-1',
        },
      });
    }).toThrow(/Key '1\|2\|3' must begin with a letter and can only contain letters, numbers, and underscores/);
  });

  test('throws if environment variables key by addEnvironmentVariable method contains invalid characters', () => {
    // WHEN
    const api = new appsync.GraphqlApi(stack, 'api', {
      name: 'api',
      definition: appsync.Definition.fromSchema(appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql'))),
    });

    // THEN
    expect(() => {
      api.addEnvironmentVariable('1|2|3', 'non-empty-1');
    }).toThrow(/Key '1\|2\|3' must begin with a letter and can only contain letters, numbers, and underscores/);
  });

  test('throws if length of environment variables value is greater than 512', () => {
    expect(() => {
      new appsync.GraphqlApi(stack, 'api', {
        name: 'api',
        definition: appsync.Definition.fromSchema(appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql'))),
        environmentVariables: {
          EnvKey1: 'a'.repeat(513),
        },
      });
    }).toThrow(/Value for 'EnvKey1' is too long. Values can be up to 512 characters long, got 513/);
  });

  test('throws if length of environment variables value by addEnvironmentVariable method is greater than 512', () => {
    // WHEN
    const api = new appsync.GraphqlApi(stack, 'api', {
      name: 'api',
      definition: appsync.Definition.fromSchema(appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql'))),
    });

    // THEN
    expect(() => {
      api.addEnvironmentVariable('EnvKey1', 'a'.repeat(513));
    }).toThrow(/Value for 'EnvKey1' is too long. Values can be up to 512 characters long, got 513/);
  });

  test('throws if length of key-value pairs for environment variables is greater than 50', () => {
    // WHEN
    const vars = {};
    for (let i = 0; i < 51; i++) {
      vars[`EnvKey${i}`] = `non-empty-${i}`;
    }
    new appsync.GraphqlApi(stack, 'api', {
      name: 'api',
      definition: appsync.Definition.fromSchema(appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql'))),
      environmentVariables: vars,
    });

    const errors = validate(stack);
    expect(errors.length).toEqual(1);
    const error = errors[0];

    // THEN
    expect(error).toMatch(/Only 50 environment variables can be set, got 51/);
  });

  test('throws if length of key-value pairs for environment variables by addEnvironmentVariable method is greater than 50', () => {
    // WHEN
    const api = new appsync.GraphqlApi(stack, 'api', {
      name: 'api',
      definition: appsync.Definition.fromSchema(appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql'))),
    });

    for (let i = 0; i < 51; i++) {
      api.addEnvironmentVariable(`EnvKey${i}`, `non-empty-${i}`);
    }

    const errors = validate(stack);
    expect(errors.length).toEqual(1);
    const error = errors[0];

    // THEN
    expect(error).toMatch(/Only 50 environment variables can be set, got 51/);
  });

  test('throws if environment variables are set on merged API', () => {
    // GIVEN
    const source = new appsync.GraphqlApi(stack, 'source', {
      name: 'source',
      definition: appsync.Definition.fromSchema(appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql'))),
    });

    // THEN
    expect(() => {
      new appsync.GraphqlApi(stack, 'api', {
        name: 'api',
        definition: appsync.Definition.fromSourceApis({
          sourceApis: [
            {
              sourceApi: source,
            },
          ],
        }),
        environmentVariables: {
          EnvKey1: 'non-empty-1',
        },
      });
    }).toThrow(/Environment variables are not supported for merged APIs/);
  });

  test('throws if environment variables are set by addEnvironmentVariable method on merged API', () => {
    // GIVEN
    const source = new appsync.GraphqlApi(stack, 'source', {
      name: 'source',
      definition: appsync.Definition.fromSchema(appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql'))),
    });

    // WHEN
    const api = new appsync.GraphqlApi(stack, 'api', {
      name: 'api',
      definition: appsync.Definition.fromSourceApis({
        sourceApis: [
          {
            sourceApi: source,
          },
        ],
      }),
    });

    // THEN
    expect(() => {
      api.addEnvironmentVariable('EnvKey1', 'non-empty-1');
    }).toThrow(/Environment variables are not supported for merged APIs/);
  });
});

function validate(construct: IConstruct): string[] {
  try {
    (construct.node.root as cdk.App).synth();
    return [];
  } catch (err: any) {
    if (!('message' in err) || !err.message.startsWith('Validation failed')) {
      throw err;
    }
    return err.message.split('\n').slice(1);
  }
}
