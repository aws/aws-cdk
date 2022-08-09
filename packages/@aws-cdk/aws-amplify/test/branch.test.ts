import * as path from 'path';
import { Template } from '@aws-cdk/assertions';
import { Asset } from '@aws-cdk/aws-s3-assets';
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
      oauthToken: SecretValue.unsafePlainText('secret'),
    }),
  });
});

test('create a branch', () => {
  // WHEN
  app.addBranch('dev');

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Amplify::Branch', {
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
    basicAuth: amplify.BasicAuth.fromCredentials('username', SecretValue.unsafePlainText('password')),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Amplify::Branch', {
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
  Template.fromStack(stack).hasResourceProperties('AWS::Amplify::Branch', {
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
  Template.fromStack(stack).hasResourceProperties('AWS::Amplify::Branch', {
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

test('with asset deployment', () => {
  // WHEN
  const asset = new Asset(app, 'SampleAsset', {
    path: path.join(__dirname, './test-asset'),
  });
  app.addBranch('dev', { asset });

  // THEN
  Template.fromStack(stack).hasResourceProperties('Custom::AmplifyAssetDeployment', {
    ServiceToken: {
      'Fn::GetAtt': [
        'comamazonawscdkcustomresourcesamplifyassetdeploymentproviderNestedStackcomamazonawscdkcustomresourcesamplifyassetdeploymentproviderNestedStackResource89BDFEB2',
        'Outputs.comamazonawscdkcustomresourcesamplifyassetdeploymentprovideramplifyassetdeploymenthandlerproviderframeworkonEventA449D9A9Arn',
      ],
    },
    AppId: {
      'Fn::GetAtt': [
        'AppF1B96344',
        'AppId',
      ],
    },
    BranchName: 'dev',
    S3ObjectKey: '8c89eadc6be22019c81ed6b9c7d9929ae10de55679fd8e0e9fd4c00f8edc1cda.zip',
    S3BucketName: {
      'Fn::Sub': 'cdk-hnb659fds-assets-${AWS::AccountId}-${AWS::Region}',
    },
  });
});

test('with performance mode', () => {
  // WHEN
  app.addBranch('dev', {
    performanceMode: true,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Amplify::Branch', {
    EnablePerformanceMode: true,
  });
});
