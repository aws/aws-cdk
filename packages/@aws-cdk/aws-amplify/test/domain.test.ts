import * as iam from '@aws-cdk/aws-iam';
import '@aws-cdk/assert/jest';
import { App, SecretValue, Stack } from '@aws-cdk/core';
import * as amplify from '../lib';

test('create a domain', () => {
  // GIVEN
  const stack = new Stack();
  const app = new amplify.App(stack, 'App', {
    sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
      owner: 'aws',
      repository: 'aws-cdk',
      oauthToken: SecretValue.plainText('secret'),
    }),
  });
  const prodBranch = app.addBranch('master');
  const devBranch = app.addBranch('dev');

  // WHEN
  const domain = app.addDomain('amazon.com', {
    subDomains: [
      {
        branch: prodBranch,
        prefix: 'prod',
      },
    ],
  });
  domain.mapSubDomain(devBranch);

  // THEN
  expect(stack).toHaveResource('AWS::Amplify::Domain', {
    AppId: {
      'Fn::GetAtt': [
        'AppF1B96344',
        'AppId',
      ],
    },
    DomainName: 'amazon.com',
    SubDomainSettings: [
      {
        BranchName: {
          'Fn::GetAtt': [
            'Appmaster71597E87',
            'BranchName',
          ],
        },
        Prefix: 'prod',
      },
      {
        BranchName: {
          'Fn::GetAtt': [
            'AppdevB328DAFC',
            'BranchName',
          ],
        },
        Prefix: {
          'Fn::GetAtt': [
            'AppdevB328DAFC',
            'BranchName',
          ],
        },
      },
    ],
  });
});

test('map a branch to the domain root', () => {
  // GIVEN
  const stack = new Stack();
  const app = new amplify.App(stack, 'App', {
    sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
      owner: 'aws',
      repository: 'aws-cdk',
      oauthToken: SecretValue.plainText('secret'),
    }),
  });
  const prodBranch = app.addBranch('master');

  // WHEN
  const domain = app.addDomain('amazon.com');
  domain.mapRoot(prodBranch);

  // THEN
  expect(stack).toHaveResource('AWS::Amplify::Domain', {
    AppId: {
      'Fn::GetAtt': [
        'AppF1B96344',
        'AppId',
      ],
    },
    DomainName: 'amazon.com',
    SubDomainSettings: [
      {
        BranchName: {
          'Fn::GetAtt': [
            'Appmaster71597E87',
            'BranchName',
          ],
        },
        Prefix: '',
      },
    ],
  });
});

test('throws at synthesis without subdomains', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'test-stack');
  const amplifyApp = new amplify.App(stack, 'App', {
    sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
      owner: 'aws',
      repository: 'aws-cdk',
      oauthToken: SecretValue.plainText('secret'),
    }),
  });

  // WHEN
  amplifyApp.addDomain('amazon.com');

  // THEN
  expect(() => app.synth()).toThrow(/The domain doesn't contain any subdomains/);
});

test('auto subdomain all branches', () => {
  // GIVEN
  const stack = new Stack();
  const app = new amplify.App(stack, 'App', {
    sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
      owner: 'aws',
      repository: 'aws-cdk',
      oauthToken: SecretValue.plainText('secret'),
    }),
  });
  const prodBranch = app.addBranch('master');

  // WHEN
  const domain = app.addDomain('amazon.com', {
    enableAutoSubdomain: true,
  });
  domain.mapRoot(prodBranch);

  // THEN
  expect(stack).toHaveResource('AWS::Amplify::Domain', {
    EnableAutoSubDomain: true,
    AutoSubDomainCreationPatterns: [
      '*',
      'pr*',
    ],
    AutoSubDomainIAMRole: {
      'Fn::GetAtt': [
        'AppRole1AF9B530',
        'Arn',
      ],
    },
  });
});

test('auto subdomain some branches', () => {
  // GIVEN
  const stack = new Stack();
  const app = new amplify.App(stack, 'App', {
    sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
      owner: 'aws',
      repository: 'aws-cdk',
      oauthToken: SecretValue.plainText('secret'),
    }),
  });
  const prodBranch = app.addBranch('master');

  // WHEN
  const domain = app.addDomain('amazon.com', {
    enableAutoSubdomain: true,
    autoSubdomainCreationPatterns: ['features/**'],
  });
  domain.mapRoot(prodBranch);

  // THEN
  expect(stack).toHaveResource('AWS::Amplify::Domain', {
    EnableAutoSubDomain: true,
    AutoSubDomainCreationPatterns: ['features/**'],
    AutoSubDomainIAMRole: {
      'Fn::GetAtt': [
        'AppRole1AF9B530',
        'Arn',
      ],
    },
  });
});

test('auto subdomain with IAM role', () => {
  // GIVEN
  const stack = new Stack();
  const app = new amplify.App(stack, 'App', {
    sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
      owner: 'aws',
      repository: 'aws-cdk',
      oauthToken: SecretValue.plainText('secret'),
    }),
    role: iam.Role.fromRoleArn(
      stack,
      'AmplifyRole',
      `arn:aws:iam::${Stack.of(stack).account}:role/AmplifyRole`,
      { mutable: false },
    ),
  });
  const prodBranch = app.addBranch('master');

  // WHEN
  const domain = app.addDomain('amazon.com', {
    enableAutoSubdomain: true,
    autoSubdomainCreationPatterns: ['features/**'],
  });
  domain.mapRoot(prodBranch);

  // THEN
  expect(stack).toHaveResource('AWS::Amplify::Domain', {
    EnableAutoSubDomain: true,
    AutoSubDomainCreationPatterns: ['features/**'],
    AutoSubDomainIAMRole: {
      'Fn::Join': [
        '',
        [
          'arn:aws:iam::',
          {
            Ref: 'AWS::AccountId',
          },
          ':role/AmplifyRole',
        ],
      ],
    },
  });
});