import { Template } from '@aws-cdk/assertions';
import { App, CfnOutput, Stack } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import * as iam from '../lib';
import { ServicePrincipal } from '../lib';

test('use of cross-stack role reference does not lead to URLSuffix being exported', () => {
  // GIVEN
  const app = new App();
  const first = new Stack(app, 'First');
  const second = new Stack(app, 'Second');

  // WHEN
  const role = new iam.Role(first, 'Role', {
    assumedBy: new iam.ServicePrincipal('s3.amazonaws.com'),
  });

  new CfnOutput(second, 'Output', {
    value: role.roleArn,
  });

  // THEN
  app.synth();

  Template.fromStack(first).templateMatches({
    Resources: {
      Role1ABCC5F0: {
        Type: 'AWS::IAM::Role',
        Properties: {
          AssumeRolePolicyDocument: {
            Statement: [
              {
                Action: 'sts:AssumeRole',
                Effect: 'Allow',
                Principal: { Service: 's3.amazonaws.com' },
              },
            ],
            Version: '2012-10-17',
          },
        },
      },
    },
    Outputs: {
      ExportsOutputFnGetAttRole1ABCC5F0ArnB4C0B73E: {
        Value: { 'Fn::GetAtt': ['Role1ABCC5F0', 'Arn'] },
        Export: {
          Name: 'First:ExportsOutputFnGetAttRole1ABCC5F0ArnB4C0B73E',
        },
      },
    },
  },
  );
});

test('cannot have multiple principals with different conditions in the same statement', () => {
  const stack = new Stack(undefined, 'First');
  const user = new iam.User(stack, 'User');

  expect(() => {
    user.addToPolicy(new iam.PolicyStatement({
      principals: [
        new iam.ServicePrincipal('myService.amazon.com', {
          conditions: {
            StringEquals: {
              hairColor: 'blond',
            },
          },
        }),
        new iam.ServicePrincipal('yourservice.amazon.com', {
          conditions: {
            StringEquals: {
              hairColor: 'black',
            },
          },
        }),
      ],
    }));
  }).toThrow(/All principals in a PolicyStatement must have the same Conditions/);
});

test('can have multiple principals the same conditions in the same statement', () => {
  const stack = new Stack(undefined, 'First');
  const user = new iam.User(stack, 'User');

  user.addToPolicy(new iam.PolicyStatement({
    principals: [
      new iam.ServicePrincipal('myService.amazon.com'),
      new iam.ServicePrincipal('yourservice.amazon.com'),
    ],
  }));

  user.addToPolicy(new iam.PolicyStatement({
    principals: [
      new iam.ServicePrincipal('myService.amazon.com', {
        conditions: {
          StringEquals: { hairColor: 'blond' },
        },
      }),
      new iam.ServicePrincipal('yourservice.amazon.com', {
        conditions: {
          StringEquals: { hairColor: 'blond' },
        },
      }),
    ],
  }));
});

test('use federated principal', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const principal = new iam.FederatedPrincipal('federated');

  // THEN
  expect(stack.resolve(principal.federated)).toStrictEqual('federated');
  expect(stack.resolve(principal.assumeRoleAction)).toStrictEqual('sts:AssumeRole');
  expect(stack.resolve(principal.conditions)).toStrictEqual({});
});

test('use Web Identity principal', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const principal = new iam.WebIdentityPrincipal('cognito-identity.amazonaws.com');

  // THEN
  expect(stack.resolve(principal.federated)).toStrictEqual('cognito-identity.amazonaws.com');
  expect(stack.resolve(principal.assumeRoleAction)).toStrictEqual('sts:AssumeRoleWithWebIdentity');
});

test('use OpenID Connect principal from provider', () => {
  // GIVEN
  const stack = new Stack();
  const provider = new iam.OpenIdConnectProvider(stack, 'MyProvider', {
    url: 'https://openid-endpoint',
  });

  // WHEN
  const principal = new iam.OpenIdConnectPrincipal(provider);

  // THEN
  expect(stack.resolve(principal.federated)).toStrictEqual({ Ref: 'MyProvider730BA1C8' });
});

