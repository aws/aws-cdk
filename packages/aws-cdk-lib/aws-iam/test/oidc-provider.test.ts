import { Template } from '../../assertions';
import { App, Stack, Token } from '../../core';
import * as iam from '../lib';

const arnOfProvider = 'arn:aws:iam::1234567:oidc-provider/oidc.eks.us-east-1.amazonaws.com/id/someid';

describe('OpenIdConnectProvider resource', () => {

  test('minimal configuration (no clients and no thumbprint)', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new iam.OpenIdConnectProvider(stack, 'MyProvider', {
      url: 'https://openid-endpoint',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('Custom::AWSCDKOpenIdConnectProvider', {
      Url: 'https://openid-endpoint',
    });
  });

  test('"openIdConnectProviderArn" resolves to the ref', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const provider = new iam.OpenIdConnectProvider(stack, 'MyProvider', {
      url: 'https://openid-endpoint',
    });

    // THEN
    expect(stack.resolve(provider.openIdConnectProviderArn)).toStrictEqual({ Ref: 'MyProvider730BA1C8' });
  });

  test('static fromOpenIdConnectProviderArn can be used to import a provider', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const provider = iam.OpenIdConnectProvider.fromOpenIdConnectProviderArn(stack, 'MyProvider', arnOfProvider);

    // THEN
    expect(stack.resolve(provider.openIdConnectProviderArn)).toStrictEqual(arnOfProvider);
  });

  test('thumbprint list and client ids can be specified', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new iam.OpenIdConnectProvider(stack, 'MyProvider', {
      url: 'https://my-url',
      clientIds: ['client1', 'client2'],
      thumbprints: ['thumb1'],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('Custom::AWSCDKOpenIdConnectProvider', {
      Url: 'https://my-url',
      ClientIDList: ['client1', 'client2'],
      ThumbprintList: ['thumb1'],
    });
  });

});

describe('custom resource provider infrastructure', () => {

  test('two resources share the same cr provider', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'stack');

    // WHEN
    new iam.OpenIdConnectProvider(stack, 'Provider1', { url: 'provider1' });
    new iam.OpenIdConnectProvider(stack, 'Provider2', { url: 'provider2' });

    // THEN
    const template = app.synth().getStackArtifact(stack.artifactId).template;
    const resourceTypes = Object.values(template.Resources).map((r: any) => r.Type).sort();
    expect(resourceTypes).toStrictEqual([
      // custom resource perovider resources
      'AWS::IAM::Role',
      'AWS::Lambda::Function',

      // open id connect resources
      'Custom::AWSCDKOpenIdConnectProvider',
      'Custom::AWSCDKOpenIdConnectProvider',
    ]);
  });

  test('iam policy', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new iam.OpenIdConnectProvider(stack, 'Provider1', { url: 'provider1' });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      Policies: [
        {
          PolicyName: 'Inline',
          PolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Resource: '*',
                Action: [
                  'iam:CreateOpenIDConnectProvider',
                  'iam:DeleteOpenIDConnectProvider',
                  'iam:UpdateOpenIDConnectProviderThumbprint',
                  'iam:AddClientIDToOpenIDConnectProvider',
                  'iam:RemoveClientIDFromOpenIDConnectProvider',
                ],
              },
            ],
          },
        },
      ],
    });
  });
});

describe('OIDC issuer', () => {
  test('extract issuer properly in the new provider', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const provider = new iam.OpenIdConnectProvider(stack, 'MyProvider', {
      url: 'https://my-issuer',
    });

    // THEN
    expect(stack.resolve(provider.openIdConnectProviderIssuer)).toStrictEqual(
      { 'Fn::Select': [1, { 'Fn::Split': [':oidc-provider/', { Ref: 'MyProvider730BA1C8' }] }] },
    );
  });

  test('extract issuer properly in a literal imported provider', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const provider = iam.OpenIdConnectProvider.fromOpenIdConnectProviderArn(stack, 'MyProvider', arnOfProvider);

    // THEN
    expect(stack.resolve(provider.openIdConnectProviderIssuer)).toStrictEqual('oidc.eks.us-east-1.amazonaws.com/id/someid');
  });

  test('extract issuer properly in a Token imported provider', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const provider = iam.OpenIdConnectProvider.fromOpenIdConnectProviderArn(stack, 'MyProvider', Token.asString({ Ref: 'ARN' }));

    // THEN
    expect(stack.resolve(provider.openIdConnectProviderIssuer)).toStrictEqual({
      'Fn::Select': [1, { 'Fn::Split': [':oidc-provider/', { Ref: 'ARN' }] }],
    });
  });
});
