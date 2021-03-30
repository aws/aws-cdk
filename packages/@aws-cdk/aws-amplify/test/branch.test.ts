import '@aws-cdk/assert-internal/jest';
import { SecretValue, Stack } from '@aws-cdk/core';
import * as amplify from '../lib';

let stack: Stack;
let app: amplify.App;
beforeEach(() => {
  stack = new Stack();
  app = new amplify.App(stack, 'App', {
    sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
      owner: 'aws',
      repository: 'aws-cdk',
      oauthToken: SecretValue.plainText('secret'),
    }),
  });
});

test('create a branch', () => {
  // WHEN
  app.addBranch('dev');

  // THEN
  expect(stack).toHaveResource('AWS::Amplify::Branch', {
    AppId: {
      'Fn::GetAtt': [
        'AppF1B96344',
        'AppId',
      ],
    },
    BranchName: 'dev',
    EnableAutoBuild: true,
    EnablePullRequestPreview: true,
  });
});

test('with basic auth from credentials', () => {
  // WHEN
  app.addBranch('dev', {
    basicAuth: amplify.BasicAuth.fromCredentials('username', SecretValue.plainText('password')),
  });

  // THEN
  expect(stack).toHaveResource('AWS::Amplify::Branch', {
    BasicAuthConfig: {
      EnableBasicAuth: true,
      Password: 'password',
      Username: 'username',
    },
  });
});

test('with basic auth from generated password', () => {
  // WHEN
  app.addBranch('dev', {
    basicAuth: amplify.BasicAuth.fromGeneratedPassword('username'),
  });

  // THEN
  expect(stack).toHaveResource('AWS::Amplify::Branch', {
    BasicAuthConfig: {
      EnableBasicAuth: true,
      Password: {
        'Fn::Join': [
          '',
          [
            '{{resolve:secretsmanager:',
            {
              Ref: 'AppdevdevBasicAuthB25D2314',
            },
            ':SecretString:password::}}',
          ],
        ],
      },
      Username: 'username',
    },
  });
});

test('with env vars', () => {
  // WHEN
  const branch = app.addBranch('dev', {
    environmentVariables: {
      key1: 'value1',
    },
  });
  branch.addEnvironment('key2', 'value2');

  // THEN
  expect(stack).toHaveResource('AWS::Amplify::Branch', {
    EnvironmentVariables: [
      {
        Name: 'key1',
        Value: 'value1',
      },
      {
        Name: 'key2',
        Value: 'value2',
      },
    ],
  });
});
