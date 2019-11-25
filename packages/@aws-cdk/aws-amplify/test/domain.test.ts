import '@aws-cdk/assert/jest';
import { App, SecretValue, Stack } from '@aws-cdk/core';
import amplify = require('../lib');

test('create a domain', () => {
  // GIVEN
  const stack = new Stack();
  const app = new amplify.App(stack, 'App', {
    repository: 'https://github.com/aws/aws-cdk',
    oauthToken: SecretValue.plainText('secret'),
  });
  const prodBranch = app.addBranch('master');
  const devBranch = app.addBranch('dev');

  // WHEN
  const domain = app.addDomain('amazon.com', {
    subDomains: [
      {
        branch: prodBranch,
        prefix: 'prod'
      }
    ]
  });
  domain.mapSubDomain(devBranch);

  // THEN
  expect(stack).toHaveResource('AWS::Amplify::Domain', {
    AppId: {
      'Fn::GetAtt': [
        'AppF1B96344',
        'AppId'
      ]
    },
    DomainName: 'amazon.com',
    SubDomainSettings: [
      {
        BranchName: {
          'Fn::GetAtt': [
            'Appmaster71597E87',
            'BranchName'
          ]
        },
        Prefix: 'prod'
      },
      {
        BranchName: {
          'Fn::GetAtt': [
            'AppdevB328DAFC',
            'BranchName'
          ]
        },
        Prefix: {
          'Fn::GetAtt': [
            'AppdevB328DAFC',
            'BranchName'
          ]
        }
      }
    ]
  });
});

test('throws at synthesis without subdomains', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'test-stack');
  const amplifyApp = new amplify.App(stack, 'App', {
    repository: 'https://github.com/aws/aws-cdk',
    oauthToken: SecretValue.plainText('secret'),
  });

  // WHEN
  amplifyApp.addDomain('amazon.com');

  // THEN
  expect(() => app.synth()).toThrow(/The domain doesn't contain any subdomains/);
});
