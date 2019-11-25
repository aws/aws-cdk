import '@aws-cdk/assert/jest';
import codebuild = require('@aws-cdk/aws-codebuild');
import { SecretValue, Stack } from '@aws-cdk/core';
import amplify = require('../lib');

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('create an app', () => {
  // WHEN
  new amplify.App(stack, 'App', {
    repository: 'https://github.com/aws/aws-cdk',
    oauthToken: SecretValue.plainText('secret'),
    buildSpec: codebuild.BuildSpec.fromObject({
      version: '1.0',
      frontend: {
        phases: {
          build: {
            commands: [
              'npm run build'
            ]
          }
        }
      }
    })
  });

  // THEN
  expect(stack).toHaveResource('AWS::Amplify::App', {
    Name: 'App',
    BuildSpec: '{\n  \"version\": \"1.0\",\n  \"frontend\": {\n    \"phases\": {\n      \"build\": {\n        \"commands\": [\n          \"npm run build\"\n        ]\n      }\n    }\n  }\n}',
    IAMServiceRole: {
      'Fn::GetAtt': [
        'AppRole1AF9B530',
        'Arn'
      ]
    },
    OauthToken: 'secret',
    Repository: 'https://github.com/aws/aws-cdk'
  });

  expect(stack).toHaveResource('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [
        {
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Principal: {
            Service: 'amplify.amazonaws.com'
          }
        }
      ],
      Version: '2012-10-17'
    }
  });
});

test('with basic auth from credentials', () => {
  // WHEN
  new amplify.App(stack, 'App', {
    repository: 'https://github.com/aws/aws-cdk',
    oauthToken: SecretValue.plainText('secret'),
    basicAuth: amplify.BasicAuth.fromCredentials('username', SecretValue.plainText('password'))
  });

  // THEN
  expect(stack).toHaveResource('AWS::Amplify::App', {
    BasicAuthConfig: {
      EnableBasicAuth: true,
      Password: 'password',
      Username: 'username'
    }
  });
});

test('with basic auth from generated password', () => {
  // WHEN
  new amplify.App(stack, 'App', {
    repository: 'https://github.com/aws/aws-cdk',
    oauthToken: SecretValue.plainText('secret'),
    basicAuth: amplify.BasicAuth.fromGeneratedPassword('username')
  });

  // THEN
  expect(stack).toHaveResource('AWS::Amplify::App', {
    BasicAuthConfig: {
      EnableBasicAuth: true,
      Password: {
        'Fn::Join': [
          '',
          [
            '{{resolve:secretsmanager:',
            {
              Ref: 'AppAppBasicAuthE743F015'
            },
            ':SecretString:password::}}'
          ]
        ]
      },
      Username: 'username'
    }
  });

  expect(stack).toHaveResource('AWS::SecretsManager::Secret', {
    GenerateSecretString: {
      GenerateStringKey: 'password',
      SecretStringTemplate: '{\"username\":\"username\"}'
    }
  });
});

test('with env vars', () => {
  // WHEN
  const app = new amplify.App(stack, 'App', {
    repository: 'https://github.com/aws/aws-cdk',
    oauthToken: SecretValue.plainText('secret'),
    environmentVariables: {
      key1: 'value1'
    }
  });
  app.addEnvironment('key2', 'value2');

  // THEN
  expect(stack).toHaveResource('AWS::Amplify::App', {
    EnvironmentVariables: [
      {
        Name: 'key1',
        Value: 'value1'
      },
      {
        Name: 'key2',
        Value: 'value2'
      }
    ]
  });
});

test('with custom rules', () => {
  // WHEN
  const app = new amplify.App(stack, 'App', {
    repository: 'https://github.com/aws/aws-cdk',
    oauthToken: SecretValue.plainText('secret'),
    customRules: [
      {
        source: '/source1',
        target: '/target1',
        status: amplify.RedirectStatus.PERMANENT_REDIRECT
      }
    ]
  });
  app.addCustomRule({
    source: '/source2',
    target: '/target2',
    status: amplify.RedirectStatus.TEMPORARY_REDIRECT
  });

  // THEN
  expect(stack).toHaveResource('AWS::Amplify::App', {
    CustomRules: [
      {
        Source: '/source1',
        Status: '301',
        Target: '/target1'
      },
      {
        Source: '/source2',
        Status: '302',
        Target: '/target2'
      }
    ]
  });
});

test('with auto branch creation', () => {
  // WHEN
  const app = new amplify.App(stack, 'App', {
    repository: 'https://github.com/aws/aws-cdk',
    oauthToken: SecretValue.plainText('secret'),
    autoBranchCreation: {
      environmentVariables: {
        key1: 'value1'
      }
    }
  });
  app.addAutoBranchEnvironment('key2', 'value2');

  // THEN
  expect(stack).toHaveResource('AWS::Amplify::App', {
    AutoBranchCreationConfig: {
      EnableAutoBranchCreation: true,
      EnableAutoBuild: true,
      EnablePullRequestPreview: true,
      EnvironmentVariables: [
        {
          Name: 'key1',
          Value: 'value1'
        },
        {
          Name: 'key2',
          Value: 'value2'
        }
      ]
    }
  });
});

test('throws when both access token and oauth token are not specified', () => {
  expect(() => new amplify.App(stack, 'App', {
    repository: 'https://github.com/aws/aws-cdk'
  })).toThrow('Either `accessToken` or `oauthToken` must be specified');
});

test('throws if repository is not https', () => {
  expect(() => new amplify.App(stack, 'App', {
    repository: 'git@github.com:aws/aws-cdk.git',
    oauthToken: SecretValue.plainText('secret'),
  })).toThrow('`repository` must use the HTTPS protocol');
});
