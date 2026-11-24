import { Match, Template } from '../../assertions';
import * as sso from '../../aws-sso';
import * as cdk from '../../core';
import * as cloudwatch from '../lib';

describe('Domain', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  test('minimal configuration', () => {
    new cloudwatch.Domain(stack, 'Domain', {
      domainName: 'observability',
      identityProviders: [cloudwatch.IdentityProvider.IAM],
    });

    Template.fromStack(stack).hasResource('AWS::CloudWatch::Domain', {
      Properties: Match.objectEquals({
        Name: 'observability',
        IdentityProviders: ['IAM'],
      }),
      DeletionPolicy: 'Retain',
      UpdateReplacePolicy: 'Retain',
    });
  });

  test('Identity Center instance from an ARN', () => {
    new cloudwatch.Domain(stack, 'Domain', {
      domainName: 'observability',
      identityProviders: [cloudwatch.IdentityProvider.IDC, cloudwatch.IdentityProvider.IAM],
      identityCenterInstance: cloudwatch.IdentityCenterInstance.fromInstanceArn('arn:aws:sso:::instance/ssoins-1a2b3c4d5e6f7a8b'),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Domain', {
      IdentityProviders: ['IDC', 'IAM'],
      IdentityProviderConfiguration: {
        IdentityCenterConfiguration: {
          IdentityCenterInstanceArn: 'arn:aws:sso:::instance/ssoins-1a2b3c4d5e6f7a8b',
        },
      },
    });
  });

  test('Identity Center instance from a CfnInstance', () => {
    const instance = new sso.CfnInstance(stack, 'Instance', { name: 'omni' });

    new cloudwatch.Domain(stack, 'Domain', {
      domainName: 'observability',
      identityProviders: [cloudwatch.IdentityProvider.IDC],
      identityCenterInstance: cloudwatch.IdentityCenterInstance.fromInstance(instance),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Domain', {
      IdentityProviderConfiguration: {
        IdentityCenterConfiguration: {
          IdentityCenterInstanceArn: { Ref: 'Instance' },
        },
      },
    });
  });

  test('IdentityProvider.of passes the value through', () => {
    const domain = new cloudwatch.Domain(stack, 'Domain', {
      domainName: 'observability',
      identityProviders: [cloudwatch.IdentityProvider.of('NEW_PROVIDER')],
    });

    const cfnDomain = domain.node.defaultChild as cloudwatch.CfnDomain;
    expect(cfnDomain.identityProviders).toEqual(['NEW_PROVIDER']);
  });

  test('tags', () => {
    new cloudwatch.Domain(stack, 'Domain', {
      domainName: 'observability',
      identityProviders: [cloudwatch.IdentityProvider.IAM],
      tags: { Team: 'observability' },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Domain', {
      Tags: [{ Key: 'Team', Value: 'observability' }],
    });
  });

  test('an empty tag map renders no tags', () => {
    new cloudwatch.Domain(stack, 'Domain', {
      domainName: 'observability',
      identityProviders: [cloudwatch.IdentityProvider.IAM],
      tags: {},
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Domain', {
      Tags: Match.absent(),
    });
  });

  test('Tags.of applies tags to the domain', () => {
    const domain = new cloudwatch.Domain(stack, 'Domain', {
      domainName: 'observability',
      identityProviders: [cloudwatch.IdentityProvider.IAM],
    });
    cdk.Tags.of(domain).add('Stage', 'test');

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Domain', {
      Tags: [{ Key: 'Stage', Value: 'test' }],
    });
  });

  test('removal policy', () => {
    new cloudwatch.Domain(stack, 'Domain', {
      domainName: 'observability',
      identityProviders: [cloudwatch.IdentityProvider.IAM],
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    Template.fromStack(stack).hasResource('AWS::CloudWatch::Domain', {
      DeletionPolicy: 'Delete',
      UpdateReplacePolicy: 'Delete',
    });
  });

  test('attributes', () => {
    const domain = new cloudwatch.Domain(stack, 'Domain', {
      domainName: 'observability',
      identityProviders: [cloudwatch.IdentityProvider.IAM],
    });

    expect(stack.resolve(domain.domainId)).toEqual({ 'Fn::GetAtt': ['Domain66AC69E0', 'DomainId'] });
    expect(stack.resolve(domain.domainArn)).toEqual({ 'Fn::GetAtt': ['Domain66AC69E0', 'Arn'] });
    expect(stack.resolve(domain.domainEndpointUrl)).toEqual({ 'Fn::GetAtt': ['Domain66AC69E0', 'DomainEndpointUrl'] });
    expect(stack.resolve(domain.domainRef.domainArn)).toEqual({ 'Fn::GetAtt': ['Domain66AC69E0', 'Arn'] });
  });

  describe('fromDomainArn', () => {
    test('parses the domain ID and environment from the ARN', () => {
      const domain = cloudwatch.Domain.fromDomainArn(stack, 'Imported', 'arn:aws:cloudwatch:us-west-2:123456789012:domain/d-abc456');

      expect(domain.domainId).toEqual('d-abc456');
      expect(domain.domainArn).toEqual('arn:aws:cloudwatch:us-west-2:123456789012:domain/d-abc456');
      expect(domain.domainRef.domainArn).toEqual('arn:aws:cloudwatch:us-west-2:123456789012:domain/d-abc456');
      expect(domain.domainEndpointUrl).toBeUndefined();
      expect(domain.env.account).toEqual('123456789012');
      expect(domain.env.region).toEqual('us-west-2');
    });

    test('accepts a token ARN', () => {
      const arn = new cdk.CfnParameter(stack, 'DomainArn').valueAsString;
      const domain = cloudwatch.Domain.fromDomainArn(stack, 'Imported', arn);

      expect(stack.resolve(domain.domainId)).toEqual({
        'Fn::Select': [1, { 'Fn::Split': ['/', { 'Fn::Select': [5, { 'Fn::Split': [':', { Ref: 'DomainArn' }] }] }] }],
      });
    });

    test.each([
      'arn:aws:cloudwatch:us-east-1:123456789012:alarm:my-alarm',
      'arn:aws:cloudwatch:us-east-1:123456789012:domain',
      'arn:aws:logs:us-east-1:123456789012:domain/d-abc456',
    ])('fails for an ARN that is not a domain ARN: %s', (arn) => {
      expect(() => cloudwatch.Domain.fromDomainArn(stack, 'Imported', arn)).toThrow(/expected a domain ARN/);
    });
  });

  describe('fromDomainId', () => {
    test('exposes the domain ID', () => {
      const domain = cloudwatch.Domain.fromDomainId(stack, 'Imported', 'd-abc456');

      expect(domain.domainId).toEqual('d-abc456');
      expect(domain.domainEndpointUrl).toBeUndefined();
    });

    test('fails when the ARN is read', () => {
      const domain = cloudwatch.Domain.fromDomainId(stack, 'Imported', 'd-abc456');

      expect(() => domain.domainArn).toThrow(/the ARN of domain "d-abc456" is not known/);
      expect(() => domain.domainRef).toThrow(/the ARN of domain "d-abc456" is not known/);
    });
  });
});
