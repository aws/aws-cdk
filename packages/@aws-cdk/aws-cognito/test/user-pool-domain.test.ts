import '@aws-cdk/assert/jest';
import { Certificate } from '@aws-cdk/aws-certificatemanager';
import { Stack } from '@aws-cdk/core';
import { UserPool, UserPoolDomain, UserPoolDomainType } from '../lib';

describe('User Pool Client', () => {
  test('custom domain name', () => {
    // GIVEN
    const stack = new Stack();
    const pool = new UserPool(stack, 'Pool');

    // WHEN
    const certificate = Certificate.fromCertificateArn(stack, 'cert',
      'arn:aws:acm:eu-west-1:0123456789:certificate/7ec3e4ac-808a-4649-b805-66ae02346ad8');
    new UserPoolDomain(stack, 'Domain', {
      userPool: pool,
      domain: UserPoolDomainType.customDomain({
        domainName: 'test-domain.example.com',
        certificate,
      }),
    });

    // THEN
    expect(stack).toHaveResource('AWS::Cognito::UserPoolDomain', {
      UserPoolId: stack.resolve(pool.userPoolId),
      Domain: 'test-domain.example.com',
      CustomDomainConfig: {
        CertificateArn: 'arn:aws:acm:eu-west-1:0123456789:certificate/7ec3e4ac-808a-4649-b805-66ae02346ad8'
      }
    });
  });

  test('cognito domain prefix', () => {
    // GIVEN
    const stack = new Stack();
    const pool = new UserPool(stack, 'Pool');

    // WHEN
    new UserPoolDomain(stack, 'Domain', {
      userPool: pool,
      domain: UserPoolDomainType.cognitoDomain({
        domainPrefix: 'cognito-domain-prefix'
      }),
    });

    // THEN
    expect(stack).toHaveResource('AWS::Cognito::UserPoolDomain', {
      UserPoolId: stack.resolve(pool.userPoolId),
      Domain: 'cognito-domain-prefix',
    });
  });

  test('fails when domainPrefix has characters outside the allowed charset', () => {
    expect(() => UserPoolDomainType.cognitoDomain({
      domainPrefix: 'domain.prefix'
    })).toThrow(/lowercase alphabets, numbers and hyphens/);
    expect(() => UserPoolDomainType.cognitoDomain({
      domainPrefix: 'Domain-Prefix'
    })).toThrow(/lowercase alphabets, numbers and hyphens/);
    expect(() => UserPoolDomainType.cognitoDomain({
      domainPrefix: 'dómäin-prefix'
    })).toThrow(/lowercase alphabets, numbers and hyphens/);
  });

  test('custom resource is added when cloudFrontDistribution method is called', () => {
    // GIVEN
    const stack = new Stack();
    const pool = new UserPool(stack, 'Pool');
    const domain = pool.addDomain('Domain', {
      domain: UserPoolDomainType.cognitoDomain({
        domainPrefix: 'cognito-domain-prefix',
      }),
    });

    // WHEN
    const cfDomainName = domain.cloudFrontDomainName;

    // THEN
    expect(stack.resolve(cfDomainName)).toEqual({
      'Fn::GetAtt': [
        'PoolDomainCloudFrontDomainName340BF87E',
        'DomainDescription.CloudFrontDistribution',
      ]
    });

    expect(stack).toHaveResource('Custom::UserPoolCloudFrontDomainName');
    expect(stack).toHaveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [{
          Action: 'cognito-idp:DescribeUserPoolDomain',
          Effect: 'Allow',
          Resource: '*',
        }],
        Version: '2012-10-17'
      }
    });
  });
});