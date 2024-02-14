import * as path from 'path';
import { Template } from '../../assertions';
import * as sqs from '../../aws-sqs';
import * as cdk from '../../core';
import * as appsync from '../lib';

// GLOBAL GIVEN
let stack: cdk.Stack;
let api: appsync.GraphqlApi;
beforeEach(() => {
  stack = new cdk.Stack();
  api = new appsync.GraphqlApi(stack, 'baseApi', {
    name: 'api',
    schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
    environmentVariables: {
      overwrite: 'false',
    },
  });
});

describe('configuring env vars in GraphQlApi init', () => {
  test('values are set on initialization', () => {
    // GIVEN
    const queue = new sqs.Queue(stack, 'queue');
    new appsync.GraphqlApi(stack, 'testApi', {
      name: 'api2',
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
      environmentVariables: {
        overwrite: 'false',
        key: 'value',
        url: queue.queueUrl,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::GraphQLApi', {
      EnvironmentVariables: {
        overwrite: 'false',
        key: 'value',
        url: { Ref: 'queue276F7297' },
      },
    });
  });

  test('errors are thrown on initialization', () => {
    // GIVEN
    expect(
      () =>
        new appsync.GraphqlApi(stack, 'testApi', {
          name: 'api2',
          schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
          environmentVariables: {
            // this key is invalid
            _overwrite: 'false',
          },
        }),
    ).toThrow();
  });
});

describe('setting environment variables', () => {
  test('add a variable', () => {
    // WHEN
    api.addEnvironmentVariable('hello', 'world');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::GraphQLApi', {
      EnvironmentVariables: {
        hello: 'world',
        overwrite: 'false',
      },
    });
  });

  test('overwrite a variable', () => {
    // WHEN
    api.addEnvironmentVariable('overwrite', 'true');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::GraphQLApi', {
      EnvironmentVariables: {
        overwrite: 'true',
      },
    });
  });
});

describe('using an invalid environment variable key throws an error', () => {
  test('key does not have minimum required length', () => {
    // THEN
    expect(() => api.addEnvironmentVariable('a', 'should fail')).toThrow();
  });

  test('key has an invalid character', () => {
    // THEN
    expect(() => api.addEnvironmentVariable('my_key!', 'should fail')).toThrow();
  });

  test('key is too long', () => {
    // THEN
    expect(() => api.addEnvironmentVariable(Array(513).fill('x').join(''), 'should fail')).toThrow();
  });

  test('key does not start with a letter', () => {
    // THEN
    expect(() => api.addEnvironmentVariable('_my_key', 'should fail')).toThrow();
  });
});

describe('setting references values', () => {
  test('set the sqs queue url as an env var value', () => {
    // GIVEN
    const queue = new sqs.Queue(stack, 'queue');

    // WHEN
    api.addEnvironmentVariable('url', queue.queueUrl);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppSync::GraphQLApi', {
      EnvironmentVariables: {
        overwrite: 'false',
        url: { Ref: 'queue276F7297' },
      },
    });
  });
});
