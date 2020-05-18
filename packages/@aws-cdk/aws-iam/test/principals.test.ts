import '@aws-cdk/assert/jest';
import { App, CfnOutput, Stack } from '@aws-cdk/core';
import * as iam from '../lib';

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

  expect(first).toMatchTemplate({
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
        Value: { 'Fn::GetAtt': [ 'Role1ABCC5F0', 'Arn' ] },
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