test('SAML principal', () => {
  // GIVEN
  const stack = new Stack();
  const provider = new iam.SamlProvider(stack, 'MyProvider', {
    metadataDocument: iam.SamlMetadataDocument.fromXml('document'),
  });

  // WHEN
  const principal = new iam.SamlConsolePrincipal(provider);
  new iam.Role(stack, 'Role', {
    assumedBy: principal,
  });

  // THEN
  expect(stack.resolve(principal.federated)).toStrictEqual({ Ref: 'MyProvider730BA1C8' });
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [
        {
          Action: 'sts:AssumeRoleWithSAML',
          Condition: {
            StringEquals: {
              'SAML:aud': 'https://signin.aws.amazon.com/saml',
            },
          },
          Effect: 'Allow',
          Principal: {
            Federated: {
              Ref: 'MyProvider730BA1C8',
            },
          },
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('StarPrincipal', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const pol = new iam.PolicyDocument({
    statements: [
      new iam.PolicyStatement({
        actions: ['service:action'],
        resources: ['*'],
        principals: [new iam.StarPrincipal()],
      }),
    ],
  });

  // THEN
  expect(stack.resolve(pol)).toEqual({
    Statement: [
      {
        Action: 'service:action',
        Effect: 'Allow',
        Principal: '*',
        Resource: '*',
      },
    ],
    Version: '2012-10-17',
  });
});

test('PrincipalWithConditions.addCondition should work', () => {
  // GIVEN
  const stack = new Stack();
  const basePrincipal = new iam.ServicePrincipal('service.amazonaws.com');
  const principalWithConditions = new iam.PrincipalWithConditions(basePrincipal, {
    StringEquals: {
      'aws:PrincipalOrgID': ['o-xxxxxxxxxxx'],
    },
  });

  // WHEN
  principalWithConditions.addCondition('StringEquals', { 'aws:PrincipalTag/critical': 'true' });
  new iam.Role(stack, 'Role', {
    assumedBy: principalWithConditions,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [
        {
          Action: 'sts:AssumeRole',
          Condition: {
            StringEquals: {
              'aws:PrincipalOrgID': ['o-xxxxxxxxxxx'],
              'aws:PrincipalTag/critical': 'true',
            },
          },
          Effect: 'Allow',
          Principal: {
            Service: 'service.amazonaws.com',
          },
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('PrincipalWithConditions.addCondition with a new condition operator should work', () => {
  // GIVEN
  const stack = new Stack();
  const basePrincipal = new iam.ServicePrincipal('service.amazonaws.com');
  const principalWithConditions = new iam.PrincipalWithConditions(basePrincipal, { });

  // WHEN
  principalWithConditions.addCondition('StringEquals', { 'aws:PrincipalTag/critical': 'true' });
  principalWithConditions.addCondition('IpAddress', { 'aws:SourceIp': '0.0.0.0/0' });

  new iam.Role(stack, 'Role', {
    assumedBy: principalWithConditions,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [
        {
          Action: 'sts:AssumeRole',
          Condition: {
            StringEquals: {
              'aws:PrincipalTag/critical': 'true',
            },
            IpAddress: {
              'aws:SourceIp': '0.0.0.0/0',
            },
          },
          Effect: 'Allow',
          Principal: {
            Service: 'service.amazonaws.com',
          },
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('PrincipalWithConditions inherits principalAccount from AccountPrincipal ', () => {
  // GIVEN
  const accountPrincipal = new iam.AccountPrincipal('123456789012');
  const principalWithConditions = accountPrincipal.withConditions({ StringEquals: { hairColor: 'blond' } });

  // THEN
  expect(accountPrincipal.principalAccount).toStrictEqual('123456789012');
  expect(principalWithConditions.principalAccount).toStrictEqual('123456789012');
});

test('AccountPrincipal can specify an organization', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const pol = new iam.PolicyDocument({
    statements: [
      new iam.PolicyStatement({
        actions: ['service:action'],
        resources: ['*'],
        principals: [
          new iam.AccountPrincipal('123456789012').inOrganization('o-xxxxxxxxxx'),
        ],
      }),
    ],
  });

  // THEN
  expect(stack.resolve(pol)).toEqual({
    Statement: [
      {
        Action: 'service:action',
        Effect: 'Allow',
        Principal: {
          AWS: {
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':iam::123456789012:root',
              ],
            ],
          },
        },
        Condition: {
          StringEquals: {
            'aws:PrincipalOrgID': 'o-xxxxxxxxxx',
          },
        },
        Resource: '*',
      },
    ],
    Version: '2012-10-17',
  });
});

describe('deprecated ServicePrincipal behavior', () => {
  // This behavior makes use of deprecated region-info lookup tables

  test('ServicePrincipalName returns just a string representing the principal', () => {
    // GIVEN
    const usEastStack = new Stack(undefined, undefined, { env: { region: 'us-east-1' } });
    const afSouthStack = new Stack(undefined, undefined, { env: { region: 'af-south-1' } });
    const principalName = iam.ServicePrincipal.servicePrincipalName('states.amazonaws.com');

    expect(usEastStack.resolve(principalName)).toEqual('states.us-east-1.amazonaws.com');
    expect(afSouthStack.resolve(principalName)).toEqual('states.af-south-1.amazonaws.com');
  });

  test('Passing non-string as accountId parameter in AccountPrincipal constructor should throw error', () => {
    expect(() => new iam.AccountPrincipal(1234)).toThrowError('accountId should be of type string');
  });

  test('ServicePrincipal in agnostic stack generates lookup table', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('states.amazonaws.com'),
    });

    // THEN
    const template = Template.fromStack(stack);
    const mappings = template.findMappings('ServiceprincipalMap');
    expect(mappings.ServiceprincipalMap['af-south-1']?.states).toEqual('states.af-south-1.amazonaws.com');
    expect(mappings.ServiceprincipalMap['us-east-1']?.states).toEqual('states.us-east-1.amazonaws.com');
  });
});

describe('standardized Service Principal behavior', () => {
  const agnosticStatesPrincipal = new ServicePrincipal('states.amazonaws.com');
  const afSouth1StatesPrincipal = new ServicePrincipal('states.amazonaws.com', { region: 'af-south-1' });
  // af-south-1 is an opt-in region

  let app: App;
  beforeEach(() => {
    app = new App({
      postCliContext: { [cxapi.IAM_STANDARDIZED_SERVICE_PRINCIPALS]: true },
    });
  });

  test('no more regional service principals by default', () => {
    const stack = new Stack(app, 'Stack', { env: { region: 'us-east-1' } });
    expect(stack.resolve(agnosticStatesPrincipal.policyFragment).principalJson).toEqual({ Service: ['states.amazonaws.com'] });
  });

  test('regional service principal is added for cross-region reference to opt-in region', () => {
    const stack = new Stack(app, 'Stack', { env: { region: 'us-east-1' } });
    expect(stack.resolve(afSouth1StatesPrincipal.policyFragment).principalJson).toEqual({ Service: ['states.af-south-1.amazonaws.com'] });
  });

  test('regional service principal is not added for same-region reference in opt-in region', () => {
    const stack = new Stack(app, 'Stack', { env: { region: 'af-south-1' } });
    expect(stack.resolve(afSouth1StatesPrincipal.policyFragment).principalJson).toEqual({ Service: ['states.amazonaws.com'] });
  });

});

test('Can enable session tags', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new iam.Role(stack, 'Role', {
    assumedBy: new iam.WebIdentityPrincipal(
      'cognito-identity.amazonaws.com',
      {
        'StringEquals': { 'cognito-identity.amazonaws.com:aud': 'asdf' },
        'ForAnyValue:StringLike': { 'cognito-identity.amazonaws.com:amr': 'authenticated' },
      }).withSessionTags(),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [
        {
          Action: ['sts:AssumeRoleWithWebIdentity', 'sts:TagSession'],
          Condition: {
            'StringEquals': { 'cognito-identity.amazonaws.com:aud': 'asdf' },
            'ForAnyValue:StringLike': { 'cognito-identity.amazonaws.com:amr': 'authenticated' },
          },
          Effect: 'Allow',
          Principal: { Federated: 'cognito-identity.amazonaws.com' },
        },
      ],
    },
  });
});