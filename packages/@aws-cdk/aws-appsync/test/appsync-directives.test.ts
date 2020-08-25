import '@aws-cdk/assert/jest';
import * as cdk from '@aws-cdk/core';
import * as appsync from '../lib';
import * as t from './scalar-type-defintions';

const iam = [appsync.Directive.iam()];
const apiKey = [appsync.Directive.apiKey()];
const oidc = [appsync.Directive.oidc()];
const cognito_default = [appsync.Directive.cognito(['test', 'test2'])];
const cognito_additional = [appsync.Directive.cognito(['test', 'test2'], true)];
const custom = [appsync.Directive.custom('custom')];

const generateField = (directives: appsync.Directive[]): appsync.Field => {
  return new appsync.Field({
    returnType: t.string,
    directives,
  });
};

const generateRField = (directives: appsync.Directive[]): appsync.ResolvableField => {
  return new appsync.ResolvableField({
    returnType: t.string,
    directives,
  });
};

let stack: cdk.Stack;
let api: appsync.GraphQLApi;
beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
  api = new appsync.GraphQLApi(stack, 'api', {
    name: 'api',
  });
});

const testObjectType = (IApi: appsync.GraphQLApi, directives: appsync.Directive[], tag: string): any => {
  // WHEN
  IApi.addObjectType('Test', {
    definition: {
      field: generateField(directives),
      rfield: generateRField(directives),
    },
    directives: directives,
  });
  // THEN
  expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
    Definition: `type Test ${tag} {\n  field: String\n  ${tag}\n  rfield: String\n  ${tag}\n}\n`,
  });
};

const testInterfaceType = (IApi: appsync.GraphQLApi, directives: appsync.Directive[], tag: string): any => {
  // WHEN
  IApi.addInterfaceType('Test', {
    definition: {
      field: generateField(directives),
      rfield: generateRField(directives),
    },
    directives: directives,
  });
  // THEN
  expect(stack).toHaveResourceLike('AWS::AppSync::GraphQLSchema', {
    Definition: `interface Test ${tag} {\n  field: String\n  ${tag}\n  rfield: String\n  ${tag}\n}\n`,
  });
};

describe('Basic Testing of Directives for Code-First', () => {
  test('Iam directive configures in Object Type', () => { testObjectType(api, iam, '@aws_iam'); });

  test('Iam directive configures in Interface Type', () => { testInterfaceType(api, iam, '@aws_iam'); });

  test('Api Key directive configures in Object Type', () => { testObjectType(api, apiKey, '@aws_api_key'); });

  test('Api Key directive configures in Interface Type', () => { testInterfaceType(api, apiKey, '@aws_api_key'); });

  test('OIDC directive configures in Object Type', () => { testObjectType(api, oidc, '@aws_oidc'); });

  test('OIDC directive configures in Interface Type', () => { testInterfaceType(api, oidc, '@aws_oidc'); });

  test('Cognito as default directive configures in Object Type', () => {
    testObjectType(api, cognito_default, '@aws_auth(cognito_groups: ["test", "test2"])');
  });

  test('Cognito as default directive configures in Interface Type', () => {
    testInterfaceType(api, cognito_default, '@aws_auth(cognito_groups: ["test", "test2"])');
  });

  test('Cognito as additional directive configures in Object Type', () => {
    testObjectType(api, cognito_additional, '@aws_cognito_user_pools(cognito_groups: ["test", "test2"])');
  });

  test('Custom directive configures in Object Type', () => {
    testObjectType(api, custom, 'custom');
  });

  test('Custom directive configures in Interface Type', () => {
    testInterfaceType(api, custom, 'custom');
  });
});